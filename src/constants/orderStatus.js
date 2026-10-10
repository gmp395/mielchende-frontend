/*
 * Estados de una solicitud, tal como los envía el backend.
 * El ciclo es fijo: Recibido → Confirmado → Enviado (las solicitudes no se borran).
 * Las vistas nunca escriben estos textos a mano: usan estas constantes.
 */
export const ORDER_STATUS = {
  RECEIVED: 'RECEIVED',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
}

/* Orden del ciclo de vida: se usa para la barra de progreso y para avanzar o retroceder un paso */
export const ORDER_STATUS_FLOW = [ORDER_STATUS.RECEIVED, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED]

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.RECEIVED]: 'Recibido',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.SHIPPED]: 'Enviado',
}

/* Explicación para el cliente de lo que significa cada estado */
export const ORDER_STATUS_DESCRIPTIONS = {
  [ORDER_STATUS.RECEIVED]: 'Hemos recibido tu solicitud y la revisaremos pronto.',
  [ORDER_STATUS.CONFIRMED]: 'Hemos confirmado tu solicitud y la estamos preparando.',
  [ORDER_STATUS.SHIPPED]: 'Tu pedido ya ha sido enviado.',
}