// app/api/facturas/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { InvoiceSchema } from '@/lib/schemas';
const db = require('@/lib/db');
import { getFacturasFromDB } from '@/lib/data';

// GET /api/facturas - Obtener historial con nombre de cliente
export async function GET() {
  try {
    const query = `
      SELECT 
        f.id, 
        f.total, 
        f.fecha, 
        f.impuesto, 
        f.descuento, 
        c.nombre AS cliente_nombre 
      FROM facturas f
      LEFT JOIN clientes c ON f.cliente_id = c.id
      ORDER BY f.fecha DESC;
    `;
    const facturas = await getFacturasFromDB();
    return NextResponse.json(facturas);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const client = await db.getClient();

  try {
    const body = await request.json();
    const validatedData = InvoiceSchema.parse(body);
    const { cliente_id, productos_vendidos, impuesto, descuento } = validatedData;
    await client.query('BEGIN');
    let subtotal = 0;
    const productosDetallados = []; 
    const montoDescuento = subtotal * (descuento / 100);
    const baseImponible = subtotal - montoDescuento;
    const montoIVA = baseImponible * (impuesto / 100);
    const totalFinal = baseImponible + montoIVA;
    const facturaResult = await client.query(
      'INSERT INTO facturas (cliente_id, total, impuesto, descuento) VALUES ($1, $2, $3, $4) RETURNING id',
      [cliente_id, totalFinal, impuesto, descuento]
    );
    const nuevaFacturaId = facturaResult.rows[0].id;

    for (const producto of productos_vendidos) {
      const productoResult = await client.query('SELECT precio, stock FROM productos WHERE id = $1 FOR UPDATE', [producto.id]);
      const productoDB = productoResult.rows[0];
      if (!productoDB || productoDB.stock < producto.cantidad) {
        throw new Error(`Stock insuficiente para el producto con ID ${producto.id}`);
      }
      const precioUnitario = parseFloat(productoDB.precio);
      subtotal += (precioUnitario * producto.cantidad);

      productosDetallados.push({
        ...producto,
        precio_unitario: precioUnitario,
      });
    }
    
    for (const producto of productosDetallados) {
      await client.query(
        'INSERT INTO factura_items (factura_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [nuevaFacturaId, producto.id, producto.cantidad, producto.precio_unitario]
      );

      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [producto.cantidad, producto.id]
      );
    }
    
    await client.query('COMMIT');
    return NextResponse.json({ mensaje: 'Factura creada exitosamente.', facturaId: nuevaFacturaId }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al procesar la factura: ' + error.message }, { status: 500 });
  } finally {
    client.release();
  }
}