// Módulo para actualizar la interfaz de usuario y mostrar mensajes sin alert

/**
 * Muestra un mensaje en un contenedor DOM con estilo de éxito o error
 * @param {HTMLElement} contenedorMensaje - Elemento donde se mostrará
 * @param {string} texto - Contenido del mensaje
 * @param {string} tipo - 'exito' o 'error'
 */
export function mostrarMensaje(contenedorMensaje, texto, tipo) {
    if (!contenedorMensaje) return;
    contenedorMensaje.textContent = texto;
    contenedorMensaje.className = `mensaje ${tipo}`;
    // Borrar automáticamente después de 3 segundos (opcional, mejora usabilidad)
    setTimeout(() => {
        if (contenedorMensaje.textContent === texto) {
            contenedorMensaje.textContent = '';
            contenedorMensaje.className = 'mensaje';
        }
    }, 3000);
}

/**
 * Actualiza el texto de un elemento que muestra un array
 * @param {HTMLElement} elementoArray - Span o div para mostrar array
 * @param {Array} arrayData 
 */
export function actualizarVisualizacionArray(elementoArray, arrayData) {
    if (!elementoArray) return;
    elementoArray.textContent = JSON.stringify(arrayData);
}

/**
 * Limpia el campo de entrada y lo enfoca
 * @param {HTMLInputElement} inputElement 
 */
export function limpiarYEnfocar(inputElement) {
    if (inputElement) {
        inputElement.value = '';
        inputElement.focus();
    }
}