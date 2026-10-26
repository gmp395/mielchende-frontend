<script setup>
/*
 * Panel de administración — Mensajes del formulario de contacto.
 * Solo lectura: el admin responde por su cuenta, desde su correo.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { ref } from 'vue'
import { adminContactRepository } from '@/api/adminContactRepository'
import { formatDate } from '@/utils/format'

const messages = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadMessages() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    messages.value = await adminContactRepository.getAll()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadMessages()
</script>

<template>
  <section>
    <h2 class="text-2xl">Mensajes</h2>
    <p class="mt-1 text-sm text-muted-foreground">
      Consultas recibidas desde el formulario de Contacto, de la más reciente a la más antigua.
    </p>

    <!-- aria-live: el lector de pantalla anuncia la carga y los errores -->
    <div class="mt-6" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando mensajes…</p>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadMessages"
        >
          Reintentar
        </button>
      </div>

      <p v-else-if="messages.length === 0" class="text-muted-foreground">
        Todavía no hay mensajes.
      </p>

      <ul v-else class="space-y-4">
        <li
          v-for="message in messages"
          :key="message.id"
          class="rounded-xl border border-border bg-card p-5"
        >
          <article>
            <header class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="font-medium">{{ message.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ formatDate(message.createdAt) }}</p>
            </header>
            <!-- whitespace-pre-line: respeta los saltos de línea del mensaje.
                 Se muestra con {{ }}, nunca con v-html (riesgo XSS) -->
            <p class="mt-3 whitespace-pre-line">{{ message.message }}</p>
            <!-- Abre el correo de quien escribe para responderle -->
            <a
              :href="`mailto:${message.email}`"
              class="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Responder a {{ message.email }}
            </a>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>