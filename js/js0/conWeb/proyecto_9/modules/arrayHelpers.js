// Funciones para agregar y recorrer

export function agregarElemento(array, elemento) {
    array.push(elemento);
    return array;
}

// Función genérica para aplicar forEach y obtener string de resultados
export function recorrerSaludos(array, callback) {
    let resultados = [];
    array.forEach(elemento => {
        resultados.push(callback(elemento));
    });
    return resultados;
}