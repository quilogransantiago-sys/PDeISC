/**
 * Funciones para includes() y manipulación básica.
 */

// Includes normal (distingue mayúsculas)
export function contiene(array, elemento) {
    return array.includes(elemento);
}

// Includes insensible a mayúsculas/minúsculas
export function contieneInsensible(array, elemento) {
    const busqueda = elemento.toLowerCase();
    return array.some(item => String(item).toLowerCase() === busqueda);
}

// Agrega un elemento al final
export function agregarElemento(array, elemento) {
    array.push(elemento);
    return array;
}