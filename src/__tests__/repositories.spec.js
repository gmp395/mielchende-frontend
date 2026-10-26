/*
 * Tests de los repositorios de src/api.
 * Cada repositorio es una capa fina sobre httpClient: su única responsabilidad
 * es llamar al endpoint correcto, con el verbo HTTP correcto y los datos correctos.
 * Por eso aquí httpClient se sustituye por un mock y solo se comprueba esa llamada.
 * La lógica de red (token, errores, 401...) ya la prueba httpClient.spec.js.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { httpClient } from '@/api/httpClient'
import { adminArticleRepository } from '@/api/adminArticleRepository'
import { adminContactRepository } from '@/api/adminContactRepository'
import { adminOrderRepository } from '@/api/adminOrderRepository'
import { adminProductRepository } from '@/api/adminProductRepository'
import { articleRepository } from '@/api/articleRepository'
import { authRepository } from '@/api/authRepository'
import { contactRepository } from '@/api/contactRepository'
import { orderRepository } from '@/api/orderRepository'
import { productRepository } from '@/api/productRepository'

/* httpClient falso: un vi.fn() por cada verbo HTTP, sin llamadas reales al backend */
vi.mock('@/api/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

/* Datos de ejemplo que se envían en el cuerpo de las peticiones */
const article = { title: 'La enjambrazón', summary: 'Resumen', body: 'Texto del artículo' }
const product = { name: 'Miel de castaño', price: 9.5 }
const order = { items: [{ productId: 1, quantity: 2 }] }
const message = { name: 'Ana', email: 'ana@test.com', message: 'Hola', captchaToken: 'token-de-prueba' }

/*
 * Tabla de casos: qué método del repositorio se llama (call)
 * y qué llamada debe recibir httpClient (verbo y argumentos).
 * Una fila por método: si mañana cambia una ruta, falla solo esa fila.
 */
const cases = [
  /* Artículos del panel */
  { name: 'adminArticleRepository.getAll', call: () => adminArticleRepository.getAll(), verb: 'get', args: ['/admin/articles'] },
  { name: 'adminArticleRepository.getById', call: () => adminArticleRepository.getById(7), verb: 'get', args: ['/admin/articles/7'] },
  { name: 'adminArticleRepository.create', call: () => adminArticleRepository.create(article), verb: 'post', args: ['/admin/articles', article] },
  { name: 'adminArticleRepository.update', call: () => adminArticleRepository.update(7, article), verb: 'put', args: ['/admin/articles/7', article] },
  { name: 'adminArticleRepository.updateStatus', call: () => adminArticleRepository.updateStatus(7, 'PUBLISHED'), verb: 'patch', args: ['/admin/articles/7/status', { status: 'PUBLISHED' }] },

  /* Mensajes de contacto del panel */
  { name: 'adminContactRepository.getAll', call: () => adminContactRepository.getAll(), verb: 'get', args: ['/admin/contact-messages'] },

  /* Solicitudes del panel */
  { name: 'adminOrderRepository.getAll', call: () => adminOrderRepository.getAll(), verb: 'get', args: ['/admin/orders'] },
  { name: 'adminOrderRepository.getSummary', call: () => adminOrderRepository.getSummary(), verb: 'get', args: ['/admin/orders/summary'] },
  { name: 'adminOrderRepository.updateStatus', call: () => adminOrderRepository.updateStatus(3, 'CONFIRMED'), verb: 'patch', args: ['/admin/orders/3/status', { status: 'CONFIRMED' }] },

  /* Productos del panel */
  { name: 'adminProductRepository.create', call: () => adminProductRepository.create(product), verb: 'post', args: ['/admin/products', product] },
  { name: 'adminProductRepository.update', call: () => adminProductRepository.update(5, product), verb: 'put', args: ['/admin/products/5', product] },
  { name: 'adminProductRepository.updateStatus', call: () => adminProductRepository.updateStatus(5, 'SOLD_OUT'), verb: 'patch', args: ['/admin/products/5/status', { status: 'SOLD_OUT' }] },
  { name: 'adminProductRepository.delete', call: () => adminProductRepository.delete(5), verb: 'delete', args: ['/admin/products/5'] },

  /* Endpoints públicos y del cliente */
  { name: 'articleRepository.getPublished', call: () => articleRepository.getPublished(), verb: 'get', args: ['/articles'] },
  { name: 'authRepository.register', call: () => authRepository.register('Ana', 'ana@test.com', 'secreto', 'token-de-prueba'), verb: 'post', args: ['/auth/register', { name: 'Ana', email: 'ana@test.com', password: 'secreto', captchaToken: 'token-de-prueba' }] },
  { name: 'contactRepository.send', call: () => contactRepository.send(message), verb: 'post', args: ['/contact', message] },
  { name: 'orderRepository.create', call: () => orderRepository.create(order), verb: 'post', args: ['/orders', order] },
  { name: 'orderRepository.getMine', call: () => orderRepository.getMine(), verb: 'get', args: ['/orders'] },
  { name: 'productRepository.getAll', call: () => productRepository.getAll(), verb: 'get', args: ['/products'] },
  { name: 'productRepository.getById', call: () => productRepository.getById(2), verb: 'get', args: ['/products/2'] },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('repositorios de la API', () => {
  /* it.each repite el mismo test con cada fila de la tabla; $name y $verb se sustituyen en el título */
  it.each(cases)('$name llama a httpClient.$verb con la ruta y los datos correctos', async ({ call, verb, args }) => {
    await call()

    expect(httpClient[verb]).toHaveBeenCalledTimes(1)
    expect(httpClient[verb]).toHaveBeenCalledWith(...args)
  })

  it('devuelve tal cual la respuesta de httpClient', async () => {
    httpClient.get.mockResolvedValue([{ id: 1, name: 'Miel de castaño' }])

    await expect(productRepository.getAll()).resolves.toEqual([{ id: 1, name: 'Miel de castaño' }])
  })
})

describe('authRepository.login', () => {
  /*
   * Los valores esperados en Base64 se han calculado fuera de la aplicación,
   * para no comprobar el código con su propia lógica.
   */
  it('envía las credenciales en la cabecera Basic y no trata el 401 como sesión caducada', async () => {
    await authRepository.login('ana@test.com', 'secreto')

    expect(httpClient.post).toHaveBeenCalledWith('/auth/login', undefined, {
      headers: { Authorization: 'Basic YW5hQHRlc3QuY29tOnNlY3JldG8=' },
      skipUnauthorizedHandler: true,
    })
  })

  it('codifica en UTF-8 las contraseñas con ñ o tildes', async () => {
    await authRepository.login('ana@test.com', 'abeja-ñandú')

    const [, , options] = httpClient.post.mock.calls[0]
    expect(options.headers.Authorization).toBe('Basic YW5hQHRlc3QuY29tOmFiZWphLcOxYW5kw7o=')
  })
})