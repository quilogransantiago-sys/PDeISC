// Home: página pública del portfolio (una sola página con secciones).
// Propósito: cargar los datos desde la API y mostrarlos con animaciones (Framer Motion).
// Dependencias: react (useEffect, useState), framer-motion, react-router-dom, api, tipos, useTema.
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

// Componente reutilizable: sección que se anima al aparecer en pantalla.
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
    // useEffect: carga todas las secciones desde la API (en paralelo).
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
            {/* Header con navegación por anclas. */}
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

            {/* Hero */}
            <section id="inicio" className="hero">
                {datos?.foto && (
                    <img className="hero__foto" src={URL_BACKEND + datos.foto} alt={datos.nombre} />
                )}
                <motion.h1
                    className="hero__nombre"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    {datos?.nombre || "Tu nombre"}
                </motion.h1>
                <p className="hero__profesion">{datos?.profesion}</p>
            </section>
            {/* Sobre mí */}
            <SeccionAnimada id="sobre-mi">
                <h2 className="seccion__titulo">Sobre mí</h2>
                <p className="tarjeta__texto" style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
                    {datos?.bio}
                </p>
            </SeccionAnimada>

            {/* Habilidades */}
            <SeccionAnimada id="habilidades">
                <h2 className="seccion__titulo">Habilidades</h2>
                <div className="grilla">
                    {habilidades.map((habilidad) => (
                        <motion.div key={habilidad.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            {habilidad.imagen && (
                                <img className="tarjeta__imagen" src={URL_BACKEND + habilidad.imagen} alt={habilidad.nombre} />
                            )}
                            <h3 className="tarjeta__titulo">{habilidad.nombre}</h3>
                            <div className="barra">
                                <div className="barra__relleno" style={{ width: `${habilidad.nivel}%` }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            {/* Experiencias */}
            <SeccionAnimada id="experiencias">
                <h2 className="seccion__titulo">Experiencias</h2>
                <div className="grilla">
                    {experiencias.map((experiencia) => (
                        <motion.div key={experiencia.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            <h3 className="tarjeta__titulo">{experiencia.cargo}</h3>
                            <span className="tarjeta__subtitulo">{experiencia.lugar} · {experiencia.fecha}</span>
                            <p className="tarjeta__texto">{experiencia.descripcion}</p>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            {/* Proyectos */}
            <SeccionAnimada id="proyectos">
                <h2 className="seccion__titulo">Proyectos</h2>
                <div className="grilla">
                    {proyectos.map((proyecto) => (
                        <motion.div key={proyecto.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            {proyecto.imagen && (
                                <img className="tarjeta__imagen" src={URL_BACKEND + proyecto.imagen} alt={proyecto.nombre} />
                            )}
                            <h3 className="tarjeta__titulo">{proyecto.nombre}</h3>
                            <p className="tarjeta__texto">{proyecto.descripcion}</p>
                            {proyecto.link && (
                                <a className="tarjeta__enlace" href={proyecto.link} target="_blank" rel="noreferrer">
                                    Ver proyecto
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            {/* Logros */}
            <SeccionAnimada id="logros">
                <h2 className="seccion__titulo">Logros</h2>
                <div className="grilla">
                    {logros.map((logro) => (
                        <motion.div key={logro.id} className="tarjeta" whileHover={{ scale: 1.03 }}>
                            <h3 className="tarjeta__titulo">{logro.titulo}</h3>
                            <span className="tarjeta__subtitulo">{logro.fecha}</span>
                            <p className="tarjeta__texto">{logro.descripcion}</p>
                        </motion.div>
                    ))}
                </div>
            </SeccionAnimada>

            {/* Contacto */}
            <SeccionAnimada id="contacto">
                <h2 className="seccion__titulo">Contacto</h2>
                <div className="contacto">
                    {datos?.email && <p className="tarjeta__texto">{datos.email}</p>}
                    {datos?.linkedin && (
                        <a className="tarjeta__enlace" href={datos.linkedin} target="_blank" rel="noreferrer">
                            LinkedIn
                        </a>
                    )}
                    {datos?.github && (
                        <a className="tarjeta__enlace" href={datos.github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
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

