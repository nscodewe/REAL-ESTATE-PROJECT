'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType, UserRole } from '@/lib/types';
import { dummyUsers } from '@/lib/dummy-data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - check against dummy users
      const dummyUser = Object.values(dummyUsers).find(
        u => u.email === email && u.role === role
      );

      if (dummyUser) {
        setUser(dummyUser);
        localStorage.setItem('auth-user', JSON.stringify(dummyUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        phone: '',
        department: role === 'admin' ? 'Management' : role === 'manager' ? 'Operations' : 'Sales',
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
      };

      setUser(newUser);
      localStorage.setItem('auth-user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth-user');
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
