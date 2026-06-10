const drag = document.getElementById('dragable');
const drop = document.getElementById('dropzone');
const log = document.getElementById('logDrag');

function logMsg(msg) {
    const p = document.createElement('div');
    p.textContent = `${new Date().toLocaleTimeString()} - ${msg}`;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 15) log.removeChild(log.firstChild);
}
drag.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', 'Elemento arrastrado');
    logMsg('dragstart');
});
drag.addEventListener('dragend', () => logMsg('dragend'));
drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    logMsg('dragover');
});
drop.addEventListener('dragenter', () => {
    drop.style.backgroundColor = 'var(--btn-hover)';
    logMsg('dragenter');
});
drop.addEventListener('dragleave', () => {
    drop.style.backgroundColor = '';
    logMsg('dragleave');
});
drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.style.backgroundColor = '';
    const data = e.dataTransfer.getData('text/plain');
    logMsg(`drop: recibido "${data}"`);
    drop.innerHTML += `<div>✔️ Soltado</div>`;
});