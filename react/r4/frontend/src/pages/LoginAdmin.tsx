// LoginAdmin: pantalla de acceso al panel de administración.
// Propósito: capturar email y contraseña con useForm y llamar a iniciarSesion.
// Al autenticarse, App.tsx muestra el panel automáticamente.
// Dependencias: react-hook-form, AuthContext, api, useTema.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";
import { useTema } from "../scripts/useTema";

interface DatosLogin {
    email: string;
    contrasena: string;
}

function LoginAdmin() {
    const { iniciarSesion } = useAuth();
    const { tema, alternarTema } = useTema();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DatosLogin>();

    const manejarEnvio = async (datos: DatosLogin) => {
        setError("");
        try {
            await iniciarSesion(datos.email, datos.contrasena);
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor--centrado">
            <button className="boton-tema" onClick={alternarTema} aria-label="Cambiar tema" style={{ position: "fixed", top: 16, right: 16 }}>
                {tema === "claro" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                )}
            </button>

            <form className="tarjeta tarjeta--estrecha formulario" onSubmit={handleSubmit(manejarEnvio)}>
                <h1 className="seccion__titulo">Acceso de administrador</h1>

                <label className="etiqueta">
                    Email
                    <input
                        type="email"
                        className="entrada"
                        placeholder="admin@portfolio.com"
                        {...register("email", { required: "El email es obligatorio." })}
                    />
                </label>
                {errors.email && <p className="error">{errors.email.message}</p>}

                <label className="etiqueta">
                    Contraseña
                    <input
                        type="password"
                        className="entrada"
                        placeholder="••••••"
                        {...register("contrasena", { required: "La contraseña es obligatoria." })}
                    />
                </label>
                {errors.contrasena && <p className="error">{errors.contrasena.message}</p>}

                {error && <p className="error">{error}</p>}

                <button className="boton boton--primario" type="submit">
                    Entrar
                </button>

                <Link to="/" className="boton--enlace" style={{ textAlign: "center" }}>
                    Volver al portfolio
                </Link>
            </form>
        </div>
    );
}

export default LoginAdmin;
