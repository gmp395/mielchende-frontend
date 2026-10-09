/*
 * Cliente HTTP único de la aplicación.
 * Todas las peticiones al backend pasan por aquí: ningún componente
 * ni store usa fetch directamente.
 * Se encarga de:
 *  - montar la URL completa a partir de VITE_API_URL,
 *  - añadir el token JWT (Authorization: Bearer) si hay sesión,
 *  - convertir cualquier error en un ApiError uniforme,
 *  - avisar cuando llega un 401 (sesión caducada o inválida).
 */

/* URL base de la API, definida en el archivo .env */
const API_URL = import.meta.env.VITE_API_URL

/* Mensaje por defecto si el backend no envía { message } */
const DEFAULT_ERROR_MESSAGE = 'Se ha producido un error. Inténtalo de nuevo más tarde.'

/*
 * Error uniforme para toda la aplicación.
 * status: código HTTP (0 si no se pudo conectar con el servidor).
 * message: texto que se puede mostrar a la usuaria.
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/*
 * Dependencias que se inyectan desde fuera (en main.js):
 *  - getToken: devuelve el token actual o null.
 *  - onUnauthorized: qué hacer ante un 401 (cerrar sesión y redirigir).
 * Por defecto no hacen nada, para que el cliente funcione también en los tests.
 */
let getToken = () => null
let onUnauthorized = () => {}

export function configureHttpClient(options) {
  if (options.getToken) getToken = options.getToken
  if (options.onUnauthorized) onUnauthorized = options.onUnauthorized
}

/*
 * Función central que hacen todas las peticiones.
 * options.body: objeto que se enviará como JSON.
 * options.headers: cabeceras extra (por ejemplo, Basic Auth en el login).
 * options.skipUnauthorizedHandler: true en el login, porque ahí un 401
 *   significa "credenciales incorrectas", no "sesión caducada".
 */
async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, skipUnauthorizedHandler = false } = options

  const finalHeaders = { ...headers }

  /* Solo indicamos JSON si de verdad enviamos cuerpo */
  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  /* Añadimos el token salvo que ya venga otra cabecera Authorization (login con Basic) */
  const token = getToken()
  if (token && !finalHeaders.Authorization) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    /* fetch solo falla así si no hay conexión o el backend está apagado */
    throw new ApiError(0, 'No se ha podido conectar con el servidor.')
  }

  /* Sesión caducada o token inválido: avisamos (cerrar sesión, ir al login) */
  if (response.status === 401 && !skipUnauthorizedHandler) {
    onUnauthorized()
  }

  if (!response.ok) {
    /* El backend devuelve siempre los errores como { message: "..." } */
    let message = DEFAULT_ERROR_MESSAGE
    try {
      const data = await response.json()
      if (data?.message) message = data.message
    } catch {
      /* Respuesta sin cuerpo JSON: nos quedamos con el mensaje por defecto */
    }
    throw new ApiError(response.status, message)
  }

  /* 204 No Content (por ejemplo, al borrar): no hay cuerpo que leer */
  if (response.status === 204) return null

  return response.json()
}

/* Atajos por verbo HTTP, que son los que usan los repositorios */
export const httpClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}