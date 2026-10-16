/*
 * Configuración que se ejecuta antes de cada archivo de tests.
 *
 * Los tests se ejecutan en jsdom, un navegador simulado que no implementa
 * el scroll. Vue Router llama a window.scrollTo() en cada navegación
 * (scrollBehavior del router), y sin esto jsdom mostraría el aviso
 * "Not implemented: Window's scrollTo() method".
 * La sustituimos por una función vacía, que no hace nada.
 */
window.scrollTo = () => {}