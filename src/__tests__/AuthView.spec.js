/*
 * Tests de la vista de acceso (pestañas, validación, login y registro).
 * Se monta con el router real y Pinia; el repositorio se sustituye por un mock,
 * así no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AuthView from '@/views/AuthView.vue'
import router from '@/router'
import { authRepository } from '@/api/authRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/authRepository', () => ({
  authRepository: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

/* Token válido de cliente, para simular un login correcto */
const userToken = () => makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })

let pinia

/* Navega a la ruta indicada y monta la vista */
async function mountAt(path) {
  await router.push(path)
  await router.isReady()
  const wrapper = mount(AuthView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(async () => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  await router.push('/')
})

describe('AuthView', () => {
  it('en /login muestra la pestaña de inicio de sesión', async () => {
    const wrapper = await mountAt('/login')

    expect(wrapper.find('h1').text()).toBe('Iniciar sesión')
    expect(wrapper.find('#login-email').exists()).toBe(true)
    expect(wrapper.find('#register-name').exists()).toBe(false)
  })

  it('en /registro muestra la pestaña de crear cuenta', async () => {
    const wrapper = await mountAt('/registro')

    expect(wrapper.find('h1').text()).toBe('Crear cuenta')
    expect(wrapper.find('#register-name').exists()).toBe(true)
  })

  it('no envía el login si faltan datos y muestra los errores', async () => {
    const wrapper = await mountAt('/login')

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Introduce tu email.')
    expect(wrapper.text()).toContain('Introduce tu contraseña.')
    expect(authRepository.login).not.toHaveBeenCalled()
  })

  it('tras un login correcto vuelve a la ruta indicada en redirect', async () => {
    authRepository.login.mockResolvedValue({ token: userToken() })
    const wrapper = await mountAt('/login?redirect=/mis-solicitudes')

    await wrapper.find('#login-email').setValue('ana@test.com')
    await wrapper.find('#login-password').setValue('secreta123')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('my-orders')
  })

  it('con credenciales incorrectas muestra un mensaje genérico', async () => {
    authRepository.login.mockRejectedValue(new ApiError(401, 'Unauthorized'))
    const wrapper = await mountAt('/login')

    await wrapper.find('#login-email').setValue('ana@test.com')
    await wrapper.find('#login-password').setValue('incorrecta')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Email o contraseña incorrectos.')
  })

  it('en el registro exige una contraseña de al menos 8 caracteres', async () => {
    const wrapper = await mountAt('/registro')

    await wrapper.find('#register-name').setValue('Ana')
    await wrapper.find('#register-email').setValue('ana@test.com')
    await wrapper.find('#register-password').setValue('corta')
    await wrapper.find('#register-password-confirm').setValue('corta')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('La contraseña debe tener al menos 8 caracteres.')
    expect(authRepository.register).not.toHaveBeenCalled()
  })

  it('tras registrarse inicia sesión y lleva al inicio', async () => {
    authRepository.register.mockResolvedValue({ id: 1 })
    authRepository.login.mockResolvedValue({ token: userToken() })
    const wrapper = await mountAt('/registro')

    await wrapper.find('#register-name').setValue('Ana')
    await wrapper.find('#register-email').setValue('ana@test.com')
    await wrapper.find('#register-password').setValue('secreta123')
    await wrapper.find('#register-password-confirm').setValue('secreta123')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(authRepository.register).toHaveBeenCalledWith('Ana', 'ana@test.com', 'secreta123')
    expect(router.currentRoute.value.name).toBe('home')
  })
})