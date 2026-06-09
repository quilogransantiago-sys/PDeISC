/**
 * convertirMayusculas.js
 * Demuestra el uso del paquete 'upper-case' instalado vía NPM.
 * Solicita al usuario un texto por consola y lo convierte a mayúsculas.
 * 
 * Módulos usados: upper-case (tercero), readline (nativo)
 */

import { upperCase } from 'upper-case';
import readline from 'readline';

// Crear interfaz para leer entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Preguntar al usuario el texto
rl.question('Ingresa el texto que deseas convertir a mayúsculas: ', (respuesta) => {
    const textoEnMayusculas = upperCase(respuesta);
    console.log(`\nTexto original: ${respuesta}`);
    console.log(`Texto en mayúsculas: ${textoEnMayusculas}`);

    // Cerrar la interfaz
    rl.close();
});