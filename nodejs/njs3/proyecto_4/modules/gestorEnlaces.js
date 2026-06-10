/**
 * gestorEnlaces.js
 * Módulo para crear, modificar y renderizar nodos <a>.
 * Exporta: inicializarGestor, agregarEnlace, modificarHrefEnlace
 */

// Estado interno
let contenedor = null;
let panelMensajes = null;
let contadorId = 5;

// Datos iniciales: 5 enlaces
const enlacesIniciales = [
    { id: 1, texto: 'Google', href: 'https://www.google.com' },
    { id: 2, texto: 'YouTube', href: 'https://www.youtube.com' },
    { id: 3, texto: 'GitHub', href: 'https://www.github.com' },
    { id: 4, texto: 'Stack Overflow', href: 'https://stackoverflow.com' },
    { id: 5, texto: 'Wikipedia', href: 'https://www.wikipedia.org' }
];

let enlaces = [...enlacesIniciales];

/**
 * Muestra mensaje en el panel sin usar alert()
 */
function mostrarMensaje(mensaje, esError = false) {
    if (!panelMensajes) return;
    const color = esError ? '#dc3545' : 'inherit';
    panelMensajes.innerHTML = `<span style="color:${color}">${mensaje}</span>`;
    setTimeout(() => {
        if (panelMensajes.innerHTML === `<span style="color:${color}">${mensaje}</span>`) {
            panelMensajes.innerHTML = '';
        }
    }, 4000);
}

/**
 * Renderiza todos los enlaces en el contenedor
 */
function renderizarLista() {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    enlaces.forEach(enlace => {
        const item = document.createElement('div');
        item.className = 'item-enlace';
        item.dataset.id = enlace.id;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-enlace';
        const link = document.createElement('a');
        link.href = enlace.href;
        link.textContent = enlace.texto;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        infoDiv.appendChild(link);

        const hrefSpan = document.createElement('span');
        hrefSpan.style.fontSize = '0.75rem';
        hrefSpan.style.opacity = '0.7';
        hrefSpan.style.display = 'block';
        hrefSpan.textContent = `href: ${enlace.href}`;
        infoDiv.appendChild(hrefSpan);

        const accionesDiv = document.createElement('div');
        accionesDiv.className = 'acciones-enlace';
        const btnModificar = document.createElement('button');
        btnModificar.textContent = '✏️ Modificar href';
        btnModificar.className = 'btn btn-modificar';
        btnModificar.addEventListener('click', () => modificarHrefEnlace(enlace.id));

        accionesDiv.appendChild(btnModificar);
        item.appendChild(infoDiv);
        item.appendChild(accionesDiv);
        contenedor.appendChild(item);
    });
}

/**
 * Modifica el href de un enlace y muestra el cambio realizado
 * @param {number} id - Identificador del enlace
 */
export function modificarHrefEnlace(id) {
    const indice = enlaces.findIndex(e => e.id === id);
    if (indice === -1) {
        mostrarMensaje('Error: enlace no encontrado', true);
        return;
    }
    const anterior = enlaces[indice].href;

    // Lista de posibles nuevas URLs
    const nuevas = [
        'https://www.ejemplo-modificado.com',
        'https://www.nueva-direccion.org',
        'https://www.cambiado.net',
        'https://www.otro-sitio.es'
    ];
    let nueva = nuevas[Math.floor(Math.random() * nuevas.length)];
    if (nueva === anterior) {
        nueva = nuevas[(nuevas.indexOf(nueva) + 1) % nuevas.length];
    }

    enlaces[indice].href = nueva;
    renderizarLista();
    mostrarMensaje(`Atributo href modificado: "${anterior}" → "${nueva}"`);
}

/**
 * Agrega un nuevo enlace a la lista
 * @param {string} texto - Texto visible del enlace
 * @param {string} href - URL destino
 */
export function agregarEnlace(texto, href = '#') {
    contadorId++;
    const nuevo = {
        id: contadorId,
        texto: texto.trim(),
        href: href
    };
    enlaces.push(nuevo);
    renderizarLista();
    mostrarMensaje(`Nuevo enlace creado: "${texto}" con href "${href}"`);
}

/**
 * Inicializa el gestor: establece referencias DOM y carga datos iniciales
 * @param {HTMLElement} contenedorElement - Elemento donde se renderiza la lista
 * @param {HTMLElement} panelElement - Elemento para mensajes
 */
export function inicializarGestor(contenedorElement, panelElement) {
    contenedor = contenedorElement;
    panelMensajes = panelElement;
    enlaces = [...enlacesIniciales];
    contadorId = Math.max(...enlaces.map(e => e.id), 0);
    renderizarLista();
    mostrarMensaje(`Gestor iniciado. ${enlaces.length} enlaces disponibles.`);
}