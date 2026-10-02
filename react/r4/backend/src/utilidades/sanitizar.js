// sanitizar: utilidades para limpiar entradas y prevenir XSS.
export function escaparHTML(texto) {
    if (typeof texto !== "string") return texto;
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function sanitizarTexto(texto) {
    return escaparHTML(String(texto ?? "").trim());
}
