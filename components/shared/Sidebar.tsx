'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, History, Users, Package } from 'lucide-react';
import { UserProfile } from './UserProfile';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/facturas', label: 'Crear Factura', icon: FileText },
  { href: '/historial-facturas', label: 'Historial', icon: History },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/clientes', label: 'Clientes', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname(); 
  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
      className="hidden md:flex flex-col w-64 bg-background-alt/60 backdrop-blur-xl border-r border-white/10"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">TodoOk</h1>
      </div>
      <nav className="flex-grow px-4">
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground-alt transition-all hover:text-foreground',
                    isActive && 'bg-primary/80 text-white hover:text-white'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10">
        <UserProfile />
      </div>
    </motion.aside>
  );
}