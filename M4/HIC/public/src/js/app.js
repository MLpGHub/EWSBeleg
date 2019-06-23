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

function configurePushSub(){
    if(!('serviceWorker' in navigator)){return;} //not needed

    var reg;
    navigator.serviceWorker.ready
        .then(function(swreg){
            reg= swreg;
           swreg.pushManager.getSubscription();
        })
        .then(function(sub){
            if(sub === null){//creating new sub
                reg.pushManager.subscribe({
                    userVisibleOnly: true
                });
            }else{//Having a sub
            }
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