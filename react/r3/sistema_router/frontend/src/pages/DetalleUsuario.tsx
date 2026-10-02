// DetalleUsuario: página que muestra la información completa de un usuario.
// Propósito: leer el id de la URL (useParams), cargar el usuario desde la API
// y mostrar su nombre, email y fecha de creación.
// Dependencias: react (useState, useEffect), react-router-dom, api, tipos.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { obtenerMensajeError } from "../modules/api";
import type { Usuario } from "../modules/tipos";

function DetalleUsuario() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [error, setError] = useState("");

    // useEffect: carga el usuario cuando cambia el id de la URL.
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
                <button
                    className="boton boton--secundario"
                    onClick={() => navigate("/")}
                >
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
            <button
                className="boton boton--secundario mb-2"
                onClick={() => navigate("/")}
            >
                Atrás
            </button>

            <div className="tarjeta detalle">
                <h1 className="titulo">{usuario.nombre}</h1>
                <p className="detalle__campo">
                    Email:{" "}
                    <span className="detalle__valor">{usuario.email}</span>
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
                    <Link
                        to={`/editar/${usuario.id}`}
                        className="boton boton--primario"
                    >
                        Editar
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DetalleUsuario;
