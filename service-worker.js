const CACHE_NAME = 'simple-pwa-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/indexeddb.js',
    './fav.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(URLS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('push', (event)=>{
    const options = {
        body: event.data ? event.data.text() : 'New Notification',
        icon: './fav.png', // Replace with your icon file path if available
        badge: './fav.png' // Replace with your badge file path if available
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});

self.addEventListener('notificationclick', (event)=>{
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://srinivas3888.github.io/pwa/') // Replace with your desired URL
    );
});



//Intercepting Network Requests...
// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 return response || fetch(event.request);
//             })
//             .catch(() => {
//                 return caches.match('./index.html');
//             })
//     );
// });
