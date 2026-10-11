/*
 * Lógica del ciclo de vida de una solicitud, separada de las vistas
 * para poder probarla sin montar componentes (función pura).
 */
import { ORDER_STATUS_FLOW } from '@/constants/orderStatus'

/*
 * Devuelve los estados vecinos de uno dado dentro del ciclo
 * Recibido → Confirmado → Enviado.
 * previous: estado al que se puede retroceder (null si es el primero).
 * next: estado al que se puede avanzar (null si es el último).
 * Si el estado no existe en el ciclo, ambos son null: así nunca
 * se ofrece un cambio que el backend no admitiría.
 */
export function getAdjacentStatuses(status) {
  const index = ORDER_STATUS_FLOW.indexOf(status)

  if (index === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: ORDER_STATUS_FLOW[index - 1] ?? null,
    next: ORDER_STATUS_FLOW[index + 1] ?? null,
  }
}