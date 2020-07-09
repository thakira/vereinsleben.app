// A service worker is a kind of proxy between client (browser) and server (website/internet)

const URL = 'http://localhost:3000'
//const URL = 'https://https://lyra.et-inf.fho-emden.de:15117'

const CACHE_STATIC_NAME = 'static-v5434' // Static cache versioning
const CACHE_DYNAMIC_NAME = 'dynamic-v3454' // Dynamic cache versioning
const STATIC_FILES = [
    '/',
    './offline.html',
    './assets/js/app.js',
    './assets/js/memberTable.js',
    './assets/js/snackbar.min.js',
    './assets/css/custom-bootstrap.css',
    './assets/css/style.css',
    './views/login.ejs',
    './views/register.ejs',
    './views/dashboard.ejs',
    './views/aktuelles-site.ejs',
    './views/arbeitsstunden-site.ejs',
    './views/mitglieder.ejs',
    './views/profil.ejs',
    './views/partials/footer/footer.ejs',
    './views/partials/header/header.ejs',
    './views/partials/header/header_with_navigation.ejs',
    './views/partials/nav/mainnav.ejs',
    './views/partials/nav/sidebar.ejs',
    'https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css',
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js',
    'https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js',
    'https://cdn.rawgit.com/FezVrasta/snackbarjs/1.1.0/dist/snackbar.min.js'
]

// function trimCache(cacheName, maxItems) {
//     caches.open(cacheName)
//         .then(function(cache) {
//             return cache.keys()
//                 //ggf. durch die keys gehen und wenn
//                 .then(function(keys){
//                     if (keys.length > maxItems) {
//                         cache.delete(keys[0])
//                             .then(trimCache(cacheName, maxItems));
//                     }
//         });
//         })
// }

// Install service worker
self.addEventListener('install', event => {
    console.log('Service Worker installed', event)

    // Create cache and cache static files
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(cache => {
            return cache.addAll(STATIC_FILES)
        })
    )
})


// Activate service worker, gets fired after install event
self.addEventListener('activate', event => {
    console.log('Service Worker activated', event)

    // Remove old caches
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    console.log('Service Worker removed old cache.', key)
                    return caches.delete(key)
                }
            }))
        })
    )
    return self.clients.claim()
})


    self.addEventListener ('fetch',  function (event) {
        event.respondWith(
            fetch(event.request)
                .then(function(res) {
                    return caches.open(CACHE_DYNAMIC_NAME)
                        .then(function(cache) {
                            cache.put(event.request.url, res.clone());
                            return res;
                        })
                })
                .catch(error => {
                    let url = event.request.url
                    if(!(navigator.onLine)) {
                        let offline = true
                    }
                    return caches.match(event.request)
                        .then(function(res) {
                            if(res === undefined) {
                                return caches.open(CACHE_STATIC_NAME)
                                    .then(function(cache) {
                                        return cache.match('/offline.html');
                                    });
                            }
                            return res;
                        })
                })
);
});


