import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HapticButton } from './HapticButton';

interface FloatingActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingActionButton = ({ 
  children, 
  onClick, 
  className,
  position = 'bottom-right',
  size = 'md'
}: FloatingActionButtonProps) => {
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2'
  };

  const sizeClasses = {
    'sm': 'w-12 h-12',
    'md': 'w-14 h-14',
    'lg': 'w-16 h-16'
  };

  return (
    <HapticButton
      onClick={onClick}
      hapticType="medium"
      className={cn(
        'fixed z-50 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95',
        'bg-gradient-to-br from-primary via-primary to-accent text-white',
        'hover:shadow-2xl hover:shadow-primary/25',
        'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      style={{
        bottom: `calc(var(--mobile-nav-height) + 16px)`
      }}
    >
      {children}
    </HapticButton>
  );
};