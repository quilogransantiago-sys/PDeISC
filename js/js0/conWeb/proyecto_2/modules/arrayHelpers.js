// Módulo con funciones auxiliares para pop() y vaciado con while

/**
 * Elimina el último elemento de un array usando pop() y lo retorna.
 * @param {Array} arr - Array sobre el cual operar
 * @returns {Object} - { eliminado: any, nuevoArray: Array, vacio: boolean }
 */
export function eliminarUltimo(arr) {
    if (arr.length === 0) {
        return { eliminado: undefined, nuevoArray: [], vacio: true };
    }
    const eliminado = arr.pop();
    return { eliminado, nuevoArray: arr, vacio: false };
}

/**
 * Vacía completamente un array usando un bucle while y pop().
 * Retorna un array con todos los elementos eliminados en orden inverso.
 * @param {Array} arr - Array a vaciar (se modifica directamente)
 * @returns {Array} - Lista de elementos eliminados (orden de extracción)
 */
export function vaciarConWhile(arr) {
    const eliminados = [];
    while (arr.length > 0) {
        const elemento = arr.pop();
        eliminados.push(elemento);
    }
    return eliminados;
}