<script setup>
/*
 * Barra de progreso de una solicitud: Recibido → Confirmado → Enviado.
 * Los pasos ya alcanzados se pintan en color miel; el actual lleva aria-current.
 */
import { computed } from 'vue'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '@/constants/orderStatus'

const props = defineProps({
  status: { type: String, required: true },
})

/* Posición del estado actual dentro del ciclo (0, 1 o 2) */
const currentIndex = computed(() => ORDER_STATUS_FLOW.indexOf(props.status))
</script>

<template>
  <!-- ol: lista ordenada, porque los pasos tienen un orden fijo -->
  <ol class="flex items-center gap-2" aria-label="Progreso de la solicitud">
    <li
      v-for="(step, index) in ORDER_STATUS_FLOW"
      :key="step"
      class="flex items-center gap-2"
      :class="{ 'flex-1': index < ORDER_STATUS_FLOW.length - 1 }"
      :aria-current="index === currentIndex ? 'step' : undefined"
    >
      <span
        :class="[
          'flex size-6 shrink-0 items-center justify-center rounded-full text-xs',
          index <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        ]"
        aria-hidden="true"
      >
        {{ index + 1 }}
      </span>
      <span
        :class="[
          'text-xs sm:text-sm',
          index <= currentIndex ? 'text-foreground' : 'text-muted-foreground',
        ]"
      >
        {{ ORDER_STATUS_LABELS[step] }}
      </span>
      <!-- Línea que une un paso con el siguiente (decorativa) -->
      <span
        v-if="index < ORDER_STATUS_FLOW.length - 1"
        :class="['h-px flex-1', index < currentIndex ? 'bg-primary' : 'bg-border']"
        aria-hidden="true"
      ></span>
    </li>
  </ol>
</template>