/*
 * 👆 Swipe Navigation - Fluid gestures, sweet transitions
 * Navigation choreography by Mr. Sweet
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { ReactNode } from 'react';

interface SwipeNavigationProps {
  children: ReactNode;
  enableSwipeBack?: boolean;
  enableSwipeForward?: boolean;
}

const navigationOrder = ['/', '/search', '/prebook', '/orders', '/profile'];

export const SwipeNavigation = ({ 
  children, 
  enableSwipeBack = true,
  enableSwipeForward = true 
}: SwipeNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = navigationOrder.indexOf(location.pathname);

  const swipeRef = useSwipeGesture({
    onSwipeRight: () => {
      if (!enableSwipeBack || currentIndex <= 0) return;
      navigate(navigationOrder[currentIndex - 1]);
    },
    onSwipeLeft: () => {
      if (!enableSwipeForward || currentIndex >= navigationOrder.length - 1) return;
      navigate(navigationOrder[currentIndex + 1]);
    },
    threshold: 100
  });

  return (
    <div 
      ref={swipeRef} 
      className="w-full h-full touch-pan-y"
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
};