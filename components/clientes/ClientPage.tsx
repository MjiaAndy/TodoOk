'use client';

import { useState } from 'react';
import axios from 'axios';
import { Cliente, ClientClientPageProps } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ClientClientPage({ initialClients }: ClientClientPageProps) {
  const [clientes, setClientes] = useState<Cliente[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const agregarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const nuevoCliente = { nombre, email };
      await toast.promise(
        axios.post('/api/clientes', nuevoCliente),
        {
          loading: 'Guardando cliente...',
          success: (res) => {
            setClientes([...clientes, res.data]);
            setNombre('');
            setEmail('');
            setIsModalOpen(false);
            return '¡Cliente agregado con éxito!';
          },
          error: (err) => `Error: ${err.response?.data?.error || 'No se pudo agregar el cliente.'}`,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Añade un nuevo cliente a tu base de datos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={agregarCliente} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del cliente</Label>
                <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Guardando...' : 'Guardar Cliente'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card isHoverable>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Clientes registrados en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {clientes.map((cliente) => (
                  <motion.tr key={cliente.id}>
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
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