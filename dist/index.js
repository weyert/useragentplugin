var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/detect-browser/index.js
var require_detect_browser = __commonJS({
  "node_modules/detect-browser/index.js"(exports) {
    "use strict";
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar)
              ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getNodeVersion = exports.detectOS = exports.parseUserAgent = exports.browserName = exports.detect = exports.ReactNativeInfo = exports.BotInfo = exports.SearchBotDeviceInfo = exports.NodeInfo = exports.BrowserInfo = void 0;
    var BrowserInfo = function() {
      function BrowserInfo2(name, version, os) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.type = "browser";
      }
      return BrowserInfo2;
    }();
    exports.BrowserInfo = BrowserInfo;
    var NodeInfo = function() {
      function NodeInfo2(version) {
        this.version = version;
        this.type = "node";
        this.name = "node";
        this.os = process.platform;
      }
      return NodeInfo2;
    }();
    exports.NodeInfo = NodeInfo;
    var SearchBotDeviceInfo = function() {
      function SearchBotDeviceInfo2(name, version, os, bot) {
        this.name = name;
        this.version = version;
        this.os = os;
        this.bot = bot;
        this.type = "bot-device";
      }
      return SearchBotDeviceInfo2;
    }();
    exports.SearchBotDeviceInfo = SearchBotDeviceInfo;
    var BotInfo = function() {
      function BotInfo2() {
        this.type = "bot";
        this.bot = true;
        this.name = "bot";
        this.version = null;
        this.os = null;
      }
      return BotInfo2;
    }();
    exports.BotInfo = BotInfo;
    var ReactNativeInfo = function() {
      function ReactNativeInfo2() {
        this.type = "react-native";
        this.name = "react-native";
        this.version = null;
        this.os = null;
      }
      return ReactNativeInfo2;
    }();
    exports.ReactNativeInfo = ReactNativeInfo;
    var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
    var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
    var REQUIRED_VERSION_PARTS = 3;
    var userAgentRules = [
      ["aol", /AOLShield\/([0-9\._]+)/],
      ["edge", /Edge\/([0-9\._]+)/],
      ["edge-ios", /EdgiOS\/([0-9\._]+)/],
      ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
      ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
      ["samsung", /SamsungBrowser\/([0-9\.]+)/],
      ["silk", /\bSilk\/([0-9._-]+)\b/],
      ["miui", /MiuiBrowser\/([0-9\.]+)$/],
      ["beaker", /BeakerBrowser\/([0-9\.]+)/],
      ["edge-chromium", /EdgA?\/([0-9\.]+)/],
      [
        "chromium-webview",
        /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/
      ],
      ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
      ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
      ["fxios", /FxiOS\/([0-9\.]+)/],
      ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
      ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
      ["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
      ["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
      ["pie", /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
      ["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
      ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ["ie", /MSIE\s(7\.0)/],
      ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ["android", /Android\s([0-9\.]+)/],
      ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ["safari", /Version\/([0-9\._]+).*Safari/],
      ["facebook", /FB[AS]V\/([0-9\.]+)/],
      ["instagram", /Instagram\s([0-9\.]+)/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
      ["curl", /^curl\/([0-9\.]+)$/],
      ["searchbot", SEARCHBOX_UA_REGEX]
    ];
    var operatingSystemRules = [
      ["iOS", /iP(hone|od|ad)/],
      ["Android OS", /Android/],
      ["BlackBerry OS", /BlackBerry|BB10/],
      ["Windows Mobile", /IEMobile/],
      ["Amazon OS", /Kindle/],
      ["Windows 3.11", /Win16/],
      ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
      ["Windows 98", /(Windows 98)|(Win98)/],
      ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
      ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
      ["Windows Server 2003", /(Windows NT 5.2)/],
      ["Windows Vista", /(Windows NT 6.0)/],
      ["Windows 7", /(Windows NT 6.1)/],
      ["Windows 8", /(Windows NT 6.2)/],
      ["Windows 8.1", /(Windows NT 6.3)/],
      ["Windows 10", /(Windows NT 10.0)/],
      ["Windows ME", /Windows ME/],
      ["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
      ["Open BSD", /OpenBSD/],
      ["Sun OS", /SunOS/],
      ["Chrome OS", /CrOS/],
      ["Linux", /(Linux)|(X11)/],
      ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
      ["QNX", /QNX/],
      ["BeOS", /BeOS/],
      ["OS/2", /OS\/2/]
    ];
    function detect2(userAgent) {
      if (!!userAgent) {
        return parseUserAgent(userAgent);
      }
      if (typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative") {
        return new ReactNativeInfo();
      }
      if (typeof navigator !== "undefined") {
        return parseUserAgent(navigator.userAgent);
      }
      return getNodeVersion();
    }
    exports.detect = detect2;
    function matchUserAgent(ua) {
      return ua !== "" && userAgentRules.reduce(function(matched, _a) {
        var browser = _a[0], regex = _a[1];
        if (matched) {
          return matched;
        }
        var uaMatch = regex.exec(ua);
        return !!uaMatch && [browser, uaMatch];
      }, false);
    }
    function browserName(ua) {
      var data = matchUserAgent(ua);
      return data ? data[0] : null;
    }
    exports.browserName = browserName;
    function parseUserAgent(ua) {
      var matchedRule = matchUserAgent(ua);
      if (!matchedRule) {
        return null;
      }
      var name = matchedRule[0], match = matchedRule[1];
      if (name === "searchbot") {
        return new BotInfo();
      }
      var versionParts = match[1] && match[1].split(".").join("_").split("_").slice(0, 3);
      if (versionParts) {
        if (versionParts.length < REQUIRED_VERSION_PARTS) {
          versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
        }
      } else {
        versionParts = [];
      }
      var version = versionParts.join(".");
      var os = detectOS(ua);
      var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
      if (searchBotMatch && searchBotMatch[1]) {
        return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
      }
      return new BrowserInfo(name, version, os);
    }
    exports.parseUserAgent = parseUserAgent;
    function detectOS(ua) {
      for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
        var _a = operatingSystemRules[ii], os = _a[0], regex = _a[1];
        var match = regex.exec(ua);
        if (match) {
          return os;
        }
      }
      return null;
    }
    exports.detectOS = detectOS;
    function getNodeVersion() {
      var isNode = typeof process !== "undefined" && process.version;
      return isNode ? new NodeInfo(process.version.slice(1)) : null;
    }
    exports.getNodeVersion = getNodeVersion;
    function createVersionParts(count) {
      var output = [];
      for (var ii = 0; ii < count; ii++) {
        output.push("0");
      }
      return output;
    }
  }
});

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  processEvent: () => processEvent,
  setupPlugin: () => setupPlugin
});
var import_detect_browser = __toESM(require_detect_browser());
function setupPlugin({ config, global }) {
  try {
    global.enableSegmentAnalyticsJs = config.enableSegmentAnalyticsJs === "true";
    global.overrideUserAgentDetails = config.overrideUserAgentDetails === "true";
    global.debugMode = config.debugMode === "true";
  } catch (e) {
    throw new Error("Failed to read the configuration");
  }
}
async function processEvent(event, { global }) {
  const availableKeysOfEvent = Object.keys(event.properties);
  let userAgent = "";
  if (global.enableSegmentAnalyticsJs) {
    const hasSegmentUserAgentKey = availableKeysOfEvent.includes("segment_userAgent");
    if (!hasSegmentUserAgentKey) {
      if (global.debugMode) {
        console.warn(`UserAgentPlugin.processEvent(): Event is missing segment_userAgent`);
      }
      return event;
    }
    userAgent = `${event.properties.segment_userAgent}`;
  } else {
    const hasUserAgentKey = availableKeysOfEvent.includes("$user-agent") || availableKeysOfEvent.includes("$useragent") || availableKeysOfEvent.includes("$user_agent");
    if (!hasUserAgentKey) {
      if (global.debugMode) {
        console.warn(`UserAgentPlugin.processEvent(): Event is missing $useragent or $user-agent`);
      }
      return event;
    }
    if (event.properties.$useragent) {
      userAgent = event.properties.$useragent;
    } else if (event.properties["$user-agent"]) {
      userAgent = event.properties["$user-agent"];
    } else if (event.properties.$user_agent) {
      userAgent = event.properties.$user_agent;
    }
    delete event.properties.$useragent;
    delete event.properties["$user-agent"];
    delete event.properties.$user_agent;
  }
  if (!userAgent || userAgent === "") {
    if (global.debugMode) {
      console.warn(`UserAgentPlugin.processEvent(): $useragent is empty`);
    }
    return event;
  }
  const agentInfo = (0, import_detect_browser.detect)(userAgent);
  const device = detectDevice(userAgent);
  const deviceType = detectDeviceType(userAgent);
  const eventProperties = Object.keys(event.properties);
  const hasBrowserProperties = eventProperties.some((value) => ["$browser", "$browser_version", "$os", "$device", "$device_type"].includes(value));
  if (!global.overrideUserAgentDetails && hasBrowserProperties) {
    if (global.debugMode) {
      console.warn(`UserAgentPlugin.processEvent(): The event has $browser, $browser_version, $os, $device, or $device_type but the option 'overrideUserAgentDetails' is not enabled.`);
    }
    return event;
  }
  event.properties["$device"] = device;
  event.properties["$device_type"] = deviceType;
  if (agentInfo) {
    event.properties["$browser"] = agentInfo.name;
    event.properties["$browser_version"] = agentInfo.version;
    event.properties["$os"] = agentInfo.os;
    event.properties["$browser_type"] = agentInfo.type;
  }
  return event;
}
function detectDevice(userAgent) {
  if (/Windows Phone/i.test(userAgent) || /WPDesktop/.test(userAgent)) {
    return "Windows Phone";
  } else if (/iPad/.test(userAgent)) {
    return "iPad";
  } else if (/iPod/.test(userAgent)) {
    return "iPod Touch";
  } else if (/iPhone/.test(userAgent)) {
    return "iPhone";
  } else if (/(BlackBerry|PlayBook|BB10)/i.test(userAgent)) {
    return "BlackBerry";
  } else if (/Android/.test(userAgent) && !/Mobile/.test(userAgent)) {
    return "Android Tablet";
  } else if (/Android/.test(userAgent)) {
    return "Android";
  } else {
    return "";
  }
}
function detectDeviceType(userAgent) {
  const device = detectDevice(userAgent);
  if (device === "iPad" || device === "Android Tablet") {
    return "Tablet";
  } else if (device) {
    return "Mobile";
  } else {
    return "Desktop";
  }
}
module.exports = __toCommonJS(plugin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  processEvent,
  setupPlugin
});
