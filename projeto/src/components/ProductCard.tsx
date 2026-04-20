'use client';

import { useState, useRef } from 'react';
import { Product, useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function ProductCard({ product }: { product: Product }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isTouchRef = useRef(false);
  const { addItem, openSuccessNotification } = useCartStore();
  const router = useRouter();

  const selectedVariation = product.variations[selectedColorIdx];

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'touchstart') {
      isTouchRef.current = true;
    } else if (e.type === 'mousedown' && isTouchRef.current) {
      // Ignore mouse down if it was a touch
      return;
    }

    pressTimer.current = setTimeout(() => {
      if (product.videoUrl) {
        setShowVideo(true);
      }
    }, 500); // 500ms for long press
  };

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === 'mouseup' && isTouchRef.current) {
      // Ignore ghost mouseup
      return;
    }

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    
    // If video didn't show, it was a short tap: navigate
    if (!showVideo) {
      // Prevent rapid double navigation on touch devices
      router.push(`/produto/${product.id}`);
    }
    setShowVideo(false);

    // Reset touch flag after a short delay so normal mouse clicks work later if disconnected
    if (e.type === 'touchend') {
       setTimeout(() => { isTouchRef.current = false }, 500);
    }
  };

  const handleMouseLeave = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setShowVideo(false);
  };

  const handleAddToCart = () => {
    addItem({
      product,
      selectedColor: selectedVariation.color,
      quantity: 1,
    });
    openSuccessNotification();
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
      {/* Media Container */}
      <div 
        className="relative aspect-[4/5] bg-gray-50 overflow-hidden cursor-pointer touch-none select-none"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {/* Composition Badge */}
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-premium-graphite shadow-sm border border-black/5">
          {product.composition}
        </div>

        {/* Video or Image */}
        {showVideo && product.videoUrl ? (
          <video 
            src={product.videoUrl} 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
          />
        ) : (
          <motion.img 
            key={selectedVariation.image}
            src={selectedVariation.image} 
            alt={product.name}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Video Hint Overlay */}
        {product.videoUrl && !showVideo && (
          <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1 text-white text-[10px] pr-2.5 shadow-lg select-none">
            <Play size={10} fill="currentColor" /> Segure P/ Ver
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2.5">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-semibold text-sm text-premium-graphite line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <span className="font-black text-brand-green">
              R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Color / Pattern Swatches */}
        <div className="flex items-center gap-2 mt-1">
          {product.variations.map((variation, idx) => {
            const isEstampa = variation.type === 'pattern';
            const thumbUrl = variation.patternImage || variation.image;
            const dynamicStyle = isEstampa && thumbUrl
              ? { backgroundImage: `url('${thumbUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden' }
              : { backgroundColor: variation.colorCode || '#ddd' };

            return (
              <button
                key={variation.color}
                onClick={() => setSelectedColorIdx(idx)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${selectedColorIdx === idx ? 'border-brand-green scale-110 shadow-sm' : 'border-black/5 shadow-none'}`}
                style={dynamicStyle}
                aria-label={`Selecionar ${variation.color}`}
              />
            );
          })}
        </div>

        {/* Add to list */}
        <button 
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock <= 0}
          className={`mt-1 flex items-center justify-center gap-1.5 w-full transition-colors py-2 rounded-xl text-sm font-bold border 
            ${(!product.stock || product.stock <= 0) 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'bg-premium-offwhite hover:bg-brand-green/10 text-brand-green border-brand-green/20'}`}
        >
          {(!product.stock || product.stock <= 0) ? (
            <>Esgotado</>
          ) : (
            <>
              <ShoppingBag size={16} />
              Adicionar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
