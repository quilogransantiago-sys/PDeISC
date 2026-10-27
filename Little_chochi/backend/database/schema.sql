-- =============================================================
-- Little Chochi - Esquema de base de datos (MySQL / MariaDB)
-- Normalizado a 3FN. Codificación UTF-8 (utf8mb4).
-- =============================================================

CREATE DATABASE IF NOT EXISTS little_chochi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE little_chochi;

-- -------------------------------------------------------------
-- Roles de usuario (mínimo 3)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(50)      NOT NULL,
  descripcion VARCHAR(255)     NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Usuarios
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(100)  NOT NULL,
  email         VARCHAR(190)  NOT NULL,
  password_hash VARCHAR(255)  NULL,
  rol_id        INT UNSIGNED  NOT NULL,
  activo        TINYINT(1)    NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email),
  KEY idx_usuarios_rol (rol_id),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Identidades sociales (login OAuth: Google, Facebook, GitHub)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS identidades_sociales (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  proveedor  VARCHAR(50)  NOT NULL,
  social_id  VARCHAR(190) NOT NULL,
  creado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_social_proveedor_id (proveedor, social_id),
  KEY idx_identidades_usuario (usuario_id),
  CONSTRAINT fk_identidad_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Categorías de productos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) NOT NULL,
  descripcion VARCHAR(500) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Productos
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(150)    NOT NULL,
  descripcion  TEXT            NULL,
  precio       DECIMAL(12, 2)  NOT NULL,
  imagen_url   VARCHAR(500)    NULL,
  disponible   TINYINT(1)      NOT NULL DEFAULT 1,
  es_ejemplo   TINYINT(1)      NOT NULL DEFAULT 0,
  categoria_id INT UNSIGNED    NOT NULL,
  creado_en    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_productos_categoria (categoria_id),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Refresh tokens (renovación de sesión JWT)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED  NOT NULL,
  token_hash VARCHAR(128)  NOT NULL,
  expires_at DATETIME      NOT NULL,
  creado_en  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_hash (token_hash),
  KEY idx_refresh_usuario (usuario_id),
  CONSTRAINT fk_refresh_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Mensajes de contacto
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100)  NOT NULL,
  email       VARCHAR(190)  NOT NULL,
  mensaje     TEXT          NOT NULL,
  producto_id INT UNSIGNED  NULL,
  creado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contacto_producto (producto_id),
  CONSTRAINT fk_contacto_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- Datos de referencia (idempotentes)
-- -------------------------------------------------------------
INSERT IGNORE INTO roles (id, nombre, descripcion) VALUES
  (1, 'admin',  'Acceso total: gestiona usuarios y productos'),
  (2, 'editor', 'Gestiona productos y categorías'),
  (3, 'cliente','Cliente de la tienda: solo gestiona sus propios datos');

INSERT IGNORE INTO categorias (nombre, slug, descripcion) VALUES
  ('Ropa de bebé', 'ropa-de-bebe', 'Prendas tejidas y confeccionadas a mano'),
  ('Accesorios', 'accesorios', 'Complementos y accesorios para bebés'),
  ('Juguetes', 'juguetes', 'Juguetes artesanales y de apego'),
  ('Decoración', 'decoracion', 'Decoración para el cuarto del bebé');
