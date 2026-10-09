/*
 * Test de integración del layout: monta App con sus hijos reales
 * (cabecera, vista activa y pie) y el router de la aplicación.
 */
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App (layout)', () => {
  it('muestra la cabecera, la vista de la ruta activa y el pie', async () => {
    /* Navegamos a la ruta de inicio y esperamos a que el router esté listo */
    router.push('/')
    await router.isReady()

    /* mount (no shallowMount): renderiza los componentes hijos reales */
    const wrapper = mount(App, { global: { plugins: [router] } })

    /* Espera a que se resuelva la carga diferida (lazy loading) de la vista */
    await flushPromises()

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main h1').text()).toBe('Inicio')
    expect(wrapper.find('footer').exists()).toBe(true)
  })
})