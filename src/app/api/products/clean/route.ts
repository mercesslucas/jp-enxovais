import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE() {
  try {
    const productsRows = await query('SELECT * FROM products') as any[];
    const catRows = await query('SELECT name FROM categories') as any[];
    const activeCategories = catRows.map((c: any) => c.name.toLowerCase());

    let deletedCount = 0;
    for (const row of productsRows) {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      if (!activeCategories.includes(data.category.toLowerCase())) {
        await query('DELETE FROM products WHERE id = ?', [row.id]);
        deletedCount++;
      }
    }
    
    return NextResponse.json({ success: true, deletedCount, message: `Limpamos ${deletedCount} produtos fictícios/órfãos.` });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao limpar produtos' }, { status: 500 });
  }
}
