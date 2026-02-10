"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export default function SettingsContent() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data.settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <form onSubmit={handleSave} className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="space-y-5">
          {/* WhatsApp Number */}
          <div>
            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-slate-700 mb-2">
              Número do WhatsApp
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon icon="ic:baseline-whatsapp" width="18" />
              </div>
              <input
                type="text"
                id="whatsapp_number"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="5511999999999"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Número no formato internacional (código do país + DDD + número)
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
              <Icon icon="solar:check-circle-bold" width="18" />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={fetchSettings}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
            >
              {saving ? (
                <>
                  <Icon icon="solar:refresh-linear" width="16" className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Icon icon="solar:check-circle-linear" width="16" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Icon icon="solar:info-circle-bold" width="20" className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 text-sm mb-1">Variáveis de Ambiente</h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              Algumas configurações sensíveis (como a senha do admin e as chaves da API) devem ser
              configuradas no arquivo <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>.
              Nunca compartilhe essas informações publicamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
