var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');
if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification(){
    if('serviceWorker' in navigator){
        var options ={
            body: 'You successfully subscribed to our notification service!',
            icon: '/src/images/icons/app-icon-96x96.png',
            image: '/src/images/blockchain_612x612.jpg',
            dir: 'ltr',
            lang: 'en-US', //BCP 47
            vibrate: [100,50,200],
            badge: '/src/images/icons/app-icon-96x96.png',
            tag: 'confirm-notification',
            renotify: true,
            actions: [
                { action: 'confirm', title: 'Okay' , icon: '/src/images/icons/app-icon-96x96.png'},
                { action: 'cancel', title: 'Cancel' , icon: '/src/images/icons/app-icon-96x96.png'},
            ]
        };
        navigator.serviceWorker.ready
            .then(function(swreg){
                swreg.showNotification('Successfully subscribed', options);
            });
    }
}

function configurePushSub() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    var reg;
    navigator.serviceWorker.ready
        .then(function(swreg) {
            reg = swreg;
            return swreg.pushManager.getSubscription();
        })
        .then(function(sub) {
            if (sub === null) {
                // Create a new subscription
                var vapidPublicKey = 'BP1W_rUqd1QmE88JWwBGqpPefA8rpheoz9CrrS2aRoQh1PDEnmf-H6Xl_nO13szK9V4TX-ZIsUsKauseVLg0fE8\n';
                var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
                return reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidPublicKey
                });
            } else {
                // We have a subscription
            }
        })
        .then(function(newSub) {
            return fetch('https://heyic-d4dff.firebaseio.com/subscriptions.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newSub)
            })
        })
        .then(function(res) {
            if (res.ok) {
                displayConfirmNotification();
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

function askForNotificationPermission(){
    Notification.requestPermission(function (result){
        console.log('User Choice', result);
        if (result !== 'granted'){
            console.log('No notification permission granted');
        } else {
            //Hide Button
            //displayConfirmNotification();
            configurePushSub();
        }
    });
}
if('Notification' in window && 'serviceWorker' in navigator){
    for (var i =0; i <enableNotificationsButtons.length; i++){
        enableNotificationsButtons[i].style.display = 'inline-block';
        enableNotificationsButtons[i].addEventListener('click',askForNotificationPermission);
    }
}