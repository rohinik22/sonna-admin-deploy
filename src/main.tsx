import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/*
 * ╔═══════════════════════════════════════╗
 * ║           Crafted with care           ║
 * ║              - Mr. Sweet              ║
 * ╚═══════════════════════════════════════╝
 */

// Enhanced PWA Management - Performance & Features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('🍰 SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              if (confirm('New version available! Refresh for latest features?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
      // PWA Installation prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        (window as any).__pwaInstallPrompt__ = e;
      });
      
      // Network status tracking
      const updateOnlineStatus = () => {
        document.body.setAttribute('data-connection', navigator.onLine ? 'online' : 'offline');
      };
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      updateOnlineStatus();
      
    } catch (error) {
      console.error('🚫 SW registration failed: ', error);
    }
  });
}

// Sweet console signature for those who peek behind the curtain
if (process.env.NODE_ENV === 'development') {
  console.clear();
  console.log('%c╔══════════════════════════════════════════════════════════════╗', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║                                                              ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ███╗   ███╗██████╗     ███████╗██╗    ██╗███████╗███████╗ ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ████╗ ████║██╔══██╗    ██╔════╝██║    ██║██╔════╝██╔════╝ ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ██╔████╔██║██████╔╝    ███████╗██║ █╗ ██║█████╗  █████╗   ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ██║╚██╔╝██║██╔══██╗    ╚════██║██║███╗██║██╔══╝  ██╔══╝   ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ██║ ╚═╝ ██║██║  ██║    ███████║╚███╔███╔╝███████╗███████╗ ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║    ╚═╝     ╚═╝╚═╝  ╚═╝    ╚══════╝ ╚══╝╚══╝ ╚══════╝╚══════╝ ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║                                                              ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c║           🎨 Crafting Digital Experiences with Flavor 🍰     ║', 'color: #4ecdc4; font-weight: bold;');
  console.log('%c║                                                              ║', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c╚══════════════════════════════════════════════════════════════╝', 'color: #ff6b6b; font-weight: bold;');
  console.log('%c                                                                ', 'color: #4ecdc4;');
  console.log('%c          "Every line of code is a brushstroke of art"          ', 'color: #4ecdc4; font-style: italic;');
  console.log('%c                                                                ', 'color: #4ecdc4;');
  
  // Enhanced developer experience with performance monitoring
  (window as any).__sweet_signature__ = {
    artist: 'Mr. Sweet',
    motto: 'Crafting digital experiences with flavor',
    secret: 'console.log(window.__sweet_signature__.recipe) for a treat',
    recipe: '🍰 Mix React + TypeScript + Love = Sweet Success',
    performance: {
      measureRender: (componentName: string) => {
        performance.mark(`${componentName}-start`);
        return () => {
          performance.mark(`${componentName}-end`);
          performance.measure(`${componentName}-render`, `${componentName}-start`, `${componentName}-end`);
        };
      },
      vitals: () => console.table(performance.getEntriesByType('navigation'))
    },
    version: '2.0.0',
    buildTime: new Date().toISOString()
  };
}

createRoot(document.getElementById("root")!).render(<App />);
