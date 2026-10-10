/*
 * Repositorio de solicitudes del cliente: única pieza que conoce
 * los endpoints /api/orders del backend (requieren sesión).
 */
import { httpClient } from '@/api/httpClient'

export const orderRepository = {
  /* POST /orders → crea una solicitud; 409 si algún producto está agotado */
  create(order) {
    return httpClient.post('/orders', order)
  },

  /* GET /orders → solicitudes del cliente, de la más reciente a la más antigua */
  getMine() {
    return httpClient.get('/orders')
  },
}