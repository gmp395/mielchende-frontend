/*
 * Utilidades de formato para mostrar datos al usuario.
 * Están fuera de los componentes para reutilizarlas y testearlas por separado.
 */

/*
 * Intl.NumberFormat es la API estándar del navegador para formatear números
 * según el idioma: en es-ES, 8 → "8,00 €".
 * Se crea una sola vez y se reutiliza en cada llamada.
 */
const priceFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

/* Texto que se muestra cuando un producto no tiene precio (null) */
export const PRICE_ON_REQUEST_LABEL = 'Consultar precio'

/*
 * Precio para mostrar: "8,00 €", o "Consultar precio" si no tiene.
 * value == null (con dos iguales) cubre a la vez null y undefined.
 */
export function formatPrice(value) {
  if (value == null) return PRICE_ON_REQUEST_LABEL
  return priceFormatter.format(Number(value))
}

/*
 * Intl.DateTimeFormat hace lo mismo con las fechas:
 * "2026-10-10T19:05:12" → "10 de octubre de 2026".
 */
const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(value) {
  return dateFormatter.format(new Date(value))
}