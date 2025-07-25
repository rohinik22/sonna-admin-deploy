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

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
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
  
  // Hidden easter egg for curious developers
  (window as any).__sweet_signature__ = {
    artist: 'Mr. Sweet',
    motto: 'Crafting digital experiences with flavor',
    secret: 'console.log(window.__sweet_signature__.recipe) for a treat',
    recipe: '🍰 Mix React + TypeScript + Love = Sweet Success'
  };
}

createRoot(document.getElementById("root")!).render(<App />);
