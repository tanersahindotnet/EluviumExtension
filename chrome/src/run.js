import * as $ from 'jquery';
var randomizeInputValue = function (el) {
  if ($(el).length != 0) {
    switch ($(el)[0].nodeName.toLowerCase()) {
      case "input":
        var type = $(el).attr('type');
        var value = username;
        if (type == 'password') {
          value = password;
        }
        $(el).focus().val(value);
        break;
    }
  }
};

var autoLogin = function () {
  var input = $("input[type=submit]", this);
  var button = $("button[type=submit]", this);

  setTimeout(function () {
    if (this.username !== "eluvium_generated_password_context" && this.autoSubmit == "true" && $("div.g-recaptcha").length == 0) {
      if (input !== null)
        input.click();

      if (button !== null);
      button.click();
    }
  }, 200)
}

chrome.runtime.sendMessage({
}, function () {
  $("input:enabled").not(':button,:hidden,input[type=submit],input[readonly]').each(function () {
    randomizeInputValue(this);
    autoLogin();
  });
});  