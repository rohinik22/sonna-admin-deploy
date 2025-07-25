// Advanced Sweet Service Worker v2.0 - Performance & Offline Excellence by Mr. Sweet
const CACHE_NAME = 'sonna-sweet-v2.0';
const DYNAMIC_CACHE = 'sonna-dynamic-v2.0';
const IMAGE_CACHE = 'sonna-images-v2.0';

// Strategic caching - Critical path first
const CRITICAL_ASSETS = [
  '/',
  '/menu',
  '/cart',
  '/manifest.json'
];

const SECONDARY_ASSETS = [
  '/wishlist',
  '/search',
  '/prebook',
  '/orders',
  '/profile'
];

// Cache strategy configuration
const CACHE_STRATEGIES = {
  pages: 'stale-while-revalidate',
  api: 'network-first',
  images: 'cache-first',
  static: 'cache-first'
};

// Enhanced install event with progressive caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical assets first
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(CRITICAL_ASSETS)
      ),
      // Cache secondary assets in background
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(SECONDARY_ASSETS).catch(() => {
          console.log('🍯 Secondary assets cached partially');
        })
      )
    ]).then(() => {
      console.log('🍰 Service Worker installed with sweet precision');
      self.skipWaiting();
    })
  );
});

// Intelligent fetch handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network first with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Images - Cache first with network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then(cache => cache.match(request))
        .then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
    );
    return;
  }

  // Pages - Stale while revalidate
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          const fetchPromise = fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone());
              });
            }
            return response;
          });
          return cached || fetchPromise;
        })
    );
    return;
  }

  // Default: Cache first
  event.respondWith(
    caches.match(request)
      .then(response => response || fetch(request))
  );
});

// Enhanced activate event with intelligent cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches intelligently
      caches.keys().then(cacheNames => {
        const validCaches = [CACHE_NAME, DYNAMIC_CACHE, IMAGE_CACHE];
        return Promise.all(
          cacheNames
            .filter(cacheName => !validCaches.includes(cacheName))
            .map(cacheName => {
              console.log('🗑️ Removing old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('🔄 Service Worker activated and ready');
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(
      // Sync cart data when back online
      self.registration.sync.register('cart-sync')
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'sonna-notification',
      data: data.url
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});