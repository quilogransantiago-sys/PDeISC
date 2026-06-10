// --- EJERCICIO 2: Agregar los nombres de tus 3 amigos a un array existente llamado amigos ---

// 1. Declaramos un array vacío llamado amigos
let amigos = [];

// 2. Pedimos al usuario que ingrese los nombres de sus amigos (usando readline)
// Necesitamos importar el módulo 'readline' para leer desde la consola
const readline = require('readline');

// Creamos una interfaz para preguntar al usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para preguntar un nombre y agregarlo al array
function preguntarAmigo(i) {
    if (i <= 3) {
        rl.question(`Ingresa el nombre del amigo ${i}: `, (nombre) => {
            if (nombre.trim() !== "") {
                amigos.push(nombre.trim());
            } else {
                console.log("Nombre vacío, no se agregará.");
            }
            preguntarAmigo(i + 1);
        });
    } else {
        // Terminamos de preguntar, mostramos el array final
        console.log("Array de amigos:", amigos);
        rl.close();
    }
}

// Iniciamos la primera pregunta
preguntarAmigo(1);