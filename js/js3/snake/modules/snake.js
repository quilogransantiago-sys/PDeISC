import { DIRS } from './config.js';

export class Snake {
    constructor(gridSize = 100) {
        this.gridSize = gridSize;
        this.body = [];
        this.direction = DIRS.RIGHT;
        this.nextDirection = DIRS.RIGHT;
        this.init();
    }

    init() {
        const center = Math.floor(this.gridSize / 2);
        this.body = [
            { x: center, y: center },
            { x: center - 1, y: center },
            { x: center - 2, y: center }
        ];
        this.direction = DIRS.RIGHT;
        this.nextDirection = DIRS.RIGHT;
    }

    setDirection(newDir) {
        if ((newDir.x === -this.direction.x && newDir.y === -this.direction.y)) return;
        this.nextDirection = newDir;
    }

    updateDirection() {
        this.direction = this.nextDirection;
    }

    move(grow = false) {
        const head = this.body[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        this.body.unshift(newHead);
        if (!grow) this.body.pop();
        return newHead;
    }

    getHead() {
        return this.body[0];
    }

    collidesWithSelf() {
        const head = this.body[0];
        return this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    isOutOfBounds() {
        const head = this.body[0];
        return head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize;
    }

    getBody() {
        return this.body;
    }
}