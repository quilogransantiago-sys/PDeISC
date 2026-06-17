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
let points = 0;
let storedPoints = 0;
let totalScore = 0;
let currentSpeed = INIT_SPEED_MS;
let gameInterval = null;
let gameRunning = false;

let baseX = 0, baseY = 0;
let baseW = BASE_START_SIZE;
let baseH = BASE_START_SIZE;

let timeLeft = TIMER_DURATION;
let timerInterval = null;
let infoDiv = null;

// --- Detectar móvil ---
function isMobile() {
    return window.innerWidth <= 768;
}

// --- UI overlay ---
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
    infoDiv.style.pointerEvents = 'none';
    document.getElementById('gameArea').appendChild(infoDiv);
}

function updateUI() {
    if (!infoDiv) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    let wallsInfo = '';
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
function isInsideBase(cell) {
    return cell.x >= baseX && cell.x < baseX + baseW && cell.y >= baseY && cell.y < baseY + baseH;
}

function isForbiddenZone(x, y) {
    const margin = BASE_EXCLUSION_MARGIN;
    const minX = baseX - margin;
    const maxX = baseX + baseW + margin - 1;
    const minY = baseY - margin;
    const maxY = baseY + baseH + margin - 1;
    return (x >= minX && x <= maxX && y >= minY && y <= maxY);
}

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

function resetSnakeInsideBase() {
    let centerX = baseX + Math.floor(baseW / 2);
    let centerY = baseY + Math.floor(baseH / 2);
    const newSnake = new Snake(currentGridSize);
    newSnake.body = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
    ];
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
    currentSpeed = INIT_SPEED_MS;
}

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

function removeCrystalsInForbiddenZone() {
    const before = crystals.length;
    crystals = crystals.filter(c => !isForbiddenZone(c.x, c.y));
    const removed = before - crystals.length;
    for (let i = 0; i < removed; i++) {
        addOneCrystal();
    }
}

function growBase() {
    if (storedPoints >= currentPointsToGrow) {
        baseW = Math.min(baseW + BASE_GROWTH, currentGridSize);
        baseH = Math.min(baseH + BASE_GROWTH, currentGridSize);
        storedPoints -= currentPointsToGrow;
        removeCrystalsInForbiddenZone();
        updateUI();
    }
}

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
        currentSpeed = INIT_SPEED_MS;
        restartGameLoop();
        updateUI();
        if (storedPoints >= currentPointsToGrow) {
            growBase();
        }
    }
}

function respawnAfterDeath() {
    if (gameInterval) clearInterval(gameInterval);
    points = 0;
    resetSnakeInsideBase();
    gameRunning = true;
    updateUI();
    draw();
    restartGameLoop();
}

function restartGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    if (!gameRunning) return;
    gameInterval = setInterval(gameTick, currentSpeed);
}

// --- Cristales ---
function distance(a, b) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

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

function generateCrystals() {
    let freeCells = getFreeCells(true);
    if (freeCells.length === 0) return;
    for (let i = freeCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [freeCells[i], freeCells[j]] = [freeCells[j], freeCells[i]];
    }
    const selected = [];
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

function addOneCrystal() {
    let freeCells = getFreeCells(true);
    const validCells = freeCells.filter(cell => {
        return !crystals.some(c => distance(cell, c) < MIN_DIST);
    });
    let newCrystal;
    if (validCells.length > 0) {
        const rand = Math.floor(Math.random() * validCells.length);
        const typeIdx = getRandomCrystalType();
        newCrystal = { x: validCells[rand].x, y: validCells[rand].y, typeIndex: typeIdx };
    } else if (freeCells.length > 0) {
        const rand = Math.floor(Math.random() * freeCells.length);
        const typeIdx = getRandomCrystalType();
        newCrystal = { x: freeCells[rand].x, y: freeCells[rand].y, typeIndex: typeIdx };
    } else {
        return false;
    }
    crystals.push(newCrystal);
    return true;
}

function checkEatCrystal() {
    const head = snake.getHead();
    const index = crystals.findIndex(c => c.x === head.x && c.y === head.y);
    if (index !== -1) {
        const crystal = crystals[index];
        const type = currentCrystalTypes[crystal.typeIndex];
        const pointsEarned = type.value;
        points += pointsEarned;
        totalScore += pointsEarned;
        crystals.splice(index, 1);
        if (!isEasyMode) {
            const delay = type.speedDelay || 0;
            currentSpeed = Math.min(currentSpeed + delay, MAX_SPEED_MS);
        }
        addOneCrystal();
        updateUI();
        return true;
    }
    return false;
}

// --- Paredes (modo difícil) ---
function generateWalls() {
    walls = [];
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

function createWallAt(x, y) {
    const wall = { x, y, timer: WALL_DURATION };
    walls.push(wall);
    const interval = setInterval(() => {
        wall.timer--;
        if (wall.timer <= 0) {
            clearInterval(interval);
            const index = walls.indexOf(wall);
            if (index !== -1) walls.splice(index, 1);
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

function checkWallCollision() {
    if (!isHardMode) return false;
    const head = snake.getHead();
    return walls.some(w => w.x === head.x && w.y === head.y);
}

// --- Game loop ---
function gameTick() {
    if (!gameRunning) return;
    snake.updateDirection();
    const willEat = checkEatCrystal();
    snake.move(willEat);

    const head = snake.getHead();
    const insideBase = isInsideBase(head);

    if (!insideBase && checkWallCollision()) {
        respawnAfterDeath();
        return;
    }

    if (!insideBase) {
        if (snake.collidesWithSelf() || snake.isOutOfBounds()) {
            respawnAfterDeath();
            return;
        }
    }

    checkAutoDeposit();
    if (willEat) {
        restartGameLoop();
    }
    draw();
}

// --- Dificultad ---
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
        // valores por defecto
    } else if (diff === 'dificil') {
        isHardMode = true;
        currentNumCrystals = 220;
        currentPointsToGrow = 60;
        currentCrystalTypes = CRYSTAL_TYPES_HARD;
    }
    selectedDifficulty = diff;
}

// --- Reinicio y temporizador ---
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

    // Ocultar controles móviles
    if (isMobile()) {
        mobileControls.style.display = 'none';
    }
}

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
let VISIBLE_COLS = 40;
let VISIBLE_ROWS = 40;

function getCameraOffset() {
    const head = snake.getHead();
    let camX = head.x - Math.floor(VISIBLE_COLS / 2);
    let camY = head.y - Math.floor(VISIBLE_ROWS / 2);
    return { camX, camY };
}

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

function draw() {
    if (!snake) return;
    VISIBLE_COLS = Math.floor(canvas.width / CELL_SIZE);
    VISIBLE_ROWS = Math.floor(canvas.height / CELL_SIZE);
    if (VISIBLE_COLS < 1) VISIBLE_COLS = 1;
    if (VISIBLE_ROWS < 1) VISIBLE_ROWS = 1;

    const isDark = document.documentElement.classList.contains('dark');
    const { camX, camY } = getCameraOffset();

    // Fondo negro (vacío)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar el mapa dentro del viewport
    const mapOffsetX = -camX * CELL_SIZE;
    const mapOffsetY = -camY * CELL_SIZE;
    const mapPixelWidth = currentGridSize * CELL_SIZE;
    const mapPixelHeight = currentGridSize * CELL_SIZE;

    const srcX = Math.max(0, mapOffsetX);
    const srcY = Math.max(0, mapOffsetY);
    const srcW = Math.min(canvas.width, mapOffsetX + mapPixelWidth) - srcX;
    const srcH = Math.min(canvas.height, mapOffsetY + mapPixelHeight) - srcY;
    if (srcW > 0 && srcH > 0) {
        ctx.fillStyle = isDark ? '#0a0f1a' : '#ffffff';
        ctx.fillRect(srcX, srcY, srcW, srcH);
    }

    // Grid (solo dentro del mapa)
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

    // Base
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

    // Paredes
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

    // Cristales
    for (const c of crystals) {
        const screenX = (c.x - camX) * CELL_SIZE;
        const screenY = (c.y - camY) * CELL_SIZE;
        if (screenX + CELL_SIZE > 0 && screenX < canvas.width &&
            screenY + CELL_SIZE > 0 && screenY < canvas.height) {
            const type = currentCrystalTypes[c.typeIndex];
            let color = type.color;
            let border = false;
            if (!isDark) {
                if (type.value === 1) color = '#666666';
                else if (type.value === 5) { color = '#f0f0f0'; border = true; }
                else if (type.value === 15) color = '#d4a017';
            }
            ctx.fillStyle = color;
            ctx.shadowBlur = (type.value === 15) ? 12 : 2;
            ctx.fillRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
            if (border) {
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
            }
        }
    }
    ctx.shadowBlur = 0;

    // Serpiente
    snake.getBody().forEach((seg, idx) => {
        const screenX = (seg.x - camX) * CELL_SIZE;
        const screenY = (seg.y - camY) * CELL_SIZE;
        if (screenX + CELL_SIZE > 0 && screenX < canvas.width &&
            screenY + CELL_SIZE > 0 && screenY < canvas.height) {
            ctx.fillStyle = idx === 0 ? "#27ae60" : "#2ecc71";
            ctx.fillRect(screenX, screenY, CELL_SIZE - 1, CELL_SIZE - 1);
        }
    });

    drawMinimap();
}

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

    // Base
    minimapCtx.fillStyle = isDark ? 'rgba(16,185,129,0.3)' : 'rgba(46,204,113,0.3)';
    minimapCtx.fillRect(baseX * scaleX, baseY * scaleY, baseW * scaleX, baseH * scaleY);
    minimapCtx.strokeStyle = isDark ? '#10b981' : '#2ecc71';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(baseX * scaleX, baseY * scaleY, baseW * scaleX, baseH * scaleY);

    // Cristales
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

    // Paredes
    if (isHardMode) {
        for (const w of walls) {
            minimapCtx.fillStyle = '#e74c3c';
            minimapCtx.fillRect(w.x * scaleX, w.y * scaleY, cellW, cellH);
        }
    }

    // Serpiente
    snake.getBody().forEach((seg, idx) => {
        minimapCtx.fillStyle = idx === 0 ? '#27ae60' : '#2ecc71';
        minimapCtx.fillRect(seg.x * scaleX, seg.y * scaleY, cellW, cellH);
    });

    minimapCtx.strokeStyle = isDark ? '#334155' : '#ccc';
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(0, 0, w, h);
}

// --- Controles (teclado + táctiles) ---
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
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    themeToggle.textContent = isDark ? '☀️' : '🌓';
    themeToggleStart.textContent = isDark ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    draw();
}

function initTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) document.documentElement.classList.add('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌓';
    themeToggleStart.textContent = isDark ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
    themeToggle.addEventListener('click', toggleTheme);
    themeToggleStart.addEventListener('click', toggleTheme);
}

// --- Pantalla de inicio y modal ---
function showStartScreen() {
    startScreen.classList.remove('hidden');
    gameContainer.style.display = 'none';
}

function handleDifficultySelect(e) {
    const diff = e.target.dataset.diff;
    applyDifficulty(diff);
    console.log('Dificultad:', diff);
    difficultyModal.classList.add('hidden');
    startGameAfterDifficulty();
}

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

function closeModal() {
    difficultyModal.classList.add('hidden');
}

function startGame() {
    difficultyModal.classList.remove('hidden');
}

// --- Configurar botones táctiles ---
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