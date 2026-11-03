/* Plank Plan service worker: precache the app shell, then stale-while-revalidate
   for same-origin files and Google Fonts. Bump CACHE when PRECACHE changes. */
const CACHE = "plank-v1";
const PRECACHE = [
  "/", "/index.html", "/manifest.webmanifest",
  "/favicon.svg", "/favicon.ico", "/apple-touch-icon.png",
  "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const own = url.origin === self.location.origin;
  if (!own && !FONT_HOSTS.includes(url.hostname)) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.mode === "navigate" ? "/" : req;
    const cached = await cache.match(key);
    const network = fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    return (await network) || new Response("Offline", { status: 503, statusText: "Offline" });
  })());
});
