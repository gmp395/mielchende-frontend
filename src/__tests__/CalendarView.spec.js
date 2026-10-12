import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import CalendarView from '@/views/CalendarView.vue'

/*
 * Pruebas de la página "Calendario apícola".
 * Es una página estática, así que comprobamos que el contenido
 * clave está, que las imágenes son accesibles y que los enlaces
 * llevan a donde deben.
 */
describe('CalendarView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   */
  const mountView = () =>
    mount(CalendarView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', () => {
    wrapper = mountView()
    expect(wrapper.find('h1').text()).toBe('Calendario apícola')
  })

  it('presenta las cuatro estaciones del año apícola', () => {
    wrapper = mountView()
    const text = wrapper.text()
    expect(text).toContain('Invierno')
    expect(text).toContain('Primavera')
    expect(text).toContain('Verano')
    expect(text).toContain('Otoño')
  })

  /*
   * Regla de negocio: una sola cosecha al año, en septiembre.
   * Si alguien cambia el texto y desaparece este dato, el test avisa.
   */
  it('indica que hay una sola cosecha al año, en septiembre', () => {
    wrapper = mountView()
    const text = wrapper.text()
    expect(text).toContain('Una sola cosecha al año')
    expect(text).toContain('septiembre')
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