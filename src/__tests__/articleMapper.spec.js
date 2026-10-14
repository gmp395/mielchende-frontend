/*
 * Tests del mapper de artículos: formulario ↔ DTO de la API.
 */
import { describe, it, expect } from 'vitest'
import { articleMapper } from '@/mappers/articleMapper'

describe('articleMapper', () => {
  it('el formulario vacío tiene todos los campos en blanco', () => {
    expect(articleMapper.emptyForm()).toEqual({
      title: '',
      summary: '',
      body: '',
      imageUrl: '',
    })
  })

  it('convierte un artículo sin imagen en formulario con la imagen vacía', () => {
    const form = articleMapper.toForm({
      id: 1,
      title: 'Llega la cosecha',
      summary: 'Resumen',
      body: 'Texto',
      imageUrl: null,
      status: 'DRAFT',
    })

    /* Solo los campos editables; ni el id ni el estado van al formulario */
    expect(form).toEqual({
      title: 'Llega la cosecha',
      summary: 'Resumen',
      body: 'Texto',
      imageUrl: '',
    })
  })

  it('al enviar quita espacios y manda null si no hay imagen', () => {
    const dto = articleMapper.toRequestDto({
      title: '  Llega la cosecha  ',
      summary: ' Resumen ',
      body: 'Texto',
      imageUrl: '   ',
    })

    expect(dto).toEqual({
      title: 'Llega la cosecha',
      summary: 'Resumen',
      body: 'Texto',
      imageUrl: null,
    })
  })

  it('conserva los saltos de línea entre párrafos del texto', () => {
    const dto = articleMapper.toRequestDto({
      ...articleMapper.emptyForm(),
      body: '\nPrimer párrafo.\n\nSegundo párrafo.\n',
    })

    expect(dto.body).toBe('Primer párrafo.\n\nSegundo párrafo.')
  })
})