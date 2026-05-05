import mysql from 'mysql2/promise';

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jpenxovais_db',
  });

  const [rows] = await pool.execute('SELECT * FROM products');
  const [catRows] = await pool.execute('SELECT name FROM categories');
  const activeCategories = (catRows as any[]).map(c => c.name.toLowerCase());

  let deleted = 0;
  for (const row of rows as any[]) {
    const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    if (!activeCategories.includes(data.category.toLowerCase())) {
      await pool.execute('DELETE FROM products WHERE id = ?', [row.id]);
      console.log(`Deletado produto fictício/órfão: ${data.name}`);
      deleted++;
    }
  }
  console.log(`\nTotal: Deletados ${deleted} produtos que não constavam nas categorias atuais.`);
  process.exit(0);
}

run();
