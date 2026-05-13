// Módulo principal para los ejercicios de pop()
import { eliminarUltimo, vaciarConWhile } from '../modules/arrayHelpers.js';
import { mostrarMensaje, actualizarArrayVisual } from '../modules/uiHelpers.js';

// ---------- ESTADO DE ARRAYS ----------
let animales = ["perro", "gato", "elefante"];
let compras = ["leche", "pan", "huevos", "manzanas"];
let numeros = [10, 20, 30, 40, 50];

// ---------- REFERENCIAS DOM ----------
const animalesSpan = document.getElementById('animalesArray');
const comprasSpan = document.getElementById('comprasArray');
const numerosSpan = document.getElementById('numerosArray');

const animalMensaje = document.getElementById('animalMensaje');
const compraMensaje = document.getElementById('compraMensaje');
const vaciarMensaje = document.getElementById('vaciarMensaje');

const popAnimalBtn = document.getElementById('popAnimalBtn');
const popCompraBtn = document.getElementById('popCompraBtn');
const vaciarBtn = document.getElementById('vaciarBtn');

// ---------- FUNCIONES DE ACTUALIZACIÓN UI ----------
function actualizarUIAnimales() {
    actualizarArrayVisual(animalesSpan, animales);
}

function actualizarUICompras() {
    actualizarArrayVisual(comprasSpan, compras);
}

function actualizarUINumeros() {
    actualizarArrayVisual(numerosSpan, numeros);
}

// ---------- EJERCICIO 1: pop() en animales ----------
function manejarPopAnimal() {
    const resultado = eliminarUltimo(animales);
    if (resultado.vacio) {
        mostrarMensaje(animalMensaje, '⚠️ No hay más animales para eliminar.', 'error');
    } else {
        mostrarMensaje(animalMensaje, `🗑️ Se eliminó "${resultado.eliminado}" con pop().`, 'exito');
        actualizarUIAnimales();
    }
}

// ---------- EJERCICIO 2: pop() en compras ----------
function manejarPopCompra() {
    const resultado = eliminarUltimo(compras);
    if (resultado.vacio) {
        mostrarMensaje(compraMensaje, '🛒 La lista de compras está vacía. No se puede eliminar más.', 'error');
    } else {
        mostrarMensaje(compraMensaje, `🧾 Producto eliminado: "${resultado.eliminado}".`, 'exito');
        actualizarUICompras();
    }
}

// ---------- EJERCICIO 3: Vaciar array con while y pop() (sin registro extra) ----------
function manejarVaciarArray() {
    if (numeros.length === 0) {
        mostrarMensaje(vaciarMensaje, 'El array ya está vacío. No hay nada que eliminar.', 'error');
        return;
    }

    const cantidadOriginal = numeros.length;
    const eliminados = vaciarConWhile(numeros); // vacía el array y retorna los elementos eliminados

    actualizarUINumeros();
    mostrarMensaje(vaciarMensaje, `🧹 Array vaciado correctamente. Se eliminaron ${cantidadOriginal} elementos usando while + pop().`, 'exito');
}

// ---------- INICIALIZACIÓN ----------
function init() {
    actualizarUIAnimales();
    actualizarUICompras();
    actualizarUINumeros();

    popAnimalBtn.addEventListener('click', manejarPopAnimal);
    popCompraBtn.addEventListener('click', manejarPopCompra);
    vaciarBtn.addEventListener('click', manejarVaciarArray);
}

init();