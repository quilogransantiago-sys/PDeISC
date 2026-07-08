// axiosService.js - obtiene usuarios con axios
import axios from 'axios';
export async function fetchUsersAxios() {
    const start = performance.now();
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    const elapsed = (performance.now() - start).toFixed(1);
    return {
        users: res.data.map(({ name, email }) => ({ name, email })),
        elapsed
    };
}