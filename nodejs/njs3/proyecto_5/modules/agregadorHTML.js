// modules/agregadorHTML.js
export class AgregadorHTML {
    constructor(contenedorId, logListId) {
        this.contenedor = document.getElementById(contenedorId);
        this.logList = document.getElementById(logListId);
        if (!this.contenedor || !this.logList) throw new Error('Elementos no encontrados');
    }

    // Agrega un mensaje al registro
    agregarLog(mensaje) {
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
        this.logList.appendChild(li);
        this.logList.parentElement.scrollTop = this.logList.parentElement.scrollHeight;
    }

    // Método genérico para agregar HTML usando innerHTML (acumulativo)
    agregarHTML(html, descripcion) {
        if (!html) return;
        this.contenedor.innerHTML += html;
        this.agregarLog(`✅ ${descripcion}`);
    }

    // Métodos específicos que generan el HTML
    agregarParrafo() {
        const texto = `Párrafo agregado el ${new Date().toLocaleString()}`;
        const html = `<p style="background:#e9ecef; padding:8px; border-radius:4px;">📄 ${texto}</p>`;
        this.agregarHTML(html, 'Agregado párrafo');
    }

    agregarImagen() {
        // Imagen aleatoria de Lorem Picsum (pero fija para no repetir siempre la misma)
        const randomId = Math.floor(Math.random() * 100) + 1;
        const html = `<div><img src="https://picsum.photos/id/${randomId}/200/150" alt="random img" style="border-radius:6px;"></div>`;
        this.agregarHTML(html, `Agregado imagen (ID ${randomId})`);
    }

    agregarLista() {
        const html = `
            <ul style="background:#f1f3f5; padding:10px 20px; border-radius:6px;">
                <li>Elemento de lista 1</li>
                <li>Elemento de lista 2</li>
                <li>Elemento de lista 3</li>
            </ul>
        `;
        this.agregarHTML(html, 'Agregado lista desordenada');
    }

    agregarTabla() {
        const html = `
            <table style="border:1px solid #ccc;">
                <thead><tr><th>Nombre</th><th>Edad</th></tr></thead>
                <tbody>
                    <tr><td>Ana</td><td>25</td></tr>
                    <tr><td>Luis</td><td>30</td></tr>
                </tbody>
            </table>
        `;
        this.agregarHTML(html, 'Agregado tabla simple');
    }

    agregarDiv() {
        const html = `<div class="mi-div"><strong>Div personalizado</strong><br>Este div se agregó con innerHTML.</div>`;
        this.agregarHTML(html, 'Agregado div con borde');
    }

    agregarEnlace() {
        const html = `<a href="https://www.ejemplo.com" target="_blank">🔗 Enlace agregado dinámicamente</a><br>`;
        this.agregarHTML(html, 'Agregado enlace');
    }

    limpiarContenedor() {
        this.contenedor.innerHTML = '';
        this.agregarLog('🧹 Contenido limpiado');
    }
}