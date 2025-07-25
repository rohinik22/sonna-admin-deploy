/*
 * ✨ Haptic Button - Touch with soul
 * Every tap tells a story - Mr. Sweet
 */
import { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HapticButtonProps extends ButtonProps {
  children: ReactNode;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
}

export const HapticButton = forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ children, hapticType = 'light', onClick, className, ...props }, ref) => {
    const triggerHaptic = () => {
      // Check if haptic feedback is available (iOS Safari/PWA)
      if ('vibrate' in navigator) {
        switch (hapticType) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(20);
            break;
          case 'heavy':
            navigator.vibrate(30);
            break;
          case 'selection':
            navigator.vibrate(5);
            break;
        }
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      triggerHaptic();
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "active:scale-95 transition-transform duration-100",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HapticButton.displayName = "HapticButton";