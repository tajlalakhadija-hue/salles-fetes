// Service Worker minimal pour activer l'installation PWA
const CACHE = 'taj-lala-khadija-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.jpg', './icon-512.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Réseau d'abord, cache en fallback (données Firebase toujours fraîches)
  if (e.request.url.includes('firebasedatabase') || e.request.url.includes('firebase')) {
    return; // Ne pas intercepter les requêtes Firebase
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
