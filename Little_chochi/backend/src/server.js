import { createApp } from './app.js';
import { config } from './config.js';
import { checkDatabase } from './database.js';

async function main() {
  try {
    await checkDatabase();
    console.log('✔ Conexión a MySQL establecida');
  } catch (error) {
    console.error('✖ No se pudo conectar a MySQL:', error.message);
    console.error('  Verificá que XAMPP/MySQL esté corriendo y las credenciales en .env');
    process.exit(1);
  }

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`✔ API Little Chochi escuchando en http://localhost:${config.port}`);
  });
}

main();
