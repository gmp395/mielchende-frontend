/*
 * Reglas de validación de formularios.
 * Cada función devuelve un mensaje de error, o una cadena vacía si el valor es válido.
 * Están fuera de los componentes para reutilizarlas y testearlas por separado.
 */

/* Longitud mínima de contraseña al crear una cuenta */
export const PASSWORD_MIN_LENGTH = 8

/* Límites de la solicitud de pedido (los mismos que valida el backend) */
export const PHONE_MAX_LENGTH = 20
export const COMMENTS_MAX_LENGTH = 1000

/*
 * Límite de los campos de texto corto de un producto
 * (nombre, formato, URL de imagen, temporada): columnas VARCHAR(255) en la BD.
 */
export const PRODUCT_TEXT_MAX_LENGTH = 255

/* Formato básico de email: texto@texto.texto, sin espacios */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*
 * Formato de precio: hasta 6 cifras enteras y, opcionalmente,
 * coma o punto seguido de 1 o 2 decimales ("8", "8,5", "8.50").
 * Coincide con la columna del backend: DECIMAL(8, 2).
 */
const PRICE_PATTERN = /^\d{1,6}([.,]\d{1,2})?$/

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

/* Para campos de texto opcionales con límite de longitud */
export function validateMaxLength(value, max, message) {
  return value.trim().length > max ? message : ''
}

/*
 * Cantidad de una línea de pedido: número entero de 1 o más.
 * Si el campo está vacío, v-model.number deja una cadena vacía, que no es un entero.
 */
export function validateQuantity(value) {
  return Number.isInteger(value) && value >= 1 ? '' : 'Indica una cantidad de 1 o más.'
}

/*
 * Precio de un producto, escrito como texto: admite coma o punto decimal.
 * Debe tener formato de precio y ser mayor que cero (el backend usa @Positive).
 */
export function validatePrice(value) {
  const price = value.trim()
  if (!price) return 'Introduce el precio.'
  if (!PRICE_PATTERN.test(price)) return 'Introduce un precio válido, por ejemplo 8,50.'
  if (Number(price.replace(',', '.')) <= 0) return 'El precio debe ser mayor que cero.'
  return ''
}