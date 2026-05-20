/**
 * storage.js - Módulo para manejar persistencia en localStorage.
 * Proporciona funciones CRUD básicas para el array de personas.
 */

const STORAGE_KEY = 'personas_app';

/**
 * Obtiene el array de personas desde localStorage.
 * @returns {Array} Lista de personas (vacía si no hay datos).
 */
export function getPeople() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Error parsing localStorage', e);
        return [];
    }
}

/**
 * Guarda el array completo de personas en localStorage.
 * @param {Array} people - Lista de personas.
 */
export function savePeople(people) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

/**
 * Agrega una nueva persona al almacenamiento.
 * @param {Object} person - Datos de la persona (sin id).
 * @returns {Object} La persona con id asignado.
 */
export function addPerson(person) {
    const people = getPeople();
    const newPerson = { ...person, id: Date.now() };
    people.push(newPerson);
    savePeople(people);
    return newPerson;
}

/**
 * Elimina una persona por su id.
 * @param {number} id - Identificador único.
 * @returns {boolean} true si se eliminó, false si no existía.
 */
export function deletePerson(id) {
    const people = getPeople();
    const filtered = people.filter(p => p.id !== id);
    if (filtered.length === people.length) return false;
    savePeople(filtered);
    return true;
}