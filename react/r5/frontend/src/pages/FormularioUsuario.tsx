// FormularioUsuario: página para crear o editar un usuario.
// Propósito: usar useForm (react-hook-form) para capturar nombre, email y
// contraseña. En edición precarga los datos y la contraseña es opcional.
// Dependencias: react (useState, useEffect), react-hook-form, react-router-dom, api.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import api, { obtenerMensajeError } from "../modules/api";

// Tipo que describe los campos del formulario.
interface DatosFormulario {
    nombre: string;
    email: string;
    contrasena: string;
}

function FormularioUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DatosFormulario>();

    // useEffect: en modo edición, carga el usuario y precarga el formulario.
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

    // Envía el formulario: crea (POST) o actualiza (PUT).
    const manejarEnvio = async (datos: DatosFormulario) => {
        setError("");
        try {
            if (esEdicion) {
                // En edición, la contraseña solo se envía si se escribió una nueva.
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
            navigate("/");
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
                    <button
                        type="button"
                        className="boton boton--secundario"
                        onClick={() => navigate("/")}
                    >
                        Atrás
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioUsuario;
