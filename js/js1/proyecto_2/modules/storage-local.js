/**
 * storage-local.js - Gestión de localStorage para guardar un array de cotizaciones.
 * Persistencia indefinida, capacidad ~5MB.
 */

const STORAGE_KEY = 'iphone_local_quotes';

export function getQuotes() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function addQuote(quote) {
    const current = getQuotes();
    const updated = [quote, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearQuotes() {
    localStorage.removeItem(STORAGE_KEY);
}