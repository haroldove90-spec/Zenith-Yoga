const CACHE_NAME = 'zenith-yoga-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.svg',
];

// Instalar el Service Worker y cachear recursos iniciales
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpiar caches antiguas y tomar control
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché para una SPA
self.addEventListener('fetch', event => {
  // Para peticiones de navegación (p.ej. cargar la página), intenta ir a la red primero.
  // Si falla (sin conexión o error 404 en sub-rutas), sirve el index.html de la caché.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Para otros recursos (JS, CSS, imágenes), usa la estrategia "cache first".
  // Intenta servir desde la caché. Si no está, va a la red, lo sirve y lo añade a la caché.
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          if (fetchResponse.status === 200) {
             cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    })
  );
});