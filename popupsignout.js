
document.querySelector('#s2')
    .addEventListener('click', function () {
        console.log('user status called.......................')
        chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
            function (response) {
                alert(response);
            });
    });



document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.extension.getBackgroundPage().console.log('sign-out event called...............');

    document.getElementById('sign-out').disabled = true;
    chrome.runtime.sendMessage({ message: 'logout' }, function
        (response) {
        chrome.extension.getBackgroundPage().console.log('response');
        if (response === 'success') {
            // document.getElementById('sign-out').innerHTML = 'Sign In';
            // document.getElementById('sign-out').disabled = false;
        }
        else {
            document.getElementById('sign-out').disabled = false;
        }
    });
});
