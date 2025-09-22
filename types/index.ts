
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria?: string; 
  garantia?: string;  
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  dni?: string;
  direccion?: string;
  condicion_iva?: string;
}

export interface ItemFactura extends Producto {
  cantidad: number;
}

export interface Factura {
  id: number;
  cliente_id: number;
  cliente_nombre: string;
  total: number;
  impuesto: number;
  descuento: number;
  estado: 'Pagada' | 'Pendiente';
  fecha: string;
}

export interface InvoiceHistoryClientPageProps {
  initialInvoices: Factura[];
}

export interface DashboardStats {
  ventasMes: { actual: number; anterior: number };
  nuevosClientes: { actual: number; anterior: number };
  facturasEmitidas: { actual: number; anterior: number };
  productosActivos: { actual: number; anterior: number };
}

export interface BentoGridProps {
  stats: DashboardStats;
  initialInvoices: Factura[];
}

// export interface RecentInvoice {
//   id: number;
//   cliente: string;
//   total: number;
// }


export type KpiChangeData = {
  texto: string;
  status: 'increase' | 'decrease' | 'neutral';
};

export interface KpiChangeIndicatorProps {
  changeData: KpiChangeData;
}

export interface FullInvoiceData {
  factura: Factura;
  cliente: Cliente;
  items: ItemFactura[];
}

export type ChatMessageSender = 'user' | 'bot';
export interface ChatMessage {
  id: number;
  sender: ChatMessageSender;
  content: React.ReactNode;
}
export type ChatState =
  | 'GREETING'
  | 'SELECTING_CLIENT'
  | 'ADDING_PRODUCTS'
  | 'ASKING_DISCOUNT'      
  | 'ENTERING_DISCOUNT'    
  | 'SELECTING_PAYMENT'  
  | 'SELECTING_INSTALLMENTS' 
  | 'REVIEWING_INVOICE'
  | 'FINALIZED';

