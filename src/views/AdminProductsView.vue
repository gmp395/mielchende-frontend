<script setup>
/*
 * Panel de administración — Productos.
 * Lista todo el catálogo y permite crear, editar, cambiar la disponibilidad
 * y borrar productos. El borrado pide confirmación; si el producto tiene
 * solicitudes, el backend responde 409 y se ofrece marcarlo como agotado.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { productRepository } from '@/api/productRepository'
import { adminProductRepository } from '@/api/adminProductRepository'
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '@/constants/productStatus'
import { formatPrice } from '@/utils/format'
import ProductImage from '@/components/catalog/ProductImage.vue'
import ProductStatusBadge from '@/components/catalog/ProductStatusBadge.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const products = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

/* Id del producto cuyo estado se está guardando (para desactivar su botón) */
const updatingProductId = ref(null)

/* Producto pendiente de confirmar el borrado (null = diálogo cerrado) */
const productToDelete = ref(null)
const isDeleting = ref(false)

/* Mensaje tras una acción: confirmación o aviso */
const actionMessage = ref('')
const actionIsError = ref(false)
/* Producto que no se pudo borrar por tener solicitudes (409) */
const conflictProduct = ref(null)

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

function showMessage(message, isError = false) {
  actionMessage.value = message
  actionIsError.value = isError
}

/* Estado contrario al actual: disponible ↔ agotado */
function oppositeStatus(product) {
  return product.status === PRODUCT_STATUS.AVAILABLE
    ? PRODUCT_STATUS.SOLD_OUT
    : PRODUCT_STATUS.AVAILABLE
}

/*
 * Cambia la disponibilidad con un clic (PATCH).
 * Se sustituye el producto por la versión que devuelve el backend.
 */
async function toggleStatus(product) {
  updatingProductId.value = product.id
  conflictProduct.value = null
  try {
    const updated = await adminProductRepository.updateStatus(product.id, oppositeStatus(product))
    products.value = products.value.map((item) => (item.id === updated.id ? updated : item))
    showMessage(`${updated.name} (${updated.format}): ${PRODUCT_STATUS_LABELS[updated.status]}.`)
  } catch (error) {
    showMessage(error.message, true)
  } finally {
    updatingProductId.value = null
  }
}

/* Abre el diálogo de confirmación para ese producto */
function askDelete(product) {
  conflictProduct.value = null
  actionMessage.value = ''
  productToDelete.value = product
}

/*
 * Borrado confirmado.
 * 409: el producto tiene solicitudes; no se puede borrar sin romper el historial,
 * así que se explica el motivo y se ofrece marcarlo como agotado.
 */
async function confirmDelete() {
  const product = productToDelete.value
  isDeleting.value = true
  try {
    await adminProductRepository.delete(product.id)
    products.value = products.value.filter((item) => item.id !== product.id)
    showMessage(`${product.name} (${product.format}) se ha borrado.`)
  } catch (error) {
    if (error.status === 409) {
      showMessage(
        `${product.name} (${product.format}) no se puede borrar porque tiene solicitudes asociadas.`,
        true,
      )
      /* Solo tiene sentido ofrecer el atajo si todavía está disponible */
      if (product.status === PRODUCT_STATUS.AVAILABLE) conflictProduct.value = product
    } else {
      showMessage(error.message, true)
    }
  } finally {
    isDeleting.value = false
    productToDelete.value = null
  }
}

/* Petición inicial: directamente en <script setup>, al crearse el componente */
loadProducts()
</script>

<template>
  <section>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h2 class="text-2xl">Productos</h2>
      <RouterLink
        :to="{ name: 'admin-product-new' }"
        class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
      >
        Nuevo producto
      </RouterLink>
    </div>

    <!-- aria-live: el lector de pantalla anuncia carga, errores y confirmaciones -->
    <div class="mt-6" aria-live="polite">
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

      <template v-else>
        <!-- Confirmación o aviso tras una acción; ante un 409, con atajo para agotar -->
        <div
          v-if="actionMessage"
          :role="actionIsError ? 'alert' : 'status'"
          :class="[
            'mb-6 rounded-lg p-4 text-sm',
            actionIsError ? 'bg-destructive/10 text-destructive' : 'bg-secondary',
          ]"
        >
          <p>{{ actionMessage }}</p>
          <button
            v-if="conflictProduct"
            type="button"
            class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-foreground hover:bg-secondary"
            @click="toggleStatus(conflictProduct)"
          >
            Marcar como agotado
          </button>
        </div>

        <p v-if="products.length === 0" class="text-muted-foreground">
          Todavía no hay productos en el catálogo.
        </p>

        <ul v-else class="divide-y divide-border rounded-xl border border-border bg-card">
          <li
            v-for="product in products"
            :key="product.id"
            class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
          >
            <!-- Miniatura: ProductImage ocupa todo el ancho de su contenedor -->
            <div class="size-16 shrink-0 overflow-hidden rounded-md">
              <ProductImage :image-url="product.imageUrl" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="font-medium">
                {{ product.name }}
                <span class="text-muted-foreground">· {{ product.format }}</span>
              </p>
              <div class="mt-1 flex items-center gap-3 text-sm">
                <span>{{ formatPrice(product.price) }}</span>
                <ProductStatusBadge :status="product.status" />
              </div>
            </div>

            <!--
              Acciones. El aria-label incluye el producto, porque con varias filas
              un lector de pantalla oiría muchos botones con el mismo texto.
            -->
            <div class="flex flex-wrap gap-2">
              <RouterLink
                :to="{ name: 'admin-product-edit', params: { id: product.id } }"
                class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                :aria-label="`Editar ${product.name} (${product.format})`"
              >
                Editar
              </RouterLink>
              <button
                type="button"
                class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary disabled:opacity-50"
                :disabled="updatingProductId === product.id"
                :aria-label="`Marcar ${product.name} (${product.format}) como ${PRODUCT_STATUS_LABELS[oppositeStatus(product)].toLowerCase()}`"
                @click="toggleStatus(product)"
              >
                Marcar como {{ PRODUCT_STATUS_LABELS[oppositeStatus(product)].toLowerCase() }}
              </button>
              <button
                type="button"
                class="rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                :aria-label="`Borrar ${product.name} (${product.format})`"
                @click="askDelete(product)"
              >
                Borrar
              </button>
            </div>
          </li>
        </ul>
      </template>
    </div>

    <ConfirmDialog
      v-if="productToDelete"
      title="¿Borrar este producto?"
      :message="`Se borrará ${productToDelete.name} (${productToDelete.format}) del catálogo. Esta acción no se puede deshacer.`"
      confirm-label="Borrar"
      :is-processing="isDeleting"
      @confirm="confirmDelete"
      @cancel="productToDelete = null"
    />
  </section>
</template>