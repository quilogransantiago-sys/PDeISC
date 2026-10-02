// api: instancia de Axios configurada para hablar con el backend del portfolio.
// Dependencias: axios.
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Interceptor: agrega el token (admin) a cada petición si existe.
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

// URL base del backend (para armar la ruta completa de las imágenes subidas).
export const URL_BACKEND = "http://localhost:5000";

export default api;
