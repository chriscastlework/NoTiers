
const applicationServerPublicKey = 'BKspSxcxttPOItpMuw2EenS8YKgeDxd8LIaJFfcZl5O5TcfXz5cN_3_nTgPZ79a5ORP4E-d65NtXytWqwUZ68hA';
const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
const pushButton = document.querySelector('.js-push-btn');
const postButton = document.querySelector('.js-post-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function PostToApi(endPoint,data) {
    fetch('api/' + endPoint,
         {
             headers: { 'Content-Type': 'application/json' },
             method: 'POST',
             cerdentials: 'same-origin',
             body: JSON.stringify(data)
         });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
.then(function (subscription) {
    if (subscription) {
        PostToApi('UnSubscribeUser', subscription);
        return subscription.unsubscribe();
    }
})
.catch(function (error) {
    console.log('Error unsubscribing', error);
})
    .then(function () {
        updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;

        updateBtn();
    });
}

function initializeUI() {
    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });

    postButton.addEventListener('click', function () {
        debugger;
        PostToApi('PostSubscribeUser', 'test');
    });

    // Set the initial subscription value
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
 .then(function (subscription) {
     console.log('User is subscribed.');

     updateSubscriptionOnServer(subscription);

     isSubscribed = true;

     updateBtn();

 })
 .catch(function (err) {
     console.log('Failed to subscribe the user: ', err);
     updateBtn();
 });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('Scripts/worker.js')
    .then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
    })
    .catch(function (error) {
        console.error('Service Worker Error', error);
    });
} else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function (subscription) {
        console.log('User is subscribed.');

        updateSubscriptionOnServer(subscription);

        // save to database
        PostToApi('SubscribeUser', subscription);

        isSubscribed = true;
        updateBtn();
    })
    .catch(function (err) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn();
    });
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}


function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
      document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}
