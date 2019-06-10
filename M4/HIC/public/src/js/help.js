//var shareEmailButton = document.querySelector('#share-image-button') ;
var shareEmailButton= document.getElementsByClassName('#material-icons');
var sharePhoneButton = document.querySelector('#share-phone-button');
var shareMessageButton = document.querySelector('#share-message-button');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');


        function openEmailModal() {

            if('material-icon'.match('email')) {
                alert('Send an Email to : michael.leopold@mlphomeuse.de');
            }

        }
        function openPhoneModal() {

            alert('For my personal phone number you just have to go first. Sorry :/ Send an Email instead.^^ ');
        }

        function openMessageModal() {
            alert('And again for my personal phone number you just have to go first. Sorry :/ Send an Email instead.^^ ');
}


shareEmailButton.addEventListener('click',openEmailModal);
shareMessageButton.onclick = openMessageModal();
sharePhoneButton.onclick = openPhoneModal();