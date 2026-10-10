/*
 * Tests de la vista Mis solicitudes: lista, estado, vacío y error.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyOrdersView from '@/views/MyOrdersView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { orderRepository } from '@/api/orderRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/orderRepository', () => ({
  orderRepository: { create: vi.fn(), getMine: vi.fn() },
}))

/* Solicitud de ejemplo con la misma forma que las del backend */
const sampleOrder = {
  id: 7,
  customerName: 'Ana',
  customerEmail: 'ana@test.com',
  phone: '600 000 000',
  comments: 'Recogeré en Cospeito',
  status: 'CONFIRMED',
  createdAt: '2026-10-10T19:05:12',
  items: [
    { productId: 3, productName: 'Miel milflores', productFormat: '500 g', quantity: 2 },
    { productId: 6, productName: 'Propóleo', productFormat: 'Unidad', quantity: 1 },
  ],
}

let pinia
let wrapper

/* La ruta requiere sesión: simulamos un cliente con sesión iniciada */
function loginAsUser() {
  useAuthStore().token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })
}

/* Navega a Mis solicitudes y monta la vista */
async function mountMyOrders() {
  await router.push('/mis-solicitudes')
  await router.isReady()
  wrapper = mount(MyOrdersView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  loginAsUser()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('MyOrdersView', () => {
  it('muestra cada solicitud con fecha, productos, estado y datos de contacto', async () => {
    orderRepository.getMine.mockResolvedValue([sampleOrder])

    await mountMyOrders()

    const text = wrapper.text()
    expect(text).toContain('Solicitud n.º 7')
    expect(text).toContain('10 de octubre de 2026')
    expect(text).toContain('Miel milflores')
    expect(text).toContain('× 2')
    expect(text).toContain('Hemos confirmado tu solicitud')
    expect(text).toContain('Recogeré en Cospeito')
    expect(wrapper.find('[aria-current="step"]').text()).toContain('Confirmado')
  })

  it('si no hay solicitudes invita a ver el catálogo', async () => {
    orderRepository.getMine.mockResolvedValue([])

    await mountMyOrders()

    expect(wrapper.text()).toContain('Todavía no has enviado ninguna solicitud.')
    expect(wrapper.find('a[href="/catalogo"]').exists()).toBe(true)
  })

  it('si falla la carga muestra el error', async () => {
    orderRepository.getMine.mockRejectedValue(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )

    await mountMyOrders()

    expect(wrapper.find('[role="alert"]').text()).toContain('No se ha podido conectar')
  })
})