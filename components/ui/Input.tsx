// components/ui/Input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils'; // Reutilizamos nuestra utilidad de clases

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Estilos base del input
          'flex h-10 w-full rounded-md border border-slate-700 bg-background-alt px-3 py-2 text-sm text-foreground',
          // Estilos para el placeholder
          'placeholder:text-foreground-alt',
          // Estilos al hacer focus (resaltado con el color primario)
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          // Estilos cuando está deshabilitado
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Permite añadir clases personalizadas desde fuera
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };