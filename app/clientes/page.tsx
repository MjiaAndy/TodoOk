// app/(rutas)/clientes/page.tsx
import { Cliente } from '@/types';
import { ClientClientPage } from '@/components/clientes/ClientPage';

async function getClientes(): Promise<Cliente[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/clientes`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch clientes');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ClientesPage() {
  const initialClients = await getClientes();
  return <ClientClientPage initialClients={initialClients} />;
}