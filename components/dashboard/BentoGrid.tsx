// components/dashboard/BentoGrid.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { GridStack } from 'gridstack';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { DollarSign, Users, FileText, Package } from 'lucide-react';
import { calcularCambioPorcentual } from '@/lib/utils';
import { BentoGridProps, Factura } from '@/types';
import { KpiChangeIndicator } from './KpiIndicador';


export function BentoGrid({ stats, initialInvoices }: BentoGridProps) {
  const gridRef = useRef(null);
  const [gridFacturas, setGridFacturas] = useState<Factura[]>(initialInvoices);

  useEffect(() => {
    if (gridRef.current) {
      GridStack.init({ column: 4, cellHeight: 'auto', minRow: 1, margin: '0.2rem' }, gridRef.current);
    }
  }, []);

  const kpis = {
    ventas: calcularCambioPorcentual(stats.ventasMes.actual, stats.ventasMes.anterior),
    clientes: calcularCambioPorcentual(stats.nuevosClientes.actual, stats.nuevosClientes.anterior), 
    facturas: calcularCambioPorcentual(stats.facturasEmitidas.actual, stats.facturasEmitidas.anterior),
    productos : calcularCambioPorcentual(stats.productosActivos.actual, stats.productosActivos.anterior),
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Resumen</h2>
        <Link href="/facturas"><Button size="lg">Crear Factura</Button></Link>
      </div>

      <div ref={gridRef} className="grid-stack">
         <motion.div className="grid-stack-item" gs-x="0" gs-y="0" gs-w="2" gs-h="2"
          whileHover={{ scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
         >
            <div className="grid-stack-item-content">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Ventas del Mes</CardTitle>
                  <DollarSign className="h-4 w-4 text-foreground-alt" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center">
                  <div className="text-4xl font-extrabold text-foreground-strong">${stats.ventasMes.actual.toLocaleString('es-AR')}</div>
                  <KpiChangeIndicator changeData={kpis.ventas} />
                </CardContent>
              </Card>
            </div>
         </motion.div>
        

        <motion.div className="grid-stack-item" gs-x="2" gs-y="0" gs-w="2" gs-size-to-content="true"
          whileHover={{ scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
         >
            <div className="grid-stack-item-content">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Facturas Recientes</CardTitle>
                  <FileText className="h-4 w-4 text-foreground-alt" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Table>
                    <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {initialInvoices && initialInvoices.map((factura) => (
                        <TableRow key={factura.id}>
                          <TableCell className="font-medium text-foreground-strong">{factura.cliente_nombre}</TableCell>
                          <TableCell><span className={`px-2 py-1 rounded-full text-xs font-semibold ${factura.estado === 'Pagada' ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'}`}>{factura.estado}</span></TableCell>
                          <TableCell className="text-right">${factura.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
         </motion.div>
        
        <motion.div className="grid-stack-item" gs-x="2" gs-y="1" gs-w="1" gs-size-to-content="true"
          whileHover={{ scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
         >
            <div className="grid-stack-item-content">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
                  <Users className="h-4 w-4 text-foreground-alt" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center">
                  <div className="text-2xl font-extrabold">+{stats.nuevosClientes.actual}</div>
                  <p className={`text-xs ${
                    kpis.clientes.status === 'increase' ? 'text-success' :
                    kpis.clientes.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
                  }`}>{kpis.clientes.texto} desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>
         </motion.div>

        <motion.div className="grid-stack-item" gs-x="3" gs-y="1" gs-w="1" gs-size-to-content="true"
          whileHover={{ scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
         >
            <div className="grid-stack-item-content">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                  <Package className="h-4 w-4 text-foreground-alt" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center">
                  <div className="text-2xl font-extrabold">{stats.productosActivos.actual}</div>
                  <p className={`text-xs ${
                    kpis.productos.status === 'increase' ? 'text-success' :
                    kpis.productos.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
                  }`}>{kpis.productos.texto} desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>
         </motion.div>
      </div>
    </div>
  );
}