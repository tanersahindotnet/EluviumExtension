chrome.windows.onRemoved.addListener(function (windowid) {
  localStorage.removeItem('password')
  localStorage.removeItem('tempPass')
})

chrome.runtime.onInstalled.addListener(function (details) {
  localStorage.removeItem('password')
  localStorage.removeItem('tempPass')
})

chrome.tabs.onRemoved.addListener(function (tabId) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let i = 0
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        i--
      })
    })
    if (i === 0) {
      localStorage.removeItem('password')
      localStorage.removeItem('tempPass')
    }
  })
})

chrome.tabs.onCreated.addListener(function (tab) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let i = 0
    windows.forEach(function (window) {
      window.tabs.forEach(function () {
        i++
      })
    })
    if (i === 0 || i === 1) {
      localStorage.removeItem('password')
      localStorage.removeItem('tempPass')
    }
  })
})

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0]
    setNotifyIcon(tab)
  })
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setNotifyIcon(tab)
  })
})

function setNotifyIcon (tab) {
  const urlList: any[] = JSON.parse(localStorage.getItem('urlList'))
  const activeUrlName = extractHostname(tab.url)
  for (let i = 0; i < urlList.length; i++) {
    const matchingResult = isMatching(urlList[i].toLowerCase(), activeUrlName)
    const matchingResult2 = activeUrlName.includes(urlList[i].toLowerCase())
    if (matchingResult || matchingResult2) {
      console.log(urlList[i].toLowerCase() + ' similar to ' + activeUrlName)
      localStorage.setItem('activeUrl', urlList[i].toLowerCase())
      chrome.browserAction.setBadgeBackgroundColor({ color: '#175ddc' })
      chrome.browserAction.setBadgeText({ text: '+1' })
      break
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
      localStorage.setItem('activeUrl',"")
    }
  }
}

let interval = localStorage.getItem('interval')
if (interval !== '0' || interval !== null) {
  check(8000, function () {
    interval = localStorage.getItem('interval')
    const expire = localStorage.getItem('expire')
    const date = new Date()
    const expiredDate = new Date(expire)
    const result = Math.abs(expiredDate.getTime() - date.getTime())
    if (result === 0 || result < 0) {
      localStorage.removeItem('password')
      localStorage.removeItem('tempPass')
    }
  })
}
const extractHostname = url => {
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

function isMatching (a, b) {
  return new RegExp('\\b(' + a.match(/\w+/g).join('|') + ')\\b', 'gi').test(b)
}
function check (timeout, cb) {
  let c = 0
  setInterval(function () {
    if (++c >= timeout) {
      c = 0
      setTimeout(cb, 0)
    }
  })
}

// ---------------------------------------------- Autofill -------------------------------------------------------------

function fill (username, password) {
  var autoSubmit = localStorage.getItem("autoSubmit") 
  chrome.tabs.executeScript(
    null,
    {
      code:
        'var username = "' + username + '"; var password = "' + password + '"; var autoSubmit = "' + autoSubmit + '";'
    },
    function () {
      chrome.tabs.executeScript(null, { file: 'run.js' })
    }
  )
}

//background.js

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request.action === "getTabUrl") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currentTab = tabs[0];
      var currentTabUrl = currentTab.url;
      var password = localStorage.getItem("password");
      var hashedPassword = localStorage.getItem('accountPasswordHashed')
      const token = localStorage.getItem('token')
      const mail = localStorage.getItem('mail')
      const deviceId = localStorage.getItem('deviceId')

      sendResponse({
        tabUrl: currentTabUrl,
        password: password,
        hashedPassword: hashedPassword, 
        token: token,
        mail: mail,
        deviceId: deviceId,
        savePopup: localStorage.getItem('savePopup')
      });
    });
    
    // Return true to indicate that the sendResponse function will be called asynchronously
    return true;
  }
  if(request.action === "autoFillCreditCard") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tabId = tabs[0].id;
      chrome.tabs.sendMessage(tabId, { action: "creditContentFill", item: request.item });
    });
    sendResponse({ done: true })
  }
  if(request.action === "autoFillPassword")  {
    if (request.item) {
      const userName = request.item.userName
      const password = request.item.sitePassword
      fill(userName, password)
      sendResponse({ done: true })
    }
  }
});

// Context Menus
chrome.contextMenus.create({
  title: "Generate Password",
  contexts:["editable"], 
  onclick: function(e){
    var password = generatePassword();
    fill("generated_password_context", password);
    copyToClipboard(password);
  } 
}); 

function generatePassword () {
  const numberChars = '0123456789'
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerChars = 'abcdefghiklmnopqrstuvwxyz'
  const symbolChars = '!+%&/()=?_->£#$½{[]}|'
  const allChars: string = numberChars + upperChars + lowerChars + symbolChars
  let randPasswordArray = Array(18)
  randPasswordArray.push(numberChars)
  randPasswordArray.push(upperChars)
  randPasswordArray.push(lowerChars)
  randPasswordArray.push(symbolChars)
  randPasswordArray = randPasswordArray.fill(allChars, 3)
  const result = shuffleArray(
    randPasswordArray.map(function (x) {
      return x[Math.floor(Math.random() * x.length)]
    })
  ).join('')
  return result;
}

 function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

function copyToClipboard(value) {
  var tempInput = document.createElement("input");
  tempInput.value = value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message == null)
  return

  var items = [];
  if(localStorage.getItem("syncLoginPassword") !== null)
  {
    items = JSON.parse(localStorage.getItem("syncLoginPassword"));
    items.push(request.message);
    localStorage.setItem("syncLoginPassword", JSON.stringify(items));
    return;
  }
  items.push(request.message);
  localStorage.setItem("syncLoginPassword", JSON.stringify(items));
});