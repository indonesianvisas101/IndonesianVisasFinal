self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'Notification', body: 'New update from Indonesian Visas' };
  
  const options = {
    body: data.body,
    icon: '/Logo.webp',
    badge: '/Logo.webp',
    data: {
      url: data.data?.url || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window open and focus it
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
