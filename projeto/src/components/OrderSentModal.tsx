'use client';

import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MessageCircle } from 'lucide-react';

export function OrderSentModal() {
  const { isOrderSentOpen, closeOrderSent } = useCartStore();

  return (
    <AnimatePresence>
      {isOrderSentOpen && (
        <>
          {/* Backdrop Escurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrderSent}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />

          {/* Modal Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl z-[90] p-8 overflow-hidden"
          >
            {/* Elemento de Decoração Superior */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-green to-[#25D366]" />

            <div className="flex flex-col items-center text-center gap-5">
              <div className="bg-[#25D366]/10 p-5 rounded-full text-[#25D366] shadow-sm">
                <CheckCircle size={48} strokeWidth={2.5} />
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-premium-graphite mb-2">
                  Pedido Enviado!
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                  Seu pedido foi enviado para análise. Assim que for <strong className="text-brand-green">aprovado</strong>, você será notificado diretamente no seu <strong>WhatsApp</strong> pelo nosso time!
                </p>
              </div>

              <button 
                onClick={closeOrderSent}
                className="w-full mt-4 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 active:scale-95 text-base"
              >
                <MessageCircle size={20} />
                Entendido, aguardarei!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
