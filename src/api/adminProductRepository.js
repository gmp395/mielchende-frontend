/*
 * Repositorio de productos para el panel de administración:
 * única pieza que conoce los endpoints /api/admin/products del backend.
 * Todos requieren rol ADMIN; con otro rol el backend responde 403.
 * Para listar se usa el productRepository público, que ya devuelve
 * todos los productos con su estado.
 */
import { httpClient } from '@/api/httpClient'

export const adminProductRepository = {
  /* POST /admin/products → crea un producto (201) y lo devuelve */
  create(product) {
    return httpClient.post('/admin/products', product)
  },

  /* PUT /admin/products/{id} → sustituye todos los datos del producto */
  update(id, product) {
    return httpClient.put(`/admin/products/${id}`, product)
  },

  /*
   * PATCH /admin/products/{id}/status → cambia solo la disponibilidad
   * (AVAILABLE o SOLD_OUT), sin tocar el resto de datos.
   */
  updateStatus(id, status) {
    return httpClient.patch(`/admin/products/${id}/status`, { status })
  },

  /*
   * DELETE /admin/products/{id} → 204 sin cuerpo.
   * Si el producto tiene solicitudes asociadas, el backend responde 409
   * para no romper el historial de pedidos.
   */
  delete(id) {
    return httpClient.delete(`/admin/products/${id}`)
  },
}