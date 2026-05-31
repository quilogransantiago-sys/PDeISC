// ===========================================
// newsData.js - Datos de noticias (8 noticias, 4 temas)
// Propósito: exportar un array con objetos de noticias.
// Cada noticia contiene: id, tema, título, resumen, imagen (url placeholder),
// contenidoExpandido (texto largo que se muestra al hacer click).
// ===========================================

export const noticias = [
    // FÚTBOL (2 noticias)
    {
        id: 1,
        tema: "Fútbol",
        titulo: "Argentina campeón del mundo: el regreso triunfal",
        resumen: "La selección argentina conquistó su tercera estrella tras vencer a Francia en una final épica.",
        imagen: "https://picsum.photos/id/104/400/200",  // placeholder
        contenidoExpandido: "El partido terminó 3-3 y en los penales el equipo de Messi se impuso 4-2. Miles de personas salieron a las calles de Buenos Aires para celebrar. Fue una de las finales más emocionantes de la historia del fútbol."
    },
    {
        id: 2,
        tema: "Fútbol",
        titulo: "Nuevo formato de Champions League 2025",
        resumen: "La UEFA implementa cambios radicales: fase de liga con 36 equipos.",
        imagen: "https://picsum.photos/id/30/400/200",
        contenidoExpandido: "Cada equipo jugará ocho partidos contra rivales diferentes. Los ocho primeros clasifican directo a octavos, del 9º al 24º disputan una eliminatoria adicional. Se espera más emoción y partidos de alto nivel desde el inicio."
    },
    // JUEGOS (2 noticias)
    {
        id: 3,
        tema: "Juegos",
        titulo: "GTA VI: nuevo tráiler rompe récords",
        resumen: "Rockstar Games publica el segundo adelanto con escenas de Vice City.",
        imagen: "https://picsum.photos/id/96/400/200",
        contenidoExpandido: "El tráiler superó las 100 millones de visitas en 24 horas. Se confirma la fecha de lanzamiento para finales de 2025 en consolas, y 2026 en PC. Incluirá dos protagonistas y un mapa más grande que nunca."
    },
    {
        id: 4,
        tema: "Juegos",
        titulo: "Nintendo Switch 2: filtraciones y expectativas",
        resumen: "Nuevos detalles sobre la consola sucesora de la híbrida más famosa.",
        imagen: "https://picsum.photos/id/20/400/200",
        contenidoExpandido: "Según fuentes internas, tendrá retrocompatibilidad, pantalla LCD de 8 pulgadas y joy-con magnéticos. Se anunciaría en marzo de 2025. Los fans esperan un rendimiento cercano a PS4 Pro."
    },
    // POLÍTICA (2 noticias)
    {
        id: 5,
        tema: "Política",
        titulo: "Nuevo tratado de cooperación entre España y Alemania",
        resumen: "Ambos países firman un acuerdo energético y tecnológico por 10 años.",
        imagen: "https://picsum.photos/id/60/400/200",
        contenidoExpandido: "El pacto incluye inversiones en hidrógeno verde, formación profesional dual y proyectos de inteligencia artificial. Se creará un fondo común de 5.000 millones de euros. Los líderes destacaron la importancia de la unidad europea."
    },
    {
        id: 6,
        tema: "Política",
        titulo: "Elecciones en Brasil: segunda vuelta reñida",
        resumen: "Los candidatos intensifican campañas a dos semanas del ballotage.",
        imagen: "https://picsum.photos/id/52/400/200",
        contenidoExpandido: "Las encuestas muestran un empate técnico. Los debates por televisión definieron temas clave como economía y medio ambiente. La participación ciudadana podría ser récord. El resultado impactará en toda la región."
    },
    // ECONOMÍA (2 noticias)
    {
        id: 7,
        tema: "Economía",
        titulo: "Inflación en descenso: buenas noticias para el bolsillo",
        resumen: "El IPC bajó al 3,2% interanual, el nivel más bajo en tres años.",
        imagen: "https://picsum.photos/id/28/400/200",
        contenidoExpandido: "La moderación de precios se debe a la baja en energía y alimentos. Los bancos centrales evalúan recortes de tasas. Analistas pronostican un crecimiento del PIB del 2,5% para el próximo semestre."
    },
    {
        id: 8,
        tema: "Economía",
        titulo: "Bitcoin supera los 80 mil dólares: nuevo máximo histórico",
        resumen: "La criptomoneda líder rompe barreras tras la aprobación de ETFs.",
        imagen: "https://picsum.photos/id/26/400/200",
        contenidoExpandido: "La demanda institucional y la reducción a la mitad (halving) impulsaron el rally. Expertos advierten sobre volatilidad, pero muchos proyectan los 100 mil para fin de año. Las altcoins también subieron con fuerza."
    }
];