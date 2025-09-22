const { Pool, types } = require('pg');
require('dotenv').config();

types.setTypeParser(1700, (val) => {
  return parseFloat(val);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log('✅ Conectado al pool de PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión al pool:', err.stack));

module.exports =  {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect() 
};