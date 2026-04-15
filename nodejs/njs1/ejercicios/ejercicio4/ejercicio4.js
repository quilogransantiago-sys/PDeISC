const calculos = require("./calculos");

let suma = calculos.sumar(5, 3);
let resta = calculos.restar(8, 6);
let multiplicacion = calculos.multiplicar(3, 11);
let division = calculos.dividir(30, 5);

console.log("5 + 3 = " + suma);
console.log("8 - 6 = " + resta);
console.log("3 * 11 = " + multiplicacion);
console.log("30 / 5 = " + division);