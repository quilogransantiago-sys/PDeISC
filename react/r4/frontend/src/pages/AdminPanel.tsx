// AdminPanel: panel de administración del portfolio.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { URL_BACKEND, obtenerMensajeError } from "../modules/api";
import { useAuth } from "../context/AuthContext";
import { useTema } from "../scripts/useTema";

// Tipo de un registro genérico.
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

// Editor genérico de una sección (CRUD + subida de imagen).
function EditorSeccion({ tabla }: { tabla: string }) {
    const campos = SECCIONES[tabla];
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [formulario, setFormulario] = useState<Registro>({});
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

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

    const manejarCampo = (nombre: string, valor: string | number) => {
        setFormulario((anterior) => ({ ...anterior, [nombre]: valor }));
    };

    const subirImagen = async (campo: string, archivo: File | null) => {
        if (!archivo) return;
        const datos = new FormData();
        datos.append("imagen", archivo);
        try {
            const respuesta = await api.post("/subir-imagen", datos);
            manejarCampo(campo, respuesta.data.url);
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    const guardar = async () => {
        setError("");
        setExito("");
        try {
            if (editandoId === null) {
                await api.post(`/${tabla}`, formulario);
                setExito("Creado correctamente.");
            } else {
                await api.put(`/${tabla}/${editandoId}`, formulario);
                setExito("Actualizado correctamente.");
            }
            setFormulario({});
            setEditandoId(null);
            cargar();
        } catch (err) {
            setError(obtenerMensajeError(err));
        }
    };

    const editar = (registro: Registro) => {
        setEditandoId(registro.id as number);
        setFormulario({ ...registro });
    };

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
        <div className="editor">
            <h2 className="seccion__titulo">{tabla.charAt(0).toUpperCase() + tabla.slice(1)}</h2>

            <div className="tarjeta formulario mb-2">
                {campos.map((campo) => (
                    <label key={campo.nombre} className="etiqueta">
                        {campo.etiqueta}
                        {campo.tipo === "area" ? (
                            <textarea
                                className="entrada"
                                value={String(formulario[campo.nombre] ?? "")}
                                onChange={(e) => manejarCampo(campo.nombre, e.target.value)}
                            />
                        ) : campo.tipo === "numero" ? (
                            <input
                                type="number"
                                className="entrada"
                                value={Number(formulario[campo.nombre] ?? 0)}
                                onChange={(e) => manejarCampo(campo.nombre, Number(e.target.value))}
                            />
                        ) : campo.tipo === "imagen" ? (
                            <div className="fila">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => subirImagen(campo.nombre, e.target.files?.[0] ?? null)}
                                />
                                {formulario[campo.nombre] && (
                                    <img
                                        className="tarjeta__imagen"
                                        src={URL_BACKEND + String(formulario[campo.nombre])}
                                        alt="preview"
                                    />
                                )}
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="entrada"
                                value={String(formulario[campo.nombre] ?? "")}
                                onChange={(e) => manejarCampo(campo.nombre, e.target.value)}
                            />
                        )}
                    </label>
                ))}

                {error && <p className="error">{error}</p>}
                {exito && <p className="exito">{exito}</p>}

                <div className="fila">
                    <button className="boton boton--primario" onClick={guardar}>
                        {editandoId === null ? "Crear" : "Guardar cambios"}
                    </button>
                    {editandoId !== null && (
                        <button
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
            </div>

            <div className="lista">
                {registros.map((registro) => (
                    <div key={registro.id} className="usuario-item">
                        <div className="usuario-item__info">
                            <span className="usuario-item__nombre">
                                {String(registro[SECCIONES[tabla][0].nombre])}
                            </span>
                        </div>
                        <div className="usuario-item__acciones">
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
                    <Link className="header__enlace" to="/">Ver portfolio</Link>
                    <span className="header__enlace">{adminEmail}</span>
                    <button className="boton boton--secundario" onClick={cerrarSesion}>
                        Cerrar sesión
                    </button>
                    <button className="boton-tema" onClick={alternarTema} aria-label="Cambiar tema">
                        {tema === "claro" ? "🌙" : "☀️"}
                    </button>
                </nav>
            </header>

            <div className="panel">
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

                <EditorSeccion tabla={pestanaActiva} />
            </div>
        </>
    );
}

export default AdminPanel;
