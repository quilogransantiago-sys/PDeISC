/**
 * Módulo principal del proyecto unshift().
 * 
 * Orquesta los tres ejercicios:
 * 1. Colores: botones que agregan al principio (sin validación).
 * 2. Tareas: input con validación, agrega tarea urgente al principio.
 * 3. Usuarios: input con validación de nombre, agrega al principio.
 * 
 * Se importan funciones modulares desde validators, arrayHelpers y uiHelpers.
 * El estado de los arrays se mantiene en variables locales (cierre del módulo).
 * 
 * @module main
 */

// Importar funciones específicas de cada módulo.
import { validarTarea, validarUsuario } from '../modules/validators.js';
import { agregarAlPrincipio } from '../modules/arrayHelpers.js';
import { mostrarMensaje, actualizarArrayVisual, limpiarYEnfocar } from '../modules/uiHelpers.js';

// ========== ESTADO DE ARRAYS (estado central de la aplicación) ==========
// Ejercicio 1: comienza vacío para demostrar unshift() en array vacío.
let colores = [];

// Ejercicio 2: array predefinido con tareas normales.
let tareas = ["Estudiar", "Comprar pan", "Llamar a mamá"];

// Ejercicio 3: array predefinido con usuarios conectados.
let usuarios = ["Ana", "Luis", "Marta"];

// ========== REFERENCIAS A ELEMENTOS DEL DOM ==========
// Se obtienen una sola vez al cargar la página para evitar consultas repetitivas.
// Ejercicio 1
const coloresSpan = document.getElementById('coloresArray');
const agregarRojoBtn = document.getElementById('agregarRojoBtn');
const agregarVerdeBtn = document.getElementById('agregarVerdeBtn');
const agregarAzulBtn = document.getElementById('agregarAzulBtn');
const colorMensaje = document.getElementById('colorMensaje');

// Ejercicio 2
const tareasSpan = document.getElementById('tareasArray');
const tareaInput = document.getElementById('tareaInput');
const agregarTareaBtn = document.getElementById('agregarTareaBtn');
const tareaMensaje = document.getElementById('tareaMensaje');

// Ejercicio 3
const usuariosSpan = document.getElementById('usuariosArray');
const usuarioInput = document.getElementById('usuarioInput');
const agregarUsuarioBtn = document.getElementById('agregarUsuarioBtn');
const usuarioMensaje = document.getElementById('usuarioMensaje');

// ========== FUNCIONES DE ACTUALIZACIÓN DE UI ==========
// Cada una actualiza el span correspondiente con el contenido actual del array.
function actualizarUIColores() {
    actualizarArrayVisual(coloresSpan, colores);
}

function actualizarUITareas() {
    actualizarArrayVisual(tareasSpan, tareas);
}

function actualizarUIUsuarios() {
    actualizarArrayVisual(usuariosSpan, usuarios);
}

// ========== EJERCICIO 1: COLORES ==========
/**
 * Función genérica para agregar un color al array colores usando unshift().
 * Luego actualiza la UI y muestra un mensaje de éxito.
 * 
 * @param {string} color - Nombre del color a agregar (ej: 'Rojo')
 */
function agregarColor(color) {
    agregarAlPrincipio(colores, color);  // Mutación del array
    actualizarUIColores();
    mostrarMensaje(
        colorMensaje,
        `🎨 "${color}" agregado al principio con unshift(). Array: [${colores.join(', ')}]`,
        'exito'
    );
}

// Manejadores específicos para cada botón.
function manejarRojo() { agregarColor('Rojo'); }
function manejarVerde() { agregarColor('Verde'); }
function manejarAzul() { agregarColor('Azul'); }

// ========== EJERCICIO 2: TAREAS URGENTES ==========
/**
 * Lee el input de tarea, lo valida y si es correcto lo agrega al inicio del array
 * de tareas usando unshift(). Se muestra mensaje de éxito o error.
 */
function manejarAgregarTarea() {
    const validacion = validarTarea(tareaInput.value);

    if (!validacion.valido) {
        mostrarMensaje(tareaMensaje, validacion.mensaje, 'error');
        limpiarYEnfocar(tareaInput);
        return;
    }

    // Si la validación fue exitosa:
    agregarAlPrincipio(tareas, validacion.normalizado);
    actualizarUITareas();
    mostrarMensaje(
        tareaMensaje,
        `📌 Tarea urgente "${validacion.normalizado}" agregada al principio con unshift().`,
        'exito'
    );
    limpiarYEnfocar(tareaInput);
}

// ========== EJERCICIO 3: USUARIOS CONECTADOS ==========
/**
 * Valida el nombre del usuario, y si es correcto lo agrega al principio del array
 * de usuarios usando unshift(). El nuevo usuario será el primero en la lista.
 */
function manejarAgregarUsuario() {
    const validacion = validarUsuario(usuarioInput.value);

    if (!validacion.valido) {
        mostrarMensaje(usuarioMensaje, validacion.mensaje, 'error');
        limpiarYEnfocar(usuarioInput);
        return;
    }

    agregarAlPrincipio(usuarios, validacion.normalizado);
    actualizarUIUsuarios();
    mostrarMensaje(
        usuarioMensaje,
        `👤 "${validacion.normalizado}" se conectó y se agregó al principio con unshift().`,
        'exito'
    );
    limpiarYEnfocar(usuarioInput);
}

// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
/**
 * Función que se ejecuta una vez que el DOM está listo.
 * - Actualiza la UI con los valores iniciales de los arrays.
 * - Registra los event listeners para botones y teclas Enter.
 */
function init() {
    // Mostrar arrays iniciales (colores vacío, tareas y usuarios con sus valores por defecto)
    actualizarUIColores();
    actualizarUITareas();
    actualizarUIUsuarios();

    // Conectar botones a sus manejadores
    agregarRojoBtn.addEventListener('click', manejarRojo);
    agregarVerdeBtn.addEventListener('click', manejarVerde);
    agregarAzulBtn.addEventListener('click', manejarAzul);
    agregarTareaBtn.addEventListener('click', manejarAgregarTarea);
    agregarUsuarioBtn.addEventListener('click', manejarAgregarUsuario);

    // Permitir que la tecla "Enter" dispare las acciones en los inputs correspondientes.
    tareaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') manejarAgregarTarea();
    });
    usuarioInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') manejarAgregarUsuario();
    });
}

// Asegurar que el DOM esté completamente cargado antes de ejecutar init.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // Si el DOM ya está listo, ejecutar inmediatamente.
    init();
}