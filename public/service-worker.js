self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Only cache weatherstack API requests
  if (url.hostname.includes('weatherstack.com')) {
    const cacheKey = `weather_${url.pathname}_${url.search}`;
    event.respondWith(
      caches.open('weather-data').then(cache =>
        cache.match(cacheKey).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            // Only cache successful responses
            if (networkResponse.ok) {
              cache.put(cacheKey, networkResponse.clone());
            }
            return networkResponse;
          });
        })
      )
    );
  }
});
