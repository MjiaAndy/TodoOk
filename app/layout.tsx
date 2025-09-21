// app/layout.tsx - CORREGIDO
import './globals.css'; // Debe ser la primera importación
import { Poppins } from 'next/font/google';
import { Sidebar } from '@/components/shared/Sidebar';
import { PageTransition } from '@/components/shared/PageTransition';
import 'gridstack/dist/gridstack.min.css';
import { Providers } from '@/components/shared/Providers'; // 1. Importamos nuestro nuevo componente

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// Nota: No hay 'use client' aquí. Este es ahora un Server Component.
// Tampoco es una función async por ahora, lo cual es correcto.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans`}>
        {/* 2. Usamos el componente Providers para envolver todo */}
        <Providers>
          <div className="flex h-screen"> {/* Eliminamos bg-background de aquí, ya que está en el body en globals.css */}
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}