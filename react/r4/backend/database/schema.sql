-- Script de creación de la base de datos del portfolio (R4).
-- Cada sección del portfolio es una tabla independiente (3FN).

CREATE DATABASE IF NOT EXISTS portfolio_r4
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE portfolio_r4;

-- Datos personales (una sola fila: el perfil del dueño del portfolio).
CREATE TABLE IF NOT EXISTS datos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    profesion VARCHAR(150) NOT NULL,
    bio TEXT,
    email VARCHAR(150),
    foto VARCHAR(255),      -- ruta de la imagen de perfil
    linkedin VARCHAR(255),
    github VARCHAR(255)
);

-- Habilidades.
CREATE TABLE IF NOT EXISTS habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel INT DEFAULT 50,    -- porcentaje de dominio (0 a 100)
    imagen VARCHAR(255)      -- ruta de la imagen (opcional)
);

-- Experiencias.
CREATE TABLE IF NOT EXISTS experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cargo VARCHAR(150) NOT NULL,
    lugar VARCHAR(150),
    fecha VARCHAR(100),
    descripcion TEXT
);

-- Proyectos.
CREATE TABLE IF NOT EXISTS proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    link VARCHAR(255)
);

-- Logros.
CREATE TABLE IF NOT EXISTS logros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha VARCHAR(100)
);

-- Administrador (credenciales de acceso al panel).
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);
