/**
 * constructorHtml.js
 * Módulo que genera cadenas HTML para diferentes objetos.
 * Exporta: generarParrafo, generarImagen, generarLista, generarTabla, generarVideo
 */

/**
 * Genera un párrafo con texto aleatorio
 * @returns {string} HTML del párrafo
 */
export function generarParrafo() {
    const textos = [
        "Este es un párrafo de ejemplo creado con innerHTML. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Otro párrafo interesante para demostrar la capacidad de agregar contenido dinámico mediante JavaScript.",
        "La manipulación del DOM con innerHTML es potente pero debe usarse con precaución para evitar problemas de seguridad.",
        "Este párrafo contiene información relevante sobre el proyecto. ¡El diseño responsive aprovecha todo el espacio!"
    ];
    const texto = textos[Math.floor(Math.random() * textos.length)];
    return `<div class="objeto-html"><p>${texto}</p></div>`;
}

/**
 * Genera una imagen de placeholder (Lorem Picsum)
 * @returns {string} HTML de la imagen
 */
export function generarImagen() {
    const id = Math.floor(Math.random() * 200);
    const url = `https://picsum.photos/id/${id}/400/250`;
    return `<div class="objeto-html"><img src="${url}" alt="Imagen aleatoria" loading="lazy"><p><small>Imagen de Lorem Picsum (ID ${id})</small></p></div>`;
}

/**
 * Genera una lista desordenada con 3-5 elementos
 * @returns {string} HTML de la lista
 */
export function generarLista() {
    const items = ["Elemento uno de la lista", "Elemento dos", "Elemento tres", "Elemento adicional", "Último elemento"];
    const cantidad = Math.floor(Math.random() * 3) + 3; // entre 3 y 5
    const listaItems = items.slice(0, cantidad).map(item => `<li>${item}</li>`).join('');
    return `<div class="objeto-html"><ul>${listaItems}</ul></div>`;
}

/**
 * Genera una tabla simple con 3 filas de ejemplo
 * @returns {string} HTML de la tabla
 */
export function generarTabla() {
    return `<div class="objeto-html">
        <table>
            <thead><tr><th>Nombre</th><th>Edad</th><th>Ciudad</th></tr></thead>
            <tbody>
                <tr><td>Ana García</td><td>28</td><td>Madrid</td></tr>
                <tr><td>Carlos López</td><td>34</td><td>Barcelona</td></tr>
                <tr><td>Laura Martínez</td><td>25</td><td>Valencia</td></tr>
            </tbody>
        </table>
    </div>`;
}

/**
 * Genera un video de ejemplo (YouTube embed)
 * @returns {string} HTML del video
 */
export function generarVideo() {
    // Video de muestra: "Big Buck Bunny" (dominio público)
    const videoId = "aqz-KE-bpKQ";
    return `<div class="objeto-html">
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" 
            title="Video de ejemplo" frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
        <p><small>Video de muestra (YouTube)</small></p>
    </div>`;
}