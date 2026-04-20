'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Image as ImageIcon, Phone, AtSign, Save, Loader2, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsDashboard() {
  const [settings, setSettings] = useState({
    heroImage: '',
    whatsappNumber: '',
    instagramHandle: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          heroImage: data.heroImage || '',
          whatsappNumber: data.whatsappNumber || '',
          instagramHandle: data.instagramHandle || ''
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        setMessage('Configurações salvas com sucesso! As alterações já estão valendo na Loja.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('Erro ao salvar as configurações.');
      }
    } catch(err) {
      setMessage('Erro na conexão.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-brand-green w-10 h-10" /></div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-premium-graphite flex items-center gap-3">
            <SettingsIcon className="text-brand-green" /> Configurações Gerais
          </h1>
          <p className="text-gray-500 font-medium mt-1">Gerencie os telefones e vitrine da sua loja</p>
        </div>
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-brand-green/10 text-brand-green p-4 rounded-xl border border-brand-green/20 font-bold flex items-center gap-2">
          <Save size={18} /> {message}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-8">
        
        {/* Bloco: Imagem do Topo */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-premium-graphite text-lg flex items-center gap-2 border-b border-gray-100 pb-2">
            <ImageIcon size={20} className="text-brand-coral" /> Banner Principal (Vitrine)
          </h3>
          <p className="text-sm text-gray-500 mb-2">Cole o link (URL) direto da internet ou deixe `/hero-bg.jpg` se usar o arquivo local na pasta public.</p>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={settings.heroImage}
              onChange={(e) => setSettings({...settings, heroImage: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green shadow-sm text-premium-graphite font-medium transition-all"
              placeholder="https://meusite.com/imagem-do-topo.jpg"
              required
            />
          </div>
          
          {settings.heroImage && (
             <div className="mt-4 p-2 border border-gray-200 rounded-xl bg-gray-50 inline-block w-full max-w-[300px]">
               <p className="text-xs font-bold text-gray-400 mb-2 text-center">Pré-visualização</p>
               <img src={settings.heroImage} alt="Preview Banner" className="w-full h-32 object-cover rounded-lg shadow-sm" onError={(e) => e.currentTarget.style.display = 'none'} />
             </div>
          )}
        </div>

        {/* Bloco: Contatos Oiciais */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-premium-graphite text-lg flex items-center gap-2 border-b border-gray-100 pb-2">
            <Phone size={20} className="text-brand-green" /> Contatos Oficiais
          </h3>
          <p className="text-sm text-gray-500 mb-2">Todos os botões do site e links do WhatsApp no painel apontarão para este número.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-premium-graphite mb-1.5">Número do WhatsApp Comercial</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="font-bold text-gray-400 border-r border-gray-200 pr-2">+55</span>
                </div>
                <input 
                  type="text" 
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value.replace(/\\D/g, '')})}
                  className="w-full pl-14 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green shadow-sm text-premium-graphite font-medium transition-all"
                  placeholder="11999999999"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-premium-graphite mb-1.5 flex items-center gap-2">
                <AtSign size={16} className="text-pink-600" /> Usuário do Instagram
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="font-bold text-gray-400 text-lg">@</span>
                </div>
                <input 
                  type="text" 
                  value={settings.instagramHandle}
                  onChange={(e) => setSettings({...settings, instagramHandle: e.target.value.replace('@','')})}
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green shadow-sm text-premium-graphite font-medium transition-all"
                  placeholder="jpenxovais"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-brand-green hover:bg-[#1ebd5b] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:scale-100"
          >
            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? 'Publicando...' : 'Salvar Alterações Globais'}
          </button>
        </div>
      </form>

    </div>
  );
}
