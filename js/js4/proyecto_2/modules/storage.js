/**
 * storage.js - Persistencia en localStorage para el listado local.
 */
const STORAGE_KEY = 'users';

export function getUsers() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function addUser(user) {
    const users = getUsers();
    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = { ...user, id: newId };
    users.push(newUser);
    saveUsers(users);
    return newId;
}

export function updateUser(id, updatedData) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error(`Usuario ${id} no encontrado`);
    users[index] = { ...users[index], ...updatedData };
    saveUsers(users);
}

export function deleteUser(id) {
    const users = getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) throw new Error(`Usuario ${id} no encontrado`);
    saveUsers(filtered);
}

export function getUserById(id) {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
}