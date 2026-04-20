'use client';

import { useEffect, useState } from 'react';
import { Bell, Clock, CheckCircle, Search as SearchIcon, X, Send, ShoppingBag, Truck, Archive, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Gerador de Bip nativo do navegador (não requer mp3)
const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 830.61; // Fá 5 (Agradável)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.6);
  } catch(e) { /* silent fail on un-interacted DOMs */ }
};

type OrderStatus = 'Pendente' | 'Aprovado' | 'Enviado' | 'Arquivado';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus>('Pendente');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [filterDay, setFilterDay] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Polling Real Local File
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        
        if (data.orders) {
          if (data.orders.length > lastOrderCount && lastOrderCount > 0) {
            setShowNotification(true);
            playBeep();
            setTimeout(() => setShowNotification(false), 5000);
          }
          setOrders(data.orders);
          setLastOrderCount(data.orders.length);
        }
      } catch (e) {
        console.error("Failed to fetch orders via polling");
      }
    };

    fetchOrders(); // init
    const interval = setInterval(fetchOrders, 3000); // 3 seconds polling
    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const counts = {
    Pendente: orders.filter(o => o.status === 'Pendente').length,
    Aprovado: orders.filter(o => o.status === 'Aprovado').length,
    Enviado: orders.filter(o => o.status === 'Enviado').length,
    Arquivado: orders.filter(o => o.status === 'Arquivado').length,
  };

  const activeOrders = orders.filter(o => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = o.id.toLowerCase().includes(term) || (o.clientName || '').toLowerCase().includes(term);
    const matchesTab = o.status === activeTab;
    
    if (!matchesTab) return false;

    if (activeTab === 'Arquivado') {
      if (filterDay || filterMonth || filterYear) {
        const d = new Date(o.createdAt);
        const oDay = d.getDate().toString().padStart(2, '0');
        const oMonth = (d.getMonth() + 1).toString().padStart(2, '0');
        const oYear = d.getFullYear().toString();
        
        if (filterDay && filterDay !== oDay) return false;
        if (filterMonth && filterMonth !== oMonth) return false;
        if (filterYear && filterYear !== oYear) return false;
      }
    }

    return matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: OrderStatus, openWhatsApp: boolean = false) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        
        if (openWhatsApp) {
          let whatsText = `Olá ${selectedOrder.clientName || 'Cliente'}! Recebemos seu pedido com sucesso na JP Enxovais! 🎉%0a*Código do Pedido:* ${selectedOrder.id.toUpperCase()}%0a%0a *Itens:*%0a`;
          selectedOrder.items.forEach((it: any) => {
             whatsText += `- ${it.quantity}x ${it.product.name} (Cor: ${it.variation?.color || 'Padrão'})%0a`;
          });
          window.open(`https://wa.me/?text=${whatsText}`, '_blank');
        }
      }
    } catch (e) { console.error('Fall back error', e); }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente': return 'bg-orange-100 text-orange-600';
      case 'Aprovado': return 'bg-brand-green/20 text-brand-green';
      case 'Enviado': return 'bg-blue-100 text-blue-600';
      case 'Arquivado': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePrintLogisticsOrder = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir pedidos.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido #${order.id} - Separação Logística</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-size: 28px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
            .meta { font-size: 14px; color: #555; display: flex; justify-content: space-between; margin-top: 20px; }
            .item-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .item-table th, .item-table td { border-bottom: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            .item-table th { background-color: #f9f9f9; font-weight: bold; text-transform: uppercase; font-size: 13px; color: #666; }
            .item-table tr:last-child td { border-bottom: 2px solid #000; }
            .signature-box { margin-top: 60px; border-top: 1px dashed #999; padding-top: 20px; text-align: center; width: 300px; margin-left: auto; margin-right: auto; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 4px;">Imprimir Ficha</button>
          </div>
          
          <div class="header">
            <h1>JP Enxovais</h1>
            <p style="margin: 5px 0; font-size: 18px;"><strong>FICHA DE SEPARAÇÃO LOGÍSTICA</strong></p>
            <div class="meta">
              <div><strong>Pedido:</strong> #${order.id.toUpperCase()}</div>
              <div><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString('pt-BR')}</div>
            </div>
            <div style="text-align: left; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
              <strong>Cliente/Revendedora:</strong> ${order.clientName || 'Não Identificado'}
            </div>
          </div>
          
          <h2 style="font-size: 18px; margin-bottom: 10px;">Itens Solicitados</h2>
          <table class="item-table">
            <thead>
              <tr>
                <th style="width: 50%;">Produto</th>
                <th style="width: 30%;">Cor / Estampa</th>
                <th style="width: 20%; text-align: center;">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((it: any) => `
                <tr>
                  <td><strong>${it.product.name}</strong></td>
                  <td>${it.variation?.color || 'Padrão'}</td>
                  <td style="text-align: center; font-size: 18px;"><strong>${it.quantity}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right; font-size: 18px;">
            Total de Peças: <strong>${order.totalItems}</strong>
          </div>
          
          <div class="signature-box">
            <p style="margin: 0; font-size: 14px; color: #555;">Assinatura do Conferente / Separação</p>
          </div>
          
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 500); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintClientOrder = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir pedidos.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido #${order.id} - JP Enxovais</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { font-size: 28px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
            .meta { font-size: 14px; color: #555; display: flex; justify-content: space-between; margin-top: 20px; }
            .item-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .item-table th, .item-table td { border-bottom: 1px solid #ddd; padding: 12px 8px; text-align: left; }
            .item-table th { background-color: #f9f9f9; font-weight: bold; text-transform: uppercase; font-size: 13px; color: #666; }
            .item-table tr:last-child td { border-bottom: 2px solid #000; }
            .signature-box { margin-top: 60px; border-top: 1px dashed #999; padding-top: 20px; text-align: center; width: 300px; margin-left: auto; margin-right: auto; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button onclick="window.print()" style="padding: 10px 20px; font-weight: bold; background: #000; color: #fff; border: none; cursor: pointer; border-radius: 4px;">Imprimir Ficha</button>
          </div>
          
          <div class="header">
            <h1>JP Enxovais</h1>
            <p style="margin: 5px 0; font-size: 18px;"><strong>FICHA DO CLIENTE</strong></p>
            <div class="meta">
              <div><strong>Pedido:</strong> #${order.id.toUpperCase()}</div>
              <div><strong>Data:</strong> ${new Date(order.createdAt).toLocaleString('pt-BR')}</div>
            </div>
            <div style="text-align: left; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
              <div style="margin-bottom: 8px;"><strong>Cliente/Revendedora:</strong> ${order.clientName || 'Não Identificado'}</div>
              <div><strong>Endereço:</strong> ${order.clientAddress || 'Não informado'}</div>
            </div>
          </div>
          
          <h2 style="font-size: 18px; margin-bottom: 10px;">Itens Solicitados</h2>
          <table class="item-table">
            <thead>
              <tr>
                <th style="width: 40%;">Produto</th>
                <th style="width: 20%;">Cor / Estampa</th>
                <th style="width: 15%; text-align: center;">Quantidade</th>
                <th style="width: 25%; text-align: right;">Preço Unit.</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((it: any) => `
                <tr>
                  <td><strong>${it.product.name}</strong></td>
                  <td>${it.variation?.color || 'Padrão'}</td>
                  <td style="text-align: center; font-size: 16px;"><strong>${it.quantity}</strong></td>
                  <td style="text-align: right;">${it.product.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(it.product.price) : 'Sob Consulta'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; display: flex; justify-content: space-between; font-size: 18px;">
            <div>Total de Peças: <strong>${order.totalItems}</strong></div>
            <div>Total do Pedido: <strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.items.reduce((acc: number, it: any) => acc + ((it.product.price || 0) * it.quantity), 0))}</strong></div>
          </div>
          
          <div class="signature-box">
            <p style="margin: 0; font-size: 14px; color: #555;">Assinatura do Conferente / Separação</p>
          </div>
          
          <script>
            window.onload = function() { setTimeout(function() { window.print(); }, 500); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-premium-graphite">Gestão Logística</h1>
          <p className="text-gray-500 font-medium">Pipeline e Separação de Pedidos</p>
        </div>
        
        <div className="relative">
          <button className="bg-white p-3 rounded-full shadow-sm hover:shadow relative border border-gray-100">
            <Bell size={24} className="text-gray-600" />
            {counts.Pendente > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-brand-coral rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 bg-brand-green/10 text-brand-green border border-brand-green/20 p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bell className="animate-bounce" />
              <span className="font-bold">Novo pedido recebido no site! (Bipe Acionado)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Resumo (4 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div onClick={() => setActiveTab('Pendente')} className={`cursor-pointer p-4 md:p-6 rounded-2xl border transition-all ${activeTab === 'Pendente' ? 'bg-orange-50 border-orange-200 shadow-md scale-[1.02]' : 'bg-white shadow-sm border-gray-100 hover:bg-gray-50'} flex flex-col justify-center`}>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
             <div className="bg-orange-100 text-orange-500 p-2 md:p-3 rounded-lg"><Clock size={20} className="hidden md:block"/><Clock size={16} className="md:hidden"/></div>
             <span className="text-xs md:text-sm font-bold text-gray-500 uppercase">Pendentes</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-premium-graphite">{counts.Pendente}</div>
        </div>

        <div onClick={() => setActiveTab('Aprovado')} className={`cursor-pointer p-4 md:p-6 rounded-2xl border transition-all ${activeTab === 'Aprovado' ? 'bg-brand-green/10 border-brand-green/30 shadow-md scale-[1.02]' : 'bg-white shadow-sm border-gray-100 hover:bg-gray-50'} flex flex-col justify-center`}>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
             <div className="bg-brand-green/20 text-brand-green p-2 md:p-3 rounded-lg"><Package size={20} className="hidden md:block"/><Package size={16} className="md:hidden"/></div>
             <span className="text-xs md:text-sm font-bold text-gray-500 uppercase line-clamp-1">Separação</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-premium-graphite">{counts.Aprovado}</div>
        </div>

        <div onClick={() => setActiveTab('Enviado')} className={`cursor-pointer p-4 md:p-6 rounded-2xl border transition-all ${activeTab === 'Enviado' ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 'bg-white shadow-sm border-gray-100 hover:bg-gray-50'} flex flex-col justify-center`}>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
             <div className="bg-blue-100 text-blue-500 p-2 md:p-3 rounded-lg"><Truck size={20} className="hidden md:block"/><Truck size={16} className="md:hidden"/></div>
             <span className="text-xs md:text-sm font-bold text-gray-500 uppercase line-clamp-1">Enviados</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-premium-graphite">{counts.Enviado}</div>
        </div>

        <div onClick={() => setActiveTab('Arquivado')} className={`cursor-pointer p-4 md:p-6 rounded-2xl border transition-all ${activeTab === 'Arquivado' ? 'bg-gray-100 border-gray-300 shadow-md scale-[1.02]' : 'bg-white shadow-sm border-gray-100 hover:bg-gray-50'} flex flex-col justify-center`}>
          <div className="flex items-center gap-2 md:gap-3 mb-2">
             <div className="bg-gray-200 text-gray-600 p-2 md:p-3 rounded-lg"><Archive size={20} className="hidden md:block"/><Archive size={16} className="md:hidden"/></div>
             <span className="text-xs md:text-sm font-bold text-gray-500 uppercase">Arquivados</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-premium-graphite">{counts.Arquivado}</div>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
          placeholder={`Pesquisar por Código ou Nome do Cliente na aba ${activeTab}...`}
        />
      </div>

      <AnimatePresence>
        {activeTab === 'Arquivado' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex gap-3 overflow-hidden"
          >
            <select value={filterDay} onChange={e => setFilterDay(e.target.value)} className="p-3 border border-gray-200 rounded-xl flex-1 bg-white outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green shadow-sm text-gray-600 font-medium">
              <option value="">Dia (Todos)</option>
              {Array.from({length: 31}, (_, i) => (i + 1).toString().padStart(2, '0')).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-3 border border-gray-200 rounded-xl flex-1 bg-white outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green shadow-sm text-gray-600 font-medium">
              <option value="">Mês (Todos)</option>
              <option value="01">Jan (01)</option><option value="02">Fev (02)</option><option value="03">Mar (03)</option>
              <option value="04">Abr (04)</option><option value="05">Mai (05)</option><option value="06">Jun (06)</option>
              <option value="07">Jul (07)</option><option value="08">Ago (08)</option><option value="09">Set (09)</option>
              <option value="10">Out (10)</option><option value="11">Nov (11)</option><option value="12">Dez (12)</option>
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="p-3 border border-gray-200 rounded-xl flex-1 bg-white outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green shadow-sm text-gray-600 font-medium">
              <option value="">Ano (Todos)</option>
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y.toString()}>{y}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="font-bold text-lg text-premium-graphite mb-4">Pedidos {activeTab}s ({activeOrders.length})</h3>
      {activeOrders.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 font-medium">
          Nenhum pacote na fase de {activeTab}.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[...activeOrders].reverse().map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
              <div>
                <div className="flex flex-col mb-1">
                  <span className="font-black text-premium-graphite text-lg">{order.clientName || 'Cliente Visitante'}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-400 text-sm">{order.id.toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {order.totalItems} ite{order.totalItems > 1 ? 'ns' : 'm'} • Recebido às {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="bg-gray-100 text-premium-graphite font-bold py-2.5 px-6 rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-sm w-full md:w-auto"
                >
                  Abrir Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Inteligente do Pipeline */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="bg-premium-graphite p-6 flex items-start justify-between text-white">
                <div>
                   <h3 className="font-black text-xl mb-1">{selectedOrder.clientName || 'Cliente Visitante'}</h3>
                   <span className="font-bold text-brand-green bg-brand-green/20 px-2 py-0.5 rounded-md text-sm">{selectedOrder.id.toUpperCase()}</span>
                   <p className="text-gray-400 text-sm mt-2">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                 <div className="mb-4">
                   <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                     Status atual: {selectedOrder.status}
                   </div>
                 </div>

                 <h4 className="font-bold text-premium-graphite mb-3 flex items-center gap-2">
                   <ShoppingBag size={18} /> Itens Solicitados
                 </h4>
                 
                 <div className="space-y-4">
                   {selectedOrder.items?.map((item: any, idx: number) => (
                     <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                       {item.variation?.image && (
                         <img src={item.variation.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                       )}
                       <div>
                         <p className="font-bold text-premium-graphite">{item.product.name}</p>
                         <p className="text-sm text-gray-500">Cor: {item.variation?.color || 'Padrão'} | Qtde: <span className="font-bold text-black">{item.quantity}</span></p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col items-center justify-end gap-3">
                 
                 {selectedOrder.status === 'Pendente' && (
                   <button 
                     onClick={() => handleStatusChange(selectedOrder.id, 'Aprovado', true)}
                     className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#25d366]/20 transition-all hover:bg-[#1fbf58] active:scale-95"
                   >
                     <Send size={18} /> Aprovar no WhatsApp (Mover p/ Separação)
                   </button>
                 )}
                 
                 {selectedOrder.status === 'Aprovado' && (
                   <button 
                     onClick={() => handleStatusChange(selectedOrder.id, 'Enviado')}
                     className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 active:scale-95"
                   >
                     <Truck size={18} /> Marcar Enxoval como Despachado (Correios)
                   </button>
                 )}
                 
                 <div className="w-full flex gap-2 flex-col md:flex-row">
                   <button 
                     onClick={() => handlePrintLogisticsOrder(selectedOrder)}
                     className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-premium-graphite border border-gray-200 px-4 py-3 rounded-xl font-bold transition-all hover:bg-gray-200 active:scale-95"
                   >
                     <Package size={18} /> Ficha de Separação
                   </button>

                   <button 
                     onClick={() => handlePrintClientOrder(selectedOrder)}
                     className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-premium-graphite border border-gray-200 px-4 py-3 rounded-xl font-bold transition-all hover:bg-gray-200 active:scale-95"
                   >
                     <Package size={18} /> Ficha do Cliente
                   </button>
                 </div>
                 
                 {selectedOrder.status === 'Enviado' && (
                   <button 
                     onClick={() => handleStatusChange(selectedOrder.id, 'Arquivado')}
                     className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-gray-800/20 transition-all hover:bg-black active:scale-95"
                   >
                     <Archive size={18} /> Cliente Recebeu! (Arquivar Venda)
                   </button>
                 )}

                 <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-3 font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors active:scale-95"
                 >
                   {selectedOrder.status === 'Arquivado' ? 'Visualizando Arquivo (Fechar)' : 'Deixar como está e Fechar'}
                 </button>
                 
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
