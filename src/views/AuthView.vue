<script setup>
/*
 * Vista de acceso con dos pestañas: Iniciar sesión y Crear cuenta.
 * La pestaña activa depende de la ruta (/login o /registro),
 * así los enlaces directos y el botón "atrás" del navegador funcionan.
 */
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const tabs = [
  { name: 'login', label: 'Iniciar sesión' },
  { name: 'register', label: 'Crear cuenta' },
]

const isRegister = computed(() => route.name === 'register')

/*
 * A dónde ir tras acceder:
 *  - si venía de una ruta protegida (?redirect=...), volvemos allí;
 *  - si no, el administrador va al panel y el cliente al inicio.
 * Solo aceptamos rutas internas (empiezan por "/" pero no por "//"),
 * para que nadie pueda usar el enlace para redirigir a otra web.
 */
function getRedirectTarget() {
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return authStore.isAdmin ? '/admin' : '/'
}

function handleSuccess() {
  router.push(getRedirectTarget())
}
</script>

<template>
  <section class="container-page flex justify-center py-16">
    <div class="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
      <p class="eyebrow text-center">Área de clientes</p>
      <h1 class="mt-2 text-center text-3xl">
        {{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}
      </h1>

      <!--
        Pestañas: son enlaces a /login y /registro.
        Conservan la query (?redirect=...) al cambiar de pestaña.
        replace: no llena el historial al alternar entre pestañas.
      -->
      <nav aria-label="Tipo de acceso" class="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name, query: route.query }"
          replace
          class="rounded-md px-3 py-2 text-center text-sm text-muted-foreground transition-colors hover:text-foreground [&.router-link-exact-active]:bg-card [&.router-link-exact-active]:text-primary [&.router-link-exact-active]:shadow-soft"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>

      <div class="mt-6">
        <RegisterForm v-if="isRegister" @success="handleSuccess" />
        <LoginForm v-else @success="handleSuccess" />
      </div>
    </div>
  </section>
</template>