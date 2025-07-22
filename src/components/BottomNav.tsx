
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
    <nav className="mobile-nav">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-smooth touch-target",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
