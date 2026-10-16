<script setup>
/*
 * Marco del panel de administración: título común, pestañas de navegación
 * y un RouterView donde se pinta la sección hija (Solicitudes, Productos o Contenidos).
 * La protección por rol está en la ruta padre /admin y la heredan las hijas.
 */
import { RouterLink, RouterView } from 'vue-router'

/*
 * Pestañas del panel; el nombre de ruta evita escribir las URL a mano.
 * Para añadir una sección nueva: una pestaña aquí y una ruta hija en el router.
 */
const tabs = [
  { name: 'admin-orders', label: 'Solicitudes' },
  { name: 'admin-products', label: 'Productos' },
  { name: 'admin-content', label: 'Contenidos' },
]
</script>

<template>
  <section class="container-page max-w-4xl py-12">
    <header>
      <p class="eyebrow">Administración</p>
      <h1 class="mt-3 text-4xl">Panel de administración</h1>
    </header>

    <!--
      RouterLink añade aria-current="page" a la pestaña activa,
      así el lector de pantalla sabe en qué sección está.
    -->
    <nav class="mt-8 flex gap-6 border-b border-border" aria-label="Secciones del panel">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        class="-mb-px border-b-2 border-transparent pb-3 text-muted-foreground transition-colors hover:text-foreground"
        active-class="!border-primary !text-foreground"
      >
        {{ tab.label }}
      </RouterLink>
    </nav>

    <div class="mt-8">
      <RouterView />
    </div>
  </section>
</template>