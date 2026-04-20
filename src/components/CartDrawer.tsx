'use client';

import { useCartStore } from '@/store/useCartStore';
import { X, Trash2, Plus, Minus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, removeItem, updateQuantity, clearCart, openOrderSent } = useCartStore();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setCheckingAuth(true);
      fetch('/api/auth/me')
        .then(res => res.json())
        .then(data => setIsAuthenticated(data.loggedIn))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setCheckingAuth(false));
    }
  }, [isCartOpen]);

  const totalPrice = items.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);

  const handleSendApproval = async () => {
    try {
      // Simulate sending to DynamoDB / AWS SES via API route
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (response.ok) {
        clearCart();
        closeCart();
        openOrderSent();
      } else {
        alert("Falha ao enviar pedido.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao enviar pedido.");
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[90%] md:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-premium-graphite">Minha Lista</h2>
              <button 
                onClick={closeCart}
                className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-2 mt-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <X size={32} className="text-gray-300" />
                  </div>
                  <p>Sua lista está vazia.</p>
                </div>
              ) : (
                items.map((item) => {
                  const resolvedVariation = item.product.variations.find(v => v.color === item.selectedColor) || item.product.variations[0];
                  const labelVariant = resolvedVariation.type === 'pattern' ? 'Estampa' : 'Cor';
                  return (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                    <img 
                      src={resolvedVariation?.image} 
                      alt="" 
                      className="w-16 h-16 object-cover rounded-md shadow-sm"
                    />
                    <div className="flex-1 flex flex-col">
                      <h4 className="text-sm font-semibold text-premium-graphite line-clamp-1">{item.product.name}</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-xs text-brand-green/80 font-medium capitalize">{labelVariant}: {item.selectedColor}</span>
                        <span className="text-xs font-bold text-premium-graphite">R$ {Number(item.product.price || 0).toFixed(2).replace('.', ',')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, Math.max(1, item.quantity - 1))}
                            className="text-gray-400 hover:text-brand-green"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => {
                               const maxStock = item.product.stock || 0;
                               if (item.quantity < maxStock) {
                                  updateQuantity(item.product.id, item.selectedColor, item.quantity + 1);
                               }
                            }}
                            disabled={item.quantity >= (item.product.stock || 0)}
                            className={`text-gray-400 ${item.quantity >= (item.product.stock || 0) ? 'opacity-30 cursor-not-allowed' : 'hover:text-brand-green'}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeItem(item.product.id, item.selectedColor)}
                          className="text-brand-coral hover:bg-brand-coral/10 p-1.5 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] flex flex-col gap-3">
                <div className="flex items-center justify-between text-premium-graphite">
                  <span className="font-bold text-sm">Valor Estimado:</span>
                  <span className="font-black text-xl text-brand-green">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {checkingAuth ? (
                  <button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 rounded-xl flex items-center justify-center cursor-wait">
                    Verificando Conta...
                  </button>
                ) : !isAuthenticated ? (
                  <button 
                    onClick={() => { closeCart(); router.push('/login/cliente'); }}
                    className="w-full bg-premium-graphite hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                  >
                    Faça Login para Finalizar
                  </button>
                ) : (
                  <button 
                    onClick={handleSendApproval}
                    className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 transition-all active:scale-[0.98]"
                  >
                    Enviar para Aprovação
                    <Send size={18} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
