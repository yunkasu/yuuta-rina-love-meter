const CACHE_NAME = 'love-meter-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './click.mp3',
    './final.mp3',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            }
        )
    );
});