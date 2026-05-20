/**
 * Funciones para usar slice() de forma sencilla.
 * slice() NO modifica el array original, siempre devuelve uno nuevo.
 */

// Copia los primeros N elementos
export function obtenerPrimeros(arr, cantidad) {
    return arr.slice(0, cantidad);
}

// Copia desde inicio hasta fin (sin incluir fin)
export function obtenerRango(arr, inicio, fin) {
    return arr.slice(inicio, fin);
}

// Copia los últimos N elementos (usa índices negativos)
export function obtenerUltimos(arr, cantidad) {
    if (cantidad <= 0) return [];
    return arr.slice(-cantidad);
}