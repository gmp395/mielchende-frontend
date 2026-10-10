/*
 * Configuración de Vue Router: define qué vista se muestra para cada URL
 * y protege las rutas privadas con un guard global (beforeEach).
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/*
 * Vista temporal para las secciones aún no construidas.
 * Se carga de forma diferida (lazy loading): solo se descarga
 * cuando el usuario visita una de estas rutas.
 */
const ComingSoonView = () => import('@/views/ComingSoonView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Navegación principal */
    { path: '/', name: 'home', component: ComingSoonView, meta: { title: 'Inicio' } },
    { path: '/catalogo', name: 'catalog', component: ComingSoonView, meta: { title: 'Catálogo' } },
    { path: '/contacto', name: 'contact', component: ComingSoonView, meta: { title: 'Contacto' } },

    /* Recursos apícolas */
    { path: '/recursos', name: 'resources', component: ComingSoonView, meta: { title: 'Recursos Apícolas' } },
    { path: '/recursos/actualidad', name: 'resources-news', component: ComingSoonView, meta: { title: 'Actualidad Apícola' } },
    { path: '/recursos/calendario', name: 'resources-calendar', component: ComingSoonView, meta: { title: 'Calendario Apícola' } },
    { path: '/recursos/mundo-abejas', name: 'resources-bees', component: ComingSoonView, meta: { title: 'Mundo de las Abejas' } },
    { path: '/recursos/amenazas', name: 'resources-threats', component: ComingSoonView, meta: { title: 'Amenazas para las Abejas' } },
    { path: '/recursos/guias', name: 'resources-guides', component: ComingSoonView, meta: { title: 'Guías Prácticas' } },

    /* Acceso de usuario: solo para quien no ha iniciado sesión (MC-48) */
    { path: '/login', name: 'login', component: ComingSoonView, meta: { title: 'Acceder', guestOnly: true } },
    { path: '/registro', name: 'register', component: ComingSoonView, meta: { title: 'Crear cuenta', guestOnly: true } },

    /* Área de cliente: requiere sesión */
    { path: '/mis-solicitudes', name: 'my-orders', component: ComingSoonView, meta: { title: 'Mis solicitudes', requiresAuth: true } },

    /* Panel de administración: requiere rol ADMIN */
    { path: '/admin', name: 'admin', component: ComingSoonView, meta: { title: 'Panel de administración', requiresAdmin: true } },

    /* Páginas legales */
    { path: '/aviso-legal', name: 'legal-notice', component: ComingSoonView, meta: { title: 'Aviso legal' } },
    { path: '/privacidad', name: 'privacy', component: ComingSoonView, meta: { title: 'Política de privacidad' } },
  ],
})

/*
 * Guard global: se ejecuta antes de cada navegación.
 * Devolver una ruta cancela la navegación y redirige allí;
 * no devolver nada deja pasar.
 * Es solo experiencia de usuario: la seguridad real la aplica el backend.
 */
router.beforeEach((to) => {
  const authStore = useAuthStore()
  const needsLogin = to.meta.requiresAuth || to.meta.requiresAdmin

  /* Ruta privada sin sesión: al login, recordando a dónde quería ir */
  if (needsLogin && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  /* Ruta de admin con sesión de cliente: al inicio */
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'home' }
  }

  /* Login o registro con sesión ya iniciada: al inicio */
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router