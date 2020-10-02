var config = {
  apiKey: "AIzaSyD1FfiwIWzbbn0rhqQg6ZF2KzVBOiqU7oQ",
  authDomain: "phish-ai-production.firebaseapp.com",
  databaseURL: "https://phish-ai-production.firebaseio.com",
  projectId: "phish-ai-production",
  storageBucket: "gs://phish-ai-production.appspot.com/",
  messagingSenderId: "976092427021"
};
var firebase = require('firebase');
firebase.initializeApp(config);
var db = firebase.firestore();
var domainsRef = db.collection('whitelist_domains');

var tabIdMap = {};
var tabIgnored = {};
var tabMalicious = {};

chrome.storage.local.get({
  idnEnable: true,
  aiEnable: true,
  userGuid: null,
  productKey: '',
}, function(items) {
  const idnEnable = items.idnEnable;
  const aiEnable = items.aiEnable;
  var userGuid = items.userGuid;
  var productKey = items.productKey;
  if (items.userGuid == null) {
      var userGuid = guid();
      chrome.storage.local.set({
          userGuid: userGuid
      }, function(items) {
          addListener(idnEnable, aiEnable, userGuid, productKey);
      });
  } else {
      addListener(idnEnable, aiEnable, userGuid, productKey);
  }
});

function addListener(idnEnable, aiEnable, user_email, productKey) {
  chrome.tabs.onUpdated.addListener(function mylistener(tabId, changedProps, tab) {
      if (changedProps.status != "complete") {
          return;
      }
      var prev_url = "";
      if (tabId in tabIdMap) {
          prev_url = tabIdMap[tabId];
      }
      tabIdMap[tabId] = tab.url;
      var domain = extractHostname(tab.url);

      if (isPageBlockedUrl(prev_url)) {
          if (tabId in tabIgnored) {
              tabIgnored[tabId].push(domain);
          } else {
              tabIgnored[tabId] = [domain];
          }
          return;
      }

      if ((tabId in tabIgnored) && (tabIgnored[tabId].indexOf(domain) > -1)) {
          return;
      }

      if (idnEnable && isDomainIDN(domain)) {
          chrome.tabs.update(tabId, {url: "page_blocked.html"});
          return;
      }

      if (aiEnable) {
          if (isSystemUrl(tab.url) || isPrivateIp(domain)) {
              return;
          }
          db.collection('whitelist_domains').where('domain', '==', domain)
              .get()
              .then(function(querySnapshot) {
                  if (querySnapshot.empty) {
                      chrome.tabs.captureVisibleTab(function(screenshotUrl) {
                          if (screenshotUrl === undefined) {
                              console.log('error: unable to take screenshot');
                              return;
                          }

                          var xhr = new XMLHttpRequest();
                          var FD = new FormData();

                          FD.append('url', tab.url);
                          FD.append('domain', domain);
                          FD.append('title', tab.title);
                          FD.append('screenshotURL', screenshotUrl);
                          FD.append('user_agent', navigator.userAgent);
                          FD.append('user_email', user_email);

                          xhr.open("POST", "https://api.phish.ai/url/check");
                          if (productKey != '') {
                              xhr.setRequestHeader("Authorization", "Bearer " + productKey);
                          }
                          xhr.onreadystatechange = function() { //Call a function when the state changes.
                              if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                                  res = JSON.parse(xhr.responseText);
                                  if (res['reputation'] === 'bad') {
                                      tabMalicious[tabId] = {zero_day: true, targeted_brand: res['target_brand']};
                                      chrome.tabs.update(tabId, {url: "page_blocked.html"});
                                  }
                              } else {
                                  console.log(xhr.responseText)
                              }
                          };

                          xhr.send(FD);

                      });
                  } else {
                      return;
                  }
              })
              .catch(function(error) {
                  console.log('error while getting whitelisted domains: ' + error);
              });
      }

  });
};











function isPrivateIp(ip) {
  return (
      /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ip) ||
      /^172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ip) ||
      /^192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ip) ||
      /^10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ip) ||
      /^169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ip) ||
      /^localhost$/.test(ip) ||
      /^$/.test(ip) ||
      /^about:blank$/.test(ip)
  )
}

function guid() {
  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var extractHostname = function(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

var isUnicode = function(str) {
  for (var i = 0, n = str.length; i < n; i++) {
      if (str.charCodeAt( i ) > 255) { return true; }
  }
  return false;
};

var isPageBlockedUrl = function(url) {
  var re = [/^chrome-extension:.*page_blocked.html#?$/,
            /^moz-extension:.*page_blocked.html#?$/]
  for (var i = 0; i < re.length; i++) {
      if (re[i].test(url)) {
          return true;
      }
  }
  return false;
};

var isDomainIDN = function(domain) {
  return (domain.startsWith('xn--') || domain.startsWith('www.xn--') || isUnicode(domain));
};

var isSystemUrl = function(url) {
  var re = [/^chrome-extension:/, /^chrome:/]
  for (var i = 0; i < re.length; i++) {
      if (re[i].test(url)) {
          return true;
      }
  }
  return false;
};
