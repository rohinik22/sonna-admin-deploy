/*
 * ⌨️ Smart Keyboard - Context-aware input optimization
 * Intelligent input enhancement by Mr. Sweet
 */
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, X, Clock, MapPin, Utensils } from 'lucide-react';

interface SmartKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  recentSearches?: string[];
  autoCorrect?: boolean;
  contextType?: 'food' | 'location' | 'general';
  className?: string;
}

export const SmartKeyboard = ({
  value,
  onChange,
  placeholder = "Type here...",
  suggestions = [],
  recentSearches = [],
  autoCorrect = true,
  contextType = 'general',
  className
}: SmartKeyboardProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart suggestions based on context
  const contextSuggestions = {
    food: ['pizza', 'burger', 'pasta', 'cake', 'coffee', 'sandwich', 'salad', 'soup'],
    location: ['nearby', 'home', 'office', 'restaurant', 'delivery'],
    general: ['search', 'menu', 'order', 'favorites']
  };

  // Detect virtual keyboard appearance
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      const heightDiff = windowHeight - viewportHeight;
      
      setKeyboardHeight(heightDiff > 150 ? heightDiff : 0);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      setFilteredSuggestions([...recentSearches.slice(0, 3), ...contextSuggestions[contextType].slice(0, 3)]);
    } else {
      const allSuggestions = [...suggestions, ...contextSuggestions[contextType]];
      const filtered = allSuggestions
        .filter(item => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 6);
      setFilteredSuggestions(filtered);
    }
    setSelectedIndex(-1);
  }, [value, suggestions, recentSearches, contextType]);

  // Show/hide suggestions based on focus
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow suggestion clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Auto-correct functionality
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (autoCorrect) {
      // Simple auto-correct for common food terms
      const corrections: Record<string, string> = {
        'piza': 'pizza',
        'burgr': 'burger',
        'coffie': 'coffee',
        'sandwitch': 'sandwich'
      };
      
      const words = newValue.split(' ');
      const correctedWords = words.map(word => 
        corrections[word.toLowerCase()] || word
      );
      newValue = correctedWords.join(' ');
    }
    
    onChange(newValue);
  };

  const getSuggestionIcon = (suggestion: string) => {
    if (recentSearches.includes(suggestion)) return <Clock className="w-3 h-3" />;
    if (contextType === 'food') return <Utensils className="w-3 h-3" />;
    if (contextType === 'location') return <MapPin className="w-3 h-3" />;
    return <Search className="w-3 h-3" />;
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-10"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 p-0"
            onClick={() => onChange('')}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Smart suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto",
            keyboardHeight > 0 && "mb-2"
          )}
          style={{
            marginBottom: keyboardHeight > 0 ? `${keyboardHeight + 16}px` : undefined
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                index === selectedIndex && "bg-muted",
                index === 0 && "rounded-t-lg",
                index === filteredSuggestions.length - 1 && "rounded-b-lg"
              )}
            >
              <span className="text-muted-foreground">
                {getSuggestionIcon(suggestion)}
              </span>
              <span className="flex-1">{suggestion}</span>
              {recentSearches.includes(suggestion) && (
                <span className="text-xs text-muted-foreground">Recent</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Quick actions for mobile */}
      {showSuggestions && contextType === 'food' && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background border border-border rounded-lg shadow-lg z-40">
          <div className="flex gap-2 flex-wrap">
            {['🍕 Pizza', '🍔 Burgers', '🍰 Cakes', '☕ Coffee'].map((quick) => (
              <Button
                key={quick}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(quick.split(' ')[1])}
                className="text-xs"
              >
                {quick}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};