// app/page.tsx - El Nuevo Dashboard
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { DashboardStats, Factura } from '@/types';
import { getFacturasFromDB } from '@/lib/data';

async function getDashboardStats() {
  return {
    ventasMes: { actual: 12550.75, anterior: 10450.00 },
    nuevosClientes: { actual: 12, anterior: 22 }, 
    facturasEmitidas: { actual: 58, anterior: 58 },
    productosActivos: { actual: 112, anterior: 110 },
  };
}

async function getRecentInvoices(): Promise<Factura[]> {
  try {
    const todasLasFacturas = await getFacturasFromDB();
    return todasLasFacturas.slice(0, 3);
  } catch (error) {
    console.error("Error al obtener facturas para el dashboard:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentInvoices = await getRecentInvoices();

  return (
    <BentoGrid stats={stats} initialInvoices={recentInvoices} />
  );
}