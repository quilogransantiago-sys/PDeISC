/**
 * Módulo calculo.js
 * Funciones matemáticas básicas para operaciones comunes.
 * Funciones principales: sumar, restar, multiplicar, dividir, promedio.
 */

/**
 * Suma dos números.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function sumar(a, b) {
    return a + b;
}

/**
 * Resta dos números (a - b).
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function restar(a, b) {
    return a - b;
}

/**
 * Multiplica dos números.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function multiplicar(a, b) {
    return a * b;
}

/**
 * Divide a / b. Lanza error si b es 0.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 * @throws {Error} Si b === 0.
 */
export function dividir(a, b) {
    if (b === 0) {
        throw new Error('No se puede dividir por cero.');
    }
    return a / b;
}

/**
 * Calcula el promedio de un arreglo de números.
 * @param {number[]} numeros
 * @returns {number}
 */
export function promedio(numeros) {
    if (!Array.isArray(numeros) || numeros.length === 0) {
        throw new Error('Se requiere un arreglo no vacío.');
    }
    const suma = numeros.reduce((acc, val) => acc + val, 0);
    return suma / numeros.length;
}