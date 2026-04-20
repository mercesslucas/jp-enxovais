import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { MOCK_PRODUCTS } from '@/lib/data';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

function getDb(): { orders: any[], products: any[] } {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ orders: [], products: MOCK_PRODUCTS }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = getDb();
  return NextResponse.json({ products: db.products });
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    newProduct.id = Math.random().toString(36).substr(2, 9);
    
    const db = getDb();
    db.products.push(newProduct);
    saveDb(db);
    
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const db = getDb();
    
    const index = db.products.findIndex((p: any) => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    db.products[index] = updatedProduct;
    saveDb(db);
    
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const db = getDb();
    db.products = db.products.filter((p: any) => p.id !== id);
    saveDb(db);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
