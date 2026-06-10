const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let numeros = [5, 12, 8, 20];
console.log("Array actual:", numeros);
rl.question("Ingresa un número para agregar (solo si no existe): ", (respuesta) => {
    let num = Number(respuesta);
    if (isNaN(num)) {
        console.log("No es un número válido.");
    } else {
        if (!numeros.includes(num)) {
            numeros.push(num);
            console.log(`Número ${num} agregado. Nuevo array:`, numeros);
        } else {
            console.log(`El número ${num} ya existe. No se agregó.`);
        }
    }
    rl.close();
});