// app/api/productos/route.ts
import { NextResponse } from 'next/server';
import { ProductSchema } from '@/lib/schemas'; 
import { z } from 'zod';
const db = require('../../../lib/db'); // Ajusta la ruta si es necesario

// GET /api/productos - Obtener todos los productos
export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM productos ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 2. Validamos el cuerpo de la petición con nuestro esquema
    const validatedData = ProductSchema.parse(body);
    const { nombre, precio, stock } = validatedData;

    // 3. Si la validación es exitosa, continuamos con la lógica
    const { rows } = await db.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *',
      [nombre, precio, stock]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    // 4. Si la validación falla, Zod lanza un error que capturamos aquí
    if (error instanceof z.ZodError) {
      // Devolvemos un error 400 (Bad Request) con los detalles del fallo
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    // Manejamos otros errores del servidor
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}