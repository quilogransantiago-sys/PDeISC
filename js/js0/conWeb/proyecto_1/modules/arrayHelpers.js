// Módulo con funciones auxiliares para manipulación de arrays (push)

/**
 * Agrega un elemento al array usando push() y retorna el nuevo array
 * @param {Array} arrayOriginal - Array al que se agregará
 * @param {*} elemento - Elemento a pushear
 * @returns {Array} Nuevo array (por referencia, muta el original)
 */
export function agregarConPush(arrayOriginal, elemento) {
    // Demostración explícita del método push()
    arrayOriginal.push(elemento);
    return arrayOriginal;
}

/**
 * Obtiene el último elemento de un array sin modificarlo
 * @param {Array} arr 
 * @returns {*} Último elemento o undefined si está vacío
 */
export function obtenerUltimoElemento(arr) {
    if (arr.length === 0) return undefined;
    return arr[arr.length - 1];
}