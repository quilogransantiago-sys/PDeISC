/**
 * Archivo: main.js
 * Propósito: Controlador principal de eventos del DOM.
 * Módulos utilizados: imageManager.js
 * Funciones principales: agregarH1, cambiarTextoH1, cambiarColorH1, 
 *                        y delegación de imagen al módulo externo.
 */

import {
    agregarImagen,
    cambiarImagen,
    cambiarTamanioImagen,
    obtenerEstadoImagen
} from '/modules/imageManager.js';

// --- Referencias DOM ---
const areaMensajes = document.getElementById('areaMensajes');
const contenedorH1 = document.getElementById('contenedorH1');
let h1Elemento = null;  // Referencia al H1 creado

// --- Función para mostrar mensajes de feedback (sin alert) ---
function mostrarMensaje(texto, esError = false) {
    areaMensajes.innerHTML = `<span style="color: ${esError ? '#dc3545' : 'inherit'}">${texto}</span>`;
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
        if (areaMensajes.innerHTML.includes(texto)) {
            areaMensajes.innerHTML = '';
        }
    }, 3000);
}

// --- 1. Agregar H1 con texto "Hola DOM" ---
export function agregarH1() {
    if (h1Elemento) {
        mostrarMensaje('⚠️ El H1 ya fue agregado. Usa los otros botones para modificarlo.', true);
        return;
    }
    h1Elemento = document.createElement('h1');
    h1Elemento.textContent = 'Hola DOM';
    h1Elemento.style.transition = 'color 0.2s';
    contenedorH1.appendChild(h1Elemento);
    mostrarMensaje('✅ H1 agregado: "Hola DOM"');
}

// --- 2. Cambiar texto del H1 a "Chau DOM" ---
export function cambiarTextoH1() {
    if (!h1Elemento) {
        mostrarMensaje('❌ Primero debes agregar el H1 usando el botón "Agregar H1".', true);
        return;
    }
    h1Elemento.textContent = 'Chau DOM';
    mostrarMensaje('✏️ Texto cambiado a "Chau DOM"');
}

// --- 3. Cambiar color del H1 (ciclo de colores) ---
const colores = ['#0d6efd', '#dc3545', '#198754', '#ffc107', '#6f42c1'];
let indiceColor = 0;
export function cambiarColorH1() {
    if (!h1Elemento) {
        mostrarMensaje('❌ No hay H1 para cambiar color. Agrégalo primero.', true);
        return;
    }
    indiceColor = (indiceColor + 1) % colores.length;
    h1Elemento.style.color = colores[indiceColor];
    mostrarMensaje(`🎨 Color cambiado a ${colores[indiceColor]}`);
}

// --- Funciones para imagen (delegan al módulo imageManager) ---
export function manejarAgregarImagen() {
    const resultado = agregarImagen();
    if (resultado.exito) {
        mostrarMensaje(resultado.mensaje);
    } else {
        mostrarMensaje(resultado.mensaje, true);
    }
}

export function manejarCambiarImagen() {
    const resultado = cambiarImagen();
    if (resultado.exito) {
        mostrarMensaje(resultado.mensaje);
    } else {
        mostrarMensaje(resultado.mensaje, true);
    }
}

export function manejarCambiarTamanio() {
    const estado = obtenerEstadoImagen();
    if (!estado.existe) {
        mostrarMensaje('❌ No hay imagen para cambiar tamaño. Agrega una imagen primero.', true);
        return;
    }
    const resultado = cambiarTamanioImagen();
    mostrarMensaje(resultado.mensaje);
}

// --- Modo oscuro/claro con localStorage y variables CSS ---
function inicializarModoOscuro() {
    const btnTema = document.getElementById('btnModoOscuro');
    const root = document.documentElement;

    // Actualizar texto del botón según tema actual
    const actualizarTextoBoton = () => {
        const temaActual = root.getAttribute('data-tema');
        if (temaActual === 'oscuro') {
            btnTema.textContent = '☀️ Modo claro';
        } else {
            btnTema.textContent = '🌙 Modo oscuro';
        }
    };

    actualizarTextoBoton();

    btnTema.addEventListener('click', () => {
        const temaActual = root.getAttribute('data-tema');
        const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
        root.setAttribute('data-tema', nuevoTema);
        localStorage.setItem('tema', nuevoTema);
        actualizarTextoBoton();
        mostrarMensaje(`Tema cambiado a ${nuevoTema === 'oscuro' ? 'oscuro 🌙' : 'claro ☀️'}`);
    });
}

// --- Registrar event listeners al cargar el DOM ---
document.addEventListener('DOMContentLoaded', () => {
    // Botones H1
    document.getElementById('btnAgregarH1').addEventListener('click', agregarH1);
    document.getElementById('btnCambiarTextoH1').addEventListener('click', cambiarTextoH1);
    document.getElementById('btnCambiarColorH1').addEventListener('click', cambiarColorH1);

    // Botones Imagen
    document.getElementById('btnAgregarImagen').addEventListener('click', manejarAgregarImagen);
    document.getElementById('btnCambiarImagen').addEventListener('click', manejarCambiarImagen);
    document.getElementById('btnCambiarTamanio').addEventListener('click', manejarCambiarTamanio);

    // Modo oscuro
    inicializarModoOscuro();

    mostrarMensaje('🎉 Interfaz lista. Usa los botones para manipular el DOM.');
});