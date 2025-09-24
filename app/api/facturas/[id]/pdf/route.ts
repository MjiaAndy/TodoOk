// app/api/facturas/[id]/pdf/route.ts - VERSIÓN FINAL Y CORREGIDA
import { NextRequest, NextResponse } from 'next/server'; // ✅ 1. Importamos NextRequest
import React from 'react';
import { renderToStream, Document } from '@react-pdf/renderer';
import { FacturaPDF } from '@/components/pdf/FacturaPDF';
import { FullInvoiceData } from '@/types';
import db from '@/lib/db';

// ✅ 2. Actualizamos la firma de la función GET
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: facturaIdString } = context.params;
    const facturaId = parseInt(facturaIdString);
    const facturaRes = await db.query('SELECT * FROM facturas WHERE id = $1', [facturaId]);
    if (facturaRes.rows.length === 0) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }
    const clienteRes = await db.query('SELECT * FROM clientes WHERE id = $1', [facturaRes.rows[0].cliente_id]);
    const itemsRes = await db.query(
      'SELECT p.nombre, fi.cantidad, fi.precio_unitario as precio, p.id, p.stock FROM factura_items fi JOIN productos p ON fi.producto_id = p.id WHERE fi.factura_id = $1',
      [facturaId]
    );

    const fullInvoiceData: FullInvoiceData = {
      factura: facturaRes.rows[0],
      cliente: clienteRes.rows[0],
      items: itemsRes.rows,
    };
    
    const pdfStream = await renderToStream(
      React.createElement(Document, null, React.createElement(FacturaPDF, { data: fullInvoiceData }))
    );

    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream as NodeJS.ReadableStream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura_${facturaId}.pdf"`,
      },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("ERROR PDF:", err);
    return NextResponse.json({ error: 'Error al generar el PDF: ' + err.message }, { status: 500 });
  }
}