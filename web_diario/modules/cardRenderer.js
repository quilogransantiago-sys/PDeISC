// ===========================================
// cardRenderer.js - Renderizado y manejo de tarjetas de noticias
// Propósito: crear elementos DOM a partir de datos y manejar la expansión/contracción
// Módulos usados: ninguno (recibe los datos)
// Funciones principales: crearTarjeta, toggleExpandir, renderizarLista
// ===========================================

/**
 * Crea una tarjeta de noticia con su contenido y región expandible.
 * @param {Object} noticia - Objeto con los campos de la noticia.
 * @returns {HTMLElement} - Elemento div con la estructura completa de la tarjeta.
 */
export function crearTarjeta(noticia) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta-noticia';
    tarjeta.setAttribute('data-id', noticia.id);

    // Imagen
    const img = document.createElement('img');
    img.src = noticia.imagen;
    img.alt = noticia.titulo;
    img.className = 'imagen-noticia';
    img.loading = 'lazy';

    // Contenedor de contenido principal
    const contenido = document.createElement('div');
    contenido.className = 'contenido-noticia';

    const temaSpan = document.createElement('span');
    temaSpan.className = 'tema-noticia';
    temaSpan.textContent = noticia.tema;

    const tituloH3 = document.createElement('h3');
    tituloH3.className = 'titulo-noticia';
    tituloH3.textContent = noticia.titulo;

    const resumenP = document.createElement('p');
    resumenP.className = 'resumen-noticia';
    resumenP.textContent = noticia.resumen;

    contenido.append(temaSpan, tituloH3, resumenP);

    // Región expandible (inicialmente oculta)
    const expandibleDiv = document.createElement('div');
    expandibleDiv.className = 'expandible';
    const textoExtra = document.createElement('div');
    textoExtra.className = 'texto-expandido';
    textoExtra.textContent = noticia.contenidoExpandido;
    expandibleDiv.appendChild(textoExtra);

    tarjeta.append(img, contenido, expandibleDiv);

    // Asociar evento de click para toggle de expansión
    tarjeta.addEventListener('click', (evento) => {
        // Evita que el click se propague (no necesario pero por buenas prácticas)
        evento.stopPropagation();
        toggleExpandir(expandibleDiv);
    });

    return tarjeta;
}

/**
 * Alterna la clase 'expandido' en el elemento expandible y actualiza max-height de forma fluida.
 * @param {HTMLElement} elementoExpandible - Div con clase .expandible
 */
function toggleExpandir(elementoExpandible) {
    elementoExpandible.classList.toggle('expandido');
}

/**
 * Toma un array de noticias y las renderiza dentro del contenedor.
 * @param {Array} noticiasArray - Lista de objetos de noticias.
 * @param {HTMLElement} contenedor - Elemento DOM donde se insertarán las tarjetas.
 */
export function renderizarLista(noticiasArray, contenedor) {
    if (!contenedor) {
        console.error('cardRenderer: contenedor no válido');
        return;
    }
    // Limpiar contenedor
    contenedor.innerHTML = '';

    // Crear y agregar cada tarjeta
    noticiasArray.forEach(noticia => {
        const tarjeta = crearTarjeta(noticia);
        contenedor.appendChild(tarjeta);
    });
}