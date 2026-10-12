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
const HomeView = () => import('@/views/HomeView.vue')
const ContactView = () => import('@/views/ContactView.vue')
const BeesWorldView = () => import('@/views/BeesWorldView.vue')
const CalendarView = () => import('@/views/CalendarView.vue')
const ThreatsView = () => import('@/views/ThreatsView.vue')
const NewsView = () => import('@/views/NewsView.vue')
const AuthView = () => import('@/views/AuthView.vue')
const CatalogView = () => import('@/views/CatalogView.vue')
const ProductDetailView = () => import('@/views/ProductDetailView.vue')
const OrderRequestView = () => import('@/views/OrderRequestView.vue')
const MyOrdersView = () => import('@/views/MyOrdersView.vue')
const AdminView = () => import('@/views/AdminView.vue')
const AdminOrdersView = () => import('@/views/AdminOrdersView.vue')
const AdminProductsView = () => import('@/views/AdminProductsView.vue')
const AdminProductFormView = () => import('@/views/AdminProductFormView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Navegación principal */
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Inicio' } },
    { path: '/contacto', name: 'contact', component: ContactView, meta: { title: 'Contacto' } },

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
      component: NewsView,
      meta: { title: 'Actualidad Apícola' },
    },
    {
      path: '/recursos/calendario',
      name: 'resources-calendar',
      component: CalendarView,
      meta: { title: 'Calendario Apícola' },
    },
    {
      path: '/recursos/mundo-abejas',
      name: 'resources-bees',
      component: BeesWorldView,
      meta: { title: 'Mundo de las Abejas' },
    },
    {
      path: '/recursos/amenazas',
      name: 'resources-threats',
      component: ThreatsView,
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

    /*
     * Panel de administración: requiere rol ADMIN.
     * Ruta padre con AdminView (título y pestañas) y una ruta hija por sección.
     * Las hijas heredan el meta del padre, así que el guard las protege a todas.
     * /admin a secas redirige a Solicitudes.
     */
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      redirect: { name: 'admin-orders' },
      meta: { title: 'Panel de administración', requiresAdmin: true },
      children: [
        {
          path: 'solicitudes',
          name: 'admin-orders',
          component: AdminOrdersView,
          meta: { title: 'Solicitudes · Panel' },
        },
        {
          path: 'productos',
          name: 'admin-products',
          component: AdminProductsView,
          meta: { title: 'Productos · Panel' },
        },
        {
          /* Alta de producto */
          path: 'productos/nuevo',
          name: 'admin-product-new',
          component: AdminProductFormView,
          meta: { title: 'Nuevo producto · Panel' },
        },
        {
          /* Edición: el mismo formulario, con el id en la URL */
          path: 'productos/:id/editar',
          name: 'admin-product-edit',
          component: AdminProductFormView,
          meta: { title: 'Editar producto · Panel' },
        },
        {
          /* Gestión de contenidos apícolas: fuera del PMV */
          path: 'contenidos',
          name: 'admin-content',
          component: ComingSoonView,
          meta: { title: 'Contenidos · Panel' },
        },
      ],
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
