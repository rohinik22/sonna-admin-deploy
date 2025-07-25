/*
 * ✨ Haptic Button - Touch with soul
 * Every tap tells a story - Mr. Sweet
 */
import React, { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HapticButtonProps extends ButtonProps {
  children: ReactNode;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';
  enableSound?: boolean;
  loadingState?: boolean;
  rippleEffect?: boolean;
}

export const HapticButton = forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ 
    children, 
    hapticType = 'light', 
    enableSound = false,
    loadingState = false,
    rippleEffect = true,
    onClick, 
    className, 
    disabled,
    ...props 
  }, ref) => {
    
    // Advanced haptic patterns with device adaptation
    const triggerHaptic = () => {
      if ('vibrate' in navigator && !disabled) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30],
          selection: [5],
          success: [10, 30, 10],
          warning: [50, 30, 50],
          error: [100, 50, 100]
        };
        navigator.vibrate(patterns[hapticType]);
      }
      
      // iOS Haptic API fallback
      if ((window as any).DeviceMotionEvent?.requestPermission) {
        try {
          const taptic = (window as any).TapticEngine;
          if (taptic) {
            switch (hapticType) {
              case 'light': taptic.impact({style: 'light'}); break;
              case 'medium': taptic.impact({style: 'medium'}); break;
              case 'heavy': taptic.impact({style: 'heavy'}); break;
              case 'selection': taptic.selection(); break;
              case 'success': taptic.notification({type: 'success'}); break;
              case 'warning': taptic.notification({type: 'warning'}); break;
              case 'error': taptic.notification({type: 'error'}); break;
            }
          }
        } catch (e) {
          console.debug('Haptic feedback not available');
        }
      }
    };

    // Optional sound effects
    const playSound = () => {
      if (enableSound && !disabled) {
        const audio = new Audio();
        const soundMap = {
          light: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...',
          selection: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAAB...'
        };
        if (soundMap[hapticType as keyof typeof soundMap]) {
          audio.src = soundMap[hapticType as keyof typeof soundMap];
          audio.volume = 0.1;
          audio.play().catch(() => {}); // Ignore errors
        }
      }
    };

    // Ripple effect state
    const [ripples, setRipples] = React.useState<Array<{id: number, x: number, y: number}>>([]);

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!rippleEffect) return;
      
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loadingState) return;
      
      createRipple(e);
      triggerHaptic();
      playSound();
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || loadingState}
        className={cn(
          "relative overflow-hidden transition-all duration-200 ease-out",
          "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          loadingState && "pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Loading overlay */}
        {loadingState && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
        
        {/* Button content */}
        <span className={cn("relative z-10", loadingState && "opacity-0")}>
          {children}
        </span>
      </Button>
    );
  }
);

HapticButton.displayName = "HapticButton";