// lib/schemas.ts
import { z } from 'zod';

// Esquema para el registro de un nuevo usuario
export const RegisterSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

// Esquema para la creación/actualización de un cliente
export const ClientSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  // Puedes añadir más validaciones para dni, direccion, etc.
});

// Esquema para la creación/actualización de un producto
export const ProductSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  precio: z.number().positive({ message: "El precio debe ser un número positivo." }),
  stock: z.number().int().min(0, { message: "El stock no puede ser un número negativo." }),
});

// Esquema para la creación de una nueva factura
export const InvoiceSchema = z.object({
  cliente_id: z.number().int().positive(),
  impuesto: z.number().min(0),
  descuento: z.number().min(0),
  productos_vendidos: z.array(z.object({
    id: z.number().int().positive(),
    cantidad: z.number().int().positive(),
  })).min(1, { message: "Debes agregar al menos un producto a la factura." }),
});