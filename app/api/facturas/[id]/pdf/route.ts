// app/api/facturas/[id]/pdf/route.ts - VERSIÓN FINAL Y ROBUSTA
import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream, Document } from '@react-pdf/renderer';
import { FacturaPDF } from '@/components/pdf/FacturaPDF';
import { FullInvoiceData } from '@/types';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facturaId = parseInt(params.id);

    // 1. Obtener los datos (sin cambios)
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

    // 2. Renderizar el componente de React a un stream de PDF (sin cambios)
    const pdfStream = await renderToStream(
      React.createElement(Document, null, React.createElement(FacturaPDF, { data: fullInvoiceData }))
    );

    // ✅ 3. Convertimos el stream de Node.js a un Buffer
    const chunks: Uint8Array[] = [];
    // Usamos 'for await...of' que es la forma moderna de consumir un stream de Node.js
    for await (const chunk of pdfStream as any) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // ✅ 4. Devolvemos el Buffer como respuesta. Esto es 100% compatible.
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura_${facturaId}.pdf"`,
      },
    });

  } catch (error) {
    const err = error as Error;
    console.error("ERROR PDF:", err);
    return NextResponse.json({ error: 'Error al generar el PDF: ' + err.message }, { status: 500 });
  }
}