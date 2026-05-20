// Muestra mensajes de éxito o error por unos segundos
export function mostrarMensaje(contenedor, texto, tipo) {
    if (!contenedor) return;
    contenedor.textContent = texto;
    contenedor.className = `mensaje ${tipo}`;
    setTimeout(() => {
        if (contenedor.textContent === texto) {
            contenedor.textContent = '';
            contenedor.className = 'mensaje';
        }
    }, 4000);
}

// Actualiza un span con el contenido de un array (formato JSON)
export function actualizarSpan(elemento, array) {
    if (elemento) {
        elemento.textContent = JSON.stringify(array);
    }
}