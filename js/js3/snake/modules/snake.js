/**
 * @file snake.js
 * @description Define la clase Snake encargada de mantener el estado físico,
 * el movimiento, la dirección y las colisiones de la serpiente dentro de la cuadrícula.
 */

import { DIRS } from './config.js';

export class Snake {
    /**
     * @constructor
     * @param {number} gridSize - El tamaño total de la cuadrícula de juego.
     * @description Inicializa la estructura de datos de la serpiente y establece su dirección.
     */
    constructor(gridSize = 100) {
        this.gridSize = gridSize;
        this.body = []; // Arreglo que almacena las coordenadas de cada segmento {x, y}
        this.direction = DIRS.RIGHT; // Dirección actual de movimiento
        this.nextDirection = DIRS.RIGHT; // Siguiente dirección programada para el próximo tick
        this.init();
    }

    /**
     * @method init
     * @description Posiciona la serpiente inicialmente en el centro de la cuadrícula
     * apuntando hacia la derecha, con un tamaño inicial de 3 segmentos.
     */
    init() {
        const center = Math.floor(this.gridSize / 2);
        this.body = [
            { x: center, y: center },     // Cabeza
            { x: center - 1, y: center }, // Cuerpo
            { x: center - 2, y: center }  // Cola
        ];
        this.direction = DIRS.RIGHT;
        this.nextDirection = DIRS.RIGHT;
    }

    /**
     * @method setDirection
     * @param {Object} newDir - Nuevo vector de dirección {x, y}
     * @description Intenta actualizar la dirección de movimiento planeada para el próximo tick.
     * @why Evita que la serpiente se mueva directamente en dirección opuesta (colisionar instantáneamente con su propio cuello).
     */
    setDirection(newDir) {
        // Si la nueva dirección es opuesta a la dirección actual en el eje X o Y, se descarta el cambio.
        if ((newDir.x === -this.direction.x && newDir.y === -this.direction.y)) return;
        this.nextDirection = newDir;
    }

    /**
     * @method updateDirection
     * @description Aplica de manera efectiva la dirección planeada al inicio de cada tick de juego.
     * @why Esto sincroniza la dirección de la serpiente justo antes de realizar el movimiento,
     * evitando problemas de "doble entrada" rápida en un solo ciclo de actualización del juego.
     */
    updateDirection() {
        this.direction = this.nextDirection;
    }

    /**
     * @method move
     * @param {boolean} grow - Si es verdadero, la serpiente crece un segmento al moverse.
     * @returns {Object} La nueva coordenada de la cabeza.
     * @description Mueve la serpiente insertando un nuevo segmento al inicio del cuerpo (la nueva cabeza)
     * basándose en la dirección actual. Si no debe crecer, se quita la cola.
     * @why Es un enfoque eficiente de O(1) para simular el movimiento sin tener que desplazar o recalcular
     * la posición de cada segmento del cuerpo.
     */
    move(grow = false) {
        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        // Añade la nueva cabeza al principio del array.
        this.body.unshift(newHead);
        // Si no crecemos, removemos el último segmento para simular el avance de la cola.
        if (!grow) this.body.pop();
        return newHead;
    }

    /**
     * @method getHead
     * @returns {Object} Coordenadas de la cabeza {x, y}.
     * @description Retorna el primer elemento del cuerpo de la serpiente.
     */
    getHead() {
        return this.body[0];
    }

    /**
     * @method collidesWithSelf
     * @returns {boolean} Verdadero si la cabeza choca con el cuerpo.
     * @description Comprueba si la cabeza comparte coordenadas con cualquiera de los segmentos restantes.
     */
    collidesWithSelf() {
        const head = this.body[0];
        // Compara las coordenadas de la cabeza con cada segmento del cuerpo posterior a ella.
        return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    /**
     * @method isOutOfBounds
     * @returns {boolean} Verdadero si la cabeza sale del tablero.
     * @description Comprueba si la cabeza está fuera de los límites de la cuadrícula actual.
     */
    isOutOfBounds() {
        const head = this.body[0];
        return head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize;
    }

    /**
     * @method getBody
     * @returns {Array} Array con todos los segmentos del cuerpo de la serpiente.
     * @description Retorna los datos de posición del cuerpo completo para ser renderizados.
     */
    getBody() {
        return this.body;
    }
}