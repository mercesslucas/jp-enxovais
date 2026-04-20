'use client';

import { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Search as SearchIcon, AlertCircle } from 'lucide-react';

export default function GestaoClientes() {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data.clients || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) fetchClients();
    } catch (e) {
      alert("Erro ao alterar status");
    }
  };

  const pendentes = clients.filter(c => c.status === 'pending');
  
  const filtrados = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    return c.fullName.toLowerCase().includes(term) || 
           c.document.includes(term) || 
           c.email.toLowerCase().includes(term);
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-premium-graphite">Gestão de Clientes</h1>
          <p className="text-gray-500 font-medium">Controle de acesso à Vitrine de Pedidos</p>
        </div>
      </div>

      {pendentes.length > 0 && (
        <div className="bg-brand-coral/10 border border-brand-coral/20 p-4 rounded-2xl mb-8 flex items-start gap-4">
          <AlertCircle size={24} className="text-brand-coral shrink-0 mt-1" />
          <div>
            <h3 className="font-black text-brand-coral text-lg">Existem {pendentes.length} Cadastros Aguardando Análise</h3>
            <p className="text-sm text-gray-700 mt-1">
              Estes usuários estão totalmente bloqueados de enviar pedidos até que você faça a verificação e Clique em Aprovar.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
          placeholder="Pesquisar por Nome, CPF/CNPJ ou E-mail..."
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Carregando CRM...</div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">Nenhum cliente atende a esta pesquisa.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Região / Contato</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-premium-graphite">{client.fullName}</span>
                        <span className="text-xs text-brand-green/80 font-bold">{client.document}</span>
                        <span className="text-xs text-gray-400 mt-1">{client.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col text-sm text-gray-600">
                          <span className="font-bold">{client.city} - {client.state}</span>
                          <span>{client.phone}</span>
                       </div>
                    </td>
                    <td className="p-4 text-center">
                       {client.status === 'pending' && <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">Em Análise</span>}
                       {client.status === 'approved' && <span className="bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-full border border-brand-green/20">Aprovado</span>}
                       {client.status === 'rejected' && <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-300">Bloqueado</span>}
                    </td>
                    <td className="p-4 text-right">
                       {client.status === 'pending' && (
                         <div className="flex items-center justify-end gap-2">
                           <button onClick={() => handleUpdateStatus(client.id, 'approved')} className="bg-white hover:bg-brand-green/10 text-brand-green border border-brand-green/30 p-2 rounded-xl transition-all" title="Aprovar Ligação">
                             <CheckCircle size={20} />
                           </button>
                           <button onClick={() => handleUpdateStatus(client.id, 'rejected')} className="bg-white hover:bg-red-50 text-red-500 border border-red-200 p-2 rounded-xl transition-all" title="Rejeitar Definitivamente">
                             <XCircle size={20} />
                           </button>
                         </div>
                       )}
                       {client.status === 'approved' && (
                         <button onClick={() => handleUpdateStatus(client.id, 'rejected')} className="text-xs font-bold text-red-500 hover:underline">
                           Revogar Acesso
                         </button>
                       )}
                       {client.status === 'rejected' && (
                         <button onClick={() => handleUpdateStatus(client.id, 'approved')} className="text-xs font-bold text-brand-green hover:underline">
                           Re-aprovar
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
