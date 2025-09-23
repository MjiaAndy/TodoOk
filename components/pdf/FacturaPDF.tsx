// components/pdf/FacturaPDF.tsx
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FullInvoiceData } from '@/types';

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 11, paddingTop: 30, paddingLeft: 60, paddingRight: 60, paddingBottom: 30 },
  header: { textAlign: 'center', marginBottom: 20 },
  invoiceTitle: { fontSize: 24, fontWeight: 'bold' },
  customerInfo: { marginBottom: 20 },
  table: { display: 'flex', flexDirection: 'column' as 'column', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#E4E4E4', padding: 5, fontWeight: 'bold' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  totals: { marginTop: 20, textAlign: 'right' },
});

export const FacturaPDF = ({ data }: { data: FullInvoiceData }) => (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.invoiceTitle}>Factura #{data.factura.id}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text>Fecha: {new Date(data.factura.fecha).toLocaleDateString()}</Text>
        <Text>Cliente: {data.cliente.nombre}</Text>
      </View>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={{ ...styles.tableColHeader, width: '40%' }}>Producto</Text>
          <Text style={{ ...styles.tableColHeader, width: '20%' }}>Cantidad</Text>
          <Text style={{ ...styles.tableColHeader, width: '20%' }}>Precio Unit.</Text>
          <Text style={{ ...styles.tableColHeader, width: '20%' }}>Total</Text>
        </View>
        {data.items.map(item => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={{ ...styles.tableCol, width: '40%' }}>{item.nombre}</Text>
            <Text style={{ ...styles.tableCol, width: '20%' }}>{item.cantidad}</Text>
            <Text style={{ ...styles.tableCol, width: '20%' }}>${parseFloat(item.precio as any).toFixed(2)}</Text>
            <Text style={{ ...styles.tableCol, width: '20%' }}>${(parseFloat(item.precio as any) * item.cantidad).toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.totals}>
        <Text>Total: ${parseFloat(data.factura.total as any).toFixed(2)}</Text>
      </View>
    </Page>
);