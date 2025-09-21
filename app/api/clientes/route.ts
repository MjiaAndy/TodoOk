// app/api/clientes/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientSchema } from '@/lib/schemas'
const db = require('../../../lib/db');

// GET /api/clientes
export async function GET() {
  try {
    const { rows } = await db.query('SELECT * FROM clientes ORDER BY nombre ASC');
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/clientes validado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ClientSchema.parse(body);
    const { nombre, email } = validatedData;

    const { rows } = await db.query(
      'INSERT INTO clientes (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre, email]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}