/**
 * main.js - Control de modo oscuro para todas las páginas
 */
function inicializarModoOscuro() {
    const btn = document.getElementById('btnModoOscuro');
    if (!btn) return;
    const root = document.documentElement;
    const actualizarTexto = () => {
        const tema = root.getAttribute('data-tema');
        btn.textContent = tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro';
    };
    actualizarTexto();
    btn.addEventListener('click', () => {
        const nuevo = root.getAttribute('data-tema') === 'oscuro' ? 'claro' : 'oscuro';
        root.setAttribute('data-tema', nuevo);
        localStorage.setItem('tema', nuevo);
        actualizarTexto();
    });
}
document.addEventListener('DOMContentLoaded', inicializarModoOscuro);