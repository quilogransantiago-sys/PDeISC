// fetchService.js - obtiene usuarios con fetch
export async function fetchUsers() {
    const start = performance.now();                // inicio cronómetro
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // error si no es 200
    const data = await res.json();                 // convertir a objeto
    const elapsed = (performance.now() - start).toFixed(1); // tiempo en ms
    return {
        users: data.map(({ name, email }) => ({ name, email })), // solo nombre y email
        elapsed
    };
}