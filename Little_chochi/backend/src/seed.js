import bcrypt from 'bcryptjs';
import { pool, checkDatabase } from './database.js';

/**
 * Semilla de datos de demostración (idempotente).
 * Crea el usuario administrador y productos de ejemplo solo si no existen.
 * Ejecutar con: npm run seed
 */

const ADMIN = {
  nombre: 'Administradora',
  email: 'admin@littlechochi.com',
  password: 'Admin123!',
};

const DEMO_PRODUCTS = [
  {
    nombre: 'Babero artesanal de algodón',
    descripcion:
      'Babero reversible de algodón peinado, con broche ajustable y estampado a mano. Producto de ejemplo.',
    precio: 4500,
    categoria: 'accesorios',
    imagen: 'https://picsum.photos/seed/chochi-babero/600/600',
  },
  {
    nombre: 'Manta tejida a crochet',
    descripcion:
      'Manta suave tejida a mano en tonos pastel, ideal para cuna o cochecito. Producto de ejemplo.',
    precio: 18500,
    categoria: 'ropa-de-bebe',
    imagen: 'https://picsum.photos/seed/chochi-manta/600/600',
  },
  {
    nombre: 'Sonajero de apego',
    descripcion:
      'Sonajero de algodón orgánico con relleno hipoalergénico. Producto de ejemplo.',
    precio: 6200,
    categoria: 'juguetes',
    imagen: 'https://picsum.photos/seed/chochi-sonajero/600/600',
  },
  {
    nombre: 'Guirnalda decorativa',
    descripcion:
      'Guirnalda de tela para decorar el cuarto del bebé, con banderines lavables. Producto de ejemplo.',
    precio: 3900,
    categoria: 'decoracion',
    imagen: 'https://picsum.photos/seed/chochi-guirnalda/600/600',
  },
  {
    nombre: 'Gorrito tejido recién nacido',
    descripcion:
      'Gorrito de lana merino extra suave para recién nacidos. Producto de ejemplo.',
    precio: 5300,
    categoria: 'ropa-de-bebe',
    imagen: 'https://picsum.photos/seed/chochi-gorrito/600/600',
  },
  {
    nombre: 'Cojín nube para lactancia',
    descripcion:
      'Cojín con forma de nube para acompañar la lactancia y el descanso. Producto de ejemplo.',
    precio: 12400,
    categoria: 'decoracion',
    imagen: 'https://picsum.photos/seed/chochi-nube/600/600',
  },
];

async function seed() {
  await checkDatabase();

  // Usuario administrador
  const [adminRows] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [
    ADMIN.email,
  ]);
  if (adminRows.length === 0) {
    const passwordHash = await bcrypt.hash(ADMIN.password, 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES (?, ?, ?, (SELECT id FROM roles WHERE nombre = ?))',
      [ADMIN.nombre, ADMIN.email, passwordHash, 'admin'],
    );
    console.log(`✔ Usuario admin creado: ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    console.log('• Usuario admin ya existe, se omite');
  }

  // Productos de ejemplo
  for (const product of DEMO_PRODUCTS) {
    const [rows] = await pool.query('SELECT id FROM productos WHERE nombre = ?', [
      product.nombre,
    ]);
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO productos
           (nombre, descripcion, precio, imagen_url, disponible, es_ejemplo, categoria_id)
         VALUES (?, ?, ?, ?, 1, 1, (SELECT id FROM categorias WHERE slug = ?))`,
        [product.nombre, product.descripcion, product.precio, product.imagen, product.categoria],
      );
      console.log(`✔ Producto de ejemplo creado: ${product.nombre}`);
    }
  }

  console.log('✔ Semilla completada');
  await pool.end();
}

seed().catch(async (error) => {
  console.error('✖ Error en la semilla:', error.message);
  await pool.end();
  process.exit(1);
});
