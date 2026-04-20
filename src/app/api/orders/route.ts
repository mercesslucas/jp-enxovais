import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY createdAt DESC') as any[];
    // Parse items JSON since MySQL might return it as string depending on driver
    const formattedOrders = orders.map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
    }));
    return NextResponse.json({ orders: formattedOrders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    
    const result = await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]) as any;
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client_session')?.value;
    
    let clientName = 'Cliente Visitante';
    let clientAddress = 'Não informado';

    if (clientId) {
       const clients = await query('SELECT fullName, address, city, state FROM clients WHERE id = ? LIMIT 1', [clientId]) as any[];
       if (clients.length > 0) {
         const c = clients[0];
         clientName = c.fullName;
         clientAddress = `${c.address || ''}, ${c.city || ''} - ${c.state || ''}`.trim().replace(/^,\s*/, '').replace(/ - $/, '');
         if (clientAddress === '') clientAddress = 'Não informado';
       }
    }

    const orderCode = 'JPE-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const totalItems = body.items.reduce((acc: number, item: any) => acc + item.quantity, 0);

    const itemsJson = JSON.stringify(body.items);

    await query(`
      INSERT INTO orders (id, clientId, clientName, clientAddress, items, status, totalItems)
      VALUES (?, ?, ?, ?, ?, 'Pendente', ?)
    `, [
      orderCode,
      clientId || null,
      clientName,
      clientAddress,
      itemsJson,
      totalItems
    ]);

    const newOrder = {
      id: orderCode,
      clientId: clientId || null,
      clientName,
      clientAddress,
      items: body.items,
      status: 'Pendente',
      totalItems,
      createdAt: new Date().toISOString()
    };

    console.log(`[AWS SES Mock] Email sent to admin@jpenxovais.com.br. Subject: Novo Pedido Recebido ${newOrder.id}`);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
