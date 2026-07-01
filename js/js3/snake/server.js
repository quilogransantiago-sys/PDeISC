// ---------------------------------------------------------------
// server.js - Servidor Express + Socket.IO.
// Solo configura Express, sirve archivos estáticos y registra los
// eventos de Socket.IO delegando la lógica a los módulos.
// ---------------------------------------------------------------

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { DIRECCIONES, TICK_SERVIDOR_MS } from './modules/config.js';
import {
    salas, listarSalas, crearSala, unirseASala, salirDeSala,
} from './modules/servidor/salas.js';
import {
    partidas, crearEstadoJuego, bucleJuego,
    obtenerEstadoParaCliente, obtenerRanking,
    eliminarJugadorDePartida,
} from './modules/servidor/juego.js';

const dirActual = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const servidorHttp = createServer(app);
const io = new Server(servidorHttp, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const PUERTO = 3000;

// ---- Express: archivos estáticos y rutas ----

app.use('/styles', express.static(path.join(dirActual, 'styles')));
app.use('/scripts', express.static(path.join(dirActual, 'scripts')));
app.use('/modules', express.static(path.join(dirActual, 'modules')));
app.get('/', (req, res) => res.sendFile(path.join(dirActual, 'pages', 'index.html')));
app.get('/ip', (req, res) => {
    const interfaces = os.networkInterfaces();
    let ip = '127.0.0.1';
    const clavesWifi = ['wi-fi', 'wireless', 'wifi', 'inalámbrico', 'inalambrico', 'wlan'];

    // Buscar primero una interfaz Wi-Fi
    for (const nombre of Object.keys(interfaces)) {
        if (clavesWifi.some(clave => nombre.toLowerCase().includes(clave))) {
            for (const iface of interfaces[nombre]) {
                if (iface.family === 'IPv4' && !iface.internal) { ip = iface.address; break; }
            }
            if (ip !== '127.0.0.1') break;
        }
    }

    // Si no se encontró Wi-Fi, usar la primera IP no-interna
    if (ip === '127.0.0.1') {
        for (const nombre of Object.keys(interfaces)) {
            for (const iface of interfaces[nombre]) {
                if (iface.family === 'IPv4' && !iface.internal) { ip = iface.address; break; }
            }
            if (ip !== '127.0.0.1') break;
        }
    }

    res.json({ ip, port: PUERTO });
});

// ---- Socket.IO: eventos ----

function emitirListaSalas() { io.emit('rooms-updated', listarSalas()); }

io.on('connection', (socket) => {
    console.log('Jugador conectado:', socket.id);
    socket.emit('rooms-updated', listarSalas());

    // --- Lobby ---

    socket.on('create-room', (datos) => {
        const sala = crearSala(socket.id, datos);
        socket.join(sala.id);
        socket.emit('room-joined', {
            roomId: sala.id, code: sala.codigo, isPublic: sala.esPublica,
            maxPlayers: sala.maxJugadores, currentPlayers: sala.jugadores.length,
            difficulty: sala.dificultad, playerName: datos.playerName,
        });
        emitirListaSalas();
    });

    socket.on('join-room', (datos) => {
        const resultado = unirseASala(socket.id, datos);
        if (!resultado.exito) { socket.emit('error', resultado.error); return; }
        const sala = resultado.sala;
        socket.join(sala.id);
        socket.emit('room-joined', {
            roomId: sala.id, code: sala.codigo, isPublic: sala.esPublica,
            maxPlayers: sala.maxJugadores, currentPlayers: sala.jugadores.length,
            difficulty: sala.dificultad, playerName: datos.playerName,
        });
        io.to(sala.id).emit('player-count-update', {
            roomId: sala.id, currentPlayers: sala.jugadores.length, maxPlayers: sala.maxJugadores,
        });
        if (sala.jugadores.length >= sala.maxJugadores) emitirListaSalas();
    });

    socket.on('leave-room', (datos) => {
        const resultado = salirDeSala(socket.id, datos.roomId);
        if (!resultado) return;
        socket.leave(datos.roomId);
        if (!resultado.eliminada) {
            io.to(datos.roomId).emit('player-count-update', {
                roomId: resultado.sala.id,
                currentPlayers: resultado.sala.jugadores.length,
                maxPlayers: resultado.sala.maxJugadores,
            });
        }
        emitirListaSalas();
    });

    socket.on('request-rooms', () => socket.emit('rooms-updated', listarSalas()));

    // --- Partida ---

    socket.on('start-game', (datos) => {
        const sala = salas.find(s => s.id === datos.roomId);
        if (!sala || socket.id !== sala.idCreador || sala.jugadores.length < sala.maxJugadores) return;

        // Conteo regresivo de 3 segundos
        let cuenta = 3;
        io.to(datos.roomId).emit('game-countdown', { segundos: cuenta });
        const intervaloCuenta = setInterval(() => {
            cuenta--;
            if (cuenta <= 0) {
                clearInterval(intervaloCuenta);
                const juego = crearEstadoJuego(sala);
                partidas.set(datos.roomId, juego);
                io.to(datos.roomId).emit('game-starting', {
                    roomId: sala.id, difficulty: sala.dificultad, maxPlayers: sala.maxJugadores,
                });
                for (const jugador of juego.jugadores) {
                    io.to(jugador.socketId).emit('game-state', obtenerEstadoParaCliente(juego, jugador.socketId));
                }
                const intervaloJuego = setInterval(() => {
                    bucleJuego(juego);
                    if (!juego.ejecutando) {
                        clearInterval(intervaloJuego);
                        io.to(datos.roomId).emit('game-over', { roomId: datos.roomId, rankings: obtenerRanking(juego) });
                        partidas.delete(datos.roomId);
                        return;
                    }
                    for (const jugador of juego.jugadores) {
                        io.to(jugador.socketId).emit('game-state', obtenerEstadoParaCliente(juego, jugador.socketId));
                    }
                }, TICK_SERVIDOR_MS);
                const idx = salas.findIndex(s => s.id === datos.roomId);
                if (idx !== -1) salas.splice(idx, 1);
                emitirListaSalas();
            } else {
                io.to(datos.roomId).emit('game-countdown', { segundos: cuenta });
            }
        }, 1000);
    });

    // Input del jugador
    socket.on('player-input', (datos) => {
        const juego = partidas.get(datos.roomId);
        if (!juego || !juego.ejecutando) return;
        const jugador = juego.jugadores.find(j => j.socketId === socket.id);
        if (!jugador) return;
        const mapaDir = { up: DIRECCIONES.ARRIBA, down: DIRECCIONES.ABAJO, left: DIRECCIONES.IZQUIERDA, right: DIRECCIONES.DERECHA };
        const nuevaDir = mapaDir[datos.dir];
        if (nuevaDir && !(nuevaDir.x === -jugador.serpiente.direccion.x && nuevaDir.y === -jugador.serpiente.direccion.y)) {
            jugador.serpiente.siguienteDireccion = nuevaDir;
        }
    });

    // Desconexión
    socket.on('disconnect', () => {
        console.log('Jugador desconectado:', socket.id);

        // Revisar si estaba en una partida activa
        for (const [roomId, juego] of partidas) {
            const nombreAbandono = eliminarJugadorDePartida(juego, socket.id);
            if (nombreAbandono) {
                // La partida terminó porque este jugador se fue
                const rankings = obtenerRanking(juego);
                io.to(roomId).emit('game-over', {
                    roomId,
                    rankings,
                    motivo: nombreAbandono + ' abandonó la partida',
                });
                partidas.delete(roomId);
            }
        }

        // Limpiar salas del lobby
        for (let i = salas.length - 1; i >= 0; i--) {
            const sala = salas[i];
            const idx = sala.jugadores.indexOf(socket.id);
            if (idx !== -1) {
                sala.jugadores.splice(idx, 1);
                sala.nombresJugadores.splice(idx, 1);
                socket.leave(sala.id);
                if (sala.jugadores.length === 0) salas.splice(i, 1);
                else io.to(sala.id).emit('player-count-update', { roomId: sala.id, currentPlayers: sala.jugadores.length, maxPlayers: sala.maxJugadores });
            }
        }
        emitirListaSalas();
    });
});

servidorHttp.listen(PUERTO, () => console.log('Servidor en http://localhost:' + PUERTO));