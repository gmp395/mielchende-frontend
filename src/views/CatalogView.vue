<script setup>
/*
 * Catálogo de productos.
 * Pide los productos al crearse el componente (fase de creación del ciclo de vida)
 * y muestra uno de estos estados: cargando, error, vacío o la lista.
 * La lista se puede filtrar por categoría.
 */
import { computed, ref } from 'vue'
import { productRepository } from '@/api/productRepository'
import { PRODUCT_CATEGORY, PRODUCT_CATEGORY_LABELS } from '@/constants/productCategory'
import ProductCard from '@/components/catalog/ProductCard.vue'
import { sortByCategory } from '@/utils/sortProducts'

const products = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

/* Categoría elegida en el filtro; null = todas */
const selectedCategory = ref(null)

/* Opciones del filtro: "Todos" más una por categoría, en el orden de las constantes */
const filterOptions = [
  { value: null, label: 'Todos' },
  ...Object.values(PRODUCT_CATEGORY).map((category) => ({
    value: category,
    label: PRODUCT_CATEGORY_LABELS[category],
  })),
]

/* Lista que se pinta: todos los productos o solo los de la categoría elegida */
const filteredProducts = computed(() =>
  selectedCategory.value === null
    ? products.value
    : products.value.filter((product) => product.category === selectedCategory.value),
)

/* Lo que anuncia el lector de pantalla al cambiar de filtro */
const resultsMessage = computed(() => {
  const count = filteredProducts.value.length
  return count === 1 ? 'Se muestra 1 producto.' : `Se muestran ${count} productos.`
})

async function loadProducts() {
  isLoading.value = true
  errorMessage.value = ''
  try {
        /* Ordenados por categoría: primero las mieles */
    products.value = sortByCategory(await productRepository.getAll())
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

    <!--
      Mensajes de estado. aria-live: el lector de pantalla anuncia los cambios
      (cargando, error...). La lista queda fuera para que no la lea entera
      cada vez que se cambia de filtro.
    -->
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

      <!-- Solo para lectores de pantalla: cuántos productos hay tras filtrar -->
      <p v-else class="sr-only">{{ resultsMessage }}</p>
    </div>

    <template v-if="!isLoading && !errorMessage && products.length > 0">
      <!--
        Filtros por categoría. aria-pressed indica qué botón está activo,
        igual que un interruptor encendido o apagado.
      -->
      <div role="group" aria-label="Filtrar por categoría" class="flex flex-wrap gap-2">
        <button
          v-for="option in filterOptions"
          :key="option.value ?? 'all'"
          type="button"
          :aria-pressed="selectedCategory === option.value ? 'true' : 'false'"
          :class="[
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            selectedCategory === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card hover:bg-secondary',
          ]"
          @click="selectedCategory = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <p v-if="filteredProducts.length === 0" class="mt-8 text-muted-foreground">
        No hay productos en esta categoría.
      </p>

      <!-- Rejilla responsive: 1 columna en móvil, 2 desde sm, 3 desde lg -->
      <ul v-else class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="product in filteredProducts" :key="product.id">
          <ProductCard :product="product" />
        </li>
      </ul>
    </template>
  </section>
</template>