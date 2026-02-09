"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Board',
      icon: 'solar:clipboard-list-linear',
      active: pathname === '/admin',
    },
    {
      href: '/admin/services',
      label: 'Serviços',
      icon: 'solar:settings-linear',
      active: pathname.startsWith('/admin/services'),
    },
    {
      href: '/admin/prompts',
      label: 'Prompts',
      icon: 'solar:chat-square-code-linear',
      active: pathname.startsWith('/admin/prompts'),
    },
    {
      href: '/admin/settings',
      label: 'Configurações',
      icon: 'solar:tuning-2-linear',
      active: pathname.startsWith('/admin/settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-56 bg-white border-r border-slate-100 fixed h-full">
        {/* Logo */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Icon icon="solar:shield-check-bold" width="18" className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Admin CRM</h1>
              <p className="text-xs text-slate-500">Dr. Luciano</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                item.active
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon icon={item.icon} width="18" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <Icon icon="solar:logout-2-linear" width="18" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-600 border border-slate-200"
      >
        <Icon icon={mobileMenuOpen ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear'} width="20" />
      </button>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-56 bg-white h-full" onClick={(e) => e.stopPropagation()}>
            {/* Logo */}
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:shield-check-bold" width="18" className="text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-900">Admin CRM</h1>
                  <p className="text-xs text-slate-500">Dr. Luciano</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    item.active
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon icon={item.icon} width="18" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all w-full"
              >
                <Icon icon="solar:logout-2-linear" width="18" />
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
