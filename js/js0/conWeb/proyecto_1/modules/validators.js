// Módulo de validaciones reutilizables

/**
 * Lista predefinida de frutas válidas (evita "lechuga" y otros no frutos)
 * Según la indicación del profesor: no se puede poner cualquier cosa.
 */
const FRUTAS_VALIDAS = new Set([
    'manzana', 'pera', 'naranja', 'plátano', 'banana', 'fresa', 'frutilla',
    'uva', 'sandía', 'melón', 'kiwi', 'mango', 'cereza', 'durazno', 'ciruela',
    'limón', 'pomelo', 'granada', 'arándano', 'frambuesa', 'coco', 'papaya',
    'guayaba', 'mandarina', 'maracuyá', 'caqui', 'lichi', 'higo'
]);

/**
 * Valida si el texto ingresado es una fruta válida y no está duplicada en el array actual.
 * @param {string} input - Nombre ingresado por usuario
 * @param {Array} arrayFrutasActual - Array actual de frutas para verificar duplicados
 * @returns {object} { valido: boolean, mensaje: string, normalizado: string }
 */
export function validarFruta(input, arrayFrutasActual = []) {
    const valor = input.trim().toLowerCase();
    if (valor === '') {
        return { valido: false, mensaje: '❌ No ingresaste ningún nombre.', normalizado: '' };
    }

    // 1. Verificar que sea una fruta de la lista predefinida
    if (!FRUTAS_VALIDAS.has(valor)) {
        return { valido: false, mensaje: `🍅 "${input}" no es una fruta reconocida. Ejemplos: manzana, pera, fresa. (Evita lechuga, tomate, etc.)`, normalizado: '' };
    }

    // 2. Verificar que no esté ya en el array (evitar duplicados)
    if (arrayFrutasActual.includes(valor)) {
        return { valido: false, mensaje: `⚠️ "${valor}" ya existe en la lista. No se permiten duplicados.`, normalizado: '' };
    }

    return { valido: true, mensaje: '✅ Fruta válida y no duplicada.', normalizado: valor };
}

/**
 * Valida nombre de amigo (no vacío, solo letras y espacios)
 * @param {string} input 
 * @returns {object}
 */
export function validarAmigo(input) {
    const valor = input.trim();
    if (valor === '') {
        return { valido: false, mensaje: '❌ El nombre no puede estar vacío.' };
    }
    const regex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/;
    if (regex.test(valor)) {
        return { valido: true, mensaje: '✅ Nombre válido.', normalizado: valor };
    } else {
        return { valido: false, mensaje: '⚠️ Solo letras y espacios (mínimo 2 caracteres).' };
    }
}

/**
 * Valida número y condición "mayor que el último elemento"
 * @param {string} inputNumero - Valor ingresado
 * @param {number} ultimoValor - Último número del array
 * @returns {object}
 */
export function validarNumeroMayor(inputNumero, ultimoValor) {
    const numero = parseFloat(inputNumero);
    if (isNaN(numero)) {
        return { valido: false, mensaje: '🔢 Debes ingresar un número válido.' };
    }
    if (numero > ultimoValor) {
        return { valido: true, mensaje: `✅ ${numero} es mayor que ${ultimoValor}. Se agregará.`, normalizado: numero };
    } else {
        return { valido: false, mensaje: `❌ ${numero} no es mayor que ${ultimoValor}. No se agregó.` };
    }
}