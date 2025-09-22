// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { RegisterSchema } from '@/lib/schemas'; // Importamos el esquema
const db = require('@/lib/db');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. Validamos los datos de entrada usando el esquema de Zod
    const validatedData = RegisterSchema.parse(body);
    const { nombre, email, password } = validatedData;

    // 2. Si la validación pasa, continuamos con la lógica
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, email',
      [nombre, email, hashedPassword]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    // 3. Capturamos errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    // Capturamos otros errores (ej. email duplicado)
    if (error.code === '23505') { 
      return NextResponse.json({ error: 'El email ya está registrado.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al registrar el usuario.' }, { status: 500 });
  }
}