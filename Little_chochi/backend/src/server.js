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
  // AlwaysData (y otros hosts) exponen la dirección en IP/HOST y el puerto en PORT.
  const host = process.env.IP || process.env.HOST || undefined;
  app.listen(config.port, host, () => {
    console.log(`✔ API Little Chochi escuchando en http://${host || 'localhost'}:${config.port}`);
  });
}

main();
