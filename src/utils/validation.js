/*
 * Reglas de validación de formularios.
 * Cada función devuelve un mensaje de error, o una cadena vacía si el valor es válido.
 * Están fuera de los componentes para reutilizarlas y testearlas por separado.
 */

/* Longitud mínima de contraseña al crear una cuenta */
export const PASSWORD_MIN_LENGTH = 8

/* Formato básico de email: texto@texto.texto, sin espacios */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateRequired(value, message) {
  return value.trim() ? '' : message
}

export function validateEmail(value) {
  if (!value.trim()) return 'Introduce tu email.'
  if (!EMAIL_PATTERN.test(value.trim())) return 'Introduce un email válido.'
  return ''
}

/* Solo para el registro: en el login no se exige longitud mínima */
export function validateNewPassword(value) {
  if (!value) return 'Introduce una contraseña.'
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
  }
  return ''
}