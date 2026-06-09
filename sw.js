const CACHE_NAME = 'portfolio-cache-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/resume.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only intercept HTTP/HTTPS requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // The Cache API only supports GET requests. 
  // Attempting to cache POST requests will throw a TypeError.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              }).catch(err => {
                // Silently handle any quota or caching errors
              });
            return response;
          }
        );
      })
  );
});
