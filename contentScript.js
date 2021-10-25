alert("contentScripts")
document.body.innerHTML = '<center><h1 style="font-size:50px;"> GO To Meet </h1></center>'
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    if( msg.from == 'content'){
        console.log("calllled")
        chrome.tabs.create({url: 'index.html'});
    }

    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {

        var domInfo = {
            total: document.querySelectorAll('*').length,
            inputs: document.querySelectorAll('input').length,
            buttons: document.querySelectorAll('button').length,
        };
        response(domInfo);
    }
});

//document.body.style.background = 'yellow';
// var isFullScreen = (screen.width == window.outerWidth) && (screen.height == window.outerHeight);
// console.log(isFullScreen)
// if (isFullScreen) {
//     console.log("full screen")
// }