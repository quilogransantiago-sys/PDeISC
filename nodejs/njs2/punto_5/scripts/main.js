/**
 * main.js
 * Controla el modo claro/oscuro y carga el menú hamburguesa (módulo).
 * Se ejecuta en todas las páginas.
 */

import { crearMenuHamburguesa } from './menuHamburguesa.js';

// Modo oscuro/claro
const botonTema = document.getElementById('btn-tema');
const html = document.documentElement;

function aplicarTema(oscuro) {
    if (oscuro) {
        html.classList.add('modo-oscuro');
        localStorage.setItem('tema', 'oscuro');
        if (botonTema) botonTema.textContent = 'Modo claro';
    } else {
        html.classList.remove('modo-oscuro');
        localStorage.setItem('tema', 'claro');
        if (botonTema) botonTema.textContent = 'Modo oscuro';
    }
}

function alternarTema() {
    const esOscuro = html.classList.contains('modo-oscuro');
    aplicarTema(!esOscuro);
}

if (botonTema) {
    botonTema.addEventListener('click', alternarTema);
    // Sincronizar texto al cargar
    const esOscuroActual = html.classList.contains('modo-oscuro');
    botonTema.textContent = esOscuroActual ? 'Modo claro' : 'Modo oscuro';
}

// Crear menú hamburguesa (módulo)
crearMenuHamburguesa();