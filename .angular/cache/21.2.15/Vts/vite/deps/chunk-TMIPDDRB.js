// node_modules/@progress/kendo-common/dist/es/util.js
var isWindowAvailable = function() {
  return typeof window !== "undefined";
};

// node_modules/@progress/kendo-common/dist/es/support.js
var agentRxs = {
  wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
  fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
  android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)(\.(\d+(\.\d+)?))?/,
  iphone: /(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,
  ipad: /(iPad).*OS\s+(\d+)[\._]([\d_]+)/,
  meego: /(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,
  webos: /(webOS)\/(\d+)\.(\d+(\.\d+)?)/,
  blackberry: /(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,
  playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
  windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
  tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
  sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,
  ffos: /(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/
};
var osRxs = {
  ios: /^i(phone|pad|pod)$/i,
  android: /^android|fire$/i,
  blackberry: /^blackberry|playbook/i,
  windows: /windows/,
  wp: /wp/,
  flat: /sailfish|ffos|tizen/i,
  meego: /meego/
};
var desktopBrowserRxs = {
  edge: /(edge)[ \/]([\w.]+)/i,
  webkit: /(chrome)[ \/]([\w.]+)/i,
  safari: /(webkit)[ \/]([\w.]+)/i,
  opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
  msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
  mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
};
var mobileBrowserRxs = {
  omini: /Opera\sMini/i,
  omobile: /Opera\sMobi/i,
  firefox: /Firefox|Fennec/i,
  mobilesafari: /version\/.*safari/i,
  ie: /MSIE|Windows\sPhone/i,
  chrome: /chrome|crios/i,
  webkit: /webkit/i
};
var testRx = function(agent, rxs, dflt) {
  for (var rx in rxs) {
    if (rxs.hasOwnProperty(rx) && rxs[rx].test(agent)) {
      return rx;
    }
  }
  return dflt !== void 0 ? dflt : agent;
};
var detectMobileOS = function(ua) {
  var minorVersion;
  var match = [];
  for (var agent in agentRxs) {
    if (agentRxs.hasOwnProperty(agent)) {
      match = ua.match(agentRxs[agent]);
      if (!match) {
        continue;
      }
      if (agent === "windows" && "plugins" in window.navigator) {
        return null;
      }
      var os = {};
      os.device = agent;
      os.browser = testRx(ua, mobileBrowserRxs, "default");
      os.name = testRx(agent, osRxs);
      os[os.name] = true;
      os.majorVersion = match[2];
      os.minorVersion = match[3] ? match[3].replace("_", ".") : ".0";
      minorVersion = os.minorVersion.replace(".", "").substr(0, 2);
      os.flatVersion = os.majorVersion + minorVersion + new Array(3 - (minorVersion.length < 3 ? minorVersion.length : 2)).join("0");
      os.cordova = typeof window.PhoneGap !== void 0 || typeof window.cordova !== void 0;
      os.appMode = window.navigator.standalone || /file|local|wmapp/.test(window.location.protocol) || os.cordova;
      return os;
    }
  }
  return null;
};
var detectDesktopBrowser = function(ua) {
  var browserInfo = null;
  var match = [];
  for (var agent in desktopBrowserRxs) {
    if (desktopBrowserRxs.hasOwnProperty(agent)) {
      match = ua.match(desktopBrowserRxs[agent]);
      if (match) {
        browserInfo = {};
        browserInfo[agent] = true;
        browserInfo[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
        browserInfo.version = parseInt(document.documentMode || match[2], 10);
        break;
      }
    }
  }
  return browserInfo;
};
var userAgent = isWindowAvailable() && window.navigator ? window.navigator.userAgent : null;
var browser = userAgent ? detectDesktopBrowser(userAgent) : null;
var mobileOS = userAgent ? detectMobileOS(userAgent) : null;
var touch = isWindowAvailable() && "ontouchstart" in window;
var msPointers = browser && !browser.chrome && window.MSPointerEvent;
var pointers = browser && !browser.chrome && window.PointerEvent;
var touchEnabled = mobileOS && (touch || msPointers || pointers);

// node_modules/@progress/kendo-common/dist/es/accessors/field-list.js
var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
function fieldList(field) {
  var fields = [];
  field.replace(FIELD_REGEX, function(_match, index, indexAccessor, fieldName) {
    fields.push(index !== void 0 ? index : indexAccessor || fieldName);
  });
  return fields;
}

// node_modules/@progress/kendo-common/dist/es/accessors/getter.js
var getterCache = {};
getterCache["undefined"] = function(obj) {
  return obj;
};
function getter(field) {
  if (getterCache[field]) {
    return getterCache[field];
  }
  var fields = fieldList(field);
  getterCache[field] = function(obj) {
    var result = obj;
    for (var idx = 0; idx < fields.length && result; idx++) {
      result = result[fields[idx]];
    }
    return result;
  };
  return getterCache[field];
}

// node_modules/@progress/kendo-common/dist/es/accessors/setter.js
var setterCache = {};
setterCache["undefined"] = function(obj) {
  return obj;
};
var defaultValue = function(nextField, options) {
  return options && options.arrays && !isNaN(Number(nextField)) ? [] : {};
};
function setter(field) {
  if (setterCache[field]) {
    return setterCache[field];
  }
  var fields = fieldList(field);
  setterCache[field] = function(obj, value, options) {
    var root = obj;
    var depth = fields.length - 1;
    for (var idx = 0; idx < depth && root; idx++) {
      root = root[fields[idx]] = root[fields[idx]] || defaultValue(fields[idx + 1], options);
    }
    root[fields[depth]] = value;
  };
  return setterCache[field];
}

// node_modules/@progress/kendo-common/dist/es/parse-style.js
var reComment = /\/\*[\s\S]*?\*\//g;
var reDeclaration = /([^\s:;]+?)\s*:\s*((?:(?:url\(\s*(?:(?:[^"')\\]|\\.)*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])*?)\s*)(?=;|$)/gi;
var reDoubleQuoted = /&quot;|&#34;|&#x22;/gi;
var reSingleQuoted = /&apos;|&#39;|&#x27;/gi;
var doubleQuote = '"';
var singleQuote = "'";
var empty = "";
function replaceQuoteEntities(str) {
  return str.replace(reDoubleQuoted, doubleQuote).replace(reSingleQuoted, singleQuote);
}
function parseInlineStyles(styleString) {
  var styleObject = {};
  var input = replaceQuoteEntities((styleString || empty).replace(reComment, empty));
  var match = reDeclaration.exec(input), property, value;
  while (match !== null) {
    property = match[1].trim();
    value = match[2].trim();
    styleObject[property] = value;
    match = reDeclaration.exec(input);
  }
  return styleObject;
}

export {
  detectMobileOS,
  detectDesktopBrowser,
  mobileOS,
  pointers,
  touchEnabled,
  getter,
  setter,
  parseInlineStyles
};
//# sourceMappingURL=chunk-TMIPDDRB.js.map
