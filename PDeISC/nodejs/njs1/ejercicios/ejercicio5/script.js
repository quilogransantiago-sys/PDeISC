// script.js - Genera la tabla usando las funciones del módulo calculos.js
// Las funciones sumar, restar, multiplicar, dividir ya están disponibles globalmente

// Datos de las operaciones (resultados del ejercicio 2)
const operaciones = [
    { nombre: "Suma", expresion: "4 + 5", resultado: sumar(4, 5) },
    { nombre: "Resta", expresion: "3 - 6", resultado: restar(3, 6) },
    { nombre: "Multiplicación", expresion: "2 × 7", resultado: multiplicar(2, 7) },
    { nombre: "División", expresion: "20 ÷ 4", resultado: dividir(20, 4) }
];

// Si quisieras mostrar los resultados del ejercicio 4, descomenta esto:
/*
const operaciones = [
    { nombre: "Suma", expresion: "5 + 3", resultado: sumar(5, 3) },
    { nombre: "Resta", expresion: "8 - 6", resultado: restar(8, 6) },
    { nombre: "Multiplicación", expresion: "3 × 11", resultado: multiplicar(3, 11) },
    { nombre: "División", expresion: "30 ÷ 5", resultado: dividir(30, 5) }
];
*/

// Generar la tabla al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#tablaResultados tbody");

    operaciones.forEach(op => {
        const fila = document.createElement("tr");
        // Añadimos data-label para el responsive (se usará en móvil)
        fila.innerHTML = `
            <td data-label="Operación">${op.nombre}</td>
            <td data-label="Expresión">${op.expresion}</td>
            <td data-label="Resultado" class="resultado">${op.resultado}</td>
        `;
        tbody.appendChild(fila);
    });
});