/*
 * 👆 Swipe Navigation - Fluid gestures, sweet transitions
 * Navigation choreography by Mr. Sweet
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeNavigationProps {
  children: ReactNode;
  enableSwipeBack?: boolean;
  enableSwipeForward?: boolean;
  enableTransitions?: boolean;
  customRoutes?: string[];
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

const navigationOrder = ['/', '/search', '/prebook', '/orders', '/profile'];

export const SwipeNavigation = ({ 
  children, 
  enableSwipeBack = true,
  enableSwipeForward = true,
  enableTransitions = true,
  customRoutes,
  onSwipeStart,
  onSwipeEnd
}: SwipeNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const routes = customRoutes || navigationOrder;
  const currentIndex = routes.indexOf(location.pathname);

  // Preload adjacent routes for smooth transitions
  useEffect(() => {
    if (enableTransitions) {
      const preloadRoutes = [
        routes[currentIndex - 1],
        routes[currentIndex + 1]
      ].filter(Boolean);
      
      preloadRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    }
  }, [currentIndex, routes, enableTransitions]);

  const handleNavigate = (direction: 'back' | 'forward') => {
    const targetIndex = direction === 'back' ? currentIndex - 1 : currentIndex + 1;
    const targetRoute = routes[targetIndex];
    
    if (!targetRoute) return;
    
    setIsTransitioning(true);
    onSwipeStart?.();
    
    if (enableTransitions) {
      // Add transition class to body for page-level animations
      document.body.classList.add(`transition-${direction}`);
      
      setTimeout(() => {
        navigate(targetRoute);
        document.body.classList.remove(`transition-${direction}`);
        setIsTransitioning(false);
        onSwipeEnd?.();
      }, 150);
    } else {
      navigate(targetRoute);
      setIsTransitioning(false);
      onSwipeEnd?.();
    }
  };

  const swipeRef = useSwipeGesture({
    onSwipeRight: () => {
      if (!enableSwipeBack || currentIndex <= 0 || isTransitioning) return;
      handleNavigate('back');
    },
    onSwipeLeft: () => {
      if (!enableSwipeForward || currentIndex >= routes.length - 1 || isTransitioning) return;
      handleNavigate('forward');
    },
    threshold: 100
  });

  // Enhanced touch handling for visual feedback
  useEffect(() => {
    const element = swipeRef.current;
    if (!element) return;

    let startX = 0;
    let currentX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      onSwipeStart?.();
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      const progress = Math.abs(diff) / window.innerWidth;
      setSwipeProgress(Math.min(progress * 100, 30)); // Max 30% visual feedback
    };

    const handleTouchEnd = () => {
      setSwipeProgress(0);
      onSwipeEnd?.();
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [swipeRef, onSwipeStart, onSwipeEnd]);

  return (
    <div 
      ref={swipeRef} 
      className={cn(
        "w-full h-full touch-pan-y relative overflow-hidden",
        isTransitioning && "pointer-events-none"
      )}
      style={{ 
        touchAction: 'pan-y',
        transform: swipeProgress > 0 ? `translateX(${swipeProgress > 15 ? '15px' : swipeProgress + 'px'})` : undefined,
        transition: swipeProgress === 0 ? 'transform 0.3s ease-out' : undefined
      }}
    >
      {/* Visual swipe indicator */}
      {swipeProgress > 10 && (
        <div className={cn(
          "absolute inset-y-0 w-1 bg-primary/30 z-50 transition-opacity",
          swipeProgress > 20 ? "opacity-100" : "opacity-50",
          "left-0" // Always show on left for back gesture
        )} />
      )}
      
      {/* Breadcrumb navigation indicator */}
      {routes.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-40 pointer-events-none">
          {routes.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
};