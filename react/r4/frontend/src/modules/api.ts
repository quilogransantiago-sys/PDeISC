// api: instancia de Axios configurada para hablar con el backend.
import axios from "axios";

// URL base del backend (para armar las rutas de las imágenes subidas).
export const URL_BACKEND = "http://localhost:5000";

const api = axios.create({
    baseURL: `${URL_BACKEND}/api`,
});

// Interceptor: agrega el token JWT a cada petición (para las rutas protegidas).
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper: extrae el mensaje de error que devuelve la API.
export function obtenerMensajeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const datos = error.response?.data as { mensaje?: string } | undefined;
        return datos?.mensaje ?? "Ocurrió un error inesperado.";
    }
    return "Ocurrió un error inesperado.";
}

export default api;
