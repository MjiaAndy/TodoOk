'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const variants = {
    initial: {
      opacity: 0,
      y: 20, 
      filter: 'blur(10px)', 
    },
    animate: {
      opacity: 1,
      y: 0, 
      filter: 'blur(0px)', 
    },
    exit: {
      opacity: 0,
      y: -20, 
      filter: 'blur(10px)', 
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate={isMounted ? "animate" : "initial"}
        exit="exit"
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}