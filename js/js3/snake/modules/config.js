/**
 * config.js - Constantes y configuración del juego Snake Multijugador.
 */

// Tamaño de cada celda en píxeles (escala visual del canvas)
export const TAMANIO_CELDA = 25;

// Intervalo inicial de movimiento en ms (menor = más rápido)
export const VELOCIDAD_INICIAL_MS = 85;

// Máxima ralentización posible al acumular cristales
export const VELOCIDAD_MAXIMA_MS = 350;

// Vectores de dirección 2D
export const DIRECCIONES = {
   ARRIBA: { x: 0, y: -1 },
   ABAJO: { x: 0, y: 1 },
   IZQUIERDA: { x: -1, y: 0 },
   DERECHA: { x: 1, y: 0 }
};

// Tamaño inicial de la base (lado en celdas)
export const TAMANIO_BASE_INICIAL = 20;

// Celdas que crece la base por cada depósito exitoso
export const CRECIMIENTO_BASE = 2;

// Duración de la partida en segundos (5 minutos)
export const DURACION_PARTIDA = 180;

// Margen alrededor de bases donde no se generan cristales ni obstáculos
export const MARGEN_EXCLUSION_BASE = 3;

// Distancia mínima entre cristales para evitar amontonamiento
export const DISTANCIA_MINIMA = 2;

// Tipos de cristal por dificultad: { valor, color, prob, demoraVelocidad }
export const TIPOS_CRISTAL_FACIL = [{ valor: 1, color: '#aaaaaa', prob: 1, demoraVelocidad: 0 }];
export const TIPOS_CRISTAL_NORMAL = [
   { valor: 1, color: '#aaaaaa', prob: 0.8, demoraVelocidad: 2 },
   { valor: 5, color: '#ffffff', prob: 0.2, demoraVelocidad: 10 }
];
export const TIPOS_CRISTAL_DIFICIL = [
   { valor: 1, color: '#aaaaaa', prob: 0.8, demoraVelocidad: 2 },
   { valor: 5, color: '#ffffff', prob: 0.18, demoraVelocidad: 10 },
   { valor: 15, color: '#ffd700', prob: 0.02, demoraVelocidad: 30 }
];

export const TIPOS_CRISTAL = TIPOS_CRISTAL_NORMAL;
export const CANTIDAD_PAREDES = 100;
export const CICLO_PAREDES_MS = 3800;
export const PARPADEO_PAREDES_MS = 1500;

// Colores por jugador: cabeza (oscura), cuerpo, cuerpo claro, base, borde base
export const COLORES_JUGADOR_CABEZA = ['#1a5e32', '#a93226', '#1a5276', '#b9770e'];
export const COLORES_JUGADOR = ['#27ae60', '#e74c3c', '#3498db', '#f39c12'];
export const COLORES_JUGADOR_CLARO = ['#2ecc71', '#e74c3c', '#5dade2', '#f5b041'];
export const COLORES_BASE_JUGADOR = ['rgba(46,204,113,0.2)', 'rgba(231,76,60,0.2)', 'rgba(52,152,219,0.2)', 'rgba(243,156,18,0.2)'];
export const BORDES_BASE_JUGADOR = ['#2ecc71', '#e74c3c', '#3498db', '#f39c12'];

// Devuelve la posición (x, y) de la base según el índice del jugador (0-3 = 4 esquinas)
export function obtenerPosicionBase(indiceJugador, tamanioMapa, tamanioBase) {
   const margen = 0;
   switch (indiceJugador) {
      case 0: return { x: margen, y: margen };
      case 1: return { x: tamanioMapa - tamanioBase - margen, y: margen };
      case 2: return { x: margen, y: tamanioMapa - tamanioBase - margen };
      case 3: return { x: tamanioMapa - tamanioBase - margen, y: tamanioMapa - tamanioBase - margen };
      default: return { x: margen, y: margen };
   }
}

// Dirección inicial al spawnear, según la esquina donde nace
export function obtenerDireccionSpawn(indiceJugador) {
   switch (indiceJugador) {
      case 0: return DIRECCIONES.DERECHA;   // sup-izq
      case 1: return DIRECCIONES.IZQUIERDA; // sup-der
      case 2: return DIRECCIONES.DERECHA;   // inf-izq
      case 3: return DIRECCIONES.IZQUIERDA; // inf-der
      default: return DIRECCIONES.DERECHA;
   }
}

// Cada cuántos ms corre el game loop del servidor (80ms = 12.5 tick/seg)
export const TICK_SERVIDOR_MS = 150;
