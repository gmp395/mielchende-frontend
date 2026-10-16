/*
 * Tests de la vista Contenidos del panel de administración:
 * lista con borradores, publicar, despublicar, lista vacía y error de carga.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminArticlesView from '@/views/AdminArticlesView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { adminArticleRepository } from '@/api/adminArticleRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/adminArticleRepository', () => ({
  adminArticleRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
  },
}))

/* Artículos de ejemplo con la misma forma que los del backend */
const draft = {
  id: 1,
  title: 'Llega la cosecha',
  summary: 'Resumen',
  body: 'Texto',
  imageUrl: null,
  status: 'DRAFT',
  createdAt: '2026-10-14T10:00:00',
  publishedAt: null,
}
const published = {
  ...draft,
  id: 2,
  title: 'Feria de Lugo',
  status: 'PUBLISHED',
  publishedAt: '2026-10-10T09:00:00',
}

let pinia
let wrapper

function loginAsAdmin() {
  useAuthStore().token = makeToken({
    sub: 'admin@test.com',
    roles: ['ROLE_ADMIN'],
    exp: inOneHour(),
  })
}

async function mountAdminArticles() {
  await router.push('/admin/contenidos')
  await router.isReady()
  wrapper = mount(AdminArticlesView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

/* Botón de publicar o despublicar del artículo indicado */
function actionButton(label, article) {
  return wrapper.find(`[aria-label="${label} «${article.title}»"]`)
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  loginAsAdmin()
  adminArticleRepository.getAll.mockResolvedValue([draft, published])
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('AdminArticlesView', () => {
  it('muestra borradores y publicados con su estado y fecha', async () => {
    await mountAdminArticles()

    const text = wrapper.text()
    expect(text).toContain('Llega la cosecha')
    expect(text).toContain('Borrador')
    expect(text).toContain('Creado el 14 de octubre de 2026')
    expect(text).toContain('Publicado el 10 de octubre de 2026')
  })

  it('publica un borrador y lo confirma', async () => {
    adminArticleRepository.updateStatus.mockResolvedValue({
      ...draft,
      status: 'PUBLISHED',
      publishedAt: '2026-10-15T08:00:00',
    })
    await mountAdminArticles()

    await actionButton('Publicar', draft).trigger('click')
    await flushPromises()

    expect(adminArticleRepository.updateStatus).toHaveBeenCalledWith(1, 'PUBLISHED')
    expect(wrapper.find('[role="status"]').text()).toBe('«Llega la cosecha»: Publicado.')
    /* El botón de esa fila ya ofrece la acción contraria */
    expect(actionButton('Despublicar', draft).exists()).toBe(true)
  })

  it('despublica un artículo publicado', async () => {
    adminArticleRepository.updateStatus.mockResolvedValue({
      ...published,
      status: 'DRAFT',
      publishedAt: null,
    })
    await mountAdminArticles()

    await actionButton('Despublicar', published).trigger('click')
    await flushPromises()

    expect(adminArticleRepository.updateStatus).toHaveBeenCalledWith(2, 'DRAFT')
    expect(wrapper.find('[role="status"]').text()).toBe('«Feria de Lugo»: Borrador.')
  })

  it('si no hay artículos, lo indica', async () => {
    adminArticleRepository.getAll.mockResolvedValue([])
    await mountAdminArticles()

    expect(wrapper.text()).toContain('Todavía no hay artículos')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('si falla la carga, muestra el error y permite reintentar', async () => {
    adminArticleRepository.getAll.mockRejectedValueOnce(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )
    await mountAdminArticles()

    expect(wrapper.find('[role="alert"]').text()).toContain('No se ha podido conectar')

    await wrapper.find('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(adminArticleRepository.getAll).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Llega la cosecha')
  })
})