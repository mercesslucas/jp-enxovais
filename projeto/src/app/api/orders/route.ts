import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const clientsDbPath = path.join(process.cwd(), 'data', 'clients.json');

// Inicializa arquivo se faltar
function getDb(): { orders: any[], products: any[] } {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ orders: [], products: [] }));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const db = getDb();
  return NextResponse.json({ orders: db.orders });
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const db = getDb();
    
    const index = db.orders.findIndex((o: any) => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    db.orders[index].status = status;
    saveDb(db);
    
    return NextResponse.json({ success: true, order: db.orders[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Captura da Sessão do Cliente
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client_session')?.value;
    let clientName = 'Cliente Visitante';
    let clientAddress = 'Não informado';

    if (clientId && fs.existsSync(clientsDbPath)) {
       const clientDb = JSON.parse(fs.readFileSync(clientsDbPath, 'utf8'));
       const c = clientDb.clients.find((x: any) => x.id === clientId);
       if (c) {
         clientName = c.fullName;
         clientAddress = `${c.address || ''}, ${c.city || ''} - ${c.state || ''}`.trim().replace(/^,\s*/, '').replace(/ - $/, '');
         if (clientAddress === '') clientAddress = 'Não informado';
       }
    }

    const orderCode = 'JPE-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const newOrder = {
      id: orderCode,
      clientName: clientName,
      clientAddress: clientAddress,
      items: body.items,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
      totalItems: body.items.reduce((acc: number, item: any) => acc + item.quantity, 0)
    };

    const db = getDb();
    db.orders.push(newOrder);
    saveDb(db);

    // Simulate AWS SES Trigger
    console.log(`[AWS SES Mock] Email sent to admin@jpenxovais.com.br. Subject: Novo Pedido Recebido ${newOrder.id}`);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
