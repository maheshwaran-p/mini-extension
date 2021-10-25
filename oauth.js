
console.log("entered");
window.onload = function() {

 

console.log("entered on load");


var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      console.log("Logged in")
      return false;
    },
    uiShown: function() {

      document.getElementById('loader').style.display = 'none';
    }
  },

  signInFlow: 'popup',
  //signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [

    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};








    

ui.start('#firebaseui-auth-container', uiConfig);
    
  };