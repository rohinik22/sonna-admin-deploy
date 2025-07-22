
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
    <nav className="nav-primary">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "nav-item haptic-light transition-all duration-200 hover:scale-105 font-poppins",
                isActive && "active"
              )}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-micro font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
