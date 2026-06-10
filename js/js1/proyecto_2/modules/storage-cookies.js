/**
 * storage-cookies.js - Gestión de array de cotizaciones usando document.cookie
 * Capacidad limitada ~4KB, se guarda un JSON string con máximo 5 elementos.
 * Las cookies expiran en 7 días.
 */

const COOKIE_NAME = 'iphone_quotes';
const MAX_ITEMS = 5;

// Obtener todas las cotizaciones desde la cookie
export function getQuotes() {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(COOKIE_NAME + '='));
    if (!cookieValue) return [];
    try {
        const decoded = decodeURIComponent(cookieValue.split('=')[1]);
        return JSON.parse(decoded) || [];
    } catch {
        return [];
    }
}

// Guardar un array de cotizaciones en cookie (con expiración)
function saveQuotes(quotesArray) {
    const jsonStr = JSON.stringify(quotesArray.slice(0, MAX_ITEMS));
    const encoded = encodeURIComponent(jsonStr);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = `${COOKIE_NAME}=${encoded}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
}

// Agregar una nueva cotización (objeto quote) a la cookie
export function addQuote(quote) {
    const current = getQuotes();
    const newQuotes = [quote, ...current].slice(0, MAX_ITEMS);
    saveQuotes(newQuotes);
}

// Borrar todas las cotizaciones de cookie
export function clearQuotes() {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}