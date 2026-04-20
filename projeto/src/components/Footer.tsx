'use client';
import { Star, TrendingUp, Clock, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Footer() {
  const [settings, setSettings] = useState({ whatsappNumber: '5511000000000', instagramHandle: 'jpenxovais' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);
  return (
    <footer className="bg-premium-graphite text-premium-offwhite py-12 px-6 mt-12 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-inner-top overflow-hidden relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
        
        {/* Logo de Destaque */}
        <div className="bg-white p-4 rounded-3xl mb-2 shadow-lg inline-block select-none pointer-events-none">
          <img src="/logo.png" alt="JP Enxovais" className="w-24 md:w-32 object-contain" />
        </div>

        <div className="flex flex-col gap-3 mt-4 w-full md:w-auto">
          <Link href="/cadastro" className="bg-brand-coral hover:bg-[#ff554c] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-coral/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            Quero Revender JP Enxovais
          </Link>
          <Link href="/login/cliente" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 text-center">
            Já sou uma Parceira (Login)
          </Link>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white px-4 leading-tight">
          Seja um(a) revendedor(a) <span className="text-brand-green">JP Enxovais</span>
        </h2>
        
        <p className="text-gray-300 font-medium md:text-lg max-w-2xl leading-relaxed">
          Vantagens em ser um(a) Parceiro(a) Oficial
        </p>

        {/* Features / Vantagens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-2 mb-4 text-left">
           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="bg-white/10 p-2.5 rounded-xl text-brand-green"><TrendingUp size={20} /></div>
             <div>
               <h4 className="font-bold text-white text-sm">Independência Financeira</h4>
               <p className="text-xs text-gray-400 mt-0.5">Excelentes margens de lucro.</p>
             </div>
           </div>
           
           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="bg-white/10 p-2.5 rounded-xl text-brand-green"><Clock size={20} /></div>
             <div>
               <h4 className="font-bold text-white text-sm">Faça o seu Horário</h4>
               <p className="text-xs text-gray-400 mt-0.5">Trabalhe em casa ou de onde quiser.</p>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="bg-white/10 p-2.5 rounded-xl text-brand-green"><Star size={20} /></div>
             <div>
               <h4 className="font-bold text-white text-sm">Alta Aceitação</h4>
               <p className="text-xs text-gray-400 mt-0.5">Produtos de extrema qualidade.</p>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
             <div className="bg-white/10 p-2.5 rounded-xl text-brand-green"><Package size={20} /></div>
             <div>
               <h4 className="font-bold text-white text-sm">Catálogo Exclusivo</h4>
               <p className="text-xs text-gray-400 mt-0.5">Melhor gama de produtos para o lar.</p>
             </div>
           </div>
        </div>

        <p className="text-lg font-bold text-white mt-4">
          Fale conosco, e seja nosso(a) parceiro(a)!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center w-full gap-3 mt-2">
          <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg active:scale-95 text-sm w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Falar no WhatsApp
          </a>
          <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg active:scale-95 text-sm w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Acessar Instagram
          </a>
        </div>
        
        <div className="mt-8 text-xs text-gray-500 font-medium pb-4">
          © {new Date().getFullYear()} JP Enxovais. Todos os direitos reservados.
        </div>
      </div>
      
      {/* Decoração de Fundo Simples */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-coral/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
    </footer>
  );
}
