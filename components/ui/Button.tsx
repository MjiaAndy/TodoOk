// components/ui/Button.tsx
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Crearemos este archivo auxiliar en el siguiente paso

// 1. Definimos todas las variantes y estilos de nuestro botón usando CVA
const buttonVariants = cva(
  // Estilos base que todos los botones compartirán
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background',
  {
    variants: {
      // Diferentes tipos de botones
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
        secondary: 'bg-background-alt text-foreground hover:bg-background/80 focus:ring-foreground',
        danger: 'bg-danger text-white hover:bg-danger/90 focus:ring-danger',
        ghost: 'hover:bg-background-alt hover:text-foreground/90', // Un botón sutil, solo texto
      },
      // Diferentes tamaños
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
      },
    },
    // Valores por defecto si no se especifican
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// 2. Definimos las props que nuestro componente aceptará
export interface ButtonProps
  extends React.ComponentProps<typeof motion.button>,
    VariantProps<typeof buttonVariants> {}

// 3. Creamos el componente, combinando todo
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        // Añadimos las micro-interacciones de Framer Motion por defecto a todos los botones
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };