"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { BlogPost } from "@/lib/types/database";

// Color mapping for blog posts to ensure safe classes
const colorMap: Record<string, { bg: string, iconColor: string }> = {
  amber: { bg: "from-amber-100 to-orange-50", iconColor: "text-amber-500" },
  teal: { bg: "from-teal-100 to-emerald-50", iconColor: "text-teal-500" },
  indigo: { bg: "from-indigo-100 to-violet-50", iconColor: "text-indigo-500" },
  emerald: { bg: "from-emerald-100 to-green-50", iconColor: "text-emerald-500" },
  blue: { bg: "from-blue-100 to-sky-50", iconColor: "text-blue-500" },
  rose: { bg: "from-rose-100 to-pink-50", iconColor: "text-rose-500" },
  violet: { bg: "from-violet-100 to-purple-50", iconColor: "text-violet-500" },
  orange: { bg: "from-orange-100 to-amber-50", iconColor: "text-orange-500" },
  pink: { bg: "from-pink-100 to-rose-50", iconColor: "text-pink-500" },
  cyan: { bg: "from-cyan-100 to-sky-50", iconColor: "text-cyan-500" },
};

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
      .catch((err) => console.error("Error fetching blog posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-16 fade-in visible">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
            Blog Informativo
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Conheça seus direitos
            <br />
            em detalhes
          </h2>
          <p className="text-base text-slate-500 leading-relaxed">
            Artigos completos para você entender cada aspecto dos seus direitos
            trabalhistas. Conhecimento é o primeiro passo para a defesa.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in visible">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse">
                <div className="h-40 bg-slate-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in visible">
            {posts.map((post, index) => {
              const colors = colorMap[post.color] || colorMap.indigo;
              return (
                <a
                  key={index}
                  href={post.slug}
                  className={`card-hover bg-white rounded-2xl ${post.highlight ? 'border-2 border-indigo-200' : 'border border-slate-200/80'} overflow-hidden group relative`}
                >
                  {post.highlight && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        <Icon icon="solar:star-bold" width="10" />
                        Destaque
                      </span>
                    </div>
                  )}
                  <div className={`h-40 bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <Icon icon={post.icon} width="48" className={colors.iconColor} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-sm tracking-tight text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, tIndex) => (
                        <span key={tIndex} className={`text-xs ${post.highlight ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'} px-2 py-0.5 rounded`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
