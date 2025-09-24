// app/api/clientes/route.ts - CORREGIDO
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientSchema } from '@/lib/schemas'
import { getClientesFromDB, createClienteInDB } from '@/lib/data';

export async function GET() {
  try {
    const clientes = await getClientesFromDB();
    return NextResponse.json(clientes);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("ERROR EN API /api/clientes (GET):", err);
    return NextResponse.json({ error: 'Error al obtener los clientes: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ClientSchema.parse(body);
    const nuevoCliente = await createClienteInDB(validatedData);

    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { 
      return NextResponse.json({ error: 'El cliente ya existe.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}