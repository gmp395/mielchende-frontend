<script setup>
/*
 * Modal que confirma que la solicitud se ha enviado.
 * Al abrirse pone el foco en la acción principal (accesibilidad con teclado)
 * y se cierra con Escape, volviendo al catálogo.
 */
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleCheck } from '@lucide/vue'

const router = useRouter()

/* Referencia al enlace principal, para enfocarlo al abrir el modal */
const primaryActionRef = ref(null)

function handleKeydown(event) {
  if (event.key === 'Escape') {
    router.push('/catalogo')
  }
}

/*
 * Ciclo de vida: al montarse, enfocamos el botón principal y escuchamos Escape;
 * al desmontarse, quitamos el listener.
 * $el: el elemento <a> real que genera RouterLink.
 */
onMounted(() => {
  primaryActionRef.value?.$el?.focus()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <!-- Fondo oscurecido que cubre toda la pantalla, por encima de la cabecera (z-50) -->
  <div class="fixed inset-0 z-60 flex items-center justify-center bg-foreground/40 p-5">
    <!--
      role="dialog" + aria-modal: el lector de pantalla lo trata como una ventana modal.
      aria-labelledby / aria-describedby: título y texto que se anuncian al abrirlo.
    -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
      aria-describedby="order-confirmation-text"
      class="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-card sm:p-8"
    >
      <CircleCheck class="mx-auto size-12 text-primary" aria-hidden="true" />
      <h2 id="order-confirmation-title" class="mt-4 text-3xl">Solicitud enviada</h2>
      <p id="order-confirmation-text" class="mt-3 text-muted-foreground">
        Hemos recibido tu solicitud. Puedes seguir su estado en Mis solicitudes.
      </p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          ref="primaryActionRef"
          to="/mis-solicitudes"
          class="rounded-md bg-primary px-5 py-3 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver mis solicitudes
        </RouterLink>
        <RouterLink
          to="/catalogo"
          class="rounded-md border border-border px-5 py-3 transition-colors hover:bg-secondary"
        >
          Volver al catálogo
        </RouterLink>
      </div>
    </div>
  </div>
</template>