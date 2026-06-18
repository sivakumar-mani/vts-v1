import {
  detectDesktopBrowser,
  detectMobileOS
} from "./chunk-TMIPDDRB.js";
import {
  N,
  u
} from "./chunk-T2SKS23Q.js";
import {
  NgStyle,
  NgTemplateOutlet
} from "./chunk-SMKKFHGX.js";
import {
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injectable,
  InjectionToken,
  Input,
  NgZone,
  Optional,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  isDevMode,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵpureFunction4,
  ɵɵpureFunction6,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-EAUF2VNQ.js";
import {
  fromEvent,
  merge
} from "./chunk-6GJRAX4D.js";
import {
  Subscription,
  auditTime,
  from,
  take
} from "./chunk-VT3VMPII.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-N6ESDQJH.js";

// node_modules/@progress/kendo-draggable/dist/es/main.js
var proxy = function(a, b) {
  return function(e) {
    return b(a(e));
  };
};
var bind = function(el, event, callback) {
  return el.addEventListener && el.addEventListener(event, callback);
};
var unbind = function(el, event, callback) {
  return el && el.removeEventListener && el.removeEventListener(event, callback);
};
var noop = function() {
};
var preventDefault = function(e) {
  return e.preventDefault();
};
var touchRegExp = /touch/;
var IGNORE_MOUSE_TIMEOUT = 2e3;
function normalizeEvent(e) {
  if (e.type.match(touchRegExp)) {
    return {
      pageX: e.changedTouches[0].pageX,
      pageY: e.changedTouches[0].pageY,
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
      type: e.type,
      originalEvent: e,
      isTouch: true
    };
  }
  return {
    pageX: e.pageX,
    pageY: e.pageY,
    clientX: e.clientX,
    clientY: e.clientY,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
    type: e.type,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    originalEvent: e
  };
}
var Draggable = function Draggable2(ref) {
  var this$1 = this;
  var press = ref.press;
  if (press === void 0) press = noop;
  var drag = ref.drag;
  if (drag === void 0) drag = noop;
  var release = ref.release;
  if (release === void 0) release = noop;
  var mouseOnly = ref.mouseOnly;
  if (mouseOnly === void 0) mouseOnly = false;
  this._pressHandler = proxy(normalizeEvent, press);
  this._dragHandler = proxy(normalizeEvent, drag);
  this._releaseHandler = proxy(normalizeEvent, release);
  this._ignoreMouse = false;
  this._mouseOnly = mouseOnly;
  this._touchstart = function(e) {
    if (e.touches.length === 1) {
      this$1._pressHandler(e);
    }
  };
  this._touchmove = function(e) {
    if (e.touches.length === 1) {
      this$1._dragHandler(e);
    }
  };
  this._touchend = function(e) {
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
      this$1._releaseHandler(e);
      this$1._ignoreMouse = true;
      setTimeout(this$1._restoreMouse, IGNORE_MOUSE_TIMEOUT);
    }
  };
  this._restoreMouse = function() {
    this$1._ignoreMouse = false;
  };
  this._mousedown = function(e) {
    var which = e.which;
    if (which && which > 1 || this$1._ignoreMouse) {
      return;
    }
    bind(this$1.document, "mousemove", this$1._mousemove);
    bind(this$1.document, "mouseup", this$1._mouseup);
    this$1._pressHandler(e);
  };
  this._mousemove = function(e) {
    this$1._dragHandler(e);
  };
  this._mouseup = function(e) {
    unbind(this$1.document, "mousemove", this$1._mousemove);
    unbind(this$1.document, "mouseup", this$1._mouseup);
    this$1._releaseHandler(e);
  };
  this._pointerdown = function(e) {
    if (e.isPrimary && e.button === 0) {
      bind(this$1.document, "pointermove", this$1._pointermove);
      bind(this$1.document, "pointerup", this$1._pointerup);
      bind(this$1.document, "pointercancel", this$1._pointerup);
      bind(this$1.document, "contextmenu", preventDefault);
      this$1._pressHandler(e);
    }
  };
  this._pointermove = function(e) {
    if (e.isPrimary) {
      this$1._dragHandler(e);
    }
  };
  this._pointerup = function(e) {
    if (e.isPrimary) {
      unbind(this$1.document, "pointermove", this$1._pointermove);
      unbind(this$1.document, "pointerup", this$1._pointerup);
      unbind(this$1.document, "pointercancel", this$1._pointerup);
      unbind(this$1.document, "contextmenu", preventDefault);
      this$1._releaseHandler(e);
    }
  };
};
var prototypeAccessors = { document: { configurable: true } };
Draggable.supportPointerEvent = function supportPointerEvent() {
  return typeof window !== "undefined" && window.PointerEvent;
};
prototypeAccessors.document.get = function() {
  return this._element ? this._element.ownerDocument : document;
};
Draggable.prototype.cancelDrag = function cancelDrag() {
  unbind(this.document, "pointermove", this._pointermove);
  unbind(this.document, "pointerup", this._pointerup);
  unbind(this.document, "pointercancel", this._pointerup);
};
Draggable.prototype.bindTo = function bindTo(element) {
  if (element === this._element) {
    return;
  }
  if (this._element) {
    this._unbindFromCurrent();
  }
  this._element = element;
  this._bindToCurrent();
};
Draggable.prototype._bindToCurrent = function _bindToCurrent() {
  var element = this._element;
  if (this._usePointers()) {
    bind(element, "pointerdown", this._pointerdown);
    return;
  }
  bind(element, "mousedown", this._mousedown);
  if (!this._mouseOnly) {
    bind(element, "touchstart", this._touchstart);
    bind(element, "touchmove", this._touchmove);
    bind(element, "touchend", this._touchend);
  }
};
Draggable.prototype._unbindFromCurrent = function _unbindFromCurrent() {
  var element = this._element;
  if (this._usePointers()) {
    unbind(element, "pointerdown", this._pointerdown);
    unbind(this.document, "pointermove", this._pointermove);
    unbind(this.document, "pointerup", this._pointerup);
    unbind(this.document, "contextmenu", preventDefault);
    unbind(this.document, "pointercancel", this._pointerup);
    return;
  }
  unbind(element, "mousedown", this._mousedown);
  if (!this._mouseOnly) {
    unbind(element, "touchstart", this._touchstart);
    unbind(element, "touchmove", this._touchmove);
    unbind(element, "touchend", this._touchend);
  }
};
Draggable.prototype._usePointers = function _usePointers() {
  return !this._mouseOnly && Draggable.supportPointerEvent();
};
Draggable.prototype.update = function update(ref) {
  var press = ref.press;
  if (press === void 0) press = noop;
  var drag = ref.drag;
  if (drag === void 0) drag = noop;
  var release = ref.release;
  if (release === void 0) release = noop;
  var mouseOnly = ref.mouseOnly;
  if (mouseOnly === void 0) mouseOnly = false;
  this._pressHandler = proxy(normalizeEvent, press);
  this._dragHandler = proxy(normalizeEvent, drag);
  this._releaseHandler = proxy(normalizeEvent, release);
  this._mouseOnly = mouseOnly;
};
Draggable.prototype.destroy = function destroy() {
  this._unbindFromCurrent();
  this._element = null;
};
Object.defineProperties(Draggable.prototype, prototypeAccessors);
Draggable.default = Draggable;

// node_modules/@progress/kendo-angular-common/fesm2022/progress-kendo-angular-common.mjs
var _c0 = ["banner"];
var _c1 = ["kendoWatermarkOverlay", ""];
var _c2 = (a0, a1, a2, a3) => ({
  backgroundColor: a0,
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  padding: "4px",
  position: a1,
  top: a2,
  right: a3
});
var _c3 = (a0) => ({
  display: "inline-flex",
  border: "none",
  borderRadius: "4px",
  backgroundColor: a0,
  color: "#ffffff",
  transition: "background-color 0.2s ease-in-out",
  cursor: "pointer",
  padding: "4px 8px",
  whiteSpace: "nowrap",
  textDecoration: "none",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
});
var _c4 = (a0, a1, a2, a3, a4, a5) => ({
  position: "fixed",
  top: a0,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: a1,
  justifyContent: "center",
  alignItems: a2,
  borderRadius: a3,
  borderLeft: "6px solid #FFC000",
  borderTop: "1px solid #00000029",
  borderRight: "1px solid #00000029",
  borderBottom: "1px solid #00000029",
  boxSizing: "border-box",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#1E1E1E",
  zIndex: 2e3,
  boxShadow: "0px 4px 5px 0px #0000000A, 0px 2px 4px 0px #00000008",
  maxWidth: a4,
  width: "100%",
  backgroundColor: "#fff",
  padding: a5
});
var _c5 = (a0, a1) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: a0,
  flex: a1
});
var _c6 = (a0, a1) => ({
  display: "flex",
  alignSelf: a0,
  padding: a1
});
var _c7 = (a0) => ({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  flex: a0
});
var _c8 = () => ({
  fontFamily: "system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "142%"
});
var _c9 = () => ({
  fontFamily: "system-ui, sans-serif",
  fontSize: "14px",
  lineHeight: "20px"
});
var _c10 = (a0, a1, a2) => ({
  display: "flex",
  alignItems: "center",
  padding: a0,
  gap: "16px",
  marginLeft: a1,
  width: a2
});
var _forTrack0 = ($index, $item) => $item.message;
function WatermarkOverlayComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 4);
    ɵɵlistener("click", function WatermarkOverlayComponent_ng_template_0_Template_button_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.closeBanner());
    })("mouseenter", function WatermarkOverlayComponent_ng_template_0_Template_button_mouseenter_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isCloseHovered = true);
    })("mouseleave", function WatermarkOverlayComponent_ng_template_0_Template_button_mouseleave_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isCloseHovered = false);
    });
    ɵɵnamespaceSVG();
    ɵɵelementStart(1, "svg", 5);
    ɵɵelement(2, "path", 6);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngStyle", ɵɵpureFunction4(1, _c2, ctx_r1.isCloseHovered ? "#3d3d3d14" : "transparent", ctx_r1.isMobile ? "absolute" : "static", ctx_r1.isMobile ? "12px" : "auto", ctx_r1.isMobile ? "12px" : "auto"));
  }
}
function WatermarkOverlayComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 7);
    ɵɵlistener("mouseenter", function WatermarkOverlayComponent_ng_template_2_Template_a_mouseenter_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isCTAHovered = true);
    })("mouseleave", function WatermarkOverlayComponent_ng_template_2_Template_a_mouseleave_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.isCTAHovered = false);
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngStyle", ɵɵpureFunction1(4, _c3, ctx_r1.isCTAHovered ? "#b90138" : "#eb0249"));
    ɵɵattribute("title", ctx_r1.getContent(ctx_r1.primaryMessage).buttonText)("href", ctx_r1.getContent(ctx_r1.primaryMessage).buttonLink, ɵɵsanitizeUrl);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.getContent(ctx_r1.primaryMessage).buttonText);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, WatermarkOverlayComponent_Conditional_4_Conditional_2_ng_container_0_Template, 1, 0, "ng-container", 8);
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const buttonTemplate_r4 = ɵɵreference(1);
    ɵɵproperty("ngTemplateOutlet", buttonTemplate_r4);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 3);
    ɵɵelement(1, "img", 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngStyle", ɵɵpureFunction2(2, _c6, ctx_r1.isMobile ? "flex-start" : "center", ctx_r1.isMobile ? "0 0 12px 0" : "9px 12px"));
    ɵɵadvance();
    ɵɵproperty("src", ctx_r1.getContent(ctx_r1.primaryMessage).iconSrc, ɵɵsanitizeUrl);
  }
}
function WatermarkOverlayComponent_Conditional_4_For_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3)(1, "span", 3);
    ɵɵtext(2);
    ɵɵelementEnd();
    ɵɵelement(3, "span", 10);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const msg_r5 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngStyle", ɵɵpureFunction1(5, _c7, ctx_r1.isMobile ? "none" : "1"));
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction0(7, _c8));
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r1.getContent(msg_r5).title, " ");
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction0(8, _c9))("innerHTML", ctx_r1.getContent(msg_r5).description, ɵɵsanitizeHtml);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_7_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, WatermarkOverlayComponent_Conditional_4_Conditional_7_ng_container_0_Template, 1, 0, "ng-container", 8);
  }
  if (rf & 2) {
    ɵɵnextContext(2);
    const ctaTemplate_r6 = ɵɵreference(3);
    ɵɵproperty("ngTemplateOutlet", ctaTemplate_r6);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_8_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_8_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WatermarkOverlayComponent_Conditional_4_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵtemplate(1, WatermarkOverlayComponent_Conditional_4_Conditional_8_ng_container_1_Template, 1, 0, "ng-container", 8)(2, WatermarkOverlayComponent_Conditional_4_Conditional_8_ng_container_2_Template, 1, 0, "ng-container", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    const buttonTemplate_r4 = ɵɵreference(1);
    const ctaTemplate_r6 = ɵɵreference(3);
    ɵɵproperty("ngStyle", ɵɵpureFunction3(3, _c10, ctx_r1.isMobile ? "0" : "9px 12px", ctx_r1.isMobile ? "0" : "auto", ctx_r1.isMobile ? "100%" : "auto"));
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctaTemplate_r6);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", buttonTemplate_r4);
  }
}
function WatermarkOverlayComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3, 2);
    ɵɵconditionalCreate(2, WatermarkOverlayComponent_Conditional_4_Conditional_2_Template, 1, 1, "ng-container");
    ɵɵconditionalCreate(3, WatermarkOverlayComponent_Conditional_4_Conditional_3_Template, 2, 5, "span", 3);
    ɵɵelementStart(4, "div", 3);
    ɵɵrepeaterCreate(5, WatermarkOverlayComponent_Conditional_4_For_6_Template, 4, 9, "div", 3, _forTrack0);
    ɵɵconditionalCreate(7, WatermarkOverlayComponent_Conditional_4_Conditional_7_Template, 1, 1, "ng-container");
    ɵɵelementEnd();
    ɵɵconditionalCreate(8, WatermarkOverlayComponent_Conditional_4_Conditional_8_Template, 3, 7, "div", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngStyle", ɵɵpureFunction6(6, _c4, ctx_r1.isNarrow ? "0" : "16px", ctx_r1.isMobile ? "column" : "row", ctx_r1.isMobile ? "flex-start" : "center", ctx_r1.isNarrow ? "0" : "6px", ctx_r1.isNarrow ? "none" : "768px", ctx_r1.isMobile ? "12px" : "0"));
    ɵɵadvance(2);
    ɵɵconditional(ctx_r1.isMobile ? 2 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.getContent(ctx_r1.primaryMessage).iconSrc ? 3 : -1);
    ɵɵadvance();
    ɵɵproperty("ngStyle", ɵɵpureFunction2(13, _c5, ctx_r1.isMobile ? "0 0 12px 0" : "12px", ctx_r1.isMobile ? "none" : "1"));
    ɵɵadvance();
    ɵɵrepeater(ctx_r1.messages);
    ɵɵadvance(2);
    ɵɵconditional(ctx_r1.isMobile ? 7 : -1);
    ɵɵadvance();
    ɵɵconditional(!ctx_r1.isMobile ? 8 : -1);
  }
}
var isDocumentAvailable = () => typeof document !== "undefined";
var isChanged = (propertyName, changes, skipFirstChange = true) => typeof changes[propertyName] !== "undefined" && (!changes[propertyName].isFirstChange() || !skipFirstChange) && changes[propertyName].previousValue !== changes[propertyName].currentValue;
var anyChanged = (propertyNames, changes, skipFirstChange = true) => propertyNames.some((name) => isChanged(name, changes, skipFirstChange));
var hasObservers = (emitter) => emitter && emitter.observers.length > 0;
var guid = () => {
  let id = "";
  for (let i = 0; i < 32; i++) {
    const random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      id += "-";
    }
    let charValue;
    if (i === 12) {
      charValue = 4;
    } else if (i === 16) {
      charValue = random & 3 | 8;
    } else {
      charValue = random;
    }
    id += charValue.toString(16);
  }
  return id;
};
var isSafari = (userAgent) => {
  return detectDesktopBrowser(userAgent).safari || detectMobileOS(userAgent) && detectMobileOS(userAgent).browser === "mobilesafari";
};
var isFirefox = (userAgent) => {
  const desktopBrowser = detectDesktopBrowser(userAgent);
  const mobileOS = detectMobileOS(userAgent);
  return desktopBrowser?.mozilla || mobileOS?.browser === "firefox";
};
var firefoxMaxHeight = 17895697;
var isPresent = (value) => value !== null && value !== void 0;
var isObjectPresent = (value) => {
  return isObject(value) && Object.keys(value).length > 0;
};
var isString = (value) => value instanceof String || typeof value === "string";
var isObject = (value) => isPresent(value) && !Array.isArray(value) && typeof value === "object";
var isSet = (value) => isPresent(value) && value instanceof Set;
var splitStringToArray = (value) => value.trim().replace(/\s+/g, " ").split(" ");
var parseCSSClassNames = (value) => {
  if (Array.isArray(value)) {
    return parseArrayClassNames(value);
  }
  if (isSet(value)) {
    return parseArrayClassNames(Array.from(value));
  }
  if (isObject(value)) {
    return parseObjectClassNames(value);
  }
  if (isString(value)) {
    return parseStringClassNames(value);
  }
};
var parseObjectClassNames = (value) => {
  const classes = [];
  Object.keys(value).forEach((className) => {
    const currentClassName = splitStringToArray(className);
    if (value[className] && currentClassName.length) {
      classes.push(...currentClassName);
    }
  });
  return classes;
};
var parseStringClassNames = (value) => {
  const classes = [];
  const classesArray = splitStringToArray(value);
  classesArray.forEach((className) => {
    classes.push(className);
  });
  return classes;
};
var parseArrayClassNames = (value) => {
  const classes = [];
  value.forEach((className) => {
    const current = splitStringToArray(className);
    if (current[0]) {
      classes.push(...current);
    }
  });
  return classes;
};
var setHTMLAttributes = (attributes, renderer, element, zone) => {
  if (zone) {
    zone.onStable.pipe(take(1)).subscribe(() => {
      applyAttributes(attributes, renderer, element);
    });
  } else {
    applyAttributes(attributes, renderer, element);
  }
};
var removeHTMLAttributes = (attributes, renderer, element) => {
  for (const attribute in attributes) {
    if (attribute) {
      renderer.removeAttribute(element, attribute);
    }
  }
};
var parseAttributes = (target, source) => {
  const targetObj = target;
  Object.keys(source).forEach((key) => {
    delete targetObj[key];
  });
  return targetObj;
};
var applyAttributes = (attributes, renderer, element) => {
  for (const attribute in attributes) {
    if (attribute && isPresent(attributes[attribute])) {
      renderer.setAttribute(element, attribute, attributes[attribute]);
    }
  }
};
var isControlRequired = (control) => {
  if (!control?.validator) {
    return false;
  }
  return control.validator(control)?.hasOwnProperty("required");
};
var areObjectsEqual = (firstObject, secondObject) => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }
  const equalSettings = Object.entries(firstObject).filter(([key, value]) => value === secondObject[key.toString()]);
  return equalSettings.length === Object.keys(firstObject).length;
};
var processCssValue = (value) => {
  if (typeof value === "number") {
    return `${value}px`;
  } else if (typeof value === "string") {
    const trimmedValue = value.trim();
    const numValue = parseInt(trimmedValue, 10);
    if (!isNaN(numValue) && Number.isFinite(numValue)) {
      if (numValue.toString() === trimmedValue) {
        return `${numValue}px`;
      } else {
        return value;
      }
    }
    return null;
  }
  return null;
};
var DraggableDirective = class _DraggableDirective {
  element;
  ngZone;
  enableDrag = true;
  kendoPress = new EventEmitter();
  kendoDrag = new EventEmitter();
  kendoRelease = new EventEmitter();
  draggable;
  constructor(element, ngZone) {
    this.element = element;
    this.ngZone = ngZone;
  }
  ngOnInit() {
    this.toggleDraggable();
  }
  ngOnChanges(changes) {
    if (isChanged("enableDrag", changes)) {
      this.toggleDraggable();
    }
  }
  ngOnDestroy() {
    this.destroyDraggable();
  }
  toggleDraggable() {
    if (isDocumentAvailable()) {
      this.destroyDraggable();
      if (this.enableDrag) {
        this.draggable = new Draggable({
          drag: (e) => this.kendoDrag.next(e),
          press: (e) => this.kendoPress.next(e),
          release: (e) => this.kendoRelease.next(e)
        });
        this.ngZone.runOutsideAngular(() => this.draggable?.bindTo(this.element.nativeElement));
      }
    }
  }
  destroyDraggable() {
    if (this.draggable) {
      this.draggable.destroy();
      this.draggable = void 0;
    }
  }
  static ɵfac = function DraggableDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DraggableDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _DraggableDirective,
    selectors: [["", "kendoDraggable", ""]],
    inputs: {
      enableDrag: "enableDrag"
    },
    outputs: {
      kendoPress: "kendoPress",
      kendoDrag: "kendoDrag",
      kendoRelease: "kendoRelease"
    },
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DraggableDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoDraggable]",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }], {
    enableDrag: [{
      type: Input
    }],
    kendoPress: [{
      type: Output
    }],
    kendoDrag: [{
      type: Output
    }],
    kendoRelease: [{
      type: Output
    }]
  });
})();
var closestInScope = (node, predicate, scope) => {
  while (node && node !== scope && !predicate(node)) {
    node = node.parentNode;
  }
  if (node !== scope) {
    return node;
  }
  return void 0;
};
var closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};
var contains = (parent, node, matchSelf = false) => {
  const outside = !closest(node, (child) => child === parent);
  if (outside) {
    return false;
  }
  const el = closest(node, (child) => child === node);
  return el && (matchSelf || el !== parent);
};
var findElement = (node, predicate, matchSelf = true) => {
  if (!node) {
    return;
  }
  if (matchSelf && predicate(node)) {
    return node;
  }
  node = node.firstChild;
  while (node) {
    if (node.nodeType === 1) {
      const element = findElement(node, predicate);
      if (element) {
        return element;
      }
    }
    node = node.nextSibling;
  }
};
var focusableRegex = /^(?:a|input|select|option|textarea|button|object)$/i;
var isFocusable = (element) => {
  if (!element.tagName) {
    return false;
  }
  const tagName = element.tagName.toLowerCase();
  const hasTabIndex = Boolean(element.getAttribute("tabIndex"));
  const focusable = !element.disabled && focusableRegex.test(tagName);
  return focusable || hasTabIndex;
};
var hasFocusableParent = (element, container) => {
  let currentElement = element;
  let hasFocusableParent2 = false;
  while (currentElement && currentElement !== container) {
    if (isFocusable(currentElement)) {
      hasFocusableParent2 = true;
      break;
    }
    currentElement = currentElement.parentElement;
  }
  return hasFocusableParent2;
};
var isVisible = (element) => {
  if (!isDocumentAvailable() || !element?.getBoundingClientRect) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  const hasSize = rect.width > 0 && rect.height > 0;
  const hasPosition = rect.x !== 0 && rect.y !== 0;
  return (hasSize || hasPosition) && window.getComputedStyle(element).visibility !== "hidden";
};
var isFocusableWithTabKey = (element, checkVisibility = true) => {
  if (!isFocusable(element)) {
    return false;
  }
  const tabIndex = element.getAttribute("tabIndex");
  const visible = !checkVisibility || isVisible(element);
  return visible && tabIndex !== "-1";
};
var findFocusableChild = (element, checkVisibility = true) => {
  return findElement(element, (node) => isFocusableWithTabKey(node, checkVisibility), false);
};
var findFocusable = (element, checkVisibility = true) => {
  return findElement(element, (node) => isFocusableWithTabKey(node, checkVisibility));
};
var toClassList = (classNames) => String(classNames).trim().split(" ");
var hasClasses = (element, classNames) => {
  const namesList = toClassList(classNames);
  return Boolean(toClassList(element.className).find((className) => namesList.indexOf(className) >= 0));
};
var matchesClasses = (classNames) => (element) => hasClasses(element, classNames);
var NODE_NAME_PREDICATES = {};
var matchesNodeName = (nodeName) => {
  if (!NODE_NAME_PREDICATES[nodeName]) {
    NODE_NAME_PREDICATES[nodeName] = (element) => String(element.nodeName).toLowerCase() === nodeName.toLowerCase();
  }
  return NODE_NAME_PREDICATES[nodeName];
};
function rtlScrollPosition(position, element, initial) {
  let result = position;
  if (initial < 0) {
    result = -position;
  } else if (initial > 0) {
    result = element.scrollWidth - element.offsetWidth - position;
  }
  return result;
}
function closestBySelector(element, selector) {
  if (element.closest) {
    return element.closest(selector);
  }
  const matches = Element.prototype.matches ? (el, sel) => el.matches(sel) : (el, sel) => el.msMatchesSelector(sel);
  let node = element;
  while (node && !isDocumentNode(node)) {
    if (matches(node, selector)) {
      return node;
    }
    node = node.parentNode;
  }
}
var isDocumentNode = (container) => container.nodeType === 9;
var EventsOutsideAngularDirective = class _EventsOutsideAngularDirective {
  element;
  ngZone;
  renderer;
  events = {};
  scope;
  subscriptions;
  constructor(element, ngZone, renderer) {
    this.element = element;
    this.ngZone = ngZone;
    this.renderer = renderer;
  }
  ngOnInit() {
    if (!this.element?.nativeElement) {
      return;
    }
    const events = this.events;
    this.subscriptions = [];
    this.ngZone.runOutsideAngular(() => {
      for (const name in events) {
        if (Object.hasOwnProperty.call(events, name)) {
          this.subscriptions?.push(this.renderer.listen(this.element.nativeElement, name, this.scope ? events[name].bind(this.scope) : events[name]));
        }
      }
    });
  }
  ngOnDestroy() {
    if (this.subscriptions) {
      for (let idx = 0; idx < this.subscriptions.length; idx++) {
        this.subscriptions[idx]();
      }
      this.subscriptions = null;
    }
  }
  static ɵfac = function EventsOutsideAngularDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _EventsOutsideAngularDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(Renderer2));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _EventsOutsideAngularDirective,
    selectors: [["", "kendoEventsOutsideAngular", ""]],
    inputs: {
      events: [0, "kendoEventsOutsideAngular", "events"],
      scope: "scope"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventsOutsideAngularDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoEventsOutsideAngular]",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: Renderer2
  }], {
    events: [{
      type: Input,
      args: ["kendoEventsOutsideAngular"]
    }],
    scope: [{
      type: Input
    }]
  });
})();
var ResizeService = class {
  resizeBatchService;
  resize = new EventEmitter();
  acceptedSize = false;
  lastWidth;
  lastHeight;
  state = 0;
  parentElement;
  constructor(resizeBatchService) {
    this.resizeBatchService = resizeBatchService;
  }
  acceptSize(size = this.measure()) {
    this.lastWidth = size.width;
    this.lastHeight = size.height;
    this.acceptedSize = true;
  }
  checkChanges() {
    if (!isDocumentAvailable()) {
      return;
    }
    if (this.state === 0) {
      this.state = 1;
      this.resizeBatchService.schedule(this, this.init);
    }
  }
  destroy() {
    this.resizeBatchService.cancel(this);
  }
  checkSize() {
    if (!this.parentElement) {
      return false;
    }
    const {
      width,
      height
    } = this.measure();
    const sameSize = width === this.lastWidth && height === this.lastHeight;
    if (sameSize) {
      return false;
    }
    this.lastWidth = width;
    this.lastHeight = height;
    this.acceptedSize = false;
    this.resize.emit({
      width,
      height
    });
    return true;
  }
  initSize() {
    const size = this.measure();
    this.lastWidth = size.width;
    this.lastHeight = size.height;
  }
  measure() {
    let width = 0;
    let height = 0;
    if (this.parentElement) {
      height = this.parentElement.offsetHeight;
      width = this.parentElement.offsetWidth;
    }
    return {
      height,
      width
    };
  }
};
var applyStyles = (el, styles) => {
  for (const prop in styles) {
    el.style.setProperty(prop, styles[prop]);
  }
};
var div = (styles) => {
  const el = document.createElement("div");
  applyStyles(el, styles);
  return el;
};
var computedProp = (elem, prop) => getComputedStyle(elem, null).getPropertyValue(prop);
var WRAP_STYLES = {
  "position": "absolute",
  "display": "block",
  "left": "0",
  "top": "0",
  "right": "0",
  "bottom": "0",
  "z-index": "-1",
  "overflow": "hidden",
  "visibility": "hidden"
};
var EXPAND_CHILD_STYLES = {
  "position": "absolute",
  "left": "0",
  "top": "0",
  "transition": "0s"
};
var SHRINK_CHILD_STYLES = __spreadProps(__spreadValues({}, EXPAND_CHILD_STYLES), {
  "width": "200%",
  "height": "200%"
});
var ResizeCompatService = class extends ResizeService {
  element;
  ngZone;
  expand;
  expandChild;
  shrink;
  subscription;
  constructor(resizeBatchService, element, ngZone) {
    super(resizeBatchService);
    this.element = element;
    this.ngZone = ngZone;
  }
  checkChanges() {
    if (this.state === 2) {
      if (!this.resizeBatchService.isScheduled(this)) {
        this.resizeBatchService.schedule(this, this.checkSize);
      }
      return;
    }
    super.checkChanges();
  }
  destroy() {
    super.destroy();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.expand) {
      const element = this.element?.nativeElement;
      element.removeChild(this.expand);
      element.removeChild(this.shrink);
      this.expand.removeChild(this.expandChild);
      this.expand = this.expandChild = this.shrink = this.element = null;
    }
  }
  checkSize() {
    if (super.checkSize()) {
      this.reset();
      return true;
    }
    return false;
  }
  init() {
    const parentElement = this.parentElement = this.element?.nativeElement.parentElement;
    if (computedProp(parentElement, "position") === "static") {
      parentElement.style.position = "relative";
    }
    this.state = 2;
    this.render();
    this.reset();
    this.initSize();
    this.subscribe();
  }
  render() {
    const element = this.element?.nativeElement;
    applyStyles(element, WRAP_STYLES);
    element.setAttribute("dir", "ltr");
    this.expand = div(WRAP_STYLES);
    this.expandChild = div(EXPAND_CHILD_STYLES);
    this.expand.appendChild(this.expandChild);
    element.appendChild(this.expand);
    this.shrink = div(WRAP_STYLES);
    const shrinkChild = div(SHRINK_CHILD_STYLES);
    this.shrink.appendChild(shrinkChild);
    element.appendChild(this.shrink);
  }
  reset() {
    const expandChild = this.expandChild;
    expandChild.style.width = "100000px";
    expandChild.style.height = "100000px";
    const expand = this.expand;
    expand.scrollLeft = 1e5;
    expand.scrollTop = 1e5;
    const shrink = this.shrink;
    shrink.scrollLeft = 1e5;
    shrink.scrollTop = 1e5;
  }
  subscribe() {
    this.ngZone.runOutsideAngular(() => {
      this.subscription = merge(fromEvent(this.shrink, "scroll"), fromEvent(this.expand, "scroll")).subscribe(() => {
        this.checkSize();
      });
    });
  }
};
var HAS_OBSERVER = typeof ResizeObserver !== "undefined";
var ResizeObserverService = class extends ResizeService {
  element;
  ngZone;
  resizeObserver;
  static supported() {
    return HAS_OBSERVER;
  }
  constructor(resizeBatchService, element, ngZone) {
    super(resizeBatchService);
    this.element = element;
    this.ngZone = ngZone;
  }
  destroy() {
    super.destroy();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.parentElement = null;
  }
  init() {
    this.parentElement = this.element.nativeElement.parentElement;
    this.initSize();
    this.state = 2;
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkSize();
      });
      this.resizeObserver.observe(this.parentElement);
    });
  }
};
var ResizeBatchService = class _ResizeBatchService {
  ngZone;
  scheduled = [];
  resolvedPromise = Promise.resolve(null);
  subscription;
  constructor(ngZone) {
    this.ngZone = ngZone;
    this.flush = this.flush.bind(this);
  }
  schedule(instance, method) {
    this.scheduled.push({
      instance,
      method
    });
    if (!this.subscription) {
      this.ngZone.runOutsideAngular(() => {
        this.subscription = from(this.resolvedPromise).subscribe(this.flush);
      });
    }
  }
  isScheduled(instance) {
    return Boolean(this.scheduled.find((item) => item.instance === instance));
  }
  cancel(instance) {
    const scheduled = this.scheduled;
    const count = scheduled.length;
    for (let idx = 0; idx < count; idx++) {
      if (scheduled[idx].instance === instance) {
        scheduled.splice(idx, 1);
        if (!scheduled.length) {
          this.unsubscribe();
        }
        return;
      }
    }
  }
  ngOnDestroy() {
    this.unsubscribe();
  }
  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  flush() {
    this.scheduled.forEach((item) => {
      item.method.call(item.instance);
    });
    this.scheduled = [];
    this.unsubscribe();
  }
  static ɵfac = function ResizeBatchService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResizeBatchService)(ɵɵinject(NgZone));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ResizeBatchService,
    factory: _ResizeBatchService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeBatchService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }], null);
})();
var DEFAULT_RATE_LIMIT = 10;
var ResizeSensorComponent = class _ResizeSensorComponent {
  /**
   * The maximum number of resize events to emit per second.
   *
   * Defaults to 10.
   */
  rateLimit = DEFAULT_RATE_LIMIT;
  /**
   * Fires when the parent DOM element has been resized.
   */
  resize = new EventEmitter();
  subscription;
  resizeService;
  constructor(resizeBatchService, element, ngZone) {
    const serviceType = ResizeObserverService.supported() ? ResizeObserverService : ResizeCompatService;
    this.resizeService = new serviceType(resizeBatchService, element, ngZone);
    const throttleTime = 1e3 / (this.rateLimit || DEFAULT_RATE_LIMIT);
    this.subscription = this.resizeService.resize.pipe(auditTime(throttleTime)).subscribe(({
      width,
      height
    }) => {
      if (!this.resizeService.acceptedSize) {
        this.resize.emit({
          width,
          height
        });
      }
    });
  }
  ngAfterViewChecked() {
    this.resizeService.checkChanges();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resizeService.destroy();
  }
  acceptSize(size) {
    this.resizeService.acceptSize(size);
  }
  static ɵfac = function ResizeSensorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ResizeSensorComponent)(ɵɵdirectiveInject(ResizeBatchService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ResizeSensorComponent,
    selectors: [["kendo-resize-sensor"]],
    inputs: {
      rateLimit: "rateLimit"
    },
    outputs: {
      resize: "resize"
    },
    decls: 0,
    vars: 0,
    template: function ResizeSensorComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizeSensorComponent, [{
    type: Component,
    args: [{
      selector: "kendo-resize-sensor",
      template: "",
      standalone: true
    }]
  }], () => [{
    type: ResizeBatchService
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    rateLimit: [{
      type: Input
    }],
    resize: [{
      type: Output
    }]
  });
})();
var KendoInput = class {
};
var KENDO_WEBMCP_HOST = new InjectionToken("KendoWebMcpHost");
var Keys;
(function(Keys2) {
  Keys2["ArrowDown"] = "ArrowDown";
  Keys2["ArrowLeft"] = "ArrowLeft";
  Keys2["ArrowRight"] = "ArrowRight";
  Keys2["ArrowUp"] = "ArrowUp";
  Keys2["Backspace"] = "Backspace";
  Keys2["Delete"] = "Delete";
  Keys2["Digit0"] = "Digit0";
  Keys2["Digit1"] = "Digit1";
  Keys2["Digit2"] = "Digit2";
  Keys2["Digit3"] = "Digit3";
  Keys2["Digit4"] = "Digit4";
  Keys2["Digit5"] = "Digit5";
  Keys2["Digit6"] = "Digit6";
  Keys2["Digit7"] = "Digit7";
  Keys2["Digit8"] = "Digit8";
  Keys2["Digit9"] = "Digit9";
  Keys2["End"] = "End";
  Keys2["Enter"] = "Enter";
  Keys2["Escape"] = "Escape";
  Keys2["F1"] = "F1";
  Keys2["F2"] = "F2";
  Keys2["F10"] = "F10";
  Keys2["Home"] = "Home";
  Keys2["KeyA"] = "KeyA";
  Keys2["KeyB"] = "KeyB";
  Keys2["KeyC"] = "KeyC";
  Keys2["KeyD"] = "KeyD";
  Keys2["KeyE"] = "KeyE";
  Keys2["KeyF"] = "KeyF";
  Keys2["KeyG"] = "KeyG";
  Keys2["KeyH"] = "KeyH";
  Keys2["KeyI"] = "KeyI";
  Keys2["KeyJ"] = "KeyJ";
  Keys2["KeyK"] = "KeyK";
  Keys2["KeyL"] = "KeyL";
  Keys2["KeyM"] = "KeyM";
  Keys2["KeyN"] = "KeyN";
  Keys2["KeyO"] = "KeyO";
  Keys2["KeyP"] = "KeyP";
  Keys2["KeyQ"] = "KeyQ";
  Keys2["KeyR"] = "KeyR";
  Keys2["KeyS"] = "KeyS";
  Keys2["KeyT"] = "KeyT";
  Keys2["KeyU"] = "KeyU";
  Keys2["KeyV"] = "KeyV";
  Keys2["KeyW"] = "KeyW";
  Keys2["KeyX"] = "KeyX";
  Keys2["KeyY"] = "KeyY";
  Keys2["KeyZ"] = "KeyZ";
  Keys2["Numpad1"] = "Numpad1";
  Keys2["Numpad2"] = "Numpad2";
  Keys2["Numpad3"] = "Numpad3";
  Keys2["Numpad4"] = "Numpad4";
  Keys2["Numpad5"] = "Numpad5";
  Keys2["Numpad6"] = "Numpad6";
  Keys2["Numpad7"] = "Numpad7";
  Keys2["Numpad8"] = "Numpad8";
  Keys2["Numpad9"] = "Numpad9";
  Keys2["Numpad0"] = "Numpad0";
  Keys2["NumpadEnter"] = "NumpadEnter";
  Keys2["NumpadDecimal"] = "NumpadDecimal";
  Keys2["PageDown"] = "PageDown";
  Keys2["PageUp"] = "PageUp";
  Keys2["Space"] = "Space";
  Keys2["Tab"] = "Tab";
})(Keys || (Keys = {}));
var focusableSelector = ['a[href]:not([tabindex^="-"]):not([disabled])', 'area[href]:not([tabindex^="-"]):not([disabled])', 'input:not([tabindex^="-"]):not([disabled])', 'select:not([tabindex^="-"]):not([disabled])', 'textarea:not([tabindex^="-"]):not([disabled])', 'button:not([tabindex^="-"]):not([disabled])', 'iframe:not([tabindex^="-"]):not([disabled])', 'object:not([tabindex^="-"]):not([disabled])', 'embed:not([tabindex^="-"]):not([disabled])', '*[tabindex]:not([tabindex^="-"]):not([disabled])', '*[contenteditable]:not([tabindex^="-"]):not([disabled]):not([contenteditable="false"])'].join(",");
var keyCodeToKeysMap = {
  65: Keys.KeyA,
  66: Keys.KeyB,
  67: Keys.KeyC,
  68: Keys.KeyD,
  69: Keys.KeyE,
  70: Keys.KeyF,
  71: Keys.KeyG,
  72: Keys.KeyH,
  73: Keys.KeyI,
  74: Keys.KeyJ,
  75: Keys.KeyK,
  76: Keys.KeyL,
  77: Keys.KeyM,
  78: Keys.KeyN,
  79: Keys.KeyO,
  80: Keys.KeyP,
  81: Keys.KeyQ,
  82: Keys.KeyR,
  83: Keys.KeyS,
  84: Keys.KeyT,
  85: Keys.KeyU,
  86: Keys.KeyV,
  87: Keys.KeyW,
  88: Keys.KeyX,
  89: Keys.KeyY,
  90: Keys.KeyZ
};
var normalizeKeys = (event) => {
  const keyCode = event.keyCode;
  if (keyCode >= 65 && keyCode <= 90) {
    const normalizedKey = keyCodeToKeysMap[keyCode];
    if (normalizedKey) {
      return normalizedKey;
    }
  }
  if (event.code === Keys.Numpad1 && event.key === Keys.End) {
    return Keys.End;
  }
  if (event.code === Keys.Numpad2 && event.key === Keys.ArrowDown) {
    return Keys.ArrowDown;
  }
  if (event.code === Keys.Numpad3 && event.key === Keys.PageDown) {
    return Keys.PageDown;
  }
  if (event.code === Keys.Numpad4 && event.key === Keys.ArrowLeft) {
    return Keys.ArrowLeft;
  }
  if (event.code === Keys.Numpad6 && event.key === Keys.ArrowRight) {
    return Keys.ArrowRight;
  }
  if (event.code === Keys.Numpad7 && event.key === Keys.Home) {
    return Keys.Home;
  }
  if (event.code === Keys.Numpad8 && event.key === Keys.ArrowUp) {
    return Keys.ArrowUp;
  }
  if (event.code === Keys.Numpad9 && event.key === Keys.PageUp) {
    return Keys.PageUp;
  }
  if (event.code === Keys.NumpadEnter) {
    return Keys.Enter;
  }
  return event.code;
};
var FIELD_REGEX$1 = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
var getterCache = {};
getterCache["undefined"] = () => void 0;
function getter(field) {
  if (getterCache[field]) {
    return getterCache[field];
  }
  const fields = [];
  field.replace(FIELD_REGEX$1, function(_match, index, indexAccessor, fieldName) {
    fields.push(index !== void 0 ? index : indexAccessor || fieldName);
  });
  getterCache[field] = function(obj) {
    let result = obj;
    for (let idx = 0; idx < fields.length && result; idx++) {
      result = result[fields[idx]];
    }
    return result;
  };
  return getterCache[field];
}
var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
var setterCache = {};
setterCache["undefined"] = (obj) => obj;
function setter(field) {
  if (setterCache[field]) {
    return setterCache[field];
  }
  const fields = [];
  field.replace(FIELD_REGEX, function(_match, index, indexAccessor, fieldName) {
    fields.push(index !== void 0 ? index : indexAccessor || fieldName);
  });
  setterCache[field] = function(obj, value) {
    let root = obj;
    const depth = fields.length - 1;
    for (let idx = 0; idx < depth && root; idx++) {
      root = root[fields[idx]] = root[fields[idx]] || {};
    }
    root[fields[depth]] = value;
  };
  return setterCache[field];
}
var watermarkStyles = `
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.2;
    zIndex: 101;
    pointerEvents: none;
    backgroundImage: url('data:image/png;base64,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');
`;
var licenseKeyUrl = "https://www.telerik.com/kendo-angular-ui/components/my-license/?utm_medium=product&utm_source=kendoangular&utm_campaign=kendo-ui-angular-purchase-license-keys-banner";
var bannerPresentOnPage = false;
var WatermarkOverlayComponent = class _WatermarkOverlayComponent {
  licenseMessage;
  banner;
  watermarkStyle = watermarkStyles;
  isOpen = true;
  isMobile = false;
  isNarrow = false;
  isCloseHovered = false;
  isCTAHovered = false;
  bannerMounted = false;
  get messages() {
    return [this.primaryMessage, ...this.extraMessages];
  }
  extraMessages = [];
  get primaryMessage() {
    return this.licenseMessage || {
      severity: "ERROR",
      productName: "",
      code: "",
      message: "",
      notificationTitle: "License key missing for Kendo UI for Angular.",
      notificationBody: `We couldn't verify your <a href="${this.licenseKeyUrl}">license key</a> for Kendo UI for Angular.Please see the browser console for details and resolution steps.`
    };
  }
  licenseKeyUrl = licenseKeyUrl;
  getContent(msg) {
    const iconContent = msg.notificationIcon?.content;
    return {
      iconSrc: iconContent ? `data:image/svg+xml;base64,${btoa(iconContent)}` : void 0,
      title: msg.notificationTitle || "",
      description: msg.notificationBody || msg.notificationMessage || "",
      buttonText: msg.callToAction?.message || "Buy Now",
      buttonLink: msg.callToAction?.link || "https://prgress.co/3PyHIoH"
    };
  }
  unsubscribeLicenseMessage = () => {
  };
  unsubscribeResize = () => {
  };
  ngOnInit() {
    if (bannerPresentOnPage || !this.licenseMessage || !isDocumentAvailable()) {
      return;
    }
    this.subscribeLicenseMessage();
    this.subscribeResize();
    bannerPresentOnPage = true;
  }
  ngAfterViewInit() {
    if (this.isBannerRendered) {
      document.body.appendChild(this.banner.nativeElement);
    }
  }
  ngOnDestroy() {
    this.unsubscribeLicenseMessage();
    this.unsubscribeResize();
    if (this.isBannerRendered) {
      document.body.removeChild(this.banner.nativeElement);
    }
  }
  closeBanner() {
    this.isOpen = false;
  }
  get isBannerRendered() {
    return isDocumentAvailable() && !!this.banner?.nativeElement;
  }
  subscribeLicenseMessage() {
    this.unsubscribeLicenseMessage = u(this.licenseMessage, "KENDOUIANGULAR", ({
      message
    }) => {
      this.extraMessages.push(message);
    }, () => {
      this.bannerMounted = true;
    });
  }
  subscribeResize() {
    const handleResize = () => {
      this.isMobile = window.innerWidth < 500;
      this.isNarrow = window.innerWidth < 768;
    };
    window.addEventListener("resize", handleResize);
    this.unsubscribeResize = () => window.removeEventListener("resize", handleResize);
  }
  // Used in tests to reset the static presence check flag
  resetPresenceCheck() {
    bannerPresentOnPage = false;
  }
  static ɵfac = function WatermarkOverlayComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WatermarkOverlayComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _WatermarkOverlayComponent,
    selectors: [["div", "kendoWatermarkOverlay", ""], ["kendo-watermark-overlay"]],
    viewQuery: function WatermarkOverlayComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.banner = _t.first);
      }
    },
    hostVars: 2,
    hostBindings: function WatermarkOverlayComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵstyleMap(ctx.watermarkStyle);
      }
    },
    inputs: {
      licenseMessage: "licenseMessage"
    },
    attrs: _c1,
    decls: 5,
    vars: 1,
    consts: [["buttonTemplate", ""], ["ctaTemplate", ""], ["banner", ""], [3, "ngStyle"], ["title", "Close", 3, "click", "mouseenter", "mouseleave", "ngStyle"], ["width", "20", "height", "20", "viewBox", "0 0 16 16", "fill", "none"], ["d", "M11.9309 3.1838C12.1754 2.93933 12.5712 2.93937 12.8157 3.1838C13.0601 3.4283 13.0601 3.82407 12.8157 4.06857L8.885 7.99923L12.8166 11.9309C13.0611 12.1754 13.0611 12.5721 12.8166 12.8166C12.5721 13.0611 12.1754 13.0611 11.9309 12.8166L7.99925 8.88497L4.06859 12.8166C3.8241 13.0611 3.42732 13.0611 3.18285 12.8166C2.93862 12.5721 2.93851 12.1753 3.18285 11.9309L7.11449 7.99923L3.18382 4.06857C2.93947 3.82413 2.93955 3.42829 3.18382 3.1838C3.42831 2.9393 3.82508 2.9393 4.06957 3.1838L7.99925 7.11349L11.9309 3.1838Z", "fill", "#212529"], ["target", "_blank", "rel", "noopener noreferrer", 1, "k-watermark-trial-button", 3, "mouseenter", "mouseleave", "ngStyle"], [4, "ngTemplateOutlet"], ["alt", "", 3, "src"], [3, "ngStyle", "innerHTML"]],
    template: function WatermarkOverlayComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, WatermarkOverlayComponent_ng_template_0_Template, 3, 6, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, WatermarkOverlayComponent_ng_template_2_Template, 2, 6, "ng-template", null, 1, ɵɵtemplateRefExtractor);
        ɵɵconditionalCreate(4, WatermarkOverlayComponent_Conditional_4_Template, 9, 16, "div", 3);
      }
      if (rf & 2) {
        ɵɵadvance(4);
        ɵɵconditional(ctx.isOpen && ctx.bannerMounted ? 4 : -1);
      }
    },
    dependencies: [NgStyle, NgTemplateOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WatermarkOverlayComponent, [{
    type: Component,
    args: [{
      selector: "div[kendoWatermarkOverlay], kendo-watermark-overlay",
      template: `
        <ng-template #buttonTemplate>
            <button
                [ngStyle]="{
                    backgroundColor: isCloseHovered ? '#3d3d3d14' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: '4px',
                    position: isMobile ? 'absolute' : 'static',
                    top: isMobile ? '12px' : 'auto',
                    right: isMobile ? '12px' : 'auto'
                }"
                title="Close"
                (click)="closeBanner()"
                (mouseenter)="isCloseHovered = true"
                (mouseleave)="isCloseHovered = false"
            >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M11.9309 3.1838C12.1754 2.93933 12.5712 2.93937 12.8157 3.1838C13.0601 3.4283 13.0601 3.82407 12.8157 4.06857L8.885 7.99923L12.8166 11.9309C13.0611 12.1754 13.0611 12.5721 12.8166 12.8166C12.5721 13.0611 12.1754 13.0611 11.9309 12.8166L7.99925 8.88497L4.06859 12.8166C3.8241 13.0611 3.42732 13.0611 3.18285 12.8166C2.93862 12.5721 2.93851 12.1753 3.18285 11.9309L7.11449 7.99923L3.18382 4.06857C2.93947 3.82413 2.93955 3.42829 3.18382 3.1838C3.42831 2.9393 3.82508 2.9393 4.06957 3.1838L7.99925 7.11349L11.9309 3.1838Z"
                        fill="#212529"
                    />
                </svg>
            </button>
        </ng-template>
        <ng-template #ctaTemplate>
            <a
                class="k-watermark-trial-button"
                [attr.title]="getContent(primaryMessage).buttonText"
                [attr.href]="getContent(primaryMessage).buttonLink"
                target="_blank"
                rel="noopener noreferrer"
                [ngStyle]="{
                    display: 'inline-flex',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: isCTAHovered ? '#b90138' : '#eb0249',
                    color: '#ffffff',
                    transition: 'background-color 0.2s ease-in-out',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    fontFamily: 'system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif'
                }"
                (mouseenter)="isCTAHovered = true"
                (mouseleave)="isCTAHovered = false"
                >{{ getContent(primaryMessage).buttonText }}</a>
        </ng-template>
        @if (isOpen && bannerMounted) {
        <div
            #banner
            [ngStyle]="{
                position: 'fixed',
                top: isNarrow ? '0' : '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: isMobile ? 'flex-start' : 'center',
                borderRadius: isNarrow ? '0' : '6px',
                borderLeft: '6px solid #FFC000',
                borderTop: '1px solid #00000029',
                borderRight: '1px solid #00000029',
                borderBottom: '1px solid #00000029',
                boxSizing: 'border-box',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#1E1E1E',
                zIndex: 2000,
                boxShadow: '0px 4px 5px 0px #0000000A, 0px 2px 4px 0px #00000008',
                maxWidth: isNarrow ? 'none' : '768px',
                width: '100%',
                backgroundColor: '#fff',
                padding: isMobile ? '12px' : '0'
            }"
        >
            @if (isMobile) {
            <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
            } @if (getContent(primaryMessage).iconSrc) {
            <span
                [ngStyle]="{
                    display: 'flex',
                    alignSelf: isMobile ? 'flex-start' : 'center',
                    padding: isMobile ? '0 0 12px 0' : '9px 12px'
                }"
            ><img [src]="getContent(primaryMessage).iconSrc" alt="" /></span>
            }

            <div
                [ngStyle]="{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: isMobile ? '0 0 12px 0' : '12px',
                    flex: isMobile ? 'none' : '1'
                }"
            >
                @for (msg of messages; track msg.message) {
                <div
                    [ngStyle]="{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        flex: isMobile ? 'none' : '1'
                    }"
                >
                    <span
                        [ngStyle]="{
                            fontFamily: 'system-ui, sans-serif',
                            fontWeight: 700,
                            fontSize: '14px',
                            lineHeight: '142%'
                        }"
                    >
                        {{ getContent(msg).title }}
                    </span>
                    <span
                        [ngStyle]="{
                            fontFamily: 'system-ui, sans-serif',
                            fontSize: '14px',
                            lineHeight: '20px'
                        }"
                        [innerHTML]="getContent(msg).description"
                    >
                    </span>
                </div>
                } @if (isMobile) {
                <ng-container *ngTemplateOutlet="ctaTemplate"></ng-container>
                }
            </div>

            @if (!isMobile) {
            <div
                [ngStyle]="{
                    display: 'flex',
                    alignItems: 'center',
                    padding: isMobile ? '0' : '9px 12px',
                    gap: '16px',
                    marginLeft: isMobile ? '0' : 'auto',
                    width: isMobile ? '100%' : 'auto'
                }"
            >
                <ng-container *ngTemplateOutlet="ctaTemplate"></ng-container>
                <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
            </div>
            }
        </div>
        }
    `,
      standalone: true,
      imports: [NgStyle, NgTemplateOutlet]
    }]
  }], null, {
    licenseMessage: [{
      type: Input
    }],
    banner: [{
      type: ViewChild,
      args: ["banner"]
    }],
    watermarkStyle: [{
      type: HostBinding,
      args: ["style"]
    }]
  });
})();
var allowed = ["telerik.com", "progress.com", "stackblitz.io", "csb.app"];
function shouldShowValidationUI(isPackageValid) {
  const skip = allowed.some((hostname) => globalThis.document?.location.hostname.endsWith(hostname));
  return !skip && !isPackageValid;
}
function getLicenseMessage(meta) {
  const status = N(meta);
  return status?.message;
}
var PrefixTemplateDirective = class _PrefixTemplateDirective {
  templateRef;
  /**
   * Sets the `showSeparator` attribute of the `prefixTemplate`.
   *
   * @default false
   */
  set showSeparator(value) {
    this._showSeparator = value;
  }
  get showSeparator() {
    return this._showSeparator;
  }
  _showSeparator = false;
  constructor(templateRef) {
    this.templateRef = templateRef;
  }
  static ɵfac = function PrefixTemplateDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrefixTemplateDirective)(ɵɵdirectiveInject(TemplateRef, 8));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _PrefixTemplateDirective,
    selectors: [["", "kendoPrefixTemplate", ""]],
    inputs: {
      showSeparator: "showSeparator"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrefixTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoPrefixTemplate]",
      standalone: true
    }]
  }], () => [{
    type: TemplateRef,
    decorators: [{
      type: Optional
    }]
  }], {
    showSeparator: [{
      type: Input
    }]
  });
})();
var SuffixTemplateDirective = class _SuffixTemplateDirective {
  templateRef;
  /**
   * Sets the `showSeparator` attribute of the `suffixTemplate`.
   *
   * @default false
   */
  set showSeparator(value) {
    this._showSeparator = value;
  }
  get showSeparator() {
    return this._showSeparator;
  }
  _showSeparator = false;
  constructor(templateRef) {
    this.templateRef = templateRef;
  }
  static ɵfac = function SuffixTemplateDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SuffixTemplateDirective)(ɵɵdirectiveInject(TemplateRef, 8));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _SuffixTemplateDirective,
    selectors: [["", "kendoSuffixTemplate", ""]],
    inputs: {
      showSeparator: "showSeparator"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SuffixTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoSuffixTemplate]",
      standalone: true
    }]
  }], () => [{
    type: TemplateRef,
    decorators: [{
      type: Optional
    }]
  }], {
    showSeparator: [{
      type: Input
    }]
  });
})();
var SeparatorComponent = class _SeparatorComponent {
  /**
   * Specifies the orientation of the separator. Applicable for the adornments of the [`TextAreaComponent`](https://www.telerik.com/kendo-angular-ui/components/inputs/api/textareacomponent).
   *
   * @default 'vertical'
   */
  orientation = "vertical";
  /**
   * @hidden
   */
  get vertical() {
    return this.orientation === "vertical";
  }
  /**
   * @hidden
   */
  get horizontal() {
    return this.orientation === "horizontal";
  }
  /**
   * @hidden
   */
  hostClass = true;
  static ɵfac = function SeparatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeparatorComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SeparatorComponent,
    selectors: [["kendo-separator"]],
    hostVars: 6,
    hostBindings: function SeparatorComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("k-input-separator-vertical", ctx.vertical)("k-input-separator-horizontal", ctx.horizontal)("k-input-separator", ctx.hostClass);
      }
    },
    inputs: {
      orientation: "orientation"
    },
    decls: 0,
    vars: 0,
    template: function SeparatorComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeparatorComponent, [{
    type: Component,
    args: [{
      selector: "kendo-separator",
      template: ``,
      standalone: true
    }]
  }], null, {
    orientation: [{
      type: Input
    }],
    vertical: [{
      type: HostBinding,
      args: ["class.k-input-separator-vertical"]
    }],
    horizontal: [{
      type: HostBinding,
      args: ["class.k-input-separator-horizontal"]
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class.k-input-separator"]
    }]
  });
})();
var PreventableEvent = class {
  prevented = false;
  /**
   * Prevents the default action for the event.
   * The source component suppresses the built-in behavior that follows the event.
   */
  preventDefault() {
    this.prevented = true;
  }
  /**
   * Returns `true` if you or any subscriber prevented the default action.
   *
   * @returns `true` if the default action was prevented, otherwise, `false`.
   */
  isDefaultPrevented() {
    return this.prevented;
  }
};
var canCreateElement = () => isDocumentAvailable() && document.createElement;
var propName = "--kendo-scrollbar-width";
var cachedScrollbarWidth = null;
var cachedPixelRatio;
var cachedRtlScrollLeft = null;
var scrollbarWidth = () => {
  if (cachedScrollbarWidth === null && canCreateElement()) {
    cachedPixelRatio = window.devicePixelRatio || 1;
    const outer = document.createElement("div");
    const inner = document.createElement("div");
    outer.style.overflow = "scroll";
    outer.style.overflowX = "hidden";
    outer.style.zoom = "1";
    outer.style.clear = "both";
    outer.style.display = "block";
    outer.style.width = "100px";
    outer.style.visibility = "hidden";
    inner.style.width = "100%";
    inner.style.display = "block";
    outer.appendChild(inner);
    document.body.appendChild(outer);
    cachedScrollbarWidth = outer.getBoundingClientRect().width - inner.getBoundingClientRect().width;
    document.body.removeChild(outer);
  }
  return cachedScrollbarWidth;
};
var rtlScrollLeft = () => {
  if (cachedRtlScrollLeft === null && canCreateElement()) {
    const outer = document.createElement("div");
    outer.style.direction = "rtl";
    outer.style.display = "block";
    outer.style.clear = "both";
    outer.style.width = "100px";
    outer.style.visibility = "hidden";
    outer.style.position = "absolute";
    outer.style.left = "-10000px";
    outer.style.overflow = "scroll";
    outer.style.zoom = "1";
    const inner = document.createElement("div");
    inner.style.width = "200px";
    inner.style.height = "1px";
    outer.append(inner);
    document.body.appendChild(outer);
    const initial = outer.scrollLeft;
    outer.scrollLeft = -1;
    cachedRtlScrollLeft = outer.scrollLeft < 0 ? outer.scrollLeft : initial;
    document.body.removeChild(outer);
  }
  return cachedRtlScrollLeft;
};
var ScrollbarService = class _ScrollbarService {
  changes = new EventEmitter();
  subscription;
  constructor(ngZone) {
    if (typeof window !== "undefined" && isDocumentAvailable()) {
      document.body.style.setProperty(propName, `${scrollbarWidth()}px`);
      ngZone.runOutsideAngular(() => {
        this.subscription = fromEvent(window, "resize").pipe(auditTime(100)).subscribe(() => {
          if (cachedPixelRatio !== window.devicePixelRatio) {
            cachedScrollbarWidth = null;
            document.body.style.setProperty(propName, `${scrollbarWidth()}px`);
            this.changes.emit();
          }
        });
      });
    }
  }
  get scrollbarWidth() {
    return scrollbarWidth();
  }
  get rtlScrollLeft() {
    return rtlScrollLeft();
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }
  static ɵfac = function ScrollbarService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollbarService)(ɵɵinject(NgZone));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ScrollbarService,
    factory: _ScrollbarService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollbarService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }], null);
})();
var MultiTabStop = class {
  escape;
};
var tags = ["kendo-splitbutton", "kendo-combobox", "kendo-multicolumncombobox", "kendo-datepicker", "kendo-timepicker", "kendo-datetimepicker"];
var ToggleButtonTabStopDirective = class _ToggleButtonTabStopDirective {
  hostEl;
  renderer;
  zone;
  hostComponent;
  /**
   * @hidden
   *
   * Allows setting the interactive state of the toggle button.
   *
   * @default true
   */
  active;
  /**
   * Defines the value of the `aria-label` attribute of the toggle button when active.
   *
   * @default "toggle popup"
   */
  toggleButtonAriaLabel = "toggle popup";
  button;
  sub = new Subscription();
  focusButton;
  isSplitButton;
  observer;
  /**
   * @hidden
   */
  constructor(hostEl, renderer, zone, hostComponent) {
    this.hostEl = hostEl;
    this.renderer = renderer;
    this.zone = zone;
    this.hostComponent = hostComponent;
    if (isDevMode() && tags.indexOf(hostEl.nativeElement.tagName.toLowerCase()) === -1) {
      console.warn(`The kendoToggleButtonTabStop directive can be applied to the following components only: ${tags}`);
    }
  }
  ngOnInit() {
    this.active = true;
  }
  ngAfterViewInit() {
    if (!isDocumentAvailable()) {
      return;
    }
    this.isSplitButton = this.hostEl.nativeElement.classList.contains("k-split-button");
    if (this.active) {
      this.activateButton();
    }
    if (!(this.hostComponent?.escape instanceof EventEmitter)) {
      return;
    }
    this.sub = this.hostComponent?.escape.subscribe(() => {
      this.returnFocusToToggleButton();
    });
    this.sub.add(this.hostComponent.close.subscribe((e) => {
      if (!e.isDefaultPrevented() && this.focusButton) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => this.focusButton = false);
        });
        const mainFocusableElement = this.hostEl.nativeElement.querySelector(".k-split-button > .k-button:first-child, .k-input-inner");
        const optionsListContainer = document.getElementById(`${mainFocusableElement.getAttribute("aria-controls")}`);
        const inList = !!optionsListContainer && optionsListContainer.contains(document.activeElement);
        const inWrapper = this.hostEl.nativeElement.contains(document.activeElement);
        const focusInComponent = inList || inWrapper;
        if (focusInComponent) {
          this.returnFocusToToggleButton();
        }
      }
    }));
  }
  ngOnChanges(changes) {
    if (!isDocumentAvailable()) {
      return;
    }
    if (changes["active"]) {
      if (changes["active"].currentValue) {
        this.activateButton();
      } else {
        this.deactivateButton();
      }
    }
    if (changes["toggleButtonAriaLabel"]) {
      if (this.button) {
        this.renderer.setAttribute(this.button, "aria-label", changes["toggleButtonAriaLabel"].currentValue);
      }
    }
  }
  ngOnDestroy() {
    this.removeListeners();
    this.sub.unsubscribe();
  }
  activateButton() {
    const el = this.hostEl.nativeElement;
    const tabindex = el.querySelector('button:not([tabindex^="-"]), input:not([tabindex^="-"])')?.getAttribute("tabindex");
    this.button = el.querySelector(".k-input-button, .k-split-button-arrow");
    if (this.button) {
      this.renderer.removeAttribute(this.button, "role");
      this.renderer.setAttribute(this.button, "tabindex", tabindex);
      this.renderer.setAttribute(this.button, "aria-label", this.toggleButtonAriaLabel);
    }
    if (!this.observer) {
      this.initializeObserver(el);
    }
    this.removeListeners();
    this.addListeners();
  }
  deactivateButton() {
    if (this.button) {
      this.renderer.setAttribute(this.button, "role", "presentation");
      this.renderer.setAttribute(this.button, "tabindex", "-1");
      this.renderer.removeAttribute(this.button, "aria-label");
    }
    this.removeListeners();
    if (this.observer) {
      this.observer.disconnect();
    }
    this.observer = null;
  }
  onFocus = () => {
    this.renderer.setStyle(this.button, "box-shadow", "inset 0 0 0 1px rgba(0, 0, 0, 0.08)");
  };
  onBlur = () => {
    this.renderer.removeStyle(this.button, "box-shadow");
  };
  onClick = (e) => {
    const code = normalizeKeys(e);
    const splitButtonToggleEnter = e instanceof KeyboardEvent && code === Keys.Enter;
    const isClick = e instanceof PointerEvent;
    if (splitButtonToggleEnter || isClick) {
      this.focusButton = true;
    }
  };
  onKeyDown = (e) => {
    const code = normalizeKeys(e);
    if (code === Keys.ArrowDown && e.altKey) {
      e.stopImmediatePropagation();
      this.focusButton = true;
      this.button.click();
    }
  };
  addListeners() {
    if (this.button) {
      this.zone.runOutsideAngular(() => this.button.addEventListener("focus", this.onFocus));
      this.zone.runOutsideAngular(() => this.button.addEventListener("blur", this.onBlur));
      this.zone.runOutsideAngular(() => this.button.addEventListener("click", this.onClick));
      if (this.isSplitButton) {
        this.zone.runOutsideAngular(() => this.button.addEventListener("keyup", this.onClick));
      }
      this.zone.runOutsideAngular(() => this.button.addEventListener("keydown", this.onKeyDown, true));
    }
  }
  removeListeners() {
    if (this.button) {
      this.zone.runOutsideAngular(() => this.button.removeEventListener("focus", this.onFocus));
      this.zone.runOutsideAngular(() => this.button.removeEventListener("blur", this.onBlur));
      this.zone.runOutsideAngular(() => this.button.removeEventListener("click", this.onClick));
      if (this.isSplitButton) {
        this.zone.runOutsideAngular(() => this.button.removeEventListener("keyup", this.onClick));
      }
      this.zone.runOutsideAngular(() => this.button.removeEventListener("keydown", this.onKeyDown));
    }
  }
  focusToggleButton() {
    if (this.focusButton) {
      this.zone.runOutsideAngular(() => this.button.focus());
    }
    this.focusButton = false;
  }
  returnFocusToToggleButton() {
    if (this.isSplitButton) {
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.focusToggleButton();
      });
    } else {
      this.focusToggleButton();
    }
  }
  // Keeps the `aria-controls` and `aria-expanded` attributes of the main focusable element of the component
  // and the toggle button element in sync.
  initializeObserver(element) {
    const mainFocusableElement = element.querySelector(".k-split-button > .k-button:first-child, .k-input-inner");
    const initialExpanded = mainFocusableElement.getAttribute("aria-expanded");
    const initialControls = mainFocusableElement.getAttribute("aria-controls");
    if (this.button) {
      this.renderer.setAttribute(this.button, "aria-expanded", initialExpanded);
      if (initialControls) {
        this.renderer.setAttribute(this.button, "aria-controls", initialControls);
      }
    }
    this.zone.runOutsideAngular(() => {
      const mutationConfig = {
        attributes: true
      };
      const callback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.attributeName === "aria-expanded") {
            this.renderer.setAttribute(this.button, "aria-expanded", mainFocusableElement.getAttribute("aria-expanded"));
          } else if (mutation.attributeName === "aria-controls") {
            const controlsRef = mainFocusableElement.getAttribute("aria-controls");
            if (!this.isSplitButton && controlsRef) {
              this.renderer.setAttribute(this.button, "aria-controls", controlsRef);
            } else {
              this.renderer.removeAttribute(this.button, "aria-controls");
            }
          }
        }
      };
      this.observer = new MutationObserver(callback);
      this.observer.observe(mainFocusableElement, mutationConfig);
    });
  }
  static ɵfac = function ToggleButtonTabStopDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToggleButtonTabStopDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(MultiTabStop));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ToggleButtonTabStopDirective,
    selectors: [["", "kendoToggleButtonTabStop", ""]],
    inputs: {
      active: [0, "kendoToggleButtonTabStop", "active"],
      toggleButtonAriaLabel: "toggleButtonAriaLabel"
    },
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToggleButtonTabStopDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoToggleButtonTabStop]",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: NgZone
  }, {
    type: MultiTabStop
  }], {
    active: [{
      type: Input,
      args: ["kendoToggleButtonTabStop"]
    }],
    toggleButtonAriaLabel: [{
      type: Input
    }]
  });
})();
var TemplateContextDirective = class _TemplateContextDirective {
  set templateContext(context) {
    if (this.insertedViewRef) {
      this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.insertedViewRef));
      this.insertedViewRef = void 0;
    }
    if (context.templateRef) {
      this.insertedViewRef = this.viewContainerRef.createEmbeddedView(context.templateRef, context);
    }
  }
  insertedViewRef;
  viewContainerRef;
  constructor(viewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
  static ɵfac = function TemplateContextDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TemplateContextDirective)(ɵɵdirectiveInject(ViewContainerRef));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _TemplateContextDirective,
    selectors: [["", "templateContext", ""]],
    inputs: {
      templateContext: "templateContext"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TemplateContextDirective, [{
    type: Directive,
    args: [{
      selector: "[templateContext]",
      standalone: true
    }]
  }], () => [{
    type: ViewContainerRef
  }], {
    templateContext: [{
      type: Input
    }]
  });
})();
var KENDO_ADORNMENTS = [PrefixTemplateDirective, SuffixTemplateDirective, SeparatorComponent];
var KENDO_COMMON = [...KENDO_ADORNMENTS, DraggableDirective, EventsOutsideAngularDirective, ResizeSensorComponent, ToggleButtonTabStopDirective, WatermarkOverlayComponent];
var KENDO_DRAGGABLE = [DraggableDirective];
var KENDO_EVENTS = [EventsOutsideAngularDirective];
var KENDO_RESIZESENSOR = [ResizeSensorComponent];
var KENDO_TOGGLEBUTTONTABSTOP = [ToggleButtonTabStopDirective];
var KENDO_WATERMARK = [WatermarkOverlayComponent];
var KENDO_TEMPLATE_CONTEXT = [TemplateContextDirective];
var replaceMessagePlaceholder = (message, name, value) => (message ?? "").replace(new RegExp(`{\\s*${name}\\s*}`, "g"), value);

export {
  Draggable,
  isDocumentAvailable,
  isChanged,
  anyChanged,
  hasObservers,
  guid,
  isSafari,
  isFirefox,
  firefoxMaxHeight,
  isPresent,
  isObjectPresent,
  isString,
  isObject,
  isSet,
  splitStringToArray,
  parseCSSClassNames,
  setHTMLAttributes,
  removeHTMLAttributes,
  parseAttributes,
  applyAttributes,
  isControlRequired,
  areObjectsEqual,
  processCssValue,
  DraggableDirective,
  closestInScope,
  closest,
  contains,
  findElement,
  isFocusable,
  hasFocusableParent,
  isVisible,
  isFocusableWithTabKey,
  findFocusableChild,
  findFocusable,
  hasClasses,
  matchesClasses,
  matchesNodeName,
  rtlScrollPosition,
  closestBySelector,
  EventsOutsideAngularDirective,
  ResizeCompatService,
  ResizeObserverService,
  ResizeBatchService,
  ResizeSensorComponent,
  KendoInput,
  KENDO_WEBMCP_HOST,
  Keys,
  focusableSelector,
  normalizeKeys,
  getter,
  setter,
  WatermarkOverlayComponent,
  shouldShowValidationUI,
  getLicenseMessage,
  PrefixTemplateDirective,
  SuffixTemplateDirective,
  SeparatorComponent,
  PreventableEvent,
  scrollbarWidth,
  rtlScrollLeft,
  ScrollbarService,
  MultiTabStop,
  ToggleButtonTabStopDirective,
  TemplateContextDirective,
  KENDO_ADORNMENTS,
  KENDO_COMMON,
  KENDO_DRAGGABLE,
  KENDO_EVENTS,
  KENDO_RESIZESENSOR,
  KENDO_TOGGLEBUTTONTABSTOP,
  KENDO_WATERMARK,
  KENDO_TEMPLATE_CONTEXT,
  replaceMessagePlaceholder
};
//# sourceMappingURL=chunk-BJYUHGJP.js.map
