/*
 * 🤏 Advanced Gestures - Multi-touch magic
 * Next-generation interaction patterns by Mr. Sweet
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface GestureState {
  scale: number;
  rotation: number;
  translateX: number;
  translateY: number;
}

interface AdvancedGesturesProps {
  children: React.ReactNode;
  onPinch?: (scale: number) => void;
  onRotate?: (rotation: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  onThreeFingerTap?: () => void;
  enablePinch?: boolean;
  enableRotation?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
  className?: string;
}

export const AdvancedGestures = ({
  children,
  onPinch,
  onRotate,
  onDoubleTap,
  onLongPress,
  onThreeFingerTap,
  enablePinch = true,
  enableRotation = false,
  enableDoubleTap = true,
  enableLongPress = true,
  className
}: AdvancedGesturesProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [gestureState, setGestureState] = useState<GestureState>({
    scale: 1,
    rotation: 0,
    translateX: 0,
    translateY: 0
  });
  
  const [lastTap, setLastTap] = useState(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const initialDistance = useRef(0);
  const initialAngle = useRef(0);

  // Helper functions
  const getDistance = (touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getAngle = (touch1: Touch, touch2: Touch) => {
    return Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * 180 / Math.PI;
  };

  // Gesture handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1) {
      // Single touch - check for double tap and long press
      const now = Date.now();
      if (enableDoubleTap && now - lastTap < 300) {
        onDoubleTap?.();
      }
      setLastTap(now);
      
      if (enableLongPress) {
        const timer = setTimeout(() => {
          onLongPress?.();
        }, 500);
        setLongPressTimer(timer);
      }
    } else if (touches.length === 2) {
      // Two finger gestures
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      
      if (enablePinch) {
        initialDistance.current = getDistance(touches[0], touches[1]);
      }
      
      if (enableRotation) {
        initialAngle.current = getAngle(touches[0], touches[1]);
      }
    } else if (touches.length === 3) {
      // Three finger tap
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      onThreeFingerTap?.();
    }
  }, [enableDoubleTap, enableLongPress, enablePinch, enableRotation, lastTap, longPressTimer, onDoubleTap, onLongPress, onThreeFingerTap]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = e.touches;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (touches.length === 2) {
      let newScale = gestureState.scale;
      let newRotation = gestureState.rotation;
      
      if (enablePinch) {
        const currentDistance = getDistance(touches[0], touches[1]);
        newScale = currentDistance / initialDistance.current;
        onPinch?.(newScale);
      }
      
      if (enableRotation) {
        const currentAngle = getAngle(touches[0], touches[1]);
        newRotation = currentAngle - initialAngle.current;
        onRotate?.(newRotation);
      }
      
      setGestureState(prev => ({
        ...prev,
        scale: newScale,
        rotation: newRotation
      }));
    }
  }, [enablePinch, enableRotation, gestureState.scale, gestureState.rotation, longPressTimer, onPinch, onRotate]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Reset gesture state
    setGestureState({
      scale: 1,
      rotation: 0,
      translateX: 0,
      translateY: 0
    });
  }, [longPressTimer]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={elementRef}
      className={cn("touch-none select-none", className)}
      style={{
        transform: `scale(${gestureState.scale}) rotate(${gestureState.rotation}deg) translate(${gestureState.translateX}px, ${gestureState.translateY}px)`,
        transition: gestureState.scale === 1 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {children}
    </div>
  );
};