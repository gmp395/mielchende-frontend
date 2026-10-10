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