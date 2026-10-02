// Registro: vista para crear una cuenta (sin React Router, recibe callbacks).
// Dependencias: react (useState), react-hook-form, AuthContext, api.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { obtenerMensajeError } from "../modules/api";

interface PropsRegistro {
    onExito: () => void;
    irALogin: () => void;
}

interface DatosRegistro {
    nombre: string;
    email: string;
    contrasena: string;
}

function Registro({ onExito, irALogin }: PropsRegistro) {
    const { registrar } = useAuth();
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
            onExito();
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
                    <button type="button" className="boton--enlace" onClick={irALogin}>
                        Iniciá sesión
                    </button>
                </p>
            </form>
        </div>
    );
}

export default Registro;
