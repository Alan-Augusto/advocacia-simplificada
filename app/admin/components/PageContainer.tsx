"use client";

import { Icon } from '@iconify/react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContainerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function PageContainer({
  title,
  subtitle,
  breadcrumbs = [],
  children,
  actions,
}: PageContainerProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header Section — fixed, never scrolls */}
      <div className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-4 lg:px-6 py-4">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-sm mb-3 pl-10 lg:pl-0">
              <Link
                href="/admin/board"
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Icon icon="solar:home-2-linear" width="16" />
              </Link>
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Icon icon="solar:alt-arrow-right-linear" width="14" className="text-slate-300" />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Title & Actions Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex-shrink-0">{actions}</div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area — fills remaining height */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-5 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
