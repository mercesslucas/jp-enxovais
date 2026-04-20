import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'clients.json');

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    let db: { clients: any[] } = { clients: [] };
    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(fileData);
    }

    // Server-side validation
    if (!data.fullName || !data.email || !data.password || !data.document) {
       return NextResponse.json({ success: false, message: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Check if email or document already exists
    const exists = db.clients.find((c: any) => c.email === data.email || c.document === data.document);
    if (exists) {
       return NextResponse.json({ success: false, message: "E-mail ou Documento já cadastrado na base." }, { status: 409 });
    }

    const newClient = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      password: data.password, // Plain for mvp-local
      address: data.address,
      city: data.city,
      state: data.state,
      phone: data.phone,
      document: data.document,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.clients.push(newClient);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, client: newClient });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erro interno." }, { status: 500 });
  }
}
