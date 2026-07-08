/**
 * fetchService.js - Módulo para enviar datos a la API usando Fetch.
 * Exporta función postUserFetch que recibe { name, email } y retorna el ID.
 */
export async function postUserFetch(userData) {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data.id; // Devuelve solo el ID
}