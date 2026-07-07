const CACHE_NAME = "vault-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/animations.css",
  "./css/style.css",
  "./js/data.js",
  "./js/storage.js",
  "./js/ui.js",
  "./js/goals.js",
  "./js/vault.js",
  "./js/navigation.js",
  "./js/pages.js",
  "./js/modal.js",
  "./js/transactions.js",
  "./js/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});