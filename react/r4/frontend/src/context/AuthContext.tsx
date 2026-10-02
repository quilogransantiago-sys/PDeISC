// AuthContext: contexto de autenticación del administrador.
// Propósito: guardar si el admin está autenticado y exponer iniciarSesion/cerrarSesion.
// Dependencias: react (createContext, useContext, useState, useEffect), api.
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import api from "../modules/api";

interface ContextoAuth {
    autenticado: boolean;
    adminEmail: string;
    iniciarSesion: (email: string, contrasena: string) => Promise<void>;
    cerrarSesion: () => void;
}

const AuthContext = createContext<ContextoAuth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Estado de la sesión. Se inicializa de forma síncrona desde localStorage
    // para que la ruta protegida no redirija al login antes de cargar la sesión.
    const [autenticado, setAutenticado] = useState<boolean>(() => {
        return Boolean(localStorage.getItem("token"));
    });
    const [adminEmail, setAdminEmail] = useState<string>(() => {
        return localStorage.getItem("adminEmail") ?? "";
    });

    // Inicia sesión del admin: guarda token y email.
    const iniciarSesion = async (email: string, contrasena: string) => {
        const respuesta = await api.post("/auth/login", { email, contrasena });
        const { token, admin } = respuesta.data;
        localStorage.setItem("token", token);
        localStorage.setItem("adminEmail", admin.email);
        setAutenticado(true);
        setAdminEmail(admin.email);
    };

    // Cierra sesión: limpia localStorage y el estado.
    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        setAutenticado(false);
        setAdminEmail("");
    };

    return (
        <AuthContext.Provider value={{ autenticado, adminEmail, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): ContextoAuth {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider.");
    }
    return contexto;
}
