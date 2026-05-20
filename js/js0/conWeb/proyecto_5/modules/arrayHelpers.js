/**
 * Funciones que usan splice() directamente sobre el array original.
 */

// Elimina elementos desde una posición
export function eliminar(array, inicio, cantidad) {
    return array.splice(inicio, cantidad);
}

// Inserta elementos sin eliminar
export function insertar(array, inicio, ...elementos) {
    array.splice(inicio, 0, ...elementos);
}

// Reemplaza: elimina algunos y mete nuevos
export function reemplazar(array, inicio, cantidad, ...nuevos) {
    return array.splice(inicio, cantidad, ...nuevos);
}