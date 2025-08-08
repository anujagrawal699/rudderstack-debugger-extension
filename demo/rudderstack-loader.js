const RUDDERSTACK_WRITE_KEY = "30sRDqEbWHnbb6OfbsL0BgDHTkY";
const RUDDERSTACK_DATAPLANE_URL =
  "https://sggsbexmicwqne.dataplane.rudderstack.com";

!(function () {
  var e = (window.rudderanalytics = window.rudderanalytics || []);
  e.methods = [
    "load",
    "page",
    "track",
    "identify",
    "alias",
    "group",
    "ready",
    "reset",
    "getAnonymousId",
    "setAnonymousId",
    "getUserId",
    "getUserTraits",
    "getGroupId",
    "getGroupTraits",
  ];

  e.factory = function (t) {
    return function () {
      var e = Array.prototype.slice.call(arguments);
      return (
        e.unshift(t), window.rudderanalytics.push(e), window.rudderanalytics
      );
    };
  };

  for (var t = 0; t < e.methods.length; t++) {
    var r = e.methods[t];
    e[r] = e.factory(r);
  }

  e.loadJS = function (e, t) {
    var r = document.createElement("script");
    r.type = "text/javascript";
    r.async = !0;
    r.src = "https://cdn.rudderlabs.com/v3/rudder-analytics.min.js";
    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(r, a);
  };

  e.loadJS();

  window.rudderanalytics.load(RUDDERSTACK_WRITE_KEY, RUDDERSTACK_DATAPLANE_URL);

  window.rudderanalytics.ready(function () {
    console.log("RudderStack SDK is loaded and ready.");
  });
})();
