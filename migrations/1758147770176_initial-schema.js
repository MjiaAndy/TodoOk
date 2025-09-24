exports.up = (pgm) => {
  // 1. Crear tabla de clientes
  pgm.createTable('clientes', {
    id: 'id', 
    nombre: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    dni: { type: 'varchar(50)' },
    direccion: { type: 'varchar(255)' },
    condicion_iva: { type: 'varchar(100)' },
  });

  // 2. Crear tabla de productos
  pgm.createTable('productos', {
    id: 'id',
    nombre: { type: 'varchar(255)', notNull: true },
    precio: { type: 'decimal(10, 2)', notNull: true },
    stock: { type: 'integer', notNull: true },
    categoria: { type: 'varchar(100)' },
    garantia: { type: 'varchar(100)' },
  });

  // 3. Crear tabla de facturas
  pgm.createTable('facturas', {
    id: 'id',
    cliente_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'clientes(id)', 
      onDelete: 'SET NULL' 
    },
    total: { type: 'decimal(10, 2)', notNull: true },
    impuesto: { type: 'decimal(10, 2)', notNull: true, default: 0.00 },
    descuento: { type: 'decimal(10, 2)', notNull: true, default: 0.00 },
    fecha: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // 4. Crear la tabla de detalle de facturas (la más importante)
  pgm.createTable('factura_items', {
    id: 'id',
    factura_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'facturas(id)', 
      onDelete: 'CASCADE' 
    },
    producto_id: { 
      type: 'integer', 
      notNull: true, 
      references: 'productos(id)' 
    },
    cantidad: { type: 'integer', notNull: true },
    precio_unitario: { type: 'decimal(10, 2)', notNull: true },
  });

  // 5. Crear tabla de usuarios
  pgm.createTable('usuarios', {
    id: 'id',
    nombre: { type: 'varchar(255)' },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('factura_items');
  pgm.dropTable('facturas');
  pgm.dropTable('productos');
  pgm.dropTable('clientes');
  pgm.dropTable('usuarios');
};