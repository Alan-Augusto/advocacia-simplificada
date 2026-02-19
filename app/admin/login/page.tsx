"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin/board');
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon icon="solar:shield-keyhole-bold" width="32" className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Área de Admin
            </h1>
            <p className="text-sm text-slate-500">
              Digite sua senha para acessar o painel
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  placeholder="Digite sua senha"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon icon="solar:lock-password-linear" width="20" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <Icon icon="solar:danger-circle-linear" width="20" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Icon icon="solar:refresh-linear" width="20" className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Icon icon="solar:login-2-linear" width="20" />
                  Entrar no Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <a
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors inline-flex items-center gap-1"
            >
              <Icon icon="solar:alt-arrow-left-linear" width="16" />
              Voltar para o site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
