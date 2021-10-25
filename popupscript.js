document.querySelector('#sign-in').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'login' }, function 
      (response) {
        if (response === 'success') {
            console.log("signed in")
        }
    });
});
document.querySelector('button')
 .addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'isUserSignedIn' }, 
      function (response) {
        alert(response);
   });
});
