// A service worker is a kind of proxy between client (browser) and server (website/internet)

importScripts('./assets/js/idb.js');
const URL = 'http://localhost:3000'
//const URL = 'https://https://lyra.et-inf.fho-emden.de:15117'

const CACHE_STATIC_NAME = 'static-v3' // Static cache versioning
const CACHE_DYNAMIC_NAME = 'dynamic-v3' // Dynamic cache versioning
const STATIC_FILES = [
    // LOGO???? Auf Login/Register und in der Navbar
    '/',
    './offline.html',
    './assets/js/app.js',
    './assets/js/idb.js',
    './assets/js/memberTable.js',
    './assets/js/snackbar.min.js',
    './assets/css/custom-bootstrap.css',
    './assets/css/style.css',
    './views/login.ejs',
    './views/register.ejs',
    //'./views/dashboard.ejs',
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

/*function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
        .then(function(cache) {
            return cache.keys()
                //ggf. durch die keys gehen und wenn
                .then(function(keys){
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                    }
        });
        })
}*/

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

/*const dbPromise = idb.open('vereinsleben', 1, (db) => {
    if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', {keyPath: '_id'})
        /!*users.createIndex('firstname', 'firstname', {unique: false})
        users.createIndex('lastname', 'lastname', {unique: false})
        users.createIndex('mobile', 'mobile', {unique: false})
        users.createIndex('phone', 'phone', {unique: false})
        users.createIndex('email', 'email', {unique: false})
        users.createIndex('email', 'email', {unique: false})
        users.createIndex('birthday', 'birthday', {unique: false})
        users.createIndex('workhours', 'workhours', {unique: false})
        users.createIndex('worked', 'worked', {unique: false})
        users.createIndex('memberNumber', 'memberNumber', {unique: false})
        users.createIndex('role', 'role', {unique: false})
        users.createIndex('createdAt', 'createdAt', {unique: false})*!/
    }
    if (!db.objectStoreNames.contains('news')) {
        db.createObjectStore('news', {keyPath: '_id'});
/!*        news.createIndex('newsTitle', 'newsTitle', {unique: false})
        news.createIndex('newsText', 'newsText', {unique: false})
        news.createIndex('newsImg', 'newsText', {unique: false})
        news.createIndex('newsDoc', 'newsText', {unique: false})
        news.createIndex('newsReleased', 'newsText', {unique: false})
        news.createIndex('newsType', 'newsText', {unique: false})
        news.createIndex('newsAuthor', 'newsText', {unique: false})
        news.createIndex('createdAt', 'createdAt', {unique: false})*!/
    }
    if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', {keyPath: '_id'});
    }
});*/

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

    // When a service worker is initially registered, pages won't use it until they next load.
    // The claim() method causes those pages to be controlled immediately.
    return self.clients.claim()
})


/*function isOffline() {
    fetch('/check')
        .then(function (res, next) {
            return next;
        }).catch(function (err) {
            return true
            console.log("OFFLINE")

    })
}*/
/*function isOffline() {
    return new Promise((resolve, reject) => {
        fetch("/check")
            .then((res, next) => {
                resolve(next)
            }).catch((error) => {
            console.log(error);
            resolve(true)
        })
    })
}*/

/*function isOffline() {
    return new Promise((resolve, reject) => {
        fetch("/check")
            .then((res, next) => {
                return next
            }).catch((error) => {
            console.log(error);
            resolve(false)
            //resolve(false)
        })
    })
}*/


    self.addEventListener ('fetch',  function (event) {
         console.log("online?" , navigator.onLine)
        //if (/check/.test(event.request.url)) { return };
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
 /*               .catch(function(err) {
                    if(!(navigator.onLine)) {
                        let offline = true
                    }
                    if (caches.match(event.request)) {

                        console.log("Match im Cache gefunden: ", event.request.url, "Online?: ", navigator.onLine)
/!*                        if (!(navigator.onLine) && (/mitglieder/.test(event.request.url))) {
                            console.log("offline und Mitglieder aufgerufen")
                            caches.open(CACHE_STATIC_NAME).then(cache => {
                                return caches.match('/impossible.html')
                            })
                        } else {
                            console.log("aus dem Cache laden")*!/
                            //return caches.match(event.request)
                            return caches.match(event.request)
                        //}
                    } else {
                        console.log("Kein Match im Cache gefunden - offline page")
                        //caches.open(CACHE_STATIC_NAME).then(cache => {
                            // Only return offline page, if a HTML ressource was requested
                            //if (event.request.headers.get('accept').includes('text/html')) {
                                return caches.match('/offline.html')
                            //}
                        //})
                    }
    })*/
);
});

/*self.addEventListener('fetch', event => {
    console.log(event.request.url)

    // Allow only GET requests
    if (event.request.method !== 'GET') return

    // Catch HTTP request and replace it with a SW request
    event.respondWith(

        // If ressource request URL matches a cached ressource URL, respond ressource from cache
        caches.match(event.request).then(response => {
            if (response) return response // Return ressource from cache if exists

            // Try to fetch ressource via network and cache it into dynamic cache
            return fetch(event.request).then(res => {
                return caches.open(CACHE_DYNAMIC_NAME).then(cache => {
                    cache.put(event.request.url, res.clone()) // Important: clone response, because it's a stream!!!
                    return res
                })
            }).catch(error => {

                // Dynamic caching failed due to no network connection. Send offline page
                return caches.open(CACHE_STATIC_NAME).then(cache => {

                    // Only return offline page, if a HTML ressource was requested
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return cache.match('/offline.html')
                    }

                })

            })

        })

    )
})*/
