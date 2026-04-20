'use client';

import { useCartStore, Product } from '@/store/useCartStore';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, CheckCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { openCart, items, openSuccessNotification } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
         const found = (data.products || []).find((p: Product) => p.id === params?.id);
         setProduct(found || null);
         setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
     return (
       <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
         <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4" />
         <p className="text-gray-500 font-bold animate-pulse">Buscando detalhes do enxoval...</p>
       </main>
     );
  }

  if (!product) {
    return (
       <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
         <h2 className="text-2xl font-black text-premium-graphite mb-2">Produto Indisponível</h2>
         <p className="text-gray-500 text-center mb-6">Este produto pode ter sido removido ou o link está incorreto.</p>
         <button onClick={() => router.push('/')} className="bg-brand-green text-white font-bold py-3 px-8 rounded-xl">Voltar ao Catálogo</button>
       </main>
    );
  }

  const selectedVariation = product.variations[selectedColorIdx] || product.variations[0];
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = () => {
    addItem({
      product,
      selectedColor: selectedVariation.color,
      quantity: 1,
    });
    openSuccessNotification();
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      {/* Top Header Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-3 sticky-header">
        <div className="flex items-center justify-between mx-auto max-w-5xl">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-premium-graphite hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={openCart}
              className="relative p-2 text-premium-graphite hover:bg-gray-50 rounded-full transition-colors"
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
      </header>

      {/* Product Content Wrapper */}
      <div className="max-w-5xl mx-auto pt-16 md:pt-24 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Media Layout */}
        <div className="relative w-full aspect-square md:rounded-3xl overflow-hidden bg-white shadow-sm border md:border-gray-100">
           <AnimatePresence mode="wait">
             <motion.img 
               key={selectedVariation.image}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.3 }}
               src={selectedVariation.image}
               alt={product.name}
               className="w-full h-full object-cover"
             />
           </AnimatePresence>
           
           {/* Badges on Image */}
           <div className="absolute bottom-4 left-4 z-10 flex gap-2">
             <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest uppercase text-premium-graphite shadow-sm border border-black/5">
                {product.composition}
             </span>
             {product.videoUrl && (
               <span className="bg-premium-graphite/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5">
                  <Play size={10} fill="currentColor" /> Possui Vídeo
               </span>
             )}
           </div>
        </div>

        {/* Product Details Layout */}
        <div className="p-5 md:p-8 md:bg-white md:rounded-3xl md:shadow-sm md:border md:border-gray-100 flex flex-col h-full">
           <span className="text-brand-green font-bold text-sm tracking-widest uppercase mb-1">
             Linha {product.category}
           </span>
           <h1 className="text-2xl md:text-3xl font-black text-premium-graphite leading-tight mb-2">
             {product.name}
           </h1>
           <div className="flex items-center gap-4 mb-4">
             <div className="text-3xl font-black text-brand-green">
               R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
             </div>
             {(!product.stock || product.stock <= 0) && (
               <span className="bg-red-100 text-red-600 font-bold text-xs px-3 py-1 rounded-full border border-red-200">
                 Sem Estoque
               </span>
             )}
           </div>
           
           <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
             {product.description}
           </p>

           <div className="mb-6">
             <h3 className="text-sm font-bold text-premium-graphite mb-3 uppercase tracking-wider">
               Escolha uma {selectedVariation.type === 'pattern' ? 'Estampa' : 'Cor'}: <span className="text-gray-400 font-medium capitalize">{selectedVariation.color}</span>
             </h3>
             <div className="flex flex-wrap gap-3">
                {product.variations.map((v, idx) => {
                  const isEstampa = v.type === 'pattern';
                  const thumbUrl = v.patternImage || v.image;
                  const dynamicStyle = isEstampa && thumbUrl 
                    ? { backgroundImage: `url('${thumbUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }
                    : { backgroundColor: v.colorCode || '#ddd' };
                    
                  return (
                    <button
                      key={v.color}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm ${selectedColorIdx === idx ? 'border-brand-green scale-110 ring-4 ring-brand-green/10' : 'border-gray-200 hover:scale-105'}`}
                      style={dynamicStyle}
                      aria-label={`Selecionar ${v.color}`}
                    />
                  );
                })}
             </div>
           </div>

           {/* Add to list CTA Mobile Sticky / Desktop Native */}
           <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-20 md:relative md:p-0 md:bg-transparent md:border-0 md:mt-auto">
             <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-lg
                  ${(!product.stock || product.stock <= 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                    : 'bg-brand-green hover:bg-brand-green/90 text-white shadow-xl shadow-brand-green/20 active:scale-[0.98]'}`}
             >
                {(!product.stock || product.stock <= 0) ? (
                  <>Esgotado</>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Adicionar à Lista
                  </>
                )}
             </button>
           </div>
        </div>
      </div>
      
      {/* Aditional Content like Footer Space to compensate for Fixed CTA on Mobile */}
      <div className="mt-8">
        <Footer />
      </div>
      <CartDrawer />
    </main>
  );
}
