/**
 * calculo.js
 * Módulo con operaciones matemáticas básicas.
 * Exporta: sumar, restar, multiplicar, dividir, promedio
 */

export function sumar(a, b) { return a + b; }
export function restar(a, b) { return a - b; }
export function multiplicar(a, b) { return a * b; }
export function dividir(a, b) {
    if (b === 0) throw new Error('División por cero');
    return a / b;
}
export function promedio(numeros) {
    if (!Array.isArray(numeros) || numeros.length === 0) throw new Error('Arreglo no válido');
    return numeros.reduce((a, b) => a + b, 0) / numeros.length;
}