'use client';

import { useState, useEffect } from 'react';
import { Tags, Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoriasPage() {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{id: string, name: string} | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: {id: string, name: string}) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover a categoria "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Erro ao excluir categoria.');
      }
    } catch (e) {
      alert('Falha ao excluir.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      const isEditing = !!editingCategory;
      const url = '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? JSON.stringify({ id: editingCategory.id, name: formData.name })
        : JSON.stringify({ name: formData.name });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });
      
      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          setCategories(prev => prev.map(c => c.id === data.category.id ? data.category : c));
        } else {
          setCategories(prev => [...prev, data.category]);
        }
        setIsModalOpen(false);
      } else {
        alert(data.error || 'Ocorreu um erro.');
      }
    } catch (e) {
      alert('Erro de conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-premium-graphite flex items-center gap-3">
            <Tags className="text-brand-green" /> Gestão de Categorias
          </h1>
          <p className="text-gray-500 font-medium mt-1">Crie e organize as categorias da loja</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 bg-brand-green text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-brand-green/20 hover:bg-brand-coral hover:shadow-brand-coral/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar categoria..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total: {filtered.length} categorias
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Carregando categorias...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Nenhuma categoria encontrada.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-gray-500 text-sm">ID</th>
                  <th className="p-4 font-bold text-gray-500 text-sm">Nome da Categoria</th>
                  <th className="p-4 font-bold text-gray-500 text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-400 font-mono">{cat.id}</td>
                    <td className="p-4 font-bold text-premium-graphite">{cat.name.toUpperCase()}</td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-xl text-premium-graphite">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Categoria</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                    placeholder="Ex: Mesa, Banho, Decoração..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 font-bold text-white bg-brand-green hover:bg-brand-coral rounded-xl transition-colors shadow-lg shadow-brand-green/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Categoria'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
