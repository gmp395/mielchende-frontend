<script setup>
/*
 * Imagen de un producto.
 * Si el producto no tiene imagen, o la imagen no se puede cargar,
 * muestra una imagen por defecto con el logo sobre fondo miel suave.
 */
import { ref, watch } from 'vue'
import logoUrl from '@/assets/images/logo.png'

const props = defineProps({
  imageUrl: { type: String, default: null },
  /* Texto alternativo; vacío si la imagen es decorativa (el nombre ya está escrito al lado) */
  alt: { type: String, default: '' },
})

/* true si la URL existe pero la imagen falló al cargar (enlace roto) */
const hasError = ref(false)

/* Si cambia la URL, volvemos a intentarlo */
watch(
  () => props.imageUrl,
  () => {
    hasError.value = false
  },
)
</script>

<template>
  <!-- aspect-square: la imagen siempre es cuadrada, así todas las tarjetas miden igual -->
  <img
    v-if="imageUrl && !hasError"
    :src="imageUrl"
    :alt="alt"
    class="aspect-square w-full object-cover"
    @error="hasError = true"
  />
  <div
    v-else
    class="flex aspect-square w-full items-center justify-center bg-honey-soft"
    :role="alt ? 'img' : undefined"
    :aria-label="alt || undefined"
    :aria-hidden="alt ? undefined : 'true'"
  >
    <img :src="logoUrl" alt="" class="size-1/3 opacity-40" />
  </div>
</template>