-- Script de creación de la base de datos y la tabla de usuarios.
-- Diseño en 3FN: una sola entidad "usuarios" sin grupos repetidos ni
-- dependencias transitivas (cada campo depende solo de la clave primaria id).

CREATE DATABASE IF NOT EXISTS sistema_usestate
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_usestate;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- clave primaria
    nombre VARCHAR(100) NOT NULL,               -- nombre del usuario
    email VARCHAR(150) NOT NULL UNIQUE,         -- email único (identifica al usuario)
    contrasena VARCHAR(255) NOT NULL,           -- contraseña hasheada (nunca en texto plano)
    rol ENUM('admin','usuario') NOT NULL DEFAULT 'usuario',  -- rol para permisos
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- fecha de alta
);

