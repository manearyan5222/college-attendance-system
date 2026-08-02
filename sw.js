const CACHE_NAME = "apex-attendance-v1";
const ASSETS = [
  "index.html",
  "app.js",
  "manifest.json",
  "app_icon.jpg"
];

// Install Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching core assets...");
      return cache.addAll(ASSETS).catch(err => console.log("Failed to cache: ", err));
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch events
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Offline fallback
        if (e.request.mode === "navigate") {
          return caches.match("index.html");
        }
      });
    })
  );
});
