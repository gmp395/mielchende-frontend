<script setup>
/*
 * Página de inicio: portada en dos columnas (texto y foto de la miel),
 * presentación breve de la miel y acceso al catálogo.
 * Es estática: no pide datos al backend.
 */
import { RouterLink } from 'vue-router'

/*
 * Rutas de las fotos (servidas desde la carpeta public).
 * Se enlazan con :src para que el compilador de Vue no las convierta
 * en un import: en los tests, Vitest no sirve la carpeta public.
 */
const HERO_IMAGE = '/images/banners/miel-portada.jpg'
const PROCESS_IMAGE = '/images/content/miel-colando.jpg'

/* Rasgos de la miel, basados en lo que indica la etiqueta del tarro */
const features = [
  {
    title: 'Cruda y sin tratamientos térmicos',
    text: 'Extraemos y envasamos la miel en frío, sin someterla a tratamientos térmicos. Así respetamos al máximo sus características naturales.',
  },
  {
    title: 'Una cosecha al año',
    text: 'Nuestra miel depende de cada temporada y del trabajo de las abejas. Cuando se termina una cosecha, toca esperar a la siguiente.',
  },
  {
    title: 'De Cospeito, en Terras do Miño',
    text: 'Nuestro apiario está en Cospeito, Lugo, dentro de la Reserva de la Biosfera Terras do Miño. Este es el entorno en el que cuidamos nuestras abejas y recogemos nuestra miel.',
  },
]
</script>

<template>
  <!--
    Portada en dos columnas: texto a la izquierda y foto a la derecha.
    Por debajo de lg las columnas se apilan: primero el texto con el botón
    y después la foto, para que el botón se vea sin hacer scroll en móvil.
  -->
  <section class="surface-warm">
    <div
      class="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20"
    >
      <div class="max-w-xl">
        <p class="eyebrow">Apícola Chende · Cospeito, Lugo</p>
        <h1 class="mt-4 text-5xl sm:text-6xl lg:text-7xl">Miel Chende</h1>
        <!--
          Subtítulo: es un párrafo y no un h2, porque continúa el título
          en lugar de abrir una sección nueva.
        -->
        <p class="mt-4 text-2xl sm:text-3xl">Miel cruda de Terras do Miño</p>
        <p class="mt-5 text-lg text-muted-foreground">
          Miel de nuestro apiario familiar, elaborada al ritmo de las abejas y recolectada con
          cuidado. Una miel natural, sin tratamientos térmicos, que conserva la esencia de su
          origen.
        </p>
        <RouterLink
          :to="{ name: 'catalog' }"
          class="mt-8 inline-flex rounded-md bg-primary px-6 py-3 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver el catálogo
        </RouterLink>
      </div>

      <!--
        La foto es contenido (nuestra miel real), no un fondo decorativo,
        por eso lleva un alt descriptivo.
        aspect-4/5 mantiene la proporción vertical de la foto y object-cover
        recorta lo mínimo si la proporción no coincide exactamente.
        En móvil se limita el ancho y se centra; desde lg se alinea a la derecha.
      -->
      <img
        :src="HERO_IMAGE"
        alt="Miel cayendo en un tarro de cristal con relieve de celdas"
        class="mx-auto aspect-4/5 w-full max-w-md rounded-xl object-cover lg:mx-0 lg:justify-self-end"
        fetchpriority="high"
      />
    </div>
  </section>

  <!-- Nuestra miel: introducción y tres rasgos en tarjetas -->
  <section class="container-page py-20">
    <header class="max-w-2xl">
      <p class="eyebrow">Nuestra miel</p>
      <h2 class="mt-3 text-3xl sm:text-4xl">Del cuidado de las abejas a tu mesa</h2>
      <p class="mt-4 text-muted-foreground">
        Nuestra miel nace del trabajo diario en el apiario, del respeto por los ciclos naturales y
        de una forma de hacer las cosas sin prisas.
      </p>
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
        <h2 class="mt-3 text-3xl sm:text-4xl">Una forma de hacer las cosas, sin prisas</h2>
        <p class="mt-4 text-muted-foreground">
          Cuidamos nuestras colmenas, extraemos la miel y la envasamos nosotros mismos. Nos
          ocupamos de todo el proceso, de las abejas al tarro, para ofrecerte una miel de nuestro
          propio apiario.
        </p>
        <p class="mt-4 text-muted-foreground">
          No tenemos carrito de compra ni pago online. Si te interesa nuestra miel, envíanos tu
          solicitud y hablaremos contigo para concretar el pedido.
        </p>
        <!-- Las solicitudes empiezan eligiendo producto en el catálogo -->
        <RouterLink
          :to="{ name: 'catalog' }"
          class="mt-6 inline-flex rounded-md border border-border bg-card px-5 py-2.5 transition-colors hover:bg-secondary"
        >
          Quiero vuestra miel
        </RouterLink>
      </div>
    </div>
  </section>
</template>