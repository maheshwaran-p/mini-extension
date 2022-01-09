
const CLIENT_ID = encodeURIComponent('575384002811-v991bj9iovbalb307njkhpcba9a0t6st.apps.googleusercontent.com');
const RESPONSE_TYPE = encodeURIComponent('id_token');
const REDIRECT_URI = encodeURIComponent('https://ghbmnnjooekpmoecnnnilnnbdlolhkhi.chromiumapp.org/')
const SCOPE = encodeURIComponent('openid email profile');
const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
const PROMPT = encodeURIComponent('consent');

let classes_element = ``;
let user_signed_in = false;
let item
function is_user_signed_in() {
    return user_signed_in;
}

let b_url = 'https://maheshwaran-p.github.io/mini-extension/url.json';
let BASE_URL;
fetch(b_url).then(response => response.json())
    .then(function (data) {
        BASE_URL = data.url;
    }).catch(function () {
        chrome.extension.getBackgroundPage().console.log('Catch occured for BaseUrl');
    });




//let BASE_URL = 'http://192.168.43.105:8000'
//let BASE_URL = 'http://172.31.7.103:8000'
//let BASE_URL = 'http://127.0.0.1:8000'

//BASE_URL = 'http://mini.newsled.in'
//eyJhbGciOiJSUzI1NiIsImtpZCI6ImJiZDJhYzdjNGM1ZWI4YWRjOGVlZmZiYzhmNWEyZGQ2Y2Y3NTQ1ZTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NzUzODQwMDI4MTEtdjk5MWJqOWlvdmJhbGIzMDduamtocGNiYTlhMHQ2c3QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1NzUzODQwMDI4MTEtdjk5MWJqOWlvdmJhbGIzMDduamtocGNiYTlhMHQ2c3QuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTczNDQxMjE4ODY3NjIxOTA5MDgiLCJoZCI6ImdjdC5hYy5pbiIsImVtYWlsIjoibWFoZS4xODE3MTMwQGdjdC5hYy5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJub25jZSI6InRsYzhhcmc0ZGUyMXE4cjJ0Y2JsNiIsImlhdCI6MTYzNTE4NjU2MCwiZXhwIjoxNjM1MTkwMTYwLCJqdGkiOiI5NmVkNWRhNTAxYWRkNjU2ZDYzZDgxZjAwYzZhYTZhOTJlN2ZkOWUzIn0.A_Chan3qDy82rhHlYuSIHuAJEDrOya-2tdghPp66Ywey0fwYaHef0GJXHdqzr1qarVFI0DHI5OFAd_e2JENpX8-g4syjFj9U0XmMiJOLpdirb3_1VWf8rPhgnpP1TN8SOAh4j_W7tLug3JW_4nbnA9qx4hF49l4N_gFX-1B-Y-dutUuk9VqAScVeDzALFJDtPwvP4QnKgZazt8EgUkLthBxXPIj7oHOBKDSOckGQOTPwOowXw0yZdWfweN36EMBp8p_2Y8VwzBJv19mQ1uAT8JhxOqhebXVHVRp3OnNQTNdwSNHabMoMalCpC6klNhx8UpAOR5Wmtmth7ZQ9hrLwDQ
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


    return openId_endpoint_url;
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


    if (request.message === 'login') {
        chrome.storage.local.get(['Email', 'user_status'], function (items) {

            //  console.log(items['user_status'])

            if (items['user_status']) {
                sendResponse('User is already signed in',);
                console.log("User is already signed in. Email", items.Email);
            } else {

                chrome.identity.launchWebAuthFlow({
                    'url': create_auth_endpoint(),
                    'interactive': true
                }, function (redirect_url) {

                    if (chrome.runtime.lastError) {
                        sendResponse('Invalid credentials.');

                    } else {
                        let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
                        id_token = id_token.substring(0, id_token.indexOf('&'));
                        const user_info = parseJwt(id_token);



                        if ((user_info.iss === 'https://accounts.google.com' || user_info.iss === 'accounts.google.com')
                            && user_info.aud === CLIENT_ID) {

                            console.log("User successfully signed in.");
                            setUserDetailsInLocalStorage(user_info)

                        } else {

                            sendResponse('Invalid credentials.');
                            console.log("Invalid credentials.");
                        }
                    }
                },


                );
                return true;
            }
        });
    }


    else if (request.message === 'logout') {
        user_signed_in = false;
        chrome.storage.local.set({ 'user_status': false, 'Email': '' }, function () {

        });
        chrome.browserAction.setPopup({ popup: '/signin.html' }, () => {
            sendResponse('success');
        });

        return true;
    } else if (request.message === 'isUserSignedIn') {
        chrome.storage.local.get(['Email'], function (items) {
            console.log('Registered Email:', items);
        });
        sendResponse(is_user_signed_in());
    }
    else if (request.message === 'getEmail') {
        var email = '';
        chrome.storage.local.get(['Email'], function (items) {
            email = items
            console.log("from background", items)
        });
        sendResponse({ 'response': 'success', 'email': email });

    }

});


function setUserDetailsInLocalStorage(user_info) {

    let url = BASE_URL + '/user/' + user_info.email;
    // let url = 'http://mini.newsled.in/user/' + user_info.email;
    fetch(url).then(response => response.json())
        .then(function (data) {

            if (!data.result && data.status === 200) {
                console.log('Student................');
                // chrome.browserAction.setPopup({ popup: './student-signout.html' }, () => {

                // });


                chrome.storage.local.set({ 'profile': 'student', }, function () {

                });
                console.log(user_info);
                let email_id = user_info.email;
                chrome.storage.local.set({ 'user_status': data.result, 'Email': email_id }, function () {
                    console.log('User Records Stored  in Local Storage');
                    sendResponse('success');
                });

            }
            else if (data.result && data.status === 200) {

                console.log('Staff................');


                // chrome.browserAction.setPopup({ popup: './staff-signout.html' }, () => {

                // });



                chrome.storage.local.set({ 'profile': 'staff', }, function () {

                });
                console.log(user_info);
                let email_id = user_info.email;
                chrome.storage.local.set({ 'user_status': data.result, 'Email': email_id }, function () {
                    console.log('User Records Stored  in Local Storage');
                    sendResponse('success');
                });

            }
            else if (data.status === 404) {
                console.log('Create An Account On Website First................');


            }

        }).catch(function () {

            console.log("catch.................")

        });


}





