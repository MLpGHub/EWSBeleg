var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors') ({origin: true});
var webpush = require('web-push');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require("./heyic-fbkey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaserURL: ('https://heyic-d4dff.firebaseio.com/')
});

exports.storePostData = functions.https.onRequest((request, response) => {
 cors(request,response,function(){
  admin.database().ref('posts').push({
   id: request.body.id,
   title: request.body.title,
   location: request.body.location,
   image: request.body.image
  })
      .then(function() {
          webpush.setVapidDetails('mailto:vultonios@gmail.com', 'BP1W_rUqd1QmE88JWwBGqpPefA8rpheoz9CrrS2aRoQh1PDEnmf-H6Xl_nO13szK9V4TX-ZIsUsKauseVLg0fE8','NDazJcyFEwiivUf7U4ZOoL7lHnMpcniGZ2hmcbTFDcE');
          return admin.database().ref('subscriptions').once('value');
      })
      .then(function (subscriptions) {
          subscriptions.forEach(function (sub) {
              var pushConfig = {
                  endpoint: sub.val().endpoint,
                  keys: {
                      auth: sub.val().keys.auth,
                      p256dh: sub.val().keys.p256dh
                  }
              };
              webpush.sendNotification(pushConfig, JSON.stringify({
                  title: 'New Post',
                  content: 'New Post added!',
                  openUrl: '/help'
              }))
                  .catch(function(err) {
                      console.log(err);
                  })
          });
          response.status(201).json({message: 'Data stored', id: request.body.id});
      })
      .catch(function (err) {
          response.status(500).json({error: err});
      });
 });
});