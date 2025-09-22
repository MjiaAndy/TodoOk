// app/(rutas)/facturas/page.tsx
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Producto, Cliente } from '@/types';

// Obtenemos los datos necesarios en el servidor
async function getInitialData(): Promise<{ productos: Producto[]; clientes: Cliente[] }> {
  try {
    const [productosRes, clientesRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/productos`, { cache: 'no-store' }),
      fetch(`${process.env.NEXTAUTH_URL}/api/clientes`, { cache: 'no-store' })
    ]);
    if (!productosRes.ok || !clientesRes.ok) throw new Error('Failed to fetch initial data');
    const productos = await productosRes.json();
    const clientes = await clientesRes.json();
    return { productos, clientes };
  } catch (error) {
    console.error(error);
    return { productos: [], clientes: [] };
  }
}

export default async function CrearFacturaPage() {
  const { productos, clientes } = await getInitialData();

  return (
    <div className="h-full">
      <ChatInterface initialClientes={clientes} initialProductos={productos} />
    </div>
  );
}