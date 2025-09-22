// app/api/productos/route.ts
import { NextResponse } from 'next/server';
import { ProductSchema } from '@/lib/schemas'; 
import { z } from 'zod';
const db = require('@/lib/db');
import { getProductosFromDB } from '@/lib/data'; 


export async function GET() {
  try {
    const productos = await getProductosFromDB();
    return NextResponse.json(productos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);
    const { nombre, precio, stock } = validatedData;
    const { rows } = await db.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *',
      [nombre, precio, stock]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}