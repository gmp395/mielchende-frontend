import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ThreatsView from '@/views/ThreatsView.vue'

/*
 * Pruebas de la página "Amenazas para las abejas".
 * Es una página estática, así que comprobamos que el contenido
 * clave está, que las imágenes son accesibles y que los enlaces
 * llevan a donde deben.
 */
describe('ThreatsView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   */
  const mountView = () =>
    mount(ThreatsView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', () => {
    wrapper = mountView()
    expect(wrapper.find('h1').text()).toBe('Amenazas para las abejas')
  })

  it('presenta las cuatro amenazas principales', () => {
    wrapper = mountView()
    const text = wrapper.text()
    expect(text).toContain('La varroa')
    expect(text).toContain('La avispa velutina')
    expect(text).toContain('Los pesticidas')
    expect(text).toContain('La pérdida de hábitat')
  })

  /*
   * Cada amenaza explica también qué se hace en el apiario para combatirla.
   * No se busca una frase concreta, para que el test no dependa de la redacción:
   * se comprueba que las cuatro tarjetas incluyen su pregunta (por ejemplo,
   * "¿Cómo la controlamos?").
   */
  it('indica qué se hace frente a cada amenaza', () => {
    wrapper = mountView()
    const cards = wrapper.find('[aria-labelledby="threats-title"]').findAll('li')
    expect(cards).toHaveLength(4)
    cards.forEach((card) => {
      expect(card.text()).toContain('?')
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