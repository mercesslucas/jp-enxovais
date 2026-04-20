import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { MOCK_PRODUCTS } from '@/lib/data';

async function ensureProducts() {
   const count = await query('SELECT COUNT(*) as c FROM products') as any[];
   if (count[0].c === 0) {
      for (const p of MOCK_PRODUCTS) {
         await query('INSERT INTO products (id, data) VALUES (?, ?)', [p.id, JSON.stringify(p)]);
      }
   }
}

export async function GET() {
  try {
    await ensureProducts().catch(()=>null);
    const rows = await query('SELECT data FROM products') as any[];
    const products = rows.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const p = await request.json();
    p.id = Math.random().toString(36).substr(2, 9);
    await query('INSERT INTO products (id, data) VALUES (?, ?)', [p.id, JSON.stringify(p)]);
    return NextResponse.json({ success: true, product: p }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const p = await request.json();
    const result = await query('UPDATE products SET data=? WHERE id=?', [JSON.stringify(p), p.id]) as any;
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product: p });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    await query('DELETE FROM products WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
