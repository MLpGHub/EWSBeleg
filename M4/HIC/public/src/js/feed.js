var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var titleinput = document.querySelector('#title');
var locationinput = document.querySelector('#location');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  setTimeout(function(){
    createPostArea.style.transform = 'translateY(0)'; //animeted position end 0
  },1);

  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);
      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });
    deferredPrompt = null;
  }
  // HOW TO unregister a service worker
  // if('serviceWorker'in navigator){
  //   navigator.serviceWorker.getRegistrations()
  //       .then(function(registrations){
  //         for (var i=0;i<registrations.length; i++){
  //           registrations[i].unregister();
  //         }
  //       })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.transform = 'translateY(100vh)';
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/blockchain_612x612.jpg');
      });
  }
}

function clearCards(){
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}
function createCard(data) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + data.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '400px';
  cardTitle.style.backgroundPosition = 'bottom';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = data.day+' - ' + data.location  ;
  cardSupportingText.style.textAlign = 'center';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}


//var url = 'https://httpbin.org/get';
var url = 'https://heyic-d4dff.firebaseio.com/posts.json';
var networkDataReceived = false;
fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      networkDataReceived = true;
      console.log('From web', data);
      var dataArray = [];
      for (var key in data) {
        dataArray.push(data[key]);
      }
      updateUI(dataArray);
    });

if ('indexedDB' in window) {
  // caches.match(url)
  //     .then(function(response) {
  //       if (response) {
  //         return response.json();
  //       }
  //     })
  //     .then(function(data) {
  //       console.log('From cache', data);
  //       if (!networkDataReceived) {
  //         var dataArray = [];
  //         for (var key in data) {
  //           dataArray.push(data[key]);
  //         }
  //         updateUI(dataArray)
  //       }
  //     });
  readAllData('posts')
      .then(function(data){
        if(!networkDataReceived){
          console.log('From cache',data);
          updateUI(data);
        }
      });
}

function sendData(){
fetch('https://heyic-d4dff.firebaseio.com/posts.json',{
  method: 'POST',
  header:{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    id: new Date().toISOString(),
    title: titleinput.value,
    location: locationinput,
    image: 'https://firebasestorage.googleapis.com/v0/b/heyic-d4dff.appspot.com/o/MainD2D2.jpg?alt=media&token=ab9101e6-31ba-4af2-9b31-bec7a358a6de'
  })
})
    .then(function(res){
      console.log('Sent data', res);
      updateUI();
    })
}

form.addEventListener('subnmit',function(event){
  event.preventDefault();
  if(titleinput.value.trim() === '' || locationinput.value.trim() === ''){
    alert('Please insert valid data!');
    return;
  }
  closeCreatePostModal();
  if('serviceWorker' in navigator && 'SyncManager' in window){
    navigator.serviceWorker.ready
        .then(function(sw){
          var post ={
            id: new Date().toISOString(),
            title: titleinput.value,
            location: locationinput.value
          };
          writeData('sync-posts',post)
              .then(function(){
                sw.sync.register('sync-new-posts');
              })
              .then(function(){
                var snackbarContainer = document.querySelector('#confirmation-toast');
                var data = {message:'Your Post was saved for syncing'};
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
              })
              .catch(function (err){
                consolelog(err);
              });
        });
  } else {
    sendData();
  }
});
