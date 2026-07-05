import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Target, GitPullRequestDraft,
  CalendarCheck, Calendar, FileText, Receipt,
  BarChart3, Settings, Bell, Search, ChevronLeft,
  ChevronRight, Building2, HelpCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Customers', icon: Users, href: '/customers' },
  { label: 'Leads', icon: Target, href: '/leads' },
  { label: 'Pipeline', icon: GitPullRequestDraft, href: '/pipeline' },
  { label: 'Tasks', icon: CalendarCheck, href: '/tasks' },
  { label: 'Meetings', icon: Calendar, href: '/meetings' },
  { label: 'Invoices', icon: FileText, href: '/invoices' },
  { label: 'Payments', icon: Receipt, href: '/payments' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
];

const bottomNav: NavItem[] = [
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));

    return (
      <Link
        to={item.href}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-sidebar-active text-white shadow-lg shadow-primary/20'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground'
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
        {item.badge && !collapsed && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-base font-bold text-sidebar-foreground">CRM</h1>
            <p className="text-[10px] font-medium text-sidebar-foreground/50">Premium Suite</p>
          </motion.div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <Link
            to="/search"
            className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-sidebar-muted px-3 py-2 text-sm text-sidebar-foreground/50 transition-colors hover:border-sidebar-hover hover:text-sidebar-foreground/70"
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-auto rounded-md border border-sidebar-border bg-sidebar-background px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={cn('flex-1 overflow-y-auto px-3 py-2', collapsed && 'px-2')}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              Main Menu
            </motion.p>
          )}
        </AnimatePresence>
        <div className={cn('flex flex-col gap-1', collapsed && 'items-center')}>
          {mainNav.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className={cn('flex flex-col gap-1', collapsed && 'items-center')}>
          {bottomNav.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
          <NavItemComponent item={{ label: 'Help', icon: HelpCircle, href: '/help' }} />
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-background text-sidebar-foreground/50 shadow-md transition-colors hover:text-sidebar-foreground"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
