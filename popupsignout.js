
document.querySelector('#s2')
    .addEventListener('click', function () {
        console.log('user status called.......................')
        chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
            function (response) {
                //  alert(response);
            });
    });

let datas = ''


async function setClasses() {

    chrome.storage.local.get(['Email'], async function (items) {


        console.log(items.Email)
        //  let url = 'https://9858-2402-3a80-1325-416a-d585-3a48-9aaf-6c9c.ngrok.io/user/mahe.1817130@gct.ac.in';
        let url = 'http://127.0.0.1:8000/user/' + items.Email;
        await fetch(url).then(function (response) {
            return response.json();
        }).then(function (data) {
            datas = data;
            classes_element = ``
            data.data.forEach(element => {
                classes_element += `<button id='${element.classname}' ">${element.classname}</button><br> `

            });

            console.log(classes_element)
            document.getElementById('classes').innerHTML = classes_element

            data.data.forEach(element => {

                document.querySelector(`#${element.classname}`).addEventListener('click',
                    function () {
                        postdata(`${element.classname}`, items.Email)
                    })
            });
        });
    });

}

setClasses()













document.querySelector('#sign-out').addEventListener('click', function () {
    chrome.extension.getBackgroundPage().console.log('sign-out event called...............');

    document.getElementById('sign-out').disabled = true;
    chrome.runtime.sendMessage({ message: 'logout' }, function
        (response) {
        chrome.extension.getBackgroundPage().console.log('response');
        if (response.response === 'success') {
            // document.getElementById('sign-out').innerHTML = 'Sign In';
            // document.getElementById('sign-out').disabled = false;
            chrome.extension.getBackgroundPage().console.log(response.response.data);
        }
        else {
            document.getElementById('sign-out').disabled = false;
        }
    });
});


document.querySelector('#start').addEventListener('click', function () {

    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            console.log("QuerySelector called.....");
            console.log(tab + "\n");

            // do whatever you want with the tab


        });
    });

});



function postdata(classname, email) {
    console.log("Class Name............")
    //let url = 'https://9858-2402-3a80-1325-416a-d585-3a48-9aaf-6c9c.ngrok.io/seturl/';
    let url = 'http://127.0.0.1:8000/seturl/';
    let data = new Object();
    data.email = email
    data.classname = classname
    data.url = url
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}