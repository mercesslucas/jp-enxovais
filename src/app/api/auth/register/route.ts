import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Server-side validation
    if (!data.fullName || !data.email || !data.password || !data.document) {
       return NextResponse.json({ success: false, message: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Check if email or document already exists
    const exists = await query(
      'SELECT id FROM clients WHERE email = ? OR document = ? LIMIT 1',
      [data.email, data.document]
    ) as any[];

    if (exists.length > 0) {
       return NextResponse.json({ success: false, message: "E-mail ou Documento já cadastrado na base." }, { status: 409 });
    }

    const newId = crypto.randomUUID();

    await query(`
      INSERT INTO clients (id, fullName, email, password, address, city, state, phone, document, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      newId,
      data.fullName,
      data.email,
      data.password,
      data.address || null,
      data.city || null,
      data.state || null,
      data.phone || null,
      data.document
    ]);

    const newClient = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      phone: data.phone,
      document: data.document,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, client: newClient });
  } catch (err) {
    console.error('Registration Error:', err);
    return NextResponse.json({ success: false, message: "Erro interno." }, { status: 500 });
  }
}
