/**
 * themeManager.js - Gestiona el tema claro/oscuro con localStorage.
 * Incluye inicialización, toggle y persistencia.
 */

/**
 * Inicializa el tema: aplica clase según localStorage y configura el botón.
 * @param {string} toggleButtonId - ID del botón que alterna el tema.
 */
export function initTheme(toggleButtonId = 'theme-toggle') {
    const button = document.getElementById(toggleButtonId);
    if (!button) return;

    // Determinar estado actual (la clase ya fue aplicada por script inline)
    const isDark = document.documentElement.classList.contains('dark-mode');
    updateButtonText(button, isDark);

    // Evento toggle
    button.addEventListener('click', () => {
        const nowDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        updateButtonText(button, nowDark);
    });
}

/**
 * Actualiza el texto del botón según el tema.
 */
function updateButtonText(button, isDark) {
    button.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}