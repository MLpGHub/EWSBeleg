var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

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
function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.textAlign = 'center';
  cardTitle.style.backgroundImage = 'url("/src/images/blockchain_612x612.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '270px';
  cardTitle.style.backgroundPosition ='bottom';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.alignContent = "center";
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = '';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Made in Germany';
  cardSupportingText.style.textAlign = 'center';
  cardSupportingText.style.backgroundColor = '#FFFFFF';
  // var cardSaveButton = document.createElement('button');
  // cardSaveButton.textContent = 'Save';
  // cardSaveButton.addEventListener('click', onSaveButtonClicked);
  // cardSupportingText.appendChild(cardSaveButton);
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

var url = 'https://httpbin.org/get';
var networkDataReceived = false;
fetch(url)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      networkDataReceived =true;
      console.log('From web', data);
      clearCards();
      createCard();
    });
if ('caches' in window) {
  caches.match(url)
      .then(function(response){
        if (response){
          response.json();
        }
      })
      .then(function(data){
        console.log('From cache', data);
       if (!networkDataReceived) {
         clearCards();
         createCard();
       }
      });
}

