const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let numeros = [10, 25, 50, 75, 100];
console.log("Array actual:", numeros);

rl.question("Ingresa un número para buscar: ", (respuesta) => {
    let num = Number(respuesta);
    if (isNaN(num)) {
        console.log("No es un número válido.");
    } else {
        let indice = numeros.indexOf(num);
        if (indice !== -1) {
            console.log(`El número ${num} está en la posición ${indice}.`);
        } else {
            console.log(`El número ${num} no está en el array.`);
        }
    }
    rl.close();
});