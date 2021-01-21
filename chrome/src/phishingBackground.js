if (localStorage.getItem('phisAi') === null) {
    const resourceDomain = 'https://segasec.github.io/feed/phishing-domains.json';
    const resourceUrl = 'https://segasec.github.io/feed/phishing-urls.json';
    const browser = getBrowser();
    const updateTimeOfLocalStorage = 300000;
    const tabs = {};
    let allDomains = [];
    let allUrls = [];
    let localStorageTimer;
    let ignoreRiskPressed = false;
    let currentTabURL;

    function updateDomainsAndUrlsLists() {
        const domainsPromise = isFeedUpdated('domain');
        domainsPromise.then((isUpdated) => {
            if (isUpdated) {
                getUpdateInfo('domain');
            }
        });

        const urlsPromise = isFeedUpdated('url');
        urlsPromise.then((isUpdated) => {
            if (isUpdated) {
                getUpdateInfo('url');
            }
        });
        setDomainUpdate();
    }

    function setDomainUpdate() {
        const lastUpdate = new Date();
        localStorage.setItem('zelda_lastUpdate', lastUpdate.toUTCString());
    }

    function isFeedUpdated(reqInfo) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', reqInfo === 'domain' ? resourceDomain : resourceUrl, true);
            xhr.send();
            xhr.timeout = 4000;
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 0) {
                    const localData = reqInfo === 'domain' ? localStorage.getItem('zelda_blacklist_domains') : localStorage.getItem('zelda_blacklist_urls');
                    //In case localStorage is empty (at the first time) or the feed was updated return true.
                    (!localData || (localData && new Date(JSON.parse(localData)['lastModified']) < new Date(xhr.getResponseHeader('Last-Modified')))) ? resolve(true) : resolve(false);
                }
            };
            xhr.ontimeout = () => {
                reject(false);
            };
        });
    }

    function getUpdateInfo(reqInfo) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', reqInfo === 'domain' ? resourceDomain : resourceUrl, true);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 0) {
                updateLocalStorage(xhr, reqInfo);
            }
        };
        return true;
    }

    function updateLocalStorage(xhr, reqInfo) {
        const arrBlackListedUrls = JSON.parse(xhr.responseText);
        const blacklistAndLastModified = {};
        blacklistAndLastModified.lastModified = xhr.getResponseHeader('Last-Modified');
        if (reqInfo === 'domain') {
            blacklistAndLastModified.domains = arrBlackListedUrls;
            localStorage.setItem('zelda_blacklist_domains', JSON.stringify(blacklistAndLastModified));
            allDomains = blacklistAndLastModified.domains;
        } else {
            blacklistAndLastModified.urls = arrBlackListedUrls;
            localStorage.setItem('zelda_blacklist_urls', JSON.stringify(blacklistAndLastModified));
            allUrls = blacklistAndLastModified.urls;
        }
    }

    function getDomainFromFullURL(url_string) {
        const url = new URL(url_string);
        return url.hostname;
    }

    /*
        whitelist is for the check if the last domain was the error page
     */
    function addDomainToWhiteList(whiteList, currentDomain) {
        if (ignoreRiskPressed) {
            whiteList.add(currentDomain);
        }
    }

    function isDomain() {
        const currentDomain = getDomainFromFullURL(currentTabURL);
        allDomains = JSON.parse(localStorage.getItem('zelda_blacklist_domains')).domains;
        return allDomains.some(function (domain) {
            return currentDomain === domain || currentDomain.endsWith('.' + domain);
        });
    }

    function isUrl() {
        allUrls = JSON.parse(localStorage.getItem('zelda_blacklist_urls')).urls;
        return allUrls.some(function (domain) {
            return currentTabURL.startsWith(domain);
        });
    }

    function updateTabDetails(requestDetails) {
        const tabId = requestDetails.tabId;
        tabs[tabId] = {
            curTab: requestDetails.url,
            whitelist: tabs[tabId] ? tabs[tabId].whitelist : new Set(),
            prevTab: tabs[tabId] ? tabs[tabId].curTab : ''
        };
        currentTabURL = tabs[tabId].curTab;
    }

    function isMaliciousTabUnderRisk(tabId) {
        const currentDomain = getDomainFromFullURL(currentTabURL);
        const tabWhiteList = tabs[tabId].whitelist;
        return tabWhiteList.has(currentDomain);
    }

    function continueToSite(tabId) {
        const currentDomain = getDomainFromFullURL(currentTabURL);
        addDomainToWhiteList(tabs[tabId].whitelist, currentDomain);
        ignoreRiskPressed = false;
        browser.browserAction.setIcon({
            path: '../icons/icon_green.png'
        });
    }

    browser.webRequest.onBeforeRequest.addListener(
        (requestDetails) => {
            if (requestDetails.tabId >= 0) {
                updateTabDetails(requestDetails);
                const tabId = requestDetails.tabId;

                // Validation if the path is in the whitelist of the tab
                if (isMaliciousTabUnderRisk(tabId)) {
                    return;
                }

                if ((isDomain() || isUrl()) && !ignoreRiskPressed) {
                    localStorage.setItem('warning','1');
                    chrome.tabs.update(tabId, {url: "index.html"});
                }
                else {
                    continueToSite(tabId);
                    return { cancel: false };
                }
            }
        }, {
        urls: ['<all_urls>'], types: ['main_frame']
    }, ['blocking', 'requestBody']);

    browser.runtime.onMessage.addListener((request) => {
        if (request.ignoreRiskButton === true) {
            ignoreRiskPressed = true;
        }
    });

    function getBrowser() {
        return window.msBrowser || window.browser || window.chrome;
    }

    (function () {
        localStorageTimer = window.setInterval(updateDomainsAndUrlsLists, updateTimeOfLocalStorage);
        updateDomainsAndUrlsLists();
    })();

    window.onbeforeunload = function () {
        window.clearTimeout(localStorageTimer);
        return null;
    };

}
