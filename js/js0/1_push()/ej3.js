// --- EJERCICIO 3: Dado un array de números, agrega un nuevo número solo si es mayor que el último número ---

// 1. Definimos el array de números inicial
let numeros = [5, 12, 8];

// 2. Mostramos el array actual
console.log("Array actual:", numeros);

// 3. Pedimos al usuario que ingrese un número
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Ingresa un número para agregar (solo si es mayor que el último): ", (respuesta) => {
    let nuevoNumero = Number(respuesta);

    // Verificamos si es un número válido
    if (isNaN(nuevoNumero)) {
        console.log("No ingresaste un número válido.");
    } else {
        // Obtenemos el último elemento del array
        let ultimo = numeros[numeros.length - 1];

        // Comparamos
        if (nuevoNumero > ultimo) {
            numeros.push(nuevoNumero);
            console.log(`Número ${nuevoNumero} agregado. Nuevo array:`, numeros);
        } else {
            console.log(`El número ${nuevoNumero} no es mayor que ${ultimo}. No se agregó.`);
        }
    }
    rl.close();
});