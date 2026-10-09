/*
 * Repositorio de autenticación: única pieza que conoce
 * los endpoints /api/auth del backend.
 */
import { httpClient } from '@/api/httpClient'

/*
 * Codifica "email:password" en Base64 para la cabecera Basic.
 * btoa solo admite caracteres latinos básicos, así que primero
 * pasamos el texto a bytes UTF-8 (por si la contraseña lleva ñ o tildes).
 * Recuerda: Base64 es codificación, no cifrado (apuntes de Spring Security).
 */
function toBasicCredentials(email, password) {
  const bytes = new TextEncoder().encode(`${email}:${password}`)
  const binary = String.fromCharCode(...bytes)
  return btoa(binary)
}

export const authRepository = {
  /* POST /auth/register → { id, name, email, role } */
  register(name, email, password) {
    return httpClient.post('/auth/register', { name, email, password })
  },

  /*
   * POST /auth/login con Basic Auth → { token }.
   * skipUnauthorizedHandler: aquí un 401 significa "credenciales incorrectas",
   * no "sesión caducada", así que no debe cerrar sesión ni redirigir.
   */
  login(email, password) {
    return httpClient.post('/auth/login', undefined, {
      headers: { Authorization: `Basic ${toBasicCredentials(email, password)}` },
      skipUnauthorizedHandler: true,
    })
  },
}