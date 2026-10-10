<script setup>
/*
 * Ficha de un producto.
 * Un watcher sobre el id de la URL pide el producto al entrar
 * y cada vez que el id cambia (sin salir de la vista).
 */
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import { productRepository } from '@/api/productRepository'
import { useAuthStore } from '@/stores/auth'
import { PRODUCT_STATUS } from '@/constants/productStatus'
import { formatPrice } from '@/utils/format'
import ProductImage from '@/components/catalog/ProductImage.vue'
import ProductStatusBadge from '@/components/catalog/ProductStatusBadge.vue'

const route = useRoute()
const authStore = useAuthStore()

const product = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const notFound = ref(false)

const isAvailable = computed(() => product.value?.status === PRODUCT_STATUS.AVAILABLE)

async function loadProduct(id) {
  isLoading.value = true
  errorMessage.value = ''
  notFound.value = false
  product.value = null
  try {
    product.value = await productRepository.getById(id)
  } catch (error) {
    /* 404 (no existe) o 400 (id no válido): lo tratamos como "no encontrado" */
    if (error.status === 404 || error.status === 400) {
      notFound.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}

/* immediate: se ejecuta también la primera vez, al entrar en la vista */
watch(
  () => route.params.id,
  (id) => {
    if (id) loadProduct(id)
  },
  { immediate: true },
)
</script>

<template>
  <section class="container-page py-12">
    <RouterLink
      to="/catalogo"
      class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <ArrowLeft class="size-4" aria-hidden="true" />
      Volver al catálogo
    </RouterLink>

    <div class="mt-8" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando producto…</p>

      <div v-else-if="notFound">
        <h1 class="text-3xl">Producto no encontrado</h1>
        <p class="mt-3 text-muted-foreground">
          Puede que ya no esté en el catálogo. Vuelve al catálogo para ver los productos disponibles.
        </p>
      </div>

      <div v-else-if="errorMessage" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ errorMessage }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="loadProduct(route.params.id)"
        >
          Reintentar
        </button>
      </div>

      <!-- Ficha: imagen y datos en dos columnas desde md; apilados en móvil -->
      <article v-else-if="product" class="grid gap-10 md:grid-cols-2">
        <div class="overflow-hidden rounded-xl border border-border">
          <ProductImage :image-url="product.imageUrl" :alt="product.name" />
        </div>

        <div>
          <ProductStatusBadge :status="product.status" />
          <h1 class="mt-3 text-4xl">{{ product.name }}</h1>
          <p class="mt-2 text-muted-foreground">{{ product.format }}</p>
          <p class="mt-6 text-2xl text-primary">{{ formatPrice(product.price) }}</p>

          <p v-if="product.description" class="mt-6 leading-relaxed">{{ product.description }}</p>

          <!-- Información de temporada (enjambres, reinas, núcleos...) -->
          <p v-if="product.seasonInfo" class="mt-6 rounded-lg bg-honey-soft px-4 py-3 text-sm">
            {{ product.seasonInfo }}
          </p>

          <div class="mt-8">
            <!--
              Disponible: enlace al formulario de solicitud con el producto preseleccionado.
              Si no hay sesión, el guard llevará al login y después volverá aquí.
            -->
            <template v-if="isAvailable">
              <RouterLink
                :to="{ name: 'order-request', query: { producto: product.id } }"
                class="inline-flex rounded-md bg-primary px-6 py-3 text-base text-primary-foreground transition-opacity hover:opacity-90"
              >
                Solicitar este producto
              </RouterLink>
              <p v-if="!authStore.isAuthenticated" class="mt-3 text-sm text-muted-foreground">
                Para enviar una solicitud necesitas iniciar sesión o crear una cuenta.
              </p>
            </template>
            <p v-else class="text-muted-foreground">
              Agotado hasta la próxima cosecha.
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>