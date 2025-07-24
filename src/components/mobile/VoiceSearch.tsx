import { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import { HapticButton } from './HapticButton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export const VoiceSearch = ({ onResult, className }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "Voice search not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice search error",
        description: "Please try again or check your microphone permissions.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <HapticButton
      onClick={startListening}
      disabled={isListening}
      hapticType="medium"
      variant="outline"
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isListening && "animate-pulse bg-primary/10 border-primary",
        className
      )}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 text-primary" />
          <div className="absolute inset-0 bg-primary/20 animate-ping rounded-md" />
        </>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </HapticButton>
  );
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}