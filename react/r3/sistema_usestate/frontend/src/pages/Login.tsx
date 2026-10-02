// Login: vista de inicio de sesión (sin React Router, recibe callbacks).
// Propósito: capturar email y contraseña con useForm, iniciar sesión y avisar
// al padre (onExito) para que cambie de vista.
// Dependencias: react (useState), react-hook-form, AuthContext, api.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";

interface PropsLogin {
    onExito: () => void;
    irARegistro: () => void;
}

interface DatosLogin {
    email: string;
    contrasena: string;
}

function Login({ onExito, irARegistro }: PropsLogin) {
    const { iniciarSesion } = useAuth();
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
            onExito();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor--centrado">
            <form className="tarjeta tarjeta--estrecha formulario" onSubmit={handleSubmit(manejarEnvio)}>
                <h1 className="titulo">Iniciar sesión</h1>

                <label className="etiqueta">
                    Email
                    <input
                        type="email"
                        className="entrada"
                        placeholder="tu@email.com"
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

                <p className="detalle__campo">
                    ¿No tenés cuenta?{" "}
                    <button type="button" className="boton--enlace" onClick={irARegistro}>
                        Registrate
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Login;
