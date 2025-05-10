const sw = self as unknown as ServiceWorkerGlobalScope;
const currentCacheName = sw.location.hostname; // TODO: Get build ID from vite
let currentCache: Cache = undefined;

async function PrepareCache(): Promise<void> {
    const allCacheNames = await caches.keys();
    const promises = allCacheNames
        .filter(cacheName => cacheName !== currentCacheName)
        .map(cacheName => caches.delete(cacheName));
    await Promise.allSettled(promises);
    currentCache = await GetCache();
}

async function GetCache(): Promise<Cache> {
    currentCache ??= await caches.open(currentCacheName);
    return currentCache;
}

async function PutCacheResponse(request: Request, response: Response): Promise<void> {
    try {
        const cache = await GetCache();
        await cache.put(request, response);
    } catch(error) {
        console.warn('Failed to put response to cache:', request, response, error);
    }
}

async function GetCacheResponse(request: Request): Promise<Response> {
    let response: Response | undefined;
    try {
        const cache = await GetCache();
        response = await cache.match(request);
    } catch(error) {
        console.warn('Failed to get response from cache:', request, error);
    } finally {
        return response ?? new Response('Service Unavailable', { status: 503 });
    }
}

async function Fetch(request: Request): Promise<Response> {
    try {
        const response = await fetch(request);
        PutCacheResponse(request, response.clone()); // do not await caching the response
        return response;
    } catch {
        return GetCacheResponse(request);
    }
}

function OnInstall(event: ExtendableEvent): void {
    event.waitUntil(Promise.all([
        sw.skipWaiting(), // activate the installed service worker instantly (replacing the previous version)
        PrepareCache(),
    ]));
}

function OnActivate(event: ExtendableEvent) {
    return event.waitUntil(Promise.all([
        PrepareCache()
    ]));
}

function OnFetch(event: FetchEvent): void {
    try {
        if(new URL(event.request.url).hostname === sw.location.hostname /* && /^GET$/.test(event.request.method) */) {
            event.respondWith(Fetch(event.request));
        }
    } catch(error) {
        console.warn('Failed to fetch via Service Worker:', event, error);
    }
}

sw.addEventListener('install', OnInstall);
sw.addEventListener('activate', OnActivate);
sw.addEventListener('fetch', OnFetch);