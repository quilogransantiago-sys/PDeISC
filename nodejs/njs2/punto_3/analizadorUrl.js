/**
 * analizadorUrl.js
 * Componente que demuestra el uso del módulo nativo 'url' de Node.js.
 * Parsea una URL de ejemplo y muestra por consola sus componentes:
 * protocolo, host, puerto, path, query, fragmento, etc.
 * 
 * Módulos usados: url (nativo)
 * Funciones principales: analizarUrl, mostrarInfoUrl
 */

import { parse } from 'url';

/**
 * Analiza una cadena URL y devuelve un objeto con sus componentes.
 * @param {string} urlString - URL a analizar (ej: "https://ejemplo.com:8080/ruta?clave=valor#seccion")
 * @returns {object} - Objeto con los componentes de la URL.
 */
function analizarUrl(urlString) {
    // El segundo parámetro 'true' hace que el query string se convierta en objeto
    return parse(urlString, true);
}

/**
 * Muestra en consola los componentes principales de una URL.
 * @param {string} urlString - URL a analizar.
 */
function mostrarInfoUrl(urlString) {
    console.log(`\n🔍 Analizando URL: "${urlString}"\n`);
    const urlObj = analizarUrl(urlString);

    console.log('=== Componentes de la URL ===');
    console.log(`Protocolo: ${urlObj.protocol || 'no especificado'}`);
    console.log(`Host (dominio + puerto): ${urlObj.host || 'no especificado'}`);
    console.log(`Hostname (solo dominio): ${urlObj.hostname || 'no especificado'}`);
    console.log(`Puerto: ${urlObj.port || 'predeterminado (80/443)'}`);
    console.log(`Path (ruta): ${urlObj.pathname || '/'}`);
    console.log(`Query string (objeto):`, urlObj.query || {});
    console.log(`Fragmento (hash): ${urlObj.hash || 'ninguno'}`);
    console.log(`URL completa: ${urlObj.href}`);
}

// Ejemplo de uso: URL de prueba (puedes cambiarla)
const urlEjemplo = 'https://api.ejemplo.com:3000/usuarios?page=2&limite=10&activo=true#perfil';

mostrarInfoUrl(urlEjemplo);

// Adicional: analizar una URL relativa (sin protocolo)
const urlRelativa = '/productos?categoria=electronica';
console.log('\n--- Con URL relativa ---');
mostrarInfoUrl(urlRelativa);