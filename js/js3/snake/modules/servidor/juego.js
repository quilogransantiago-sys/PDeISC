// ---------------------------------------------------------------
// juego.js - Toda la lógica del juego: game loop, movimiento,
// colisiones, cristales, paredes, depósitos, ranking.
// ---------------------------------------------------------------

import { Serpiente } from '../snake.js';
import {
    VELOCIDAD_INICIAL_MS, VELOCIDAD_MAXIMA_MS, DIRECCIONES,
    TAMANIO_BASE_INICIAL, CRECIMIENTO_BASE, DURACION_PARTIDA,
    MARGEN_EXCLUSION_BASE, DISTANCIA_MINIMA,
    TIPOS_CRISTAL_NORMAL, TIPOS_CRISTAL_DIFICIL,
    CANTIDAD_PAREDES, CICLO_PAREDES_MS, PARPADEO_PAREDES_MS,
    COLORES_JUGADOR, COLORES_JUGADOR_CLARO, COLORES_JUGADOR_CABEZA,
    COLORES_BASE_JUGADOR, BORDES_BASE_JUGADOR,
    obtenerPosicionBase, obtenerDireccionSpawn, TICK_SERVIDOR_MS,
} from '../config.js';

// Map<idSala, estadoJuego> - partidas activas
export const partidas = new Map();

// ---- Utilidades matemáticas ----

export function distancia(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }

export function estaDentroDeBase(celda, base) {
    return celda.x >= base.x && celda.x < base.x + base.ancho &&
        celda.y >= base.y && celda.y < base.y + base.alto;
}

// Zona prohibida alrededor de la base (no se generan cosas ahí).
export function esZonaProhibida(x, y, base) {
    const m = MARGEN_EXCLUSION_BASE;
    return x >= base.x - m && x <= base.x + base.ancho + m - 1 &&
        y >= base.y - m && y <= base.y + base.alto + m - 1;
}

// ---- Cristales ---

export function tipoCristalAleatorio(tipos) {
    const rand = Math.random();
    let acum = 0;
    for (let i = 0; i < tipos.length; i++) { acum += tipos[i].prob; if (rand < acum) return i; }
    return 0;
}

// Llena el mapa con la cantidad inicial de cristales.
export function generarCristales(juego) {
    const libres = [];
    for (let y = 0; y < juego.tamanioMapa; y++) for (let x = 0; x < juego.tamanioMapa; x++) {
        const enSerpiente = juego.jugadores.some(j => j.serpiente.cuerpo.some(s => s.x === x && s.y === y));
        const enZonaProhibida = juego.jugadores.some(j => esZonaProhibida(x, y, j.base));
        const enPared = (juego.paredes || []).some(p => p.x === x && p.y === y);
        if (!enSerpiente && !enZonaProhibida && !enPared) libres.push({ x, y });
    }
    // Barajar Fisher-Yates
    for (let i = libres.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[libres[i], libres[j]] = [libres[j], libres[i]]; }
    const seleccionados = [];
    for (const celda of libres) {
        if (seleccionados.length >= juego.cantidadCristales) break;
        if (!seleccionados.some(s => distancia(celda, s) < DISTANCIA_MINIMA))
            seleccionados.push({ x: celda.x, y: celda.y, indiceTipo: tipoCristalAleatorio(juego.tiposCristal) });
    }
    // Relleno si faltan
    for (const celda of libres) {
        if (seleccionados.length >= juego.cantidadCristales) break;
        if (!seleccionados.some(c => c.x === celda.x && c.y === celda.y))
            seleccionados.push({ x: celda.x, y: celda.y, indiceTipo: tipoCristalAleatorio(juego.tiposCristal) });
    }
    juego.cristales = seleccionados;
}

// Agrega un cristal nuevo en una celda libre cuando un jugador come uno.
export function agregarUnCristal(juego) {
    const libres = [];
    for (let y = 0; y < juego.tamanioMapa; y++) for (let x = 0; x < juego.tamanioMapa; x++) {
        const enSerpiente = juego.jugadores.some(j => j.serpiente.cuerpo.some(s => s.x === x && s.y === y));
        const enZonaProhibida = juego.jugadores.some(j => esZonaProhibida(x, y, j.base));
        const enPared = (juego.paredes || []).some(p => p.x === x && p.y === y);
        if (!enSerpiente && !enZonaProhibida && !enPared && !juego.cristales.some(c => c.x === x && c.y === y))
            libres.push({ x, y });
    }
    if (libres.length === 0) return;
    const validas = libres.filter(celda => !juego.cristales.some(c => distancia(celda, c) < DISTANCIA_MINIMA));
    const pool = validas.length > 0 ? validas : libres;
    const pos = pool[Math.floor(Math.random() * pool.length)];
    juego.cristales.push({ x: pos.x, y: pos.y, indiceTipo: tipoCristalAleatorio(juego.tiposCristal) });
}

// ---- Paredes (modo difícil) ----

// Genera 150 paredes aleatorias. No se colocan sobre serpientes ni en las 2 celdas delante de cada cabeza.
export function generarParedes(juego) {
    juego.paredes = [];
    if (!juego.esModoDificil) return;

    // Celdas prohibidas: cuerpos + 2 celdas delante de cada cabeza
    const prohibidas = new Set();
    for (const jugador of juego.jugadores) {
        for (const seg of jugador.serpiente.cuerpo) prohibidas.add(seg.x + ',' + seg.y);
        const cabeza = jugador.serpiente.cuerpo[0];
        const dir = jugador.serpiente.direccion;
        for (let d = 1; d <= 2; d++) {
            const cx = cabeza.x + dir.x * d, cy = cabeza.y + dir.y * d;
            if (cx >= 0 && cx < juego.tamanioMapa && cy >= 0 && cy < juego.tamanioMapa)
                prohibidas.add(cx + ',' + cy);
        }
    }

    const libres = [];
    for (let y = 0; y < juego.tamanioMapa; y++) for (let x = 0; x < juego.tamanioMapa; x++) {
        const enProhibida = prohibidas.has(x + ',' + y);
        const enZonaProhibida = juego.jugadores.some(j => esZonaProhibida(x, y, j.base));
        if (!enProhibida && !enZonaProhibida) libres.push({ x, y });
    }
    for (let i = libres.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[libres[i], libres[j]] = [libres[j], libres[i]]; }
    const seleccionados = [];
    for (const celda of libres) {
        if (seleccionados.length >= CANTIDAD_PAREDES) break;
        if (!seleccionados.some(s => distancia(celda, s) < 2)) seleccionados.push(celda);
    }
    for (const pos of seleccionados) juego.paredes.push({ x: pos.x, y: pos.y });
}

// Cada 5 segundos borra todas las paredes y genera nuevas. Últimos 2s parpadean.
export function actualizarCicloParedes(juego) {
    if (!juego.esModoDificil) return;
    juego.temporizadorParedes += TICK_SERVIDOR_MS;
    juego.parpadeoParedes = (juego.temporizadorParedes >= CICLO_PAREDES_MS - PARPADEO_PAREDES_MS);
    if (juego.temporizadorParedes >= CICLO_PAREDES_MS) {
        juego.temporizadorParedes = 0;
        juego.parpadeoParedes = false;
        juego.paredes = [];
        generarParedes(juego);
    }
}

// ---- Jugadores y bases ----

// Crea un jugador con su base, serpiente y color en la esquina correspondiente.
export function crearJugador(socketId, idx, nombre, tamanioMapa) {
    const posBase = obtenerPosicionBase(idx, tamanioMapa, TAMANIO_BASE_INICIAL);
    const base = { x: posBase.x, y: posBase.y, ancho: TAMANIO_BASE_INICIAL, alto: TAMANIO_BASE_INICIAL };
    const centroX = base.x + Math.floor(base.ancho / 2);
    const centroY = base.y + Math.floor(base.alto / 2);
    const direccionSpawn = obtenerDireccionSpawn(idx);
    const serpiente = new Serpiente(tamanioMapa);
    serpiente.cuerpo = [
        { x: centroX, y: centroY },
        { x: centroX - direccionSpawn.x, y: centroY - direccionSpawn.y },
        { x: centroX - 2 * direccionSpawn.x, y: centroY - 2 * direccionSpawn.y },
    ];
    serpiente.direccion = direccionSpawn;
    serpiente.siguienteDireccion = direccionSpawn;
    return {
        socketId, indice: idx,
        color: COLORES_JUGADOR[idx], colorClaro: COLORES_JUGADOR_CLARO[idx],
        colorCabeza: COLORES_JUGADOR_CABEZA[idx],
        colorBase: COLORES_BASE_JUGADOR[idx], bordeBase: BORDES_BASE_JUGADOR[idx],
        base, serpiente,
        puntos: 0, puntosDepositados: 0,
        velocidadActual: VELOCIDAD_INICIAL_MS,
        nombre: nombre || 'Jugador ' + (idx + 1),
        _murioEsteTick: false,
        contadorMovimiento: 0,
    };
}

// Hace crecer la base del jugador hacia el centro del mapa según su esquina.
export function hacerCrecerBase(jugador) {
    const idx = jugador.indice;
    if (idx === 0) { jugador.base.ancho += CRECIMIENTO_BASE; jugador.base.alto += CRECIMIENTO_BASE; }
    else if (idx === 1) { jugador.base.x -= CRECIMIENTO_BASE; jugador.base.ancho += CRECIMIENTO_BASE; jugador.base.alto += CRECIMIENTO_BASE; }
    else if (idx === 2) { jugador.base.ancho += CRECIMIENTO_BASE; jugador.base.y -= CRECIMIENTO_BASE; jugador.base.alto += CRECIMIENTO_BASE; }
    else if (idx === 3) { jugador.base.x -= CRECIMIENTO_BASE; jugador.base.y -= CRECIMIENTO_BASE; jugador.base.ancho += CRECIMIENTO_BASE; jugador.base.alto += CRECIMIENTO_BASE; }
}

// ---- Creación del estado de juego ----

// Configura dificultad y arma el estado inicial completo.
export function crearEstadoJuego(sala) {
    const dif = sala.dificultad;
    const tamanioMapa = dif === 'facil' ? 55 : 100;
    const cantidadCristales = dif === 'facil' ? 150 : dif === 'dificil' ? 220 : 180;
    const puntosParaCrecer = dif === 'facil' ? 50 : dif === 'dificil' ? 60 : 35;
    const esModoFacil = dif === 'facil';
    const esModoDificil = dif === 'dificil';
    const tiposCristal = esModoFacil
        ? [{ valor: 1, color: '#aaaaaa', prob: 1 }]
        : esModoDificil ? TIPOS_CRISTAL_DIFICIL : TIPOS_CRISTAL_NORMAL;

    const jugadores = sala.jugadores.map((socketId, idx) =>
        crearJugador(socketId, idx, sala.nombresJugadores[idx], tamanioMapa));

    const juego = {
        idSala: sala.id, tamanioMapa, cantidadCristales, puntosParaCrecer,
        esModoFacil, esModoDificil, tiposCristal, jugadores,
        cristales: [], paredes: [],
        tiempoRestante: DURACION_PARTIDA,
        ejecutando: true,
        temporizadorParedes: 0,
        parpadeoParedes: false,
    };
    generarCristales(juego);
    if (esModoDificil) generarParedes(juego);
    return juego;
}

// ---- Respawn ----

// Reinicia una serpiente en su base después de morir (sin cristales ni velocidad extra).
export function respawnJugador(jugador) {
    jugador.puntos = 0;
    const centroX = jugador.base.x + Math.floor(jugador.base.ancho / 2);
    const centroY = jugador.base.y + Math.floor(jugador.base.alto / 2);
    const dirSpawn = obtenerDireccionSpawn(jugador.indice);
    jugador.serpiente.cuerpo = [
        { x: centroX, y: centroY },
        { x: centroX - dirSpawn.x, y: centroY - dirSpawn.y },
        { x: centroX - 2 * dirSpawn.x, y: centroY - 2 * dirSpawn.y },
    ];
    jugador.serpiente.direccion = dirSpawn;
    jugador.serpiente.siguienteDireccion = dirSpawn;
    jugador.velocidadActual = VELOCIDAD_INICIAL_MS;
    jugador.contadorMovimiento = 0;
}

// ---- Mecánicas del juego ----

// Verifica si el jugador come un cristal en la posición dada.
export function procesarComer(juego, jugador, nuevaCabeza) {
    const idxCristal = juego.cristales.findIndex(c => c.x === nuevaCabeza.x && c.y === nuevaCabeza.y);
    if (idxCristal === -1) return false;
    const cristal = juego.cristales[idxCristal];
    const tipo = juego.tiposCristal[cristal.indiceTipo];
    jugador.puntos += tipo.valor;
    juego.cristales.splice(idxCristal, 1);
    agregarUnCristal(juego);
    if (!juego.esModoFacil) {
        jugador.velocidadActual = Math.min(
            jugador.velocidadActual + (tipo.demoraVelocidad || 0),
            VELOCIDAD_MAXIMA_MS);
    }
    return true;
}

// Verifica todas las causas de muerte para un jugador.
export function verificarMuerte(juego, jugador, nuevaCabeza) {
    const dentroDeBasePropia = estaDentroDeBase(nuevaCabeza, jugador.base);
    if (dentroDeBasePropia) return false;

    let murio = false;
    if (jugador.serpiente.colisionaConsigoMisma() || jugador.serpiente.estaFueraDeLimites()) murio = true;
    if (juego.esModoDificil && juego.paredes.some(p => p.x === nuevaCabeza.x && p.y === nuevaCabeza.y)) murio = true;

    for (const otro of juego.jugadores) {
        if (otro.socketId === jugador.socketId) continue;
        const cabezaOtro = otro.serpiente.cuerpo[0];
        const cuerpoOtro = otro.serpiente.cuerpo.slice(1);
        if (cuerpoOtro.some(s => s.x === nuevaCabeza.x && s.y === nuevaCabeza.y)) { murio = true; break; }
        if (cabezaOtro.x === nuevaCabeza.x && cabezaOtro.y === nuevaCabeza.y) { murio = true; otro._murioEsteTick = true; break; }
    }

    if (!murio && !juego.esModoFacil) {
        for (const otro of juego.jugadores) {
            if (otro.socketId === jugador.socketId) continue;
            if (estaDentroDeBase(nuevaCabeza, otro.base)) { murio = true; break; }
        }
    }

    return murio;
}

// Modo fácil: el dueño de la base puede matar intrusos si los toca.
export function procesarDefensaBase(juego, jugador, nuevaCabeza) {
    if (!juego.esModoFacil) return;
    for (const intruso of juego.jugadores) {
        if (intruso.socketId === jugador.socketId) continue;
        const cabezaIntruso = intruso.serpiente.cuerpo[0];
        if (estaDentroDeBase(cabezaIntruso, jugador.base)) {
            if (nuevaCabeza.x === cabezaIntruso.x && nuevaCabeza.y === cabezaIntruso.y) {
                intruso._murioEsteTick = true;
            }
        }
    }
}

// Auto-depósito: si al menos el 40% del cuerpo está dentro de la base, deposita los cristales.
export function procesarDeposito(juego, jugador) {
    const cuerpo = jugador.serpiente.cuerpo;
    const adentro = cuerpo.filter(s => estaDentroDeBase(s, jugador.base)).length;
    const umbral = Math.floor(cuerpo.length * 0.4);
    if (adentro < umbral || jugador.puntos <= 0) return;

    jugador.puntosDepositados += jugador.puntos;
    jugador.puntos = 0;
    const cab = jugador.serpiente.obtenerCabeza();
    const dir = jugador.serpiente.direccion;
    jugador.serpiente.cuerpo = [
        { x: cab.x, y: cab.y },
        { x: cab.x - dir.x, y: cab.y - dir.y },
        { x: cab.x - 2 * dir.x, y: cab.y - 2 * dir.y },
    ];
    jugador.velocidadActual = VELOCIDAD_INICIAL_MS;
    jugador.contadorMovimiento = 0;
    if (jugador.puntosDepositados >= juego.puntosParaCrecer) {
        hacerCrecerBase(jugador);
        jugador.puntosDepositados -= juego.puntosParaCrecer;
    }
}

// ---- Tick de un jugador ----

// Procesa un ciclo completo para un jugador: movimiento, comer, morir, depositar.
export function procesarTickJugador(juego, jugador) {
    jugador.contadorMovimiento += TICK_SERVIDOR_MS;
    if (jugador.contadorMovimiento < jugador.velocidadActual) return;
    jugador.contadorMovimiento = 0;

    jugador.serpiente.actualizarDireccion();
    const cabeza = jugador.serpiente.obtenerCabeza();
    const nuevaCabeza = { x: cabeza.x + jugador.serpiente.direccion.x, y: cabeza.y + jugador.serpiente.direccion.y };
    jugador.serpiente.cuerpo.unshift(nuevaCabeza);

    const comio = procesarComer(juego, jugador, nuevaCabeza);
    if (!comio) jugador.serpiente.cuerpo.pop();

    const murio = verificarMuerte(juego, jugador, nuevaCabeza);
    if (murio) { respawnJugador(jugador); return; }

    procesarDefensaBase(juego, jugador, nuevaCabeza);
    procesarDeposito(juego, jugador);
}

// ---- Game loop ----

// Bucle principal del juego. Se ejecuta cada TICK_SERVIDOR_MS (80ms).
export function bucleJuego(juego) {
    if (!juego.ejecutando) return;

    for (const jugador of juego.jugadores) procesarTickJugador(juego, jugador);

    // Procesar muertes marcadas de otros ticks (choque de cabezas, defensa en base)
    for (const jugador of juego.jugadores) {
        if (jugador._murioEsteTick) { jugador._murioEsteTick = false; respawnJugador(jugador); }
    }

    actualizarCicloParedes(juego);

    juego.tiempoRestante -= (TICK_SERVIDOR_MS / 1000);
    if (juego.tiempoRestante <= 0) juego.ejecutando = false;
}

// ---- Abandono de jugador durante la partida ----

// Elimina a un jugador de una partida activa (se desconectó).
// Si quedan 1 o 0 jugadores, termina la partida y devuelve el nombre del que salió.
export function eliminarJugadorDePartida(juego, socketId) {
   const idx = juego.jugadores.findIndex(j => j.socketId === socketId);
   if (idx === -1) return null;

   const jugadorEliminado = juego.jugadores[idx];
   juego.jugadores.splice(idx, 1);

   // Si era el único o quedó solo 1, terminar la partida
   if (juego.jugadores.length <= 1) {
      juego.ejecutando = false;
      return jugadorEliminado.nombre;
   }
   return null;
}

// ---- Envío de datos al cliente ----

// Arma el objeto JSON que se envía a cada cliente para que renderice su vista.
// Filtra cristales lejanos para reducir tráfico de red en celulares.
export function obtenerEstadoParaCliente(juego, socketIdJugador) {
    const jugador = juego.jugadores.find(j => j.socketId === socketIdJugador);
    const cabeza = jugador?.serpiente?.cuerpo?.[0] || { x: 0, y: 0 };

    // Solo enviar cristales que estén a 35 celdas o menos de este jugador
    const cristalesVisibles = juego.cristales.filter(c =>
        Math.abs(c.x - cabeza.x) <= 35 && Math.abs(c.y - cabeza.y) <= 35
    );

    return {
        idSala: juego.idSala,
        tamanioMapa: juego.tamanioMapa,
        jugadores: juego.jugadores.map(j => ({
            indice: j.indice, color: j.color, colorClaro: j.colorClaro,
            colorCabeza: j.colorCabeza,
            colorBase: j.colorBase, bordeBase: j.bordeBase,
            base: { x: j.base.x, y: j.base.y, ancho: j.base.ancho, alto: j.base.alto },
            cuerpo: j.serpiente.cuerpo, puntos: j.puntos, puntosDepositados: j.puntosDepositados,
            puntosParaCrecer: juego.puntosParaCrecer, nombre: j.nombre,
        })),
        cristales: cristalesVisibles,
        tiposCristal: juego.tiposCristal,
        paredes: juego.paredes || [],
        esModoDificil: juego.esModoDificil,
        parpadeoParedes: juego.parpadeoParedes || false,
        tiempoRestante: Math.max(0, Math.ceil(juego.tiempoRestante)),
        ejecutando: juego.ejecutando,
        miIndice: juego.jugadores.find(j => j.socketId === socketIdJugador)?.indice ?? 0,
    };
}

// Ordena los jugadores por tamaño de base (mayor primero).
export function obtenerRanking(juego) {
    return juego.jugadores
        .map(j => ({ nombre: j.nombre, tamanioBase: j.base.ancho * j.base.alto, color: j.color }))
        .sort((a, b) => b.tamanioBase - a.tamanioBase);
}