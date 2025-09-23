// app/layout.tsx 
import './globals.css'; 
import { Poppins } from 'next/font/google';
import { Sidebar } from '@/components/shared/Sidebar';
import { PageTransition } from '@/components/shared/PageTransition';
import 'gridstack/dist/gridstack.min.css';
import { Providers } from '@/components/shared/Providers';
import { AuroraBackground } from '@/components/shared/AuroraBackground'; 

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;

}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className={`${poppins.variable} font-sans`}>
        <Providers>
          <AuroraBackground />
          <div className="flex h-screen"> 
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