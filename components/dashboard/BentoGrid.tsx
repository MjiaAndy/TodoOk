// components/dashboard/BentoGrid.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GridStack } from 'gridstack';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, Users, FileText, Package } from 'lucide-react';
import { calcularCambioPorcentual } from '@/lib/utils';
import { DashboardStats, RecentInvoice } from '@/types';

// Definimos los tipos para las props
interface BentoGridProps {
  stats: DashboardStats;
  recentInvoices: RecentInvoice[];
}


export function BentoGrid({ stats, recentInvoices }: BentoGridProps) {
  const gridRef = useRef(null);

  useEffect(() => {
    // Inicializamos GridStack solo una vez
    if (gridRef.current) {
      const grid = GridStack.init({
        column: 4, // Usaremos una cuadrícula de 4 columnas
        cellHeight: 'auto',
        minRow: 1,
        margin: '1rem',
      }, gridRef.current);
    }
  }, []);

  // Calculamos los cambios para cada KPI
  const kpis = {
    ventas : calcularCambioPorcentual(stats.ventasMes.actual, stats.ventasMes.anterior),
    cientes : calcularCambioPorcentual(stats.nuevosClientes.actual, stats.nuevosClientes.anterior),
    facturas : calcularCambioPorcentual(stats.facturasEmitidas.actual, stats.facturasEmitidas.anterior),
    productos : calcularCambioPorcentual(stats.productosActivos.actual, stats.productosActivos.anterior),
  }
  

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h3 className="text-3xl font-bold tracking-tight">Resumen</h3>
        <div className="flex items-center space-x-2">
          <Link href="/facturas">
            <Button size="lg">Crear Factura</Button>
          </Link>
        </div>
      </div>

      {/* El contenedor de GridStack */}
      <div ref={gridRef} className="grid-stack">
        {/* Usamos atributos gs-* para definir el layout del Bento Grid */}
        <div className="grid-stack-item" gs-x="0" gs-y="0" gs-w="2" gs-h="2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-foreground-alt" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${stats.ventasMes.actual.toLocaleString('es-AR')}</div>
              <p className={`text-xs ${
                kpis.ventas.status === 'increase' ? 'text-success' :
                kpis.ventas.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
              }`}>{kpis.ventas.texto} desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid-stack-item" gs-x="2" gs-y="0" gs-w="2" gs-h="1">
           <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facturas Recientes</CardTitle>
              <FileText className="h-4 w-4 text-foreground-alt" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{stats.facturasEmitidas.actual}</div>
                <p className={`text-xs ${
                kpis.facturas.status === 'increase' ? 'text-success' :
                kpis.facturas.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
              }`}>{kpis.facturas.texto} desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid-stack-item" gs-x="2" gs-y="1" gs-w="1" gs-h="1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
              <Users className="h-4 w-4 text-foreground-alt" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.nuevosClientes.actual}</div>
              <p className={`text-xs ${
                kpis.cientes.status === 'increase' ? 'text-success' :
                kpis.cientes.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
              }`}>{kpis.cientes.texto} desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid-stack-item" gs-x="3" gs-y="1" gs-w="1" gs-h="1">
           <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
              <Package className="h-4 w-4 text-foreground-alt" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productosActivos.actual}</div>
              <p className={`text-xs ${
                kpis.productos.status === 'increase' ? 'text-success' :
                kpis.productos.status === 'decrease' ? 'text-danger' : 'text-foreground-alt'
              }`}>{kpis.productos.texto} desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}