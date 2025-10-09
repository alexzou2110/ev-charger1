const CACHE_NAME = "ev-charger-cache-v2";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png" // αν έχεις μεγαλύτερο icon, αλλιώς αφαίρεσέ το
];

// Εγκατάσταση του Service Worker (cache των αρχείων)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ενεργοποίηση και καθαρισμός παλιών cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Απόκριση αιτήσεων: πρώτα από το cache, μετά από το δίκτυο
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(() => {
          // Προαιρετικά: fallback για offline error
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        })
      );
    })
  );
});
