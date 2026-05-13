// Módulo para evento keydown
export function iniciarKeydown(inputId, spanId) {
    const input = document.getElementById(inputId);
    const span = document.getElementById(spanId);

    if (!input || !span) return;

    input.addEventListener('keydown', (event) => {
        span.textContent = event.key;
    });
}