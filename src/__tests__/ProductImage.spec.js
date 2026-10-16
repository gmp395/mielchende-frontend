/*
 * Tests de la imagen de producto: imagen real o imagen por defecto.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductImage from '@/components/catalog/ProductImage.vue'

describe('ProductImage', () => {
  it('muestra la imagen del producto si tiene URL', () => {
    const wrapper = mount(ProductImage, {
      props: { imageUrl: 'https://ejemplo.com/miel.jpg', alt: 'Miel de castaño' },
    })

    const image = wrapper.find('img')
    expect(image.attributes('src')).toBe('https://ejemplo.com/miel.jpg')
    expect(image.attributes('alt')).toBe('Miel de castaño')
  })

  it('muestra la imagen por defecto si el producto no tiene imagen', () => {
    const wrapper = mount(ProductImage, { props: { imageUrl: null } })

    /* La única imagen es el logo de la imagen por defecto, dentro del fondo miel */
    expect(wrapper.find('.bg-honey-soft').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).not.toBe(null)
  })

  it('pasa a la imagen por defecto si la imagen no se puede cargar', async () => {
    const wrapper = mount(ProductImage, {
      props: { imageUrl: 'https://ejemplo.com/rota.jpg', alt: 'Miel' },
    })

    /* Simulamos que el navegador no pudo cargar la imagen */
    await wrapper.find('img').trigger('error')

    expect(wrapper.find('.bg-honey-soft').exists()).toBe(true)
  })
})