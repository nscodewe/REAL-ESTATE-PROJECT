'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { dummyUsers } from '@/lib/dummy-data';
import type { UserRole } from '@/lib/types';

export default function LoginPage({ params }: { params: Promise<{ role: UserRole }> }) {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { role } = use(params);
  const dummyUser = Object.values(dummyUsers).find(u => u.role === role);

  useEffect(() => {
    if (!dummyUser) {
      router.replace('/login/admin');
    }
  }, [dummyUser, router]);

  if (!dummyUser) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  const fillDemoCredentials = () => {
    if (dummyUser) {
      setEmail(dummyUser.email);
      setPassword('password');
    }
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    agent: 'Sales Agent',
    manager: 'Manager',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              RE
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Real Estate CRM</h1>
          <p className="text-gray-600">Sign in as {roleLabels[role]}</p>
        </div>

        {/* Login Form */}
        <Card className="border border-gray-200 bg-white rounded-xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border-gray-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border-gray-200"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border/30 space-y-3">
              <p className="text-xs text-gray-600 text-center">Demo Credentials:</p>
              <div className="text-xs space-y-2 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                <p>
                  <span className="font-medium text-gray-900">Email:</span>{' '}
                  <span className="text-gray-600">{dummyUser?.email}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-900">Password:</span>{' '}
                  <span className="text-gray-600">password</span>
                </p>
              </div>
              <Button
                type="button"
                onClick={fillDemoCredentials}
                variant="outline"
                className="w-full text-sm"
                disabled={isLoading}
              >
                Fill Demo Credentials
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link href={`/signup/${role}`} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link href="/login/admin" className={`text-xs px-2 py-1 rounded transition-colors ${role === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              Admin
            </Link>
            <Link href="/login/agent" className={`text-xs px-2 py-1 rounded transition-colors ${role === 'agent' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              Agent
            </Link>
            <Link href="/login/manager" className={`text-xs px-2 py-1 rounded transition-colors ${role === 'manager' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
