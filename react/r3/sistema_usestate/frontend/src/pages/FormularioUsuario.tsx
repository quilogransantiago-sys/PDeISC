// FormularioUsuario: vista para crear o editar un usuario (sin React Router).
// Propósito: usar useForm para capturar nombre, email y contraseña. En edición
// precarga los datos (recibe id por props) y la contraseña es opcional.
// Dependencias: react (useState, useEffect), react-hook-form, api.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api, { obtenerMensajeError } from "../modules/api";

interface PropsFormulario {
    id?: number;
    onGuardado: () => void;
    onCancelar: () => void;
}

interface DatosFormulario {
    nombre: string;
    email: string;
    contrasena: string;
}

function FormularioUsuario({ id, onGuardado, onCancelar }: PropsFormulario) {
    const esEdicion = Boolean(id);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DatosFormulario>();

    useEffect(() => {
        if (id) {
            const cargar = async () => {
                try {
                    const respuesta = await api.get(`/usuarios/${id}`);
                    reset({
                        nombre: respuesta.data.nombre,
                        email: respuesta.data.email,
                        contrasena: "",
                    });
                } catch (err) {
                    setError(obtenerMensajeError(err));
                }
            };
            cargar();
        }
    }, [id, reset]);

    const manejarEnvio = async (datos: DatosFormulario) => {
        setError("");
        try {
            if (esEdicion) {
                const cuerpo: { nombre: string; email: string; contrasena?: string } = {
                    nombre: datos.nombre,
                    email: datos.email,
                };
                if (datos.contrasena) {
                    cuerpo.contrasena = datos.contrasena;
                }
                await api.put(`/usuarios/${id}`, cuerpo);
            } else {
                await api.post("/usuarios", datos);
            }
            onGuardado();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    return (
        <div className="contenedor--centrado">
            <form
                className="tarjeta tarjeta--estrecha formulario"
                onSubmit={handleSubmit(manejarEnvio)}
            >
                <h1 className="titulo">
                    {esEdicion ? "Editar usuario" : "Nuevo usuario"}
                </h1>

                <label className="etiqueta">
                    Nombre
                    <input
                        type="text"
                        className="entrada"
                        placeholder="Nombre"
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
                    Contraseña{" "}
                    {esEdicion && (
                        <span className="detalle__campo">(dejar vacía para no cambiarla)</span>
                    )}
                    <input
                        type="password"
                        className="entrada"
                        placeholder={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                        {...register("contrasena", {
                            required: esEdicion ? false : "La contraseña es obligatoria.",
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

                <div className="fila">
                    <button className="boton boton--primario" type="submit">
                        {esEdicion ? "Guardar cambios" : "Crear"}
                    </button>
                    <button type="button" className="boton boton--secundario" onClick={onCancelar}>
                        Atrás
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioUsuario;
