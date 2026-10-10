/*
 * Tests de la vista del catálogo: lista, estado agotado, error y catálogo vacío.
 * El repositorio se sustituye por un mock: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CatalogView from '@/views/CatalogView.vue'
import router from '@/router'
import { productRepository } from '@/api/productRepository'
import { ApiError } from '@/api/httpClient'

vi.mock('@/api/productRepository', () => ({
  productRepository: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}))

/* Productos de ejemplo con la misma forma que los del backend */
const sampleProducts = [
  {
    id: 1,
    name: 'Miel de castaño',
    description: 'Miel de castaño de nuestra cosecha anual.',
    format: '500 g',
    price: 8,
    imageUrl: null,
    seasonInfo: null,
    status: 'AVAILABLE',
  },
  {
    id: 9,
    name: 'Reina fecundada',
    description: 'Reina fecundada.',
    format: 'Unidad',
    price: 30,
    imageUrl: null,
    seasonInfo: 'Consultar disponibilidad en temporada',
    status: 'SOLD_OUT',
  },
]

let pinia
let wrapper

/* Monta el catálogo y espera a que se resuelva la petición inicial */
async function mountCatalog() {
  await router.push('/catalogo')
  await router.isReady()
  wrapper = mount(CatalogView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  vi.clearAllMocks()
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('CatalogView', () => {
  it('muestra una tarjeta por producto con nombre, formato y precio', async () => {
    productRepository.getAll.mockResolvedValue(sampleProducts)

    await mountCatalog()

    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Miel de castaño')
    expect(wrapper.text()).toContain('500 g')
    expect(wrapper.text()).toContain('8,00')
  })

  it('marca como agotados los productos sin existencias', async () => {
    productRepository.getAll.mockResolvedValue(sampleProducts)

    await mountCatalog()

    const cards = wrapper.findAll('li')
    expect(cards[0].text()).toContain('Disponible')
    expect(cards[1].text()).toContain('Agotado')
  })

  it('si falla la carga muestra el error y permite reintentar', async () => {
    productRepository.getAll.mockRejectedValueOnce(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )
    productRepository.getAll.mockResolvedValueOnce(sampleProducts)

    await mountCatalog()
    expect(wrapper.find('[role="alert"]').text()).toContain('No se ha podido conectar')

    /* Al reintentar, la segunda llamada sí devuelve los productos */
    await wrapper.find('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(productRepository.getAll).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('si no hay productos muestra un mensaje', async () => {
    productRepository.getAll.mockResolvedValue([])

    await mountCatalog()

    expect(wrapper.text()).toContain('Ahora mismo no hay productos en el catálogo.')
  })
})