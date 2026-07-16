/* ==========================================
   VAULT
   SERVICE WORKER
========================================== */

const CACHE_VERSION = "3.2.0";
const CACHE_NAME = `vault-${CACHE_VERSION}`;

const APP_FILES = [
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
    "./js/garage.js",
    "./js/app.js",

    "./img/icons/icon-192.png",
    "./img/icons/icon-512.png"
];

/* ---------- Install ---------- */

self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

/* ---------- Activate ---------- */

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_NAME)
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

/* ---------- Fetch ---------- */

self.addEventListener("fetch", event => {
    const request = event.request;

    if(request.method !== "GET"){
        return;
    }

    const requestUrl = new URL(request.url);

    if(requestUrl.origin !== self.location.origin){
        return;
    }

    /*
       HTML/navigation requests:
       Try the network first so Vault receives the newest HTML.
       Fall back to the cached app when offline.
    */

    if(request.mode === "navigate"){
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseCopy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put("./index.html", responseCopy);
                    });

                    return response;
                })
                .catch(() => {
                    return caches.match("./index.html");
                })
        );

        return;
    }

    /*
       CSS, JavaScript, images and other local assets:
       Try the network first, then fall back to cache.
    */

    event.respondWith(
        fetch(request)
            .then(response => {
                if(!response || response.status !== 200){
                    return response;
                }

                const responseCopy = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseCopy);
                });

                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});