/**
 * tiempo.js
 * Módulo con funciones para trabajar con fechas y horas.
 * Exporta: obtenerFechaHoraActual, formatearFecha, diferenciaHoras
 */

export function obtenerFechaHoraActual() {
    return new Date().toLocaleString();
}

export function formatearFecha(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}

export function diferenciaHoras(fecha1, fecha2) {
    const diffMs = Math.abs(fecha1 - fecha2);
    return diffMs / (1000 * 60 * 60);
}