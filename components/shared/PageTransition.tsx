// components/shared/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  // El hook usePathname nos da la URL actual.
  // Usaremos esta URL como 'key' para que AnimatePresence 
  // detecte cuándo una página "entra" y otra "sale".
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}    // Estado inicial: invisible y ligeramente abajo
        animate={{ opacity: 1, y: 0 }}      // Estado de animación: totalmente visible en su posición
        exit={{ opacity: 0, y: -15 }}       // Estado de salida: invisible y ligeramente arriba
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}