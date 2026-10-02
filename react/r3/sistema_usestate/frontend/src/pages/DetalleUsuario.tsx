// DetalleUsuario: vista con la información completa de un usuario.
// Propósito: recibir el id por props, cargar el usuario desde la API y mostrar
// su nombre, email y fecha. Acciones (volver, editar) vía callbacks.
// Dependencias: react (useState, useEffect), api, tipos.
import { useEffect, useState } from "react";
import api, { obtenerMensajeError } from "../modules/api";
import type { Usuario } from "../modules/tipos";

interface PropsDetalle {
    id: number;
    onVolver: () => void;
    onEditar: (id: number) => void;
}

function DetalleUsuario({ id, onVolver, onEditar }: PropsDetalle) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const respuesta = await api.get<Usuario>(`/usuarios/${id}`);
                setUsuario(respuesta.data);
            } catch (err) {
                setError(obtenerMensajeError(err));
            }
        };
        cargar();
    }, [id]);

    if (error) {
        return (
            <div className="contenedor">
                <p className="error mb-1">{error}</p>
                <button className="boton boton--secundario" onClick={onVolver}>
                    Volver
                </button>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="contenedor">
                <p className="detalle__campo">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="contenedor">
            <button className="boton boton--secundario mb-2" onClick={onVolver}>
                Atrás
            </button>

            <div className="tarjeta detalle">
                <h1 className="titulo">{usuario.nombre}</h1>
                <p className="detalle__campo">
                    Email: <span className="detalle__valor">{usuario.email}</span>
                </p>
                {usuario.fecha_creacion && (
                    <p className="detalle__campo">
                        Fecha de creación:{" "}
                        <span className="detalle__valor">
                            {new Date(usuario.fecha_creacion).toLocaleString()}
                        </span>
                    </p>
                )}
                <div className="fila">
                    <button className="boton boton--primario" onClick={() => onEditar(usuario.id)}>
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetalleUsuario;
