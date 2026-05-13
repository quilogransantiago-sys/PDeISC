/**
 * Control para includes(): busca "admin", "verde" y evita duplicados en números.
 * Se usa comparación insensible a mayúsculas.
 */

import { contieneInsensible, agregarElemento } from '../modules/arrayHelpers.js';
import { validarTexto, validarNumero } from '../modules/validators.js';
import { mostrarMensaje, actualizarSpan } from '../modules/uiHelpers.js';

// ========== EJERCICIO 1: USUARIOS (buscar "admin") ==========
let usuarios = ["admin", "pepe", "maria", "root"];
const usuariosSpan = document.getElementById('usuariosArray');
const buscarAdminInput = document.getElementById('buscarAdmin');
const btnBuscarAdmin = document.getElementById('btnBuscarAdmin');
const nuevoUsuarioInput = document.getElementById('nuevoUsuario');
const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
const mensajeAdmin = document.getElementById('mensajeAdmin');

function actualizarUsuarios() {
    actualizarSpan(usuariosSpan, usuarios);
}

function manejarBuscarAdmin() {
    let valor = buscarAdminInput.value.trim();
    if (valor === '') {
        mostrarMensaje(mensajeAdmin, '❌ Escribe algo para buscar.', 'error');
        return;
    }
    // Validar que solo sean letras (opcional, pero lo hacemos)
    const validacion = validarTexto(valor);
    if (!validacion.valido) {
        mostrarMensaje(mensajeAdmin, validacion.mensaje, 'error');
        buscarAdminInput.value = '';
        buscarAdminInput.focus();
        return;
    }
    const existe = contieneInsensible(usuarios, valor);
    if (existe) {
        mostrarMensaje(mensajeAdmin, `✅ "${valor}" SÍ está en el array.`, 'exito');
    } else {
        mostrarMensaje(mensajeAdmin, `❌ "${valor}" NO está en el array.`, 'error');
    }
    buscarAdminInput.value = '';
    buscarAdminInput.focus();
}

function manejarAgregarUsuario() {
    const validacion = validarTexto(nuevoUsuarioInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeAdmin, validacion.mensaje, 'error');
        nuevoUsuarioInput.value = '';
        nuevoUsuarioInput.focus();
        return;
    }
    agregarElemento(usuarios, validacion.normalizado);
    actualizarUsuarios();
    mostrarMensaje(mensajeAdmin, `➕ Se agregó "${validacion.normalizado}".`, 'exito');
    nuevoUsuarioInput.value = '';
    nuevoUsuarioInput.focus();
}

// ========== EJERCICIO 2: COLORES (buscar "verde") ==========
let colores = ["rojo", "azul", "amarillo", "negro"];
const coloresSpan = document.getElementById('coloresArray');
const buscarVerdeInput = document.getElementById('buscarVerde');
const btnBuscarVerde = document.getElementById('btnBuscarVerde');
const nuevoColorInput = document.getElementById('nuevoColor');
const btnAgregarColor = document.getElementById('btnAgregarColor');
const mensajeVerde = document.getElementById('mensajeVerde');

function actualizarColores() {
    actualizarSpan(coloresSpan, colores);
}

function manejarBuscarColor() {
    let valor = buscarVerdeInput.value.trim();
    if (valor === '') {
        mostrarMensaje(mensajeVerde, '❌ Escribe un color para buscar.', 'error');
        return;
    }
    const validacion = validarTexto(valor);
    if (!validacion.valido) {
        mostrarMensaje(mensajeVerde, validacion.mensaje, 'error');
        buscarVerdeInput.value = '';
        buscarVerdeInput.focus();
        return;
    }
    const existe = contieneInsensible(colores, valor);
    if (existe) {
        mostrarMensaje(mensajeVerde, `✅ "${valor}" SÍ está en la lista de colores.`, 'exito');
    } else {
        mostrarMensaje(mensajeVerde, `❌ "${valor}" NO está en la lista.`, 'error');
    }
    buscarVerdeInput.value = '';
    buscarVerdeInput.focus();
}

function manejarAgregarColor() {
    const validacion = validarTexto(nuevoColorInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeVerde, validacion.mensaje, 'error');
        nuevoColorInput.value = '';
        nuevoColorInput.focus();
        return;
    }
    agregarElemento(colores, validacion.normalizado);
    actualizarColores();
    mostrarMensaje(mensajeVerde, `➕ Se agregó "${validacion.normalizado}".`, 'exito');
    nuevoColorInput.value = '';
    nuevoColorInput.focus();
}

// ========== EJERCICIO 3: NÚMEROS (verificar antes de sumar) ==========
let numeros = [5, 12, 8, 20];
const numerosSpan = document.getElementById('numerosArray');
const numeroAgregarInput = document.getElementById('numeroAgregar');
const btnAgregarNumero = document.getElementById('btnAgregarNumero');
const mensajeNumero = document.getElementById('mensajeNumero');

function actualizarNumeros() {
    actualizarSpan(numerosSpan, numeros);
}

function manejarAgregarNumero() {
    const validacion = validarNumero(numeroAgregarInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeNumero, validacion.mensaje, 'error');
        numeroAgregarInput.value = '';
        numeroAgregarInput.focus();
        return;
    }
    const numero = validacion.normalizado;
    // Usamos includes() normal porque los números no tienen mayúsculas
    if (numeros.includes(numero)) {
        mostrarMensaje(mensajeNumero, `⚠️ El número ${numero} ya existe. No se agregó.`, 'error');
    } else {
        agregarElemento(numeros, numero);
        actualizarNumeros();
        mostrarMensaje(mensajeNumero, `➕ Se agregó ${numero} al array.`, 'exito');
    }
    numeroAgregarInput.value = '';
    numeroAgregarInput.focus();
}

// ========== INICIALIZAR ==========
function init() {
    actualizarUsuarios();
    actualizarColores();
    actualizarNumeros();

    btnBuscarAdmin.addEventListener('click', manejarBuscarAdmin);
    btnAgregarUsuario.addEventListener('click', manejarAgregarUsuario);
    btnBuscarVerde.addEventListener('click', manejarBuscarColor);
    btnAgregarColor.addEventListener('click', manejarAgregarColor);
    btnAgregarNumero.addEventListener('click', manejarAgregarNumero);

    // Permitir Enter
    buscarAdminInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarBuscarAdmin(); });
    buscarVerdeInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarBuscarColor(); });
    numeroAgregarInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarNumero(); });
}

init();