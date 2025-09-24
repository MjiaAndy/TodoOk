// app/api/facturas/[id]/pdf/route.ts
import { NextResponse } from 'next/server';
import React from 'react';
import {z} from 'zod'
import { renderToStream, Document } from '@react-pdf/renderer';
import { FacturaPDF } from '@/components/pdf/FacturaPDF';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facturaId = parseInt(params.id);

    // 1. Obtener los datos (esta lógica es la misma y está perfecta)
    const facturaRes = await db.query('SELECT * FROM facturas WHERE id = $1', [facturaId]);
    const clienteRes = await db.query('SELECT * FROM clientes WHERE id = $1', [facturaRes.rows[0].cliente_id]);
    const itemsRes = await db.query(
      'SELECT p.nombre, fi.cantidad, fi.precio_unitario as precio, p.id, p.stock FROM factura_items fi JOIN productos p ON fi.producto_id = p.id WHERE fi.factura_id = $1', 
      [facturaId]
    );
    
    if (facturaRes.rows.length === 0) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }

    const fullInvoiceData = {
      factura: facturaRes.rows[0],
      cliente: clienteRes.rows[0],
      items: itemsRes.rows,
    };
    
    const pdfStream = await renderToStream(
      React.createElement(
        Document, 
        null, // Props del Document, en este caso ninguna
        React.createElement(FacturaPDF, { data: fullInvoiceData })
      )
    );

    // 3. Devolver el stream como respuesta
    return new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura_${facturaId}.pdf"`,
      },
    });

  } catch (error) { 
    const err = error as any; 
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    if (err.code === '23505') { 
      return NextResponse.json({ error: 'El PDF ya esta creado.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al generar el PDF: '}, { status: 500 });
  }
}