const CACHE_NAME = 'gitshow-app-shell-v2';
const APP_SHELL_URLS = ['/', '/index.html'];

interface ServiceWorkerLifecycleEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}

interface ServiceWorkerFetchEvent extends ServiceWorkerLifecycleEvent {
  request: Request;
  respondWith(response: Promise<Response>): void;
}

interface ServiceWorkerScope {
  location: Location;
  clients: { claim(): Promise<void> };
  skipWaiting(): Promise<void>;
  addEventListener(type: 'install' | 'activate', listener: (event: ServiceWorkerLifecycleEvent) => void): void;
  addEventListener(type: 'fetch', listener: (event: ServiceWorkerFetchEvent) => void): void;
}

const serviceWorker = globalThis as unknown as ServiceWorkerScope;

serviceWorker.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => serviceWorker.skipWaiting()),
  );
});

serviceWorker.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => serviceWorker.clients.claim()),
  );
});

serviceWorker.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const isDynamicRequest = /^\/(?:api|auth|socket\.io|uploads)(?:\/|$)/.test(url.pathname)
    || url.pathname === '/logout';

  if (request.method !== 'GET' || url.origin !== serviceWorker.location.origin || isDynamicRequest) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const responseToCache = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseToCache))
              .catch((error: unknown) => console.error('Failed to cache response:', error)),
          );
        }
        return response;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        if (request.mode === 'navigate') {
          return (await cache.match('/index.html')) ?? Response.error();
        }

        return Response.error();
      }),
  );
});
