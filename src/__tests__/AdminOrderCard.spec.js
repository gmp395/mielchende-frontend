/*
 * Tests de la tarjeta de solicitud del panel de administración (AdminOrderCard):
 * datos del cliente, bloques opcionales (teléfono y comentarios),
 * botones de cambio de estado según el paso del ciclo y evento change-status.
 * La tarjeta no llama a la API: solo emite el evento, así que no hace falta ningún mock.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AdminOrderCard from '@/components/admin/AdminOrderCard.vue'

/* Solicitud completa de ejemplo; cada test cambia solo lo que necesita */
const baseOrder = {
  id: 12,
  createdAt: '2026-10-20T10:00:00',
  customerName: 'Ana López',
  customerEmail: 'ana@test.com',
  phone: '600123123',
  status: 'CONFIRMED',
  comments: 'Entregar por la tarde',
  items: [{ productId: 1, productName: 'Miel de castaño', productFormat: '500 g', quantity: 2 }],
}

/* Monta la tarjeta mezclando la solicitud base con los cambios del test */
function mountCard(orderChanges = {}, props = {}) {
  return mount(AdminOrderCard, {
    props: { order: { ...baseOrder, ...orderChanges }, ...props },
  })
}

/* Botones de retroceder y avanzar, localizados por el inicio de su aria-label */
function previousButton(wrapper) {
  return wrapper.find('button[aria-label^="Devolver"]')
}
function nextButton(wrapper) {
  return wrapper.find('button[aria-label^="Marcar"]')
}

describe('AdminOrderCard', () => {
  it('muestra el cliente con enlaces para escribir y llamar, los productos y los comentarios', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('Solicitud n.º 12')
    expect(wrapper.text()).toContain('Ana López')
    expect(wrapper.find('a[href="mailto:ana@test.com"]').exists()).toBe(true)
    expect(wrapper.find('a[href="tel:600123123"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Miel de castaño')
    expect(wrapper.text()).toContain('× 2')
    expect(wrapper.text()).toContain('Entregar por la tarde')
  })

  it('no muestra teléfono ni comentarios cuando la solicitud no los tiene', () => {
    const wrapper = mountCard({ phone: null, comments: '' })

    expect(wrapper.find('a[href^="tel:"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Comentarios')
  })

  it('en Confirmado permite retroceder a Recibido y avanzar a Enviado', async () => {
    const wrapper = mountCard({ status: 'CONFIRMED' })

    expect(previousButton(wrapper).text()).toContain('Recibido')
    expect(nextButton(wrapper).text()).toContain('Enviado')

    await previousButton(wrapper).trigger('click')
    await nextButton(wrapper).trigger('click')

    /* emitted() guarda cada evento con sus argumentos, en orden */
    expect(wrapper.emitted('change-status')).toEqual([['RECEIVED'], ['SHIPPED']])
  })

  it('en Recibido solo ofrece avanzar y en Enviado solo retroceder', () => {
    const received = mountCard({ status: 'RECEIVED' })
    expect(previousButton(received).exists()).toBe(false)
    expect(nextButton(received).text()).toContain('Confirmado')

    const shipped = mountCard({ status: 'SHIPPED' })
    expect(nextButton(shipped).exists()).toBe(false)
    expect(previousButton(shipped).text()).toContain('Confirmado')
  })

  it('desactiva los botones mientras se guarda un cambio de estado', () => {
    const wrapper = mountCard({ status: 'CONFIRMED' }, { isUpdating: true })

    expect(previousButton(wrapper).attributes('disabled')).toBeDefined()
    expect(nextButton(wrapper).attributes('disabled')).toBeDefined()
  })
})