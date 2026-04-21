'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles: UserRole[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login/admin');
      return;
    }

    if (!requiredRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [user, requiredRoles, router]);

  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
