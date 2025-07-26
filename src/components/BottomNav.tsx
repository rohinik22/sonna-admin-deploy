
import { Home, Search, ShoppingBag, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", id: "home", path: "/" },
  { icon: Search, label: "Search", id: "search", path: "/search" },
  { icon: Calendar, label: "Pre-book", id: "prebook", path: "/prebook" },
  { icon: ShoppingBag, label: "Orders", id: "orders", path: "/orders" },
  { icon: User, label: "Profile", id: "profile", path: "/profile" }
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="nav-primary glass-card border-t border-border/50" style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "nav-item haptic-light transition-all duration-300 hover:scale-110 active:scale-95 font-poppins relative group",
                isActive && "active"
              )}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={cn(
                "flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all duration-300",
                isActive ? "bg-primary/10" : "hover:bg-accent/10"
              )}>
                <Icon className={cn(
                  "w-4 h-4 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.label}
                </span>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
