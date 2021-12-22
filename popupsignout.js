
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
        //let url = 'http://mini.newsled.in/user/' + items.Email;
        await fetch(url).then(function (response) {
            return response.json();
        }).then(function (data) {
            datas = data;
            classes_element = ``
            data.data.forEach(element => {
                console.log(element.classname)
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



setClasses();











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









function postdata(classname, email) {

    document.querySelector('#start').addEventListener('click', function () {

        let meet_url;
        let meet_url_count = 0;
        chrome.extension.getBackgroundPage().console.log('Start Clicked.......');
        chrome.tabs.getAllInWindow(null, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {

                let meetlink = "https://meet.google.com/";
                if ((tabs[i].url).includes(meetlink)) {
                    chrome.extension.getBackgroundPage().console.log('Meet Detected at :' + (i + 1) + 'th tab');
                    meet_url = tabs[i].url;
                    chrome.extension.getBackgroundPage().console.log("Meet URL :" + meet_url);
                    setClasses(meet_url);
                    meet_url_count++;
                }
                chrome.tabs.sendRequest(tabs[i].id, { action: "******" });
                chrome.extension.getBackgroundPage().console.log('Tab:' + i + "  " + tabs[i].url);
            }
            if (meet_url_count == 0) {
                chrome.extension.getBackgroundPage().console.log("Meet URL Not Detected");
                alert("Meet URL Not Detected.Please Open Your Meet tab Before Start.");
            }
            else if (meet_url_count == 1)
                chrome.extension.getBackgroundPage().console.log("Meet URL Detected");
            else if (meet_url_count > 1) {
                chrome.extension.getBackgroundPage().console.log("More Than one Meet Link Detected .Please Close the Unwanted Meet Links");
                alert("More Than one Meet Link Detected .Please Close the Unwanted Meet Links");
            }

        });

    });
    console.log("Class Name............")
    //let url = 'https://9858-2402-3a80-1325-416a-d585-3a48-9aaf-6c9c.ngrok.io/seturl/';
    let url = 'http://127.0.0.1:8000/seturl/' + meet_url;
    // let url = 'http://mini.newsled.in/seturl/' + meet_url;
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