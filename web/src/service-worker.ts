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

async function PutCache(request: Request, response: Response): Promise<void> {
    //if(!/^GET$/.test(request.method)) {
    //    return;
    //}
    try {
        return (await GetCache()).put(request, response);
    } catch(error) {
        console.warn('Failed to cache request', request, error);
    }
}

async function Fetch(request: Request): Promise<Response> {
    try {
        const response = await fetch(request);
        PutCache(request, response.clone()); // do not await caching the response
        return response;
    } catch {
        return (await GetCache()).match(request) ?? new Response('Service Unavailable', { status: 503 });
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
    if(new URL(event.request.url).hostname === sw.location.hostname) {
        event.respondWith(Fetch(event.request));
    }
}

sw.addEventListener('install', OnInstall);
sw.addEventListener('activate', OnActivate);
sw.addEventListener('fetch', OnFetch);