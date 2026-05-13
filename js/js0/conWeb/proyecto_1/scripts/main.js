// Módulo principal: orquesta los tres ejercicios, importa funciones modulares
import { validarFruta, validarAmigo, validarNumeroMayor } from '../modules/validators.js';
import { agregarConPush, obtenerUltimoElemento } from '../modules/arrayHelpers.js';
import { mostrarMensaje, actualizarVisualizacionArray, limpiarYEnfocar } from '../modules/uiHelpers.js';

// ---------- ESTADO DE ARRAYS ----------
let frutas = [];               // Array vacío para ejercicio 1
let amigos = [];              // Array vacío para ejercicio 2
let numeros = [5, 12, 8];     // Array con 3 números de ejemplo

// ---------- REFERENCIAS DOM ----------
// Ejercicio 1
const frutasArraySpan = document.getElementById('frutasArray');
const frutaInput = document.getElementById('frutaInput');
const agregarFrutaBtn = document.getElementById('agregarFrutaBtn');
const frutaMensajeDiv = document.getElementById('frutaMensaje');

// Ejercicio 2
const amigosArraySpan = document.getElementById('amigosArray');
const amigoInput = document.getElementById('amigoInput');
const agregarAmigoBtn = document.getElementById('agregarAmigoBtn');
const amigoMensajeDiv = document.getElementById('amigoMensaje');

// Ejercicio 3
const numerosArraySpan = document.getElementById('numerosArray');
const ultimoNumeroSpan = document.getElementById('ultimoNumero');
const numeroInput = document.getElementById('numeroInput');
const agregarNumeroBtn = document.getElementById('agregarNumeroBtn');
const numeroMensajeDiv = document.getElementById('numeroMensaje');

// ---------- FUNCIONES DE ACTUALIZACIÓN DE UI (atomizadas) ----------
function actualizarUIFrutas() {
    actualizarVisualizacionArray(frutasArraySpan, frutas);
}

function actualizarUIAmigos() {
    actualizarVisualizacionArray(amigosArraySpan, amigos);
}

function actualizarUINumeros() {
    actualizarVisualizacionArray(numerosArraySpan, numeros);
    const ultimo = obtenerUltimoElemento(numeros);
    if (ultimoNumeroSpan) {
        ultimoNumeroSpan.textContent = ultimo !== undefined ? ultimo : 'N/A';
    }
}

// ---------- MANEJADORES (cada uno con validación y push condicional) ----------
// Ejercicio 1: agregar fruta SOLO si es una fruta válida Y no duplicada
function manejarAgregarFruta() {
    const valorInput = frutaInput.value;
    // Pasamos el array actual de frutas para verificar duplicados
    const validacion = validarFruta(valorInput, frutas);

    if (!validacion.valido) {
        mostrarMensaje(frutaMensajeDiv, validacion.mensaje, 'error');
        limpiarYEnfocar(frutaInput);
        return;
    }

    // Si es válido (fruta reconocida y no repetida), usar push()
    agregarConPush(frutas, validacion.normalizado);
    actualizarUIFrutas();
    mostrarMensaje(frutaMensajeDiv, `🍇 "${validacion.normalizado}" agregada con push().`, 'exito');
    limpiarYEnfocar(frutaInput);
}

// Ejercicio 2: agregar amigo
function manejarAgregarAmigo() {
    const valorInput = amigoInput.value;
    const validacion = validarAmigo(valorInput);

    if (!validacion.valido) {
        mostrarMensaje(amigoMensajeDiv, validacion.mensaje, 'error');
        limpiarYEnfocar(amigoInput);
        return;
    }

    agregarConPush(amigos, validacion.normalizado);
    actualizarUIAmigos();
    mostrarMensaje(amigoMensajeDiv, `👋 ${validacion.normalizado} agregado a amigos.`, 'exito');
    limpiarYEnfocar(amigoInput);
}

// Ejercicio 3: agregar número solo si es mayor que el último
function manejarAgregarNumero() {
    const inputNumero = numeroInput.value;
    const ultimo = obtenerUltimoElemento(numeros);

    // Si el array está vacío, permitir cualquier número (caso borde, pero tenemos números iniciales)
    if (ultimo === undefined) {
        const num = parseFloat(inputNumero);
        if (!isNaN(num)) {
            agregarConPush(numeros, num);
            actualizarUINumeros();
            mostrarMensaje(numeroMensajeDiv, `➕ ${num} agregado (array estaba vacío).`, 'exito');
            limpiarYEnfocar(numeroInput);
        } else {
            mostrarMensaje(numeroMensajeDiv, 'Ingrese un número válido.', 'error');
        }
        return;
    }

    const validacion = validarNumeroMayor(inputNumero, ultimo);
    if (!validacion.valido) {
        mostrarMensaje(numeroMensajeDiv, validacion.mensaje, 'error');
        limpiarYEnfocar(numeroInput);
        return;
    }

    // Condición superada: usar push()
    agregarConPush(numeros, validacion.normalizado);
    actualizarUINumeros();
    mostrarMensaje(numeroMensajeDiv, validacion.mensaje, 'exito');
    limpiarYEnfocar(numeroInput);
}

// ---------- INICIALIZACIÓN: mostrar UI inicial, registrar eventos ----------
function init() {
    actualizarUIFrutas();
    actualizarUIAmigos();
    actualizarUINumeros();

    agregarFrutaBtn.addEventListener('click', manejarAgregarFruta);
    agregarAmigoBtn.addEventListener('click', manejarAgregarAmigo);
    agregarNumeroBtn.addEventListener('click', manejarAgregarNumero);

    frutaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarFruta(); });
    amigoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarAmigo(); });
    numeroInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarNumero(); });
}

init();