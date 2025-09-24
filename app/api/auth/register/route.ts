// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { RegisterSchema } from '@/lib/schemas'; 
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);
    const { nombre, email, password } = validatedData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [nombre, email, hashedPassword]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
  // Verificamos si el error es de Zod para devolver un mensaje específico
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 400 });
  }

  // Verificamos si es un error de la base de datos con un código específico
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') { 
    return NextResponse.json({ error: 'El registro ya existe.' }, { status: 409 });
  }

  // Para cualquier otro error, devolvemos un mensaje genérico
  return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
}
}