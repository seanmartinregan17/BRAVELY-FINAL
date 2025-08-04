// Service Worker for cache management and PWA functionality
const CACHE_NAME = 'bravely-v4';
const urlsToCache = [
  '/',
  '/apple-touch-icon-180x180.png',
  '/apple-touch-icon-152x152.png',
  '/apple-touch-icon-144x144.png',
  '/apple-touch-icon-120x120.png',
  '/apple-touch-icon-114x114.png',
  '/apple-touch-icon-76x76.png',
  '/bravely-icon-192.png',
  '/bravely-icon-512.png',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // For icon requests, always try network first to get latest version
  if (event.request.url.includes('apple-touch-icon') || 
      event.request.url.includes('bravely-icon') ||
      event.request.url.includes('favicon')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If network request succeeds, update cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other requests, use cache first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});