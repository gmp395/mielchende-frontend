/*
 * Tests de parseBold: convierte **texto** en trozos marcados como negrita.
 */
import { describe, it, expect } from 'vitest'
import { parseBold } from '@/utils/boldText'

describe('parseBold', () => {
  it('sin marcas, devuelve el texto entero sin negrita', () => {
    expect(parseBold('Texto normal')).toEqual([{ text: 'Texto normal', bold: false }])
  })

  it('marca como negrita lo que está entre dos **', () => {
    expect(parseBold('Feria **Meliza** en Zamora')).toEqual([
      { text: 'Feria ', bold: false },
      { text: 'Meliza', bold: true },
      { text: ' en Zamora', bold: false },
    ])
  })

  it('admite varias negritas y conserva los saltos de línea', () => {
    expect(parseBold('**OCTUBRE 2026**\n\n**EuroBee**\nLugar: Alemania')).toEqual([
      { text: 'OCTUBRE 2026', bold: true },
      { text: '\n\n', bold: false },
      { text: 'EuroBee', bold: true },
      { text: '\nLugar: Alemania', bold: false },
    ])
  })

  it('una marca sin cerrar se muestra tal cual, sin negrita', () => {
    expect(parseBold('Hola **mundo')).toEqual([
      { text: 'Hola ', bold: false },
      { text: '**mundo', bold: false },
    ])
  })

  it('un asterisco suelto no se considera marca', () => {
    expect(parseBold('20 de febrero de 2027*')).toEqual([
      { text: '20 de febrero de 2027*', bold: false },
    ])
  })
})