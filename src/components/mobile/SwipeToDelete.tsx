import { useState, useRef, useEffect, ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
  threshold?: number;
  className?: string;
}

export const SwipeToDelete = ({ 
  children, 
  onDelete, 
  threshold = 100,
  className 
}: SwipeToDeleteProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const startXRef = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startXRef.current;
      
      // Only allow swiping left (negative deltaX)
      if (deltaX < 0) {
        const newTranslateX = Math.max(deltaX, -threshold * 1.5);
        setTranslateX(newTranslateX);
        setCanDelete(Math.abs(newTranslateX) >= threshold);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      
      if (canDelete) {
        // Trigger delete animation
        setTranslateX(-400);
        setTimeout(() => {
          onDelete();
        }, 200);
      } else {
        // Spring back
        setTranslateX(0);
        setCanDelete(false);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, canDelete, threshold, onDelete]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Delete background */}
      <div 
        className={cn(
          "absolute inset-0 bg-destructive flex items-center justify-end px-6 transition-opacity duration-200",
          canDelete ? "opacity-100" : "opacity-60"
        )}
      >
        <Trash2 className="w-6 h-6 text-destructive-foreground" />
      </div>
      
      {/* Swipeable content */}
      <div
        ref={elementRef}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        className="relative z-10 bg-background"
      >
        {children}
      </div>
    </div>
  );
};