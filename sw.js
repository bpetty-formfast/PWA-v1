var CACHE_NAME = 'MainCache-V2';

var urlsToCache = [
	'index.html',
	'main.htm',
	'script/main.js'
];

self.addEventListener('install', function(event) {	
	console.log("Opening Cache: " + CACHE_NAME);

	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('Installing URLs');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		  .then(function(response) {
			
			if (response) {
				console.log('Cache hit: ' + event.request.url);
				return response;
			}
			
			console.log('Cache miss: ' + event.request.url);
			return fetch(event.request);
		  })
	);
});

self.addEventListener('activate', function(event) {
	console.log('Activating new service worker.');

	const cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						console.log('Deleting Cache: ' + cacheName)
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});