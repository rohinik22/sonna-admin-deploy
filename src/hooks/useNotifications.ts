import { useEffect } from 'react';
import { toast } from './use-toast';

// Example notification type from backend
interface NotificationPayload {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function useNotifications() {
  useEffect(() => {
    // Replace with your backend WebSocket URL
    const ws = new WebSocket('ws://localhost:8081/ws/notifications');

    ws.onmessage = (event) => {
      try {
        const data: NotificationPayload = JSON.parse(event.data);
        toast({
          title: data.title,
          description: data.description,
          variant: data.type === 'error' ? 'destructive' : 'default',
        });
      } catch (e) {
        // fallback toast
        toast({ title: 'New Notification', description: event.data });
      }
    };

    ws.onerror = () => {
      // Optionally show a toast for connection error
    };

    return () => {
      ws.close();
    };
  }, []);
}
