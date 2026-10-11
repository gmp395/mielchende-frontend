<script setup>
/*
 * Panel de administración — Formulario de producto.
 * Una sola vista para crear (/admin/productos/nuevo) y editar
 * (/admin/productos/:id/editar): si la URL trae id, está editando.
 * El mapper traduce entre el formulario (texto) y el DTO de la API.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { nextTick, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { productRepository } from '@/api/productRepository'
import { adminProductRepository } from '@/api/adminProductRepository'
import { productMapper } from '@/mappers/productMapper'
import { PRODUCT_STATUS, PRODUCT_STATUS_LABELS } from '@/constants/productStatus'
import {
  PRODUCT_TEXT_MAX_LENGTH,
  validateMaxLength,
  validatePrice,
  validateRequired,
} from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'
import ProductImage from '@/components/catalog/ProductImage.vue'

const route = useRoute()
const router = useRouter()

/* Id del producto si estamos editando; undefined si estamos creando */
const productId = route.params.id
const isEdit = Boolean(productId)

const form = ref(productMapper.emptyForm())

/* Un mensaje de error por campo (vacío = sin error) */
const errors = reactive({
  name: '',
  format: '',
  price: '',
  description: '',
  imageUrl: '',
  seasonInfo: '',
})

/*
 * Id de cada campo en el HTML, en el orden en que aparecen.
 * Se usa para poner el foco en el primer campo con error.
 */
const FIELD_IDS = {
  name: 'product-name',
  format: 'product-format',
  price: 'product-price',
  description: 'product-description',
  imageUrl: 'product-image-url',
  seasonInfo: 'product-season-info',
}

const isLoading = ref(isEdit)
const loadError = ref('')
const isSaving = ref(false)
const submitError = ref('')

const tooLongMessage = `Como máximo ${PRODUCT_TEXT_MAX_LENGTH} caracteres.`

/* Solo al editar: carga el producto y lo convierte en datos de formulario */
async function loadProduct() {
  isLoading.value = true
  loadError.value = ''
  try {
    const product = await productRepository.getById(productId)
    form.value = productMapper.toForm(product)
  } catch (error) {
    loadError.value =
      error.status === 404 ? 'Este producto no existe o ya se ha borrado.' : error.message
  } finally {
    isLoading.value = false
  }
}

/* Aplica las reglas de validation.js; devuelve true si no hay ningún error */
function validate() {
  const values = form.value
  errors.name =
    validateRequired(values.name, 'Introduce el nombre.') ||
    validateMaxLength(values.name, PRODUCT_TEXT_MAX_LENGTH, tooLongMessage)
  errors.format =
    validateRequired(values.format, 'Introduce el formato, por ejemplo 500 g.') ||
    validateMaxLength(values.format, PRODUCT_TEXT_MAX_LENGTH, tooLongMessage)
  errors.price = validatePrice(values.price)
  errors.description = validateRequired(values.description, 'Introduce una descripción.')
  errors.imageUrl = validateMaxLength(values.imageUrl, PRODUCT_TEXT_MAX_LENGTH, tooLongMessage)
  errors.seasonInfo = validateMaxLength(values.seasonInfo, PRODUCT_TEXT_MAX_LENGTH, tooLongMessage)
  return Object.values(errors).every((message) => !message)
}

/*
 * Lleva el foco al primer campo con error.
 * nextTick: espera a que Vue pinte los mensajes de error antes de mover el foco.
 */
async function focusFirstError() {
  await nextTick()
  const firstField = Object.keys(FIELD_IDS).find((field) => errors[field])
  if (firstField) document.getElementById(FIELD_IDS[firstField])?.focus()
}

async function handleSubmit() {
  submitError.value = ''
  if (!validate()) {
    focusFirstError()
    return
  }

  isSaving.value = true
  try {
    const dto = productMapper.toRequestDto(form.value)
    if (isEdit) {
      await adminProductRepository.update(productId, dto)
    } else {
      await adminProductRepository.create(dto)
    }
    /* Guardado: volvemos a la lista, que ya mostrará el producto actualizado */
    router.push({ name: 'admin-products' })
  } catch (error) {
    submitError.value = error.message
  } finally {
    isSaving.value = false
  }
}

/* Petición inicial solo al editar: directamente en <script setup> */
if (isEdit) loadProduct()
</script>

<template>
  <section class="max-w-2xl">
    <RouterLink
      :to="{ name: 'admin-products' }"
      class="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← Volver a productos
    </RouterLink>
    <h2 class="mt-4 text-2xl">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h2>

    <div class="mt-6" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando producto…</p>

      <p v-else-if="loadError" role="alert" class="rounded-lg bg-destructive/10 p-5 text-destructive">
        {{ loadError }}
      </p>

      <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
      <form v-else novalidate class="space-y-6" @submit.prevent="handleSubmit">
        <FormField
          id="product-name"
          v-model="form.name"
          label="Nombre"
          :error="errors.name"
          hint="Por ejemplo, Miel de castaño."
        />

        <FormField
          id="product-format"
          v-model="form.format"
          label="Formato"
          :error="errors.format"
          hint="Por ejemplo, 500 g o 1 kg."
        />

        <FormField
          id="product-price"
          v-model="form.price"
          label="Precio (€)"
          :error="errors.price"
          hint="Puedes usar coma o punto: 8,50."
        />

        <!-- Descripción: textarea con la misma accesibilidad que FormField -->
        <div>
          <label for="product-description" class="block text-sm font-medium">Descripción</label>
          <textarea
            id="product-description"
            v-model="form.description"
            rows="5"
            :aria-invalid="errors.description ? 'true' : 'false'"
            :aria-describedby="errors.description ? 'product-description-error' : undefined"
            class="mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
          ></textarea>
          <p
            v-if="errors.description"
            id="product-description-error"
            class="mt-1.5 text-sm text-destructive"
          >
            {{ errors.description }}
          </p>
        </div>

        <FormField
          id="product-image-url"
          v-model="form.imageUrl"
          type="url"
          label="URL de la imagen (opcional)"
          :error="errors.imageUrl"
          hint="Si se deja vacía, se mostrará la imagen por defecto."
        />

        <!-- Vista previa: lo mismo que verá el cliente en el catálogo -->
        <div class="flex items-center gap-4">
          <div class="size-20 shrink-0 overflow-hidden rounded-md border border-border">
            <ProductImage :image-url="form.imageUrl.trim() || null" />
          </div>
          <p class="text-sm text-muted-foreground">Vista previa de la imagen</p>
        </div>

        <FormField
          id="product-season-info"
          v-model="form.seasonInfo"
          label="Información de temporada (opcional)"
          :error="errors.seasonInfo"
          hint="Por ejemplo, Cosecha de verano 2026."
        />

        <!-- fieldset + legend: agrupa las dos opciones bajo una misma pregunta -->
        <fieldset>
          <legend class="text-sm font-medium">Disponibilidad</legend>
          <div class="mt-2 flex flex-wrap gap-6">
            <label
              v-for="status in Object.values(PRODUCT_STATUS)"
              :key="status"
              class="flex items-center gap-2"
            >
              <input v-model="form.status" type="radio" name="product-status" :value="status" />
              {{ PRODUCT_STATUS_LABELS[status] }}
            </label>
          </div>
        </fieldset>

        <p v-if="submitError" role="alert" class="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {{ submitError }}
        </p>

        <div class="flex flex-wrap gap-3">
          <button
            type="submit"
            class="rounded-md bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto' }}
          </button>
          <RouterLink
            :to="{ name: 'admin-products' }"
            class="rounded-md border border-border px-5 py-2.5 transition-colors hover:bg-secondary"
          >
            Cancelar
          </RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>