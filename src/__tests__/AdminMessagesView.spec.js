/*
 * Tests de la vista Mensajes del panel de administración:
 * lista de mensajes, lista vacía y error de carga.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminMessagesView from '@/views/AdminMessagesView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { adminContactRepository } from '@/api/adminContactRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/adminContactRepository', () => ({
  adminContactRepository: { getAll: vi.fn() },
}))

/* Mensaje de ejemplo con la misma forma que los del backend */
const message = {
  id: 1,
  name: 'Ana',
  email: 'ana@test.com',
  message: '¿Tenéis miel de castaño?',
  createdAt: '2026-10-23T10:00:00',
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

async function mountAdminMessages() {
  await router.push('/admin/mensajes')
  await router.isReady()
  wrapper = mount(AdminMessagesView, { global: { plugins: [pinia, router] } })
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

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('AdminMessagesView', () => {
  it('muestra cada mensaje con su autor, fecha y texto', async () => {
    adminContactRepository.getAll.mockResolvedValue([message])
    await mountAdminMessages()

    const text = wrapper.text()
    expect(text).toContain('Ana')
    expect(text).toContain('23 de octubre de 2026')
    expect(text).toContain('¿Tenéis miel de castaño?')
  })

  it('ofrece responder por correo a quien escribió', async () => {
    adminContactRepository.getAll.mockResolvedValue([message])
    await mountAdminMessages()

    const reply = wrapper.find('a[href="mailto:ana@test.com"]')
    expect(reply.exists()).toBe(true)
    expect(reply.text()).toContain('Responder')
  })

  it('avisa cuando todavía no hay mensajes', async () => {
    adminContactRepository.getAll.mockResolvedValue([])
    await mountAdminMessages()

    expect(wrapper.text()).toContain('Todavía no hay mensajes.')
  })

  it('muestra el error de carga y permite reintentar', async () => {
    adminContactRepository.getAll.mockRejectedValueOnce(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )
    adminContactRepository.getAll.mockResolvedValueOnce([message])
    await mountAdminMessages()

    expect(wrapper.find('[role="alert"]').text()).toContain('No se ha podido conectar')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('¿Tenéis miel de castaño?')
  })
})