/*
 * Repositorio de solicitudes para el panel de administración:
 * única pieza que conoce los endpoints /api/admin/orders del backend.
 * Todos requieren rol ADMIN; con otro rol el backend responde 403.
 */
import { httpClient } from '@/api/httpClient'

export const adminOrderRepository = {
  /* GET /admin/orders → todas las solicitudes de todos los clientes */
  getAll() {
    return httpClient.get('/admin/orders')
  },

  /* GET /admin/orders/summary → resumen del panel: { pendingOrders } */
  getSummary() {
    return httpClient.get('/admin/orders/summary')
  },

  /*
   * PATCH /admin/orders/{id}/status → cambia el estado de una solicitud.
   * El backend solo admite un paso adelante o atrás en el flujo
   * (RECEIVED ↔ CONFIRMED ↔ SHIPPED); si no está permitido, responde 409.
   */
  updateStatus(id, status) {
    return httpClient.patch(`/admin/orders/${id}/status`, { status })
  },
}