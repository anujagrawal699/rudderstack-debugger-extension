(function () {
  "use strict";

  const SCRIPT_ID = "rudder-debugger-interceptor";
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = chrome.runtime.getURL("interceptor.js");
  script.type = "text/javascript";

  const target = document.head || document.documentElement;
  target.appendChild(script);

  window.addEventListener("message", function (event) {
    if (
      event.source !== window ||
      !event.data ||
      event.data.source !== "rudderstack-debugger"
    ) {
      return;
    }

    try {
      chrome.runtime.sendMessage(event.data);
    } catch (e) {
      // This can happen if the extension context is invalidated.
    }
  });
})();
