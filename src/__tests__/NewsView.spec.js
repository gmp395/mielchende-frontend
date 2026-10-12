import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import NewsView from '@/views/NewsView.vue'
import { SOCIAL_LINKS } from '@/constants/contact'

/*
 * Pruebas de la página "Actualidad apícola".
 * Comprobamos el contenido clave, que hay un enlace seguro a cada red social,
 * que las imágenes son accesibles y que los enlaces internos llevan a donde deben.
 */
describe('NewsView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   */
  const mountView = () =>
    mount(NewsView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', () => {
    wrapper = mountView()
    expect(wrapper.find('h1').text()).toBe('Actualidad apícola')
  })

  /*
   * Recorremos las redes de la constante, no una lista escrita a mano:
   * si mañana se añade una red en contact.js, el test la comprueba sin tocarlo.
   */
  it('enlaza cada red social en una pestaña nueva y de forma segura', () => {
    wrapper = mountView()
    SOCIAL_LINKS.forEach((link) => {
      const anchor = wrapper.find(`a[href="${link.url}"]`)
      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toContain('noopener')
    })
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