import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import NewsView from '@/views/NewsView.vue'
import { SOCIAL_LINKS } from '@/constants/contact'
import { articleRepository } from '@/api/articleRepository'
import { ApiError } from '@/api/httpClient'

/*
 * El repositorio se sustituye por un mock: no se llama al backend.
 * Cada test decide qué devuelve (artículos, lista vacía o error).
 */
vi.mock('@/api/articleRepository', () => ({
  articleRepository: { getPublished: vi.fn() },
}))

/* Artículo publicado de ejemplo con la misma forma que los del backend */
const article = {
  id: 1,
  title: 'Llega la cosecha',
  summary: 'Este año la cosecha se adelanta.',
  body: 'Primer párrafo.\n\nSegundo párrafo.',
  imageUrl: '/images/banners/colmenas-en-fila.jpg',
  status: 'PUBLISHED',
  createdAt: '2026-10-01T10:00:00',
  publishedAt: '2026-10-02T10:00:00',
}

/*
 * Pruebas de la página "Actualidad apícola".
 * Comprobamos los artículos publicados (con sus estados de vacío y error),
 * los enlaces seguros a cada red social, la accesibilidad de las imágenes
 * y que los enlaces internos llevan a donde deben.
 */
describe('NewsView', () => {
  let wrapper

  /*
   * RouterLinkStub sustituye a los RouterLink reales por unos falsos:
   * no hace falta montar el router y podemos leer a dónde apunta
   * cada enlace a través de su prop "to".
   * flushPromises espera a que termine la carga de artículos.
   */
  const mountView = async () => {
    wrapper = mount(NewsView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
    articleRepository.getPublished.mockResolvedValue([])
  })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
  })

  it('muestra el título de la página', async () => {
    await mountView()
    expect(wrapper.find('h1').text()).toBe('Actualidad apícola')
  })

  it('muestra los artículos publicados con su fecha y sus párrafos', async () => {
    articleRepository.getPublished.mockResolvedValue([article])
    await mountView()

    const card = wrapper.find('article')
    expect(card.find('h3').text()).toBe('Llega la cosecha')
    expect(card.find('time').text()).toBe('2 de octubre de 2026')
    expect(card.find('time').attributes('datetime')).toBe('2026-10-02T10:00:00')
    /* El texto conserva los saltos de línea: así se separan los párrafos */
    expect(card.find('.whitespace-pre-line').element.textContent).toBe(
      'Primer párrafo.\n\nSegundo párrafo.',
    )
  })

  it('si no hay artículos publicados, lo indica y remite a las redes', async () => {
    await mountView()

    expect(wrapper.find('article').exists()).toBe(false)
    expect(wrapper.text()).toContain('Todavía no hay noticias publicadas')
  })

  it('si falla la carga, muestra el error sin ocultar el resto de la página', async () => {
    articleRepository.getPublished.mockRejectedValue(
      new ApiError(0, 'No se ha podido conectar con el servidor.'),
    )
    await mountView()

    expect(wrapper.find('[role="alert"]').text()).toContain('No se han podido cargar las noticias')
    /* Las redes no dependen del backend: siguen visibles */
    expect(wrapper.find(`a[href="${SOCIAL_LINKS[0].url}"]`).exists()).toBe(true)
  })

  /*
   * Recorremos las redes de la constante, no una lista escrita a mano:
   * si mañana se añade una red en contact.js, el test la comprueba sin tocarlo.
   */
  it('enlaza cada red social en una pestaña nueva y de forma segura', async () => {
    await mountView()
    SOCIAL_LINKS.forEach((link) => {
      const anchor = wrapper.find(`a[href="${link.url}"]`)
      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toContain('noopener')
    })
  })

  /*
   * Protege la accesibilidad: si alguien añade una foto
   * sin texto alternativo, este test falla. Incluye la imagen de un artículo.
   */
  it('todas las imágenes tienen un texto alternativo', async () => {
    articleRepository.getPublished.mockResolvedValue([article])
    await mountView()
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThan(1)
    images.forEach((img) => {
      expect(img.attributes('alt')?.trim()).toBeTruthy()
    })
  })

  it('enlaza con el catálogo y con contacto', async () => {
    await mountView()
    const destinations = wrapper
      .findAllComponents(RouterLinkStub)
      .map((link) => link.props('to'))
    expect(destinations).toContainEqual({ name: 'catalog' })
    expect(destinations).toContainEqual({ name: 'contact' })
  })
})