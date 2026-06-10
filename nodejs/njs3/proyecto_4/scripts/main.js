/**
 * main.js
 * Controlador principal: eventos de UI, modo oscuro, formulario para agregar enlaces.
 * Importa el módulo /modules/gestorEnlaces.js
 */
import { inicializarGestor, agregarEnlace } from '/modules/gestorEnlaces.js';

const contenedorEnlaces = document.getElementById('contenedorEnlaces');
const panelMensajes = document.getElementById('panelMensajes');
const btnAgregar = document.getElementById('btnAgregarEnlace');
const btnModoOscuro = document.getElementById('btnModoOscuro');

/**
 * Inicializa el modo claro/oscuro con localStorage
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

/**
 * Crea un pequeño formulario inline para agregar enlaces (sin alert())
 */
function mostrarFormularioAgregar() {
    const existente = document.querySelector('.form-agregar-temporal');
    if (existente) existente.remove();

    const formDiv = document.createElement('div');
    formDiv.className = 'form-agregar-temporal';
    formDiv.style.marginTop = '1rem';
    formDiv.style.padding = '1rem';
    formDiv.style.backgroundColor = 'var(--fondo)';
    formDiv.style.borderRadius = '0.75rem';
    formDiv.style.border = '1px solid var(--borde)';
    formDiv.innerHTML = `
        <input type="text" id="nuevoTexto" placeholder="Texto del enlace" style="width:100%; padding:0.5rem; margin-bottom:0.5rem; background:var(--card-fondo); color:var(--texto); border:1px solid var(--borde); border-radius:0.5rem;">
        <input type="url" id="nuevoHref" placeholder="URL (ej: https://...)" style="width:100%; padding:0.5rem; margin-bottom:0.5rem; background:var(--card-fondo); color:var(--texto); border:1px solid var(--borde); border-radius:0.5rem;">
        <div style="display:flex; gap:0.5rem;">
            <button id="confirmarAgregar" class="btn btn-primario">Confirmar</button>
            <button id="cancelarAgregar" class="btn">Cancelar</button>
        </div>
    `;
    btnAgregar.insertAdjacentElement('afterend', formDiv);

    formDiv.querySelector('#confirmarAgregar').addEventListener('click', () => {
        const texto = document.getElementById('nuevoTexto').value.trim();
        let href = document.getElementById('nuevoHref').value.trim();
        if (texto === '') {
            panelMensajes.innerHTML = '<span style="color:#dc3545;">❌ El texto no puede estar vacío.</span>';
            setTimeout(() => { if (panelMensajes.innerHTML.includes('vacío')) panelMensajes.innerHTML = ''; }, 2000);
            return;
        }
        if (href === '') href = '#';
        else if (!href.startsWith('http://') && !href.startsWith('https://')) href = 'https://' + href;
        agregarEnlace(texto, href);
        formDiv.remove();
    });

    formDiv.querySelector('#cancelarAgregar').addEventListener('click', () => formDiv.remove());
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    inicializarGestor(contenedorEnlaces, panelMensajes);
    inicializarModoOscuro();
    btnAgregar.addEventListener('click', mostrarFormularioAgregar);
});