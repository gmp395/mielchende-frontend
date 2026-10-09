/*
 * Tests unitarios del cliente HTTP.
 * No llamamos al backend real: sustituimos fetch por un mock (vi.fn)
 * y comprobamos qué cabeceras envía el cliente y cómo trata cada respuesta.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { httpClient, configureHttpClient, ApiError } from '@/api/httpClient'

/*
 * Crea una respuesta falsa con la forma mínima que usa el cliente.
 * Si no pasamos datos, json() falla, igual que una respuesta sin cuerpo.
 */
function mockResponse(status, data) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (data === undefined) throw new Error('Sin cuerpo')
      return data
    },
  }
}

describe('httpClient', () => {
  let fetchMock
  let onUnauthorized

  beforeEach(() => {
    /* Sustituimos el fetch global por un mock en cada test */
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    /* Configuración limpia: hay sesión y un handler espía para el 401 */
    onUnauthorized = vi.fn()
    configureHttpClient({ getToken: () => 'token-de-prueba', onUnauthorized })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('añade el token como Bearer y devuelve el JSON de la respuesta', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, [{ id: 1 }]))

    const data = await httpClient.get('/products')

    /* Comprobamos la URL (sin depender del valor del .env) y la cabecera */
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/products')
    expect(options.headers.Authorization).toBe('Bearer token-de-prueba')
    expect(data).toEqual([{ id: 1 }])
  })

  it('no sustituye una cabecera Authorization que ya venga (login con Basic Auth)', async () => {
    fetchMock.mockResolvedValue(mockResponse(200, { token: 'abc' }))

    await httpClient.post('/auth/login', undefined, {
      headers: { Authorization: 'Basic credenciales' },
    })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Basic credenciales')
  })

  it('ante un 401 avisa al handler y lanza ApiError', async () => {
    fetchMock.mockResolvedValue(mockResponse(401, { message: 'No autorizado' }))

    await expect(httpClient.get('/orders')).rejects.toMatchObject({
      status: 401,
      message: 'No autorizado',
    })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it('con skipUnauthorizedHandler un 401 no cierra la sesión', async () => {
    fetchMock.mockResolvedValue(mockResponse(401, { message: 'Credenciales incorrectas' }))

    await expect(
      httpClient.post('/auth/login', undefined, { skipUnauthorizedHandler: true }),
    ).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('usa el mensaje del backend en los errores', async () => {
    fetchMock.mockResolvedValue(mockResponse(409, { message: 'El producto está agotado' }))

    await expect(httpClient.post('/orders', { items: [] })).rejects.toMatchObject({
      status: 409,
      message: 'El producto está agotado',
    })
  })

  it('devuelve null en una respuesta 204', async () => {
    fetchMock.mockResolvedValue(mockResponse(204))

    const result = await httpClient.delete('/admin/products/1')

    expect(result).toBeNull()
  })

  it('lanza ApiError con estado 0 si no hay conexión con el servidor', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(httpClient.get('/products')).rejects.toMatchObject({ status: 0 })
  })
})