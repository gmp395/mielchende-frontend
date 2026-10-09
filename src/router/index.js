/*
 * Configuración de Vue Router: define qué vista se muestra para cada URL.
 */
import { createRouter, createWebHistory } from 'vue-router'

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

    /* Acceso de usuario (se construye en MC-48) */
    { path: '/login', name: 'login', component: ComingSoonView, meta: { title: 'Acceder' } },

    /* Páginas legales */
    { path: '/aviso-legal', name: 'legal-notice', component: ComingSoonView, meta: { title: 'Aviso legal' } },
    { path: '/privacidad', name: 'privacy', component: ComingSoonView, meta: { title: 'Política de privacidad' } },
  ],
})

export default router