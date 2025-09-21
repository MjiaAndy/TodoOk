// app/page.tsx - El Nuevo Dashboard
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { DashboardStats, RecentInvoice } from '@/types';

async function getDashboardStats() {
  return {
    ventasMes: { actual: 12550.75, anterior: 10450.00 },
    nuevosClientes: { actual: 12, anterior: 22 }, // actual < anterior = disminución
    facturasEmitidas: { actual: 58, anterior: 58 }, // actual === anterior = neutro
    productosActivos: { actual: 112, anterior: 110 },
  };
}

async function getRecentInvoices(): Promise<RecentInvoice[]> {
  return [
    { id: 105, cliente: 'Juan Pérez', total: 450.00, estado: 'Pagada' },
    { id: 104, cliente: 'Ana Gómez', total: 1200.50, estado: 'Pendiente' },
    { id: 103, cliente: 'Tech Solutions SRL', total: 8500.00, estado: 'Pagada' },
  ] as const;
}
// ---------------------------------------------------------


export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentInvoices = await getRecentInvoices();

  return (
    <BentoGrid stats={stats} recentInvoices={recentInvoices} />
  );
}