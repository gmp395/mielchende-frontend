/*
 * Repositorio de productos: única pieza que conoce
 * los endpoints públicos /api/products del backend.
 */
import { httpClient } from '@/api/httpClient'

export const productRepository = {
  /* GET /products → lista de productos del catálogo */
  getAll() {
    return httpClient.get('/products')
  },

  /* GET /products/{id} → un producto; 404 si no existe */
  getById(id) {
    return httpClient.get(`/products/${id}`)
  },
}