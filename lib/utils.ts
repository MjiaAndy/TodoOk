// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function calcularCambioPorcentual(actual: number, anterior: number) {
  if (anterior === 0) {
    return {
      texto: actual > 0 ? '+100%' : '0%',
      // ✅ Devolvemos un estado en lugar de un nombre de clase
      status: actual > 0 ? 'increase' : 'neutral',
    };
  }
  
  const cambio = ((actual - anterior) / anterior) * 100;

  if (cambio > 0) {
    return {
      texto: `+${cambio.toFixed(1)}%`,
      status: 'increase',
    };
  } else if (cambio < 0) {
    return {
      texto: `${cambio.toFixed(1)}%`,
      status: 'decrease',
    };
  } else {
    return {
      texto: '0%',
      status: 'neutral',
    };
  }
}