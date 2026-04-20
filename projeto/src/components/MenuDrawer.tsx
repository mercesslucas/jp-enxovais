'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, Phone, X, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const router = useRouter();

  const handleScrollToBottom = () => {
    onClose();
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 150);
  };

  const handleScrollToTop = () => {
    onClose();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleLoginClick = () => {
    onClose();
    router.push('/admin');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Escurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          />

          {/* Sidebar Drawer Esquerda */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl z-[100] flex flex-col"
          >
            {/* Header com logo e Fechar */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-black tracking-tight text-premium-graphite">
                JP<span className="text-brand-coral">Enxovais</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Links do Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col gap-2">
                <li>
                  <button 
                    onClick={handleLoginClick}
                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl text-premium-graphite hover:bg-brand-green/10 hover:text-brand-green transition-all font-semibold active:scale-[0.98]"
                  >
                    <LogIn size={22} className="opacity-70" />
                    Fazer Login
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleScrollToTop}
                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl text-premium-graphite hover:bg-brand-green/10 hover:text-brand-green transition-all font-semibold active:scale-[0.98]"
                  >
                    <Home size={22} className="opacity-70" />
                    Início
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleScrollToBottom}
                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl text-premium-graphite hover:bg-brand-green/10 hover:text-brand-green transition-all font-semibold active:scale-[0.98]"
                  >
                    <Info size={22} className="opacity-70" />
                    Quem Somos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleScrollToBottom}
                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-2xl text-premium-graphite hover:bg-brand-green/10 hover:text-brand-green transition-all font-semibold active:scale-[0.98]"
                  >
                    <Phone size={22} className="opacity-70" />
                    Contatos
                  </button>
                </li>
              </ul>
            </nav>

            {/* Rodapé Interno Descontraído */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-center text-gray-400 font-medium">
                © JP Enxovais.<br />Qualidade e conforto para seu lar.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
