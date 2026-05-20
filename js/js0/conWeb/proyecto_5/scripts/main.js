/**
 * Controla los 3 ejercicios de splice().
 * Cada ejercicio trabaja sobre un solo array, modificándolo directamente.
 * Las validaciones son claras y los comentarios te ayudarán a explicarlo.
 */

import { eliminar, insertar, reemplazar } from '../modules/arrayHelpers.js';
import { validarNombre } from '../modules/validators.js';
import { mostrarMensaje, actualizarArrayEnSpan } from '../modules/uiHelpers.js';

// ========== EJERCICIO 1: LETRAS ==========
let letras = ['A', 'B', 'C', 'D', 'E'];
const letrasSpan = document.getElementById('letrasArray');
const btnEliminar = document.getElementById('btnEliminar');
const mensajeEliminar = document.getElementById('mensajeEliminar');

function actualizarLetras() {
    actualizarArrayEnSpan(letrasSpan, letras);
}

function manejarEliminar() {
    if (letras.length < 3) {
        mostrarMensaje(mensajeEliminar, '❌ No hay suficientes elementos para eliminar dos desde la posición 1.', 'error');
        return;
    }
    const eliminados = eliminar(letras, 1, 2);
    actualizarLetras();
    mostrarMensaje(mensajeEliminar, `✅ Eliminados: ${JSON.stringify(eliminados)}. Array ahora: ${JSON.stringify(letras)}`, 'exito');
}

// ========== EJERCICIO 2: NOMBRES (con validación) ==========
let nombres = ['Ana', 'Carlos', 'Luisa'];
const nombresSpan = document.getElementById('nombresArray');
const nombreInput = document.getElementById('nombreInput');
const btnInsertar = document.getElementById('btnInsertar');
const mensajeInsertar = document.getElementById('mensajeInsertar');

function actualizarNombres() {
    actualizarArrayEnSpan(nombresSpan, nombres);
}

function manejarInsertar() {
    const validacion = validarNombre(nombreInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeInsertar, validacion.mensaje, 'error');
        nombreInput.value = '';
        nombreInput.focus();
        return;
    }
    // Insertar en posición 1 sin eliminar
    insertar(nombres, 1, validacion.normalizado);
    actualizarNombres();
    mostrarMensaje(mensajeInsertar, `✨ Se insertó "${validacion.normalizado}" en la segunda posición. Array: ${JSON.stringify(nombres)}`, 'exito');
    nombreInput.value = '';
    nombreInput.focus();
}

// ========== EJERCICIO 3: COLORES ==========
let colores = ['Rojo', 'Verde', 'Azul', 'Amarillo', 'Naranja'];
const coloresSpan = document.getElementById('coloresArray');
const reemplazo1 = document.getElementById('reemplazo1');
const reemplazo2 = document.getElementById('reemplazo2');
const btnReemplazar = document.getElementById('btnReemplazar');
const mensajeReemplazar = document.getElementById('mensajeReemplazar');

function actualizarColores() {
    actualizarArrayEnSpan(coloresSpan, colores);
}

function manejarReemplazar() {
    const nuevo1 = reemplazo1.value.trim();
    const nuevo2 = reemplazo2.value.trim();
    if (nuevo1 === '' || nuevo2 === '') {
        mostrarMensaje(mensajeReemplazar, '❌ Ambos campos deben tener texto.', 'error');
        return;
    }
    // Necesitamos al menos 4 elementos para que desde la posición 2 haya dos para reemplazar
    if (colores.length < 4) {
        mostrarMensaje(mensajeReemplazar, '❌ No hay suficientes elementos para reemplazar dos desde la posición 2.', 'error');
        return;
    }
    const eliminados = reemplazar(colores, 2, 2, nuevo1, nuevo2);
    actualizarColores();
    mostrarMensaje(mensajeReemplazar, `🔄 Reemplazados ${JSON.stringify(eliminados)} por "${nuevo1}" y "${nuevo2}". Nuevo array: ${JSON.stringify(colores)}`, 'exito');
}

// ========== INICIAR ==========
function init() {
    actualizarLetras();
    actualizarNombres();
    actualizarColores();

    btnEliminar.addEventListener('click', manejarEliminar);
    btnInsertar.addEventListener('click', manejarInsertar);
    btnReemplazar.addEventListener('click', manejarReemplazar);

    nombreInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') manejarInsertar();
    });
}

init();