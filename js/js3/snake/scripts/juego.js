// ---------------------------------------------------------------
// juego.js - Punto de entrada del cliente.
// Conecta Socket.IO, mantiene el estado global, y conecta los
// módulos de pantallas, renderizado y ranking.
// ---------------------------------------------------------------

import { io } from 'https://cdn.socket.io/4.8.3/socket.io.esm.min.js';
import * as Pantallas from './pantallas.js';
import * as Render from './renderizado.js';
import * as Ranking from './ranking.js';

// ---- Conexión con el servidor ----
var socket = io();

// ---- Elementos del DOM ----
var elementos = {
    pantallaInicio: document.getElementById('startScreen'),
    pantallaListaSalas: document.getElementById('roomListScreen'),
    pantallaCrearSala: document.getElementById('createRoomScreen'),
    pantallaLobby: document.getElementById('lobbyScreen'),
    botonCrearSala: document.getElementById('createRoomBtn'),
    botonIniciarPartida: document.getElementById('startGameBtn'),
    botonTema: document.getElementById('themeToggle'),
    botonTemaInicio: document.getElementById('themeToggleStart'),
    controlesMoviles: document.getElementById('mobileControls'),
    contenedorJuego: document.getElementById('gameContainer'),
    pantallaConteo: document.getElementById('countdownScreen'),
    numeroConteo: document.getElementById('countdownNumber'),
    pantallaFin: document.getElementById('endScreen'),
    spanJugadoresLobby: document.getElementById('lobbyPlayerCount'),
    spanMaxJugadoresLobby: document.getElementById('lobbyMaxPlayers'),
    codigoLobby: document.getElementById('lobbyRoomCode'),
    seccionCodigoLobby: document.getElementById('lobbyRoomCodeSection'),
    modalNombre: document.getElementById('namePromptModal'),
    inputNombre: document.getElementById('namePromptInput'),
    errorNombre: document.getElementById('namePromptError'),
    modalCodigo: document.getElementById('joinCodeModal'),
    inputCodigo: document.getElementById('joinCodeInput'),
    errorCodigo: document.getElementById('joinCodeError'),
};

// ---- Estado global del cliente ----
var estado = {
    nombreJugador: null,
    dificultadSeleccionada: null,
    maxJugadores: 2,
    salaEsPublica: true,
    idSalaActual: null,
    codigoSala: null,
    dificultadElegida: false,
    jugadoresElegidos: false,
    esCreador: false,
    idSalaPendiente: null,
    juegoActivo: false,
    miIndice: 0,
    estadoJuego: null,
    divInfo: null,
};

// ---- Funciones auxiliares ----

// Detecta si el dispositivo es un celular por el ancho de pantalla.
function esMovil() {
    return window.innerWidth <= 768;
}

// ---- Tema claro / oscuro ----

// Alterna entre modo claro y oscuro, guarda la preferencia.
function alternarTema() {
    document.documentElement.classList.toggle('dark');
    var oscuro = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', oscuro);
    elementos.botonTema.textContent = oscuro ? '☀️' : '🌓';
    elementos.botonTemaInicio.textContent = oscuro ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    Render.dibujar(estado.estadoJuego, estado.miIndice);
}

// Lee el tema guardado y lo aplica al cargar la página.
function inicializarTema() {
    var oscuro = localStorage.getItem('darkMode') === 'true';
    if (oscuro) document.documentElement.classList.add('dark');
    elementos.botonTema.textContent = oscuro ? '☀️' : '🌓';
    elementos.botonTemaInicio.textContent = oscuro ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    elementos.botonTema.addEventListener('click', alternarTema);
    elementos.botonTemaInicio.addEventListener('click', alternarTema);
}

// ---- Controles del jugador ----

// Convierte una tecla presionada en una dirección y la envía al servidor.
function manejarTecla(e) {
    if (!estado.juegoActivo || !estado.idSalaActual) return;
    var dir = null;
    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': dir = 'up'; break;
        case 'ArrowDown': case 's': case 'S': dir = 'down'; break;
        case 'ArrowLeft': case 'a': case 'A': dir = 'left'; break;
        case 'ArrowRight': case 'd': case 'D': dir = 'right'; break;
        default: return;
    }
    e.preventDefault();
    socket.emit('player-input', { roomId: estado.idSalaActual, dir: dir });
}

// Activa los botones táctiles de dirección en dispositivos móviles.
function configurarControlesMoviles() {
    var botones = elementos.controlesMoviles.querySelectorAll('.ctrl-btn');
    for (var i = 0; i < botones.length; i++) {
        var boton = botones[i];
        var dir = boton.dataset.dir;
        var presionar = function (e) {
            e.preventDefault();
            if (dir && estado.juegoActivo && estado.idSalaActual) {
                socket.emit('player-input', { roomId: estado.idSalaActual, dir: dir });
            }
        };
        boton.addEventListener('touchstart', presionar);
        boton.addEventListener('mousedown', presionar);
    }
}

// ---- Manejadores de mensajes del servidor (Socket.IO) ----

// El servidor envía la lista de salas actualizada.
function alRecibirListaSalas(lista) {
    Pantallas.renderizarListaSalas(lista);
}

// El jugador se unió a una sala correctamente.
function alUnirseASala(datos) {
    Pantallas.mostrarLobby(datos);
}

// Cambió la cantidad de jugadores en el lobby.
function alActualizarConteo(datos) {
    estado.maxJugadores = datos.maxPlayers || datos.maxJugadores;
    elementos.spanJugadoresLobby.textContent = datos.currentPlayers || datos.jugadoresActuales;
    elementos.spanMaxJugadoresLobby.textContent = estado.maxJugadores;
    Pantallas.actualizarBotonLobby();
}

// El servidor informa un error (ej: código de sala incorrecto).
function alRecibirError() {
    if (estado.idSalaPendiente) {
        elementos.errorCodigo.classList.remove('hidden');
    }
}

// Conteo regresivo de 3, 2, 1 antes de iniciar.
function alConteoRegresivo(datos) {
    elementos.pantallaConteo.classList.remove('hidden');
    elementos.numeroConteo.textContent = datos.segundos;
    if (datos.segundos <= 0) {
        elementos.pantallaConteo.classList.add('hidden');
    }
}

// El conteo terminó, arranca la partida.
function alIniciarPartida(datos) {
    elementos.pantallaConteo.classList.add('hidden');
    estado.idSalaActual = datos.roomId;
    Pantallas.comenzarInstanciaJuego({
        contenedorJuego: elementos.contenedorJuego,
        esMovil: esMovil,
        controlesMoviles: elementos.controlesMoviles,
        botonTema: elementos.botonTema,
        redimensionarCanvas: Render.redimensionarCanvas,
        crearPanelInfo: function () {
            estado.divInfo = Render.crearPanelInfo();
        },
    });
}

// El servidor manda el estado del juego para renderizar.
function alRecibirEstado(datos) {
    estado.estadoJuego = datos;
    estado.miIndice = datos.miIndice || datos.myIndex || 0;
    Render.actualizarPanelInfo(estado.divInfo, estado.estadoJuego, estado.miIndice);
    Render.dibujar(estado.estadoJuego, estado.miIndice);
}

// Terminó la partida: mostrar ranking o mensaje de abandono.
function alTerminarPartida(datos) {
    estado.juegoActivo = false;
    if (datos && datos.motivo) {
        Ranking.mostrarMensajeFin(datos.motivo);
    } else if (datos && datos.rankings) {
        Ranking.mostrarRankingFinal(datos.rankings);
        Ranking.guardarRankingEnHistorial(datos.rankings);
    }
    elementos.pantallaFin.classList.remove('hidden');
}

// ---- Funciones de ayuda para eventos de botones ----

// Vuelve de la lista de salas a la pantalla de inicio.
function volverAlInicio() {
    elementos.pantallaListaSalas.classList.add('hidden');
    elementos.pantallaInicio.classList.remove('hidden');
}

// Oculta la pantalla de fin y vuelve al inicio.
function cerrarPantallaFin() {
    elementos.pantallaFin.classList.add('hidden');
    Pantallas.mostrarInicio();
}

// Cierra el modal de nombre si se hace clic fuera de él.
function cerrarModalNombreSiClickFuera(e) {
    if (e.target === elementos.modalNombre) {
        elementos.modalNombre.classList.add('hidden');
    }
}

// Cierra el modal de código si se hace clic fuera de él.
function cerrarModalCodigoSiClickFuera(e) {
    if (e.target === elementos.modalCodigo) {
        Pantallas.cancelarCodigo();
    }
}

// Confirma el nombre si se presiona Enter en el input.
function confirmarNombreConEnter(e) {
    if (e.key === 'Enter') Pantallas.confirmarNombre();
}

// Confirma el código si se presiona Enter en el input.
function confirmarCodigoConEnter(e) {
    if (e.key === 'Enter') Pantallas.confirmarCodigo();
}

// Muestra el historial de partidas guardadas.
function mostrarHistorial() {
    Ranking.mostrarHistorial();
    elementos.pantallaFin.classList.remove('hidden');
}

// ---- Registro de todos los eventos ----

// Conecta cada botón e interacción del HTML con su función correspondiente.
function registrarEventos() {

    // --- Eventos del servidor (Socket.IO) ---
    socket.on('rooms-updated', alRecibirListaSalas);
    socket.on('room-joined', alUnirseASala);
    socket.on('player-count-update', alActualizarConteo);
    socket.on('error', alRecibirError);
    socket.on('game-countdown', alConteoRegresivo);
    socket.on('game-starting', alIniciarPartida);
    socket.on('game-state', alRecibirEstado);
    socket.on('game-over', alTerminarPartida);

    // --- Pantalla de inicio ---
    document.getElementById('playBtn').addEventListener('click', Pantallas.mostrarPedirNombre);
    document.getElementById('historialBtn').addEventListener('click', mostrarHistorial);

    // --- Modal de nombre ---
    document.getElementById('namePromptConfirmBtn').addEventListener('click', Pantallas.confirmarNombre);
    elementos.inputNombre.addEventListener('keydown', confirmarNombreConEnter);
    elementos.modalNombre.addEventListener('click', cerrarModalNombreSiClickFuera);

    // --- Lista de salas ---
    document.getElementById('goCreateRoomBtn').addEventListener('click', Pantallas.mostrarCrearSala);
    document.getElementById('fabCreateRoom').addEventListener('click', Pantallas.mostrarCrearSala);
    document.getElementById('backFromListBtn').addEventListener('click', volverAlInicio);

    // --- Crear sala ---
    document.getElementById('backFromCreateBtn').addEventListener('click', Pantallas.mostrarListaSalas);

    var botonesToggle = document.querySelectorAll('#createRoomScreen .toggle-btn');
    for (var i = 0; i < botonesToggle.length; i++) {
        botonesToggle[i].addEventListener('click', function (e) {
            Pantallas.alternarTipoSala(e.currentTarget.dataset.roomType);
        });
    }

    var botonesDificultad = document.querySelectorAll('#createRoomScreen .diff-btn[data-diff]');
    for (var j = 0; j < botonesDificultad.length; j++) {
        botonesDificultad[j].addEventListener('click', function (e) {
            Pantallas.elegirDificultad(e.currentTarget.dataset.diff);
        });
    }

    var botonesJugadores = document.querySelectorAll('#createRoomScreen .diff-btn[data-players]');
    for (var k = 0; k < botonesJugadores.length; k++) {
        botonesJugadores[k].addEventListener('click', function (e) {
            Pantallas.elegirCantidadJugadores(parseInt(e.currentTarget.dataset.players));
        });
    }

    elementos.botonCrearSala.addEventListener('click', Pantallas.crearSala);

    // --- Lobby ---
    document.getElementById('cancelLobbyBtn').addEventListener('click', Pantallas.cancelarLobby);
    elementos.botonIniciarPartida.addEventListener('click', Pantallas.iniciarPartidaDesdeLobby);

    // --- Modal de código privado ---
    document.getElementById('joinCodeConfirmBtn').addEventListener('click', Pantallas.confirmarCodigo);
    document.getElementById('joinCodeCancelBtn').addEventListener('click', Pantallas.cancelarCodigo);
    elementos.inputCodigo.addEventListener('keydown', confirmarCodigoConEnter);
    elementos.modalCodigo.addEventListener('click', cerrarModalCodigoSiClickFuera);

    // --- Pantalla de fin ---
    document.getElementById('goHomeBtn').addEventListener('click', cerrarPantallaFin);
}

// ---- Inicio de la aplicación ----

// Al cargar la página: tema, pantalla inicial, controles y detección de IP.
window.addEventListener('load', function () {
    inicializarTema();
    Pantallas.mostrarInicio();
    window.addEventListener('keydown', manejarTecla);
    configurarControlesMoviles();
    window.addEventListener('resize', function () {
        if (elementos.contenedorJuego.style.display !== 'none') {
            Render.redimensionarCanvas();
        }
    });

    // Mostrar la IP del servidor en pantalla para conexiones en red local.
    fetch('/ip')
        .then(function (r) { return r.json(); })
        .then(function (datos) {
            var ip = document.getElementById('serverIpDisplay');
            if (ip && datos.ip !== '127.0.0.1') {
                ip.textContent = '📡 Servidor: http://' + datos.ip + ':' + datos.port;
            }
        })
        .catch(function () { });
});

// Inicializar el módulo de pantallas y conectar eventos.
Pantallas.inicializarPantallas({ socket: socket, estado: estado, elementos: elementos });
registrarEventos();