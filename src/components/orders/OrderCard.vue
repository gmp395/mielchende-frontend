<script setup>
/*
 * Tarjeta de una solicitud del cliente: número, fecha, progreso del estado,
 * productos solicitados y, si los hay, teléfono y comentarios.
 */
import { formatDate } from '@/utils/format'
import { ORDER_STATUS_DESCRIPTIONS } from '@/constants/orderStatus'
import OrderStatusSteps from '@/components/orders/OrderStatusSteps.vue'

defineProps({
  order: { type: Object, required: true },
})
</script>

<template>
  <article class="rounded-xl border border-border bg-card p-5 sm:p-6">
    <header class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="text-xl">Solicitud n.º {{ order.id }}</h2>
      <!-- time + datetime: fecha legible para personas y en formato máquina para el navegador -->
      <p class="text-sm text-muted-foreground">
        <time :datetime="order.createdAt">{{ formatDate(order.createdAt) }}</time>
      </p>
    </header>

    <div class="mt-5">
      <OrderStatusSteps :status="order.status" />
    </div>
    <p class="mt-3 text-sm text-muted-foreground">{{ ORDER_STATUS_DESCRIPTIONS[order.status] }}</p>

    <!-- Productos solicitados, separados por líneas finas -->
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

    <!-- dl: lista de pares "dato: valor"; solo si hay teléfono o comentarios -->
    <dl v-if="order.phone || order.comments" class="mt-4 space-y-2 text-sm">
      <div v-if="order.phone">
        <dt class="inline text-muted-foreground">Teléfono: </dt>
        <dd class="inline">{{ order.phone }}</dd>
      </div>
      <div v-if="order.comments">
        <dt class="text-muted-foreground">Comentarios</dt>
        <!-- whitespace-pre-line: respeta los saltos de línea que escribió el cliente -->
        <dd class="mt-1 whitespace-pre-line">{{ order.comments }}</dd>
      </div>
    </dl>
  </article>
</template>