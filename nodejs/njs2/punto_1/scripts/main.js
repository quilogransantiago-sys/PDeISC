import { sumar, restar, multiplicar, dividir } from '../modules/calculo.js';
import { obtenerClima } from '../modules/tiempo.js';

function actualizarReloj() {
    const ahora = new Date();
    const h = String(ahora.getHours()).padStart(2, '0');
    const m = String(ahora.getMinutes()).padStart(2, '0');
    const s = String(ahora.getSeconds()).padStart(2, '0');
    document.getElementById('reloj').textContent = `${h}:${m}:${s}`;
}
setInterval(actualizarReloj, 1000);
actualizarReloj();

obtenerClima()
    .then(({ temp, desc }) => {
        document.getElementById('temp').textContent = `${temp}°C`;
        document.getElementById('desc').textContent = desc;
    })
    .catch(() => {
        document.getElementById('temp').textContent = '--°C';
        document.getElementById('desc').textContent = 'Error clima';
    });

const num1 = document.getElementById('num1');
const num2 = document.getElementById('num2');
const operador = document.getElementById('operador');
const calcularBtn = document.getElementById('calcular');
const resultado = document.getElementById('resultado');

calcularBtn.addEventListener('click', () => {
    const a = parseFloat(num1.value);
    const b = parseFloat(num2.value);
    if (isNaN(a) || isNaN(b)) {
        resultado.textContent = 'Ingresa números válidos';
        return;
    }
    let res;
    switch (operador.value) {
        case '+': res = sumar(a, b); break;
        case '-': res = restar(a, b); break;
        case '*': res = multiplicar(a, b); break;
        case '/':
            if (b === 0) { resultado.textContent = 'No se puede dividir por 0'; return; }
            res = dividir(a, b);
            break;
    }
    resultado.textContent = `= ${res}`;
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', html.classList.contains('dark'));
});