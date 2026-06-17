// Módulo URL: analiza una URL de ejemplo y muestra sus componentes en consola.
// Demuestra: protocolo, host, pathname, query, parámetros, etc.

import url from 'url';

const urlEjemplo = 'https://github.com/quilogransantiago-sys/PDeISC/tree/main/nodejs/njs2/punto_2';

// Parsear con objeto URL (nativo) y con url.parse (legacy) para mostrar ambos.
const parsed = new URL(urlEjemplo);
const legacy = url.parse(urlEjemplo, true); // true convierte query en objeto

console.log('=== ANÁLISIS DE URL ===');
console.log('URL original:', urlEjemplo);
console.log('\n--- Con URL (WHATWG) ---');
console.log('Protocolo:', parsed.protocol);
console.log('Host:', parsed.host);
console.log('Hostname:', parsed.hostname);
console.log('Puerto:', parsed.port);
console.log('Pathname:', parsed.pathname);
console.log('Search (query string):', parsed.search);
console.log('Hash (fragmento):', parsed.hash);
console.log('Parámetros (URLSearchParams):');
for (const [clave, valor] of parsed.searchParams) {
    console.log(`  ${clave} = ${valor}`);
}

console.log('\n--- Con url.parse (legacy) ---');
console.log('Host:', legacy.host);
console.log('Path:', legacy.path);
console.log('Query (objeto):', legacy.query);
console.log('Href:', legacy.href);

// Extra: demostrar construcción de URL modificada
const nuevaUrl = new URL(parsed);
nuevaUrl.searchParams.set('modo', 'inactivo');
console.log('\nURL modificada (cambiando parámetro modo):', nuevaUrl.href);