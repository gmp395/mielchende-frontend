/*
 * Utilidades compartidas por los tests que necesitan un JWT.
 * Fabrican un token falso (cabecera.payload.firma) con el payload indicado.
 * La firma no importa: el frontend solo decodifica, no verifica.
 */
export function makeToken(payload) {
  const encode = (object) =>
    btoa(JSON.stringify(object)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${encode({ alg: 'HS512' })}.${encode(payload)}.firma`
}

/* Caducidad dentro de una hora, en segundos (formato del claim exp) */
export function inOneHour() {
  return Math.floor(Date.now() / 1000) + 3600
}