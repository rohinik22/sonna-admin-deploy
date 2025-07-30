import React from 'react';
import { Bell, Search, User, Menu, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfile = () => navigate('/admin/profile');
  const handleSettings = () => navigate('/admin/settings');
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    sessionStorage.clear();
    navigate('/admin/login');
  };
  const handleViewSite = () => {
    const newWindow = window.open('/', '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  const navItems = ["dashboard", "orders", "menu", "analytics"];
  const notifications = [
    {color:'red',title:'Low Stock Alert',desc:'Pizza dough running low',time:'2 min ago'},
    {color:'blue',title:'New Order Received',desc:'Order #1248 - ₹3,499',time:'5 min ago'},
    {color:'green',title:'Order Delivered',desc:'Order #1245 completed',time:'10 min ago'}
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight">Sonna Sweet Bites</h1>
              <p className="text-xs text-muted-foreground">Hubli Branch - Admin Portal</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-bold text-lg">Sonna</h1>
            </div>
          </div>
        </div>
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item}
              to={`/admin/${item}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                location.pathname === `/admin/${item}` ? "text-primary bg-primary/10" : "text-foreground"
              )}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleViewSite} className="hidden md:flex text-xs">View Site</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[90vw] bg-background border border-border shadow-lg">
              <DropdownMenuLabel className="bg-background">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-1 p-2 max-h-80 overflow-y-auto bg-background">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer bg-background">
                    <div className={`w-2 h-2 bg-${n.color}-500 rounded-full mt-2 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg" align="end" forceMount>
              <DropdownMenuLabel className="font-normal bg-background">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@sonna.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="bg-background hover:bg-muted" onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="bg-background hover:bg-muted" onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 bg-background hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

(AdminHeader as React.FC).displayName = "AdminHeader";
