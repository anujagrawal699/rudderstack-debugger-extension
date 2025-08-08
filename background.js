const connections = {};

chrome.runtime.onConnect.addListener(function (port) {
  const extensionListener = function (message) {
    if (message.name === "init") {
      connections[message.tabId] = port;
      port.onDisconnect.addListener(function () {
        delete connections[message.tabId];
      });
    }
  };
  port.onMessage.addListener(extensionListener);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.source !== "rudderstack-debugger") {
    return true;
  }

  if (sender.tab && sender.tab.id) {
    const tabId = sender.tab.id;
    if (connections[tabId]) {
      connections[tabId].postMessage(message);
    }
  }

  sendResponse({ received: true });
  return true;
});
