"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import type { BlogPost } from '@/lib/types/database';

interface BlogPostFormProps {
  post: BlogPost | null;
  onClose: () => void;
}

const colorOptions = [
  { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
  { value: 'teal', label: 'Teal', className: 'bg-teal-500' },
  { value: 'indigo', label: 'Indigo', className: 'bg-primary-500' },
  { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', className: 'bg-blue-500' },
  { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
  { value: 'violet', label: 'Violet', className: 'bg-violet-500' },
  { value: 'orange', label: 'Orange', className: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', className: 'bg-pink-500' },
  { value: 'cyan', label: 'Cyan', className: 'bg-cyan-500' },
];

const DEFAULT_ICON = 'solar:document-text-linear';

function ToolbarButton({
  onClick,
  active,
  title,
  icon,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon icon={icon} width="16" />
    </button>
  );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else if (url === '') {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Negrito"
        icon="solar:text-bold-square-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Itálico"
        icon="solar:text-italic-square-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="Sublinhado"
        icon="solar:text-underline-linear"
      />

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Título"
        icon="solar:text-square-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Subtítulo"
        icon="solar:text-square-linear"
      />

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Lista"
        icon="solar:list-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Lista numerada"
        icon="solar:list-linear"
      />

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Citação"
        icon="solar:chat-square-linear"
      />
      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Link"
        icon="solar:link-linear"
      />

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        active={editor.isActive({ textAlign: 'left' })}
        title="Alinhar à esquerda"
        icon="solar:align-left-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        active={editor.isActive({ textAlign: 'center' })}
        title="Centralizar"
        icon="solar:align-horizontal-center-linear"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        active={editor.isActive({ textAlign: 'right' })}
        title="Alinhar à direita"
        icon="solar:align-right-linear"
      />
    </div>
  );
}

export default function BlogPostForm({ post, onClose }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    slug: post?.slug || '',
    title: post?.title || '',
    description: post?.description || '',
    tags: post?.tags?.join(', ') || '',
    icon: post?.icon || DEFAULT_ICON,
    color: post?.color || 'indigo',
    order: post?.order ?? 999,
    highlight: post?.highlight || false,
  });
  const [saving, setSaving] = useState(false);

  // Icon search state
  const [iconSearch, setIconSearch] = useState('');
  const [iconResults, setIconResults] = useState<string[]>([]);
  const [iconLoading, setIconLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'blog-content min-h-[200px] p-4 outline-none',
      },
    },
  });

  const searchIcons = useCallback(async (query: string) => {
    if (!query.trim()) { setIconResults([]); return; }
    setIconLoading(true);
    try {
      const params = new URLSearchParams({ query: query.trim(), limit: '60', prefixes: 'solar' });
      const res = await fetch(`https://api.iconify.design/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setIconResults(data.icons || []);
      }
    } catch (err) {
      console.error('Error searching icons:', err);
    } finally {
      setIconLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!iconSearch.trim()) { setIconResults([]); return; }
    debounceRef.current = setTimeout(() => searchIcons(iconSearch), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [iconSearch, searchIcons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        content: editor?.getHTML() || '',
      };

      const url = post ? `/api/admin/blog/${post.id}` : '/api/admin/blog';
      const method = post ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) onClose();
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-semibold text-slate-900">
            {post ? 'Editar Postagem' : 'Nova Postagem'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <Icon icon="solar:close-circle-linear" width="24" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Ex: /direitos-trabalhistas"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              required
            />
            <p className="text-xs text-slate-400 mt-1">Deve começar com / e usar apenas letras minúsculas e hífens.</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Rescisão de Contrato de Trabalho"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Breve descrição do artigo..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Conteúdo do artigo
            </label>
            <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: Justa causa, Rescisão indireta, CLT"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ícone <span className="text-red-500">*</span>
            </label>
            {formData.icon && (
              <div className="flex items-center gap-3 mb-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <Icon icon={formData.icon} width="28" className="text-primary-600" />
                <span className="text-sm font-medium text-primary-700">{formData.icon}</span>
              </div>
            )}
            <div className="relative mb-3">
              <Icon icon="solar:magnifer-linear" width="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Buscar ícones (ex: document, shield, clock...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
              />
              {iconLoading && (
                <Icon icon="solar:refresh-linear" width="18" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
              )}
            </div>
            {iconResults.length > 0 && (
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg">
                {iconResults.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    title={icon}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Icon icon={icon} width="24" className="mx-auto" />
                  </button>
                ))}
              </div>
            )}
            {iconSearch.trim() && !iconLoading && iconResults.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                Nenhum ícone encontrado para &quot;{iconSearch}&quot;
              </p>
            )}
            {!iconSearch.trim() && (
              <p className="text-xs text-slate-400">Digite acima para buscar ícones na biblioteca Solar Icons.</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cor <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.color === color.value ? 'border-slate-900 font-semibold' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color.className}`} />
                    <span>{color.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order + Highlight */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Ordem de exibição</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="block text-sm font-medium text-slate-700 mb-2">Destaque</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, highlight: !formData.highlight })}
                className={`px-5 py-2.5 rounded-lg border-2 font-medium flex items-center gap-2 transition-all ${
                  formData.highlight
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Icon icon="solar:star-bold" width="18" />
                {formData.highlight ? 'Sim' : 'Não'}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {saving ? (
              <>
                <Icon icon="solar:refresh-linear" width="20" className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Icon icon="solar:check-circle-linear" width="20" />
                Salvar Postagem
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
