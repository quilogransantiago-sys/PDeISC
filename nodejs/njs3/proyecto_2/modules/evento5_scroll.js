// Módulo para evento scroll
export function iniciarScroll(contenedorId, spanId) {
    const contenedor = document.getElementById(contenedorId);
    const span = document.getElementById(spanId);

    if (!contenedor || !span) return;

    contenedor.addEventListener('scroll', () => {
        span.textContent = contenedor.scrollTop;
    });
}