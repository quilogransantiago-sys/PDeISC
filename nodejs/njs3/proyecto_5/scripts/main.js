// scripts/main.js
import { AgregadorHTML } from '/modules/agregadorHTML.js';

document.addEventListener('DOMContentLoaded', () => {
    const agregador = new AgregadorHTML('contenedorDinamico', 'logList');

    // Botones específicos
    document.getElementById('btnParrafo').addEventListener('click', () => agregador.agregarParrafo());
    document.getElementById('BtnImagen').addEventListener('click', () => agregador.agregarImagen());
    document.getElementById('btnLista').addEventListener('click', () => agregador.agregarLista());
    document.getElementById('btnTabla').addEventListener('click', () => agregador.agregarTabla());
    document.getElementById('btnDiv').addEventListener('click', () => agregador.agregarDiv());
    document.getElementById('btnLink').addEventListener('click', () => agregador.agregarEnlace());
    document.getElementById('btnLimpiar').addEventListener('click', () => agregador.limpiarContenedor());
});