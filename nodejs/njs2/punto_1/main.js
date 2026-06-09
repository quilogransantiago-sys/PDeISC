/**
 * main.js - Punto de entrada del programa.
 * Usa los módulos tiempo.js y calculo.js para demostrar su funcionalidad.
 * Salida por consola (Node.js).
 */

// Importación de módulos propios
import { obtenerFechaHoraActual, formatearFecha, diferenciaHoras } from './tiempo.js';
import { sumar, restar, multiplicar, dividir, promedio } from './calculo.js';

// --- Demostración del módulo tiempo ---
console.log('=== MÓDULO TIEMPO ===');
const ahora = new Date();
console.log(`Fecha y hora actual (local): ${obtenerFechaHoraActual()}`);
console.log(`Fecha formateada (YYYY-MM-DD HH:MM:SS): ${formatearFecha(ahora)}`);

const fechaFutura = new Date(ahora);
fechaFutura.setHours(ahora.getHours() + 5);
const diffHoras = diferenciaHoras(fechaFutura, ahora);
console.log(`Diferencia en horas entre ahora y dentro de 5 horas: ${diffHoras} h`);

// --- Demostración del módulo cálculo ---
console.log('\n=== MÓDULO CÁLCULO ===');
const a = 15;
const b = 4;
console.log(`Suma: ${a} + ${b} = ${sumar(a, b)}`);
console.log(`Resta: ${a} - ${b} = ${restar(a, b)}`);
console.log(`Multiplicación: ${a} * ${b} = ${multiplicar(a, b)}`);
try {
    console.log(`División: ${a} / ${b} = ${dividir(a, b)}`);
} catch (error) {
    console.error(error.message);
}

const numerosEjemplo = [10, 20, 30, 40, 50];
console.log(`Promedio de [${numerosEjemplo}] = ${promedio(numerosEjemplo)}`);

// Pequeña operación combinada (media geométrica simulada con módulos)
const sumaPromedio = sumar(promedio(numerosEjemplo), diferenciaHoras(fechaFutura, ahora));
console.log(`\nOperación combinada (promedio + diferenciaHoras) = ${sumaPromedio}`);
