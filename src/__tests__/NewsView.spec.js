/*
 * Pruebas de la página "Actualidad apícola".
 * Comprobamos el formato de periódico (artículo en grande y aside con la lista),
 * la selección por la URL, los estados de vacío y error, los enlaces seguros
 * a cada red social, la accesibilidad de las imágenes y los enlaces internos.
 * Se monta con el router real (la página lee ?articulo= de la URL) y Pinia.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NewsView from '@/views/NewsView.vue'
import router from '@/router'
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

/* Artículos publicados de ejemplo, con la misma forma y el mismo orden que los del backend */
const latest = {
  id: 2,
  title: 'Llega la cosecha',
  summary: 'Este año la cosecha se adelanta.',
  body: 'Primer párrafo.\n\nSegundo párrafo.',
  imageUrl: '/images/banners/colmenas-en-fila.jpg',
  status: 'PUBLISHED',
  createdAt: '2026-10-01T10:00:00',
  publishedAt: '2026-10-02T10:00:00',
}
const older = {
  id: 1,
  title: 'Feria apícola de Lugo',
  summary: 'Os esperamos en la feria.',
  body: 'Estaremos en el puesto 12.',
  imageUrl: null,
  status: 'PUBLISHED',
  createdAt: '2026-09-20T10:00:00',
  publishedAt: '2026-09-21T10:00:00',
}

describe('NewsView', () => {
  let pinia
  let wrapper

  /* Navega a la URL indicada, monta la vista y espera a que carguen los artículos */
  const mountView = async (path = '/recursos/actualidad') => {
    await router.push(path)
    await router.isReady()
    wrapper = mount(NewsView, { global: { plugins: [pinia, router] } })
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    vi.clearAllMocks()
    articleRepository.getPublished.mockResolvedValue([])
  })

  /* Desmontamos después de cada test para no dejar restos entre pruebas */
  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('muestra el título de la página', async () => {
    await mountView()
    expect(wrapper.find('h1').text()).toBe('Actualidad apícola')
  })

  it('sin artículo en la URL, muestra en grande el más reciente con su fecha y sus párrafos', async () => {
    articleRepository.getPublished.mockResolvedValue([latest, older])
    await mountView()

    const main = wrapper.find('article')
    expect(main.find('h3').text()).toBe('Llega la cosecha')
    expect(main.find('time').text()).toBe('2 de octubre de 2026')
    expect(main.find('time').attributes('datetime')).toBe('2026-10-02T10:00:00')
    /* El texto conserva los saltos de línea: así se separan los párrafos */
    expect(main.find('.whitespace-pre-line').element.textContent).toBe(
      'Primer párrafo.\n\nSegundo párrafo.',
    )
  })

  it('el aside lista todas las noticias y marca la que se está leyendo', async () => {
    articleRepository.getPublished.mockResolvedValue([latest, older])
    await mountView()

    const links = wrapper.find('aside').findAll('a')
    expect(links.map((link) => link.text())).toEqual([
      expect.stringContaining('Llega la cosecha'),
      expect.stringContaining('Feria apícola de Lugo'),
    ])
    expect(links[0].attributes('aria-current')).toBe('true')
    expect(links[1].attributes('aria-current')).toBe('false')
  })

  it('muestra en grande el artículo indicado en la URL', async () => {
    articleRepository.getPublished.mockResolvedValue([latest, older])
    await mountView('/recursos/actualidad?articulo=1')

    expect(wrapper.find('article h3').text()).toBe('Feria apícola de Lugo')
  })

  it('al pulsar una noticia del aside, pasa a leerse en grande', async () => {
    articleRepository.getPublished.mockResolvedValue([latest, older])
    await mountView()

    await wrapper.find('aside').findAll('a')[1].trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.articulo).toBe('1')
    expect(wrapper.find('article h3').text()).toBe('Feria apícola de Lugo')
  })

  it('si el artículo de la URL no existe, muestra el más reciente', async () => {
    articleRepository.getPublished.mockResolvedValue([latest, older])
    await mountView('/recursos/actualidad?articulo=999')

    expect(wrapper.find('article h3').text()).toBe('Llega la cosecha')
  })

  it('con una sola noticia no muestra el aside', async () => {
    articleRepository.getPublished.mockResolvedValue([latest])
    await mountView()

    expect(wrapper.find('article h3').text()).toBe('Llega la cosecha')
    expect(wrapper.find('aside').exists()).toBe(false)
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
    articleRepository.getPublished.mockResolvedValue([latest])
    await mountView()
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThan(1)
    images.forEach((img) => {
      expect(img.attributes('alt')?.trim()).toBeTruthy()
    })
  })

  it('enlaza con el catálogo y con contacto', async () => {
    await mountView()

    expect(wrapper.find('a[href="/catalogo"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/contacto"]').exists()).toBe(true)
  })
})