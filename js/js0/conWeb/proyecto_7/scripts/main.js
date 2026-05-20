/**
 * Control interactivo para indexOf() con búsqueda insensible a mayúsculas
 * y validaciones estrictas.
 */

import { buscarElemento, buscarElementoInsensible, agregarElemento } from '../modules/arrayHelpers.js';
import { validarTexto, validarNumero } from '../modules/validators.js';
import { mostrarMensaje, actualizarSpan } from '../modules/uiHelpers.js';

// ========== EJERCICIO 1: ANIMALES ==========
let animales = ["gato", "perro", "conejo", "loro"];
const animalesSpan = document.getElementById('animalesArray');
const buscarAnimalInput = document.getElementById('buscarAnimal');
const btnBuscarAnimal = document.getElementById('btnBuscarAnimal');
const nuevoAnimalInput = document.getElementById('nuevoAnimal');
const btnAgregarAnimal = document.getElementById('btnAgregarAnimal');
const mensajeAnimal = document.getElementById('mensajeAnimal');

function actualizarAnimales() {
    actualizarSpan(animalesSpan, animales);
}

function manejarBuscarAnimal() {
    const valor = buscarAnimalInput.value.trim();
    if (valor === '') {
        mostrarMensaje(mensajeAnimal, '❌ Escribe un animal para buscar.', 'error');
        return;
    }
    // Usamos búsqueda insensible a mayúsculas
    const indice = buscarElementoInsensible(animales, valor);
    if (indice !== -1) {
        mostrarMensaje(mensajeAnimal, `✅ "${valor}" está en la posición ${indice}.`, 'exito');
    } else {
        mostrarMensaje(mensajeAnimal, `❌ "${valor}" no se encontró en el array.`, 'error');
    }
    buscarAnimalInput.value = '';
    buscarAnimalInput.focus();
}

function manejarAgregarAnimal() {
    const validacion = validarTexto(nuevoAnimalInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeAnimal, validacion.mensaje, 'error');
        nuevoAnimalInput.value = '';
        nuevoAnimalInput.focus();
        return;
    }
    agregarElemento(animales, validacion.normalizado);
    actualizarAnimales();
    mostrarMensaje(mensajeAnimal, `➕ Se agregó "${validacion.normalizado}" al final del array.`, 'exito');
    nuevoAnimalInput.value = '';
    nuevoAnimalInput.focus();
}

// ========== EJERCICIO 2: NÚMEROS ==========
let numeros = [10, 25, 50, 75, 100];
const numerosSpan = document.getElementById('numerosArray');
const buscarNumeroInput = document.getElementById('buscarNumero');
const btnBuscarNumero = document.getElementById('btnBuscarNumero');
const nuevoNumeroInput = document.getElementById('nuevoNumero');
const btnAgregarNumero = document.getElementById('btnAgregarNumero');
const mensajeNumero = document.getElementById('mensajeNumero');

function actualizarNumeros() {
    actualizarSpan(numerosSpan, numeros);
}

function manejarBuscarNumero() {
    const valor = buscarNumeroInput.value.trim();
    if (valor === '') {
        mostrarMensaje(mensajeNumero, '❌ Escribe un número para buscar.', 'error');
        return;
    }
    const validacion = validarNumero(valor);
    if (!validacion.valido) {
        mostrarMensaje(mensajeNumero, validacion.mensaje, 'error');
        buscarNumeroInput.value = '';
        buscarNumeroInput.focus();
        return;
    }
    // Para números, usamos búsqueda exacta (indexOf normal, porque los números no tienen mayúsculas)
    const indice = buscarElemento(numeros, validacion.normalizado);
    if (indice !== -1) {
        mostrarMensaje(mensajeNumero, `✅ El número ${validacion.normalizado} está en la posición ${indice}.`, 'exito');
    } else {
        mostrarMensaje(mensajeNumero, `❌ El número ${validacion.normalizado} no está en el array.`, 'error');
    }
    buscarNumeroInput.value = '';
    buscarNumeroInput.focus();
}

function manejarAgregarNumero() {
    const validacion = validarNumero(nuevoNumeroInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeNumero, validacion.mensaje, 'error');
        nuevoNumeroInput.value = '';
        nuevoNumeroInput.focus();
        return;
    }
    agregarElemento(numeros, validacion.normalizado);
    actualizarNumeros();
    mostrarMensaje(mensajeNumero, `➕ Se agregó ${validacion.normalizado} al final del array.`, 'exito');
    nuevoNumeroInput.value = '';
    nuevoNumeroInput.focus();
}

// ========== EJERCICIO 3: CIUDADES ==========
let ciudades = ["Barcelona", "Valencia", "Sevilla", "Bilbao"];
const ciudadesSpan = document.getElementById('ciudadesArray');
const buscarCiudadInput = document.getElementById('buscarCiudad');
const btnBuscarCiudad = document.getElementById('btnBuscarCiudad');
const nuevaCiudadInput = document.getElementById('nuevaCiudad');
const btnAgregarCiudad = document.getElementById('btnAgregarCiudad');
const mensajeCiudad = document.getElementById('mensajeCiudad');

function actualizarCiudades() {
    actualizarSpan(ciudadesSpan, ciudades);
}

function manejarBuscarCiudad() {
    const valor = buscarCiudadInput.value.trim();
    if (valor === '') {
        mostrarMensaje(mensajeCiudad, '❌ Escribe una ciudad para buscar.', 'error');
        return;
    }
    // Búsqueda insensible a mayúsculas
    const indice = buscarElementoInsensible(ciudades, valor);
    if (indice !== -1) {
        mostrarMensaje(mensajeCiudad, `✅ "${valor}" está en la posición ${indice}.`, 'exito');
    } else {
        mostrarMensaje(mensajeCiudad, `❌ "${valor}" no se encuentra en el array de ciudades.`, 'error');
    }
    buscarCiudadInput.value = '';
    buscarCiudadInput.focus();
}

function manejarAgregarCiudad() {
    const validacion = validarTexto(nuevaCiudadInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeCiudad, validacion.mensaje, 'error');
        nuevaCiudadInput.value = '';
        nuevaCiudadInput.focus();
        return;
    }
    agregarElemento(ciudades, validacion.normalizado);
    actualizarCiudades();
    mostrarMensaje(mensajeCiudad, `➕ Se agregó "${validacion.normalizado}" al final del array.`, 'exito');
    nuevaCiudadInput.value = '';
    nuevaCiudadInput.focus();
}

// ========== INICIALIZAR ==========
function init() {
    actualizarAnimales();
    actualizarNumeros();
    actualizarCiudades();

    btnBuscarAnimal.addEventListener('click', manejarBuscarAnimal);
    btnAgregarAnimal.addEventListener('click', manejarAgregarAnimal);
    btnBuscarNumero.addEventListener('click', manejarBuscarNumero);
    btnAgregarNumero.addEventListener('click', manejarAgregarNumero);
    btnBuscarCiudad.addEventListener('click', manejarBuscarCiudad);
    btnAgregarCiudad.addEventListener('click', manejarAgregarCiudad);

    buscarAnimalInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarBuscarAnimal(); });
    buscarNumeroInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarBuscarNumero(); });
    buscarCiudadInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarBuscarCiudad(); });
}

init();