import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LongPressMenuProps {
  children: ReactNode;
  menuItems: Array<{
    label: string;
    icon: ReactNode;
    onClick: () => void;
    destructive?: boolean;
  }>;
  className?: string;
  pressDelay?: number;
}

export const LongPressMenu = ({ 
  children, 
  menuItems, 
  className,
  pressDelay = 500 
}: LongPressMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const elementRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = elementRef.current?.getBoundingClientRect();
    
    if (rect) {
      setMenuPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }

    timeoutRef.current = setTimeout(() => {
      setIsMenuOpen(true);
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, pressDelay);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchMove = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    setIsMenuOpen(false);
  };

  const handleClickOutside = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <div 
      ref={elementRef}
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {children}
      
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
          
          {/* Menu */}
          <div
            className="absolute z-50 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl py-2 min-w-40"
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
              transform: 'translate(-50%, -100%) translateY(-8px)'
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.onClick)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent/50 transition-colors",
                  item.destructive && "text-destructive hover:text-destructive"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};