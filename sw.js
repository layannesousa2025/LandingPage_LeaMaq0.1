// L&A Maq - Service Worker PWA
const CACHE_NAME = 'lamaq-v1';

// Arquivos para cache offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.css',
  './main.js',
  './manifest.json',
  './Img/Logo.png',
  './Img/icon-192x192.png',
  './Img/icon-512x512.png',
  './Img/Img-Topo.jpg',
  './Img/Img-Caricutura.png',
  './Img/Img-Side.png',
  './Img/Img-Geladeira.png',
  './Img/Img-Freezer.png',
  './Img/Img-Maquina.png',
  './Img/Img-Lava e Seca.png',
  './Img/Img-Adega Vinho.png',
  './Img/Img-Electrolux.png',
  './Img/Img-Continental.png',
  './Img/Img-Brastemp.png',
  './Img/Img-Consul.png',
  './Img/Img-Samsung.png',
  './Img/Img-Lg.png',
  './Img/Img-Philco.png',
  './Img/Img-Panasonic.jpg',
  './Img/Img-Midea.png',
  './Img/Img-Ge.png',
  './Img/Img-Vigink.jpg',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalação: faz o cache dos arquivos principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.log('[SW] Erro ao cachear:', err);
    })
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: estratégia "Cache First, depois rede"
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não são GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Não está no cache: busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Cacheia a resposta nova para uso futuro
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline e não há cache: retorna página principal
        return caches.match('./index.html');
      });
    })
  );
});
