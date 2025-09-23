// app/productos/page.tsx
import { ProductClientPage } from '@/components/productos/ProductClientPage';
import { getProductosFromDB } from '@/lib/data';

export default async function ProductosPage() {
  const initialProducts = await getProductosFromDB();

  return <ProductClientPage initialProducts={initialProducts} />;
}