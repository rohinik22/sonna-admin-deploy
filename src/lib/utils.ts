import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ┌─────────────────────────────────────┐
 * │  Advanced Utility Arsenal - v2.0    │ 
 * │    Enhanced by Mr. Sweet's vision   │
 * └─────────────────────────────────────┘
 */

// Core styling utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Performance optimized debounce
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Throttle for scroll/resize events
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Device detection utilities
export const device = {
  isMobile: () => window.innerWidth < 768,
  isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: () => window.innerWidth >= 1024,
  hasTouch: () => 'ontouchstart' in window,
  supportsHover: () => window.matchMedia('(hover: hover)').matches,
  isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  isAndroid: () => /Android/.test(navigator.userAgent),
};

// Color manipulation utilities
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Formatting utilities
export const format = {
  currency: (amount: number, currency = '₹') => 
    `${currency}${amount.toLocaleString('en-IN')}`,
  
  phone: (phone: string) => 
    phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'),
  
  date: (date: Date | string, options?: Intl.DateTimeFormatOptions) => 
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    }),
  
  time: (date: Date | string) => 
    new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }),

  relativeTime: (date: Date | string) => {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  }
};

// Advanced validation helpers
export const validate = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone: string) => /^[+]?[\d\s\-\(\)]{10,}$/.test(phone),
  strongPassword: (password: string) => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password),
  indianPhone: (phone: string) => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '')),
  pincode: (pincode: string) => /^[1-9][0-9]{5}$/.test(pincode),
};

// Accessibility helpers
export const a11y = {
  announceToScreenReader: (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },
  
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
    
    firstElement?.focus();
  }
};

// Performance utilities
export const perf = {
  measureComponent: (name: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      console.log(`🎯 ${name}: ${(end - start).toFixed(2)}ms`);
    };
  },
  
  preloadImage: (src: string): Promise<void> => 
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    }),

  isInViewport: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 &&
           rect.bottom <= window.innerHeight &&
           rect.right <= window.innerWidth;
  }
};
