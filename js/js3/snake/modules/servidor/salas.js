// ---------------------------------------------------------------
// salas.js - Manejo de salas de espera (crear, unirse, salir, listar).
// El array `salas` guarda todas las salas activas en memoria.
// ---------------------------------------------------------------

// Array con todas las salas de espera (cada sala tiene jugadores, dificultad, etc.)
export const salas = [];

// Devuelve solo las salas que todavía tienen lugar disponible, en formato seguro para el cliente.
export function listarSalas() {
    return salas
        .filter(s => s.jugadores.length < s.maxJugadores)
        .map(s => ({
            id: s.id,
            esPublica: s.esPublica,
            dificultad: s.dificultad,
            maxJugadores: s.maxJugadores,
            jugadoresActuales: s.jugadores.length,
        }));
}

// Crea una sala nueva con los datos enviados por el creador.
// Retorna el objeto sala recién creada.
export function crearSala(socketId, { isPublic, difficulty, maxPlayers, playerName }) {
    const sala = {
        id: socketId + '_' + Date.now(),
        codigo: isPublic ? null : generarCodigoSala(salas),
        esPublica: isPublic,
        dificultad: difficulty,
        maxJugadores: maxPlayers,
        jugadores: [socketId],
        nombresJugadores: [playerName || 'Jugador 1'],
        idCreador: socketId,
    };
    salas.push(sala);
    return sala;
}

// Intenta unir un jugador a una sala existente.
// Retorna `{ exito: false, error: 'mensaje' }` si falla, o `{ exito: true, sala }` si funciona.
export function unirseASala(socketId, { roomId, code, playerName }) {
    const sala = salas.find(s => s.id === roomId);
    if (!sala) return { exito: false, error: 'La sala ya no existe.' };
    if (sala.jugadores.length >= sala.maxJugadores) return { exito: false, error: 'La sala ya está llena.' };
    if (!sala.esPublica && sala.codigo !== code) return { exito: false, error: 'Código incorrecto.' };
    if (sala.jugadores.includes(socketId)) return { exito: false, error: 'Ya estás en esta sala.' };

    sala.jugadores.push(socketId);
    sala.nombresJugadores.push(playerName || 'Jugador ' + sala.jugadores.length);
    return { exito: true, sala };
}

// Saca a un jugador de una sala. Si la sala queda vacía, se elimina.
// Retorna los datos necesarios para notificar al resto.
export function salirDeSala(socketId, roomId) {
    const idx = salas.findIndex(s => s.id === roomId);
    if (idx === -1) return null;
    const sala = salas[idx];
    const idxJug = sala.jugadores.indexOf(socketId);
    if (idxJug === -1) return null;

    sala.jugadores.splice(idxJug, 1);
    sala.nombresJugadores.splice(idxJug, 1);

    // Si no queda nadie, eliminar la sala
    if (sala.jugadores.length === 0) {
        salas.splice(idx, 1);
        return { sala, eliminada: true };
    }
    return { sala, eliminada: false };
}

// Genera un código alfanumérico único de 6 caracteres (sin vocales para evitar palabras malsonantes).
export function generarCodigoSala(listaSalas) {
    const caracteres = 'BCDFGHJKLMNPQRSTVWXYZ23456789';
    let codigo;
    do {
        codigo = '';
        for (let i = 0; i < 6; i++) codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    } while (listaSalas.some(s => s.codigo === codigo));
    return codigo;
}