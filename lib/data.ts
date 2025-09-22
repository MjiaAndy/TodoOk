// lib/data.ts
import { Cliente, Factura, Producto } from '@/types';
const db = require('@/lib/db');

export interface FacturaConCliente extends Factura {
  cliente_nombre: string;
}

export async function getProductosFromDB(): Promise<Producto[]> {
  try {
    const { rows } = await db.query('SELECT * FROM productos ORDER BY id ASC');
    return rows;
  } catch (error) {
    console.error('Error al obtener productos de la DB:', error);
    throw new Error('Failed to fetch productos.');
  }
}

export async function getClientesFromDB(): Promise<Cliente[]> {
  try {
    const { rows } = await db.query('SELECT * FROM clientes ORDER BY nombre ASC');
    return rows;
  } catch (error) {
    console.error('Error al obtener clientes de la DB:', error);
    throw new Error('Failed to fetch clientes.');
  }
}

export async function getFacturasFromDB(): Promise<FacturaConCliente[]> {
  try {
    const query = `
      SELECT f.id, f.total, f.fecha, f.impuesto, f.descuento, c.nombre AS cliente_nombre 
      FROM facturas f LEFT JOIN clientes c ON f.cliente_id = c.id
      ORDER BY f.fecha DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error al obtener facturas de la DB:', error);
    throw new Error('Failed to fetch facturas.');
  }
}