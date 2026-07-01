/**
 * snake.js - Clase Serpiente. Maneja el cuerpo, movimiento, dirección y colisiones.
 * Usada por el servidor para la lógica del juego.
 */
import { DIRECCIONES } from './config.js';

export class Serpiente {
    constructor(tamanioMapa = 100) {
        this.tamanioMapa = tamanioMapa;
        this.cuerpo = [];
        this.direccion = DIRECCIONES.DERECHA;
        this.siguienteDireccion = DIRECCIONES.DERECHA;
        this.inicializar();
    }

    // Posiciona la serpiente en el centro del mapa, mirando a la derecha, 3 segmentos.
    inicializar() {
        const centro = Math.floor(this.tamanioMapa / 2);
        this.cuerpo = [
            { x: centro, y: centro },
            { x: centro - 1, y: centro },
            { x: centro - 2, y: centro }
        ];
        this.direccion = DIRECCIONES.DERECHA;
        this.siguienteDireccion = DIRECCIONES.DERECHA;
    }

    // Intenta cambiar la dirección. Ignora si es la opuesta (evita chocar contra sí misma).
    establecerDireccion(nuevaDir) {
        if (nuevaDir.x === -this.direccion.x && nuevaDir.y === -this.direccion.y) return;
        this.siguienteDireccion = nuevaDir;
    }

    // Aplica la dirección pendiente al inicio de cada tick.
    actualizarDireccion() {
        this.direccion = this.siguienteDireccion;
    }

    // Mueve la serpiente: agrega nueva cabeza, quita cola si no crece.
    mover(crecer = false) {
        const cabeza = this.cuerpo[0];
        const nuevaCabeza = { x: cabeza.x + this.direccion.x, y: cabeza.y + this.direccion.y };
        this.cuerpo.unshift(nuevaCabeza);
        if (!crecer) this.cuerpo.pop();
        return nuevaCabeza;
    }

    obtenerCabeza() { return this.cuerpo[0]; }

    // Verdadero si la cabeza toca cualquier segmento del cuerpo.
    colisionaConsigoMisma() {
        const cabeza = this.cuerpo[0];
        return this.cuerpo.slice(1).some(s => s.x === cabeza.x && s.y === cabeza.y);
    }

    // Verdadero si la cabeza salió de los límites del mapa.
    estaFueraDeLimites() {
        const cabeza = this.cuerpo[0];
        return cabeza.x < 0 || cabeza.x >= this.tamanioMapa || cabeza.y < 0 || cabeza.y >= this.tamanioMapa;
    }

    obtenerCuerpo() { return this.cuerpo; }
}