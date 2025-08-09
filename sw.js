const CACHE_NAME = 'fitness-app-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/styles.css',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Instalar el Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activar el Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker activando...');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Devolver desde cache si existe
                if (response) {
                    return response;
                }
                
                // Si no está en cache, hacer fetch
                return fetch(event.request).then(function(response) {
                    // Verificar si es una respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clonar la respuesta
                    var responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(function() {
                // Si falla, devolver página offline básica
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Manejar notificaciones push (para futuras mejoras)
self.addEventListener('push', function(event) {
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Plan Fitness', options)
    );
});