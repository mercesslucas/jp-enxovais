'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redireciona para o painel de admin
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Erro ao fazer login.');
      }
    } catch (err) {
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Home size={24} className="text-premium-graphite" />
          </Link>
        </div>
        
        <h2 className="mt-2 text-center text-3xl font-black text-premium-graphite tracking-tight">
          JP<span className="text-brand-coral">Enxovais</span> Admin
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          Acesso restrito para gerentes e proprietários
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-xl text-center border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-bold text-premium-graphite mb-2"
              >
                E-mail Gerencial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green sm:text-sm transition-all text-premium-graphite bg-gray-50/50"
                  placeholder="admin@jpenxovais.com.br"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-bold text-premium-graphite mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green sm:text-sm transition-all text-premium-graphite bg-gray-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-green/20 text-sm font-bold text-white bg-brand-green hover:bg-[#1ebd5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    Entrar no Painel <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
