// components/shared/PageTransition.tsx - VERSIÓN MEJORADA
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // 2. Usamos useEffect. Este código SOLO se ejecuta en el cliente, una vez.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Definimos nuestras variantes de animación para un código más limpio.
  const variants = {
    initial: {
      opacity: 0,
      y: 20, // Empieza 20px más abajo
      filter: 'blur(10px)', // Empieza desenfocada
    },
    animate: {
      opacity: 1,
      y: 0, // Termina en su posición final
      filter: 'blur(0px)', // Termina completamente nítida
    },
    exit: {
      opacity: 0,
      y: -20, // Se va hacia arriba
      filter: 'blur(10px)', // Se desenfoca al salir
    },
  };

  return (
    // 2. 'mode="wait"' es clave: espera a que la animación de salida termine antes de iniciar la de entrada.
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate={isMounted ? "animate" : "initial"}
        exit="exit"
        // 3. Usamos una transición de tipo 'spring' para un efecto más natural y suave.
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}