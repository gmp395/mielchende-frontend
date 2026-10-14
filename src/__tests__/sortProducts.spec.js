/*
 * Tests del orden de productos por categoría.
 */
import { describe, it, expect } from 'vitest'
import { sortByCategory } from '@/utils/sortProducts'

/* Productos mínimos: solo hacen falta id y categoría */
const enjambre = { id: 1, category: 'BEEKEEPER_PRODUCTS' }
const castano = { id: 2, category: 'HONEY' }
const polen = { id: 3, category: 'HIVE_PRODUCTS' }
const milflores = { id: 4, category: 'HONEY' }

describe('sortByCategory', () => {
  it('ordena por categoría: mieles, otros productos de la colmena y productos para el apicultor', () => {
    const result = sortByCategory([enjambre, castano, polen, milflores])

    expect(result.map((product) => product.category)).toEqual([
      'HONEY',
      'HONEY',
      'HIVE_PRODUCTS',
      'BEEKEEPER_PRODUCTS',
    ])
  })

  it('dentro de una categoría conserva el orden en que llegan', () => {
    const result = sortByCategory([enjambre, castano, polen, milflores])

    /* Castaño llega antes que milflores, y así se queda */
    expect(result.map((product) => product.id)).toEqual([2, 4, 3, 1])
  })

  it('no modifica la lista original', () => {
    const original = [enjambre, castano]

    sortByCategory(original)

    expect(original).toEqual([enjambre, castano])
  })

  it('deja al final los productos con una categoría desconocida', () => {
    const unknown = { id: 5, category: 'OTRA' }

    const result = sortByCategory([unknown, castano])

    expect(result.map((product) => product.id)).toEqual([2, 5])
  })
})