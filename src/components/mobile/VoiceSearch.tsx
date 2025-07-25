/*
 * 🎤 Voice Search - Listen to the sweet sound of UX
 * Vocal interactions crafted by Mr. Sweet
 */
import { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import { HapticButton } from './HapticButton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onResult: (transcript: string, confidence?: number) => void;
  onVoiceCommand?: (command: string) => void;
  className?: string;
  language?: string;
  continuous?: boolean;
  enableCommands?: boolean;
}

export const VoiceSearch = ({ 
  onResult, 
  onVoiceCommand,
  className,
  language = 'en-US',
  continuous = false,
  enableCommands = true
}: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Voice commands recognition patterns
  const voiceCommands = {
    'go to menu': () => window.location.href = '/menu',
    'open cart': () => window.location.href = '/cart',
    'show wishlist': () => window.location.href = '/wishlist',
    'go home': () => window.location.href = '/',
    'help': () => toast({ title: "Voice Help", description: "Try: 'go to menu', 'open cart', 'show wishlist'" }),
  };

  const processVoiceCommand = (transcript: string) => {
    const command = transcript.toLowerCase().trim();
    const matchedCommand = Object.keys(voiceCommands).find(cmd => 
      command.includes(cmd) || cmd.includes(command)
    );
    
    if (matchedCommand && enableCommands) {
      voiceCommands[matchedCommand as keyof typeof voiceCommands]();
      onVoiceCommand?.(matchedCommand);
      return true;
    }
    return false;
  };

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

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript('');
      setConfidence(0);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const resultConfidence = result[0].confidence;
        
        if (result.isFinal) {
          finalTranscript += transcript;
          setConfidence(resultConfidence);
          
          // Check for voice commands first
          if (!processVoiceCommand(transcript)) {
            onResult(transcript, resultConfidence);
          }
        } else {
          interim += transcript;
        }
      }
      
      setInterimTranscript(interim);
      
      if (finalTranscript && !continuous) {
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      const errorMessages = {
        'network': 'Network error. Please check your connection.',
        'not-allowed': 'Microphone access denied. Please enable microphone permissions.',
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not found. Please check your audio setup.',
        'service-not-allowed': 'Speech service not allowed. Try refreshing the page.',
      };
      
      toast({
        title: "Voice search error",
        description: errorMessages[event.error as keyof typeof errorMessages] || "Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <HapticButton
        onClick={startListening}
        disabled={isListening}
        hapticType="medium"
        variant="outline"
        rippleEffect={true}
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
            {/* Sound wave indicator */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-bounce" />
          </>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </HapticButton>
      
      {/* Real-time transcript preview */}
      {(isListening && interimTranscript) && (
        <div className="absolute top-full mt-2 left-0 right-0 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg animate-fade-in">
          <p className="text-xs text-muted-foreground">Listening...</p>
          <p className="text-sm font-medium">{interimTranscript}</p>
          {confidence > 0 && (
            <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}