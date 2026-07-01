// ---------------------------------------------------------------
// ranking.js - Ranking final, historial y mensajes de fin de partida.
// ---------------------------------------------------------------

// Guarda los resultados de una partida en localStorage.
export function guardarRankingEnHistorial(rankings) {
    const entrada = {
        fecha: new Date().toLocaleString('es-AR'),
        rankings: rankings.map(r => ({
            nombre: r.nombre || r.name,
            tamanioBase: r.tamanioBase || r.baseSize,
            color: r.color,
        })),
    };
    const historial = JSON.parse(localStorage.getItem('snakeRankingHistorial') || '[]');
    historial.unshift(entrada);
    if (historial.length > 20) historial.length = 20;
    localStorage.setItem('snakeRankingHistorial', JSON.stringify(historial));
}

// ---- Ranking final de la partida ----

// Medallas para los 3 primeros puestos.
const medallas = ['🥇', '🥈', '🥉'];

// Calcula el tamaño máximo de base para la barra de progreso.
function calcularMaximo(rankings) {
    return Math.max(...rankings.map(r => r.tamanioBase || r.baseSize || 1), 1);
}

// Renderiza el ranking final con podio visual y barras de progreso.
export function mostrarRankingFinal(rankings) {
    const lista = document.getElementById('rankingList');
    const titulo = document.querySelector('#endScreen .end-content h2');
    if (titulo) titulo.textContent = '🏆 Ranking Final';

    const maximo = calcularMaximo(rankings);

    lista.innerHTML = rankings.map((r, i) => {
        const nombre = r.nombre || r.name;
        const tamanio = r.tamanioBase || r.baseSize;
        const porcentaje = Math.round((tamanio / maximo) * 100);
        const esPodio = i < 3;

        return `
            <div class="ranking-card" style="border-left: 4px solid ${r.color};">
                <div class="ranking-card-pos">
                    ${esPodio ? '<span class="ranking-medal">' + medallas[i] + '</span>' : '<span class="ranking-num">#' + (i + 1) + '</span>'}
                </div>
                <div class="ranking-card-info">
                    <span class="ranking-card-name" style="color: ${r.color}; font-size: ${esPodio ? '1.3rem' : '1rem'};">
                        ${nombre}
                    </span>
                    <div class="ranking-bar-bg">
                        <div class="ranking-bar-fill" style="width: ${porcentaje}%; background: ${r.color};"></div>
                    </div>
                    <span class="ranking-card-score">${tamanio} celdas²</span>
                </div>
            </div>
        `;
    }).join('');

    // Mostrar también un botón debajo del ranking
    lista.innerHTML += '<div class="ranking-footer">---</div>';
}

// ---- Mensaje de abandono ----

// Muestra un mensaje cuando un jugador abandona la partida.
export function mostrarMensajeFin(mensaje) {
    const lista = document.getElementById('rankingList');
    const titulo = document.querySelector('#endScreen .end-content h2');
    if (titulo) titulo.textContent = '⚠️ Partida interrumpida';
    lista.innerHTML = `
        <div class="abandono-card">
            <span class="abandono-icon">🚪</span>
            <p class="abandono-texto">${mensaje}</p>
        </div>
    `;
}

// ---- Historial de partidas ----

// Muestra el historial de partidas guardadas como tarjetas.
export function mostrarHistorial() {
    const lista = document.getElementById('rankingList');
    const titulo = document.querySelector('#endScreen .end-content h2');
    if (titulo) titulo.textContent = '📜 Historial de Partidas';

    const historial = JSON.parse(localStorage.getItem('snakeRankingHistorial') || '[]');

    if (historial.length === 0) {
        lista.innerHTML = '<div class="historial-vacio">📭 No hay partidas guardadas aún.</div>';
        return;
    }

    lista.innerHTML = historial.map((entrada) => {
        const top3 = entrada.rankings.slice(0, 3);
        const resto = entrada.rankings.length - 3;

        return `
            <div class="historial-card">
                <div class="historial-fecha">📅 ${entrada.fecha}</div>
                <div class="historial-podio">
                    ${top3.map((r, j) => `
                        <div class="historial-jugador">
                            <span class="historial-medalla">${medallas[j]}</span>
                            <span class="historial-nombre" style="color:${r.color};">${r.nombre}</span>
                            <span class="historial-puntaje">${r.tamanioBase}²</span>
                        </div>
                    `).join('')}
                    ${resto > 0 ? '<div class="historial-resto">y ' + resto + ' más...</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}