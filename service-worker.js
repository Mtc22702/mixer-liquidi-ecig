const CACHE_NAME = "vg-mixer-v6";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./mixer.html",
  "./mixer.css",
  "./mixer.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./mixer-assets/flacone-graduato-60ml.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
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
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
