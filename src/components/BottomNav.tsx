import { Home, Search, ShoppingBag, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", id: "home", active: true },
  { icon: Search, label: "Search", id: "search" },
  { icon: Calendar, label: "Pre-book", id: "prebook" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: User, label: "Profile", id: "profile" }
];

export const BottomNav = () => {
  return (
    <nav className="mobile-nav">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-smooth touch-target",
                item.active 
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