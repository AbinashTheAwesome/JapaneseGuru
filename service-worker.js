const CACHE_NAME = 'japanese-app-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/css/dark.css',
    '/assets/js/app.js',
    '/assets/js/storage.js',
    '/assets/js/quiz.js',
    '/assets/js/canvas.js',
    '/assets/js/flashcards.js',
    '/assets/data/hiragana.json',
    '/assets/data/katakana.json',
    '/assets/data/vocabulary.json',
    '/assets/data/kanji.json',
    '/quiz/quiz.html',
    '/vocabulary/flashcards.html',
    '/practice/writing.html',
    '/dashboard/stats.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});