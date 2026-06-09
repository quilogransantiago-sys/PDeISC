/**
 * Módulo tiempo.js
 * Proporciona funciones para trabajar con fechas y tiempos.
 * Módulos usados: ninguno externo.
 * Funciones principales: obtenerFechaHoraActual, formatearFecha, diferenciaHoras.
 */

/**
 * Obtiene la fecha y hora actual en formato local completo.
 * @returns {string} - Ej: "09/06/2026 15:30:45"
 */
export function obtenerFechaHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleString();
}

/**
 * Formatea una fecha dada en formato "YYYY-MM-DD HH:MM:SS".
 * @param {Date} fecha - Objeto Date.
 * @returns {string}
 */
export function formatearFecha(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

/**
 * Calcula la diferencia en horas entre dos fechas (positivo si fecha1 > fecha2).
 * @param {Date} fecha1
 * @param {Date} fecha2
 * @returns {number} - Diferencia en horas (con decimales).
 */
export function diferenciaHoras(fecha1, fecha2) {
    const milisegundos = Math.abs(fecha1 - fecha2);
    return milisegundos / (1000 * 60 * 60);
}