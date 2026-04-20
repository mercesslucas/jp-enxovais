'use client';

import { PackageSearch, ListTodo, LogOut, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Erro ao sair', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Bottom Nav for Mobile */}
      <aside className="bg-white border-r border-gray-200 w-full md:w-64 flex-shrink-0 flex md:flex-col justify-between order-2 md:order-1 sticky bottom-0 md:top-0 z-40 border-t md:border-t-0 md:h-screen">
        <div className="flex md:flex-col px-4 py-2 md:py-6 w-full justify-around md:justify-start gap-1 md:gap-4 overflow-x-auto">
          <div className="hidden md:block px-4 mb-6">
            <h2 className="text-xl font-black text-brand-green">JP <span className="text-premium-graphite">Admin</span></h2>
          </div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-premium-graphite font-medium transition-colors flex-col md:flex-row text-xs md:text-sm"
          >
            <ListTodo size={20} className="text-gray-400" />
            <span>Pedidos</span>
          </Link>
          <Link 
            href="/admin/produtos" 
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-premium-graphite font-medium transition-colors flex-col md:flex-row text-xs md:text-sm"
          >
            <PackageSearch size={20} className="text-gray-400" />
            <span>Produtos</span>
          </Link>
          <Link 
            href="/admin/clientes" 
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-premium-graphite font-medium transition-colors flex-col md:flex-row text-xs md:text-sm"
          >
            <Users size={20} className="text-gray-400" />
            <span>Clientes</span>
          </Link>
          <Link 
            href="/admin/configuracoes" 
            className="flex items-center gap-2 p-3 rounded-xl hover:bg-gray-50 text-premium-graphite font-medium transition-colors flex-col md:flex-row text-xs md:text-sm mt-auto md:mb-2"
          >
            <Settings size={20} className="text-gray-400" />
            <span>Ajustes</span>
          </Link>
        </div>
        <div className="hidden md:flex p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 font-medium transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto order-1 md:order-2 mb-[70px] md:mb-0">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
