<script setup>
/*
 * Panel de administración — Formulario de artículo.
 * Una sola vista para crear (/admin/contenidos/nuevo) y editar
 * (/admin/contenidos/:id/editar): si la URL trae id, está editando.
 * El estado no se elige aquí: todo artículo nuevo se guarda como borrador
 * y se publica desde la lista.
 * Ruta protegida (requiresAdmin, heredado de la ruta padre /admin).
 */
import { nextTick, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { adminArticleRepository } from '@/api/adminArticleRepository'
import { articleMapper } from '@/mappers/articleMapper'
import {
  ARTICLE_SUMMARY_MAX_LENGTH,
  ARTICLE_TITLE_MAX_LENGTH,
  PRODUCT_TEXT_MAX_LENGTH,
  validateMaxLength,
  validateRequired,
} from '@/utils/validation'
import FormField from '@/components/common/FormField.vue'

const route = useRoute()
const router = useRouter()

/* Id del artículo si estamos editando; undefined si estamos creando */
const articleId = route.params.id
const isEdit = Boolean(articleId)

const form = ref(articleMapper.emptyForm())

/* Un mensaje de error por campo (vacío = sin error) */
const errors = reactive({
  title: '',
  summary: '',
  body: '',
  imageUrl: '',
})

/* Id de cada campo en el HTML, en orden, para enfocar el primero con error */
const FIELD_IDS = {
  title: 'article-title',
  summary: 'article-summary',
  body: 'article-body',
  imageUrl: 'article-image-url',
}

const isLoading = ref(isEdit)
const loadError = ref('')
const isSaving = ref(false)
const submitError = ref('')

/* Solo al editar: carga el artículo y lo convierte en datos de formulario */
async function loadArticle() {
  isLoading.value = true
  loadError.value = ''
  try {
    const article = await adminArticleRepository.getById(articleId)
    form.value = articleMapper.toForm(article)
  } catch (error) {
    loadError.value = error.status === 404 ? 'Este artículo no existe.' : error.message
  } finally {
    isLoading.value = false
  }
}

/* Aplica las reglas de validation.js; devuelve true si no hay ningún error */
function validate() {
  const values = form.value
  errors.title =
    validateRequired(values.title, 'Introduce el título.') ||
    validateMaxLength(
      values.title,
      ARTICLE_TITLE_MAX_LENGTH,
      `Como máximo ${ARTICLE_TITLE_MAX_LENGTH} caracteres.`,
    )
  errors.summary =
    validateRequired(values.summary, 'Introduce un resumen.') ||
    validateMaxLength(
      values.summary,
      ARTICLE_SUMMARY_MAX_LENGTH,
      `Como máximo ${ARTICLE_SUMMARY_MAX_LENGTH} caracteres.`,
    )
  errors.body = validateRequired(values.body, 'Introduce el texto del artículo.')
  /* La URL de imagen es una columna VARCHAR(255), igual que en productos */
  errors.imageUrl = validateMaxLength(
    values.imageUrl,
    PRODUCT_TEXT_MAX_LENGTH,
    `Como máximo ${PRODUCT_TEXT_MAX_LENGTH} caracteres.`,
  )
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
    const dto = articleMapper.toRequestDto(form.value)
    if (isEdit) {
      await adminArticleRepository.update(articleId, dto)
    } else {
      await adminArticleRepository.create(dto)
    }
    /* Guardado: volvemos a la lista, que ya mostrará el artículo actualizado */
    router.push({ name: 'admin-content' })
  } catch (error) {
    submitError.value = error.message
  } finally {
    isSaving.value = false
  }
}

/* Petición inicial solo al editar: directamente en <script setup> */
if (isEdit) loadArticle()
</script>

<template>
  <section class="max-w-2xl">
    <RouterLink
      :to="{ name: 'admin-content' }"
      class="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← Volver a contenidos
    </RouterLink>
    <h2 class="mt-4 text-2xl">{{ isEdit ? 'Editar artículo' : 'Nuevo artículo' }}</h2>
    <p v-if="!isEdit" class="mt-1 text-sm text-muted-foreground">
      Se guardará como borrador. Podrás publicarlo desde la lista de contenidos.
    </p>

    <div class="mt-6" aria-live="polite">
      <p v-if="isLoading" class="text-muted-foreground">Cargando artículo…</p>

      <p v-else-if="loadError" role="alert" class="rounded-lg bg-destructive/10 p-5 text-destructive">
        {{ loadError }}
      </p>

      <!-- novalidate: desactiva los avisos nativos del navegador; validamos nosotros -->
      <form v-else novalidate class="space-y-6" @submit.prevent="handleSubmit">
        <FormField
          id="article-title"
          v-model="form.title"
          label="Título"
          :error="errors.title"
        />

        <!-- Resumen: textarea con la misma accesibilidad que FormField -->
        <div>
          <label for="article-summary" class="block text-sm font-medium">Resumen</label>
          <textarea
            id="article-summary"
            v-model="form.summary"
            rows="3"
            :aria-invalid="errors.summary ? 'true' : 'false'"
            :aria-describedby="errors.summary ? 'article-summary-error' : 'article-summary-hint'"
            class="mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
          ></textarea>
          <p v-if="errors.summary" id="article-summary-error" class="mt-1.5 text-sm text-destructive">
            {{ errors.summary }}
          </p>
          <p v-else id="article-summary-hint" class="mt-1.5 text-sm text-muted-foreground">
            Una o dos frases que se muestran antes del texto. Máximo
            {{ ARTICLE_SUMMARY_MAX_LENGTH }} caracteres.
          </p>
        </div>

        <!-- Texto completo: los párrafos se separan con una línea en blanco -->
        <div>
          <label for="article-body" class="block text-sm font-medium">Texto</label>
          <textarea
            id="article-body"
            v-model="form.body"
            rows="12"
            :aria-invalid="errors.body ? 'true' : 'false'"
            :aria-describedby="errors.body ? 'article-body-error' : 'article-body-hint'"
            class="mt-1.5 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30 aria-invalid:border-destructive"
          ></textarea>
          <p v-if="errors.body" id="article-body-error" class="mt-1.5 text-sm text-destructive">
            {{ errors.body }}
          </p>
          <p v-else id="article-body-hint" class="mt-1.5 text-sm text-muted-foreground">
            Deja una línea en blanco para separar los párrafos. Escribe **así** para poner un texto en negrita.
          </p>
        </div>

        <FormField
          id="article-image-url"
          v-model="form.imageUrl"
          type="url"
          label="URL de la imagen (opcional)"
          :error="errors.imageUrl"
          hint="Si se deja vacía, el artículo se muestra sin imagen."
        />

        <p v-if="submitError" role="alert" class="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {{ submitError }}
        </p>

        <div class="flex flex-wrap gap-3">
          <button
            type="submit"
            class="rounded-md bg-primary px-5 py-2.5 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar borrador' }}
          </button>
          <RouterLink
            :to="{ name: 'admin-content' }"
            class="rounded-md border border-border px-5 py-2.5 transition-colors hover:bg-secondary"
          >
            Cancelar
          </RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>