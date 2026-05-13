/**
 * ========================================
 * Diario Actual - Script Principal
 * ========================================
 * Maneja: menú móvil, filtrado de noticias,
 * validación de newsletter y renderizado dinámico
 */

'use strict';

/* ========================================
   Datos de Noticias (Datos de Prueba)
   ======================================== */
const newsData = [
    {
        id: 1,
        title: 'Cumbre climática: países firman acuerdo para reducir emisiones antes de 2030',
        excerpt: 'Más de 120 naciones se comprometieron públicamente a alcanzar la neutralidad de carbono en las próximas décadas, estableciendo metas vinculantes.',
        category: 'politica',
        categoryLabel: 'Política',
        image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400&h=250&fit=crop',
        time: 'Hace 1 hora',
        trending: true
    },
    {
        id: 2,
        title: 'Lanzamiento del primer smartphone con procesador cuántico comercial',
        excerpt: 'La empresa tecnológica líder presenta su nuevo dispositivo que promete revolucionar la computación móvil con capacidades de procesamiento sin precedentes.',
        category: 'tecnologia',
        categoryLabel: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=250&fit=crop',
        time: 'Hace 3 horas',
        trending: true
    },
    {
        id: 3,
        title: 'Mercados internacionales reaccionan positivamente a las nuevas políticas comerciales',
        excerpt: 'Los principales índices bursátiles cerraron en máximos históricos tras los anuncios de apertura comercial entre las principales economías.',
        category: 'economia',
        categoryLabel: 'Economía',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
        time: 'Hace 5 horas',
        trending: true
    },
    {
        id: 4,
        title: 'Selección nacional clasifica al mundial tras victoria histórica',
        excerpt: 'Con un gol en el minuto 95, el equipo logró la clasificación a la Copa Mundo en una final que quedó en la memoria de todos los aficionados.',
        category: 'deportes',
        categoryLabel: 'Deportes',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
        time: 'Hace 6 horas',
        trending: false
    },
    {
        id: 5,
        title: 'Museo del Louvre inaugura exposición retrospectiva de arte digital',
        excerpt: 'La prestigiosa institución parisina presenta por primera vez una colección que fusiona obras clásicas con experiencias de realidad aumentada.',
        category: 'cultura',
        categoryLabel: 'Cultura',
        image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400&h=250&fit=crop',
        time: 'Hace 8 horas',
        trending: false
    },
    {
        id: 6,
        title: 'Nuevo tratamiento contra enfermedades neurodegenerativas muestra resultados prometedores',
        excerpt: 'Científicos anuncian que los ensayos clínicos de fase 3 han demostrado una reducción significativa del 40% en la progresión de la enfermedad.',
        category: 'tecnologia',
        categoryLabel: 'Tecnología',
        image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop',
        time: 'Hace 10 horas',
        trending: false
    },
    {
        id: 7,
        title: 'Gobierno presenta plan de infraestructura vial para los próximos 5 años',
        excerpt: 'El proyecto contempla la construcción de más de 2.000 kilómetros de autopistas modernas y la renovación integral de rutas nacionales.',
        category: 'politica',
        categoryLabel: 'Política',
        image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=250&fit=crop',
        time: 'Hace 12 horas',
        trending: false
    },
    {
        id: 8,
        title: 'Criptomonedas superan el billón de dólares en capitalización de mercado',
        excerpt: 'El mercado de activos digitales alcanza un nuevo hito histórico mientras las principales criptomonedas continúan su tendencia alcista.',
        category: 'economia',
        categoryLabel: 'Economía',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
        time: 'Ayer',
        trending: true
    },
    {
        id: 9,
        title: 'Festival de cine independiente anuncia selección oficial para su edición 2026',
        excerpt: 'Más de 300 películas de 45 países compiten por los principales premios del festival que se realizará el próximo verano.',
        category: 'cultura',
        categoryLabel: 'Cultura',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop',
        time: 'Ayer',
        trending: false
    },
    {
        id: 10,
        title: 'Atleta local rompe récord mundial en competencia de atletismo',
        excerpt: 'La velocista de 22 años estableció una nueva marca mundial en los 100 metros planos durante la competencia internacional.',
        category: 'deportes',
        categoryLabel: 'Deportes',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=250&fit=crop',
        time: 'Ayer',
        trending: false
    }
];

/* ========================================
   Estado de la Aplicación
   ======================================== */
const state = {
    currentCategory: 'all',
    isMobileMenuOpen: false
};

/* ========================================
   Elementos del DOM
   ======================================== */
const DOM = {
    menuToggle: document.getElementById('menuToggle'),
    mainNav: document.getElementById('mainNav'),
    currentDate: document.getElementById('currentDate'),
    newsGrid: document.getElementById('newsGrid'),
    trendingNews: document.getElementById('trendingNews'),
    categoryFilter: document.getElementById('categoryFilter'),
    navLinks: document.querySelectorAll('.nav__link')
};

/* ========================================
   Utilidades
   ======================================== */

/**
 * Formatea la fecha actual al español
 * @returns {string} Fecha formateada
 */
function formatCurrentDate() {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const date = new Date();
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto seguro
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ========================================
   Renderizado de Noticias
   ======================================== */

/**
 * Crea el HTML de una tarjeta de noticia
 * @param {Object} news - Datos de la noticia
 * @returns {string} HTML de la tarjeta
 */
function createNewsCard(news) {
    return `
        <article class="news-card">
            <figure class="news-card__image">
                <img src="${escapeHTML(news.image)}" alt="${escapeHTML(news.title)}" loading="lazy">
                <span class="news-card__category">${escapeHTML(news.categoryLabel)}</span>
            </figure>
            <div class="news-card__content">
                <h3 class="news-card__title">${escapeHTML(news.title)}</h3>
                <p class="news-card__excerpt">${escapeHTML(news.excerpt)}</p>
                <div class="news-card__meta">
                    <span class="news-card__time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${escapeHTML(news.time)}
                    </span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Crea el HTML de un item trending
 * @param {Object} news - Datos de la noticia
 * @param {number} index - Posición en el ranking
 * @returns {string} HTML del item
 */
function createTrendingItem(news, index) {
    return `
        <li class="trending__item">
            <span class="trending__number">${index}</span>
            <div class="trending__content">
                <h4 class="trending__title">${escapeHTML(news.title)}</h4>
                <span class="trending__time">${escapeHTML(news.time)}</span>
            </div>
        </li>
    `;
}

/**
 * Renderiza las noticias filtradas en el grid
 */
function renderNews() {
    const filteredNews = state.currentCategory === 'all'
        ? newsData
        : newsData.filter(news => news.category === state.currentCategory);

    if (filteredNews.length === 0) {
        DOM.newsGrid.innerHTML = `
            <div class="no-results">
                <p class="no-results__text">No hay noticias en esta categoría.</p>
            </div>
        `;
        return;
    }

    DOM.newsGrid.innerHTML = filteredNews.map(news => createNewsCard(news)).join('');
}

/**
 * Renderiza las noticias trending en el sidebar
 */
function renderTrending() {
    const trendingNews = newsData.filter(news => news.trending).slice(0, 5);
    DOM.trendingNews.innerHTML = trendingNews
        .map((news, index) => createTrendingItem(news, index + 1))
        .join('');
}

/* ========================================
   Manejo del Menú Móvil
   ======================================== */

/**
 * Abre o cierra el menú móvil
 */
function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    DOM.menuToggle.classList.toggle('active', state.isMobileMenuOpen);
    DOM.mainNav.classList.toggle('active', state.isMobileMenuOpen);

    // Crear capa superpuesta si no existe
    let overlay = document.querySelector('.nav__overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav__overlay';
        DOM.mainNav.parentNode.insertBefore(overlay, DOM.mainNav.nextSibling);
        overlay.addEventListener('click', toggleMobileMenu);
    }
    overlay.classList.toggle('active', state.isMobileMenuOpen);
}

/**
 * Cierra el menú móvil
 */
function closeMobileMenu() {
    if (state.isMobileMenuOpen) {
        state.isMobileMenuOpen = false;
        DOM.menuToggle.classList.remove('active');
        DOM.mainNav.classList.remove('active');
        const overlay = document.querySelector('.nav__overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
}

/* ========================================
   Filtrado por Categoría
   ======================================== */

/**
 * Maneja el cambio de categoría desde la navegación
 * @param {Event} event - Evento del click
 */
function handleNavClick(event) {
    const link = event.target.closest('.nav__link');
    if (!link) return;

    event.preventDefault();
    const category = link.dataset.category;

    // Actualizar estado e interfaz de usuario
    state.currentCategory = category;
    DOM.navLinks.forEach(navLink => {
        navLink.classList.toggle('nav__link--active', navLink.dataset.category === category);
    });

    // Actualizar select del filtro
    DOM.categoryFilter.value = category;

    // Cerrar menú móvil si está abierto
    closeMobileMenu();

    // Renderizar noticias
    renderNews();
}

/**
 * Maneja el cambio de categoría desde el select
 * @param {Event} event - Evento del cambio
 */
function handleFilterChange(event) {
    state.currentCategory = event.target.value;

    // Actualizar navegación activa
    DOM.navLinks.forEach(navLink => {
        navLink.classList.toggle(
            'nav__link--active',
            navLink.dataset.category === state.currentCategory
        );
    });

    renderNews();
}

/* ========================================
   Inicialización
   ======================================== */

/**
 * Inicializa la aplicación
 */
function init() {
    // Mostrar fecha actual
    DOM.currentDate.textContent = formatCurrentDate();

    // Renderizar contenido inicial
    renderNews();
    renderTrending();

    // Escuchadores de Eventos - Navegación
    DOM.menuToggle.addEventListener('click', toggleMobileMenu);
    DOM.mainNav.addEventListener('click', handleNavClick);

    // Escuchadores de Eventos - Filtro
    DOM.categoryFilter.addEventListener('change', handleFilterChange);


    // Cerrar menú al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
