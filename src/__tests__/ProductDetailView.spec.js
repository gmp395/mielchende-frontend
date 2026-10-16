/*
 * Tests de la ficha de producto: datos, enlace a la solicitud,
 * producto agotado y producto no encontrado.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductDetailView from '@/views/ProductDetailView.vue'
import router from '@/router'
import { productRepository } from '@/api/productRepository'
import { ApiError } from '@/api/httpClient'

vi.mock('@/api/productRepository', () => ({
  productRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}))

/* Producto de ejemplo con la misma forma que los del backend */
const swarm = {
  id: 8,
  name: 'Enjambre',
  description: 'Enjambre de abejas.',
  format: 'Unidad',
  price: 120,
  imageUrl: null,
  seasonInfo: 'Consultar disponibilidad en temporada',
  status: 'AVAILABLE',
}

let pinia
let wrapper

/* Monta la ficha del producto con el id indicado y espera a que se cargue */
async function mountDetail(id) {
  await router.push(`/catalogo/${id}`)
  await router.isReady()
  wrapper = mount(ProductDetailView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('ProductDetailView', () => {
  it('pide el producto de la URL y muestra sus datos y la información de temporada', async () => {
    productRepository.getById.mockResolvedValue(swarm)

    await mountDetail(8)

    expect(productRepository.getById).toHaveBeenCalledWith('8')
    expect(wrapper.find('h1').text()).toBe('Enjambre')
    expect(wrapper.text()).toContain('120,00')
    expect(wrapper.text()).toContain('Consultar disponibilidad en temporada')
  })

  it('si está disponible enlaza a la solicitud con el producto preseleccionado', async () => {
    productRepository.getById.mockResolvedValue(swarm)

    await mountDetail(8)

    const requestLink = wrapper
      .findAll('a')
      .find((link) => link.text().includes('Solicitar este producto'))
    expect(requestLink.attributes('href')).toBe('/solicitud?producto=8')
    /* Sin sesión, avisamos de que hará falta iniciar sesión */
    expect(wrapper.text()).toContain('necesitas iniciar sesión')
  })

  it('si está agotado no permite solicitarlo', async () => {
    productRepository.getById.mockResolvedValue({ ...swarm, status: 'SOLD_OUT' })

    await mountDetail(8)

    expect(wrapper.text()).not.toContain('Solicitar este producto')
    expect(wrapper.text()).toContain('Agotado hasta la próxima cosecha.')
  })

  it('si el producto no existe muestra "Producto no encontrado"', async () => {
    productRepository.getById.mockRejectedValue(new ApiError(404, 'Product not found'))

    await mountDetail(999)

    expect(wrapper.find('h1').text()).toBe('Producto no encontrado')
  })
})