<script setup>
/*
 * Mis solicitudes: historial de solicitudes del cliente con su estado.
 * Ruta protegida (requiresAuth). El backend devuelve solo las del usuario
 * del token, de la más reciente a la más antigua.
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { orderRepository } from '@/api/orderRepository'
import OrderCard from '@/components/orders/OrderCard.vue'

const orders = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadOrders() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    orders.value = await orderRepository.getMine()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadOrders()
</script>

<template>
  <section class="container-page max-w-3xl py-12">
    <header>
      <p class="eyebrow">Área de cliente</p>
      <h1 class="mt-3 text-4xl">Mis solicitudes</h1>
      <p class="mt-4 text-muted-foreground">
        Aquí puedes seguir el estado de tus solicitudes de pedido.
      </p>
    </header>

    <!-- aria-live: el lector de pantalla anuncia los cambios de estado (cargando, error...) -->
    <div class="mt-10" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando solicitudes…</p>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadOrders"
        >
          Reintentar
        </button>
      </div>

      <div v-else-if="orders.length === 0">
        <p class="text-muted-foreground">Todavía no has enviado ninguna solicitud.</p>
        <RouterLink
          to="/catalogo"
          class="mt-4 inline-flex rounded-md bg-primary px-5 py-3 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver el catálogo
        </RouterLink>
      </div>

      <ul v-else class="space-y-6">
        <li v-for="order in orders" :key="order.id">
          <OrderCard :order="order" />
        </li>
      </ul>
    </div>
  </section>
</template>