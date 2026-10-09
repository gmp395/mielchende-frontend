<script setup>
/*
 * Cabecera común de la web: logo, menú principal (escritorio),
 * acceso de usuario y menú desplegable para móvil.
 */
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, UserRound, ChevronDown } from '@lucide/vue'
/* Logo importado desde assets: Vite lo procesa y los tests lo resuelven */
import logoUrl from '@/assets/images/logo.png'

/* Enlaces principales (antes del desplegable de Recursos) */
const mainLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
]

/* Subsecciones del desplegable "Recursos Apícolas" */
const resourceLinks = [
  { to: '/recursos/actualidad', label: 'Actualidad Apícola' },
  { to: '/recursos/calendario', label: 'Calendario Apícola' },
  { to: '/recursos/mundo-abejas', label: 'Mundo de las Abejas' },
  { to: '/recursos/amenazas', label: 'Amenazas para las Abejas' },
  { to: '/recursos/guias', label: 'Guías Prácticas' },
]

/*
 * Clases comunes de los enlaces de escritorio.
 * [&.router-link-exact-active]: aplica el color miel cuando
 * RouterLink marca el enlace como el de la página actual.
 */
const linkClass =
  'text-base text-foreground/80 transition-colors hover:text-primary [&.router-link-exact-active]:text-primary'

/* Estado del menú móvil: abierto o cerrado */
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

/* Cierra el menú móvil automáticamente cada vez que cambia la ruta */
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <!--
    Cabecera fija (sticky) con el mismo tono arena que el pie.
    /90 = 90 % de opacidad; backdrop-blur desenfoca el contenido que pasa por debajo
  -->
  <header class="sticky top-0 z-50 border-b border-border/70 bg-sand/90 backdrop-blur-md">
    <!--
      Barra a todo el ancho de la pantalla (sin ancho máximo),
      de 96px de alto, con margen lateral de 1.25rem en móvil y 2.5rem desde md
    -->
    <div class="flex h-24 w-full items-center justify-between gap-6 px-5 md:px-10">
      <!--
        Logo + nombre: vuelve al inicio.
        :src enlaza con la variable logoUrl (importada arriba).
        alt="" porque la imagen es decorativa: el nombre ya está escrito al lado
      -->
      <RouterLink to="/" class="flex items-center gap-3 font-display text-2xl tracking-tight">
        <img :src="logoUrl" alt="" class="size-12" />
        <span>Miel <span class="text-primary">Chende</span></span>
      </RouterLink>

      <!-- Menú de escritorio: oculto en móvil, visible desde md (768px) -->
      <nav aria-label="Navegación principal" class="hidden items-center gap-8 md:flex">
        <RouterLink v-for="link in mainLinks" :key="link.to" :to="link.to" :class="linkClass">
          {{ link.label }}
        </RouterLink>

        <!--
          Desplegable de Recursos: "group" permite que el panel reaccione
          al pasar el ratón (group-hover) o al enfocar con teclado (group-focus-within)
        -->
        <div class="group relative">
          <RouterLink to="/recursos" :class="[linkClass, 'inline-flex items-center gap-1']">
            Recursos Apícolas
            <ChevronDown class="size-4 opacity-60" aria-hidden="true" />
          </RouterLink>
          <div
            class="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
          >
            <div class="overflow-hidden rounded-lg border border-border bg-card p-1.5 shadow-card">
              <RouterLink
                v-for="resource in resourceLinks"
                :key="resource.to"
                :to="resource.to"
                class="block rounded-md px-3 py-2 text-sm text-card-foreground/85 transition-colors hover:bg-secondary hover:text-primary"
              >
                {{ resource.label }}
              </RouterLink>
            </div>
          </div>
        </div>

        <RouterLink to="/contacto" :class="linkClass">Contacto</RouterLink>
      </nav>

      <!-- Acciones: acceso de usuario y botón del menú móvil -->
      <div class="flex items-center gap-1">
        <!-- De momento siempre lleva a /login; en MC-48 cambiará según haya sesión -->
        <RouterLink
          to="/login"
          aria-label="Acceder"
          class="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-secondary"
        >
          <UserRound class="size-6" aria-hidden="true" />
        </RouterLink>

        <!-- Botón hamburguesa: solo visible en móvil -->
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-secondary md:hidden"
          :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <X v-if="isMenuOpen" class="size-6" aria-hidden="true" />
          <Menu v-else class="size-6" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Menú móvil: se muestra al pulsar el botón hamburguesa -->
    <nav
      v-show="isMenuOpen"
      id="mobile-menu"
      aria-label="Navegación principal (móvil)"
      class="border-t border-border bg-sand md:hidden"
    >
      <div class="flex w-full flex-col gap-1 px-5 py-4">
        <RouterLink
          v-for="link in mainLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-3 text-base hover:bg-secondary"
        >
          {{ link.label }}
        </RouterLink>

        <RouterLink to="/recursos" class="rounded-md px-3 py-3 text-base hover:bg-secondary">
          Recursos Apícolas
        </RouterLink>
        <div class="ml-3 flex flex-col border-l border-border pl-3">
          <RouterLink
            v-for="resource in resourceLinks"
            :key="resource.to"
            :to="resource.to"
            class="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            {{ resource.label }}
          </RouterLink>
        </div>

        <RouterLink to="/contacto" class="rounded-md px-3 py-3 text-base hover:bg-secondary">
          Contacto
        </RouterLink>
        <RouterLink to="/login" class="mt-4 rounded-md bg-secondary px-3 py-3 text-base">
          Acceder
        </RouterLink>
      </div>
    </nav>
  </header>
</template>