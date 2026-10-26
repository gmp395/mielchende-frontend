/*
 * Tests del marco del panel de administración (AdminView):
 * título, pestañas de navegación, enlaces de cada pestaña y pestaña activa.
 * El RouterView se sustituye por un stub: aquí no se prueba la sección hija,
 * que ya tiene sus propios tests, sino el marco que la rodea.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminView from '@/views/AdminView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { makeToken, inOneHour } from './helpers/makeToken'

/* Pestañas esperadas, en el mismo orden en que deben aparecer */
const expectedTabs = [
  { name: 'admin-orders', label: 'Solicitudes' },
  { name: 'admin-products', label: 'Productos' },
  { name: 'admin-content', label: 'Contenidos' },
  { name: 'admin-messages', label: 'Mensajes' },
]

let pinia
let wrapper

/* Las rutas /admin exigen rol de administrador: sin esto, el guard redirigiría al login */
function loginAsAdmin() {
  useAuthStore().token = makeToken({
    sub: 'admin@test.com',
    roles: ['ROLE_ADMIN'],
    exp: inOneHour(),
  })
}

/*
 * Navega a una sección del panel y monta el marco.
 * stubs: { RouterView: true } evita pintar la vista hija y llamar a su repositorio.
 */
async function mountAdminView(path = '/admin/mensajes') {
  await router.push(path)
  await router.isReady()
  wrapper = mount(AdminView, {
    global: {
      plugins: [pinia, router],
      stubs: { RouterView: true },
    },
  })
  await flushPromises()
  return wrapper
}

/* Devuelve los enlaces de la navegación del panel */
function tabLinks() {
  return wrapper.findAll('nav[aria-label="Secciones del panel"] a')
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  loginAsAdmin()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('AdminView', () => {
  it('muestra el título y las cuatro pestañas en orden dentro de una navegación accesible', async () => {
    await mountAdminView()

    expect(wrapper.find('h1').text()).toBe('Panel de administración')
    expect(tabLinks().map((link) => link.text())).toEqual(
      expectedTabs.map((tab) => tab.label),
    )
  })

  it('enlaza cada pestaña con la ruta de su sección', async () => {
    await mountAdminView()

    /* La URL esperada se pide al router, así el test no depende de rutas escritas a mano */
    const hrefs = tabLinks().map((link) => link.attributes('href'))
    expect(hrefs).toEqual(
      expectedTabs.map((tab) => router.resolve({ name: tab.name }).href),
    )
  })

  it('marca solo la pestaña activa con aria-current="page"', async () => {
    await mountAdminView('/admin/mensajes')

    const current = tabLinks().filter((link) => link.attributes('aria-current') === 'page')
    expect(current).toHaveLength(1)
    expect(current[0].text()).toBe('Mensajes')
  })

  it('reserva el hueco donde se pinta la sección hija', async () => {
    await mountAdminView()

    /* El stub ocupa el lugar del RouterView: confirma que el marco lo incluye */
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })
})