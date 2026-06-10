/**
 * Archivo: imageManager.js
 * Propósito: Gestionar creación, cambio de imagen y redimensionamiento.
 * Módulos usados: ninguno (funciones puras)
 * Funciones principales: agregarImagen, cambiarImagen, cambiarTamanioImagen, obtenerEstadoImagen
 */

// Contenedor donde se mostrará la imagen
const contenedorImagen = document.getElementById('contenedorImagen');
let imagenElemento = null;

// Lista de imágenes para rotar (uso de Lorem Picsum - imágenes reales y confiables)
const imagenesURL = [
    'https://picsum.photos/id/104/400/300',  // perro y naturaleza
    'https://picsum.photos/id/169/400/300',  // atardecer
    'https://picsum.photos/id/155/400/300',  // acantilado
    'https://picsum.photos/id/20/400/300'     // escritorio café
];

let indiceImagenActual = 0;

// Tamaños predefinidos (ancho en píxeles, altura automática)
const tamanios = [
    { nombre: 'Pequeño (150px)', ancho: 150 },
    { nombre: 'Mediano (250px)', ancho: 250 },
    { nombre: 'Grande (350px)', ancho: 350 }
];
let indiceTamanio = 0;

/**
 * Agrega una imagen al contenedor si no existe.
 * @returns {Object} { exito: boolean, mensaje: string }
 */
export function agregarImagen() {
    if (imagenElemento) {
        return { exito: false, mensaje: '⚠️ La imagen ya fue agregada. Usa "Cambiar imagen" o "Cambiar tamaño".' };
    }

    imagenElemento = document.createElement('img');
    imagenElemento.src = imagenesURL[indiceImagenActual];
    imagenElemento.alt = 'Imagen dinámica';
    imagenElemento.style.width = `${tamanios[indiceTamanio].ancho}px`;
    imagenElemento.style.height = 'auto';
    contenedorImagen.appendChild(imagenElemento);

    return { exito: true, mensaje: `🖼️ Imagen agregada con tamaño ${tamanios[indiceTamanio].nombre}` };
}

/**
 * Cambia la imagen por la siguiente de la lista.
 * @returns {Object} { exito: boolean, mensaje: string }
 */
export function cambiarImagen() {
    if (!imagenElemento) {
        return { exito: false, mensaje: '❌ No hay imagen para cambiar. Primero usa "Agregar imagen".' };
    }

    indiceImagenActual = (indiceImagenActual + 1) % imagenesURL.length;
    imagenElemento.src = imagenesURL[indiceImagenActual];
    return { exito: true, mensaje: `🔄 Imagen cambiada (${indiceImagenActual + 1}/${imagenesURL.length})` };
}

/**
 * Cambia el tamaño de la imagen en modo cíclico (pequeño -> mediano -> grande -> pequeño)
 * @returns {Object} { exito: boolean, mensaje: string }
 */
export function cambiarTamanioImagen() {
    if (!imagenElemento) {
        return { exito: false, mensaje: '❌ No hay imagen para redimensionar.' };
    }

    indiceTamanio = (indiceTamanio + 1) % tamanios.length;
    const nuevoAncho = tamanios[indiceTamanio].ancho;
    imagenElemento.style.width = `${nuevoAncho}px`;
    return { exito: true, mensaje: `📏 Tamaño cambiado: ${tamanios[indiceTamanio].nombre}` };
}

/**
 * Consulta si la imagen existe.
 * @returns {Object} { existe: boolean }
 */
export function obtenerEstadoImagen() {
    return { existe: imagenElemento !== null };
}