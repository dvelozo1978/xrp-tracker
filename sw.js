const CACHE = "xrp-tracker-v1";
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

self.addEventListener("message", e => {
  if (e.data?.type === "PRICE_ALERT") {
    const { price, change, direction } = e.data;
    const emoji = direction === "up" ? "🚀" : "📉";
    self.registration.showNotification(`${emoji} XRP ${direction === "up" ? "subió" : "bajó"} ${Math.abs(change).toFixed(1)}%`, {
      body: `Precio actual: $${price.toFixed(4)} USD`,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "xrp-price-alert",
      renotify: true,
      data: { price, change }
    });
  }

  if (e.data?.type === "NEWS_ALERT") {
    const { title, category, impact, summary } = e.data;
    const impactEmoji = impact === "alcista" ? "📈" : impact === "bajista" ? "📉" : "📰";
    const catLabel = category.charAt(0).toUpperCase() + category.slice(1);
    self.registration.showNotification(`${impactEmoji} XRP — ${catLabel}: ${title}`, {
      body: summary,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      vibrate: [100, 50, 100, 50, 200],
      tag: "xrp-news-alert",
      renotify: true,
      actions: [{ action: "open", title: "Ver detalles" }]
    });
  }
});
