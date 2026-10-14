/*
 * Repositorio de artículos: única pieza que conoce
 * el endpoint público /api/articles del backend.
 * El backend solo devuelve los publicados, del más reciente al más antiguo.
 */
import { httpClient } from '@/api/httpClient'

export const articleRepository = {
  /* GET /articles → artículos publicados de Actualidad */
  getPublished() {
    return httpClient.get('/articles')
  },
}