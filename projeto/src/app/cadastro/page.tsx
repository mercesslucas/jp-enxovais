'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Phone, FileText, Lock, Mail, ArrowRight, Loader2, Home, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    postcode: '',
    address: '',
    city: '',
    state: 'SP',
    phone: '',
    document: '',
    password: '',
    passwordConfirm: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      setError('Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 mb-8 flex justify-center">
        <Link href="/" className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <Home size={24} className="text-premium-graphite" />
        </Link>
      </div>

      <div className="w-full max-w-2xl relative z-10 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-brand-green p-8 text-center text-white">
          <h2 className="text-3xl font-black tracking-tight">Crie sua Conta</h2>
          <p className="mt-2 font-medium text-brand-green-50/80">Junte-se à JP Enxovais e tenha acesso ao estoque de fábrica.</p>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl text-center border border-red-100">
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-premium-graphite mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="Maria da Silva" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">CPF ou CNPJ</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="document" type="text" required value={formData.document} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="000.000.000-00" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">Celular / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="(00) 90000-0000" />
                </div>
              </div>

              {/* Endereço */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-premium-graphite mb-2">Endereço Completo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="address" type="text" required value={formData.address} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="Rua das Flores, 123 - Bairro" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">Cidade</label>
                <input name="city" type="text" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="Sua Cidade" />
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">Estado</label>
                <select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium text-gray-600">
                  <option value="" disabled>Selecione um estado</option>
                  <option value="AC">Acre (AC)</option>
                  <option value="AL">Alagoas (AL)</option>
                  <option value="AP">Amapá (AP)</option>
                  <option value="AM">Amazonas (AM)</option>
                  <option value="BA">Bahia (BA)</option>
                  <option value="CE">Ceará (CE)</option>
                  <option value="DF">Distrito Federal (DF)</option>
                  <option value="ES">Espírito Santo (ES)</option>
                  <option value="GO">Goiás (GO)</option>
                  <option value="MA">Maranhão (MA)</option>
                  <option value="MT">Mato Grosso (MT)</option>
                  <option value="MS">Mato Grosso do Sul (MS)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                  <option value="PA">Pará (PA)</option>
                  <option value="PB">Paraíba (PB)</option>
                  <option value="PR">Paraná (PR)</option>
                  <option value="PE">Pernambuco (PE)</option>
                  <option value="PI">Piauí (PI)</option>
                  <option value="RJ">Rio de Janeiro (RJ)</option>
                  <option value="RN">Rio Grande do Norte (RN)</option>
                  <option value="RS">Rio Grande do Sul (RS)</option>
                  <option value="RO">Rondônia (RO)</option>
                  <option value="RR">Roraima (RR)</option>
                  <option value="SC">Santa Catarina (SC)</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="SE">Sergipe (SE)</option>
                  <option value="TO">Tocantins (TO)</option>
                </select>
              </div>

              {/* Credenciais */}
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-premium-graphite mb-2">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="seu@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">Sua Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-premium-graphite mb-2">Confirme a Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none bg-gray-50/50 font-medium" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/login/cliente" className="text-brand-green font-bold text-sm hover:underline">Já tenho uma conta aprovada</Link>
              <button type="submit" disabled={loading} className="w-full md:w-auto px-8 py-4 bg-brand-green text-white font-black rounded-xl hover:bg-[#1ebd5b] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin w-5 h-5" /> Registrando...</> : <>Enviar Cadastro <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Sucesso (Em Análise) */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-2xl font-black text-premium-graphite mb-2">Cadastro Recebido!</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Sua ficha foi enviada com sucesso para a nossa base. Por razões de exclusividade e segurança logística, <strong>seu perfil passará por análise</strong> da gerência.
                Aguarde nossa notificação de liberação!
              </p>
              <button onClick={() => router.push('/')} className="w-full py-4 rounded-xl bg-gray-100 text-premium-graphite font-bold hover:bg-gray-200 transition-colors">
                Voltar à Vitrine
              </button>
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-green" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
