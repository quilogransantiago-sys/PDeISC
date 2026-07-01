// ---------------------------------------------------------------
// renderizado.js - Dibujo del canvas, minimapa, cámara y panel UI.
// Funciones separadas por elemento: fondo, bases, paredes, cristales, serpientes.
// ---------------------------------------------------------------

import {
    TAMANIO_CELDA, COLORES_JUGADOR, COLORES_BASE_JUGADOR, BORDES_BASE_JUGADOR
} from '../modules/config.js';

// ---- Panel de información ----

// Crea el div flotante con estadísticas del jugador.
export function crearPanelInfo() {
    var div = document.createElement('div');
    div.id = 'infoDiv';
    div.style.position = 'absolute';
    div.style.top = '10px';
    div.style.backgroundColor = 'rgba(0,0,0,0.6)';
    div.style.color = 'white';
    div.style.padding = '6px 12px';
    div.style.borderRadius = '8px';
    div.style.fontFamily = 'monospace';
    div.style.fontSize = '13px';
    div.style.zIndex = '10';
    div.style.pointerEvents = 'none';
    document.getElementById('gameArea').appendChild(div);
    return div;
}

// Actualiza el texto del panel con los datos actuales del jugador.
export function actualizarPanelInfo(divInfo, estadoJuego, miIndice) {
    if (!estadoJuego) return;
    var yo = estadoJuego.jugadores.find(function (j) { return j.indice === miIndice; });
    if (!yo) return;
    var min = Math.floor(estadoJuego.tiempoRestante / 60);
    var seg = Math.floor(estadoJuego.tiempoRestante % 60);
    var infoParedes = '';
    if (estadoJuego.esModoDificil) {
        infoParedes = '| 🧱 ' + estadoJuego.paredes.length;
    }
    divInfo.innerHTML = '⏱️ ' + min + ':' + seg.toString().padStart(2, '0') +
        '<br>💎 ' + yo.puntos + ' | 🏦 ' + yo.puntosDepositados + '/' + yo.puntosParaCrecer +
        '<br>🐍 ' + yo.cuerpo.length + ' | 🏠 ' + yo.base.ancho + 'x' + yo.base.alto + ' ' + infoParedes;
}

// ---- Cámara ----

// Calcula el offset de la cámara centrada en la cabeza del jugador local.
export function obtenerOffsetCamara(estadoJuego, miIndice, cols, filas) {
    if (!estadoJuego) return { camX: 0, camY: 0 };
    var yo = estadoJuego.jugadores.find(function (j) { return j.indice === miIndice; });
    if (!yo || !yo.cuerpo.length) return { camX: 0, camY: 0 };
    return {
        camX: yo.cuerpo[0].x - Math.floor(cols / 2),
        camY: yo.cuerpo[0].y - Math.floor(filas / 2),
    };
}

// Redimensiona los canvas al tamaño del viewport.
export function redimensionarCanvas() {
    var area = document.getElementById('gameArea');
    var canvas = document.getElementById('snakeCanvas');
    var minimapa = document.getElementById('minimapCanvas');
    var rect = area.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    var esMovil = window.innerWidth <= 768;
    if (esMovil) {
        var barra = document.getElementById('sidebar');
        var tam = Math.min(barra.clientWidth - 10, barra.clientHeight - 10, 120);
        minimapa.width = tam;
        minimapa.height = tam;
    } else {
        var tam = Math.min(rect.width * 0.8, rect.height * 0.6, 300);
        minimapa.width = tam;
        minimapa.height = tam;
    }
}

// ---- Funciones de dibujo individuales ----

// Dibuja el fondo del juego (negro fuera del mapa, color del mapa dentro).
function dibujarFondo(ctx, estadoJuego, camX, camY, esOscuro) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var ox = -camX * TAMANIO_CELDA;
    var oy = -camY * TAMANIO_CELDA;
    var mw = estadoJuego.tamanioMapa * TAMANIO_CELDA;
    var mh = estadoJuego.tamanioMapa * TAMANIO_CELDA;
    var sx = Math.max(0, ox);
    var sy = Math.max(0, oy);
    var sw = Math.min(ctx.canvas.width, ox + mw) - sx;
    var sh = Math.min(ctx.canvas.height, oy + mh) - sy;
    if (sw > 0 && sh > 0) {
        ctx.fillStyle = esOscuro ? '#0a0f1a' : '#fff';
        ctx.fillRect(sx, sy, sw, sh);
    }
}

// Dibuja las bases de todos los jugadores.
function dibujarBases(ctx, estadoJuego, camX, camY) {
    for (var i = 0; i < estadoJuego.jugadores.length; i++) {
        var j = estadoJuego.jugadores[i];
        var bx = (j.base.x - camX) * TAMANIO_CELDA;
        var by = (j.base.y - camY) * TAMANIO_CELDA;
        var bw = j.base.ancho * TAMANIO_CELDA;
        var bh = j.base.alto * TAMANIO_CELDA;
        if (bx + bw > 0 && bx < ctx.canvas.width && by + bh > 0 && by < ctx.canvas.height) {
            ctx.fillStyle = j.colorBase || COLORES_BASE_JUGADOR[j.indice];
            ctx.fillRect(bx, by, bw, bh);
            ctx.strokeStyle = j.bordeBase || BORDES_BASE_JUGADOR[j.indice];
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, by, bw, bh);
        }
    }
}

// Dibuja las paredes con efecto de parpadeo (solo modo difícil).
function dibujarParedes(ctx, estadoJuego, camX, camY) {
    if (!estadoJuego.esModoDificil) return;
    var parpadeo = estadoJuego.parpadeoParedes;
    var visible = !parpadeo || Math.sin(Date.now() / 150) > 0;
    var color = visible ? '#e74c3c' : '#5a1a1a';
    for (var i = 0; i < estadoJuego.paredes.length; i++) {
        var p = estadoJuego.paredes[i];
        var sx = (p.x - camX) * TAMANIO_CELDA;
        var sy = (p.y - camY) * TAMANIO_CELDA;
        if (sx + TAMANIO_CELDA > 0 && sx < ctx.canvas.width && sy + TAMANIO_CELDA > 0 && sy < ctx.canvas.height) {
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, TAMANIO_CELDA - 1, TAMANIO_CELDA - 1);
        }
    }
}

// Dibuja los cristales.
function dibujarCristales(ctx, estadoJuego, camX, camY, esOscuro) {
    for (var i = 0; i < estadoJuego.cristales.length; i++) {
        var c = estadoJuego.cristales[i];
        var sx = (c.x - camX) * TAMANIO_CELDA;
        var sy = (c.y - camY) * TAMANIO_CELDA;
        if (sx + TAMANIO_CELDA > 0 && sx < ctx.canvas.width && sy + TAMANIO_CELDA > 0 && sy < ctx.canvas.height) {
            var tipo = estadoJuego.tiposCristal[c.indiceTipo || c.typeIndex || 0];
            var color = tipo ? tipo.color : '#aaa';
            if (!esOscuro) {
                var v = tipo ? (tipo.valor || tipo.value || 1) : 1;
                if (v === 1) color = '#666';
                else if (v === 5) color = '#f0f0f0';
                else if (v === 15) color = '#d4a017';
            }
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, TAMANIO_CELDA - 1, TAMANIO_CELDA - 1);
        }
    }
}

// Dibuja todas las serpientes (cabeza más oscura que el cuerpo).
function dibujarSerpientes(ctx, estadoJuego, camX, camY) {
    for (var i = 0; i < estadoJuego.jugadores.length; i++) {
        var j = estadoJuego.jugadores[i];
        var cabeza = j.colorCabeza || j.color || COLORES_JUGADOR[j.indice];
        var cuerpo = j.colorClaro || '#2ecc71';
        for (var s = 0; s < j.cuerpo.length; s++) {
            var seg = j.cuerpo[s];
            var sx = (seg.x - camX) * TAMANIO_CELDA;
            var sy = (seg.y - camY) * TAMANIO_CELDA;
            if (sx + TAMANIO_CELDA > 0 && sx < ctx.canvas.width && sy + TAMANIO_CELDA > 0 && sy < ctx.canvas.height) {
                ctx.fillStyle = s === 0 ? cabeza : cuerpo;
                ctx.fillRect(sx, sy, TAMANIO_CELDA - 1, TAMANIO_CELDA - 1);
            }
        }
    }
}

// ---- Dibujo principal ----

// Orquesta el renderizado completo llamando a cada sub-función.
export function dibujar(estadoJuego, miIndice) {
    var canvas = document.getElementById('snakeCanvas');
    var ctx = canvas.getContext('2d');
    if (!estadoJuego) return;

    var cols = Math.max(1, Math.floor(canvas.width / TAMANIO_CELDA));
    var filas = Math.max(1, Math.floor(canvas.height / TAMANIO_CELDA));
    var esOscuro = document.documentElement.classList.contains('dark');
    var cam = obtenerOffsetCamara(estadoJuego, miIndice, cols, filas);

    dibujarFondo(ctx, estadoJuego, cam.camX, cam.camY, esOscuro);
    dibujarBases(ctx, estadoJuego, cam.camX, cam.camY);
    dibujarParedes(ctx, estadoJuego, cam.camX, cam.camY);
    dibujarCristales(ctx, estadoJuego, cam.camX, cam.camY, esOscuro);
    dibujarSerpientes(ctx, estadoJuego, cam.camX, cam.camY);

    dibujarMinimapa(estadoJuego, esOscuro);
}

// ---- Minimapa ----

// Dibuja el minimapa en el sidebar. En móvil solo bases y serpientes.
function dibujarMinimapa(estadoJuego, esOscuro) {
    var minimapa = document.getElementById('minimapCanvas');
    var ctx = minimapa.getContext('2d');
    var w = minimapa.width;
    var h = minimapa.height;
    if (!w || !h || !estadoJuego) return;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = esOscuro ? '#0a0f1a' : '#fff';
    ctx.fillRect(0, 0, w, h);

    var escX = w / estadoJuego.tamanioMapa;
    var escY = h / estadoJuego.tamanioMapa;
    var cw = Math.max(1, escX);
    var ch = Math.max(1, escY);
    var esMovil = window.innerWidth <= 768;

    // Bases (siempre se dibujan)
    for (var i = 0; i < estadoJuego.jugadores.length; i++) {
        var j = estadoJuego.jugadores[i];
        ctx.fillStyle = j.colorBase || COLORES_BASE_JUGADOR[j.indice];
        ctx.fillRect(j.base.x * escX, j.base.y * escY, j.base.ancho * escX, j.base.alto * escY);
        ctx.strokeStyle = j.bordeBase || BORDES_BASE_JUGADOR[j.indice];
        ctx.lineWidth = 1;
        ctx.strokeRect(j.base.x * escX, j.base.y * escY, j.base.ancho * escX, j.base.alto * escY);
    }

    // Cristales y paredes: solo en escritorio (ahorra rendimiento en móvil)
    if (!esMovil) {
        for (var c = 0; c < estadoJuego.cristales.length; c++) {
            var cristal = estadoJuego.cristales[c];
            var tipo = estadoJuego.tiposCristal[cristal.indiceTipo || cristal.typeIndex || 0];
            var color = tipo ? tipo.color : '#aaa';
            if (!esOscuro) {
                var v = tipo ? (tipo.valor || tipo.value || 1) : 1;
                if (v === 1) color = '#666';
                else if (v === 5) color = '#f0f0f0';
                else if (v === 15) color = '#d4a017';
            }
            ctx.fillStyle = color;
            ctx.fillRect(cristal.x * escX, cristal.y * escY, cw, ch);
        }
        if (estadoJuego.esModoDificil) {
            for (var p = 0; p < estadoJuego.paredes.length; p++) {
                var pared = estadoJuego.paredes[p];
                ctx.fillStyle = '#e74c3c';
                ctx.fillRect(pared.x * escX, pared.y * escY, cw, ch);
            }
        }
    }

    // Serpientes (siempre)
    for (var s = 0; s < estadoJuego.jugadores.length; s++) {
        var jug = estadoJuego.jugadores[s];
        var cc = jug.color || COLORES_JUGADOR[jug.indice];
        for (var seg = 0; seg < jug.cuerpo.length; seg++) {
            var pos = jug.cuerpo[seg];
            ctx.fillStyle = seg === 0 ? cc : '#aaa';
            ctx.fillRect(pos.x * escX, pos.y * escY, cw, ch);
        }
    }

    ctx.strokeStyle = esOscuro ? '#334155' : '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
}