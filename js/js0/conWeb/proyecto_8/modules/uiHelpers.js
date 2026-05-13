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

export function actualizarSpan(elemento, array) {
    if (elemento) {
        elemento.textContent = JSON.stringify(array);
    }
}