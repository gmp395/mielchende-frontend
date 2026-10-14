/*
 * Tests de las utilidades de formato.
 */
import { describe, it, expect } from 'vitest'
import { formatDate, formatPrice, PRICE_ON_REQUEST_LABEL } from '@/utils/format'

describe('formatPrice', () => {
  /*
   * Intl separa el número y el símbolo € con un espacio especial (no separable),
   * por eso usamos \s en la expresión regular en vez de un espacio normal.
   */
  it('formatea el precio en euros con dos decimales y coma decimal', () => {
    expect(formatPrice(8)).toMatch(/^8,00\s€$/)
    expect(formatPrice(120.5)).toMatch(/^120,50\s€$/)
  })

  it('acepta también el precio como texto', () => {
    expect(formatPrice('15.00')).toMatch(/^15,00\s€$/)
  })

  it('sin precio (null o undefined) muestra "Consultar precio"', () => {
    expect(formatPrice(null)).toBe(PRICE_ON_REQUEST_LABEL)
    expect(formatPrice(undefined)).toBe(PRICE_ON_REQUEST_LABEL)
    expect(PRICE_ON_REQUEST_LABEL).toBe('Consultar precio')
  })
})

describe('formatDate', () => {
  it('formatea la fecha del backend en español, con el mes en letra', () => {
    expect(formatDate('2026-10-10T19:05:12')).toBe('10 de octubre de 2026')
  })
})