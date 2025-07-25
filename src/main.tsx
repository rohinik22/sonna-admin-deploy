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
  console.log('%c🍰 Mr. Sweet %c- Crafting digital experiences with flavor', 
    'color: #ff6b6b; font-size: 16px; font-weight: bold;',
    'color: #4ecdc4; font-size: 12px;'
  );
}

createRoot(document.getElementById("root")!).render(<App />);
