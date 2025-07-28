import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useNotifications();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          "lg:ml-64 w-full",
          "p-4 sm:p-6 lg:p-8",
          "max-w-full",
          className
        )}>
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.displayName = "DashboardLayout";
