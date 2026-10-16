/*
 * Tests de la vista del catálogo: lista, estados, error, catálogo vacío
 * y filtros por categoría.
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
    category: 'HONEY',
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
    category: 'BEEKEEPER_PRODUCTS',
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

/* Botón de filtro por su texto visible */
function filterButton(label) {
  return wrapper.findAll('button').find((button) => button.text() === label)
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

  it('marca como "Próximamente" los productos que aún no se pueden solicitar', async () => {
    productRepository.getAll.mockResolvedValue([
      { ...sampleProducts[0], status: 'COMING_SOON' },
    ])

    await mountCatalog()

    expect(wrapper.find('li').text()).toContain('Próximamente')
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

  it('el filtro muestra solo los productos de la categoría elegida', async () => {
    productRepository.getAll.mockResolvedValue(sampleProducts)
    await mountCatalog()

    /*
     * Al elegir una categoría, solo quedan sus productos y el botón queda activo.
     * «Para el apicultor» agrupa los enjambres y las reinas (BEEKEEPER_PRODUCTS)
     */
    await filterButton('Para el apicultor').trigger('click')

    expect(wrapper.findAll('li')).toHaveLength(1)
    expect(wrapper.find('li').text()).toContain('Reina fecundada')
    expect(filterButton('Para el apicultor').attributes('aria-pressed')).toBe('true')

    /* "Todos" vuelve a mostrar el catálogo completo */
    await filterButton('Todos').trigger('click')

    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('si una categoría no tiene productos lo indica', async () => {
    productRepository.getAll.mockResolvedValue(sampleProducts)
    await mountCatalog()

    await filterButton('Otros productos de la colmena').trigger('click')

    expect(wrapper.findAll('li')).toHaveLength(0)
    expect(wrapper.text()).toContain('No hay productos en esta categoría.')
  })
})