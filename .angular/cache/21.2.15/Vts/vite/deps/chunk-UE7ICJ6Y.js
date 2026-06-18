import {
  Directive,
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-EAUF2VNQ.js";
import {
  BehaviorSubject,
  map,
  skip,
  tap
} from "./chunk-VT3VMPII.js";

// node_modules/@progress/kendo-angular-l10n/fesm2022/progress-kendo-angular-l10n.mjs
var MessageService = class _MessageService {
  /**
   * @hidden
   */
  constructor() {
  }
  /**
   * @hidden
   */
  changes = new BehaviorSubject({
    rtl: void 0
  });
  /**
   * Notifies the components that the messages changed.
   *
   * @param rtl - (Optional) The new value for the [text direction token](https://www.telerik.com/kendo-angular-ui/components/globalization/localization/api/rtl).
   */
  notify(rtl) {
    this.changes.next({
      rtl
    });
  }
  /**
   * Returns a localized message for the supplied key.
   *
   * @param _key - The message key. For example, `"kendo.grid.noRecords"`.
   * @return - The localized message for this key or `undefined` if not found.
   */
  get(_key) {
    return void 0;
  }
  static ɵfac = function MessageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MessageService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MessageService,
    factory: _MessageService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MessageService, [{
    type: Injectable
  }], () => [], null);
})();
var ComponentMessages = class _ComponentMessages {
  service;
  subscription;
  get override() {
    return false;
  }
  ngOnChanges(changes) {
    this.register(changes);
    if (Object.keys(changes).some((field) => !changes[field].isFirstChange())) {
      this.service.notifyChanges();
    }
  }
  ngOnInit() {
    this.subscription = this.service.changes.pipe(skip(1)).subscribe(() => this.register(this));
  }
  register(changes) {
    const keys = Object.keys(changes);
    keys.forEach((key) => this.service.register(key, this[key], this.override));
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  static ɵfac = function ComponentMessages_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ComponentMessages)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ComponentMessages,
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComponentMessages, [{
    type: Directive,
    args: [{}]
  }], null, null);
})();
var RTL = new InjectionToken("Kendo UI Right-to-Left token");
var L10N_PREFIX = new InjectionToken("Localization key prefix");
var LocalizationService = class _LocalizationService {
  prefix;
  messageService;
  _rtl;
  changes;
  subscription;
  dictionary = {};
  constructor(prefix, messageService, _rtl) {
    this.prefix = prefix;
    this.messageService = messageService;
    this._rtl = _rtl;
    this.changes = new BehaviorSubject({
      rtl: this._rtl
    });
    if (messageService) {
      this.subscription = messageService.changes.pipe(map(({
        rtl
      }) => rtl !== void 0 ? rtl : this._rtl), tap((rtl) => this._rtl = rtl)).subscribe((rtl) => {
        this.dictionary = {};
        this.changes.next({
          rtl
        });
      });
    }
  }
  get rtl() {
    return this._rtl;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  get(shortKey) {
    const key = this.key(shortKey);
    return this.dictionary[key];
  }
  register(shortKey, value, override = false) {
    const key = this.key(shortKey);
    let message = value;
    if (!override) {
      if (Object.hasOwnProperty.call(this.dictionary, key)) {
        return;
      }
      message = this.defaultValue(key, value);
    }
    this.dictionary[key] = message;
  }
  notifyChanges() {
    this.changes.next({
      rtl: this.rtl
    });
  }
  key(shortKey) {
    return this.prefix + "." + shortKey;
  }
  defaultValue(key, value) {
    if (!this.messageService) {
      return value;
    }
    const alt = this.messageService.get(key);
    return alt === void 0 ? value : alt;
  }
  static ɵfac = function LocalizationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalizationService)(ɵɵinject(L10N_PREFIX), ɵɵinject(MessageService, 8), ɵɵinject(RTL, 8));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _LocalizationService,
    factory: _LocalizationService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalizationService, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [L10N_PREFIX]
    }]
  }, {
    type: MessageService,
    decorators: [{
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [RTL]
    }]
  }], null);
})();

export {
  MessageService,
  ComponentMessages,
  RTL,
  L10N_PREFIX,
  LocalizationService
};
//# sourceMappingURL=chunk-UE7ICJ6Y.js.map
