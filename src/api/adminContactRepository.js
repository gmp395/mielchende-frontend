/*
 * Repositorio de mensajes de contacto para el panel de administración:
 * única pieza que conoce el endpoint /api/admin/contact-messages del backend.
 * Requiere rol ADMIN; con otro rol el backend responde 403.
 */
import { httpClient } from '@/api/httpClient'

export const adminContactRepository = {
  /* GET /admin/contact-messages → todos los mensajes, del más reciente al más antiguo */
  getAll() {
    return httpClient.get('/admin/contact-messages')
  },
}