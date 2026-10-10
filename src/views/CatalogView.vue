<script setup>
/*
 * Catálogo de productos.
 * Pide los productos al crearse el componente (fase de creación del ciclo de vida)
 * y muestra uno de estos estados: cargando, error, vacío o la lista.
 */
import { ref } from 'vue'
import { productRepository } from '@/api/productRepository'
import ProductCard from '@/components/catalog/ProductCard.vue'

const products = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadProducts() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    products.value = await productRepository.getAll()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadProducts()
</script>

<template>
  <section class="container-page py-16">
    <header class="max-w-2xl">
      <p class="eyebrow">Nuestra cosecha</p>
      <h1 class="mt-3 text-4xl">Catálogo</h1>
      <p class="mt-4 text-muted-foreground">
        Hacemos una única cosecha al año, así que la disponibilidad de cada producto depende de la
        temporada. Elige un producto para ver sus detalles y enviarnos tu solicitud.
      </p>
    </header>

    <!-- aria-live: el lector de pantalla anuncia los cambios de estado (cargando, error...) -->
    <div class="mt-10" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando productos…</p>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadProducts"
        >
          Reintentar
        </button>
      </div>

      <p v-else-if="products.length === 0" class="text-muted-foreground">
        Ahora mismo no hay productos en el catálogo.
      </p>

      <!-- Rejilla responsive: 1 columna en móvil, 2 desde sm, 3 desde lg -->
      <ul v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="product in products" :key="product.id">
          <ProductCard :product="product" />
        </li>
      </ul>
    </div>
  </section>
</template>