'use client';

import { Sidebar } from './sidebar';
import { TopNavbar } from './top-navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MainLayout({ children, title = 'Dashboard' }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col">
        {/* Top Navigation */}
        <TopNavbar title={title} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
