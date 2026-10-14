/*
 * Estados de un artículo de Actualidad, tal como los envía el backend,
 * y la etiqueta que se muestra al admin para cada uno.
 * Las vistas nunca escriben "Borrador" o "Publicado" a mano: usan estas constantes.
 * No hay borrado: para retirar un artículo se vuelve a borrador.
 */
export const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
}

export const ARTICLE_STATUS_LABELS = {
  [ARTICLE_STATUS.DRAFT]: 'Borrador',
  [ARTICLE_STATUS.PUBLISHED]: 'Publicado',
}