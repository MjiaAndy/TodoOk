import { Factura } from '@/types';
import { InvoiceHistoryClientPage } from '@/components/historial/InvoiceHistoryClientPage';

interface FacturaConCliente extends Factura {
  cliente_nombre: string;
}

async function getFacturas(): Promise<FacturaConCliente[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/facturas`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch facturas');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HistorialFacturasPage() {
  const initialInvoices = await getFacturas();
  return <InvoiceHistoryClientPage initialInvoices={initialInvoices} />;
}