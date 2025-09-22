// components/shared/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, History, Users, Package } from 'lucide-react';
import { UserProfile } from './UserProfile';

// 1. Definimos nuestros enlaces de navegación en un array para que sea fácil de mantener
const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/facturas', label: 'Crear Factura', icon: FileText },
  { href: '/historial-facturas', label: 'Historial', icon: History },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/clientes', label: 'Clientes', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname(); // Hook para saber en qué URL estamos

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-alt/60 backdrop-blur-lg border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">TodoOk</h1>
      </div>
      <nav className="flex-grow px-4">
        <ul>
          {/* 2. Mapeamos el array para crear los enlaces dinámicamente */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-foreground-alt transition-all hover:text-foreground',
                    // 3. Aplicamos un estilo diferente si el enlace está activo
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
    </aside>
  );
}