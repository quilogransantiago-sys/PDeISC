import { CELL_SIZE, INIT_SPEED_MS, MAX_SPEED_MS, DIRS, BASE_START_SIZE, BASE_GROWTH, TIMER_DURATION, BASE_EXCLUSION_MARGIN, MIN_DIST, CRYSTAL_TYPES_NORMAL, CRYSTAL_TYPES_HARD, WALL_COUNT, WALL_DURATION } from '../modules/config.js';
import { Snake } from '../modules/snake.js';

// --- Elementos DOM ---
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimapCanvas');
const minimapCtx = minimapCanvas.getContext('2d');
const themeToggle = document.getElementById('themeToggle');
const themeToggleStart = document.getElementById('themeToggleStart');
const startScreen = document.getElementById('startScreen');
const playBtn = document.getElementById('playBtn');
const gameContainer = document.getElementById('gameContainer');
const difficultyModal = document.getElementById('difficultyModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const diffBtns = document.querySelectorAll('.diff-btn');
const mobileControls = document.getElementById('mobileControls');
const endScreen = document.getElementById('endScreen');
const goHomeBtn = document.getElementById('goHomeBtn');

// --- Variables de dificultad ---
let currentGridSize = 100;
let currentNumCrystals = 180;
let currentPointsToGrow = 35;
let currentCrystalTypes = CRYSTAL_TYPES_NORMAL;
let isEasyMode = false;
let isHardMode = false;
let selectedDifficulty = null;

// --- Estado del juego ---
let snake = null;
let crystals = [];
let walls = [];
let wallIntervals = [];
let points = 0; // Puntos temporales que lleva la serpiente (sin depositar en la base)
let storedPoints = 0; // Puntos depositados en la base
let totalScore = 0;
let currentSpeed = INIT_SPEED_MS;
let gameInterval = null;
let gameRunning = false;

// Coordenadas y dimensiones de la base segura de la serpiente
let baseX = 0, baseY = 0;
let baseW = BASE_START_SIZE;
let baseH = BASE_START_SIZE;

let timeLeft = TIMER_DURATION;
let timerInterval = null;
let infoDiv = null;

/**
 * Detecta si el dispositivo es móvil en base al ancho de pantalla.
 * @returns {boolean}
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Crea dinámicamente un panel flotante de estadísticas en la interfaz de usuario.
 * @why Evita tener elementos HTML estáticos flotando en la pantalla de inicio del juego.
 */
function createInfoDiv() {
    infoDiv = document.createElement('div');
    infoDiv.id = 'infoDiv';
    infoDiv.style.position = 'absolute';
    infoDiv.style.top = '10px';
    infoDiv.style.backgroundColor = 'rgba(0,0,0,0.6)';
    infoDiv.style.color = 'white';
    infoDiv.style.padding = '6px 12px';
    infoDiv.style.borderRadius = '8px';
    infoDiv.style.fontFamily = 'monospace';
    infoDiv.style.fontSize = '13px';
    infoDiv.style.zIndex = '10';
    infoDiv.style.pointerEvents = 'none'; // Evita capturar clics que deberían ir al juego
    document.getElementById('gameArea').appendChild(infoDiv);
}

/**
 * Actualiza la información y estadísticas mostradas en tiempo real en la pantalla.
 * Incluye tiempo restante, cristales actuales/depositados, longitud, tamaño de la base y paredes en modo difícil.
 */
function updateUI() {
    if (!infoDiv) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    let wallsInfo = '';
    
    // Si estamos en modo difícil, muestra el número de paredes activas y el temporizador más corto de desaparición
    if (isHardMode) {
        if (walls.length > 0) {
            let minTimer = Infinity;
            for (const w of walls) {
                if (w.timer < minTimer) minTimer = w.timer;
            }
            wallsInfo = `| 🧱 ${walls.length} (próxima ${Math.ceil(minTimer)}s)`;
        } else {
            wallsInfo = `| 🧱 0`;
        }
    }
    infoDiv.innerHTML = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}<br>💎 ${points} | 🏦 ${storedPoints}/${currentPointsToGrow}<br>🐍 ${snake.getBody().length} | 🏠 ${baseW}x${baseH} ${wallsInfo}`;
}

// --- Geometría y colisiones ---

/**
 * Verifica si una coordenada dada (celda) se encuentra dentro de la base segura de la serpiente.
 * @param {Object} cell - Coordenada {x, y}.
 * @returns {boolean}
 */
function isInsideBase(cell) {
    return cell.x >= baseX && cell.x < baseX + baseW && cell.y >= baseY && cell.y < baseY + baseH;
}

/**
 * Determina si una coordenada {x, y} se encuentra en la zona restringida de la base.
 * @param {number} x - Eje X.
 * @param {number} y - Eje Y.
 * @returns {boolean}
 * @why Añade un margen de seguridad (`BASE_EXCLUSION_MARGIN`) alrededor de la base para evitar que
 * se generen cristales o paredes bloqueando las inmediaciones o la salida de la base.
 */
function isForbiddenZone(x, y) {
    const margin = BASE_EXCLUSION_MARGIN;
    const minX = baseX - margin;
    const maxX = baseX + baseW + margin - 1;
    const minY = baseY - margin;
    const maxY = baseY + baseH + margin - 1;
    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
}

/**
 * Obtiene todas las celdas del mapa que no están ocupadas por el cuerpo de la serpiente ni la zona de exclusión de la base.
 * @param {boolean} forbiddenWalls - Si es verdadero, descarta también las celdas donde hay obstáculos de pared.
 * @returns {Array} Listado de celdas libres {x, y}.
 */
function getFreeCells(forbiddenWalls = false) {
    const snakeBody = snake.getBody();
    const free = [];
    for (let y = 0; y < currentGridSize; y++) {
        for (let x = 0; x < currentGridSize; x++) {
            if (!snakeBody.some(seg => seg.x === x && seg.y === y) && !isForbiddenZone(x, y)) {
                if (forbiddenWalls && walls.some(w => w.x === x && w.y === y)) continue;
                free.push({ x, y });
            }
        }
    }
    return free;
}

/**
 * Posiciona y orienta la serpiente de manera segura dentro de la base segura al iniciar o tras morir.
 */
function resetSnakeInsideBase() {
    let centerX = baseX + Math.floor(baseW / 2);
    let centerY = baseY + Math.floor(baseH / 2);
    const newSnake = new Snake(currentGridSize);
    newSnake.body = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
    ];
    // Asegurar que toda la serpiente inicial esté contenida dentro de los límites físicos de la base actual
    for (let seg of newSnake.body) {
        if (!isInsideBase(seg)) {
            newSnake.body = [
                { x: baseX + 2, y: baseY + 2 },
                { x: baseX + 1, y: baseY + 2 },
                { x: baseX, y: baseY + 2 }
            ];
            break;
        }
    }
    newSnake.direction = DIRS.RIGHT;
    newSnake.nextDirection = DIRS.RIGHT;
    snake = newSnake;
    currentSpeed = INIT_SPEED_MS; // Restablecer velocidad inicial
}

/**
 * Reduce el tamaño del cuerpo de la serpiente de vuelta a su tamaño inicial (3 segmentos).
 * @why Esta es una recompensa al depositar los puntos: se reduce el riesgo de colisión al vaciar la cola.
 */
function shrinkSnakeToOriginal() {
    const head = snake.getHead();
    const dir = snake.direction;
    const newBody = [];
    for (let i = 0; i < 3; i++) {
        newBody.push({
            x: head.x - i * dir.x,
            y: head.y - i * dir.y
        });
    }
    snake.body = newBody;
}

/**
 * Elimina cristales atrapados en la nueva zona de exclusión tras la expansión de la base.
 * Reposiciona cristales nuevos en celdas libres.
 */
function removeCrystalsInForbiddenZone() {
    const before = crystals.length;
    crystals = crystals.filter(c => !isForbiddenZone(c.x, c.y));
    const removed = before - crystals.length;
    for (let i = 0; i < removed; i++) {
        addOneCrystal();
    }
}

/**
 * Incrementa las dimensiones de la base segura en 2 celdas de ancho y alto (`BASE_GROWTH`).
 * Ocurre cuando se alcanzan o superan los puntos depositados requeridos.
 */
function growBase() {
    if (storedPoints >= currentPointsToGrow) {
        baseW = Math.min(baseW + BASE_GROWTH, currentGridSize);
        baseH = Math.min(baseH + BASE_GROWTH, currentGridSize);
        storedPoints -= currentPointsToGrow;
        removeCrystalsInForbiddenZone(); // Reposicionar cristales que hayan quedado muy cerca de la nueva base
        updateUI();
    }
}

/**
 * Verifica si se cumplen los requisitos de posición para depositar automáticamente los cristales.
 * @why Decisión de diseño: Se requiere que al menos el 40% del cuerpo completo de la serpiente se
 * encuentre físicamente dentro de la base para poder depositar los puntos y encoger la cola.
 */
function checkAutoDeposit() {
    const body = snake.getBody();
    const total = body.length;
    if (total === 0) return;
    const inside = body.filter(seg => isInsideBase(seg)).length;
    const threshold = Math.floor(total * 0.4);
    if (inside >= threshold && points > 0) {
        storedPoints += points;
        points = 0;
        shrinkSnakeToOriginal();
        currentSpeed = INIT_SPEED_MS; // Restablecer a la velocidad inicial tras el depósito seguro
        restartGameLoop();
        updateUI();
        if (storedPoints >= currentPointsToGrow) {
            growBase();
        }
    }
}

/**
 * Ejecuta el procedimiento de muerte del jugador: resetea cristales a 0, recoloca a la serpiente y reanuda el juego.
 * @why La base y la puntuación de depósitos (`storedPoints`) se preservan, permitiendo continuar.
 */
function respawnAfterDeath() {
    if (gameInterval) clearInterval(gameInterval);
    points = 0; // Se pierden los cristales acumulados en el cuerpo
    resetSnakeInsideBase();
    gameRunning = true;
    updateUI();
    draw();
    restartGameLoop();
}

/**
 * Detiene el temporizador anterior y establece el nuevo ciclo del juego con el intervalo de velocidad actual.
 */
function restartGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    if (!gameRunning) return;
    gameInterval = setInterval(gameTick, currentSpeed);
}

// --- Cristales ---

/**
 * Calcula la distancia en cuadrícula (distancia de Chebyshov) entre dos puntos.
 * @param {Object} a - Coordenada {x, y}.
 * @param {Object} b - Coordenada {x, y}.
 * @returns {number}
 */
function distance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * Selecciona aleatoriamente un cristal del catálogo de tipos en base a sus probabilidades configuradas.
 * En modo fácil siempre retorna el tipo común.
 * @returns {number} Índice del tipo de cristal.
 */
function getRandomCrystalType() {
    if (isEasyMode) return 0;
    const rand = Math.random();
    let accum = 0;
    for (let i = 0; i < currentCrystalTypes.length; i++) {
        accum += currentCrystalTypes[i].prob;
        if (rand < accum) return i;
    }
    return 0;
}

/**
 * Genera la población inicial de cristales distribuidos en posiciones válidas del mapa al inicio de la partida.
 */
function generateCrystals() {
    let freeCells = getFreeCells(true);
    if (freeCells.length === 0) return;
    
    // Barajado Fisher-Yates para asegurar aletoriedad
    for (let i = freeCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [freeCells[i], freeCells[j]] = [freeCells[j], freeCells[i]];
    }
    
    const selected = [];
    // Colocar cristales aplicando una separación mínima (`MIN_DIST`) para evitar aglomeraciones visuales
    for (const cell of freeCells) {
        if (selected.length >= currentNumCrystals) break;
        let tooClose = false;
        for (const s of selected) {
            if (distance(cell, s) < MIN_DIST) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose) {
            const typeIdx = getRandomCrystalType();
            selected.push({ x: cell.x, y: cell.y, typeIndex: typeIdx });
        }
    }
    
    // Relleno de seguridad si la limitación de distancia no permitió colocar la cantidad deseada
    if (selected.length < currentNumCrystals) {
        for (const cell of freeCells) {
            if (selected.length >= currentNumCrystals) break;
            if (!selected.some(c => c.x === cell.x && c.y === cell.y)) {
                const typeIdx = getRandomCrystalType();
                selected.push({ x: cell.x, y: cell.y, typeIndex: typeIdx });
            }
        }
    }
    crystals = selected;
}

/**
 * Intenta spawnear un cristal adicional en el mapa.
 * @returns {boolean} Retorna verdadero si se pudo añadir con éxito.
 */
function addOneCrystal() {
    let freeCells = getFreeCells(true);
    // Filtrar celdas que respeten la distancia mínima a los cristales existentes
    const validCells = freeCells.filter(cell => {
        return !crystals.some(c => distance(cell, c) < MIN_DIST);
    });
    
    let newCrystal;
    if (validCells.length > 0) {
        const rand = Math.floor(Math.random() * validCells.length);
        const typeIdx = getRandomCrystalType();
        newCrystal = { x: validCells[rand].x, y: validCells[rand].y, typeIndex: typeIdx };
    } else if (freeCells.length > 0) {
        // Ignorar distancia mínima si no hay celdas que la cumplan
        const rand = Math.floor(Math.random() * freeCells.length);
        const typeIdx = getRandomCrystalType();
        newCrystal = { x: freeCells[rand].x, y: freeCells[rand].y, typeIndex: typeIdx };
    } else {
        return false; // Sin celdas libres disponibles
    }
    crystals.push(newCrystal);
    return true;
}

/**
 * Comprueba si la cabeza de la serpiente choca con algún cristal para consumirlo.
 * @why Si come, el intervalo de actualización del bucle aumenta (`speedDelay`),
 * haciendo que la serpiente se desplace más lento para facilitar el control al crecer.
 * @returns {boolean}
 */
function checkEatCrystal() {
    const head = snake.getHead();
    const index = crystals.findIndex(c => c.x === head.x && c.y === head.y);
    if (index !== -1) {
        const crystal = crystals[index];
        const type = currentCrystalTypes[crystal.typeIndex];
        const pointsEarned = type.value;
        points += pointsEarned;
        totalScore += pointsEarned;
        crystals.splice(index, 1); // Remover el cristal ingerido
        
        // La ralentización es parte del equilibrio del juego
        if (!isEasyMode) {
            const delay = type.speedDelay || 0;
            currentSpeed = Math.min(currentSpeed + delay, MAX_SPEED_MS);
        }
        addOneCrystal(); // Repone un cristal inmediatamente
        updateUI();
        return true;
    }
    return false;
}

// --- Paredes (modo difícil) ---

/**
 * Distribuye de forma aleatoria los obstáculos (paredes) por el mapa al arrancar el modo difícil.
 */
function generateWalls() {
    walls = [];
    // Limpia cualquier intervalo activo anterior para evitar desbordes de memoria
    wallIntervals.forEach(interval => clearInterval(interval));
    wallIntervals = [];
    if (!isHardMode) return;
    
    const freeCells = getFreeCells(true);
    if (freeCells.length < WALL_COUNT) return;
    
    for (let i = freeCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [freeCells[i], freeCells[j]] = [freeCells[j], freeCells[i]];
    }
    
    const selected = [];
    // Ubicar paredes aplicando separación
    for (const cell of freeCells) {
        if (selected.length >= WALL_COUNT) break;
        let tooClose = false;
        for (const s of selected) {
            if (distance(cell, s) < 3) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose) selected.push(cell);
    }
    if (selected.length < WALL_COUNT) {
        for (const cell of freeCells) {
            if (selected.length >= WALL_COUNT) break;
            if (!selected.some(s => s.x === cell.x && s.y === cell.y)) {
                selected.push(cell);
            }
        }
    }
    for (const pos of selected) {
        createWallAt(pos.x, pos.y);
    }
}

/**
 * Crea una pared en la coordenada designada e inicia su ciclo de vida dinámico.
 * @param {number} x - Eje X.
 * @param {number} y - Eje Y.
 * @why Decisión de diseño: Para que el juego sea interactivo y cambiante, las paredes expiran
 * cada N segundos (`WALL_DURATION`), auto-eliminándose y reapareciendo en una nueva coordenada libre,
 * lo que exige reaccionar dinámicamente.
 */
function createWallAt(x, y) {
    const wall = { x, y, timer: WALL_DURATION };
    walls.push(wall);
    
    // Temporizador de cuenta atrás en segundos
    const interval = setInterval(() => {
        wall.timer--;
        if (wall.timer <= 0) {
            clearInterval(interval);
            const index = walls.indexOf(wall);
            if (index !== -1) walls.splice(index, 1);
            
            // Reubicación asíncrona de una nueva pared
            const freeCells2 = getFreeCells(true);
            if (freeCells2.length > 0) {
                const rand = Math.floor(Math.random() * freeCells2.length);
                const newPos = freeCells2[rand];
                createWallAt(newPos.x, newPos.y);
            }
        }
    }, 1000);
    wallIntervals.push(interval);
}

/**
 * Comprueba si la cabeza de la serpiente colisiona con alguna de las paredes.
 * @returns {boolean}
 */
function checkWallCollision() {
    if (!isHardMode) return false;
    const head = snake.getHead();
    return walls.some(w => w.x === head.x && w.y === head.y);
}

// --- Game loop ---

/**
 * Ciclo lógico del juego. Procesa el movimiento, verifica si come, comprueba colisiones letales y actualiza el renderizado.
 */
function gameTick() {
    if (!gameRunning) return;
    snake.updateDirection();
    const willEat = checkEatCrystal();
    snake.move(willEat);

    const head = snake.getHead();
    const insideBase = isInsideBase(head);

    // Muerte por colisión con obstáculo (solo fuera de la base segura)
    if (!insideBase && checkWallCollision()) {
        respawnAfterDeath();
        return;
    }

    // Muerte por colisión consigo misma o fuera del mapa (solo fuera de la base)
    if (!insideBase) {
        if (snake.collidesWithSelf() || snake.isOutOfBounds()) {
            respawnAfterDeath();
            return;
        }
    }

    checkAutoDeposit();
    
    // Si se ingiere un cristal, se refresca el loop inmediatamente para aplicar el cambio de intervalo de velocidad
    if (willEat) {
        restartGameLoop();
    }
    draw();
}

// --- Dificultad ---

/**
 * Aplica los valores de inicialización en función de la dificultad seleccionada.
 * Configura dimensiones de cuadrícula, densidad de cristales, dificultad de crecimiento de base y obstáculos.
 * @param {string} diff
 */
function applyDifficulty(diff) {
    currentGridSize = 100;
    currentNumCrystals = 180;
    currentPointsToGrow = 35;
    currentCrystalTypes = CRYSTAL_TYPES_NORMAL;
    isEasyMode = false;
    isHardMode = false;

    if (diff === 'facil') {
        isEasyMode = true;
        currentGridSize = 55;
        currentNumCrystals = 150;
        currentPointsToGrow = 50;
        currentCrystalTypes = [{ value: 1, color: '#aaaaaa', prob: 1 }];
    } else if (diff === 'normal') {
        // Conserva configuraciones por defecto
    } else if (diff === 'dificil') {
        isHardMode = true;
        currentNumCrystals = 220;
        currentPointsToGrow = 60;
        currentCrystalTypes = CRYSTAL_TYPES_HARD;
    }
    selectedDifficulty = diff;
}

// --- Reinicio y temporizador ---

/**
 * Restablece todas las variables de estado e inicializa los elementos para empezar un juego nuevo.
 */
function fullReset() {
    if (!infoDiv) createInfoDiv();
    if (gameInterval) clearInterval(gameInterval);
    if (timerInterval) clearInterval(timerInterval);
    wallIntervals.forEach(interval => clearInterval(interval));
    wallIntervals = [];

    baseW = BASE_START_SIZE;
    baseH = BASE_START_SIZE;
    points = 0;
    storedPoints = 0;
    totalScore = 0;
    currentSpeed = INIT_SPEED_MS;
    gameRunning = true;

    resetSnakeInsideBase();
    generateCrystals();
    if (isHardMode) generateWalls();
    timeLeft = TIMER_DURATION;
    updateUI();
    draw();
    restartGameLoop();
    startTimer();
}

/**
 * Inicia la cuenta atrás del temporizador del juego (1 segundo por intervalo).
 * Al agotarse el tiempo, finaliza la partida.
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 1) {
            clearInterval(timerInterval);
            endGame();
        } else {
            timeLeft--;
            updateUI();
        }
    }, 1000);
}

// --- Fin de partida ---

/**
 * Finaliza la partida, limpia temporizadores, detiene el bucle y muestra el resumen de estadísticas.
 */
function endGame() {
    if (gameInterval) clearInterval(gameInterval);
    if (timerInterval) clearInterval(timerInterval);
    wallIntervals.forEach(interval => clearInterval(interval));
    wallIntervals = [];
    gameRunning = false;

    const initialSize = BASE_START_SIZE;
    const finalSize = baseW;
    const growthTimes = (finalSize - initialSize) / BASE_GROWTH;

    document.getElementById('endBaseSize').textContent = `${baseW}x${baseH}`;
    document.getElementById('endGrowth').textContent = growthTimes;
    endScreen.classList.remove('hidden');

    if (isMobile()) {
        mobileControls.style.display = 'none';
    }
}

/**
 * Vuelve al menú de inicio limpiando variables de estado y ocultando el juego.
 */
function goToStart() {
    endScreen.classList.add('hidden');
    gameContainer.style.display = 'none';
    startScreen.classList.remove('hidden');
    if (gameInterval) clearInterval(gameInterval);
    if (timerInterval) clearInterval(timerInterval);
    wallIntervals.forEach(interval => clearInterval(interval));
    wallIntervals = [];
    gameRunning = false;
}

goHomeBtn.addEventListener('click', goToStart);

// --- Cámara y dibujo (centrado, sin límites, fondo negro) ---

// Filas y columnas del tablero visibles en el área de visualización del Canvas (calculadas adaptativamente)
let VISIBLE_COLS = 40;
let VISIBLE_ROWS = 40;

/**
 * Calcula el desplazamiento (offset) en coordenadas de la esquina superior izquierda de la cámara.
 * @why Decisión de diseño: Al mantener la cámara permanentemente centrada en la cabeza de la serpiente,
 * el mapa se siente como un entorno continuo de exploración libre, evitando los problemas visuales
 * de un mapa muy grande encajado en pantallas pequeñas.
 * @returns {Object} Desplazamiento de cámara {camX, camY}.
 */
function getCameraOffset() {
    const head = snake.getHead();
    let camX = head.x - Math.floor(VISIBLE_COLS / 2);
    let camY = head.y - Math.floor(VISIBLE_ROWS / 2);
    return { camX, camY };
}

/**
 * Adapta dinámicamente las dimensiones físicas de los canvas de juego y minimapa al tamaño del viewport.
 */
function resizeCanvas() {
    const container = document.getElementById('gameArea');
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    if (isMobile()) {
        const sidebar = document.getElementById('sidebar');
        const w = sidebar.clientWidth - 10;
        const h = sidebar.clientHeight - 10;
        const size = Math.min(w, h, 120);
        minimapCanvas.width = size;
        minimapCanvas.height = size;
    } else {
        const size = Math.min(rect.width * 0.8, rect.height * 0.6, 300);
        minimapCanvas.width = size;
        minimapCanvas.height = size;
    }
}

/**
 * Renderiza el estado del juego completo en el Canvas principal considerando el desfase de la cámara.
 */
function draw() {
    if (!snake) return;
    VISIBLE_COLS = Math.floor(canvas.width / CELL_SIZE);
    VISIBLE_ROWS = Math.floor(canvas.height / CELL_SIZE);
    if (VISIBLE_COLS < 1) VISIBLE_COLS = 1;
    if (VISIBLE_ROWS < 1) VISIBLE_ROWS = 1;

    const isDark = document.documentElement.classList.contains('dark');
    const { camX, camY } = getCameraOffset();

    // 1. Dibujar el fondo "negro infinito" (zona vacía fuera de la cuadrícula de juego)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desfase en píxeles del mapa de juego con respecto al canvas
    const mapOffsetX = -camX * CELL_SIZE;
    const mapOffsetY = -camY * CELL_SIZE;
    const mapPixelWidth = currentGridSize * CELL_SIZE;
    const mapPixelHeight = currentGridSize * CELL_SIZE;

    // 2. Dibujar el fondo de la superficie del mapa de juego (limitado a lo visible)
    const srcX = Math.max(0, mapOffsetX);
    const srcY = Math.max(0, mapOffsetY);
    const srcW = Math.min(canvas.width, mapOffsetX + mapPixelWidth) - srcX;
    const srcH = Math.min(canvas.height, mapOffsetY + mapPixelHeight) - srcY;
    if (srcW > 0 && srcH > 0) {
        ctx.fillStyle = isDark ? '#0a0f1a' : '#ffffff';
        ctx.fillRect(srcX, srcY, srcW, srcH);
    }

    // 3. Dibujar la cuadrícula o rejilla interna de juego
    ctx.strokeStyle = isDark ? '#2c3e50' : '#d0d0d0';
    ctx.lineWidth = 0.5;
    const startCol = Math.max(0, Math.floor(-mapOffsetX / CELL_SIZE));
    const endCol = Math.min(currentGridSize - 1, Math.ceil((canvas.width - mapOffsetX) / CELL_SIZE) - 1);
    const startRow = Math.max(0, Math.floor(-mapOffsetY / CELL_SIZE));
    const endRow = Math.min(currentGridSize - 1, Math.ceil((canvas.height - mapOffsetY) / CELL_SIZE) - 1);

    for (let col = startCol; col <= endCol; col++) {
        const x = col * CELL_SIZE + mapOffsetX;
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, mapOffsetY));
        ctx.lineTo(x, Math.min(canvas.height, mapOffsetY + mapPixelHeight));
        ctx.stroke();
    }
    for (let row = startRow; row <= endRow; row++) {
        const y = row * CELL_SIZE + mapOffsetY;
        ctx.beginPath();
        ctx.moveTo(Math.max(0, mapOffsetX), y);
        ctx.lineTo(Math.min(canvas.width, mapOffsetX + mapPixelWidth), y);
        ctx.stroke();
    }

    // 4. Dibujar la Base segura (verde traslúcido con borde sólido)
    const baseScreenX = (baseX - camX) * CELL_SIZE;
    const baseScreenY = (baseY - camY) * CELL_SIZE;
    const baseScreenW = baseW * CELL_SIZE;
    const baseScreenH = baseH * CELL_SIZE;
    if (baseScreenX + baseScreenW > 0 && baseScreenX < canvas.width &&
        baseScreenY + baseScreenH > 0 && baseScreenY < canvas.height) {
        ctx.fillStyle = "rgba(46, 204, 113, 0.2)";
        ctx.fillRect(baseScreenX, baseScreenY, baseScreenW, baseScreenH);
        ctx.strokeStyle = "#2ecc71";
        ctx.lineWidth = 2;
        ctx.strokeRect(baseScreenX, baseScreenY, baseScreenW, baseScreenH);
    }

    // 5. Dibujar los obstáculos (Paredes del modo difícil) con su cuenta atrás de segundos de vida
    if (isHardMode) {
        for (const w of walls) {
            const screenX = (w.x - camX) * CELL_SIZE;
            const screenY = (w.y - camY) * CELL_SIZE;
            if (screenX + CELL_SIZE > 0 && screenX < canvas.width &&
                screenY + CELL_SIZE > 0 && screenY < canvas.height) {
                ctx.fillStyle = "#e74c3c";
                ctx.fillRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
                ctx.fillStyle = "white";
                ctx.font = "10px monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(w.timer, screenX + CELL_SIZE / 2, screenY + CELL_SIZE / 2);
            }
        }
    }

    // 6. Dibujar los Cristales (con brillo dependiente de su tipo/valor)
    for (const c of crystals) {
        const screenX = (c.x - camX) * CELL_SIZE;
        const screenY = (c.y - camY) * CELL_SIZE;
        if (screenX + CELL_SIZE > 0 && screenX < canvas.width &&
            screenY + CELL_SIZE > 0 && screenY < canvas.height) {
            const type = currentCrystalTypes[c.typeIndex];
            let color = type.color;
            let border = false;
            // Ajuste de legibilidad para el modo claro
            if (!isDark) {
                if (type.value === 1) color = '#666666';
                else if (type.value === 5) { color = '#f0f0f0'; border = true; }
                else if (type.value === 15) color = '#d4a017';
            }
            ctx.fillStyle = color;
            ctx.shadowBlur = (type.value === 15) ? 12 : 2;
            ctx.shadowColor = color;
            ctx.fillRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
            if (border) {
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
            }
        }
    }
    ctx.shadowBlur = 0; // Desactivar sombreado para no afectar el resto de dibujos

    // 7. Dibujar la Serpiente (Cabeza en verde oscuro, cuerpo en verde claro)
    snake.getBody().forEach((seg, idx) => {
        const screenX = (seg.x - camX) * CELL_SIZE;
        const screenY = (seg.y - camY) * CELL_SIZE;
        if (screenX + CELL_SIZE > 0 && screenX < canvas.width &&
            screenY + CELL_SIZE > 0 && screenY < canvas.height) {
            ctx.fillStyle = idx === 0 ? "#27ae60" : "#2ecc71";
            ctx.fillRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    });

    // 8. Dibujar el Minimapa lateral
    drawMinimap();
}

/**
 * Dibuja una representación simplificada del mapa entero a escala.
 */
function drawMinimap() {
    const w = minimapCanvas.width;
    const h = minimapCanvas.height;
    if (w === 0 || h === 0) return;
    const isDark = document.documentElement.classList.contains('dark');

    minimapCtx.clearRect(0, 0, w, h);
    minimapCtx.fillStyle = isDark ? '#0a0f1a' : '#ffffff';
    minimapCtx.fillRect(0, 0, w, h);

    const scaleX = w / currentGridSize;
    const scaleY = h / currentGridSize;
    const cellW = Math.max(1, scaleX);
    const cellH = Math.max(1, scaleY);

    // Dibujar base en el minimapa
    minimapCtx.fillStyle = isDark ? 'rgba(16,185,129,0.3)' : 'rgba(46,204,113,0.3)';
    minimapCtx.fillRect(baseX * scaleX, baseY * scaleY, baseW * scaleX, baseH * scaleY);
    minimapCtx.strokeStyle = isDark ? '#10b981' : '#2ecc71';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(baseX * scaleX, baseY * scaleY, baseW * scaleX, baseH * scaleY);

    // Dibujar cristales
    for (const c of crystals) {
        const type = currentCrystalTypes[c.typeIndex];
        let color = type.color;
        if (!isDark) {
            if (type.value === 1) color = '#666666';
            else if (type.value === 5) color = '#f0f0f0';
            else if (type.value === 15) color = '#d4a017';
        }
        minimapCtx.fillStyle = color;
        minimapCtx.fillRect(c.x * scaleX, c.y * scaleY, cellW, cellH);
    }

    // Dibujar paredes
    if (isHardMode) {
        for (const w of walls) {
            minimapCtx.fillStyle = '#e74c3c';
            minimapCtx.fillRect(w.x * scaleX, w.y * scaleY, cellW, cellH);
        }
    }

    // Dibujar serpiente
    snake.getBody().forEach((seg, idx) => {
        minimapCtx.fillStyle = idx === 0 ? '#27ae60' : '#2ecc71';
        minimapCtx.fillRect(seg.x * scaleX, seg.y * scaleY, cellW, cellH);
    });

    minimapCtx.strokeStyle = isDark ? '#334155' : '#ccc';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, w, h);
}

// --- Controles (teclado + táctiles) ---

/**
 * Escucha las pulsaciones de teclado para direccionar la serpiente.
 */
function handleKey(e) {
    if (!gameRunning) return;
    const key = e.key;
    let newDir = null;
    switch (key) {
        case 'ArrowUp': case 'w': case 'W': newDir = DIRS.UP; break;
        case 'ArrowDown': case 's': case 'S': newDir = DIRS.DOWN; break;
        case 'ArrowLeft': case 'a': case 'A': newDir = DIRS.LEFT; break;
        case 'ArrowRight': case 'd': case 'D': newDir = DIRS.RIGHT; break;
        default: return;
    }
    e.preventDefault();
    if (newDir && snake) snake.setDirection(newDir);
}

// --- Tema ---

/**
 * Alterna el modo oscuro del juego y guarda la elección del usuario.
 */
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌓';
    themeToggleStart.textContent = isDark ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    draw();
}

/**
 * Inicializa el tema leyendo del almacenamiento local.
 */
function initTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) document.documentElement.classList.add('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌓';
    themeToggleStart.textContent = isDark ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    themeToggle.addEventListener('click', toggleTheme);
    themeToggleStart.addEventListener('click', toggleTheme);
}

// --- Pantalla de inicio y modal ---

/**
 * Presenta el menú principal en pantalla.
 */
function showStartScreen() {
    startScreen.classList.remove('hidden');
    gameContainer.style.display = 'none';
}

/**
 * Captura y procesa la selección de dificultad.
 */
function handleDifficultySelect(e) {
    const diff = e.target.dataset.diff;
    applyDifficulty(diff);
    console.log('Dificultad:', diff);
    difficultyModal.classList.add('hidden');
    startGameAfterDifficulty();
}

/**
 * Adapta el diseño UI según dispositivo móvil u ordenador e inicia el bucle de juego.
 */
function startGameAfterDifficulty() {
    startScreen.classList.add('hidden');
    gameContainer.style.display = 'block';

    if (isMobile()) {
        mobileControls.style.display = 'block';
        themeToggle.style.display = 'none';
        if (infoDiv) {
            infoDiv.style.left = 'auto';
            infoDiv.style.right = '10px';
        }
    } else {
        mobileControls.style.display = 'none';
        themeToggle.style.display = 'block';
        if (infoDiv) {
            infoDiv.style.left = '10px';
            infoDiv.style.right = 'auto';
        }
    }

    setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);
    createInfoDiv();
    fullReset();
}

/**
 * Oculta el modal de dificultad.
 */
function closeModal() {
    difficultyModal.classList.add('hidden');
}

/**
 * Despliega el modal de dificultad.
 */
function startGame() {
    difficultyModal.classList.remove('hidden');
}

// --- Configurar botones táctiles ---

/**
 * Configura los eventos mousedown y touchstart para la cruz de control móvil virtual.
 */
function setupMobileControls() {
    const btns = mobileControls.querySelectorAll('.ctrl-btn');
    btns.forEach(btn => {
        const dir = btn.dataset.dir;
        const handler = (e) => {
            e.preventDefault();
            let newDir = null;
            switch (dir) {
                case 'up': newDir = DIRS.UP; break;
                case 'down': newDir = DIRS.DOWN; break;
                case 'left': newDir = DIRS.LEFT; break;
                case 'right': newDir = DIRS.RIGHT; break;
            }
            if (newDir && snake && gameRunning) {
                snake.setDirection(newDir);
            }
        };
        btn.addEventListener('touchstart', handler);
        btn.addEventListener('mousedown', handler);
    });
}

// --- Event listeners ---
diffBtns.forEach(btn => btn.addEventListener('click', handleDifficultySelect));
closeModalBtn.addEventListener('click', closeModal);
difficultyModal.addEventListener('click', (e) => {
    if (e.target === difficultyModal) closeModal();
});
playBtn.addEventListener('click', startGame);

// --- Inicio ---
window.addEventListener('load', () => {
    initTheme();
    showStartScreen();
    window.addEventListener('keydown', handleKey);
    setupMobileControls();
    window.addEventListener('resize', () => {
        if (gameContainer.style.display !== 'none') {
            resizeCanvas();
        }
    });
});