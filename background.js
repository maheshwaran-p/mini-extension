
const CLIENT_ID = encodeURIComponent('575384002811-v991bj9iovbalb307njkhpcba9a0t6st.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://ghbmnnjooekpmoecnnnilnnbdlolhkhi.chromiumapp.org/')
const SCOPE = encodeURIComponent('openid');
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
const PROMPT = encodeURIComponent('consent');

let user_signed_in = false;

function is_user_signed_in() {
    return user_signed_in;
}

function create_auth_endpoint() {
    let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

    let openId_endpoint_url =
        `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&scope=${SCOPE}
&state=${STATE}
&nonce=${nonce}
&prompt=${PROMPT}`;

    console.log(openId_endpoint_url);
    return openId_endpoint_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'login') {
       
        if (user_signed_in) {
            console.log("User is already signed in.");
        } else {

            browser.identity.launchWebAuthFlow({
                'url': create_auth_endpoint(),
                'interactive': true
            }, function (redirect_url) {
                console.log(redirect_url)
                sendResponse('success')
               
            })
        }
    } 
    
    else if (request.message === 'logout') {
        user_signed_in = false;
        chrome.browserAction.setPopup({ popup: './popup.html' }, () => {
            sendResponse('success');
        });

        return true;
    } else if (request.message === 'isUserSignedIn') {
        sendResponse(is_user_signed_in());
    }
});