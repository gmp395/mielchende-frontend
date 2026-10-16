import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import router from '@/router'

/*
 * Pruebas de las redirecciones del router.
 * Navegamos con el router real y comprobamos a qué ruta llega.
 */
describe('redirecciones del router', () => {
  beforeEach(() => {
    /*
     * Los guards del router consultan el store de autenticación,
     * así que necesitan una Pinia activa y localStorage limpio.
     */
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('redirige /recursos a Actualidad apícola', async () => {
    await router.push('/recursos')

    expect(router.currentRoute.value.name).toBe('resources-news')
  })
})