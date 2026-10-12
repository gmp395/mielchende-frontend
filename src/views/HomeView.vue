<script setup>
/*
 * Página de inicio: portada con una foto real del apiario,
 * presentación breve de la miel y acceso al catálogo.
 * Es estática: no pide datos al backend.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (servidas desde la carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta
 * en un import: en los tests, Vitest no sirve la carpeta public.
 */
const HERO_IMAGE = '/images/banners/apicultor-ahumador.jpg'
const PROCESS_IMAGE = '/images/content/miel-colando.jpg'

/* Rasgos de la miel, basados en lo que indica la etiqueta del tarro */
const features = [
  {
    title: 'Cruda y sin filtrar',
    text: 'Extraída y envasada en frío, sin tratamientos térmicos, para conservar todas sus propiedades.',
  },
  {
    title: 'Una cosecha al año',
    text: 'Trabajamos al ritmo de las abejas: cuando una miel se agota, vuelve con la siguiente cosecha.',
  },
  {
    title: 'Terras do Miño',
    text: 'Nuestras colmenas están en Cospeito (Lugo), dentro de la Reserva de la Biosfera Terras do Miño.',
  },
]
</script>

<template>
  <!--
    Portada. isolate crea un contexto de apilamiento propio,
    para que la imagen y el degradado (-z-10) queden detrás del texto
    sin esconderse detrás del fondo de la página.
  -->
  <section class="relative isolate overflow-hidden">
    <!-- alt vacío: la imagen es decorativa, el mensaje está en el texto -->
    <img
      :src="HERO_IMAGE"
      alt=""
      class="absolute inset-0 -z-10 size-full object-cover object-[65%_center]"
      fetchpriority="high"
    />
    <!--
      Degradado oscuro para que el texto claro se lea sobre la foto:
      en móvil, de abajo hacia arriba; desde sm, de izquierda a derecha.
    -->
    <div
      class="absolute inset-0 -z-10 bg-linear-to-t from-foreground/85 via-foreground/45 to-foreground/10 sm:bg-linear-to-r sm:from-foreground/80 sm:via-foreground/40 sm:to-transparent"
      aria-hidden="true"
    ></div>

    <div class="container-page flex min-h-[70vh] flex-col justify-end py-16 sm:justify-center">
      <div class="max-w-xl text-primary-foreground">
        <p class="text-xs uppercase tracking-[0.18em] text-primary-foreground/85">
          Apícola Chende · Cospeito, Lugo
        </p>
        <h1 class="mt-4 text-4xl sm:text-5xl lg:text-6xl">Miel cruda de Terras do Miño</h1>
        <p class="mt-5 text-lg text-primary-foreground/90">
          Miel artesanal de nuestro apiario familiar, recolectada una vez al año y envasada en frío.
        </p>
        <RouterLink
          :to="{ name: 'catalog' }"
          class="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver el catálogo
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- Nuestra miel: tres rasgos en tarjetas -->
  <section class="container-page py-20">
    <header class="max-w-2xl">
      <p class="eyebrow">Nuestra miel</p>
      <h2 class="mt-3 text-3xl sm:text-4xl">Del apiario a tu mesa</h2>
    </header>

    <ul class="mt-10 grid gap-6 sm:grid-cols-3">
      <li
        v-for="feature in features"
        :key="feature.title"
        class="rounded-xl border border-border bg-card p-6"
      >
        <h3 class="text-xl">{{ feature.title }}</h3>
        <p class="mt-2 text-muted-foreground">{{ feature.text }}</p>
      </li>
    </ul>
  </section>

  <!-- Así trabajamos: foto del proceso y explicación de la solicitud -->
  <section class="surface-warm">
    <div class="container-page grid items-center gap-10 py-20 lg:grid-cols-2">
      <img
        :src="PROCESS_IMAGE"
        alt="Miel recién extraída cayendo sobre el colador"
        class="aspect-4/3 w-full rounded-xl object-cover"
        loading="lazy"
      />
      <div>
        <p class="eyebrow">Así trabajamos</p>
        <h2 class="mt-3 text-3xl sm:text-4xl">Sin prisas y sin intermediarios</h2>
        <p class="mt-4 text-muted-foreground">
          Cuidamos las colmenas, extraemos la miel y la envasamos nosotros mismos. Por eso no hay
          carrito ni pago online: eliges lo que quieres, nos envías una solicitud y nos ponemos en
          contacto contigo para preparar tu pedido.
        </p>
        <RouterLink
          :to="{ name: 'catalog' }"
          class="mt-6 inline-flex rounded-md border border-border bg-card px-5 py-2.5 transition-colors hover:bg-secondary"
        >
          Hacer una solicitud
        </RouterLink>
      </div>
    </div>
  </section>
</template>