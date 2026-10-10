/*
 * Tests de las utilidades de formato.
 */
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/utils/format'

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
})