// api: instancia de Axios configurada para hablar con el backend.
// Propósito: centralizar la URL base y agregar el token JWT a cada petición.
// Dependencias: axios.
import axios from "axios";

// Crea la instancia con la URL base del backend.
const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

// Interceptor de petición: agrega el header Authorization con el token
// guardado en localStorage (si existe), para las rutas protegidas.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Helper: extrae el mensaje de error que devuelve la API (o uno genérico).
export function obtenerMensajeError(error: unknown): string {
    // Los errores de Axios traen la respuesta en "error.response.data.mensaje".
    if (axios.isAxiosError(error)) {
        const datos = error.response?.data as { mensaje?: string } | undefined;
        return datos?.mensaje ?? "Ocurrió un error inesperado.";
    }
    return "Ocurrió un error inesperado.";
}

export default api;
