'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Home,
  Briefcase,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'Properties',
    href: '/properties',
    icon: <Home className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'Deals',
    href: '/deals',
    icon: <Briefcase className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['admin', 'manager'],
  },
  {
    label: 'Communications',
    href: '/communications',
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ['admin', 'agent', 'manager'],
  },
  {
    label: 'User Management',
    href: '/user-management',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const visibleItems = navItems.filter(item => item.roles.includes(user.role));

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push('/login/admin');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar-collapse fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              RE
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Real Estate</h1>
              <p className="text-xs text-gray-600">CRM Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {visibleItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600">Logged in as</p>
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-600 capitalize mt-1">{user.role}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
