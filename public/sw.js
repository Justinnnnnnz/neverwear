const CACHE='neverwear-shell-v1';
const SHELL=['/offline.html','/icons/icon-192.png','/icons/icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const request=event.request;const url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
// Never cache query strings, personalized routes, or App Router data responses.
if(url.search||request.headers.has('RSC')||request.headers.has('Next-Router-State-Tree'))return;
if(request.mode==='navigate'){event.respondWith(fetch(request).catch(()=>caches.match('/offline.html')));return;}
if(url.pathname.startsWith('/products/')||url.pathname.startsWith('/campaign/')||url.pathname.startsWith('/icons/')||url.pathname.startsWith('/_next/static/'))event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}));
});
