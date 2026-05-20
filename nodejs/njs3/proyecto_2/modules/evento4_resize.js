// Módulo para evento resize
export function iniciarResize(anchoId, altoId) {
    const spanAncho = document.getElementById(anchoId);
    const spanAlto = document.getElementById(altoId);

    if (!spanAncho || !spanAlto) return;

    function actualizarDimensiones() {
        spanAncho.textContent = window.innerWidth;
        spanAlto.textContent = window.innerHeight;
    }

    window.addEventListener('resize', actualizarDimensiones);
    actualizarDimensiones(); // valor inicial
}