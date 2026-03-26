import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/lib/types/database';
import Header from '../components/Header';
import Footer from '../components/Footer';

const colorMap: Record<string, { bg: string; iconColor: string }> = {
  amber: { bg: 'from-amber-100 to-orange-50', iconColor: 'text-amber-500' },
  teal: { bg: 'from-teal-100 to-emerald-50', iconColor: 'text-teal-500' },
  indigo: { bg: 'from-primary-100 to-violet-50', iconColor: 'text-primary-500' },
  emerald: { bg: 'from-emerald-100 to-green-50', iconColor: 'text-emerald-500' },
  blue: { bg: 'from-blue-100 to-sky-50', iconColor: 'text-blue-500' },
  rose: { bg: 'from-rose-100 to-pink-50', iconColor: 'text-rose-500' },
  violet: { bg: 'from-violet-100 to-purple-50', iconColor: 'text-violet-500' },
  orange: { bg: 'from-orange-100 to-amber-50', iconColor: 'text-orange-500' },
  pink: { bg: 'from-pink-100 to-rose-50', iconColor: 'text-pink-500' },
  cyan: { bg: 'from-cyan-100 to-sky-50', iconColor: 'text-cyan-500' },
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', `/${slug}`)
    .eq('is_active', true)
    .single();
  return data;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Artigo não encontrado' };
  return {
    title: `${post.title} | Dr. Luciano — Advocacia Trabalhista`,
    description: post.description,
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const colors = colorMap[post.color] || colorMap.indigo;

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Hero banner */}
        <div className={`pt-24 pb-16 bg-gradient-to-br ${colors.bg}`}>
          <div className="max-w-3xl mx-auto px-6">
            {/* Back link */}
            <a
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8 transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" width="16" />
              Voltar ao blog
            </a>

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl bg-white/70 flex items-center justify-center mb-6 shadow-sm`}>
              <Icon icon={post.icon} width="36" className={colors.iconColor} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs font-medium bg-white/70 text-slate-600 px-3 py-1 rounded-full border border-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-600 leading-relaxed">
              {post.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          {post.content ? (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-slate-400 text-center py-16">
              Conteúdo em breve.
            </p>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-primary-50 rounded-2xl border border-primary-100 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              Nossa equipe pode analisar o seu caso gratuitamente.
            </p>
            <a
              href="/atendimento"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <Icon icon="solar:chat-round-line-linear" width="18" />
              Falar com um advogado
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
