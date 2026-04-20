'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function AddedToast() {
  const { showSuccessNotification, closeSuccessNotification, openCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenList = () => {
    closeSuccessNotification();
    openCart();
  };

  const handleContinueShopping = () => {
    closeSuccessNotification();
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <AnimatePresence>
      {showSuccessNotification && (
        <>
          {/* Backdrop Escurecido para focar na notificação */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSuccessNotification}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
          />

          {/* Modal / Action Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-0 left-0 w-full md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl z-[70] p-6 pb-12 md:pb-6"
          >
            <div className="flex flex-col items-centertext-center gap-4">
              <div className="mx-auto bg-brand-green/10 p-4 rounded-full text-brand-green">
                <CheckCircle size={40} strokeWidth={2.5} />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-black text-premium-graphite mb-1">
                  Adicionado à sua lista!
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  Seu item foi separado com sucesso. O que deseja fazer agora?
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                <button 
                  onClick={handleOpenList}
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-base"
                >
                  <ShoppingBag size={20} />
                  Ver sua lista
                </button>
                
                <button 
                  onClick={handleContinueShopping}
                  className="w-full bg-premium-offwhite hover:bg-gray-200 text-premium-graphite font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-base border border-gray-200"
                >
                  <ArrowLeft size={20} />
                  Ver mais produtos
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
