import mysql from 'mysql2/promise';

async function clear() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jpenxovais_db',
  });

  await pool.execute('DELETE FROM products');
  console.log('Products cleared!');
  process.exit(0);
}

clear();
