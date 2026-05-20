/**
 * Controla los tres ejercicios de slice().
 * Ejercicio 1: array de números.
 * Ejercicios 2 y 3: comparten el mismo array de películas.
 * slice() nunca modifica el original.
 */

import { obtenerPrimeros, obtenerRango, obtenerUltimos } from '../modules/arrayHelpers.js';
import { mostrarMensaje, actualizarSpan } from '../modules/uiHelpers.js';

// ========== EJERCICIO 1: primeros 3 (números) ==========
const numeros = [10, 20, 30, 40, 50, 60];
const numerosOriginalSpan = document.getElementById('numerosOriginal');
const primeros3Span = document.getElementById('primeros3');
const btnPrimeros3 = document.getElementById('btnPrimeros3');
const mensaje1 = document.getElementById('mensaje1');

actualizarSpan(numerosOriginalSpan, numeros);

function manejarPrimeros3() {
    if (numeros.length < 3) {
        mostrarMensaje(mensaje1, '❌ El array tiene menos de 3 elementos.', 'error');
        return;
    }
    const copia = obtenerPrimeros(numeros, 3);
    actualizarSpan(primeros3Span, copia);
    mostrarMensaje(mensaje1, `✅ Copiados los primeros 3: ${JSON.stringify(copia)}`, 'exito');
}

// ========== EJERCICIOS 2 y 3: comparten el mismo array de películas ==========
const peliculas = ["El Padrino", "Titanic", "Inception", "Gladiador", "Matrix"];

// Elementos del ejercicio 2
const peliculasOriginalSpan = document.getElementById('peliculasOriginal');
const copiaPeliculasSpan = document.getElementById('copiaPeliculas');
const btnPeliculas = document.getElementById('btnPeliculas');
const mensaje2 = document.getElementById('mensaje2');

// Elementos del ejercicio 3 (usa el mismo array)
const peliculasParaUltimosSpan = document.getElementById('peliculasParaUltimos');
const ultimos3Span = document.getElementById('ultimos3');
const btnUltimos3 = document.getElementById('btnUltimos3');
const mensaje3 = document.getElementById('mensaje3');

// Función para mostrar el array original en ambos lugares
function actualizarMostrarPeliculas() {
    actualizarSpan(peliculasOriginalSpan, peliculas);
    actualizarSpan(peliculasParaUltimosSpan, peliculas);
}

actualizarMostrarPeliculas();

// Ejercicio 2: slice(2,5) para copiar posiciones 2,3,4
function manejarPeliculas() {
    if (peliculas.length < 5) {
        mostrarMensaje(mensaje2, '❌ No hay suficientes películas para copiar desde posición 2 a 4.', 'error');
        return;
    }
    const copia = obtenerRango(peliculas, 2, 5);
    actualizarSpan(copiaPeliculasSpan, copia);
    mostrarMensaje(mensaje2, `🎬 Copia de posiciones 2 a 4: ${JSON.stringify(copia)}`, 'exito');
}

// Ejercicio 3: slice(-3) para copiar los últimos 3 elementos
function manejarUltimos3() {
    if (peliculas.length < 3) {
        mostrarMensaje(mensaje3, '❌ El array tiene menos de 3 elementos.', 'error');
        return;
    }
    const copia = obtenerUltimos(peliculas, 3);
    actualizarSpan(ultimos3Span, copia);
    mostrarMensaje(mensaje3, `🍍 Últimos 3 elementos: ${JSON.stringify(copia)}`, 'exito');
}

// ========== REGISTRAR EVENTOS ==========
btnPrimeros3.addEventListener('click', manejarPrimeros3);
btnPeliculas.addEventListener('click', manejarPeliculas);
btnUltimos3.addEventListener('click', manejarUltimos3);