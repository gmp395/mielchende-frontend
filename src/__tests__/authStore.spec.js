/*
 * Tests unitarios del store de autenticación.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authRepository } from '@/api/authRepository'

/* Sustituimos el módulo entero del repositorio por funciones mock */
vi.mock('@/api/authRepository', () => ({
  authRepository: {
    login: vi.fn(),
    register: vi.fn(),
  },
}))

/*
 * Fabrica un JWT falso (cabecera.payload.firma) con el payload indicado.
 * La firma no importa: el frontend solo decodifica, no verifica.
 */
function makeToken(payload) {
  const encode = (object) =>
    btoa(JSON.stringify(object)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${encode({ alg: 'HS512' })}.${encode(payload)}.firma`
}

/* Caducidad dentro de una hora o hace una hora, en segundos */
const inOneHour = () => Math.floor(Date.now() / 1000) + 3600
const oneHourAgo = () => Math.floor(Date.now() / 1000) - 3600

describe('auth store', () => {
  beforeEach(() => {
    /* Pinia nueva y localStorage limpio en cada test */
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('al iniciar sesión guarda el token y expone email y rol de clienta', async () => {
    const token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })
    authRepository.login.mockResolvedValue({ token })
    const store = useAuthStore()

    await store.login('ana@test.com', 'secreta')

    expect(store.isAuthenticated).toBe(true)
    expect(store.email).toBe('ana@test.com')
    expect(store.isAdmin).toBe(false)
    expect(localStorage.getItem('mielchende_token')).toBe(token)
  })

  it('reconoce a la administradora por el rol ROLE_ADMIN', async () => {
    const token = makeToken({ sub: 'admin@test.com', roles: ['ROLE_ADMIN'], exp: inOneHour() })
    authRepository.login.mockResolvedValue({ token })
    const store = useAuthStore()

    await store.login('admin@test.com', 'secreta')

    expect(store.isAdmin).toBe(true)
  })

  it('no considera autenticada a una sesión con el token caducado', () => {
    const token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: oneHourAgo() })
    localStorage.setItem('mielchende_token', token)

    /* El store lee el token de localStorage al crearse */
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.isAdmin).toBe(false)
  })

  it('al cerrar sesión borra el token del store y de localStorage', async () => {
    const token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })
    authRepository.login.mockResolvedValue({ token })
    const store = useAuthStore()
    await store.login('ana@test.com', 'secreta')

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('mielchende_token')).toBeNull()
  })

  it('al registrarse inicia sesión automáticamente', async () => {
    const token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })
    authRepository.register.mockResolvedValue({ id: 1 })
    authRepository.login.mockResolvedValue({ token })
    const store = useAuthStore()

    await store.register('Ana', 'ana@test.com', 'secreta')

    expect(authRepository.register).toHaveBeenCalledWith('Ana', 'ana@test.com', 'secreta')
    expect(authRepository.login).toHaveBeenCalledWith('ana@test.com', 'secreta')
    expect(store.isAuthenticated).toBe(true)
  })

  it('si el login falla, propaga el error y no guarda ningún token', async () => {
    authRepository.login.mockRejectedValue(new Error('Credenciales incorrectas'))
    const store = useAuthStore()

    await expect(store.login('ana@test.com', 'mal')).rejects.toThrow('Credenciales incorrectas')
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
  })
})