'use client';

import { useState } from 'react';
import axios from 'axios';
import { Producto, ProductClientPageProps } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/Table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription
} from '@/components/ui/Dialog';
import { Card, CardContent } from '@/components/ui/Card';
import { PlusCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProductClientPage({ initialProducts }: ProductClientPageProps) {
  const [productos, setProductos] = useState<Producto[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const nuevoProducto = {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      };

    await toast.promise(
      axios.post('/api/productos', nuevoProducto),
      {
        loading: 'Guardando producto...',
        success: (res) => {
          setProductos([...productos, res.data]); 
          setNombre(''); setPrecio(''); setStock(''); 
          setIsModalOpen(false); 
          return '¡Producto agregado con éxito!'; 
        },
        error: (err) => `Error: ${err.response?.data?.error || 'No se pudo agregar el producto.'}`,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventario Actual</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Rellena los campos para añadir un nuevo artículo a tu inventario.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={agregarProducto} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del producto</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <Input id="precio" type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Guardando...' : 'Guardar Producto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card isHoverable>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {productos.map((producto) => (
                    <motion.tr
                      key={producto.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border-b border-slate-700 transition-colors hover:bg-background-alt/50"
                    >
                      <TableCell>{producto.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{producto.nombre}</TableCell>
                      <TableCell>${producto.precio.toFixed(2)}</TableCell>
                      <TableCell>{producto.stock}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}