/**
 * server.js
 * Servidor Express que sirve páginas estáticas y endpoints para:
 * - Punto 1: módulos tiempo y cálculo (se usan en frontend)
 * - Punto 2: módulo HTTP (Express ya lo usa) y FS (lectura de archivos)
 * - Punto 3: módulo URL (análisis de URLs vía endpoint y consola)
 * - Punto 4: paquete upper-case (conversión a mayúsculas)
 * 
 * Módulos usados: express, fs, url, upper-case
 * Funciones principales: configuración de rutas estáticas, endpoints API
 */

import express from 'express';
import fs from 'fs';
import { parse } from 'url';
import { upperCase } from 'upper-case';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PUERTO = 3000;

// Middleware para parsear JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde sus respectivas carpetas
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/modules', express.static(path.join(__dirname, 'modules')));

// Servir páginas HTML desde la carpeta pages (sin extensión .html en la ruta)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});
app.get('/tiempo', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'tiempo.html'));
});
app.get('/calculo', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'calculo.html'));
});
app.get('/url', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'url.html'));
});
app.get('/upper', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'upper.html'));
});
app.get('/sistema', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'sistema.html'));
});

// ========== Punto 3: Endpoint para analizar URL (módulo url nativo) ==========
app.post('/api/analizar-url', (req, res) => {
    const { urlString } = req.body;
    if (!urlString) {
        return res.status(400).json({ error: 'Se requiere una URL' });
    }
    try {
        const urlObj = parse(urlString, true);
        const resultado = {
            protocolo: urlObj.protocol || 'no especificado',
            host: urlObj.host || 'no especificado',
            hostname: urlObj.hostname || 'no especificado',
            puerto: urlObj.port || 'predeterminado',
            path: urlObj.pathname || '/',
            query: urlObj.query,
            fragmento: urlObj.hash || 'ninguno',
            href: urlObj.href
        };
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: 'Error al analizar la URL' });
    }
});

// ========== Punto 4: Endpoint para convertir a mayúsculas (upper-case) ==========
app.post('/api/convertir-mayusculas', (req, res) => {
    const { texto } = req.body;
    if (texto === undefined) {
        return res.status(400).json({ error: 'Se requiere texto' });
    }
    const resultado = upperCase(texto);
    res.json({ original: texto, mayusculas: resultado });
});

// ========== Punto 2: Endpoint para leer archivo del sistema (FS) ==========
app.get('/api/leer-archivo', (req, res) => {
    const archivo = path.join(__dirname, 'package.json');
    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo leer el archivo' });
        }
        try {
            const json = JSON.parse(data);
            res.json({ contenido: json });
        } catch {
            res.json({ contenido: data });
        }
    });
});

// ========== Punto 3 adicional: mostrar análisis de URL en consola al iniciar ==========
const urlEjemplo = 'https://ejemplo.com:8080/ruta?clave=valor#seccion';
console.log('\n=== Punto 3: Análisis de URL (consola) ===');
const urlParseada = parse(urlEjemplo, true);
console.log(`URL: ${urlEjemplo}`);
console.log(`Host: ${urlParseada.host}`);
console.log(`Path: ${urlParseada.pathname}`);
console.log(`Query:`, urlParseada.query);
console.log('==========================================\n');

// Iniciar servidor
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    console.log('Menú hamburguesa disponible en todas las páginas');
});