// --- EJERCICIO 3: Usa un bucle while para vaciar un array con pop() ---

let numeros = [10, 20, 30, 40, 50];
console.log("Array original:", numeros);

// Mientras el array tenga elementos, seguimos sacando con pop()
while (numeros.length > 0) {
    let eliminado = numeros.pop();
    console.log(`Eliminado: ${eliminado}, quedan:`, numeros);
}
console.log("Array completamente vacío:", numeros);