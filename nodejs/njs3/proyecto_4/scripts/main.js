// scripts/main.js
import { NodosManager } from '/modules/nodosManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const manager = new NodosManager('listaEnlaces', 'logList');

    // Botones de creación
    document.getElementById('crear1').addEventListener('click', () => {
        manager.crearEnlace('Google', 'https://www.google.com', '_blank');
    });
    document.getElementById('crear2').addEventListener('click', () => {
        manager.crearEnlace('YouTube', 'https://www.youtube.com', '_blank');
    });
    document.getElementById('crear3').addEventListener('click', () => {
        manager.crearEnlace('GitHub', 'https://github.com', '_blank');
    });
    document.getElementById('crear4').addEventListener('click', () => {
        manager.crearEnlace('Twitter', 'https://twitter.com', '_blank');
    });
    document.getElementById('crear5').addEventListener('click', () => {
        manager.crearEnlace('LinkedIn', 'https://linkedin.com', '_blank');
    });

    // Botones de modificación
    document.getElementById('modificarHref').addEventListener('click', () => {
        manager.modificarAtributoGlobal('href', 'https://example.com', 'Cambiar href a example.com');
    });
    document.getElementById('modificarTexto').addEventListener('click', () => {
        manager.modificarTextoGlobal(' - Modificado');
    });
    document.getElementById('modificarTarget').addEventListener('click', () => {
        manager.modificarAtributoGlobal('target', '_blank', 'Abrir todos en nueva pestaña');
    });
});