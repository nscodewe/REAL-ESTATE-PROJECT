'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNavbar } from '@/components/layout/top-navbar';
import { Toaster } from 'sonner';
import type { UserRole } from '@/lib/types';

const routeAccessRules: Array<{ path: string; roles: UserRole[] }> = [
  { path: '/analytics', roles: ['admin', 'manager'] },
  { path: '/user-management', roles: ['admin'] },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login/admin');
      return;
    }

    if (!isLoading && user && pathname) {
      const matchedRule = routeAccessRules.find((rule) => pathname.startsWith(rule.path));
      if (matchedRule && !matchedRule.roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 mx-auto animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (pathname && user) {
    const matchedRule = routeAccessRules.find((rule) => pathname.startsWith(rule.path));
    if (matchedRule && !matchedRule.roles.includes(user.role)) {
      return null;
    }
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Sidebar />
      <TopNavbar />
      <main className="md:ml-64 mt-16 p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <Toaster position="bottom-right" theme="light" />
    </div>
  );
}
