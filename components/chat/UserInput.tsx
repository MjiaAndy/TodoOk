// components/chat/UserInput.tsx
'use client';

import { useState } from 'react';
import { ChatState, Cliente, Producto, ChatAction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserInputProps {
  chatState: ChatState;
  onAction: (action: ChatAction) => void;
  clientes: Cliente[];
  productos: Producto[];
}

export function UserInput({ chatState, onAction, clientes, productos }: UserInputProps) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discountValue, setDiscountValue] = useState('');

  switch (chatState) {
    case 'SELECTING_CLIENT':
      return (
        <div className="flex items-center gap-2">
          <select 
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              const cliente = clientes.find(c => c.id === parseInt(e.target.value));
              if (cliente) {
                onAction({ type: 'CLIENT_SELECTED', payload: cliente });
              }
            }}
            className="flex h-10 w-full rounded-md border border-slate-700 bg-background-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>-- Elige un cliente --</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      );
    
    case 'ADDING_PRODUCTS':
      return (
        <div className="flex items-center gap-2">
          <select 
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-700 bg-background-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>-- Elige un producto --</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>)}
          </select>
          <Button onClick={() => {
            const producto = productos.find(p => p.id === parseInt(selectedProductId));
            if (producto) onAction({ type: 'PRODUCT_ADDED', payload: producto });
            setSelectedProductId('');
          }}>Añadir</Button>
          <Button onClick={() => onAction({ type: 'FINISH_ADDING_PRODUCTS' })} variant="secondary">Continuar</Button>
        </div>
      );
      
    case 'ASKING_DISCOUNT':
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => onAction({ type: 'ANSWER_DISCOUNT', payload: false })} variant="secondary" className="w-full">No aplicar</Button>
          <Button onClick={() => onAction({ type: 'ANSWER_DISCOUNT', payload: true })} className="w-full">Sí, aplicar</Button>
        </div>
      );
    
    case 'ENTERING_DISCOUNT':
      return (
        <form onSubmit={(e) => { e.preventDefault(); onAction({ type: 'SET_DISCOUNT', payload: parseFloat(discountValue) }); }} className="flex items-center gap-2">
          <Input type="number" placeholder="Ej: 10" value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
          <Button type="submit">Aplicar</Button>
        </form>
      );
    
    case 'SELECTING_PAYMENT':
      const metodos = ['Efectivo', 'Transferencia', 'Tarjeta de Débito', 'Tarjeta de Crédito'];
      return (
        <select 
          onChange={(e) => onAction({ type: 'SET_PAYMENT', payload: e.target.value })}
          className="flex h-10 w-full rounded-md border border-slate-700 bg-background-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Elige un método de pago --</option>
          {metodos.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      );

    case 'SELECTING_INSTALLMENTS':
       const cuotas = [1, 3, 6, 9, 12, 18];
       return (
        <select 
          onChange={(e) => onAction({ type: 'SET_INSTALLMENTS', payload: parseInt(e.target.value) })}
          className="flex h-10 w-full rounded-md border border-slate-700 bg-background-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Elige las cuotas --</option>
          {cuotas.map(c => <option key={c} value={c}>{c} cuota(s)</option>)}
        </select>
      );

    case 'REVIEWING_INVOICE':
      return <Button onClick={() => onAction({ type: 'CONFIRM_INVOICE' })} size="lg" className="w-full">Generar Factura</Button>

   case 'FINALIZED':
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onAction({ type: 'DOWNLOAD_PDF' })} variant="secondary" className="w-full">Descargar Factura</Button>
      <Button onClick={() => onAction({ type: 'RESET' })} className="w-full">Crear Nueva Factura</Button>
    </div>
  );
    
    default:
      return <p className="text-sm text-center text-foreground-alt">...</p>;
  }
}