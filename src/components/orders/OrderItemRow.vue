<script setup>
/*
 * Una línea de la solicitud: producto y cantidad.
 * defineModel con nombre: el padre la usa con v-model:product-id y v-model:quantity.
 */
import { computed } from 'vue'
import { Trash2 } from '@lucide/vue'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  /* Posición de la línea (0, 1, 2...): se usa para los id y los textos */
  index: { type: Number, required: true },
  /* Productos que se pueden elegir en esta línea */
  products: { type: Array, required: true },
  canRemove: { type: Boolean, default: false },
  productError: { type: String, default: '' },
  quantityError: { type: String, default: '' },
})

const emit = defineEmits(['remove'])

const productId = defineModel('productId', { type: Number, default: null })
const quantity = defineModel('quantity', { default: 1 })

/* id únicos por línea, para enlazar cada etiqueta con su campo */
const productFieldId = computed(() => `order-line-${props.index}-product`)
const quantityFieldId = computed(() => `order-line-${props.index}-quantity`)

/* Clases comunes de los campos, iguales que las de FormField */
const fieldClass =
  'mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive'
</script>

<template>
  <!-- fieldset + legend: agrupa los campos de la línea para el lector de pantalla -->
  <fieldset class="rounded-lg border border-border p-4">
    <legend class="px-1 text-sm text-muted-foreground">Producto {{ index + 1 }}</legend>

    <!-- En móvil, apilado; desde sm, producto | cantidad | quitar en una fila -->
    <div class="grid gap-4 sm:grid-cols-[1fr_8rem_auto] sm:items-start">
      <div>
        <label :for="productFieldId" class="block text-sm font-medium">Producto</label>
        <select
          :id="productFieldId"
          v-model="productId"
          :aria-invalid="productError ? 'true' : 'false'"
          :aria-describedby="productError ? `${productFieldId}-error` : undefined"
          :class="fieldClass"
        >
          <option :value="null" disabled>Elige un producto</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }} · {{ product.format }} · {{ formatPrice(product.price) }}
          </option>
        </select>
        <p v-if="productError" :id="`${productFieldId}-error`" class="mt-1.5 text-sm text-destructive">
          {{ productError }}
        </p>
      </div>

      <div>
        <label :for="quantityFieldId" class="block text-sm font-medium">Cantidad</label>
        <!-- v-model.number: convierte lo escrito en número -->
        <input
          :id="quantityFieldId"
          v-model.number="quantity"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          :aria-invalid="quantityError ? 'true' : 'false'"
          :aria-describedby="quantityError ? `${quantityFieldId}-error` : undefined"
          :class="fieldClass"
        />
        <p v-if="quantityError" :id="`${quantityFieldId}-error`" class="mt-1.5 text-sm text-destructive">
          {{ quantityError }}
        </p>
      </div>

      <!-- Quitar la línea: solo si hay más de una -->
      <button
        v-if="canRemove"
        type="button"
        :aria-label="`Quitar el producto ${index + 1}`"
        class="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive sm:mt-7"
        @click="emit('remove')"
      >
        <Trash2 class="size-5" aria-hidden="true" />
      </button>
    </div>
  </fieldset>
</template>