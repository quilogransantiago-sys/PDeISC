// tipos: tipos de datos del portfolio.

export interface DatosPersonales {
    id: number;
    nombre: string;
    profesion: string;
    bio: string;
    email: string;
    foto: string;
    linkedin: string;
    github: string;
}

export interface Habilidad {
    id: number;
    nombre: string;
    nivel: number;
    imagen: string;
}

export interface Experiencia {
    id: number;
    cargo: string;
    lugar: string;
    fecha: string;
    descripcion: string;
}

export interface Proyecto {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    link: string;
}

export interface Logro {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
}
