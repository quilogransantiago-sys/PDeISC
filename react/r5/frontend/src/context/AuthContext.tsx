// AuthContext: contexto global de autenticación.
// Propósito: guardar el usuario autenticado y el token, y exponer las funciones
// iniciarSesion, registrar y cerrarSesion. Persiste el token en localStorage.
// Dependencias: react (createContext, useContext, useState, useEffect), api, tipos.
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import api from "../modules/api";
import type { Usuario } from "../modules/tipos";

// Tipo que describe lo que expone el contexto.
interface ContextoAuth {
    usuario: Usuario | null;
    iniciarSesion: (email: string, contrasena: string) => Promise<void>;
    registrar: (nombre: string, email: string, contrasena: string) => Promise<void>;
    cerrarSesion: () => void;
    iniciarSesionSocial: (tokenAuth0: string) => Promise<void>;
}

// Se crea el contexto con valor inicial null.
const AuthContext = createContext<ContextoAuth | null>(null);

// Provider: envuelve la app y provee el estado de autenticación.
export function AuthProvider({ children }: { children: ReactNode }) {
    // Estado del usuario autenticado (null = no hay sesión).
    // Se inicializa de forma síncrona desde localStorage para que RutaProtegida
    // no redirija a /login antes de cargar la sesión al recargar la página.
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const token = localStorage.getItem("token");
        const usuarioGuardado = localStorage.getItem("usuario");
        if (token && usuarioGuardado) {
            try {
                return JSON.parse(usuarioGuardado) as Usuario;
            } catch {
                return null;
            }
        }
        return null;
    });

    // Inicia sesión: llama a la API, guarda token/usuario y actualiza el estado.
    const iniciarSesion = async (email: string, contrasena: string) => {
        const respuesta = await api.post("/auth/login", { email, contrasena });
        const { token, usuario: datos } = respuesta.data;
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(datos));
        setUsuario(datos);
    };

    // Registra un usuario nuevo y entra directo (auto-login): guarda token/usuario.
    const registrar = async (nombre: string, email: string, contrasena: string) => {
        const respuesta = await api.post("/auth/registro", { nombre, email, contrasena });
        const { token, usuario: datos } = respuesta.data;
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(datos));
        setUsuario(datos);
    };

    // Login social (OAuth 2.0 / Auth0): envía el token de Auth0 al backend,
    // que crea/víncula el usuario y devuelve el JWT propio de la app.
    const iniciarSesionSocial = async (tokenAuth0: string) => {
        const respuesta = await api.post("/auth/social", { token: tokenAuth0 });
        const { token, usuario: datos } = respuesta.data;
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(datos));
        setUsuario(datos);
    };

    // Cierra sesión: limpia localStorage y el estado.
    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{ usuario, iniciarSesion, registrar, cerrarSesion, iniciarSesionSocial }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Hook para consumir el contexto desde cualquier componente.
export function useAuth(): ContextoAuth {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider.");
    }
    return contexto;
}
