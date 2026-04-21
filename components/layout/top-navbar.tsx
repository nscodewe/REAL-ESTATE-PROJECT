'use client';

import { useAuth } from '@/lib/auth-context';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function TopNavbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30">
      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-white border-gray-200 w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-900 relative hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
          <Settings className="w-5 h-5" />
        </Button>

        <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600 capitalize">{user.role}</p>
          </div>
          {user.avatar && (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          )}
        </div>
      </div>
    </header>
  );
}
