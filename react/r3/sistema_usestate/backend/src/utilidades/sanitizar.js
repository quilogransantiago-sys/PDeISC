// sanitizar: utilidades para limpiar entradas y prevenir XSS.
// Propósito: reemplazar caracteres especiales de HTML por entidades seguras,
// de modo que si un usuario escribe <script> no se ejecute al mostrarlo.

// Escapa un string para que sea seguro mostrarlo en HTML.
export function escaparHTML(texto) {
    if (typeof texto !== "string") return texto;
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Recorta espacios y escapa HTML (se usa para nombre/email).
export function sanitizarTexto(texto) {
    return escaparHTML(String(texto ?? "").trim());
}
