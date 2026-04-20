'use client';

import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { MenuDrawer } from '@/components/MenuDrawer';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Search, Menu, Loader2, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/store/useCartStore';

const CATEGORIES = ['Todos', 'Cama', 'Mesa', 'Banho', 'Decoração'];

export default function Home() {
  const { items, openCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ heroImage: '/hero-bg.jpg' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Configurações Globais
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
      
    // Banco Oficial de Produtos
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
         setProducts(data.products || []);
         setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'Todos' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(10);
  }, [activeCategory, searchQuery]);

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-3 sticky-header min-h-[60px] flex items-center">
        <div className="flex items-center justify-between mx-auto max-w-5xl w-full relative">
          
          {/* Default Header Layout */}
          <div className={`flex items-center justify-between w-full transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-premium-graphite hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Abrir Menu"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-black text-brand-green tracking-tight">JP <span className="text-premium-graphite">Enxovais</span></h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-premium-graphite hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
              <button 
                onClick={openCart}
                className="relative p-2 text-premium-graphite hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-brand-coral text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Header Layout */}
          <div className={`flex items-center w-full gap-2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 relative' : 'opacity-0 pointer-events-none absolute'}`}>
             <div className="relative flex-1">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 ref={searchInputRef}
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Buscar lençóis, toalhas..." 
                 className="w-full bg-gray-100/80 border border-gray-200 text-premium-graphite rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm font-medium"
               />
             </div>
             <button 
               onClick={() => {
                 setIsSearchOpen(false);
                 setSearchQuery('');
               }}
               className="p-2 text-gray-500 hover:text-premium-graphite hover:bg-gray-100 rounded-full transition-colors"
               aria-label="Fechar Busca"
             >
               <X size={20} />
             </button>
          </div>

        </div>
      </header>

      {/* Hero Image Banner */}
      <section className="relative w-full h-[40vh] md:h-[55vh] flex items-end justify-center overflow-hidden mt-[60px]">
        {/* Imagem de Fundo inserida baseada na Configuração Dinâmica */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${settings.heroImage}')` }}
        />
        
        {/* Degrade escuro (bottom-to-top) indo até a metade da imagem */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 text-center px-4 pb-8 w-full flex flex-col items-center">
          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="bg-brand-green hover:bg-[#1ebd5b] text-white transition-colors px-10 py-3.5 rounded-2xl font-bold text-sm shadow-[0_4px_20px_rgba(50,176,85,0.4)] active:scale-95"
          >
            Quero Revender!
          </button>
        </div>
      </section>

      {/* Categories Scroll */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-[60px] z-20 py-3 border-b border-gray-100">
        <div className="flex px-4 gap-3 overflow-x-auto no-scrollbar max-w-5xl mx-auto items-center snap-x">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === category 
                  ? 'bg-brand-green text-white shadow-md' 
                  : 'bg-premium-offwhite text-gray-500 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section className="p-4 mx-auto max-w-5xl mt-2">
        <h3 className="text-lg font-bold text-premium-graphite mb-4">
          {searchQuery ? `Buscando por "${searchQuery}"` : activeCategory === 'Todos' ? 'Destaques' : `Linha ${activeCategory}`}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {loadingProducts ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 p-2">
                <div className="w-full aspect-square bg-gray-200 rounded-3xl animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-200 rounded-md animate-pulse mt-2" />
                <div className="w-1/2 h-3 bg-gray-100 rounded-md animate-pulse" />
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-2 md:col-span-4 py-12 text-center text-gray-400 font-medium">Nenhum produto cadastrado neste setor.</div>
          ) : (
            displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {!loadingProducts && filteredProducts.length > visibleCount && (
          <div className="flex justify-center mt-8 md:mt-10">
            <button 
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="bg-white border-2 border-gray-100 hover:border-brand-green/30 hover:bg-brand-green/5 text-premium-graphite font-bold py-3 px-8 rounded-2xl transition-all shadow-sm active:scale-95"
            >
              Exibir Mais Lençóis...
            </button>
          </div>
        )}
      </section>

      <Footer />
      <CartDrawer />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </main>
  );
}
