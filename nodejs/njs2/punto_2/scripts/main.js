/**
 * main.js
 * Controla el modo claro/oscuro: botón, aplicación de clase y persistencia en localStorage.
 * No se usa alert().
 * Módulos: ninguno externo (es simple, pero cumple modularidad por separación de archivos).
 */

// Referencias al DOM
const botonTema = document.getElementById('btn-tema');
const htmlElemento = document.documentElement;

/**
 * Cambia el tema actual y lo guarda en localStorage.
 * @param {boolean} activarOscuro - true = modo oscuro, false = modo claro.
 */
function establecerTema(activarOscuro) {
    if (activarOscuro) {
        htmlElemento.classList.add('modo-oscuro');
        localStorage.setItem('tema', 'oscuro');
        // Actualizar texto del botón (opcional)
        if (botonTema) botonTema.textContent = 'Modo claro';
    } else {
        htmlElemento.classList.remove('modo-oscuro');
        localStorage.setItem('tema', 'claro');
        if (botonTema) botonTema.textContent = 'Modo oscuro';
    }
}

/**
 * Alterna entre modo claro y oscuro.
 */
function alternarTema() {
    const esOscuroActual = htmlElemento.classList.contains('modo-oscuro');
    establecerTema(!esOscuroActual);
}

// Inicializar el botón y sincronizar texto según el tema actual al cargar la página
function inicializarTema() {
    const esOscuro = htmlElemento.classList.contains('modo-oscuro');
    if (botonTema) {
        botonTema.textContent = esOscuro ? 'Modo claro' : 'Modo oscuro';
        botonTema.addEventListener('click', alternarTema);
    }
}

// Ejecutar inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarTema);
} else {
    inicializarTema();
}