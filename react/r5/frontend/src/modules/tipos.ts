// tipos: tipos compartidos de la aplicación.
// Propósito: centralizar la "forma" de los datos que viajan entre la API y el frontend.

// Tipo que describe un usuario (tal como lo devuelve la API).
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol?: "admin" | "usuario"; // rol del usuario (controla permisos)
    fecha_creacion?: string;
}
