import {
  deflate$1
} from "./chunk-OTJQ4RF7.js";
import {
  parseInlineStyles
} from "./chunk-TMIPDDRB.js";
import {
  __export
} from "./chunk-N6ESDQJH.js";

// node_modules/@progress/kendo-drawing/dist/es/common/color/named-colors.js
var namedColors = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "00ffff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000000",
  blanchedalmond: "ffebcd",
  blue: "0000ff",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "00ffff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgrey: "a9a9a9",
  darkgreen: "006400",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "ff00ff",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  grey: "808080",
  green: "008000",
  greenyellow: "adff2f",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgrey: "d3d3d3",
  lightgreen: "90ee90",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "778899",
  lightslategrey: "778899",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "00ff00",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "ff00ff",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370d8",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "d87093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  red: "ff0000",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "ffffff",
  whitesmoke: "f5f5f5",
  yellow: "ffff00",
  yellowgreen: "9acd32"
};
var named_colors_default = namedColors;

// node_modules/@progress/kendo-drawing/dist/es/common/class.js
var Class = class {
  // Empty base class needed for compatibility with Kendo UI for jQuery
};

// node_modules/@progress/kendo-drawing/dist/es/common/support.js
function matchUserAgent(userAgent) {
  const browserRxs = {
    edge: /(edge)[ \/]([\w.]+)/i,
    webkit: /(chrome)[ \/]([\w.]+)/i,
    safari: /(webkit)[ \/]([\w.]+)/i,
    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
    msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
    mozilla: /(mozilla)(?:.*? rv:([\w.]+))/i
  };
  let browser5 = {};
  for (let agent in browserRxs) {
    if (browserRxs.hasOwnProperty(agent)) {
      const match = userAgent.match(browserRxs[agent]);
      if (match) {
        browser5[agent] = true;
        browser5[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
        browser5.version = parseInt(document.documentMode || match[2], 10);
        break;
      }
    }
  }
  return browser5;
}
var browser = null;
var support = {
  get browser() {
    if (typeof window === "undefined" || browser) {
      return browser;
    }
    browser = matchUserAgent(window.navigator.userAgent);
    return browser;
  }
};
var support_default = support;

// node_modules/@progress/kendo-drawing/dist/es/common/color/parse-color.js
var browser2 = support_default.browser;
var matchNamedColor = (color) => {
  const colorNames = Object.keys(named_colors_default);
  colorNames.push("transparent");
  const regexp = new RegExp("^(" + colorNames.join("|") + ")(\\W|$)", "i");
  matchNamedColor = (color2) => regexp.exec(color2);
  return regexp.exec(color);
};
var BaseColor = class extends Class {
  constructor() {
    super();
  }
  toHSV() {
    return this;
  }
  toRGB() {
    return this;
  }
  toHex(options2) {
    return this.toBytes().toHex(options2);
  }
  toBytes() {
    return this;
  }
  toCss(options2) {
    return "#" + this.toHex(options2);
  }
  toCssRgba() {
    const rgb = this.toBytes();
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${parseFloat(Number(this.a).toFixed(3))})`;
  }
  toCssHex() {
    if (this.a === 1) {
      return "#" + this.toHex();
    }
    return "#" + this.toHex({ alpha: true });
  }
  toDisplay() {
    if (browser2.msie && browser2.version < 9) {
      return this.toCss();
    }
    return this.toCssRgba();
  }
  equals(c) {
    return c === this || c !== null && c !== void 0 && this.toCssRgba() === parseColor(c).toCssRgba();
  }
  diff(other) {
    if (other === null) {
      return NaN;
    }
    const c1 = this.toBytes();
    const c2 = other.toBytes();
    return Math.sqrt(Math.pow((c1.r - c2.r) * 0.3, 2) + Math.pow((c1.g - c2.g) * 0.59, 2) + Math.pow((c1.b - c2.b) * 0.11, 2));
  }
  clone() {
    let c = this.toBytes();
    if (c === this) {
      c = new Bytes(c.r, c.g, c.b, c.a);
    }
    return c;
  }
};
var RGB = class extends BaseColor {
  constructor(r, g, b, a) {
    super();
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  toHSV() {
    const { r, g, b } = this;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    const v = max;
    let h, s;
    if (delta === 0) {
      return new HSV(0, 0, v, this.a);
    }
    if (max !== 0) {
      s = delta / max;
      if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    } else {
      s = 0;
      h = -1;
    }
    return new HSV(h, s, v, this.a);
  }
  toHSL() {
    const { r, g, b } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
    }
    return new HSL(h * 60, s * 100, l * 100, this.a);
  }
  toBytes() {
    return new Bytes(this.r * 255, this.g * 255, this.b * 255, this.a);
  }
};
var Bytes = class extends RGB {
  constructor(r, g, b, a) {
    super(Math.round(r), Math.round(g), Math.round(b), a);
  }
  toRGB() {
    return new RGB(this.r / 255, this.g / 255, this.b / 255, this.a);
  }
  toHSV() {
    return this.toRGB().toHSV();
  }
  toHSL() {
    return this.toRGB().toHSL();
  }
  toHex(options2) {
    let value = hex(this.r, 2) + hex(this.g, 2) + hex(this.b, 2);
    if (options2 && options2.alpha) {
      value += hex(Math.round(this.a * 255), 2);
    }
    return value;
  }
  toBytes() {
    return this;
  }
};
function hex(n, width, pad2 = "0") {
  let result = n.toString(16);
  while (width > result.length) {
    result = pad2 + result;
  }
  return result;
}
var HSV = class extends BaseColor {
  constructor(h, s, v, a) {
    super();
    this.h = h;
    this.s = s;
    this.v = v;
    this.a = a;
  }
  toRGB() {
    let { h, s, v } = this;
    let r, g, b;
    if (s === 0) {
      r = g = b = v;
    } else {
      h /= 60;
      const i = Math.floor(h);
      const f = h - i;
      const p = v * (1 - s);
      const q = v * (1 - s * f);
      const t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        default:
          r = v;
          g = p;
          b = q;
          break;
      }
    }
    return new RGB(r, g, b, this.a);
  }
  toHSL() {
    return this.toRGB().toHSL();
  }
  toBytes() {
    return this.toRGB().toBytes();
  }
};
var HSL = class extends BaseColor {
  constructor(h, s, l, a) {
    super();
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }
  toRGB() {
    let h = this.h / 360;
    let s = this.s / 100;
    let l = this.l / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return new RGB(r, g, b, this.a);
  }
  toHSV() {
    return this.toRGB().toHSV();
  }
  toBytes() {
    return this.toRGB().toBytes();
  }
};
function hue2rgb(p, q, s) {
  let t = s;
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
function alphaFromHex(a) {
  return parseFloat(parseFloat(parseInt(a, 16) / 255).toFixed(3));
}
function parseColor(value, safe) {
  let m, ret;
  if (!value || value === "none") {
    return null;
  }
  if (value instanceof BaseColor) {
    return value;
  }
  let color = value.toLowerCase();
  if (m = matchNamedColor(color)) {
    if (m[1] === "transparent") {
      color = new RGB(1, 1, 1, 0);
    } else {
      color = parseColor(named_colors_default[m[1]], safe);
    }
    color.match = [m[1]];
    return color;
  }
  if (m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/i.exec(color)) {
    ret = new Bytes(
      parseInt(m[1], 16),
      parseInt(m[2], 16),
      parseInt(m[3], 16),
      1
    );
  } else if (m = /^#?([0-9a-f])([0-9a-f])([0-9a-f])\b/i.exec(color)) {
    ret = new Bytes(
      parseInt(m[1] + m[1], 16),
      parseInt(m[2] + m[2], 16),
      parseInt(m[3] + m[3], 16),
      1
    );
  } else if (m = /^#?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])\b/i.exec(color)) {
    ret = new Bytes(
      parseInt(m[1] + m[1], 16),
      parseInt(m[2] + m[2], 16),
      parseInt(m[3] + m[3], 16),
      alphaFromHex(m[4] + m[4])
    );
  } else if (m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/i.exec(color)) {
    ret = new Bytes(
      parseInt(m[1], 16),
      parseInt(m[2], 16),
      parseInt(m[3], 16),
      alphaFromHex(m[4])
    );
  } else if (m = /^rgb\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/.exec(color)) {
    ret = new Bytes(
      parseInt(m[1], 10),
      parseInt(m[2], 10),
      parseInt(m[3], 10),
      1
    );
  } else if (m = /^rgba\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9.]+)\s*\)/.exec(color)) {
    ret = new Bytes(
      parseInt(m[1], 10),
      parseInt(m[2], 10),
      parseInt(m[3], 10),
      parseFloat(m[4])
    );
  } else if (m = /^rgb\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*\)/.exec(color)) {
    ret = new RGB(
      parseFloat(m[1]) / 100,
      parseFloat(m[2]) / 100,
      parseFloat(m[3]) / 100,
      1
    );
  } else if (m = /^rgba\(\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9]*\.?[0-9]+)%\s*,\s*([0-9.]+)\s*\)/.exec(color)) {
    ret = new RGB(
      parseFloat(m[1]) / 100,
      parseFloat(m[2]) / 100,
      parseFloat(m[3]) / 100,
      parseFloat(m[4])
    );
  } else if (m = /^color\(\s*srgb\s*([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s*(\/\s+([0-9]*\.?[0-9]+))?\)/.exec(color)) {
    ret = new RGB(
      parseFloat(m[1]),
      parseFloat(m[2]),
      parseFloat(m[3]),
      parseFloat(m[5] || "1")
    );
  }
  if (ret) {
    ret.match = m;
  } else if (!safe) {
    throw new Error("Cannot parse color: " + color);
  }
  return ret;
}

// node_modules/@progress/kendo-drawing/dist/es/common/color/color.js
var DARK_TRESHOLD = 180;
var Color = class _Color extends Class {
  constructor(value) {
    super();
    if (arguments.length === 1) {
      const formats = _Color.formats;
      const resolvedColor = this.resolveColor(value);
      for (let idx = 0; idx < formats.length; idx++) {
        const formatRegex = formats[idx].re;
        const processor = formats[idx].process;
        const parts = formatRegex.exec(resolvedColor);
        if (parts) {
          const channels = processor(parts);
          this.r = channels[0];
          this.g = channels[1];
          this.b = channels[2];
        }
      }
    } else {
      this.r = arguments[0];
      this.g = arguments[1];
      this.b = arguments[2];
    }
    this.r = this.normalizeByte(this.r);
    this.g = this.normalizeByte(this.g);
    this.b = this.normalizeByte(this.b);
  }
  toHex() {
    const pad2 = this.padDigit;
    const r = this.r.toString(16);
    const g = this.g.toString(16);
    const b = this.b.toString(16);
    return "#" + pad2(r) + pad2(g) + pad2(b);
  }
  resolveColor(value) {
    let color = value || "black";
    if (color.charAt(0) === "#") {
      color = color.substr(1, 6);
    }
    color = color.replace(/ /g, "");
    color = color.toLowerCase();
    color = _Color.namedColors[color] || color;
    return color;
  }
  normalizeByte(value) {
    if (value < 0 || isNaN(value)) {
      return 0;
    }
    return value > 255 ? 255 : value;
  }
  padDigit(value) {
    return value.length === 1 ? "0" + value : value;
  }
  brightness(value) {
    const round2 = Math.round;
    this.r = round2(this.normalizeByte(this.r * value));
    this.g = round2(this.normalizeByte(this.g * value));
    this.b = round2(this.normalizeByte(this.b * value));
    return this;
  }
  percBrightness() {
    return Math.sqrt(0.241 * this.r * this.r + 0.691 * this.g * this.g + 0.068 * this.b * this.b);
  }
  isDark() {
    return this.percBrightness() < DARK_TRESHOLD;
  }
  static fromBytes(r, g, b, a) {
    return new Bytes(r, g, b, a != null ? a : 1);
  }
  static fromRGB(r, g, b, a) {
    return new RGB(r, g, b, a != null ? a : 1);
  }
  static fromHSV(h, s, v, a) {
    return new HSV(h, s, v, a != null ? a : 1);
  }
  static fromHSL(h, s, l, a) {
    return new HSL(h, s, l, a != null ? a : 1);
  }
};
Color.formats = [{
  re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
  process: function(parts) {
    return [
      parseInt(parts[1], 10),
      parseInt(parts[2], 10),
      parseInt(parts[3], 10)
    ];
  }
}, {
  re: /^(\w{2})(\w{2})(\w{2})$/,
  process: function(parts) {
    return [
      parseInt(parts[1], 16),
      parseInt(parts[2], 16),
      parseInt(parts[3], 16)
    ];
  }
}, {
  re: /^(\w{1})(\w{1})(\w{1})$/,
  process: function(parts) {
    return [
      parseInt(parts[1] + parts[1], 16),
      parseInt(parts[2] + parts[2], 16),
      parseInt(parts[3] + parts[3], 16)
    ];
  }
}];
Color.namedColors = named_colors_default;
var color_default = Color;

// node_modules/@progress/kendo-drawing/dist/es/common/color/resolve-element-color.js
var elementStyles = (element) => element.ownerDocument.defaultView.getComputedStyle(element);
var fallbackColor = `#000000`;
var resolveColorFromDOM = (element, cssColor) => {
  const tempNode = document.createElement("div");
  if (element.parentElement) {
    element.parentElement.appendChild(tempNode);
  } else {
    element.appendChild(tempNode);
  }
  tempNode.style.color = `rgb(from ${cssColor} clamp(0, r, 255) clamp(0, g, 255) clamp(0, b, 255))`;
  const parsedColor = parseColor(elementStyles(tempNode).color, true);
  tempNode.remove();
  if (!parsedColor) {
    return fallbackColor;
  }
  return parsedColor.toCssHex();
};
function resolveElementColor(element, colorProp) {
  const cssColor = elementStyles(element).getPropertyValue(colorProp);
  let color = parseColor(cssColor, true);
  if (color) {
    return color.toCssHex();
  }
  return resolveColorFromDOM(element, cssColor);
}

// node_modules/@progress/kendo-drawing/dist/es/util.js
var util_exports = {};
__export(util_exports, {
  DEG_TO_RAD: () => DEG_TO_RAD,
  LRUCache: () => lru_cache_default,
  MAX_NUM: () => MAX_NUM,
  MIN_NUM: () => MIN_NUM,
  TextMetrics: () => text_metrics_default,
  append: () => append,
  arabicToRoman: () => arabicToRoman,
  bindEvents: () => bindEvents,
  createPromise: () => createPromise,
  defined: () => defined,
  definitionId: () => definitionId,
  deg: () => deg,
  elementOffset: () => elementOffset,
  elementPadding: () => elementPadding,
  elementScale: () => elementScale,
  elementSize: () => elementSize,
  elementStyles: () => elementStyles2,
  encodeBase64: () => encodeBase64,
  eventCoordinates: () => eventCoordinates,
  eventElement: () => eventElement,
  hashKey: () => hashKey,
  isTransparent: () => isTransparent,
  last: () => last,
  limitValue: () => limitValue,
  measureText: () => measureText,
  mergeSort: () => mergeSort,
  normalizeText: () => normalizeText,
  now: () => now_default,
  objectKey: () => objectKey,
  promiseAll: () => promiseAll,
  rad: () => rad,
  round: () => round,
  setInnerHTML: () => setInnerHTML,
  unbindEvents: () => unbindEvents,
  valueOrDefault: () => valueOrDefault
});

// node_modules/@progress/kendo-drawing/dist/es/util/append.js
function append(first, second) {
  first.push.apply(first, second);
  return first;
}

// node_modules/@progress/kendo-drawing/dist/es/util/arabic-to-roman.js
var literals = {
  1: "i",
  10: "x",
  100: "c",
  2: "ii",
  20: "xx",
  200: "cc",
  3: "iii",
  30: "xxx",
  300: "ccc",
  4: "iv",
  40: "xl",
  400: "cd",
  5: "v",
  50: "l",
  500: "d",
  6: "vi",
  60: "lx",
  600: "dc",
  7: "vii",
  70: "lxx",
  700: "dcc",
  8: "viii",
  80: "lxxx",
  800: "dccc",
  9: "ix",
  90: "xc",
  900: "cm",
  1e3: "m"
};
function arabicToRoman(n) {
  const values = [
    1e3,
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    90,
    80,
    70,
    60,
    50,
    40,
    30,
    20,
    10,
    9,
    8,
    7,
    6,
    5,
    4,
    3,
    2,
    1
  ];
  let roman = "";
  while (n > 0) {
    if (n < values[0]) {
      values.shift();
    } else {
      roman += literals[values[0]];
      n -= values[0];
    }
  }
  return roman;
}

// node_modules/@progress/kendo-drawing/dist/es/util/create-promise.js
function createPromise() {
  let resolveFn, rejectFn;
  const promise = new Promise((resolve, reject) => {
    resolveFn = (data) => {
      promise._state = "resolved";
      resolve(data);
      return promise;
    };
    rejectFn = (data) => {
      promise._state = "rejected";
      reject(data);
      return promise;
    };
  });
  promise._state = "pending";
  promise.resolve = resolveFn;
  promise.reject = rejectFn;
  promise.state = () => promise._state;
  return promise;
}

// node_modules/@progress/kendo-drawing/dist/es/util/defined.js
var UNDEFINED = "undefined";
function defined(value) {
  return typeof value !== UNDEFINED;
}

// node_modules/@progress/kendo-drawing/dist/es/util/definition-id.js
var defId = 1;
function definitionId() {
  return "kdef" + defId++;
}

// node_modules/@progress/kendo-drawing/dist/es/util/constants.js
var DEG_TO_RAD = Math.PI / 180;
var MAX_NUM = Number.MAX_VALUE;
var MIN_NUM = -Number.MAX_VALUE;

// node_modules/@progress/kendo-drawing/dist/es/util/deg.js
function deg(radians) {
  return radians / DEG_TO_RAD;
}

// node_modules/@progress/kendo-drawing/dist/es/util/encode-utf.js
var fromCharCode = String.fromCharCode;
var BOM = "þÿ";
function encodeUTF8(input) {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    let code = input.charCodeAt(i);
    if (55296 <= code && code <= 56319) {
      const hi = code;
      const low = input.charCodeAt(++i);
      if (!isNaN(low)) {
        code = (hi - 55296) * 1024 + (low - 56320) + 65536;
      }
    }
    if (code < 128) {
      output += fromCharCode(code);
    } else if (code < 2048) {
      output += fromCharCode(192 | code >>> 6);
      output += fromCharCode(128 | code & 63);
    } else if (code < 65536) {
      output += fromCharCode(224 | code >>> 12);
      output += fromCharCode(128 | code >>> 6 & 63);
      output += fromCharCode(128 | code & 63);
    } else if (code < 1114111) {
      output += fromCharCode(240 | code >>> 18);
      output += fromCharCode(128 | code >>> 12 & 63);
      output += fromCharCode(128 | code >>> 6 & 63);
      output += fromCharCode(128 | code & 63);
    }
  }
  return output;
}
function encodeUnit(codeUnit) {
  return fromCharCode(codeUnit >> 8) + fromCharCode(codeUnit & 255);
}
function encodeUTF16BE(input) {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 65535) {
      output += encodeUnit(c);
    } else {
      const lead = (c - 65536 >> 10) + 55296;
      const trail = (c - 65536 & 1023) + 56320;
      output += encodeUnit(lead);
      output += encodeUnit(trail);
    }
  }
  return output;
}

// node_modules/@progress/kendo-drawing/dist/es/util/encode-base64.js
var KEY_STR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function encodeBase64(input) {
  let output = "";
  let i = 0;
  const utfInput = encodeUTF8(input);
  while (i < utfInput.length) {
    let chr1 = utfInput.charCodeAt(i++);
    let chr2 = utfInput.charCodeAt(i++);
    let chr3 = utfInput.charCodeAt(i++);
    let enc1 = chr1 >> 2;
    let enc2 = (chr1 & 3) << 4 | chr2 >> 4;
    let enc3 = (chr2 & 15) << 2 | chr3 >> 6;
    let enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + KEY_STR.charAt(enc1) + KEY_STR.charAt(enc2) + KEY_STR.charAt(enc3) + KEY_STR.charAt(enc4);
  }
  return output;
}

// node_modules/@progress/kendo-drawing/dist/es/util/event-coordinates.js
function eventCoordinates(e) {
  if ((e.x || {}).location !== void 0) {
    return {
      x: e.x.location,
      y: e.y.location
    };
  }
  return {
    x: e.pageX || e.clientX || 0,
    y: e.pageY || e.clientY || 0
  };
}

// node_modules/@progress/kendo-drawing/dist/es/util/event-element.js
function eventElement(e = {}) {
  return e.touch ? e.touch.initialTouch : e.target;
}

// node_modules/@progress/kendo-drawing/dist/es/util/is-transparent.js
function isTransparent(color) {
  return color === "" || color === null || color === "none" || color === "transparent" || color === void 0;
}

// node_modules/@progress/kendo-drawing/dist/es/util/last.js
function last(array) {
  if (array) {
    return array[array.length - 1];
  }
}

// node_modules/@progress/kendo-drawing/dist/es/util/limit-value.js
function limitValue(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

// node_modules/@progress/kendo-drawing/dist/es/util/merge-sort.js
function mergeSort(a, cmp) {
  if (a.length < 2) {
    return a.slice();
  }
  function merge(a2, b) {
    var r = [], ai = 0, bi = 0, i = 0;
    while (ai < a2.length && bi < b.length) {
      if (cmp(a2[ai], b[bi]) <= 0) {
        r[i++] = a2[ai++];
      } else {
        r[i++] = b[bi++];
      }
    }
    if (ai < a2.length) {
      r.push.apply(r, a2.slice(ai));
    }
    if (bi < b.length) {
      r.push.apply(r, b.slice(bi));
    }
    return r;
  }
  return (function sort(a2) {
    if (a2.length <= 1) {
      return a2;
    }
    var m = Math.floor(a2.length / 2);
    var left = a2.slice(0, m);
    var right = a2.slice(m);
    left = sort(left);
    right = sort(right);
    return merge(left, right);
  })(a);
}

// node_modules/@progress/kendo-drawing/dist/es/util/now.js
var now = Date.now || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
var now_default = now;

// node_modules/@progress/kendo-drawing/dist/es/util/promise-all.js
function promiseAll(promises) {
  return Promise.all(promises);
}

// node_modules/@progress/kendo-drawing/dist/es/util/rad.js
function rad(degrees) {
  return degrees * DEG_TO_RAD;
}

// node_modules/@progress/kendo-drawing/dist/es/util/round.js
function pow(p) {
  if (p) {
    return Math.pow(10, p);
  }
  return 1;
}
function round(value, precision) {
  const power = pow(precision);
  return Math.round(value * power) / power;
}

// node_modules/@progress/kendo-drawing/dist/es/util/value-or-default.js
function valueOrDefault(value, defaultValue) {
  return value !== void 0 ? value : defaultValue;
}

// node_modules/@progress/kendo-drawing/dist/es/util/bind-events.js
function bindEvents(element, events2) {
  for (let eventName in events2) {
    const eventNames = eventName.trim().split(" ");
    for (let idx = 0; idx < eventNames.length; idx++) {
      element.addEventListener(eventNames[idx], events2[eventName], false);
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/util/element-offset.js
function elementOffset(element) {
  const box = element.getBoundingClientRect();
  const documentElement = document.documentElement;
  return {
    top: box.top + (window.pageYOffset || documentElement.scrollTop) - (documentElement.clientTop || 0),
    left: box.left + (window.pageXOffset || documentElement.scrollLeft) - (documentElement.clientLeft || 0)
  };
}

// node_modules/@progress/kendo-drawing/dist/es/util/element-styles.js
function elementStyles2(element, styles) {
  const result = {};
  const style = window.getComputedStyle(element) || {};
  const stylesArray = Array.isArray(styles) ? styles : [styles];
  for (let idx = 0; idx < stylesArray.length; idx++) {
    let field = stylesArray[idx];
    result[field] = style[field];
  }
  return result;
}

// node_modules/@progress/kendo-drawing/dist/es/util/element-size.js
function getPixels(value) {
  if (isNaN(value)) {
    return value;
  }
  return value + "px";
}
function elementSize(element, size) {
  if (size) {
    const { width, height } = size;
    if (width !== void 0) {
      element.style.width = getPixels(width);
    }
    if (height !== void 0) {
      element.style.height = getPixels(height);
    }
  } else {
    const size2 = elementStyles2(element, ["width", "height"]);
    return {
      width: parseInt(size2.width, 10),
      height: parseInt(size2.height, 10)
    };
  }
}

// node_modules/@progress/kendo-drawing/dist/es/util/unbind-events.js
function unbindEvents(element, events2 = {}) {
  for (let name in events2) {
    const eventNames = name.trim().split(" ");
    for (let idx = 0; idx < eventNames.length; idx++) {
      element.removeEventListener(eventNames[idx], events2[name], false);
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/util/element-padding.js
function elementPadding(element) {
  const { paddingLeft, paddingTop } = elementStyles2(element, ["paddingLeft", "paddingTop"]);
  return {
    top: parseFloat(paddingTop),
    left: parseFloat(paddingLeft)
  };
}

// node_modules/@progress/kendo-drawing/dist/es/common/observable.js
var Observable = class extends Class {
  constructor() {
    super();
    this._events = {};
  }
  bind(eventName, handlers, one) {
    const eventNames = getArray(eventName);
    const handlersIsFunction = isFunction(handlers);
    const length = eventNames.length;
    if (handlers === void 0) {
      for (let field in eventName) {
        this.bind(field, eventName[field]);
      }
      return this;
    }
    for (let idx = 0; idx < length; idx++) {
      const eventName2 = eventNames[idx];
      let handler = handlersIsFunction ? handlers : handlers[eventName2];
      if (handler) {
        if (one) {
          const original = handler;
          handler = () => {
            this.unbind(eventName2, handler);
            original.apply(this, arguments);
          };
          handler.original = original;
        }
        let events2 = this._events[eventName2] = this._events[eventName2] || [];
        events2.push(handler);
      }
    }
    return this;
  }
  one(eventNames, handlers) {
    return this.bind(eventNames, handlers, true);
  }
  first(eventName, handlers) {
    const eventNames = getArray(eventName);
    const handlersIsFunction = isFunction(handlers);
    for (let idx = 0, length = eventNames.length; idx < length; idx++) {
      const eventName2 = eventNames[idx];
      const handler = handlersIsFunction ? handlers : handlers[eventName2];
      if (handler) {
        const events2 = this._events[eventName2] = this._events[eventName2] || [];
        events2.unshift(handler);
      }
    }
    return this;
  }
  trigger(eventName, e = {}) {
    let events2 = this._events[eventName];
    if (events2) {
      const length = events2.length;
      e.sender = this;
      e._defaultPrevented = false;
      e.preventDefault = preventDefault;
      e.isDefaultPrevented = isDefaultPrevented;
      events2 = events2.slice();
      for (let idx = 0; idx < length; idx++) {
        events2[idx].call(this, e);
      }
      return e._defaultPrevented === true;
    }
    return false;
  }
  unbind(eventName, handler) {
    const events2 = this._events[eventName];
    if (eventName === void 0) {
      this._events = {};
    } else if (events2) {
      if (handler) {
        for (let idx = events2.length - 1; idx >= 0; idx--) {
          if (events2[idx] === handler || events2[idx].original === handler) {
            events2.splice(idx, 1);
          }
        }
      } else {
        this._events[eventName] = [];
      }
    }
    return this;
  }
};
function isFunction(value) {
  return typeof value === "function";
}
function getArray(value) {
  return typeof value === "string" ? [value] : value;
}
function preventDefault() {
  this._defaultPrevented = true;
}
function isDefaultPrevented() {
  return this._defaultPrevented === true;
}
var observable_default = Observable;

// node_modules/@progress/kendo-drawing/dist/es/common/animation-frame.js
var animationFrameProxy = (callback) => {
  const wnd = typeof window !== "undefined" ? window : {};
  const animationFrame = wnd.requestAnimationFrame || wnd.webkitRequestAnimationFrame || wnd.mozRequestAnimationFrame || wnd.oRequestAnimationFrame || wnd.msRequestAnimationFrame || function(callback2) {
    setTimeout(callback2, 1e3 / 60);
  };
  animationFrameProxy = (callback2) => animationFrame.call(wnd, callback2);
  animationFrameProxy(callback);
};
var animation_frame_default = animationFrameProxy;

// node_modules/@progress/kendo-drawing/dist/es/common/html-encode.js
var ampRegExp = /&/g;
var ltRegExp = /</g;
var quoteRegExp = /"/g;
var aposRegExp = /'/g;
var gtRegExp = />/g;
function htmlEncode(value) {
  return String(value).replace(ampRegExp, "&amp;").replace(ltRegExp, "&lt;").replace(gtRegExp, "&gt;").replace(quoteRegExp, "&quot;").replace(aposRegExp, "&#39;");
}

// node_modules/@progress/kendo-drawing/dist/es/common/log-to-console.js
function logToConsole(message) {
  const console = window.console;
  if (typeof console != "undefined" && console.log) {
    console.log(message);
  }
}

// node_modules/@progress/kendo-drawing/dist/es/common/template.js
function template() {
  throw new Error("Template implementation missing.");
}

// node_modules/@progress/kendo-drawing/dist/es/common/throttle.js
function throttle(fn, delay) {
  let lastExecTime = 0;
  let timeout;
  if (!delay || delay <= 0) {
    return fn;
  }
  const throttled = function() {
    const elapsed = now_default() - lastExecTime;
    const args = arguments;
    const exec = function() {
      fn.apply(null, args);
      lastExecTime = now_default();
    };
    if (!lastExecTime) {
      return exec();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    if (elapsed > delay) {
      exec();
    } else {
      timeout = setTimeout(exec, delay - elapsed);
    }
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
  };
  return throttled;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/matrix.js
var Matrix = class _Matrix extends Class {
  constructor(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }
  multiplyCopy(matrix) {
    return new _Matrix(
      this.a * matrix.a + this.c * matrix.b,
      this.b * matrix.a + this.d * matrix.b,
      this.a * matrix.c + this.c * matrix.d,
      this.b * matrix.c + this.d * matrix.d,
      this.a * matrix.e + this.c * matrix.f + this.e,
      this.b * matrix.e + this.d * matrix.f + this.f
    );
  }
  invert() {
    const { a, b, c: d, d: e, e: g, f: h } = this;
    const det = a * e - b * d;
    if (det === 0) {
      return null;
    }
    return new _Matrix(
      e / det,
      -b / det,
      -d / det,
      a / det,
      (d * h - e * g) / det,
      (b * g - a * h) / det
    );
  }
  clone() {
    return new _Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
  }
  equals(other) {
    if (!other) {
      return false;
    }
    return this.a === other.a && this.b === other.b && this.c === other.c && this.d === other.d && this.e === other.e && this.f === other.f;
  }
  round(precision) {
    this.a = round(this.a, precision);
    this.b = round(this.b, precision);
    this.c = round(this.c, precision);
    this.d = round(this.d, precision);
    this.e = round(this.e, precision);
    this.f = round(this.f, precision);
    return this;
  }
  toArray(precision) {
    const result = [this.a, this.b, this.c, this.d, this.e, this.f];
    if (precision !== void 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] = round(result[i], precision);
      }
    }
    return result;
  }
  toString(precision, separator = ",") {
    return this.toArray(precision).join(separator);
  }
  static translate(x, y) {
    return new _Matrix(1, 0, 0, 1, x, y);
  }
  static unit() {
    return new _Matrix(1, 0, 0, 1, 0, 0);
  }
  static rotate(angle, x, y) {
    const matrix = new _Matrix();
    matrix.a = Math.cos(rad(angle));
    matrix.b = Math.sin(rad(angle));
    matrix.c = -matrix.b;
    matrix.d = matrix.a;
    matrix.e = x - x * matrix.a + y * matrix.b || 0;
    matrix.f = y - y * matrix.a - x * matrix.b || 0;
    return matrix;
  }
  static scale(scaleX, scaleY) {
    return new _Matrix(scaleX, 0, 0, scaleY, 0, 0);
  }
};
Matrix.IDENTITY = Matrix.unit();
var matrix_default = Matrix;

// node_modules/@progress/kendo-drawing/dist/es/util/element-scale.js
var matrixRegexp = /matrix\((.*)\)/;
function parseMatrix(matrixString) {
  const match = matrixString.match(matrixRegexp);
  if (match === null || match.length !== 2) {
    return matrix_default.unit();
  }
  const members = match[1].split(",").map((x) => parseFloat(x));
  return new matrix_default(...members);
}
function transformMatrix(element) {
  const transform2 = getComputedStyle(element).transform;
  if (transform2 === "none") {
    return matrix_default.unit();
  }
  return parseMatrix(transform2);
}
function elementScale(element) {
  if (!element) {
    return matrix_default.unit();
  }
  let matrix = transformMatrix(element);
  let parent = element.parentElement;
  while (parent) {
    const parentMatrix = transformMatrix(parent);
    matrix = matrix.multiplyCopy(parentMatrix);
    parent = parent.parentElement;
  }
  matrix.b = matrix.c = matrix.e = matrix.f = 0;
  return matrix;
}

// node_modules/@progress/kendo-drawing/dist/es/text-metrics/lru-cache.js
var LRUCache = class extends Class {
  constructor(size) {
    super();
    this._size = size;
    this._length = 0;
    this._map = {};
  }
  put(key, value) {
    const map = this._map;
    const entry = { key, value };
    map[key] = entry;
    if (!this._head) {
      this._head = this._tail = entry;
    } else {
      this._tail.newer = entry;
      entry.older = this._tail;
      this._tail = entry;
    }
    if (this._length >= this._size) {
      map[this._head.key] = null;
      this._head = this._head.newer;
      this._head.older = null;
    } else {
      this._length++;
    }
  }
  get(key) {
    const entry = this._map[key];
    if (entry) {
      if (entry === this._head && entry !== this._tail) {
        this._head = entry.newer;
        this._head.older = null;
      }
      if (entry !== this._tail) {
        if (entry.older) {
          entry.older.newer = entry.newer;
          entry.newer.older = entry.older;
        }
        entry.older = this._tail;
        entry.newer = null;
        this._tail.newer = entry;
        this._tail = entry;
      }
      return entry.value;
    }
  }
};
var lru_cache_default = LRUCache;

// node_modules/@progress/kendo-drawing/dist/es/text-metrics/util.js
var REPLACE_REGEX = /\r?\n|\r|\t/g;
var SPACE = " ";
function normalizeText(text) {
  return String(text).replace(REPLACE_REGEX, SPACE);
}
function objectKey(object) {
  const parts = [];
  for (let key in object) {
    parts.push(key + object[key]);
  }
  return parts.sort().join("");
}
function hashKey(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; ++i) {
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash ^= str.charCodeAt(i);
  }
  return hash >>> 0;
}

// node_modules/@progress/kendo-drawing/dist/es/text-metrics/text-metrics.js
function zeroSize() {
  return { width: 0, height: 0, baseline: 0 };
}
var DEFAULT_OPTIONS = {
  baselineMarkerSize: 1
};
var defaultMeasureBox;
if (typeof document !== "undefined") {
  defaultMeasureBox = document.createElement("div");
  defaultMeasureBox.style.setProperty("position", "absolute", "important");
  defaultMeasureBox.style.setProperty("top", "-4000px", "important");
  defaultMeasureBox.style.setProperty("width", "auto", "important");
  defaultMeasureBox.style.setProperty("height", "auto", "important");
  defaultMeasureBox.style.setProperty("padding", "0", "important");
  defaultMeasureBox.style.setProperty("margin", "0", "important");
  defaultMeasureBox.style.setProperty("border", "0", "important");
  defaultMeasureBox.style.setProperty("line-height", "normal", "important");
  defaultMeasureBox.style.setProperty("visibility", "hidden", "important");
  defaultMeasureBox.style.setProperty("white-space", "pre", "important");
}
var TextMetrics = class extends Class {
  constructor(options2) {
    super();
    this._cache = new lru_cache_default(1e3);
    this.options = Object.assign({}, DEFAULT_OPTIONS, options2);
  }
  measure(text, style, options2 = {}) {
    if (typeof text === "undefined" || text === null) {
      return zeroSize();
    }
    const styleKey = objectKey(style);
    const cacheKey = hashKey(text + styleKey);
    const cachedResult = this._cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const size = zeroSize();
    const measureBox = options2.box || defaultMeasureBox;
    const baselineMarker = this._baselineMarker().cloneNode(false);
    for (let key in style) {
      let value = style[key];
      if (typeof value !== "undefined") {
        measureBox.style[key] = value;
      }
    }
    const textStr = options2.normalizeText !== false ? normalizeText(text) : String(text);
    measureBox.textContent = textStr;
    measureBox.appendChild(baselineMarker);
    document.body.appendChild(measureBox);
    if (textStr.length) {
      size.width = measureBox.offsetWidth - this.options.baselineMarkerSize;
      size.height = measureBox.offsetHeight;
      size.baseline = baselineMarker.offsetTop + this.options.baselineMarkerSize;
    }
    if (size.width > 0 && size.height > 0) {
      this._cache.put(cacheKey, size);
    }
    measureBox.parentNode.removeChild(measureBox);
    return size;
  }
  _baselineMarker() {
    const marker = document.createElement("div");
    marker.style.display = "inline-block";
    marker.style.verticalAlign = "baseline";
    marker.style.width = this.options.baselineMarkerSize + "px";
    marker.style.height = this.options.baselineMarkerSize + "px";
    marker.style.overflow = "hidden";
    return marker;
  }
};
TextMetrics.current = new TextMetrics();
var text_metrics_default = TextMetrics;

// node_modules/@progress/kendo-drawing/dist/es/text-metrics/measure-text.js
function measureText(text, style, measureBox) {
  return text_metrics_default.current.measure(text, style, measureBox);
}

// node_modules/@progress/kendo-drawing/dist/es/util/element-set-styles-safe.js
var setStyle = (element, styleString) => {
  const styles = parseInlineStyles(styleString);
  Object.keys(styles).forEach((key) => {
    element.style[key] = styles[key];
  });
};
var styleAttr = "data-style";
var replaceStyleAttr = (html) => (html || "").replace(/\sstyle=/g, " " + styleAttr + "=");
var restoreStyleAttr = (container) => {
  Array.from(container.querySelectorAll("[" + styleAttr + "]")).forEach((element) => {
    const styleString = element.getAttribute(styleAttr);
    element.removeAttribute(styleAttr);
    setStyle(element, styleString);
  });
};
var setInnerHTML = (container, html) => {
  container.innerHTML = replaceStyleAttr(html);
  restoreStyleAttr(container);
};
var prependElement = (container, html) => {
  const tempContainer = document.createElement("div");
  setInnerHTML(tempContainer, html);
  if (tempContainer.firstElementChild) {
    container.insertBefore(tempContainer.firstElementChild, container.firstChild);
  }
};

// node_modules/@progress/kendo-drawing/dist/es/pdf/utils.js
var HAS_TYPED_ARRAYS = typeof Uint8Array !== "undefined" && support_default.browser && (!support_default.browser.msie || support_default.browser.version > 9);
var BASE64 = /* @__PURE__ */ (function() {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  return {
    decode: function(str) {
      var input = str.replace(/[^A-Za-z0-9\+\/\=]/g, ""), i = 0, n = input.length, output = [];
      while (i < n) {
        var enc1 = keyStr.indexOf(input.charAt(i++));
        var enc2 = keyStr.indexOf(input.charAt(i++));
        var enc3 = keyStr.indexOf(input.charAt(i++));
        var enc4 = keyStr.indexOf(input.charAt(i++));
        var chr1 = enc1 << 2 | enc2 >>> 4;
        var chr2 = (enc2 & 15) << 4 | enc3 >>> 2;
        var chr3 = (enc3 & 3) << 6 | enc4;
        output.push(chr1);
        if (enc3 != 64) {
          output.push(chr2);
        }
        if (enc4 != 64) {
          output.push(chr3);
        }
      }
      return output;
    },
    encode: function(bytes) {
      var i = 0, n = bytes.length;
      var output = "";
      while (i < n) {
        var chr1 = bytes[i++];
        var chr2 = bytes[i++];
        var chr3 = bytes[i++];
        var enc1 = chr1 >>> 2;
        var enc2 = (chr1 & 3) << 4 | chr2 >>> 4;
        var enc3 = (chr2 & 15) << 2 | chr3 >>> 6;
        var enc4 = chr3 & 63;
        if (i - n == 2) {
          enc3 = enc4 = 64;
        } else if (i - n == 1) {
          enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
      }
      return output;
    }
  };
})();
function BinaryStream(data) {
  var offset = 0, length = 0;
  if (data == null) {
    data = HAS_TYPED_ARRAYS ? new Uint8Array(256) : [];
  } else {
    length = data.length;
  }
  var ensure = HAS_TYPED_ARRAYS ? function(len) {
    if (len >= data.length) {
      var tmp = new Uint8Array(Math.max(len + 256, data.length * 2));
      tmp.set(data, 0);
      data = tmp;
    }
  } : function() {
  };
  var get = HAS_TYPED_ARRAYS ? function() {
    return new Uint8Array(data.buffer, 0, length);
  } : function() {
    return data;
  };
  var write = HAS_TYPED_ARRAYS ? function(bytes) {
    if (typeof bytes == "string") {
      return writeString(bytes);
    }
    var len = bytes.length;
    ensure(offset + len);
    data.set(bytes, offset);
    offset += len;
    if (offset > length) {
      length = offset;
    }
  } : function(bytes) {
    if (typeof bytes == "string") {
      return writeString(bytes);
    }
    for (var i = 0; i < bytes.length; ++i) {
      writeByte(bytes[i]);
    }
  };
  var slice3 = HAS_TYPED_ARRAYS ? function(start, length2) {
    if (data.buffer.slice) {
      return new Uint8Array(data.buffer.slice(start, start + length2));
    } else {
      var x = new Uint8Array(length2);
      x.set(new Uint8Array(data.buffer, start, length2));
      return x;
    }
  } : function(start, length2) {
    return data.slice(start, start + length2);
  };
  function eof() {
    return offset >= length;
  }
  function readByte() {
    return offset < length ? data[offset++] : 0;
  }
  function writeByte(b) {
    ensure(offset);
    data[offset++] = b & 255;
    if (offset > length) {
      length = offset;
    }
  }
  function readShort() {
    return readByte() << 8 | readByte();
  }
  function writeShort(w) {
    writeByte(w >> 8);
    writeByte(w);
  }
  function readShort_() {
    var w = readShort();
    return w >= 32768 ? w - 65536 : w;
  }
  function writeShort_(w) {
    writeShort(w < 0 ? w + 65536 : w);
  }
  function readLong() {
    return readShort() * 65536 + readShort();
  }
  function writeLong(w) {
    writeShort(w >>> 16 & 65535);
    writeShort(w & 65535);
  }
  function readLong_() {
    var w = readLong();
    return w >= 2147483648 ? w - 4294967296 : w;
  }
  function writeLong_(w) {
    writeLong(w < 0 ? w + 4294967296 : w);
  }
  function readFixed() {
    return readLong() / 65536;
  }
  function writeFixed(f) {
    writeLong(Math.round(f * 65536));
  }
  function readFixed_() {
    return readLong_() / 65536;
  }
  function writeFixed_(f) {
    writeLong_(Math.round(f * 65536));
  }
  function read(len) {
    return times(len, readByte);
  }
  function readString(len) {
    return String.fromCharCode.apply(String, read(len));
  }
  function writeString(str) {
    for (var i = 0; i < str.length; ++i) {
      writeByte(str.charCodeAt(i));
    }
  }
  function times(n, reader) {
    for (var ret = new Array(n), i = 0; i < n; ++i) {
      ret[i] = reader();
    }
    return ret;
  }
  var stream = {
    eof,
    readByte,
    writeByte,
    readShort,
    writeShort,
    readLong,
    writeLong,
    readFixed,
    writeFixed,
    // signed numbers.
    readShort_,
    writeShort_,
    readLong_,
    writeLong_,
    readFixed_,
    writeFixed_,
    read,
    write,
    readString,
    writeString,
    times,
    get,
    slice: slice3,
    offset: function(pos) {
      if (pos != null) {
        offset = pos;
        return stream;
      }
      return offset;
    },
    skip: function(nbytes) {
      offset += nbytes;
    },
    toString: function() {
      throw new Error("FIX CALLER.  BinaryStream is no longer convertible to string!");
    },
    length: function() {
      return length;
    },
    saveExcursion: function(f) {
      var pos = offset;
      try {
        return f();
      } finally {
        offset = pos;
      }
    },
    writeBase64: function(base64) {
      if (window.atob) {
        writeString(window.atob(base64));
      } else {
        write(BASE64.decode(base64));
      }
    },
    base64: function() {
      return BASE64.encode(get());
    }
  };
  return stream;
}
function ucs2decode(string) {
  var output = [], counter = 0, length = string.length, value, extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
function ucs2encode(array) {
  return array.map(function(value) {
    var output = "";
    if (value > 65535) {
      value -= 65536;
      output += String.fromCharCode(value >>> 10 & 1023 | 55296);
      value = 56320 | value & 1023;
    }
    output += String.fromCharCode(value);
    return output;
  }).join("");
}
function atobUint8Array(base64) {
  const data = window.atob(base64);
  const result = new Uint8Array(data.length);
  for (let idx = 0; idx < data.length; idx++) {
    result[idx] = data.charCodeAt(idx);
  }
  return result;
}
function createUint8Array(data) {
  const result = new Uint8Array(data.length);
  for (let idx = 0; idx < data.length; idx++) {
    result[idx] = data[idx];
  }
  return result;
}
function base64ToUint8Array(base64) {
  if (window.atob) {
    return atobUint8Array(base64);
  }
  return createUint8Array(BASE64.decode(base64));
}

// node_modules/@progress/kendo-drawing/dist/es/pdf/ttf.js
function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function sortedKeys(obj) {
  return Object.keys(obj).sort(function(a, b) {
    return a - b;
  }).map(parseFloat);
}
var Directory = class {
  constructor(data) {
    this.raw = data;
    this.scalerType = data.readLong();
    this.tableCount = data.readShort();
    this.searchRange = data.readShort();
    this.entrySelector = data.readShort();
    this.rangeShift = data.readShort();
    var tables = this.tables = {};
    for (var i = 0; i < this.tableCount; ++i) {
      var entry = {
        tag: data.readString(4),
        checksum: data.readLong(),
        offset: data.readLong(),
        length: data.readLong()
      };
      tables[entry.tag] = entry;
    }
  }
  readTable(name, Ctor) {
    var def = this.tables[name];
    if (!def) {
      throw new Error("Table " + name + " not found in directory");
    }
    return this[name] = def.table = new Ctor(this, def);
  }
  render(tables) {
    var tableCount = Object.keys(tables).length;
    var maxpow2 = Math.pow(2, Math.floor(Math.log(tableCount) / Math.LN2));
    var searchRange = maxpow2 * 16;
    var entrySelector = Math.floor(Math.log(maxpow2) / Math.LN2);
    var rangeShift = tableCount * 16 - searchRange;
    var out = BinaryStream();
    out.writeLong(this.scalerType);
    out.writeShort(tableCount);
    out.writeShort(searchRange);
    out.writeShort(entrySelector);
    out.writeShort(rangeShift);
    var directoryLength = tableCount * 16;
    var offset = out.offset() + directoryLength;
    var headOffset = null;
    var tableData = BinaryStream();
    for (var tag in tables) {
      if (hasOwnProperty(tables, tag)) {
        var table = tables[tag];
        out.writeString(tag);
        out.writeLong(this.checksum(table));
        out.writeLong(offset);
        out.writeLong(table.length);
        tableData.write(table);
        if (tag == "head") {
          headOffset = offset;
        }
        offset += table.length;
        while (offset % 4) {
          tableData.writeByte(0);
          offset++;
        }
      }
    }
    out.write(tableData.get());
    var sum = this.checksum(out.get());
    var adjustment = 2981146554 - sum;
    out.offset(headOffset + 8);
    out.writeLong(adjustment);
    return out.get();
  }
  checksum(data) {
    data = BinaryStream(data);
    var sum = 0;
    while (!data.eof()) {
      sum += data.readLong();
    }
    return sum & 4294967295;
  }
};
var Table = class {
  constructor(file, def) {
    this.definition = def;
    this.length = def.length;
    this.offset = def.offset;
    this.file = file;
    this.rawData = file.raw;
    this.parse(file.raw);
  }
  raw() {
    return this.rawData.slice(this.offset, this.length);
  }
  parse() {
  }
  // abstract
};
var HeadTable = class extends Table {
  parse(data) {
    data.offset(this.offset);
    this.version = data.readLong();
    this.revision = data.readLong();
    this.checkSumAdjustment = data.readLong();
    this.magicNumber = data.readLong();
    this.flags = data.readShort();
    this.unitsPerEm = data.readShort();
    this.created = data.read(8);
    this.modified = data.read(8);
    this.xMin = data.readShort_();
    this.yMin = data.readShort_();
    this.xMax = data.readShort_();
    this.yMax = data.readShort_();
    this.macStyle = data.readShort();
    this.lowestRecPPEM = data.readShort();
    this.fontDirectionHint = data.readShort_();
    this.indexToLocFormat = data.readShort_();
    this.glyphDataFormat = data.readShort_();
  }
  render(indexToLocFormat) {
    var out = BinaryStream();
    out.writeLong(this.version);
    out.writeLong(this.revision);
    out.writeLong(0);
    out.writeLong(this.magicNumber);
    out.writeShort(this.flags);
    out.writeShort(this.unitsPerEm);
    out.write(this.created);
    out.write(this.modified);
    out.writeShort_(this.xMin);
    out.writeShort_(this.yMin);
    out.writeShort_(this.xMax);
    out.writeShort_(this.yMax);
    out.writeShort(this.macStyle);
    out.writeShort(this.lowestRecPPEM);
    out.writeShort_(this.fontDirectionHint);
    out.writeShort_(indexToLocFormat);
    out.writeShort_(this.glyphDataFormat);
    return out.get();
  }
};
var LocaTable = class extends Table {
  parse(data) {
    data.offset(this.offset);
    var format = this.file.head.indexToLocFormat;
    if (format === 0) {
      this.offsets = data.times(this.length / 2, function() {
        return 2 * data.readShort();
      });
    } else {
      this.offsets = data.times(this.length / 4, data.readLong);
    }
  }
  offsetOf(id) {
    return this.offsets[id];
  }
  lengthOf(id) {
    return this.offsets[id + 1] - this.offsets[id];
  }
  render(offsets) {
    var out = BinaryStream();
    var needsLongFormat = offsets[offsets.length - 1] > 65535;
    for (var i = 0; i < offsets.length; ++i) {
      if (needsLongFormat) {
        out.writeLong(offsets[i]);
      } else {
        out.writeShort(offsets[i] / 2);
      }
    }
    return {
      format: needsLongFormat ? 1 : 0,
      table: out.get()
    };
  }
};
var HheaTable = class extends Table {
  parse(data) {
    data.offset(this.offset);
    this.version = data.readLong();
    this.ascent = data.readShort_();
    this.descent = data.readShort_();
    this.lineGap = data.readShort_();
    this.advanceWidthMax = data.readShort();
    this.minLeftSideBearing = data.readShort_();
    this.minRightSideBearing = data.readShort_();
    this.xMaxExtent = data.readShort_();
    this.caretSlopeRise = data.readShort_();
    this.caretSlopeRun = data.readShort_();
    this.caretOffset = data.readShort_();
    data.skip(4 * 2);
    this.metricDataFormat = data.readShort_();
    this.numOfLongHorMetrics = data.readShort();
  }
  render(ids) {
    var out = BinaryStream();
    out.writeLong(this.version);
    out.writeShort_(this.ascent);
    out.writeShort_(this.descent);
    out.writeShort_(this.lineGap);
    out.writeShort(this.advanceWidthMax);
    out.writeShort_(this.minLeftSideBearing);
    out.writeShort_(this.minRightSideBearing);
    out.writeShort_(this.xMaxExtent);
    out.writeShort_(this.caretSlopeRise);
    out.writeShort_(this.caretSlopeRun);
    out.writeShort_(this.caretOffset);
    out.write([0, 0, 0, 0, 0, 0, 0, 0]);
    out.writeShort_(this.metricDataFormat);
    out.writeShort(ids.length);
    return out.get();
  }
};
var MaxpTable = class extends Table {
  parse(data) {
    data.offset(this.offset);
    this.version = data.readLong();
    this.numGlyphs = data.readShort();
    this.maxPoints = data.readShort();
    this.maxContours = data.readShort();
    this.maxComponentPoints = data.readShort();
    this.maxComponentContours = data.readShort();
    this.maxZones = data.readShort();
    this.maxTwilightPoints = data.readShort();
    this.maxStorage = data.readShort();
    this.maxFunctionDefs = data.readShort();
    this.maxInstructionDefs = data.readShort();
    this.maxStackElements = data.readShort();
    this.maxSizeOfInstructions = data.readShort();
    this.maxComponentElements = data.readShort();
    this.maxComponentDepth = data.readShort();
  }
  render(glyphIds) {
    var out = BinaryStream();
    out.writeLong(this.version);
    out.writeShort(glyphIds.length);
    out.writeShort(this.maxPoints);
    out.writeShort(this.maxContours);
    out.writeShort(this.maxComponentPoints);
    out.writeShort(this.maxComponentContours);
    out.writeShort(this.maxZones);
    out.writeShort(this.maxTwilightPoints);
    out.writeShort(this.maxStorage);
    out.writeShort(this.maxFunctionDefs);
    out.writeShort(this.maxInstructionDefs);
    out.writeShort(this.maxStackElements);
    out.writeShort(this.maxSizeOfInstructions);
    out.writeShort(this.maxComponentElements);
    out.writeShort(this.maxComponentDepth);
    return out.get();
  }
};
var HmtxTable = class extends Table {
  parse(data) {
    data.offset(this.offset);
    var dir = this.file, hhea = dir.hhea;
    this.metrics = data.times(hhea.numOfLongHorMetrics, function() {
      return {
        advance: data.readShort(),
        lsb: data.readShort_()
      };
    });
    var lsbCount = dir.maxp.numGlyphs - dir.hhea.numOfLongHorMetrics;
    this.leftSideBearings = data.times(lsbCount, data.readShort_);
  }
  forGlyph(id) {
    var metrics = this.metrics;
    var n = metrics.length;
    if (id < n) {
      return metrics[id];
    }
    return {
      advance: metrics[n - 1].advance,
      lsb: this.leftSideBearings[id - n]
    };
  }
  render(glyphIds) {
    var out = BinaryStream();
    for (var i = 0; i < glyphIds.length; ++i) {
      var m = this.forGlyph(glyphIds[i]);
      out.writeShort(m.advance);
      out.writeShort_(m.lsb);
    }
    return out.get();
  }
};
var GlyfTable = /* @__PURE__ */ (function() {
  class SimpleGlyph {
    get compound() {
      return false;
    }
    constructor(raw) {
      this.raw = raw;
    }
    render() {
      return this.raw.get();
    }
  }
  var ARG_1_AND_2_ARE_WORDS = 1;
  var WE_HAVE_A_SCALE = 8;
  var MORE_COMPONENTS = 32;
  var WE_HAVE_AN_X_AND_Y_SCALE = 64;
  var WE_HAVE_A_TWO_BY_TWO = 128;
  class CompoundGlyph {
    get compound() {
      return true;
    }
    constructor(data) {
      this.raw = data;
      var ids = this.glyphIds = [];
      var offsets = this.idOffsets = [];
      while (true) {
        var flags = data.readShort();
        offsets.push(data.offset());
        ids.push(data.readShort());
        if (!(flags & MORE_COMPONENTS)) {
          break;
        }
        data.skip(flags & ARG_1_AND_2_ARE_WORDS ? 4 : 2);
        if (flags & WE_HAVE_A_TWO_BY_TWO) {
          data.skip(8);
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          data.skip(4);
        } else if (flags & WE_HAVE_A_SCALE) {
          data.skip(2);
        }
      }
    }
    render(old2new) {
      var out = BinaryStream(this.raw.get());
      for (var i = 0; i < this.glyphIds.length; ++i) {
        var id = this.glyphIds[i];
        out.offset(this.idOffsets[i]);
        out.writeShort(old2new[id]);
      }
      return out.get();
    }
  }
  return class extends Table {
    parse() {
      this.cache = {};
    }
    glyphFor(id) {
      var cache = this.cache;
      if (hasOwnProperty(cache, id)) {
        return cache[id];
      }
      var loca = this.file.loca;
      var length = loca.lengthOf(id);
      if (length === 0) {
        return cache[id] = null;
      }
      var data = this.rawData;
      var offset = this.offset + loca.offsetOf(id);
      var raw = BinaryStream(data.slice(offset, length));
      var numberOfContours = raw.readShort_();
      var xMin = raw.readShort_();
      var yMin = raw.readShort_();
      var xMax = raw.readShort_();
      var yMax = raw.readShort_();
      var glyph = cache[id] = numberOfContours < 0 ? new CompoundGlyph(raw) : new SimpleGlyph(raw);
      glyph.numberOfContours = numberOfContours;
      glyph.xMin = xMin;
      glyph.yMin = yMin;
      glyph.xMax = xMax;
      glyph.yMax = yMax;
      return glyph;
    }
    render(glyphs, oldIds, old2new) {
      var out = BinaryStream(), offsets = [];
      for (var i = 0; i < oldIds.length; ++i) {
        var id = oldIds[i];
        var glyph = glyphs[id];
        if (out.offset() % 2) {
          out.writeByte(0);
        }
        offsets.push(out.offset());
        if (glyph) {
          out.write(glyph.render(old2new));
        }
      }
      if (out.offset() % 2) {
        out.writeByte(0);
      }
      offsets.push(out.offset());
      return {
        table: out.get(),
        offsets
      };
    }
  };
})();
var NameTable = /* @__PURE__ */ (function() {
  class NameEntry {
    constructor(text, entry) {
      this.text = text;
      this.length = text.length;
      this.platformID = entry.platformID;
      this.platformSpecificID = entry.platformSpecificID;
      this.languageID = entry.languageID;
      this.nameID = entry.nameID;
    }
  }
  return class extends Table {
    parse(data) {
      data.offset(this.offset);
      data.readShort();
      var count = data.readShort();
      var stringOffset = this.offset + data.readShort();
      var nameRecords = data.times(count, function() {
        return {
          platformID: data.readShort(),
          platformSpecificID: data.readShort(),
          languageID: data.readShort(),
          nameID: data.readShort(),
          length: data.readShort(),
          offset: data.readShort() + stringOffset
        };
      });
      var strings = this.strings = {};
      for (var i = 0; i < nameRecords.length; ++i) {
        var rec = nameRecords[i];
        data.offset(rec.offset);
        var text = data.readString(rec.length);
        if (!strings[rec.nameID]) {
          strings[rec.nameID] = [];
        }
        strings[rec.nameID].push(new NameEntry(text, rec));
      }
      this.postscriptEntry = strings[6][0];
      this.postscriptName = this.postscriptEntry.text.replace(/[^\x20-\x7F]/g, "");
    }
    render(psName) {
      var strings = this.strings;
      var strCount = 0;
      for (var i in strings) {
        if (hasOwnProperty(strings, i)) {
          strCount += strings[i].length;
        }
      }
      var out = BinaryStream();
      var strTable = BinaryStream();
      out.writeShort(0);
      out.writeShort(strCount);
      out.writeShort(6 + 12 * strCount);
      for (i in strings) {
        if (hasOwnProperty(strings, i)) {
          var list = i == 6 ? [
            new NameEntry(psName, this.postscriptEntry)
          ] : strings[i];
          for (var j = 0; j < list.length; ++j) {
            var str = list[j];
            out.writeShort(str.platformID);
            out.writeShort(str.platformSpecificID);
            out.writeShort(str.languageID);
            out.writeShort(str.nameID);
            out.writeShort(str.length);
            out.writeShort(strTable.offset());
            strTable.writeString(str.text);
          }
        }
      }
      out.write(strTable.get());
      return out.get();
    }
  };
})();
var PostTable = (function() {
  var POSTSCRIPT_GLYPHS = ".notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash zero one two three four five six seven eight nine colon semicolon less equal greater question at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z bracketleft backslash bracketright asciicircum underscore grave a b c d e f g h i j k l m n o p q r s t u v w x y z braceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis Udieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave ecircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve ocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent sterling section bullet paragraph germandbls registered copyright trademark acute dieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu partialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash questiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft guillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash quotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis fraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered quotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis Egrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute Ucircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla hungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth eth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior onehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla Cacute cacute Ccaron ccaron dcroat".split(/\s+/g);
  return class extends Table {
    parse(data) {
      data.offset(this.offset);
      this.format = data.readLong();
      this.italicAngle = data.readFixed_();
      this.underlinePosition = data.readShort_();
      this.underlineThickness = data.readShort_();
      this.isFixedPitch = data.readLong();
      this.minMemType42 = data.readLong();
      this.maxMemType42 = data.readLong();
      this.minMemType1 = data.readLong();
      this.maxMemType1 = data.readLong();
      var numberOfGlyphs;
      switch (this.format) {
        case 65536:
        case 196608:
          break;
        case 131072:
          numberOfGlyphs = data.readShort();
          this.glyphNameIndex = data.times(numberOfGlyphs, data.readShort);
          this.names = [];
          var limit = this.offset + this.length;
          while (data.offset() < limit) {
            this.names.push(data.readString(data.readByte()));
          }
          break;
        case 151552:
          numberOfGlyphs = data.readShort();
          this.offsets = data.read(numberOfGlyphs);
          break;
        case 262144:
          this.map = data.times(this.file.maxp.numGlyphs, data.readShort);
          break;
      }
    }
    glyphFor(code) {
      switch (this.format) {
        case 65536:
          return POSTSCRIPT_GLYPHS[code] || ".notdef";
        case 131072:
          var index = this.glyphNameIndex[code];
          if (index < POSTSCRIPT_GLYPHS.length) {
            return POSTSCRIPT_GLYPHS[index];
          }
          return this.names[index - POSTSCRIPT_GLYPHS.length] || ".notdef";
        case 151552:
        case 196608:
          return ".notdef";
        case 262144:
          return this.map[code] || 65535;
      }
    }
    render(mapping) {
      if (this.format == 196608) {
        return this.raw();
      }
      var out = BinaryStream(this.rawData.slice(this.offset, 32));
      out.writeLong(131072);
      out.offset(32);
      var indexes = [];
      var strings = [];
      for (var i = 0; i < mapping.length; ++i) {
        var id = mapping[i];
        var post = this.glyphFor(id);
        var index = POSTSCRIPT_GLYPHS.indexOf(post);
        if (index >= 0) {
          indexes.push(index);
        } else {
          indexes.push(POSTSCRIPT_GLYPHS.length + strings.length);
          strings.push(post);
        }
      }
      out.writeShort(mapping.length);
      for (i = 0; i < indexes.length; ++i) {
        out.writeShort(indexes[i]);
      }
      for (i = 0; i < strings.length; ++i) {
        out.writeByte(strings[i].length);
        out.writeString(strings[i]);
      }
      return out.get();
    }
  };
})();
var CmapTable = /* @__PURE__ */ (function() {
  class CmapEntry {
    constructor(data, offset, codeMap) {
      var self = this;
      self.platformID = data.readShort();
      self.platformSpecificID = data.readShort();
      self.offset = offset + data.readLong();
      data.saveExcursion(function() {
        var code;
        data.offset(self.offset);
        self.format = data.readShort();
        switch (self.format) {
          case 0:
            self.length = data.readShort();
            self.language = data.readShort();
            for (var i = 0; i < 256; ++i) {
              codeMap[i] = data.readByte();
            }
            break;
          case 4:
            self.length = data.readShort();
            self.language = data.readShort();
            var segCount = data.readShort() / 2;
            data.skip(6);
            var endCode = data.times(segCount, data.readShort);
            data.skip(2);
            var startCode = data.times(segCount, data.readShort);
            var idDelta = data.times(segCount, data.readShort_);
            var idRangeOffset = data.times(segCount, data.readShort);
            var count = (self.length + self.offset - data.offset()) / 2;
            var glyphIds = data.times(count, data.readShort);
            for (i = 0; i < segCount; ++i) {
              var start = startCode[i], end = endCode[i];
              for (code = start; code <= end; ++code) {
                var glyphId;
                if (idRangeOffset[i] === 0) {
                  glyphId = code + idDelta[i];
                } else {
                  var index = idRangeOffset[i] / 2 - (segCount - i) + (code - start);
                  glyphId = glyphIds[index] || 0;
                  if (glyphId !== 0) {
                    glyphId += idDelta[i];
                  }
                }
                codeMap[code] = glyphId & 65535;
              }
            }
            break;
          case 6:
            self.length = data.readShort();
            self.language = data.readShort();
            code = data.readShort();
            var length = data.readShort();
            while (length-- > 0) {
              codeMap[code++] = data.readShort();
            }
            break;
          case 12:
            data.readShort();
            self.length = data.readLong();
            self.language = data.readLong();
            var ngroups = data.readLong();
            while (ngroups-- > 0) {
              code = data.readLong();
              var endCharCode = data.readLong();
              var glyphCode = data.readLong();
              while (code <= endCharCode) {
                codeMap[code++] = glyphCode++;
              }
            }
            break;
          default:
            if (window.console) {
              window.console.error("Unhandled CMAP format: " + self.format);
            }
        }
      });
    }
  }
  function renderCharmap(ncid2ogid, ogid2ngid) {
    var codes = sortedKeys(ncid2ogid);
    var startCodes = [];
    var endCodes = [];
    var last2 = null;
    var diff = null;
    function new_gid(charcode) {
      return ogid2ngid[ncid2ogid[charcode]];
    }
    for (var i = 0; i < codes.length; ++i) {
      var code = codes[i];
      var gid = new_gid(code);
      var delta = gid - code;
      if (last2 == null || delta !== diff) {
        if (last2) {
          endCodes.push(last2);
        }
        startCodes.push(code);
        diff = delta;
      }
      last2 = code;
    }
    if (last2) {
      endCodes.push(last2);
    }
    endCodes.push(65535);
    startCodes.push(65535);
    var segCount = startCodes.length;
    var segCountX2 = segCount * 2;
    var searchRange = 2 * Math.pow(2, Math.floor(Math.log(segCount) / Math.LN2));
    var entrySelector = Math.log(searchRange / 2) / Math.LN2;
    var rangeShift = segCountX2 - searchRange;
    var deltas = [];
    var rangeOffsets = [];
    var glyphIds = [];
    for (i = 0; i < segCount; ++i) {
      var startCode = startCodes[i];
      var endCode = endCodes[i];
      if (startCode == 65535) {
        deltas.push(0);
        rangeOffsets.push(0);
        break;
      }
      var startGlyph = new_gid(startCode);
      if (startCode - startGlyph >= 32768) {
        deltas.push(0);
        rangeOffsets.push(2 * (glyphIds.length + segCount - i));
        for (var j = startCode; j <= endCode; ++j) {
          glyphIds.push(new_gid(j));
        }
      } else {
        deltas.push(startGlyph - startCode);
        rangeOffsets.push(0);
      }
    }
    var out = BinaryStream();
    out.writeShort(3);
    out.writeShort(1);
    out.writeLong(12);
    out.writeShort(4);
    out.writeShort(16 + segCount * 8 + glyphIds.length * 2);
    out.writeShort(0);
    out.writeShort(segCountX2);
    out.writeShort(searchRange);
    out.writeShort(entrySelector);
    out.writeShort(rangeShift);
    endCodes.forEach(out.writeShort);
    out.writeShort(0);
    startCodes.forEach(out.writeShort);
    deltas.forEach(out.writeShort_);
    rangeOffsets.forEach(out.writeShort);
    glyphIds.forEach(out.writeShort);
    return out.get();
  }
  return class extends Table {
    parse(data) {
      var self = this;
      var offset = self.offset;
      data.offset(offset);
      self.codeMap = {};
      self.version = data.readShort();
      var tableCount = data.readShort();
      self.tables = data.times(tableCount, function() {
        return new CmapEntry(data, offset, self.codeMap);
      });
    }
    static render(ncid2ogid, ogid2ngid) {
      var out = BinaryStream();
      out.writeShort(0);
      out.writeShort(1);
      out.write(renderCharmap(ncid2ogid, ogid2ngid));
      return out.get();
    }
  };
})();
var OS2Table = class extends Table {
  parse(data) {
    data.offset(this.offset);
    this.version = data.readShort();
    this.averageCharWidth = data.readShort_();
    this.weightClass = data.readShort();
    this.widthClass = data.readShort();
    this.type = data.readShort();
    this.ySubscriptXSize = data.readShort_();
    this.ySubscriptYSize = data.readShort_();
    this.ySubscriptXOffset = data.readShort_();
    this.ySubscriptYOffset = data.readShort_();
    this.ySuperscriptXSize = data.readShort_();
    this.ySuperscriptYSize = data.readShort_();
    this.ySuperscriptXOffset = data.readShort_();
    this.ySuperscriptYOffset = data.readShort_();
    this.yStrikeoutSize = data.readShort_();
    this.yStrikeoutPosition = data.readShort_();
    this.familyClass = data.readShort_();
    this.panose = data.times(10, data.readByte);
    this.charRange = data.times(4, data.readLong);
    this.vendorID = data.readString(4);
    this.selection = data.readShort();
    this.firstCharIndex = data.readShort();
    this.lastCharIndex = data.readShort();
    if (this.version > 0) {
      this.ascent = data.readShort_();
      this.descent = data.readShort_();
      this.lineGap = data.readShort_();
      this.winAscent = data.readShort();
      this.winDescent = data.readShort();
      this.codePageRange = data.times(2, data.readLong);
      if (this.version > 1) {
        this.xHeight = data.readShort();
        this.capHeight = data.readShort();
        this.defaultChar = data.readShort();
        this.breakChar = data.readShort();
        this.maxContext = data.readShort();
      }
    }
  }
  render() {
    return this.raw();
  }
};
var subsetTag = 1e5;
function nextSubsetTag() {
  var ret = "", n = String(subsetTag);
  for (var i = 0; i < n.length; ++i) {
    ret += String.fromCharCode(n.charCodeAt(i) - 48 + 65);
  }
  ++subsetTag;
  return ret;
}
var Subfont = class {
  constructor(font) {
    this.font = font;
    this.subset = {};
    this.unicodes = {};
    this.ogid2ngid = { 0: 0 };
    this.ngid2ogid = { 0: 0 };
    this.ncid2ogid = {};
    this.next = this.firstChar = 1;
    this.nextGid = 1;
    this.psName = nextSubsetTag() + "+" + this.font.psName;
  }
  use(ch) {
    var self = this;
    if (typeof ch == "string") {
      return ucs2decode(ch).reduce(function(ret, code2) {
        return ret + String.fromCharCode(self.use(code2));
      }, "");
    }
    var code = self.unicodes[ch];
    if (!code) {
      code = self.next++;
      self.subset[code] = ch;
      self.unicodes[ch] = code;
      var old_gid = self.font.cmap.codeMap[ch];
      if (old_gid) {
        self.ncid2ogid[code] = old_gid;
        if (self.ogid2ngid[old_gid] == null) {
          var new_gid = self.nextGid++;
          self.ogid2ngid[old_gid] = new_gid;
          self.ngid2ogid[new_gid] = old_gid;
        }
      }
    }
    return code;
  }
  encodeText(text) {
    return this.use(text);
  }
  glyphIds() {
    return sortedKeys(this.ogid2ngid);
  }
  glyphsFor(glyphIds, result) {
    if (!result) {
      result = {};
    }
    for (var i = 0; i < glyphIds.length; ++i) {
      var id = glyphIds[i];
      if (!result[id]) {
        var glyph = result[id] = this.font.glyf.glyphFor(id);
        if (glyph && glyph.compound) {
          this.glyphsFor(glyph.glyphIds, result);
        }
      }
    }
    return result;
  }
  render() {
    var glyphs = this.glyphsFor(this.glyphIds());
    for (var old_gid in glyphs) {
      if (hasOwnProperty(glyphs, old_gid)) {
        old_gid = parseInt(old_gid, 10);
        if (this.ogid2ngid[old_gid] == null) {
          var new_gid = this.nextGid++;
          this.ogid2ngid[old_gid] = new_gid;
          this.ngid2ogid[new_gid] = old_gid;
        }
      }
    }
    var new_gid_ids = sortedKeys(this.ngid2ogid);
    var old_gid_ids = new_gid_ids.map(function(id) {
      return this.ngid2ogid[id];
    }, this);
    var font = this.font;
    var glyf = font.glyf.render(glyphs, old_gid_ids, this.ogid2ngid);
    var loca = font.loca.render(glyf.offsets);
    this.lastChar = this.next - 1;
    var tables = {
      "cmap": CmapTable.render(this.ncid2ogid, this.ogid2ngid),
      "glyf": glyf.table,
      "loca": loca.table,
      "hmtx": font.hmtx.render(old_gid_ids),
      "hhea": font.hhea.render(old_gid_ids),
      "maxp": font.maxp.render(old_gid_ids),
      "post": font.post.render(old_gid_ids),
      "name": font.name.render(this.psName),
      "head": font.head.render(loca.format),
      "OS/2": font.os2.render()
    };
    return this.font.directory.render(tables);
  }
  cidToGidMap() {
    var out = BinaryStream(), len = 0;
    for (var cid = this.firstChar; cid < this.next; ++cid) {
      while (len < cid) {
        out.writeShort(0);
        len++;
      }
      var old_gid = this.ncid2ogid[cid];
      if (old_gid) {
        var new_gid = this.ogid2ngid[old_gid];
        out.writeShort(new_gid);
      } else {
        out.writeShort(0);
      }
      len++;
    }
    return out.get();
  }
};
var TTFFont = class {
  constructor(rawData, name) {
    var self = this;
    var data = self.contents = BinaryStream(rawData);
    if (data.readString(4) == "ttcf") {
      var offset;
      const parse = function() {
        data.offset(offset);
        self.parse();
      };
      if (!name) {
        throw new Error("Must specify a name for TTC files");
      }
      data.readLong();
      var numFonts = data.readLong();
      for (var i = 0; i < numFonts; ++i) {
        offset = data.readLong();
        data.saveExcursion(parse);
        if (self.psName == name) {
          return;
        }
      }
      throw new Error("Font " + name + " not found in collection");
    } else {
      data.offset(0);
      self.parse();
    }
  }
  parse() {
    var dir = this.directory = new Directory(this.contents);
    this.head = dir.readTable("head", HeadTable);
    this.loca = dir.readTable("loca", LocaTable);
    this.hhea = dir.readTable("hhea", HheaTable);
    this.maxp = dir.readTable("maxp", MaxpTable);
    this.hmtx = dir.readTable("hmtx", HmtxTable);
    this.glyf = dir.readTable("glyf", GlyfTable);
    this.name = dir.readTable("name", NameTable);
    this.post = dir.readTable("post", PostTable);
    this.cmap = dir.readTable("cmap", CmapTable);
    this.os2 = dir.readTable("OS/2", OS2Table);
    this.psName = this.name.postscriptName;
    this.ascent = this.os2.ascent || this.hhea.ascent;
    this.descent = this.os2.descent || this.hhea.descent;
    this.lineGap = this.os2.lineGap || this.hhea.lineGap;
    this.scale = 1e3 / this.head.unitsPerEm;
  }
  widthOfGlyph(glyph) {
    return this.hmtx.forGlyph(glyph).advance * this.scale;
  }
  makeSubset() {
    return new Subfont(this);
  }
};

// node_modules/@progress/kendo-drawing/dist/es/pdf/deflate.js
var deflate = deflate$1;
function supportsDeflate() {
  return true;
}

// node_modules/@progress/kendo-drawing/dist/es/pdf/core.js
var browser3 = support_default.browser;
var NL = "\n";
var RESOURCE_COUNTER = 0;
var PATTERN_COUNTER = 0;
var PAPER_SIZE = {
  a0: [2383.94, 3370.39],
  a1: [1683.78, 2383.94],
  a2: [1190.55, 1683.78],
  a3: [841.89, 1190.55],
  a4: [595.28, 841.89],
  a5: [419.53, 595.28],
  a6: [297.64, 419.53],
  a7: [209.76, 297.64],
  a8: [147.4, 209.76],
  a9: [104.88, 147.4],
  a10: [73.7, 104.88],
  b0: [2834.65, 4008.19],
  b1: [2004.09, 2834.65],
  b2: [1417.32, 2004.09],
  b3: [1000.63, 1417.32],
  b4: [708.66, 1000.63],
  b5: [498.9, 708.66],
  b6: [354.33, 498.9],
  b7: [249.45, 354.33],
  b8: [175.75, 249.45],
  b9: [124.72, 175.75],
  b10: [87.87, 124.72],
  c0: [2599.37, 3676.54],
  c1: [1836.85, 2599.37],
  c2: [1298.27, 1836.85],
  c3: [918.43, 1298.27],
  c4: [649.13, 918.43],
  c5: [459.21, 649.13],
  c6: [323.15, 459.21],
  c7: [229.61, 323.15],
  c8: [161.57, 229.61],
  c9: [113.39, 161.57],
  c10: [79.37, 113.39],
  executive: [521.86, 756],
  folio: [612, 936],
  legal: [612, 1008],
  letter: [612, 792],
  tabloid: [792, 1224]
};
function makeOutput() {
  var indentLevel = 0, output = BinaryStream();
  function out() {
    for (var i = 0; i < arguments.length; ++i) {
      var x = arguments[i];
      if (x === void 0) {
        throw new Error("Cannot output undefined to PDF");
      } else if (x instanceof PDFValue) {
        x.beforeRender(out);
        x.render(out);
      } else if (isArray(x)) {
        renderArray(x, out);
      } else if (isDate(x)) {
        renderDate(x, out);
      } else if (typeof x == "number") {
        if (isNaN(x)) {
          throw new Error("Cannot output NaN to PDF");
        }
        var num = x.toFixed(7);
        if (num.indexOf(".") >= 0) {
          num = num.replace(/\.?0+$/, "");
        }
        if (num == "-0") {
          num = "0";
        }
        output.writeString(num);
      } else if (/string|boolean/.test(typeof x)) {
        output.writeString(String(x));
      } else if (typeof x.get == "function") {
        output.write(x.get());
      } else if (typeof x == "object") {
        if (!x) {
          output.writeString("null");
        } else {
          out(new PDFDictionary(x));
        }
      }
    }
  }
  out.writeData = function(data) {
    output.write(data);
  };
  out.withIndent = function(f) {
    ++indentLevel;
    f(out);
    --indentLevel;
  };
  out.indent = function() {
    out(NL, pad("", indentLevel * 2, "  "));
    out.apply(null, arguments);
  };
  out.offset = function() {
    return output.offset();
  };
  out.toString = function() {
    throw new Error("FIX CALLER");
  };
  out.get = function() {
    return output.get();
  };
  out.stream = function() {
    return output;
  };
  return out;
}
function wrapObject(value, id) {
  var beforeRender = value.beforeRender;
  var renderValue = value.render;
  value.beforeRender = function() {
  };
  value.render = function(out) {
    out(id, " 0 R");
  };
  value.renderFull = function(out) {
    value._offset = out.offset();
    out(id, " 0 obj ");
    beforeRender.call(value, out);
    renderValue.call(value, out);
    out(" endobj");
  };
}
function getPaperOptions(getOption) {
  if (typeof getOption != "function") {
    var options2 = getOption;
    getOption = function(key, def) {
      return key in options2 ? options2[key] : def;
    };
  }
  var paperSize = getOption("paperSize", PAPER_SIZE.a4);
  if (!paperSize) {
    return {};
  }
  if (typeof paperSize == "string") {
    paperSize = PAPER_SIZE[paperSize.toLowerCase()];
    if (paperSize == null) {
      throw new Error("Unknown paper size");
    }
  }
  paperSize[0] = unitsToPoints(paperSize[0]);
  paperSize[1] = unitsToPoints(paperSize[1]);
  if (getOption("landscape", false)) {
    paperSize = [
      Math.max(paperSize[0], paperSize[1]),
      Math.min(paperSize[0], paperSize[1])
    ];
  }
  var margin = getOption("margin");
  if (margin) {
    if (typeof margin == "string" || typeof margin == "number") {
      margin = unitsToPoints(margin, 0);
      margin = { left: margin, top: margin, right: margin, bottom: margin };
    } else {
      margin = {
        left: unitsToPoints(margin.left, 0),
        top: unitsToPoints(margin.top, 0),
        right: unitsToPoints(margin.right, 0),
        bottom: unitsToPoints(margin.bottom, 0)
      };
    }
    if (getOption("addMargin")) {
      paperSize[0] += margin.left + margin.right;
      paperSize[1] += margin.top + margin.bottom;
    }
  }
  return { paperSize, margin };
}
var FONT_CACHE = {
  "Times-Roman": true,
  "Times-Bold": true,
  "Times-Italic": true,
  "Times-BoldItalic": true,
  "Helvetica": true,
  "Helvetica-Bold": true,
  "Helvetica-Oblique": true,
  "Helvetica-BoldOblique": true,
  "Courier": true,
  "Courier-Bold": true,
  "Courier-Oblique": true,
  "Courier-BoldOblique": true,
  "Symbol": true,
  "ZapfDingbats": true
};
function loadBinary(url, cont) {
  let m;
  if (browser3.msie && (m = /^data:.*?;base64,/i.exec(url))) {
    cont(base64ToUint8Array(url.substr(m[0].length)));
    return;
  }
  function error() {
    if (window.console) {
      if (window.console.error) {
        window.console.error("Cannot load URL: %s", url);
      } else {
        window.console.log("Cannot load URL: %s", url);
      }
    }
    cont(null);
  }
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  if (HAS_TYPED_ARRAYS) {
    req.responseType = "arraybuffer";
  }
  req.onload = function() {
    if (req.status == 200 || req.status == 304) {
      if (HAS_TYPED_ARRAYS) {
        cont(new Uint8Array(req.response));
      } else {
        cont(new window.VBArray(req.responseBody).toArray());
      }
    } else {
      error();
    }
  };
  req.onerror = error;
  req.send(null);
}
function loadFont(url, cont) {
  var font = FONT_CACHE[url];
  if (font) {
    cont(font);
  } else {
    loadBinary(url, function(data) {
      if (data == null) {
        throw new Error("Cannot load font from " + url);
      } else {
        var font2 = new TTFFont(data);
        FONT_CACHE[url] = font2;
        cont(font2);
      }
    });
  }
}
var IMAGE_CACHE = {};
function clearImageCache() {
  IMAGE_CACHE = {};
}
function loadImage(url, size, cont, options2) {
  var img = IMAGE_CACHE[url], bloburl, blob;
  if (img) {
    cont(img);
  } else {
    img = new Image();
    if (!/^data:/i.test(url)) {
      img.crossOrigin = "Anonymous";
    }
    if (HAS_TYPED_ARRAYS && !/^data:/i.test(url)) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        blob = xhr.response;
        if (browser3.mozilla && blob.type == "image/svg+xml") {
          let reader = new FileReader();
          reader.onload = function() {
            let doc = new window.DOMParser().parseFromString(this.result, "image/svg+xml");
            let svg = doc.documentElement;
            if (svg.getAttribute("width") && svg.getAttribute("height")) {
              bloburl = URL.createObjectURL(blob);
              _load(bloburl);
            } else {
              svg.setAttribute("width", size.width);
              svg.setAttribute("height", size.height);
              let xml = new window.XMLSerializer().serializeToString(svg);
              let dataURL = `data:image/svg+xml;base64,${encodeBase64(xml)}`;
              _load(dataURL);
            }
          };
          reader.readAsText(blob);
        } else {
          bloburl = URL.createObjectURL(blob);
          _load(bloburl);
        }
      };
      xhr.onerror = _onerror;
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.send();
    } else {
      _load(url);
    }
  }
  function _load(url2) {
    img.src = url2;
    if (img.complete && !browser3.msie) {
      _onload.call(img);
    } else {
      img.onload = _onload;
      img.onerror = _onerror;
    }
  }
  function _trycanvas() {
    if (!size) {
      size = { width: img.width, height: img.height };
    }
    var canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size.width, size.height);
    var imgdata;
    try {
      imgdata = ctx.getImageData(0, 0, size.width, size.height);
    } catch (ex) {
      _onerror();
      return;
    } finally {
      if (bloburl) {
        URL.revokeObjectURL(bloburl);
      }
    }
    var hasAlpha = false, rgb = BinaryStream(), alpha = BinaryStream();
    var rawbytes = imgdata.data;
    var i = 0;
    while (i < rawbytes.length) {
      rgb.writeByte(rawbytes[i++]);
      rgb.writeByte(rawbytes[i++]);
      rgb.writeByte(rawbytes[i++]);
      var a = rawbytes[i++];
      if (a < 255) {
        hasAlpha = true;
      }
      alpha.writeByte(a);
    }
    if (hasAlpha || options2.keepPNG) {
      img = new PDFRawImage(size.width, size.height, rgb, alpha);
    } else {
      var data = canvas.toDataURL("image/jpeg", options2.jpegQuality);
      data = data.substr(data.indexOf(";base64,") + 8);
      var stream = BinaryStream();
      stream.writeBase64(data);
      img = new PDFJpegImage(stream);
    }
    cont(IMAGE_CACHE[url] = img);
  }
  function _onerror() {
    cont(IMAGE_CACHE[url] = "ERROR");
  }
  function _onload() {
    if (size) {
      const svg = blob && blob.type === "image/svg+xml" || /^data:image\/svg\+xml;/i.test(this.src.substring(0, 19));
      const upscale = size.width >= img.width || size.height >= img.height;
      if (!svg && upscale) {
        size = null;
      }
    }
    if (!size && blob && /^image\/jpe?g$/i.test(blob.type)) {
      let reader = new FileReader();
      reader.onload = function() {
        try {
          let img2 = new PDFJpegImage(BinaryStream(new Uint8Array(this.result)));
          URL.revokeObjectURL(bloburl);
          cont(IMAGE_CACHE[url] = img2);
        } catch (ex) {
          _trycanvas();
        }
      };
      reader.readAsArrayBuffer(blob);
    } else {
      _trycanvas();
    }
  }
}
function manyLoader(loadOne) {
  return function(urls, callback) {
    var n = urls.length, i = n;
    if (n === 0) {
      return callback();
    }
    function next() {
      if (--n === 0) {
        callback();
      }
    }
    while (i-- > 0) {
      loadOne(urls[i], next);
    }
  };
}
var loadFonts = manyLoader(loadFont);
var loadImages = function(images, callback, options2) {
  options2 = Object.assign({
    jpegQuality: 0.92,
    keepPNG: false
  }, options2);
  var urls = Object.keys(images), n = urls.length;
  if (n === 0) {
    return callback();
  }
  function next() {
    if (--n === 0) {
      callback();
    }
  }
  urls.forEach(function(url) {
    loadImage(url, images[url], next, options2);
  });
};
var PDFDocument = class {
  constructor(options2) {
    var self = this;
    var out = makeOutput();
    var objcount = 0;
    var objects = [];
    function getOption(name, defval) {
      return options2 && options2[name] != null ? options2[name] : defval;
    }
    self.getOption = getOption;
    self.attach = function(value) {
      if (objects.indexOf(value) < 0) {
        wrapObject(value, ++objcount);
        objects.push(value);
      }
      return value;
    };
    self.pages = [];
    self.FONTS = {};
    self.PATTERNS = {};
    self.IMAGES = {};
    self.GRAD_COL_FUNCTIONS = {};
    self.GRAD_OPC_FUNCTIONS = {};
    self.GRAD_COL = {};
    self.GRAD_OPC = {};
    var catalog = self.attach(new PDFCatalog());
    var pageTree = self.attach(new PDFPageTree());
    if (getOption("autoPrint")) {
      let nameTree = {};
      nameTree.JavaScript = new PDFDictionary({ Names: [
        new PDFString("JS"),
        self.attach(new PDFDictionary({
          S: _("JavaScript"),
          JS: new PDFString("print(true);")
        }))
      ] });
      catalog.props.Names = new PDFDictionary(nameTree);
    }
    catalog.setPages(pageTree);
    var info = self.attach(new PDFDictionary({
      Producer: new PDFString(getOption("producer", "Kendo UI PDF Generator"), true),
      // XXX: kendo.version?
      Title: new PDFString(getOption("title", ""), true),
      Author: new PDFString(getOption("author", ""), true),
      Subject: new PDFString(getOption("subject", ""), true),
      Keywords: new PDFString(getOption("keywords", ""), true),
      Creator: new PDFString(getOption("creator", "Kendo UI PDF Generator"), true),
      CreationDate: getOption("date", /* @__PURE__ */ new Date())
    }));
    self.addPage = function(options3) {
      var paperOptions = getPaperOptions(function(name, defval) {
        return options3 && options3[name] != null ? options3[name] : defval;
      });
      var paperSize = paperOptions.paperSize;
      var margin = paperOptions.margin;
      var contentWidth = paperSize[0];
      var contentHeight = paperSize[1];
      if (margin) {
        contentWidth -= margin.left + margin.right;
        contentHeight -= margin.top + margin.bottom;
      }
      var content = new PDFStream(makeOutput(), null, true);
      var props = {
        Contents: self.attach(content),
        Parent: pageTree,
        MediaBox: [0, 0, paperSize[0], paperSize[1]]
      };
      var page = new PDFPage(self, props);
      page._content = content;
      pageTree.addPage(self.attach(page));
      page.transform(1, 0, 0, -1, 0, paperSize[1]);
      if (margin) {
        page.translate(margin.left, margin.top);
        page.rect(0, 0, contentWidth, contentHeight);
        page.clip();
      }
      self.pages.push(page);
      return page;
    };
    self.render = function() {
      var i;
      out("%PDF-1.4", NL, "%ÂÁÚÏÎ", NL, NL);
      for (i = 0; i < objects.length; ++i) {
        objects[i].renderFull(out);
        out(NL, NL);
      }
      var xrefOffset = out.offset();
      out("xref", NL, 0, " ", objects.length + 1, NL);
      out("0000000000 65535 f ", NL);
      for (i = 0; i < objects.length; ++i) {
        out(zeropad(objects[i]._offset, 10), " 00000 n ", NL);
      }
      out(NL);
      out("trailer", NL);
      out(new PDFDictionary({
        Size: objects.length + 1,
        Root: catalog,
        Info: info
      }), NL, NL);
      out("startxref", NL, xrefOffset, NL);
      out("%%EOF", NL);
      return out.stream().offset(0);
    };
    self.loadFonts = loadFonts;
    self.loadImages = loadImages;
  }
  getFont(url) {
    var font = this.FONTS[url];
    if (!font) {
      font = FONT_CACHE[url];
      if (!font) {
        throw new Error("Font " + url + " has not been loaded");
      }
      if (font === true) {
        font = this.attach(new PDFStandardFont(url));
      } else {
        font = this.attach(new PDFFont(this, font));
      }
      this.FONTS[url] = font;
    }
    return font;
  }
  getPattern(fill, page, drawPattern2) {
    let pattern = this.PATTERNS[fill.id];
    if (!pattern) {
      pattern = this.attach(new PDFPattern(fill, page, drawPattern2));
      this.PATTERNS[fill.id] = pattern;
    }
    return pattern;
  }
  getImage(url) {
    var img = this.IMAGES[url];
    if (!img) {
      img = IMAGE_CACHE[url];
      if (!img) {
        throw new Error("Image " + url + " has not been loaded");
      }
      if (img === "ERROR") {
        return null;
      }
      img = this.IMAGES[url] = this.attach(img.asStream(this));
    }
    return img;
  }
  getOpacityGS(opacity, forStroke) {
    var id = parseFloat(opacity).toFixed(3);
    opacity = parseFloat(id);
    id += forStroke ? "S" : "F";
    var cache = this._opacityGSCache || (this._opacityGSCache = {});
    var gs = cache[id];
    if (!gs) {
      var props = {
        Type: _("ExtGState")
      };
      if (forStroke) {
        props.CA = opacity;
      } else {
        props.ca = opacity;
      }
      gs = this.attach(new PDFDictionary(props));
      gs._resourceName = _("GS" + ++RESOURCE_COUNTER);
      cache[id] = gs;
    }
    return gs;
  }
  dict(props) {
    return new PDFDictionary(props);
  }
  name(str) {
    return _(str);
  }
  stream(props, content) {
    return new PDFStream(content, props);
  }
};
function pad(str, len, ch) {
  while (str.length < len) {
    str = ch + str;
  }
  return str;
}
function zeropad(n, len) {
  return pad(String(n), len, "0");
}
function hasOwnProperty2(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
var isArray = Array.isArray || function(obj) {
  return obj instanceof Array;
};
function isDate(obj) {
  return obj instanceof Date;
}
function renderArray(a, out) {
  out("[");
  if (a.length > 0) {
    out.withIndent(function() {
      for (var i = 0; i < a.length; ++i) {
        if (i > 0 && i % 8 === 0) {
          out.indent(a[i]);
        } else {
          out(" ", a[i]);
        }
      }
    });
  }
  out(" ]");
}
function renderDate(date, out) {
  out(
    "(D:",
    zeropad(date.getUTCFullYear(), 4),
    zeropad(date.getUTCMonth() + 1, 2),
    zeropad(date.getUTCDate(), 2),
    zeropad(date.getUTCHours(), 2),
    zeropad(date.getUTCMinutes(), 2),
    zeropad(date.getUTCSeconds(), 2),
    "Z)"
  );
}
function mm2pt(mm) {
  return mm * (72 / 25.4);
}
function cm2pt(cm) {
  return mm2pt(cm * 10);
}
function in2pt(inch) {
  return inch * 72;
}
function unitsToPoints(x, def) {
  if (typeof x == "number") {
    return x;
  }
  if (typeof x == "string") {
    var m;
    m = /^\s*([0-9.]+)\s*(mm|cm|in|pt)\s*$/.exec(x);
    if (m) {
      var num = parseFloat(m[1]);
      if (!isNaN(num)) {
        if (m[2] == "pt") {
          return num;
        }
        return {
          "mm": mm2pt,
          "cm": cm2pt,
          "in": in2pt
        }[m[2]](num);
      }
    }
  }
  if (def != null) {
    return def;
  }
  throw new Error("Can't parse unit: " + x);
}
var PDFValue = class {
  beforeRender() {
  }
};
var PDFString = class extends PDFValue {
  constructor(value, utf16be) {
    super();
    this.value = value;
    this.utf16be = Boolean(utf16be);
  }
  render(out) {
    let txt = this.value;
    if (this.utf16be) {
      txt = BOM + encodeUTF16BE(txt);
      txt = txt.replace(/([\(\)\\])/g, "\\$1");
      out("(", txt, ")");
    } else {
      let data = [40];
      for (var i = 0; i < txt.length; ++i) {
        let code = txt.charCodeAt(i) & 255;
        if (code == 40 || code == 41 || code == 92) {
          data.push(92);
        }
        data.push(code);
      }
      data.push(41);
      out.writeData(data);
    }
  }
  toString() {
    return this.value;
  }
};
var PDFHexString = class extends PDFString {
  constructor(value) {
    super(value);
    this.value = value;
  }
  render(out) {
    out("<");
    for (var i = 0; i < this.value.length; ++i) {
      out(zeropad(this.value.charCodeAt(i).toString(16), 4));
    }
    out(">");
  }
};
var PDFName = class extends PDFValue {
  static get(name) {
    return _(name);
  }
  constructor(name) {
    super();
    this.name = name;
  }
  render(out) {
    out("/" + this.escape());
  }
  escape() {
    return this.name.replace(/[^\x21-\x7E]/g, function(c) {
      return "#" + zeropad(c.charCodeAt(0).toString(16), 2);
    });
  }
  toString() {
    return this.name;
  }
};
function _(name) {
  return new PDFName(name);
}
var PDFDictionary = class extends PDFValue {
  constructor(props) {
    super();
    this.props = props;
  }
  render(out) {
    var props = this.props, empty = true;
    out("<<");
    out.withIndent(function() {
      for (var i in props) {
        if (hasOwnProperty2(props, i) && !/^_/.test(i)) {
          empty = false;
          out.indent(_(i), " ", props[i]);
        }
      }
    });
    if (!empty) {
      out.indent();
    }
    out(">>");
  }
};
var PDFStream = class extends PDFValue {
  constructor(data, props, compress) {
    super();
    if (typeof data == "string") {
      var tmp = BinaryStream();
      tmp.write(data);
      data = tmp;
    }
    this.data = data;
    this.props = props || {};
    this.compress = compress;
  }
  render(out) {
    var data = this.data.get(), props = this.props;
    if (this.compress && supportsDeflate()) {
      if (!props.Filter) {
        props.Filter = [];
      } else if (!(props.Filter instanceof Array)) {
        props.Filter = [props.Filter];
      }
      props.Filter.unshift(_("FlateDecode"));
      data = deflate(data);
    }
    props.Length = data.length;
    out(new PDFDictionary(props), " stream", NL);
    out.writeData(data);
    out(NL, "endstream");
  }
};
var PDFCatalog = class extends PDFDictionary {
  constructor() {
    super({
      Type: _("Catalog")
    });
  }
  setPages(pagesObj) {
    this.props.Pages = pagesObj;
  }
};
var PDFPageTree = class extends PDFDictionary {
  constructor() {
    super({
      Type: _("Pages"),
      Kids: [],
      Count: 0
    });
  }
  addPage(pageObj) {
    this.props.Kids.push(pageObj);
    this.props.Count++;
  }
};
var SOF_CODES = [192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207];
var PDFJpegImage = class {
  constructor(data) {
    data.offset(0);
    var width, height, colorSpace, bitsPerComponent;
    var soi = data.readShort();
    if (soi != 65496) {
      throw new Error("Invalid JPEG image");
    }
    while (!data.eof()) {
      var ff = data.readByte();
      if (ff != 255) {
        throw new Error("Invalid JPEG image");
      }
      var marker = data.readByte();
      var length = data.readShort();
      if (SOF_CODES.indexOf(marker) >= 0) {
        bitsPerComponent = data.readByte();
        height = data.readShort();
        width = data.readShort();
        colorSpace = data.readByte();
        break;
      }
      data.skip(length - 2);
    }
    if (colorSpace == null) {
      throw new Error("Invalid JPEG image");
    }
    var props = {
      Type: _("XObject"),
      Subtype: _("Image"),
      Width: width,
      Height: height,
      BitsPerComponent: bitsPerComponent,
      Filter: _("DCTDecode")
    };
    switch (colorSpace) {
      case 1:
        props.ColorSpace = _("DeviceGray");
        break;
      case 3:
        props.ColorSpace = _("DeviceRGB");
        break;
      case 4:
        props.ColorSpace = _("DeviceCMYK");
        props.Decode = [1, 0, 1, 0, 1, 0, 1, 0];
        break;
    }
    this.asStream = function() {
      data.offset(0);
      var stream = new PDFStream(data, props);
      stream._resourceName = _("I" + ++RESOURCE_COUNTER);
      return stream;
    };
  }
};
var PDFRawImage = class {
  constructor(width, height, rgb, alpha) {
    this.asStream = function(pdf) {
      var mask = new PDFStream(alpha, {
        Type: _("XObject"),
        Subtype: _("Image"),
        Width: width,
        Height: height,
        BitsPerComponent: 8,
        ColorSpace: _("DeviceGray")
      }, true);
      var stream = new PDFStream(rgb, {
        Type: _("XObject"),
        Subtype: _("Image"),
        Width: width,
        Height: height,
        BitsPerComponent: 8,
        ColorSpace: _("DeviceRGB"),
        SMask: pdf.attach(mask)
      }, true);
      stream._resourceName = _("I" + ++RESOURCE_COUNTER);
      return stream;
    };
  }
};
var PDFPattern = class extends PDFDictionary {
  constructor(fill, curPage, drawPattern2) {
    const { width, height } = fill.size();
    const page = new PDFPage(curPage._pdf, {});
    page._content = new PDFStream(makeOutput(), null, true);
    drawPattern2(fill, page, {});
    curPage._xResources = Object.assign(curPage._xResources, page._xResources);
    curPage._fontResources = Object.assign(curPage._fontResources, page._fontResources);
    curPage._gsResources = Object.assign(curPage._gsResources, page._gsResources);
    super({
      Type: _("Pattern"),
      PatternType: 1,
      PaintType: 1,
      TilingType: 1,
      BBox: [0, 0, width, height],
      XStep: width,
      YStep: height,
      Matrix: [1, 0, 0, -1, 0, height],
      Resources: {
        ExtGState: new PDFDictionary(page._gsResources),
        XObject: new PDFDictionary(page._xResources),
        Font: new PDFDictionary(page._fontResources)
      }
    });
    this._resourceName = _("P" + ++PATTERN_COUNTER);
    this.data = page._content.data;
    this.compress = true;
  }
  render(out) {
    PDFStream.prototype.render.call(this, out);
  }
};
var PDFStandardFont = class extends PDFDictionary {
  constructor(name) {
    super({
      Type: _("Font"),
      Subtype: _("Type1"),
      BaseFont: _(name)
    });
    this._resourceName = _("F" + ++RESOURCE_COUNTER);
  }
  encodeText(str) {
    return new PDFString(String(str));
  }
};
var PDFFont = class extends PDFDictionary {
  constructor(pdf, font, props) {
    super({});
    props = this.props;
    props.Type = _("Font");
    props.Subtype = _("Type0");
    props.Encoding = _("Identity-H");
    this._pdf = pdf;
    this._font = font;
    this._sub = font.makeSubset();
    this._resourceName = _("F" + ++RESOURCE_COUNTER);
    var head = font.head;
    this.name = font.psName;
    var scale = this.scale = font.scale;
    this.bbox = [
      head.xMin * scale,
      head.yMin * scale,
      head.xMax * scale,
      head.yMax * scale
    ];
    this.italicAngle = font.post.italicAngle;
    this.ascent = font.ascent * scale;
    this.descent = font.descent * scale;
    this.lineGap = font.lineGap * scale;
    this.capHeight = font.os2.capHeight || this.ascent;
    this.xHeight = font.os2.xHeight || 0;
    this.stemV = 0;
    this.familyClass = (font.os2.familyClass || 0) >> 8;
    this.isSerif = this.familyClass >= 1 && this.familyClass <= 7;
    this.isScript = this.familyClass == 10;
    this.flags = (font.post.isFixedPitch ? 1 : 0) | (this.isSerif ? 1 << 1 : 0) | (this.isScript ? 1 << 3 : 0) | (this.italicAngle !== 0 ? 1 << 6 : 0) | 1 << 5;
  }
  encodeText(text) {
    return new PDFHexString(this._sub.encodeText(String(text)));
  }
  getTextWidth(fontSize, text) {
    var width = 0, codeMap = this._font.cmap.codeMap;
    for (var i = 0; i < text.length; ++i) {
      var glyphId = codeMap[text.charCodeAt(i)];
      width += this._font.widthOfGlyph(glyphId || 0);
    }
    return width * fontSize / 1e3;
  }
  beforeRender() {
    var self = this;
    var sub = self._sub;
    var data = sub.render();
    var fontStream = new PDFStream(BinaryStream(data), {
      Length1: data.length
    }, true);
    var descriptor = self._pdf.attach(new PDFDictionary({
      Type: _("FontDescriptor"),
      FontName: _(self._sub.psName),
      FontBBox: self.bbox,
      Flags: self.flags,
      StemV: self.stemV,
      ItalicAngle: self.italicAngle,
      Ascent: self.ascent,
      Descent: self.descent,
      CapHeight: self.capHeight,
      XHeight: self.xHeight,
      FontFile2: self._pdf.attach(fontStream)
    }));
    var cmap = sub.ncid2ogid;
    var firstChar = sub.firstChar;
    var lastChar = sub.lastChar;
    var charWidths = [];
    (function loop(i, chunk) {
      if (i <= lastChar) {
        var gid = cmap[i];
        if (gid == null) {
          loop(i + 1);
        } else {
          if (!chunk) {
            charWidths.push(i, chunk = []);
          }
          chunk.push(self._font.widthOfGlyph(gid));
          loop(i + 1, chunk);
        }
      }
    })(firstChar);
    var descendant = new PDFDictionary({
      Type: _("Font"),
      Subtype: _("CIDFontType2"),
      BaseFont: _(self._sub.psName),
      CIDSystemInfo: new PDFDictionary({
        Registry: new PDFString("Adobe"),
        Ordering: new PDFString("Identity"),
        Supplement: 0
      }),
      FontDescriptor: descriptor,
      FirstChar: firstChar,
      LastChar: lastChar,
      DW: Math.round(self._font.widthOfGlyph(0)),
      W: charWidths,
      CIDToGIDMap: self._pdf.attach(self._makeCidToGidMap())
    });
    var dict = self.props;
    dict.BaseFont = _(self._sub.psName);
    dict.DescendantFonts = [self._pdf.attach(descendant)];
    var unimap = new PDFToUnicodeCmap(firstChar, lastChar, sub.subset);
    var unimapStream = new PDFStream(makeOutput(), null, true);
    unimapStream.data(unimap);
    dict.ToUnicode = self._pdf.attach(unimapStream);
  }
  _makeCidToGidMap() {
    return new PDFStream(BinaryStream(this._sub.cidToGidMap()), null, true);
  }
};
var PDFToUnicodeCmap = class extends PDFValue {
  constructor(firstChar, lastChar, map) {
    super();
    this.firstChar = firstChar;
    this.lastChar = lastChar;
    this.map = map;
  }
  render(out) {
    out.indent("/CIDInit /ProcSet findresource begin");
    out.indent("12 dict begin");
    out.indent("begincmap");
    out.indent("/CIDSystemInfo <<");
    out.indent("  /Registry (Adobe)");
    out.indent("  /Ordering (UCS)");
    out.indent("  /Supplement 0");
    out.indent(">> def");
    out.indent("/CMapName /Adobe-Identity-UCS def");
    out.indent("/CMapType 2 def");
    out.indent("1 begincodespacerange");
    out.indent("  <0000><ffff>");
    out.indent("endcodespacerange");
    var self = this;
    out.indent(self.lastChar - self.firstChar + 1, " beginbfchar");
    out.withIndent(function() {
      for (var code = self.firstChar; code <= self.lastChar; ++code) {
        var unicode = self.map[code];
        var str = ucs2encode([unicode]);
        out.indent("<", zeropad(code.toString(16), 4), ">", "<");
        for (var i = 0; i < str.length; ++i) {
          out(zeropad(str.charCodeAt(i).toString(16), 4));
        }
        out(">");
      }
    });
    out.indent("endbfchar");
    out.indent("endcmap");
    out.indent("CMapName currentdict /CMap defineresource pop");
    out.indent("end");
    out.indent("end");
  }
};
function makeHash(a) {
  return a.map(function(x) {
    return isArray(x) ? makeHash(x) : typeof x == "number" ? (Math.round(x * 1e3) / 1e3).toFixed(3) : x;
  }).join(" ");
}
function cacheColorGradientFunction(pdf, r1, g1, b1, r2, g2, b2) {
  var hash = makeHash([r1, g1, b1, r2, g2, b2]);
  var func = pdf.GRAD_COL_FUNCTIONS[hash];
  if (!func) {
    func = pdf.GRAD_COL_FUNCTIONS[hash] = pdf.attach(new PDFDictionary({
      FunctionType: 2,
      Domain: [0, 1],
      Range: [0, 1, 0, 1, 0, 1],
      N: 1,
      C0: [r1, g1, b1],
      C1: [r2, g2, b2]
    }));
  }
  return func;
}
function cacheOpacityGradientFunction(pdf, a1, a2) {
  var hash = makeHash([a1, a2]);
  var func = pdf.GRAD_OPC_FUNCTIONS[hash];
  if (!func) {
    func = pdf.GRAD_OPC_FUNCTIONS[hash] = pdf.attach(new PDFDictionary({
      FunctionType: 2,
      Domain: [0, 1],
      Range: [0, 1],
      N: 1,
      C0: [a1],
      C1: [a2]
    }));
  }
  return func;
}
function makeGradientFunctions(pdf, stops) {
  var hasAlpha = false;
  var opacities = [];
  var colors = [];
  var offsets = [];
  var encode = [];
  var i, prev, cur, prevColor, curColor;
  for (i = 1; i < stops.length; ++i) {
    prev = stops[i - 1];
    cur = stops[i];
    prevColor = prev.color;
    curColor = cur.color;
    colors.push(cacheColorGradientFunction(
      pdf,
      prevColor.r,
      prevColor.g,
      prevColor.b,
      curColor.r,
      curColor.g,
      curColor.b
    ));
    if (prevColor.a < 1 || curColor.a < 1) {
      hasAlpha = true;
    }
    offsets.push(cur.offset);
    encode.push(0, 1);
  }
  if (hasAlpha) {
    for (i = 1; i < stops.length; ++i) {
      prev = stops[i - 1];
      cur = stops[i];
      prevColor = prev.color;
      curColor = cur.color;
      opacities.push(cacheOpacityGradientFunction(
        pdf,
        prevColor.a,
        curColor.a
      ));
    }
  }
  offsets.pop();
  return {
    hasAlpha,
    colors: assemble(colors),
    opacities: hasAlpha ? assemble(opacities) : null
  };
  function assemble(funcs) {
    if (funcs.length == 1) {
      return funcs[0];
    }
    return {
      FunctionType: 3,
      Functions: funcs,
      Domain: [0, 1],
      Bounds: offsets,
      Encode: encode
    };
  }
}
function cacheColorGradient(pdf, isRadial, stops, coords, funcs, box) {
  var shading, hash;
  if (!box) {
    var a = [isRadial].concat(coords);
    stops.forEach(function(x) {
      a.push(x.offset, x.color.r, x.color.g, x.color.b);
    });
    hash = makeHash(a);
    shading = pdf.GRAD_COL[hash];
  }
  if (!shading) {
    shading = new PDFDictionary({
      Type: _("Shading"),
      ShadingType: isRadial ? 3 : 2,
      ColorSpace: _("DeviceRGB"),
      Coords: coords,
      Domain: [0, 1],
      Function: funcs,
      Extend: [true, true]
    });
    pdf.attach(shading);
    shading._resourceName = "S" + ++RESOURCE_COUNTER;
    if (hash) {
      pdf.GRAD_COL[hash] = shading;
    }
  }
  return shading;
}
function cacheOpacityGradient(pdf, isRadial, stops, coords, funcs, box) {
  var opacity, hash;
  if (!box) {
    var a = [isRadial].concat(coords);
    stops.forEach(function(x) {
      a.push(x.offset, x.color.a);
    });
    hash = makeHash(a);
    opacity = pdf.GRAD_OPC[hash];
  }
  if (!opacity) {
    opacity = new PDFDictionary({
      Type: _("ExtGState"),
      AIS: false,
      CA: 1,
      ca: 1,
      SMask: {
        Type: _("Mask"),
        S: _("Luminosity"),
        G: pdf.attach(new PDFStream("/a0 gs /s0 sh", {
          Type: _("XObject"),
          Subtype: _("Form"),
          FormType: 1,
          BBox: box ? [
            box.left,
            box.top + box.height,
            box.left + box.width,
            box.top
          ] : [0, 1, 1, 0],
          Group: {
            Type: _("Group"),
            S: _("Transparency"),
            CS: _("DeviceGray"),
            I: true
          },
          Resources: {
            ExtGState: {
              a0: { CA: 1, ca: 1 }
            },
            Shading: {
              s0: {
                ColorSpace: _("DeviceGray"),
                Coords: coords,
                Domain: [0, 1],
                ShadingType: isRadial ? 3 : 2,
                Function: funcs,
                Extend: [true, true]
              }
            }
          }
        }))
      }
    });
    pdf.attach(opacity);
    opacity._resourceName = "O" + ++RESOURCE_COUNTER;
    if (hash) {
      pdf.GRAD_OPC[hash] = opacity;
    }
  }
  return opacity;
}
function cacheGradient(pdf, gradient, box) {
  var isRadial = gradient.type == "radial";
  var funcs = makeGradientFunctions(pdf, gradient.stops);
  var coords = isRadial ? [
    gradient.start.x,
    gradient.start.y,
    gradient.start.r,
    gradient.end.x,
    gradient.end.y,
    gradient.end.r
  ] : [
    gradient.start.x,
    gradient.start.y,
    gradient.end.x,
    gradient.end.y
  ];
  var shading = cacheColorGradient(
    pdf,
    isRadial,
    gradient.stops,
    coords,
    funcs.colors,
    gradient.userSpace && box
  );
  var opacity = funcs.hasAlpha ? cacheOpacityGradient(
    pdf,
    isRadial,
    gradient.stops,
    coords,
    funcs.opacities,
    gradient.userSpace && box
  ) : null;
  return {
    hasAlpha: funcs.hasAlpha,
    shading,
    opacity
  };
}
var PDFPage = class extends PDFDictionary {
  constructor(pdf, props) {
    super(props);
    this._pdf = pdf;
    this._rcount = 0;
    this._textMode = false;
    this._fontResources = {};
    this._gsResources = {};
    this._xResources = {};
    this._patResources = {};
    this._shResources = {};
    this._opacity = 1;
    this._matrix = [1, 0, 0, 1, 0, 0];
    this._annotations = [];
    this._font = null;
    this._fontSize = null;
    this._contextStack = [];
    props = this.props;
    props.Type = _("Page");
    props.ProcSet = [
      _("PDF"),
      _("Text"),
      _("ImageB"),
      _("ImageC"),
      _("ImageI")
    ];
    props.Resources = new PDFDictionary({
      Font: new PDFDictionary(this._fontResources),
      ExtGState: new PDFDictionary(this._gsResources),
      XObject: new PDFDictionary(this._xResources),
      Pattern: new PDFDictionary(this._patResources),
      Shading: new PDFDictionary(this._shResources)
    });
    props.Annots = this._annotations;
  }
  _out() {
    this._content.data.apply(null, arguments);
  }
  transform(a, b, c, d, e, f) {
    if (!isIdentityMatrix(arguments)) {
      this._matrix = mmul(arguments, this._matrix);
      this._out(a, " ", b, " ", c, " ", d, " ", e, " ", f, " cm");
      this._out(NL);
    }
  }
  translate(dx, dy) {
    this.transform(1, 0, 0, 1, dx, dy);
  }
  scale(sx, sy) {
    this.transform(sx, 0, 0, sy, 0, 0);
  }
  rotate(angle) {
    var cos = Math.cos(angle), sin = Math.sin(angle);
    this.transform(cos, sin, -sin, cos, 0, 0);
  }
  beginText() {
    this._textMode = true;
    this._out("BT", NL);
  }
  endText() {
    this._textMode = false;
    this._out("ET", NL);
  }
  _requireTextMode() {
    if (!this._textMode) {
      throw new Error("Text mode required; call page.beginText() first");
    }
  }
  _requireFont() {
    if (!this._font) {
      throw new Error("No font selected; call page.setFont() first");
    }
  }
  setFont(font, size) {
    this._requireTextMode();
    if (font == null) {
      font = this._font;
    } else if (!(font instanceof PDFFont)) {
      font = this._pdf.getFont(font);
    }
    if (size == null) {
      size = this._fontSize;
    }
    this._fontResources[font._resourceName] = font;
    this._font = font;
    this._fontSize = size;
    this._out(font._resourceName, " ", size, " Tf", NL);
  }
  setTextLeading(size) {
    this._requireTextMode();
    this._out(size, " TL", NL);
  }
  setTextRenderingMode(mode) {
    this._requireTextMode();
    this._out(mode, " Tr", NL);
  }
  showText(text, requestedWidth) {
    this._requireFont();
    if (text.length > 1 && requestedWidth && this._font instanceof PDFFont) {
      var outputWidth = this._font.getTextWidth(this._fontSize, text);
      var scale = requestedWidth / outputWidth * 100;
      this._out(scale, " Tz ");
    }
    this._out(this._font.encodeText(text), " Tj", NL);
  }
  showTextNL(text) {
    this._requireFont();
    this._out(this._font.encodeText(text), " '", NL);
  }
  addLink(uri, box) {
    var ll = this._toPage({ x: box.left, y: box.bottom });
    var ur = this._toPage({ x: box.right, y: box.top });
    this._annotations.push(new PDFDictionary({
      Type: _("Annot"),
      Subtype: _("Link"),
      Rect: [ll.x, ll.y, ur.x, ur.y],
      Border: [0, 0, 0],
      A: new PDFDictionary({
        Type: _("Action"),
        S: _("URI"),
        URI: new PDFString(uri)
      })
    }));
  }
  setStrokeColor(r, g, b) {
    this._out(r, " ", g, " ", b, " RG", NL);
  }
  setOpacity(opacity) {
    this.setFillOpacity(opacity);
    this.setStrokeOpacity(opacity);
    this._opacity *= opacity;
  }
  setStrokeOpacity(opacity) {
    if (opacity < 1) {
      var gs = this._pdf.getOpacityGS(this._opacity * opacity, true);
      this._gsResources[gs._resourceName] = gs;
      this._out(gs._resourceName, " gs", NL);
    }
  }
  setFillColor(r, g, b) {
    this._out(r, " ", g, " ", b, " rg", NL);
  }
  pattern(fill, box, drawPattern2) {
    const pattern = this._pdf.getPattern(fill, this, drawPattern2);
    this._patResources[pattern._resourceName] = pattern;
    this._out("/Pattern cs", NL);
    this._out(pattern._resourceName, " scn", NL);
    this.rect(box.left, box.top, box.width, box.height);
    this.fill();
  }
  setFillOpacity(opacity) {
    if (opacity < 1) {
      var gs = this._pdf.getOpacityGS(this._opacity * opacity, false);
      this._gsResources[gs._resourceName] = gs;
      this._out(gs._resourceName, " gs", NL);
    }
  }
  gradient(gradient, box) {
    this.save();
    this.rect(box.left, box.top, box.width, box.height);
    this.clip();
    if (!gradient.userSpace) {
      this.transform(box.width, 0, 0, box.height, box.left, box.top);
    }
    var g = cacheGradient(this._pdf, gradient, box);
    var sname = g.shading._resourceName, oname;
    this._shResources[sname] = g.shading;
    if (g.hasAlpha) {
      oname = g.opacity._resourceName;
      this._gsResources[oname] = g.opacity;
      this._out("/" + oname + " gs ");
    }
    this._out("/" + sname + " sh", NL);
    this.restore();
  }
  setDashPattern(dashArray, dashPhase) {
    this._out(dashArray, " ", dashPhase, " d", NL);
  }
  setLineWidth(width) {
    this._out(width, " w", NL);
  }
  setLineCap(lineCap) {
    this._out(lineCap, " J", NL);
  }
  setLineJoin(lineJoin) {
    this._out(lineJoin, " j", NL);
  }
  setMitterLimit(mitterLimit) {
    this._out(mitterLimit, " M", NL);
  }
  save() {
    this._contextStack.push(this._context());
    this._out("q", NL);
  }
  restore() {
    this._out("Q", NL);
    this._context(this._contextStack.pop());
  }
  // paths
  moveTo(x, y) {
    this._out(x, " ", y, " m", NL);
  }
  lineTo(x, y) {
    this._out(x, " ", y, " l", NL);
  }
  bezier(x1, y1, x2, y2, x3, y3) {
    this._out(x1, " ", y1, " ", x2, " ", y2, " ", x3, " ", y3, " c", NL);
  }
  bezier1(x1, y1, x3, y3) {
    this._out(x1, " ", y1, " ", x3, " ", y3, " y", NL);
  }
  bezier2(x2, y2, x3, y3) {
    this._out(x2, " ", y2, " ", x3, " ", y3, " v", NL);
  }
  close() {
    this._out("h", NL);
  }
  rect(x, y, w, h) {
    this._out(x, " ", y, " ", w, " ", h, " re", NL);
  }
  ellipse(x, y, rx, ry) {
    function _X(v) {
      return x + v;
    }
    function _Y(v) {
      return y + v;
    }
    var k = 0.5522847498307936;
    this.moveTo(_X(0), _Y(ry));
    this.bezier(
      _X(rx * k),
      _Y(ry),
      _X(rx),
      _Y(ry * k),
      _X(rx),
      _Y(0)
    );
    this.bezier(
      _X(rx),
      _Y(-ry * k),
      _X(rx * k),
      _Y(-ry),
      _X(0),
      _Y(-ry)
    );
    this.bezier(
      _X(-rx * k),
      _Y(-ry),
      _X(-rx),
      _Y(-ry * k),
      _X(-rx),
      _Y(0)
    );
    this.bezier(
      _X(-rx),
      _Y(ry * k),
      _X(-rx * k),
      _Y(ry),
      _X(0),
      _Y(ry)
    );
  }
  circle(x, y, r) {
    this.ellipse(x, y, r, r);
  }
  stroke() {
    this._out("S", NL);
  }
  nop() {
    this._out("n", NL);
  }
  clip() {
    this._out("W n", NL);
  }
  clipStroke() {
    this._out("W S", NL);
  }
  closeStroke() {
    this._out("s", NL);
  }
  fill() {
    this._out("f", NL);
  }
  fillStroke() {
    this._out("B", NL);
  }
  drawImage(url) {
    var img = this._pdf.getImage(url);
    if (img) {
      this._xResources[img._resourceName] = img;
      this._out(img._resourceName, " Do", NL);
    }
  }
  comment(txt) {
    var self = this;
    txt.split(/\r?\n/g).forEach(function(line) {
      self._out("% ", line, NL);
    });
  }
  // internal
  _context(val) {
    if (val != null) {
      this._opacity = val.opacity;
      this._matrix = val.matrix;
    } else {
      return {
        opacity: this._opacity,
        matrix: this._matrix
      };
    }
  }
  _toPage(p) {
    var m = this._matrix;
    var a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5];
    return {
      x: a * p.x + c * p.y + e,
      y: b * p.x + d * p.y + f
    };
  }
};
function unquote(str) {
  return str.replace(/^\s*(['"])(.*)\1\s*$/, "$2");
}
function parseFontDef(fontdef) {
  var rx = /^\s*((normal|italic)\s+)?(([a-z0-9-]+)\s+)?((normal|bold|\d+)\s+)?(([0-9.]+)(px|pt))(\/(([0-9.]+)(px|pt)|normal))?\s+(.*?)\s*$/i;
  var m = rx.exec(fontdef);
  if (!m) {
    return { fontSize: 12, fontFamily: "sans-serif" };
  }
  var fontSize = m[8] ? parseInt(m[8], 10) : 12;
  return {
    italic: m[2] && m[2].toLowerCase() == "italic",
    variant: m[4],
    bold: m[6] && /bold|700/i.test(m[6]),
    fontSize,
    lineHeight: m[12] ? m[12] == "normal" ? fontSize : parseInt(m[12], 10) : null,
    fontFamily: m[14].split(/\s*,\s*/g).map(unquote)
  };
}
function getFontURL(style) {
  function mkFamily(name2) {
    if (style.bold) {
      name2 += "|bold";
    }
    if (style.italic) {
      name2 += "|italic";
    }
    return name2.toLowerCase();
  }
  var fontFamily = style.fontFamily;
  var name, url;
  if (fontFamily instanceof Array) {
    for (var i = 0; i < fontFamily.length; ++i) {
      name = mkFamily(fontFamily[i]);
      url = FONT_MAPPINGS[name];
      if (url) {
        break;
      }
    }
  } else {
    url = FONT_MAPPINGS[fontFamily.toLowerCase()];
  }
  while (typeof url == "function") {
    url = url();
  }
  if (!url) {
    url = "Times-Roman";
  }
  return url;
}
var FONT_MAPPINGS = {
  "serif": "Times-Roman",
  "serif|bold": "Times-Bold",
  "serif|italic": "Times-Italic",
  "serif|bold|italic": "Times-BoldItalic",
  "sans-serif": "Helvetica",
  "sans-serif|bold": "Helvetica-Bold",
  "sans-serif|italic": "Helvetica-Oblique",
  "sans-serif|bold|italic": "Helvetica-BoldOblique",
  "monospace": "Courier",
  "monospace|bold": "Courier-Bold",
  "monospace|italic": "Courier-Oblique",
  "monospace|bold|italic": "Courier-BoldOblique",
  "zapfdingbats": "ZapfDingbats",
  "zapfdingbats|bold": "ZapfDingbats",
  "zapfdingbats|italic": "ZapfDingbats",
  "zapfdingbats|bold|italic": "ZapfDingbats"
};
function fontAlias(alias, name) {
  alias = alias.toLowerCase();
  FONT_MAPPINGS[alias] = function() {
    return FONT_MAPPINGS[name];
  };
  FONT_MAPPINGS[alias + "|bold"] = function() {
    return FONT_MAPPINGS[name + "|bold"];
  };
  FONT_MAPPINGS[alias + "|italic"] = function() {
    return FONT_MAPPINGS[name + "|italic"];
  };
  FONT_MAPPINGS[alias + "|bold|italic"] = function() {
    return FONT_MAPPINGS[name + "|bold|italic"];
  };
}
fontAlias("Times New Roman", "serif");
fontAlias("Courier New", "monospace");
fontAlias("Arial", "sans-serif");
fontAlias("Helvetica", "sans-serif");
fontAlias("Verdana", "sans-serif");
fontAlias("Tahoma", "sans-serif");
fontAlias("Georgia", "sans-serif");
fontAlias("Monaco", "monospace");
fontAlias("Andale Mono", "monospace");
function defineFont(name, url) {
  if (arguments.length == 1) {
    for (var i in name) {
      if (hasOwnProperty2(name, i)) {
        defineFont(i, name[i]);
      }
    }
  } else {
    name = name.toLowerCase();
    FONT_MAPPINGS[name] = url;
    switch (name) {
      case "dejavu sans":
        FONT_MAPPINGS["sans-serif"] = url;
        break;
      case "dejavu sans|bold":
        FONT_MAPPINGS["sans-serif|bold"] = url;
        break;
      case "dejavu sans|italic":
        FONT_MAPPINGS["sans-serif|italic"] = url;
        break;
      case "dejavu sans|bold|italic":
        FONT_MAPPINGS["sans-serif|bold|italic"] = url;
        break;
      case "dejavu serif":
        FONT_MAPPINGS["serif"] = url;
        break;
      case "dejavu serif|bold":
        FONT_MAPPINGS["serif|bold"] = url;
        break;
      case "dejavu serif|italic":
        FONT_MAPPINGS["serif|italic"] = url;
        break;
      case "dejavu serif|bold|italic":
        FONT_MAPPINGS["serif|bold|italic"] = url;
        break;
      case "dejavu mono":
        FONT_MAPPINGS["monospace"] = url;
        break;
      case "dejavu mono|bold":
        FONT_MAPPINGS["monospace|bold"] = url;
        break;
      case "dejavu mono|italic":
        FONT_MAPPINGS["monospace|italic"] = url;
        break;
      case "dejavu mono|bold|italic":
        FONT_MAPPINGS["monospace|bold|italic"] = url;
        break;
    }
  }
}
function mmul(a, b) {
  var a1 = a[0], b1 = a[1], c1 = a[2], d1 = a[3], e1 = a[4], f1 = a[5];
  var a2 = b[0], b2 = b[1], c2 = b[2], d2 = b[3], e2 = b[4], f2 = b[5];
  return [
    a1 * a2 + b1 * c2,
    a1 * b2 + b1 * d2,
    c1 * a2 + d1 * c2,
    c1 * b2 + d1 * d2,
    e1 * a2 + f1 * c2 + e2,
    e1 * b2 + f1 * d2 + f2
  ];
}
function isIdentityMatrix(m) {
  return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0;
}
var TEXT_RENDERING_MODE = {
  fill: 0,
  stroke: 1,
  fillAndStroke: 2,
  invisible: 3,
  fillAndClip: 4,
  strokeAndClip: 5,
  fillStrokeClip: 6,
  clip: 7
};

// node_modules/@progress/kendo-drawing/dist/es/drawing.js
var drawing_exports = {};
__export(drawing_exports, {
  Animation: () => animation_default,
  AnimationFactory: () => animation_factory_default,
  Arc: () => arc_default2,
  BaseNode: () => base_node_default,
  Circle: () => circle_default2,
  Element: () => element_default,
  Gradient: () => gradient_default,
  GradientStop: () => gradient_stop_default,
  Group: () => group_default,
  HasObservers: () => has_observers_default,
  Image: () => image_default,
  Layout: () => layout_default,
  LinearGradient: () => linear_gradient_default,
  MultiPath: () => MultiPath,
  OptionsStore: () => options_store_default,
  Path: () => Path,
  PathParser: () => path_parser_default,
  Pattern: () => Pattern,
  QuadNode: () => quad_node_default,
  RadialGradient: () => radial_gradient_default,
  Rect: () => rect_default2,
  ShapesQuadTree: () => shapes_quad_tree_default,
  Surface: () => surface_default4,
  SurfaceFactory: () => surface_factory_default,
  Text: () => text_default,
  align: () => align,
  canvas: () => canvas_exports,
  crosshatchPattern: () => crosshatchPattern,
  diagonalStripesPattern: () => diagonalStripesPattern,
  dotsPattern: () => dotsPattern,
  exportImage: () => exportImage,
  exportSVG: () => exportSVG,
  fit: () => fit,
  gridPattern: () => gridPattern,
  parsePath: () => parse_path_default,
  stack: () => stack,
  svg: () => svg_exports,
  util: () => util_exports,
  vAlign: () => vAlign,
  vStack: () => vStack,
  vWrap: () => vWrap,
  verticalStripesPattern: () => verticalStripesPattern,
  wrap: () => wrap
});

// node_modules/@progress/kendo-drawing/dist/es/core/has-observers.js
var HasObservers = class extends Class {
  observers() {
    this._observers = this._observers || [];
    return this._observers;
  }
  addObserver(element) {
    if (!this._observers) {
      this._observers = [element];
    } else {
      this._observers.push(element);
    }
    return this;
  }
  removeObserver(element) {
    const observers = this.observers();
    const index = observers.indexOf(element);
    if (index !== -1) {
      observers.splice(index, 1);
    }
    return this;
  }
  trigger(methodName, event) {
    const observers = this._observers;
    if (observers && !this._suspended) {
      for (let idx = 0; idx < observers.length; idx++) {
        let observer = observers[idx];
        if (observer[methodName]) {
          observer[methodName](event);
        }
      }
    }
    return this;
  }
  optionsChange(e = {}) {
    e.element = this;
    this.trigger("optionsChange", e);
  }
  geometryChange() {
    this.trigger("geometryChange", {
      element: this
    });
  }
  suspend() {
    this._suspended = (this._suspended || 0) + 1;
    return this;
  }
  resume() {
    this._suspended = Math.max((this._suspended || 0) - 1, 0);
    return this;
  }
  _observerField(field, value) {
    if (this[field]) {
      this[field].removeObserver(this);
    }
    this[field] = value;
    value.addObserver(this);
  }
};
var has_observers_default = HasObservers;

// node_modules/@progress/kendo-drawing/dist/es/core/options-store.js
var toString = {}.toString;
var OptionsStore = class _OptionsStore extends has_observers_default {
  constructor(options2, prefix = "") {
    super();
    this.prefix = prefix;
    for (let field in options2) {
      let member = options2[field];
      member = this._wrap(member, field);
      this[field] = member;
    }
  }
  get(field) {
    const parts = field.split(".");
    let result = this;
    while (parts.length && result) {
      let part = parts.shift();
      result = result[part];
    }
    return result;
  }
  set(field, value) {
    const current = this.get(field);
    if (current !== value) {
      this._set(field, this._wrap(value, field));
      this.optionsChange({
        field: this.prefix + field,
        value
      });
    }
  }
  _set(field, value) {
    const composite = field.indexOf(".") >= 0;
    let parentObj = this;
    let fieldName = field;
    if (composite) {
      const parts = fieldName.split(".");
      let prefix = this.prefix;
      while (parts.length > 1) {
        fieldName = parts.shift();
        prefix += fieldName + ".";
        let obj = parentObj[fieldName];
        if (!obj) {
          obj = new _OptionsStore({}, prefix);
          obj.addObserver(this);
          parentObj[fieldName] = obj;
        }
        parentObj = obj;
      }
      fieldName = parts[0];
    }
    parentObj._clear(fieldName);
    parentObj[fieldName] = value;
  }
  _clear(field) {
    const current = this[field];
    if (current && current.removeObserver) {
      current.removeObserver(this);
    }
  }
  _wrap(object, field) {
    const type = toString.call(object);
    let wrapped = object;
    if (wrapped !== null && wrapped !== void 0 && type === "[object Object]") {
      if (!(object instanceof _OptionsStore) && !(object instanceof Class)) {
        wrapped = new _OptionsStore(wrapped, this.prefix + field + ".");
      }
      wrapped.addObserver(this);
    }
    return wrapped;
  }
};
var options_store_default = OptionsStore;

// node_modules/@progress/kendo-drawing/dist/es/mixins/with-accessors.js
function setAccessor(field) {
  return function(value) {
    if (this[field] !== value) {
      this[field] = value;
      this.geometryChange();
    }
    return this;
  };
}
function getAccessor(field) {
  return function() {
    return this[field];
  };
}
function defineAccessors(fn, fields) {
  for (let i = 0; i < fields.length; i++) {
    let name = fields[i];
    let capitalized = name.charAt(0).toUpperCase() + name.substring(1, name.length);
    fn["set" + capitalized] = setAccessor(name);
    fn["get" + capitalized] = getAccessor(name);
  }
}
var withAccessors = (TBase, names) => {
  const result = class extends TBase {
  };
  defineAccessors(result.prototype, names);
  return result;
};
var with_accessors_default = withAccessors;

// node_modules/@progress/kendo-drawing/dist/es/geometry/to-matrix.js
function toMatrix(transformation) {
  if (transformation && typeof transformation.matrix === "function") {
    return transformation.matrix();
  }
  return transformation;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/point.js
var Point = class _Point extends with_accessors_default(has_observers_default, ["x", "y"]) {
  constructor(x, y) {
    super();
    this.x = x || 0;
    this.y = y || 0;
  }
  equals(other) {
    return other && other.x === this.x && other.y === this.y;
  }
  clone() {
    return new _Point(this.x, this.y);
  }
  rotate(angle, origin) {
    const originPoint = _Point.create(origin) || _Point.ZERO;
    return this.transform(matrix_default.rotate(angle, originPoint.x, originPoint.y));
  }
  translate(x, y) {
    this.x += x;
    this.y += y;
    this.geometryChange();
    return this;
  }
  translateWith(point2) {
    return this.translate(point2.x, point2.y);
  }
  move(x, y) {
    this.x = this.y = 0;
    return this.translate(x, y);
  }
  scale(scaleX, scaleY = scaleX) {
    this.x *= scaleX;
    this.y *= scaleY;
    this.geometryChange();
    return this;
  }
  scaleCopy(scaleX, scaleY) {
    return this.clone().scale(scaleX, scaleY);
  }
  transform(transformation) {
    const matrix = toMatrix(transformation);
    const { x, y } = this;
    this.x = matrix.a * x + matrix.c * y + matrix.e;
    this.y = matrix.b * x + matrix.d * y + matrix.f;
    this.geometryChange();
    return this;
  }
  transformCopy(transformation) {
    const point2 = this.clone();
    if (transformation) {
      point2.transform(transformation);
    }
    return point2;
  }
  distanceTo(point2) {
    const dx = this.x - point2.x;
    const dy = this.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  round(digits) {
    this.x = round(this.x, digits);
    this.y = round(this.y, digits);
    this.geometryChange();
    return this;
  }
  toArray(digits) {
    const doRound = digits !== void 0;
    const x = doRound ? round(this.x, digits) : this.x;
    const y = doRound ? round(this.y, digits) : this.y;
    return [x, y];
  }
  toString(digits, separator = " ") {
    let { x, y } = this;
    if (digits !== void 0) {
      x = round(x, digits);
      y = round(y, digits);
    }
    return x + separator + y;
  }
  static create(arg0, arg1) {
    if (arg0 !== void 0) {
      if (arg0 instanceof _Point) {
        return arg0;
      } else if (arguments.length === 1 && arg0.length === 2) {
        return new _Point(arg0[0], arg0[1]);
      }
      return new _Point(arg0, arg1);
    }
  }
  static min() {
    let minX = MAX_NUM;
    let minY = MAX_NUM;
    for (let i = 0; i < arguments.length; i++) {
      let point2 = arguments[i];
      minX = Math.min(point2.x, minX);
      minY = Math.min(point2.y, minY);
    }
    return new _Point(minX, minY);
  }
  static max() {
    let maxX = MIN_NUM;
    let maxY = MIN_NUM;
    for (let i = 0; i < arguments.length; i++) {
      const point2 = arguments[i];
      maxX = Math.max(point2.x, maxX);
      maxY = Math.max(point2.y, maxY);
    }
    return new _Point(maxX, maxY);
  }
  static minPoint() {
    return new _Point(MIN_NUM, MIN_NUM);
  }
  static maxPoint() {
    return new _Point(MAX_NUM, MAX_NUM);
  }
  static get ZERO() {
    return new _Point(0, 0);
  }
};
var point_default = Point;

// node_modules/@progress/kendo-drawing/dist/es/geometry/size.js
var Size = class _Size extends with_accessors_default(has_observers_default, ["width", "height"]) {
  constructor(width, height) {
    super();
    this.width = width || 0;
    this.height = height || 0;
  }
  equals(other) {
    return other && other.width === this.width && other.height === this.height;
  }
  clone() {
    return new _Size(this.width, this.height);
  }
  toArray(digits) {
    const doRound = digits !== void 0;
    const width = doRound ? round(this.width, digits) : this.width;
    const height = doRound ? round(this.height, digits) : this.height;
    return [width, height];
  }
  static create(arg0, arg1) {
    if (arg0 !== void 0) {
      if (arg0 instanceof _Size) {
        return arg0;
      } else if (arguments.length === 1 && arg0.length === 2) {
        return new _Size(arg0[0], arg0[1]);
      }
      return new _Size(arg0, arg1);
    }
  }
  static get ZERO() {
    return new _Size(0, 0);
  }
};
var size_default = Size;

// node_modules/@progress/kendo-drawing/dist/es/geometry/rect.js
var Rect = class _Rect extends has_observers_default {
  constructor(origin = new point_default(), size = new size_default(), cornerRadius = 0) {
    super();
    this.setOrigin(origin);
    this.setSize(size);
    this.setCornerRadius(cornerRadius);
  }
  clone() {
    return new _Rect(
      this.origin.clone(),
      this.size.clone()
    );
  }
  equals(other) {
    return other && other.origin.equals(this.origin) && other.size.equals(this.size);
  }
  setOrigin(value) {
    this._observerField("origin", point_default.create(value));
    this.geometryChange();
    return this;
  }
  getOrigin() {
    return this.origin;
  }
  setCornerRadius(radius) {
    this.cornerRadius = Array.isArray(radius) ? radius : [radius, radius];
    this.geometryChange();
    return this;
  }
  getCornerRadius() {
    return this.cornerRadius;
  }
  setSize(value) {
    this._observerField("size", size_default.create(value));
    this.geometryChange();
    return this;
  }
  getSize() {
    return this.size;
  }
  width() {
    return this.size.width;
  }
  height() {
    return this.size.height;
  }
  topLeft() {
    return this.origin.clone();
  }
  bottomRight() {
    return this.origin.clone().translate(this.width(), this.height());
  }
  topRight() {
    return this.origin.clone().translate(this.width(), 0);
  }
  bottomLeft() {
    return this.origin.clone().translate(0, this.height());
  }
  center() {
    return this.origin.clone().translate(this.width() / 2, this.height() / 2);
  }
  bbox(matrix) {
    const tl = this.topLeft().transformCopy(matrix);
    const tr = this.topRight().transformCopy(matrix);
    const br = this.bottomRight().transformCopy(matrix);
    const bl = this.bottomLeft().transformCopy(matrix);
    return _Rect.fromPoints(tl, tr, br, bl);
  }
  transformCopy(m) {
    return _Rect.fromPoints(
      this.topLeft().transform(m),
      this.bottomRight().transform(m)
    );
  }
  expand(x, y = x) {
    this.size.width += 2 * x;
    this.size.height += 2 * y;
    this.origin.translate(-x, -y);
    return this;
  }
  expandCopy(x, y) {
    return this.clone().expand(x, y);
  }
  containsPoint(point2) {
    const origin = this.origin;
    const bottomRight = this.bottomRight();
    return !(point2.x < origin.x || point2.y < origin.y || bottomRight.x < point2.x || bottomRight.y < point2.y);
  }
  _isOnPath(point2, width) {
    const rectOuter = this.expandCopy(width, width);
    const rectInner = this.expandCopy(-width, -width);
    return rectOuter.containsPoint(point2) && !rectInner.containsPoint(point2);
  }
  static fromPoints() {
    const topLeft = point_default.min.apply(null, arguments);
    const bottomRight = point_default.max.apply(null, arguments);
    const size = new size_default(
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );
    return new _Rect(topLeft, size);
  }
  static union(a, b) {
    return _Rect.fromPoints(
      point_default.min(a.topLeft(), b.topLeft()),
      point_default.max(a.bottomRight(), b.bottomRight())
    );
  }
  static intersect(a, b) {
    const rect1 = {
      left: a.topLeft().x,
      top: a.topLeft().y,
      right: a.bottomRight().x,
      bottom: a.bottomRight().y
    };
    const rect2 = {
      left: b.topLeft().x,
      top: b.topLeft().y,
      right: b.bottomRight().x,
      bottom: b.bottomRight().y
    };
    if (rect1.left <= rect2.right && rect2.left <= rect1.right && rect1.top <= rect2.bottom && rect2.top <= rect1.bottom) {
      return _Rect.fromPoints(
        new point_default(Math.max(rect1.left, rect2.left), Math.max(rect1.top, rect2.top)),
        new point_default(Math.min(rect1.right, rect2.right), Math.min(rect1.bottom, rect2.bottom))
      );
    }
  }
};
var rect_default = Rect;

// node_modules/@progress/kendo-drawing/dist/es/geometry/transformation.js
var Transformation = class _Transformation extends has_observers_default {
  constructor(matrix = matrix_default.unit()) {
    super();
    this._matrix = matrix;
  }
  clone() {
    return new _Transformation(
      this._matrix.clone()
    );
  }
  equals(other) {
    return other && other._matrix.equals(this._matrix);
  }
  translate(x, y) {
    this._matrix = this._matrix.multiplyCopy(matrix_default.translate(x, y));
    this._optionsChange();
    return this;
  }
  scale(scaleX, scaleY = scaleX, origin = null) {
    let originPoint = origin;
    if (originPoint) {
      originPoint = point_default.create(originPoint);
      this._matrix = this._matrix.multiplyCopy(matrix_default.translate(originPoint.x, originPoint.y));
    }
    this._matrix = this._matrix.multiplyCopy(matrix_default.scale(scaleX, scaleY));
    if (originPoint) {
      this._matrix = this._matrix.multiplyCopy(matrix_default.translate(-originPoint.x, -originPoint.y));
    }
    this._optionsChange();
    return this;
  }
  rotate(angle, origin) {
    const originPoint = point_default.create(origin) || point_default.ZERO;
    this._matrix = this._matrix.multiplyCopy(matrix_default.rotate(angle, originPoint.x, originPoint.y));
    this._optionsChange();
    return this;
  }
  multiply(transformation) {
    const matrix = toMatrix(transformation);
    this._matrix = this._matrix.multiplyCopy(matrix);
    this._optionsChange();
    return this;
  }
  matrix(value) {
    if (value) {
      this._matrix = value;
      this._optionsChange();
      return this;
    }
    return this._matrix;
  }
  _optionsChange() {
    this.optionsChange({
      field: "transform",
      value: this
    });
  }
};
var transformation_default = Transformation;

// node_modules/@progress/kendo-drawing/dist/es/geometry/transform.js
function transform(matrix) {
  if (matrix === null) {
    return null;
  }
  if (matrix instanceof transformation_default) {
    return matrix;
  }
  return new transformation_default(matrix);
}

// node_modules/@progress/kendo-drawing/dist/es/core/constants.js
var DASH_ARRAYS = {
  dot: [1.5, 3.5],
  dash: [4, 3.5],
  longdash: [8, 3.5],
  dashdot: [3.5, 3.5, 1.5, 3.5],
  longdashdot: [8, 3.5, 1.5, 3.5],
  longdashdotdot: [8, 3.5, 1.5, 3.5, 1.5, 3.5]
};
var SOLID = "solid";
var BUTT = "butt";
var PATTERN = "Pattern";

// node_modules/@progress/kendo-drawing/dist/es/shapes/element.js
var Element2 = class extends has_observers_default {
  get nodeType() {
    return "Rect";
  }
  constructor(options2) {
    super();
    this._initOptions(options2);
  }
  _initOptions(options2 = {}) {
    const { clip, transform: transform2 } = options2;
    if (transform2) {
      options2.transform = transform(transform2);
    }
    if (clip && !clip.id) {
      clip.id = definitionId();
    }
    this.options = new options_store_default(options2);
    this.options.addObserver(this);
  }
  transform(value) {
    if (value !== void 0) {
      this.options.set("transform", transform(value));
    } else {
      return this.options.get("transform");
    }
  }
  parentTransform() {
    let element = this;
    let parentMatrix;
    while (element.parent) {
      element = element.parent;
      let transformation = element.transform();
      if (transformation) {
        parentMatrix = transformation.matrix().multiplyCopy(parentMatrix || matrix_default.unit());
      }
    }
    if (parentMatrix) {
      return transform(parentMatrix);
    }
  }
  currentTransform(parentTransform = this.parentTransform()) {
    const elementTransform = this.transform();
    const elementMatrix = toMatrix(elementTransform);
    let parentMatrix = toMatrix(parentTransform);
    let combinedMatrix;
    if (elementMatrix && parentMatrix) {
      combinedMatrix = parentMatrix.multiplyCopy(elementMatrix);
    } else {
      combinedMatrix = elementMatrix || parentMatrix;
    }
    if (combinedMatrix) {
      return transform(combinedMatrix);
    }
  }
  visible(value) {
    if (value !== void 0) {
      this.options.set("visible", value);
      return this;
    }
    return this.options.get("visible") !== false;
  }
  clip(value) {
    const options2 = this.options;
    if (value !== void 0) {
      if (value && !value.id) {
        value.id = definitionId();
      }
      options2.set("clip", value);
      return this;
    }
    return options2.get("clip");
  }
  opacity(value) {
    if (value !== void 0) {
      this.options.set("opacity", value);
      return this;
    }
    return valueOrDefault(this.options.get("opacity"), 1);
  }
  className(value) {
    if (value !== void 0) {
      this.options.set("className", value);
      return this;
    }
    return this.options.get("className");
  }
  clippedBBox(transformation) {
    const bbox = this._clippedBBox(transformation);
    if (bbox) {
      const clip = this.clip();
      return clip ? rect_default.intersect(bbox, clip.bbox(transformation)) : bbox;
    }
  }
  containsPoint(point2, parentTransform) {
    if (this.visible()) {
      const transform2 = this.currentTransform(parentTransform);
      let transformedPoint = point2;
      if (transform2) {
        transformedPoint = point2.transformCopy(transform2.matrix().invert());
      }
      return this._hasFill() && this._containsPoint(transformedPoint) || this._isOnPath && this._hasStroke() && this._isOnPath(transformedPoint);
    }
    return false;
  }
  _hasFill() {
    const fill = this.options.fill;
    return fill && (fill.nodeType === PATTERN || !isTransparent(fill.color));
  }
  _hasStroke() {
    const stroke = this.options.stroke;
    return stroke && stroke.width > 0 && !isTransparent(stroke.color);
  }
  _clippedBBox(transformation) {
    return this.bbox(transformation);
  }
};
var element_default = Element2;

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/ellipse-extreme-angles.js
function ellipseExtremeAngles(center, rx, ry, matrix) {
  let extremeX = 0;
  let extremeY = 0;
  if (matrix) {
    extremeX = Math.atan2(matrix.c * ry, matrix.a * rx);
    if (matrix.b !== 0) {
      extremeY = Math.atan2(matrix.d * ry, matrix.b * rx);
    }
  }
  return {
    x: extremeX,
    y: extremeY
  };
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/circle.js
var PI_DIV_2 = Math.PI / 2;
var Circle = class _Circle extends with_accessors_default(has_observers_default, ["radius"]) {
  constructor(center = new point_default(), radius = 0) {
    super();
    this.setCenter(center);
    this.setRadius(radius);
  }
  setCenter(value) {
    this._observerField("center", point_default.create(value));
    this.geometryChange();
    return this;
  }
  getCenter() {
    return this.center;
  }
  equals(other) {
    return other && other.center.equals(this.center) && other.radius === this.radius;
  }
  clone() {
    return new _Circle(this.center.clone(), this.radius);
  }
  pointAt(angle) {
    return this._pointAt(rad(angle));
  }
  bbox(matrix) {
    const extremeAngles = ellipseExtremeAngles(this.center, this.radius, this.radius, matrix);
    let minPoint = point_default.maxPoint();
    let maxPoint = point_default.minPoint();
    for (let i = 0; i < 4; i++) {
      let currentPointX = this._pointAt(extremeAngles.x + i * PI_DIV_2).transformCopy(matrix);
      let currentPointY = this._pointAt(extremeAngles.y + i * PI_DIV_2).transformCopy(matrix);
      let currentPoint = new point_default(currentPointX.x, currentPointY.y);
      minPoint = point_default.min(minPoint, currentPoint);
      maxPoint = point_default.max(maxPoint, currentPoint);
    }
    return rect_default.fromPoints(minPoint, maxPoint);
  }
  _pointAt(angle) {
    const { center, radius } = this;
    return new point_default(
      center.x + radius * Math.cos(angle),
      center.y + radius * Math.sin(angle)
    );
  }
  containsPoint(point2) {
    const { center, radius } = this;
    const inCircle = Math.pow(point2.x - center.x, 2) + Math.pow(point2.y - center.y, 2) <= Math.pow(radius, 2);
    return inCircle;
  }
  _isOnPath(point2, width) {
    const { center, radius } = this;
    const pointDistance = center.distanceTo(point2);
    return radius - width <= pointDistance && pointDistance <= radius + width;
  }
};
var circle_default = Circle;

// node_modules/@progress/kendo-drawing/dist/es/mixins/paintable.js
var GRADIENT = "Gradient";
var paintable = (TBase) => class extends TBase {
  fill(color, opacity) {
    const options2 = this.options;
    if (color !== void 0) {
      if (color && color.nodeType !== GRADIENT) {
        const newFill = {
          color
        };
        if (opacity !== void 0) {
          newFill.opacity = opacity;
        }
        options2.set("fill", newFill);
      } else {
        options2.set("fill", color);
      }
      return this;
    }
    return options2.get("fill");
  }
  stroke(color, width, opacity) {
    if (color !== void 0) {
      this.options.set("stroke.color", color);
      if (width !== void 0) {
        this.options.set("stroke.width", width);
      }
      if (opacity !== void 0) {
        this.options.set("stroke.opacity", opacity);
      }
      return this;
    }
    return this.options.get("stroke");
  }
};
var paintable_default = paintable;

// node_modules/@progress/kendo-drawing/dist/es/mixins/measurable.js
var IDENTITY_MATRIX_HASH = matrix_default.IDENTITY.toString();
var measurable = (TBase) => class extends TBase {
  bbox(transformation) {
    const combinedMatrix = toMatrix(this.currentTransform(transformation));
    const matrixHash = combinedMatrix ? combinedMatrix.toString() : IDENTITY_MATRIX_HASH;
    let bbox;
    if (this._bboxCache && this._matrixHash === matrixHash) {
      bbox = this._bboxCache.clone();
    } else {
      bbox = this._bbox(combinedMatrix);
      this._bboxCache = bbox ? bbox.clone() : null;
      this._matrixHash = matrixHash;
    }
    const strokeWidth = this.options.get("stroke.width");
    if (strokeWidth && bbox) {
      bbox.expand(strokeWidth / 2);
    }
    return bbox;
  }
  geometryChange() {
    delete this._bboxCache;
    this.trigger("geometryChange", {
      element: this
    });
  }
};
var measurable_default = measurable;

// node_modules/@progress/kendo-drawing/dist/es/mixins/with-geometry.js
function geometryAccessor(name) {
  const fieldName = "_" + name;
  return function(value) {
    if (value !== void 0) {
      this._observerField(fieldName, value);
      this.geometryChange();
      return this;
    }
    return this[fieldName];
  };
}
function defineGeometryAccessors(fn, names) {
  for (let i = 0; i < names.length; i++) {
    fn[names[i]] = geometryAccessor(names[i]);
  }
}
var withGeometry = (TBase, names = ["geometry"]) => {
  const result = class extends TBase {
  };
  defineGeometryAccessors(result.prototype, names);
  return result;
};
var with_geometry_default = withGeometry;

// node_modules/@progress/kendo-drawing/dist/es/shapes/circle.js
var DEFAULT_STROKE = "#000";
var Circle2 = class extends paintable_default(measurable_default(with_geometry_default(element_default))) {
  get nodeType() {
    return "Circle";
  }
  constructor(geometry = new circle_default(), options2 = {}) {
    super(options2);
    this.geometry(geometry);
    if (this.options.stroke === void 0) {
      this.stroke(DEFAULT_STROKE);
    }
  }
  rawBBox() {
    return this._geometry.bbox();
  }
  _bbox(matrix) {
    return this._geometry.bbox(matrix);
  }
  _containsPoint(point2) {
    return this.geometry().containsPoint(point2);
  }
  _isOnPath(point2) {
    return this.geometry()._isOnPath(point2, this.options.stroke.width / 2);
  }
};
var circle_default2 = Circle2;

// node_modules/@progress/kendo-drawing/dist/es/geometry/constants.js
var PRECISION = 10;

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/close.js
function close(a, b, tolerance = PRECISION) {
  return round(Math.abs(a - b), tolerance) === 0;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/close-or-less.js
function closeOrLess(a, b, tolerance) {
  return a < b || close(a, b, tolerance);
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/line-intersection.js
function lineIntersection(p0, p1, p2, p3) {
  const s1x = p1.x - p0.x;
  const s2x = p3.x - p2.x;
  const s1y = p1.y - p0.y;
  const s2y = p3.y - p2.y;
  const nx = p0.x - p2.x;
  const ny = p0.y - p2.y;
  const d = s1x * s2y - s2x * s1y;
  const s = (s1x * ny - s1y * nx) / d;
  const t = (s2x * ny - s2y * nx) / d;
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return new point_default(p0.x + t * s1x, p0.y + t * s1y);
  }
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/arc.js
var MAX_INTERVAL = 45;
var pow2 = Math.pow;
var accessors = ["radiusX", "radiusY", "startAngle", "endAngle", "anticlockwise"];
var Arc = class _Arc extends with_accessors_default(has_observers_default, accessors) {
  constructor(center = new point_default(), options2 = {}) {
    super();
    this.setCenter(center);
    this.radiusX = options2.radiusX;
    this.radiusY = options2.radiusY || options2.radiusX;
    this.startAngle = options2.startAngle;
    this.endAngle = options2.endAngle;
    this.anticlockwise = options2.anticlockwise || false;
    this.xRotation = options2.xRotation;
  }
  clone() {
    return new _Arc(this.center, {
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
      anticlockwise: this.anticlockwise
    });
  }
  setCenter(value) {
    this._observerField("center", point_default.create(value));
    this.geometryChange();
    return this;
  }
  getCenter() {
    return this.center;
  }
  pointAt(angle) {
    const center = this.center;
    const radian = rad(angle);
    return new point_default(
      center.x + this.radiusX * Math.cos(radian),
      center.y + this.radiusY * Math.sin(radian)
    );
  }
  curvePoints() {
    const startAngle = this.startAngle;
    const dir = this.anticlockwise ? -1 : 1;
    const curvePoints = [this.pointAt(startAngle)];
    const interval = this._arcInterval();
    const intervalAngle = interval.endAngle - interval.startAngle;
    const subIntervalsCount = Math.ceil(intervalAngle / MAX_INTERVAL);
    const subIntervalAngle = intervalAngle / subIntervalsCount;
    let currentAngle = startAngle;
    let transformation;
    if (this.xRotation) {
      transformation = transform().rotate(this.xRotation, this.center);
    }
    for (let i = 1; i <= subIntervalsCount; i++) {
      const nextAngle = currentAngle + dir * subIntervalAngle;
      const points3 = this._intervalCurvePoints(currentAngle, nextAngle, transformation);
      curvePoints.push(points3.cp1, points3.cp2, points3.p2);
      currentAngle = nextAngle;
    }
    return curvePoints;
  }
  bbox(matrix) {
    const interval = this._arcInterval();
    const startAngle = interval.startAngle;
    const endAngle = interval.endAngle;
    const extremeAngles = ellipseExtremeAngles(this.center, this.radiusX, this.radiusY, matrix);
    const extremeX = deg(extremeAngles.x);
    const extremeY = deg(extremeAngles.y);
    const endPoint = this.pointAt(endAngle).transformCopy(matrix);
    let currentAngleX = bboxStartAngle(extremeX, startAngle);
    let currentAngleY = bboxStartAngle(extremeY, startAngle);
    let currentPoint = this.pointAt(startAngle).transformCopy(matrix);
    let minPoint = point_default.min(currentPoint, endPoint);
    let maxPoint = point_default.max(currentPoint, endPoint);
    while (currentAngleX < endAngle || currentAngleY < endAngle) {
      let currentPointX;
      if (currentAngleX < endAngle) {
        currentPointX = this.pointAt(currentAngleX).transformCopy(matrix);
        currentAngleX += 90;
      }
      let currentPointY;
      if (currentAngleY < endAngle) {
        currentPointY = this.pointAt(currentAngleY).transformCopy(matrix);
        currentAngleY += 90;
      }
      currentPoint = new point_default(currentPointX.x, currentPointY.y);
      minPoint = point_default.min(minPoint, currentPoint);
      maxPoint = point_default.max(maxPoint, currentPoint);
    }
    return rect_default.fromPoints(minPoint, maxPoint);
  }
  _arcInterval() {
    let { startAngle, endAngle, anticlockwise } = this;
    if (anticlockwise) {
      let oldStart = startAngle;
      startAngle = endAngle;
      endAngle = oldStart;
    }
    if (startAngle > endAngle || anticlockwise && startAngle === endAngle) {
      endAngle += 360;
    }
    return {
      startAngle,
      endAngle
    };
  }
  _intervalCurvePoints(startAngle, endAngle, transformation) {
    const p1 = this.pointAt(startAngle);
    const p2 = this.pointAt(endAngle);
    const p1Derivative = this._derivativeAt(startAngle);
    const p2Derivative = this._derivativeAt(endAngle);
    const t = (rad(endAngle) - rad(startAngle)) / 3;
    const cp1 = new point_default(p1.x + t * p1Derivative.x, p1.y + t * p1Derivative.y);
    const cp2 = new point_default(p2.x - t * p2Derivative.x, p2.y - t * p2Derivative.y);
    if (transformation) {
      p1.transform(transformation);
      p2.transform(transformation);
      cp1.transform(transformation);
      cp2.transform(transformation);
    }
    return {
      p1,
      cp1,
      cp2,
      p2
    };
  }
  _derivativeAt(angle) {
    const radian = rad(angle);
    return new point_default(-this.radiusX * Math.sin(radian), this.radiusY * Math.cos(radian));
  }
  containsPoint(point2) {
    const interval = this._arcInterval();
    const intervalAngle = interval.endAngle - interval.startAngle;
    const { center, radiusX, radiusY } = this;
    const distance = center.distanceTo(point2);
    const angleRad = Math.atan2(point2.y - center.y, point2.x - center.x);
    const pointRadius = radiusX * radiusY / Math.sqrt(pow2(radiusX, 2) * pow2(Math.sin(angleRad), 2) + pow2(radiusY, 2) * pow2(Math.cos(angleRad), 2));
    const startPoint = this.pointAt(this.startAngle).round(PRECISION);
    const endPoint = this.pointAt(this.endAngle).round(PRECISION);
    const intersection = lineIntersection(center, point2.round(PRECISION), startPoint, endPoint);
    let containsPoint;
    if (intervalAngle < 180) {
      containsPoint = intersection && closeOrLess(center.distanceTo(intersection), distance) && closeOrLess(distance, pointRadius);
    } else {
      let angle = calculateAngle(center.x, center.y, radiusX, radiusY, point2.x, point2.y);
      if (angle !== 360) {
        angle = (360 + angle) % 360;
      }
      let inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;
      containsPoint = inAngleRange && closeOrLess(distance, pointRadius) || !inAngleRange && (!intersection || intersection.equals(point2));
    }
    return containsPoint;
  }
  _isOnPath(point2, width) {
    const interval = this._arcInterval();
    const center = this.center;
    let angle = calculateAngle(center.x, center.y, this.radiusX, this.radiusY, point2.x, point2.y);
    if (angle !== 360) {
      angle = (360 + angle) % 360;
    }
    const inAngleRange = interval.startAngle <= angle && angle <= interval.endAngle;
    return inAngleRange && this.pointAt(angle).distanceTo(point2) <= width;
  }
  static fromPoints(start, end, rx, ry, largeArc, swipe, rotation) {
    const arcParameters = normalizeArcParameters({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      rx,
      ry,
      largeArc,
      swipe,
      rotation
    });
    return new _Arc(arcParameters.center, {
      startAngle: arcParameters.startAngle,
      endAngle: arcParameters.endAngle,
      radiusX: arcParameters.radiusX,
      radiusY: arcParameters.radiusY,
      xRotation: arcParameters.xRotation,
      anticlockwise: swipe === 0
    });
  }
};
function calculateAngle(cx, cy, rx, ry, x, y) {
  const cos = round((x - cx) / rx, 3);
  const sin = round((y - cy) / ry, 3);
  return round(deg(Math.atan2(sin, cos)));
}
function normalizeArcParameters(parameters) {
  let { x1, y1, x2, y2, rx, ry, largeArc, swipe, rotation = 0 } = parameters;
  const radians = rad(rotation);
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const xT = cosine * (x1 - x2) / 2 + sine * (y1 - y2) / 2;
  const yT = -sine * (x1 - x2) / 2 + cosine * (y1 - y2) / 2;
  const sign = largeArc !== swipe ? 1 : -1;
  const xt2 = Math.pow(xT, 2);
  const yt2 = Math.pow(yT, 2);
  let rx2 = Math.pow(rx, 2);
  let ry2 = Math.pow(ry, 2);
  let delta = xt2 / rx2 + yt2 / ry2;
  if (delta > 1) {
    delta = Math.sqrt(xt2 / rx2 + yt2 / ry2);
    rx = delta * rx;
    rx2 = Math.pow(rx, 2);
    ry = delta * ry;
    ry2 = Math.pow(ry, 2);
  }
  let constT = sign * Math.sqrt((rx2 * ry2 - rx2 * yt2 - ry2 * xt2) / (rx2 * yt2 + ry2 * xt2));
  if (isNaN(constT)) {
    constT = 0;
  }
  const cxT = constT * (rx * yT) / ry;
  const cyT = -constT * (ry * xT) / rx;
  const cx = cosine * cxT - sine * cyT + (x1 + x2) / 2;
  const cy = sine * cxT + cosine * cyT + (y1 + y2) / 2;
  const uX = (xT - cxT) / rx;
  const uY = (yT - cyT) / ry;
  const vX = -(xT + cxT) / rx;
  const vY = -(yT + cyT) / ry;
  const startAngle = (uY >= 0 ? 1 : -1) * deg(Math.acos(uX / Math.sqrt(uX * uX + uY * uY)));
  const angleCosine = round((uX * vX + uY * vY) / (Math.sqrt(uX * uX + uY * uY) * Math.sqrt(vX * vX + vY * vY)), 10);
  let angle = (uX * vY - uY * vX >= 0 ? 1 : -1) * deg(Math.acos(angleCosine));
  if (!swipe && angle > 0) {
    angle -= 360;
  }
  if (swipe && angle < 0) {
    angle += 360;
  }
  let endAngle = startAngle + angle;
  const signEndAngle = endAngle >= 0 ? 1 : -1;
  endAngle = Math.abs(endAngle) % 360 * signEndAngle;
  return {
    center: new point_default(cx, cy),
    startAngle,
    endAngle,
    radiusX: rx,
    radiusY: ry,
    xRotation: rotation
  };
}
function bboxStartAngle(angle, start) {
  let startAngle = angle;
  while (startAngle < start) {
    startAngle += 90;
  }
  return startAngle;
}
var arc_default = Arc;

// node_modules/@progress/kendo-drawing/dist/es/shapes/elements-array.js
var splice = [].splice;
var slice = [].slice;
var ElementsArray = class extends has_observers_default {
  constructor(array = []) {
    super();
    this.length = 0;
    this._splice(0, array.length, array);
  }
  elements(value) {
    if (value) {
      this._splice(0, this.length, value);
      this._change();
      return this;
    }
    return this.slice(0);
  }
  push(...elements) {
    let len = this.length;
    const count = elements.length;
    for (let i = 0; i < count; i++) {
      this[len + i] = elements[i];
      elements[i].addObserver(this);
    }
    this.length = len + count;
    this._change();
    return this.length;
  }
  slice() {
    return slice.call(this);
  }
  pop() {
    if (this.length > 0) {
      const result = this[this.length - 1];
      this.length--;
      result.removeObserver(this);
      this._change();
      return result;
    }
  }
  splice(index, howMany, ...elements) {
    const result = this._splice(index, howMany, elements);
    this._change();
    return result;
  }
  shift() {
    if (this.length > 0) {
      const result = this[0];
      for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
      }
      this.length--;
      result.removeObserver(this);
      this._change();
      return result;
    }
  }
  unshift(...elements) {
    const count = elements.length;
    for (let i = this.length - 1; i >= 0; i--) {
      this[i + count] = this[i];
    }
    for (let i = 0; i < count; i++) {
      this[i] = elements[i];
      elements[i].addObserver(this);
    }
    this.length += count;
    this._change();
    return this.length;
  }
  indexOf(element) {
    const length = this.length;
    for (let idx = 0; idx < length; idx++) {
      if (this[idx] === element) {
        return idx;
      }
    }
    return -1;
  }
  _splice(index, howMany, elements) {
    const result = splice.apply(this, [index, howMany].concat(elements));
    this._clearObserver(result);
    this._setObserver(elements);
    return result;
  }
  _add(elements) {
    this._setObserver(elements);
    this._change();
  }
  _remove(elements) {
    this._clearObserver(elements);
    this._change();
  }
  _setObserver(elements) {
    for (let idx = 0; idx < elements.length; idx++) {
      elements[idx].addObserver(this);
    }
  }
  _clearObserver(elements) {
    for (let idx = 0; idx < elements.length; idx++) {
      elements[idx].removeObserver(this);
    }
  }
  _change() {
  }
};
var elements_array_default = ElementsArray;

// node_modules/@progress/kendo-drawing/dist/es/shapes/geometry-elements-array.js
var GeometryElementsArray = class extends elements_array_default {
  _change() {
    this.geometryChange();
  }
};
var geometry_elements_array_default = GeometryElementsArray;

// node_modules/@progress/kendo-drawing/dist/es/geometry.js
var geometry_exports = {};
__export(geometry_exports, {
  Arc: () => arc_default,
  Circle: () => circle_default,
  Matrix: () => matrix_default,
  Point: () => point_default,
  Rect: () => rect_default,
  Segment: () => segment_default,
  Size: () => size_default,
  Transformation: () => transformation_default,
  toMatrix: () => toMatrix,
  transform: () => transform
});

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/is-out-of-end-point.js
function isOutOfEndPoint(endPoint, controlPoint, point2) {
  const angle = deg(Math.atan2(controlPoint.y - endPoint.y, controlPoint.x - endPoint.x));
  const rotatedPoint = point2.transformCopy(transform().rotate(-angle, endPoint));
  return rotatedPoint.x < endPoint.x;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/calculate-curve-at.js
function calculateCurveAt(t, field, points3) {
  const t1 = 1 - t;
  return Math.pow(t1, 3) * points3[0][field] + 3 * Math.pow(t1, 2) * t * points3[1][field] + 3 * Math.pow(t, 2) * t1 * points3[2][field] + Math.pow(t, 3) * points3[3][field];
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/to-cubic-polynomial.js
function toCubicPolynomial(points3, field) {
  return [
    -points3[0][field] + 3 * points3[1][field] - 3 * points3[2][field] + points3[3][field],
    3 * (points3[0][field] - 2 * points3[1][field] + points3[2][field]),
    3 * (-points3[0][field] + points3[1][field]),
    points3[0][field]
  ];
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/complex-number.js
var ComplexNumber = class _ComplexNumber extends Class {
  constructor(real = 0, img = 0) {
    super();
    this.real = real;
    this.img = img;
  }
  add(cNumber) {
    return new _ComplexNumber(round(this.real + cNumber.real, PRECISION), round(this.img + cNumber.img, PRECISION));
  }
  addConstant(value) {
    return new _ComplexNumber(this.real + value, this.img);
  }
  negate() {
    return new _ComplexNumber(-this.real, -this.img);
  }
  multiply(cNumber) {
    return new _ComplexNumber(
      this.real * cNumber.real - this.img * cNumber.img,
      this.real * cNumber.img + this.img * cNumber.real
    );
  }
  multiplyConstant(value) {
    return new _ComplexNumber(this.real * value, this.img * value);
  }
  nthRoot(n) {
    const rad2 = Math.atan2(this.img, this.real);
    const r = Math.sqrt(Math.pow(this.img, 2) + Math.pow(this.real, 2));
    const nthR = Math.pow(r, 1 / n);
    return new _ComplexNumber(nthR * Math.cos(rad2 / n), nthR * Math.sin(rad2 / n));
  }
  equals(cNumber) {
    return this.real === cNumber.real && this.img === cNumber.img;
  }
  isReal() {
    return this.img === 0;
  }
};
var complex_number_default = ComplexNumber;

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/solve-cubic-equation.js
function numberSign(x) {
  return x < 0 ? -1 : 1;
}
function solveQuadraticEquation(a, b, c) {
  const squareRoot = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
  return [
    (-b + squareRoot) / (2 * a),
    (-b - squareRoot) / (2 * a)
  ];
}
function solveCubicEquation(a, b, c, d) {
  if (a === 0) {
    return solveQuadraticEquation(b, c, d);
  }
  const p = (3 * a * c - Math.pow(b, 2)) / (3 * Math.pow(a, 2));
  const q = (2 * Math.pow(b, 3) - 9 * a * b * c + 27 * Math.pow(a, 2) * d) / (27 * Math.pow(a, 3));
  const Q = Math.pow(p / 3, 3) + Math.pow(q / 2, 2);
  const i = new complex_number_default(0, 1);
  const b3a = -b / (3 * a);
  let x1, x2, y1, y2, y3, z1, z2;
  if (Q < 0) {
    x1 = new complex_number_default(-q / 2, Math.sqrt(-Q)).nthRoot(3);
    x2 = new complex_number_default(-q / 2, -Math.sqrt(-Q)).nthRoot(3);
  } else {
    x1 = -q / 2 + Math.sqrt(Q);
    x1 = new complex_number_default(numberSign(x1) * Math.pow(Math.abs(x1), 1 / 3));
    x2 = -q / 2 - Math.sqrt(Q);
    x2 = new complex_number_default(numberSign(x2) * Math.pow(Math.abs(x2), 1 / 3));
  }
  y1 = x1.add(x2);
  z1 = x1.add(x2).multiplyConstant(-1 / 2);
  z2 = x1.add(x2.negate()).multiplyConstant(Math.sqrt(3) / 2);
  y2 = z1.add(i.multiply(z2));
  y3 = z1.add(i.negate().multiply(z2));
  const result = [];
  if (y1.isReal()) {
    result.push(round(y1.real + b3a, PRECISION));
  }
  if (y2.isReal()) {
    result.push(round(y2.real + b3a, PRECISION));
  }
  if (y3.isReal()) {
    result.push(round(y3.real + b3a, PRECISION));
  }
  return result;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/has-roots-in-range.js
function hasRootsInRange(points3, point2, field, rootField, range) {
  const polynomial = toCubicPolynomial(points3, rootField);
  const roots = solveCubicEquation(polynomial[0], polynomial[1], polynomial[2], polynomial[3] - point2[rootField]);
  let intersection;
  for (let idx = 0; idx < roots.length; idx++) {
    if (0 <= roots[idx] && roots[idx] <= 1) {
      intersection = calculateCurveAt(roots[idx], field, points3);
      if (Math.abs(intersection - point2[field]) <= range) {
        return true;
      }
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/curve-intersections-count.js
function curveIntersectionsCount(points3, point2, bbox) {
  const polynomial = toCubicPolynomial(points3, "x");
  const roots = solveCubicEquation(polynomial[0], polynomial[1], polynomial[2], polynomial[3] - point2.x);
  let rayIntersection, intersectsRay;
  let count = 0;
  for (let i = 0; i < roots.length; i++) {
    rayIntersection = calculateCurveAt(roots[i], "y", points3);
    intersectsRay = close(rayIntersection, point2.y) || rayIntersection > point2.y;
    if (intersectsRay && ((roots[i] === 0 || roots[i] === 1) && bbox.bottomRight().x > point2.x || 0 < roots[i] && roots[i] < 1)) {
      count++;
    }
  }
  return count;
}

// node_modules/@progress/kendo-drawing/dist/es/geometry/math/line-intersections-count.js
function lineIntersectionsCount(a, b, point2) {
  let intersects;
  if (a.x !== b.x) {
    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);
    const inRange = minX <= point2.x && point2.x < maxX;
    if (minY === maxY) {
      intersects = point2.y <= minY && inRange;
    } else {
      intersects = inRange && (maxY - minY) * ((a.x - b.x) * (a.y - b.y) > 0 ? point2.x - minX : maxX - point2.x) / (maxX - minX) + minY - point2.y >= 0;
    }
  }
  return intersects ? 1 : 0;
}

// node_modules/@progress/kendo-drawing/dist/es/mixins/with-points.js
function pointAccessor(name) {
  const fieldName = "_" + name;
  return function(value) {
    if (value !== void 0) {
      this._observerField(fieldName, point_default.create(value));
      this.geometryChange();
      return this;
    }
    return this[fieldName];
  };
}
function definePointAccessors(fn, names) {
  for (let i = 0; i < names.length; i++) {
    fn[names[i]] = pointAccessor(names[i]);
  }
}
var withPoints = (TBase, names) => {
  const result = class extends TBase {
  };
  definePointAccessors(result.prototype, names);
  return result;
};
var with_points_default = withPoints;

// node_modules/@progress/kendo-drawing/dist/es/geometry/segment.js
var points = ["anchor", "controlIn", "controlOut"];
var Segment = class extends with_points_default(has_observers_default, points) {
  constructor(anchor, controlIn, controlOut) {
    super();
    this.anchor(anchor || new point_default());
    this.controlIn(controlIn);
    this.controlOut(controlOut);
  }
  bboxTo(toSegment, matrix) {
    const segmentAnchor = this.anchor().transformCopy(matrix);
    const toSegmentAnchor = toSegment.anchor().transformCopy(matrix);
    let rect;
    if (this.controlOut() && toSegment.controlIn()) {
      rect = this._curveBoundingBox(
        segmentAnchor,
        this.controlOut().transformCopy(matrix),
        toSegment.controlIn().transformCopy(matrix),
        toSegmentAnchor
      );
    } else {
      rect = this._lineBoundingBox(segmentAnchor, toSegmentAnchor);
    }
    return rect;
  }
  _lineBoundingBox(p1, p2) {
    return rect_default.fromPoints(p1, p2);
  }
  _curveBoundingBox(p1, cp1, cp2, p2) {
    const points3 = [p1, cp1, cp2, p2];
    const extremesX = this._curveExtremesFor(points3, "x");
    const extremesY = this._curveExtremesFor(points3, "y");
    const xLimits = arrayLimits([extremesX.min, extremesX.max, p1.x, p2.x]);
    const yLimits = arrayLimits([extremesY.min, extremesY.max, p1.y, p2.y]);
    return rect_default.fromPoints(new point_default(xLimits.min, yLimits.min), new point_default(xLimits.max, yLimits.max));
  }
  _curveExtremesFor(points3, field) {
    const extremes = this._curveExtremes(
      points3[0][field],
      points3[1][field],
      points3[2][field],
      points3[3][field]
    );
    return {
      min: calculateCurveAt(extremes.min, field, points3),
      max: calculateCurveAt(extremes.max, field, points3)
    };
  }
  _curveExtremes(x1, x2, x3, x4) {
    const a = x1 - 3 * x2 + 3 * x3 - x4;
    const b = -2 * (x1 - 2 * x2 + x3);
    const c = x1 - x2;
    const sqrt = Math.sqrt(b * b - 4 * a * c);
    let t1 = 0;
    let t2 = 1;
    if (a === 0) {
      if (b !== 0) {
        t1 = t2 = -c / b;
      }
    } else if (!isNaN(sqrt)) {
      t1 = (-b + sqrt) / (2 * a);
      t2 = (-b - sqrt) / (2 * a);
    }
    let min = Math.max(Math.min(t1, t2), 0);
    if (min < 0 || min > 1) {
      min = 0;
    }
    let max = Math.min(Math.max(t1, t2), 1);
    if (max > 1 || max < 0) {
      max = 1;
    }
    return {
      min,
      max
    };
  }
  _intersectionsTo(segment, point2) {
    let intersectionsCount;
    if (this.controlOut() && segment.controlIn()) {
      intersectionsCount = curveIntersectionsCount([this.anchor(), this.controlOut(), segment.controlIn(), segment.anchor()], point2, this.bboxTo(segment));
    } else {
      intersectionsCount = lineIntersectionsCount(this.anchor(), segment.anchor(), point2);
    }
    return intersectionsCount;
  }
  _isOnCurveTo(segment, point2, width, endSegment) {
    const bbox = this.bboxTo(segment).expand(width, width);
    if (bbox.containsPoint(point2)) {
      const p1 = this.anchor();
      const p2 = this.controlOut();
      const p3 = segment.controlIn();
      const p4 = segment.anchor();
      if (endSegment === "start" && p1.distanceTo(point2) <= width) {
        return !isOutOfEndPoint(p1, p2, point2);
      } else if (endSegment === "end" && p4.distanceTo(point2) <= width) {
        return !isOutOfEndPoint(p4, p3, point2);
      }
      const points3 = [p1, p2, p3, p4];
      if (hasRootsInRange(points3, point2, "x", "y", width) || hasRootsInRange(points3, point2, "y", "x", width)) {
        return true;
      }
      const rotation = transform().rotate(45, point2);
      const rotatedPoints = [p1.transformCopy(rotation), p2.transformCopy(rotation), p3.transformCopy(rotation), p4.transformCopy(rotation)];
      return hasRootsInRange(rotatedPoints, point2, "x", "y", width) || hasRootsInRange(rotatedPoints, point2, "y", "x", width);
    }
  }
  _isOnLineTo(segment, point2, width) {
    const p1 = this.anchor();
    const p2 = segment.anchor();
    const angle = deg(Math.atan2(p2.y - p1.y, p2.x - p1.x));
    const rect = new rect_default([p1.x, p1.y - width / 2], [p1.distanceTo(p2), width]);
    return rect.containsPoint(point2.transformCopy(transform().rotate(-angle, p1)));
  }
  _isOnPathTo(segment, point2, width, endSegment) {
    let isOnPath;
    if (this.controlOut() && segment.controlIn()) {
      isOnPath = this._isOnCurveTo(segment, point2, width / 2, endSegment);
    } else {
      isOnPath = this._isOnLineTo(segment, point2, width);
    }
    return isOnPath;
  }
};
function arrayLimits(arr) {
  let length = arr.length;
  let min = MAX_NUM;
  let max = MIN_NUM;
  for (let i = 0; i < length; i++) {
    max = Math.max(max, arr[i]);
    min = Math.min(min, arr[i]);
  }
  return {
    min,
    max
  };
}
var segment_default = Segment;

// node_modules/@progress/kendo-drawing/dist/es/shapes/utils/points-to-curve.js
var WEIGHT = 0.333;
var EXTREMUM_ALLOWED_DEVIATION = 0.01;
var X = "x";
var Y = "y";
function pointsToCurve(pointsIn, closed) {
  const points3 = pointsIn.slice(0);
  const segments = [];
  let length = points3.length;
  if (length > 2) {
    removeDuplicates(0, points3);
    length = points3.length;
  }
  if (length < 2 || length === 2 && points3[0].equals(points3[1])) {
    return segments;
  }
  let p0 = points3[0];
  let p1 = points3[1];
  let p2 = points3[2];
  segments.push(new segment_default(p0));
  while (p0.equals(points3[length - 1])) {
    closed = true;
    points3.pop();
    length--;
  }
  if (length === 2) {
    const tangent = getTangent(p0, p1, X, Y);
    last(segments).controlOut(
      firstControlPoint(tangent, p0, p1, X, Y)
    );
    segments.push(new segment_default(
      p1,
      secondControlPoint(tangent, p0, p1, X, Y)
    ));
    return segments;
  }
  let initialControlPoint, lastControlPoint;
  if (closed) {
    p0 = points3[length - 1];
    p1 = points3[0];
    p2 = points3[1];
    const controlPoints = getControlPoints(p0, p1, p2);
    initialControlPoint = controlPoints[1];
    lastControlPoint = controlPoints[0];
  } else {
    const tangent = getTangent(p0, p1, X, Y);
    initialControlPoint = firstControlPoint(tangent, p0, p1, X, Y);
  }
  let cp0 = initialControlPoint;
  for (let idx = 0; idx <= length - 3; idx++) {
    removeDuplicates(idx, points3);
    length = points3.length;
    if (idx + 3 <= length) {
      p0 = points3[idx];
      p1 = points3[idx + 1];
      p2 = points3[idx + 2];
      const controlPoints = getControlPoints(p0, p1, p2);
      last(segments).controlOut(cp0);
      cp0 = controlPoints[1];
      const cp1 = controlPoints[0];
      segments.push(new segment_default(p1, cp1));
    }
  }
  if (closed) {
    p0 = points3[length - 2];
    p1 = points3[length - 1];
    p2 = points3[0];
    const controlPoints = getControlPoints(p0, p1, p2);
    last(segments).controlOut(cp0);
    segments.push(new segment_default(
      p1,
      controlPoints[0]
    ));
    last(segments).controlOut(controlPoints[1]);
    segments.push(new segment_default(
      p2,
      lastControlPoint
    ));
  } else {
    const tangent = getTangent(p1, p2, X, Y);
    last(segments).controlOut(cp0);
    segments.push(new segment_default(
      p2,
      secondControlPoint(tangent, p1, p2, X, Y)
    ));
  }
  return segments;
}
function removeDuplicates(idx, points3) {
  while (points3[idx + 1] && (points3[idx].equals(points3[idx + 1]) || points3[idx + 1].equals(points3[idx + 2]))) {
    points3.splice(idx + 1, 1);
  }
}
function invertAxis(p0, p1, p2) {
  let invertAxis2 = false;
  if (p0.x === p1.x) {
    invertAxis2 = true;
  } else if (p1.x === p2.x) {
    if (p1.y < p2.y && p0.y <= p1.y || p2.y < p1.y && p1.y <= p0.y) {
      invertAxis2 = true;
    }
  } else {
    const fn = lineFunction(p0, p1);
    const y2 = calculateFunction(fn, p2.x);
    if (!(p0.y <= p1.y && p2.y <= y2) && !(p1.y <= p0.y && p2.y >= y2)) {
      invertAxis2 = true;
    }
  }
  return invertAxis2;
}
function isLine(p0, p1, p2) {
  const fn = lineFunction(p0, p1);
  const y2 = calculateFunction(fn, p2.x);
  return p0.x === p1.x && p1.x === p2.x || round(y2, 1) === round(p2.y, 1);
}
function lineFunction(p1, p2) {
  const a = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - a * p1.x;
  return [b, a];
}
function getControlPoints(p0, p1, p2) {
  let xField = X;
  let yField = Y;
  let restrict = false;
  let switchOrientation = false;
  let tangent;
  if (isLine(p0, p1, p2)) {
    tangent = getTangent(p0, p1, X, Y);
  } else {
    const monotonic = {
      x: isMonotonicByField(p0, p1, p2, X),
      y: isMonotonicByField(p0, p1, p2, Y)
    };
    if (monotonic.x && monotonic.y) {
      tangent = getTangent(p0, p2, X, Y);
      restrict = true;
    } else {
      if (invertAxis(p0, p1, p2)) {
        xField = Y;
        yField = X;
      }
      if (monotonic[xField]) {
        tangent = 0;
      } else {
        let sign;
        if (p2[yField] < p0[yField] && p0[yField] <= p1[yField] || p0[yField] < p2[yField] && p1[yField] <= p0[yField]) {
          sign = numberSign2((p2[yField] - p0[yField]) * (p1[xField] - p0[xField]));
        } else {
          sign = -numberSign2((p2[xField] - p0[xField]) * (p1[yField] - p0[yField]));
        }
        tangent = EXTREMUM_ALLOWED_DEVIATION * sign;
        switchOrientation = true;
      }
    }
  }
  const secondCP = secondControlPoint(tangent, p0, p1, xField, yField);
  if (switchOrientation) {
    const oldXField = xField;
    xField = yField;
    yField = oldXField;
  }
  const firstCP = firstControlPoint(tangent, p1, p2, xField, yField);
  if (restrict) {
    restrictControlPoint(p0, p1, secondCP, tangent);
    restrictControlPoint(p1, p2, firstCP, tangent);
  }
  return [secondCP, firstCP];
}
function restrictControlPoint(p1, p2, cp, tangent) {
  if (p1.y < p2.y) {
    if (p2.y < cp.y) {
      cp.x = p1.x + (p2.y - p1.y) / tangent;
      cp.y = p2.y;
    } else if (cp.y < p1.y) {
      cp.x = p2.x - (p2.y - p1.y) / tangent;
      cp.y = p1.y;
    }
  } else {
    if (cp.y < p2.y) {
      cp.x = p1.x - (p1.y - p2.y) / tangent;
      cp.y = p2.y;
    } else if (p1.y < cp.y) {
      cp.x = p2.x + (p1.y - p2.y) / tangent;
      cp.y = p1.y;
    }
  }
}
function getTangent(p0, p1, xField, yField) {
  const x = p1[xField] - p0[xField];
  const y = p1[yField] - p0[yField];
  let tangent;
  if (x === 0) {
    tangent = 0;
  } else {
    tangent = y / x;
  }
  return tangent;
}
function isMonotonicByField(p0, p1, p2, field) {
  return p2[field] > p1[field] && p1[field] > p0[field] || p2[field] < p1[field] && p1[field] < p0[field];
}
function firstControlPoint(tangent, p0, p3, xField, yField) {
  const t1 = p0[xField];
  const t2 = p3[xField];
  const distance = (t2 - t1) * WEIGHT;
  return point(t1 + distance, p0[yField] + distance * tangent, xField, yField);
}
function secondControlPoint(tangent, p0, p3, xField, yField) {
  const t1 = p0[xField];
  const t2 = p3[xField];
  const distance = (t2 - t1) * WEIGHT;
  return point(t2 - distance, p3[yField] - distance * tangent, xField, yField);
}
function point(xValue, yValue, xField, yField) {
  const controlPoint = new point_default();
  controlPoint[xField] = xValue;
  controlPoint[yField] = yValue;
  return controlPoint;
}
function calculateFunction(fn, x) {
  const length = fn.length;
  let result = 0;
  for (let i = 0; i < length; i++) {
    result += Math.pow(x, i) * fn[i];
  }
  return result;
}
function numberSign2(value) {
  return value <= 0 ? -1 : 1;
}

// node_modules/@progress/kendo-drawing/dist/es/parsing/shape-map.js
var ShapeMap = {
  l: function(path, options2) {
    const { parameters, position } = options2;
    for (let i = 0; i < parameters.length; i += 2) {
      let point2 = new point_default(parameters[i], parameters[i + 1]);
      if (options2.isRelative) {
        point2.translateWith(position);
      }
      path.lineTo(point2.x, point2.y);
      position.x = point2.x;
      position.y = point2.y;
    }
  },
  c: function(path, options2) {
    const { parameters, position } = options2;
    for (let i = 0; i < parameters.length; i += 6) {
      let controlOut = new point_default(parameters[i], parameters[i + 1]);
      let controlIn = new point_default(parameters[i + 2], parameters[i + 3]);
      let point2 = new point_default(parameters[i + 4], parameters[i + 5]);
      if (options2.isRelative) {
        controlIn.translateWith(position);
        controlOut.translateWith(position);
        point2.translateWith(position);
      }
      path.curveTo(controlOut, controlIn, point2);
      position.x = point2.x;
      position.y = point2.y;
    }
  },
  v: function(path, options2) {
    const value = options2.isRelative ? 0 : options2.position.x;
    toLineParamaters(options2.parameters, true, value);
    this.l(path, options2);
  },
  h: function(path, options2) {
    const value = options2.isRelative ? 0 : options2.position.y;
    toLineParamaters(options2.parameters, false, value);
    this.l(path, options2);
  },
  a: function(path, options2) {
    const { parameters, position } = options2;
    for (let i = 0; i < parameters.length; i += 7) {
      const radiusX = parameters[i];
      const radiusY = parameters[i + 1];
      const rotation = parameters[i + 2];
      const largeArc = parameters[i + 3];
      const swipe = parameters[i + 4];
      const endPoint = new point_default(parameters[i + 5], parameters[i + 6]);
      if (options2.isRelative) {
        endPoint.translateWith(position);
      }
      if (position.x !== endPoint.x || position.y !== endPoint.y) {
        path.arcTo(endPoint, radiusX, radiusY, largeArc, swipe, rotation);
        position.x = endPoint.x;
        position.y = endPoint.y;
      }
    }
  },
  s: function(path, options2) {
    const { parameters, position, previousCommand } = options2;
    let lastControlIn;
    if (previousCommand === "s" || previousCommand === "c") {
      lastControlIn = last(last(path.paths).segments).controlIn();
    }
    for (let i = 0; i < parameters.length; i += 4) {
      let controlIn = new point_default(parameters[i], parameters[i + 1]);
      let endPoint = new point_default(parameters[i + 2], parameters[i + 3]);
      let controlOut;
      if (options2.isRelative) {
        controlIn.translateWith(position);
        endPoint.translateWith(position);
      }
      if (lastControlIn) {
        controlOut = reflectionPoint(lastControlIn, position);
      } else {
        controlOut = position.clone();
      }
      lastControlIn = controlIn;
      path.curveTo(controlOut, controlIn, endPoint);
      position.x = endPoint.x;
      position.y = endPoint.y;
    }
  },
  q: function(path, options2) {
    const { parameters, position } = options2;
    for (let i = 0; i < parameters.length; i += 4) {
      let controlPoint = new point_default(parameters[i], parameters[i + 1]);
      let endPoint = new point_default(parameters[i + 2], parameters[i + 3]);
      if (options2.isRelative) {
        controlPoint.translateWith(position);
        endPoint.translateWith(position);
      }
      let cubicControlPoints = quadraticToCubicControlPoints(position, controlPoint, endPoint);
      path.curveTo(cubicControlPoints.controlOut, cubicControlPoints.controlIn, endPoint);
      position.x = endPoint.x;
      position.y = endPoint.y;
    }
  },
  t: function(path, options2) {
    const { parameters, position, previousCommand } = options2;
    let controlPoint;
    if (previousCommand === "q" || previousCommand === "t") {
      let lastSegment = last(last(path.paths).segments);
      controlPoint = lastSegment.controlIn().clone().translateWith(position.scaleCopy(-1 / 3)).scale(3 / 2);
    }
    for (let i = 0; i < parameters.length; i += 2) {
      let endPoint = new point_default(parameters[i], parameters[i + 1]);
      if (options2.isRelative) {
        endPoint.translateWith(position);
      }
      if (controlPoint) {
        controlPoint = reflectionPoint(controlPoint, position);
      } else {
        controlPoint = position.clone();
      }
      let cubicControlPoints = quadraticToCubicControlPoints(position, controlPoint, endPoint);
      path.curveTo(cubicControlPoints.controlOut, cubicControlPoints.controlIn, endPoint);
      position.x = endPoint.x;
      position.y = endPoint.y;
    }
  }
};
function toLineParamaters(parameters, isVertical, value) {
  const insertPosition = isVertical ? 0 : 1;
  for (let i = 0; i < parameters.length; i += 2) {
    parameters.splice(i + insertPosition, 0, value);
  }
}
function reflectionPoint(point2, center) {
  if (point2 && center) {
    return center.scaleCopy(2).translate(-point2.x, -point2.y);
  }
}
var third = 1 / 3;
function quadraticToCubicControlPoints(position, controlPoint, endPoint) {
  const scaledPoint = controlPoint.clone().scale(2 / 3);
  return {
    controlOut: scaledPoint.clone().translateWith(position.scaleCopy(third)),
    controlIn: scaledPoint.translateWith(endPoint.scaleCopy(third))
  };
}
var shape_map_default = ShapeMap;

// node_modules/@progress/kendo-drawing/dist/es/parsing/parse-path.js
var SEGMENT_REGEX = /([a-df-z]{1})([^a-df-z]*)(z)?/gi;
var SPLIT_REGEX = /[,\s]?([+\-]?(?:\d*\.\d+|\d+)(?:[eE][+\-]?\d+)?)/g;
var MOVE = "m";
var CLOSE = "z";
function parseParameters(str) {
  const parameters = [];
  str.replace(SPLIT_REGEX, function(match, number) {
    parameters.push(parseFloat(number));
  });
  return parameters;
}
function parsePath(pathInstance, str) {
  const position = new point_default();
  let previousCommand;
  str.replace(SEGMENT_REGEX, (match, element, params, closePath) => {
    let command = element.toLowerCase();
    const isRelative = command === element;
    const parameters = parseParameters(params.trim());
    if (command === MOVE) {
      if (isRelative) {
        position.x += parameters[0];
        position.y += parameters[1];
      } else {
        position.x = parameters[0];
        position.y = parameters[1];
      }
      pathInstance.moveTo(position.x, position.y);
      if (parameters.length > 2) {
        command = "l";
        parameters.splice(0, 2);
      }
    }
    if (shape_map_default[command]) {
      shape_map_default[command](
        pathInstance,
        {
          parameters,
          position,
          isRelative,
          previousCommand
        }
      );
      if (closePath && closePath.toLowerCase() === CLOSE) {
        pathInstance.close();
      }
    } else if (command !== MOVE) {
      throw new Error("Error while parsing SVG path. Unsupported command: " + command);
    }
    previousCommand = command;
  });
  return pathInstance;
}
var parse_path_default = parsePath;

// node_modules/@progress/kendo-drawing/dist/es/shapes/utils/elements-bounding-box.js
function elementsBoundingBox(elements, applyTransform, transformation) {
  let boundingBox;
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element.visible()) {
      let elementBoundingBox = applyTransform ? element.bbox(transformation) : element.rawBBox();
      if (elementBoundingBox) {
        if (boundingBox) {
          boundingBox = rect_default.union(boundingBox, elementBoundingBox);
        } else {
          boundingBox = elementBoundingBox;
        }
      }
    }
  }
  return boundingBox;
}

// node_modules/@progress/kendo-drawing/dist/es/shapes/utils/elements-clippend-bounding-box.js
function elementsClippedBoundingBox(elements, transformation) {
  let boundingBox;
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element.visible()) {
      let elementBoundingBox = element.clippedBBox(transformation);
      if (elementBoundingBox) {
        if (boundingBox) {
          boundingBox = rect_default.union(boundingBox, elementBoundingBox);
        } else {
          boundingBox = elementBoundingBox;
        }
      }
    }
  }
  return boundingBox;
}

// node_modules/@progress/kendo-drawing/dist/es/shapes/path.js
var SPACE2 = " ";
var printPoints = (precision) => (...points3) => points3.map((p) => p.toString(precision)).join(SPACE2);
var segmentType = (segmentStart, segmentEnd) => segmentStart.controlOut() && segmentEnd.controlIn() ? "C" : "L";
var Path = class _Path extends paintable_default(measurable_default(element_default)) {
  get nodeType() {
    return "Path";
  }
  constructor(options2) {
    super(options2);
    this.segments = new geometry_elements_array_default();
    this.segments.addObserver(this);
    if (this.options.stroke === void 0) {
      this.stroke("#000");
      if (this.options.stroke.lineJoin === void 0) {
        this.options.set("stroke.lineJoin", "miter");
      }
    }
  }
  moveTo(x, y) {
    this.suspend();
    this.segments.elements([]);
    this.resume();
    this.lineTo(x, y);
    return this;
  }
  lineTo(x, y) {
    const point2 = y !== void 0 ? new point_default(x, y) : x;
    const segment = new segment_default(point2);
    this.segments.push(segment);
    return this;
  }
  curveTo(controlOut, controlIn, point2) {
    if (this.segments.length > 0) {
      const lastSegment = last(this.segments);
      const segment = new segment_default(point2, controlIn);
      this.suspend();
      lastSegment.controlOut(controlOut);
      this.resume();
      this.segments.push(segment);
    }
    return this;
  }
  arc(startAngle, endAngle, radiusX, radiusY, anticlockwise) {
    if (this.segments.length > 0) {
      const lastSegment = last(this.segments);
      const anchor = lastSegment.anchor();
      const start = rad(startAngle);
      const center = new point_default(
        anchor.x - radiusX * Math.cos(start),
        anchor.y - radiusY * Math.sin(start)
      );
      const arc = new arc_default(center, {
        startAngle,
        endAngle,
        radiusX,
        radiusY,
        anticlockwise
      });
      this._addArcSegments(arc);
    }
    return this;
  }
  arcTo(end, rx, ry, largeArc, swipe, rotation) {
    if (this.segments.length > 0) {
      const lastSegment = last(this.segments);
      const anchor = lastSegment.anchor();
      const arc = arc_default.fromPoints(anchor, point_default.create(end), rx, ry, largeArc, swipe, rotation);
      this._addArcSegments(arc);
    }
    return this;
  }
  _addArcSegments(arc) {
    this.suspend();
    const curvePoints = arc.curvePoints();
    for (let i = 1; i < curvePoints.length; i += 3) {
      this.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
    }
    this.resume();
    this.geometryChange();
  }
  close() {
    this.options.closed = true;
    this.geometryChange();
    return this;
  }
  rawBBox() {
    return this._bbox();
  }
  toString(digits) {
    let output = "";
    const segments = this.segments;
    const length = segments.length;
    if (length > 0) {
      const parts = [];
      const print = printPoints(digits);
      let currentType;
      for (let i = 1; i < length; i++) {
        let type = segmentType(segments[i - 1], segments[i]);
        if (type !== currentType) {
          currentType = type;
          parts.push(type);
        }
        if (type === "L") {
          parts.push(print(segments[i].anchor()));
        } else {
          parts.push(print(
            segments[i - 1].controlOut(),
            segments[i].controlIn(),
            segments[i].anchor()
          ));
        }
      }
      output = "M" + print(segments[0].anchor()) + SPACE2 + parts.join(SPACE2);
      if (this.options.closed) {
        output += "Z";
      }
    }
    return output;
  }
  _containsPoint(point2) {
    const segments = this.segments;
    const length = segments.length;
    let intersectionsCount = 0;
    let previous, current;
    for (let idx = 1; idx < length; idx++) {
      previous = segments[idx - 1];
      current = segments[idx];
      intersectionsCount += previous._intersectionsTo(current, point2);
    }
    if (this.options.closed || !segments[0].anchor().equals(segments[length - 1].anchor())) {
      intersectionsCount += lineIntersectionsCount(segments[0].anchor(), segments[length - 1].anchor(), point2);
    }
    return intersectionsCount % 2 !== 0;
  }
  _isOnPath(point2, width) {
    const segments = this.segments;
    const length = segments.length;
    const pathWidth = width || this.options.stroke.width;
    if (length > 1) {
      if (segments[0]._isOnPathTo(segments[1], point2, pathWidth, "start")) {
        return true;
      }
      for (let idx = 2; idx <= length - 2; idx++) {
        if (segments[idx - 1]._isOnPathTo(segments[idx], point2, pathWidth)) {
          return true;
        }
      }
      if (segments[length - 2]._isOnPathTo(segments[length - 1], point2, pathWidth, "end")) {
        return true;
      }
    }
    return false;
  }
  _bbox(matrix) {
    const segments = this.segments;
    const length = segments.length;
    let boundingBox;
    if (length === 1) {
      let anchor = segments[0].anchor().transformCopy(matrix);
      boundingBox = new rect_default(anchor, size_default.ZERO);
    } else if (length > 0) {
      for (let i = 1; i < length; i++) {
        let segmentBox = segments[i - 1].bboxTo(segments[i], matrix);
        if (boundingBox) {
          boundingBox = rect_default.union(boundingBox, segmentBox);
        } else {
          boundingBox = segmentBox;
        }
      }
    }
    return boundingBox;
  }
  static parse(str, options2) {
    return MultiPath.parse(str, options2);
  }
  static fromRect(rect, options2) {
    const path = new _Path(options2);
    let [rx, ry] = rect.cornerRadius;
    if (rx === 0 && ry === 0) {
      path.moveTo(rect.topLeft()).lineTo(rect.topRight()).lineTo(rect.bottomRight()).lineTo(rect.bottomLeft()).close();
    } else {
      const origin = rect.origin;
      const { x, y } = origin;
      const width = rect.width();
      const height = rect.height();
      rx = limitValue(rx, 0, width / 2);
      ry = limitValue(ry, 0, height / 2);
      path.moveTo(x + rx, y).lineTo(x + width - rx, y).arcTo([x + width, y + ry], rx, ry, false).lineTo(x + width, y + height - ry).arcTo([x + width - rx, y + height], rx, ry, false).lineTo(x + rx, y + height).arcTo([x, y + height - ry], rx, ry, false).lineTo(x, y + ry).arcTo([x + rx, y], rx, ry, false);
    }
    return path;
  }
  static fromPoints(points3, options2) {
    if (points3) {
      const path = new _Path(options2);
      for (let i = 0; i < points3.length; i++) {
        let point2 = point_default.create(points3[i]);
        if (point2) {
          if (i === 0) {
            path.moveTo(point2);
          } else {
            path.lineTo(point2);
          }
        }
      }
      return path;
    }
  }
  static curveFromPoints(points3, options2) {
    if (points3) {
      const segments = pointsToCurve(points3);
      const path = new _Path(options2);
      path.segments.push.apply(path.segments, segments);
      return path;
    }
  }
  static fromArc(arc, options2) {
    const path = new _Path(options2);
    const startAngle = arc.startAngle;
    const start = arc.pointAt(startAngle);
    path.moveTo(start.x, start.y);
    path.arc(startAngle, arc.endAngle, arc.radiusX, arc.radiusY, arc.anticlockwise);
    return path;
  }
};
var MultiPath = class _MultiPath extends paintable_default(measurable_default(element_default)) {
  static parse(str, options2) {
    const instance4 = new _MultiPath(options2);
    return parse_path_default(instance4, str);
  }
  toString(digits) {
    const paths = this.paths;
    let output = "";
    if (paths.length > 0) {
      const result = [];
      for (let i = 0; i < paths.length; i++) {
        result.push(paths[i].toString(digits));
      }
      output = result.join(SPACE2);
    }
    return output;
  }
  get nodeType() {
    return "MultiPath";
  }
  constructor(options2) {
    super(options2);
    this.paths = new geometry_elements_array_default();
    this.paths.addObserver(this);
    if (this.options.stroke === void 0) {
      this.stroke("#000");
    }
  }
  moveTo(x, y) {
    const path = new Path();
    path.moveTo(x, y);
    this.paths.push(path);
    return this;
  }
  lineTo(x, y) {
    if (this.paths.length > 0) {
      last(this.paths).lineTo(x, y);
    }
    return this;
  }
  curveTo(controlOut, controlIn, point2) {
    if (this.paths.length > 0) {
      last(this.paths).curveTo(controlOut, controlIn, point2);
    }
    return this;
  }
  arc(startAngle, endAngle, radiusX, radiusY, anticlockwise) {
    if (this.paths.length > 0) {
      last(this.paths).arc(startAngle, endAngle, radiusX, radiusY, anticlockwise);
    }
    return this;
  }
  arcTo(end, rx, ry, largeArc, swipe, rotation) {
    if (this.paths.length > 0) {
      last(this.paths).arcTo(end, rx, ry, largeArc, swipe, rotation);
    }
    return this;
  }
  close() {
    if (this.paths.length > 0) {
      last(this.paths).close();
    }
    return this;
  }
  _bbox(matrix) {
    return elementsBoundingBox(this.paths, true, matrix);
  }
  rawBBox() {
    return elementsBoundingBox(this.paths, false);
  }
  _containsPoint(point2) {
    const paths = this.paths;
    for (let idx = 0; idx < paths.length; idx++) {
      if (paths[idx]._containsPoint(point2)) {
        return true;
      }
    }
    return false;
  }
  _isOnPath(point2) {
    const paths = this.paths;
    const width = this.options.stroke.width;
    for (let idx = 0; idx < paths.length; idx++) {
      if (paths[idx]._isOnPath(point2, width)) {
        return true;
      }
    }
    return false;
  }
  _clippedBBox(transformation) {
    return elementsClippedBoundingBox(this.paths, this.currentTransform(transformation));
  }
};

// node_modules/@progress/kendo-drawing/dist/es/shapes/arc.js
var DEFAULT_STROKE2 = "#000";
var Arc2 = class extends paintable_default(measurable_default(with_geometry_default(element_default))) {
  get nodeType() {
    return "Arc";
  }
  constructor(geometry = new arc_default(), options2 = {}) {
    super(options2);
    this.geometry(geometry);
    if (this.options.stroke === void 0) {
      this.stroke(DEFAULT_STROKE2);
    }
  }
  _bbox(matrix) {
    return this._geometry.bbox(matrix);
  }
  rawBBox() {
    return this.geometry().bbox();
  }
  toPath() {
    const path = new Path();
    const curvePoints = this.geometry().curvePoints();
    if (curvePoints.length > 0) {
      path.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i < curvePoints.length; i += 3) {
        path.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
      }
    }
    return path;
  }
  _containsPoint(point2) {
    return this.geometry().containsPoint(point2);
  }
  _isOnPath(point2) {
    return this.geometry()._isOnPath(point2, this.options.stroke.width / 2);
  }
};
var arc_default2 = Arc2;

// node_modules/@progress/kendo-drawing/dist/es/shapes/text.js
var DEFAULT_FONT = "12px sans-serif";
var DEFAULT_FILL = "#000";
var Text = class extends paintable_default(with_points_default(element_default, ["position"])) {
  get nodeType() {
    return "Text";
  }
  constructor(content, position = new point_default(), options2 = {}) {
    super(options2);
    this.content(content);
    this.position(position);
    if (!this.options.font) {
      this.options.font = DEFAULT_FONT;
    }
    if (this.options.fill === void 0) {
      this.fill(DEFAULT_FILL);
    }
  }
  content(value) {
    if (value !== void 0) {
      this.options.set("content", value);
      return this;
    }
    return this.options.get("content");
  }
  measure() {
    const metrics = measureText(this.content(), {
      font: this.options.get("font")
    });
    return metrics;
  }
  rect() {
    const size = this.measure();
    const pos = this.position().clone();
    return new rect_default(pos, [size.width, size.height]);
  }
  bbox(transformation) {
    const combinedMatrix = toMatrix(this.currentTransform(transformation));
    return this.rect().bbox(combinedMatrix);
  }
  rawBBox() {
    return this.rect().bbox();
  }
  _containsPoint(point2) {
    return this.rect().containsPoint(point2);
  }
};
var text_default = Text;

// node_modules/@progress/kendo-drawing/dist/es/shapes/image.js
var Image2 = class extends with_geometry_default(element_default, ["rect"]) {
  get nodeType() {
    return "Image";
  }
  constructor(src, rect = new rect_default(), options2 = {}) {
    super(options2);
    this.src(src);
    this.rect(rect);
  }
  src(value) {
    if (value !== void 0) {
      this.options.set("src", value);
      return this;
    }
    return this.options.get("src");
  }
  bbox(transformation) {
    const combinedMatrix = toMatrix(this.currentTransform(transformation));
    return this._rect.bbox(combinedMatrix);
  }
  rawBBox() {
    return this._rect.bbox();
  }
  _containsPoint(point2) {
    return this._rect.containsPoint(point2);
  }
  _hasFill() {
    return this.src();
  }
};
var image_default = Image2;

// node_modules/@progress/kendo-drawing/dist/es/mixins/traversable.js
var traversable = (TBase, childrenField) => class extends TBase {
  traverse(callback) {
    const children = this[childrenField];
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (child.traverse) {
        child.traverse(callback);
      } else {
        callback(child);
      }
    }
    return this;
  }
};
var traversable_default = traversable;

// node_modules/@progress/kendo-drawing/dist/es/shapes/group.js
var Group = class extends traversable_default(element_default, "children") {
  get nodeType() {
    return "Group";
  }
  constructor(options2) {
    super(options2);
    this.children = [];
  }
  childrenChange(action, items, index) {
    this.trigger("childrenChange", {
      action,
      items,
      index
    });
  }
  append() {
    append(this.children, arguments);
    this._reparent(arguments, this);
    this.childrenChange("add", arguments);
    return this;
  }
  insert(index, element) {
    this.children.splice(index, 0, element);
    element.parent = this;
    this.childrenChange("add", [element], index);
    return this;
  }
  insertAt(element, index) {
    return this.insert(index, element);
  }
  remove(element) {
    const index = this.children.indexOf(element);
    if (index >= 0) {
      this.children.splice(index, 1);
      element.parent = null;
      this.childrenChange("remove", [element], index);
    }
    return this;
  }
  removeAt(index) {
    if (0 <= index && index < this.children.length) {
      let element = this.children[index];
      this.children.splice(index, 1);
      element.parent = null;
      this.childrenChange("remove", [element], index);
    }
    return this;
  }
  clear() {
    const items = this.children;
    this.children = [];
    this._reparent(items, null);
    this.childrenChange("remove", items, 0);
    return this;
  }
  bbox(transformation) {
    return elementsBoundingBox(this.children, true, this.currentTransform(transformation));
  }
  rawBBox() {
    return elementsBoundingBox(this.children, false);
  }
  _clippedBBox(transformation) {
    return elementsClippedBoundingBox(this.children, this.currentTransform(transformation));
  }
  currentTransform(transformation) {
    return element_default.prototype.currentTransform.call(this, transformation) || null;
  }
  containsPoint(point2, parentTransform) {
    if (this.visible()) {
      const children = this.children;
      const transform2 = this.currentTransform(parentTransform);
      for (let idx = 0; idx < children.length; idx++) {
        if (children[idx].containsPoint(point2, transform2)) {
          return true;
        }
      }
    }
    return false;
  }
  _reparent(elements, newParent) {
    for (let i = 0; i < elements.length; i++) {
      const child = elements[i];
      const parent = child.parent;
      if (parent && parent !== this && parent.remove) {
        parent.remove(child);
      }
      child.parent = newParent;
    }
  }
};
var group_default = Group;

// node_modules/@progress/kendo-drawing/dist/es/alignment/translate-to-point.js
function translateToPoint(point2, bbox, element) {
  const transofrm = element.transform() || transform();
  const matrix = transofrm.matrix();
  matrix.e += point2.x - bbox.origin.x;
  matrix.f += point2.y - bbox.origin.y;
  transofrm.matrix(matrix);
  element.transform(transofrm);
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/align-start.js
function alignStart(size, rect, align2, axis, sizeField) {
  let start;
  if (align2 === "start") {
    start = rect.origin[axis];
  } else if (align2 === "end") {
    start = rect.origin[axis] + rect.size[sizeField] - size;
  } else {
    start = rect.origin[axis] + (rect.size[sizeField] - size) / 2;
  }
  return start;
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/align-start-reverse.js
function alignStartReverse(size, rect, align2, axis, sizeField) {
  let start;
  if (align2 === "start") {
    start = rect.origin[axis] + rect.size[sizeField] - size;
  } else if (align2 === "end") {
    start = rect.origin[axis];
  } else {
    start = rect.origin[axis] + (rect.size[sizeField] - size) / 2;
  }
  return start;
}

// node_modules/@progress/kendo-drawing/dist/es/shapes/layout.js
var DEFAULT_OPTIONS2 = {
  alignContent: "start",
  justifyContent: "start",
  alignItems: "start",
  spacing: 0,
  orientation: "horizontal",
  lineSpacing: 0,
  wrap: true,
  revers: false
};
var forEach = (elements, callback) => {
  elements.forEach(callback);
};
var forEachReverse = (elements, callback) => {
  const length = elements.length;
  for (let idx = length - 1; idx >= 0; idx--) {
    callback(elements[idx], idx);
  }
};
var Layout = class extends group_default {
  constructor(rect, options2) {
    super(Object.assign({}, DEFAULT_OPTIONS2, options2));
    this._rect = rect;
    this._fieldMap = {};
  }
  rect(value) {
    if (value) {
      this._rect = value;
      return this;
    }
    return this._rect;
  }
  appendBreak() {
    const breakMarker = new group_default();
    breakMarker._isBreakMarker = true;
    this.append(breakMarker);
    return this;
  }
  _initMap() {
    const options2 = this.options;
    const fieldMap = this._fieldMap;
    if (options2.orientation === "horizontal") {
      fieldMap.sizeField = "width";
      fieldMap.groupsSizeField = "height";
      fieldMap.groupAxis = "x";
      fieldMap.groupsAxis = "y";
    } else {
      fieldMap.sizeField = "height";
      fieldMap.groupsSizeField = "width";
      fieldMap.groupAxis = "y";
      fieldMap.groupsAxis = "x";
    }
    if (options2.reverse) {
      this.forEach = forEachReverse;
      this.justifyAlign = alignStartReverse;
    } else {
      this.forEach = forEach;
      this.justifyAlign = alignStart;
    }
  }
  reflow() {
    if (!this._rect || this.children.length === 0) {
      return;
    }
    this._initMap();
    if (this.options.transform) {
      this.transform(null);
    }
    const options2 = this.options;
    const rect = this._rect;
    const { groups, groupsSize } = this._initGroups();
    const { sizeField, groupsSizeField, groupAxis, groupsAxis } = this._fieldMap;
    const groupOrigin = new point_default();
    const elementOrigin = new point_default();
    const size = new size_default();
    let groupStart = alignStart(groupsSize, rect, options2.alignContent, groupsAxis, groupsSizeField);
    let elementStart, group, groupBox;
    const arrangeElements = (bbox, idx) => {
      const element = group.elements[idx];
      elementOrigin[groupAxis] = elementStart;
      elementOrigin[groupsAxis] = alignStart(bbox.size[groupsSizeField], groupBox, options2.alignItems, groupsAxis, groupsSizeField);
      translateToPoint(elementOrigin, bbox, element);
      elementStart += bbox.size[sizeField] + options2.spacing;
    };
    for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
      group = groups[groupIdx];
      groupOrigin[groupAxis] = elementStart = this.justifyAlign(group.size, rect, options2.justifyContent, groupAxis, sizeField);
      groupOrigin[groupsAxis] = groupStart;
      size[sizeField] = group.size;
      size[groupsSizeField] = group.lineSize;
      groupBox = new rect_default(groupOrigin, size);
      this.forEach(group.bboxes, arrangeElements);
      groupStart += group.lineSize + options2.lineSpacing;
    }
    if (!options2.wrap && group.size > rect.size[sizeField]) {
      const scale = rect.size[sizeField] / groupBox.size[sizeField];
      const scaledStart = groupBox.topLeft().scale(scale, scale);
      const scaledSize = groupBox.size[groupsSizeField] * scale;
      const newStart = alignStart(scaledSize, rect, options2.alignContent, groupsAxis, groupsSizeField);
      const transform2 = transform();
      if (groupAxis === "x") {
        transform2.translate(rect.origin.x - scaledStart.x, newStart - scaledStart.y);
      } else {
        transform2.translate(newStart - scaledStart.x, rect.origin.y - scaledStart.y);
      }
      transform2.scale(scale, scale);
      this.transform(transform2);
    }
  }
  _initGroups() {
    const { options: options2, children } = this;
    const { lineSpacing, wrap: wrap2, spacing } = options2;
    const sizeField = this._fieldMap.sizeField;
    let group = this._newGroup();
    const groups = [];
    const addGroup = function() {
      groups.push(group);
      groupsSize += group.lineSize + lineSpacing;
    };
    let groupsSize = -lineSpacing;
    for (let idx = 0; idx < children.length; idx++) {
      let element = children[idx];
      let bbox = children[idx].clippedBBox();
      if (element._isBreakMarker) {
        if (group.bboxes.length > 0) {
          addGroup();
          group = this._newGroup();
        }
        continue;
      }
      if (element.visible() && bbox) {
        if (wrap2 && group.size + bbox.size[sizeField] + spacing > this._rect.size[sizeField]) {
          if (group.bboxes.length === 0) {
            this._addToGroup(group, bbox, element);
            addGroup();
            group = this._newGroup();
          } else {
            addGroup();
            group = this._newGroup();
            this._addToGroup(group, bbox, element);
          }
        } else {
          this._addToGroup(group, bbox, element);
        }
      }
    }
    if (group.bboxes.length) {
      addGroup();
    }
    return {
      groups,
      groupsSize
    };
  }
  _addToGroup(group, bbox, element) {
    group.size += bbox.size[this._fieldMap.sizeField] + this.options.spacing;
    group.lineSize = Math.max(bbox.size[this._fieldMap.groupsSizeField], group.lineSize);
    group.bboxes.push(bbox);
    group.elements.push(element);
  }
  _newGroup() {
    return {
      lineSize: 0,
      size: -this.options.spacing,
      bboxes: [],
      elements: []
    };
  }
};
var layout_default = Layout;

// node_modules/@progress/kendo-drawing/dist/es/shapes/rect.js
var Rect2 = class extends paintable_default(measurable_default(with_geometry_default(element_default))) {
  get nodeType() {
    return "Rect";
  }
  constructor(geometry = new rect_default(), options2 = {}) {
    super(options2);
    this.geometry(geometry);
    if (this.options.stroke === void 0) {
      this.stroke("#000");
    }
  }
  _bbox(matrix) {
    return this._geometry.bbox(matrix);
  }
  rawBBox() {
    return this._geometry.bbox();
  }
  _containsPoint(point2) {
    return this._geometry.containsPoint(point2);
  }
  _isOnPath(point2) {
    return this.geometry()._isOnPath(point2, this.options.stroke.width / 2);
  }
};
var rect_default2 = Rect2;

// node_modules/@progress/kendo-drawing/dist/es/alignment/align-elements.js
function alignElements(elements, rect, alignment, axis, sizeField) {
  for (let idx = 0; idx < elements.length; idx++) {
    const bbox = elements[idx].clippedBBox();
    if (bbox) {
      const point2 = bbox.origin.clone();
      point2[axis] = alignStart(bbox.size[sizeField], rect, alignment || "start", axis, sizeField);
      translateToPoint(point2, bbox, elements[idx]);
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/align.js
function align(elements, rect, alignment) {
  alignElements(elements, rect, alignment, "x", "width");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/v-align.js
function vAlign(elements, rect, alignment) {
  alignElements(elements, rect, alignment, "y", "height");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/stack-elements.js
function stackElements(elements, stackAxis, otherAxis, sizeField) {
  if (elements.length > 1) {
    const origin = new point_default();
    let previousBBox = elements[0].bbox;
    for (let idx = 1; idx < elements.length; idx++) {
      let element = elements[idx].element;
      let bbox = elements[idx].bbox;
      origin[stackAxis] = previousBBox.origin[stackAxis] + previousBBox.size[sizeField];
      origin[otherAxis] = bbox.origin[otherAxis];
      translateToPoint(origin, bbox, element);
      bbox.origin[stackAxis] = origin[stackAxis];
      previousBBox = bbox;
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/create-stack-elements.js
function createStackElements(elements) {
  const stackElements2 = [];
  for (let idx = 0; idx < elements.length; idx++) {
    let element = elements[idx];
    let bbox = element.clippedBBox();
    if (bbox) {
      stackElements2.push({
        element,
        bbox
      });
    }
  }
  return stackElements2;
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/stack.js
function stack(elements) {
  stackElements(createStackElements(elements), "x", "y", "width");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/v-stack.js
function vStack(elements) {
  stackElements(createStackElements(elements), "y", "x", "height");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/wrap-elements.js
function getStacks(elements, rect, sizeField) {
  const maxSize = rect.size[sizeField];
  const stacks = [];
  let stack2 = [];
  let stackSize = 0;
  let element, bbox;
  const addElementToStack = function() {
    stack2.push({
      element,
      bbox
    });
  };
  for (let idx = 0; idx < elements.length; idx++) {
    element = elements[idx];
    bbox = element.clippedBBox();
    if (bbox) {
      let size = bbox.size[sizeField];
      if (stackSize + size > maxSize) {
        if (stack2.length) {
          stacks.push(stack2);
          stack2 = [];
          addElementToStack();
          stackSize = size;
        } else {
          addElementToStack();
          stacks.push(stack2);
          stack2 = [];
          stackSize = 0;
        }
      } else {
        addElementToStack();
        stackSize += size;
      }
    }
  }
  if (stack2.length) {
    stacks.push(stack2);
  }
  return stacks;
}
function wrapElements(elements, rect, axis, otherAxis, sizeField) {
  const stacks = getStacks(elements, rect, sizeField);
  const origin = rect.origin.clone();
  const result = [];
  for (let idx = 0; idx < stacks.length; idx++) {
    let stack2 = stacks[idx];
    let startElement = stack2[0];
    origin[otherAxis] = startElement.bbox.origin[otherAxis];
    translateToPoint(origin, startElement.bbox, startElement.element);
    startElement.bbox.origin[axis] = origin[axis];
    stackElements(stack2, axis, otherAxis, sizeField);
    result.push([]);
    for (let elementIdx = 0; elementIdx < stack2.length; elementIdx++) {
      result[idx].push(stack2[elementIdx].element);
    }
  }
  return result;
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/wrap.js
function wrap(elements, rect) {
  return wrapElements(elements, rect, "x", "y", "width");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/v-wrap.js
function vWrap(elements, rect) {
  return wrapElements(elements, rect, "y", "x", "height");
}

// node_modules/@progress/kendo-drawing/dist/es/alignment/fit.js
function fit(element, rect) {
  const bbox = element.clippedBBox();
  if (bbox) {
    const elementSize2 = bbox.size;
    const rectSize = rect.size;
    if (rectSize.width < elementSize2.width || rectSize.height < elementSize2.height) {
      const scale = Math.min(rectSize.width / elementSize2.width, rectSize.height / elementSize2.height);
      const transform2 = element.transform() || transform();
      transform2.scale(scale, scale);
      element.transform(transform2);
    }
  }
}

// node_modules/@progress/kendo-drawing/dist/es/gradients/stops-array.js
var StopsArray = class extends elements_array_default {
  _change() {
    this.optionsChange({
      field: "stops"
    });
  }
};
var stops_array_default = StopsArray;

// node_modules/@progress/kendo-drawing/dist/es/mixins/with-options.js
function optionsAccessor(name) {
  return function(value) {
    if (value !== void 0) {
      this.options.set(name, value);
      return this;
    }
    return this.options.get(name);
  };
}
function defineOptionsAccessors(fn, names) {
  for (let i = 0; i < names.length; i++) {
    fn[names[i]] = optionsAccessor(names[i]);
  }
}
var withOptions = (TBase, names) => {
  const result = class extends TBase {
  };
  defineOptionsAccessors(result.prototype, names);
  return result;
};
var with_options_default = withOptions;

// node_modules/@progress/kendo-drawing/dist/es/gradients/gradient-stop.js
var options = ["offset", "color", "opacity"];
var GradientStop = class _GradientStop extends with_options_default(has_observers_default, options) {
  constructor(offset, color, opacity) {
    super();
    this.options = new options_store_default({
      offset,
      color,
      opacity: opacity !== void 0 ? opacity : 1
    });
    this.options.addObserver(this);
  }
  static create(arg) {
    if (arg !== void 0) {
      let stop;
      if (arg instanceof _GradientStop) {
        stop = arg;
      } else if (arg.length > 1) {
        stop = new _GradientStop(arg[0], arg[1], arg[2]);
      } else {
        stop = new _GradientStop(arg.offset, arg.color, arg.opacity);
      }
      return stop;
    }
  }
};
var gradient_stop_default = GradientStop;

// node_modules/@progress/kendo-drawing/dist/es/gradients/gradient.js
var Gradient = class extends has_observers_default {
  get nodeType() {
    return "Gradient";
  }
  constructor(options2 = {}) {
    super();
    this.stops = new stops_array_default(this._createStops(options2.stops));
    this.stops.addObserver(this);
    this._userSpace = options2.userSpace;
    this.id = definitionId();
  }
  userSpace(value) {
    if (value !== void 0) {
      this._userSpace = value;
      this.optionsChange();
      return this;
    }
    return this._userSpace;
  }
  _createStops(stops = []) {
    const result = [];
    for (let idx = 0; idx < stops.length; idx++) {
      result.push(gradient_stop_default.create(stops[idx]));
    }
    return result;
  }
  addStop(offset, color, opacity) {
    this.stops.push(new gradient_stop_default(offset, color, opacity));
  }
  removeStop(stop) {
    const index = this.stops.indexOf(stop);
    if (index >= 0) {
      this.stops.splice(index, 1);
    }
  }
  optionsChange(e) {
    this.trigger("optionsChange", {
      field: "gradient" + (e ? "." + e.field : ""),
      value: this
    });
  }
  geometryChange() {
    this.optionsChange();
  }
};
var gradient_default = Gradient;

// node_modules/@progress/kendo-drawing/dist/es/gradients/linear-gradient.js
var points2 = ["start", "end"];
var LinearGradient = class extends with_points_default(gradient_default, points2) {
  constructor(options2 = {}) {
    super(options2);
    this.start(options2.start || new point_default());
    this.end(options2.end || new point_default(1, 0));
  }
};
var linear_gradient_default = LinearGradient;

// node_modules/@progress/kendo-drawing/dist/es/gradients/radial-gradient.js
var RadialGradient = class extends with_points_default(gradient_default, ["center"]) {
  constructor(options2 = {}) {
    super(options2);
    this.center(options2.center || new point_default());
    this._radius = options2.radius !== void 0 ? options2.radius : 1;
    this._fallbackFill = options2.fallbackFill;
  }
  radius(value) {
    if (value !== void 0) {
      this._radius = value;
      this.geometryChange();
      return this;
    }
    return this._radius;
  }
  fallbackFill(value) {
    if (value !== void 0) {
      this._fallbackFill = value;
      this.optionsChange();
      return this;
    }
    return this._fallbackFill;
  }
};
var radial_gradient_default = RadialGradient;

// node_modules/@progress/kendo-drawing/dist/es/patterns/pattern.js
var defaultColor = "#aba4a6";
var defaultLine = { width: 2, gap: 18 };
var defaultDot = { radius: 10, gap: 10 };
var defaultGrid = { size: 18, gap: 2 };
var Pattern = class extends group_default {
  get nodeType() {
    return PATTERN;
  }
  constructor(options2) {
    super();
    const { width, height } = options2;
    this._size = size_default.create([width, height]);
    this.id = definitionId();
  }
  size(value) {
    if (value) {
      this._size = size_default.create(value);
      return this;
    }
    return this._size;
  }
};
var drawBackground = (pattern, color, size) => {
  if (color) {
    pattern.append(
      new rect_default2(new rect_default([0, 0], size), { fill: { color }, stroke: null })
    );
  }
};
function dotsPattern(options2 = {}) {
  const { gap = defaultDot.gap, radius = defaultDot.radius, color = defaultColor, background } = options2;
  const shapeOptions = { fill: { color }, stroke: null };
  const size = 4 * radius + 2 * gap;
  const yC2 = 3 * radius + 1.5 * gap;
  const center1 = [size / 2, radius + 1 / 2 * gap];
  const center2 = [0, yC2];
  const center3 = [size, yC2];
  const pattern = new Pattern({ width: size, height: size });
  drawBackground(pattern, background, [size, size]);
  pattern.append(
    new circle_default2(new circle_default(center1, radius), shapeOptions),
    new circle_default2(new circle_default(center2, radius), shapeOptions),
    new circle_default2(new circle_default(center3, radius), shapeOptions)
  );
  return pattern;
}
function verticalStripesPattern(options2 = {}) {
  const { gap = defaultLine.gap, width = defaultLine.width, color = defaultColor, background } = options2;
  const size = width + gap;
  const shapeOptions = { fill: null, stroke: { color, width: width / 2 } };
  const pattern = new Pattern({ width: size, height: size });
  drawBackground(pattern, background, [size, size]);
  const xStart = width / 4;
  const xEnd = size - width / 4;
  const startLine = new Path(shapeOptions);
  startLine.moveTo(xStart, 0).lineTo(xStart, size);
  const endLine = new Path(shapeOptions);
  endLine.moveTo(xEnd, 0).lineTo(xEnd, size);
  pattern.append(startLine, endLine);
  return pattern;
}
function crosshatchPattern(options2 = {}) {
  const { gap = defaultLine.gap, width = defaultLine.width, color = defaultColor, background } = options2;
  const size = Math.sqrt(2) * (width + gap);
  const shapeOptions = { fill: null, stroke: { color, width } };
  const pattern = new Pattern({ width: size, height: size });
  drawBackground(pattern, background, [size, size]);
  const line1 = new Path(shapeOptions);
  line1.moveTo(0, 0).lineTo(size, size);
  const line2 = new Path(shapeOptions);
  line2.moveTo(size, 0).lineTo(0, size);
  pattern.append(line1, line2);
  return pattern;
}
function diagonalStripesPattern(options2 = {}) {
  const { gap = defaultLine.gap, width = defaultLine.width, color = defaultColor, background } = options2;
  const size = Math.sqrt(2) * (width + gap);
  const shapeOptions = { fill: null, stroke: { color, width, lineCap: "square" } };
  const pattern = new Pattern({ width: size, height: size });
  drawBackground(pattern, background, [size, size]);
  const line1 = new Path(shapeOptions);
  line1.moveTo(0, size / 2).lineTo(size / 2, 0);
  const line2 = new Path(shapeOptions);
  line2.moveTo(size / 2, size).lineTo(size, size / 2);
  pattern.append(line1, line2);
  return pattern;
}
function gridPattern(options2 = {}) {
  const { gap = defaultGrid.gap, size: squareSize = defaultGrid.size, color = defaultColor, background } = options2;
  const size = squareSize + gap;
  const halfGap = gap / 2;
  const shapeOptions = { fill: { color }, stroke: null };
  const pattern = new Pattern({ width: size, height: size });
  drawBackground(pattern, background, [size, size]);
  const rect = new rect_default2(new rect_default([halfGap, halfGap], [squareSize, squareSize]), shapeOptions);
  pattern.append(rect);
  return pattern;
}

// node_modules/@progress/kendo-drawing/dist/es/animations/easing-functions.js
var easing_functions_exports = {};
__export(easing_functions_exports, {
  easeInOutBack: () => easeInOutBack,
  easeInOutCubic: () => easeInOutCubic,
  easeInOutExpo: () => easeInOutExpo,
  easeInOutQuad: () => easeInOutQuad,
  easeInOutQuint: () => easeInOutQuint,
  easeInOutSine: () => easeInOutSine,
  easeOutBack: () => easeOutBack,
  easeOutCirc: () => easeOutCirc,
  easeOutCubic: () => easeOutCubic,
  easeOutElastic: () => easeOutElastic,
  easeOutExpo: () => easeOutExpo,
  easeOutQuad: () => easeOutQuad,
  easeOutQuint: () => easeOutQuint,
  linear: () => linear,
  swing: () => swing
});
function swing(x) {
  return 0.5 - Math.cos(x * Math.PI) / 2;
}
function linear(x) {
  return x;
}
function easeOutElastic(x) {
  if (x === 0 || x === 1) {
    return x;
  }
  const p = 0.5;
  const s = p / 4;
  return Math.pow(2, -10 * x) * Math.sin((x - s) * (1.1 * Math.PI) / p) + 1;
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easeOutQuad(x) {
  return 1 - Math.pow(1 - x, 2);
}
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function easeOutCirc(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}
function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}
function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeInOutExpo(x) {
  if (x === 0 || x === 1) {
    return x;
  }
  return x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
function easeInOutBack(x) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return x < 0.5 ? Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}
function easeOutQuint(x) {
  return 1 - Math.pow(1 - x, 5);
}
function easeInOutQuint(x) {
  return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

// node_modules/@progress/kendo-drawing/dist/es/animations/animation-factory.js
var instance;
var AnimationFactory = class _AnimationFactory extends Class {
  static get current() {
    if (!instance) {
      instance = new _AnimationFactory();
    }
    return instance;
  }
  constructor() {
    super();
    this._items = [];
  }
  register(name, type) {
    this._items.push({
      name,
      type
    });
  }
  create(element, options2) {
    const items = this._items;
    let match;
    if (options2 && options2.type) {
      const type = options2.type.toLowerCase();
      for (let i = 0; i < items.length; i++) {
        if (items[i].name.toLowerCase() === type) {
          match = items[i];
          break;
        }
      }
    }
    if (match) {
      return new match.type(element, options2);
    }
  }
};
var animation_factory_default = AnimationFactory;

// node_modules/@progress/kendo-drawing/dist/es/animations/motion.js
function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}
function makeCubicBezierEasing(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  function xOfT(t) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function yOfT(t) {
    return ((ay * t + by) * t + cy) * t;
  }
  function dxdt(t) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }
  function solveTForX(x) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const f = xOfT(t) - x;
      const d = dxdt(t);
      if (Math.abs(f) < 1e-7) {
        return t;
      }
      if (Math.abs(d) < 1e-7) {
        break;
      }
      t -= f / d;
    }
    let lo = 0, hi = 1;
    t = x;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const xm = xOfT(mid);
      if (Math.abs(xm - x) < 1e-7) {
        return mid;
      }
      if (xm < x) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return (lo + hi) / 2;
  }
  return (x) => {
    const clampedX = clamp01(x);
    if (clampedX === 0 || clampedX === 1) {
      return clampedX;
    }
    const t = solveTForX(clampedX);
    return yOfT(t);
  };
}

// node_modules/@progress/kendo-drawing/dist/es/animations/animation.js
var defaultOptions = {
  duration: 500,
  easing: "swing"
};
var Animation = class extends Class {
  static create(type, element, options2) {
    return animation_factory_default.current.create(type, element, options2);
  }
  get options() {
    return this._options || defaultOptions;
  }
  set options(value) {
    this._options = value;
  }
  constructor(element, options2) {
    super();
    this.options = Object.assign({}, this.options, options2);
    this.element = element;
  }
  setup() {
  }
  step() {
  }
  play() {
    const options2 = this.options;
    if (typeof options2.easing === "string" && easing_functions_exports[options2.easing]) {
      options2.easing = easing_functions_exports[options2.easing];
    } else if (Array.isArray(options2.easing) && options2.easing.length === 4) {
      options2.easing = makeCubicBezierEasing(...options2.easing);
    } else {
      options2.easing = easing_functions_exports[defaultOptions.easing];
    }
    const { duration, delay = 0, easing } = options2;
    const start = now_default() + delay;
    const finish = start + duration;
    if (duration === 0) {
      this.step(1);
      this.abort();
    } else {
      setTimeout(() => {
        const loop = () => {
          if (this._stopped) {
            return;
          }
          const wallTime = now_default();
          const time = limitValue(wallTime - start, 0, duration);
          const eased = easing(time / duration);
          this.step(eased);
          if (wallTime < finish) {
            animation_frame_default(loop);
          } else {
            this.abort();
          }
        };
        loop();
      }, delay);
    }
  }
  abort() {
    this._stopped = true;
  }
  destroy() {
    this.abort();
  }
};
var animation_default = Animation;

// node_modules/@progress/kendo-drawing/dist/es/parsing/path-parser.js
var instance2;
var PathParser = class _PathParser extends Class {
  static get current() {
    if (!instance2) {
      instance2 = new _PathParser();
    }
    return instance2;
  }
  parse(str, options2) {
    const multiPath = new MultiPath(options2);
    return parse_path_default(multiPath, str);
  }
};
var path_parser_default = PathParser;

// node_modules/@progress/kendo-drawing/dist/es/core/base-node.js
var BaseNode = class extends Class {
  constructor(srcElement) {
    super();
    this.childNodes = [];
    this.parent = null;
    if (srcElement) {
      this.srcElement = srcElement;
      this.observe();
    }
  }
  destroy() {
    if (this.srcElement) {
      this.srcElement.removeObserver(this);
    }
    const children = this.childNodes;
    for (let i = 0; i < children.length; i++) {
      this.childNodes[i].destroy();
    }
    this.parent = null;
  }
  load() {
  }
  observe() {
    if (this.srcElement) {
      this.srcElement.addObserver(this);
    }
  }
  append(node) {
    this.childNodes.push(node);
    node.parent = this;
  }
  insertAt(node, pos) {
    this.childNodes.splice(pos, 0, node);
    node.parent = this;
  }
  remove(index, count) {
    const end = index + count;
    for (let i = index; i < end; i++) {
      this.childNodes[i].removeSelf();
    }
    this.childNodes.splice(index, count);
  }
  removeSelf() {
    this.clear();
    this.destroy();
  }
  clear() {
    this.remove(0, this.childNodes.length);
  }
  invalidate() {
    if (this.parent) {
      this.parent.invalidate();
    }
  }
  geometryChange() {
    this.invalidate();
  }
  optionsChange() {
    this.invalidate();
  }
  childrenChange(e) {
    if (e.action === "add") {
      this.load(e.items, e.index);
    } else if (e.action === "remove") {
      this.remove(e.index, e.items.length);
    }
    this.invalidate();
  }
};
var base_node_default = BaseNode;

// node_modules/@progress/kendo-drawing/dist/es/core/surface.js
var events = [
  "click",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "resize"
];
var Surface = class extends observable_default {
  constructor(element, options2) {
    super();
    this.options = Object.assign({}, options2);
    this.element = element;
    this.element._kendoExportVisual = this.exportVisual.bind(this);
    this._click = this._handler("click");
    this._mouseenter = this._handler("mouseenter");
    this._mouseleave = this._handler("mouseleave");
    this._mousemove = this._handler("mousemove");
    this._visual = new group_default();
    elementSize(element, this.options);
    this.bind(events, this.options);
    this._enableTracking();
  }
  draw(element) {
    this._visual.children.push(element);
  }
  clear() {
    this._visual.children = [];
  }
  destroy() {
    this._visual = null;
    this.element._kendoExportVisual = null;
    this.unbind();
  }
  eventTarget(e) {
    let domNode = eventElement(e);
    let node;
    while (!node && domNode) {
      node = domNode._kendoNode;
      if (domNode === this.element) {
        break;
      }
      domNode = domNode.parentElement;
    }
    if (node) {
      return node.srcElement;
    }
  }
  exportVisual() {
    return this._visual;
  }
  getSize() {
    return elementSize(this.element);
  }
  currentSize(size) {
    if (size) {
      this._size = size;
    } else {
      return this._size;
    }
  }
  setSize(size) {
    elementSize(this.element, size);
    this.currentSize(size);
    this._resize();
  }
  resize(force) {
    const size = this.getSize();
    const currentSize = this.currentSize();
    if (force || (size.width > 0 || size.height > 0) && (!currentSize || size.width !== currentSize.width || size.height !== currentSize.height)) {
      this.currentSize(size);
      this._resize(size, force);
      this.trigger("resize", size);
    }
  }
  size(value) {
    if (!value) {
      return this.getSize();
    }
    this.setSize(value);
  }
  suspendTracking() {
    this._suspendedTracking = true;
  }
  resumeTracking() {
    this._suspendedTracking = false;
  }
  _enableTracking() {
  }
  _resize() {
  }
  _handler(eventName) {
    return (e) => {
      const node = this.eventTarget(e);
      if (node && !this._suspendedTracking) {
        this.trigger(eventName, {
          element: node,
          originalEvent: e,
          type: eventName
        });
      }
    };
  }
  _elementOffset() {
    const element = this.element;
    const padding = elementPadding(element);
    const { left, top } = elementOffset(element);
    return {
      left: left + padding.left,
      top: top + padding.top
    };
  }
  _surfacePoint(e) {
    const offset = this._elementOffset();
    const coord = eventCoordinates(e);
    const x = coord.x - offset.left;
    const y = coord.y - offset.top;
    const inverseTransform = elementScale(this.element).invert();
    const point2 = new point_default(
      x,
      y
    ).transform(inverseTransform);
    return point2;
  }
};
var surface_default = Surface;

// node_modules/@progress/kendo-drawing/dist/es/svg/utils/render-attribute.js
function renderAttr(name, value) {
  return value !== void 0 && value !== null ? ` ${name}="${value}" ` : "";
}

// node_modules/@progress/kendo-drawing/dist/es/svg/utils/render-all-attributes.js
function renderAllAttr(attrs) {
  let output = "";
  for (let i = 0; i < attrs.length; i++) {
    output += renderAttr(attrs[i][0], attrs[i][1]);
  }
  return output;
}

// node_modules/@progress/kendo-drawing/dist/es/svg/utils/render-style.js
function renderStyle(attrs) {
  let output = "";
  for (let i = 0; i < attrs.length; i++) {
    let value = attrs[i][1];
    if (value !== void 0) {
      output += attrs[i][0] + ":" + value + ";";
    }
  }
  if (output !== "") {
    return output;
  }
}

// node_modules/@progress/kendo-drawing/dist/es/svg/node-map.js
var NODE_MAP = {};
var node_map_default = NODE_MAP;

// node_modules/@progress/kendo-drawing/dist/es/svg/constants.js
var SVG_NS = "http://www.w3.org/2000/svg";
var NONE = "none";
var POINT_DIGITS = 3;

// node_modules/@progress/kendo-drawing/dist/es/svg/utils/render-svg.js
var renderUsingInnerHTML = (container, svg) => {
  prependElement(container, svg);
};
var renderUsingDOMParser = (container, svg) => {
  const parser = new DOMParser();
  const chartDoc = parser.parseFromString(replaceStyleAttr(svg), "text/xml");
  restoreStyleAttr(chartDoc);
  const importedDoc = document.adoptNode(chartDoc.documentElement);
  container.insertBefore(importedDoc, container.firstChild);
};
var implementation;
var renderSVG = (container, svg) => {
  if (implementation) {
    return implementation(container, svg);
  }
  implementation = renderUsingInnerHTML;
  if (typeof document !== "undefined") {
    const testFragment = "<svg xmlns='" + SVG_NS + "'></svg>";
    const testContainer = document.createElement("div");
    const hasParser = typeof DOMParser !== "undefined";
    testContainer.innerHTML = testFragment;
    if (hasParser && testContainer.firstChild.namespaceURI !== SVG_NS) {
      implementation = renderUsingDOMParser;
    }
  }
  return implementation(container, svg);
};
var render_svg_default = renderSVG;

// node_modules/@progress/kendo-drawing/dist/es/svg/node.js
var TRANSFORM = "transform";
var DefinitionMap = {
  clip: "clip-path",
  fill: "fill"
};
function isDefinition(type, value) {
  return type === "clip" || type === "fill" && (!value || value.nodeType === "Gradient" || value.nodeType === PATTERN);
}
var Node = class extends base_node_default {
  constructor(srcElement, options2) {
    super(srcElement);
    this.definitions = {};
    this.options = options2;
  }
  destroy() {
    if (this.element) {
      this.element._kendoNode = null;
      this.element = null;
    }
    this.clearDefinitions();
    super.destroy();
  }
  load(elements, pos) {
    for (let i = 0; i < elements.length; i++) {
      const srcElement = elements[i];
      const children = srcElement.children;
      const childNode = new node_map_default[srcElement.nodeType](srcElement, this.options);
      if (pos !== void 0) {
        this.insertAt(childNode, pos);
      } else {
        this.append(childNode);
      }
      childNode.createDefinitions();
      if (children && children.length > 0) {
        childNode.load(children);
      }
      const element = this.element;
      if (element) {
        childNode.attachTo(element, pos);
      }
    }
  }
  root() {
    let root = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }
  attachTo(domElement, pos) {
    const container = document.createElement("div");
    render_svg_default(
      container,
      "<svg xmlns='" + SVG_NS + "' version='1.1'>" + this.render() + "</svg>"
    );
    const element = container.firstChild.firstChild;
    if (element) {
      if (pos !== void 0) {
        domElement.insertBefore(element, domElement.childNodes[pos] || null);
      } else {
        domElement.appendChild(element);
      }
      this.setElement(element);
    }
  }
  setElement(element) {
    if (this.element) {
      this.element._kendoNode = null;
    }
    this.element = element;
    this.element._kendoNode = this;
    const nodes = this.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      let childElement = element.childNodes[i];
      nodes[i].setElement(childElement);
    }
  }
  clear() {
    this.clearDefinitions();
    if (this.element) {
      this.element.innerHTML = "";
    }
    const children = this.childNodes;
    for (let i = 0; i < children.length; i++) {
      children[i].destroy();
    }
    this.childNodes = [];
  }
  removeSelf() {
    if (this.element) {
      const parentNode = this.element.parentNode;
      if (parentNode) {
        parentNode.removeChild(this.element);
      }
      this.element = null;
    }
    super.removeSelf();
  }
  template() {
    return this.renderChildren();
  }
  render() {
    return this.template();
  }
  renderChildren() {
    const nodes = this.childNodes;
    let output = "";
    for (let i = 0; i < nodes.length; i++) {
      output += nodes[i].render();
    }
    return output;
  }
  optionsChange(e) {
    const { field, value } = e;
    if (field === "visible") {
      this.css("display", value ? "" : NONE);
    } else if (DefinitionMap[field] && isDefinition(field, value)) {
      this.updateDefinition(field, value);
    } else if (field === "opacity") {
      this.attr("opacity", value);
    } else if (field === "cursor") {
      this.css("cursor", value);
    } else if (field === "id") {
      if (value) {
        this.attr("id", value);
      } else {
        this.removeAttr("id");
      }
    }
    super.optionsChange(e);
  }
  accessibilityOptionsChange(e) {
    const { field, value } = e;
    if (field === "role") {
      if (value) {
        this.attr("role", value);
      } else {
        this.removeAttr("role");
      }
    } else if (field === "ariaLabel") {
      if (value) {
        this.attr("aria-label", htmlEncode(value));
      } else {
        this.removeAttr("aria-label");
      }
    } else if (field === "ariaRoleDescription") {
      if (value) {
        this.attr("aria-roledescription", htmlEncode(value));
      } else {
        this.removeAttr("aria-roledescription");
      }
    } else if (field === "ariaChecked") {
      if (value !== void 0) {
        this.attr("aria-checked", value);
      } else {
        this.removeAttr("aria-checked");
      }
    } else if (field === "className") {
      this.className(value);
    }
  }
  attr(name, value) {
    if (this.element) {
      this.element.setAttribute(name, value);
    }
  }
  allAttr(attrs) {
    for (let i = 0; i < attrs.length; i++) {
      this.attr(attrs[i][0], attrs[i][1]);
    }
  }
  toggleAttr(name, value) {
    if (value) {
      this.attr(name, value);
    } else {
      this.removeAttr(name);
    }
  }
  css(name, value) {
    if (this.element) {
      this.element.style[name] = value;
    }
  }
  allCss(styles) {
    for (let i = 0; i < styles.length; i++) {
      this.css(styles[i][0], styles[i][1]);
    }
  }
  className(value) {
    if (this.element) {
      this.element.classList.remove(...this.element.classList);
      if (value) {
        value.split(" ").forEach((item) => {
          if (item) {
            this.element.classList.add(item);
          }
        });
      }
    }
  }
  removeAttr(name) {
    if (this.element) {
      this.element.removeAttribute(name);
    }
  }
  mapTransform(transform2) {
    const attrs = [];
    if (transform2) {
      attrs.push([
        TRANSFORM,
        "matrix(" + transform2.matrix().toString(6) + ")"
      ]);
    }
    return attrs;
  }
  renderTransform() {
    return renderAllAttr(
      this.mapTransform(this.srcElement.transform())
    );
  }
  transformChange(value) {
    if (value) {
      this.allAttr(this.mapTransform(value));
    } else {
      this.removeAttr(TRANSFORM);
    }
  }
  mapStyle() {
    const options2 = this.srcElement.options;
    const style = [["cursor", options2.cursor]];
    if (options2.visible === false) {
      style.push(["display", NONE]);
    }
    return style;
  }
  renderStyle() {
    return renderAttr("style", renderStyle(this.mapStyle(true)));
  }
  renderOpacity() {
    return renderAttr("opacity", this.srcElement.options.opacity);
  }
  renderId() {
    return renderAttr("id", this.srcElement.options.id);
  }
  renderClassName() {
    return renderAttr("class", this.srcElement.options.className);
  }
  renderRole() {
    return renderAttr("role", this.srcElement.options.role);
  }
  renderAriaLabel() {
    let value = this.srcElement.options.ariaLabel;
    if (value) {
      value = htmlEncode(value);
    }
    return renderAttr("aria-label", value);
  }
  renderAriaRoleDescription() {
    let value = this.srcElement.options.ariaRoleDescription;
    if (value) {
      value = htmlEncode(value);
    }
    return renderAttr("aria-roledescription", value);
  }
  renderAriaChecked() {
    return renderAttr("aria-checked", this.srcElement.options.ariaChecked);
  }
  createDefinitions() {
    const srcElement = this.srcElement;
    const definitions = this.definitions;
    if (srcElement) {
      const options2 = srcElement.options;
      let hasDefinitions;
      for (let field in DefinitionMap) {
        let definition = options2.get(field);
        if (definition && isDefinition(field, definition)) {
          definitions[field] = definition;
          hasDefinitions = true;
        }
      }
      if (hasDefinitions) {
        this.definitionChange({
          action: "add",
          definitions
        });
      }
    }
  }
  definitionChange(e) {
    if (this.parent) {
      this.parent.definitionChange(e);
    }
  }
  updateDefinition(type, value) {
    const definitions = this.definitions;
    const current = definitions[type];
    const attr = DefinitionMap[type];
    const definition = {};
    if (current) {
      definition[type] = current;
      this.definitionChange({
        action: "remove",
        definitions: definition
      });
      delete definitions[type];
    }
    if (!value) {
      if (current) {
        this.removeAttr(attr);
      }
    } else {
      definition[type] = value;
      this.definitionChange({
        action: "add",
        definitions: definition
      });
      definitions[type] = value;
      this.attr(attr, this.refUrl(value.id));
    }
  }
  clearDefinitions() {
    const definitions = this.definitions;
    this.definitionChange({
      action: "remove",
      definitions
    });
    this.definitions = {};
  }
  renderDefinitions() {
    return renderAllAttr(this.mapDefinitions());
  }
  mapDefinitions() {
    const definitions = this.definitions;
    const attrs = [];
    for (let field in definitions) {
      const value = definitions[field];
      attrs.push([DefinitionMap[field], this.refUrl(value.id)]);
    }
    return attrs;
  }
  refUrl(id) {
    return `url(#${id})`;
  }
};
var node_default = Node;

// node_modules/@progress/kendo-drawing/dist/es/svg/gradient-stop-node.js
var GradientStopNode = class extends node_default {
  template() {
    return `<stop ${this.renderOffset()} ${this.renderStyle()} />`;
  }
  renderOffset() {
    return renderAttr("offset", this.srcElement.offset());
  }
  mapStyle() {
    const srcElement = this.srcElement;
    return [
      ["stop-color", srcElement.color()],
      ["stop-opacity", srcElement.opacity()]
    ];
  }
  optionsChange(e) {
    if (e.field === "offset") {
      this.attr(e.field, e.value);
    } else if (e.field === "color" || e.field === "opacity") {
      this.css("stop-" + e.field, e.value);
    }
  }
};
var gradient_stop_node_default = GradientStopNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/gradient-node.js
var GradientNode = class extends node_default {
  constructor(srcElement) {
    super(srcElement);
    this.id = srcElement.id;
    this.loadStops();
  }
  loadStops() {
    const stops = this.srcElement.stops;
    const element = this.element;
    for (let idx = 0; idx < stops.length; idx++) {
      let stopNode = new gradient_stop_node_default(stops[idx]);
      this.append(stopNode);
      if (element) {
        stopNode.attachTo(element);
      }
    }
  }
  optionsChange(e) {
    if (e.field === "gradient.stops") {
      base_node_default.prototype.clear.call(this);
      this.loadStops();
    } else if (e.field === "gradient") {
      this.allAttr(this.mapCoordinates());
    }
  }
  renderCoordinates() {
    return renderAllAttr(this.mapCoordinates());
  }
  mapSpace() {
    return ["gradientUnits", this.srcElement.userSpace() ? "userSpaceOnUse" : "objectBoundingBox"];
  }
};
var gradient_node_default = GradientNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/linear-gradient-node.js
var LinearGradientNode = class extends gradient_node_default {
  template() {
    return `<linearGradient id='${this.id}' ${this.renderCoordinates()}>${this.renderChildren()}</linearGradient>`;
  }
  mapCoordinates() {
    const srcElement = this.srcElement;
    const start = srcElement.start();
    const end = srcElement.end();
    const attrs = [
      ["x1", start.x],
      ["y1", start.y],
      ["x2", end.x],
      ["y2", end.y],
      this.mapSpace()
    ];
    return attrs;
  }
};
var linear_gradient_node_default = LinearGradientNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/radial-gradient-node.js
var RadialGradientNode = class extends gradient_node_default {
  template() {
    return `<radialGradient id='${this.id}' ${this.renderCoordinates()}>${this.renderChildren()}</radialGradient>`;
  }
  mapCoordinates() {
    const srcElement = this.srcElement;
    const center = srcElement.center();
    const radius = srcElement.radius();
    const attrs = [
      ["cx", center.x],
      ["cy", center.y],
      ["r", radius],
      this.mapSpace()
    ];
    return attrs;
  }
};
var radial_gradient_node_default = RadialGradientNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/pattern-node.js
var PatternNode = class extends node_default {
  constructor(pattern) {
    super(pattern);
    this.id = pattern.id;
    this.load(pattern.children);
  }
  template() {
    const width = this.srcElement.size().getWidth();
    const height = this.srcElement.size().getHeight();
    return `<pattern id='${this.srcElement.id}' width='${width}' height='${height}' patternUnits='userSpaceOnUse'>${this.renderChildren()}</pattern>`;
  }
};

// node_modules/@progress/kendo-drawing/dist/es/svg/clip-node.js
var ClipNode = class extends node_default {
  constructor(srcElement) {
    super();
    this.srcElement = srcElement;
    this.id = srcElement.id;
    this.load([srcElement]);
  }
  renderClipRule() {
    return renderAttr("clip-rule", "evenodd");
  }
  template() {
    return `<clipPath ${this.renderClipRule()} id='${this.id}'>${this.renderChildren()}</clipPath>`;
  }
};
var clip_node_default = ClipNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/definition-node.js
var DefinitionNode = class extends node_default {
  constructor() {
    super();
    this.definitionMap = {};
  }
  attachTo(domElement) {
    this.element = domElement;
  }
  template() {
    return `<defs>${this.renderChildren()}</defs>`;
  }
  definitionChange(e) {
    const { definitions, action } = e;
    if (action === "add") {
      this.addDefinitions(definitions);
    } else if (action === "remove") {
      this.removeDefinitions(definitions);
    }
  }
  createDefinition(type, item) {
    let nodeType;
    if (type === "clip") {
      nodeType = clip_node_default;
    } else if (type === "fill") {
      if (item instanceof linear_gradient_default) {
        nodeType = linear_gradient_node_default;
      } else if (item instanceof radial_gradient_default) {
        nodeType = radial_gradient_node_default;
      } else if (item.nodeType === PATTERN) {
        nodeType = PatternNode;
      }
    }
    return new nodeType(item);
  }
  addDefinitions(definitions) {
    for (let field in definitions) {
      this.addDefinition(field, definitions[field]);
    }
  }
  addDefinition(type, srcElement) {
    const { element, definitionMap } = this;
    const id = srcElement.id;
    const mapItem = definitionMap[id];
    if (!mapItem) {
      const node = this.createDefinition(type, srcElement);
      definitionMap[id] = {
        element: node,
        count: 1
      };
      this.append(node);
      if (element) {
        node.attachTo(this.element);
      }
    } else {
      mapItem.count++;
    }
  }
  removeDefinitions(definitions) {
    for (let field in definitions) {
      this.removeDefinition(definitions[field]);
    }
  }
  removeDefinition(srcElement) {
    const definitionMap = this.definitionMap;
    const id = srcElement.id;
    const mapItem = definitionMap[id];
    if (mapItem) {
      mapItem.count--;
      if (mapItem.count === 0) {
        this.remove(this.childNodes.indexOf(mapItem.element), 1);
        delete definitionMap[id];
      }
    }
  }
};
var definition_node_default = DefinitionNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/root-node.js
var RootNode = class extends node_default {
  constructor(options2) {
    super();
    this.options = options2;
    this.defs = new definition_node_default();
  }
  attachTo(domElement) {
    this.element = domElement;
    this.defs.attachTo(domElement.firstElementChild);
  }
  clear() {
    base_node_default.prototype.clear.call(this);
  }
  template() {
    return this.defs.render() + this.renderChildren();
  }
  definitionChange(e) {
    this.defs.definitionChange(e);
  }
};
var root_node_default = RootNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/path-node.js
var ATTRIBUTE_MAP = {
  "fill.opacity": "fill-opacity",
  "stroke.color": "stroke",
  "stroke.width": "stroke-width",
  "stroke.opacity": "stroke-opacity"
};
var PathNode = class extends node_default {
  geometryChange() {
    this.attr("d", this.renderData());
    this.invalidate();
  }
  optionsChange(e) {
    switch (e.field) {
      case "fill":
        if (e.value) {
          this.allAttr(this.mapFill(e.value));
        } else {
          this.removeAttr("fill");
        }
        break;
      case "fill.color":
        this.allAttr(this.mapFill({ color: e.value }));
        break;
      case "stroke":
        if (e.value) {
          this.allAttr(this.mapStroke(e.value));
        } else {
          this.removeAttr("stroke");
        }
        break;
      case "transform":
        this.transformChange(e.value);
        break;
      default: {
        const name = ATTRIBUTE_MAP[e.field];
        if (name) {
          this.attr(name, e.value);
        }
        break;
      }
    }
    this.accessibilityOptionsChange(e);
    super.optionsChange(e);
  }
  content() {
    if (this.element) {
      this.element.textContent = this.srcElement.content();
    }
  }
  renderData() {
    return this.srcElement.toString(POINT_DIGITS) || void 0;
  }
  mapStroke(stroke) {
    const attrs = [];
    if (stroke && !isTransparent(stroke.color)) {
      attrs.push(["stroke", stroke.color]);
      attrs.push(["stroke-width", stroke.width]);
      attrs.push(["stroke-linecap", this.renderLinecap(stroke)]);
      attrs.push(["stroke-linejoin", stroke.lineJoin]);
      if (stroke.opacity !== void 0) {
        attrs.push(["stroke-opacity", stroke.opacity]);
      }
      if (stroke.dashType !== void 0) {
        attrs.push(["stroke-dasharray", this.renderDashType(stroke)]);
      }
    } else {
      attrs.push(["stroke", NONE]);
    }
    return attrs;
  }
  renderStroke() {
    return renderAllAttr(
      this.mapStroke(this.srcElement.options.stroke)
    );
  }
  renderDashType(stroke) {
    const { dashType, width = 1 } = stroke;
    if (dashType && dashType !== SOLID) {
      const dashArray = DASH_ARRAYS[dashType.toLowerCase()];
      const result = [];
      for (let i = 0; i < dashArray.length; i++) {
        result.push(dashArray[i] * width);
      }
      return result.join(" ");
    }
  }
  renderLinecap(stroke) {
    const { dashType, lineCap } = stroke;
    return dashType && dashType !== SOLID ? BUTT : lineCap;
  }
  mapFill(fill) {
    const attrs = [];
    if (!(fill && (fill.nodeType === "Gradient" || fill.nodeType === PATTERN))) {
      if (fill && !isTransparent(fill.color)) {
        attrs.push(["fill", fill.color]);
        if (fill.opacity !== void 0) {
          attrs.push(["fill-opacity", fill.opacity]);
        }
      } else {
        attrs.push(["fill", NONE]);
      }
    }
    return attrs;
  }
  renderFill() {
    return renderAllAttr(
      this.mapFill(this.srcElement.options.fill)
    );
  }
  template() {
    return `<path ${this.renderId()} ${this.renderStyle()} ${this.renderOpacity()} ${renderAttr("d", this.renderData())}${this.renderStroke()}${this.renderFill()}${this.renderDefinitions()}${this.renderTransform()}${this.renderClassName()} ${this.renderRole()}${this.renderAriaLabel()} ${this.renderAriaRoleDescription()}${this.renderAriaChecked()} ></path>`;
  }
};
var path_node_default = PathNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/arc-node.js
var ArcNode = class extends path_node_default {
  renderData() {
    return this.srcElement.toPath().toString(POINT_DIGITS);
  }
};
var arc_node_default = ArcNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/circle-node.js
var CircleNode = class extends path_node_default {
  geometryChange() {
    const center = this.center();
    this.attr("cx", center.x);
    this.attr("cy", center.y);
    this.attr("r", this.radius());
    this.invalidate();
  }
  center() {
    return this.srcElement.geometry().center;
  }
  radius() {
    return this.srcElement.geometry().radius;
  }
  template() {
    return `<circle ${this.renderId()} ${this.renderStyle()} ${this.renderOpacity()}cx='${this.center().x}' cy='${this.center().y}' r='${this.radius()}'${this.renderStroke()} ${this.renderFill()} ${this.renderDefinitions()}${this.renderClassName()} ${this.renderRole()}${this.renderAriaLabel()} ${this.renderAriaRoleDescription()}${this.renderAriaChecked()} ${this.renderTransform()} ></circle>`;
  }
};
var circle_node_default = CircleNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/group-node.js
var GroupNode = class extends node_default {
  template() {
    return `<g${this.renderId() + this.renderTransform() + this.renderClassName() + this.renderStyle() + this.renderOpacity() + this.renderRole() + this.renderAriaLabel() + this.renderAriaRoleDescription() + this.renderAriaChecked() + this.renderDefinitions()}>${this.renderChildren()}</g>`;
  }
  optionsChange(e) {
    const { field, value } = e;
    if (field === "transform") {
      this.transformChange(value);
    }
    this.accessibilityOptionsChange(e);
    super.optionsChange(e);
  }
};
var group_node_default = GroupNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/image-node.js
var ImageNode = class extends path_node_default {
  geometryChange() {
    this.allAttr(this.mapPosition());
    this.invalidate();
  }
  optionsChange(e) {
    if (e.field === "src") {
      this.allAttr(this.mapSource());
    }
    super.optionsChange(e);
  }
  mapPosition() {
    const rect = this.srcElement.rect();
    const tl = rect.topLeft();
    return [
      ["x", tl.x],
      ["y", tl.y],
      ["width", rect.width() + "px"],
      ["height", rect.height() + "px"]
    ];
  }
  renderPosition() {
    return renderAllAttr(this.mapPosition());
  }
  mapSource(encode) {
    let src = this.srcElement.src();
    if (encode) {
      src = htmlEncode(src);
    }
    return [["xlink:href", src]];
  }
  renderSource() {
    return renderAllAttr(this.mapSource(true));
  }
  template() {
    return `<image preserveAspectRatio='none' ${this.renderId()} ${this.renderStyle()} ${this.renderTransform()} ${this.renderOpacity()}${this.renderPosition()} ${this.renderSource()} ${this.renderDefinitions()}${this.renderClassName()} ${this.renderRole()}${this.renderAriaLabel()} ${this.renderAriaRoleDescription()}${this.renderAriaChecked()} ></image>`;
  }
};
var image_node_default = ImageNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/multi-path-node.js
var MultiPathNode = class extends path_node_default {
  renderData() {
    return this.srcElement.toString(POINT_DIGITS) || "undefined";
  }
};
var multi_path_node_default = MultiPathNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/rect-node.js
var RectNode = class extends path_node_default {
  geometryChange() {
    const geometry = this.srcElement.geometry();
    this.attr("x", geometry.origin.x);
    this.attr("y", geometry.origin.y);
    this.attr("width", geometry.size.width);
    this.attr("height", geometry.size.height);
    this.attr("rx", geometry.cornerRadius[0]);
    this.attr("ry", geometry.cornerRadius[1]);
    this.invalidate();
  }
  size() {
    return this.srcElement.geometry().size;
  }
  origin() {
    return this.srcElement.geometry().origin;
  }
  rx() {
    return this.srcElement.geometry().cornerRadius[0];
  }
  ry() {
    return this.srcElement.geometry().cornerRadius[1];
  }
  template() {
    return `<rect ${this.renderId()} ${this.renderStyle()} ${this.renderOpacity()} x='${this.origin().x}' y='${this.origin().y}' rx='${this.rx()}' ry='${this.ry()}' width='${this.size().width}' height='${this.size().height}' ${this.renderStroke()} ${this.renderFill()} ${this.renderDefinitions()} ${this.renderTransform()}${this.renderClassName()} ${this.renderRole()}${this.renderAriaLabel()} ${this.renderAriaRoleDescription()}${this.renderAriaChecked()} />`;
  }
};
var rect_node_default = RectNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/text-node.js
var ENTITY_REGEX = /&(?:[a-zA-Z]+|#\d+);/g;
function decodeEntities(text) {
  if (!text || typeof text !== "string" || !ENTITY_REGEX.test(text)) {
    return text;
  }
  const element = decodeEntities._element;
  ENTITY_REGEX.lastIndex = 0;
  return text.replace(ENTITY_REGEX, (match) => {
    element.innerHTML = match;
    return element.textContent || element.innerText;
  });
}
if (typeof document !== "undefined") {
  decodeEntities._element = document.createElement("span");
}
var TextNode = class extends path_node_default {
  geometryChange() {
    const pos = this.pos();
    this.attr("x", pos.x);
    this.attr("y", pos.y);
    this.invalidate();
  }
  optionsChange(e) {
    if (e.field === "font") {
      this.attr("style", renderStyle(this.mapStyle()));
      this.geometryChange();
    } else if (e.field === "content") {
      super.content(this.srcElement.content());
    }
    super.optionsChange(e);
  }
  mapStyle(encode) {
    const style = super.mapStyle(encode);
    let font = this.srcElement.options.font;
    if (encode) {
      font = htmlEncode(font);
    }
    style.push(["font", font], ["white-space", "pre"]);
    return style;
  }
  pos() {
    const pos = this.srcElement.position();
    const size = this.srcElement.measure();
    return pos.clone().setY(pos.y + size.baseline);
  }
  renderContent() {
    let content = this.srcElement.content();
    content = decodeEntities(content);
    content = htmlEncode(content);
    return normalizeText(content);
  }
  renderTextAnchor() {
    let anchor;
    if ((this.options || {}).rtl && !(support_default.browser.msie || support_default.browser.edge)) {
      anchor = "end";
    }
    return renderAttr("text-anchor", anchor);
  }
  renderPaintOrder() {
    const paintOrder = this.srcElement.options.paintOrder;
    return paintOrder ? renderAttr("paint-order", paintOrder) : "";
  }
  template() {
    return `<text ${this.renderId()} ${this.renderTextAnchor()} ${this.renderStyle()} ${this.renderOpacity()}x='${this.pos().x}' y='${this.pos().y}' ${this.renderStroke()} ${this.renderTransform()} ${this.renderDefinitions()}${this.renderPaintOrder()}${this.renderFill()}${this.renderClassName()} ${this.renderRole()}${this.renderAriaLabel()} ${this.renderAriaRoleDescription()}${this.renderAriaChecked()}>${this.renderContent()}</text>`;
  }
};
var text_node_default = TextNode;

// node_modules/@progress/kendo-drawing/dist/es/svg/surface.js
node_map_default.Arc = arc_node_default;
node_map_default.Circle = circle_node_default;
node_map_default.Group = group_node_default;
node_map_default.Image = image_node_default;
node_map_default.MultiPath = multi_path_node_default;
node_map_default.Path = path_node_default;
node_map_default.Rect = rect_node_default;
node_map_default.Text = text_node_default;
var RTL = "rtl";
function alignToScreen(element) {
  let ctm;
  try {
    ctm = element.getScreenCTM ? element.getScreenCTM() : null;
  } catch (e) {
  }
  if (ctm) {
    const left = -ctm.e % 1;
    const top = -ctm.f % 1;
    const style = element.style;
    if (left !== 0 || top !== 0) {
      style.left = left + "px";
      style.top = top + "px";
    }
  }
}
var Surface2 = class extends surface_default {
  get type() {
    return "svg";
  }
  constructor(element, options2) {
    super(element, options2);
    this._root = new root_node_default(Object.assign({
      rtl: elementStyles2(element, "direction").direction === RTL
    }, this.options));
    render_svg_default(this.element, this._template(""));
    this._rootElement = this.element.firstElementChild;
    this._rootElement.style.width = "100%";
    this._rootElement.style.height = "100%";
    this._rootElement.style.overflow = "hidden";
    alignToScreen(this._rootElement);
    this._root.attachTo(this._rootElement);
    bindEvents(this.element, {
      click: this._click,
      mouseover: this._mouseenter,
      mouseout: this._mouseleave,
      mousemove: this._mousemove
    });
    this.resize();
  }
  destroy() {
    if (this._root) {
      this._root.destroy();
      this._root = null;
      if (this._rootElement && this._rootElement.parentNode) {
        this._rootElement.parentNode.removeChild(this._rootElement);
      }
      this._rootElement = null;
      unbindEvents(this.element, {
        click: this._click,
        mouseover: this._mouseenter,
        mouseout: this._mouseleave,
        mousemove: this._mousemove
      });
    }
    super.destroy();
  }
  translate(offset) {
    const viewBox = `${Math.round(offset.x)} ${Math.round(offset.y)} ${this._size.width} ${this._size.height}`;
    this._offset = offset;
    this._rootElement.setAttribute("viewBox", viewBox);
  }
  draw(element) {
    super.draw(element);
    this._root.load([element]);
  }
  clear() {
    super.clear();
    this._root.clear();
  }
  svg() {
    return "<?xml version='1.0' ?>" + this._template();
  }
  exportVisual() {
    let { _visual: visual, _offset: offset } = this;
    if (offset) {
      const wrap2 = new group_default();
      wrap2.children.push(visual);
      wrap2.transform(
        transform().translate(-offset.x, -offset.y)
      );
      visual = wrap2;
    }
    return visual;
  }
  _resize() {
    if (this._offset) {
      this.translate(this._offset);
    }
  }
  _template(svgStyles) {
    const styles = typeof svgStyles === "string" ? svgStyles : "style='width: 100%; height: 100%; overflow: hidden;' ";
    return `<svg ${styles}xmlns='${SVG_NS}' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'>${this._root.render()}</svg>`;
  }
};
var surface_default2 = Surface2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/node-map.js
var NODE_MAP2 = {};
var node_map_default2 = NODE_MAP2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/node.js
var Node2 = class extends base_node_default {
  constructor(srcElement) {
    super(srcElement);
    if (srcElement) {
      this.initClip();
    }
  }
  initClip() {
    const clip = this.srcElement.clip();
    if (clip) {
      this.clip = clip;
      clip.addObserver(this);
    }
  }
  clear() {
    if (this.srcElement) {
      this.srcElement.removeObserver(this);
    }
    this.clearClip();
    super.clear();
  }
  clearClip() {
    if (this.clip) {
      this.clip.removeObserver(this);
      delete this.clip;
    }
  }
  setClip(ctx) {
    if (this.clip) {
      ctx.beginPath();
      const clipNode = new node_map_default2[this.clip.nodeType](this.clip);
      clipNode.renderPoints(ctx, this.clip);
      ctx.clip("evenodd");
    }
  }
  optionsChange(e) {
    if (e.field === "clip") {
      this.clearClip();
      this.initClip();
    }
    super.optionsChange(e);
  }
  setTransform(ctx) {
    if (this.srcElement) {
      const transform2 = this.srcElement.transform();
      if (transform2) {
        ctx.transform.apply(ctx, transform2.matrix().toArray(6));
      }
    }
  }
  loadElements(elements, pos, cors) {
    for (let i = 0; i < elements.length; i++) {
      let srcElement = elements[i];
      let children = srcElement.children;
      let childNode = new node_map_default2[srcElement.nodeType](srcElement, cors);
      if (children && children.length > 0) {
        childNode.load(children, pos, cors);
      }
      if (pos !== void 0) {
        this.insertAt(childNode, pos);
      } else {
        this.append(childNode);
      }
    }
  }
  load(elements, pos, cors) {
    this.loadElements(elements, pos, cors);
    this.invalidate();
  }
  setOpacity(ctx) {
    if (this.srcElement) {
      const opacity = this.srcElement.opacity();
      if (opacity !== void 0) {
        this.globalAlpha(ctx, opacity);
      }
    }
  }
  globalAlpha(ctx, value) {
    let opactity = value;
    if (opactity && ctx.globalAlpha) {
      opactity *= ctx.globalAlpha;
    }
    ctx.globalAlpha = opactity;
  }
  visible() {
    const src = this.srcElement;
    return !src || src && src.options.visible !== false;
  }
};
var node_default2 = Node2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/group-node.js
var GroupNode2 = class extends traversable_default(node_default2, "childNodes") {
  renderTo(ctx) {
    if (!this.visible()) {
      return;
    }
    ctx.save();
    this.setTransform(ctx);
    this.setClip(ctx);
    this.setOpacity(ctx);
    const childNodes = this.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      let child = childNodes[i];
      if (child.visible()) {
        child.renderTo(ctx);
      }
    }
    ctx.restore();
  }
};
var group_node_default2 = GroupNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/root-node.js
var FRAME_DELAY = 1e3 / 60;
var RootNode2 = class extends traversable_default(group_node_default2, "childNodes") {
  constructor(canvas, size) {
    super();
    this.canvas = canvas;
    this.size = size;
    this.ctx = canvas.getContext("2d");
    const invalidateHandler = this._invalidate.bind(this);
    this.invalidate = throttle(() => {
      animation_frame_default(invalidateHandler);
    }, FRAME_DELAY);
  }
  destroy() {
    super.destroy();
    this.canvas = null;
    this.ctx = null;
  }
  load(elements, pos, cors) {
    this.loadElements(elements, pos, cors);
    this._invalidate();
  }
  _rescale(scale) {
    const { canvas, size } = this;
    canvas.width = size.width * scale;
    canvas.height = size.height * scale;
    this.ctx.scale(scale, scale);
  }
  _devicePixelRatio() {
    if (typeof window.devicePixelRatio === "number") {
      return window.devicePixelRatio;
    }
    return 1;
  }
  _invalidate(options2) {
    if (!this.ctx) {
      return;
    }
    const fixedScale = options2 && options2.fixedScale;
    const scale = fixedScale ? 1 : this._devicePixelRatio();
    this._rescale(scale);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderTo(this.ctx);
  }
};
var root_node_default2 = RootNode2;

// node_modules/@progress/kendo-drawing/dist/es/search/quad-root.js
var QuadRoot = class extends Class {
  constructor() {
    super();
    this.shapes = [];
  }
  _add(shape, bbox) {
    this.shapes.push({
      bbox,
      shape
    });
    shape._quadNode = this;
  }
  pointShapes(point2) {
    const shapes = this.shapes;
    const length = shapes.length;
    const result = [];
    for (let idx = 0; idx < length; idx++) {
      if (shapes[idx].bbox.containsPoint(point2)) {
        result.push(shapes[idx].shape);
      }
    }
    return result;
  }
  insert(shape, bbox) {
    this._add(shape, bbox);
  }
  remove(shape) {
    const shapes = this.shapes;
    const length = shapes.length;
    for (let idx = 0; idx < length; idx++) {
      if (shapes[idx].shape === shape) {
        shapes.splice(idx, 1);
        break;
      }
    }
  }
};
var quad_root_default = QuadRoot;

// node_modules/@progress/kendo-drawing/dist/es/search/quad-node.js
var QuadNode = class _QuadNode extends quad_root_default {
  constructor(rect) {
    super();
    this.children = [];
    this.rect = rect;
  }
  inBounds(rect) {
    const nodeRect = this.rect;
    const nodeBottomRight = nodeRect.bottomRight();
    const bottomRight = rect.bottomRight();
    const inBounds = nodeRect.origin.x <= rect.origin.x && nodeRect.origin.y <= rect.origin.y && bottomRight.x <= nodeBottomRight.x && bottomRight.y <= nodeBottomRight.y;
    return inBounds;
  }
  pointShapes(point2) {
    const children = this.children;
    const length = children.length;
    const result = super.pointShapes(point2);
    for (let idx = 0; idx < length; idx++) {
      append(result, children[idx].pointShapes(point2));
    }
    return result;
  }
  insert(shape, bbox) {
    const children = this.children;
    let inserted = false;
    if (this.inBounds(bbox)) {
      if (this.shapes.length < 4) {
        this._add(shape, bbox);
      } else {
        if (!children.length) {
          this._initChildren();
        }
        for (let idx = 0; idx < children.length; idx++) {
          if (children[idx].insert(shape, bbox)) {
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          this._add(shape, bbox);
        }
      }
      inserted = true;
    }
    return inserted;
  }
  _initChildren() {
    const { rect, children } = this;
    const center = rect.center();
    const halfWidth = rect.width() / 2;
    const halfHeight = rect.height() / 2;
    children.push(
      new _QuadNode(new rect_default([rect.origin.x, rect.origin.y], [halfWidth, halfHeight])),
      new _QuadNode(new rect_default([center.x, rect.origin.y], [halfWidth, halfHeight])),
      new _QuadNode(new rect_default([rect.origin.x, center.y], [halfWidth, halfHeight])),
      new _QuadNode(new rect_default([center.x, center.y], [halfWidth, halfHeight]))
    );
  }
};
var quad_node_default = QuadNode;

// node_modules/@progress/kendo-drawing/dist/es/search/shapes-quad-tree.js
var ROOT_SIZE = 3e3;
var LEVEL_STEP = BigInt(1e4);
var ShapesQuadTree = class extends Class {
  constructor() {
    super();
    this.initRoots();
  }
  initRoots() {
    this.rootMap = {};
    this.root = new quad_root_default();
    this.rootElements = [];
  }
  clear() {
    const rootElements = this.rootElements;
    for (let idx = 0; idx < rootElements.length; idx++) {
      this.remove(rootElements[idx]);
    }
    this.initRoots();
  }
  pointShape(point2) {
    const sectorRoot = (this.rootMap[Math.floor(point2.x / ROOT_SIZE)] || {})[Math.floor(point2.y / ROOT_SIZE)];
    let result = this.root.pointShapes(point2);
    if (sectorRoot) {
      result = result.concat(sectorRoot.pointShapes(point2));
    }
    const maxLevel = maxZindexLevel(result);
    this.assignZindex(result, maxLevel);
    result.sort(zIndexComparer);
    for (let idx = 0; idx < result.length; idx++) {
      if (result[idx].containsPoint(point2)) {
        return result[idx];
      }
    }
  }
  assignZindex(elements, maxLevel) {
    const initialLevelWeight = bigPow(LEVEL_STEP, BigInt(maxLevel));
    const zIndexes = [];
    const start = BigInt(0);
    for (let idx = 0; idx < elements.length; idx++) {
      let element = elements[idx];
      let zIndex = start;
      let levelWeight = initialLevelWeight;
      let parents = [];
      while (element) {
        parents.push(element);
        element = element.parent;
      }
      while (parents.length) {
        element = parents.pop();
        zIndex += BigInt((element.parent ? element.parent.children : this.rootElements).indexOf(element) + 1) * levelWeight;
        levelWeight /= LEVEL_STEP;
      }
      elements[idx]._zIndex = zIndex;
      zIndexes.push(zIndex);
    }
    zIndexes.sort(sortAscComparer);
    for (let idx = 0; idx < elements.length; idx++) {
      elements[idx]._zIndex = zIndexes.indexOf(elements[idx]._zIndex);
    }
  }
  optionsChange(e) {
    if (e.field === "transform" || e.field === "stroke.width") {
      this.bboxChange(e.element);
    }
  }
  geometryChange(e) {
    this.bboxChange(e.element);
  }
  bboxChange(element) {
    if (element.nodeType === "Group") {
      for (let idx = 0; idx < element.children.length; idx++) {
        this.bboxChange(element.children[idx]);
      }
    } else {
      if (element._quadNode) {
        element._quadNode.remove(element);
      }
      this._insertShape(element);
    }
  }
  add(elements) {
    const elementsArray = Array.isArray(elements) ? elements.slice(0) : [elements];
    append(this.rootElements, elementsArray);
    this._insert(elementsArray);
  }
  childrenChange(e) {
    if (e.action === "remove") {
      for (let idx = 0; idx < e.items.length; idx++) {
        this.remove(e.items[idx]);
      }
    } else {
      this._insert(Array.prototype.slice.call(e.items, 0));
    }
  }
  _insert(elements) {
    let element;
    while (elements.length > 0) {
      element = elements.pop();
      element.addObserver(this);
      if (element.nodeType === "Group") {
        append(elements, element.children);
      } else {
        this._insertShape(element);
      }
    }
  }
  _insertShape(shape) {
    const bbox = shape.bbox();
    if (bbox) {
      const sectors = this.getSectors(bbox);
      const x = sectors[0][0];
      const y = sectors[1][0];
      if (this.inRoot(sectors)) {
        this.root.insert(shape, bbox);
      } else {
        const rootMap = this.rootMap;
        if (!rootMap[x]) {
          rootMap[x] = {};
        }
        if (!rootMap[x][y]) {
          rootMap[x][y] = new quad_node_default(
            new rect_default([x * ROOT_SIZE, y * ROOT_SIZE], [ROOT_SIZE, ROOT_SIZE])
          );
        }
        rootMap[x][y].insert(shape, bbox);
      }
    }
  }
  remove(element) {
    element.removeObserver(this);
    if (element.nodeType === "Group") {
      const children = element.children;
      for (let idx = 0; idx < children.length; idx++) {
        this.remove(children[idx]);
      }
    } else if (element._quadNode) {
      element._quadNode.remove(element);
      delete element._quadNode;
    }
  }
  inRoot(sectors) {
    return sectors[0].length > 1 || sectors[1].length > 1;
  }
  getSectors(rect) {
    const bottomRight = rect.bottomRight();
    const bottomX = Math.floor(bottomRight.x / ROOT_SIZE);
    const bottomY = Math.floor(bottomRight.y / ROOT_SIZE);
    const sectors = [[], []];
    for (let x = Math.floor(rect.origin.x / ROOT_SIZE); x <= bottomX; x++) {
      sectors[0].push(x);
    }
    for (let y = Math.floor(rect.origin.y / ROOT_SIZE); y <= bottomY; y++) {
      sectors[1].push(y);
    }
    return sectors;
  }
};
function zIndexComparer(x1, x2) {
  if (x1._zIndex < x2._zIndex) {
    return 1;
  }
  if (x1._zIndex > x2._zIndex) {
    return -1;
  }
  return 0;
}
function sortAscComparer(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
function bigPow(base, exp) {
  let b = base;
  let e = exp;
  const one = BigInt(1);
  let r = one;
  while (e) {
    if (e & one) {
      r *= b;
    }
    e >>= one;
    if (e) {
      b *= b;
    }
  }
  return r;
}
function maxZindexLevel(elements) {
  let maxLevel = 0;
  for (let idx = 0; idx < elements.length; idx++) {
    let element = elements[idx];
    let parents = [];
    while (element) {
      parents.push(element);
      element = element.parent;
    }
    maxLevel = Math.max(maxLevel, parents.length);
  }
  return maxLevel + 1;
}
var shapes_quad_tree_default = ShapesQuadTree;

// node_modules/@progress/kendo-drawing/dist/es/canvas/surface-cursor.js
var SurfaceCursor = class {
  constructor(surface) {
    surface.bind("mouseenter", this._mouseenter.bind(this));
    surface.bind("mouseleave", this._mouseleave.bind(this));
    this.element = surface.element;
  }
  clear() {
    this._resetCursor();
  }
  destroy() {
    this._resetCursor();
    delete this.element;
  }
  _mouseenter(e) {
    const cursor = this._shapeCursor(e);
    if (!cursor) {
      this._resetCursor();
    } else {
      if (!this._current) {
        this._defaultCursor = this._getCursor();
      }
      this._setCursor(cursor);
    }
  }
  _mouseleave() {
    this._resetCursor();
  }
  _shapeCursor(e) {
    let shape = e.element;
    while (shape && shape.options.cursor === void 0) {
      shape = shape.parent;
    }
    if (shape) {
      return shape.options.cursor;
    }
  }
  _getCursor() {
    if (this.element) {
      return this.element.style.cursor;
    }
  }
  _setCursor(cursor) {
    if (this.element) {
      this.element.style.cursor = cursor;
      this._current = cursor;
    }
  }
  _resetCursor() {
    if (this._current) {
      this._setCursor(this._defaultCursor || "");
      delete this._current;
    }
  }
};
var surface_cursor_default = SurfaceCursor;

// node_modules/@progress/kendo-drawing/dist/es/canvas/utils/render-path.js
function renderPath(ctx, path) {
  const segments = path.segments;
  if (segments.length === 0) {
    return;
  }
  let segment = segments[0];
  let anchor = segment.anchor();
  ctx.moveTo(anchor.x, anchor.y);
  for (let i = 1; i < segments.length; i++) {
    segment = segments[i];
    anchor = segment.anchor();
    let prevSeg = segments[i - 1];
    let prevOut = prevSeg.controlOut();
    let controlIn = segment.controlIn();
    if (prevOut && controlIn) {
      ctx.bezierCurveTo(
        prevOut.x,
        prevOut.y,
        controlIn.x,
        controlIn.y,
        anchor.x,
        anchor.y
      );
    } else {
      ctx.lineTo(anchor.x, anchor.y);
    }
  }
  if (path.options.closed) {
    ctx.closePath();
  }
}

// node_modules/@progress/kendo-drawing/dist/es/canvas/path-node.js
function addGradientStops(gradient, stops) {
  for (let idx = 0; idx < stops.length; idx++) {
    let stop = stops[idx];
    let color = parseColor(stop.color());
    color.a *= stop.opacity();
    gradient.addColorStop(stop.offset(), color.toCssRgba());
  }
}
var PathNode2 = class extends node_default2 {
  renderTo(ctx) {
    ctx.save();
    this.setTransform(ctx);
    this.setClip(ctx);
    this.setOpacity(ctx);
    ctx.beginPath();
    this.renderPoints(ctx, this.srcElement);
    this.setLineDash(ctx);
    this.setLineCap(ctx);
    this.setLineJoin(ctx);
    this.setFill(ctx);
    this.setStroke(ctx);
    ctx.restore();
  }
  setFill(ctx) {
    const fill = this.srcElement.options.fill;
    let hasFill = false;
    if (fill) {
      if (fill.nodeType === "Gradient") {
        this.setGradientFill(ctx, fill);
        hasFill = true;
      } else if (fill.nodeType === PATTERN) {
        this.setPatternFill(ctx, fill);
        hasFill = true;
      } else if (!isTransparent(fill.color)) {
        ctx.fillStyle = fill.color;
        ctx.save();
        this.globalAlpha(ctx, fill.opacity);
        ctx.fill();
        ctx.restore();
        hasFill = true;
      }
    }
    return hasFill;
  }
  setGradientFill(ctx, fill) {
    const bbox = this.srcElement.rawBBox();
    let gradient;
    if (fill instanceof linear_gradient_default) {
      let start = fill.start();
      let end = fill.end();
      gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    } else if (fill instanceof radial_gradient_default) {
      let center = fill.center();
      gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, fill.radius());
    }
    addGradientStops(gradient, fill.stops);
    ctx.save();
    if (!fill.userSpace()) {
      ctx.transform(bbox.width(), 0, 0, bbox.height(), bbox.origin.x, bbox.origin.y);
    }
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
  setPatternFill(ctx, pattern) {
    const size = pattern.size();
    const patternCanvas = document.createElement("canvas");
    const patternContext = patternCanvas.getContext("2d");
    patternCanvas.width = size.getWidth();
    patternCanvas.height = size.getHeight();
    this.childNodes.length = 0;
    this.loadElements(pattern.children);
    const childNodes = this.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      let child = childNodes[i];
      child.renderTo(patternContext);
    }
    ctx.save();
    ctx.fillStyle = ctx.createPattern(patternCanvas, "repeat");
    ctx.fill();
    ctx.restore();
  }
  setStroke(ctx) {
    const stroke = this.srcElement.options.stroke;
    if (stroke && !isTransparent(stroke.color) && stroke.width > 0) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = valueOrDefault(stroke.width, 1);
      ctx.lineJoin = valueOrDefault(stroke.lineJoin, ctx.lineJoin);
      ctx.save();
      this.globalAlpha(ctx, stroke.opacity);
      ctx.stroke();
      ctx.restore();
      return true;
    }
  }
  dashType() {
    const stroke = this.srcElement.options.stroke;
    if (stroke && stroke.dashType) {
      return stroke.dashType.toLowerCase();
    }
  }
  setLineDash(ctx) {
    const dashType = this.dashType();
    if (dashType && dashType !== SOLID) {
      const dashArray = DASH_ARRAYS[dashType];
      if (ctx.setLineDash) {
        ctx.setLineDash(dashArray);
      } else {
        ctx.mozDash = dashArray;
        ctx.webkitLineDash = dashArray;
      }
    }
  }
  setLineCap(ctx) {
    const dashType = this.dashType();
    const stroke = this.srcElement.options.stroke;
    if (dashType && dashType !== SOLID) {
      ctx.lineCap = BUTT;
    } else if (stroke && stroke.lineCap) {
      ctx.lineCap = stroke.lineCap;
    }
  }
  setLineJoin(ctx) {
    const stroke = this.srcElement.options.stroke;
    if (stroke && stroke.lineJoin) {
      ctx.lineJoin = stroke.lineJoin;
    }
  }
  renderPoints(ctx, path) {
    renderPath(ctx, path);
  }
};
var path_node_default2 = PathNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/arc-node.js
var ArcNode2 = class extends path_node_default2 {
  renderPoints(ctx) {
    const path = this.srcElement.toPath();
    renderPath(ctx, path);
  }
};
var arc_node_default2 = ArcNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/circle-node.js
var CircleNode2 = class extends path_node_default2 {
  renderPoints(ctx) {
    const { center, radius } = this.srcElement.geometry();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  }
};
var circle_node_default2 = CircleNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/image-node.js
var ImageNode2 = class extends path_node_default2 {
  constructor(srcElement, cors) {
    super(srcElement);
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
    this.loading = createPromise();
    const img = this.img = new Image();
    const src = srcElement.src();
    if (cors && !/^data:/i.test(src)) {
      img.crossOrigin = cors;
    }
    if (src) {
      img.src = src;
    }
    if (img.complete) {
      this.onLoad();
    } else {
      img.onload = this.onLoad;
      img.onerror = this.onError;
    }
  }
  renderTo(ctx) {
    if (this.loading.state() === "resolved") {
      ctx.save();
      this.setTransform(ctx);
      this.setClip(ctx);
      this.drawImage(ctx);
      ctx.restore();
    }
  }
  optionsChange(e) {
    if (e.field === "src") {
      this.loading = createPromise();
      this.img.src = this.srcElement.src();
    } else {
      super.optionsChange(e);
    }
  }
  onLoad() {
    this.loading.resolve();
    this.invalidate();
  }
  onError() {
    this.loading.reject(new Error(
      "Unable to load image '" + this.img.src + "'. Check for connectivity and verify CORS headers."
    ));
  }
  drawImage(ctx) {
    const rect = this.srcElement.rect();
    const topLeft = rect.topLeft();
    ctx.drawImage(
      this.img,
      topLeft.x,
      topLeft.y,
      rect.width(),
      rect.height()
    );
  }
};
var image_node_default2 = ImageNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/multi-path-node.js
var MultiPathNode2 = class extends path_node_default2 {
  renderPoints(ctx) {
    const paths = this.srcElement.paths;
    for (let i = 0; i < paths.length; i++) {
      renderPath(ctx, paths[i]);
    }
  }
};
var multi_path_node_default2 = MultiPathNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/rect-node.js
var RectNode2 = class extends path_node_default2 {
  renderPoints(ctx) {
    const geometry = this.srcElement.geometry();
    const [rx, ry] = geometry.cornerRadius;
    if (rx === 0 && ry === 0) {
      const { origin, size } = geometry;
      ctx.rect(origin.x, origin.y, size.width, size.height);
    } else {
      super.renderPoints(ctx, Path.fromRect(geometry));
    }
  }
};
var rect_node_default2 = RectNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/text-node.js
var TextNode2 = class extends path_node_default2 {
  renderTo(ctx) {
    const text = this.srcElement;
    const pos = text.position();
    const size = text.measure();
    ctx.save();
    this.setTransform(ctx);
    this.setClip(ctx);
    this.setOpacity(ctx);
    ctx.beginPath();
    ctx.font = text.options.font;
    ctx.textAlign = "left";
    if (text.options.paintOrder === "stroke") {
      this.stroke(ctx, text, pos, size);
      this.fill(ctx, text, pos, size);
    } else {
      this.fill(ctx, text, pos, size);
      this.stroke(ctx, text, pos, size);
    }
    ctx.restore();
  }
  stroke(ctx, text, pos, size) {
    if (this.setStroke(ctx)) {
      this.setLineDash(ctx);
      ctx.strokeText(text.content(), pos.x, pos.y + size.baseline);
    }
  }
  fill(ctx, text, pos, size) {
    if (this.setFill(ctx)) {
      ctx.fillText(text.content(), pos.x, pos.y + size.baseline);
    }
  }
};
var text_node_default2 = TextNode2;

// node_modules/@progress/kendo-drawing/dist/es/canvas/surface.js
node_map_default2.Arc = arc_node_default2;
node_map_default2.Circle = circle_node_default2;
node_map_default2.Group = group_node_default2;
node_map_default2.Image = image_node_default2;
node_map_default2.MultiPath = multi_path_node_default2;
node_map_default2.Path = path_node_default2;
node_map_default2.Rect = rect_node_default2;
node_map_default2.Text = text_node_default2;
var Surface3 = class extends surface_default {
  get type() {
    return "canvas";
  }
  constructor(element, options2) {
    super(element, options2);
    prependElement(this.element, this._template(this));
    const canvas = this.element.firstElementChild;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const size = elementSize(element);
    canvas.width = size.width;
    canvas.height = size.height;
    this._rootElement = canvas;
    this._root = new root_node_default2(canvas, size);
    this._mouseTrackHandler = this._trackMouse.bind(this);
    bindEvents(this.element, {
      click: this._mouseTrackHandler,
      mousemove: this._mouseTrackHandler
    });
  }
  destroy() {
    super.destroy();
    if (this._root) {
      this._root.destroy();
      this._root = null;
    }
    if (this._searchTree) {
      this._searchTree.clear();
      delete this._searchTree;
    }
    if (this._cursor) {
      this._cursor.destroy();
      delete this._cursor;
    }
    unbindEvents(this.element, {
      click: this._mouseTrackHandler,
      mousemove: this._mouseTrackHandler
    });
    if (this._rootElement && this._rootElement.parentNode) {
      this._rootElement.parentNode.removeChild(this._rootElement);
    }
    this._rootElement = null;
  }
  draw(element) {
    super.draw(element);
    this._root.load([element], void 0, this.options.cors);
    if (this._searchTree) {
      this._searchTree.add([element]);
    }
  }
  clear() {
    super.clear();
    this._root.clear();
    if (this._searchTree) {
      this._searchTree.clear();
    }
    if (this._cursor) {
      this._cursor.clear();
    }
  }
  eventTarget(e) {
    if (this._searchTree) {
      const point2 = this._surfacePoint(e);
      const shape = this._searchTree.pointShape(point2);
      return shape;
    }
  }
  image() {
    const { _root: root, _rootElement: rootElement } = this;
    const loadingStates = [];
    root.traverse((childNode) => {
      if (childNode.loading) {
        loadingStates.push(childNode.loading);
      }
    });
    const promise = createPromise();
    const resolveDataURL = () => {
      root._invalidate({ fixedScale: true });
      try {
        const data = rootElement.toDataURL();
        promise.resolve(data);
      } catch (e) {
        promise.reject(e);
      }
    };
    promiseAll(loadingStates).then(resolveDataURL, resolveDataURL);
    return promise;
  }
  suspendTracking() {
    super.suspendTracking();
    if (this._searchTree) {
      this._searchTree.clear();
      delete this._searchTree;
    }
  }
  resumeTracking() {
    super.resumeTracking();
    if (!this._searchTree) {
      this._searchTree = new shapes_quad_tree_default();
      const childNodes = this._root.childNodes;
      const rootElements = [];
      for (let idx = 0; idx < childNodes.length; idx++) {
        rootElements.push(childNodes[idx].srcElement);
      }
      this._searchTree.add(rootElements);
    }
  }
  _resize() {
    this._rootElement.width = this._size.width;
    this._rootElement.height = this._size.height;
    this._root.size = this._size;
    this._root.invalidate();
  }
  _template() {
    return "<canvas></canvas>";
  }
  _enableTracking() {
    this._searchTree = new shapes_quad_tree_default();
    this._cursor = new surface_cursor_default(this);
    super._enableTracking();
  }
  _trackMouse(e) {
    if (this._suspendedTracking) {
      return;
    }
    const shape = this.eventTarget(e);
    if (e.type !== "click") {
      const currentShape = this._currentShape;
      if (currentShape && currentShape !== shape) {
        this.trigger("mouseleave", {
          element: currentShape,
          originalEvent: e,
          type: "mouseleave"
        });
      }
      if (shape && currentShape !== shape) {
        this.trigger("mouseenter", {
          element: shape,
          originalEvent: e,
          type: "mouseenter"
        });
      }
      this.trigger("mousemove", {
        element: shape,
        originalEvent: e,
        type: "mousemove"
      });
      this._currentShape = shape;
    } else if (shape) {
      this.trigger("click", {
        element: shape,
        originalEvent: e,
        type: "click"
      });
    }
  }
};
var surface_default3 = Surface3;

// node_modules/@progress/kendo-drawing/dist/es/surface-factory.js
var instance3;
var support2;
var hasDocument = () => typeof document !== "undefined";
var supportsCanvas = () => hasDocument() && document.createElement("canvas").getContext;
var supportsSVG = () => hasDocument() && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
var SurfaceFactory = class _SurfaceFactory extends Class {
  static get support() {
    if (!support2) {
      support2 = {
        canvas: supportsCanvas(),
        svg: supportsSVG()
      };
    }
    return support2;
  }
  static get current() {
    if (!instance3) {
      instance3 = new _SurfaceFactory();
    }
    return instance3;
  }
  constructor() {
    super();
    this._items = [{
      name: "svg",
      type: surface_default2
    }, {
      name: "canvas",
      type: surface_default3
    }];
  }
  create(element, options2) {
    const items = this._items;
    let match = items[0];
    if (options2 && options2.type) {
      const preferred = options2.type.toLowerCase();
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === preferred) {
          match = items[i];
          break;
        }
      }
    }
    if (match) {
      return new match.type(element, options2);
    }
    logToConsole(
      `Warning: Unable to create Kendo UI Drawing Surface. Possible causes:
- The browser does not support SVG and Canvas. User agent: ${navigator.userAgent}`
    );
  }
};
var surface_factory_default = SurfaceFactory;

// node_modules/@progress/kendo-drawing/dist/es/surface.js
var Surface4 = class extends surface_default {
  static get support() {
    return surface_factory_default.support;
  }
  static create(element, options2) {
    return surface_factory_default.current.create(element, options2);
  }
};
var surface_default4 = Surface4;

// node_modules/@progress/kendo-drawing/dist/es/svg.js
var svg_exports = {};
__export(svg_exports, {
  ArcNode: () => arc_node_default,
  CircleNode: () => circle_node_default,
  ClipNode: () => clip_node_default,
  DefinitionNode: () => definition_node_default,
  GradientStopNode: () => gradient_stop_node_default,
  GroupNode: () => group_node_default,
  ImageNode: () => image_node_default,
  LinearGradientNode: () => linear_gradient_node_default,
  MultiPathNode: () => multi_path_node_default,
  Node: () => node_default,
  PathNode: () => path_node_default,
  RadialGradientNode: () => radial_gradient_node_default,
  RectNode: () => rect_node_default,
  RootNode: () => root_node_default,
  Surface: () => surface_default2,
  TextNode: () => text_node_default,
  exportGroup: () => exportGroup
});

// node_modules/@progress/kendo-drawing/dist/es/svg/export-group.js
function exportGroup(group) {
  const root = new root_node_default({
    skipBaseHref: true
  });
  const bbox = group.clippedBBox();
  let rootGroup = group;
  if (bbox) {
    const origin = bbox.getOrigin();
    const exportRoot = new group_default();
    exportRoot.transform(transform().translate(-origin.x, -origin.y));
    exportRoot.children.push(group);
    rootGroup = exportRoot;
  }
  root.load([rootGroup]);
  const svg = `<?xml version='1.0' ?><svg xmlns='${SVG_NS}' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'>${root.render()}</svg>`;
  root.destroy();
  return svg;
}

// node_modules/@progress/kendo-drawing/dist/es/canvas.js
var canvas_exports = {};
__export(canvas_exports, {
  ArcNode: () => arc_node_default2,
  CircleNode: () => circle_node_default2,
  GroupNode: () => group_node_default2,
  ImageNode: () => image_node_default2,
  MultiPathNode: () => multi_path_node_default2,
  Node: () => node_default2,
  PathNode: () => path_node_default2,
  RectNode: () => rect_node_default2,
  RootNode: () => root_node_default2,
  Surface: () => surface_default3,
  TextNode: () => text_node_default2
});

// node_modules/@progress/kendo-drawing/dist/es/canvas/export-image.js
function exportImage(group, options2) {
  const defaults = {
    width: "800px",
    height: "600px",
    cors: "Anonymous"
  };
  let exportRoot = group;
  const bbox = group.clippedBBox();
  if (bbox) {
    const origin = bbox.getOrigin();
    exportRoot = new group_default();
    exportRoot.transform(transform().translate(-origin.x, -origin.y));
    exportRoot.children.push(group);
    const size = bbox.getSize();
    defaults.width = size.width + "px";
    defaults.height = size.height + "px";
  }
  const surfaceOptions = Object.assign(defaults, options2);
  const container = document.createElement("div");
  const style = container.style;
  style.display = "none";
  style.width = surfaceOptions.width;
  style.height = surfaceOptions.height;
  document.body.appendChild(container);
  const surface = new surface_default3(container, surfaceOptions);
  surface.suspendTracking();
  surface.draw(exportRoot);
  const promise = surface.image();
  const destroy = () => {
    surface.destroy();
    document.body.removeChild(container);
  };
  promise.then(destroy, destroy);
  return promise;
}

// node_modules/@progress/kendo-drawing/dist/es/svg/export-svg.js
function exportSVG(group, options2) {
  let svg = exportGroup(group);
  if (!options2 || !options2.raw) {
    svg = "data:image/svg+xml;base64," + encodeBase64(svg);
  }
  return createPromise().resolve(svg);
}

// node_modules/@progress/kendo-drawing/dist/es/pdf/drawing.js
var DEFAULT_IMAGE_DPI = 300;
var TEXT_RENDERING_MODE2 = TEXT_RENDERING_MODE;
var DASH_PATTERNS = {
  dash: [4],
  dashDot: [4, 2, 1, 2],
  dot: [1, 2],
  longDash: [8, 2],
  longDashDot: [8, 2, 1, 2],
  longDashDotDot: [8, 2, 1, 2, 1, 2],
  solid: []
};
var LINE_CAP = {
  butt: 0,
  round: 1,
  square: 2
};
var LINE_JOIN = {
  miter: 0,
  round: 1,
  bevel: 2
};
function render(group, callback) {
  var fonts = [], images = {}, options2 = group.options;
  function getOption(name, defval, hash) {
    if (!hash) {
      hash = options2;
    }
    if (hash.pdf && hash.pdf[name] != null) {
      return hash.pdf[name];
    }
    return defval;
  }
  var multiPage = getOption("multiPage");
  var imgDPI = getOption("imgDPI", DEFAULT_IMAGE_DPI);
  clearImageCache();
  const handlers = {
    Image: function(element) {
      var url = element.src();
      var size = element.bbox().size;
      if (imgDPI) {
        var prev = images[url];
        size = {
          width: Math.ceil(size.width * imgDPI / 72),
          height: Math.ceil(size.height * imgDPI / 72)
        };
        if (prev) {
          size.width = Math.max(prev.width, size.width);
          size.height = Math.max(prev.height, size.height);
        }
      }
      images[url] = size;
    },
    Text: function(element) {
      var style = parseFontDef(element.options.font);
      var url = getFontURL(style);
      if (fonts.indexOf(url) < 0) {
        fonts.push(url);
      }
    }
  };
  group.traverse(function(element) {
    dispatch(handlers, element);
    const fill = element.fill && element.fill();
    if (fill instanceof Pattern) {
      fill.traverse(function(child) {
        dispatch(handlers, child);
      });
    }
  });
  function doIt() {
    if (--count > 0) {
      return;
    }
    var pdf = new PDFDocument({
      producer: getOption("producer"),
      title: getOption("title"),
      author: getOption("author"),
      subject: getOption("subject"),
      keywords: getOption("keywords"),
      creator: getOption("creator"),
      date: getOption("date"),
      autoPrint: getOption("autoPrint")
    });
    function drawPage(group2) {
      var options3 = group2.options;
      var tmp = optimize(group2);
      var bbox = tmp.bbox;
      group2 = tmp.root;
      var paperSize = getOption("paperSize", getOption("paperSize", "auto"), options3), addMargin = false;
      if (paperSize == "auto") {
        if (bbox) {
          var size = bbox.getSize();
          paperSize = [size.width, size.height];
          addMargin = true;
          var origin = bbox.getOrigin();
          tmp = new group_default();
          tmp.transform(new matrix_default(1, 0, 0, 1, -origin.x, -origin.y));
          tmp.append(group2);
          group2 = tmp;
        } else {
          paperSize = "A4";
        }
      }
      var page;
      page = pdf.addPage({
        paperSize,
        margin: getOption("margin", getOption("margin"), options3),
        addMargin,
        landscape: getOption("landscape", getOption("landscape", false), options3)
      });
      drawElement(group2, page, pdf);
    }
    if (multiPage) {
      group.children.forEach(drawPage);
    } else {
      drawPage(group);
    }
    callback(pdf.render(), pdf);
  }
  var count = 2;
  loadFonts(fonts, doIt);
  loadImages(images, doIt, {
    jpegQuality: getOption("jpegQuality", 0.92),
    keepPNG: getOption("keepPNG", false)
  });
}
function toDataURL(group, callback) {
  render(group, function(data) {
    callback("data:application/pdf;base64," + data.base64());
  });
}
function dispatch(handlers, element) {
  var handler = handlers[element.nodeType];
  if (handler) {
    return handler.call.apply(handler, arguments);
  }
  return element;
}
function drawElement(element, page, pdf) {
  if (element.options._pdfDebug) {
    page.comment("BEGIN: " + element.options._pdfDebug);
  }
  var transform2 = element.transform();
  var opacity = element.opacity();
  page.save();
  if (opacity != null && opacity < 1) {
    page.setOpacity(opacity);
  }
  setStrokeOptions(element, page, pdf);
  setFillOptions(element, page, pdf);
  if (transform2) {
    var m = transform2.matrix();
    page.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  }
  setClipping(element, page, pdf);
  dispatch({
    Path: drawPath,
    MultiPath: drawMultiPath,
    Circle: drawCircle,
    Arc: drawArc,
    Text: drawText,
    Image: drawImage,
    Group: drawGroup,
    Rect: drawRect
  }, element, page, pdf);
  page.restore();
  if (element.options._pdfDebug) {
    page.comment("END: " + element.options._pdfDebug);
  }
}
function setStrokeOptions(element, page) {
  var stroke = element.stroke && element.stroke();
  if (!stroke) {
    return;
  }
  var color = stroke.color;
  if (color) {
    color = parseColor2(color);
    if (color == null) {
      return;
    }
    page.setStrokeColor(color.r, color.g, color.b);
    if (color.a != 1) {
      page.setStrokeOpacity(color.a);
    }
  }
  var width = stroke.width;
  if (width != null) {
    if (width === 0) {
      return;
    }
    page.setLineWidth(width);
  }
  var dashType = stroke.dashType;
  if (dashType) {
    page.setDashPattern(DASH_PATTERNS[dashType], 0);
  }
  var lineCap = stroke.lineCap;
  if (lineCap) {
    page.setLineCap(LINE_CAP[lineCap]);
  }
  var lineJoin = stroke.lineJoin;
  if (lineJoin) {
    page.setLineJoin(LINE_JOIN[lineJoin]);
  }
  var opacity = stroke.opacity;
  if (opacity != null) {
    page.setStrokeOpacity(opacity);
  }
}
function setFillOptions(element, page) {
  var fill = element.fill && element.fill();
  if (!fill) {
    return;
  }
  if (fill instanceof gradient_default || fill instanceof Pattern) {
    return;
  }
  var color = fill.color;
  if (color) {
    color = parseColor2(color);
    if (color == null) {
      return;
    }
    page.setFillColor(color.r, color.g, color.b);
    if (color.a != 1) {
      page.setFillOpacity(color.a);
    }
  }
  var opacity = fill.opacity;
  if (opacity != null) {
    page.setFillOpacity(opacity);
  }
}
function setClipping(element, page, pdf) {
  var clip = element.clip();
  if (clip) {
    _drawPath(clip, page, pdf);
    page.clip();
  }
}
function shouldDraw(thing) {
  return thing && (thing instanceof gradient_default || thing instanceof Pattern || thing.color && !/^(none|transparent)$/i.test(thing.color) && (thing.width == null || thing.width > 0) && (thing.opacity == null || thing.opacity > 0));
}
function maybeGradient(element, page, pdf, stroke) {
  var fill = element.fill();
  if (fill instanceof gradient_default) {
    if (stroke) {
      page.clipStroke();
    } else {
      page.clip();
    }
    var isRadial = fill instanceof radial_gradient_default;
    var start, end;
    if (isRadial) {
      start = { x: fill.center().x, y: fill.center().y, r: 0 };
      end = { x: fill.center().x, y: fill.center().y, r: fill.radius() };
    } else {
      start = { x: fill.start().x, y: fill.start().y };
      end = { x: fill.end().x, y: fill.end().y };
    }
    var stops = fill.stops.elements().map(function(stop) {
      var offset = stop.offset();
      if (/%$/.test(offset)) {
        offset = parseFloat(offset) / 100;
      } else {
        offset = parseFloat(offset);
      }
      var color = parseColor2(stop.color());
      color.a *= stop.opacity();
      return {
        offset,
        color
      };
    });
    stops.unshift(stops[0]);
    stops.push(stops[stops.length - 1]);
    var gradient = {
      userSpace: fill.userSpace(),
      type: isRadial ? "radial" : "linear",
      start,
      end,
      stops
    };
    var box = element.rawBBox();
    var tl = box.topLeft(), size = box.getSize();
    box = {
      left: tl.x,
      top: tl.y,
      width: size.width,
      height: size.height
    };
    page.gradient(gradient, box);
    return true;
  }
}
function maybePattern(element, page, pdf, stroke) {
  const fill = element.fill();
  if (fill instanceof Pattern) {
    if (stroke) {
      page.clipStroke();
    } else {
      page.clip();
    }
    const box = element.rawBBox();
    const tl = box.topLeft(), size = box.getSize();
    const strokeWidth = element.stroke() ? element.stroke().width : 0;
    page.pattern(fill, {
      left: tl.x + strokeWidth / 2,
      top: tl.y + strokeWidth / 2,
      width: size.width - strokeWidth,
      height: size.height - strokeWidth
    }, drawPattern);
    return true;
  }
}
function maybeFillStroke(element, page, pdf) {
  if (shouldDraw(element.fill()) && shouldDraw(element.stroke())) {
    if (!maybeGradient(element, page, pdf, true) && !maybePattern(element, page, pdf, true)) {
      page.fillStroke();
    }
  } else if (shouldDraw(element.fill())) {
    if (!maybeGradient(element, page, pdf, false) && !maybePattern(element, page, pdf, false)) {
      page.fill();
    }
  } else if (shouldDraw(element.stroke())) {
    page.stroke();
  } else {
    page.nop();
  }
}
function maybeDrawRect(path, page) {
  var segments = path.segments;
  if (segments.length == 4 && path.options.closed) {
    var a = [];
    for (var i = 0; i < segments.length; ++i) {
      if (segments[i].controlIn()) {
        return false;
      }
      a[i] = segments[i].anchor();
    }
    var isRect = a[0].y == a[1].y && a[1].x == a[2].x && a[2].y == a[3].y && a[3].x == a[0].x || a[0].x == a[1].x && a[1].y == a[2].y && a[2].x == a[3].x && a[3].y == a[0].y;
    if (isRect) {
      page.rect(
        a[0].x,
        a[0].y,
        a[2].x - a[0].x,
        a[2].y - a[0].y
        /*height*/
      );
      return true;
    }
  }
}
function _drawPath(element, page, pdf) {
  var segments = element.segments;
  if (segments.length === 0) {
    return;
  }
  if (!maybeDrawRect(element, page, pdf)) {
    for (var prev, i = 0; i < segments.length; ++i) {
      var seg = segments[i];
      var anchor = seg.anchor();
      if (!prev) {
        page.moveTo(anchor.x, anchor.y);
      } else {
        var prevOut = prev.controlOut();
        var controlIn = seg.controlIn();
        if (prevOut && controlIn) {
          page.bezier(
            prevOut.x,
            prevOut.y,
            controlIn.x,
            controlIn.y,
            anchor.x,
            anchor.y
          );
        } else {
          page.lineTo(anchor.x, anchor.y);
        }
      }
      prev = seg;
    }
    if (element.options.closed) {
      page.close();
    }
  }
}
function drawPath(element, page, pdf) {
  _drawPath(element, page, pdf);
  maybeFillStroke(element, page, pdf);
}
function drawMultiPath(element, page, pdf) {
  var paths = element.paths;
  for (var i = 0; i < paths.length; ++i) {
    _drawPath(paths[i], page, pdf);
  }
  maybeFillStroke(element, page, pdf);
}
function drawCircle(element, page, pdf) {
  var g = element.geometry();
  page.circle(g.center.x, g.center.y, g.radius);
  maybeFillStroke(element, page, pdf);
}
function drawArc(element, page, pdf) {
  var points3 = element.geometry().curvePoints();
  page.moveTo(points3[0].x, points3[0].y);
  for (var i = 1; i < points3.length; ) {
    page.bezier(
      points3[i].x,
      points3[i++].y,
      points3[i].x,
      points3[i++].y,
      points3[i].x,
      points3[i++].y
    );
  }
  maybeFillStroke(element, page, pdf);
}
function drawText(element, page) {
  var style = parseFontDef(element.options.font);
  var pos = element._position;
  var mode;
  page.transform(1, 0, 0, -1, pos.x, pos.y + style.fontSize);
  const draw = (renderMode) => {
    page.beginText();
    page.setFont(getFontURL(style), style.fontSize);
    page.setTextRenderingMode(renderMode);
    page.showText(element.content(), element._pdfRect ? element._pdfRect.width() : null);
  };
  if (element.fill() && element.stroke()) {
    mode = TEXT_RENDERING_MODE2.fillAndStroke;
    if (element.options.paintOrder === "stroke") {
      draw(TEXT_RENDERING_MODE2.stroke);
      mode = TEXT_RENDERING_MODE2.fill;
    }
  } else if (element.fill()) {
    mode = TEXT_RENDERING_MODE2.fill;
  } else if (element.stroke()) {
    mode = TEXT_RENDERING_MODE2.stroke;
  }
  draw(mode);
  page.endText();
}
function drawPattern(pattern, page, pdf) {
  var children = pattern.children;
  for (var i = 0; i < children.length; ++i) {
    drawElement(children[i], page, pdf);
  }
}
function drawGroup(element, page, pdf) {
  if (element._pdfLink) {
    page.addLink(element._pdfLink.url, element._pdfLink);
  }
  var children = element.children;
  for (var i = 0; i < children.length; ++i) {
    drawElement(children[i], page, pdf);
  }
}
function drawImage(element, page) {
  var url = element.src();
  if (!url) {
    return;
  }
  var rect = element.rect();
  var tl = rect.getOrigin();
  var sz = rect.getSize();
  page.transform(sz.width, 0, 0, -sz.height, tl.x, tl.y + sz.height);
  page.drawImage(url);
}
function drawRect(element, page, pdf) {
  var geometry = element.geometry();
  const [rx, ry] = geometry.cornerRadius;
  if (rx === 0 && ry === 0) {
    page.rect(geometry.origin.x, geometry.origin.y, geometry.size.width, geometry.size.height);
    maybeFillStroke(element, page, pdf);
  } else {
    drawPath(Path.fromRect(geometry, element.options), page, pdf);
  }
}
function parseColor2(value) {
  var color = parseColor(value, true);
  return color ? color.toRGB() : null;
}
function optimize(root) {
  var clipbox = false;
  var matrix = matrix_default.unit();
  var currentBox = null;
  var changed;
  do {
    changed = false;
    root = opt(root);
  } while (root && changed);
  return { root, bbox: currentBox };
  function change(newShape) {
    changed = true;
    return newShape;
  }
  function visible(shape) {
    return shape.visible() && shape.opacity() > 0 && (shouldDraw(shape.fill()) || shouldDraw(shape.stroke()));
  }
  function optArray(a) {
    var b = [];
    for (var i = 0; i < a.length; ++i) {
      var el = opt(a[i]);
      if (el != null) {
        b.push(el);
      }
    }
    return b;
  }
  function withClipping(shape, f) {
    var saveclipbox = clipbox;
    var savematrix = matrix;
    if (shape.transform()) {
      matrix = matrix.multiplyCopy(shape.transform().matrix());
    }
    var clip = shape.clip();
    if (clip && typeof clip.bbox === "function") {
      clip = clip.bbox();
      if (clip) {
        clip = clip.bbox(matrix);
        clipbox = clipbox ? rect_default.intersect(clipbox, clip) : clip;
      }
    }
    try {
      return f();
    } finally {
      clipbox = saveclipbox;
      matrix = savematrix;
    }
  }
  function inClipbox(shape) {
    if (clipbox == null) {
      return false;
    }
    let box = shape.rawBBox();
    if (box) {
      box = box.bbox(matrix);
    }
    if (clipbox && box) {
      box = rect_default.intersect(box, clipbox);
    }
    return box;
  }
  function opt(shape) {
    return withClipping(shape, function() {
      if (!(shape instanceof group_default || shape instanceof MultiPath)) {
        var box = inClipbox(shape);
        if (!box) {
          return change(null);
        }
        currentBox = currentBox ? rect_default.union(currentBox, box) : box;
      }
      return dispatch({
        Path: function(shape2) {
          if (shape2.segments.length === 0 || !visible(shape2)) {
            return change(null);
          }
          return shape2;
        },
        MultiPath: function(shape2) {
          if (!visible(shape2)) {
            return change(null);
          }
          var el = new MultiPath(shape2.options);
          el.paths = optArray(shape2.paths);
          if (el.paths.length === 0) {
            return change(null);
          }
          return el;
        },
        Circle: function(shape2) {
          if (!visible(shape2)) {
            return change(null);
          }
          return shape2;
        },
        Arc: function(shape2) {
          if (!visible(shape2)) {
            return change(null);
          }
          return shape2;
        },
        Text: function(shape2) {
          if (!/\S/.test(shape2.content()) || !visible(shape2)) {
            return change(null);
          }
          return shape2;
        },
        Image: function(shape2) {
          if (!(shape2.visible() && shape2.opacity() > 0)) {
            return change(null);
          }
          return shape2;
        },
        Group: function(shape2) {
          if (!(shape2.visible() && shape2.opacity() > 0)) {
            return change(null);
          }
          var el = new group_default(shape2.options);
          el.children = optArray(shape2.children);
          el._pdfLink = shape2._pdfLink;
          if (shape2 !== root && el.children.length === 0 && !shape2._pdfLink) {
            return change(null);
          }
          return el;
        },
        Rect: function(shape2) {
          if (!visible(shape2)) {
            return change(null);
          }
          return shape2;
        }
      }, shape);
    });
  }
}
function exportPDF(group, options2) {
  var promise = createPromise();
  for (var i in options2) {
    if (i == "margin" && group.options.pdf && group.options.pdf._ignoreMargin) {
      continue;
    }
    group.options.set("pdf." + i, options2[i]);
  }
  toDataURL(group, promise.resolve);
  return promise;
}

// node_modules/@progress/kendo-drawing/dist/es/html/core.js
var browser4 = support_default.browser || {};
function slice2(thing) {
  return Array.prototype.slice.call(thing);
}
var KENDO_PSEUDO_ELEMENT = "KENDO-PSEUDO-ELEMENT";
var KENDO_BULLET_TYPE = "data-kendo-bullet-type";
var IMAGE_CACHE2 = {};
var nodeInfo = {};
nodeInfo._root = nodeInfo;
var inBrowser = typeof window !== "undefined";
var microsoft = inBrowser ? browser4.msie || browser4.edge : false;
var TextRect = class extends text_default {
  constructor(str, rect, options2) {
    super(str, rect.getOrigin(), options2);
    this._pdfRect = rect;
  }
  rect() {
    return this._pdfRect;
  }
  rawBBox() {
    return this._pdfRect;
  }
};
function addClass(el, cls) {
  if (el.classList) {
    el.classList.add(cls);
  } else {
    el.className += " " + cls;
  }
}
function removeClass(el, cls) {
  if (el.classList) {
    el.classList.remove(cls);
  } else {
    el.className = el.className.split(/\s+/).reduce(function(a, word) {
      if (word != cls) {
        a.push(word);
      }
      return a;
    }, []).join(" ");
  }
}
function setCSS(el, styles) {
  Object.keys(styles).forEach(function(key) {
    el.style[key] = styles[key];
  });
}
var matches = typeof Element !== "undefined" && Element.prototype && (function(p) {
  if (p.matches) {
    return function(el, selector) {
      return el.matches(selector);
    };
  }
  if (p.webkitMatchesSelector) {
    return function(el, selector) {
      return el.webkitMatchesSelector(selector);
    };
  }
  if (p.mozMatchesSelector) {
    return function(el, selector) {
      return el.mozMatchesSelector(selector);
    };
  }
  if (p.msMatchesSelector) {
    return function(el, selector) {
      return el.msMatchesSelector(selector);
    };
  }
  return function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
})(Element.prototype);
function closest(el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }
  while (el && !/^\[object (?:HTML)?Document\]$/.test(String(el))) {
    if (el.nodeType == 1 && matches(el, selector)) {
      return el;
    }
    el = el.parentNode;
  }
}
var cloneNodes = (function($) {
  if ($) {
    return function cloneNodes2(el) {
      var clone = el.cloneNode(false);
      if (el.nodeType == 1) {
        var $el = $(el), $clone = $(clone), i;
        var data = $el.data();
        for (i in data) {
          $clone.data(i, data[i]);
        }
        if (/^canvas$/i.test(el.tagName)) {
          clone.getContext("2d").drawImage(el, 0, 0);
        } else if (/^(?:input|select|textarea|option)$/i.test(el.tagName)) {
          clone.removeAttribute("id");
          clone.removeAttribute("name");
          if (!/^textarea$/i.test(el.tagName)) {
            clone.value = el.value;
          }
          clone.checked = el.checked;
          clone.selected = el.selected;
        } else if (/^img$/i.test(el.tagName)) {
          clone.removeAttribute("loading");
        }
        if (el._kendoExportVisual) {
          clone._kendoExportVisual = el._kendoExportVisual;
        }
        for (i = el.firstChild; i; i = i.nextSibling) {
          clone.appendChild(cloneNodes2(i));
        }
      }
      return clone;
    };
  } else {
    return function cloneNodes2(el) {
      const clone = (function dive(node) {
        const clone2 = node.cloneNode(false);
        if (node._kendoExportVisual) {
          clone2._kendoExportVisual = node._kendoExportVisual;
        }
        for (let i = node.firstChild; i; i = i.nextSibling) {
          clone2.appendChild(dive(i));
        }
        return clone2;
      })(el);
      const canvases = el.querySelectorAll("canvas");
      if (canvases.length) {
        slice2(clone.querySelectorAll("canvas")).forEach((canvas, i) => {
          canvas.getContext("2d").drawImage(canvases[i], 0, 0);
        });
      }
      const orig = el.querySelectorAll("input, select, textarea, option");
      slice2(clone.querySelectorAll("input, select, textarea, option")).forEach((el2, i) => {
        el2.removeAttribute("id");
        el2.removeAttribute("name");
        if (!/^textarea$/i.test(el2.tagName)) {
          el2.value = orig[i].value;
        }
        el2.checked = orig[i].checked;
        el2.selected = orig[i].selected;
      });
      slice2(clone.querySelectorAll("img")).forEach((img) => {
        img.removeAttribute("loading");
      });
      return clone;
    };
  }
})(typeof window !== "undefined" && window.kendo && window.kendo.jQuery);
function getXY(thing) {
  if (typeof thing == "number") {
    return { x: thing, y: thing };
  }
  if (Array.isArray(thing)) {
    return { x: thing[0], y: thing[1] };
  }
  return { x: thing.x, y: thing.y };
}
function drawDOM(element, options2) {
  if (!options2) {
    options2 = {};
  }
  var promise = createPromise();
  if (!element) {
    return promise.reject("No element to export");
  }
  if (typeof window.getComputedStyle != "function") {
    throw new Error("window.getComputedStyle is missing.  You are using an unsupported browser, or running in IE8 compatibility mode.  Drawing HTML is supported in Chrome, Firefox, Safari and IE9+.");
  }
  defineFont(getFontFaces(element.ownerDocument));
  var scale = getXY(options2.scale || 1);
  function doOne(element2) {
    var group = new group_default();
    var pos = element2.getBoundingClientRect();
    setTransform(group, [
      scale.x,
      0,
      0,
      scale.y,
      -pos.left * scale.x,
      -pos.top * scale.y
    ]);
    nodeInfo._clipbox = false;
    nodeInfo._matrix = matrix_default.unit();
    nodeInfo._stackingContext = {
      element: element2,
      group
    };
    if (options2.avoidLinks === true) {
      nodeInfo._avoidLinks = "a";
    } else {
      nodeInfo._avoidLinks = options2.avoidLinks;
    }
    addClass(element2, "k-pdf-export");
    renderElement(element2, group);
    removeClass(element2, "k-pdf-export");
    return group;
  }
  cacheImages([element], function() {
    var forceBreak = options2 && options2.forcePageBreak;
    var hasPaperSize = options2 && options2.paperSize && options2.paperSize != "auto";
    var paperOptions = getPaperOptions(function(key, def) {
      if (key == "paperSize") {
        return hasPaperSize ? options2[key] : "A4";
      }
      return key in options2 ? options2[key] : def;
    });
    var pageWidth = hasPaperSize && paperOptions.paperSize[0];
    var pageHeight = hasPaperSize && paperOptions.paperSize[1];
    var margin = options2.margin && paperOptions.margin;
    var hasMargin = Boolean(margin);
    if (forceBreak || pageHeight) {
      if (!margin) {
        margin = { left: 0, top: 0, right: 0, bottom: 0 };
      }
      if (pageWidth) {
        pageWidth /= scale.x;
      }
      if (pageHeight) {
        pageHeight /= scale.y;
      }
      margin.left /= scale.x;
      margin.right /= scale.x;
      margin.top /= scale.y;
      margin.bottom /= scale.y;
      var group = new group_default({
        pdf: {
          multiPage: true,
          paperSize: hasPaperSize ? paperOptions.paperSize : "auto",
          _ignoreMargin: hasMargin
          // HACK!  see exportPDF in pdf/drawing.js
        }
      });
      handlePageBreaks(
        function(x) {
          if (options2.progress) {
            var canceled = false, pageNum = 0;
            (function next() {
              if (pageNum < x.pages.length) {
                var page = doOne(x.pages[pageNum]);
                group.append(page);
                options2.progress({
                  page,
                  pageNum: ++pageNum,
                  totalPages: x.pages.length,
                  cancel: function() {
                    canceled = true;
                  }
                });
                if (!canceled) {
                  setTimeout(next);
                } else {
                  x.container.parentNode.removeChild(x.container);
                }
              } else {
                x.container.parentNode.removeChild(x.container);
                promise.resolve(group);
              }
            })();
          } else {
            x.pages.forEach(function(page) {
              group.append(doOne(page));
            });
            x.container.parentNode.removeChild(x.container);
            promise.resolve(group);
          }
        },
        element,
        forceBreak,
        pageWidth ? pageWidth - margin.left - margin.right : null,
        pageHeight ? pageHeight - margin.top - margin.bottom : null,
        margin,
        options2
      );
    } else {
      promise.resolve(doOne(element));
    }
  });
  function makeTemplate(template2) {
    if (template2 != null) {
      if (typeof template2 == "string") {
        template2 = template(template2.replace(/^\s+|\s+$/g, ""));
      }
      if (typeof template2 == "function") {
        return function(data) {
          var el = template2(data);
          if (el && typeof el == "string") {
            var div = document.createElement("div");
            setInnerHTML(div, el);
            el = div.firstElementChild;
          }
          return el;
        };
      }
      return function() {
        return template2.cloneNode(true);
      };
    }
  }
  function handlePageBreaks(callback, element2, forceBreak, pageWidth, pageHeight, margin, options3) {
    var template2 = makeTemplate(options3.template);
    var doc = element2.ownerDocument;
    var pages = [];
    var copy = options3._destructive ? element2 : cloneNodes(element2);
    var container = doc.createElement("KENDO-PDF-DOCUMENT");
    var adjust = 0;
    slice2(copy.querySelectorAll("tfoot")).forEach(function(tfoot) {
      tfoot.parentNode.appendChild(tfoot);
    });
    slice2(copy.querySelectorAll("ol")).forEach(function(ol) {
      slice2(ol.children).forEach(function(li, index) {
        li.setAttribute("kendo-split-index", index);
      });
    });
    setCSS(container, {
      display: "block",
      position: "absolute",
      boxSizing: "content-box",
      left: "-10000px",
      top: "-10000px"
    });
    if (pageWidth) {
      setCSS(container, {
        width: pageWidth + "px",
        paddingLeft: margin.left + "px",
        paddingRight: margin.right + "px"
      });
      setCSS(copy, { overflow: "hidden" });
    }
    element2.parentNode.insertBefore(container, element2);
    container.appendChild(copy);
    addClass(copy, "k-pdf-export");
    if (options3.beforePageBreak) {
      whenImagesAreActuallyLoaded([container], function() {
        options3.beforePageBreak(container, doPageBreak);
      });
    } else {
      whenImagesAreActuallyLoaded([container], doPageBreak);
    }
    function doPageBreak() {
      if (forceBreak != "-" || pageHeight) {
        splitElement(copy);
      }
      {
        let page = makePage();
        copy.parentNode.insertBefore(page, copy);
        page.appendChild(copy);
      }
      if (template2) {
        pages.forEach(function(page, i) {
          const el = template2({
            element: page,
            pageNum: i + 1,
            totalPages: pages.length
          });
          if (el) {
            page.appendChild(el);
          }
        });
      }
      removeClass(copy, "k-pdf-export");
      cacheImages(pages, callback.bind(null, { pages, container }));
    }
    function isElementVisible(el) {
      if (el.checkVisibility) {
        return el.checkVisibility({ visibilityProperty: true });
      }
      var current = el;
      while (current && current !== copy) {
        var style = getComputedStyle2(current);
        if (getPropertyValue(style, "display") === "none" || getPropertyValue(style, "visibility") === "hidden") {
          return false;
        }
        current = current.parentNode;
      }
      return true;
    }
    function keepTogether(el) {
      if (options3.keepTogether && matches(el, options3.keepTogether) && el.offsetHeight <= pageHeight - adjust) {
        return true;
      }
      var tag = el.tagName;
      if (/^h[1-6]$/i.test(tag) && el.offsetHeight >= pageHeight - adjust) {
        return false;
      }
      return el.getAttribute("data-kendo-chart") || /^(?:img|tr|thead|th|tfoot|iframe|svg|object|canvas|input|textarea|select|video|h[1-6])/i.test(el.tagName);
    }
    function splitElement(element3) {
      if (element3.tagName == "TABLE") {
        setCSS(element3, { tableLayout: "fixed" });
      }
      if (keepTogether(element3)) {
        return;
      }
      var style = getComputedStyle2(element3);
      var bottomPadding = parseFloat(getPropertyValue(style, "padding-bottom"));
      var bottomBorder = parseFloat(getPropertyValue(style, "border-bottom-width"));
      var saveAdjust = adjust;
      adjust += bottomPadding + bottomBorder;
      var isFirst = true;
      for (var el = element3.firstChild; el; el = el.nextSibling) {
        if (el.nodeType == 1) {
          isFirst = false;
          if (matches(el, forceBreak) && isElementVisible(el)) {
            breakAtElement(el);
            continue;
          }
          if (!pageHeight) {
            splitElement(el);
            continue;
          }
          if (!/^(?:static|relative)$/.test(getPropertyValue(getComputedStyle2(el), "position"))) {
            continue;
          }
          var fall = fallsOnMargin(el);
          if (fall == 1) {
            breakAtElement(el);
          } else if (fall) {
            if (keepTogether(el)) {
              breakAtElement(el);
            } else {
              splitElement(el);
            }
          } else {
            splitElement(el);
          }
        } else if (el.nodeType == 3 && pageHeight) {
          splitText(el, isFirst);
          isFirst = false;
        }
      }
      adjust = saveAdjust;
    }
    function firstInParent(el) {
      var p = el.parentNode, first = p.firstChild;
      if (el === first) {
        return true;
      }
      if (el === p.children[0]) {
        if (first.nodeType == 7 || first.nodeType == 8) {
          return true;
        }
        if (first.nodeType == 3) {
          return !/\S/.test(first.data);
        }
      }
      return false;
    }
    function breakAtElement(el) {
      if (el.nodeType == 1 && el !== copy && firstInParent(el)) {
        return breakAtElement(el.parentNode);
      }
      var table, colgroup, thead, grid, gridHead;
      table = closest(el, "table");
      colgroup = table && table.querySelector("colgroup");
      if (options3.repeatHeaders) {
        thead = table && table.querySelector("thead");
        grid = closest(el, ".k-grid");
        if (grid && grid.querySelector(".k-auto-scrollable")) {
          gridHead = grid.querySelector(".k-grid-header");
        }
      }
      var rowspanCells = [];
      if (table && el.tagName === "TR") {
        rowspanCells = collectRowspanCells(table, el);
      }
      var page = makePage();
      var range = doc.createRange();
      range.setStartBefore(copy);
      range.setEndBefore(el);
      page.appendChild(range.extractContents());
      copy.parentNode.insertBefore(page, copy);
      preventBulletOnListItem(el.parentNode);
      if (table) {
        table = closest(el, "table");
        if (options3.repeatHeaders && thead) {
          table.insertBefore(thead.cloneNode(true), table.firstChild);
        }
        if (colgroup) {
          table.insertBefore(colgroup.cloneNode(true), table.firstChild);
        }
        if (rowspanCells.length > 0) {
          restoreRowspanCells(table, rowspanCells);
        }
      }
      if (options3.repeatHeaders && gridHead) {
        grid = closest(el, ".k-grid");
        grid.insertBefore(gridHead.cloneNode(true), grid.firstChild);
      }
    }
    function isTableRow(el) {
      return el.tagName === "TR";
    }
    function collectRowspanCells(table, breakRow) {
      var rowspanCells = [];
      var tbody = table.querySelector("tbody");
      var rows = tbody ? slice2(tbody.children).filter(isTableRow) : slice2(table.children).filter(isTableRow);
      var breakRowIndex = rows.indexOf(breakRow);
      if (breakRowIndex === -1) {
        return rowspanCells;
      }
      for (var i = 0; i < breakRowIndex; i++) {
        var row = rows[i];
        var cells = slice2(row.cells);
        for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          var rowspan = parseInt(cell.getAttribute("rowspan") || "1", 10);
          if (i + rowspan > breakRowIndex) {
            var remainingRowspan = i + rowspan - breakRowIndex;
            var rowsOnFirstPage = breakRowIndex - i;
            var rowsOnSecondPage = remainingRowspan;
            var cellClone = cell.cloneNode(true);
            const cellWidth = getPropertyValue(getComputedStyle2(cell), "width");
            if (rowsOnSecondPage <= rowsOnFirstPage) {
              cellClone.style.width = cellWidth;
              cellClone.innerHTML = "";
            } else {
              cell.style.width = cellWidth;
              cell.innerHTML = "";
            }
            rowspanCells.push({
              cell: cellClone,
              columnIndex: getCellColumnIndex(row, cell),
              remainingRowspan
            });
          }
        }
      }
      return rowspanCells;
    }
    function getCellColumnIndex(row, targetCell) {
      var columnIndex = 0;
      var cells = slice2(row.cells);
      for (var i = 0; i < cells.length; i++) {
        if (cells[i] === targetCell) {
          return columnIndex;
        }
        var colspan = parseInt(cells[i].getAttribute("colspan") || "1", 10);
        columnIndex += colspan;
      }
      return columnIndex;
    }
    function restoreRowspanCells(table, rowspanCells) {
      if (!rowspanCells.length) {
        return;
      }
      var tbody = table.querySelector("tbody");
      var rows = tbody ? slice2(tbody.children).filter(isTableRow) : slice2(table.children).filter(isTableRow);
      if (!rows.length) {
        return;
      }
      var firstRow = rows[0];
      rowspanCells.sort(function(a, b) {
        return a.columnIndex - b.columnIndex;
      });
      for (var i = 0; i < rowspanCells.length; i++) {
        var rowspanInfo = rowspanCells[i];
        var cell = rowspanInfo.cell;
        cell.setAttribute("rowspan", rowspanInfo.remainingRowspan);
        insertCellAtColumn(firstRow, cell, rowspanInfo.columnIndex);
      }
    }
    function insertCellAtColumn(row, cellToInsert, targetColumnIndex) {
      var cells = slice2(row.cells);
      var currentColumnIndex = 0;
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
        if (currentColumnIndex === targetColumnIndex) {
          row.insertBefore(cellToInsert, cell);
          return;
        }
        if (currentColumnIndex + colspan > targetColumnIndex) {
          if (i + 1 < cells.length) {
            row.insertBefore(cellToInsert, cells[i + 1]);
          } else {
            row.appendChild(cellToInsert);
          }
          return;
        }
        currentColumnIndex += colspan;
      }
      row.appendChild(cellToInsert);
    }
    function makePage() {
      var page = doc.createElement("KENDO-PDF-PAGE");
      setCSS(page, {
        display: "block",
        boxSizing: "content-box",
        width: pageWidth ? pageWidth + "px" : "auto",
        padding: margin.top + "px " + margin.right + "px " + margin.bottom + "px " + margin.left + "px",
        // allow absolutely positioned elements to be relative to current page
        position: "relative",
        // without the following we might affect layout of subsequent pages
        height: pageHeight ? pageHeight + "px" : "auto",
        overflow: pageHeight || pageWidth ? "hidden" : "visible",
        clear: "both"
      });
      if (options3 && options3.pageClassName) {
        page.className = options3.pageClassName;
      }
      pages.push(page);
      return page;
    }
    function fallsOnMargin(thing) {
      var box = thing.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) {
        return 0;
      }
      var top = copy.getBoundingClientRect().top;
      var available = pageHeight - adjust;
      return box.height > available ? 3 : box.top - top > available ? 1 : box.bottom - top > available ? 2 : 0;
    }
    function splitText(node, isFirst) {
      if (!/\S/.test(node.data)) {
        return;
      }
      var len = node.data.length;
      var range = doc.createRange();
      range.selectNodeContents(node);
      var fall = fallsOnMargin(range);
      if (!fall) {
        return;
      }
      var nextnode = node;
      if (fall == 1) {
        if (isFirst) {
          breakAtElement(node.parentNode);
        } else {
          breakAtElement(node);
        }
      } else {
        (function findEOP(min, pos, max) {
          range.setEnd(node, pos);
          if (min == pos || pos == max) {
            return pos;
          }
          if (fallsOnMargin(range)) {
            return findEOP(min, min + pos >> 1, pos);
          } else {
            return findEOP(pos, pos + max >> 1, max);
          }
        })(0, len >> 1, len);
        if (!/\S/.test(range.toString()) && isFirst) {
          breakAtElement(node.parentNode);
        } else {
          nextnode = node.splitText(range.endOffset);
          var page = makePage();
          range.setStartBefore(copy);
          page.appendChild(range.extractContents());
          copy.parentNode.insertBefore(page, copy);
          preventBulletOnListItem(nextnode.parentNode);
        }
      }
      splitText(nextnode);
    }
    function preventBulletOnListItem(el) {
      var li = closest(el, "li");
      if (li) {
        li.setAttribute("kendo-no-bullet", "1");
        preventBulletOnListItem(li.parentNode);
      }
    }
  }
  return promise;
}
var parseBackgroundImage = /* @__PURE__ */ (function() {
  var tok_linear_gradient = /^((-webkit-|-moz-|-o-|-ms-)?linear-gradient\s*)\(/;
  var tok_percent = /^([-0-9.]+%)/;
  var tok_length = /^([-0-9.]+px)/;
  var tok_keyword = /^(left|right|top|bottom|to|center)\W/;
  var tok_angle = /^([-0-9.]+(deg|grad|rad|turn)|0)/;
  var tok_whitespace = /^(\s+)/;
  var tok_popen = /^(\()/;
  var tok_pclose = /^(\))/;
  var tok_comma = /^(,)/;
  var tok_url = /^(url)\(/;
  var tok_content = /^(.*?)\)/;
  var cache1 = {}, cache2 = {};
  function parse(input) {
    var orig = input;
    if (hasOwnProperty3(cache1, orig)) {
      return cache1[orig];
    }
    function skip_ws() {
      var m = tok_whitespace.exec(input);
      if (m) {
        input = input.substr(m[1].length);
      }
    }
    function read(token) {
      skip_ws();
      var m = token.exec(input);
      if (m) {
        input = input.substr(m[1].length);
        return m[1];
      }
    }
    function read_stop() {
      var color = parseColor(input, true);
      var length, percent;
      if (color) {
        let match = /^#[0-9a-f]+/i.exec(input) || /^rgba?\(.*?\)/i.exec(input) || /^..*?\b/.exec(input);
        input = input.substr(match[0].length);
        color = color.toRGB();
        if (!(length = read(tok_length))) {
          percent = read(tok_percent);
        }
        return { color, length, percent };
      }
    }
    function read_linear_gradient(propName) {
      var angle;
      var to1, to2;
      var stops = [];
      var reverse = false;
      if (read(tok_popen)) {
        angle = read(tok_angle);
        if (angle == "0") {
          angle = "0deg";
        }
        if (angle) {
          angle = parseAngle(angle);
          read(tok_comma);
        } else {
          to1 = read(tok_keyword);
          if (to1 == "to") {
            to1 = read(tok_keyword);
          } else if (to1 && /^-/.test(propName)) {
            reverse = true;
          }
          to2 = read(tok_keyword);
          read(tok_comma);
        }
        if (/-moz-/.test(propName) && angle == null && to1 == null) {
          var x = read(tok_percent), y = read(tok_percent);
          reverse = true;
          if (x == "0%") {
            to1 = "left";
          } else if (x == "100%") {
            to1 = "right";
          }
          if (y == "0%") {
            to2 = "top";
          } else if (y == "100%") {
            to2 = "bottom";
          }
          read(tok_comma);
        }
        while (input && !read(tok_pclose)) {
          var stop = read_stop();
          if (!stop) {
            break;
          }
          stops.push(stop);
          read(tok_comma);
        }
        return {
          type: "linear",
          angle,
          to: to1 && to2 ? to1 + " " + to2 : to1 ? to1 : to2 ? to2 : null,
          stops,
          reverse
        };
      }
    }
    function read_url() {
      if (read(tok_popen)) {
        var url = read(tok_content);
        url = url.replace(/^['"]+|["']+$/g, "");
        read(tok_pclose);
        return { type: "url", url };
      }
    }
    var tok;
    if (tok = read(tok_linear_gradient)) {
      tok = read_linear_gradient(tok);
    } else if (tok = read(tok_url)) {
      tok = read_url();
    }
    return cache1[orig] = tok || { type: "none" };
  }
  return function(input) {
    if (hasOwnProperty3(cache2, input)) {
      return cache2[input];
    }
    return cache2[input] = splitProperty(input).map(parse);
  };
})();
var splitProperty = /* @__PURE__ */ (function() {
  var cache = {};
  return function(input, separator) {
    if (!separator) {
      separator = /^\s*,\s*/;
    }
    var cacheKey = input + separator;
    if (hasOwnProperty3(cache, cacheKey)) {
      return cache[cacheKey];
    }
    var ret = [];
    var last2 = 0, pos = 0;
    var in_paren = 0;
    var in_string = false;
    var m;
    function looking_at(rx) {
      return m = rx.exec(input.substr(pos));
    }
    function trim(str) {
      return str.replace(/^\s+|\s+$/g, "");
    }
    while (pos < input.length) {
      if (!in_string && looking_at(/^[\(\[\{]/)) {
        in_paren++;
        pos++;
      } else if (!in_string && looking_at(/^[\)\]\}]/)) {
        in_paren--;
        pos++;
      } else if (!in_string && looking_at(/^[\"\']/)) {
        in_string = m[0];
        pos++;
      } else if (in_string == "'" && looking_at(/^\\\'/)) {
        pos += 2;
      } else if (in_string == '"' && looking_at(/^\\\"/)) {
        pos += 2;
      } else if (in_string == "'" && looking_at(/^\'/)) {
        in_string = false;
        pos++;
      } else if (in_string == '"' && looking_at(/^\"/)) {
        in_string = false;
        pos++;
      } else if (looking_at(separator)) {
        if (!in_string && !in_paren && pos > last2) {
          ret.push(trim(input.substring(last2, pos)));
          last2 = pos + m[0].length;
        }
        pos += m[0].length;
      } else {
        pos++;
      }
    }
    if (last2 < pos) {
      ret.push(trim(input.substring(last2, pos)));
    }
    return cache[cacheKey] = ret;
  };
})();
var getFontURL2 = /* @__PURE__ */ (function(cache) {
  return function(el) {
    var url = cache[el];
    if (!url) {
      var m;
      if (m = /url\((['"]?)([^'")]*?)\1\)\s+format\((['"]?)truetype\3\)/.exec(el)) {
        url = cache[el] = m[2];
      } else if (m = /url\((['"]?)([^'")]*?\.ttf)\1\)/.exec(el)) {
        url = cache[el] = m[2];
      }
    }
    return url;
  };
})(/* @__PURE__ */ Object.create(null));
var getFontHeight = /* @__PURE__ */ (function(cache) {
  return function(font) {
    var height = cache[font];
    if (height == null) {
      height = cache[font] = measureText("Mapq", { font }).height;
    }
    return height;
  };
})(/* @__PURE__ */ Object.create(null));
function getFontFaces(doc) {
  if (doc == null) {
    doc = document;
  }
  var result = {};
  for (var i = 0; i < doc.styleSheets.length; ++i) {
    doStylesheet(doc.styleSheets[i]);
  }
  return result;
  function doStylesheet(ss) {
    if (ss) {
      var rules = null;
      try {
        rules = ss.cssRules;
      } catch (ex) {
      }
      if (rules) {
        addRules(ss, rules);
      }
    }
  }
  function findFonts(rule) {
    var src = getPropertyValue(rule.style, "src");
    if (src) {
      return splitProperty(src).reduce(function(a, el) {
        var font2 = getFontURL2(el);
        if (font2) {
          a.push(font2);
        }
        return a;
      }, []);
    } else {
      var font = getFontURL2(rule.cssText);
      return font ? [font] : [];
    }
  }
  function addRules(styleSheet, rules) {
    for (var i2 = 0; i2 < rules.length; ++i2) {
      var r = rules[i2];
      switch (r.type) {
        case 3:
          doStylesheet(r.styleSheet);
          break;
        case 5:
          var style = r.style;
          var family = splitProperty(getPropertyValue(style, "font-family"));
          var bold = /^([56789]00|bold)$/i.test(getPropertyValue(style, "font-weight"));
          var italic = "italic" == getPropertyValue(style, "font-style");
          var src = findFonts(r);
          if (src.length > 0) {
            addRule(styleSheet, family, bold, italic, src[0]);
          }
      }
    }
  }
  function addRule(styleSheet, names, bold, italic, url) {
    if (!/^data:/i.test(url)) {
      if (!(/^[^\/:]+:\/\//.test(url) || /^\//.test(url))) {
        url = String(styleSheet.href).replace(/[^\/]*$/, "") + url;
      }
    }
    names.forEach(function(name) {
      name = name.replace(/^(['"]?)(.*?)\1$/, "$2");
      if (bold) {
        name += "|bold";
      }
      if (italic) {
        name += "|italic";
      }
      result[name] = url;
    });
  }
}
function hasOwnProperty3(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function getCounter(name) {
  name = "_counter_" + name;
  return nodeInfo[name];
}
function getAllCounters(name) {
  var values = [], p = nodeInfo;
  name = "_counter_" + name;
  while (p) {
    if (hasOwnProperty3(p, name)) {
      values.push(p[name]);
    }
    p = Object.getPrototypeOf(p);
  }
  return values.reverse();
}
function incCounter(name, inc) {
  var p = nodeInfo;
  name = "_counter_" + name;
  while (p && !hasOwnProperty3(p, name)) {
    p = Object.getPrototypeOf(p);
  }
  if (!p) {
    p = nodeInfo._root;
  }
  p[name] = (p[name] || 0) + (inc == null ? 1 : inc);
}
function resetCounter(name, val) {
  name = "_counter_" + name;
  nodeInfo[name] = val == null ? 0 : val;
}
function doCounters(a, f, def) {
  for (var i = 0; i < a.length; ) {
    var name = a[i++];
    var val = parseFloat(a[i]);
    if (isNaN(val)) {
      f(name, def);
    } else {
      f(name, val);
      ++i;
    }
  }
}
function updateCounters(style) {
  var counterReset = getPropertyValue(style, "counter-reset");
  if (counterReset) {
    doCounters(splitProperty(counterReset, /^\s+/), resetCounter, 0);
  }
  var counterIncrement = getPropertyValue(style, "counter-increment");
  if (counterIncrement) {
    doCounters(splitProperty(counterIncrement, /^\s+/), incCounter, 1);
  }
}
function parseColor3(str, css) {
  var color = parseColor(str, true);
  if (color) {
    color = color.toRGB();
    if (css) {
      color = color.toCssRgba();
    } else if (color.a === 0) {
      color = null;
    }
  }
  return color;
}
function whenImagesAreActuallyLoaded(elements, callback) {
  var pending = 0;
  var done = false;
  elements.forEach(function(el) {
    var images = el.querySelectorAll("img");
    for (var i = 0; i < images.length; ++i) {
      var img = images[i];
      if (!img.complete) {
        pending++;
        img.onload = img.onerror = next;
      }
    }
  });
  if (!pending) {
    next();
  }
  function next() {
    if (!done && --pending <= 0) {
      callback();
      done = true;
    }
  }
}
function cacheImages(elements, callback) {
  var urls = [];
  function add(url) {
    if (!IMAGE_CACHE2[url]) {
      IMAGE_CACHE2[url] = true;
      urls.push(url);
    }
  }
  elements.forEach(function dive(element) {
    if (/^img$/i.test(element.tagName)) {
      add(element.src);
    }
    parseBackgroundImage(
      getPropertyValue(
        getComputedStyle2(element),
        "background-image"
      )
    ).forEach(function(bg) {
      if (bg.type == "url") {
        add(bg.url);
      }
    });
    if (element.children) {
      slice2(element.children).forEach(dive);
    }
  });
  var count = urls.length;
  function next() {
    if (--count <= 0) {
      whenImagesAreActuallyLoaded(elements, callback);
    }
  }
  if (count === 0) {
    next();
  }
  urls.forEach(function(url) {
    var img = IMAGE_CACHE2[url] = new window.Image();
    if (!/^data:/i.test(url)) {
      img.crossOrigin = "Anonymous";
    }
    img.src = url;
    if (img.complete) {
      next();
    } else {
      img.onload = next;
      img.onerror = function() {
        IMAGE_CACHE2[url] = null;
        next();
      };
      if (/^data:/i.test(url)) {
        setTimeout(function() {
          if (img.complete && img.onload === next) {
            img.onload = null;
            img.onerror = null;
            next();
          }
        }, 10);
      }
    }
  });
}
function alphaNumeral(n) {
  var result = "";
  do {
    var r = n % 26;
    result = String.fromCharCode(97 + r) + result;
    n = Math.floor(n / 26);
  } while (n > 0);
  return result;
}
function pushNodeInfo(element, style, group) {
  nodeInfo = Object.create(nodeInfo);
  nodeInfo[element.tagName.toLowerCase()] = {
    element,
    style
  };
  let decoration = getPropertyValue(style, "text-decoration");
  if (decoration && decoration != "none") {
    let color = resolveElementColor(element, "text-decoration-color");
    decoration.split(/\s+/g).forEach(function(name) {
      if (!nodeInfo[name]) {
        nodeInfo[name] = color;
        if (name == "underline") {
          let offset = getPropertyValue(style, "text-underline-offset");
          if (offset != "auto") {
            nodeInfo["underline-offset"] = parseFloat(offset);
          }
        }
      }
    });
  }
  if (createsStackingContext(style)) {
    nodeInfo._stackingContext = {
      element,
      group
    };
  }
}
function popNodeInfo() {
  nodeInfo = Object.getPrototypeOf(nodeInfo);
}
function updateClipbox(path) {
  if (nodeInfo._clipbox != null) {
    var box = path.bbox(nodeInfo._matrix);
    if (nodeInfo._clipbox) {
      nodeInfo._clipbox = rect_default.intersect(nodeInfo._clipbox, box);
    } else {
      nodeInfo._clipbox = box;
    }
  }
}
function emptyClipbox() {
  var cb = nodeInfo._clipbox;
  if (cb == null) {
    return true;
  }
  if (cb) {
    return cb.width() === 0 || cb.height() === 0;
  }
}
function createsStackingContext(style) {
  function prop(name) {
    return getPropertyValue(style, name);
  }
  if (prop("transform") != "none" || prop("position") != "static" || prop("z-index") != "auto" || prop("opacity") < 1) {
    return true;
  }
}
function getComputedStyle2(element, pseudoElt) {
  return window.getComputedStyle(element, pseudoElt || null);
}
function getPropertyValue(style, prop, defa) {
  var val = style.getPropertyValue(prop);
  if (val == null || val === "") {
    if (browser4.webkit) {
      val = style.getPropertyValue("-webkit-" + prop);
    } else if (browser4.mozilla) {
      val = style.getPropertyValue("-moz-" + prop);
    } else if (browser4.opera) {
      val = style.getPropertyValue("-o-" + prop);
    } else if (microsoft) {
      val = style.getPropertyValue("-ms-" + prop);
    }
  }
  if (arguments.length > 2 && (val == null || val === "")) {
    return defa;
  } else {
    return val;
  }
}
function pleaseSetPropertyValue(style, prop, value, important) {
  style.setProperty(prop, value, important);
  if (browser4.webkit) {
    style.setProperty("-webkit-" + prop, value, important);
  } else if (browser4.mozilla) {
    style.setProperty("-moz-" + prop, value, important);
  } else if (browser4.opera) {
    style.setProperty("-o-" + prop, value, important);
  } else if (microsoft) {
    style.setProperty("-ms-" + prop, value, important);
    prop = "ms" + prop.replace(/(^|-)([a-z])/g, function(s, p1, p2) {
      return p1 + p2.toUpperCase();
    });
    style[prop] = value;
  }
}
function getBorder(element, style, side) {
  side = "border-" + side;
  return {
    width: parseFloat(getPropertyValue(style, side + "-width")),
    style: getPropertyValue(style, side + "-style"),
    color: resolveElementColor(element, side + "-color")
  };
}
function saveStyle(element, func) {
  var prev = element.style.cssText;
  var result = func();
  setStyle(element, prev);
  return result;
}
function getBorderRadius(style, side) {
  var r = getPropertyValue(style, "border-" + side + "-radius").split(/\s+/g).map(parseFloat);
  if (r.length == 1) {
    r.push(r[0]);
  }
  return sanitizeRadius({ x: r[0], y: r[1] });
}
function getContentBox(element) {
  var box = element.getBoundingClientRect();
  box = innerBox(box, "border-*-width", element);
  box = innerBox(box, "padding-*", element);
  return box;
}
function innerBox(box, prop, element) {
  var style, wt, wr, wb, wl;
  if (typeof prop == "string") {
    style = getComputedStyle2(element);
    wt = parseFloat(getPropertyValue(style, prop.replace("*", "top")));
    wr = parseFloat(getPropertyValue(style, prop.replace("*", "right")));
    wb = parseFloat(getPropertyValue(style, prop.replace("*", "bottom")));
    wl = parseFloat(getPropertyValue(style, prop.replace("*", "left")));
  } else if (typeof prop == "number") {
    wt = wr = wb = wl = prop;
  }
  return {
    top: box.top + wt,
    right: box.right - wr,
    bottom: box.bottom - wb,
    left: box.left + wl,
    width: box.right - box.left - wr - wl,
    height: box.bottom - box.top - wb - wt
  };
}
function getTransform(style) {
  var transform2 = getPropertyValue(style, "transform");
  if (transform2 == "none") {
    return null;
  }
  var matrix = /^\s*matrix\(\s*(.*?)\s*\)\s*$/.exec(transform2);
  if (matrix) {
    var origin = getPropertyValue(style, "transform-origin");
    matrix = matrix[1].split(/\s*,\s*/g).map(parseFloat);
    origin = origin.split(/\s+/g).map(parseFloat);
    return {
      matrix,
      origin
    };
  }
}
function radiansToDegrees(radians) {
  return 180 * radians / Math.PI % 360;
}
function parseAngle(angle) {
  var num = parseFloat(angle);
  if (/grad$/.test(angle)) {
    return Math.PI * num / 200;
  } else if (/rad$/.test(angle)) {
    return num;
  } else if (/turn$/.test(angle)) {
    return Math.PI * num * 2;
  } else if (/deg$/.test(angle)) {
    return Math.PI * num / 180;
  }
}
function setTransform(shape, m) {
  m = new matrix_default(m[0], m[1], m[2], m[3], m[4], m[5]);
  shape.transform(m);
  return m;
}
function setClipping2(shape, clipPath) {
  shape.clip(clipPath);
}
function addArcToPath(path, x, y, options2) {
  var points3 = new arc_default([x, y], options2).curvePoints(), i = 1;
  while (i < points3.length) {
    path.curveTo(points3[i++], points3[i++], points3[i++]);
  }
}
function sanitizeRadius(r) {
  if (r.x <= 0 || r.y <= 0) {
    r.x = r.y = 0;
  }
  return r;
}
function adjustBorderRadiusForBox(box, rTL, rTR, rBR, rBL) {
  var tl_x = Math.max(0, rTL.x), tl_y = Math.max(0, rTL.y);
  var tr_x = Math.max(0, rTR.x), tr_y = Math.max(0, rTR.y);
  var br_x = Math.max(0, rBR.x), br_y = Math.max(0, rBR.y);
  var bl_x = Math.max(0, rBL.x), bl_y = Math.max(0, rBL.y);
  var f = Math.min(
    box.width / (tl_x + tr_x),
    box.height / (tr_y + br_y),
    box.width / (br_x + bl_x),
    box.height / (bl_y + tl_y)
  );
  if (f < 1) {
    tl_x *= f;
    tl_y *= f;
    tr_x *= f;
    tr_y *= f;
    br_x *= f;
    br_y *= f;
    bl_x *= f;
    bl_y *= f;
  }
  return {
    tl: { x: tl_x, y: tl_y },
    tr: { x: tr_x, y: tr_y },
    br: { x: br_x, y: br_y },
    bl: { x: bl_x, y: bl_y }
  };
}
function elementRoundBox(element, box, type) {
  var style = getComputedStyle2(element);
  var rTL = getBorderRadius(style, "top-left");
  var rTR = getBorderRadius(style, "top-right");
  var rBL = getBorderRadius(style, "bottom-left");
  var rBR = getBorderRadius(style, "bottom-right");
  if (type == "padding" || type == "content") {
    var bt = getBorder(element, style, "top");
    var br = getBorder(element, style, "right");
    var bb = getBorder(element, style, "bottom");
    var bl = getBorder(element, style, "left");
    rTL.x -= bl.width;
    rTL.y -= bt.width;
    rTR.x -= br.width;
    rTR.y -= bt.width;
    rBR.x -= br.width;
    rBR.y -= bb.width;
    rBL.x -= bl.width;
    rBL.y -= bb.width;
    if (type == "content") {
      var pt = parseFloat(getPropertyValue(style, "padding-top"));
      var pr = parseFloat(getPropertyValue(style, "padding-right"));
      var pb = parseFloat(getPropertyValue(style, "padding-bottom"));
      var pl = parseFloat(getPropertyValue(style, "padding-left"));
      rTL.x -= pl;
      rTL.y -= pt;
      rTR.x -= pr;
      rTR.y -= pt;
      rBR.x -= pr;
      rBR.y -= pb;
      rBL.x -= pl;
      rBL.y -= pb;
    }
  }
  if (typeof type == "number") {
    rTL.x -= type;
    rTL.y -= type;
    rTR.x -= type;
    rTR.y -= type;
    rBR.x -= type;
    rBR.y -= type;
    rBL.x -= type;
    rBL.y -= type;
  }
  return roundBox(box, rTL, rTR, rBR, rBL);
}
function roundBox(box, rTL0, rTR0, rBR0, rBL0) {
  var tmp = adjustBorderRadiusForBox(box, rTL0, rTR0, rBR0, rBL0);
  var rTL = tmp.tl;
  var rTR = tmp.tr;
  var rBR = tmp.br;
  var rBL = tmp.bl;
  var path = new Path({ fill: null, stroke: null });
  path.moveTo(box.left, box.top + rTL.y);
  if (rTL.x) {
    addArcToPath(path, box.left + rTL.x, box.top + rTL.y, {
      startAngle: -180,
      endAngle: -90,
      radiusX: rTL.x,
      radiusY: rTL.y
    });
  }
  path.lineTo(box.right - rTR.x, box.top);
  if (rTR.x) {
    addArcToPath(path, box.right - rTR.x, box.top + rTR.y, {
      startAngle: -90,
      endAngle: 0,
      radiusX: rTR.x,
      radiusY: rTR.y
    });
  }
  path.lineTo(box.right, box.bottom - rBR.y);
  if (rBR.x) {
    addArcToPath(path, box.right - rBR.x, box.bottom - rBR.y, {
      startAngle: 0,
      endAngle: 90,
      radiusX: rBR.x,
      radiusY: rBR.y
    });
  }
  path.lineTo(box.left + rBL.x, box.bottom);
  if (rBL.x) {
    addArcToPath(path, box.left + rBL.x, box.bottom - rBL.y, {
      startAngle: 90,
      endAngle: 180,
      radiusX: rBL.x,
      radiusY: rBL.y
    });
  }
  return path.close();
}
function formatCounter(val, style) {
  var str = String(parseFloat(val));
  switch (style) {
    case "decimal-leading-zero":
      if (str.length < 2) {
        str = "0" + str;
      }
      return str;
    case "lower-roman":
      return arabicToRoman(val).toLowerCase();
    case "upper-roman":
      return arabicToRoman(val).toUpperCase();
    case "lower-latin":
    case "lower-alpha":
      return alphaNumeral(val - 1);
    case "upper-latin":
    case "upper-alpha":
      return alphaNumeral(val - 1).toUpperCase();
    default:
      return str;
  }
}
function evalPseudoElementContent(element, content) {
  function displayCounter(name, style, separator) {
    if (!separator) {
      return formatCounter(getCounter(name) || 0, style);
    }
    separator = separator.replace(/^\s*(["'])(.*)\1\s*$/, "$2");
    return getAllCounters(name).map(function(val) {
      return formatCounter(val, style);
    }).join(separator);
  }
  var a = splitProperty(content, /^\s+/);
  var result = [], m;
  a.forEach(function(el) {
    var tmp;
    if (m = /^\s*(["'])(.*)\1\s*$/.exec(el)) {
      result.push(m[2].replace(/\\([0-9a-f]{4})/gi, function(s, p) {
        return String.fromCharCode(parseInt(p, 16));
      }));
    } else if (m = /^\s*counter\((.*?)\)\s*$/.exec(el)) {
      tmp = splitProperty(m[1]);
      result.push(displayCounter(tmp[0], tmp[1]));
    } else if (m = /^\s*counters\((.*?)\)\s*$/.exec(el)) {
      tmp = splitProperty(m[1]);
      result.push(displayCounter(tmp[0], tmp[2], tmp[1]));
    } else if (m = /^\s*attr\((.*?)\)\s*$/.exec(el)) {
      result.push(element.getAttribute(m[1]) || "");
    } else {
      result.push(el);
    }
  });
  return result.join("");
}
function getCssText(style) {
  if (style.cssText) {
    return style.cssText;
  }
  var result = [];
  for (var i = 0; i < style.length; ++i) {
    result.push(style[i] + ": " + getPropertyValue(style, style[i]));
  }
  return result.join(";\n");
}
function _renderWithPseudoElements(element, group) {
  if (element.tagName == KENDO_PSEUDO_ELEMENT) {
    _renderElement(element, group);
    return;
  }
  let fake = [];
  function pseudo(kind, place) {
    let style = getComputedStyle2(element, kind), content = style.content;
    updateCounters(style);
    if (content && content != "normal" && content != "none" && style.width != "0px") {
      let psel = element.ownerDocument.createElement(KENDO_PSEUDO_ELEMENT);
      setStyle(psel, getCssText(style));
      psel.textContent = evalPseudoElementContent(element, content);
      element.insertBefore(psel, place);
      fake.push(psel);
    }
  }
  pseudo(":before", element.firstChild);
  pseudo(":after", null);
  if (fake.length > 0) {
    let saveClass = element.className;
    element.className += " kendo-pdf-hide-pseudo-elements";
    _renderElement(element, group);
    element.className = saveClass;
    fake.forEach(function(el) {
      element.removeChild(el);
    });
  } else {
    _renderElement(element, group);
  }
}
function _renderElement(element, group) {
  var style = getComputedStyle2(element);
  var top = getBorder(element, style, "top");
  var right = getBorder(element, style, "right");
  var bottom = getBorder(element, style, "bottom");
  var left = getBorder(element, style, "left");
  var rTL0 = getBorderRadius(style, "top-left");
  var rTR0 = getBorderRadius(style, "top-right");
  var rBL0 = getBorderRadius(style, "bottom-left");
  var rBR0 = getBorderRadius(style, "bottom-right");
  var dir = getPropertyValue(style, "direction");
  var backgroundColorValue = resolveElementColor(element, "background-color");
  var backgroundColor = parseColor3(backgroundColorValue);
  var backgroundImage = parseBackgroundImage(getPropertyValue(style, "background-image"));
  var backgroundRepeat = splitProperty(getPropertyValue(style, "background-repeat"));
  var backgroundPosition = splitProperty(getPropertyValue(style, "background-position"));
  var backgroundOrigin = splitProperty(getPropertyValue(style, "background-origin"));
  var backgroundSize = splitProperty(getPropertyValue(style, "background-size"));
  var textOverflow, saveTextOverflow;
  if (microsoft) {
    textOverflow = style.textOverflow;
    if (textOverflow == "ellipsis") {
      saveTextOverflow = element.style.textOverflow;
      element.style.textOverflow = "clip";
    }
  }
  if (browser4.msie && browser4.version < 10) {
    backgroundPosition = splitProperty(element.currentStyle.backgroundPosition);
  }
  var innerbox = innerBox(element.getBoundingClientRect(), "border-*-width", element);
  (function() {
    var clip = getPropertyValue(style, "clip");
    var m = /^\s*rect\((.*)\)\s*$/.exec(clip);
    if (m) {
      var a = m[1].split(/[ ,]+/g);
      var top2 = a[0] == "auto" ? innerbox.top : parseFloat(a[0]) + innerbox.top;
      var right2 = a[1] == "auto" ? innerbox.right : parseFloat(a[1]) + innerbox.left;
      var bottom2 = a[2] == "auto" ? innerbox.bottom : parseFloat(a[2]) + innerbox.top;
      var left2 = a[3] == "auto" ? innerbox.left : parseFloat(a[3]) + innerbox.left;
      var tmp = new group_default();
      var clipPath = new Path().moveTo(left2, top2).lineTo(right2, top2).lineTo(right2, bottom2).lineTo(left2, bottom2).close();
      setClipping2(tmp, clipPath);
      group.append(tmp);
      group = tmp;
      updateClipbox(clipPath);
    }
  })();
  var boxes, i, cells;
  var display = getPropertyValue(style, "display");
  if (display == "table-row") {
    boxes = [];
    for (i = 0, cells = element.children; i < cells.length; ++i) {
      boxes.push(cells[i].getBoundingClientRect());
    }
  } else {
    boxes = element.getClientRects();
    if (boxes.length == 1) {
      boxes = [element.getBoundingClientRect()];
    }
  }
  boxes = adjustBoxes(boxes);
  for (i = 0; i < boxes.length; ++i) {
    drawOneBox(boxes[i], i === 0, i == boxes.length - 1);
  }
  if (element.tagName == "A" && element.href && !/^#?$/.test(element.getAttribute("href"))) {
    if (!nodeInfo._avoidLinks || !matches(element, nodeInfo._avoidLinks)) {
      const r = document.createRange();
      r.selectNodeContents(element);
      slice2(r.getClientRects()).forEach(function(box) {
        const g = new group_default();
        g._pdfLink = {
          url: element.href,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
          left: box.left
        };
        group.append(g);
      });
    }
  }
  if (boxes.length > 0 && display == "list-item" && !element.getAttribute("kendo-no-bullet")) {
    drawBullet(boxes[0]);
  }
  (function() {
    function clipit() {
      var clipPath = elementRoundBox(element, innerbox, "padding");
      var tmp = new group_default();
      setClipping2(tmp, clipPath);
      group.append(tmp);
      group = tmp;
      updateClipbox(clipPath);
    }
    if (isFormField(element)) {
      clipit();
    } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow"))) {
      clipit();
    } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow-x"))) {
      clipit();
    } else if (/^(hidden|auto|scroll)/.test(getPropertyValue(style, "overflow-y"))) {
      clipit();
    }
  })();
  if (!maybeRenderWidget(element, group) && !maybeRenderBullet(element, group)) {
    renderContents(element, group);
  }
  if (microsoft && textOverflow == "ellipsis") {
    element.style.textOverflow = saveTextOverflow;
  }
  return group;
  function adjustBoxes(boxes2) {
    if (/^td$/i.test(element.tagName)) {
      var table = nodeInfo.table;
      if (table && getPropertyValue(table.style, "border-collapse") == "collapse") {
        var tableBorderLeft = getBorder(table.element, table.style, "left").width;
        var tableBorderTop = getBorder(table.element, table.style, "top").width;
        if (tableBorderLeft === 0 && tableBorderTop === 0) {
          return boxes2;
        }
        var tableBox = table.element.getBoundingClientRect();
        var firstCell = table.element.rows[0].cells[0];
        var firstCellBox = firstCell.getBoundingClientRect();
        if (firstCellBox.top == tableBox.top || firstCellBox.left == tableBox.left) {
          return slice2(boxes2).map(function(box) {
            return {
              left: box.left + tableBorderLeft,
              top: box.top + tableBorderTop,
              right: box.right + tableBorderLeft,
              bottom: box.bottom + tableBorderTop,
              height: box.height,
              width: box.width
            };
          });
        }
      }
    }
    return boxes2;
  }
  function drawEdge(color, len, Wtop, Wleft, Wright, rl, rr, transform2) {
    if (Wtop <= 0) {
      return;
    }
    var path, edge = new group_default();
    setTransform(edge, transform2);
    group.append(edge);
    sanitizeRadius(rl);
    sanitizeRadius(rr);
    path = new Path({
      fill: { color },
      stroke: null
    });
    edge.append(path);
    path.moveTo(rl.x ? Math.max(rl.x, Wleft) : 0, 0).lineTo(len - (rr.x ? Math.max(rr.x, Wright) : 0), 0).lineTo(len - Math.max(rr.x, Wright), Wtop).lineTo(Math.max(rl.x, Wleft), Wtop).close();
    if (rl.x) {
      drawRoundCorner(Wleft, rl, [-1, 0, 0, 1, rl.x, 0]);
    }
    if (rr.x) {
      drawRoundCorner(Wright, rr, [1, 0, 0, 1, len - rr.x, 0]);
    }
    function drawRoundCorner(Wright2, r, transform3) {
      var angle = Math.PI / 2 * Wright2 / (Wright2 + Wtop);
      var ri = {
        x: r.x - Wright2,
        y: r.y - Wtop
      };
      var path2 = new Path({
        fill: { color },
        stroke: null
      }).moveTo(0, 0);
      setTransform(path2, transform3);
      addArcToPath(path2, 0, r.y, {
        startAngle: -90,
        endAngle: -radiansToDegrees(angle),
        radiusX: r.x,
        radiusY: r.y
      });
      if (ri.x > 0 && ri.y > 0) {
        path2.lineTo(ri.x * Math.cos(angle), r.y - ri.y * Math.sin(angle));
        addArcToPath(path2, 0, r.y, {
          startAngle: -radiansToDegrees(angle),
          endAngle: -90,
          radiusX: ri.x,
          radiusY: ri.y,
          anticlockwise: true
        });
      } else if (ri.x > 0) {
        path2.lineTo(ri.x, Wtop).lineTo(0, Wtop);
      } else {
        path2.lineTo(ri.x, Wtop).lineTo(ri.x, 0);
      }
      edge.append(path2.close());
    }
  }
  function drawBackground2(box) {
    var background = new group_default();
    setClipping2(background, roundBox(box, rTL0, rTR0, rBR0, rBL0));
    group.append(background);
    if (backgroundColor) {
      var path = new Path({
        fill: { color: backgroundColor.toCssRgba() },
        stroke: null
      });
      path.moveTo(box.left, box.top).lineTo(box.right, box.top).lineTo(box.right, box.bottom).lineTo(box.left, box.bottom).close();
      background.append(path);
    }
    for (var i2 = backgroundImage.length; --i2 >= 0; ) {
      drawOneBackground(
        background,
        box,
        backgroundImage[i2],
        backgroundRepeat[i2 % backgroundRepeat.length],
        backgroundPosition[i2 % backgroundPosition.length],
        backgroundOrigin[i2 % backgroundOrigin.length],
        backgroundSize[i2 % backgroundSize.length]
      );
    }
  }
  function drawOneBackground(group2, box, background, backgroundRepeat2, backgroundPosition2, backgroundOrigin2, backgroundSize2) {
    if (!background || background == "none") {
      return;
    }
    if (background.type == "url") {
      var img = IMAGE_CACHE2[background.url];
      if (img && img.width > 0 && img.height > 0) {
        drawBackgroundImage(group2, box, img.width, img.height, function(group3, rect) {
          group3.append(new image_default(background.url, rect));
        });
      }
    } else if (background.type == "linear") {
      drawBackgroundImage(group2, box, box.width, box.height, gradientRenderer(background));
    } else {
      return;
    }
    function drawBackgroundImage(group3, box2, img_width, img_height, renderBG) {
      var aspect_ratio = img_width / img_height, f;
      var orgBox = box2;
      if (backgroundOrigin2 == "content-box") {
        orgBox = innerBox(orgBox, "border-*-width", element);
        orgBox = innerBox(orgBox, "padding-*", element);
      } else if (backgroundOrigin2 == "padding-box") {
        orgBox = innerBox(orgBox, "border-*-width", element);
      }
      if (!/^\s*auto(\s+auto)?\s*$/.test(backgroundSize2)) {
        if (backgroundSize2 == "contain") {
          f = Math.min(
            orgBox.width / img_width,
            orgBox.height / img_height
          );
          img_width *= f;
          img_height *= f;
        } else if (backgroundSize2 == "cover") {
          f = Math.max(
            orgBox.width / img_width,
            orgBox.height / img_height
          );
          img_width *= f;
          img_height *= f;
        } else {
          var size = backgroundSize2.split(/\s+/g);
          if (/%$/.test(size[0])) {
            img_width = orgBox.width * parseFloat(size[0]) / 100;
          } else {
            img_width = parseFloat(size[0]);
          }
          if (size.length == 1 || size[1] == "auto") {
            img_height = img_width / aspect_ratio;
          } else if (/%$/.test(size[1])) {
            img_height = orgBox.height * parseFloat(size[1]) / 100;
          } else {
            img_height = parseFloat(size[1]);
          }
        }
      }
      var pos = String(backgroundPosition2);
      switch (pos) {
        case "bottom":
          pos = "50% 100%";
          break;
        case "top":
          pos = "50% 0";
          break;
        case "left":
          pos = "0 50%";
          break;
        case "right":
          pos = "100% 50%";
          break;
        case "center":
          pos = "50% 50%";
          break;
      }
      pos = pos.split(/\s+/);
      if (pos.length == 1) {
        pos[1] = "50%";
      }
      if (/%$/.test(pos[0])) {
        pos[0] = parseFloat(pos[0]) / 100 * (orgBox.width - img_width);
      } else {
        pos[0] = parseFloat(pos[0]);
      }
      if (/%$/.test(pos[1])) {
        pos[1] = parseFloat(pos[1]) / 100 * (orgBox.height - img_height);
      } else {
        pos[1] = parseFloat(pos[1]);
      }
      var rect = new rect_default([orgBox.left + pos[0], orgBox.top + pos[1]], [img_width, img_height]);
      function rewX() {
        while (rect.origin.x > box2.left) {
          rect.origin.x -= img_width;
        }
      }
      function rewY() {
        while (rect.origin.y > box2.top) {
          rect.origin.y -= img_height;
        }
      }
      function repeatX() {
        while (rect.origin.x < box2.right) {
          renderBG(group3, rect.clone());
          rect.origin.x += img_width;
        }
      }
      if (backgroundRepeat2 == "no-repeat") {
        renderBG(group3, rect);
      } else if (backgroundRepeat2 == "repeat-x") {
        rewX();
        repeatX();
      } else if (backgroundRepeat2 == "repeat-y") {
        rewY();
        while (rect.origin.y < box2.bottom) {
          renderBG(group3, rect.clone());
          rect.origin.y += img_height;
        }
      } else if (backgroundRepeat2 == "repeat") {
        rewX();
        rewY();
        var origin = rect.origin.clone();
        while (rect.origin.y < box2.bottom) {
          rect.origin.x = origin.x;
          repeatX();
          rect.origin.y += img_height;
        }
      }
    }
  }
  function drawBullet() {
    var listStyleType = getPropertyValue(style, "list-style-type");
    if (listStyleType == "none") {
      return;
    }
    var listStylePosition = getPropertyValue(style, "list-style-position");
    function _drawBullet(f) {
      saveStyle(element, function() {
        element.style.position = "relative";
        var bullet = element.ownerDocument.createElement(KENDO_PSEUDO_ELEMENT);
        bullet.style.position = "absolute";
        bullet.style.boxSizing = "border-box";
        if (listStylePosition == "outside") {
          bullet.style.width = "6em";
          bullet.style.left = "-6.8em";
          bullet.style.textAlign = "right";
        } else {
          bullet.style.left = "0px";
        }
        f(bullet);
        element.insertBefore(bullet, element.firstChild);
        renderElement(bullet, group);
        element.removeChild(bullet);
      });
    }
    function elementIndex(f) {
      var a = element.parentNode.children;
      var k = element.getAttribute("kendo-split-index");
      if (k != null) {
        return f(k | 0, a.length);
      }
      for (var i2 = 0; i2 < a.length; ++i2) {
        if (a[i2] === element) {
          return f(i2, a.length);
        }
      }
    }
    switch (listStyleType) {
      case "circle":
      case "disc":
      case "square":
        _drawBullet(function(bullet) {
          bullet.innerHTML = "&nbsp;";
          bullet.setAttribute(KENDO_BULLET_TYPE, listStyleType);
        });
        break;
      case "decimal":
      case "decimal-leading-zero":
        _drawBullet(function(bullet) {
          elementIndex(function(idx) {
            ++idx;
            if (listStyleType == "decimal-leading-zero" && idx < 10) {
              idx = "0" + idx;
            }
            bullet.innerHTML = idx + ".";
          });
        });
        break;
      case "lower-roman":
      case "upper-roman":
        _drawBullet(function(bullet) {
          elementIndex(function(idx) {
            idx = arabicToRoman(idx + 1);
            if (listStyleType == "upper-roman") {
              idx = idx.toUpperCase();
            }
            bullet.innerHTML = idx + ".";
          });
        });
        break;
      case "lower-latin":
      case "lower-alpha":
      case "upper-latin":
      case "upper-alpha":
        _drawBullet(function(bullet) {
          elementIndex(function(idx) {
            idx = alphaNumeral(idx);
            if (/^upper/i.test(listStyleType)) {
              idx = idx.toUpperCase();
            }
            bullet.innerHTML = idx + ".";
          });
        });
        break;
    }
  }
  function drawOneBox(box, isFirst, isLast) {
    if (box.width === 0 || box.height === 0) {
      return;
    }
    drawBackground2(box);
    var shouldDrawLeft = left.width > 0 && (isFirst && dir == "ltr" || isLast && dir == "rtl");
    var shouldDrawRight = right.width > 0 && (isLast && dir == "ltr" || isFirst && dir == "rtl");
    if (top.width === 0 && left.width === 0 && right.width === 0 && bottom.width === 0) {
      return;
    }
    if (top.color == right.color && top.color == bottom.color && top.color == left.color) {
      if (top.width == right.width && top.width == bottom.width && top.width == left.width) {
        if (shouldDrawLeft && shouldDrawRight) {
          box = innerBox(box, top.width / 2);
          var path = elementRoundBox(element, box, top.width / 2);
          path.options.stroke = {
            color: top.color,
            width: top.width
          };
          group.append(path);
          return;
        }
      }
    }
    if (rTL0.x === 0 && rTR0.x === 0 && rBR0.x === 0 && rBL0.x === 0) {
      if (top.width < 2 && left.width < 2 && right.width < 2 && bottom.width < 2) {
        if (top.width > 0) {
          group.append(
            new Path({
              stroke: { width: top.width, color: top.color }
            }).moveTo(box.left, box.top + top.width / 2).lineTo(box.right, box.top + top.width / 2)
          );
        }
        if (bottom.width > 0) {
          group.append(
            new Path({
              stroke: { width: bottom.width, color: bottom.color }
            }).moveTo(box.left, box.bottom - bottom.width / 2).lineTo(box.right, box.bottom - bottom.width / 2)
          );
        }
        if (shouldDrawLeft) {
          group.append(
            new Path({
              stroke: { width: left.width, color: left.color }
            }).moveTo(box.left + left.width / 2, box.top).lineTo(box.left + left.width / 2, box.bottom)
          );
        }
        if (shouldDrawRight) {
          group.append(
            new Path({
              stroke: { width: right.width, color: right.color }
            }).moveTo(box.right - right.width / 2, box.top).lineTo(box.right - right.width / 2, box.bottom)
          );
        }
        return;
      }
    }
    var tmp = adjustBorderRadiusForBox(box, rTL0, rTR0, rBR0, rBL0);
    var rTL = tmp.tl;
    var rTR = tmp.tr;
    var rBR = tmp.br;
    var rBL = tmp.bl;
    drawEdge(
      top.color,
      box.width,
      top.width,
      left.width,
      right.width,
      rTL,
      rTR,
      [1, 0, 0, 1, box.left, box.top]
    );
    drawEdge(
      bottom.color,
      box.width,
      bottom.width,
      right.width,
      left.width,
      rBR,
      rBL,
      [-1, 0, 0, -1, box.right, box.bottom]
    );
    function inv(p) {
      return { x: p.y, y: p.x };
    }
    drawEdge(
      left.color,
      box.height,
      left.width,
      bottom.width,
      top.width,
      inv(rBL),
      inv(rTL),
      [0, -1, 1, 0, box.left, box.bottom]
    );
    drawEdge(
      right.color,
      box.height,
      right.width,
      top.width,
      bottom.width,
      inv(rTR),
      inv(rBR),
      [0, 1, -1, 0, box.right, box.top]
    );
  }
}
function gradientRenderer(gradient) {
  return function(group, rect) {
    var width = rect.width(), height = rect.height();
    switch (gradient.type) {
      case "linear":
        var angle = gradient.angle != null ? gradient.angle : Math.PI;
        switch (gradient.to) {
          case "top":
            angle = 0;
            break;
          case "left":
            angle = -Math.PI / 2;
            break;
          case "bottom":
            angle = Math.PI;
            break;
          case "right":
            angle = Math.PI / 2;
            break;
          case "top left":
          case "left top":
            angle = -Math.atan2(height, width);
            break;
          case "top right":
          case "right top":
            angle = Math.atan2(height, width);
            break;
          case "bottom left":
          case "left bottom":
            angle = Math.PI + Math.atan2(height, width);
            break;
          case "bottom right":
          case "right bottom":
            angle = Math.PI - Math.atan2(height, width);
            break;
        }
        if (gradient.reverse) {
          angle -= Math.PI;
        }
        angle %= 2 * Math.PI;
        if (angle < 0) {
          angle += 2 * Math.PI;
        }
        var pxlen = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
        var scaledAngle = Math.atan(width * Math.tan(angle) / height);
        var sin = Math.sin(scaledAngle), cos = Math.cos(scaledAngle);
        var len = Math.abs(sin) + Math.abs(cos);
        var x = len / 2 * sin;
        var y = len / 2 * cos;
        if (angle > Math.PI / 2 && angle <= 3 * Math.PI / 2) {
          x = -x;
          y = -y;
        }
        var implicit = [], right = 0;
        var stops = gradient.stops.map(function(s, i) {
          var offset = s.percent;
          if (offset) {
            offset = parseFloat(offset) / 100;
          } else if (s.length) {
            offset = parseFloat(s.length) / pxlen;
          } else if (i === 0) {
            offset = 0;
          } else if (i == gradient.stops.length - 1) {
            offset = 1;
          }
          var stop = {
            color: s.color.toCssRgba(),
            offset
          };
          if (offset != null) {
            right = offset;
            implicit.forEach(function(s2, i2) {
              var stop2 = s2.stop;
              stop2.offset = s2.left + (right - s2.left) * (i2 + 1) / (implicit.length + 1);
            });
            implicit = [];
          } else {
            implicit.push({ left: right, stop });
          }
          return stop;
        });
        var start = [0.5 - x, 0.5 + y];
        var end = [0.5 + x, 0.5 - y];
        group.append(
          Path.fromRect(rect).stroke(null).fill(new linear_gradient_default({
            start,
            end,
            stops,
            userSpace: false
          }))
        );
        break;
      case "radial":
        if (window.console && window.console.log) {
          window.console.log("Radial gradients are not yet supported in HTML renderer");
        }
        break;
    }
  };
}
function maybeRenderWidget(element, group) {
  let visual = null;
  if (window.kendo && window.kendo.jQuery && element.getAttribute(window.kendo.attr("role"))) {
    let widget = window.kendo.widgetInstance(window.kendo.jQuery(element));
    if (widget && (widget.exportDOMVisual || widget.exportVisual)) {
      if (widget.exportDOMVisual) {
        visual = widget.exportDOMVisual();
      } else {
        visual = widget.exportVisual();
      }
    }
  }
  if (visual === null && element._kendoExportVisual) {
    const rect = element.getBoundingClientRect();
    const size = {
      width: rect.width,
      height: rect.height
    };
    visual = element._kendoExportVisual(size);
  }
  if (!visual) {
    return false;
  }
  const wrap2 = new group_default();
  wrap2.children.push(visual);
  const bbox = element.getBoundingClientRect();
  wrap2.transform(transform().translate(bbox.left, bbox.top));
  group.append(wrap2);
  return true;
}
function maybeRenderBullet(element, group) {
  const bulletType = element.getAttribute(KENDO_BULLET_TYPE);
  if (!bulletType) {
    return false;
  }
  var box = element.getBoundingClientRect();
  const color = resolveElementColor(element, "color");
  if (bulletType === "square") {
    const rectSize = box.height / 5;
    group.append(new rect_default2(new rect_default([
      box.right - rectSize,
      box.top + box.height / 2.1
    ], [rectSize, rectSize])).fill(color).stroke(color));
  } else {
    const radius = box.height / 7;
    const center = [
      box.right - radius,
      box.top + (box.height + radius) / 2
    ];
    const circle = new circle_default2(new circle_default(center, radius));
    if (bulletType === "circle") {
      circle.stroke(color, 0.5);
    } else {
      circle.fill(color).stroke(null);
    }
    group.append(circle);
  }
  return true;
}
function renderImage(element, url, group) {
  var box = getContentBox(element);
  var rect = new rect_default([box.left, box.top], [box.width, box.height]);
  var image = new image_default(url, rect);
  setClipping2(image, elementRoundBox(element, box, "content"));
  group.append(image);
}
function zIndexSort(a, b) {
  var sa = getComputedStyle2(a);
  var sb = getComputedStyle2(b);
  var za = parseFloat(getPropertyValue(sa, "z-index"));
  var zb = parseFloat(getPropertyValue(sb, "z-index"));
  var pa = getPropertyValue(sa, "position");
  var pb = getPropertyValue(sb, "position");
  if (isNaN(za) && isNaN(zb)) {
    if (/static|absolute/.test(pa) && /static|absolute/.test(pb)) {
      return 0;
    }
    if (pa == "static") {
      return -1;
    }
    if (pb == "static") {
      return 1;
    }
    return 0;
  }
  if (isNaN(za)) {
    return zb === 0 ? 0 : zb > 0 ? -1 : 1;
  }
  if (isNaN(zb)) {
    return za === 0 ? 0 : za > 0 ? 1 : -1;
  }
  return parseFloat(za) - parseFloat(zb);
}
function isFormField(element) {
  return /^(?:textarea|select|input)$/i.test(element.tagName);
}
function getSelectedOption(element) {
  if (element.selectedOptions && element.selectedOptions.length > 0) {
    return element.selectedOptions[0];
  }
  return element.options[element.selectedIndex];
}
function renderCheckbox(element, group) {
  var style = getComputedStyle2(element);
  var color = resolveElementColor(element, "color");
  var box = element.getBoundingClientRect();
  if (element.type == "checkbox") {
    group.append(
      Path.fromRect(
        new rect_default(
          [box.left + 1, box.top + 1],
          [box.width - 2, box.height - 2]
        )
      ).stroke(color, 1)
    );
    if (element.checked) {
      group.append(
        new Path().stroke(color, 1.2).moveTo(
          box.left + 0.22 * box.width,
          box.top + 0.55 * box.height
        ).lineTo(
          box.left + 0.45 * box.width,
          box.top + 0.75 * box.height
        ).lineTo(
          box.left + 0.78 * box.width,
          box.top + 0.22 * box.width
        )
      );
    }
  } else {
    group.append(
      new circle_default2(
        new circle_default([
          (box.left + box.right) / 2,
          (box.top + box.bottom) / 2
        ], Math.min(box.width - 2, box.height - 2) / 2)
      ).stroke(color, 1)
    );
    if (element.checked) {
      group.append(
        new circle_default2(
          new circle_default([
            (box.left + box.right) / 2,
            (box.top + box.bottom) / 2
          ], Math.min(box.width - 8, box.height - 8) / 2)
        ).fill(color).stroke(null)
      );
    }
  }
}
function renderFormField(element, group) {
  var tag = element.tagName.toLowerCase();
  if (tag == "input" && (element.type == "checkbox" || element.type == "radio")) {
    return renderCheckbox(element, group);
  }
  var p = element.parentNode;
  var doc = element.ownerDocument;
  var el = doc.createElement(KENDO_PSEUDO_ELEMENT);
  var option;
  setStyle(el, getCssText(getComputedStyle2(element)));
  if (tag == "input") {
    el.style.whiteSpace = "pre";
  }
  if (tag == "select" || tag == "textarea") {
    el.style.overflow = "auto";
  }
  if (tag == "select") {
    if (element.multiple) {
      for (var i = 0; i < element.options.length; ++i) {
        option = doc.createElement(KENDO_PSEUDO_ELEMENT);
        setStyle(option, getCssText(getComputedStyle2(element.options[i])));
        option.style.display = "block";
        option.textContent = element.options[i].textContent;
        el.appendChild(option);
      }
    } else {
      option = getSelectedOption(element);
      if (option) {
        el.textContent = option.textContent;
      }
    }
  } else {
    el.textContent = element.value;
  }
  p.insertBefore(el, element);
  el.scrollLeft = element.scrollLeft;
  el.scrollTop = element.scrollTop;
  element.style.display = "none";
  renderContents(el, group);
  element.style.display = "";
  p.removeChild(el);
}
function serializeSVG(element) {
  const serializer = new window.XMLSerializer();
  let xml = serializer.serializeToString(element);
  if (browser4.mozilla && !(element.getAttribute("width") && element.getAttribute("height"))) {
    const doc = new window.DOMParser().parseFromString(xml, "image/svg+xml");
    const svg = doc.documentElement;
    const box = getContentBox(element);
    svg.setAttribute("width", box.width);
    svg.setAttribute("height", box.height);
    xml = serializer.serializeToString(svg);
  }
  return xml;
}
function renderContents(element, group) {
  if (nodeInfo._stackingContext.element === element) {
    nodeInfo._stackingContext.group = group;
  }
  switch (element.tagName.toLowerCase()) {
    case "img":
      renderImage(element, element.src, group);
      break;
    case "svg": {
      let xml = serializeSVG(element);
      let dataURL = `data:image/svg+xml;base64,${encodeBase64(xml)}`;
      renderImage(element, dataURL, group);
      break;
    }
    case "canvas":
      try {
        renderImage(element, element.toDataURL("image/png"), group);
      } catch (ex) {
      }
      break;
    case "textarea":
    case "input":
    case "select":
      renderFormField(element, group);
      break;
    default:
      var children = [], floats = [], positioned = [];
      for (var i = element.firstChild; i; i = i.nextSibling) {
        switch (i.nodeType) {
          case 3:
            if (/\S/.test(i.data)) {
              renderText(element, i, group);
            }
            break;
          case 1:
            var style = getComputedStyle2(i);
            var floating = getPropertyValue(style, "float");
            var position = getPropertyValue(style, "position");
            if (position != "static") {
              positioned.push(i);
            } else if (floating != "none") {
              floats.push(i);
            } else {
              children.push(i);
            }
            break;
        }
      }
      mergeSort(children, zIndexSort).forEach(function(el) {
        renderElement(el, group);
      });
      mergeSort(floats, zIndexSort).forEach(function(el) {
        renderElement(el, group);
      });
      mergeSort(positioned, zIndexSort).forEach(function(el) {
        renderElement(el, group);
      });
  }
}
function renderText(element, node, group) {
  if (emptyClipbox()) {
    return;
  }
  var style = getComputedStyle2(element);
  if (parseFloat(getPropertyValue(style, "text-indent")) < -500) {
    return;
  }
  var text = node.data;
  var start = 0;
  var end = text.search(/\S\s*$/) + 1;
  if (!end) {
    return;
  }
  var fontSize = getPropertyValue(style, "font-size");
  var lineHeight = getPropertyValue(style, "line-height");
  var font = [
    getPropertyValue(style, "font-style"),
    getPropertyValue(style, "font-variant"),
    getPropertyValue(style, "font-weight"),
    fontSize,
    // no need for line height here; it breaks layout in FF
    getPropertyValue(style, "font-family")
  ].join(" ");
  fontSize = parseFloat(fontSize);
  lineHeight = parseFloat(lineHeight);
  if (fontSize === 0 || isNaN(fontSize)) {
    return;
  }
  var color = resolveElementColor(element, "color");
  var range = element.ownerDocument.createRange();
  var align2 = getPropertyValue(style, "text-align");
  var isJustified = align2 == "justify";
  var columnCount = getPropertyValue(style, "column-count", 1);
  var whiteSpace = getPropertyValue(style, "white-space");
  var textTransform = getPropertyValue(style, "text-transform");
  var estimateLineLength = element.getBoundingClientRect().width / fontSize * 5;
  if (estimateLineLength === 0) {
    estimateLineLength = 500;
  }
  var prevLineBottom = null;
  var underline = nodeInfo["underline"];
  var lineThrough = nodeInfo["line-through"];
  var overline = nodeInfo["overline"];
  var underlineOffset = nodeInfo["underline-offset"];
  if (underline) {
    forEachRect(decorateUnder);
  }
  while (!doChunk()) {
  }
  if (lineThrough || overline) {
    forEachRect(decorateOver);
  }
  return;
  function forEachRect(callback) {
    range.selectNode(node);
    let clientRects = slice2(range.getClientRects());
    forEachRect = (cb) => clientRects.forEach(cb);
    forEachRect(callback);
  }
  function actuallyGetRangeBoundingRect(range2) {
    if (microsoft || browser4.chrome || browser4.safari) {
      var rectangles = range2.getClientRects(), box = {
        top: Infinity,
        right: -Infinity,
        bottom: -Infinity,
        left: Infinity
      }, done = false;
      for (var i = 0; i < rectangles.length; ++i) {
        var b = rectangles[i];
        if (b.width <= 1 || b.bottom === prevLineBottom) {
          continue;
        }
        box.left = Math.min(b.left, box.left);
        box.top = Math.min(b.top, box.top);
        box.right = Math.max(b.right, box.right);
        box.bottom = Math.max(b.bottom, box.bottom);
        done = true;
      }
      if (!done) {
        return range2.getBoundingClientRect();
      }
      box.width = box.right - box.left;
      box.height = box.bottom - box.top;
      return box;
    }
    return range2.getBoundingClientRect();
  }
  function doChunk() {
    var origStart = start;
    var box, pos = text.substr(start).search(/\S/);
    start += pos;
    if (pos < 0 || start >= end) {
      return true;
    }
    range.setStart(node, start);
    range.setEnd(node, start + 1);
    box = actuallyGetRangeBoundingRect(range);
    var found = false;
    if (isJustified || columnCount > 1) {
      pos = text.substr(start).search(/\s/);
      if (pos >= 0) {
        range.setEnd(node, start + pos);
        var r = actuallyGetRangeBoundingRect(range);
        if (r.bottom == box.bottom) {
          box = r;
          found = true;
          start += pos;
        }
      }
    }
    if (!found) {
      pos = (function findEOL(min, eol, max) {
        range.setEnd(node, eol);
        var r2 = actuallyGetRangeBoundingRect(range);
        if (r2.bottom != box.bottom && min < eol) {
          return findEOL(min, min + eol >> 1, eol);
        } else if (r2.right != box.right) {
          box = r2;
          if (eol < max) {
            return findEOL(eol, eol + max >> 1, max);
          } else {
            return eol;
          }
        } else {
          return eol;
        }
      })(start, Math.min(end, start + estimateLineLength), end);
      if (pos == start) {
        return true;
      }
      start = pos;
      pos = range.toString().search(/\s+$/);
      if (pos === 0) {
        return false;
      }
      if (pos > 0) {
        range.setEnd(node, range.startOffset + pos);
        box = actuallyGetRangeBoundingRect(range);
      }
    }
    if (microsoft) {
      box = range.getClientRects()[0];
    }
    var str = range.toString();
    if (!/^(?:pre|pre-wrap)$/i.test(whiteSpace)) {
      str = str.replace(/\s+/g, " ");
    } else if (/\t/.test(str)) {
      var cc = 0;
      for (pos = origStart; pos < range.startOffset; ++pos) {
        var code = text.charCodeAt(pos);
        if (code == 9) {
          cc += 8 - cc % 8;
        } else if (code == 10 || code == 13) {
          cc = 0;
        } else {
          cc++;
        }
      }
      while ((pos = str.search("	")) >= 0) {
        var indent = "        ".substr(0, 8 - (cc + pos) % 8);
        str = str.substr(0, pos) + indent + str.substr(pos + 1);
      }
    }
    if (!found) {
      prevLineBottom = box.bottom;
    }
    drawText2(str, box);
  }
  function drawText2(str, box) {
    if (microsoft && !isNaN(lineHeight)) {
      var height = getFontHeight(font);
      var top = (box.top + box.bottom - height) / 2;
      box = {
        top,
        right: box.right,
        bottom: top + height,
        left: box.left,
        height,
        width: box.right - box.left
      };
    }
    switch (textTransform) {
      case "uppercase":
        str = str.toUpperCase();
        break;
      case "lowercase":
        str = str.toLowerCase();
        break;
      case "capitalize":
        str = str.replace(/(?:^|\s)\S/g, (l) => l.toUpperCase());
        break;
    }
    var text2 = new TextRect(
      str,
      new rect_default(
        [box.left, box.top],
        [box.width, box.height]
      ),
      {
        font,
        fill: { color }
      }
    );
    group.append(text2);
  }
  function drawTextLine(lineWidth, textBox, color2, ypos) {
    if (color2) {
      var path = new Path({ stroke: {
        width: lineWidth,
        color: color2
      } });
      ypos -= lineWidth;
      path.moveTo(textBox.left, ypos).lineTo(textBox.right, ypos);
      group.append(path);
    }
  }
  function decorateOver(box) {
    let width = fontSize / 12;
    drawTextLine(width, box, lineThrough, box.bottom - box.height / 2.7);
    drawTextLine(width, box, overline, box.top);
  }
  function decorateUnder(box) {
    let width = fontSize / 12;
    let underlinePos = box.bottom;
    if (underlineOffset != null) {
      underlinePos += underlineOffset;
    } else {
      underlinePos += width;
    }
    drawTextLine(width, box, underline, underlinePos);
  }
}
function groupInStackingContext(element, group, zIndex) {
  var main;
  if (zIndex != "auto") {
    main = nodeInfo._stackingContext.group;
    zIndex = parseFloat(zIndex);
  } else {
    main = group;
    zIndex = 0;
  }
  var a = main.children;
  for (var i = 0; i < a.length; ++i) {
    if (a[i]._dom_zIndex != null && a[i]._dom_zIndex > zIndex) {
      break;
    }
  }
  var tmp = new group_default();
  main.insert(i, tmp);
  tmp._dom_zIndex = zIndex;
  if (main !== group) {
    if (nodeInfo._clipbox) {
      var m = nodeInfo._matrix.invert();
      var r = nodeInfo._clipbox.transformCopy(m);
      setClipping2(tmp, Path.fromRect(r));
    }
  }
  return tmp;
}
function renderElement(element, container) {
  var style = getComputedStyle2(element);
  updateCounters(style);
  if (/^(style|script|link|meta|iframe|col|colgroup)$/i.test(element.tagName)) {
    return;
  }
  if (nodeInfo._clipbox == null) {
    return;
  }
  var opacity = parseFloat(getPropertyValue(style, "opacity"));
  var visibility = getPropertyValue(style, "visibility");
  var display = getPropertyValue(style, "display");
  if (opacity === 0 || visibility == "hidden" || display == "none") {
    return;
  }
  var tr = getTransform(style);
  var group;
  var zIndex = getPropertyValue(style, "z-index");
  if ((tr || opacity < 1) && zIndex == "auto") {
    zIndex = 0;
  }
  group = groupInStackingContext(element, container, zIndex);
  if (opacity < 1) {
    group.opacity(opacity * group.opacity());
  }
  pushNodeInfo(element, style, group);
  if (!tr) {
    _renderWithPseudoElements(element, group);
  } else {
    saveStyle(element, function() {
      pleaseSetPropertyValue(element.style, "transform", "none", "important");
      pleaseSetPropertyValue(element.style, "transition", "none", "important");
      if (getPropertyValue(style, "position") == "static") {
        pleaseSetPropertyValue(element.style, "position", "relative", "important");
      }
      var bbox = element.getBoundingClientRect();
      var x = bbox.left + tr.origin[0];
      var y = bbox.top + tr.origin[1];
      var m = [1, 0, 0, 1, -x, -y];
      m = mmul2(m, tr.matrix);
      m = mmul2(m, [1, 0, 0, 1, x, y]);
      m = setTransform(group, m);
      nodeInfo._matrix = nodeInfo._matrix.multiplyCopy(m);
      _renderWithPseudoElements(element, group);
    });
  }
  popNodeInfo();
}
function mmul2(a, b) {
  var a1 = a[0], b1 = a[1], c1 = a[2], d1 = a[3], e1 = a[4], f1 = a[5];
  var a2 = b[0], b2 = b[1], c2 = b[2], d2 = b[3], e2 = b[4], f2 = b[5];
  return [
    a1 * a2 + b1 * c2,
    a1 * b2 + b1 * d2,
    c1 * a2 + d1 * c2,
    c1 * b2 + d1 * d2,
    e1 * a2 + f1 * c2 + e2,
    e1 * b2 + f1 * d2 + f2
  ];
}

export {
  named_colors_default,
  parseColor,
  color_default,
  geometry_exports,
  Path,
  MultiPath,
  image_default,
  group_default,
  surface_default4 as surface_default,
  exportImage,
  drawing_exports,
  exportPDF,
  drawDOM
};
//# sourceMappingURL=chunk-2MHMQMIE.js.map
