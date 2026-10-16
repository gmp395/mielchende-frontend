import { describe, it, expect, afterEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import GuidesView from '@/views/GuidesView.vue'

/*
 * Pruebas de la página "Guías prácticas".
 * Es una página estática, así que comprobamos que el contenido
 * clave está, que las imágenes son accesibles y que los enlaces
 * llevan a donde deben.
 */
describe('GuidesView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   */
  const mountView = () =>
    mount(GuidesView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', () => {
    wrapper = mountView()
    expect(wrapper.find('h1').text()).toBe('Guías prácticas')
  })

  it('presenta las tres guías y la sección del propóleo', () => {
    wrapper = mountView()
    const text = wrapper.text()
    expect(text).toContain('Cómo conservar la miel')
    expect(text).toContain('Por qué cristaliza la miel')
    expect(text).toContain('Cómo conservar y disfrutar del polen')
    expect(text).toContain('El propóleo: el escudo natural de la colmena')
  })

  /*
   * Aviso de salud: el polen y el propóleo pueden provocar reacciones alérgicas.
   * Es información importante, así que nos aseguramos de que no desaparezca.
   */
  it('incluye los avisos sobre posibles reacciones alérgicas', () => {
    wrapper = mountView()
    expect(wrapper.text()).toContain('reacciones alérgicas')
    expect(wrapper.text()).toContain('consulta con un profesional sanitario')
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