/*
 * Tests del formulario de solicitud de pedido.
 * Los repositorios se sustituyen por mocks: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import OrderRequestView from '@/views/OrderRequestView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { productRepository } from '@/api/productRepository'
import { orderRepository } from '@/api/orderRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/productRepository', () => ({
  productRepository: { getAll: vi.fn(), getById: vi.fn() },
}))

vi.mock('@/api/orderRepository', () => ({
  orderRepository: { create: vi.fn(), getMine: vi.fn() },
}))

/* Dos productos disponibles y uno agotado */
const sampleProducts = [
  { id: 1, name: 'Miel de castaño', format: '500 g', price: 8, status: 'AVAILABLE' },
  { id: 3, name: 'Miel milflores', format: '500 g', price: 7, status: 'AVAILABLE' },
  { id: 9, name: 'Reina fecundada', format: 'Unidad', price: 30, status: 'SOLD_OUT' },
]

let pinia
let wrapper

/* La ruta /solicitud requiere sesión: simulamos un cliente con sesión iniciada */
function loginAsUser() {
  useAuthStore().token = makeToken({ sub: 'ana@test.com', roles: ['ROLE_USER'], exp: inOneHour() })
}

/* Navega a la solicitud (con la query indicada) y monta la vista */
async function mountOrderRequest(path = '/solicitud?producto=3') {
  await router.push(path)
  await router.isReady()
  wrapper = mount(OrderRequestView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

/* Busca un botón por su texto visible */
function findButton(text) {
  return wrapper.findAll('button').find((button) => button.text().includes(text))
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  productRepository.getAll.mockResolvedValue(sampleProducts)
  loginAsUser()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('OrderRequestView', () => {
  it('preselecciona el producto indicado en la URL', async () => {
    await mountOrderRequest('/solicitud?producto=3')

    expect(wrapper.find('#order-line-0-product').element.value).toBe('3')
  })

  it('solo ofrece los productos disponibles', async () => {
    await mountOrderRequest()

    const options = wrapper.findAll('#order-line-0-product option')
    /* La opción "Elige un producto" + los 2 disponibles */
    expect(options).toHaveLength(3)
    expect(wrapper.find('#order-line-0-product').text()).not.toContain('Reina fecundada')
  })

  it('permite añadir y quitar líneas sin repetir productos', async () => {
    await mountOrderRequest('/solicitud?producto=3')

    await findButton('Añadir otro producto').trigger('click')
    expect(wrapper.findAll('fieldset')).toHaveLength(2)

    /* La segunda línea no ofrece el producto 3, ya elegido en la primera */
    const secondLineText = wrapper.find('#order-line-1-product').text()
    expect(secondLineText).toContain('Miel de castaño')
    expect(secondLineText).not.toContain('Miel milflores')

    await wrapper.find('button[aria-label="Quitar el producto 2"]').trigger('click')
    expect(wrapper.findAll('fieldset')).toHaveLength(1)
  })

  it('no envía la solicitud si la cantidad no es válida', async () => {
    await mountOrderRequest()

    await wrapper.find('#order-line-0-quantity').setValue('0')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Indica una cantidad de 1 o más.')
    expect(orderRepository.create).not.toHaveBeenCalled()
  })

  it('envía la solicitud con el formato de la API y muestra la confirmación', async () => {
    orderRepository.create.mockResolvedValue({ id: 1 })
    await mountOrderRequest('/solicitud?producto=3')

    await wrapper.find('#order-line-0-quantity').setValue('2')
    await wrapper.find('#order-phone').setValue('600 000 000')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(orderRepository.create).toHaveBeenCalledWith({
      items: [{ productId: 3, quantity: 2 }],
      phone: '600 000 000',
      comments: null,
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('si un producto se agota al enviar, avisa y recarga la lista', async () => {
    orderRepository.create.mockRejectedValue(new ApiError(409, 'Product sold out'))
    await mountOrderRequest('/solicitud?producto=3')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain('se acaba de agotar')
    expect(productRepository.getAll).toHaveBeenCalledTimes(2)
  })
})