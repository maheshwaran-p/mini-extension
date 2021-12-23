
chrome.storage.local.get(['Email', 'user_status'], function (items) {


  let render = ``, status = 'Student';
  if (items.user_status) {
    status = 'Staff'
  }

  if (items.Email === null || items.Email === '' || items.Email === undefined) {
    render = `
      <h2>Sign-In</h2>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button id='sign-in'>Sign In</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button id='s1'>User Status</button>
      <button id='clear'>clear local storage</button>
      <br>
      <br>
      <br>
      <br>`;

}

  else {
    render = `
      <h2>Sign-Out</h2>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div id="classes"></div>
      <button id='s2'>User Status</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button id='sign-out'>Sign Out</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
      <br>
      <br>
  
      <button id='start'>Start</button><br>
  
      <br>
      <br>
      <br>
      `;
  }
  document.getElementById('render').innerHTML = render
  document.getElementById('status').innerHTML = status


  if (items.Email === null || items.Email === '' || items.Email === undefined) {
    document.querySelector('#s1')
      .addEventListener('click', function () {
       
        console.log('user status called.......................')
        chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
          function (response) {
            // alert(response);
          });
      });

    document.querySelector('#clear')
      .addEventListener('click', function () {
        chrome.extension.getBackgroundPage().console.log('Local Storage Cleared.......');

        chrome.storage.local.clear();
        // chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
        //   function (response) {
        //     // alert(response);
        //   });
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
  }

  else {
    console.log('logout')
    setClasses();
    document.querySelector('#s2')
      .addEventListener('click', function () {

        console.log('user status called.......................')
        var newURL = "http://stackoverflow.com/";
        newURL = chrome.extension.getURL('faceapi/index.html')
        chrome.tabs.create({ url: newURL });
        chrome.runtime.sendMessage({ message: 'isUserSignedIn' },
          function (response) {

          });
      });




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
  }


});

async function setClasses() {

  chrome.storage.local.get(['Email','user_status'], async function (items) {


    console.log(items.Email,items.user_status)

    let url = BASE_URL + '/user/' + items.Email;


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
            if(items.user_status)
            postdata(`${element.classname}`, items.Email)
            else
            getMeetUrl(`${element.classname}`)
          })
      });
    });
  });

}

async function getMeetUrl(classname){

  document.querySelector('#start').addEventListener('click', async function () {

  let url = BASE_URL + '/url/'+classname
  await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*'
    },

  }).then(async response =>{
    if(response.status === 200)
    { 
      let data = await response.json()
    chrome.tabs.create(  {url : data.result} )

  
    var newURL = chrome.extension.getURL('faceapi/index.html')
    chrome.windows.create({ url: newURL , type : 'panel' });

    chrome.runtime.sendMessage({ message: "meeturl", url : data.result }, function (response) {
      console.log("class name sent");
    })

      chrome.runtime.sendMessage({ message: "classname", classname: classname , id : data.id }, function (response) {
      console.log("class name sent");

    });

    }
    else{
      alert('class not started')
    }

  });

})
  

}


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
          setMeetUrl(classname,email,meet_url);
          meet_url_count++;
        }
        chrome.tabs.sendRequest(tabs[i].id, { action: "******" });
        chrome.extension.getBackgroundPage().console.log('Tab:' + i + "  " + tabs[i].url);
      }
      if (meet_url_count == 0) {
        chrome.extension.getBackgroundPage().console.log("Meet URL Not Detected");
        alert("Meet URL Not Detected.Please Open Your Meet tab Before Start.");
      }
      else if (meet_url_count == 1) {
        chrome.extension.getBackgroundPage().console.log("Meet URL Detected");

      }
      else if (meet_url_count > 1) {
        chrome.extension.getBackgroundPage().console.log("More Than one Meet Link Detected .Please Close the Unwanted Meet Links");
        alert("More Than one Meet Link Detected .Please Close the Unwanted Meet Links");
      }

    });

    


    

  });

}
async function setMeetUrl(classname,email,meet_url){
  let url = BASE_URL + '/seturl'
  let data = new Object();
  data.email = email
  data.classname = classname
  data.url = meet_url
  chrome.extension.getBackgroundPage().console.log(data);
  await fetch(url, {
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

    // chrome.runtime.sendMessage({ message: "classname", classname: classname  }, function (response) {
    //   console.log("class name sent");
    // });
}




