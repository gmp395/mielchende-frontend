<script setup>
/*
 * Etiqueta con el estado del producto (Disponible / Agotado).
 * El texto sale de las constantes, nunca escrito a mano.
 */
import { computed } from 'vue'
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '@/constants/productStatus'

const props = defineProps({
  status: { type: String, required: true },
})

/* Si llegara un estado desconocido, se muestra tal cual en vez de quedar vacío */
const label = computed(() => PRODUCT_STATUS_LABELS[props.status] ?? props.status)
const isAvailable = computed(() => props.status === PRODUCT_STATUS.AVAILABLE)
</script>

<template>
  <!-- Verde suave si está disponible; gris si está agotado -->
  <span
    :class="[
      'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      isAvailable ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground',
    ]"
  >
    {{ label }}
  </span>
</template>