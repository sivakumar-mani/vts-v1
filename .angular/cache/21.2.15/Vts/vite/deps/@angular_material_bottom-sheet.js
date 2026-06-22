import {
  CdkDialogContainer,
  Dialog,
  DialogModule
} from "./chunk-7RMYGFQU.js";
import {
  createBlockScrollStrategy,
  createGlobalPositionStrategy
} from "./chunk-NY5XKCEB.js";
import {
  CdkPortalOutlet,
  PortalModule
} from "./chunk-2LYGVHXY.js";
import "./chunk-VON75VBJ.js";
import "./chunk-3RUZQJQZ.js";
import "./chunk-GL3H6346.js";
import "./chunk-3EQIYMO2.js";
import "./chunk-HJVBW6OA.js";
import "./chunk-MLK434PF.js";
import "./chunk-UILBFXOF.js";
import {
  Breakpoints,
  _animationsDisabled
} from "./chunk-JK57W2WF.js";
import {
  BreakpointObserver
} from "./chunk-IB4SLSAQ.js";
import "./chunk-6AHOBRIJ.js";
import {
  hasModifierKey
} from "./chunk-FAYGH52R.js";
import "./chunk-TJ7XVWFE.js";
import "./chunk-EE4Q3I4S.js";
import "./chunk-N4DOILP3.js";
import "./chunk-ZPWSLCE3.js";
import "./chunk-OWSXEDAJ.js";
import "./chunk-GUGIMSVJ.js";
import "./chunk-ZGURIVGH.js";
import {
  BidiModule
} from "./chunk-ILEVSUJ3.js";
import "./chunk-SLKWJJ6A.js";
import "./chunk-3P6NZDVG.js";
import "./chunk-SMKKFHGX.js";
import "./chunk-HX53TNYB.js";
import {
  ESCAPE
} from "./chunk-VSYHN3JR.js";
import "./chunk-6B3TJPRB.js";
import "./chunk-Y6BXVQXT.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵlistener,
  ɵɵtemplate
} from "./chunk-EAUF2VNQ.js";
import {
  merge
} from "./chunk-6GJRAX4D.js";
import "./chunk-Y3THW75Q.js";
import {
  Subject,
  filter,
  take
} from "./chunk-VT3VMPII.js";
import "./chunk-CQXOBY6D.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-N6ESDQJH.js";

// node_modules/@angular/material/fesm2022/bottom-sheet.mjs
function MatBottomSheetContainer_ng_template_0_Template(rf, ctx) {
}
var ENTER_ANIMATION = "_mat-bottom-sheet-enter";
var EXIT_ANIMATION = "_mat-bottom-sheet-exit";
var MatBottomSheetContainer = class _MatBottomSheetContainer extends CdkDialogContainer {
  _breakpointSubscription;
  _animationsDisabled = _animationsDisabled();
  _animationState = "void";
  _animationStateChanged = new EventEmitter();
  _destroyed = false;
  constructor() {
    super();
    const breakpointObserver = inject(BreakpointObserver);
    this._breakpointSubscription = breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(() => {
      const classList = this._elementRef.nativeElement.classList;
      classList.toggle("mat-bottom-sheet-container-medium", breakpointObserver.isMatched(Breakpoints.Medium));
      classList.toggle("mat-bottom-sheet-container-large", breakpointObserver.isMatched(Breakpoints.Large));
      classList.toggle("mat-bottom-sheet-container-xlarge", breakpointObserver.isMatched(Breakpoints.XLarge));
    });
  }
  enter() {
    if (!this._destroyed) {
      this._animationState = "visible";
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
      if (this._animationsDisabled) {
        this._simulateAnimation(ENTER_ANIMATION);
      }
    }
  }
  exit() {
    if (!this._destroyed) {
      this._elementRef.nativeElement.setAttribute("mat-exit", "");
      this._animationState = "hidden";
      this._changeDetectorRef.markForCheck();
      if (this._animationsDisabled) {
        this._simulateAnimation(EXIT_ANIMATION);
      }
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._breakpointSubscription.unsubscribe();
    this._destroyed = true;
  }
  _simulateAnimation(name) {
    this._ngZone.run(() => {
      this._handleAnimationEvent(true, name);
      setTimeout(() => this._handleAnimationEvent(false, name));
    });
  }
  _trapFocus() {
    super._trapFocus({
      preventScroll: true
    });
  }
  _handleAnimationEvent(isStart, animationName) {
    const isEnter = animationName === ENTER_ANIMATION;
    const isExit = animationName === EXIT_ANIMATION;
    if (isEnter || isExit) {
      this._animationStateChanged.emit({
        toState: isEnter ? "visible" : "hidden",
        phase: isStart ? "start" : "done"
      });
    }
  }
  static ɵfac = function MatBottomSheetContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheetContainer)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatBottomSheetContainer,
    selectors: [["mat-bottom-sheet-container"]],
    hostAttrs: ["tabindex", "-1", 1, "mat-bottom-sheet-container"],
    hostVars: 9,
    hostBindings: function MatBottomSheetContainer_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("animationstart", function MatBottomSheetContainer_animationstart_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(true, $event.animationName);
        })("animationend", function MatBottomSheetContainer_animationend_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(false, $event.animationName);
        })("animationcancel", function MatBottomSheetContainer_animationcancel_HostBindingHandler($event) {
          return ctx._handleAnimationEvent(false, $event.animationName);
        });
      }
      if (rf & 2) {
        ɵɵattribute("role", ctx._config.role)("aria-modal", ctx._config.ariaModal)("aria-label", ctx._config.ariaLabel);
        ɵɵclassProp("mat-bottom-sheet-container-animations-enabled", !ctx._animationsDisabled)("mat-bottom-sheet-container-enter", ctx._animationState === "visible")("mat-bottom-sheet-container-exit", ctx._animationState === "hidden");
      }
    },
    features: [ɵɵInheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkPortalOutlet", ""]],
    template: function MatBottomSheetContainer_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, MatBottomSheetContainer_ng_template_0_Template, 0, 0, "ng-template", 0);
      }
    },
    dependencies: [CdkPortalOutlet],
    styles: ["@keyframes _mat-bottom-sheet-enter {\n  from {\n    transform: translateY(100%);\n  }\n  to {\n    transform: none;\n  }\n}\n@keyframes _mat-bottom-sheet-exit {\n  from {\n    transform: none;\n  }\n  to {\n    transform: translateY(100%);\n  }\n}\n.mat-bottom-sheet-container {\n  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);\n  padding: 8px 16px;\n  min-width: 100vw;\n  box-sizing: border-box;\n  display: block;\n  outline: 0;\n  max-height: 80vh;\n  overflow: auto;\n  position: relative;\n  background: var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));\n  color: var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));\n  line-height: var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));\n  font-weight: var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking));\n}\n@media (forced-colors: active) {\n  .mat-bottom-sheet-container {\n    outline: 1px solid;\n  }\n}\n\n.mat-bottom-sheet-container-animations-enabled {\n  transform: translateY(100%);\n}\n.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter {\n  animation: _mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards;\n}\n.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit {\n  animation: _mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards;\n}\n\n.mat-bottom-sheet-container-xlarge, .mat-bottom-sheet-container-large, .mat-bottom-sheet-container-medium {\n  border-top-left-radius: var(--mat-bottom-sheet-container-shape, 28px);\n  border-top-right-radius: var(--mat-bottom-sheet-container-shape, 28px);\n}\n\n.mat-bottom-sheet-container-medium {\n  min-width: 384px;\n  max-width: calc(100vw - 128px);\n}\n\n.mat-bottom-sheet-container-large {\n  min-width: 512px;\n  max-width: calc(100vw - 256px);\n}\n\n.mat-bottom-sheet-container-xlarge {\n  min-width: 576px;\n  max-width: calc(100vw - 384px);\n}\n"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheetContainer, [{
    type: Component,
    args: [{
      selector: "mat-bottom-sheet-container",
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      host: {
        "class": "mat-bottom-sheet-container",
        "[class.mat-bottom-sheet-container-animations-enabled]": "!_animationsDisabled",
        "[class.mat-bottom-sheet-container-enter]": '_animationState === "visible"',
        "[class.mat-bottom-sheet-container-exit]": '_animationState === "hidden"',
        "tabindex": "-1",
        "[attr.role]": "_config.role",
        "[attr.aria-modal]": "_config.ariaModal",
        "[attr.aria-label]": "_config.ariaLabel",
        "(animationstart)": "_handleAnimationEvent(true, $event.animationName)",
        "(animationend)": "_handleAnimationEvent(false, $event.animationName)",
        "(animationcancel)": "_handleAnimationEvent(false, $event.animationName)"
      },
      imports: [CdkPortalOutlet],
      template: "<ng-template cdkPortalOutlet></ng-template>\r\n",
      styles: ["@keyframes _mat-bottom-sheet-enter {\n  from {\n    transform: translateY(100%);\n  }\n  to {\n    transform: none;\n  }\n}\n@keyframes _mat-bottom-sheet-exit {\n  from {\n    transform: none;\n  }\n  to {\n    transform: translateY(100%);\n  }\n}\n.mat-bottom-sheet-container {\n  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12);\n  padding: 8px 16px;\n  min-width: 100vw;\n  box-sizing: border-box;\n  display: block;\n  outline: 0;\n  max-height: 80vh;\n  overflow: auto;\n  position: relative;\n  background: var(--mat-bottom-sheet-container-background-color, var(--mat-sys-surface-container-low));\n  color: var(--mat-bottom-sheet-container-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-bottom-sheet-container-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-bottom-sheet-container-text-size, var(--mat-sys-body-large-size));\n  line-height: var(--mat-bottom-sheet-container-text-line-height, var(--mat-sys-body-large-line-height));\n  font-weight: var(--mat-bottom-sheet-container-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-bottom-sheet-container-text-tracking, var(--mat-sys-body-large-tracking));\n}\n@media (forced-colors: active) {\n  .mat-bottom-sheet-container {\n    outline: 1px solid;\n  }\n}\n\n.mat-bottom-sheet-container-animations-enabled {\n  transform: translateY(100%);\n}\n.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-enter {\n  animation: _mat-bottom-sheet-enter 195ms cubic-bezier(0, 0, 0.2, 1) forwards;\n}\n.mat-bottom-sheet-container-animations-enabled.mat-bottom-sheet-container-exit {\n  animation: _mat-bottom-sheet-exit 375ms cubic-bezier(0.4, 0, 1, 1) backwards;\n}\n\n.mat-bottom-sheet-container-xlarge, .mat-bottom-sheet-container-large, .mat-bottom-sheet-container-medium {\n  border-top-left-radius: var(--mat-bottom-sheet-container-shape, 28px);\n  border-top-right-radius: var(--mat-bottom-sheet-container-shape, 28px);\n}\n\n.mat-bottom-sheet-container-medium {\n  min-width: 384px;\n  max-width: calc(100vw - 128px);\n}\n\n.mat-bottom-sheet-container-large {\n  min-width: 512px;\n  max-width: calc(100vw - 256px);\n}\n\n.mat-bottom-sheet-container-xlarge {\n  min-width: 576px;\n  max-width: calc(100vw - 384px);\n}\n"]
    }]
  }], () => [], null);
})();
var MAT_BOTTOM_SHEET_DATA = new InjectionToken("MatBottomSheetData");
var MatBottomSheetConfig = class {
  viewContainerRef;
  injector;
  panelClass;
  direction;
  data = null;
  hasBackdrop = true;
  backdropClass;
  disableClose = false;
  ariaLabel = null;
  ariaModal = false;
  closeOnNavigation = true;
  autoFocus = "first-tabbable";
  restoreFocus = true;
  scrollStrategy;
  height = "";
  minHeight;
  maxHeight;
};
var MatBottomSheetRef = class {
  _ref;
  get instance() {
    return this._ref.componentInstance;
  }
  get componentRef() {
    return this._ref.componentRef;
  }
  containerInstance;
  disableClose;
  _afterOpened = new Subject();
  _result;
  _closeFallbackTimeout;
  constructor(_ref, config, containerInstance) {
    this._ref = _ref;
    this.containerInstance = containerInstance;
    this.disableClose = config.disableClose;
    containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "done" && event.toState === "visible"), take(1)).subscribe(() => {
      this._afterOpened.next();
      this._afterOpened.complete();
    });
    containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "done" && event.toState === "hidden"), take(1)).subscribe(() => {
      clearTimeout(this._closeFallbackTimeout);
      this._ref.close(this._result);
    });
    _ref.overlayRef.detachments().subscribe(() => {
      this._ref.close(this._result);
    });
    merge(this.backdropClick(), this.keydownEvents().pipe(filter((event) => event.keyCode === ESCAPE))).subscribe((event) => {
      if (!this.disableClose && (event.type !== "keydown" || !hasModifierKey(event))) {
        event.preventDefault();
        this.dismiss();
      }
    });
  }
  dismiss(result) {
    if (!this.containerInstance) {
      return;
    }
    this.containerInstance._animationStateChanged.pipe(filter((event) => event.phase === "start"), take(1)).subscribe(() => {
      this._closeFallbackTimeout = setTimeout(() => this._ref.close(this._result), 500);
      this._ref.overlayRef.detachBackdrop();
    });
    this._result = result;
    this.containerInstance.exit();
    this.containerInstance = null;
  }
  afterDismissed() {
    return this._ref.closed;
  }
  afterOpened() {
    return this._afterOpened;
  }
  backdropClick() {
    return this._ref.backdropClick;
  }
  keydownEvents() {
    return this._ref.keydownEvents;
  }
};
var MAT_BOTTOM_SHEET_DEFAULT_OPTIONS = new InjectionToken("mat-bottom-sheet-default-options");
var MatBottomSheet = class _MatBottomSheet {
  _injector = inject(Injector);
  _parentBottomSheet = inject(_MatBottomSheet, {
    optional: true,
    skipSelf: true
  });
  _animationsDisabled = _animationsDisabled();
  _defaultOptions = inject(MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, {
    optional: true
  });
  _bottomSheetRefAtThisLevel = null;
  _dialog = inject(Dialog);
  get _openedBottomSheetRef() {
    const parent = this._parentBottomSheet;
    return parent ? parent._openedBottomSheetRef : this._bottomSheetRefAtThisLevel;
  }
  set _openedBottomSheetRef(value) {
    if (this._parentBottomSheet) {
      this._parentBottomSheet._openedBottomSheetRef = value;
    } else {
      this._bottomSheetRefAtThisLevel = value;
    }
  }
  constructor() {
  }
  open(componentOrTemplateRef, config) {
    const _config = __spreadValues(__spreadValues({}, this._defaultOptions || new MatBottomSheetConfig()), config);
    let ref;
    this._dialog.open(componentOrTemplateRef, __spreadProps(__spreadValues({}, _config), {
      disableClose: true,
      closeOnOverlayDetachments: false,
      maxWidth: "100%",
      container: MatBottomSheetContainer,
      scrollStrategy: _config.scrollStrategy || createBlockScrollStrategy(this._injector),
      positionStrategy: createGlobalPositionStrategy(this._injector).centerHorizontally().bottom("0"),
      disableAnimations: this._animationsDisabled,
      templateContext: () => ({
        bottomSheetRef: ref
      }),
      providers: (cdkRef, _cdkConfig, container) => {
        ref = new MatBottomSheetRef(cdkRef, _config, container);
        return [{
          provide: MatBottomSheetRef,
          useValue: ref
        }, {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: _config.data
        }];
      }
    }));
    ref.afterDismissed().subscribe(() => {
      if (this._openedBottomSheetRef === ref) {
        this._openedBottomSheetRef = null;
      }
    });
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.afterDismissed().subscribe(() => ref.containerInstance?.enter());
      this._openedBottomSheetRef.dismiss();
    } else {
      ref.containerInstance.enter();
    }
    this._openedBottomSheetRef = ref;
    return ref;
  }
  dismiss(result) {
    if (this._openedBottomSheetRef) {
      this._openedBottomSheetRef.dismiss(result);
    }
  }
  ngOnDestroy() {
    if (this._bottomSheetRefAtThisLevel) {
      this._bottomSheetRefAtThisLevel.dismiss();
    }
  }
  static ɵfac = function MatBottomSheet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheet)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _MatBottomSheet,
    factory: _MatBottomSheet.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheet, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var MatBottomSheetModule = class _MatBottomSheetModule {
  static ɵfac = function MatBottomSheetModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatBottomSheetModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatBottomSheetModule,
    imports: [DialogModule, PortalModule, MatBottomSheetContainer],
    exports: [MatBottomSheetContainer, BidiModule]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [MatBottomSheet],
    imports: [DialogModule, PortalModule, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatBottomSheetModule, [{
    type: NgModule,
    args: [{
      imports: [DialogModule, PortalModule, MatBottomSheetContainer],
      exports: [MatBottomSheetContainer, BidiModule],
      providers: [MatBottomSheet]
    }]
  }], null, null);
})();
export {
  MAT_BOTTOM_SHEET_DATA,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetContainer,
  MatBottomSheetModule,
  MatBottomSheetRef
};
//# sourceMappingURL=@angular_material_bottom-sheet.js.map
