// main.js - ahora con filtro por temas
import { noticias } from '/modules/newsData.js';
import { renderizarLista } from '/modules/cardRenderer.js';

// Elementos DOM
const contenedorNoticias = document.getElementById('contenedorNoticias');
const botonModo = document.getElementById('botonModo');
const botonHamburguesa = document.getElementById('menuHamburguesa');
const menuLateral = document.getElementById('menuLateral');
const cerrarMenu = document.getElementById('cerrarMenu');

let temaActual = 'todas';

// Función para filtrar noticias según tema
function filtrarNoticiasPorTema(tema) {
    return tema === 'todas' ? noticias : noticias.filter(noticia => noticia.tema === tema);
}

// Función para cargar noticias según tema actual
function cargarNoticiasFiltradas() {
    const noticiasFiltradas = filtrarNoticiasPorTema(temaActual);
    renderizarLista(noticiasFiltradas, contenedorNoticias);
}

// Manejo de clics en los botones de tema
function configurarFiltros() {
    const botonesTema = document.querySelectorAll('.boton-tema');
    botonesTema.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const temaSeleccionado = boton.getAttribute('data-tema');
            temaActual = temaSeleccionado;

            // Actualizar clase activa en botones
            botonesTema.forEach(btn => btn.classList.remove('activo'));
            boton.classList.add('activo');

            // Recargar noticias
            cargarNoticiasFiltradas();

            // Cerrar menú lateral después de seleccionar
            cerrarMenuLateral();
        });
    });
}

// Funciones para menú hamburguesa
function abrirMenuLateral() {
    menuLateral.classList.add('abierto');
    // Crear overlay si no existe
    if (!document.querySelector('.overlay-menu')) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay-menu';
        overlay.addEventListener('click', cerrarMenuLateral);
        document.body.appendChild(overlay);
    }
    document.querySelector('.overlay-menu').classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function cerrarMenuLateral() {
    menuLateral.classList.remove('abierto');
    const overlay = document.querySelector('.overlay-menu');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
}

// Configurar menú hamburguesa
function configurarMenuHamburguesa() {
    if (botonHamburguesa) {
        botonHamburguesa.addEventListener('click', abrirMenuLateral);
    }
    if (cerrarMenu) {
        cerrarMenu.addEventListener('click', cerrarMenuLateral);
    }
}

// Reemplazar la función configurarModoOscuro
function configurarModoOscuro() {
    if (!botonModo) return;
    const icono = document.getElementById('iconoModo');

    const actualizarIcono = () => {
        const esOscuro = document.documentElement.classList.contains('modo-oscuro');
        if (icono) {
            if (esOscuro) {
                icono.className = 'fas fa-moon';
            } else {
                icono.className = 'fas fa-sun';
            }
        }
    };

    const animarBoton = () => {
        botonModo.classList.add('animar');
        setTimeout(() => {
            botonModo.classList.remove('animar');
        }, 400);
    };

    botonModo.addEventListener('click', () => {
        const html = document.documentElement;
        const esOscuroActual = html.classList.contains('modo-oscuro');

        animarBoton(); // lanza animación

        if (esOscuroActual) {
            html.classList.remove('modo-oscuro');
            localStorage.setItem('modo', 'claro');
        } else {
            html.classList.add('modo-oscuro');
            localStorage.setItem('modo', 'oscuro');
        }
        actualizarIcono();
    });

    // Inicializar icono según modo actual
    actualizarIcono();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    configurarModoOscuro();
    configurarMenuHamburguesa();
    configurarFiltros();
    cargarNoticiasFiltradas(); // muestra todas por defecto
});