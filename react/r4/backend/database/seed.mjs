// seed.mjs: crea la base de datos, las tablas y el administrador.
// Ejecutar con: node database/seed.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const conexion = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
});

await conexion.query(
    "CREATE DATABASE IF NOT EXISTS portfolio_r4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
);
await conexion.query("USE portfolio_r4");

const tablas = [
    `CREATE TABLE IF NOT EXISTS datos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        profesion VARCHAR(150) NOT NULL,
        bio TEXT,
        email VARCHAR(150),
        foto VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS habilidades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        nivel INT DEFAULT 50,
        imagen VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS experiencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cargo VARCHAR(150) NOT NULL,
        lugar VARCHAR(150),
        fecha VARCHAR(100),
        descripcion TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS proyectos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        imagen VARCHAR(255),
        link VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS logros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(150) NOT NULL,
        descripcion TEXT,
        fecha VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL
    )`,
];

for (const tabla of tablas) {
    await conexion.query(tabla);
}

// Crea el admin si no existe.
const hash = await bcrypt.hash("admin123", 10);
await conexion.query(
    "INSERT IGNORE INTO admin (email, contrasena) VALUES (?, ?)",
    ["admin@admin.com", hash]
);

console.log("Base de datos 'portfolio_r4' lista.");
console.log("Admin: admin@admin.com / admin123");

await conexion.end();
