chrome.runtime.onMessage.addListener((request, sender, respond) => {
  const handler = new Promise((resolve, reject) => {
    if (request) {
      resolve(`Hi from contentPage! You are currently on: ${window.location.href}`);
    } else {
      reject('request is empty.');
    }
  });

  handler.then(message => respond(message)).catch(error => respond(error));

  return true;
});

// Webapp content that is the youtube app #content(style-scope ytd-app)
const content = document.getElementsByTagName("ytd-app")[0];

const callback = function(mutationsList, observer) {
  // click the skip button
  const buttons:any = content.getElementsByClassName("ytp-ad-skip-button ytp-button");
  buttons != null && buttons.length > 0 && buttons[0].click();
  // remove any ad banners on the right
  console.log("Banner Removed");
  const banner = document.getElementById("companion");
  if (banner != null) banner.style.display = "none";
};

const observer = new MutationObserver(callback);
observer.observe(content, {childList: true, subtree: true});
