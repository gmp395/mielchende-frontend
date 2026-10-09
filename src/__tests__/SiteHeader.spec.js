/*
 * Tests de la cabecera: comportamiento del menú móvil.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SiteHeader from '../components/layout/SiteHeader.vue'
import router from '../router'

/* Guardamos el componente montado para poder desmontarlo después de cada test */
let wrapper

/*
 * Monta la cabecera con el router real, partiendo siempre de la ruta de inicio.
 * attachTo: document.body inserta el componente en el documento simulado (jsdom).
 * Es necesario para que isVisible() funcione bien: sin él, el elemento está
 * "suelto", fuera del documento, y la comprobación de visibilidad no es fiable.
 */
async function mountHeader() {
  await router.push('/')
  await router.isReady()
  wrapper = mount(SiteHeader, { global: { plugins: [router] }, attachTo: document.body })
  return wrapper
}

/* Limpieza: desmonta la cabecera para que no se acumule en el documento entre tests */
afterEach(() => {
  wrapper?.unmount()
})

describe('SiteHeader', () => {
  it('abre y cierra el menú móvil al pulsar el botón', async () => {
    await mountHeader()
    const button = wrapper.find('button[aria-controls="mobile-menu"]')
    const menu = wrapper.find('#mobile-menu')

    /* Estado inicial: menú cerrado */
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(menu.isVisible()).toBe(false)

    /* Primer clic: se abre */
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(menu.isVisible()).toBe(true)

    /* Segundo clic: se cierra */
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
    expect(menu.isVisible()).toBe(false)
  })

  it('cierra el menú móvil automáticamente al cambiar de ruta', async () => {
    await mountHeader()
    const button = wrapper.find('button[aria-controls="mobile-menu"]')

    /* Abrimos el menú */
    await button.trigger('click')
    expect(wrapper.find('#mobile-menu').isVisible()).toBe(true)

    /* Navegamos a otra ruta: el watch debe cerrar el menú */
    await router.push('/catalogo')
    await flushPromises()

    expect(wrapper.find('#mobile-menu').isVisible()).toBe(false)
  })
})