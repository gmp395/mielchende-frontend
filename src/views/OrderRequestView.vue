<script setup>
/*
 * Formulario de solicitud de pedido.
 * Carga los productos disponibles, permite elegir una o varias líneas
 * (producto + cantidad), teléfono y comentarios opcionales, y envía la solicitud.
 * No hay pago online: el negocio revisa la solicitud y contacta con el cliente.
 */
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Plus } from '@lucide/vue'
import { productRepository } from '@/api/productRepository'
import { orderRepository } from '@/api/orderRepository'
import { orderMapper } from '@/mappers/orderMapper'
import { PRODUCT_STATUS } from '@/constants/productStatus'
import {
  COMMENTS_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  validateMaxLength,
  validateQuantity,
} from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'
import OrderItemRow from '@/components/orders/OrderItemRow.vue'
import OrderConfirmationModal from '@/components/orders/OrderConfirmationModal.vue'

const route = useRoute()

/* Productos que se pueden solicitar (solo los disponibles) */
const availableProducts = ref([])
const isLoadingProducts = ref(true)
const loadError = ref('')

/*
 * Líneas de la solicitud. Cada una lleva un id propio (no la posición),
 * para que :key siga siendo estable al quitar líneas del medio.
 */
let nextLineId = 1
function createLine(productId = null) {
  return { id: nextLineId++, productId, quantity: 1 }
}
const lines = ref([createLine()])

/* Errores de cada línea, guardados por su id: { product, quantity } */
const lineErrors = ref({})

const contact = reactive({ phone: '', comments: '' })
const contactErrors = reactive({ phone: '', comments: '' })

const serverError = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)

/* Pide los productos al backend y se queda solo con los disponibles */
async function loadProducts() {
  const products = await productRepository.getAll()
  availableProducts.value = products.filter(
    (product) => product.status === PRODUCT_STATUS.AVAILABLE,
  )
}

/* Si la URL trae ?producto=ID y ese producto está disponible, se preselecciona */
function preselectFromQuery() {
  const requestedId = Number(route.query.producto)
  if (availableProducts.value.some((product) => product.id === requestedId)) {
    lines.value[0].productId = requestedId
  }
}

/* Carga inicial (fase de creación del componente) */
async function init() {
  isLoadingProducts.value = true
  loadError.value = ''
  try {
    await loadProducts()
    preselectFromQuery()
  } catch (error) {
    loadError.value = error.message
  } finally {
    isLoadingProducts.value = false
  }
}
init()

/* Productos que puede ofrecer una línea: todos los disponibles menos los elegidos en otras líneas */
function optionsForLine(line) {
  const chosenElsewhere = new Set(
    lines.value
      .filter((other) => other.id !== line.id && other.productId !== null)
      .map((other) => other.productId),
  )
  return availableProducts.value.filter((product) => !chosenElsewhere.has(product.id))
}

/* Solo se puede añadir otra línea si quedan productos sin elegir */
const canAddLine = computed(() => lines.value.length < availableProducts.value.length)

function addLine() {
  lines.value.push(createLine())
}

function removeLine(lineId) {
  lines.value = lines.value.filter((line) => line.id !== lineId)
  delete lineErrors.value[lineId]
}

/* Devuelve true si no hay errores */
function validate() {
  const errors = {}
  for (const line of lines.value) {
    const isProductAvailable = availableProducts.value.some((product) => product.id === line.productId)
    const productError = isProductAvailable ? '' : 'Elige un producto.'
    const quantityError = validateQuantity(line.quantity)
    if (productError || quantityError) {
      errors[line.id] = { product: productError, quantity: quantityError }
    }
  }
  lineErrors.value = errors

  contactErrors.phone = validateMaxLength(
    contact.phone,
    PHONE_MAX_LENGTH,
    `El teléfono no puede tener más de ${PHONE_MAX_LENGTH} caracteres.`,
  )
  contactErrors.comments = validateMaxLength(
    contact.comments,
    COMMENTS_MAX_LENGTH,
    `Los comentarios no pueden tener más de ${COMMENTS_MAX_LENGTH} caracteres.`,
  )

  return Object.keys(errors).length === 0 && !contactErrors.phone && !contactErrors.comments
}

async function handleSubmit() {
  serverError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    await orderRepository.create(orderMapper.toCreateDto(lines.value, contact))
    isSubmitted.value = true
  } catch (error) {
    if (error.status === 409) {
      /* Algún producto se agotó mientras se rellenaba el formulario: recargamos la lista */
      serverError.value =
        'Alguno de los productos se acaba de agotar. Hemos actualizado la lista: revisa tu solicitud y vuelve a enviarla.'
      try {
        await loadProducts()
      } catch {
        /* Si la recarga falla, el mensaje anterior ya pide revisar la solicitud */
      }
    } else if (error.status === 400) {
      serverError.value = 'Revisa los datos del formulario.'
    } else {
      serverError.value = error.message
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="container-page max-w-3xl py-12">
    <header>
      <p class="eyebrow">Solicitud de pedido</p>
      <h1 class="mt-3 text-4xl">Solicitar productos</h1>
      <p class="mt-4 text-muted-foreground">
        Elige los productos y las cantidades. No hay pago online: revisaremos tu solicitud y nos
        pondremos en contacto contigo para confirmarla.
      </p>
    </header>

    <div class="mt-10" aria-live="polite">
      <p v-if="isLoadingProducts" class="text-muted-foreground">Cargando productos…</p>

      <div v-else-if="loadError" role="alert" class="rounded-lg bg-destructive/10 p-5">
        <p class="text-destructive">{{ loadError }}</p>
        <button
          type="button"
          class="mt-3 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          @click="init"
        >
          Reintentar
        </button>
      </div>

      <div v-else-if="availableProducts.length === 0">
        <p class="text-muted-foreground">
          Ahora mismo no hay productos disponibles. Vuelve a consultarlo en la próxima temporada.
        </p>
        <RouterLink to="/catalogo" class="mt-4 inline-block text-primary hover:underline">
          Volver al catálogo
        </RouterLink>
      </div>

      <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
      <form v-else novalidate class="space-y-6" @submit.prevent="handleSubmit">
        <OrderItemRow
          v-for="(line, index) in lines"
          :key="line.id"
          v-model:product-id="line.productId"
          v-model:quantity="line.quantity"
          :index="index"
          :products="optionsForLine(line)"
          :can-remove="lines.length > 1"
          :product-error="lineErrors[line.id]?.product ?? ''"
          :quantity-error="lineErrors[line.id]?.quantity ?? ''"
          @remove="removeLine(line.id)"
        />

        <button
          type="button"
          :disabled="!canAddLine"
          class="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-50"
          @click="addLine"
        >
          <Plus class="size-4" aria-hidden="true" />
          Añadir otro producto
        </button>

        <FormField
          id="order-phone"
          v-model="contact.phone"
          label="Teléfono"
          type="tel"
          autocomplete="tel"
          hint="Opcional. Por si necesitamos contactarte."
          :error="contactErrors.phone"
        />

        <div>
          <label for="order-comments" class="block text-sm font-medium">Comentarios</label>
          <textarea
            id="order-comments"
            v-model="contact.comments"
            rows="4"
            :aria-invalid="contactErrors.comments ? 'true' : 'false'"
            :aria-describedby="contactErrors.comments ? 'order-comments-error' : 'order-comments-hint'"
            class="mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
          ></textarea>
          <p v-if="contactErrors.comments" id="order-comments-error" class="mt-1.5 text-sm text-destructive">
            {{ contactErrors.comments }}
          </p>
          <p v-else id="order-comments-hint" class="mt-1.5 text-sm text-muted-foreground">
            Opcional. {{ contact.comments.length }}/{{ COMMENTS_MAX_LENGTH }} caracteres.
          </p>
        </div>

        <!-- role="alert": el lector de pantalla anuncia el error en cuanto aparece -->
        <p v-if="serverError" role="alert" class="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ serverError }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-md bg-primary px-4 py-3 text-base text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {{ isSubmitting ? 'Enviando…' : 'Enviar solicitud' }}
        </button>
      </form>
    </div>

    <OrderConfirmationModal v-if="isSubmitted" />
  </section>
</template>