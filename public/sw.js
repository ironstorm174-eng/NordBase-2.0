// Self-unregistering Service Worker to immediately remove any stale offline caches
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

// Pass all requests straight to the network
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
