/**
 * main.js
 * Controlador: agrega objetos HTML mediante innerHTML al contenedor.
 * Usa el módulo constructorHtml.js
 */
import {
    generarParrafo,
    generarImagen,
    generarLista,
    generarTabla,
    generarVideo
} from '/modules/constructorHtml.js';

const contenedor = document.getElementById('contenedorObjetos');
const panelMensajes = document.getElementById('panelMensajes');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnModoOscuro = document.getElementById('btnModoOscuro');

/**
 * Muestra un mensaje temporal en el panel.
 */
function mostrarMensaje(texto) {
    panelMensajes.innerHTML = `<span>${texto}</span>`;
    setTimeout(() => {
        if (panelMensajes.innerHTML === `<span>${texto}</span>`) {
            panelMensajes.innerHTML = '';
        }
    }, 3000);
}

/**
 * Agrega un objeto HTML al contenedor usando innerHTML.
 * @param {string} htmlString - Código HTML a insertar
 * @param {string} tipo - Descripción del objeto
 */
function agregarObjeto(htmlString, tipo) {
    const htmlActual = contenedor.innerHTML;
    const nuevoHtml = htmlActual + htmlString;
    contenedor.innerHTML = nuevoHtml;
    mostrarMensaje(`✅ Agregado: ${tipo}`);
}

/**
 * Limpia todo el contenido del contenedor.
 */
function limpiarContenedor() {
    contenedor.innerHTML = '';
    mostrarMensaje('🗑️ Todo el contenido ha sido eliminado.');
}

/**
 * Inicializa modo oscuro/claro.
 */
function inicializarModoOscuro() {
    if (!btnModoOscuro) return;
    const root = document.documentElement;
    const actualizarTexto = () => {
        const tema = root.getAttribute('data-tema');
        btnModoOscuro.textContent = tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro';
    };
    actualizarTexto();
    btnModoOscuro.addEventListener('click', () => {
        const nuevo = root.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
        root.setAttribute('data-tema', nuevo);
        localStorage.setItem('tema', nuevo);
        actualizarTexto();
    });
}

// Asignar eventos a los botones
document.querySelectorAll('[data-tipo]').forEach(btn => {
    const tipo = btn.dataset.tipo;
    btn.addEventListener('click', () => {
        let html = '';
        let descripcion = '';
        switch (tipo) {
            case 'parrafo':
                html = generarParrafo();
                descripcion = 'párrafo';
                break;
            case 'imagen':
                html = generarImagen();
                descripcion = 'imagen';
                break;
            case 'lista':
                html = generarLista();
                descripcion = 'lista';
                break;
            case 'tabla':
                html = generarTabla();
                descripcion = 'tabla';
                break;
            case 'video':
                html = generarVideo();
                descripcion = 'video';
                break;
            default:
                return;
        }
        agregarObjeto(html, descripcion);
    });
});

btnLimpiar.addEventListener('click', limpiarContenedor);

document.addEventListener('DOMContentLoaded', () => {
    inicializarModoOscuro();
    mostrarMensaje('🎉 Haz clic en los botones para agregar objetos HTML mediante innerHTML.');
});