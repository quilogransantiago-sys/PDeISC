// main.js
import { sumar, restar, multiplicar, dividir } from '../modules/calculos.js';

function generarTablaEj1() {
    return `
        <div class="tabla-wrapper">
            <h2>Ejercicio 1: Mensajes por consola</h2>
            <table class="tabla-operaciones">
                <thead><tr><th>Mensaje</th></tr></thead>
                <tbody><tr><td>Hola mundo desde Node.js</td></tr><tr><td>Fin</td></tr></tbody>
            </table>
        </div>
    `;
}

function generarTablaEj2() {
    const ops = [
        { expresion: '4 + 5', resultado: 4 + 5 },
        { expresion: '3 - 6', resultado: 3 - 6 },
        { expresion: '2 × 7', resultado: 2 * 7 },
        { expresion: '20 ÷ 4', resultado: 20 / 4 }
    ];
    return generarTablaGenerica(ops, 'Ejercicio 2: Operaciones básicas');
}

function generarTablaEj3() {
    const ops = [
        { expresion: '4 + 5', resultado: sumar(4, 5) },
        { expresion: '3 - 6', resultado: restar(3, 6) },
        { expresion: '2 × 7', resultado: multiplicar(2, 7) },
        { expresion: '20 ÷ 4', resultado: dividir(20, 4) }
    ];
    return generarTablaGenerica(ops, 'Ejercicio 3: Operaciones con funciones');
}

function generarTablaEj4() {
    const ops = [
        { expresion: '5 + 3', resultado: sumar(5, 3) },
        { expresion: '8 - 6', resultado: restar(8, 6) },
        { expresion: '3 × 11', resultado: multiplicar(3, 11) },
        { expresion: '30 ÷ 5', resultado: dividir(30, 5) }
    ];
    return generarTablaGenerica(ops, 'Ejercicio 4: Usando módulo calculos.js');
}

function generarTablaGenerica(operaciones, titulo) {
    let filas = '';
    for (const op of operaciones) {
        filas += `<tr><td>${op.expresion}</td><td>${op.resultado}</td></tr>`;
    }
    return `
        <div class="tabla-wrapper">
            <h2>${titulo}</h2>
            <table class="tabla-operaciones">
                <thead><tr><th>Operación</th><th>Resultado</th></tr></thead>
                <tbody>${filas}</tbody>
            </table>
        </div>
    `;
}

function renderizarTodo() {
    const html = `
        ${generarTablaEj1()}
        ${generarTablaEj2()}
        ${generarTablaEj3()}
        ${generarTablaEj4()}
    `;
    document.getElementById('tablas-container').innerHTML = html;
}

// --- Modo oscuro/claro con ícono animado ---
const botonTema = document.getElementById('toggle-tema');
const themeIcon = document.getElementById('theme-icon');

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem('tema', tema);
    // Cambiar ícono sin emojis: ☼ = sol, ☾ = luna
    const nuevoIcono = tema === 'oscuro' ? '☾' : '☼';
    // Añadir clase de rotación para animación fluida
    themeIcon.classList.add('rotar');
    setTimeout(() => {
        themeIcon.textContent = nuevoIcono;
        themeIcon.classList.remove('rotar');
    }, 150);
}

function alternarTema() {
    const temaActual = document.documentElement.getAttribute('data-tema');
    const nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevoTema);
}

// Inicializar tema guardado o claro por defecto
const temaGuardado = localStorage.getItem('tema');
aplicarTema(temaGuardado || 'claro');

botonTema.addEventListener('click', alternarTema);

renderizarTodo();