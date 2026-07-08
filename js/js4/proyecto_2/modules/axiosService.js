/**
 * axiosService.js - Módulo para enviar datos a la API usando Axios.
 * Exporta función postUserAxios que recibe { name, email } y retorna el ID.
 */
import axios from 'axios';

export async function postUserAxios(userData) {
    const response = await axios.post('/api/users', userData);
    return response.data.id; // Devuelve solo el ID
}