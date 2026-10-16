/*
 * Tests del formulario de artículo del panel: validación,
 * alta como borrador, edición y artículo inexistente.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminArticleFormView from '@/views/AdminArticleFormView.vue'
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

/* Artículo de ejemplo con la misma forma que los del backend */
const article = {
  id: 4,
  title: 'Llega la cosecha',
  summary: 'Este año se adelanta.',
  body: 'Primer párrafo.\n\nSegundo párrafo.',
  imageUrl: null,
  status: 'PUBLISHED',
  createdAt: '2026-10-01T10:00:00',
  publishedAt: '2026-10-02T10:00:00',
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

async function mountForm(path) {
  await router.push(path)
  await router.isReady()
  wrapper = mount(AdminArticleFormView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  loginAsAdmin()
})

/* Desmontamos y restauramos los spies para no dejar el router modificado */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
})

describe('AdminArticleFormView', () => {
  it('al crear, no envía nada si faltan datos y muestra los errores', async () => {
    await mountForm('/admin/contenidos/nuevo')

    await wrapper.find('form').trigger('submit')

    const text = wrapper.text()
    expect(text).toContain('Introduce el título.')
    expect(text).toContain('Introduce un resumen.')
    expect(text).toContain('Introduce el texto del artículo.')
    expect(adminArticleRepository.create).not.toHaveBeenCalled()
  })

  it('no envía un resumen de más de 500 caracteres', async () => {
    await mountForm('/admin/contenidos/nuevo')

    await wrapper.find('#article-title').setValue('Título')
    await wrapper.find('#article-summary').setValue('a'.repeat(501))
    await wrapper.find('#article-body').setValue('Texto')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Como máximo 500 caracteres.')
    expect(adminArticleRepository.create).not.toHaveBeenCalled()
  })

  it('al crear, envía el DTO sin estado y vuelve a la lista', async () => {
    adminArticleRepository.create.mockResolvedValue({ ...article, id: 9, status: 'DRAFT' })
    await mountForm('/admin/contenidos/nuevo')
    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('#article-title').setValue('Llega la cosecha')
    await wrapper.find('#article-summary').setValue('Este año se adelanta.')
    await wrapper.find('#article-body').setValue('Primer párrafo.\n\nSegundo párrafo.')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(adminArticleRepository.create).toHaveBeenCalledWith({
      title: 'Llega la cosecha',
      summary: 'Este año se adelanta.',
      body: 'Primer párrafo.\n\nSegundo párrafo.',
      imageUrl: null,
    })
    expect(pushSpy).toHaveBeenCalledWith({ name: 'admin-content' })
  })

  it('al editar, rellena el formulario con el artículo y guarda los cambios', async () => {
    adminArticleRepository.getById.mockResolvedValue(article)
    adminArticleRepository.update.mockResolvedValue(article)
    await mountForm('/admin/contenidos/4/editar')

    expect(adminArticleRepository.getById).toHaveBeenCalledWith('4')
    expect(wrapper.find('#article-title').element.value).toBe('Llega la cosecha')

    await wrapper.find('#article-title').setValue('Título corregido')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    /* El id llega de la URL, por eso es texto */
    expect(adminArticleRepository.update).toHaveBeenCalledWith(
      '4',
      expect.objectContaining({ title: 'Título corregido' }),
    )
  })

  it('si el artículo no existe, lo indica en lugar de mostrar el formulario', async () => {
    adminArticleRepository.getById.mockRejectedValue(new ApiError(404, 'Artículo no encontrado'))
    await mountForm('/admin/contenidos/99/editar')

    expect(wrapper.find('[role="alert"]').text()).toBe('Este artículo no existe.')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})