const CACHE_NAME = 'portfolio-cache-v8';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/resume.json',
  '/style.css',
  '/dist/bundle.js',
  '/dist/tailwind.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.warn('[SW] Cache install failed:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only intercept HTTP/HTTPS GET requests
  if (!event.request.url.startsWith('http')) return;
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip API requests — always fetch fresh from network
  if (url.pathname.startsWith('/api/')) return;

  // IMPORTANT: Skip ALL cross-origin requests (CDN fonts, images, external assets).
  // The Service Worker runs under the page's CSP, so fetching cross-origin URLs
  // via the SW Fetch API violates connect-src and causes ERR_FAILED errors.
  // Let the browser handle external resources natively.
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML pages (always get fresh content)
  if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for same-origin static assets (CSS, JS, images)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        }).catch(() => {});
        return response;
      }).catch(() => caches.match(event.request));
    })
  );
});
