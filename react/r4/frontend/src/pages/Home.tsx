// Home: página pública del portfolio (una sola página con secciones).
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api, { URL_BACKEND } from "../modules/api";
import { useTema } from "../scripts/useTema";
import type {
    DatosPersonales,
    Habilidad,
    Experiencia,
    Proyecto,
    Logro,
} from "../modules/tipos";

// Sección que se anima al aparecer en pantalla.
function SeccionAnimada({ id, children }: { id: string; children: ReactNode }) {
    return (
        <motion.section
            id={id}
            className="seccion"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
        >
            {children}
        </motion.section>
    );
}

function Home() {
    const { tema, alternarTema } = useTema();
    const [datos, setDatos] = useState<DatosPersonales | null>(null);
    const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
    const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [logros, setLogros] = useState<Logro[]>([]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [d, h, e, p, l] = await Promise.all([
                    api.get("/datos"),
                    api.get("/habilidades"),
                    api.get("/experiencias"),
                    api.get("/proyectos"),
                    api.get("/logros"),
                ]);
                setDatos(d.data[0] ?? null);
                setHabilidades(h.data);
                setExperiencias(e.data);
                setProyectos(p.data);
                setLogros(l.data);
            } catch (error) {
                console.error("Error al cargar el portfolio:", error);
            }
        };
        cargar();
    }, []);

    return (
        <>
            <header className="header">
                <a className="header__marca" href="#inicio">
                    {datos?.nombre || "Portfolio"}
                </a>
                <nav className="header__nav">
                    <a className="header__enlace" href="#sobre-mi">Sobre mí</a>
                    <a className="header__enlace" href="#habilidades">Habilidades</a>
                    <a className="header__enlace" href="#experiencias">Experiencias</a>
                    <a className="header__enlace" href="#proyectos">Proyectos</a>
                    <a className="header__enlace" href="#logros">Logros</a>
                    <a className="header__enlace" href="#contacto">Contacto</a>
                    <Link className="header__enlace" to="/admin">Admin</Link>
                    <button className="boton-tema" onClick={alternarTema} aria-label="Cambiar tema">
                        {tema === "claro" ? "🌙" : "☀️"}
                    </button>
                </nav>
            </header>

            <SeccionAnimada id="inicio">
                <div className="hero">
                    {datos?.foto && (
                        <img className="hero__foto" src={URL_BACKEND + datos.foto} alt={datos.nombre} />
                    )}
                    <h1 className="hero__nombre">{datos?.nombre || "Tu nombre"}</h1>
                    <p className="hero__profesion">{datos?.profesion || "Tu profesión"}</p>
                    {datos?.bio && <p className="hero__bio">{datos.bio}</p>}
                </div>
            </SeccionAnimada>

            <SeccionAnimada id="sobre-mi">
                <h2 className="seccion__titulo">Sobre mí</h2>
                <p className="tarjeta__texto">{datos?.bio || "Todavía no hay biografía."}</p>
            </SeccionAnimada>

            <SeccionAnimada id="habilidades">
                <h2 className="seccion__titulo">Habilidades</h2>
                <div className="grilla">
                    {habilidades.map((h) => (
                        <motion.div key={h.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            <h3 className="tarjeta__titulo">{h.nombre}</h3>
                            <div className="barra">
                                <div className="barra__relleno" style={{ width: `${h.nivel}%` }} />
                            </div>
                            <span className="tarjeta__subtitulo">{h.nivel}%</span>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            <SeccionAnimada id="experiencias">
                <h2 className="seccion__titulo">Experiencias</h2>
                <div className="grilla">
                    {experiencias.map((e) => (
                        <motion.div key={e.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            <h3 className="tarjeta__titulo">{e.cargo}</h3>
                            <span className="tarjeta__subtitulo">{e.lugar} · {e.fecha}</span>
                            <p className="tarjeta__texto">{e.descripcion}</p>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            <SeccionAnimada id="proyectos">
                <h2 className="seccion__titulo">Proyectos</h2>
                <div className="grilla">
                    {proyectos.map((p) => (
                        <motion.div key={p.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            {p.imagen && (
                                <img className="tarjeta__imagen" src={URL_BACKEND + p.imagen} alt={p.nombre} />
                            )}
                            <h3 className="tarjeta__titulo">{p.nombre}</h3>
                            <p className="tarjeta__texto">{p.descripcion}</p>
                            {p.link && (
                                <a className="tarjeta__enlace" href={p.link} target="_blank" rel="noreferrer">
                                    Ver proyecto
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            <SeccionAnimada id="logros">
                <h2 className="seccion__titulo">Logros</h2>
                <div className="grilla">
                    {logros.map((l) => (
                        <motion.div key={l.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            <h3 className="tarjeta__titulo">{l.titulo}</h3>
                            <span className="tarjeta__subtitulo">{l.fecha}</span>
                            <p className="tarjeta__texto">{l.descripcion}</p>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            <SeccionAnimada id="contacto">
                <h2 className="seccion__titulo">Contacto</h2>
                <div className="contacto">
                    {datos?.email && <p className="tarjeta__texto">{datos.email}</p>}
                    {datos?.linkedin && (
                        <a className="tarjeta__enlace" href={datos.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    )}
                    {datos?.github && (
                        <a className="tarjeta__enlace" href={datos.github} target="_blank" rel="noreferrer">GitHub</a>
                    )}
                </div>
            </SeccionAnimada>

            <footer className="pie">
                © {new Date().getFullYear()} {datos?.nombre || "Portfolio"}.
            </footer>
        </>
    );
}

export default Home;
