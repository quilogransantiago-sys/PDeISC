/**
 * @file config.js
 * @description Módulo de configuración centralizada que define todas las constantes físicas,
 * de temporización y de comportamiento para el juego de Snake.
 */

// Tamaño de cada celda del tablero de juego en píxeles. Define la escala visual en el canvas.
export const CELL_SIZE = 15;

// Intervalo de actualización inicial del juego en milisegundos (un valor menor hace que el juego vaya más rápido).
export const INIT_SPEED_MS = 135;

// Límite máximo para el intervalo de actualización de la serpiente (400ms).
// Evita que la serpiente se mueva ridículamente lento tras recolectar muchos cristales.
export const MAX_SPEED_MS = 400;

// Definición de los vectores de dirección 2D del juego.
// UP: disminuye y (arriba), DOWN: aumenta y (abajo), LEFT: disminuye x (izquierda), RIGHT: aumenta x (derecha).
export const DIRS = {
   UP: { x: 0, y: -1 },
   DOWN: { x: 0, y: 1 },
   LEFT: { x: -1, y: 0 },
   RIGHT: { x: 1, y: 0 }
};

// Tamaño inicial en celdas (lado) de la base cuadrada segura de la serpiente.
export const BASE_START_SIZE = 20;

// Cantidad de celdas que crece la base (ancho y alto) cada vez que se canjean suficientes puntos.
export const BASE_GROWTH = 2;

// Duración total de cada partida en segundos (300 segundos = 5 minutos).
export const TIMER_DURATION = 300;

// Margen de celdas alrededor de la base donde está prohibido generar cristales u obstáculos.
// Esto garantiza que el jugador tenga espacio libre al salir y entrar de su base.
export const BASE_EXCLUSION_MARGIN = 3;

// Distancia mínima de Manhattan (en celdas) permitida entre cristales para evitar que se solapen o amontonen.
export const MIN_DIST = 2;

/**
 * Configuración de Cristales por Dificultad
 * - value: Puntos que otorga el cristal al ser recolectado y depositado.
 * - color: Color con el que se dibuja el cristal (en modo oscuro y claro).
 * - prob: Probabilidad de aparición del cristal.
 * - speedDelay: Retardo en milisegundos que se suma al intervalo tick actual (`currentSpeed`).
 *   @why Aumentar el retardo ralentiza la velocidad de la serpiente. Esta es una decisión de diseño
 *   para contrarrestar el aumento de longitud de la serpiente, facilitando el control a medida que crece.
 */

// Modo fácil: Un solo tipo de cristal común que no ralentiza la serpiente.
export const CRYSTAL_TYPES_EASY = [
   { value: 1, color: '#aaaaaa', prob: 1, speedDelay: 0 }
];

// Modo normal: Cristales normales de valor 1, y cristales raros de valor 5 que ralentizan un poco (+10ms).
export const CRYSTAL_TYPES_NORMAL = [
   { value: 1, color: '#aaaaaa', prob: 0.8, speedDelay: 2 },
   { value: 5, color: '#ffffff', prob: 0.2, speedDelay: 10 }
];

// Modo difícil: Incluye cristales legendarios dorados de valor 15 que otorgan gran ralentización (+30ms) pero tienen baja probabilidad.
export const CRYSTAL_TYPES_HARD = [
   { value: 1, color: '#aaaaaa', prob: 0.8, speedDelay: 2 },
   { value: 5, color: '#ffffff', prob: 0.18, speedDelay: 10 },
   { value: 15, color: '#ffd700', prob: 0.02, speedDelay: 30 }
];

// Tipo de cristal activo por defecto (será sobreescrito dinámicamente al seleccionar dificultad).
export const CRYSTAL_TYPES = CRYSTAL_TYPES_NORMAL;

// Cantidad máxima de paredes destructibles activas en el mapa en el modo difícil.
export const WALL_COUNT = 50;

// Duración en segundos de cada pared antes de desaparecer y reaparecer en una nueva celda libre del tablero.
export const WALL_DURATION = 5;