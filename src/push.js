// Check for browser support
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
      console.log('Service Worker registered.', reg);
    })
    .catch(function(error) {
      console.error('Service Worker registration failed:', error);
    });
}

window.subscribe = async function() {
  // Ask for notification permission
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    alert('Notifications enabled!');
    // Here you would subscribe to push notifications and send the subscription to your server
  } else {
    alert('Notifications not enabled. Permission: ' + permission);
  }
}