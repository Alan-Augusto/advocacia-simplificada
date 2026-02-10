"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import PageContainer, { BreadcrumbItem } from './components/PageContainer';
import Sidebar, { NavItem } from './components/Sidebar';

// ─── Page configuration ──────────────────────────────────
interface PageConfig {
  id: string;
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
  '/admin/board': {
    id: 'board',
    title: 'Board de Leads',
    subtitle: 'Gerencie todos os leads capturados pela IA',
    breadcrumbs: [{ label: 'Board' }],
  },
  '/admin/services': {
    id: 'services',
    title: 'Gerenciar Serviços',
    subtitle: 'Configure os serviços oferecidos no sistema',
    breadcrumbs: [{ label: 'Serviços' }],
  },
  '/admin/prompts': {
    id: 'prompts',
    title: 'Gerenciar Prompts da IA',
    subtitle: 'Configure o comportamento da assistente virtual',
    breadcrumbs: [{ label: 'Prompts' }],
  },
  '/admin/settings': {
    id: 'settings',
    title: 'Configurações',
    subtitle: 'Ajuste as configurações gerais do sistema',
    breadcrumbs: [{ label: 'Configurações' }],
  },
};

const NAV_ITEMS: NavItem[] = [
  {
    id: 'board',
    href: '/admin/board',
    label: 'Board',
    icon: 'solar:clipboard-list-linear',
    description: 'Gerenciar leads',
  },
  {
    id: 'services',
    href: '/admin/services',
    label: 'Serviços',
    icon: 'solar:settings-linear',
    description: 'Configurar serviços',
  },
  {
    id: 'prompts',
    href: '/admin/prompts',
    label: 'Prompts',
    icon: 'solar:chat-square-code-linear',
    description: 'Editar prompts da IA',
  },
  {
    id: 'settings',
    href: '/admin/settings',
    label: 'Configurações',
    icon: 'solar:tuning-2-linear',
    description: 'Configurações do sistema',
  },
];

const SIDEBAR_STORAGE_KEY = 'admin_sidebar_collapsed';

// ─── Component ───────────────────────────────────────────
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hydrate collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === 'true') setSidebarCollapsed(true);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Get current page config
  const pageConfig = useMemo(() => {
    return (
      PAGE_CONFIGS[pathname] ||
      Object.entries(PAGE_CONFIGS).find(
        ([key]) => pathname.startsWith(key) && key !== '/admin'
      )?.[1] ||
      PAGE_CONFIGS['/admin/board']
    );
  }, [pathname]);

  // Get active nav item
  const activeId = useMemo(() => {
    const item = NAV_ITEMS.find(
      (item) =>
        pathname === item.href ||
        (item.href !== '/admin/board' && pathname.startsWith(item.href))
    );
    return item?.id || 'board';
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        navItems={NAV_ITEMS}
        activeId={activeId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Toggle */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-3 left-3 z-30 w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-600 border border-slate-200"
        >
          <Icon icon="solar:hamburger-menu-linear" width="20" />
        </button>
      )}

      {/* Main Content Area */}
      <main
        className={`
          flex-1 flex flex-col h-screen overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-56'}
        `}
      >
        <PageContainer
          title={pageConfig.title}
          subtitle={pageConfig.subtitle}
          breadcrumbs={pageConfig.breadcrumbs}
        >
          {children}
        </PageContainer>
      </main>
    </div>
  );
}
