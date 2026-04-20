import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const clients = await query('SELECT id, fullName, email, address, city, state, phone, document, status, createdAt FROM clients ORDER BY createdAt DESC') as any[];
    return NextResponse.json({ clients });
  } catch (err) {
    console.error('Fetch clients error:', err);
    return NextResponse.json({ message: "Error reading db" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();

    const result = await query('UPDATE clients SET status = ? WHERE id = ?', [status, id]) as any;

    if (result.affectedRows === 0) {
       return NextResponse.json({ message: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Update client error:', e);
    return NextResponse.json({ message: "Fail to update" }, { status: 500 });
  }
}
