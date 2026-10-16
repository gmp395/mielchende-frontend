/*
 * Tests de la vista Solicitudes del panel de administración:
 * resumen, filtro por estado y cambio de estado (éxito y conflicto).
 * El repositorio se sustituye por un mock: no se llama al backend.
 * La vista no usa router ni Pinia, así que se monta sin plugins;
 * la protección por rol ya se prueba en routerGuards.spec.js.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminOrdersView from '@/views/AdminOrdersView.vue'
import { adminOrderRepository } from '@/api/adminOrderRepository'
import { ApiError } from '@/api/httpClient'

vi.mock('@/api/adminOrderRepository', () => ({
  adminOrderRepository: { getAll: vi.fn(), getSummary: vi.fn(), updateStatus: vi.fn() },
}))

/* Crea una solicitud de ejemplo con la misma forma que las del backend */
function makeOrder(id, status) {
  return {
    id,
    customerName: `Cliente ${id}`,
    customerEmail: `cliente${id}@test.com`,
    phone: null,
    comments: null,
    status,
    createdAt: '2026-10-10T19:05:12',
    items: [{ productId: 3, productName: 'Miel milflores', productFormat: '500 g', quantity: 1 }],
  }
}

/* Dos recibidas y una confirmada: el resumen del backend cuenta 2 pendientes */
const sampleOrders = [makeOrder(1, 'RECEIVED'), makeOrder(2, 'RECEIVED'), makeOrder(3, 'CONFIRMED')]

let wrapper

/* Monta la vista y espera a que terminen las peticiones iniciales */
async function mountAdminOrders() {
  wrapper = mount(AdminOrdersView)
  await flushPromises()
  return wrapper
}

/* Botones del filtro por estado (dentro del grupo, para no confundirlos con los de las tarjetas) */
function filterButton(label) {
  return wrapper
    .find('[role="group"]')
    .findAll('button')
    .find((button) => button.text().startsWith(label))
}

beforeEach(() => {
  vi.clearAllMocks()
  adminOrderRepository.getAll.mockResolvedValue(sampleOrders)
  adminOrderRepository.getSummary.mockResolvedValue({ pendingOrders: 2 })
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('AdminOrdersView', () => {
  it('muestra el resumen y, por defecto, solo las solicitudes recibidas', async () => {
    await mountAdminOrders()

    expect(wrapper.find('strong').text()).toBe('2')
    expect(filterButton('Recibido').text()).toBe('Recibido (2)')
    expect(filterButton('Recibido').attributes('aria-pressed')).toBe('true')

    const text = wrapper.text()
    expect(text).toContain('Solicitud n.º 1')
    expect(text).toContain('Solicitud n.º 2')
    expect(text).not.toContain('Solicitud n.º 3')
  })

  it('el filtro cambia las solicitudes que se ven', async () => {
    await mountAdminOrders()

    await filterButton('Confirmado').trigger('click')

    expect(wrapper.findAll('article')).toHaveLength(1)
    expect(wrapper.text()).toContain('Solicitud n.º 3')

    await filterButton('Todas').trigger('click')

    expect(wrapper.findAll('article')).toHaveLength(3)
  })

  it('al avanzar una solicitud la actualiza, confirma el cambio y pide de nuevo el resumen', async () => {
    adminOrderRepository.updateStatus.mockResolvedValue(makeOrder(1, 'CONFIRMED'))
    adminOrderRepository.getSummary
      .mockResolvedValueOnce({ pendingOrders: 2 })
      .mockResolvedValueOnce({ pendingOrders: 1 })
    await mountAdminOrders()

    await wrapper.find('[aria-label="Marcar la solicitud n.º 1 como Confirmado"]').trigger('click')
    await flushPromises()

    expect(adminOrderRepository.updateStatus).toHaveBeenCalledWith(1, 'CONFIRMED')
    expect(wrapper.find('[role="status"]').text()).toBe('Solicitud n.º 1 marcada como Confirmado.')
    /* Ya no es "recibida", así que desaparece del filtro activo */
    expect(wrapper.findAll('article')).toHaveLength(1)
    expect(wrapper.find('strong').text()).toBe('1')
  })

  it('ante un conflicto (409) muestra el aviso y recarga los datos', async () => {
    adminOrderRepository.updateStatus.mockRejectedValue(
      new ApiError(409, 'No se puede pasar de RECEIVED a CONFIRMED'),
    )
    await mountAdminOrders()

    await wrapper.find('[aria-label="Marcar la solicitud n.º 1 como Confirmado"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toContain('No se puede pasar')
    /* Una vez al montar y otra al recargar tras el conflicto */
    expect(adminOrderRepository.getAll).toHaveBeenCalledTimes(2)
  })
})