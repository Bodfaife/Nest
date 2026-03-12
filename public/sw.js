// Simple service worker to enable showing notifications via registration.showNotification
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      if (windowClients.length > 0) return windowClients[0].focus();
      return clients.openWindow('/');
    })
  );
});
