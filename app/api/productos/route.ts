// app/api/productos/route.ts
import { NextResponse } from 'next/server';
import { ProductSchema } from '@/lib/schemas'; 
import { z } from 'zod';
import { getProductosFromDB, createProductoInDB } from '@/lib/data'; 


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
    const nuevoProducto = await createProductoInDB(validatedData);

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
  // Verificamos si el error es de Zod para devolver un mensaje específico
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 400 });
  }

  // Verificamos si es un error de la base de datos con un código específico
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { 
    return NextResponse.json({ error: 'El producto ya existe.' }, { status: 409 });
  }

  // Para cualquier otro error, devolvemos un mensaje genérico
  return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
}
}