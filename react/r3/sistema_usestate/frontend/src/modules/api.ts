// api: instancia de Axios configurada para hablar con el backend.
// Dependencias: axios.
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4001/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function obtenerMensajeError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const datos = error.response?.data as { mensaje?: string } | undefined;
        return datos?.mensaje ?? "Ocurrió un error inesperado.";
    }
    return "Ocurrió un error inesperado.";
}

export default api;
