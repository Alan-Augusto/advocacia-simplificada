"use client";

import Link from 'next/link';
import { Icon } from '@iconify/react';

// ─── Types ───────────────────────────────────────────────
export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
  description: string;
}

interface SidebarProps {
  navItems: NavItem[];
  activeId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

// ─── Constants ───────────────────────────────────────────
const EXPANDED_WIDTH = 'w-56';
const COLLAPSED_WIDTH = 'w-16';

// ─── Component ───────────────────────────────────────────
export default function Sidebar({
  navItems,
  activeId,
  collapsed,
  onToggleCollapse,
  onLogout,
  mobileMenuOpen,
  onMobileMenuClose,
}: SidebarProps) {
  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col fixed inset-y-0 left-0 z-30
          bg-white border-r border-slate-200 overflow-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}
        `}
      >
        <DesktopContent
          navItems={navItems}
          activeId={activeId}
          collapsed={collapsed}
          onToggle={onToggleCollapse}
          onLogout={onLogout}
        />
      </aside>

      {/* ── Mobile Backdrop ─────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onMobileMenuClose}
        />
      )}

      {/* ── Mobile Sidebar ──────────────────────────────── */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <MobileContent
          navItems={navItems}
          activeId={activeId}
          onLogout={onLogout}
          onClose={onMobileMenuClose}
        />
      </aside>
    </>
  );
}

// ─── Desktop Sidebar Content ─────────────────────────────
function DesktopContent({
  navItems,
  activeId,
  collapsed,
  onToggle,
  onLogout,
}: {
  navItems: NavItem[];
  activeId: string;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="h-14 flex items-center border-b border-slate-100 px-4 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon icon="solar:scale-linear" width="18" className="text-white" />
          </div>
          <span
            className={`
              font-semibold text-sm text-slate-900 whitespace-nowrap
              transition-all duration-300
              ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
            `}
          >
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 rounded-lg
                transition-all duration-200
                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-600 rounded-r-full" />
              )}

              <Icon
                icon={item.icon}
                width="20"
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              <span
                className={`
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-300
                  ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                `}
              >
                {item.label}
              </span>

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 p-2 flex-shrink-0 space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`
            w-full flex items-center rounded-lg py-2
            text-slate-500 hover:bg-slate-50 hover:text-slate-700
            transition-all duration-200 group
            ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}
          `}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          <Icon
            icon="solar:sidebar-minimalistic-linear"
            width="20"
            className={`flex-shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
          <span
            className={`
              text-sm font-medium whitespace-nowrap
              transition-all duration-300
              ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
            `}
          >
            Recolher
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center rounded-lg py-2
            text-slate-500 hover:bg-rose-50 hover:text-rose-600
            transition-all duration-200 group
            ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'}
          `}
          title={collapsed ? 'Sair' : undefined}
        >
          <Icon
            icon="solar:logout-2-linear"
            width="20"
            className="flex-shrink-0 group-hover:text-rose-500 transition-colors"
          />
          <span
            className={`
              text-sm font-medium whitespace-nowrap
              transition-all duration-300
              ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
            `}
          >
            Sair
          </span>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 shadow-lg">
              Sair
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Mobile Sidebar Content ──────────────────────────────
function MobileContent({
  navItems,
  activeId,
  onLogout,
  onClose,
}: {
  navItems: NavItem[];
  activeId: string;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="h-14 flex items-center justify-between border-b border-slate-100 px-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Icon icon="solar:scale-linear" width="18" className="text-white" />
          </div>
          <span className="font-semibold text-sm text-slate-900">Admin Panel</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Icon icon="solar:close-circle-linear" width="20" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`
                group relative flex items-center gap-3 rounded-lg px-3 py-3
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-600 rounded-r-full" />
              )}
              <Icon
                icon={item.icon}
                width="20"
                className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
              />
              <div className="flex-1">
                <span className="text-sm font-medium">{item.label}</span>
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-100 p-3 flex-shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <Icon icon="solar:logout-2-linear" width="20" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </>
  );
}
