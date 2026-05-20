// Módulo para evento mousemove
export function iniciarMousemove(areaId, spanId) {
    const area = document.getElementById(areaId);
    const coordenadasSpan = document.getElementById(spanId);

    if (!area || !coordenadasSpan) return;

    area.addEventListener('mousemove', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        coordenadasSpan.textContent = `(${x}, ${y})`;
    });
}