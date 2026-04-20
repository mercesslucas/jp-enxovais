'use client';

import { UploadCloud, Plus, Image as ImageIcon, Edit2, Trash2, Package, Save, PlusCircle, X, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Cama', 'Mesa', 'Banho', 'Decoração'];

const INITIAL_FORM = {
  id: '',
  name: '',
  category: 'Cama',
  description: '',
  composition: '',
  stock: 0,
  price: 0,
  videoUrl: '',
  variations: [{ type: 'color', color: '', colorCode: '#343A40', patternImage: '', image: '' }]
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<any>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch(e) { console.error(e) }
    setFetching(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { type: 'color', color: '', colorCode: '#343A40', patternImage: '', image: '' }]
    });
  };

  const handleRemoveVariation = (index: number) => {
    const newVars = formData.variations.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, variations: newVars });
  };

  const handleVariationChange = (index: number, field: string, value: string) => {
    const newVars = [...formData.variations];
    newVars[index][field] = value;
    setFormData({ ...formData, variations: newVars });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!formData.id;
    const url = '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      // Formatação do form para castar tipos corretamente
      const payload: any = {
         ...formData,
         stock: Number(formData.stock),
         price: Number(formData.price)
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormData(INITIAL_FORM);
        fetchProducts();
      } else {
        alert("Erro ao salvar produto.");
      }
    } catch(err) {
      alert("Falha na conexão.");
    }

    setLoading(false);
  };

  const handleEdit = (prod: Product) => {
    setFormData({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      description: prod.description,
      composition: prod.composition,
      stock: prod.stock || 0,
      price: prod.price || 0,
      videoUrl: prod.videoUrl || '',
      variations: prod.variations?.length ? prod.variations : INITIAL_FORM.variations
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja apagar o produto "${name}"? Essa ação afetará a vitrine na Home.`)) {
      try {
        await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        fetchProducts();
        if (formData.id === id) setFormData(INITIAL_FORM);
      } catch(e) {
        alert("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-premium-graphite">Gestão de Produtos</h1>
          <p className="text-gray-500 font-medium">Cadastre e atualize itens e seus estoques</p>
        </div>
        {formData.id && (
          <button onClick={() => setFormData(INITIAL_FORM)} className="text-brand-coral font-bold text-sm bg-brand-coral/10 px-4 py-2 rounded-xl">
             Cancelar Edição
          </button>
        )}
      </div>

      {/* Radar Sentinela de Estoque */}
      {products.filter(p => !p.stock || p.stock <= 0).length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-8 flex items-start gap-4 shadow-sm"
        >
          <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-black text-red-700 text-lg">Sentinela de Estoque Acionado!</h3>
            <p className="text-sm text-red-600 mt-1 font-medium leading-relaxed">
              Você possui <strong>{products.filter(p => !p.stock || p.stock <= 0).length} produto(s)</strong> zerados.<br/>
              A vitrine congelou o botão de compra deles. Faça o reabastecimento ou desative-os do catálogo:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {products.filter(p => !p.stock || p.stock <= 0).map(p => (
                 <span key={p.id} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold border border-red-200">{p.name}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSave} className={`bg-white p-6 md:p-8 rounded-3xl border ${formData.id ? 'border-blue-400 shadow-[0_4px_30px_rgba(59,130,246,0.15)] ring-4 ring-blue-50' : 'border-gray-100 shadow-sm'} flex flex-col gap-6 transition-all duration-300 relative`}>
        {formData.id && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white font-bold px-4 py-1 rounded-full text-sm shadow-md flex items-center gap-2">
            <Edit2 size={14} /> Editando: {formData.name}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-premium-graphite mb-1.5">Nome do Enxoval</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Jogo de Lençol 400 Fios" 
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-base font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-premium-graphite mb-1.5">Setor (Categoria)</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm font-bold text-gray-600 bg-white"
            >
              <option value="Cama">Cama</option>
              <option value="Mesa">Mesa</option>
              <option value="Banho">Banho</option>
              <option value="Decoração">Decoração</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-premium-graphite mb-1.5 flex items-center gap-2">
                <Package size={16} className="text-blue-500" />
                Quantidade em Estoque Central
             </label>
             <input 
               type="number" 
               min="0"
               required
               value={formData.stock}
               onChange={(e) => setFormData({...formData, stock: e.target.value})}
               placeholder="150" 
               className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base font-black text-blue-600"
             />
          </div>

          <div>
             <label className="block text-sm font-bold text-premium-graphite mb-1.5">Preço Unitário (R$)</label>
             <input 
               type="number" 
               min="0"
               step="0.01"
               required
               value={formData.price}
               onChange={(e) => setFormData({...formData, price: e.target.value})}
               placeholder="99.90" 
               className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-base font-bold text-brand-green"
             />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-premium-graphite mb-1.5">Descrição Curta (Pitch de Venda)</label>
           <textarea 
             required
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
             placeholder="Descreve como sinta-se tocando as nuvens... (Max 200 caracteres)"
             rows={3} 
             className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm resize-none font-medium"
           />
        </div>

        <div>
           <label className="block text-sm font-bold text-premium-graphite mb-1.5">Composição Física</label>
           <input 
             type="text" 
             required
             value={formData.composition}
             onChange={(e) => setFormData({...formData, composition: e.target.value})}
             placeholder="Ex: 100% Algodão Egípcio, Jacquard Fio Penteado" 
             className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm font-medium"
           />
        </div>

        <hr className="border-gray-100 my-2" />

        {/* Upload de Mídia (Mock para URL) */}
        <div>
          <label className="block text-sm font-bold text-premium-graphite mb-1.5">Link do Vídeo Preview (Opcional, Long Press App)</label>
          <div className="relative">
             <input 
               type="url" 
               value={formData.videoUrl}
               onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
               placeholder="https://meusite.com/video-curto.mp4" 
               className="w-full border border-gray-200 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm font-medium"
             />
             <UploadCloud size={18} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Na versão Cloud, habilitaremos DropZone Aqui</p>
        </div>

        <hr className="border-gray-100 my-2" />

        {/* Variações */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-black text-premium-graphite">Variações (Cores e Imagens)</label>
            <button 
              type="button"
              onClick={handleAddVariation}
              className="text-brand-green font-bold text-sm bg-brand-green/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-green hover:text-white transition-colors"
            >
              <Plus size={16} /> Nova Cor
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {formData.variations.map((v: any, i: number) => {
                const isEstampa = v.type === 'pattern';
                
                return (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="flex flex-col md:flex-row gap-4 md:items-center bg-white border border-gray-200 p-4 rounded-xl relative"
                 >
                  
                  {/* Selector Type */}
                  <div className="flex items-center gap-2 mb-2 md:mb-0 md:w-auto shrink-0 bg-gray-50 border border-gray-100 rounded-lg p-1">
                    <button 
                      type="button"
                      onClick={() => handleVariationChange(i, 'type', 'color')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${!isEstampa ? 'bg-white shadow-sm text-premium-graphite' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Cor Sólida
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleVariationChange(i, 'type', 'pattern')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${isEstampa ? 'bg-white shadow-sm text-premium-graphite' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Estampa
                    </button>
                  </div>

                  {/* Variation Content Grid */}
                  <div className="flex items-center gap-4 w-full md:w-1/3">
                    {!isEstampa ? (
                      <input 
                        type="color" 
                        value={v.colorCode || '#343a40'}
                        onChange={(e) => handleVariationChange(i, 'colorCode', e.target.value)}
                        className="w-12 h-12 p-0.5 border border-gray-200 rounded-lg cursor-pointer shrink-0" 
                      />
                    ) : (
                      <div className="relative w-16 h-12 shrink-0">
                         <input 
                           type="url"
                           value={v.patternImage || ''}
                           onChange={(e) => handleVariationChange(i, 'patternImage', e.target.value)}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                           title="Cole aqui o link da Foto Pequena da Estampa"
                         />
                         <div className="absolute inset-0 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                           {v.patternImage ? (
                             <img src={v.patternImage} alt="Estampa" className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon size={14} className="text-gray-400" />
                           )}
                         </div>
                      </div>
                    )}
                    
                    <input 
                      type="text" 
                      required
                      value={v.color}
                      onChange={(e) => handleVariationChange(i, 'color', e.target.value)}
                      placeholder={isEstampa ? "Nome (Ex: Floral Verão)" : "Nome da Cor (Ex: Azul)"} 
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold" 
                    />
                  </div>
                  
                  {/* Image URL Input */}
                  <div className="flex-1 flex gap-2 w-full">
                    <div className="relative w-full">
                      <input 
                        type="url" 
                        required
                        value={v.image}
                        onChange={(e) => handleVariationChange(i, 'image', e.target.value)}
                        placeholder="Link da Foto HD do Comprador (https://...)" 
                        className="w-full border border-gray-200 rounded-lg p-2.5 pl-10 text-sm font-medium" 
                      />
                      <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  {formData.variations.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveVariation(i)}
                      className="absolute top-2 right-2 md:static md:w-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                 </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`flex items-center gap-2 ${formData.id ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-brand-green hover:bg-[#1ebd5b] shadow-brand-green/20'} disabled:opacity-70 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95`}
          >
            {loading ? <Plus className="animate-spin" /> : <Save size={18} />}
            {formData.id ? 'Atualizar Produto' : 'Adicionar ao Catálogo'}
          </button>
        </div>
      </form>


      {/* Mega Lista de Setores */}
      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-black text-premium-graphite mb-1 border-b-2 border-gray-100 pb-4">
          Catálogo Existente <span className="text-gray-400 text-sm font-medium ml-2">({products.length} Itens)</span>
        </h2>

        {fetching ? (
          <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Carregando Estoque Oficial...</div>
        ) : (
          <div className="flex flex-col gap-10 mt-8">
            {CATEGORIES.map(sector => {
              const itemsInSector = products.filter(p => p.category === sector);
              if (itemsInSector.length === 0) return null;

              return (
                <div key={sector}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-1.5 bg-brand-green rounded-full" />
                    <h3 className="text-xl font-bold text-premium-graphite uppercase tracking-tighter">Setor: {sector}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {itemsInSector.map(p => (
                      <div key={p.id} className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        
                        <div className="flex items-start gap-3">
                          <img src={p.variations[0]?.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-bold text-premium-graphite text-sm line-clamp-2 leading-tight">{p.name}</h4>
                            <p className="text-brand-green font-black text-sm mt-0.5">R$ {Number(p.price || 0).toFixed(2).replace('.', ',')}</p>
                            <p className={`text-xs font-bold inline-block px-2 py-0.5 rounded-md mt-1 mb-2 ${(!p.stock || p.stock <= 0) ? 'text-red-700 bg-red-100 border border-red-200 shadow-sm' : 'text-blue-600 bg-blue-50'}`}>
                               {(!p.stock || p.stock <= 0) ? 'ESTOQUE ZERADO 🔴' : `ESTOQUE: ${p.stock}`}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1">{p.variations.length} Opçõe(s) de Cor</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 border-t border-gray-50 mt-4 pt-3">
                          <button 
                            onClick={() => handleEdit(p)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} /> Editar
                          </button>
                          
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                            title="Remover do Catálogo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
