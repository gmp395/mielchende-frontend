<script setup>
/*
 * Cabecera común de la web: logo, menú principal (escritorio),
 * acceso o menú de cuenta según la sesión, y menú desplegable para móvil.
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Menu, X, UserRound, ChevronDown, LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
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
 * whitespace-nowrap: el texto no se parte en dos líneas.
 * [&.router-link-exact-active]: aplica el color miel cuando
 * RouterLink marca el enlace como el de la página actual.
 */
const linkClass =
  'whitespace-nowrap text-base text-foreground/80 transition-colors hover:text-primary [&.router-link-exact-active]:text-primary'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

/* Enlace al área privada según el rol: panel para el administrador, solicitudes para el cliente */
const accountLink = computed(() =>
  authStore.isAdmin
    ? { to: '/admin', label: 'Panel de administración' }
    : { to: '/mis-solicitudes', label: 'Mis solicitudes' },
)

/* Estado de los dos menús desplegables */
const isMenuOpen = ref(false)
const isAccountMenuOpen = ref(false)

/* Referencia al contenedor del menú de cuenta, para detectar clics fuera de él */
const accountMenuRef = ref(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function toggleAccountMenu() {
  isAccountMenuOpen.value = !isAccountMenuOpen.value
}

/* Cierra los dos menús automáticamente cada vez que cambia la ruta */
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
    isAccountMenuOpen.value = false
  },
)

/* Cierra el menú de cuenta si se hace clic fuera de él */
function handleClickOutside(event) {
  if (
    isAccountMenuOpen.value &&
    accountMenuRef.value &&
    !accountMenuRef.value.contains(event.target)
  ) {
    isAccountMenuOpen.value = false
  }
}

/* Cierra el menú de cuenta con la tecla Escape */
function handleKeydown(event) {
  if (event.key === 'Escape') {
    isAccountMenuOpen.value = false
  }
}

/*
 * Ciclo de vida: los listeners del documento se registran al montar
 * la cabecera y se eliminan al desmontarla, para no dejar escuchas vivas.
 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

/* Cierra sesión y lleva al inicio (para no quedarse en una página privada) */
function handleLogout() {
  isAccountMenuOpen.value = false
  isMenuOpen.value = false
  authStore.logout()
  router.push('/')
}
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
        <span class="whitespace-nowrap">Miel <span class="text-primary">Chende</span></span>
      </RouterLink>

      <!-- Menú de escritorio: oculto hasta lg (1024px), donde ya cabe holgado -->
      <nav aria-label="Navegación principal" class="hidden items-center gap-8 lg:flex">
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

      <!-- Acciones: acceso o menú de cuenta, y botón del menú móvil -->
      <div class="flex items-center gap-1">
        <!-- Sin sesión: el icono lleva a la pantalla de acceso -->
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          aria-label="Acceder"
          class="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-secondary"
        >
          <UserRound class="size-6" aria-hidden="true" />
        </RouterLink>

        <!-- Con sesión: el icono abre el menú de cuenta -->
        <div v-else ref="accountMenuRef" class="relative">
          <button
            type="button"
            aria-label="Mi cuenta"
            :aria-expanded="isAccountMenuOpen"
            aria-controls="account-menu"
            class="inline-flex size-11 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary"
            @click="toggleAccountMenu"
          >
            <UserRound class="size-6" aria-hidden="true" />
          </button>

          <div
            v-show="isAccountMenuOpen"
            id="account-menu"
            class="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-card p-1.5 shadow-card"
          >
            <!-- truncate: si el email es largo, se corta con "…" en vez de desbordar -->
            <p class="truncate px-3 py-2 text-xs text-muted-foreground">{{ authStore.email }}</p>
            <RouterLink
              :to="accountLink.to"
              class="block rounded-md px-3 py-2 text-sm text-card-foreground/85 transition-colors hover:bg-secondary hover:text-primary"
            >
              {{ accountLink.label }}
            </RouterLink>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-card-foreground/85 transition-colors hover:bg-secondary hover:text-primary"
              @click="handleLogout"
            >
              <LogOut class="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </div>

        <!-- Botón hamburguesa: solo visible por debajo de lg -->
        <button
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-secondary lg:hidden"
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
      class="border-t border-border bg-sand lg:hidden"
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

        <!-- Con sesión: enlace al área privada y cerrar sesión; sin sesión: Acceder -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink :to="accountLink.to" class="mt-4 rounded-md bg-secondary px-3 py-3 text-base">
            {{ accountLink.label }}
          </RouterLink>
          <button
            type="button"
            class="flex items-center gap-2 rounded-md px-3 py-3 text-left text-base hover:bg-secondary"
            @click="handleLogout"
          >
            <LogOut class="size-5" aria-hidden="true" />
            Cerrar sesión
          </button>
        </template>
        <RouterLink v-else to="/login" class="mt-4 rounded-md bg-secondary px-3 py-3 text-base">
          Acceder
        </RouterLink>
      </div>
    </nav>
  </header>
</template>