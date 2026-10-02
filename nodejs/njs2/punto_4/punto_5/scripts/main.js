// Script principal: control de tema oscuro y carga del menú hamburguesa.
import { construirMenu } from '../modules/menu.js';

// Obtener el nombre de la página actual (sin extensión) para resaltar en el menú
const ruta = window.location.pathname;
let paginaActual = '';
if (ruta === '/') paginaActual = '';
else if (ruta.startsWith('/')) paginaActual = ruta.slice(1);

// Construir el menú
const contenedorMenu = document.getElementById('menu-container');
if (contenedorMenu) {
    construirMenu(paginaActual);
}

// Tema oscuro/claro
const btnTema = document.getElementById('tema-btn');
const html = document.documentElement;

btnTema.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// Aplicar tema guardado (ya se hizo en el anti-flash del <head>)