/**
 * Módulo de utilidades para manipulación del DOM y retroalimentación visual.
 * 
 * Estas funciones abstraen la actualización de la interfaz, incluyendo
 * la visualización de arrays y mensajes de éxito/error. Se evita el uso
 * de alert() como requiere el profesor.
 * 
 * @module uiHelpers
 */

/**
 * Muestra un mensaje temporal en un contenedor del DOM.
 * 
 * Comportamiento:
 * - Aplica una clase CSS según el tipo ('exito' o 'error').
 * - El mensaje desaparece automáticamente después de 3 segundos.
 * - Si se muestra otro mensaje antes, se reemplaza correctamente.
 * 
 * Decisión de diseño: Se usa setTimeout para no obstaculizar la interacción
 * del usuario, a diferencia de alert() que bloquea.
 * 
 * @param {HTMLElement} contenedor - Elemento donde se inyectará el mensaje.
 * @param {string} texto - Contenido textual del mensaje.
 * @param {string} tipo - 'exito' (verde) o 'error' (rojo).
 */
export function mostrarMensaje(contenedor, texto, tipo) {
    if (!contenedor) return; // Seguridad: si no existe el elemento, no hacer nada.

    contenedor.textContent = texto;
    contenedor.className = `mensaje ${tipo}`;

    // Auto-eliminar después de 3 segundos para no saturar la pantalla.
    setTimeout(() => {
        // Verificamos que el mensaje no haya sido reemplazado por otro.
        if (contenedor.textContent === texto) {
            contenedor.textContent = '';
            contenedor.className = 'mensaje';
        }
    }, 3000);
}

/**
 * Actualiza el contenido de un elemento HTML para mostrar un array en formato JSON.
 * 
 * @param {HTMLElement} elemento - Span, div u otro elemento que mostrará el array.
 * @param {Array} array - El array a representar como string (ej: ["a","b"]).
 * 
 * Nota: Se usa JSON.stringify para obtener una representación clara y consistente.
 */
export function actualizarArrayVisual(elemento, array) {
    if (elemento) {
        elemento.textContent = JSON.stringify(array);
    }
}

/**
 * Limpia el valor de un input y le da foco para facilitar la siguiente entrada.
 * 
 * @param {HTMLInputElement} inputElement - El campo de texto a limpiar y enfocar.
 */
export function limpiarYEnfocar(inputElement) {
    if (inputElement) {
        inputElement.value = '';
        inputElement.focus();
    }
}