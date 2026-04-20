import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'clients.json');

function getDb(): { clients: any[] } {
  if (fs.existsSync(dbPath)) {
    const fileData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(fileData);
  }
  return { clients: [] };
}

export async function GET() {
  try {
    const db = getDb();
    // Remove passwords for safety
    const safeClients = db.clients.map((c: any) => {
      const { password, ...rest } = c;
      return rest;
    });
    return NextResponse.json({ clients: safeClients });
  } catch (err) {
    return NextResponse.json({ message: "Error reading db" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    const db = getDb();

    let updated = false;
    db.clients = db.clients.map((c: any) => {
      if (c.id === id) {
        c.status = status;
        updated = true;
      }
      return c;
    });

    if (!updated) {
       return NextResponse.json({ message: "Cliente não encontrado" }, { status: 404 });
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ message: "Fail to update" }, { status: 500 });
  }
}
