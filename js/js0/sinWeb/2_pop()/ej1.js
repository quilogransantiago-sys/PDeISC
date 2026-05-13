// --- EJERCICIO 1: Elimina el último elemento de un array de animales ---

let animales = ["perro", "gato", "elefante", "loro"];
console.log("Array original:", animales);

let eliminado = animales.pop();  // elimina "loro" y lo guarda
console.log("Array después de pop():", animales);
console.log("Elemento eliminado:", eliminado);