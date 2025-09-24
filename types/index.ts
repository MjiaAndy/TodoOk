// types/index.ts

// 1. DATOS CENTRALES (API / DB)

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

export interface Factura {
  id: number;
  cliente_id: number;
  cliente_nombre?: string;
  total: number;
  impuesto: number;
  descuento: number;
  estado?: 'Pagada' | 'Pendiente';
  fecha: string;
}

export interface ItemFactura extends Producto {
  cantidad: number;
}

// 2. COMPONENTES DE PÁGINA Y UI

export interface ProductClientPageProps {
  initialProducts: Producto[];
}

export interface ClientClientPageProps {
  initialClients: Cliente[];
}

export interface InvoiceHistoryClientPageProps {
  initialInvoices: Factura[];
}

export interface BentoGridProps {
  stats: DashboardStats;
  initialInvoices: Factura[];
}

export interface KpiChangeIndicatorProps {
  changeData: KpiChangeData;
}

export interface ChatInterfaceProps {
  initialClientes: Cliente[];
  initialProductos: Producto[];
}

// 3. ASISTENTE DE FACTURACIÓN (CHAT)

export type ChatMessageSender = 'user' | 'bot';

export interface ChatMessage {
  id: number;
  sender: ChatMessageSender;
  content: React.ReactNode;
}
export interface ChatMessageProps {
  sender: 'user' | 'bot';
  children: React.ReactNode;
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

export type ChatAction =
  | { type: 'CLIENT_SELECTED'; payload: Cliente }
  | { type: 'PRODUCT_ADDED'; payload: Producto }
  | { type: 'FINISH_ADDING_PRODUCTS' }
  | { type: 'ANSWER_DISCOUNT'; payload: boolean }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'SET_PAYMENT'; payload: string }
  | { type: 'SET_INSTALLMENTS'; payload: number }
  | { type: 'CONFIRM_INVOICE' }
  | { type: 'DOWNLOAD_PDF' }
  | { type: 'RESET' };

export interface ChatComponentState {
  messages: ChatMessage[];
  chatState: ChatState;
  factura: { cliente: Cliente | null; items: ItemFactura[]; metodoPago?: string; cuotas?: number; };
  descuento: number;
  isLoading: boolean;
  lastInvoiceId: number | null;
}
export interface DraftFactura {
  cliente: Cliente | null;
  items: ItemFactura[];
  metodoPago?: string;
  cuotas?: number;
}


// 4. DATOS COMPUESTOS Y UTILITARIOS

export interface DashboardStats {
  ventasMes: { actual: number; anterior: number };
  nuevosClientes: { actual: number; anterior: number };
  facturasEmitidas: { actual: number; anterior: number };
  productosActivos: { actual: number; anterior: number };
}

export interface FullInvoiceData {
  factura: Factura;
  cliente: Cliente;
  items: ItemFactura[];
}

export type KpiChangeData = {
  texto: string;
  status: 'increase' | 'decrease' | 'neutral';
};