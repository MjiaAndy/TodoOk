// /backend/src/models.js

const db = require('./db');

// Creación de la tabla de Clientes
const createClientsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS clientes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );
  `;
  await db.query(query);
};

// Creación de la tabla de Productos
const createProductsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      stock INTEGER NOT NULL
    );
  `;
  await db.query(query);
};
// Creación de la tabla de Facturas
const createInvoicesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS facturas (
      id SERIAL PRIMARY KEY,
      cliente_id INTEGER REFERENCES clientes(id),
      total DECIMAL(10, 2) NOT NULL,
      impuesto DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      descuento DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await db.query(query);
};
// Función para inicializar todas las tablas
const initializeDatabase = async () => {
  try {
    await createClientsTable();
    await createProductsTable();
    await createInvoicesTable();
    console.log('✅ Tablas creadas o ya existentes');
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err);
  }
};

module.exports = {
  initializeDatabase
};