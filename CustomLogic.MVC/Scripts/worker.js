self.addEventListener('push', function (event) {

    var notificationData = event.data.json();

    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        text: 'Do i work?',
        icon: '../android-chrome-192x192.png',
        badge: 'android-chrome-192x192.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});