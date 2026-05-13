/**
 * Funciones para buscar (con o sin sensibilidad a mayúsculas) y modificar arrays.
 */

// Busca un elemento con distinción de mayúsculas (indexOf normal)
export function buscarElemento(array, elemento) {
    return array.indexOf(elemento);
}

/**
 * Busca un elemento sin importar mayúsculas/minúsculas.
 * Retorna el índice del primer elemento que coincida (ignorando mayúsculas),
 * o -1 si no existe.
 */
export function buscarElementoInsensible(array, elemento) {
    const busqueda = elemento.toLowerCase();
    for (let i = 0; i < array.length; i++) {
        if (String(array[i]).toLowerCase() === busqueda) {
            return i;
        }
    }
    return -1;
}

// Agrega un elemento al final del array
export function agregarElemento(array, elemento) {
    array.push(elemento);
    return array;
}