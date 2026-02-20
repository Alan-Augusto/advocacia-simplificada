"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { Prompt, Service } from '@/lib/types/database';

export default function PromptsContent() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'base' | 'service'>('base');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [promptsRes, servicesRes] = await Promise.all([
        fetch('/api/admin/prompts'),
        fetch('/api/admin/services'),
      ]);

      const promptsData = await promptsRes.json();
      const servicesData = await servicesRes.json();

      setPrompts(promptsData.prompts || []);
      setServices(servicesData.services || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const basePrompt = prompts.find((p) => p.type === 'base');
  const servicePrompts = prompts.filter((p) => p.type === 'service');

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditContent(prompt.content);
  };

  const handleSave = async () => {
    if (!editingPrompt) return;

    setSaving(true);
    try {
      await fetch(`/api/admin/prompts/${editingPrompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      await fetchData();
      setEditingPrompt(null);
    } catch (error) {
      console.error('Error saving prompt:', error);
    } finally {
      setSaving(false);
    }
  };

  const getServiceTitle = (code: string | null) => {
    if (!code) return '';
    return services.find((s) => s.code === code)?.title || code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon icon="solar:refresh-linear" width="28" className="text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs - Fixed at top */}
      <div className="flex-shrink-0 flex gap-2 pb-4">
        <button
          onClick={() => setActiveTab('base')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'base'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Prompt Base
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'service'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Prompts por Serviço
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        <div className="space-y-4 pb-4">
          {/* Base Prompt Tab */}
          {activeTab === 'base' && basePrompt && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">Prompt Base</h2>
                  <p className="text-sm text-slate-500">
                    Define o comportamento geral da IA em todas as conversas
                  </p>
                </div>
                {editingPrompt?.id !== basePrompt.id && (
                  <button
                    onClick={() => handleEdit(basePrompt)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <Icon icon="solar:pen-linear" width="16" />
                    Editar
                  </button>
                )}
              </div>

              {editingPrompt?.id === basePrompt.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-80 px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono text-sm resize-none"
                  />
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{editContent.length} caracteres</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPrompt(null)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                      >
                        {saving ? (
                          <>
                            <Icon icon="solar:refresh-linear" width="16" className="animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Icon icon="solar:check-circle-linear" width="16" />
                            Salvar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">
                    {basePrompt.content}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Service Prompts Tab */}
          {activeTab === 'service' && (
            <div className="space-y-4">
              {servicePrompts.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                  <Icon icon="solar:chat-square-code-linear" width="40" className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Nenhum prompt de serviço encontrado</p>
                </div>
              ) : (
                servicePrompts.map((prompt) => (
                  <div key={prompt.id} className="bg-white rounded-lg border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">
                          {getServiceTitle(prompt.service_code)}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Código: {prompt.service_code}
                        </p>
                      </div>
                      {editingPrompt?.id !== prompt.id && (
                        <button
                          onClick={() => handleEdit(prompt)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                        >
                          <Icon icon="solar:pen-linear" width="16" />
                          Editar
                        </button>
                      )}
                    </div>

                    {editingPrompt?.id === prompt.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full h-40 px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono text-sm resize-none"
                        />
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>{editContent.length} caracteres</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingPrompt(null)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-all"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                            >
                              {saving ? (
                                <>
                                  <Icon icon="solar:refresh-linear" width="16" className="animate-spin" />
                                  Salvando...
                                </>
                              ) : (
                                <>
                                  <Icon icon="solar:check-circle-linear" width="16" />
                                  Salvar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">
                          {prompt.content}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
