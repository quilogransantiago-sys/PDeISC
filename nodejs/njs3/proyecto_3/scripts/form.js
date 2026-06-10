const log = document.getElementById('logForm');
const form = document.getElementById('demoForm');
const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const pref = document.getElementById('preferencia');

function logMsg(msg) {
    const p = document.createElement('div');
    p.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 15) log.removeChild(log.firstChild);
}
nombre.addEventListener('focus', () => logMsg('focus en nombre'));
nombre.addEventListener('blur', () => logMsg('blur en nombre'));
nombre.addEventListener('input', (e) => logMsg(`input: "${e.target.value}"`));
email.addEventListener('change', (e) => logMsg(`change en email: "${e.target.value}"`));
pref.addEventListener('change', () => logMsg(`select cambió a: ${pref.value}`));
form.addEventListener('submit', (e) => {
    e.preventDefault();
    logMsg('submit enviado (prevenido)');
});
form.addEventListener('reset', () => logMsg('reset formulario'));