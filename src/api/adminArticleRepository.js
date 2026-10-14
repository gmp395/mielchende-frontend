/*
 * Repositorio de artículos para el panel de administración:
 * única pieza que conoce los endpoints /api/admin/articles del backend.
 * Todos requieren rol ADMIN; con otro rol el backend responde 403.
 * No hay delete: se despublica con updateStatus.
 */
import { httpClient } from '@/api/httpClient'

export const adminArticleRepository = {
  /* GET /admin/articles → todos los artículos, borradores incluidos */
  getAll() {
    return httpClient.get('/admin/articles')
  },

  /* GET /admin/articles/{id} → un artículo (para editarlo); 404 si no existe */
  getById(id) {
    return httpClient.get(`/admin/articles/${id}`)
  },

  /* POST /admin/articles → crea el artículo como borrador (201) y lo devuelve */
  create(article) {
    return httpClient.post('/admin/articles', article)
  },

  /* PUT /admin/articles/{id} → sustituye los textos; no cambia el estado */
  update(id, article) {
    return httpClient.put(`/admin/articles/${id}`, article)
  },

  /* PATCH /admin/articles/{id}/status → publica (PUBLISHED) o despublica (DRAFT) */
  updateStatus(id, status) {
    return httpClient.patch(`/admin/articles/${id}/status`, { status })
  },
}