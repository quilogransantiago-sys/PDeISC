import { fetchUsers } from '../modules/fetchService.js';
import { fetchUsersAxios } from '../modules/axiosService.js';
import { renderUsers, showStatus } from '../modules/renderer.js';
import { loadTheme, toggleTheme } from '../modules/themeManager.js';

loadTheme();

document.getElementById('fetchBtn').addEventListener('click', async () => {
    try {
        showStatus('Cargando con Fetch...');
        const { users, elapsed } = await fetchUsers();
        renderUsers(users, 'Fetch');
        showStatus(`Éxito: ${users.length} usuarios con Fetch en ${elapsed} ms`);
    } catch (e) {
        showStatus(`Error en Fetch: ${e.message}`, true);
    }
});

document.getElementById('axiosBtn').addEventListener('click', async () => {
    try {
        showStatus('Cargando con Axios...');
        const { users, elapsed } = await fetchUsersAxios();
        renderUsers(users, 'Axios');
        showStatus(`Éxito: ${users.length} usuarios con Axios en ${elapsed} ms`);
    } catch (e) {
        showStatus(`Error en Axios: ${e.message}`, true);
    }
});

document.getElementById('themeToggle').addEventListener('click', toggleTheme);