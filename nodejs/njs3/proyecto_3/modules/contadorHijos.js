// modules/contadorHijos.js
export async function precargarContenedores(urls) {
    const resultados = {};
    for (const [key, url] of Object.entries(urls)) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const container = doc.querySelector('.container');
            const numHijos = container ? container.childElementCount : -1;
            resultados[key] = numHijos;
        } catch (error) {
            console.error(`Error al cargar ${url}:`, error);
            resultados[key] = -1;
        }
    }
    return resultados;
}

export function asignarEventosContadores(botones, contadoresPrecargados, mensajeGlobalId) {
    const mensajeDiv = document.getElementById(mensajeGlobalId);
    if (!mensajeDiv) return;

    botones.forEach(boton => {
        const clave = boton.dataset.pagina;
        boton.addEventListener('mouseenter', () => {
            const num = contadoresPrecargados[clave];
            if (num !== undefined && num >= 0) {
                mensajeDiv.innerHTML = `📦 La página "${boton.textContent.trim()}" tiene <strong>${num}</strong> hijo(s) directo(s) dentro de su <code>.container</code>.`;
            } else {
                mensajeDiv.innerHTML = `⚠️ No se pudo obtener información para ${clave}.`;
            }
        });
        boton.addEventListener('mouseleave', () => {
            mensajeDiv.innerHTML = ''; // se borra al salir
        });
    });
}

