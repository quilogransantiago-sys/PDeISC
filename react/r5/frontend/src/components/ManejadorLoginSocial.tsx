// ManejadorLoginSocial: completa el login social después del redirect de Auth0.
// Propósito: cuando Auth0 ya autenticó (isAuthenticated) pero la app todavía no
// tiene sesión propia, envía el token de Auth0 al backend y navega a la lista.
// Se monta siempre (fuera de las rutas protegidas) para no depender del timing.
// Dependencias: react, react-router-dom, @auth0/auth0-react, AuthContext.
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";

export function ManejadorLoginSocial() {
    const { isAuthenticated, isLoading, getAccessTokenSilently, error, user } = useAuth0();
    const { usuario, iniciarSesionSocial } = useAuth();
    const navigate = useNavigate();
    const procesando = useRef(false);

    useEffect(() => {
        const manejar = async () => {
            // Espera a que el SDK termine de procesar el redirect callback.
            if (isLoading) return;
            console.log(
                "[LoginSocial] URL:", window.location.pathname + window.location.search,
                "isLoading:", isLoading,
                "isAuthenticated:", isAuthenticated,
                "errorAuth0:", error?.message,
                "userAuth0:", user?.email,
                "tieneSesionPropia:", Boolean(usuario)
            );
            // Solo actúa si Auth0 autenticó pero aún no hay sesión propia.
            if (!isAuthenticated || usuario) return;
            // Evita ejecuciones duplicadas (p. ej. StrictMode o re-renders).
            if (procesando.current) return;

            procesando.current = true;
            try {
                const token = await getAccessTokenSilently();
                if (!token) {
                    throw new Error("No se obtuvo el token de Auth0.");
                }
                await iniciarSesionSocial(token);
                navigate("/");
                // Éxito: se deja el flag en true para no reintentar (evita el alert duplicado).
            } catch (err) {
                console.error("Error en el login social:", err);
                window.alert("No se pudo completar el login social: " + obtenerMensajeError(err));
                procesando.current = false;
            }
        };
        manejar();
    }, [isLoading, isAuthenticated, usuario, getAccessTokenSilently, iniciarSesionSocial, navigate]);

    return null;
}
