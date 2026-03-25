const STATIC_CACHE = "esf-static-v1";
const RUNTIME_CACHE = "esf-runtime-v1";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/pwa-192.png", "/pwa-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(STATIC_CACHE);
        return cache.match(OFFLINE_URL);
      }),
    );
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  const shouldCacheAsset =
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image");

  if (!shouldCacheAsset) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }

          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkResponse;
    }),
  );
});
