// ejercicio4.js

const { sumar, restar, multiplicar, dividir } = require('./calculos.js');

const suma = sumar(5, 3);
const resta = restar(8, 6);
const multiplicacion = multiplicar(3, 11);
const division = dividir(30, 5);

console.log("5 + 3 = " + suma);
console.log("8 - 6 = " + resta);
console.log("3 * 11 = " + multiplicacion);
console.log("30 / 5 = " + division);