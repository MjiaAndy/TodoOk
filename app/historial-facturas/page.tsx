import { InvoiceHistoryClientPage } from '@/components/historial/InvoiceHistoryClientPage';
import { getFacturasFromDB } from '@/lib/data';

export default async function HistorialFacturasPage() {
  const initialInvoices = await getFacturasFromDB();
  return <InvoiceHistoryClientPage initialInvoices={initialInvoices} />;
}