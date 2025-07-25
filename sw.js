self.addEventListener('push', function(event) {
  const data = event.data ? event.data.text() : 'No payload';
  event.waitUntil(
    self.registration.showNotification('New Notification', {
      body: data,
      icon: 'icon.png', // Optional: add an icon if you have one
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Optionally focus or open a page
  event.waitUntil(
    clients.openWindow('/')
  );
});