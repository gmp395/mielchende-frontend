<script setup>
/*
 * Diálogo de confirmación reutilizable para acciones que no se pueden deshacer.
 * No hace la acción: emite "confirm" o "cancel" y el componente padre decide.
 * El padre lo muestra con v-if, así que se monta al abrirse y se desmonta al cerrarse.
 * Accesibilidad: role="dialog" + aria-modal, foco inicial en "Cancelar"
 * (la opción segura) y cierre con Escape.
 */
import { onMounted, onUnmounted, ref, useId } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  /* true mientras se ejecuta la acción: desactiva los botones */
  isProcessing: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])

/* Ids únicos para enlazar el título y el texto con el diálogo */
const titleId = useId()
const messageId = useId()

/* Referencia al botón de cancelar, para enfocarlo al abrir */
const cancelButtonRef = ref(null)

/* Escape equivale a cancelar, salvo mientras se procesa la acción */
function handleKeydown(event) {
  if (event.key === 'Escape' && !props.isProcessing) {
    emit('cancel')
  }
}

/*
 * Ciclo de vida: al montarse, enfocamos "Cancelar" y escuchamos Escape;
 * al desmontarse, quitamos el listener para no dejarlo colgado.
 */
onMounted(() => {
  cancelButtonRef.value?.focus()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <!-- Fondo oscurecido que cubre toda la pantalla, por encima de la cabecera (z-50) -->
  <div class="fixed inset-0 z-60 flex items-center justify-center bg-foreground/40 p-5">
    <div
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="messageId"
      class="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card sm:p-8"
    >
      <h2 :id="titleId" class="text-2xl">{{ title }}</h2>
      <p :id="messageId" class="mt-3 text-muted-foreground">{{ message }}</p>

      <!-- En móvil, los botones apilados; desde sm, en fila a la derecha -->
      <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          ref="cancelButtonRef"
          type="button"
          class="rounded-md border border-border px-5 py-2.5 transition-colors hover:bg-secondary disabled:opacity-50"
          :disabled="isProcessing"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="rounded-md bg-destructive px-5 py-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          :disabled="isProcessing"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>