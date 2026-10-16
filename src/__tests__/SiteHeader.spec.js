/*
 * Tests de la cabecera: menú móvil y comportamiento según la sesión.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SiteHeader from '../components/layout/SiteHeader.vue'
import router from '../router'
import { useAuthStore } from '@/stores/auth'
import { makeToken, inOneHour } from './helpers/makeToken'

/* Guardamos el componente montado para poder desmontarlo después de cada test */
let wrapper

/* Pinia nueva en cada test: el guard del router usa el store de autenticación */
let pinia

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
})

/* Simula una sesión iniciada con el rol indicado */
function loginAs(role) {
  const store = useAuthStore()
  store.token = makeToken({ sub: 'test@test.com', roles: [role], exp: inOneHour() })
}

/*
 * Monta la cabecera con el router real, partiendo de la ruta indicada (por defecto, el inicio).
 * attachTo: document.body inserta el componente en el documento simulado (jsdom).
 * Es necesario para que isVisible() funcione bien: sin él, el elemento está
 * "suelto", fuera del documento, y la comprobación de visibilidad no es fiable.
 */
async function mountHeader(path = '/') {
  await router.push(path)
  await router.isReady()
  wrapper = mount(SiteHeader, {
    global: { plugins: [pinia, router] },
    attachTo: document.body,
  })
  return wrapper
}

/*
 * Limpieza: desmonta la cabecera para que no se acumule en el documento entre tests
 * y para que el router no siga usando la Pinia de un test anterior.
 */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
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

  it('sin sesión muestra el enlace de acceso y no el menú de cuenta', async () => {
    await mountHeader()

    expect(wrapper.find('a[aria-label="Acceder"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Mi cuenta"]').exists()).toBe(false)
  })

  it('con sesión de cliente, el menú de cuenta enlaza a Mis solicitudes', async () => {
    loginAs('ROLE_USER')
    await mountHeader()

    await wrapper.find('button[aria-label="Mi cuenta"]').trigger('click')
    const accountMenu = wrapper.find('#account-menu')

    expect(accountMenu.isVisible()).toBe(true)
    expect(accountMenu.text()).toContain('test@test.com')
    expect(accountMenu.text()).toContain('Mis solicitudes')
    expect(accountMenu.text()).toContain('Cerrar sesión')
  })

  it('con sesión de administrador, el menú de cuenta enlaza al panel', async () => {
    loginAs('ROLE_ADMIN')
    await mountHeader()

    await wrapper.find('button[aria-label="Mi cuenta"]').trigger('click')

    expect(wrapper.find('#account-menu').text()).toContain('Panel de administración')
  })

  it('al cerrar sesión borra la sesión y lleva al inicio', async () => {
    loginAs('ROLE_USER')
    await mountHeader('/mis-solicitudes')

    await wrapper.find('button[aria-label="Mi cuenta"]').trigger('click')
    const logoutButton = wrapper
      .findAll('#account-menu button')
      .find((button) => button.text().includes('Cerrar sesión'))
    await logoutButton.trigger('click')

    await vi.waitFor(() => {
      expect(router.currentRoute.value.name).toBe('home')
    })
    expect(useAuthStore().isAuthenticated).toBe(false)
    expect(wrapper.find('a[aria-label="Acceder"]').exists()).toBe(true)
  })
})