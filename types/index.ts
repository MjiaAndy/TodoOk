// Define la estructura de un Producto en toda la aplicación.
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string; // Opcional por ahora
  garantia?: string;  // Opcional por ahora
}

// Define la estructura de un Cliente.
export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  dni?: string;
  direccion?: string;
  condicion_iva?: string;
}

// Representa un ítem dentro de una factura.
export interface ItemFactura extends Producto {
  cantidad: number;
}

// Define la estructura principal de una Factura.
export interface Factura {
  id: number;
  cliente_id: number;
  total: number;
  impuesto: number;
  descuento: number;
  fecha: string;
}

// ✅ NUEVO: Define la forma de los datos de estadísticas del dashboard
export interface DashboardStats {
  ventasMes: { actual: number; anterior: number };
  nuevosClientes: { actual: number; anterior: number };
  facturasEmitidas: { actual: number; anterior: number };
  productosActivos: { actual: number; anterior: number };
}

// ✅ NUEVO: Define la forma de una factura reciente para el dashboard
export interface RecentInvoice {
  id: number;
  cliente: string;
  total: number;
  estado: 'Pagada' | 'Pendiente';
}