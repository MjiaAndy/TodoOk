// components/ui/Card.tsx
import * as React from 'react';
import { motion, MotionProps } from 'framer-motion'; 
import { cn } from '@/lib/utils';

// El contenedor principal de la tarjeta
export interface CardProps extends React.ComponentProps<typeof motion.div> {
  isHoverable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isHoverable = false, ...props }, ref) => {
    
    // 2. Definimos el objeto de animación que se usará si isHoverable es true
    const hoverAnimation: MotionProps = isHoverable
      ? {
          whileHover: {
            scale: 1.03,
            zIndex: 10,
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-background-alt/60 backdrop-blur-lg shadow-lg',
          className
        )}
        // 3. Aplicamos las animaciones solo si isHoverable es true
        {...hoverAnimation}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// El cabecero de la tarjeta, ideal para el título y la descripción
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// El título de la tarjeta, usualmente un <h2> o <h3>
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight text-foreground', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Una descripción opcional, con un color más sutil
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-foreground-alt', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// El cuerpo principal de la tarjeta
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// El pie de la tarjeta, ideal para botones de acción
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };