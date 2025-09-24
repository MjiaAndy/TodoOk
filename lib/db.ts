// lib/db.ts - VERSIÓN FINAL CON TIPOS
import { Pool, types } from 'pg';
import 'dotenv/config';

// OID 1700 es para tipos NUMERIC/DECIMAL
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
  // ✅ Añadimos los tipos correctos a nuestra función 'query'
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect()
};

export default db;