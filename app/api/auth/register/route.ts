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
  const err = error as any; 
  if (err instanceof z.ZodError) {
    return NextResponse.json({ error: err.issues }, { status: 400 });
  }
  if (err.code === '23505') { 
    return NextResponse.json({ error: 'El email ya está registrado.' }, { status: 409 });
  }
    return NextResponse.json({ error: 'Error al registrar el usuario.' }, { status: 500 });
  }
}