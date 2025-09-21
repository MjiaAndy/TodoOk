const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log('✅ Conectado al pool de PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión al pool:', err.stack));

// Exportamos el pool para que el servidor lo use
module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect() // Función para obtener una conexión del pool
};