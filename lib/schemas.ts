// lib/schemas.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export const ClientSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
});

export const ProductSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  precio: z.number().positive({ message: "El precio debe ser un número positivo." }),
  stock: z.number().int().min(0, { message: "El stock no puede ser un número negativo." }),
});

export const InvoiceSchema = z.object({
  cliente_id: z.number().int().positive(),
  impuesto: z.number().min(0),
  descuento: z.number().min(0),
  productos_vendidos: z.array(z.object({
    id: z.number().int().positive(),
    cantidad: z.number().int().positive(),
  })).min(1, { message: "Debes agregar al menos un producto a la factura." }),
});