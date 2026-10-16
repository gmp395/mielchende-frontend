<script setup>
/*
 * Tarjeta de un producto en el catálogo.
 * Toda la tarjeta es un enlace a la ficha del producto.
 */
import { RouterLink } from 'vue-router'
import ProductImage from '@/components/catalog/ProductImage.vue'
import ProductStatusBadge from '@/components/catalog/ProductStatusBadge.vue'
import { formatPrice } from '@/utils/format'

defineProps({
  product: { type: Object, required: true },
})
</script>

<template>
  <!-- lift: efecto de elevación suave al pasar el ratón (utilidad de main.css) -->
  <article class="lift overflow-hidden rounded-xl border border-border bg-card">
    <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }" class="block h-full">
      <ProductImage :image-url="product.imageUrl" />
      <div class="p-5">
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-xl">{{ product.name }}</h2>
          <ProductStatusBadge :status="product.status" />
        </div>
        <p class="mt-1 text-sm text-muted-foreground">{{ product.format }}</p>
        <p class="mt-4 text-lg text-primary">{{ formatPrice(product.price) }}</p>
      </div>
    </RouterLink>
  </article>
</template>