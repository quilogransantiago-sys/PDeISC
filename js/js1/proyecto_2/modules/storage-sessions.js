/**
 * storage-session.js - sessionStorage, ciclo de vida por pestaña.
 */

const SESSION_KEY = 'iphone_session_quotes';

export function getQuotes() {
    const raw = sessionStorage.getItem(SESSION_KEY);
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
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
}

export function clearQuotes() {
    sessionStorage.removeItem(SESSION_KEY);
}