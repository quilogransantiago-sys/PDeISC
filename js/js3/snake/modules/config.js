export const CELL_SIZE = 15;
export const INIT_SPEED_MS = 130;
export const MAX_SPEED_MS = 400;
export const DIRS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};
export const BASE_START_SIZE = 20;
export const BASE_GROWTH = 2;
export const TIMER_DURATION = 300;  // 5 minutos
export const BASE_EXCLUSION_MARGIN = 3;
export const MIN_DIST = 2;

// Modo fácil
export const CRYSTAL_TYPES_EASY = [
    { value: 1, color: '#aaaaaa', prob: 1, speedDelay: 0 }
];

// Modo normal
export const CRYSTAL_TYPES_NORMAL = [
    { value: 1, color: '#aaaaaa', prob: 0.7, speedDelay: 2 },
    { value: 5, color: '#ffffff', prob: 0.3, speedDelay: 10 }
];

// Modo difícil
export const CRYSTAL_TYPES_HARD = [
    { value: 1, color: '#aaaaaa', prob: 0.7, speedDelay: 2 },
    { value: 5, color: '#ffffff', prob: 0.25, speedDelay: 10 },
    { value: 15, color: '#ffd700', prob: 0.05, speedDelay: 30 }
];

export const CRYSTAL_TYPES = CRYSTAL_TYPES_NORMAL;

export const WALL_COUNT = 35;
export const WALL_DURATION = 5;