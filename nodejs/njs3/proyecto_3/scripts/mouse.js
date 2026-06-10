const caja = document.getElementById('cajaMouse');
const log = document.getElementById('logMouse');

function agregarMensaje(evento, detalle = '') {
    const p = document.createElement('div');
    p.textContent = `${new Date().toLocaleTimeString()} - ${evento} ${detalle}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 20) log.removeChild(log.firstChild);
}

caja.addEventListener('click', () => agregarMensaje('click'));
caja.addEventListener('dblclick', () => agregarMensaje('doble click'));
caja.addEventListener('mouseenter', () => {
    agregarMensaje('mouseenter', '→ cursor entró al área');
    caja.style.backgroundColor = 'var(--btn-hover)';
});
caja.addEventListener('mouseleave', () => {
    agregarMensaje('mouseleave', '← cursor salió');
    caja.style.backgroundColor = '';
});
caja.addEventListener('mousemove', (e) => {
    // No saturar, mostrar solo cada 10 movimientos (simple)
    if (Math.random() < 0.1)
        agregarMensaje('mousemove', `(${e.offsetX},${e.offsetY})`);
});
caja.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    agregarMensaje('contextmenu', 'clic derecho (bloqueado)');
});