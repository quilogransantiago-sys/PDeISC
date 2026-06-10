let frase = "JavaScript";
let arrayLetras = frase.split('');
arrayLetras.reverse();
let textoRevertido = arrayLetras.join('');
console.log(`String original: "${frase}"`);
console.log(`Revertido: "${textoRevertido}"`);