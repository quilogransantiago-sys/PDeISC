/**
 * PROYECTO SHIFT() - VERSIÓN DIDÁCTICA
 * 
 * Este archivo controla los tres ejercicios. 
 * Usamos shift() para eliminar el primer elemento de cada array.
 * 
 * Lo importante:
 * - Los arrays se guardan en variables (numeros, chat, cola).
 * - Las funciones render...() muestran los datos en pantalla.
 * - Cuando el usuario hace clic, usamos shift() y actualizamos la vista.
 * 
 * Las animaciones son solo para que se vea bonito, pero lo esencial es shift().
 */

// Importamos las funciones de ayuda desde los módulos
import { eliminarPrimero } from '../modules/arrayHelpers.js';
import { mostrarMensaje } from '../modules/uiHelpers.js';

// ========== 1. DATOS (arrays) ==========
// Estos son los arrays con los que trabajamos
let numeros = [10, 20, 30, 40, 50];           // Para ejercicio 1
let chat = ["Now...", "Say my name.", "You're Heisenberg.", "You're goddamn right."];  // Ejercicio 2
let cola = ["Cliente A", "Cliente B", "Cliente C"];   // Ejercicio 3

// ========== 2. ELEMENTOS DEL HTML ==========
// Traemos referencias de los elementos que vamos a modificar
const numerosSpan = document.getElementById('numerosArray');
const shiftNumeroBtn = document.getElementById('shiftNumeroBtn');
const numeroMensaje = document.getElementById('numeroMensaje');

const chatMessagesDiv = document.getElementById('chatMessages');
const shiftChatBtn = document.getElementById('shiftChatBtn');
const chatMensajeDiv = document.getElementById('chatMensaje');

const queueListDiv = document.getElementById('queueList');
const atenderBtn = document.getElementById('atenderBtn');
const colaMensajeDiv = document.getElementById('colaMensaje');

// ========== 3. FUNCIONES QUE DIBUJAN LOS DATOS EN PANTALLA ==========

/** Muestra el array de números como texto */
function renderNumeros() {
    numerosSpan.textContent = JSON.stringify(numeros);
}

/** Dibuja los mensajes del chat como burbujas */
function renderChat() {
    if (!chatMessagesDiv) return;
    chatMessagesDiv.innerHTML = ''; // Limpia el contenedor
    // Recorre el array 'chat' y por cada mensaje crea una burbuja
    chat.forEach((mensaje) => {
        const burbuja = document.createElement('div');
        burbuja.className = 'message-bubble';
        burbuja.textContent = mensaje;
        chatMessagesDiv.appendChild(burbuja);
    });
    // Hace que el scroll baje automáticamente al último mensaje
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

/** Dibuja la cola de clientes como tarjetitas con ticket */
function renderCola() {
    if (!queueListDiv) return;
    queueListDiv.innerHTML = '';
    cola.forEach((cliente) => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'client-card';
        tarjeta.textContent = cliente;
        queueListDiv.appendChild(tarjeta);
    });
}

// ========== 4. EJERCICIO 1: NÚMEROS (shift simple) ==========
function manejarShiftNumero() {
    const resultado = eliminarPrimero(numeros);  // Usa shift() internamente
    if (resultado.vacio) {
        mostrarMensaje(numeroMensaje, '❌ No hay más números.', 'error');
        return;
    }
    renderNumeros();  // Actualiza la pantalla
    mostrarMensaje(numeroMensaje, `🔢 Eliminado: ${resultado.eliminado}.`, 'exito');
}

// ========== 5. EJERCICIO 2: CHAT (con animación al eliminar) ==========
function manejarShiftChat() {
    if (chat.length === 0) {
        mostrarMensaje(chatMensajeDiv, '💬 No hay más mensajes.', 'error');
        return;
    }
    // Buscamos la primera burbuja (el mensaje más antiguo)
    const primeraBurbuja = chatMessagesDiv.firstChild;
    if (primeraBurbuja) {
        // Agregamos una clase CSS que hace la animación de desaparecer
        primeraBurbuja.classList.add('removing');
        // Esperamos medio segundo a que termine la animación
        setTimeout(() => {
            const eliminado = chat.shift();  // Aquí usamos shift() directamente
            renderChat();                    // Volvemos a dibujar el chat
            mostrarMensaje(chatMensajeDiv, `🗑️ Mensaje eliminado: "${eliminado}"`, 'exito');
        }, 400);
    } else {
        // Si por alguna razón no hay burbuja, igual hacemos shift()
        const eliminado = chat.shift();
        renderChat();
        mostrarMensaje(chatMensajeDiv, `🗑️ Mensaje eliminado: "${eliminado}"`, 'exito');
    }
}

// ========== 6. EJERCICIO 3: COLA (con animación al atender) ==========
function manejarAtenderCliente() {
    if (cola.length === 0) {
        mostrarMensaje(colaMensajeDiv, 'No hay clientes en espera.', 'error');
        return;
    }
    const primeraTarjeta = queueListDiv.firstChild;
    if (primeraTarjeta) {
        primeraTarjeta.classList.add('removing');
        setTimeout(() => {
            const atendido = cola.shift();   // shift() elimina el primero
            renderCola();                    // Actualizamos la lista de tarjetas
            mostrarMensaje(colaMensajeDiv, `✅ Atendido: ${atendido}. Quedan ${cola.length}`, 'exito');
        }, 500);
    } else {
        const atendido = cola.shift();
        renderCola();
        mostrarMensaje(colaMensajeDiv, `✅ Atendido: ${atendido}. Quedan ${cola.length}`, 'exito');
    }
}

// ========== 7. INICIALIZACIÓN ==========
// Esta función se ejecuta al cargar la página: dibuja todo y conecta los botones
function init() {
    renderNumeros();
    renderChat();
    renderCola();

    // Asignamos los manejadores a los botones
    shiftNumeroBtn.addEventListener('click', manejarShiftNumero);
    shiftChatBtn.addEventListener('click', manejarShiftChat);
    atenderBtn.addEventListener('click', manejarAtenderCliente);
}

// Esperamos a que el HTML esté listo antes de ejecutar init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}