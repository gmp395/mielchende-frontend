/*
 * Utilidades para leer el JWT en el frontend.
 * Solo DECODIFICAMOS el payload para mostrar o ocultar cosas en la interfaz.
 * La seguridad real la sigue haciendo el backend, que verifica la firma
 * en cada petición: aunque alguien manipule el token, la API lo rechazará.
 */

/*
 * Devuelve el payload del token como objeto, o null si no es válido.
 * El JWT tiene tres partes separadas por puntos: cabecera.payload.firma.
 * El payload va en Base64URL, que usa "-" y "_" en lugar de "+" y "/".
 */
export function decodeJwt(token) {
  if (!token) return null
  try {
    const payloadPart = token.split('.')[1]
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

/* exp viene en segundos desde 1970; Date.now() en milisegundos */
export function isTokenExpired(payload) {
  if (!payload?.exp) return true
  return payload.exp * 1000 <= Date.now()
}