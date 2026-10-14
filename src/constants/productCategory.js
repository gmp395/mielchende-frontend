/*
 * Categorías de producto, tal como las envía el backend,
 * y el texto que se muestra al usuario para cada una.
 * Se usan en los filtros del catálogo y en el formulario del panel.
 * El orden de este objeto es el orden en que aparecen en pantalla.
 */
export const PRODUCT_CATEGORY = {
  HONEY: 'HONEY',
  HIVE_PRODUCTS: 'HIVE_PRODUCTS',
  BEEKEEPER_PRODUCTS: 'BEEKEEPER_PRODUCTS',
}

export const PRODUCT_CATEGORY_LABELS = {
  [PRODUCT_CATEGORY.HONEY]: 'Mieles',
  [PRODUCT_CATEGORY.HIVE_PRODUCTS]: 'Otros productos de la colmena',
  [PRODUCT_CATEGORY.BEEKEEPER_PRODUCTS]: 'Productos para el apicultor',
}