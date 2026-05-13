/**
 * Módulo de utilidades para manipulación de arrays, específicamente para
 * demostrar el método unshift().
 * 
 * Las funciones aquí expuestas son envoltorios que usan unshift() para
 * agregar elementos al inicio de un array. Se separan en un módulo para
 * demostrar modularidad y reutilización.
 * 
 * @module arrayHelpers
 */

/**
 * Agrega un elemento al principio del array usando unshift() y retorna
 * la nueva longitud del array.
 * 
 * unshift() es un método mutador: modifica el array original.
 * 
 * Ejemplo de uso:
 *   let frutas = ['naranja'];
 *   agregarAlPrincipio(frutas, 'manzana');
 *   console.log(frutas); // ['manzana', 'naranja']
 * 
 * @param {Array} arr - El array al que se agregará el elemento (se modifica)
 * @param {*} elemento - El valor a insertar al inicio
 * @returns {number} La nueva longitud del array después de la inserción.
 * 
 * Nota: Aunque la longitud no se usa en la UI, se retorna para mantener
 * la coherencia con el comportamiento nativo de unshift().
 */
export function agregarAlPrincipio(arr, elemento) {
    return arr.unshift(elemento);
}

/**
 * Versión alternativa que agrega el elemento al principio y retorna el array modificado.
 * Útil cuando se necesita encadenar operaciones.
 * 
 * @param {Array} arr - Array a modificar
 * @param {*} elemento - Elemento a agregar
 * @returns {Array} El mismo array (por referencia) después de la modificación.
 */
export function unshiftYRetornarArray(arr, elemento) {
    arr.unshift(elemento);
    return arr;
}