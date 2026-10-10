/*
 * Tests del mapper de solicitudes: formulario → DTO de la API.
 */
import { describe, it, expect } from 'vitest'
import { orderMapper } from '@/mappers/orderMapper'

describe('orderMapper.toCreateDto', () => {
  it('envía solo productId y quantity de cada línea (sin el id interno)', () => {
    const lines = [
      { id: 1, productId: 3, quantity: 2 },
      { id: 2, productId: 5, quantity: 1 },
    ]

    const dto = orderMapper.toCreateDto(lines, { phone: '', comments: '' })

    expect(dto.items).toEqual([
      { productId: 3, quantity: 2 },
      { productId: 5, quantity: 1 },
    ])
  })

  it('quita espacios y envía null en los campos opcionales vacíos', () => {
    const lines = [{ id: 1, productId: 3, quantity: 1 }]

    const withData = orderMapper.toCreateDto(lines, { phone: ' 600 000 000 ', comments: ' Hola ' })
    const empty = orderMapper.toCreateDto(lines, { phone: '   ', comments: '' })

    expect(withData.phone).toBe('600 000 000')
    expect(withData.comments).toBe('Hola')
    expect(empty.phone).toBeNull()
    expect(empty.comments).toBeNull()
  })
})