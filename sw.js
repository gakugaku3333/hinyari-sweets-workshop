const CACHE_NAME = 'fireworks-workshop-v3';
const APP_FILES = [
  './', './index.html', './manifest.webmanifest',
  './assets/fireworks-festival-bg.png', './assets/apple-touch-icon.png',
  './assets/icon-192.png', './assets/icon-512.png',
  './assets/card-01.png', './assets/card-02.png', './assets/card-03.png',
  './assets/card-04.png', './assets/card-05.png', './assets/card-06.png',
  './assets/card-07.png', './assets/card-08.png', './assets/card-09.png', './assets/card-10.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok && event.request.url.startsWith(self.location.origin)) {
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
