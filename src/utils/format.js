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

export function formatPrice(value) {
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