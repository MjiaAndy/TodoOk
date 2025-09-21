// app/(rutas)/productos/page.tsx
import { Producto } from '@/types';
import { ProductClientPage } from '@/components/productos/ProductClientPage';

// Función para obtener datos en el servidor
async function getProductos(): Promise<Producto[]> {
  try {
    // Usamos la URL absoluta porque estamos en el servidor.
    // En producción, esta sería la URL de tu dominio.
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/productos`, {
      cache: 'no-store', // Para asegurar que siempre tengamos los datos más frescos
    });
    if (!res.ok) {
      throw new Error('Failed to fetch productos');
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return []; // Devolver un array vacío en caso de error
  }
}

export default async function ProductosPage() {
  const initialProducts = await getProductos();

  return <ProductClientPage initialProducts={initialProducts} />;
}