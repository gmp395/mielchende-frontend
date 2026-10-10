/*
 * Tests de los guards del router: comprobamos a dónde
 * acaba cada tipo de usuaria al intentar entrar en cada ruta.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

/* JWT falso con el payload indicado (misma idea que en authStore.spec.js) */
function makeToken(payload) {
  const encode = (object) =>
    btoa(JSON.stringify(object)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${encode({ alg: 'HS512' })}.${encode(payload)}.firma`
}

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600

/* Simula una sesión iniciada con el rol indicado */
function loginAs(role) {
  const store = useAuthStore()
  store.token = makeToken({ sub: 'test@test.com', roles: [role], exp: inOneHour() })
}

describe('guards del router', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    /* Partimos siempre del inicio */
    await router.push('/')
  })

  it('una visitante que entra en Mis solicitudes va al login con la ruta de vuelta', async () => {
    await router.push('/mis-solicitudes')

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/mis-solicitudes')
  })

  it('una visitante que entra en el panel va al login', async () => {
    await router.push('/admin')

    expect(router.currentRoute.value.name).toBe('login')
  })

  it('un cliente que entra en el panel va al inicio', async () => {
    loginAs('ROLE_USER')

    await router.push('/admin')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('el administrador puede entrar en el panel', async () => {
    loginAs('ROLE_ADMIN')

    await router.push('/admin')

    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('un cliente con sesión puede entrar en Mis solicitudes', async () => {
    loginAs('ROLE_USER')

    await router.push('/mis-solicitudes')

    expect(router.currentRoute.value.name).toBe('my-orders')
  })

  it('con sesión iniciada, el login redirige al inicio', async () => {
    loginAs('ROLE_USER')

    await router.push('/login')

    expect(router.currentRoute.value.name).toBe('home')
  })
})