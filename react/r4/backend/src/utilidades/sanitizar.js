// sanitizarTexto: limpia un texto (quita etiquetas HTML y espacios de más).
export function sanitizarTexto(valor) {
    if (typeof valor !== "string") return valor;
    return valor
        .replace(/<[^>]*>/g, "")
        .replace(/[\r\n]+/g, " ")
        .trim();
}
