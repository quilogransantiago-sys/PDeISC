import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import generarMenu from './modules/menu.js';
import { obtenerClimaReal } from './modules/clima.js';
import { sumar, restar, multiplicar, dividir } from './modules/calculo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUERTO = 3000;

const rutas = {
    '/': { archivo: 'inicio.html', titulo: 'Inicio' },
    '/clima': { archivo: 'clima.html', titulo: 'Clima' },
    '/calculadora': { archivo: 'calculadora.html', titulo: 'Calculadora' },
    '/acerca': { archivo: 'acerca.html', titulo: 'Acerca' },
    '/contacto': { archivo: 'contacto.html', titulo: 'Contacto' }
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
};

async function servirEstatico(url, res) {
    const filePath = path.join(__dirname, url);
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Acceso denegado');
        return true;
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        return true;
    } catch {
        return false;
    }
}

async function obtenerPlantilla() {
    return await fs.readFile(path.join(__dirname, 'templates', 'base.html'), 'utf-8');
}

async function obtenerContenido(nombreArchivo) {
    return await fs.readFile(path.join(__dirname, 'pages', nombreArchivo), 'utf-8');
}

async function generarPaginaClima(plantilla, menu) {
    let contenido = await obtenerContenido('clima.html');
    const clima = await obtenerClimaReal();
    const climaHtml = `
        <p><strong>Temperatura:</strong> ${clima.temperatura}°C</p>
        <p><strong>Estado:</strong> ${clima.estado}</p>
        <p><strong>Viento:</strong> ${clima.viento} km/h</p>
    `;
    contenido = contenido.replace('{{CLIMA_DATOS}}', climaHtml);
    let html = plantilla.replace('{{TITULO}}', 'Clima');
    html = html.replace('{{MENU}}', menu);
    html = html.replace('{{CONTENIDO}}', contenido);
    return html;
}

async function generarPaginaCalculadora(plantilla, menu, query) {
    let contenido = await obtenerContenido('calculadora.html');
    let resultadoHtml = '';
    if (query.a && query.b && query.operacion) {
        const a = parseFloat(query.a);
        const b = parseFloat(query.b);
        let resultado;
        try {
            switch (query.operacion) {
                case 'sumar': resultado = sumar(a, b); break;
                case 'restar': resultado = restar(a, b); break;
                case 'multiplicar': resultado = multiplicar(a, b); break;
                case 'dividir': resultado = dividir(a, b); break;
                default: resultado = 'Operación inválida';
            }
            resultadoHtml = `<div class="resultado"><h3>Resultado: ${resultado}</h3></div>`;
        } catch (error) {
            resultadoHtml = `<div class="error">Error: ${error.message}</div>`;
        }
    }
    contenido = contenido.replace('{{RESULTADO}}', resultadoHtml);
    let html = plantilla.replace('{{TITULO}}', 'Calculadora');
    html = html.replace('{{MENU}}', menu);
    html = html.replace('{{CONTENIDO}}', contenido);
    return html;
}

async function generarPaginaSimple(plantilla, menu, ruta) {
    const info = rutas[ruta];
    let contenido = await obtenerContenido(info.archivo);
    let html = plantilla.replace('{{TITULO}}', info.titulo);
    html = html.replace('{{MENU}}', menu);
    html = html.replace('{{CONTENIDO}}', contenido);
    return html;
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PUERTO}`);
    const pathname = url.pathname;
    const query = Object.fromEntries(url.searchParams);

    if (await servirEstatico(pathname, res)) return;

    if (rutas[pathname]) {
        try {
            const plantilla = await obtenerPlantilla();
            const menuHtml = generarMenu(pathname);
            let html;
            if (pathname === '/clima') {
                html = await generarPaginaClima(plantilla, menuHtml);
            } else if (pathname === '/calculadora') {
                html = await generarPaginaCalculadora(plantilla, menuHtml, query);
            } else {
                html = await generarPaginaSimple(plantilla, menuHtml, pathname);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end('Error interno');
        }
    } else {
        res.writeHead(404);
        res.end('<h1>404 - Página no encontrada</h1>');
    }
});

server.listen(PUERTO, () => {
    console.log(`✅ Servidor completo en http://localhost:${PUERTO}`);
    console.log(`📄 Sitio con menú y 5 páginas funcionando`);
});