import { upperCase } from 'upper-case';
import readline from 'readline';

// Interfaz para leer entrada del usuario por consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingresa un texto: ', (texto) => {
    console.log('Mayúsculas:', upperCase(texto));
    rl.close();
});