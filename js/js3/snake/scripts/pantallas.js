// ---------------------------------------------------------------
// pantallas.js - Navegación entre pantallas, formularios, lobby.
// Cada función maneja una pantalla o modal de la interfaz.
// ---------------------------------------------------------------

let socket, estado, elementos;

// Recibe las dependencias desde juego.js
export function inicializarPantallas(deps) {
    socket = deps.socket;
    estado = deps.estado;
    elementos = deps.elementos;
}

// ---- Navegación ----

export function mostrarInicio() {
    elementos.pantallaInicio.classList.remove('hidden');
    elementos.pantallaListaSalas.classList.add('hidden');
    elementos.pantallaCrearSala.classList.add('hidden');
    const contenedor = document.getElementById('gameContainer');
    if (contenedor) contenedor.style.display = 'none';
}

export function mostrarPedirNombre() {
    elementos.pantallaInicio.classList.add('hidden');
    elementos.modalNombre.classList.remove('hidden');
    elementos.inputNombre.value = '';
    elementos.errorNombre.classList.add('hidden');
    elementos.inputNombre.focus();
}

export function confirmarNombre() {
    const n = elementos.inputNombre.value.trim();
    if (!n) { elementos.errorNombre.classList.remove('hidden'); return; }
    estado.nombreJugador = n;
    elementos.modalNombre.classList.add('hidden');
    mostrarListaSalas();
}

export function mostrarListaSalas() {
    elementos.modalNombre.classList.add('hidden');
    elementos.pantallaCrearSala.classList.add('hidden');
    elementos.pantallaLobby.classList.add('hidden');
    elementos.pantallaListaSalas.classList.remove('hidden');
    resetearEstadoSala();
    socket.emit('request-rooms');
}

export function mostrarCrearSala() {
    elementos.pantallaListaSalas.classList.add('hidden');
    elementos.pantallaCrearSala.classList.remove('hidden');
    resetearFormularioSala();
}

// ---- Estado de sala ----

export function resetearEstadoSala() {
    estado.dificultadSeleccionada = null;
    estado.maxJugadores = 2;
    estado.salaEsPublica = true;
    estado.dificultadElegida = false;
    estado.jugadoresElegidos = false;
    estado.esCreador = false;
    estado.idSalaActual = null;
}

export function resetearFormularioSala() {
    resetearEstadoSala();
    if (elementos.botonCrearSala) elementos.botonCrearSala.disabled = true;
    document.querySelectorAll('#createRoomScreen .toggle-btn').forEach(b => b.classList.remove('active'));
    const pb = document.querySelector('#createRoomScreen .toggle-btn[data-room-type="public"]');
    if (pb) pb.classList.add('active');
    document.querySelectorAll('#createRoomScreen .diff-btn[data-diff]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#createRoomScreen .diff-btn[data-players]').forEach(b => b.classList.remove('active'));
}

// ---- Lista de salas ----

export function renderizarListaSalas(lista) {
    const div = document.getElementById('roomList');
    if (!lista || !lista.length) { div.innerHTML = '<p class="room-empty">No hay salas disponibles</p>'; return; }
    const etiquetas = { facil: '😊 Fácil', normal: '⚡ Normal', dificil: '💀 Difícil' };
    div.innerHTML = lista.map(s => {
        const dif = s.difficulty || s.dificultad || '';
        const pub = s.isPublic ?? s.esPublica;
        return `<div class="room-card">
         <div class="room-card-info">
            <span class="room-card-diff">${etiquetas[dif] || dif}</span>
            <span class="room-card-type">${pub ? '🌐' : '🔒'} ${pub ? 'Pública' : 'Privada'}</span>
            <span class="room-card-players">👥 ${s.currentPlayers ?? s.jugadoresActuales}/${s.maxPlayers ?? s.maxJugadores}</span>
         </div>
         <button class="room-card-join" data-room-id="${s.id}" data-room-public="${pub}">Unirse</button>
      </div>`;
    }).join('');
    div.querySelectorAll('.room-card-join').forEach(b => b.addEventListener('click', e => {
        const rid = e.currentTarget.dataset.roomId;
        const pub = e.currentTarget.dataset.roomPublic === 'true';
        if (pub) {
            estado.esCreador = false;
            socket.emit('join-room', { roomId: rid, code: null, playerName: estado.nombreJugador });
        } else {
            estado.idSalaPendiente = rid;
            elementos.inputCodigo.value = '';
            elementos.errorCodigo.classList.add('hidden');
            elementos.modalCodigo.classList.remove('hidden');
            elementos.inputCodigo.focus();
        }
    }));
}

// ---- Lobby ----

export function mostrarLobby(d) {
    estado.idSalaActual = d.roomId;
    estado.codigoSala = d.code;
    estado.maxJugadores = d.maxPlayers ?? d.maxJugadores;
    estado.salaEsPublica = d.isPublic ?? d.esPublica;
    elementos.spanMaxJugadoresLobby.textContent = estado.maxJugadores;
    elementos.spanJugadoresLobby.textContent = d.currentPlayers ?? d.jugadoresActuales;
    if (!estado.salaEsPublica && estado.codigoSala) {
        elementos.codigoLobby.textContent = estado.codigoSala;
        elementos.seccionCodigoLobby.classList.remove('hidden');
    } else {
        elementos.seccionCodigoLobby.classList.add('hidden');
    }
    actualizarBotonLobby();
    elementos.pantallaListaSalas.classList.add('hidden');
    elementos.pantallaCrearSala.classList.add('hidden');
    elementos.pantallaLobby.classList.remove('hidden');
}

export function actualizarBotonLobby() {
    elementos.botonIniciarPartida.disabled = !(estado.esCreador && parseInt(elementos.spanJugadoresLobby.textContent) >= estado.maxJugadores);
}

export function cancelarLobby() {
    socket.emit('leave-room', { roomId: estado.idSalaActual });
    elementos.pantallaLobby.classList.add('hidden');
    elementos.pantallaListaSalas.classList.remove('hidden');
    estado.idSalaActual = null;
    estado.codigoSala = null;
    estado.esCreador = false;
    socket.emit('request-rooms');
}

// ---- Modal código privado ----

export function confirmarCodigo() {
    const c = elementos.inputCodigo.value.trim().toUpperCase();
    if (!c) return;
    elementos.errorCodigo.classList.add('hidden');
    estado.esCreador = false;
    socket.emit('join-room', { roomId: estado.idSalaPendiente, code: c, playerName: estado.nombreJugador });
}

export function cancelarCodigo() {
    elementos.modalCodigo.classList.add('hidden');
    elementos.errorCodigo.classList.add('hidden');
    estado.idSalaPendiente = null;
}

// ---- Formulario crear sala ----

export function alternarTipoSala(t) {
    estado.salaEsPublica = (t === 'public');
    document.querySelectorAll('#createRoomScreen .toggle-btn').forEach(b => b.classList.toggle('active', b.dataset.roomType === t));
    verificarFormularioListo();
}

export function elegirDificultad(d) {
    estado.dificultadElegida = true;
    estado.dificultadSeleccionada = d;
    document.querySelectorAll('#createRoomScreen .diff-btn[data-diff]').forEach(b => b.classList.toggle('active', b.dataset.diff === d));
    verificarFormularioListo();
}

export function elegirCantidadJugadores(c) {
    estado.maxJugadores = c;
    estado.jugadoresElegidos = true;
    document.querySelectorAll('#createRoomScreen .diff-btn[data-players]').forEach(b => b.classList.toggle('active', parseInt(b.dataset.players) === c));
    verificarFormularioListo();
}

export function verificarFormularioListo() {
    elementos.botonCrearSala.disabled = !(estado.dificultadElegida && estado.jugadoresElegidos);
}

export function crearSala() {
    if (!estado.dificultadElegida || !estado.jugadoresElegidos) return;
    estado.esCreador = true;
    socket.emit('create-room', {
        isPublic: estado.salaEsPublica,
        difficulty: estado.dificultadSeleccionada,
        maxPlayers: estado.maxJugadores,
        playerName: estado.nombreJugador,
    });
}

export function iniciarPartidaDesdeLobby() {
    if (!estado.esCreador || parseInt(elementos.spanJugadoresLobby.textContent) < estado.maxJugadores) return;
    socket.emit('start-game', { roomId: estado.idSalaActual });
}

// Prepara la UI para la partida
export function comenzarInstanciaJuego(deps) {
    elementos.pantallaInicio.classList.add('hidden');
    elementos.pantallaListaSalas.classList.add('hidden');
    elementos.pantallaCrearSala.classList.add('hidden');
    elementos.pantallaLobby.classList.add('hidden');
    deps.contenedorJuego.style.display = 'block';
    if (deps.esMovil()) {
        deps.controlesMoviles.style.display = 'block';
        deps.botonTema.style.display = 'none';
    } else {
        deps.controlesMoviles.style.display = 'none';
        deps.botonTema.style.display = 'block';
    }
    setTimeout(deps.redimensionarCanvas, 50);
    window.addEventListener('resize', deps.redimensionarCanvas);
    deps.crearPanelInfo();
    estado.juegoActivo = true;
}
