const input = document.getElementById('inputTeclado');
const log = document.getElementById('logTeclado');

function agregarMensaje(texto) {
    const p = document.createElement('div');
    p.textContent = `${new Date().toLocaleTimeString()} - ${texto}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 15) log.removeChild(log.firstChild);
}
input.addEventListener('keydown', (e) => {
    agregarMensaje(`keydown: "${e.key}" (código: ${e.code})`);
});
input.addEventListener('keyup', (e) => {
    agregarMensaje(`keyup: "${e.key}"`);
});