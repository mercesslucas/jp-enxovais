import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const cookieStore = await cookies();
  const clientId = cookieStore.get('client_session')?.value;

  if (!clientId) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  const dbPath = path.join(process.cwd(), 'data', 'clients.json');
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const client = db.clients.find((c: any) => c.id === clientId);
    if (client && client.status === 'approved') {
       const { password, ...safe } = client;
       return NextResponse.json({ loggedIn: true, client: safe });
    }
  }

  return NextResponse.json({ loggedIn: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('client_session');
  return NextResponse.json({ success: true });
}
