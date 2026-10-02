-- Datos iniciales: crea el administrador y una fila de datos personales vacía.
-- Admin por defecto: admin@portfolio.com / Admin123!

USE portfolio_r4;

INSERT IGNORE INTO admin (email, contrasena)
VALUES ('admin@portfolio.com', '$2b$10$NHfXEJmnU5mV0aryxWRC5ehwPfgpzzJt5ZtoAVW1OZyr0cSJTHlsq');

-- Fila inicial de datos personales (el admin la edita desde el panel).
INSERT INTO datos (nombre, profesion, bio, email, foto, linkedin, github)
SELECT 'Tu nombre', 'Tu profesión', 'Escribí una breve descripción sobre vos.', 'tu@email.com', '', '', ''
WHERE NOT EXISTS (SELECT 1 FROM datos);
