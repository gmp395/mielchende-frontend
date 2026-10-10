/*
 * Tests de la barra de progreso de una solicitud.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderStatusSteps from '@/components/orders/OrderStatusSteps.vue'

describe('OrderStatusSteps', () => {
  it('muestra los tres pasos en orden', () => {
    const wrapper = mount(OrderStatusSteps, { props: { status: 'RECEIVED' } })

    const steps = wrapper.findAll('li')
    expect(steps).toHaveLength(3)
    expect(steps[0].text()).toContain('Recibido')
    expect(steps[1].text()).toContain('Confirmado')
    expect(steps[2].text()).toContain('Enviado')
  })

  it('marca como paso actual el estado de la solicitud', () => {
    const wrapper = mount(OrderStatusSteps, { props: { status: 'CONFIRMED' } })

    const current = wrapper.find('[aria-current="step"]')
    expect(current.text()).toContain('Confirmado')
  })
})