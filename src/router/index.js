/*
 * Configuración de Vue Router: define qué vista se muestra para cada URL
 * y protege las rutas privadas con un guard global (beforeEach).
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/*
 * Vistas cargadas de forma diferida (lazy loading): solo se descargan
 * cuando el usuario visita una de sus rutas.
 * ComingSoonView es la vista temporal para las secciones aún no construidas.
 */
const ComingSoonView = () => import('@/views/ComingSoonView.vue')
const AuthView = () => import('@/views/AuthView.vue')
const CatalogView = () => import('@/views/CatalogView.vue')
const ProductDetailView = () => import('@/views/ProductDetailView.vue')
const OrderRequestView = () => import('@/views/OrderRequestView.vue')
const MyOrdersView = () => import('@/views/MyOrdersView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Navegación principal */
    { path: '/', name: 'home', component: ComingSoonView, meta: { title: 'Inicio' } },
    { path: '/contacto', name: 'contact', component: ComingSoonView, meta: { title: 'Contacto' } },

    /* Catálogo: listado y ficha de producto (público) */
    { path: '/catalogo', name: 'catalog', component: CatalogView, meta: { title: 'Catálogo' } },
    {
      path: '/catalogo/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { title: 'Producto' },
    },

    /* Solicitud de pedido: requiere sesión (se construye en MC-51) */
    {
      path: '/solicitud',
      name: 'order-request',
      component: OrderRequestView,
      meta: { title: 'Solicitud de pedido', requiresAuth: true },
    },
    /* Recursos apícolas */
    {
      path: '/recursos',
      name: 'resources',
      component: ComingSoonView,
      meta: { title: 'Recursos Apícolas' },
    },
    {
      path: '/recursos/actualidad',
      name: 'resources-news',
      component: ComingSoonView,
      meta: { title: 'Actualidad Apícola' },
    },
    {
      path: '/recursos/calendario',
      name: 'resources-calendar',
      component: ComingSoonView,
      meta: { title: 'Calendario Apícola' },
    },
    {
      path: '/recursos/mundo-abejas',
      name: 'resources-bees',
      component: ComingSoonView,
      meta: { title: 'Mundo de las Abejas' },
    },
    {
      path: '/recursos/amenazas',
      name: 'resources-threats',
      component: ComingSoonView,
      meta: { title: 'Amenazas para las Abejas' },
    },
    {
      path: '/recursos/guias',
      name: 'resources-guides',
      component: ComingSoonView,
      meta: { title: 'Guías Prácticas' },
    },

    /* Acceso de usuario: una sola vista con dos pestañas, solo sin sesión iniciada */
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      meta: { title: 'Acceder', guestOnly: true },
    },
    {
      path: '/registro',
      name: 'register',
      component: AuthView,
      meta: { title: 'Crear cuenta', guestOnly: true },
    },

    /* Área de cliente: requiere sesión */
    {
      path: '/mis-solicitudes',
      name: 'my-orders',
      component: MyOrdersView,
      meta: { title: 'Mis solicitudes', requiresAuth: true },
    },
    /* Panel de administración: requiere rol ADMIN */
    {
      path: '/admin',
      name: 'admin',
      component: ComingSoonView,
      meta: { title: 'Panel de administración', requiresAdmin: true },
    },

    /* Páginas legales */
    {
      path: '/aviso-legal',
      name: 'legal-notice',
      component: ComingSoonView,
      meta: { title: 'Aviso legal' },
    },
    {
      path: '/privacidad',
      name: 'privacy',
      component: ComingSoonView,
      meta: { title: 'Política de privacidad' },
    },
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
