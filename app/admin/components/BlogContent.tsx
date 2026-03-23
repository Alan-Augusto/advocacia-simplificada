"use client";

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { BlogPost } from '@/lib/types/database';
import BlogPostForm from '../blog/components/BlogPostForm';

const colorMap: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-600',
  teal: 'bg-teal-100 text-teal-600',
  indigo: 'bg-primary-100 text-primary-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  rose: 'bg-rose-100 text-rose-600',
  violet: 'bg-violet-100 text-violet-600',
  orange: 'bg-orange-100 text-orange-600',
  pink: 'bg-pink-100 text-pink-600',
  cyan: 'bg-cyan-100 text-cyan-600',
};

export default function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggleActive = async (post: BlogPost) => {
    try {
      await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !post.is_active }),
      });
      fetchPosts();
    } catch (error) {
      console.error('Error toggling blog post:', error);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon icon="solar:refresh-linear" width="28" className="text-primary-600 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <>
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:document-text-linear" width="28" className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma postagem cadastrada</h3>
          <p className="text-sm text-slate-500 mb-6">Comece adicionando sua primeira postagem de blog</p>
          <button
            onClick={handleNew}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-all"
          >
            <Icon icon="solar:add-circle-linear" width="18" />
            Nova Postagem
          </button>
        </div>
        {showForm && <BlogPostForm post={editingPost} onClose={handleFormClose} />}
      </>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {posts.map((post) => {
            const colorClass = colorMap[post.color] || colorMap.indigo;
            return (
              <div
                key={post.id}
                className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-all h-fit"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <Icon icon={post.icon} width="22" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{post.title}</h3>
                        {post.highlight && (
                          <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-600 text-xs font-medium px-1.5 py-0.5 rounded-full">
                            <Icon icon="solar:star-bold" width="10" />
                            Destaque
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{post.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(post)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                      post.is_active
                        ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title={post.is_active ? 'Desativar' : 'Ativar'}
                  >
                    <Icon
                      icon={post.is_active ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
                      width="18"
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{post.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {(post.tags?.length || 0) > 3 && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                      +{(post.tags?.length || 0) - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleEdit(post)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border border-slate-200"
                >
                  <Icon icon="solar:pen-linear" width="16" />
                  Editar Postagem
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && <BlogPostForm post={editingPost} onClose={handleFormClose} />}
    </div>
  );
}

export function BlogActions({ onNew }: { onNew: () => void }) {
  return (
    <button
      onClick={onNew}
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
    >
      <Icon icon="solar:add-circle-linear" width="18" />
      Nova Postagem
    </button>
  );
}
