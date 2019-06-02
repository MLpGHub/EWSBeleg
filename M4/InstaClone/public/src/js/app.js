var deferredPrompt;
var button = document.querySelector('#start-button');
var output = document.querySelector('#output');

//for promise api
if (!window.Promise){
    window.Promise = Promise;
}
if ('serviceWorker' in navigator){
    navigator.serviceWorker
        .register('/sw.js') // .register('/sw.js',{scope: '/help/'}
        .then(function() {
            console.log('Service worker registered!');
        }).catch(function(err){
            console.log(err);
    });
}

window.addEventListener('beforeinstallprompt',function(event){
   console.log('beforeinstallprompt fired');
   event.preventDefault();
    deferredPrompt = event;
    return false;
});
/*
var promise = new Promise(function(resolve,reject){
    setTimeout(function(){
       // resolve('This is executed once Timer is done.');
        reject({code: 500,message: 'An error occured! >just testing this<'});
        //console.log('This is executed once Timer is done.');
    },3000);}
);


//GET Request
// http://httpbin.org/ HOW TO USE FETCH
fetch('http://httpbin.org/ip')
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
    .catch(function(err){
        console.log(err);
    });
//Post Request
fetch('http://httpbin.org/post',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({message: 'Does this work?'})
})
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
    .catch(function(err){
        console.log(err);
    });

/* promise.then(function(text){
    return text;}, function(err) {
    console.log(err.code,err.message)
    }
    ).then(function(newText){
    console.log(newText);
});
console.log('This is executed right after Timeout');

promise.then(function(text){
        return text;
        }, function(err) {
        console.log(err.code,err.message)
    }
).catch(function(newText){
    console.log(newText);
});
console.log('This is executed right after Timeout');
*/

