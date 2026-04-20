import mysql from 'mysql2/promise';

// Caching do pool para ambientes Serverless
const globalForMySQL = global as unknown as { mysqlPool: mysql.Pool };

export const pool =
  globalForMySQL.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jpenxovais_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') globalForMySQL.mysqlPool = pool;

let isInitialized = false;

export async function query(sql: string, values?: any[]) {
  if (!isInitialized) {
    await initDb();
    isInitialized = true;
  }
  const [rows] = await pool.execute(sql, values);
  return rows;
}

export async function initDb() {
  // Criação da Tabela de Clientes
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id VARCHAR(36) PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(50),
      phone VARCHAR(50),
      document VARCHAR(50) UNIQUE,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criação da Tabela de Pedidos
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      clientId VARCHAR(36) NULL,
      clientName VARCHAR(255) NOT NULL,
      clientAddress TEXT,
      items JSON NOT NULL,
      status ENUM('Pendente', 'Aprovado', 'Enviado', 'Arquivado') DEFAULT 'Pendente',
      totalItems INT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criação da Tabela de Produtos
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      data JSON NOT NULL
    )
  `);
}
