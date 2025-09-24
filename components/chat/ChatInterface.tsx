// components/chat/ChatInterface.tsx
'use client';

import { useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { ChatMessage } from './ChatMessage';
import { UserInput } from './UserInput';
import { ChatMessage as ChatMessageType, ChatState, Cliente, Producto, DraftFactura, ChatAction } from '@/types';
import {ChatInterfaceProps} from '@/types'
import { Loader2 } from 'lucide-react';


const getInitialMessages = (): ChatMessageType[] => [
  {
    id: Date.now(), 
    sender: 'bot',
    content: '¡Hola! Vamos a crear una nueva factura. Por favor, selecciona un cliente para comenzar.',
  },
];

export function ChatInterface({ initialClientes, initialProductos }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>(getInitialMessages);
  const [chatState, setChatState] = useState<ChatState>('SELECTING_CLIENT');
  const [factura, setFactura] = useState<DraftFactura>({
    cliente: null,
    items: [],
  });
  const [descuento, setDescuento] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<number | null>(null);
  const subtotal = useMemo(() => factura.items.reduce((total, item) => total + item.precio * item.cantidad, 0), [factura.items]);
  const montoDescuento = useMemo(() => subtotal * (descuento / 100), [subtotal, descuento]);
  const baseImponible = subtotal - montoDescuento;
  const montoIVA = useMemo(() => baseImponible * (0.21), [baseImponible]);
  const totalFinal = useMemo(() => baseImponible + montoIVA, [baseImponible, montoIVA]);

  const addMessage = (sender: 'bot' | 'user', content: React.ReactNode) => {
    setMessages(prevMessages => {
      const lastId = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1].id : 0;
      const newMessage: ChatMessageType = {
        id: lastId + 1,
        sender,
        content,
      };
      return [...prevMessages, newMessage];
    });
  };

  const handleUserAction = async (action: ChatAction) => {
    switch (action.type) {
      case 'CLIENT_SELECTED':
        const cliente = action.payload as Cliente;
        setFactura({ ...factura, cliente });
        addMessage('user', `Cliente seleccionado: ${cliente.nombre}`);
        addMessage('bot', 'Perfecto. Ahora, busca y añade los productos a la factura.');
        setChatState('ADDING_PRODUCTS');
        break;

      case 'PRODUCT_ADDED':{
        const producto = action.payload as Producto;
        const itemExistente = factura.items.find(item => item.id === producto.id);
        if (itemExistente) {
          setFactura({ ...factura, items: factura.items.map(item =>
            item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
          )});
        } else {
          setFactura({ ...factura, items: [...factura.items, { ...producto, precio: Number(producto.precio), cantidad: 1 }]});
        }
        addMessage('user', `Añadir: ${producto.nombre}`);
        addMessage('bot', 'Producto añadido. Puedes agregar más o hacer clic en "Continuar".');
        break;
      }
      case 'FINISH_ADDING_PRODUCTS':{
        if (factura.items.length === 0) {
          toast.error("Debes agregar al menos un producto.");
          return;
        }
        addMessage('user', 'He terminado de añadir productos.');
        addMessage('bot', `¡Genial! El subtotal es $${subtotal.toFixed(2)}. ¿Deseas aplicar algún descuento?`);
        setChatState('ASKING_DISCOUNT');
        break;
      }
      case 'ANSWER_DISCOUNT': {
        if (action.payload === true) {
          addMessage('user', 'Sí, aplicar descuento.');
          addMessage('bot', 'Por favor, ingresa el porcentaje de descuento.');
          setChatState('ENTERING_DISCOUNT');
        } else {
          addMessage('user', 'No, sin descuento.');
          addMessage('bot', 'Entendido. ¿Cuál será el método de pago?');
          setChatState('SELECTING_PAYMENT');
        }
        break;
      }
      case 'SET_DISCOUNT': {
        const desc = action.payload;
        if (!isNaN(desc) && desc > 0) {
          setDescuento(desc);
          addMessage('user', `Aplicar un ${desc}% de descuento.`);
          addMessage('bot', `Descuento del ${desc}% aplicado. Ahora, ¿cuál será el método de pago?`);
        } else {
          addMessage('bot', 'Valor de descuento inválido. Continuemos. ¿Cuál será el método de pago?');
        }
        setChatState('SELECTING_PAYMENT');
        break;
      }
      case 'SET_PAYMENT': {
        const metodoPago = action.payload as string;
        setFactura(prev => ({ ...prev, metodoPago }));
        addMessage('user', `Método de pago: ${metodoPago}.`);
        if (metodoPago === 'Tarjeta de Crédito') {
          addMessage('bot', 'Perfecto. ¿En cuántas cuotas?');
          setChatState('SELECTING_INSTALLMENTS');
        } else {
          addMessage('bot', 'Entendido. Aquí está el resumen final de la factura. ¿Confirmas?');
          setChatState('REVIEWING_INVOICE');
        }
        break;
      }
      case 'SET_INSTALLMENTS':{
        const cuotas = action.payload;
        setFactura(prev => ({ ...prev, cuotas }));
        addMessage('user', `${cuotas} cuota(s).`);
        addMessage('bot', '¡Todo listo! Aquí está el resumen final de la factura. ¿Confirmas?');
        setChatState('REVIEWING_INVOICE');
        break;
      }
      case 'CONFIRM_INVOICE':{
        setIsLoading(true);
        addMessage('user', 'Sí, generar la factura.');
        await toast.promise(
          axios.post('/api/facturas', {
            cliente_id: factura.cliente?.id,
            productos_vendidos: factura.items.map(item => ({ id: item.id, cantidad: item.cantidad })),
            impuesto: montoIVA,
            descuento: montoDescuento,
          }),
          {
             loading: 'Procesando factura...',
            success: (res) => {
              const newId = res.data.facturaId;
              setLastInvoiceId(newId);
              addMessage('bot', `¡Factura #${newId} creada! ¿Qué deseas hacer ahora?`);
              setChatState('FINALIZED');
              return '¡Factura creada con éxito!';
            },
            error: (err) => {
              addMessage('bot', `Hubo un error: ${err.response?.data?.error || 'No se pudo crear la factura.'}`);
              return `Error: ${err.response?.data?.error || 'No se pudo crear la factura.'}`;
            },
          }
        );
        setIsLoading(false);
        break;
      }
      case 'DOWNLOAD_PDF': {
        if (lastInvoiceId) {
          window.open(`/api/facturas/${lastInvoiceId}/pdf`, '_blank');
        }
        break;
      }
      case 'RESET': {
        setMessages(getInitialMessages);
        setChatState('SELECTING_CLIENT');
        setDescuento(0);
        setLastInvoiceId(null);
        setFactura({ cliente: null, items: [], metodoPago: undefined, cuotas: undefined });
        break;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 h-full">
      <div className="lg:col-span-2 flex flex-col h-full">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Asistente de Facturación</h2>
        <Card className="flex-grow flex flex-col" isHoverable>
          <CardContent className="flex-grow p-6 flex flex-col-reverse space-y-4 overflow-y-auto">
            <div className="flex flex-col items-start space-y-4 w-full">
              <AnimatePresence>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} sender={msg.sender}>{msg.content}</ChatMessage>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
          <div className="p-4 border-t border-slate-700">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-foreground-alt"><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</div>
            ) : (
              <UserInput chatState={chatState} onAction={handleUserAction} clientes={initialClientes} productos={initialProductos} />
            )}
          </div>
        </Card>
      </div>

      <div className="hidden lg:block">
        <Card className="sticky top-8" isHoverable>
          <CardHeader>
            <CardTitle>Vista previa Factura</CardTitle>
            <CardDescription>{factura.cliente ? `Cliente: ${factura.cliente.nombre}` : 'Ningún cliente seleccionado'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead>Cant.</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
              <TableBody>
                <AnimatePresence>
                  {factura.items.map(item => (
                    <motion.tr key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TableCell className="font-medium">{item.nombre}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell className="text-right">${(item.precio * item.cantidad).toFixed(2)}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {factura.items.length > 0 && (
              <div className="border-t border-slate-700 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-foreground-alt">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-foreground-alt">
                    <span>Descuento ({descuento}%)</span>
                    <span className="text-danger">-${montoDescuento.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground-alt">
                  <span>IVA (21%)</span>
                  <span>${montoIVA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground-strong border-t border-slate-700 pt-2 mt-2">
                  <span>Total Final</span>
                  <span>${totalFinal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}