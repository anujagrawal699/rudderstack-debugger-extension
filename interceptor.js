(function () {
  "use strict";

  if (window.rudderStackDebuggerAttached) {
    return;
  }
  window.rudderStackDebuggerAttached = true;

  function initializeInterceptor() {
    const rudderanalytics = window.rudderanalytics;
    if (!rudderanalytics) {
      setTimeout(initializeInterceptor, 100);
      return;
    }

    const methodsToWrap = [
      "page",
      "track",
      "identify",
      "alias",
      "group",
      "reset",
    ];

    const wrapMethod = (methodName) => {
      const originalMethod = rudderanalytics[methodName];

      if (
        typeof originalMethod !== "function" ||
        originalMethod._isWrappedByDebugger
      ) {
        return;
      }

      const newWrappedMethod = function (...args) {
        window.postMessage(
          {
            source: "rudderstack-debugger",
            type: methodName,
            payload: args,
            timestamp: Date.now(),
          },
          "*"
        );
        return originalMethod.apply(this, args);
      };

      newWrappedMethod._isWrappedByDebugger = true;
      rudderanalytics[methodName] = newWrappedMethod;
    };

    methodsToWrap.forEach(wrapMethod);

    if (rudderanalytics.ready) {
      rudderanalytics.ready(() => {
        methodsToWrap.forEach(wrapMethod);

        if (!window.rudderStackConfigSent) {
          const config = {
            writeKey: rudderanalytics.writeKey,
            dataPlaneUrl: rudderanalytics.dataPlaneUrl,
          };

          if (config.writeKey && config.dataPlaneUrl) {
            window.postMessage(
              {
                source: "rudderstack-debugger",
                type: "config",
                payload: config,
                timestamp: Date.now(),
              },
              "*"
            );
            window.rudderStackConfigSent = true;
          }
        }
      });
    }
  }

  initializeInterceptor();
})();
