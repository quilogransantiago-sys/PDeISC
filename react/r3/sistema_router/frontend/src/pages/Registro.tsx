// Registro: página para crear una cuenta nueva.
// Propósito: capturar nombre, email y contraseña con useForm, llamar a registrar
// y volver al login. Muestra errores en pantalla (sin alert()).
// Dependencias: react-hook-form, react-router-dom, AuthContext, api.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";

interface DatosRegistro {
    nombre: string;
    email: string;
    contrasena: string;
}

function Registro() {
    const { registrar } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DatosRegistro>();

    const manejarEnvio = async (datos: DatosRegistro) => {
        setError("");
        try {
            await registrar(datos.nombre, datos.email, datos.contrasena);
            navigate("/");
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor--centrado">
            <form className="tarjeta tarjeta--estrecha formulario" onSubmit={handleSubmit(manejarEnvio)}>
                <h1 className="titulo">Crear cuenta</h1>

                <label className="etiqueta">
                    Nombre
                    <input
                        type="text"
                        className="entrada"
                        placeholder="Tu nombre"
                        {...register("nombre", { required: "El nombre es obligatorio." })}
                    />
                </label>
                {errors.nombre && <p className="error">{errors.nombre.message}</p>}

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
                        placeholder="Mínimo 6 caracteres"
                        {...register("contrasena", {
                            required: "La contraseña es obligatoria.",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                                message:
                                    "Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial.",
                            },
                        })}
                    />
                </label>
                {errors.contrasena && <p className="error">{errors.contrasena.message}</p>}

                {error && <p className="error">{error}</p>}

                <button className="boton boton--primario" type="submit">
                    Registrarse
                </button>

                <p className="detalle__campo">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login" className="boton--enlace">Iniciá sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default Registro;
