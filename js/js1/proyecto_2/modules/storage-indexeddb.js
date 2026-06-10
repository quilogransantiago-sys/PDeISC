/**
 * storage-indexeddb.js - Usa IndexedDB para almacenar cotizaciones de forma persistente y con gran capacidad.
 * Base de datos: 'iPhoneDB', object store: 'quotes'.
 */

let db = null;
const DB_NAME = 'iPhoneDB';
const STORE_NAME = 'quotes';
const DB_VERSION = 1;

// Abrir/crear la base de datos (promesa)
export function openDB() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                // Clave autoincrementable
                database.createObjectStore(STORE_NAME, { autoIncrement: true });
            }
        };
    });
}

// Obtener todas las cotizaciones
export async function getQuotes() {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

// Agregar una nueva cotización
export async function addQuote(quote) {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(quote);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Borrar todas las cotizaciones
export async function clearQuotes() {
    const database = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}