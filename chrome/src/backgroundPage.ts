
chrome.windows.onRemoved.addListener(function(windowid) {
  localStorage.removeItem('password');
  localStorage.removeItem('tempPass');
 })

 chrome.runtime.onInstalled.addListener(function(details) {
  localStorage.removeItem('password');
  localStorage.removeItem('tempPass');
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.windows.getAll({populate: true}, function(windows) {
    let i = 0;
    windows.forEach(function(window) {
      window.tabs.forEach(function(tab) {
        i--;
      });
    });
    if (i === 0) {
      localStorage.removeItem('password');
      localStorage.removeItem('tempPass');
    }
  });
});

chrome.tabs.onCreated.addListener(function(tab) {
  chrome.windows.getAll({populate: true}, function(windows) {
    let i = 0;
    windows.forEach(function(window) {
      window.tabs.forEach(function() {
        i++;
      });
    });
    if (i === 0 || i === 1 ) {
      localStorage.removeItem('password');
      localStorage.removeItem('tempPass');
    }
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    setNotifyIcon(tab);
  });
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    setNotifyIcon(tab);
  });
});

function setNotifyIcon(tab) {
  localStorage.setItem('activeUrl', extractHostname(tab.url));
  const urlList: any[] = JSON.parse(localStorage.getItem('urlList'));
  const activeUrlName = extractHostname(tab.url);
  for (let i = 0; i < urlList.length; i++) {
     const matchingResult = isMatching(urlList[i].toLowerCase(), activeUrlName);
     const matchingResult2 = activeUrlName.includes(urlList[i].toLowerCase());
      if (matchingResult || matchingResult2) {
       console.log(urlList[i].toLowerCase() + ' similar to ' + activeUrlName);
       chrome.browserAction.setBadgeText({text: '+1'});
       break;
      } else {
        chrome.browserAction.setBadgeText({text: ''});
      }
  };
}

let interval = localStorage.getItem('interval');
if (interval !== '0' || interval !== null) {
  check(8000, function () {
    interval = localStorage.getItem('interval');
    const expire = localStorage.getItem('expire');
    const date = new Date();
    const expiredDate = new Date(expire)
    const result = Math.abs(expiredDate.getTime() - date.getTime());
    if (result === 0 || result < 0) {
      localStorage.removeItem('password');
      localStorage.removeItem('tempPass');
    }
 });
}
const extractHostname = (url) => {
  try {
  // use URL constructor and return hostname
  const hostName = new URL(url).hostname.replace('www.', '');
  const removeFrom = hostName.lastIndexOf('.');
  const removedExtension = hostName.substring(0, hostName.length - (hostName.length - removeFrom));
  return removedExtension;
  } catch { return ' '}
}

function isMatching(a, b) {
  return new RegExp('\\b(' + a.match(/\w+/g).join('|') + ')\\b', 'gi').test(b);
}
function check(timeout, cb) {
    let c = 0;
    setInterval(function () {
        if (++c >= timeout) {
            c = 0;
            setTimeout(cb, 0);
        }
    });
}
