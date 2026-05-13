import { agregarElemento } from '../modules/arrayHelpers.js';
import { validarTexto, validarNumero, validarEdad } from '../modules/validators.js';
import { mostrarMensaje, actualizarSpan, limpiarResultado } from '../modules/uiHelpers.js';

// ========== EJERCICIO 1: NOMBRES CON SALUDO ==========
let nombres = ["Ana", "Carlos", "Lucía", "Miguel"];
const nombresSpan = document.getElementById('nombresArray');
const nuevoNombreInput = document.getElementById('nuevoNombre');
const btnAgregarNombre = document.getElementById('btnAgregarNombre');
const btnSaludar = document.getElementById('btnSaludar');
const resultadoSaludos = document.getElementById('resultadoSaludos');
const mensajeSaludos = document.getElementById('mensajeSaludos');

function actualizarNombres() {
    actualizarSpan(nombresSpan, nombres);
}

function manejarAgregarNombre() {
    const validacion = validarTexto(nuevoNombreInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeSaludos, validacion.mensaje, 'error');
        nuevoNombreInput.value = '';
        nuevoNombreInput.focus();
        return;
    }
    agregarElemento(nombres, validacion.normalizado);
    actualizarNombres();
    mostrarMensaje(mensajeSaludos, `➕ Se agregó "${validacion.normalizado}".`, 'exito');
    nuevoNombreInput.value = '';
    nuevoNombreInput.focus();
}

function manejarSaludar() {
    if (nombres.length === 0) {
        mostrarMensaje(mensajeSaludos, '❌ No hay nombres para saludar.', 'error');
        return;
    }
    limpiarResultado(resultadoSaludos);
    // Uso de forEach() para mostrar saludo
    nombres.forEach(nombre => {
        const saludo = document.createElement('div');
        saludo.textContent = `👋 Hola, ${nombre}! Bienvenido/a.`;
        resultadoSaludos.appendChild(saludo);
    });
    mostrarMensaje(mensajeSaludos, '✅ Saludos generados con forEach()', 'exito');
}

// ========== EJERCICIO 2: DOBLE DE CADA NÚMERO ==========
let numeros = [3, 7, 12, 5];
const numerosSpan = document.getElementById('numerosArray');
const nuevoNumeroInput = document.getElementById('nuevoNumero');
const btnAgregarNumero = document.getElementById('btnAgregarNumero');
const btnDoble = document.getElementById('btnDoble');
const resultadoDobles = document.getElementById('resultadoDobles');
const mensajeDobles = document.getElementById('mensajeDobles');

function actualizarNumeros() {
    actualizarSpan(numerosSpan, numeros);
}

function manejarAgregarNumero() {
    const validacion = validarNumero(nuevoNumeroInput.value);
    if (!validacion.valido) {
        mostrarMensaje(mensajeDobles, validacion.mensaje, 'error');
        nuevoNumeroInput.value = '';
        nuevoNumeroInput.focus();
        return;
    }
    agregarElemento(numeros, validacion.normalizado);
    actualizarNumeros();
    mostrarMensaje(mensajeDobles, `➕ Se agregó ${validacion.normalizado}.`, 'exito');
    nuevoNumeroInput.value = '';
    nuevoNumeroInput.focus();
}

function manejarDoble() {
    if (numeros.length === 0) {
        mostrarMensaje(mensajeDobles, '❌ No hay números para calcular.', 'error');
        return;
    }
    limpiarResultado(resultadoDobles);
    // forEach() para mostrar el doble
    numeros.forEach(num => {
        const doble = num * 2;
        const linea = document.createElement('div');
        linea.textContent = `🔢 ${num} → su doble es ${doble}`;
        resultadoDobles.appendChild(linea);
    });
    mostrarMensaje(mensajeDobles, '✅ Cálculo completado con forEach()', 'exito');
}

// ========== EJERCICIO 3: ARRAY DE OBJETOS (nombre, edad) ==========
let personas = [
    { nombre: "Ana", edad: 25 },
    { nombre: "Luis", edad: 30 },
    { nombre: "Eva", edad: 22 }
];
const personasSpan = document.getElementById('personasArray');
const nuevaPersonaNombre = document.getElementById('nuevaPersonaNombre');
const nuevaPersonaEdad = document.getElementById('nuevaPersonaEdad');
const btnAgregarPersona = document.getElementById('btnAgregarPersona');
const btnMostrarPersonas = document.getElementById('btnMostrarPersonas');
const resultadoPersonas = document.getElementById('resultadoPersonas');
const mensajePersonas = document.getElementById('mensajePersonas');

function actualizarPersonas() {
    actualizarSpan(personasSpan, personas);
}

function manejarAgregarPersona() {
    const nombreValid = validarTexto(nuevaPersonaNombre.value);
    if (!nombreValid.valido) {
        mostrarMensaje(mensajePersonas, nombreValid.mensaje, 'error');
        nuevaPersonaNombre.value = '';
        nuevaPersonaNombre.focus();
        return;
    }
    const edadValid = validarEdad(nuevaPersonaEdad.value);
    if (!edadValid.valido) {
        mostrarMensaje(mensajePersonas, edadValid.mensaje, 'error');
        nuevaPersonaEdad.value = '';
        nuevaPersonaEdad.focus();
        return;
    }
    const nuevaPersona = { nombre: nombreValid.normalizado, edad: edadValid.normalizado };
    agregarElemento(personas, nuevaPersona);
    actualizarPersonas();
    mostrarMensaje(mensajePersonas, `➕ Se agregó ${nombreValid.normalizado} (${edadValid.normalizado} años).`, 'exito');
    nuevaPersonaNombre.value = '';
    nuevaPersonaEdad.value = '';
    nuevaPersonaNombre.focus();
}

function manejarMostrarPersonas() {
    if (personas.length === 0) {
        mostrarMensaje(mensajePersonas, '❌ No hay personas para mostrar.', 'error');
        return;
    }
    limpiarResultado(resultadoPersonas);
    // forEach() recorriendo objetos
    personas.forEach(persona => {
        const info = document.createElement('div');
        info.textContent = `🧑 ${persona.nombre} → Edad: ${persona.edad} años`;
        resultadoPersonas.appendChild(info);
    });
    mostrarMensaje(mensajePersonas, '✅ Lista completa mostrada con forEach()', 'exito');
}

// ========== INICIALIZACIÓN ==========
function init() {
    actualizarNombres();
    actualizarNumeros();
    actualizarPersonas();

    btnAgregarNombre.addEventListener('click', manejarAgregarNombre);
    btnSaludar.addEventListener('click', manejarSaludar);
    btnAgregarNumero.addEventListener('click', manejarAgregarNumero);
    btnDoble.addEventListener('click', manejarDoble);
    btnAgregarPersona.addEventListener('click', manejarAgregarPersona);
    btnMostrarPersonas.addEventListener('click', manejarMostrarPersonas);

    // Enter en campos
    nuevoNombreInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarNombre(); });
    nuevoNumeroInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarNumero(); });
    nuevaPersonaNombre.addEventListener('keypress', (e) => { if (e.key === 'Enter') manejarAgregarPersona(); });
}

init();