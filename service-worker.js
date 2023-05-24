const cacheName = "cache1"; // Change value to force update

self.addEventListener("install", (event) => {
  // Kick out the old service worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return fetch("./evilcache.html")
        .then(function (response) {
          return cache.put("./cache.html", response);
        })
        .catch(function (error) {
          console.error("Caching error:", error);
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  // Delete any non-current cache
  event.waitUntil(
    caches.keys().then((keys) => {
      Promise.all(
        keys.map((key) => {
          if (![cacheName].includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Offline-first, cache-first strategy
// Kick off two asynchronous requests, one to the cache and one to the network
// If there's a cached version available, use it, but fetch an update for next time.
// Gets data on screen as quickly as possible, then updates once the network has returned the latest data.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(event.request);
    })
  );
});
