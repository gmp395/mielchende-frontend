/*
 * Tests de la función pura que calcula los estados vecinos de una solicitud.
 */
import { describe, it, expect } from 'vitest'
import { getAdjacentStatuses } from '@/utils/orderStatusFlow'
import { ORDER_STATUS } from '@/constants/orderStatus'

describe('getAdjacentStatuses', () => {
  it('desde Recibido solo permite avanzar a Confirmado', () => {
    expect(getAdjacentStatuses(ORDER_STATUS.RECEIVED)).toEqual({
      previous: null,
      next: ORDER_STATUS.CONFIRMED,
    })
  })

  it('desde Confirmado permite retroceder a Recibido y avanzar a Enviado', () => {
    expect(getAdjacentStatuses(ORDER_STATUS.CONFIRMED)).toEqual({
      previous: ORDER_STATUS.RECEIVED,
      next: ORDER_STATUS.SHIPPED,
    })
  })

  it('desde Enviado solo permite retroceder a Confirmado', () => {
    expect(getAdjacentStatuses(ORDER_STATUS.SHIPPED)).toEqual({
      previous: ORDER_STATUS.CONFIRMED,
      next: null,
    })
  })

  /* Caso límite: protege frente a un estado que no está en el ciclo */
  it('con un estado desconocido no ofrece ningún cambio', () => {
    expect(getAdjacentStatuses('CANCELLED')).toEqual({ previous: null, next: null })
  })
})