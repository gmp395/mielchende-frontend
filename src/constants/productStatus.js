/*
 * Estados de un producto, tal como los envía el backend,
 * y la etiqueta que se muestra al usuario para cada uno.
 * Las vistas nunca escriben "Disponible" o "Agotado" a mano: usan estas constantes.
 */
export const PRODUCT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  SOLD_OUT: 'SOLD_OUT',
}

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.AVAILABLE]: 'Disponible',
  [PRODUCT_STATUS.SOLD_OUT]: 'Agotado',
}