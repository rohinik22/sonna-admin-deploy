import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { HapticButton } from './HapticButton';
import { cn } from '@/lib/utils';

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showWheel?: boolean;
  className?: string;
}

export const QuantityPicker = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 99, 
  showWheel = false,
  className 
}: QuantityPickerProps) => {
  const [wheelValue, setWheelValue] = useState(value);

  useEffect(() => {
    setWheelValue(value);
  }, [value]);

  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleWheelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    setWheelValue(newValue);
    onChange(newValue);
  };

  if (showWheel) {
    return (
      <div className={cn("relative", className)}>
        <select
          value={wheelValue}
          onChange={handleWheelChange}
          className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(num => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <HapticButton
        onClick={decrement}
        disabled={value <= min}
        hapticType="light"
        size="sm"
        variant="outline"
        className="w-8 h-8 p-0 rounded-full disabled:opacity-50"
      >
        <Minus className="w-3 h-3" />
      </HapticButton>
      
      <div className="w-12 h-8 flex items-center justify-center">
        <span className="font-semibold text-sm">{value}</span>
      </div>
      
      <HapticButton
        onClick={increment}
        disabled={value >= max}
        hapticType="light"
        size="sm"
        variant="outline"
        className="w-8 h-8 p-0 rounded-full disabled:opacity-50"
      >
        <Plus className="w-3 h-3" />
      </HapticButton>
    </div>
  );
};