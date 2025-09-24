import { ChatInterface } from "@/components/chat/ChatInterface";
import { Producto, Cliente } from '@/types';
import { getProductosFromDB, getClientesFromDB } from "@/lib/data";

async function getInitialData(): Promise<{ productos: Producto[]; clientes: Cliente[] }> {
  try {
    const [productos, clientes] = await Promise.all([
      getProductosFromDB(),
      getClientesFromDB()
    ]);
    return { productos, clientes };
  } catch (error) {
    console.error("Error al obtener datos iniciales para Facturas:", error);
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