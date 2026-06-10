const log = document.getElementById('logWindow');
let resizeTimeout;
function logMsg(msg) {
    const p = document.createElement('div');
    p.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 20) log.removeChild(log.firstChild);
}
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        logMsg(`resize: ${window.innerWidth}x${window.innerHeight}`);
    }, 200);
});
window.addEventListener('scroll', () => {
    logMsg(`scroll: Y=${window.scrollY}`);
});
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = ''; // mensaje de confirmación (no se muestra alerta intrusiva)
});
logMsg('Página cargada. Eventos de resize y scroll activos.');