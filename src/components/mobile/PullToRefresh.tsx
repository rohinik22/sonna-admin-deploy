import { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export const PullToRefresh = ({ children, onRefresh, className }: PullToRefreshProps) => {
  const { elementRef, isRefreshing, pullDistance, shouldShowRefreshIndicator } = usePullToRefresh({
    onRefresh,
    threshold: 80
  });

  return (
    <div
      ref={elementRef}
      className={cn("relative overflow-auto", className)}
      style={{ 
        transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance, 100)}px)` : undefined,
        transition: pullDistance === 0 && !isRefreshing ? 'transform 0.3s ease-out' : undefined
      }}
    >
      {/* Pull to refresh indicator */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 flex items-center justify-center h-16 bg-background/80 backdrop-blur-sm transition-opacity duration-200 z-10",
          shouldShowRefreshIndicator || isRefreshing ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translateY(-${64 - Math.min(pullDistance, 64)}px)`
        }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          <span className="text-sm font-medium">
            {isRefreshing ? "Refreshing..." : shouldShowRefreshIndicator ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      </div>
      
      {children}
    </div>
  );
};