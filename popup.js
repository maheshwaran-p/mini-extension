const urls = [
    // '*://*.web.whatsapp.com/',
    // '*://*.twitter.com/',
    // '*://*.youtube.com/',
    'meet.google',

]
BASE_URL = 'http://127.0.0.1:8000'










let isInMeet = false;
let currentUrl = ""
let active = {};
let total = 0;
let starttime = 0;
const end = () => {
    if (active.name) {
        // console.log(`app in background`);
        const timeDiff = parseInt((Date.now() - active.time) / 1000);
        total += timeDiff;
        console.log(`You listened ${total} seconds out of ${parseInt((Date.now() - starttime) / 1000)}`);
        active = {};
    }
}






function dom() {
    //  console.log(document.getElementsByClassName("VfPpkd-Bz112c-Jh9lGc")[0].innerHTML);
    return document.getElementsByClassName("VfPpkd-Bz112c-Jh9lGc")[0].innerHTML;

}
const setActive = async () => {
    const activeTab = await getActiveTab();



    if (activeTab) {
        function injectedFunction() {
            document.body.style.backgroundColor = "orange";
            //'document.body.style.display = "none"';
        }


        // let url1 = "https://meet.google.com/lookup/b6waqn6gkz";
        // url1 = "https://djangosdeploytest.herokuapp.com/";
        // //  url1 = 'http://192.168.43.121:8000/url/En';
        // fetch(url1, {
        //     method: 'GET',

        //     headers: {
        //         'Accept': '*/*',
        //         'Content-Type': 'application/json'
        //     }

        // })
        // .then(response => {
        //     if (response.status == 200) {
        //         return response.json()
        //     }
        //     else {

        //         console.log('error in url retrieve')
        //         return null
        //     }
        // }).then(data => {
        //     if (data !== null) {
        //         urls.push(data.result)
        //     }

        // })
        // .catch(console.error);




        const { url } = activeTab;
        chrome.tabs.query(
            { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
            function (tabs) {
                const { id: tabId } = tabs[0].url;
                let code = `document.getElementById('tt-c6').innerText`;

                chrome.tabs.executeScript(tabId, { code }, function (result) {
                    if (String(result[0]) !== 'null') {
                        console.log('true');
                        document.getElementsByClassName
                        console.log('Class In ForeGround')
                        isInMeet = true;






                    }
                });
            }
        );
        // check if the tab's url is among the arrays of url
        let host = new URL(url).hostname;
        host = host.replace('www.', '').replace('.com', '');

        // activeTab.executeScript({
        //     code: '(' + dom + ')();'
        // }
        //     , (result) => {
        //         console.log(result);
        //     }

        // );
        var dat = document.getElementsByClassName("VfPpkd-Bz112c-Jh9lGc")[0]
        // console.log(dat);
        // chrome.windows.get(sender.tab.windowId, function (chromeWindow) {
        //     "normal", "minimized", "maximized", "fullscreen";
        //     console.log(chromeWindow.state);
        // });

        if (!urls.includes(host)) {
            chrome.tabs.executeScript({

                // code: 'document.body.style.display = "none"',
                // code: document.body.innerHTML = "Your Restricted To See Other Tabs During Class Time.",
                code: document.body.style.backgroundColor = "orange",
            });
            end();

            dat = activeTab.url.split("/")[3].split("?")
            active = {
                name: host,
                time: Date.now(),
                classroom: dat[0],
                user: dat[1]
            };




        }
        else {


            console.log(`Meet in foreground`);


        }



        if (urls.some(each => each.includes(host))) {
            // isInMeet = true;
            // console.log('true')
            // set the site and current time
            if (active.name !== host) {
                chrome.tabs.executeScript({
                    //code: 'document.body.style.display = "none"',
                    // code: document.body.innerHTML = "Your Restricted To See Other Tabs During Class Time.",
                    code: 'document.body.style.backgroundColor="orange"'
                });
                // if a different site is active then end the existing site's session
                console.log(`app in foreground`);
                end();
                dat = activeTab.url.split("/")[3].split("?")
                active = {
                    name: host,
                    time: Date.now(),
                    classroom: dat[0],
                    user: dat[1]
                };
                if (starttime === 0) {

                    starttime = Date.now();
                }
                // console.log(`${active.name} visited at ${active.time}`);
                // console.log(activeTab);
            }
            else {

            }
            if (starttime === 0 && isInMeet) {
                console.log("entered1");
                starttime = Date.now();
            }
        }
    }
}

chrome.tabs.onUpdated.addListener(() => {
    setActive();
});

chrome.tabs.onActivated.addListener(() => {
    if (active.name) {
        end();
    }
    // check to see if the active tab is among the sites being tracked
    setActive();
});

chrome.windows.onFocusChanged.addListener(window => {
    if (window === -1) {
        // browser lost focus
        end();
    } else {
        setActive();
    }
});
chrome.runtime.onMessage.addListener((msg, sender) => {
    // First, validate the message's structure.
    if ((msg.message === 'classname')) {
        console.log(msg.classname);


        var myVar = setInterval(async function () {
            url = BASE_URL + '/settime';

            chrome.storage.local.get(['Email'], function (items) {
                data = new Object()
                data.time = total
                data.email = items.Email
                data.classname = msg.classname

            });

            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
                .then(data => {
                    console.log("set Interval")
                    console.log(data.total);
                });
        }, 5000);


        const getActiveTab = () => {
            return new Promise(resolve => {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, activeTab => {
                    resolve(activeTab[0]);
                });
            });
        }


        // chrome.pageAction.show(sender.tab.id);
    }
});


// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//       target: { tabId: activeTab.id },
//       function: injectedFunction
//     });
//   });
