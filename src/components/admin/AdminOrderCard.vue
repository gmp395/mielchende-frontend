<script setup>
/*
 * Tarjeta de una solicitud en el panel de administración.
 * Muestra los datos del cliente, el progreso, los productos y los
 * botones para avanzar o retroceder un paso en el estado.
 * No llama a la API: emite "change-status" y la vista decide qué hacer.
 */
import { computed } from 'vue'
import { formatDate } from '@/utils/format'
import { ORDER_STATUS_LABELS } from '@/constants/orderStatus'
import { getAdjacentStatuses } from '@/utils/orderStatusFlow'
import OrderStatusSteps from '@/components/orders/OrderStatusSteps.vue'

const props = defineProps({
  order: { type: Object, required: true },
  /* true mientras se guarda un cambio de estado: desactiva los botones */
  isUpdating: { type: Boolean, default: false },
})

/* Evento hacia la vista, con el estado al que se quiere pasar */
const emit = defineEmits(['change-status'])

/* Estados a los que se puede retroceder o avanzar desde el actual */
const adjacent = computed(() => getAdjacentStatuses(props.order.status))
</script>

<template>
  <article class="rounded-xl border border-border bg-card p-5 sm:p-6">
    <header class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="text-xl">Solicitud n.º {{ order.id }}</h2>
      <p class="text-sm text-muted-foreground">
        <time :datetime="order.createdAt">{{ formatDate(order.createdAt) }}</time>
      </p>
    </header>

    <!-- Datos del cliente: enlaces para escribir o llamar directamente -->
    <dl class="mt-4 space-y-1 text-sm">
      <div>
        <dt class="sr-only">Cliente</dt>
        <dd class="font-medium">{{ order.customerName }}</dd>
      </div>
      <div>
        <dt class="sr-only">Email</dt>
        <dd>
          <a :href="`mailto:${order.customerEmail}`" class="text-primary hover:underline">
            {{ order.customerEmail }}
          </a>
        </dd>
      </div>
      <div v-if="order.phone">
        <dt class="sr-only">Teléfono</dt>
        <dd>
          <a :href="`tel:${order.phone}`" class="text-primary hover:underline">{{ order.phone }}</a>
        </dd>
      </div>
    </dl>

    <div class="mt-5">
      <OrderStatusSteps :status="order.status" />
    </div>

    <!-- Productos solicitados -->
    <ul class="mt-5 divide-y divide-border border-t border-border">
      <li
        v-for="item in order.items"
        :key="item.productId"
        class="flex justify-between gap-4 py-3 text-sm"
      >
        <span>
          {{ item.productName }}
          <span class="text-muted-foreground">· {{ item.productFormat }}</span>
        </span>
        <span class="shrink-0 text-muted-foreground">× {{ item.quantity }}</span>
      </li>
    </ul>

    <div v-if="order.comments" class="mt-4 text-sm">
      <p class="text-muted-foreground">Comentarios</p>
      <!-- whitespace-pre-line: respeta los saltos de línea que escribió el cliente -->
      <p class="mt-1 whitespace-pre-line">{{ order.comments }}</p>
    </div>

    <!--
      Botones de cambio de estado: solo se muestran los pasos permitidos.
      El aria-label incluye el número de solicitud, porque con varias tarjetas
      un lector de pantalla oiría muchos botones con el mismo texto.
    -->
    <footer class="mt-6 flex flex-wrap justify-end gap-3">
      <button
        v-if="adjacent.previous"
        type="button"
        class="rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary disabled:opacity-50"
        :disabled="isUpdating"
        :aria-label="`Devolver la solicitud n.º ${order.id} a ${ORDER_STATUS_LABELS[adjacent.previous]}`"
        @click="emit('change-status', adjacent.previous)"
      >
        ← {{ ORDER_STATUS_LABELS[adjacent.previous] }}
      </button>
      <button
        v-if="adjacent.next"
        type="button"
        class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        :disabled="isUpdating"
        :aria-label="`Marcar la solicitud n.º ${order.id} como ${ORDER_STATUS_LABELS[adjacent.next]}`"
        @click="emit('change-status', adjacent.next)"
      >
        {{ ORDER_STATUS_LABELS[adjacent.next] }} →
      </button>
    </footer>
  </article>
</template>