chrome.windows.onRemoved.addListener(function (windowid) {
  localStorage.removeItem("password");
  localStorage.removeItem("tempPass");
});

chrome.runtime.onInstalled.addListener(function (details) {
  localStorage.removeItem("password");
  localStorage.removeItem("tempPass");
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let i = 0;
    windows.forEach(function (window) {
      window.tabs.forEach(function (tab) {
        i--;
      });
    });
    if (i === 0) {
      localStorage.removeItem("password");
      localStorage.removeItem("tempPass");
      if (localStorage.getItem("clearCookies") === null) {
        erase();
      }
    }
  });
});

chrome.tabs.onCreated.addListener(function (tab) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    let i = 0;
    windows.forEach(function (window) {
      window.tabs.forEach(function () {
        i++;
      });
    });
    if (i === 0 || i === 1) {
      localStorage.removeItem("password");
      localStorage.removeItem("tempPass");
    }
  });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    setNotifyIcon(tab);
  });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    setNotifyIcon(tab);
  });
});

function setNotifyIcon(tab) {
  localStorage.setItem("activeUrl", extractHostname(tab.url));
  const urlList: any[] = JSON.parse(localStorage.getItem("urlList"));
  const activeUrlName = extractHostname(tab.url);
  for (let i = 0; i < urlList.length; i++) {
    const matchingResult = isMatching(urlList[i].toLowerCase(), activeUrlName);
    const matchingResult2 = activeUrlName.includes(urlList[i].toLowerCase());
    if (matchingResult || matchingResult2) {
      console.log(urlList[i].toLowerCase() + " similar to " + activeUrlName);
      chrome.browserAction.setBadgeBackgroundColor({ color: "#175ddc" });
      chrome.browserAction.setBadgeText({ text: "+1" });
      break;
    } else {
      chrome.browserAction.setBadgeText({ text: "" });
    }
  }
  if (localStorage.getItem("spoofingScreen") === null) {
    changeScreenResolution();
  }
}

let interval = localStorage.getItem("interval");
if (interval !== "0" || interval !== null) {
  check(8000, function () {
    interval = localStorage.getItem("interval");
    const expire = localStorage.getItem("expire");
    const date = new Date();
    const expiredDate = new Date(expire);
    const result = Math.abs(expiredDate.getTime() - date.getTime());
    if (result === 0 || result < 0) {
      localStorage.removeItem("password");
      localStorage.removeItem("tempPass");
    }
  });
}
const extractHostname = (url) => {
  try {
    // use URL constructor and return hostname
    const hostName = new URL(url).hostname.replace("www.", "");
    const removeFrom = hostName.lastIndexOf(".");
    const removedExtension = hostName.substring(
      0,
      hostName.length - (hostName.length - removeFrom)
    );
    return removedExtension;
  } catch {
    return " ";
  }
};

function isMatching(a, b) {
  return new RegExp("\\b(" + a.match(/\w+/g).join("|") + ")\\b", "gi").test(b);
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
//--------------------------------------------------Security Options --------------------------------------------------

/* 
Protection against WebRtc leak
Fingerprint protection
Clearing cookies, cache, history, form details, web storage like session storage storage etc
Block All Cookies
Block Youtube Tracers
Spoofing screen resolution Protection
*/

// Remove WebRTC local and public IP leakage
if (localStorage.getItem("webRtc") === null) {
  chrome.privacy.network.webRTCMultipleRoutesEnabled.set({
    value: false,
    scope: "regular",
  });

  chrome.privacy.network.webRTCNonProxiedUdpEnabled.set({
    value: false,
  });

  chrome.storage.local.set({
    rtcIPHandling: "default_public_interface_only",
  });
}

//Block flash player
if (localStorage.getItem("webRtc") === null) {
  chrome.contentSettings.plugins.set({
    primaryPattern: "<all_urls>",
    resourceIdentifier: {
      id: "adobe-flash-player",
    },
    setting: "block",
  });
}

// Change User agent Fingerprint protection
if (localStorage.getItem("fingerprint") === null) {
  var item = [
    "Mozilla/5.0 (Windows NT 6.1; rv:52.0) Gecko/20100101 Firefox/52.0",
  ];
  var userAgent = item[Math.floor(Math.random() * item.length)];
  var requestFilter = {
    urls: ["<all_urls>"],
  };
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      details.requestHeaders.push({ name: "DNT", value: "1" });
      var headers = details.requestHeaders;
      for (var i = 0, l = headers.length; i < l; ++i) {
        if (headers[i].name == "User-Agent") {
          break;
        }
      }
      if (i < headers.length) {
        headers[i].value = userAgent;
      }
      return { requestHeaders: headers };
    },
    requestFilter,
    ["requestHeaders", "blocking"]
  );
}

//Block Youtube Ads and Trackers
if (localStorage.getItem("blockAds") === null) {
  var numBlocked = 0;
  chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      // It is easier to ignore requests instead of modifying them - everything seems to work fine
      // Note that get_midroll_info response contains playerAds describing all of the ads in the video
      const ignore =
        details.url.indexOf("/get_video_info") != -1 ||
        details.url.indexOf("/api/stats/ads") != -1 ||
        details.url.indexOf("/pagead/conversion") != -1 ||
        details.url.indexOf("ad_companion") != -1 ||
        details.url.indexOf("get_midroll_info") != -1;
      if (ignore) {
        numBlocked++; // keep track of blocked requests
        //chrome.browserAction.setBadgeText({text: ''});
        //chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
        //hrome.browserAction.setBadgeText({text: (numBlocked > 99) ? "99+" : `${numBlocked}`});
      }
      return { cancel: ignore };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );
}

// Block all cookies except session cookies
if (localStorage.getItem("blockCookies") === null) {
  chrome.runtime.onInstalled.addListener(function () {
    chrome.contentSettings.cookies.set({
      primaryPattern: "<all_urls>",
      setting: "session_only",
    });
  });
}

// Remove all the browsing data
function erase() {
  chrome.browsingData.remove(
    {},
    {
      appcache: true,
      cache: true,
      downloads: true,
      cookies: true,
      fileSystems: true,
      formData: true,
      history: true,
      indexedDB: true,
      serverBoundCertificates: true,
      pluginData: true,
      passwords: true,
      webSQL: true,
    }
  );
  console.log("Erased");
}

// Change the screen resolution for spoofing screen resolution attacks
function changeScreenResolution() {
  var height = Math.floor(Math.random() * 900) + 700;
  var width = Math.floor(Math.random() * 800) + 700;
  var availHeight = Math.floor(Math.random() * 800) + 600;
  screen = new (function () {
    this.width = width;
    this.height = height;
    this.colorDepth = 24;
    this.availHeight = availHeight;
  })();
}
