import { ClientClientPage } from '@/components/clientes/ClientPage';
import { getClientesFromDB } from '@/lib/data';

export default async function ClientesPage() {
  const initialClients = await getClientesFromDB();
  return <ClientClientPage initialClients={initialClients} />;
}