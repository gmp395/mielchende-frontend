<script setup>
/*
 * Etiqueta con el estado del producto (Disponible / Próximamente / Agotado).
 * El texto sale de las constantes, nunca escrito a mano.
 */
import { computed } from 'vue'
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '@/constants/productStatus'

const props = defineProps({
  status: { type: String, required: true },
})

/*
 * Estilo de cada estado:
 * - Disponible: verde suave.
 * - Próximamente: borde dorado sobre fondo claro, con texto oscuro para que se lea bien.
 * - Agotado: gris.
 */
const STATUS_CLASSES = {
  [PRODUCT_STATUS.AVAILABLE]: 'bg-accent text-accent-foreground',
  [PRODUCT_STATUS.COMING_SOON]: 'border border-primary/60 bg-card text-foreground',
  [PRODUCT_STATUS.SOLD_OUT]: 'bg-muted text-muted-foreground',
}

/* Si llegara un estado desconocido, se muestra tal cual en vez de quedar vacío */
const label = computed(() => PRODUCT_STATUS_LABELS[props.status] ?? props.status)

/* Un estado desconocido se pinta como agotado: el aspecto más neutro */
const statusClass = computed(
  () => STATUS_CLASSES[props.status] ?? STATUS_CLASSES[PRODUCT_STATUS.SOLD_OUT],
)
</script>

<template>
  <span
    :class="[
      'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      statusClass,
    ]"
  >
    {{ label }}
  </span>
</template>