// ServiceWorker Proxy

const CACHE_STATIC ="static-" + Date.now()
const CACHE_DYNAMIC ="dynamic-" + Date.now()
const STATIC_FILES = [
    '/',
    '/login',
    '/register',
    '/assets/app.js',
    '/assets/style.js',
    '/offline.html'
]

// Install server worker
self.addEventListener('install', event => {
    console.log('Service Worker installed')

    event.waitUntil(
        caches.open(CACHE_STATIC).then(cache => {
            return cache
        })
    )
})

// Active service worker
self.addEventListener('active', event => {
    console.log('Service Worker activated')

    event.waitUntil(
        //Remove old caches
        caches.keys().then(cacheList => {
            return Promise.all(cacheList.map(cache => {
                if(cache !== CACHE_STATIC && cache !== CACHE_DYNAMIC) {
                    console.log('Remove old cache named ', cache)
                    return caches.delete(cache)
                }
            }))
        })
    )
})

// Proxy 'fetch' bei jedem Rdequest
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response

            // Cahce ressource dynamically
            return fetch(event.request)
            .then(response => {
                return caches.open(CACHE_DYNAMIC).then(cache => {
                    cache.put(event.request.url, response.clone())  // Stream
                    return response
                })
            })
            .catch(() => {
                return caches.open(CACHE_STATIC)
                    .then(cache => {
                        return cache.match('/offline.html')
                    })
            })
        })
    )
})