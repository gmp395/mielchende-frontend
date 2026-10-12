import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import BeesWorldView from '@/views/BeesWorldView.vue'

/*
 * Pruebas de la página "Mundo de las abejas".
 * Es una página estática, así que comprobamos que el contenido
 * clave está, que las imágenes son accesibles y que los enlaces
 * llevan a donde deben.
 */
describe('BeesWorldView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   */
  const mountView = () =>
    mount(BeesWorldView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', () => {
    wrapper = mountView()
    expect(wrapper.find('h1').text()).toBe('Mundo de las abejas')
  })

  it('presenta las tres castas de la colmena', () => {
    wrapper = mountView()
    const text = wrapper.text()
    expect(text).toContain('La reina')
    expect(text).toContain('Las obreras')
    expect(text).toContain('Los zánganos')
  })

  /*
   * Protege la accesibilidad: si alguien añade una foto
   * sin texto alternativo, este test falla.
   */
  it('todas las imágenes tienen un texto alternativo', () => {
    wrapper = mountView()
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThan(0)
    images.forEach((img) => {
      expect(img.attributes('alt')?.trim()).toBeTruthy()
    })
  })

  it('enlaza con el catálogo y con contacto', () => {
    wrapper = mountView()
    const destinations = wrapper
      .findAllComponents(RouterLinkStub)
      .map((link) => link.props('to'))
    expect(destinations).toContainEqual({ name: 'catalog' })
    expect(destinations).toContainEqual({ name: 'contact' })
  })
})