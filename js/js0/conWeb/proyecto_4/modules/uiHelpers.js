/**
 * Utilidades para mostrar mensajes en la pantalla sin usar alert().
 */

/**
 * Muestra un mensaje (éxito o error) en un contenedor.
 * Desaparece solo después de 3 segundos.
 */
export function mostrarMensaje(contenedor, texto, tipo) {
    if (!contenedor) return;
    contenedor.textContent = texto;
    contenedor.className = `mensaje ${tipo}`;
    setTimeout(() => {
        if (contenedor.textContent === texto) {
            contenedor.textContent = '';
            contenedor.className = 'mensaje';
        }
    }, 3000);
}

/**
 * Actualiza el texto de un elemento con el array en formato JSON.
 */
export function actualizarArrayVisual(elemento, array) {
    if (elemento) {
        elemento.textContent = JSON.stringify(array);
    }
}

/**
 * Limpia un input y le da foco (por si agregamos inputs después).
 */
export function limpiarYEnfocar(inputElement) {
    if (inputElement) {
        inputElement.value = '';
        inputElement.focus();
    }
}