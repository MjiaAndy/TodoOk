// components/historial/InvoiceHistoryClientPage.tsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { json2csv } from 'json-2-csv'
import { Factura, InvoiceHistoryClientPageProps } from '@/types';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Download, Loader2 } from 'lucide-react';

export function InvoiceHistoryClientPage({ initialInvoices }: InvoiceHistoryClientPageProps) {
  const [facturas, setFacturas] = useState<Factura[]>(initialInvoices);
  const [isExporting, setIsExporting] = useState(false);

  const exportarAExcel = async () => {
    setIsExporting(true);
    
    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        if (facturas.length === 0) {
          throw new Error("No hay facturas para exportar.");
        }
        const csv = await json2csv(facturas);
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'historial_facturas.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    await toast.promise(promise, {
      loading: 'Generando archivo CSV...',
      success: '¡Archivo exportado con éxito!',
      error: (err) => `Error: ${err.message || 'No se pudo exportar.'}`,
    });
    
    setIsExporting(false);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Historial de Facturas</h2>
        <Button size="lg" onClick={exportarAExcel} variant="secondary" className="flex items-center gap-2" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {isExporting ? 'Exportando...' : 'Exportar (CSV)'}
        </Button>
      </div>
      <Card isHoverable>
        <CardHeader>
          <CardTitle>Facturas Emitidas</CardTitle>
          <CardDescription>Lista de todas las facturas generadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium text-foreground">#{factura.id}</TableCell>
                  <TableCell>{factura.cliente_nombre || 'N/A'}</TableCell>
                  <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${factura.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}