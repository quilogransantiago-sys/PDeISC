// AdminPanel: panel de administración del portfolio.
// Propósito: permitir al admin crear/editar/eliminar cada sección y subir imágenes.
// Dependencias: react (useState, useEffect), react-router-dom, api, useAuth, useTema.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { URL_BACKEND, obtenerMensajeError } from "../modules/api";
import { useAuth } from "../context/AuthContext";
import { useTema } from "../scripts/useTema";

// Tipo de un registro genérico (cada sección tiene campos distintos).
type Registro = Record<string, string | number>;

// Describe un campo editable.
interface Campo {
    nombre: string;
    etiqueta: string;
    tipo: "texto" | "area" | "numero" | "imagen";
}

// Definición de los campos de cada sección.
const SECCIONES: Record<string, Campo[]> = {
    datos: [
        { nombre: "nombre", etiqueta: "Nombre", tipo: "texto" },
        { nombre: "profesion", etiqueta: "Profesión", tipo: "texto" },
        { nombre: "bio", etiqueta: "Biografía", tipo: "area" },
        { nombre: "email", etiqueta: "Email", tipo: "texto" },
        { nombre: "foto", etiqueta: "Foto de perfil", tipo: "imagen" },
        { nombre: "linkedin", etiqueta: "LinkedIn (URL)", tipo: "texto" },
        { nombre: "github", etiqueta: "GitHub (URL)", tipo: "texto" },
    ],
    habilidades: [
        { nombre: "nombre", etiqueta: "Nombre", tipo: "texto" },
        { nombre: "nivel", etiqueta: "Nivel (0-100)", tipo: "numero" },
        { nombre: "imagen", etiqueta: "Imagen", tipo: "imagen" },
    ],
    experiencias: [
        { nombre: "cargo", etiqueta: "Cargo", tipo: "texto" },
        { nombre: "lugar", etiqueta: "Lugar", tipo: "texto" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "texto" },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "area" },
    ],
    proyectos: [
        { nombre: "nombre", etiqueta: "Nombre", tipo: "texto" },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "area" },
        { nombre: "imagen", etiqueta: "Imagen", tipo: "imagen" },
        { nombre: "link", etiqueta: "Link", tipo: "texto" },
    ],
    logros: [
        { nombre: "titulo", etiqueta: "Título", tipo: "texto" },
        { nombre: "descripcion", etiqueta: "Descripción", tipo: "area" },
        { nombre: "fecha", etiqueta: "Fecha", tipo: "texto" },
    ],
};
// Componente genérico que administra una sección (CRUD + subida de imagen).
function EditorSeccion({ tabla }: { tabla: string }) {
    const campos = SECCIONES[tabla];
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formulario, setFormulario] = useState<Registro>({});
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

    // Carga los registros de la sección.
    const cargar = async () => {
        try {
            const respuesta = await api.get(`/${tabla}`);
            setRegistros(respuesta.data);
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    useEffect(() => {
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabla]);

    // Actualiza un campo del formulario.
    const manejarCampo = (nombre: string, valor: string | number) => {
        setFormulario((anterior) => ({ ...anterior, [nombre]: valor }));
    };

    // Sube una imagen y guarda su URL en el campo indicado.
    const subirArchivo = async (evento: React.ChangeEvent<HTMLInputElement>, nombreCampo: string) => {
        const archivo = evento.target.files?.[0];
        if (!archivo) return;
        const datos = new FormData();
        datos.append("imagen", archivo);
        try {
            const respuesta = await api.post("/subir-imagen", datos);
            manejarCampo(nombreCampo, respuesta.data.url);
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    // Crea o actualiza según haya edición o no.
    const guardar = async () => {
        setError("");
        setExito("");
        try {
            if (editandoId) {
                await api.put(`/${tabla}/${editandoId}`, formulario);
            } else {
                await api.post(`/${tabla}`, formulario);
            }
            setFormulario({});
            setEditandoId(null);
            setExito("Guardado correctamente.");
            cargar();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    // Carga un registro en el formulario para editarlo.
    const editar = (registro: Registro) => {
        setEditandoId(registro.id as number);
        setFormulario(registro);
    };

    // Elimina un registro.
    const eliminar = async (id: number) => {
        setError("");
        try {
            await api.delete(`/${tabla}/${id}`);
            cargar();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };
    return (
        <div>
            {/* Formulario de alta/edición. */}
            <form
                className="tarjeta formulario mb-2"
                onSubmit={(evento) => {
                    evento.preventDefault();
                    guardar();
                }}
            >
                <h3 className="tarjeta__titulo">
                    {editandoId ? "Editar" : "Agregar"}
                </h3>
                {campos.map((campo) => (
                    <label key={campo.nombre} className="etiqueta">
                        {campo.etiqueta}
                        {campo.tipo === "area" ? (
                            <textarea
                                className="entrada"
                                value={(formulario[campo.nombre] as string) ?? ""}
                                onChange={(e) => manejarCampo(campo.nombre, e.target.value)}
                            />
                        ) : campo.tipo === "numero" ? (
                            <input
                                type="number"
                                className="entrada"
                                value={(formulario[campo.nombre] as number) ?? ""}
                                onChange={(e) => manejarCampo(campo.nombre, Number(e.target.value))}
                            />
                        ) : campo.tipo === "imagen" ? (
                            <>
                                {formulario[campo.nombre] && (
                                    <img
                                        className="miniatura"
                                        src={URL_BACKEND + (formulario[campo.nombre] as string)}
                                        alt=""
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => subirArchivo(e, campo.nombre)}
                                />
                            </>
                        ) : (
                            <input
                                type="text"
                                className="entrada"
                                value={(formulario[campo.nombre] as string) ?? ""}
                                onChange={(e) => manejarCampo(campo.nombre, e.target.value)}
                            />
                        )}
                    </label>
                ))}
                <div className="fila">
                    <button type="submit" className="boton boton--primario">
                        {editandoId ? "Guardar" : "Agregar"}
                    </button>
                    {editandoId && (
                        <button
                            type="button"
                            className="boton boton--secundario"
                            onClick={() => {
                                setEditandoId(null);
                                setFormulario({});
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {error && <p className="error mb-1">{error}</p>}
            {exito && <p className="exito mb-1">{exito}</p>}

            {/* Lista de registros. */}
            <div className="panel__lista">
                {registros.map((registro) => (
                    <div key={registro.id} className="panel__item">
                        <strong>{String(registro[campos[0].nombre])}</strong>
                        <div className="panel__item-acciones">
                            <button className="boton boton--secundario" onClick={() => editar(registro)}>
                                Editar
                            </button>
                            <button className="boton boton--peligro" onClick={() => eliminar(registro.id as number)}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// Componente principal del panel: header + pestañas + editor de la sección activa.
function AdminPanel() {
    const { adminEmail, cerrarSesion } = useAuth();
    const { tema, alternarTema } = useTema();
    const [pestanaActiva, setPestanaActiva] = useState("datos");

    const pestanas = [
        { clave: "datos", etiqueta: "Datos personales" },
        { clave: "habilidades", etiqueta: "Habilidades" },
        { clave: "experiencias", etiqueta: "Experiencias" },
        { clave: "proyectos", etiqueta: "Proyectos" },
        { clave: "logros", etiqueta: "Logros" },
    ];

    return (
        <>
            <header className="header">
                <span className="header__marca">Panel de administración</span>
                <nav className="header__nav">
                    <Link className="header__enlace" to="/">
                        Ver portfolio
                    </Link>
                    <span className="header__enlace">{adminEmail}</span>
                    <button className="boton boton--secundario" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                    <button className="boton-tema" onClick={alternarTema} aria-label="Cambiar tema">
                        {tema === "claro" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                            </svg>
                        )}
                    </button>
                </nav>
            </header>

            <div className="panel">
                {/* Pestañas para elegir la sección a editar. */}
                <div className="panel__tabs">
                    {pestanas.map((pestana) => (
                        <button
                            key={pestana.clave}
                            className={
                                pestanaActiva === pestana.clave
                                    ? "panel__tab panel__tab--activo"
                                    : "panel__tab"
                            }
                            onClick={() => setPestanaActiva(pestana.clave)}
                        >
                            {pestana.etiqueta}
                        </button>
                    ))}
                </div>

                {/* Editor de la sección activa. */}
                <EditorSeccion tabla={pestanaActiva} />
            </div>
        </>
    );
}

export default AdminPanel;

