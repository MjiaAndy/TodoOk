import { Pool, types } from 'pg';
import 'dotenv/config';

types.setTypeParser(1700, (val: string) => {
  return parseFloat(val);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log('✅ Conectado al pool de PostgreSQL'))
  .catch((err: Error) => console.error('❌ Error de conexión al pool:', err.stack));

const db = {
  query: (text: string, params?: (string | number | boolean | null)[]) => pool.query(text, params),
  getClient: () => pool.connect()
};

export default db;