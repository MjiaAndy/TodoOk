import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type KpiChangeStatus = 'increase' | 'decrease' | 'neutral';

export type KpiChangeData = {
  texto: string;
  status: KpiChangeStatus;
};

export function calcularCambioPorcentual(actual: number, anterior: number): KpiChangeData {
  if (anterior === 0) {
    return {
      texto: actual > 0 ? '+100%' : '0%',
      status: actual > 0 ? 'increase' : 'neutral',
    };
  }
  
  const cambio = ((actual - anterior) / anterior) * 100;

  if (cambio > 0.1) { 
    return {
      texto: `+${cambio.toFixed(1)}%`,
      status: 'increase',
    };
  } else if (cambio < -0.1) { 
    return {
      texto: `${cambio.toFixed(1)}%`,
      status: 'decrease',
    };
  } else {
    return {
      texto: '0.0%',
      status: 'neutral',
    };
  }
}