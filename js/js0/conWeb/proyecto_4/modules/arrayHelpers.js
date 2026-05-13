/**
 * Funciones de ayuda para trabajar con arrays.
 * La más importante: eliminarPrimero() usa shift() internamente.
 */

/**
 * Elimina el primer elemento de un array usando shift()
 * y devuelve un objeto con información útil.
 * 
 * Si el array está vacío, no se puede eliminar nada.
 */
export function eliminarPrimero(arr) {
    if (arr.length === 0) {
        return {
            eliminado: undefined,
            nuevoArray: arr,
            vacio: true
        };
    }
    const eliminado = arr.shift();  // método nativo shift()
    return {
        eliminado: eliminado,
        nuevoArray: arr,
        vacio: false
    };
}