

document.querySelector('#s1')
  .addEventListener('click', function () {
    console.log('user status called.......................')
    chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
      function (response) {
        // alert(response);
      });
  });





document.querySelector('#sign-in').addEventListener('click', function () {
  document.getElementById('sign-in').disabled = true;
  chrome.runtime.sendMessage({ message: 'login' }, function
    (response) {
    chrome.extension.getBackgroundPage().console.log('response');
    if (response.response === 'success') {
      chrome.extension.getBackgroundPage().console.log(response.data);
      // document.getElementById('sign-in').innerHTML = 'Signout';

      // document.getElementById('sign-in').disabled = false;

    }
    else {
      document.getElementById('sign-in').disabled = false;
    }
  });
});



