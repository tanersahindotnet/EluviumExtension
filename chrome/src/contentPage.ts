window.opener = null;
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
