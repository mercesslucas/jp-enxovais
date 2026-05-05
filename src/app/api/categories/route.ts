import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // A inicialização do banco garantirá a criação da tabela de categorias e mocks
    const rows = await query('SELECT * FROM categories ORDER BY name ASC') as any[];
    return NextResponse.json({ categories: rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    const id = Math.random().toString(36).substr(2, 9);
    await query('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
    return NextResponse.json({ success: true, category: { id, name } }, { status: 201 });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    if (!id || !name) return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    
    const result = await query('UPDATE categories SET name=? WHERE id=?', [name, id]) as any;
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, category: { id, name } });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    await query('DELETE FROM categories WHERE id=?', [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
