const CACHE_NAME = "vg-mixer-v22";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./mixer.css",
  "./pin.css",
  "./pin.js",
  "./mixer.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./mixer-assets/steam-hero.jpg",
  "./mixer-assets/flacone-graduato-60ml.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
