/*
 * Tests de la vista Productos del panel de administración:
 * lista, cambio de disponibilidad y borrado (con confirmación, conflicto 409 y cancelación).
 * Los repositorios se sustituyen por mocks: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import AdminProductsView from '@/views/AdminProductsView.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { productRepository } from '@/api/productRepository'
import { adminProductRepository } from '@/api/adminProductRepository'
import { ApiError } from '@/api/httpClient'
import { makeToken, inOneHour } from './helpers/makeToken'

vi.mock('@/api/productRepository', () => ({
  productRepository: { getAll: vi.fn(), getById: vi.fn() },
}))

vi.mock('@/api/adminProductRepository', () => ({
  adminProductRepository: {
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}))

/* Productos de ejemplo con la misma forma que los del backend */
const honey = {
  id: 1,
  name: 'Miel milflores',
  description: 'Miel de la cosecha de verano.',
  format: '500 g',
  price: 8.5,
  imageUrl: null,
  seasonInfo: null,
  category: 'HONEY',
  status: 'AVAILABLE',
}
const propolis = {
  ...honey,
  id: 2,
  name: 'Propóleo',
  format: 'Unidad',
  price: 6,
  category: 'HIVE_PRODUCTS',
  status: 'SOLD_OUT',
}

let pinia
let wrapper

/* La ruta requiere rol ADMIN: simulamos la sesión del administrador */
function loginAsAdmin() {
  useAuthStore().token = makeToken({
    sub: 'admin@test.com',
    roles: ['ROLE_ADMIN'],
    exp: inOneHour(),
  })
}

/* Navega a la lista y monta la vista */
async function mountAdminProducts() {
  await router.push('/admin/productos')
  await router.isReady()
  wrapper = mount(AdminProductsView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

/* Desplegable de disponibilidad del producto indicado */
function statusSelect(product) {
  return wrapper.find(`[aria-label="Disponibilidad de ${product.name} (${product.format})"]`)
}

/* Abre el diálogo de borrado del producto indicado */
async function askDelete(product) {
  await wrapper.find(`[aria-label="Borrar ${product.name} (${product.format})"]`).trigger('click')
}

/* Botón "Borrar" dentro del diálogo (no el de la fila) */
function dialogConfirmButton() {
  return wrapper
    .find('[role="dialog"]')
    .findAll('button')
    .find((button) => button.text() === 'Borrar')
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  loginAsAdmin()
  productRepository.getAll.mockResolvedValue([honey, propolis])
})

/* Desmontamos tras cada test para que el router no use la Pinia de un test anterior */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('AdminProductsView', () => {
  it('muestra cada producto con su formato, precio y disponibilidad', async () => {
    await mountAdminProducts()

    const text = wrapper.text()
    expect(text).toContain('Miel milflores')
    expect(text).toContain('500 g')
    expect(text).toContain('8,50')
    expect(text).toContain('Disponible')
    expect(text).toContain('Agotado')
    /* El desplegable muestra el estado actual de cada producto */
    expect(statusSelect(honey).element.value).toBe('AVAILABLE')
    expect(statusSelect(propolis).element.value).toBe('SOLD_OUT')
  })

  it('marca un producto como agotado desde el desplegable y lo confirma', async () => {
    adminProductRepository.updateStatus.mockResolvedValue({ ...honey, status: 'SOLD_OUT' })
    await mountAdminProducts()

    /* En un <select>, setValue elige la opción y dispara el evento change */
    await statusSelect(honey).setValue('SOLD_OUT')
    await flushPromises()

    expect(adminProductRepository.updateStatus).toHaveBeenCalledWith(1, 'SOLD_OUT')
    expect(wrapper.find('[role="status"]').text()).toBe('Miel milflores (500 g): Agotado.')
  })

  it('marca un producto como "Próximamente"', async () => {
    adminProductRepository.updateStatus.mockResolvedValue({ ...honey, status: 'COMING_SOON' })
    await mountAdminProducts()

    await statusSelect(honey).setValue('COMING_SOON')
    await flushPromises()

    expect(adminProductRepository.updateStatus).toHaveBeenCalledWith(1, 'COMING_SOON')
    expect(wrapper.find('[role="status"]').text()).toBe('Miel milflores (500 g): Próximamente.')
  })

  it('si falla el guardado, el desplegable vuelve al estado real y se avisa', async () => {
    adminProductRepository.updateStatus.mockRejectedValue(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )
    await mountAdminProducts()

    await statusSelect(honey).setValue('SOLD_OUT')
    await flushPromises()

    expect(statusSelect(honey).element.value).toBe('AVAILABLE')
    expect(wrapper.find('[role="alert"]').text()).toContain('No se ha podido conectar')
  })

  it('borra un producto tras confirmarlo en el diálogo', async () => {
    adminProductRepository.delete.mockResolvedValue(null)
    await mountAdminProducts()

    await askDelete(honey)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    await dialogConfirmButton().trigger('click')
    await flushPromises()

    expect(adminProductRepository.delete).toHaveBeenCalledWith(1)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(wrapper.findAll('li')).toHaveLength(1)
  })

  it('si el producto tiene solicitudes (409) lo explica y ofrece marcarlo como agotado', async () => {
    adminProductRepository.delete.mockRejectedValue(new ApiError(409, 'Conflicto'))
    adminProductRepository.updateStatus.mockResolvedValue({ ...honey, status: 'SOLD_OUT' })
    await mountAdminProducts()

    await askDelete(honey)
    await dialogConfirmButton().trigger('click')
    await flushPromises()

    const alert = wrapper.find('[role="alert"]')
    expect(alert.text()).toContain('no se puede borrar porque tiene solicitudes')

    await alert.find('button').trigger('click')
    await flushPromises()

    expect(adminProductRepository.updateStatus).toHaveBeenCalledWith(1, 'SOLD_OUT')
  })

  it('con Escape se cierra el diálogo sin borrar nada', async () => {
    await mountAdminProducts()

    await askDelete(honey)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(adminProductRepository.delete).not.toHaveBeenCalled()
  })
})