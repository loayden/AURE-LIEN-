/* BOUT offline support v1 — images + catalog reads only. Navigations always passthrough. */
const VERSION = "bout-v1";
const IMAGE_CACHE = `${VERSION}-images`;
const API_CACHE = `${VERSION}-api`;
const API_TTL_MS = 5 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", (event) => {
  let data = { title: "BOUT", body: "Something new for you.", url: "/orders" };
  try {
    const json = event.data ? event.data.json() : {};
    data = { ...data, ...json };
  } catch {
    // ignore malformed payloads
  }
  event.waitUntil(
    self.registration.showNotification(String(data.title).slice(0, 80), {
      body: String(data.body).slice(0, 200),
      icon: "/logo.png",
      badge: "/logo.png",
      data: { url: String(data.url || "/orders") },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/orders";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).pathname === new URL(url, self.location.origin).pathname) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("bout-") && k !== IMAGE_CACHE && k !== API_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isCacheableImage(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/images/") || url.pathname.startsWith("/uploads/"))
  );
}

function isCacheableApi(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname === "/api/products" || url.pathname === "/api/search") return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (isCacheableImage(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then(
          (hit) =>
            hit ||
            fetch(request).then((res) => {
              if (res.ok) cache.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  if (isCacheableApi(url)) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        cache.match(request).then((hit) => {
          const network = fetch(request)
            .then((res) => {
              if (res.ok) {
                const copy = res.clone();
                cache.put(request, copy);
                const stamp = new Response(JSON.stringify({ at: Date.now() }), {
                  headers: { "Content-Type": "application/json" },
                });
                cache.put(`${request.url}#ts`, stamp);
              }
              return res;
            })
            .catch(() => hit);
          if (!hit) return network;
          return cache.match(`${request.url}#ts`).then((tsRes) =>
            tsRes
              .json()
              .then((ts) => (Date.now() - Number(ts.at || 0) > API_TTL_MS ? network : hit))
              .catch(() => network)
          );
        })
      )
    );
  }
});
