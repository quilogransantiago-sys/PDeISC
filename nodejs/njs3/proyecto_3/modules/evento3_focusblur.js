// Módulo para eventos focus y blur
export function iniciarFocusBlur(inputIds, mensajeId) {
    const mensaje = document.getElementById(mensajeId);
    if (!mensaje) return;

    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('focus', () => {
            mensaje.textContent = `foco en: ${id}`;
            mensaje.style.color = '#2e7d32';
        });

        input.addEventListener('blur', () => {
            mensaje.textContent = `Perdiste el foco de: ${id}`;
            mensaje.style.color = '#c62828';
        });
    });
}