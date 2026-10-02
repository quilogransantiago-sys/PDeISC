// RutaProtegida: componente que protege una ruta.
// Propósito: si no hay usuario autenticado, redirige a /login; si lo hay,
// muestra el contenido (children).
// Dependencias: react-router-dom (Navigate), AuthContext (useAuth).
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PropsRutaProtegida {
    children: ReactNode;
}

export function RutaProtegida({ children }: PropsRutaProtegida) {
    const { usuario } = useAuth();

    // Si no hay sesión, redirige a login (reemplaza la URL).
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // Si hay sesión, muestra el contenido.
    return <>{children}</>;
}
