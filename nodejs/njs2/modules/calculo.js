// modules/calculo.js
function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    if (b === 0) {
        throw new Error("No se puede dividir por cero");
    }
    return a / b;
}

function promedio(lista) {
    if (lista.length === 0) return 0;
    const suma = lista.reduce((acc, val) => acc + val, 0);
    return suma / lista.length;
}

export { sumar, restar, multiplicar, dividir, promedio };