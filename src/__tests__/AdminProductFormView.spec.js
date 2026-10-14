/*
 * Tests del formulario de producto del panel: validación,
 * alta, edición y producto inexistente.
 * Los repositorios se sustituyen por mocks: no se llama al backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminProductFormView from '@/views/AdminProductFormView.vue'
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

/* Producto de ejemplo con la misma forma que los del backend */
const honey = {
  id: 3,
  name: 'Miel milflores',
  description: 'Miel de la cosecha de verano.',
  format: '500 g',
  price: 8.5,
  imageUrl: null,
  seasonInfo: 'Cosecha 2026',
  category: 'HONEY',
  status: 'AVAILABLE',
}

let pinia
let wrapper

function loginAsAdmin() {
  useAuthStore().token = makeToken({
    sub: 'admin@test.com',
    roles: ['ROLE_ADMIN'],
    exp: inOneHour(),
  })
}

/* Navega a la ruta indicada (alta o edición) y monta el formulario */
async function mountForm(path) {
  await router.push(path)
  await router.isReady()
  wrapper = mount(AdminProductFormView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return wrapper
}

/* Botón de radio de una categoría concreta */
function categoryRadio(category) {
  return wrapper.find(`input[name="product-category"][value="${category}"]`)
}

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
  localStorage.clear()
  vi.clearAllMocks()
  loginAsAdmin()
})

/*
 * Desmontamos tras cada test para que el router no use la Pinia de un test anterior,
 * y restauramos los spies (vi.spyOn) para no dejar el router modificado.
 */
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.restoreAllMocks()
})

describe('AdminProductFormView', () => {
  it('al crear, no envía nada si faltan datos y muestra los errores', async () => {
    await mountForm('/admin/productos/nuevo')

    await wrapper.find('form').trigger('submit')

    const text = wrapper.text()
    expect(text).toContain('Introduce el nombre.')
    expect(text).toContain('Elige una categoría.')
    expect(text).toContain('Introduce el precio.')
    expect(text).toContain('Introduce una descripción.')
    expect(adminProductRepository.create).not.toHaveBeenCalled()
  })

  /*
   * Comprobamos que el formulario PIDE volver a la lista (spy sobre router.push).
   * Que el router complete la navegación y cargue la otra vista (lazy loading)
   * es responsabilidad de Vue Router, no de este componente.
   */
  it('al crear, envía el DTO con el precio convertido y vuelve a la lista', async () => {
    adminProductRepository.create.mockResolvedValue({ ...honey, id: 9 })
    await mountForm('/admin/productos/nuevo')
    const pushSpy = vi.spyOn(router, 'push')

    await wrapper.find('#product-name').setValue('Miel de castaño')
    /* En un botón de radio, setValue() sin argumentos equivale a marcarlo */
    await categoryRadio('HONEY').setValue()
    await wrapper.find('#product-format').setValue('1 kg')
    await wrapper.find('#product-price').setValue('14,5')
    await wrapper.find('#product-description').setValue('Miel oscura de otoño.')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(adminProductRepository.create).toHaveBeenCalledWith({
      name: 'Miel de castaño',
      description: 'Miel oscura de otoño.',
      format: '1 kg',
      price: 14.5,
      imageUrl: null,
      seasonInfo: null,
      category: 'HONEY',
      status: 'AVAILABLE',
    })
    expect(pushSpy).toHaveBeenCalledWith({ name: 'admin-products' })
  })

  it('al editar, rellena el formulario con el producto y guarda los cambios', async () => {
    productRepository.getById.mockResolvedValue(honey)
    adminProductRepository.update.mockResolvedValue(honey)
    await mountForm('/admin/productos/3/editar')

    expect(productRepository.getById).toHaveBeenCalledWith('3')
    expect(wrapper.find('#product-name').element.value).toBe('Miel milflores')
    expect(wrapper.find('#product-price').element.value).toBe('8,50')
    /* La categoría del producto aparece marcada */
    expect(categoryRadio('HONEY').element.checked).toBe(true)

    await wrapper.find('#product-price').setValue('9')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    /* El id llega de la URL, por eso es texto */
    expect(adminProductRepository.update).toHaveBeenCalledWith(
      '3',
      expect.objectContaining({ name: 'Miel milflores', price: 9, category: 'HONEY' }),
    )
  })

  it('si el producto no existe, lo indica en lugar de mostrar el formulario', async () => {
    productRepository.getById.mockRejectedValue(new ApiError(404, 'Producto no encontrado'))
    await mountForm('/admin/productos/99/editar')

    expect(wrapper.find('[role="alert"]').text()).toBe('Este producto no existe o ya se ha borrado.')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})