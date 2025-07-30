import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  ShoppingCart,
  MenuSquare,
  BarChart3,
  Settings,
  Plus,
  AlertTriangle,
  Package,
  Users,
  ClipboardList,
  UserCheck,
  Gift,
  X
} from 'lucide-react';

// Sidebar items as specified in guide.md: "Sidebar: Menu | Orders | Analytics | Settings"
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: '12'
  },
  {
    title: 'Order Management',
    href: '/admin/order-management',
    icon: ClipboardList
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: UserCheck
  },
  {
    title: 'Promotions',
    href: '/admin/promotions',
    icon: Gift
  },
  {
    title: 'Menu',
    href: '/admin/menu',
    icon: MenuSquare
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: 'Inventory',
    href: '/admin/inventory',
    icon: Package
  },
  {
    title: 'Kitchen Display',
    href: '/admin/kitchen',
    icon: Settings
  }
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Quick Action Handlers
  const handleAddMenuItem = () => {
    navigate('/admin/menu', { state: { openAddMenuDialog: true } });
    if (isOpen) onClose(); // Close mobile sidebar
  };

  const handleManageStaff = () => {
    toast({
      title: "Staff Management",
      description: "Staff management feature coming soon!",
      variant: "default",
    });
    if (isOpen) onClose(); // Close mobile sidebar
  };

  const handleViewAlerts = () => {
    const alertMessages = [
      "Low stock: Truffle Oil (2 bottles remaining)",
      "Underperforming: Mushroom Risotto (-15%)",
      "High demand: Margherita Pizza (+15%)"
    ];
    
    toast({
      title: "System Alerts",
      description: `${alertMessages.length} alerts require attention. Check Analytics for details.`,
      variant: "destructive",
    });
    
    // Navigate to analytics for detailed alerts
    setTimeout(() => {
      navigate('/admin/analytics');
      if (isOpen) onClose();
    }, 1500);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-1 flex-col border-r bg-card/50 backdrop-blur-sm">
          <ScrollArea className="flex-1 px-4 py-6">
            {/* Main Navigation */}
            <div className="space-y-2 mb-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                Navigation
              </h3>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-11 text-left font-medium",
                        isActive && "bg-primary text-primary-foreground shadow-sm"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
                Quick Actions
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-3 h-10 mb-2 text-sm hover:bg-green-50 hover:border-green-200"
                onClick={handleAddMenuItem}
              >
                <Package className="h-4 w-4 flex-shrink-0" />
                Add Menu Item
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-3 h-10 mb-2 text-sm hover:bg-purple-50 hover:border-purple-200"
                onClick={handleManageStaff}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                Manage Staff
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-3 h-10 text-orange-600 border-orange-200 hover:bg-orange-50 text-sm"
                onClick={handleViewAlerts}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                View Alerts
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-6">
          {/* Main Navigation - Mobile */}
          <div className="space-y-2 mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
              Navigation
            </h3>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} to={item.href} onClick={onClose}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-12 text-left font-medium",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions - Mobile */}
          <div className="space-y-2 border-t pt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-4">
              Quick Actions
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-3 h-11 mb-2 text-sm hover:bg-green-50 hover:border-green-200"
              onClick={handleAddMenuItem}
            >
              <Package className="h-4 w-4 flex-shrink-0" />
              Add Menu Item
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-3 h-11 mb-2 text-sm hover:bg-purple-50 hover:border-purple-200"
              onClick={handleManageStaff}
            >
              <Users className="h-4 w-4 flex-shrink-0" />
              Manage Staff
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-3 h-11 text-orange-600 border-orange-200 hover:bg-orange-50 text-sm"
              onClick={handleViewAlerts}
            >
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              View Alerts
            </Button>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

AdminSidebar.displayName = "AdminSidebar";
