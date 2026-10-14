/*
 * Orden de los productos en pantalla.
 * Está fuera de los componentes para reutilizarlo (catálogo y panel)
 * y testearlo por separado.
 */
import { PRODUCT_CATEGORY } from '@/constants/productCategory'

/* Orden de las categorías: el mismo de las constantes (y de los filtros) */
const CATEGORY_ORDER = Object.values(PRODUCT_CATEGORY)

/*
 * Posición de una categoría en ese orden.
 * Una categoría desconocida va al final, en lugar de al principio
 * (indexOf devolvería -1, que quedaría delante de todo).
 */
function categoryRank(category) {
  const index = CATEGORY_ORDER.indexOf(category)
  return index === -1 ? CATEGORY_ORDER.length : index
}

/*
 * Devuelve una copia de la lista ordenada por categoría:
 * primero las mieles, después otros productos de la colmena
 * y al final los productos para el apicultor.
 * - [...products]: copia, para no modificar el array original.
 * - sort es estable: dentro de una misma categoría se conserva el orden
 *   en que llegan del backend (el de creación).
 */
export function sortByCategory(products) {
  return [...products].sort((a, b) => categoryRank(a.category) - categoryRank(b.category))
}