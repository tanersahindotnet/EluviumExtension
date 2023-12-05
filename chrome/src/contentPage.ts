import * as CryptoJS from 'crypto-js';

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if(request.action === "creditContentFill")  {
    autoFillCreditCard(request.item);
    return true;
  }
});

chrome.runtime.sendMessage({action: "getTabUrl"}, function(response) {
  if(response.savePopup !== "true") 
  return;

  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const usernameInput = form.querySelector<HTMLInputElement>('input[type="text"], input[type="email"]');
    const passwordInput = form.querySelector<HTMLInputElement>('input[type="password"]');
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (usernameInput && passwordInput && submitButton) {
  
      submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        // Popup
        const popupDiv = document.createElement('div');
        popupDiv.style.position = "fixed";
        popupDiv.style.top = "0";
        popupDiv.style.left = "0";
        popupDiv.style.width = "100%";
        popupDiv.innerHTML = returnPopupHtml();
        document.body.appendChild(popupDiv);
        var isNotClicked = true;
  
        document.getElementById("eluvium-close").addEventListener("click",function() {
          document.getElementById("eluvium-notification-bar").innerHTML = "";
          isNotClicked = false;
          form.submit();
        });
        
        document.getElementById("eluvium-action").addEventListener("click",function() {
          isNotClicked = false
            const activeUrlName = getHostname(response.tabUrl);
            var loginData = {
              url: activeUrlName,
              username: usernameInput.value,
              password: passwordInput.value
            };
            if(response.password == null)
            {
              chrome.runtime.sendMessage({ message: loginData });
              form.submit();
            }
            else {
              savePassword(loginData, form, response);
            }
        });
          setTimeout(()=>{
            if(isNotClicked) 
            form.submit();
          },2000)
      });
    }
  });
});

function autoFillCreditCard(item) {
  var name = returnInput(["card-holder","card-name","name"],"input");
  if(name != undefined) {
    name.value = item.cardholderName;
  }
  var cardNumber = returnInput(["cardnumber", "card-number","card","number"],"input");
  if(cardNumber != undefined) {
    cardNumber.value = item.number;
  }
  if(cardNumber == undefined) {
    var filteredInputs = listInputs(4);
    var result = splitNumberIntoArray(item.number, 4);
    for (let index = 0; index < filteredInputs.length; index++) {
      const element = filteredInputs[index];
      element.value = result[index];
    }
  }

  var expiration = returnInput(["expir","expire-date","cc-exp"],"input");
  if(expiration == undefined) {
    var expirationMonth =  returnInput(["month","expire-month"],"input");
    if(expirationMonth != undefined)
    expirationMonth.value = item.expMonth;
    
    var expirationYear =  returnInput(["year","expire-year"],"input");
    if(expirationYear != undefined)
    expirationYear.value = item.expYear;

    if(expirationYear == undefined && expirationMonth == undefined){
      var expirationMonth =  returnInput(["month","expire-month"],"select");
      expirationMonth.value = item.expMonth;

      var expirationYear =  returnInput(["year","expire-year"],"select");
      expirationYear.value = item.expYear;
    }
  }
  else {
    expiration.value = item.expMonth + "" + item.expYear.slice(-2);
  }
  var cvv = returnInput(["ccv","code","cvv","cvc","csv"],"input");
  if(cvv != undefined) {
    cvv.value = item.code;
  }
}

function splitNumberIntoArray(number, chunkSize) {
  var numberString = number.toString();
  var array = [];

  for (var i = 0; i < numberString.length; i += chunkSize) {
    var chunk = numberString.substr(i, chunkSize);
    array.push(chunk);
  }

  return array;
}
 
function listInputs(maxLength) {
  var inputs = document.getElementsByTagName("input");
  var filteredInputs = [];

  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.value.length <= maxLength) {
      filteredInputs.push(input);
    }
  }

  return filteredInputs;
}

function returnInput(inputValues, type) {
  var inputs = document.querySelectorAll(type);
  var returnInput;
  var finded = false;
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var inputId = input.getAttribute('id');
    var inputName = input.getAttribute('name');
   for (let index = 0; index < inputValues.length; index++) {
    if (inputId && (inputId.toLowerCase().indexOf(inputValues[index]) !== -1 || inputId.toLowerCase().indexOf(inputValues[index]) !== -1) && 
       (input.value === "" || type == "select")) {
      returnInput = input;
      finded = true;
      break;
    }  
    else if (inputName && (inputName.toLowerCase().indexOf(inputValues[index]) !== -1 || inputName.toLowerCase().indexOf(inputValues[index]) !== -1) && 
            (input.value === "" || type == "select")) {
      returnInput = input;
      finded = true;
      break;
    }
   }
   if(finded)
   break;
  }
  return returnInput;
}

function savePassword(loginData, form, response) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        alert('Password Saved');
        form.submit();
      } else {
        alert('Request Failed');
        chrome.runtime.sendMessage({ message: loginData });
        form.submit();
      }
    }
  }
  xhr.open('POST', "https://eluvium.info/api/EluviumOnePassApiController/AddOrUpdatePassword/" + response.mail + "/" + response.hashedPassword + "/" + response.deviceId);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `Bearer ${response.token}`);
  // Use CryptoJS functions as needed
  const url = CryptoJS.AES.encrypt(loginData.url, response.password).toString();
  const username = CryptoJS.AES.encrypt(loginData.username, response.password).toString();
  const password = CryptoJS.AES.encrypt(loginData.password, response.password).toString();
  const jsonData = JSON.stringify({
    title: url,
    url: url,
    userName: username,
    sitePassword: password,
    notes: ""
  });
  xhr.send(jsonData);
}

const getHostname = url => {
  try {
    // use URL constructor and return hostname
    const hostName = new URL(url).hostname.replace('www.', '')
    const removeFrom = hostName.lastIndexOf('.')
    const removedExtension = hostName.substring(
      0,
      hostName.length - (hostName.length - removeFrom)
    )
    return removedExtension
  } catch {
    return ' '
  }
}

function returnPopupHtml() {
  var popupHtml= `
  <style>
  .eluvium-image {
    width:50px;
    height:50px;
    float:left;
    margin-right: 2%;
  }
  #eluvium-notification-bar {
    position: fixed;
    width: 100%;
    top: 0;
    background-color: #0348bc;
    clear: both;
    z-index: 999;
  }
  
  #eluvium-notification-bar .container {
    width: 900px;
    height: 60px;
    margin: 0 auto;
    padding: 5px;
  }
  
  #eluvium-notification-bar p {
    display: inline-block;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    font-weight: 300;
    float: left;
    margin: 0 25px 0 0;
    padding: 0;
    line-height: 45px;
    color: #fff;
  }
  
  #eluvium-notification-bar a.eluvium-action {
    display: inline-block;
    width: 110px;
    height: 35px;
    line-height: 35px;
    margin-top: 5px;
    padding: 0px 12px;
    float: right;
    margin-right: 50px;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: bold;
    /* Safari 3-4, iOS 1-3.2, Android 1.6- */
    
    -webkit-border-radius: 5px;
    /* Firefox 1-3.6 */
    
    -moz-border-radius: 5px;
    /* Opera 10.5, IE 9, Safari 5, Chrome, Firefox 4, iOS 4, Android 2.1+ */
    opacity: .85;
    border-radius: 3px;
    text-align: center;
    background-color: #fff;
    color: #0348bc;
    text-decoration: none;
  }
  
  #eluvium-notification-bar a.eluvium-action:hover {
    opacity: 1;
  }
  
  .fa-times-circle {
    float: right;
    margin-top: 8px;
    font-size: 30px;
    color: #ddd;
    text-align: right;
    z-index: 9;
    cursor: pointer;
  }
  
  .fa-times-circle:hover {
    color: #fff;
  }
  
  @-webkit-keyframes goUp {
    0% {
      -webkit-transform: none;
      transform: none;
    }
    100% {
      -webkit-transform: translate3d(0, -100px, 0);
      transform: translate3d(0, -100px, 0);
    }
  }
  
  @keyframes goUp {
    0% {
      -webkit-transform: none;
      transform: none;
    }
    100% {
      -webkit-transform: translate3d(0, -100px, 0);
      transform: translate3d(0, -100px, 0);
    }
  }
  /* ANIMATION for go down */
  
  @-webkit-keyframes goDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }
  
  @keyframes goDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }
    100% {
      -webkit-transform: none;
      transform: none;
    }
  }
  </style>
    <div id="eluvium-notification-bar">
      <div class="container">
        <i id="eluvium-close" class="fa fa-times-circle"></i>
         <img class="eluvium-image" src="https://eluvium.info/Content/Front/images/logo.png">
        <p>Would you like to add your this Site Credentials to Eluvium?</p>
        <a id="eluvium-action" class="eluvium-action" href="#">Save <i class="fa fa-angle-right"></i></a>
      </div>
    </div>
  `;
  return popupHtml;
}

