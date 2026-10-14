/*
 * Tests del mapper de productos: API ↔ formulario del panel.
 */
import { describe, it, expect } from 'vitest'
import { productMapper } from '@/mappers/productMapper'

/* Producto de ejemplo con la misma forma que los del backend */
const sampleProduct = {
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

describe('productMapper', () => {
  it('emptyForm crea un formulario vacío con el producto disponible y sin categoría', () => {
    const form = productMapper.emptyForm()

    expect(form.name).toBe('')
    expect(form.price).toBe('')
    /* Sin categoría por defecto: la admin tiene que elegirla */
    expect(form.category).toBe('')
    expect(form.status).toBe('AVAILABLE')
  })

  it('toForm muestra el precio con coma y dos decimales, y los null como texto vacío', () => {
    const form = productMapper.toForm(sampleProduct)

    expect(form.price).toBe('8,50')
    expect(form.imageUrl).toBe('')
    expect(form.seasonInfo).toBe('Cosecha 2026')
    expect(form.category).toBe('HONEY')
    /* El id no forma parte del formulario: va en la URL de la petición */
    expect(form).not.toHaveProperty('id')
  })

  it('toRequestDto convierte el precio a número, quita espacios y envía null en opcionales vacíos', () => {
    const form = {
      ...productMapper.toForm(sampleProduct),
      name: '  Miel de castaño ',
      price: '12,5',
      seasonInfo: '   ',
    }

    const dto = productMapper.toRequestDto(form)

    expect(dto.name).toBe('Miel de castaño')
    expect(dto.price).toBe(12.5)
    expect(dto.imageUrl).toBeNull()
    expect(dto.seasonInfo).toBeNull()
    expect(dto.category).toBe('HONEY')
    expect(dto.status).toBe('AVAILABLE')
  })

  it('un producto sin precio pasa a campo vacío, y un campo vacío vuelve a null', () => {
    /* API → formulario: null se muestra como campo vacío */
    const form = productMapper.toForm({ ...sampleProduct, price: null })
    expect(form.price).toBe('')

    /* Formulario → API: vacío (o solo espacios) se envía como null */
    const dto = productMapper.toRequestDto({ ...form, price: '  ' })
    expect(dto.price).toBeNull()
  })
})