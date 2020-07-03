self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open('static')
            .then(function (cache) {
                console.log('[Service Worker] Precaching App Shell');
                cache.add('./assets/js/app.js')
            })
    )
});
                /*        cache.add('/assets/MemberTable.js')
                        cache.add('/assets/news-edit.js')
                        cache.add('/assets/simple-image.js')
                        //editor_translation.js, formio.full.min.js, jquery.min.js, snackbar.min.js
                        cache.add('/css/custom-bootstrap.css')
                        cache.add('/css/style.css')
                        //snackbar.min.css*/


self.addEventListener('activate', function(event) {
   console.log('[Service Worker] Activating Service Worker..', event);
   return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
            );
})