import {
  ButtonComponent,
  ButtonGroupComponent,
  DropDownButtonComponent,
  IconWrapperComponent,
  IconsService,
  PopupService,
  SplitButtonComponent,
  chevronDownIcon,
  chevronLeftIcon,
  chevronRightIcon,
  moreHorizontalIcon,
  moreVerticalIcon
} from "./chunk-4WO5JP34.js";
import {
  ComponentMessages,
  L10N_PREFIX,
  LocalizationService
} from "./chunk-UE7ICJ6Y.js";
import {
  Keys,
  ResizeBatchService,
  ResizeSensorComponent,
  WatermarkOverlayComponent,
  getLicenseMessage,
  guid,
  isDocumentAvailable,
  isPresent,
  normalizeKeys,
  parseCSSClassNames,
  shouldShowValidationUI
} from "./chunk-BJYUHGJP.js";
import {
  A
} from "./chunk-T2SKS23Q.js";
import {
  NgClass,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-SMKKFHGX.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Output,
  Renderer2,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  forwardRef,
  inject,
  isDevMode,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction3,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
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
  Subject,
  Subscription,
  filter,
  take,
  takeUntil
} from "./chunk-VT3VMPII.js";

// node_modules/@progress/kendo-angular-indicators/fesm2022/progress-kendo-angular-indicators.mjs
var _c0 = ["*"];
function LoaderComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵdomElement(0, "span", 1);
  }
}
var BadgeContainerComponent = class _BadgeContainerComponent {
  localizationService;
  hostClass = true;
  /**
   * @hidden
   */
  direction;
  dynamicRTLSubscription;
  rtl = false;
  constructor(localizationService) {
    this.localizationService = localizationService;
    this.dynamicRTLSubscription = this.localizationService.changes.subscribe(({
      rtl
    }) => {
      this.rtl = rtl;
      this.direction = this.rtl ? "rtl" : "ltr";
    });
  }
  ngOnDestroy() {
    if (this.dynamicRTLSubscription) {
      this.dynamicRTLSubscription.unsubscribe();
    }
  }
  static ɵfac = function BadgeContainerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeContainerComponent)(ɵɵdirectiveInject(LocalizationService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _BadgeContainerComponent,
    selectors: [["kendo-badge-container"]],
    hostVars: 3,
    hostBindings: function BadgeContainerComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("dir", ctx.direction);
        ɵɵclassProp("k-badge-container", ctx.hostClass);
      }
    },
    features: [ɵɵProvidersFeature([LocalizationService, {
      provide: L10N_PREFIX,
      useValue: "kendo.badge.component"
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function BadgeContainerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeContainerComponent, [{
    type: Component,
    args: [{
      selector: "kendo-badge-container",
      providers: [LocalizationService, {
        provide: L10N_PREFIX,
        useValue: "kendo.badge.component"
      }],
      template: `<ng-content></ng-content>`,
      standalone: true
    }]
  }], () => [{
    type: LocalizationService
  }], {
    hostClass: [{
      type: HostBinding,
      args: ["class.k-badge-container"]
    }],
    direction: [{
      type: HostBinding,
      args: ["attr.dir"]
    }]
  });
})();
var packageMetadata = {
  name: "@progress/kendo-angular-indicators",
  productName: "Kendo UI for Angular",
  productCode: "KENDOUIANGULAR",
  productCodes: ["KENDOUIANGULAR"],
  publishDate: 1780593733,
  version: "24.1.0",
  licensingDocsUrl: "https://www.telerik.com/kendo-angular-ui/my-license/"
};
var SIZE_CLASSES$1 = {
  "small": "k-badge-sm",
  "medium": "k-badge-md",
  "large": "k-badge-lg"
};
var ROUNDED_CLASSES = {
  "small": "k-rounded-sm",
  "medium": "k-rounded-md",
  "large": "k-rounded-lg",
  "full": "k-rounded-full",
  "none": "k-rounded-none"
};
var BadgeComponent = class _BadgeComponent {
  element;
  renderer;
  localizationService;
  hostClass = true;
  get cutoutBorderClass() {
    return this.cutoutBorder;
  }
  /**
   * @hidden
   */
  direction;
  /**
   * Specifies the alignment of the Badge ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/align-and-position#alignment)).
   *
   * @default "{ vertical: 'top', horizontal: 'end' }"
   */
  get align() {
    return this.badgeAlign;
  }
  set align(align) {
    this.badgeAlign = Object.assign(this.badgeAlign, align);
  }
  /**
   * Specifies the size of the Badge ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/appearance#size)). The default value is set by the Kendo theme.
   */
  size;
  /**
   * Specifies the appearance fill style of the Badge ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/appearance#fill)). The default value is set by the Kendo theme.
   */
  fill;
  /**
   * Specifies the theme color of the Badge.
   * The theme color applies as background and border color, while also amending the text color accordingly
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/appearance#theme-color)). The default value is set by the Kendo theme.
   */
  themeColor;
  /**
   * Specifies the roundness of the Badge ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/appearance#rounded)). The default value is set by the Kendo theme.
   */
  rounded;
  /**
   * Specifies the position of the Badge relative to the edge of the parent container element ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/align-and-position#position)).
   *
   * @default edge
   */
  position = "edge";
  /**
   * Specifies whether to render additional `cutout` border around the Badge ([see example](https://www.telerik.com/kendo-angular-ui/components/indicators/badge/appearance#cutout-border)).
   *
   * @default false
   */
  cutoutBorder = false;
  badgeClasses = [];
  badgeAlign = {
    vertical: "top",
    horizontal: "end"
  };
  dynamicRTLSubscription;
  rtl = false;
  constructor(element, renderer, localizationService) {
    this.element = element;
    this.renderer = renderer;
    this.localizationService = localizationService;
    A(packageMetadata);
    this.dynamicRTLSubscription = this.localizationService.changes.subscribe(({
      rtl
    }) => {
      this.rtl = rtl;
      this.direction = this.rtl ? "rtl" : "ltr";
    });
  }
  ngAfterViewInit() {
    if (!this.badgeClasses.length) {
      this.setBadgeClasses();
    }
  }
  ngOnChanges() {
    this.setBadgeClasses();
  }
  ngOnDestroy() {
    if (this.dynamicRTLSubscription) {
      this.dynamicRTLSubscription.unsubscribe();
    }
  }
  alignClass() {
    return `k-${this.badgeAlign.vertical}-${this.badgeAlign.horizontal}`;
  }
  positionClass() {
    return `k-badge-${this.position}`;
  }
  sizeClass() {
    return SIZE_CLASSES$1[this.size];
  }
  roundedClass() {
    return ROUNDED_CLASSES[this.rounded];
  }
  themeColorClass() {
    return this.themeColor ? `k-badge-${this.themeColor}` : "";
  }
  fillClass() {
    return this.fill ? `k-badge-${this.fill}` : "";
  }
  setBadgeClasses() {
    const element = this.element.nativeElement;
    this.badgeClasses.forEach((className) => {
      this.renderer.removeClass(element, className);
    });
    this.badgeClasses = [this.themeColorClass(), this.fillClass(), this.sizeClass(), this.roundedClass(), this.alignClass(), this.positionClass()].filter((className) => className);
    this.badgeClasses.forEach((className) => {
      if (className) {
        this.renderer.addClass(element, className);
      }
    });
  }
  static ɵfac = function BadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(LocalizationService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _BadgeComponent,
    selectors: [["kendo-badge"]],
    hostVars: 5,
    hostBindings: function BadgeComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("dir", ctx.direction);
        ɵɵclassProp("k-badge", ctx.hostClass)("k-badge-border-cutout", ctx.cutoutBorderClass);
      }
    },
    inputs: {
      align: "align",
      size: "size",
      fill: "fill",
      themeColor: "themeColor",
      rounded: "rounded",
      position: "position",
      cutoutBorder: "cutoutBorder"
    },
    features: [ɵɵProvidersFeature([LocalizationService, {
      provide: L10N_PREFIX,
      useValue: "kendo.badge.component"
    }]), ɵɵNgOnChangesFeature],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function BadgeComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeComponent, [{
    type: Component,
    args: [{
      selector: "kendo-badge",
      providers: [LocalizationService, {
        provide: L10N_PREFIX,
        useValue: "kendo.badge.component"
      }],
      template: `<ng-content></ng-content>`,
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: LocalizationService
  }], {
    hostClass: [{
      type: HostBinding,
      args: ["class.k-badge"]
    }],
    cutoutBorderClass: [{
      type: HostBinding,
      args: ["class.k-badge-border-cutout"]
    }],
    direction: [{
      type: HostBinding,
      args: ["attr.dir"]
    }],
    align: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    fill: [{
      type: Input
    }],
    themeColor: [{
      type: Input
    }],
    rounded: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    cutoutBorder: [{
      type: Input
    }]
  });
})();
var SIZE_CLASSES = {
  "small": "k-loader-sm",
  "medium": "k-loader-md",
  "large": "k-loader-lg"
};
var SEGMENT_COUNT = {
  "pulsing": 2,
  "infinite-spinner": 3,
  "converging-spinner": 4
};
var TYPE_CLASSES = {
  "pulsing": "k-loader-pulsing-2",
  "infinite-spinner": "k-loader-spinner-3",
  "converging-spinner": "k-loader-spinner-4"
};
var LoaderComponent = class _LoaderComponent {
  element;
  renderer;
  hostClass = true;
  role = "status";
  /**
   * Specifies the Loader animation type.
   *
   * @default pulsing
   */
  set type(type) {
    this.renderer.removeClass(this.loader, TYPE_CLASSES[this.type]);
    this.renderer.addClass(this.loader, TYPE_CLASSES[type]);
    this._type = type;
  }
  get type() {
    return this._type;
  }
  /**
   * Specifies the theme color of the Loader. The default value is set by the Kendo theme.
   */
  set themeColor(themeColor) {
    this.renderer.removeClass(this.loader, `k-loader-${this.themeColor}`);
    this.renderer.addClass(this.loader, `k-loader-${themeColor}`);
    this._themeColor = themeColor;
  }
  get themeColor() {
    return this._themeColor;
  }
  /**
   * Specifies the size of the Loader. The default value is set by the Kendo theme.
   */
  set size(size) {
    this.renderer.removeClass(this.loader, SIZE_CLASSES[this.size]);
    this.renderer.addClass(this.loader, SIZE_CLASSES[size]);
    this._size = size;
  }
  get size() {
    return this._size;
  }
  _type = "pulsing";
  _themeColor;
  _size;
  loader;
  constructor(element, renderer) {
    this.element = element;
    this.renderer = renderer;
    A(packageMetadata);
    this.loader = this.element.nativeElement;
  }
  ngAfterViewInit() {
    this.setLoaderClasses();
  }
  /**
   * @hidden
   */
  get segmentCount() {
    return new Array(SEGMENT_COUNT[this.type]);
  }
  setLoaderClasses() {
    this.renderer.addClass(this.loader, TYPE_CLASSES[this.type]);
    this.themeColor && this.renderer.addClass(this.loader, `k-loader-${this.themeColor}`);
    this.size && this.renderer.addClass(this.loader, SIZE_CLASSES[this.size]);
  }
  static ɵfac = function LoaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoaderComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _LoaderComponent,
    selectors: [["kendo-loader"]],
    hostVars: 3,
    hostBindings: function LoaderComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("role", ctx.role);
        ɵɵclassProp("k-loader", ctx.hostClass);
      }
    },
    inputs: {
      type: "type",
      themeColor: "themeColor",
      size: "size"
    },
    decls: 3,
    vars: 0,
    consts: [[1, "k-loader-canvas"], [1, "k-loader-segment"]],
    template: function LoaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomElementStart(0, "div", 0);
        ɵɵrepeaterCreate(1, LoaderComponent_For_2_Template, 1, 0, "span", 1, ɵɵrepeaterTrackByIndex);
        ɵɵdomElementEnd();
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵrepeater(ctx.segmentCount);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoaderComponent, [{
    type: Component,
    args: [{
      selector: "kendo-loader",
      template: `
        <div class="k-loader-canvas">
          @for (segment of segmentCount; track $index) {
            <span class="k-loader-segment"></span>
          }
        </div>
        `,
      standalone: true,
      imports: []
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }], {
    hostClass: [{
      type: HostBinding,
      args: ["class.k-loader"]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }],
    type: [{
      type: Input
    }],
    themeColor: [{
      type: Input
    }],
    size: [{
      type: Input
    }]
  });
})();
var validAnimations = [false, "pulse", "wave"];
var validShapes = ["circle", "rectangle", "text"];
var ANIMATION_CLASSES = {
  pulse: "k-skeleton-pulse",
  wave: "k-skeleton-wave"
};
var SHAPE_CLASSES = {
  rectangle: "k-skeleton-rect",
  circle: "k-skeleton-circle",
  text: "k-skeleton-text"
};
var skeletonShapeError = (input) => `"${input}" is not a valid kendo-skeleton shape. Valid shapes are: ${validShapes.map((s) => `"${s}"`).join(" | ")}.`;
var skeletonAnimationError = (input) => `"${input}" is not a valid kendo-skeleton animation. Valid values are: 'pulse' | 'wave' | false.`;
var SkeletonComponent = class _SkeletonComponent {
  renderer;
  hostElement;
  /**
   * Specifies the animation settings of the Skeleton.
   *
   * @default pulse
   */
  set animation(animation) {
    if (isDevMode() && validAnimations.indexOf(animation) === -1) {
      throw new Error(skeletonAnimationError(animation));
    }
    if (this.animation) {
      this.renderer.removeClass(this.hostElement.nativeElement, ANIMATION_CLASSES[this.animation]);
    }
    if (animation) {
      this.renderer.addClass(this.hostElement.nativeElement, ANIMATION_CLASSES[animation]);
    }
    this._animation = animation;
  }
  get animation() {
    return this._animation;
  }
  /**
   * Specifies the shape of the Skeleton.
   *
   * @default text
   */
  set shape(shape) {
    if (isDevMode() && validShapes.indexOf(shape) === -1) {
      throw new Error(skeletonShapeError(shape));
    }
    this.renderer.removeClass(this.hostElement.nativeElement, SHAPE_CLASSES[this.shape]);
    this.renderer.addClass(this.hostElement.nativeElement, SHAPE_CLASSES[shape]);
    this._shape = shape;
  }
  get shape() {
    return this._shape;
  }
  /**
   * Specifies the width of the Skeleton component.
   * Required for all Skeleton shapes.
   * Accepts a string like `100px`, `3em`, or `50%`, or an integer number for pixels.
   */
  set width(width) {
    this.renderer.setStyle(this.hostElement.nativeElement, "width", typeof width === "string" ? width : width + "px");
  }
  /**
   * Specifies the height of the Skeleton component.
   * Required for `circle` and `rectangle` shapes.
   * Not required for `text`, as it derives from the current CSS font-size.
   * Accepts a string like `100px`, `3em`, or `50%`, or an integer number for pixels.
   */
  set height(height) {
    this.renderer.setStyle(this.hostElement.nativeElement, "height", typeof height === "string" ? height : height + "px");
  }
  _animation = "pulse";
  _shape = "text";
  constructor(renderer, hostElement) {
    this.renderer = renderer;
    this.hostElement = hostElement;
  }
  ngAfterViewInit() {
    const hostElement = this.hostElement.nativeElement;
    hostElement.classList.add("k-skeleton", SHAPE_CLASSES[this.shape]);
    if (this.animation) {
      hostElement.classList.add(ANIMATION_CLASSES[this.animation]);
    }
  }
  static ɵfac = function SkeletonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SkeletonComponent)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _SkeletonComponent,
    selectors: [["kendo-skeleton"]],
    inputs: {
      animation: "animation",
      shape: "shape",
      width: "width",
      height: "height"
    },
    decls: 0,
    vars: 0,
    template: function SkeletonComponent_Template(rf, ctx) {
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SkeletonComponent, [{
    type: Component,
    args: [{
      selector: "kendo-skeleton",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: ``,
      standalone: true
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    animation: [{
      type: Input
    }],
    shape: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    height: [{
      type: Input
    }]
  });
})();
var KENDO_BADGECONTAINER = [BadgeComponent, BadgeContainerComponent];
var KENDO_LOADER = [LoaderComponent];
var KENDO_SKELETON = [SkeletonComponent];
var KENDO_INDICATORS = [...KENDO_BADGECONTAINER, ...KENDO_LOADER, ...KENDO_SKELETON];
var BadgeModule = class _BadgeModule {
  static ɵfac = function BadgeModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BadgeModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _BadgeModule,
    imports: [BadgeComponent, BadgeContainerComponent],
    exports: [BadgeComponent, BadgeContainerComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeModule, [{
    type: NgModule,
    args: [{
      exports: [...KENDO_BADGECONTAINER],
      imports: [...KENDO_BADGECONTAINER]
    }]
  }], null, null);
})();
var LoaderModule = class _LoaderModule {
  static ɵfac = function LoaderModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoaderModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _LoaderModule,
    imports: [LoaderComponent],
    exports: [LoaderComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoaderModule, [{
    type: NgModule,
    args: [{
      exports: [...KENDO_LOADER],
      imports: [...KENDO_LOADER]
    }]
  }], null, null);
})();
var SkeletonModule = class _SkeletonModule {
  static ɵfac = function SkeletonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SkeletonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _SkeletonModule,
    imports: [SkeletonComponent],
    exports: [SkeletonComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SkeletonModule, [{
    type: NgModule,
    args: [{
      exports: [...KENDO_SKELETON],
      imports: [...KENDO_SKELETON]
    }]
  }], null, null);
})();
var IndicatorsModule = class _IndicatorsModule {
  static ɵfac = function IndicatorsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IndicatorsModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _IndicatorsModule,
    imports: [BadgeComponent, BadgeContainerComponent, LoaderComponent, SkeletonComponent],
    exports: [BadgeComponent, BadgeContainerComponent, LoaderComponent, SkeletonComponent]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IndicatorsModule, [{
    type: NgModule,
    args: [{
      imports: [...KENDO_INDICATORS],
      exports: [...KENDO_INDICATORS]
    }]
  }], null, null);
})();

// node_modules/@progress/kendo-angular-toolbar/fesm2022/progress-kendo-angular-toolbar.mjs
var _c02 = ["toolbarTemplate"];
var _c1 = ["sectionTemplate"];
var _c2 = ["popupTemplate"];
var _c3 = ["kendoToolbarScrollableButton", ""];
var _c4 = ["overflowButton"];
var _c5 = ["popupSectionTemplate"];
var _c6 = ["scrollContainer"];
var _c7 = ["resizeSensor"];
var _c8 = ["container"];
var _c9 = ["prevScrollButton"];
var _c10 = ["nextScrollButton"];
var _c11 = ["startButtonGroup"];
var _c12 = ["endButtonGroup"];
var _c13 = ["scrollSeparator"];
var _c14 = (a0, a1, a2) => ({
  "k-button-sm": a0,
  "k-button-md": a1,
  "k-button-lg": a2
});
function ToolBarComponent_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "span", 20, 4);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_1_Conditional_0_Template_span_onClick_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("prev", true)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("prev"))("ngClass", ɵɵpureFunction3(4, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
  }
}
function ToolBarComponent_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 19, 5)(2, "span", 20, 4);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_1_Conditional_1_Template_span_onClick_2_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd();
    ɵɵelementStart(4, "span", 21, 6);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_1_Conditional_1_Template_span_onClick_4_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵproperty("prev", true)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("prev"))("ngClass", ɵɵpureFunction3(8, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
    ɵɵadvance(2);
    ɵɵproperty("prev", false)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("next"))("ngClass", ɵɵpureFunction3(12, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
  }
}
function ToolBarComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, ToolBarComponent_Conditional_1_Conditional_0_Template, 2, 8, "span", 18);
    ɵɵconditionalCreate(1, ToolBarComponent_Conditional_1_Conditional_1_Template, 6, 16, "div", 19);
    ɵɵelement(2, "div", 15, 3);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵconditional(ctx_r1.hasScrollButtons.position === "split" ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.hasScrollButtons.position === "start" ? 1 : -1);
  }
}
function ToolBarComponent_Conditional_2_For_3_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 23);
    ɵɵelementContainer(1, 24);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const tool_r5 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", tool_r5.toolbarTemplate);
  }
}
function ToolBarComponent_Conditional_2_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵtemplate(0, ToolBarComponent_Conditional_2_For_3_ng_template_0_Template, 2, 1, "ng-template", null, 8, ɵɵtemplateRefExtractor);
    ɵɵelementContainerStart(2, 22);
    ɵɵlistener("rendererClick", function ToolBarComponent_Conditional_2_For_3_Template_ng_container_rendererClick_2_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onRendererClick($event));
    });
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const tool_r5 = ctx.$implicit;
    const wrapper_r6 = ɵɵreference(1);
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵproperty("tool", tool_r5)("resizable", ctx_r1.resizable)("ngTemplateOutlet", tool_r5.isBuiltInTool ? tool_r5.toolbarTemplate : wrapper_r6);
  }
}
function ToolBarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 14, 7);
    ɵɵrepeaterCreate(2, ToolBarComponent_Conditional_2_For_3_Template, 3, 3, null, null, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r1.allTools);
  }
}
function ToolBarComponent_Conditional_3_For_1_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 23);
    ɵɵelementContainer(1, 24);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const tool_r8 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", tool_r8.toolbarTemplate);
  }
}
function ToolBarComponent_Conditional_3_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵtemplate(0, ToolBarComponent_Conditional_3_For_1_ng_template_0_Template, 2, 1, "ng-template", null, 8, ɵɵtemplateRefExtractor);
    ɵɵelementContainerStart(2, 22);
    ɵɵlistener("rendererClick", function ToolBarComponent_Conditional_3_For_1_Template_ng_container_rendererClick_2_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onRendererClick($event));
    });
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const tool_r8 = ctx.$implicit;
    const wrapper_r9 = ɵɵreference(1);
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵproperty("tool", tool_r8)("resizable", ctx_r1.resizable)("ngTemplateOutlet", tool_r8.isBuiltInTool ? tool_r8.toolbarTemplate : wrapper_r9);
  }
}
function ToolBarComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, ToolBarComponent_Conditional_3_For_1_Template, 3, 3, null, null, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵrepeater(ctx_r1.allTools);
  }
}
function ToolBarComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 15);
  }
}
function ToolBarComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 25, 9);
    ɵɵlistener("click", function ToolBarComponent_Conditional_5_Template_button_click_0_listener() {
      ɵɵrestoreView(_r10);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.showPopup());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵstyleProp("visibility", "hidden")("position", "relative");
    ɵɵproperty("icon", ctx_r1.overflowButtonIcon("font"))("svgIcon", ctx_r1.overflowButtonIcon("svg"))("title", ctx_r1.moreToolsTitle)("id", ctx_r1.overflowBtnId)("ngClass", ctx_r1.overflowClass);
    ɵɵattribute("aria-label", ctx_r1.moreToolsTitle)("aria-expanded", ctx_r1.popupOpen)("aria-haspopup", ctx_r1.normalizedOverflow.mode === "section" ? null : "menu");
  }
}
function ToolBarComponent_Conditional_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "span", 21, 6);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_6_Conditional_2_Template_span_onClick_0_listener($event) {
      ɵɵrestoreView(_r11);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("prev", false)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("next"))("ngClass", ɵɵpureFunction3(4, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
  }
}
function ToolBarComponent_Conditional_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 19, 10)(2, "span", 20, 4);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_6_Conditional_3_Template_span_onClick_2_listener($event) {
      ɵɵrestoreView(_r12);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd();
    ɵɵelementStart(4, "span", 21, 6);
    ɵɵlistener("onClick", function ToolBarComponent_Conditional_6_Conditional_3_Template_span_onClick_4_listener($event) {
      ɵɵrestoreView(_r12);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.scrollTools($event));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵproperty("prev", true)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("prev"))("ngClass", ɵɵpureFunction3(8, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
    ɵɵadvance(2);
    ɵɵproperty("prev", false)("overflow", ctx_r1.normalizedOverflow)("title", ctx_r1.getScrollButtonTitle("next"))("ngClass", ɵɵpureFunction3(12, _c14, ctx_r1.size === "small", ctx_r1.size === "medium", ctx_r1.size === "large"));
  }
}
function ToolBarComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 15, 3);
    ɵɵconditionalCreate(2, ToolBarComponent_Conditional_6_Conditional_2_Template, 2, 8, "span", 26);
    ɵɵconditionalCreate(3, ToolBarComponent_Conditional_6_Conditional_3_Template, 6, 16, "div", 19);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵconditional(ctx_r1.hasScrollButtons.position === "split" ? 2 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.hasScrollButtons.position === "end" ? 3 : -1);
  }
}
function ToolBarComponent_ng_template_7_For_2_Conditional_0_ng_template_0_Template(rf, ctx) {
}
function ToolBarComponent_ng_template_7_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = ɵɵgetCurrentView();
    ɵɵtemplate(0, ToolBarComponent_ng_template_7_For_2_Conditional_0_ng_template_0_Template, 0, 0, "ng-template", 29);
    ɵɵlistener("rendererClick", function ToolBarComponent_ng_template_7_For_2_Conditional_0_Template_ng_template_rendererClick_0_listener($event) {
      ɵɵrestoreView(_r13);
      const ctx_r1 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r1.onRendererClick($event));
    });
  }
  if (rf & 2) {
    const tool_r14 = ɵɵnextContext().$implicit;
    const popupWrapper_r15 = ɵɵreference(2);
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("tool", tool_r14)("resizable", ctx_r1.resizable)("ngTemplateOutlet", tool_r14.isBuiltInTool ? tool_r14.popupTemplate : popupWrapper_r15);
  }
}
function ToolBarComponent_ng_template_7_For_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 30);
    ɵɵelementContainer(1, 24);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const tool_r14 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", tool_r14.popupTemplate);
  }
}
function ToolBarComponent_ng_template_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, ToolBarComponent_ng_template_7_For_2_Conditional_0_Template, 1, 3, null, 28);
    ɵɵtemplate(1, ToolBarComponent_ng_template_7_For_2_ng_template_1_Template, 2, 1, "ng-template", null, 11, ɵɵtemplateRefExtractor);
  }
  if (rf & 2) {
    const tool_r14 = ctx.$implicit;
    ɵɵconditional(tool_r14.popupTemplate ? 0 : -1);
  }
}
function ToolBarComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 27);
    ɵɵrepeaterCreate(1, ToolBarComponent_ng_template_7_For_2_Template, 3, 1, null, null, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("id", ctx_r1.popupId);
    ɵɵattribute("dir", ctx_r1.direction === "rtl" ? "rtl" : null)("aria-labelledby", ctx_r1.overflowBtnId);
    ɵɵadvance();
    ɵɵrepeater(ctx_r1.overflowTools);
  }
}
function ToolBarComponent_ng_template_9_For_2_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 24);
  }
  if (rf & 2) {
    const tool_r17 = ɵɵnextContext().$implicit;
    ɵɵproperty("ngTemplateOutlet", tool_r17.sectionTemplate);
  }
}
function ToolBarComponent_ng_template_9_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = ɵɵgetCurrentView();
    ɵɵtemplate(0, ToolBarComponent_ng_template_9_For_2_ng_template_0_Template, 1, 1, "ng-template", null, 8, ɵɵtemplateRefExtractor);
    ɵɵelementContainerStart(2, 32);
    ɵɵlistener("rendererClick", function ToolBarComponent_ng_template_9_For_2_Template_ng_container_rendererClick_2_listener($event) {
      ɵɵrestoreView(_r16);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onRendererClick($event));
    });
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const tool_r17 = ctx.$implicit;
    const wrapper_r18 = ɵɵreference(1);
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵproperty("tool", tool_r17)("resizable", ctx_r1.resizable)("ngTemplateOutlet", tool_r17.isBuiltInTool ? tool_r17.sectionTemplate : wrapper_r18);
  }
}
function ToolBarComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 31);
    ɵɵrepeaterCreate(1, ToolBarComponent_ng_template_9_For_2_Template, 3, 3, null, null, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r1.sectionSizeClass)("id", ctx_r1.popupId);
    ɵɵattribute("dir", ctx_r1.direction === "rtl" ? "rtl" : null)("aria-labelledby", ctx_r1.overflowBtnId);
    ɵɵadvance();
    ɵɵrepeater(ctx_r1.overflowTools);
  }
}
function ToolBarComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-resize-sensor", null, 12);
  }
}
function ToolBarComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 17);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("licenseMessage", ctx_r1.licenseMessage);
  }
}
var _c15 = ["toolbarButton"];
var _c16 = ["sectionButton"];
function ToolBarButtonComponent_ng_template_0_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-badge", 8);
  }
  if (rf & 2) {
    ɵɵproperty("cutoutBorder", true);
  }
}
function ToolBarButtonComponent_ng_template_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-badge-container")(1, "button", 7, 3);
    ɵɵlistener("click", function ToolBarButtonComponent_ng_template_0_Conditional_0_Template_button_click_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.click.emit($event));
    })("pointerdown", function ToolBarButtonComponent_ng_template_0_Conditional_0_Template_button_pointerdown_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonComponent_ng_template_0_Conditional_0_Template_button_selectedChange_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event));
    })("blur", function ToolBarButtonComponent_ng_template_0_Conditional_0_Template_button_blur_1_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onBlur());
    });
    ɵɵtext(3);
    ɵɵelementEnd();
    ɵɵconditionalCreate(4, ToolBarButtonComponent_ng_template_0_Conditional_0_Conditional_4_Template, 1, 1, "kendo-badge", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵclassProp("k-toolbar-button", !ctx_r1.toggleable)("k-toolbar-toggle-button", ctx_r1.toggleable);
    ɵɵproperty("tabindex", ctx_r1.tabIndex)("size", ctx_r1.size)("ngStyle", ctx_r1.style)("ngClass", ctx_r1.className)("disabled", ctx_r1.disabled)("toggleable", ctx_r1.toggleable)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor)("rounded", ctx_r1.rounded)("selected", ctx_r1.selected)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl);
    ɵɵattribute("title", ctx_r1.title);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
    ɵɵadvance();
    ɵɵconditional(ctx_r1.showBadge ? 4 : -1);
  }
}
function ToolBarButtonComponent_ng_template_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 7, 3);
    ɵɵlistener("click", function ToolBarButtonComponent_ng_template_0_Conditional_1_Template_button_click_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.click.emit($event));
    })("pointerdown", function ToolBarButtonComponent_ng_template_0_Conditional_1_Template_button_pointerdown_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonComponent_ng_template_0_Conditional_1_Template_button_selectedChange_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event));
    })("blur", function ToolBarButtonComponent_ng_template_0_Conditional_1_Template_button_blur_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onBlur());
    });
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("k-toolbar-button", !ctx_r1.toggleable)("k-toolbar-toggle-button", ctx_r1.toggleable);
    ɵɵproperty("tabindex", ctx_r1.tabIndex)("size", ctx_r1.size)("ngStyle", ctx_r1.style)("ngClass", ctx_r1.className)("disabled", ctx_r1.disabled)("toggleable", ctx_r1.toggleable)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor)("rounded", ctx_r1.rounded)("selected", ctx_r1.selected)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl);
    ɵɵattribute("title", ctx_r1.title);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
  }
}
function ToolBarButtonComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, ToolBarButtonComponent_ng_template_0_Conditional_0_Template, 5, 21, "kendo-badge-container");
    ɵɵconditionalCreate(1, ToolBarButtonComponent_ng_template_0_Conditional_1_Template, 3, 20, "button", 6);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵconditional(ctx_r1.hasBadgeContainer ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional(!ctx_r1.hasBadgeContainer ? 1 : -1);
  }
}
function ToolBarButtonComponent_ng_template_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 11);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("name", ctx_r1.overflowOptions.icon)("customFontClass", ctx_r1.overflowOptions.iconClass)("svgIcon", ctx_r1.overflowOptions.svgIcon);
  }
}
function ToolBarButtonComponent_ng_template_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 12);
    ɵɵelement(1, "img", 14);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵproperty("src", ctx_r1.overflowOptions.imageUrl, ɵɵsanitizeUrl);
  }
}
function ToolBarButtonComponent_ng_template_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 13);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.overflowOptions.text);
  }
}
function ToolBarButtonComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 9, 4);
    ɵɵlistener("click", function ToolBarButtonComponent_ng_template_2_Template_div_click_0_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.handleClick($event));
    });
    ɵɵelementStart(2, "span", 10);
    ɵɵconditionalCreate(3, ToolBarButtonComponent_ng_template_2_Conditional_3_Template, 1, 3, "kendo-icon-wrapper", 11);
    ɵɵconditionalCreate(4, ToolBarButtonComponent_ng_template_2_Conditional_4_Template, 2, 1, "span", 12);
    ɵɵconditionalCreate(5, ToolBarButtonComponent_ng_template_2_Conditional_5_Template, 2, 1, "span", 13);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassProp("k-disabled", ctx_r1.disabled);
    ɵɵproperty("ngClass", ctx_r1.className)("ngStyle", ctx_r1.style);
    ɵɵadvance(2);
    ɵɵclassProp("k-selected", ctx_r1.selected);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.icon || ctx_r1.overflowOptions.iconClass || ctx_r1.overflowOptions.svgIcon ? 3 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.imageUrl ? 4 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.text ? 5 : -1);
  }
}
function ToolBarButtonComponent_ng_template_4_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-badge", 8);
  }
  if (rf & 2) {
    ɵɵproperty("cutoutBorder", true);
  }
}
function ToolBarButtonComponent_ng_template_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-badge-container")(1, "button", 7, 5);
    ɵɵlistener("click", function ToolBarButtonComponent_ng_template_4_Conditional_0_Template_button_click_1_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.click.emit($event));
    })("pointerdown", function ToolBarButtonComponent_ng_template_4_Conditional_0_Template_button_pointerdown_1_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonComponent_ng_template_4_Conditional_0_Template_button_selectedChange_1_listener($event) {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event));
    })("blur", function ToolBarButtonComponent_ng_template_4_Conditional_0_Template_button_blur_1_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onBlur());
    });
    ɵɵtext(3);
    ɵɵelementEnd();
    ɵɵconditionalCreate(4, ToolBarButtonComponent_ng_template_4_Conditional_0_Conditional_4_Template, 1, 1, "kendo-badge", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵclassProp("k-toolbar-button", !ctx_r1.toggleable)("k-toolbar-toggle-button", ctx_r1.toggleable);
    ɵɵproperty("tabindex", ctx_r1.tabIndex)("size", ctx_r1.size)("ngStyle", ctx_r1.style)("ngClass", ctx_r1.className)("disabled", ctx_r1.disabled)("toggleable", ctx_r1.toggleable)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor)("rounded", ctx_r1.rounded)("selected", ctx_r1.selected)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl);
    ɵɵattribute("title", ctx_r1.title);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
    ɵɵadvance();
    ɵɵconditional(ctx_r1.showBadge ? 4 : -1);
  }
}
function ToolBarButtonComponent_ng_template_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 7, 5);
    ɵɵlistener("click", function ToolBarButtonComponent_ng_template_4_Conditional_1_Template_button_click_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.click.emit($event));
    })("pointerdown", function ToolBarButtonComponent_ng_template_4_Conditional_1_Template_button_pointerdown_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonComponent_ng_template_4_Conditional_1_Template_button_selectedChange_0_listener($event) {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event));
    })("blur", function ToolBarButtonComponent_ng_template_4_Conditional_1_Template_button_blur_0_listener() {
      ɵɵrestoreView(_r6);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.onBlur());
    });
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("k-toolbar-button", !ctx_r1.toggleable)("k-toolbar-toggle-button", ctx_r1.toggleable);
    ɵɵproperty("tabindex", ctx_r1.tabIndex)("size", ctx_r1.size)("ngStyle", ctx_r1.style)("ngClass", ctx_r1.className)("disabled", ctx_r1.disabled)("toggleable", ctx_r1.toggleable)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor)("rounded", ctx_r1.rounded)("selected", ctx_r1.selected)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl);
    ɵɵattribute("title", ctx_r1.title);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
  }
}
function ToolBarButtonComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵconditionalCreate(0, ToolBarButtonComponent_ng_template_4_Conditional_0_Template, 5, 21, "kendo-badge-container");
    ɵɵconditionalCreate(1, ToolBarButtonComponent_ng_template_4_Conditional_1_Template, 3, 20, "button", 6);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵconditional(ctx_r1.hasBadgeContainer ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional(!ctx_r1.hasBadgeContainer ? 1 : -1);
  }
}
var _c17 = ["toolbarButtonGroup"];
var _c18 = ["sectionButtonGroup"];
var _c19 = ["listItem"];
function ToolBarButtonGroupComponent_ng_template_0_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function ToolBarButtonGroupComponent_ng_template_0_For_3_Template_button_click_0_listener($event) {
      const button_r4 = ɵɵrestoreView(_r3).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      button_r4.click.emit($event);
      return ɵɵresetView(ctx_r1.onButtonClick($event));
    })("pointerdown", function ToolBarButtonGroupComponent_ng_template_0_For_3_Template_button_pointerdown_0_listener($event) {
      const button_r4 = ɵɵrestoreView(_r3).$implicit;
      return ɵɵresetView(button_r4.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonGroupComponent_ng_template_0_For_3_Template_button_selectedChange_0_listener($event) {
      const button_r4 = ɵɵrestoreView(_r3).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event, button_r4));
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const button_r4 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngStyle", button_r4.style)("ngClass", button_r4.className)("disabled", button_r4.disabled)("size", ctx_r1.size)("togglable", button_r4.togglable)("selected", button_r4.selected)("fillMode", button_r4.fillMode)("themeColor", button_r4.themeColor)("icon", button_r4.toolbarOptions.icon)("iconClass", button_r4.toolbarOptions.iconClass)("svgIcon", button_r4.toolbarOptions.svgIcon)("imageUrl", button_r4.toolbarOptions.imageUrl);
    ɵɵattribute("title", button_r4.title)("aria-pressed", button_r4.togglable ? button_r4.selected ? true : false : null);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", button_r4.toolbarOptions.text, " ");
  }
}
function ToolBarButtonGroupComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-buttongroup", 6, 3);
    ɵɵlistener("navigate", function ToolBarButtonGroupComponent_ng_template_0_Template_kendo_buttongroup_navigate_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onNavigate($event));
    })("focus", function ToolBarButtonGroupComponent_ng_template_0_Template_kendo_buttongroup_focus_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onFocus());
    });
    ɵɵrepeaterCreate(2, ToolBarButtonGroupComponent_ng_template_0_For_3_Template, 2, 15, "button", 7, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r1.fillMode ? "k-button-group-" + ctx_r1.fillMode : "")("tabIndex", -1)("selection", ctx_r1.selection)("disabled", ctx_r1.disabled)("width", ctx_r1.width);
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r1.buttonComponents);
  }
}
function ToolBarButtonGroupComponent_ng_template_2_For_1_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 12);
  }
  if (rf & 2) {
    const button_r6 = ɵɵnextContext().$implicit;
    ɵɵproperty("name", button_r6.overflowOptions.icon)("customFontClass", button_r6.overflowOptions.iconClass)("svgIcon", button_r6.overflowOptions.svgIcon);
  }
}
function ToolBarButtonGroupComponent_ng_template_2_For_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 13);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const button_r6 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate(button_r6.overflowOptions.text);
  }
}
function ToolBarButtonGroupComponent_ng_template_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 10, 4);
    ɵɵlistener("click", function ToolBarButtonGroupComponent_ng_template_2_For_1_Template_div_click_0_listener($event) {
      const button_r6 = ɵɵrestoreView(_r5).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.handleClick($event, button_r6));
    });
    ɵɵelementStart(2, "span", 11);
    ɵɵconditionalCreate(3, ToolBarButtonGroupComponent_ng_template_2_For_1_Conditional_3_Template, 1, 3, "kendo-icon-wrapper", 12);
    ɵɵconditionalCreate(4, ToolBarButtonGroupComponent_ng_template_2_For_1_Conditional_4_Template, 2, 1, "span", 13);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const button_r6 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("k-disabled", ctx_r1.disabled || button_r6.disabled);
    ɵɵproperty("ngStyle", button_r6.style)("ngClass", button_r6.className);
    ɵɵadvance(2);
    ɵɵclassProp("k-selected", button_r6.selected);
    ɵɵadvance();
    ɵɵconditional(button_r6.overflowOptions.icon || button_r6.overflowOptions.iconClass || button_r6.overflowOptions.svgIcon ? 3 : -1);
    ɵɵadvance();
    ɵɵconditional(button_r6.overflowOptions.text ? 4 : -1);
  }
}
function ToolBarButtonGroupComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵrepeaterCreate(0, ToolBarButtonGroupComponent_ng_template_2_For_1_Template, 5, 8, "div", 9, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵrepeater(ctx_r1.buttonComponents);
  }
}
function ToolBarButtonGroupComponent_ng_template_4_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function ToolBarButtonGroupComponent_ng_template_4_For_3_Template_button_click_0_listener($event) {
      const button_r9 = ɵɵrestoreView(_r8).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      button_r9.click.emit($event);
      return ɵɵresetView(ctx_r1.onButtonClick($event));
    })("pointerdown", function ToolBarButtonGroupComponent_ng_template_4_For_3_Template_button_pointerdown_0_listener($event) {
      const button_r9 = ɵɵrestoreView(_r8).$implicit;
      return ɵɵresetView(button_r9.pointerdown.emit($event));
    })("selectedChange", function ToolBarButtonGroupComponent_ng_template_4_For_3_Template_button_selectedChange_0_listener($event) {
      const button_r9 = ɵɵrestoreView(_r8).$implicit;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.selectedChangeHandler($event, button_r9));
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const button_r9 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngStyle", button_r9.style)("ngClass", button_r9.className)("disabled", button_r9.disabled)("size", ctx_r1.size)("togglable", button_r9.togglable)("selected", button_r9.selected)("fillMode", button_r9.fillMode)("themeColor", button_r9.themeColor)("icon", button_r9.toolbarOptions.icon)("iconClass", button_r9.toolbarOptions.iconClass)("svgIcon", button_r9.toolbarOptions.svgIcon)("imageUrl", button_r9.toolbarOptions.imageUrl);
    ɵɵattribute("title", button_r9.title)("aria-pressed", button_r9.togglable ? button_r9.selected ? true : false : null);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", button_r9.toolbarOptions.text, " ");
  }
}
function ToolBarButtonGroupComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-buttongroup", 6, 5);
    ɵɵlistener("navigate", function ToolBarButtonGroupComponent_ng_template_4_Template_kendo_buttongroup_navigate_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onNavigate($event));
    })("focus", function ToolBarButtonGroupComponent_ng_template_4_Template_kendo_buttongroup_focus_0_listener() {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onFocus());
    });
    ɵɵrepeaterCreate(2, ToolBarButtonGroupComponent_ng_template_4_For_3_Template, 2, 15, "button", 7, ɵɵrepeaterTrackByIdentity);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r1.fillMode ? "k-button-group-" + ctx_r1.fillMode : "")("tabIndex", -1)("selection", ctx_r1.selection)("disabled", ctx_r1.disabled)("width", ctx_r1.width);
    ɵɵadvance(2);
    ɵɵrepeater(ctx_r1.buttonComponents);
  }
}
var _c20 = ["dropdownButton"];
var _c21 = ["toolbarDropDownButton"];
var _c22 = ["sectionDropDownButton"];
var _c23 = (a0) => ({
  "title": a0
});
var _c24 = () => ({
  "k-link": true,
  "k-menu-link": true
});
function ToolBarDropDownButtonComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-dropdownbutton", 6, 3);
    ɵɵlistener("open", function ToolBarDropDownButtonComponent_ng_template_0_Template_kendo_dropdownbutton_open_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.open.emit($event));
    })("close", function ToolBarDropDownButtonComponent_ng_template_0_Template_kendo_dropdownbutton_close_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.close.emit($event));
    })("itemClick", function ToolBarDropDownButtonComponent_ng_template_0_Template_kendo_dropdownbutton_itemClick_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.itemClick.emit($event));
    });
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl)("arrowIcon", ctx_r1.arrowIcon)("buttonClass", ctx_r1.buttonClass)("disabled", ctx_r1.disabled)("size", ctx_r1.size)("tabIndex", -1)("data", ctx_r1.data)("buttonAttributes", ɵɵpureFunction1(16, _c23, ctx_r1.title))("textField", ctx_r1.textField)("popupSettings", ctx_r1.popupSettings)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 9);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("name", ctx_r1.overflowOptions.icon)("customFontClass", ctx_r1.overflowOptions.iconClass)("svgIcon", ctx_r1.overflowOptions.svgIcon);
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 10);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.overflowOptions.text);
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_For_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 9);
  }
  if (rf & 2) {
    const item_r5 = ɵɵnextContext().$implicit;
    ɵɵproperty("name", item_r5.icon)("customFontClass", item_r5.iconClass)("svgIcon", item_r5.svgIcon);
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_For_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 10);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r5 = ɵɵnextContext().$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.getText(item_r5));
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 12, 4);
    ɵɵlistener("click", function ToolBarDropDownButtonComponent_ng_template_2_For_5_Template_div_click_0_listener($event) {
      const ctx_r3 = ɵɵrestoreView(_r3);
      const item_r5 = ctx_r3.$implicit;
      const ɵ$index_19_r6 = ctx_r3.$index;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.handleClick($event, item_r5, ɵ$index_19_r6));
    });
    ɵɵelementStart(2, "span", 13);
    ɵɵconditionalCreate(3, ToolBarDropDownButtonComponent_ng_template_2_For_5_Conditional_3_Template, 1, 3, "kendo-icon-wrapper", 9);
    ɵɵconditionalCreate(4, ToolBarDropDownButtonComponent_ng_template_2_For_5_Conditional_4_Template, 2, 1, "span", 10);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("k-disabled", ctx_r1.disabled || item_r5.disabled);
    ɵɵadvance(2);
    ɵɵproperty("ngClass", item_r5.cssClass);
    ɵɵadvance();
    ɵɵconditional(item_r5.icon || item_r5.iconClass || item_r5.svgIcon ? 3 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.getText(item_r5) ? 4 : -1);
  }
}
function ToolBarDropDownButtonComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 7)(1, "span", 8);
    ɵɵconditionalCreate(2, ToolBarDropDownButtonComponent_ng_template_2_Conditional_2_Template, 1, 3, "kendo-icon-wrapper", 9);
    ɵɵconditionalCreate(3, ToolBarDropDownButtonComponent_ng_template_2_Conditional_3_Template, 2, 1, "span", 10);
    ɵɵelementEnd()();
    ɵɵrepeaterCreate(4, ToolBarDropDownButtonComponent_ng_template_2_For_5_Template, 5, 5, "div", 11, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r1.buttonClass);
    ɵɵadvance();
    ɵɵproperty("ngClass", ɵɵpureFunction0(4, _c24));
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.icon || ctx_r1.overflowOptions.iconClass || ctx_r1.overflowOptions.svgIcon ? 2 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.text ? 3 : -1);
    ɵɵadvance();
    ɵɵrepeater(ctx_r1.data);
  }
}
function ToolBarDropDownButtonComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-dropdownbutton", 6, 5);
    ɵɵlistener("open", function ToolBarDropDownButtonComponent_ng_template_4_Template_kendo_dropdownbutton_open_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.open.emit($event));
    })("close", function ToolBarDropDownButtonComponent_ng_template_4_Template_kendo_dropdownbutton_close_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.close.emit($event));
    })("itemClick", function ToolBarDropDownButtonComponent_ng_template_4_Template_kendo_dropdownbutton_itemClick_0_listener($event) {
      ɵɵrestoreView(_r7);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.itemClick.emit($event));
    });
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl)("arrowIcon", ctx_r1.arrowIcon)("buttonClass", ctx_r1.buttonClass)("disabled", ctx_r1.disabled)("size", ctx_r1.size)("tabIndex", -1)("data", ctx_r1.data)("buttonAttributes", ɵɵpureFunction1(16, _c23, ctx_r1.title))("textField", ctx_r1.textField)("popupSettings", ctx_r1.popupSettings)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", ctx_r1.toolbarOptions.text, " ");
  }
}
var _c25 = ["toolbarSplitButton"];
var _c26 = ["sectionSplitButton"];
var _c27 = ["overflowMainButton"];
function ToolBarSplitButtonComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-splitbutton", 7, 3);
    ɵɵlistener("buttonClick", function ToolBarSplitButtonComponent_ng_template_0_Template_kendo_splitbutton_buttonClick_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.buttonClick.emit($event));
    })("open", function ToolBarSplitButtonComponent_ng_template_0_Template_kendo_splitbutton_open_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.open.emit($event));
    })("close", function ToolBarSplitButtonComponent_ng_template_0_Template_kendo_splitbutton_close_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.close.emit($event));
    })("itemClick", function ToolBarSplitButtonComponent_ng_template_0_Template_kendo_splitbutton_itemClick_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.itemClick.emit($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("data", ctx_r1.data)("text", ctx_r1.toolbarOptions.text)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl)("buttonClass", ctx_r1.buttonClass)("arrowButtonClass", ctx_r1.arrowButtonClass)("arrowButtonIcon", ctx_r1.arrowButtonIcon)("arrowButtonSvgIcon", ctx_r1.arrowButtonSvgIcon)("disabled", ctx_r1.disabled)("size", ctx_r1.size)("tabIndex", -1)("textField", ctx_r1.textField)("popupSettings", ctx_r1.popupSettings)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor);
  }
}
function ToolBarSplitButtonComponent_ng_template_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 10);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("name", ctx_r1.overflowOptions.icon)("customFontClass", ctx_r1.overflowOptions.iconClass)("svgIcon", ctx_r1.overflowOptions.svgIcon);
  }
}
function ToolBarSplitButtonComponent_ng_template_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 11);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.overflowOptions.text);
  }
}
function ToolBarSplitButtonComponent_ng_template_2_For_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "kendo-icon-wrapper", 10);
  }
  if (rf & 2) {
    const item_r6 = ɵɵnextContext().$implicit;
    ɵɵproperty("name", item_r6.icon)("customFontClass", item_r6.iconClass)("svgIcon", item_r6.svgIcon);
  }
}
function ToolBarSplitButtonComponent_ng_template_2_For_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 11);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r6 = ɵɵnextContext().$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.getText(item_r6));
  }
}
function ToolBarSplitButtonComponent_ng_template_2_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 13, 5);
    ɵɵlistener("click", function ToolBarSplitButtonComponent_ng_template_2_For_6_Template_div_click_0_listener($event) {
      const ctx_r4 = ɵɵrestoreView(_r4);
      const item_r6 = ctx_r4.$implicit;
      const ɵ$index_18_r7 = ctx_r4.$index;
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.handleClick($event, item_r6, ɵ$index_18_r7));
    });
    ɵɵelementStart(2, "span", 14);
    ɵɵconditionalCreate(3, ToolBarSplitButtonComponent_ng_template_2_For_6_Conditional_3_Template, 1, 3, "kendo-icon-wrapper", 10);
    ɵɵconditionalCreate(4, ToolBarSplitButtonComponent_ng_template_2_For_6_Conditional_4_Template, 2, 1, "span", 11);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("k-disabled", ctx_r1.disabled || item_r6.disabled);
    ɵɵadvance(3);
    ɵɵconditional(item_r6.icon || item_r6.iconClass || item_r6.svgIcon ? 3 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.getText(item_r6) ? 4 : -1);
  }
}
function ToolBarSplitButtonComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 8, 4);
    ɵɵlistener("click", function ToolBarSplitButtonComponent_ng_template_2_Template_div_click_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onMainButtonClick($event));
    });
    ɵɵelementStart(2, "span", 9);
    ɵɵconditionalCreate(3, ToolBarSplitButtonComponent_ng_template_2_Conditional_3_Template, 1, 3, "kendo-icon-wrapper", 10);
    ɵɵconditionalCreate(4, ToolBarSplitButtonComponent_ng_template_2_Conditional_4_Template, 2, 1, "span", 11);
    ɵɵelementEnd()();
    ɵɵrepeaterCreate(5, ToolBarSplitButtonComponent_ng_template_2_For_6_Template, 5, 4, "div", 12, ɵɵrepeaterTrackByIdentity);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassProp("k-disabled", ctx_r1.disabled);
    ɵɵproperty("ngClass", ctx_r1.buttonClass);
    ɵɵadvance(2);
    ɵɵproperty("ngClass", ɵɵpureFunction0(6, _c24));
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.icon || ctx_r1.overflowOptions.iconClass || ctx_r1.overflowOptions.svgIcon ? 3 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r1.overflowOptions.text ? 4 : -1);
    ɵɵadvance();
    ɵɵrepeater(ctx_r1.data);
  }
}
function ToolBarSplitButtonComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "kendo-splitbutton", 7, 6);
    ɵɵlistener("buttonClick", function ToolBarSplitButtonComponent_ng_template_4_Template_kendo_splitbutton_buttonClick_0_listener($event) {
      ɵɵrestoreView(_r8);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.buttonClick.emit($event));
    })("open", function ToolBarSplitButtonComponent_ng_template_4_Template_kendo_splitbutton_open_0_listener($event) {
      ɵɵrestoreView(_r8);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.open.emit($event));
    })("close", function ToolBarSplitButtonComponent_ng_template_4_Template_kendo_splitbutton_close_0_listener($event) {
      ɵɵrestoreView(_r8);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.close.emit($event));
    })("itemClick", function ToolBarSplitButtonComponent_ng_template_4_Template_kendo_splitbutton_itemClick_0_listener($event) {
      ɵɵrestoreView(_r8);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.itemClick.emit($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("data", ctx_r1.data)("text", ctx_r1.toolbarOptions.text)("icon", ctx_r1.toolbarOptions.icon)("iconClass", ctx_r1.toolbarOptions.iconClass)("svgIcon", ctx_r1.toolbarOptions.svgIcon)("imageUrl", ctx_r1.toolbarOptions.imageUrl)("buttonClass", ctx_r1.buttonClass)("arrowButtonClass", ctx_r1.arrowButtonClass)("arrowButtonIcon", ctx_r1.arrowButtonIcon)("arrowButtonSvgIcon", ctx_r1.arrowButtonSvgIcon)("disabled", ctx_r1.disabled)("size", ctx_r1.size)("tabIndex", -1)("textField", ctx_r1.textField)("popupSettings", ctx_r1.popupSettings)("fillMode", ctx_r1.fillMode)("themeColor", ctx_r1.themeColor);
  }
}
var _c28 = ["separator"];
function ToolBarSeparatorComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵdomElement(0, "div", 3);
  }
}
function ToolBarSeparatorComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵdomElement(0, "div", 3);
  }
}
function ToolBarSeparatorComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵdomElementStart(0, "div", 4);
    ɵɵdomElement(1, "div", 5);
    ɵɵdomElementEnd();
  }
}
function ToolBarSpacerComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵdomElement(0, "div", 1);
  }
}
var packageMetadata2 = {
  name: "@progress/kendo-angular-toolbar",
  productName: "Kendo UI for Angular",
  productCode: "KENDOUIANGULAR",
  productCodes: ["KENDOUIANGULAR"],
  publishDate: 1780593757,
  version: "24.1.0",
  licensingDocsUrl: "https://www.telerik.com/kendo-angular-ui/my-license/"
};
var RefreshService = class _RefreshService {
  onRefresh = new EventEmitter();
  refresh(tool) {
    this.onRefresh.emit(tool);
  }
  static ɵfac = function RefreshService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RefreshService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _RefreshService,
    factory: _RefreshService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RefreshService, [{
    type: Injectable
  }], null, null);
})();
var focusableRegex = /^(?:a|input|select|textarea|button|object)$/i;
function outerWidth(element) {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);
  width += parseFloat(style.marginLeft) || 0 + parseFloat(style.marginRight) || 0;
  return width;
}
function innerWidth(element) {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);
  width -= parseFloat(style.paddingLeft) || 0 + parseFloat(style.borderLeftWidth) || 0;
  width -= parseFloat(style.paddingRight) || 0 + parseFloat(style.borderRightWidth) || 0;
  return width;
}
var closest = (node, predicate) => {
  while (node && !predicate(node)) {
    node = node.parentNode;
  }
  return node;
};
var isSmartBoxInput = (target) => {
  return !!closest(target, (el) => el.classList?.contains("k-smart-box"));
};
var isVisible = (element) => {
  if (!element?.getBoundingClientRect) {
    return false;
  }
  const rect = element.getBoundingClientRect();
  const hasSize = rect.width > 0 && rect.height > 0;
  const hasPosition = rect.x !== 0 && rect.y !== 0;
  return (hasSize || hasPosition) && window.getComputedStyle(element).visibility !== "hidden";
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
var isFocusable = (element, checkVisibility = true) => {
  if (element.tagName) {
    const tagName = element.tagName.toLowerCase();
    const tabIndex = element.getAttribute("tabIndex");
    let focusable = tabIndex !== null;
    if (focusableRegex.test(tagName)) {
      focusable = !element.disabled;
    }
    return focusable && (!checkVisibility || isVisible(element));
  }
  return false;
};
var findFocusable = (element, checkVisibility = true) => {
  return findElement(element, (node) => isFocusable(node, checkVisibility));
};
var findFocusableChild = (element, checkVisibility = true) => {
  return findElement(element, (node) => isFocusable(node, checkVisibility), false);
};
var findFocusableSibling = (element, checkVisibility = true, reverse) => {
  let node = reverse ? element.prevSibling : element.nextSibling;
  while (node) {
    if (node.nodeType === 1) {
      const result = findElement(node, (el) => isFocusable(el, checkVisibility));
      if (result) {
        return result;
      }
    }
    node = reverse ? node.prevSibling : node.nextSibling;
  }
};
var isPresent2 = (value) => value !== null && value !== void 0;
var makePeeker = (collection) => (index) => isPresent2(collection[index]);
var getIndexOfFocused = (prevKeyCode, nextKeyCode, collection) => (ev) => {
  const code = normalizeKeys(ev);
  switch (ev.type) {
    case "keydown":
      if (code === prevKeyCode) {
        return collection.length - 1;
      }
      if (code === nextKeyCode) {
        return 0;
      }
      break;
    case "click":
      return collection.findIndex((be) => be === ev.target || be.contains(ev.target));
    case "focus":
      return 0;
    default:
      return 0;
  }
};
var seekFocusedIndex = (prevKeyCode, nextKeyCode, seeker) => (startIndex, ev) => {
  const code = normalizeKeys(ev);
  switch (code) {
    case prevKeyCode:
      return seeker(startIndex - 1) ? startIndex - 1 : startIndex;
    case nextKeyCode:
      return seeker(startIndex + 1) ? startIndex + 1 : startIndex;
    default:
      return startIndex;
  }
};
var areEqual = (first) => (second) => first === second;
var getNextKey = (rtl = false) => (overflows = true) => overflows ? Keys.ArrowDown : rtl ? Keys.ArrowLeft : Keys.ArrowRight;
var getPrevKey = (rtl = false) => (overflows = true) => overflows ? Keys.ArrowUp : rtl ? Keys.ArrowRight : Keys.ArrowLeft;
var getValueForLocation = (property, displayMode, overflows) => {
  switch (displayMode) {
    case "toolbar":
      return overflows ? void 0 : property;
    case "menu":
      return overflows ? property : void 0;
    case "never":
      return;
    default:
      return property;
  }
};
var SIZES = {
  small: "sm",
  medium: "md",
  large: "lg"
};
var getStylingClasses = (componentType, stylingOption, previousValue, newValue) => {
  switch (stylingOption) {
    case "size": {
      return {
        toRemove: previousValue ? `k-${componentType}-${SIZES[previousValue]}` : null,
        toAdd: newValue ? `k-${componentType}-${SIZES[newValue]}` : null
      };
    }
    case "fillMode": {
      return {
        toRemove: previousValue ? `k-${componentType}-${previousValue}` : null,
        toAdd: newValue ? `k-${componentType}-${newValue}` : null
      };
    }
    default:
      break;
  }
};
var isElementOrTextNode = (n) => n.nodeType === 1 || n.nodeType === 3;
var normalizeOverflowSettings = (overflow) => {
  const defaultOverflowSettings = {
    mode: "none",
    scrollButtons: "auto",
    scrollButtonsPosition: "split"
  };
  let normalizedSettings = {};
  if (typeof overflow === "object") {
    normalizedSettings = Object.assign(defaultOverflowSettings, overflow);
  } else if (typeof overflow === "boolean") {
    normalizedSettings = overflow ? Object.assign(defaultOverflowSettings, {
      mode: "menu"
    }) : defaultOverflowSettings;
  } else {
    normalizedSettings = Object.assign(defaultOverflowSettings, {
      mode: overflow
    });
  }
  return normalizedSettings;
};
var NavigationService = class _NavigationService {
  zone;
  overflowButton;
  focused = {
    renderedTool: null,
    index: -1
  };
  renderedTools = [];
  isPopupFocused = false;
  isOverflowButtonFocused = false;
  constructor(zone) {
    this.zone = zone;
  }
  setRenderedTools(rts) {
    this.renderedTools = rts;
  }
  click({
    context,
    event: ev
  }) {
    if (this.focused.renderedTool !== context && ev) {
      this.focus(context, ev);
    }
  }
  moveFocusToToolBar() {
    this.isPopupFocused = false;
    this.focusOverflowButton();
  }
  moveFocusToPopup() {
    this.isPopupFocused = true;
    this.resetNavigation();
    this.focus();
  }
  focusNext(ev) {
    if (this.isOverflowButtonFocused) {
      const firstFocusableRT = this.getFocusableTools()[0];
      this.focus(firstFocusableRT, ev);
    } else if (!this.isOverflowButtonFocused && this.focused.renderedTool && !this.focused.renderedTool.tool.handleKey(ev)) {
      const nextRT = this.getFocusableTools().slice(this.focused.index + 1)[0];
      if (nextRT) {
        this.focus(nextRT, ev);
      } else {
        if (this.isOverflowButtonVisible() && !this.isPopupFocused) {
          this.focusOverflowButton();
        } else {
          const firstRT = this.getFocusableTools()[0];
          this.focus(firstRT, ev);
        }
      }
    }
  }
  focusPrev(ev) {
    if (this.isOverflowButtonFocused) {
      const lastFocusableRT = this.getFocusableTools().reverse()[0];
      this.focus(lastFocusableRT, ev);
    } else if (!this.isOverflowButtonFocused && this.focused.renderedTool && !this.focused.renderedTool.tool.handleKey(ev)) {
      const prevRT = this.getFocusableTools().slice(0, this.focused.index).reverse()[0];
      if (prevRT) {
        this.focus(prevRT, ev);
      } else {
        if (this.isOverflowButtonVisible() && !this.isPopupFocused) {
          this.focusOverflowButton();
        } else {
          const lastRT = this.getFocusableTools().reverse()[0];
          this.focus(lastRT, ev);
        }
      }
    }
  }
  resetNavigation() {
    this.blurOverflowButton();
    this.focused.renderedTool = null;
    this.focused.index = -1;
  }
  focusFirst(ev) {
    const firstTool = this.getFocusableTools()[0];
    const overFlowButton = this.overflowButton;
    if (firstTool) {
      this.focused.renderedTool = firstTool;
      this.focused.index = this.getFocusableTools().findIndex((rt) => rt === firstTool);
      this.focus(firstTool, ev);
    } else if (overFlowButton) {
      overFlowButton.nativeElement.focus();
    }
  }
  focusLast(ev) {
    const lastTool = this.getFocusableTools().reverse()[0];
    const overFlowButton = this.overflowButton;
    if (lastTool) {
      this.focused.renderedTool = lastTool;
      this.focused.index = this.getFocusableTools().findIndex((rt) => rt === lastTool);
      this.focus(lastTool, ev);
    } else if (overFlowButton) {
      overFlowButton.nativeElement.focus();
    }
  }
  getFocusableTools() {
    return this.renderedTools.filter((rt) => rt.tool.overflows === this.isPopupFocused && rt.tool.canFocus());
  }
  focus(renderedTool, ev) {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      if (!renderedTool) {
        const focusableRTs = this.getFocusableTools();
        const lastFocusedRT = focusableRTs.find((rt) => rt === this.focused.renderedTool) || focusableRTs[0];
        if (lastFocusedRT) {
          this.focused.renderedTool = lastFocusedRT;
          this.focused.index = this.getFocusableTools().findIndex((rt) => rt === lastFocusedRT);
          lastFocusedRT.tool.focus(ev);
        }
      } else if (renderedTool.tool.canFocus && renderedTool.tool.canFocus()) {
        this.focused.renderedTool = renderedTool;
        this.focused.index = this.getFocusableTools().findIndex((rt) => rt === renderedTool);
        renderedTool.tool.focus(ev);
        this.blurOverflowButton();
      }
    });
  }
  blurOverflowButton() {
    if (this.overflowButton) {
      this.isOverflowButtonFocused = false;
      this.overflowButton.nativeElement.tabIndex = -1;
    }
  }
  focusOverflowButton() {
    if (this.overflowButton) {
      this.isOverflowButtonFocused = true;
      this.overflowButton.nativeElement.tabIndex = 0;
      this.overflowButton.nativeElement.focus();
    }
  }
  isOverflowButtonVisible() {
    return isPresent2(this.overflowButton) && window.getComputedStyle(this.overflowButton.nativeElement).getPropertyValue("visibility") === "visible";
  }
  static ɵfac = function NavigationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavigationService)(ɵɵinject(NgZone));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _NavigationService,
    factory: _NavigationService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavigationService, [{
    type: Injectable
  }], () => [{
    type: NgZone
  }], null);
})();
var ToolBarToolComponent = class _ToolBarToolComponent {
  toolbarTemplate;
  sectionTemplate;
  popupTemplate;
  tabIndex = -1;
  //Focus movement inside the toolbar is managed using roving tabindex.
  overflows = true;
  visibility;
  element;
  isBuiltInTool = false;
  /**
   * @hidden
   */
  isHidden = false;
  /**
   * @hidden
   */
  location;
  constructor() {
    this.element = inject(ElementRef);
  }
  // this should be replaced with showTool: DisplayMode = 'both';
  /**
   * @hidden
   */
  responsive = true;
  get toolbarDisplay() {
    return this.overflows ? "none" : "inline-flex";
  }
  get overflowDisplay() {
    return this.overflows ? "block" : "none";
  }
  /**
   * Determines if the tool can receive focus.
   * Returns `true` if the tool participates in keyboard navigation.
   * @returns `true` if the tool is focusable.
   */
  canFocus() {
    return false;
  }
  /**
   * Called when the tool receives focus.
   * Accepts the original browser event, which can be a `KeyboardEvent`, `MouseEvent`, or `FocusEvent`.
   * @param {Event} _ev - The event that triggers focus for the tool.
   */
  focus(_ev) {
  }
  /**
   * Called when the tool is focused and an arrow key is pressed.
   * Returns a boolean value that determines if the `ToolBarComponent` moves focus to the next or previous tool
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/custom-control-types#adding-keyboard-navigation)).
   * @param {KeyboardEvent} _ev - The last pressed arrow key.
   * @returns `true` if focus moves to another tool.
   */
  handleKey(_ev) {
    return false;
  }
  static ɵfac = function ToolBarToolComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarToolComponent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ToolBarToolComponent,
    viewQuery: function ToolBarToolComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c02, 7)(_c1, 7)(_c2, 7);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toolbarTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sectionTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.popupTemplate = _t.first);
      }
    },
    inputs: {
      responsive: "responsive"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarToolComponent, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], () => [], {
    toolbarTemplate: [{
      type: ViewChild,
      args: ["toolbarTemplate", {
        static: true
      }]
    }],
    sectionTemplate: [{
      type: ViewChild,
      args: ["sectionTemplate", {
        static: true
      }]
    }],
    popupTemplate: [{
      type: ViewChild,
      args: ["popupTemplate", {
        static: true
      }]
    }],
    responsive: [{
      type: Input
    }]
  });
})();
var PreventableEvent = class {
  prevented = false;
  /**
   * Prevents the default action for a specified event.
   * In this way, the source component suppresses the built-in behavior that follows the event.
   */
  preventDefault() {
    this.prevented = true;
  }
  /**
   * If the event is prevented by any of its subscribers, returns `true`.
   *
   * @returns `true` if the default action was prevented. Otherwise, returns `false`.
   */
  isDefaultPrevented() {
    return this.prevented;
  }
};
var RendererService = class _RendererService {
  element;
  renderer;
  getElement() {
    return this.element.nativeElement;
  }
  querySelector(selector) {
    return this.element.nativeElement.querySelector(selector);
  }
  querySelectorAll(selector) {
    return this.element.nativeElement.querySelectorAll(selector);
  }
  findFocusable() {
    return findFocusable(this.element.nativeElement, false);
  }
  findFocusableChild(element) {
    if (!element) {
      element = this.findFocusable();
    }
    return findFocusableChild(element, false);
  }
  findNextFocusableSibling(element) {
    if (!element) {
      element = this.findFocusable();
    }
    return findFocusableSibling(element, false);
  }
  findPrevFocusableSibling(element) {
    if (!element) {
      element = this.findFocusable();
    }
    return findFocusableSibling(element, false, true);
  }
  setAttribute(element, attr, value) {
    this.renderer.setAttribute(element, attr, value);
  }
  static ɵfac = function RendererService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RendererService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _RendererService,
    factory: _RendererService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RendererService, [{
    type: Injectable
  }], null, null);
})();
var ToolbarToolsService = class _ToolbarToolsService {
  renderedToolsChange = new Subject();
  overflowToolsChange = new Subject();
  renderedTools = [];
  overflowTools = [];
  allTools = [];
  reset() {
    this.renderedTools = this.overflowTools = this.allTools = [];
  }
  static ɵfac = function ToolbarToolsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolbarToolsService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ToolbarToolsService,
    factory: _ToolbarToolsService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarToolsService, [{
    type: Injectable
  }], null, null);
})();
var MIN_SPACER_WIDTH = 18;
var ToolBarRendererComponent = class _ToolBarRendererComponent {
  renderer;
  rendererService;
  refreshService;
  toolsService;
  viewContainer;
  tool;
  location;
  resizable;
  rendererClick = new EventEmitter();
  template;
  element;
  get isSpacer() {
    return this.tool && this.tool.__isSpacer;
  }
  refreshSubscription;
  internalComponentRef;
  constructor(renderer, rendererService, refreshService, toolsService, viewContainer) {
    this.renderer = renderer;
    this.rendererService = rendererService;
    this.refreshService = refreshService;
    this.toolsService = toolsService;
    this.viewContainer = viewContainer;
  }
  ngOnInit() {
    this.tool.location = this.location;
    this.element = this.tool.element;
    this.rendererService.element = this.element;
    this.rendererService.renderer = this;
    this.refreshSubscription = this.refreshService.onRefresh.subscribe((tool) => {
      if (this.tool === tool) {
        this.refresh();
      }
    });
  }
  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
    this.internalComponentRef?.removeEventListener("click", this.onClick);
  }
  ngAfterViewInit() {
    const viewContainerRootNodes = this.viewContainer.get(0)?.rootNodes?.filter(isElementOrTextNode);
    if (!viewContainerRootNodes || viewContainerRootNodes.length === 0) {
      return;
    }
    this.internalComponentRef = viewContainerRootNodes[0];
    this.internalComponentRef.addEventListener("click", this.onClick);
    if (this.resizable) {
      if (this.location === "toolbar") {
        this.template = this.tool.toolbarTemplate;
        this.hideTool();
      } else if (this.location === "section") {
        this.template = this.tool.toolbarTemplate;
        if (this.tool.isHidden) {
          this.hideTool();
        } else {
          this.renderer.setStyle(this.internalComponentRef, "visibility", "visible");
          this.renderer.setStyle(this.internalComponentRef, "display", "inline-flex");
        }
      } else {
        this.template = this.tool.popupTemplate;
        if (this.tool.isHidden) {
          this.hideTool();
        } else {
          this.renderer.setStyle(this.internalComponentRef, "display", "none");
        }
      }
    } else {
      this.tool.overflows = false;
      this.template = this.tool.toolbarTemplate;
      if (this.tool.isHidden) {
        this.hideTool();
      } else {
        this.renderer.setStyle(this.internalComponentRef, "visibility", "visible");
        this.renderer.setStyle(this.internalComponentRef, "display", "inline-flex");
      }
    }
    if (this.resizable) {
      this.refresh();
    }
    this.updateTools();
  }
  /**
   * @hidden
   */
  get width() {
    if (this.isSpacer) {
      return MIN_SPACER_WIDTH;
    }
    if (!this.internalComponentRef) {
      return;
    }
    return this.tool.overflows ? 0 : outerWidth(this.internalComponentRef);
  }
  isDisplayed() {
    return this.internalComponentRef?.style?.display !== "none";
  }
  refresh() {
    this.tool.location = this.location;
    if (!isPresent(this.internalComponentRef)) {
      return;
    }
    if (this.tool.isHidden) {
      this.hideTool();
    } else if (this.resizable) {
      if (this.location === "toolbar") {
        this.renderer.setStyle(this.internalComponentRef, "visibility", this.tool.visibility);
        this.renderer.setStyle(this.internalComponentRef, "display", this.tool.toolbarDisplay);
      } else if (this.location === "section") {
        this.renderer.setStyle(this.internalComponentRef, "visibility", "visible");
        this.renderer.setStyle(this.internalComponentRef, "display", this.tool.overflows ? "inline-flex" : "none");
      } else {
        this.renderer.setStyle(this.internalComponentRef, "display", this.tool.overflowDisplay);
      }
    } else {
      this.renderer.setStyle(this.internalComponentRef, "visibility", "visible");
      this.renderer.setStyle(this.internalComponentRef, "display", "inline-flex");
    }
    this.updateTools();
  }
  setAttribute(element, attr, value) {
    this.renderer.setAttribute(element, attr, value);
  }
  onClick = (ev) => {
    this.rendererClick.emit({
      context: this,
      event: ev
    });
  };
  updateTools() {
    this.tool.location = this.location;
    const isInToolbar = this.toolsService.renderedTools.some((t) => t.tool === this.tool);
    const isInPopup = this.toolsService.overflowTools.some((t) => t.tool === this.tool);
    if (this.location === "toolbar") {
      isInPopup && (this.toolsService.overflowTools = this.toolsService.overflowTools.filter((t) => t.tool !== this.tool));
      !isInToolbar && this.toolsService.renderedTools.push(this);
    } else {
      if (!isInPopup) {
        this.toolsService.overflowTools.push(this);
        this.toolsService.overflowTools.sort((t1, t2) => {
          return this.toolsService.allTools.indexOf(t1.tool) - this.toolsService.allTools.indexOf(t2.tool);
        });
      }
    }
  }
  hideTool() {
    this.renderer.setStyle(this.internalComponentRef, "visibility", "hidden");
    this.renderer.setStyle(this.internalComponentRef, "display", "none");
  }
  static ɵfac = function ToolBarRendererComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarRendererComponent)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(RendererService), ɵɵdirectiveInject(RefreshService), ɵɵdirectiveInject(ToolbarToolsService), ɵɵdirectiveInject(ViewContainerRef));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _ToolBarRendererComponent,
    selectors: [["", "kendoToolbarRenderer", ""]],
    inputs: {
      tool: "tool",
      location: "location",
      resizable: "resizable"
    },
    outputs: {
      rendererClick: "rendererClick"
    },
    features: [ɵɵProvidersFeature([RendererService])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarRendererComponent, [{
    type: Directive,
    args: [{
      providers: [RendererService],
      standalone: true,
      selector: "[kendoToolbarRenderer]"
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: RendererService
  }, {
    type: RefreshService
  }, {
    type: ToolbarToolsService
  }, {
    type: ViewContainerRef
  }], {
    tool: [{
      type: Input
    }],
    location: [{
      type: Input
    }],
    resizable: [{
      type: Input
    }],
    rendererClick: [{
      type: Output
    }]
  });
})();
var ToolbarMessages = class _ToolbarMessages extends ComponentMessages {
  /**
   * Sets the title of the **More Tools** button in a responsive ToolBar.
   */
  moreToolsTitle;
  /**
   * Sets the title for the **Previous Tool** button when the ToolBar is scrollable.
   */
  previousToolButton;
  /**
   * Sets the title for the **Next Tool** button when the ToolBar is scrollable.
   */
  nextToolButton;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵToolbarMessages_BaseFactory;
    return function ToolbarMessages_Factory(__ngFactoryType__) {
      return (ɵToolbarMessages_BaseFactory || (ɵToolbarMessages_BaseFactory = ɵɵgetInheritedFactory(_ToolbarMessages)))(__ngFactoryType__ || _ToolbarMessages);
    };
  })();
  static ɵdir = ɵɵdefineDirective({
    type: _ToolbarMessages,
    selectors: [["kendo-toolbar-messages-base"]],
    inputs: {
      moreToolsTitle: "moreToolsTitle",
      previousToolButton: "previousToolButton",
      nextToolButton: "nextToolButton"
    },
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarMessages, [{
    type: Directive,
    args: [{
      selector: "kendo-toolbar-messages-base"
    }]
  }], null, {
    moreToolsTitle: [{
      type: Input
    }],
    previousToolButton: [{
      type: Input
    }],
    nextToolButton: [{
      type: Input
    }]
  });
})();
var LocalizedToolbarMessagesDirective = class _LocalizedToolbarMessagesDirective extends ToolbarMessages {
  service;
  constructor(service) {
    super();
    this.service = service;
  }
  static ɵfac = function LocalizedToolbarMessagesDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LocalizedToolbarMessagesDirective)(ɵɵdirectiveInject(LocalizationService));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _LocalizedToolbarMessagesDirective,
    selectors: [["", "kendoToolbarLocalizedMessages", ""]],
    features: [ɵɵProvidersFeature([{
      provide: ToolbarMessages,
      useExisting: forwardRef(() => _LocalizedToolbarMessagesDirective)
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalizedToolbarMessagesDirective, [{
    type: Directive,
    args: [{
      providers: [{
        provide: ToolbarMessages,
        useExisting: forwardRef(() => LocalizedToolbarMessagesDirective)
      }],
      selector: "[kendoToolbarLocalizedMessages]",
      standalone: true
    }]
  }], () => [{
    type: LocalizationService
  }], null);
})();
var DEFAULT_SCROLL_BEHAVIOR = "smooth";
var DEFAULT_SCROLL_SPEED = 100;
var ScrollService = class _ScrollService {
  ngZone;
  localization;
  owner;
  position = 0;
  scrollButtonActiveStateChange = new Subject();
  get scrollElement() {
    return this.owner.scrollContainer?.nativeElement;
  }
  get scrollContainerOverflowSize() {
    if (!isDocumentAvailable()) {
      return 0;
    }
    if (!this.scrollElement) {
      return 0;
    }
    const overflowSize = Math.floor(this.scrollElement.scrollWidth - this.scrollElement.getBoundingClientRect().width);
    return overflowSize < 0 ? 0 : overflowSize;
  }
  get toolsOverflow() {
    return this.scrollContainerOverflowSize > 0;
  }
  constructor(ngZone, localization) {
    this.ngZone = ngZone;
    this.localization = localization;
  }
  toggleScrollButtonsState() {
    const toolbar = this.owner;
    if (!toolbar.hasScrollButtons) {
      return;
    }
    const currentPrevButtonActive = !this.isDisabled("prev");
    const currentNextButtonActive = !this.isDisabled("next");
    const defaultOffset = 1;
    const rtlDelta = this.localization.rtl ? -1 : 1;
    const calculatedPrevButtonActive = this.position * rtlDelta > 0 && this.scrollContainerOverflowSize > 0;
    const calculatedNextButtonActive = this.position * rtlDelta < this.scrollContainerOverflowSize - defaultOffset && this.scrollContainerOverflowSize > 0;
    if (calculatedPrevButtonActive !== currentPrevButtonActive) {
      this.ngZone.run(() => this.toggleButtonActiveState("prev", calculatedPrevButtonActive));
    }
    if (calculatedNextButtonActive !== currentNextButtonActive) {
      this.ngZone.run(() => this.toggleButtonActiveState("next", calculatedNextButtonActive));
    }
  }
  onScroll(e) {
    this.position = e.target.scrollLeft;
    this.toggleScrollButtonsState();
  }
  scrollTools(direction) {
    this.calculateListPosition(direction, DEFAULT_SCROLL_SPEED);
    if (this.scrollElement) {
      this.scrollElement.scrollTo({
        left: this.position,
        behavior: DEFAULT_SCROLL_BEHAVIOR
      });
    }
    this.toggleScrollButtonsState();
  }
  updateScrollPosition(element) {
    this.position = element.scrollLeft;
  }
  calculateListPosition(direction, scrollSpeed) {
    if (direction === "prev") {
      if (!this.localization.rtl) {
        this.position = this.position - scrollSpeed <= 0 ? 0 : this.position - scrollSpeed;
      } else {
        this.position = this.position + scrollSpeed >= 0 ? 0 : this.position + scrollSpeed;
      }
    } else if (direction === "next" && this.position < this.scrollContainerOverflowSize) {
      if (this.position + scrollSpeed > this.scrollContainerOverflowSize) {
        if (this.localization.rtl) {
          this.position = -this.scrollContainerOverflowSize;
        } else {
          this.position = this.scrollContainerOverflowSize;
        }
        return;
      }
      if (this.localization.rtl) {
        this.position -= scrollSpeed;
      } else {
        this.position += scrollSpeed;
      }
    }
  }
  toggleButtonActiveState(buttonType, active) {
    this.scrollButtonActiveStateChange.next({
      buttonType,
      active
    });
  }
  isDisabled = (buttonType) => this.owner[`${buttonType}ScrollButton`]?.nativeElement.classList.contains("k-disabled");
  static ɵfac = function ScrollService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollService)(ɵɵinject(NgZone), ɵɵinject(LocalizationService));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ScrollService,
    factory: _ScrollService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollService, [{
    type: Injectable
  }], () => [{
    type: NgZone
  }, {
    type: LocalizationService
  }], null);
})();
var DIRECTION_CLASSES = {
  left: "chevron-left",
  right: "chevron-right"
};
var ToolbarScrollableButtonComponent = class _ToolbarScrollableButtonComponent {
  host;
  renderer;
  ngZone;
  localization;
  get prevClass() {
    return this.prev;
  }
  get nextClass() {
    return !this.prev;
  }
  role = "button";
  prev = false;
  overflow;
  onClick = new EventEmitter();
  get iconClass() {
    return this.scrollButtonIconClass;
  }
  get customIconClass() {
    return this.customScrollButtonIconClass;
  }
  get svgIcon() {
    return this.scrollButtonSVGIcon;
  }
  chevronLeftIcon = chevronLeftIcon;
  chevronRightIcon = chevronRightIcon;
  subs = new Subscription();
  constructor(host, renderer, ngZone, localization) {
    this.host = host;
    this.renderer = renderer;
    this.ngZone = ngZone;
    this.localization = localization;
  }
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.subs.add(this.renderer.listen(this.host.nativeElement, "click", this.clickHandler));
    });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  clickHandler = () => {
    const buttonType = this.prev ? "prev" : "next";
    this.onClick.emit(buttonType);
  };
  get scrollButtonIconClass() {
    const defaultPrevIcon = !this.localization.rtl ? DIRECTION_CLASSES.left : DIRECTION_CLASSES.right;
    const defaultNextIcon = !this.localization.rtl ? DIRECTION_CLASSES.right : DIRECTION_CLASSES.left;
    if (typeof this.overflow === "object") {
      const prevIcon = typeof this.overflow.prevButtonIcon === "undefined" ? defaultPrevIcon : "";
      const nextIcon = typeof this.overflow.nextButtonIcon === "undefined" ? defaultNextIcon : "";
      if (prevIcon && this.prev) {
        return prevIcon;
      } else if (nextIcon && !this.prev) {
        return nextIcon;
      }
    }
  }
  get customScrollButtonIconClass() {
    if (typeof this.overflow === "object") {
      const prevIcon = this.overflow.prevButtonIcon;
      const nextIcon = this.overflow.nextButtonIcon;
      if (prevIcon && this.prev) {
        return `k-icon ${prevIcon}`;
      }
      if (nextIcon && !this.prev) {
        return `k-icon ${nextIcon}`;
      }
    }
  }
  get scrollButtonSVGIcon() {
    const defaultPrevSVGIcon = !this.localization.rtl ? this.chevronLeftIcon : this.chevronRightIcon;
    const defaultNextSVGIcon = !this.localization.rtl ? this.chevronRightIcon : this.chevronLeftIcon;
    if (typeof this.overflow === "object") {
      const prevIcon = this.overflow.prevSVGButtonIcon !== void 0 ? this.overflow.prevSVGButtonIcon : defaultPrevSVGIcon;
      const nextIcon = this.overflow.nextSVGButtonIcon !== void 0 ? this.overflow.nextSVGButtonIcon : defaultNextSVGIcon;
      if (prevIcon || nextIcon) {
        return this.prev ? prevIcon : nextIcon;
      }
    }
  }
  static ɵfac = function ToolbarScrollableButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolbarScrollableButtonComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(LocalizationService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolbarScrollableButtonComponent,
    selectors: [["", "kendoToolbarScrollableButton", ""]],
    hostVars: 5,
    hostBindings: function ToolbarScrollableButtonComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("role", ctx.role);
        ɵɵclassProp("k-toolbar-prev", ctx.prevClass)("k-toolbar-next", ctx.nextClass);
      }
    },
    inputs: {
      prev: "prev",
      overflow: "overflow"
    },
    outputs: {
      onClick: "onClick"
    },
    attrs: _c3,
    decls: 1,
    vars: 3,
    consts: [["innerCssClass", "k-button-icon", 3, "name", "customFontClass", "svgIcon"]],
    template: function ToolbarScrollableButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelement(0, "kendo-icon-wrapper", 0);
      }
      if (rf & 2) {
        ɵɵproperty("name", ctx.iconClass)("customFontClass", ctx.customIconClass)("svgIcon", ctx.svgIcon);
      }
    },
    dependencies: [IconWrapperComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarScrollableButtonComponent, [{
    type: Component,
    args: [{
      template: `
        <kendo-icon-wrapper
            [name]="iconClass"
            [customFontClass]="customIconClass"
            [svgIcon]="svgIcon"
            innerCssClass="k-button-icon"
        >
        </kendo-icon-wrapper>
    `,
      selector: "[kendoToolbarScrollableButton]",
      standalone: true,
      imports: [IconWrapperComponent]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: NgZone
  }, {
    type: LocalizationService
  }], {
    prevClass: [{
      type: HostBinding,
      args: ["class.k-toolbar-prev"]
    }],
    nextClass: [{
      type: HostBinding,
      args: ["class.k-toolbar-next"]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }],
    prev: [{
      type: Input
    }],
    overflow: [{
      type: Input
    }],
    onClick: [{
      type: Output
    }]
  });
})();
var immediateResizeThreshold = 300;
var getInitialPopupSettings = (isRtl) => ({
  animate: true,
  anchorAlign: {
    horizontal: isRtl ? "left" : "right",
    vertical: "bottom"
  },
  popupAlign: {
    horizontal: isRtl ? "left" : "right",
    vertical: "top"
  }
});
var ToolBarComponent = class _ToolBarComponent {
  localization;
  popupService;
  refreshService;
  navigationService;
  element;
  zone;
  renderer;
  _cdr;
  toolsService;
  scrollService;
  get overflowClass() {
    return this.size ? `k-button-${SIZES[this.size]}` : "";
  }
  /**
   * Sets the overflow mode for the ToolBar.
   * Use this property to control how tools render when their total size is greater than the ToolBar container.
   * @default false
   */
  set overflow(overflow) {
    if (this.isScrollMode) {
      this.removeSubscriptions(["scrollButtonStateChangeSub", "scrollContainerScrollSub"]);
    }
    this._overflow = overflow;
    if (this.isScrollMode) {
      this.handleScrollModeUpdates();
    }
    this.setScrollableOverlayClasses();
    this.zone.onStable.pipe(take(1)).subscribe(() => this.onResize());
  }
  get overflow() {
    return this._overflow;
  }
  get showScrollButtons() {
    const buttonsVisibility = this.normalizedOverflow.scrollButtons;
    const showAuto = buttonsVisibility === "auto" && this.showAutoButtons;
    const showAlways = buttonsVisibility === "visible";
    return this.isScrollMode && (showAuto || showAlways);
  }
  /**
   * @hidden
   */
  set resizable(value) {
    this.overflow = value;
  }
  get resizable() {
    return this.showMenu;
  }
  /**
   * @hidden
   */
  get hasScrollButtons() {
    const visible = this.normalizedOverflow.mode === "scroll" && this.normalizedOverflow.scrollButtons !== "hidden";
    const position = this.normalizedOverflow.scrollButtonsPosition;
    return {
      visible,
      position
    };
  }
  /**
   * @hidden
   */
  get isScrollMode() {
    return this.normalizedOverflow.mode === "scroll";
  }
  /**
   * @hidden
   */
  get showMenu() {
    return this.normalizedOverflow.mode === "menu" || this.normalizedOverflow.mode === "section";
  }
  /**
   * @hidden
   */
  get overflowEnabled() {
    return this.normalizedOverflow.mode !== "none";
  }
  /**
   * Configures the popup for the ToolBar overflow button.
   * Use this property to customize the overflow popup appearance and behavior
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/responsive-toolbar#customizing-the-popup)).
   */
  set popupSettings(settings) {
    this._popupSettings = Object.assign({}, getInitialPopupSettings(this.localization.rtl), settings);
  }
  get popupSettings() {
    return this._popupSettings || getInitialPopupSettings(this.localization.rtl);
  }
  /**
   * Sets the fill mode for the ToolBar.
   * This property controls the background and border styles of the ToolBar
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/appearance#fill-mode)). The default value is set by the Kendo theme.
   */
  set fillMode(fillMode) {
    this.handleClasses(fillMode, "fillMode");
    this._fillMode = fillMode;
  }
  get fillMode() {
    return this._fillMode;
  }
  /**
   * Sets the `tabindex` attribute of the ToolBar.
   * Use this property to control the tab order of the ToolBar component.
   *
   * @default 0
   */
  tabindex = 0;
  /**
   * Sets the size for all ToolBar elements.
   * Use this property to control the padding of the ToolBar elements. The default value is set by the Kendo theme.
   */
  set size(size) {
    this.handleClasses(size, "size");
    this._size = size;
  }
  get size() {
    return this._size;
  }
  /**
   * @hidden
   */
  set tabIndex(tabIndex) {
    this.tabindex = tabIndex;
  }
  get tabIndex() {
    return this.tabindex;
  }
  /**
   * Sets the icon visibility for all tools in the ToolBar.
   * You can override this property for each tool using the `showIcon` property of the tool.
   * @default 'always'
   */
  set showIcon(value) {
    if (this._showIcon === value) {
      return;
    }
    const normalizedValue = this.normalizeDisplayValue(value);
    this._showIcon = value;
    this.propertyChange.emit({
      property: "showIcon",
      value: normalizedValue
    });
  }
  /**
   * Sets the text visibility for all tools in the ToolBar.
   * You can override this property for each tool using the `showText` property of the tool.
   * @default 'always'
   */
  set showText(value) {
    if (this._showText === value) {
      return;
    }
    const normalizedValue = this.normalizeDisplayValue(value);
    this._showText = value;
    this.propertyChange.emit({
      property: "showText",
      value: normalizedValue
    });
  }
  /**
   * Emits when the overflow popup of the ToolBar opens.
   */
  open = new EventEmitter();
  /**
   * Emits when the overflow popup of the ToolBar closes.
   */
  close = new EventEmitter();
  allTools;
  overflowButton;
  popupTemplate;
  popupSectionTemplate;
  scrollContainer;
  resizeSensor;
  container;
  prevScrollButton;
  nextScrollButton;
  startButtonGroup;
  endButtonGroup;
  scrollSeparator;
  popupRef;
  direction;
  get appendTo() {
    const {
      appendTo
    } = this.popupSettings;
    if (!appendTo || appendTo === "root") {
      return void 0;
    }
    return appendTo === "component" ? this.container : appendTo;
  }
  set popupOpen(open) {
    if (this.popupOpen === open) {
      return;
    }
    const eventArgs = new PreventableEvent();
    if (open) {
      this.open.emit(eventArgs);
    } else {
      this.close.emit(eventArgs);
    }
    if (eventArgs.isDefaultPrevented()) {
      return;
    }
    this.toggle(open);
  }
  get popupOpen() {
    return this._open;
  }
  /**
   * @hidden
   */
  prevButtonIcon = chevronLeftIcon;
  /**
   * @hidden
   */
  nextButtonIcon = chevronRightIcon;
  /**
   * @hidden
   */
  propertyChange = new EventEmitter();
  hostClass = true;
  get scrollableClass() {
    return this.isScrollMode;
  }
  get sectionClass() {
    return this.normalizedOverflow.mode === "section";
  }
  _overflow = false;
  _popupSettings;
  cachedOverflowAnchorWidth;
  _open;
  toolbarKeydownListener;
  overflowKeydownListener;
  sectionKeydownListener;
  cancelRenderedToolsSubscription$ = new Subject();
  cachedGap;
  _size = void 0;
  _fillMode = void 0;
  _showText = "always";
  _showIcon = "always";
  overflowButtonClickedTime = null;
  showAutoButtons = false;
  scrollButtonStateChangeSub;
  scrollContainerScrollSub;
  /**
   * @hidden
   */
  get normalizedOverflow() {
    return normalizeOverflowSettings(this.overflow);
  }
  subscriptions = new Subscription();
  popupSubs = new Subscription();
  focusedByPointer = false;
  /**
   * @hidden
   */
  onFocus(ev) {
    if (this.focusedByPointer) {
      this.focusedByPointer = false;
      return;
    }
    this.navigationService.resetNavigation();
    this.navigationService.focusFirst(ev);
    this.element.nativeElement.setAttribute("tabindex", "-1");
  }
  /**
   * @hidden
   */
  onFocusOut(event) {
    if (closest(event.relatedTarget, (el) => el === this.element.nativeElement)) {
      this.element.nativeElement.setAttribute("tabindex", "-1");
      return;
    }
    this.element.nativeElement.setAttribute("tabindex", this.tabindex.toString());
  }
  role = "toolbar";
  get getDir() {
    return this.direction;
  }
  get resizableClass() {
    return this.resizable;
  }
  /**
   * @hidden
   */
  showLicenseWatermark = false;
  /**
   * @hidden
   */
  licenseMessage;
  constructor(localization, popupService, refreshService, navigationService, element, zone, renderer, _cdr, toolsService, scrollService) {
    this.localization = localization;
    this.popupService = popupService;
    this.refreshService = refreshService;
    this.navigationService = navigationService;
    this.element = element;
    this.zone = zone;
    this.renderer = renderer;
    this._cdr = _cdr;
    this.toolsService = toolsService;
    this.scrollService = scrollService;
    const isValid = A(packageMetadata2);
    this.licenseMessage = getLicenseMessage(packageMetadata2);
    this.showLicenseWatermark = shouldShowValidationUI(isValid);
    this.direction = localization.rtl ? "rtl" : "ltr";
    this.scrollService.owner = this;
  }
  ngAfterContentInit() {
    this.toolsService.allTools = this.allTools.toArray();
    this.subscriptions.add(this.allTools.changes.subscribe(() => {
      this.toolsService.reset();
      this.toolsService.allTools = this.allTools.toArray();
      this.allTools.forEach((tool) => {
        this.refreshService.refresh(tool);
      });
      this.zone.onStable.pipe(take(1)).subscribe(() => this.onResize());
    }));
  }
  ngAfterViewInit() {
    this.toolsService.renderedToolsChange.next(this.toolsService.renderedTools);
    this.toolsService.overflowToolsChange.next(this.toolsService.overflowTools);
    const element = this.element.nativeElement;
    if (!element.getAttribute("tabindex")) {
      this.element.nativeElement.setAttribute("tabindex", "0");
    }
    this.zone.runOutsideAngular(() => {
      this.toolbarKeydownListener = this.renderer.listen(this.element.nativeElement, "keydown", (ev) => {
        const code = normalizeKeys(ev);
        switch (code) {
          case Keys.ArrowLeft:
            this.zone.run(() => {
              if (!isSmartBoxInput(ev.target)) {
                ev.preventDefault();
              }
              if (this.direction === "ltr") {
                this.navigationService.focusPrev(ev);
              } else {
                this.navigationService.focusNext(ev);
              }
              this.element.nativeElement.setAttribute("tabindex", "-1");
            });
            break;
          case Keys.ArrowRight:
            this.zone.run(() => {
              if (!isSmartBoxInput(ev.target)) {
                ev.preventDefault();
              }
              if (this.direction === "ltr") {
                this.navigationService.focusNext(ev);
              } else {
                this.navigationService.focusPrev(ev);
              }
              this.element.nativeElement.setAttribute("tabindex", "-1");
            });
            break;
          case Keys.Tab:
            this.zone.run(() => this.navigationService.resetNavigation());
            break;
          case Keys.Escape:
            this.zone.run(() => this.toggle(false));
            break;
          case Keys.Home:
            this.zone.run(() => this.navigationService.focusFirst(ev));
            break;
          case Keys.End:
            this.zone.run(() => this.navigationService.focusLast(ev));
            break;
          default:
            break;
        }
      });
    });
    if (this.overflowEnabled) {
      this.subscriptions.add(merge(this.resizeSensor.resize, this.toolsService.renderedToolsChange).subscribe(() => this.onResize()));
      if (this.showMenu) {
        this.navigationService.overflowButton = this.overflowButton;
      }
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            this.onResize();
          });
        });
      });
    }
    if (this.isScrollMode) {
      this.handleScrollModeUpdates();
    }
    this.subscriptions.add(this.renderer.listen(this.element.nativeElement, "pointerdown", (ev) => {
      if (!ev.target.closest(".k-toolbar-items")) {
        this.focusedByPointer = true;
      }
    }));
    this.navigationService.setRenderedTools(this.toolsService.renderedTools);
  }
  ngOnInit() {
    this.subscriptions.add(this.localization.changes.subscribe(({
      rtl
    }) => this.direction = rtl ? "rtl" : "ltr"));
    this.zone.onStable.pipe(take(1)).subscribe(() => this.onResize());
    if (isDocumentAvailable()) {
      this.zone.runOutsideAngular(() => this.subscriptions.add(fromEvent(document, "click").pipe(filter(() => !!this.popupRef), filter((ev) => !this.popupRef.popup.instance.container.nativeElement.contains(ev.target)), filter((ev) => !this.overflowButton.nativeElement.contains(ev.target))).subscribe(() => {
        this.zone.run(() => {
          this.popupOpen = false;
        });
      })));
    }
  }
  ngOnChanges(changes) {
    if (changes["tabindex"]) {
      this.element.nativeElement.setAttribute("tabindex", changes["tabindex"].currentValue.toString());
    }
  }
  ngOnDestroy() {
    this.destroyPopup();
    if (this.toolbarKeydownListener) {
      this.toolbarKeydownListener();
    }
    this.cancelRenderedToolsSubscription$.next(void 0);
    this.subscriptions.unsubscribe();
  }
  /**
   * @hidden
   */
  showOverflowSeparator = false;
  /**
   * @hidden
   */
  get moreToolsTitle() {
    return this.localization.get("moreToolsTitle");
  }
  /**
   * @hidden
   */
  get cdr() {
    return this._cdr;
  }
  /**
   * @hidden
   */
  get sectionSizeClass() {
    return `k-toolbar-items-list-${SIZES[this.size]}`;
  }
  /**
   * @hidden
   */
  getScrollButtonTitle(buttonType) {
    let currentButton;
    if (this.localization.rtl) {
      currentButton = buttonType === "prev" ? "nextToolButton" : "previousToolButton";
    } else {
      currentButton = buttonType === "prev" ? "previousToolButton" : "nextToolButton";
    }
    return this.localization.get(currentButton);
  }
  /**
   * @hidden
   */
  scrollTools(dir) {
    this.scrollService.scrollTools(dir);
  }
  /**
   * @hidden
   */
  onRendererClick(data) {
    this.navigationService.click(data);
    this.element.nativeElement.setAttribute("tabindex", "-1");
  }
  /**
   * @hidden
   */
  overflowButtonIcon(iconType) {
    if (iconType === "svg") {
      return this.normalizedOverflow.mode === "section" ? moreHorizontalIcon : moreVerticalIcon;
    } else {
      return this.normalizedOverflow.mode === "section" ? "more-horizontal" : "more-vertical";
    }
  }
  /**
   * @hidden
   */
  showPopup() {
    this.popupOpen = !this.popupOpen;
    this.navigationService.click({
      context: void 0,
      event: void 0
    });
    this.overflowButtonClickedTime = Date.now();
  }
  /**
   * Toggles the visibility of the overflow popup.
   */
  toggle(popupOpen) {
    this._open = popupOpen !== void 0 ? popupOpen : !this.popupOpen;
    if (this.popupRef) {
      this.popupRef.close();
      this.popupRef = null;
    }
    if (this.popupOpen) {
      let settings;
      const isSection = this.normalizedOverflow.mode === "section";
      if (isSection) {
        settings = {
          anchor: this.element.nativeElement,
          content: this.popupSectionTemplate,
          popupClass: this.normalizePopupClasses(),
          positionMode: "absolute"
        };
      } else {
        settings = {
          anchor: this.overflowButton,
          anchorAlign: this.popupSettings.anchorAlign,
          popupAlign: this.popupSettings.popupAlign,
          content: this.popupTemplate,
          appendTo: this.appendTo,
          animate: this.popupSettings.animate,
          popupClass: this.normalizePopupClasses(this.popupSettings.popupClass),
          positionMode: "absolute"
        };
      }
      this.popupRef = this.popupService.open(settings);
      this.setPopupContentDimensions(isSection);
      this.popupSubs.add(this.popupRef.popupOpen.subscribe(this.onPopupOpen.bind(this)));
      this.popupSubs.add(this.popupRef.popupClose.subscribe(this.onPopupClose.bind(this)));
    }
  }
  /**
   * @hidden
   */
  onResize() {
    if (isDocumentAvailable()) {
      if (this.showMenu) {
        const containerWidth = innerWidth(this.element.nativeElement) - this.overflowAnchorWidth;
        this.shrink(containerWidth, this.childrenWidth);
        this.stretch(containerWidth, this.childrenWidth);
        this.displayAnchor();
        const isImmediateResize = Date.now() - this.overflowButtonClickedTime < immediateResizeThreshold;
        if (this.popupOpen && !isImmediateResize) {
          const eventArgs = new PreventableEvent();
          this.close.emit(eventArgs);
          if (eventArgs.isDefaultPrevented()) {
            return;
          }
          this.toggle();
        }
      } else if (this.isScrollMode) {
        if (this.normalizedOverflow.scrollButtons === "auto") {
          const containerWidth = innerWidth(this.element.nativeElement);
          let scrollButtonsWidth = 0;
          if (this.showAutoButtons) {
            const separatorWidth = this.scrollSeparator.nativeElement.getBoundingClientRect().width + 2 * this.gap;
            if (this.hasScrollButtons.position === "split") {
              scrollButtonsWidth = innerWidth(this.prevScrollButton.nativeElement) + innerWidth(this.nextScrollButton.nativeElement) + 2 * separatorWidth;
            } else if (this.hasScrollButtons.position === "end") {
              scrollButtonsWidth = innerWidth(this.endButtonGroup.nativeElement) + separatorWidth;
            } else {
              scrollButtonsWidth = innerWidth(this.startButtonGroup.nativeElement) + separatorWidth;
            }
          }
          const shouldShowButtons = this.childrenWidth + scrollButtonsWidth > containerWidth;
          if (shouldShowButtons !== this.showAutoButtons) {
            this.showAutoButtons = shouldShowButtons;
            this.cdr.detectChanges();
          }
          this.scrollService.toggleScrollButtonsState();
        } else if (!this.hasScrollButtons.visible) {
          this.setScrollableOverlayClasses();
        } else if (!this.scrollService.toolsOverflow) {
          this.renderer.addClass(this.nextScrollButton.nativeElement, "k-disabled");
          this.renderer.addClass(this.prevScrollButton.nativeElement, "k-disabled");
        } else {
          this.scrollService.toggleScrollButtonsState();
        }
      }
      this.resizeSensor?.acceptSize();
    }
  }
  /**
   * @hidden
   */
  onPopupOpen() {
    this.zone.runOutsideAngular(() => {
      if (this.normalizedOverflow.mode === "section") {
        this.sectionKeydownListener = this.renderer.listen(this.popupRef.popupElement, "keydown", (ev) => {
          const code = normalizeKeys(ev);
          switch (code) {
            case Keys.ArrowLeft:
              this.zone.run(() => {
                ev.preventDefault();
                if (this.direction === "ltr") {
                  this.navigationService.focusPrev(ev);
                } else {
                  this.navigationService.focusNext(ev);
                }
                this.element.nativeElement.setAttribute("tabindex", "-1");
              });
              break;
            case Keys.ArrowRight:
              this.zone.run(() => {
                ev.preventDefault();
                if (this.direction === "ltr") {
                  this.navigationService.focusNext(ev);
                } else {
                  this.navigationService.focusPrev(ev);
                }
                this.element.nativeElement.setAttribute("tabindex", "-1");
              });
              break;
            case Keys.Escape: {
              this.zone.run(() => this.toggle(false));
              const eventArgs = new PreventableEvent();
              this.close.emit(eventArgs);
              break;
            }
            case Keys.Tab:
              this.zone.run(() => {
                this.toggle(false);
                this.navigationService.resetNavigation();
              });
              break;
            default:
              break;
          }
        });
      } else {
        this.overflowKeydownListener = this.renderer.listen(this.popupRef.popupElement, "keydown", (ev) => {
          const code = normalizeKeys(ev);
          switch (code) {
            case Keys.ArrowUp:
              this.zone.run(() => {
                ev.preventDefault();
                this.navigationService.focusPrev(ev);
              });
              break;
            case Keys.ArrowDown:
              this.zone.run(() => {
                ev.preventDefault();
                this.navigationService.focusNext(ev);
              });
              break;
            case Keys.Escape: {
              this.zone.run(() => this.toggle(false));
              const eventArgs = new PreventableEvent();
              this.close.emit(eventArgs);
              break;
            }
            case Keys.Tab:
              this.zone.run(() => {
                this.toggle(false);
                this.navigationService.resetNavigation();
              });
              break;
            case Keys.NumpadEnter:
            case Keys.Enter:
            case Keys.Space:
              this.zone.run(() => {
                if (ev.target.closest(".k-menu-item")) {
                  ev.preventDefault();
                  ev.target.click();
                  ev.target.focus();
                }
              });
              break;
            default:
              break;
          }
        });
      }
    });
    this.cancelRenderedToolsSubscription$.next(void 0);
    this.navigationService.setRenderedTools(this.toolsService.overflowTools);
    this.navigationService.moveFocusToPopup();
    this.toolsService.overflowToolsChange.pipe(takeUntil(this.cancelRenderedToolsSubscription$)).subscribe((rts) => this.navigationService.setRenderedTools(rts));
    this.renderer.setAttribute(this.overflowButton.nativeElement, "aria-controls", this.popupId);
  }
  /**
   * @hidden
   */
  onPopupClose() {
    this.cancelRenderedToolsSubscription$.next(void 0);
    this.navigationService.setRenderedTools(this.toolsService.renderedTools);
    this.toolsService.renderedToolsChange.pipe(takeUntil(this.cancelRenderedToolsSubscription$)).subscribe((rts) => this.navigationService.setRenderedTools(rts));
    this.navigationService.moveFocusToToolBar();
    if (this.overflowKeydownListener) {
      this.overflowKeydownListener();
    }
    if (this.sectionKeydownListener) {
      this.sectionKeydownListener();
    }
    this.renderer.removeAttribute(this.overflowButton.nativeElement, "aria-controls");
  }
  /**
   * @hidden
   */
  overflowBtnId = guid();
  /**
   * @hidden
   */
  popupId = guid();
  displayAnchor() {
    const visibility = this.allTools.filter((t) => t.overflows && t.responsive).length > 0 ? "visible" : "hidden";
    this.overflowButton && this.renderer.setStyle(this.overflowButton.nativeElement, "visibility", visibility);
    const isVisible2 = visibility === "visible";
    if (isVisible2 !== this.showOverflowSeparator) {
      this.showOverflowSeparator = isVisible2;
      this.cdr.detectChanges();
    }
    if (!isVisible2) {
      this.destroyPopup();
    }
  }
  get popupWidth() {
    if (!this.popupSettings || !this.popupSettings.width) {
      return "auto";
    }
    return isNaN(this.popupSettings.width) ? this.popupSettings.width : `${this.popupSettings.width}px`;
  }
  get popupHeight() {
    if (!this.popupSettings || !this.popupSettings.height) {
      return;
    }
    return isNaN(this.popupSettings.height) ? this.popupSettings.height : `${this.popupSettings.height}px`;
  }
  get overflowAnchorWidth() {
    if (!this.showMenu) {
      return 0;
    }
    if (!this.cachedOverflowAnchorWidth) {
      this.cachedOverflowAnchorWidth = this.overflowButton.nativeElement.offsetWidth;
    }
    return this.cachedOverflowAnchorWidth;
  }
  get gap() {
    if (isPresent2(this.cachedGap)) {
      return this.cachedGap;
    }
    const computedGap = getComputedStyle(this.element.nativeElement).gap;
    this.cachedGap = isPresent2(computedGap) ? parseInt(computedGap, 10) : 0;
    return this.cachedGap;
  }
  get childrenWidth() {
    const width = this.toolsService.renderedTools.reduce((totalWidth, tool) => tool.width + totalWidth + (tool.isDisplayed() ? this.gap : 0), 0);
    return Math.ceil(width);
  }
  get visibleTools() {
    return this.allTools.filter((tool) => {
      return tool.overflows === false;
    });
  }
  get overflowTools() {
    return this.allTools.filter((tool) => {
      return tool.overflows === true;
    });
  }
  shrink(containerWidth, childrenWidth) {
    let width;
    if (containerWidth < childrenWidth) {
      for (let i = this.visibleTools.length - 1; i >= 0; i--) {
        if (containerWidth > childrenWidth) {
          break;
        } else {
          width = this.hideLastVisibleTool();
          childrenWidth -= width;
        }
      }
    }
  }
  stretch(containerWidth, childrenWidth) {
    let width;
    if (containerWidth > childrenWidth) {
      for (let i = this.overflowTools.length - 1; i >= 0; i--) {
        width = this.showFirstHiddenTool(containerWidth, childrenWidth);
        if (width > 0) {
          childrenWidth += width + this.gap;
        } else if (width === 0) {
          break;
        }
      }
    }
  }
  hideLastVisibleTool() {
    const tool = this.visibleTools[this.visibleTools.length - 1];
    if (!tool) {
      return null;
    }
    const renderedElement = this.toolsService.renderedTools.find((r) => {
      return r.tool === tool;
    });
    const width = renderedElement.width;
    tool.overflows = this.showMenu;
    this.refreshService.refresh(tool);
    return width;
  }
  showFirstHiddenTool(containerWidth, childrenWidth) {
    const tool = this.overflowTools[0];
    if (!tool) {
      return null;
    }
    const renderedElement = this.toolsService.renderedTools.find((r) => r.tool === tool);
    tool.overflows = false;
    tool.visibility = "hidden";
    this.refreshService.refresh(tool);
    if (containerWidth > childrenWidth + renderedElement.width) {
      tool.visibility = "visible";
    } else {
      tool.overflows = true;
    }
    this.refreshService.refresh(tool);
    return tool.isHidden ? -1 : renderedElement.width;
  }
  setPopupContentDimensions(isSection) {
    const popupContentContainer = this.popupRef.popup.instance.contentContainer.nativeElement;
    if (isSection) {
      const toolbarWidth = this.element.nativeElement.getBoundingClientRect().width;
      popupContentContainer.style.width = `${toolbarWidth}px`;
    } else {
      popupContentContainer.style.width = this.popupWidth;
      popupContentContainer.style.height = this.popupHeight;
      popupContentContainer.style.overflow = "auto";
    }
  }
  destroyPopup() {
    if (this.popupRef) {
      this.popupSubs.unsubscribe();
      this.popupRef.close();
      this.popupRef = null;
      this._open = false;
    }
  }
  handleClasses(value, input) {
    const elem = this.element.nativeElement;
    const classes = getStylingClasses("toolbar", input, this[input], value);
    if (classes.toRemove) {
      this.renderer.removeClass(elem, classes.toRemove);
    }
    if (classes.toAdd) {
      this.renderer.addClass(elem, classes.toAdd);
    }
  }
  normalizePopupClasses(classList) {
    const classes = ["k-toolbar-popup"];
    if (this.normalizedOverflow.mode === "menu") {
      classes.push("k-menu-popup");
    }
    if (!classList) {
      return classes;
    }
    const parsedClassList = parseCSSClassNames(classList);
    if (parsedClassList.length) {
      classes.push(...parsedClassList);
    }
    return classes;
  }
  setScrollableOverlayClasses() {
    const wrapper = this.element.nativeElement;
    const container = this.scrollContainer?.nativeElement;
    if (!container) {
      return;
    }
    const scrollOffset = container.scrollLeft;
    const defaultOffset = 1;
    if (this.scrollService.toolsOverflow && !this.hasScrollButtons.visible) {
      this.renderer.addClass(wrapper, "k-toolbar-scrollable-overlay");
      if (scrollOffset === 0) {
        this.renderer.removeClass(wrapper, "k-toolbar-scrollable-end");
        this.renderer.addClass(wrapper, "k-toolbar-scrollable-start");
      } else if (scrollOffset > 0 && scrollOffset < this.scrollService.scrollContainerOverflowSize - defaultOffset || scrollOffset < 0 && Math.abs(scrollOffset) < this.scrollService.scrollContainerOverflowSize - defaultOffset) {
        this.renderer.removeClass(wrapper, "k-toolbar-scrollable-end");
        this.renderer.removeClass(wrapper, "k-toolbar-scrollable-start");
      } else {
        this.renderer.removeClass(wrapper, "k-toolbar-scrollable-start");
        this.renderer.addClass(wrapper, "k-toolbar-scrollable-end");
      }
    } else {
      this.renderer.removeClass(wrapper, "k-toolbar-scrollable-overlay");
      this.renderer.removeClass(wrapper, "k-toolbar-scrollable-end");
      this.renderer.removeClass(wrapper, "k-toolbar-scrollable-start");
    }
  }
  handleScrollModeUpdates() {
    if (isPresent2(this.scrollContainer)) {
      this.scrollService.updateScrollPosition(this.scrollContainer.nativeElement);
      this.zone.runOutsideAngular(() => {
        this.scrollContainerScrollSub = this.renderer.listen(this.scrollContainer.nativeElement, "scroll", (e) => {
          if (!this.hasScrollButtons.visible) {
            this.setScrollableOverlayClasses();
          } else {
            this.scrollService.onScroll(e);
          }
        });
        this.subscriptions.add(this.scrollContainerScrollSub);
      });
    }
    if (this.showScrollButtons && this.nextScrollButton && this.prevScrollButton) {
      if (this.normalizedOverflow.scrollButtons === "visible" && !this.scrollService.toolsOverflow) {
        this.renderer.addClass(this.nextScrollButton.nativeElement, "k-disabled");
        this.renderer.addClass(this.prevScrollButton.nativeElement, "k-disabled");
      } else {
        const buttonToDisable = this.direction === "rtl" ? this.nextScrollButton : this.prevScrollButton;
        this.renderer.addClass(buttonToDisable.nativeElement, "k-disabled");
      }
    }
    if (this.hasScrollButtons.visible) {
      this.scrollButtonStateChangeSub = this.scrollService.scrollButtonActiveStateChange.subscribe((activeButtonSettings) => {
        if (this.showScrollButtons) {
          const action = activeButtonSettings.active ? "remove" : "add";
          const scrollButton = this[`${activeButtonSettings.buttonType}ScrollButton`]?.nativeElement;
          scrollButton && this.renderer[`${action}Class`](scrollButton, "k-disabled");
        }
      });
      this.subscriptions.add(this.scrollButtonStateChangeSub);
      this.scrollService.toggleScrollButtonsState();
    }
  }
  removeSubscriptions(subsToRemove) {
    subsToRemove.forEach((sub) => {
      if (this[sub]) {
        this.subscriptions.remove(this[sub]);
        this[sub] = null;
      }
    });
  }
  normalizeDisplayValue(value) {
    if (typeof value === "boolean") {
      return value ? "always" : "never";
    }
    return value;
  }
  static ɵfac = function ToolBarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarComponent)(ɵɵdirectiveInject(LocalizationService), ɵɵdirectiveInject(PopupService), ɵɵdirectiveInject(RefreshService), ɵɵdirectiveInject(NavigationService), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ToolbarToolsService), ɵɵdirectiveInject(ScrollService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarComponent,
    selectors: [["kendo-toolbar"]],
    contentQueries: function ToolBarComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, ToolBarToolComponent, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.allTools = _t);
      }
    },
    viewQuery: function ToolBarComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c4, 5, ElementRef)(_c2, 7)(_c5, 7)(_c6, 5, ElementRef)(_c7, 5)(_c8, 7, ViewContainerRef)(_c9, 5, ElementRef)(_c10, 5, ElementRef)(_c11, 5, ElementRef)(_c12, 5, ElementRef)(_c13, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.popupTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.popupSectionTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.scrollContainer = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.resizeSensor = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.container = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.prevScrollButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.nextScrollButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.startButtonGroup = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.endButtonGroup = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.scrollSeparator = _t.first);
      }
    },
    hostVars: 10,
    hostBindings: function ToolBarComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("focus", function ToolBarComponent_focus_HostBindingHandler($event) {
          return ctx.onFocus($event);
        })("focusout", function ToolBarComponent_focusout_HostBindingHandler($event) {
          return ctx.onFocusOut($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("role", ctx.role)("dir", ctx.getDir);
        ɵɵclassProp("k-toolbar", ctx.hostClass)("k-toolbar-scrollable", ctx.scrollableClass)("k-toolbar-section", ctx.sectionClass)("k-toolbar-resizable", ctx.resizableClass);
      }
    },
    inputs: {
      overflow: "overflow",
      resizable: "resizable",
      popupSettings: "popupSettings",
      fillMode: "fillMode",
      tabindex: "tabindex",
      size: "size",
      tabIndex: "tabIndex",
      showIcon: "showIcon",
      showText: "showText"
    },
    outputs: {
      open: "open",
      close: "close"
    },
    exportAs: ["kendoToolBar"],
    features: [ɵɵProvidersFeature([RefreshService, NavigationService, LocalizationService, ToolbarToolsService, ScrollService, {
      provide: L10N_PREFIX,
      useValue: "kendo.toolbar"
    }]), ɵɵNgOnChangesFeature],
    decls: 15,
    vars: 7,
    consts: () => {
      let i18n_0;
      if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        const MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_0 = goog.getMsg("More tools");
        i18n_0 = MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_0;
      } else {
        i18n_0 = $localize`:kendo.toolbar.moreToolsTitle|The title of the **more tools** button in a responsive ToolBar:More tools`;
      }
      let i18n_1;
      if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        const MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_1 = goog.getMsg("Scroll left");
        i18n_1 = MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_1;
      } else {
        i18n_1 = $localize`:kendo.toolbar.previousToolButton|The title for the **Previous Tool** button when the Toolbar is scrollable.:Scroll left`;
      }
      let i18n_2;
      if (typeof ngI18nClosureMode !== "undefined" && ngI18nClosureMode) {
        const MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_2 = goog.getMsg("Scroll right");
        i18n_2 = MSG_D__VERSION13UPGRADEUI_VTS_NODE_MODULES__PROGRESS_KENDO_ANGULAR_TOOLBAR_FESM2022_PROGRESS_KENDO_ANGULAR_TOOLBAR_MJS_2;
      } else {
        i18n_2 = $localize`:kendo.toolbar.nextToolButton|The title for the **Next Tool** button when the Toolbar is scrollable.:Scroll right`;
      }
      return [["popupTemplate", ""], ["popupSectionTemplate", ""], ["container", ""], ["scrollSeparator", ""], ["prevScrollButton", ""], ["startButtonGroup", ""], ["nextScrollButton", ""], ["scrollContainer", ""], ["wrapper", ""], ["overflowButton", ""], ["endButtonGroup", ""], ["popupWrapper", ""], ["resizeSensor", ""], ["kendoToolbarLocalizedMessages", "", "moreToolsTitle", i18n_0, "previousToolButton", i18n_1, "nextToolButton", i18n_2], ["tabindex", "-1", 1, "k-toolbar-items", "k-toolbar-items-scroll"], [1, "k-toolbar-separator", "k-toolbar-button-separator", "k-separator"], ["kendoButton", "", "fillMode", "flat", "type", "button", "tabindex", "-1", 1, "k-toolbar-overflow-button", "k-rounded-none", 3, "icon", "svgIcon", "title", "id", "visibility", "position", "ngClass"], ["kendoWatermarkOverlay", "", 3, "licenseMessage"], ["kendoToolbarScrollableButton", "", 1, "k-toolbar-prev", "k-icon-button", "k-button", 3, "prev", "overflow", "title", "ngClass"], [1, "k-button-group"], ["kendoToolbarScrollableButton", "", 1, "k-toolbar-prev", "k-icon-button", "k-button", 3, "onClick", "prev", "overflow", "title", "ngClass"], ["kendoToolbarScrollableButton", "", 1, "k-toolbar-next", "k-icon-button", "k-button", 3, "onClick", "prev", "overflow", "title", "ngClass"], ["kendoToolbarRenderer", "", "location", "toolbar", 3, "rendererClick", "tool", "resizable", "ngTemplateOutlet"], [1, "k-toolbar-item"], [3, "ngTemplateOutlet"], ["kendoButton", "", "fillMode", "flat", "type", "button", "tabindex", "-1", 1, "k-toolbar-overflow-button", "k-rounded-none", 3, "click", "icon", "svgIcon", "title", "id", "ngClass"], ["kendoToolbarScrollableButton", "", 1, "k-toolbar-next", "k-icon-button", "k-button", 3, "prev", "overflow", "title", "ngClass"], ["role", "menu", 1, "k-menu-group", 3, "id"], ["kendoToolbarRenderer", "", "location", "overflow", 3, "tool", "resizable", "ngTemplateOutlet"], ["kendoToolbarRenderer", "", "location", "overflow", 3, "rendererClick", "tool", "resizable", "ngTemplateOutlet"], ["role", "menuitem", "tabindex", "-1", 1, "k-item", "k-menu-item"], ["role", "toolbar", 1, "k-toolbar-items-list", "k-toolbar-items-list-solid", 3, "ngClass", "id"], ["kendoToolbarRenderer", "", "location", "section", 3, "rendererClick", "tool", "resizable", "ngTemplateOutlet"]];
    },
    template: function ToolBarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementContainer(0, 13);
        ɵɵconditionalCreate(1, ToolBarComponent_Conditional_1_Template, 4, 2);
        ɵɵconditionalCreate(2, ToolBarComponent_Conditional_2_Template, 4, 0, "div", 14)(3, ToolBarComponent_Conditional_3_Template, 2, 0);
        ɵɵconditionalCreate(4, ToolBarComponent_Conditional_4_Template, 1, 0, "div", 15);
        ɵɵconditionalCreate(5, ToolBarComponent_Conditional_5_Template, 2, 12, "button", 16);
        ɵɵconditionalCreate(6, ToolBarComponent_Conditional_6_Template, 4, 2);
        ɵɵtemplate(7, ToolBarComponent_ng_template_7_Template, 3, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor)(9, ToolBarComponent_ng_template_9_Template, 3, 4, "ng-template", null, 1, ɵɵtemplateRefExtractor);
        ɵɵelementContainer(11, null, 2);
        ɵɵconditionalCreate(13, ToolBarComponent_Conditional_13_Template, 2, 0, "kendo-resize-sensor");
        ɵɵconditionalCreate(14, ToolBarComponent_Conditional_14_Template, 1, 1, "div", 17);
      }
      if (rf & 2) {
        ɵɵadvance();
        ɵɵconditional(ctx.showScrollButtons && (ctx.hasScrollButtons.position === "split" || ctx.hasScrollButtons.position === "start") ? 1 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.isScrollMode ? 2 : 3);
        ɵɵadvance(2);
        ɵɵconditional(ctx.showOverflowSeparator ? 4 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.showMenu ? 5 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.showScrollButtons && (ctx.hasScrollButtons.position === "split" || ctx.hasScrollButtons.position === "end") ? 6 : -1);
        ɵɵadvance(7);
        ɵɵconditional(ctx.overflowEnabled ? 13 : -1);
        ɵɵadvance();
        ɵɵconditional(ctx.showLicenseWatermark ? 14 : -1);
      }
    },
    dependencies: [NgTemplateOutlet, LocalizedToolbarMessagesDirective, ToolBarRendererComponent, ButtonComponent, NgClass, ResizeSensorComponent, ToolbarScrollableButtonComponent, WatermarkOverlayComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBar",
      providers: [RefreshService, NavigationService, LocalizationService, ToolbarToolsService, ScrollService, {
        provide: L10N_PREFIX,
        useValue: "kendo.toolbar"
      }],
      selector: "kendo-toolbar",
      template: `
        <ng-container kendoToolbarLocalizedMessages
            i18n-moreToolsTitle="kendo.toolbar.moreToolsTitle|The title of the **more tools** button in a responsive ToolBar"
            moreToolsTitle="More tools"

            i18n-previousToolButton="kendo.toolbar.previousToolButton|The title for the **Previous Tool** button when the Toolbar is scrollable."
            previousToolButton="Scroll left"

            i18n-nextToolButton="kendo.toolbar.nextToolButton|The title for the **Next Tool** button when the Toolbar is scrollable."
            nextToolButton="Scroll right"
        >
        </ng-container>
        @if (showScrollButtons && (hasScrollButtons.position === 'split' || hasScrollButtons.position === 'start')) {
            @if (hasScrollButtons.position === 'split') {
                <span #prevScrollButton
                    kendoToolbarScrollableButton
                    [prev]="true"
                    [overflow]="normalizedOverflow"
                    [title]="getScrollButtonTitle('prev')"
                    class="k-toolbar-prev k-icon-button k-button"
                    [ngClass]="{
                        'k-button-sm': size === 'small',
                        'k-button-md': size === 'medium',
                        'k-button-lg': size === 'large'
                    }"
                    (onClick)="scrollTools($event)">
                </span>
            }
            @if (hasScrollButtons.position === 'start') {
                <div class="k-button-group" #startButtonGroup>
                <span #prevScrollButton
                    kendoToolbarScrollableButton
                    [prev]="true"
                    [overflow]="normalizedOverflow"
                    [title]="getScrollButtonTitle('prev')"
                    class="k-toolbar-prev k-icon-button k-button"
                    [ngClass]="{
                        'k-button-sm': size === 'small',
                        'k-button-md': size === 'medium',
                        'k-button-lg': size === 'large'
                    }"
                    (onClick)="scrollTools($event)">
                </span>
                <span #nextScrollButton
                    kendoToolbarScrollableButton
                    [prev]="false"
                    [overflow]="normalizedOverflow"
                    [title]="getScrollButtonTitle('next')"
                    class="k-toolbar-next k-icon-button k-button"
                    [ngClass]="{
                        'k-button-sm': size === 'small',
                        'k-button-md': size === 'medium',
                        'k-button-lg': size === 'large'
                    }"
                    (onClick)="scrollTools($event)">
                </span>
            </div>
            }
            <div class="k-toolbar-separator k-toolbar-button-separator k-separator" #scrollSeparator></div>
        }
        @if (isScrollMode) {
            <div class="k-toolbar-items k-toolbar-items-scroll" tabindex="-1" #scrollContainer>
                @for (tool of allTools; track tool; let index = $index) {
                    <ng-template #wrapper>
                        <div class="k-toolbar-item">
                            <ng-container [ngTemplateOutlet]="tool.toolbarTemplate"></ng-container>
                        </div>
                    </ng-template>
                    <ng-container
                        kendoToolbarRenderer
                        [tool]="tool"
                        location="toolbar"
                        [resizable]="resizable"
                        (rendererClick)="onRendererClick($event)"
                        [ngTemplateOutlet]="tool.isBuiltInTool ? tool.toolbarTemplate : wrapper">
                    </ng-container>
                }
            </div>
        } @else {
            @for (tool of allTools; track tool; let index = $index) {
                <ng-template #wrapper>
                    <div class="k-toolbar-item">
                        <ng-container [ngTemplateOutlet]="tool.toolbarTemplate"></ng-container>
                    </div>
                </ng-template>
                <ng-container
                    kendoToolbarRenderer
                    [tool]="tool"
                    location="toolbar"
                    [resizable]="resizable"
                    (rendererClick)="onRendererClick($event)"
                    [ngTemplateOutlet]="tool.isBuiltInTool ? tool.toolbarTemplate : wrapper">
                </ng-container>
            }
        }
        @if (showOverflowSeparator) {
            <div class="k-toolbar-separator k-toolbar-button-separator k-separator"></div>
        }
        @if (showMenu) {
            <button
            kendoButton
            fillMode="flat"
            #overflowButton
            type="button"
            [icon]="overflowButtonIcon('font')"
            [svgIcon]="overflowButtonIcon('svg')"
            tabindex="-1"
            [title]="moreToolsTitle"
            [attr.aria-label]="moreToolsTitle"
            [attr.aria-expanded]="popupOpen"
            [id]="overflowBtnId"
            [attr.aria-haspopup]="normalizedOverflow.mode === 'section' ? null : 'menu'"
            [style.visibility]="'hidden'"
            [style.position]="'relative'"
            class="k-toolbar-overflow-button k-rounded-none"
            [ngClass]="overflowClass"
            (click)="showPopup()"
        >
        </button>
        }
        @if (showScrollButtons && (hasScrollButtons.position === 'split' || hasScrollButtons.position === 'end')) {
            <div class="k-toolbar-separator k-toolbar-button-separator k-separator" #scrollSeparator></div>
            @if (hasScrollButtons.position === 'split') {
                <span #nextScrollButton
                kendoToolbarScrollableButton
                [prev]="false"
                [overflow]="normalizedOverflow"
                [title]="getScrollButtonTitle('next')"
                class="k-toolbar-next k-icon-button k-button"
                [ngClass]="{
                    'k-button-sm': size === 'small',
                    'k-button-md': size === 'medium',
                    'k-button-lg': size === 'large'
                }"
                (onClick)="scrollTools($event)">
            </span>
            }
            @if (hasScrollButtons.position === 'end') {
                <div class="k-button-group" #endButtonGroup>
                <span #prevScrollButton
                    kendoToolbarScrollableButton
                    [prev]="true"
                    [overflow]="normalizedOverflow"
                    [title]="getScrollButtonTitle('prev')"
                    class="k-toolbar-prev k-icon-button k-button"
                    [ngClass]="{
                        'k-button-sm': size === 'small',
                        'k-button-md': size === 'medium',
                        'k-button-lg': size === 'large'
                    }"
                    (onClick)="scrollTools($event)">
                </span>
                <span #nextScrollButton
                    kendoToolbarScrollableButton
                    [prev]="false"
                    [overflow]="normalizedOverflow"
                    [title]="getScrollButtonTitle('next')"
                    class="k-toolbar-next k-icon-button k-button"
                    [ngClass]="{
                        'k-button-sm': size === 'small',
                        'k-button-md': size === 'medium',
                        'k-button-lg': size === 'large'
                    }"
                    (onClick)="scrollTools($event)">
                </span>
            </div>
            }
        }
        <ng-template #popupTemplate>
            <div
                class="k-menu-group"
                role="menu"
                [id]="popupId"
                [attr.dir]="direction === 'rtl' ? 'rtl' : null"
                [attr.aria-labelledby]="overflowBtnId">
                @for (tool of overflowTools; track tool; let index = $index) {
                    @if (tool.popupTemplate) {
                        <ng-template
                            kendoToolbarRenderer
                            [tool]="tool"
                            location="overflow"
                            [resizable]="resizable"
                            (rendererClick)="onRendererClick($event)"
                            [ngTemplateOutlet]="tool.isBuiltInTool ? tool.popupTemplate : popupWrapper"></ng-template>
                    }
                    <ng-template #popupWrapper>
                        <div role="menuitem" tabindex="-1" class="k-item k-menu-item">
                            <ng-container [ngTemplateOutlet]="tool.popupTemplate"></ng-container>
                        </div>
                    </ng-template>
                }
            </div>
        </ng-template>
        <ng-template #popupSectionTemplate>
            <span class="k-toolbar-items-list k-toolbar-items-list-solid"
                [ngClass]="sectionSizeClass"
                role="toolbar"
                [id]="popupId"
                [attr.dir]="direction === 'rtl' ? 'rtl' : null"
                [attr.aria-labelledby]="overflowBtnId">
                @for (tool of overflowTools; track tool; let index = $index) {
                    <ng-template #wrapper>
                        <ng-container [ngTemplateOutlet]="tool.sectionTemplate"></ng-container>
                    </ng-template>
                    <ng-container
                        kendoToolbarRenderer
                        [tool]="tool"
                        location="section"
                        [resizable]="resizable"
                        (rendererClick)="onRendererClick($event)"
                        [ngTemplateOutlet]="tool.isBuiltInTool ? tool.sectionTemplate : wrapper">
                    </ng-container>
                }
            </span>
        </ng-template>
        <ng-container #container></ng-container>
        @if (overflowEnabled) {
            <kendo-resize-sensor #resizeSensor></kendo-resize-sensor>
        }
        @if (showLicenseWatermark) {
            <div kendoWatermarkOverlay [licenseMessage]="licenseMessage"></div>
        }
    `,
      standalone: true,
      imports: [NgTemplateOutlet, LocalizedToolbarMessagesDirective, ToolBarRendererComponent, ButtonComponent, NgClass, ResizeSensorComponent, ToolbarScrollableButtonComponent, WatermarkOverlayComponent]
    }]
  }], () => [{
    type: LocalizationService
  }, {
    type: PopupService
  }, {
    type: RefreshService
  }, {
    type: NavigationService
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: Renderer2
  }, {
    type: ChangeDetectorRef
  }, {
    type: ToolbarToolsService
  }, {
    type: ScrollService
  }], {
    overflow: [{
      type: Input
    }],
    resizable: [{
      type: Input
    }],
    popupSettings: [{
      type: Input
    }],
    fillMode: [{
      type: Input
    }],
    tabindex: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    tabIndex: [{
      type: Input,
      args: ["tabIndex"]
    }],
    showIcon: [{
      type: Input
    }],
    showText: [{
      type: Input
    }],
    open: [{
      type: Output
    }],
    close: [{
      type: Output
    }],
    allTools: [{
      type: ContentChildren,
      args: [ToolBarToolComponent]
    }],
    overflowButton: [{
      type: ViewChild,
      args: ["overflowButton", {
        static: false,
        read: ElementRef
      }]
    }],
    popupTemplate: [{
      type: ViewChild,
      args: ["popupTemplate", {
        static: true
      }]
    }],
    popupSectionTemplate: [{
      type: ViewChild,
      args: ["popupSectionTemplate", {
        static: true
      }]
    }],
    scrollContainer: [{
      type: ViewChild,
      args: ["scrollContainer", {
        read: ElementRef,
        static: false
      }]
    }],
    resizeSensor: [{
      type: ViewChild,
      args: ["resizeSensor", {
        static: false
      }]
    }],
    container: [{
      type: ViewChild,
      args: ["container", {
        read: ViewContainerRef,
        static: true
      }]
    }],
    prevScrollButton: [{
      type: ViewChild,
      args: ["prevScrollButton", {
        read: ElementRef
      }]
    }],
    nextScrollButton: [{
      type: ViewChild,
      args: ["nextScrollButton", {
        read: ElementRef
      }]
    }],
    startButtonGroup: [{
      type: ViewChild,
      args: ["startButtonGroup", {
        read: ElementRef
      }]
    }],
    endButtonGroup: [{
      type: ViewChild,
      args: ["endButtonGroup", {
        read: ElementRef
      }]
    }],
    scrollSeparator: [{
      type: ViewChild,
      args: ["scrollSeparator", {
        read: ElementRef
      }]
    }],
    hostClass: [{
      type: HostBinding,
      args: ["class.k-toolbar"]
    }],
    scrollableClass: [{
      type: HostBinding,
      args: ["class.k-toolbar-scrollable"]
    }],
    sectionClass: [{
      type: HostBinding,
      args: ["class.k-toolbar-section"]
    }],
    onFocus: [{
      type: HostListener,
      args: ["focus", ["$event"]]
    }],
    onFocusOut: [{
      type: HostListener,
      args: ["focusout", ["$event"]]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }],
    getDir: [{
      type: HostBinding,
      args: ["attr.dir"]
    }],
    resizableClass: [{
      type: HostBinding,
      args: ["class.k-toolbar-resizable"]
    }]
  });
})();
var ToolBarButtonComponent = class _ToolBarButtonComponent extends ToolBarToolComponent {
  element;
  zone;
  host;
  // showText and showIcon showIcon should be declared first
  /**
   * Specifies the button text visibility.
   * Accepts a `DisplayMode` value.
   * @default 'always'
   */
  set showText(value) {
    this._showText = value;
    this.setTextDisplayMode();
  }
  get showText() {
    return this._showText;
  }
  /**
   * Specifies the button icon visibility.
   * Accepts a `DisplayMode` value.
   * @default 'always'
   */
  set showIcon(value) {
    this._showIcon = value;
    this.setTextDisplayMode();
  }
  get showIcon() {
    return this._showIcon;
  }
  /**
   * Specifies the text of the Button
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#buttons)).
   */
  set text(text) {
    this._text = text;
    this.setTextDisplayMode();
  }
  get text() {
    return this._text;
  }
  /**
   * @hidden
   */
  get size() {
    return this.host.size;
  }
  /**
   * Specifies custom inline CSS styles for the Button.
   */
  style;
  /**
   * Specifies custom CSS class names to be added to the Button.
   */
  className;
  /**
   * Specifies the `title` attribute of the Button.
   *
   * @remarks
   * This property is related to accessibility.
   */
  title;
  /**
   * Disables the Button when set to `true`
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#buttons)).
   */
  disabled;
  /**
   * Provides visual styling to indicate if the Button is active
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#toggle-buttons)).
   * For toggleable buttons, set this to `true`.
   * @default false
   */
  toggleable = false;
  /**
   * @hidden
   */
  set look(look) {
    if (look) {
      this.fillMode = look === "default" ? "solid" : look;
    }
  }
  /**
   * @hidden
   */
  get togglable() {
    return this.toggleable;
  }
  set togglable(value) {
    this.toggleable = value;
  }
  /**
   * Sets the selected state of the Button.
   * Use with the `toggleable` property.
   * @default false
   */
  selected = false;
  /**
   * Specifies the background and border styles of the Button. The default value is set by the Kendo theme.
   */
  fillMode = void 0;
  /**
   * Specifies the border radius of the Button. The default value is set by the Kendo theme.
   */
  rounded = void 0;
  /**
   * Specifies the predefined theme color of the Button. The default value is set by the Kendo theme.
   */
  themeColor = void 0;
  /**
   * Defines the name for an existing icon in a Kendo UI theme
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#buttons)).
   * The icon is rendered inside the Button by a `span.k-icon` element.
   */
  set icon(icon) {
    this.toolbarOptions.icon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.icon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Defines a CSS class or multiple classes to be applied to a `span` element inside the Button.
   * Allows the usage of custom icons.
   */
  set iconClass(iconClass) {
    this.toolbarOptions.iconClass = getValueForLocation(iconClass, this.showIcon, false);
    this.overflowOptions.iconClass = getValueForLocation(iconClass, this.showIcon, true);
  }
  /**
   * Defines an SVGIcon to be rendered within the button.
   * Accepts either an [existing Kendo SVG icon](https://www.telerik.com/kendo-angular-ui/components/icons/svgicon/svgicon-list) or a custom one.
   */
  set svgIcon(icon) {
    const isIconSet = this.toolbarOptions.icon || this.overflowOptions.icon;
    const isIconClassSet = this.toolbarOptions.iconClass || this.overflowOptions.iconClass;
    if (isDevMode() && icon && isIconSet && isIconClassSet) {
      throw new Error("Setting both icon/svgIcon and iconClass options at the same time is not supported.");
    }
    this.toolbarOptions.svgIcon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.svgIcon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Defines a URL for an image to be rendered inside the Button.
   * The URL can be relative or absolute.
   */
  set imageUrl(imageUrl) {
    this.toolbarOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, false);
    this.overflowOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, true);
  }
  /**
   * Fires each time the Button is clicked.
   */
  click = new EventEmitter();
  /**
   * Fires when the Button's `pointerdown` event is triggered.
   */
  pointerdown = new EventEmitter();
  /**
   * Fires each time the selected state of a toggleable Button is changed.
   * The event argument is the new selected state (Boolean).
   */
  selectedChange = new EventEmitter();
  toolbarOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  overflowOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  /**
   * @hidden
   */
  hasBadgeContainer = false;
  /**
   * @hidden
   */
  showBadge = false;
  toolbarButtonElement;
  sectionButtonElement;
  overflowButtonElement;
  _showText;
  _showIcon;
  _text;
  propertyChangeSub;
  constructor(element, zone, host) {
    super();
    this.element = element;
    this.zone = zone;
    this.host = host;
    this.isBuiltInTool = true;
    this.propertyChangeSub = this.host.propertyChange.subscribe((change) => {
      if (change.property === "showText" || change.property === "showIcon") {
        this[change.property] = change.value;
      }
    });
  }
  ngOnInit() {
    this.setTextDisplayMode();
  }
  ngOnDestroy() {
    this.propertyChangeSub.unsubscribe();
    this.propertyChangeSub = null;
  }
  ngOnChanges(changes) {
    if (changes["rounded"]) {
      this.rounded = changes["rounded"].currentValue;
    }
    if (changes["themeColor"]) {
      this.themeColor = changes["themeColor"].currentValue;
    }
    if (changes["showText"]) {
      this.showText = changes["showText"].currentValue;
    }
  }
  /**
   * @hidden
   */
  onBlur() {
    this.getButton().tabIndex = -1;
  }
  /**
   * @hidden
   */
  canFocus() {
    return !this.disabled;
  }
  /**
   * @hidden
   */
  focus(ev) {
    if (!ev || ev.type === "focus" || ev.type === "keydown") {
      this.getButton().focus({
        preventScroll: true
      });
    }
    this.getButton().tabIndex = 0;
  }
  /**
   * @hidden
   */
  handleKey() {
    this.getButton().tabIndex = -1;
    return false;
  }
  /**
   * @hidden
   */
  handleClick(ev) {
    this.click.emit(ev);
    if (this.toggleable) {
      this.selected = !this.selected;
      this.selectedChange.emit(this.selected);
    }
  }
  /**
   * @hidden
   */
  selectedChangeHandler(state) {
    this.selected = state;
    this.selectedChange.emit(state);
  }
  /**
   * @hidden
   */
  getButton() {
    return this[`${this.location}ButtonElement`]?.nativeElement;
  }
  setTextDisplayMode() {
    this.toolbarOptions.text = this.showText === "menu" || this.showText === "never" ? void 0 : this.text;
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.overflowOptions.text = this.showText === "toolbar" || this.showText === "never" ? void 0 : this.text;
    });
  }
  static ɵfac = function ToolBarButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarButtonComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ToolBarComponent));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarButtonComponent,
    selectors: [["kendo-toolbar-button"]],
    viewQuery: function ToolBarButtonComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c15, 5, ElementRef)(_c16, 5, ElementRef)(_c4, 5, ElementRef);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toolbarButtonElement = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sectionButtonElement = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowButtonElement = _t.first);
      }
    },
    inputs: {
      showText: "showText",
      showIcon: "showIcon",
      text: "text",
      style: "style",
      className: "className",
      title: "title",
      disabled: "disabled",
      toggleable: "toggleable",
      look: "look",
      togglable: "togglable",
      selected: "selected",
      fillMode: "fillMode",
      rounded: "rounded",
      themeColor: "themeColor",
      icon: "icon",
      iconClass: "iconClass",
      svgIcon: "svgIcon",
      imageUrl: "imageUrl"
    },
    outputs: {
      click: "click",
      pointerdown: "pointerdown",
      selectedChange: "selectedChange"
    },
    exportAs: ["kendoToolBarButton"],
    features: [ɵɵProvidersFeature([{
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarButtonComponent)
    }]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature],
    decls: 6,
    vars: 0,
    consts: [["toolbarTemplate", ""], ["popupTemplate", ""], ["sectionTemplate", ""], ["toolbarButton", ""], ["overflowButton", ""], ["sectionButton", ""], ["type", "button", "kendoButton", "", 3, "k-toolbar-button", "k-toolbar-toggle-button", "tabindex", "size", "ngStyle", "ngClass", "disabled", "toggleable", "fillMode", "themeColor", "rounded", "selected", "icon", "iconClass", "svgIcon", "imageUrl"], ["type", "button", "kendoButton", "", 3, "click", "pointerdown", "selectedChange", "blur", "tabindex", "size", "ngStyle", "ngClass", "disabled", "toggleable", "fillMode", "themeColor", "rounded", "selected", "icon", "iconClass", "svgIcon", "imageUrl"], ["rounded", "full", 3, "cutoutBorder"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "click", "ngClass", "ngStyle"], [1, "k-link", "k-menu-link"], [3, "name", "customFontClass", "svgIcon"], [1, "k-icon", "k-button-icon"], [1, "k-menu-link-text"], ["role", "presentation", 1, "k-image", 3, "src"]],
    template: function ToolBarButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, ToolBarButtonComponent_ng_template_0_Template, 2, 2, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, ToolBarButtonComponent_ng_template_2_Template, 6, 9, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, ToolBarButtonComponent_ng_template_4_Template, 2, 2, "ng-template", null, 2, ɵɵtemplateRefExtractor);
      }
    },
    dependencies: [ButtonComponent, NgStyle, NgClass, IconWrapperComponent, BadgeComponent, BadgeContainerComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarButtonComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarButton",
      providers: [{
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarButtonComponent)
      }],
      selector: "kendo-toolbar-button",
      template: `
        <ng-template #toolbarTemplate>
          @if (hasBadgeContainer) {
            <kendo-badge-container>
              <button
                #toolbarButton
                [class.k-toolbar-button]="!toggleable"
                [class.k-toolbar-toggle-button]="toggleable"
                [tabindex]="tabIndex"
                type="button"
                kendoButton
                [size]="size"
                [ngStyle]="style"
                [ngClass]="className"
                [attr.title]="title"
                [disabled]="disabled"
                [toggleable]="toggleable"
                [fillMode]="fillMode"
                [themeColor]="themeColor"
                [rounded]="rounded"
                [selected]="selected"
                [icon]="toolbarOptions.icon"
                [iconClass]="toolbarOptions.iconClass"
                [svgIcon]="toolbarOptions.svgIcon"
                [imageUrl]="toolbarOptions.imageUrl"
                (click)="click.emit($event)"
                (pointerdown)="pointerdown.emit($event)"
                (selectedChange)="selectedChangeHandler($event)"
                (blur)="onBlur()"
                >
                {{ toolbarOptions.text }}
              </button>
              @if (showBadge) {
                <kendo-badge [cutoutBorder]="true" rounded="full"></kendo-badge>
              }
            </kendo-badge-container>
          }

          @if (!hasBadgeContainer) {
            <button
              #toolbarButton
              [class.k-toolbar-button]="!toggleable"
              [class.k-toolbar-toggle-button]="toggleable"
              [tabindex]="tabIndex"
              type="button"
              kendoButton
              [size]="size"
              [ngStyle]="style"
              [ngClass]="className"
              [attr.title]="title"
              [disabled]="disabled"
              [toggleable]="toggleable"
              [fillMode]="fillMode"
              [themeColor]="themeColor"
              [rounded]="rounded"
              [selected]="selected"
              [icon]="toolbarOptions.icon"
              [iconClass]="toolbarOptions.iconClass"
              [svgIcon]="toolbarOptions.svgIcon"
              [imageUrl]="toolbarOptions.imageUrl"
              (click)="click.emit($event)"
              (pointerdown)="pointerdown.emit($event)"
              (selectedChange)="selectedChangeHandler($event)"
              (blur)="onBlur()"
              >
              {{ toolbarOptions.text }}
            </button>
          }
        </ng-template>
        <ng-template #popupTemplate>
          <div
            #overflowButton
            tabindex="-1"
            role="menuitem"
            class="k-item k-menu-item"
            [class.k-disabled]="disabled"
            [ngClass]="className"
            [ngStyle]="style"
            (click)="handleClick($event)">
            <span
              class="k-link k-menu-link"
              [class.k-selected]="selected"
              >
              @if (overflowOptions.icon || overflowOptions.iconClass || overflowOptions.svgIcon) {
                <kendo-icon-wrapper
                  [name]="overflowOptions.icon"
                  [customFontClass]="overflowOptions.iconClass"
                  [svgIcon]="overflowOptions.svgIcon"
                ></kendo-icon-wrapper>
              }
              @if (overflowOptions.imageUrl) {
                <span class="k-icon k-button-icon">
                  <img [src]="overflowOptions.imageUrl" role="presentation" class="k-image" />
                </span>
              }
              @if (overflowOptions.text) {
                <span class="k-menu-link-text">{{overflowOptions.text}}</span>
              }
            </span>
          </div>
        </ng-template>
        <ng-template #sectionTemplate>
          @if (hasBadgeContainer) {
            <kendo-badge-container>
              <button
                #sectionButton
                [class.k-toolbar-button]="!toggleable"
                [class.k-toolbar-toggle-button]="toggleable"
                [tabindex]="tabIndex"
                type="button"
                kendoButton
                [size]="size"
                [ngStyle]="style"
                [ngClass]="className"
                [attr.title]="title"
                [disabled]="disabled"
                [toggleable]="toggleable"
                [fillMode]="fillMode"
                [themeColor]="themeColor"
                [rounded]="rounded"
                [selected]="selected"
                [icon]="toolbarOptions.icon"
                [iconClass]="toolbarOptions.iconClass"
                [svgIcon]="toolbarOptions.svgIcon"
                [imageUrl]="toolbarOptions.imageUrl"
                (click)="click.emit($event)"
                (pointerdown)="pointerdown.emit($event)"
                (selectedChange)="selectedChangeHandler($event)"
                (blur)="onBlur()"
                >
                {{ toolbarOptions.text }}
              </button>
              @if (showBadge) {
                <kendo-badge [cutoutBorder]="true" rounded="full"></kendo-badge>
              }
            </kendo-badge-container>
          }
          @if (!hasBadgeContainer) {
            <button
              #sectionButton
              [class.k-toolbar-button]="!toggleable"
              [class.k-toolbar-toggle-button]="toggleable"
              [tabindex]="tabIndex"
              type="button"
              kendoButton
              [size]="size"
              [ngStyle]="style"
              [ngClass]="className"
              [attr.title]="title"
              [disabled]="disabled"
              [toggleable]="toggleable"
              [fillMode]="fillMode"
              [themeColor]="themeColor"
              [rounded]="rounded"
              [selected]="selected"
              [icon]="toolbarOptions.icon"
              [iconClass]="toolbarOptions.iconClass"
              [svgIcon]="toolbarOptions.svgIcon"
              [imageUrl]="toolbarOptions.imageUrl"
              (click)="click.emit($event)"
              (pointerdown)="pointerdown.emit($event)"
              (selectedChange)="selectedChangeHandler($event)"
              (blur)="onBlur()"
              >
              {{ toolbarOptions.text }}
            </button>
          }
        </ng-template>
        `,
      standalone: true,
      imports: [ButtonComponent, NgStyle, NgClass, IconWrapperComponent, BadgeComponent, BadgeContainerComponent]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: NgZone
  }, {
    type: ToolBarComponent
  }], {
    showText: [{
      type: Input
    }],
    showIcon: [{
      type: Input
    }],
    text: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    className: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    toggleable: [{
      type: Input
    }],
    look: [{
      type: Input
    }],
    togglable: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    fillMode: [{
      type: Input
    }],
    rounded: [{
      type: Input
    }],
    themeColor: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    iconClass: [{
      type: Input
    }],
    svgIcon: [{
      type: Input
    }],
    imageUrl: [{
      type: Input
    }],
    click: [{
      type: Output
    }],
    pointerdown: [{
      type: Output
    }],
    selectedChange: [{
      type: Output
    }],
    toolbarButtonElement: [{
      type: ViewChild,
      args: ["toolbarButton", {
        read: ElementRef
      }]
    }],
    sectionButtonElement: [{
      type: ViewChild,
      args: ["sectionButton", {
        read: ElementRef
      }]
    }],
    overflowButtonElement: [{
      type: ViewChild,
      args: ["overflowButton", {
        read: ElementRef
      }]
    }]
  });
})();
var ToolBarButtonGroupComponent = class _ToolBarButtonGroupComponent extends ToolBarToolComponent {
  localization;
  host;
  /**
   * When `true`, disables the whole group of buttons.
   * If you set the `disabled` property of the group, it overrides the `disabled` property of individual buttons.
   */
  disabled;
  /**
   * @hidden
   *
   * Used to set different fillmode in Spreadsheet and Toolbar to comply with referent rendering.
   * @default undefined
   */
  fillMode = void 0;
  /**
   * Sets the selection mode of the ButtonGroup.
   * @default 'multiple'
   */
  selection = "multiple";
  /**
   * Sets the width of the ButtonGroup.
   * When you set the width of the ButtonGroup, the buttons have the same width and resize to fill the group wrapper.
   */
  width;
  /**
   * @hidden
   */
  set look(look) {
    if (look) {
      this.buttonComponents.forEach((b) => b.fillMode = look === "default" ? "solid" : look);
    }
  }
  toolbarButtonGroup;
  sectionButtonGroup;
  overflowListItems;
  buttonComponents;
  get buttonElements() {
    if (this.overflows && this.location === "overflow") {
      return [...this.overflowListItems.toArray().filter((el) => !el.nativeElement.classList.contains("k-disabled"))].map((el) => el.nativeElement);
    } else if (this.overflows && this.location === "section") {
      return this.sectionButtonGroup.buttons.filter((b) => !b.isDisabled).map((b) => b.element);
    } else {
      return this.toolbarButtonGroup.buttons.filter((b) => !b.isDisabled).map((b) => b.element);
    }
  }
  focusedIndex = -1;
  getNextKey;
  getPrevKey;
  constructor(localization, host) {
    super();
    this.localization = localization;
    this.host = host;
    this.getNextKey = getNextKey(this.localization.rtl);
    this.getPrevKey = getPrevKey(this.localization.rtl);
    this.isBuiltInTool = true;
  }
  /**
   * @hidden
   */
  onFocus() {
    this.focusedIndex = 0;
  }
  /**
   * @hidden
   */
  onNavigate(ev) {
    ev.preventDefault();
  }
  /**
   * @hidden
   */
  selectedChangeHandler(state, button) {
    button.selected = state;
    button.selectedChange.emit(state);
  }
  /**
   * @hidden
   */
  overflowSelectedChangeHandler(button) {
    if (this.selection === "multiple") {
      button.selected = !button.selected;
    } else {
      const filteredButtons = this.buttonComponents.filter((b) => b !== button);
      filteredButtons.forEach((b) => b.selected = false);
      button.selected = !button.selected;
    }
    button.selectedChange.emit(button.selected);
  }
  /**
   * @hidden
   */
  onButtonClick(ev) {
    this.focusedIndex = this.buttonElements.findIndex((be) => be === ev.target || be.contains(ev.target));
    this.focusButton(this.focusedIndex, ev);
  }
  /**
   * @hidden
   */
  canFocus() {
    return !(this.disabled || this.buttonElements.length === 0);
  }
  /**
   * @hidden
   */
  focus(ev = {}) {
    const nextKey = this.getNextKey(this.overflows && this.location === "overflow");
    const prevKey = this.getPrevKey(this.overflows && this.location === "overflow");
    this.focusedIndex = getIndexOfFocused(prevKey, nextKey, this.buttonElements)(ev);
    this.focusButton(this.focusedIndex, ev);
  }
  /**
   * @hidden
   */
  handleKey(ev) {
    const nextKey = this.getNextKey(this.overflows && this.location === "overflow");
    const prevKey = this.getPrevKey(this.overflows && this.location === "overflow");
    const peekAtIndex = makePeeker(this.buttonElements);
    const isUnmodified = areEqual(this.focusedIndex);
    this.focusedIndex = seekFocusedIndex(prevKey, nextKey, peekAtIndex)(this.focusedIndex, ev);
    this.focusButton(this.focusedIndex, ev);
    return !isUnmodified(this.focusedIndex);
  }
  /**
   * @hidden
   */
  handleClick(ev, button) {
    button.click.emit(ev);
    this.onButtonClick(ev);
    this.overflowSelectedChangeHandler(button);
  }
  /**
   * @hidden
   */
  getIconClasses(button) {
    if (button.overflowOptions.icon) {
      return `${button.overflowOptions.icon}`;
    }
    if (button.overflowOptions.iconClass) {
      return button.overflowOptions.iconClass;
    }
    if (button.overflowOptions.svgIcon) {
      return button.overflowOptions.svgIcon;
    }
  }
  /**
   * @hidden
   */
  get size() {
    return this.host.size;
  }
  focusButton(index, ev) {
    if (!ev.type || ev.type === "focus" || ev.type === "keydown") {
      this.buttonElements[index]?.focus();
    }
  }
  static ɵfac = function ToolBarButtonGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarButtonGroupComponent)(ɵɵdirectiveInject(LocalizationService), ɵɵdirectiveInject(ToolBarComponent));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarButtonGroupComponent,
    selectors: [["kendo-toolbar-buttongroup"]],
    contentQueries: function ToolBarButtonGroupComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, ToolBarButtonComponent, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.buttonComponents = _t);
      }
    },
    viewQuery: function ToolBarButtonGroupComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c17, 5)(_c18, 5)(_c19, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toolbarButtonGroup = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sectionButtonGroup = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowListItems = _t);
      }
    },
    inputs: {
      disabled: "disabled",
      fillMode: "fillMode",
      selection: "selection",
      width: "width",
      look: "look"
    },
    exportAs: ["kendoToolBarButtonGroup"],
    features: [ɵɵProvidersFeature([LocalizationService, {
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarButtonGroupComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 0,
    consts: [["toolbarTemplate", ""], ["popupTemplate", ""], ["sectionTemplate", ""], ["toolbarButtonGroup", ""], ["listItem", ""], ["sectionButtonGroup", ""], [1, "k-toolbar-button-group", 3, "navigate", "focus", "ngClass", "tabIndex", "selection", "disabled", "width"], ["kendoButton", "", "type", "button", 3, "ngStyle", "ngClass", "disabled", "size", "togglable", "selected", "fillMode", "themeColor", "icon", "iconClass", "svgIcon", "imageUrl"], ["kendoButton", "", "type", "button", 3, "click", "pointerdown", "selectedChange", "ngStyle", "ngClass", "disabled", "size", "togglable", "selected", "fillMode", "themeColor", "icon", "iconClass", "svgIcon", "imageUrl"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "k-disabled", "ngStyle", "ngClass"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "click", "ngStyle", "ngClass"], [1, "k-link", "k-menu-link"], [3, "name", "customFontClass", "svgIcon"], [1, "k-menu-link-text"]],
    template: function ToolBarButtonGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, ToolBarButtonGroupComponent_ng_template_0_Template, 4, 5, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, ToolBarButtonGroupComponent_ng_template_2_Template, 2, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, ToolBarButtonGroupComponent_ng_template_4_Template, 4, 5, "ng-template", null, 2, ɵɵtemplateRefExtractor);
      }
    },
    dependencies: [ButtonGroupComponent, ButtonComponent, NgStyle, NgClass, IconWrapperComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarButtonGroupComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarButtonGroup",
      providers: [LocalizationService, {
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarButtonGroupComponent)
      }],
      selector: "kendo-toolbar-buttongroup",
      template: `
        <ng-template #toolbarTemplate>
          <kendo-buttongroup
            class="k-toolbar-button-group"
            [ngClass]="fillMode ? 'k-button-group-' + fillMode : ''"
            #toolbarButtonGroup
            [tabIndex]="-1"
            [selection]="selection"
            [disabled]="disabled"
            [width]="width"
            (navigate)="onNavigate($event)"
            (focus)="onFocus()"
            >
            @for (button of buttonComponents; track button) {
              <button
                kendoButton
                type="button"
                [ngStyle]="button.style"
                [ngClass]="button.className"
                [attr.title]="button.title"
                [disabled]="button.disabled"
                [size]="size"
                [togglable]="button.togglable"
                [selected]="button.selected"
                [attr.aria-pressed]="button.togglable ? (button.selected ? true : false) : null"
                [fillMode]="button.fillMode"
                [themeColor]="button.themeColor"
                [icon]="button.toolbarOptions.icon"
                [iconClass]="button.toolbarOptions.iconClass"
                [svgIcon]="button.toolbarOptions.svgIcon"
                [imageUrl]="button.toolbarOptions.imageUrl"
                (click)="button.click.emit($event); onButtonClick($event)"
                (pointerdown)="button.pointerdown.emit($event)"
                (selectedChange)="selectedChangeHandler($event, button)"
                >
                {{ button.toolbarOptions.text }}
              </button>
            }
          </kendo-buttongroup>
        </ng-template>
        <ng-template #popupTemplate>
          @for (button of buttonComponents; track button) {
            <div
              #listItem
              tabindex="-1"
              role="menuitem"
              class="k-item k-menu-item"
              [class.k-disabled]="disabled || button.disabled"
              [ngStyle]="button.style"
              [ngClass]="button.className"
              (click)="handleClick($event, button)">
              <span
                class="k-link k-menu-link"
                [class.k-selected]="button.selected"
                >
                @if (button.overflowOptions.icon || button.overflowOptions.iconClass || button.overflowOptions.svgIcon) {
                  <kendo-icon-wrapper
                    [name]="button.overflowOptions.icon"
                    [customFontClass]="button.overflowOptions.iconClass"
                    [svgIcon]="button.overflowOptions.svgIcon"
                  ></kendo-icon-wrapper>
                }
                @if (button.overflowOptions.text) {
                  <span class="k-menu-link-text">{{button.overflowOptions.text}}</span>
                }
              </span>
            </div>
          }
        </ng-template>
        <ng-template #sectionTemplate>
          <kendo-buttongroup
            class="k-toolbar-button-group"
            [ngClass]="fillMode ? 'k-button-group-' + fillMode : ''"
            #sectionButtonGroup
            [tabIndex]="-1"
            [selection]="selection"
            [disabled]="disabled"
            [width]="width"
            (navigate)="onNavigate($event)"
            (focus)="onFocus()"
            >
            @for (button of buttonComponents; track button) {
              <button
                kendoButton
                type="button"
                [ngStyle]="button.style"
                [ngClass]="button.className"
                [attr.title]="button.title"
                [disabled]="button.disabled"
                [size]="size"
                [togglable]="button.togglable"
                [selected]="button.selected"
                [attr.aria-pressed]="button.togglable ? (button.selected ? true : false) : null"
                [fillMode]="button.fillMode"
                [themeColor]="button.themeColor"
                [icon]="button.toolbarOptions.icon"
                [iconClass]="button.toolbarOptions.iconClass"
                [svgIcon]="button.toolbarOptions.svgIcon"
                [imageUrl]="button.toolbarOptions.imageUrl"
                (click)="button.click.emit($event); onButtonClick($event)"
                (pointerdown)="button.pointerdown.emit($event)"
                (selectedChange)="selectedChangeHandler($event, button)"
                >
                {{ button.toolbarOptions.text }}
              </button>
            }
          </kendo-buttongroup>
        </ng-template>
        `,
      standalone: true,
      imports: [ButtonGroupComponent, ButtonComponent, NgStyle, NgClass, IconWrapperComponent]
    }]
  }], () => [{
    type: LocalizationService
  }, {
    type: ToolBarComponent
  }], {
    disabled: [{
      type: Input
    }],
    fillMode: [{
      type: Input
    }],
    selection: [{
      type: Input
    }],
    width: [{
      type: Input
    }],
    look: [{
      type: Input
    }],
    toolbarButtonGroup: [{
      type: ViewChild,
      args: ["toolbarButtonGroup", {
        static: false
      }]
    }],
    sectionButtonGroup: [{
      type: ViewChild,
      args: ["sectionButtonGroup", {
        static: false
      }]
    }],
    overflowListItems: [{
      type: ViewChildren,
      args: ["listItem"]
    }],
    buttonComponents: [{
      type: ContentChildren,
      args: [forwardRef(() => ToolBarButtonComponent)]
    }]
  });
})();
var ToolBarDropDownButtonComponent = class _ToolBarDropDownButtonComponent extends ToolBarToolComponent {
  zone;
  renderer;
  host;
  /**
   * Shows the default arrow icon or lets you provide a custom one.
   * @default false
   */
  arrowIcon = false;
  /**
   * Sets the `title` attribute of the underlying button element.
   * @default ''
   *
   * @remarks
   * This property is related to accessibility.
   */
  title = "";
  // showText and showIcon showIcon should be declared first
  /**
   * Controls the button text visibility.
   * @default 'always'
   */
  set showText(value) {
    this._showText = value;
    this.setTextDisplayMode();
  }
  get showText() {
    return this._showText;
  }
  /**
   * Controls the button icon visibility.
   * @default 'always'
   */
  set showIcon(value) {
    this._showIcon = value;
  }
  get showIcon() {
    return this._showIcon;
  }
  /**
   * Sets the text of the DropDownButton
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#drop-down-buttons)).
   */
  set text(text) {
    this._text = text;
    this.setTextDisplayMode();
  }
  get text() {
    return this._text;
  }
  /**
   * Sets the icon rendered next to the button text.
   */
  set icon(icon) {
    this.toolbarOptions.icon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.icon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Sets the `SVGIcon` rendered in the button.
   * Accepts an [existing Kendo SVG icon](https://www.telerik.com/kendo-angular-ui/components/icons/svgicon/svgicon-list) or a custom one.
   */
  set svgIcon(icon) {
    const isIconSet = this.toolbarOptions.icon || this.overflowOptions.icon;
    const isIconClassSet = this.toolbarOptions.iconClass || this.overflowOptions.iconClass;
    if (isDevMode() && icon && isIconSet && isIconClassSet) {
      throw new Error("Setting both icon/svgIcon and iconClass options at the same time is not supported.");
    }
    this.toolbarOptions.svgIcon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.svgIcon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Sets a custom CSS class icon rendered next to the button text.
   */
  set iconClass(iconClass) {
    this.toolbarOptions.iconClass = getValueForLocation(iconClass, this.showIcon, false);
    this.overflowOptions.iconClass = getValueForLocation(iconClass, this.showIcon, true);
  }
  /**
   * Sets a URL for the image displayed next to the button text.
   */
  set imageUrl(imageUrl) {
    this.toolbarOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, false);
    this.overflowOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, true);
  }
  /**
   * Configures the popup of the DropDownButton.
   * Accepts a `PopupSettings` object that allows you to customize the popup behavior and appearance.
   */
  set popupSettings(settings) {
    this._popupSettings = Object.assign({
      animate: true,
      popupClass: ""
    }, settings);
  }
  get popupSettings() {
    return this._popupSettings;
  }
  /**
   * @hidden
   */
  set look(look) {
    if (look) {
      this.fillMode = look === "default" ? "solid" : look;
    }
  }
  /**
   * @hidden
   */
  set primary(primary) {
    this.themeColor = primary ? "primary" : "base";
  }
  /**
   * Sets the fill mode for the button.
   * The fill mode represents the background and border styles. The default value is set by the Kendo theme.
   */
  fillMode = void 0;
  /**
   * Sets the predefined theme color for the button.
   * The theme color applies to the background, border, and text
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/buttons/api/dropdownbuttoncomponent#themecolor)). The default value is set by the Kendo theme.
   */
  themeColor = void 0;
  /**
   * Sets the CSS classes for the main button.
   * Accepts values supported by [`ngClass`](link:site.data.urls.angular['ngclassapi']).
   */
  buttonClass;
  /**
   * Sets the data item field that repesents the item text.
   * If the data contains only primitive values, do not set this property.
   */
  textField;
  /**
   * When `true`, disables the DropDownButton.
   */
  disabled;
  /**
   * Sets the data of the DropDownButton
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#drop-down-buttons)).
   *
   * > Provide the data as an array-like list.
   */
  set data(data) {
    this._data = data || [];
  }
  get data() {
    if (!this._data) {
      this.data = [];
    }
    return this._data;
  }
  /**
   * Fires each time the user clicks a DropDownButton item.
   * The event data contains the clicked item's data.
   */
  itemClick = new EventEmitter();
  /**
   * Fires when the popup is about to open.
   * This event is preventable. If you cancel the event, the popup stays closed.
   */
  open = new EventEmitter();
  /**
   * Fires when the popup is about to close.
   * This event is preventable. If you cancel the event, the popup stays open.
   */
  close = new EventEmitter();
  dropdownButton;
  toolbarDropDownButton;
  sectionDropDownButton;
  overflowListItems;
  toolbarOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  overflowOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  get overflowButtons() {
    return [...this.overflowListItems.toArray().filter((el) => !el.nativeElement.classList.contains("k-disabled"))];
  }
  _data;
  _popupSettings = {
    animate: true,
    popupClass: ""
  };
  focusedIndex = -1;
  _showText;
  _showIcon;
  _text;
  propertyChangeSub;
  getNextKey;
  getPrevKey;
  constructor(zone, renderer, host) {
    super();
    this.zone = zone;
    this.renderer = renderer;
    this.host = host;
    this.getNextKey = getNextKey();
    this.getPrevKey = getPrevKey();
    this.isBuiltInTool = true;
    this.propertyChangeSub = this.host.propertyChange.subscribe((change) => {
      if (change.property === "showText" || change.property === "showIcon") {
        this[change.property] = change.value;
      }
    });
  }
  ngOnInit() {
    this.setTextDisplayMode();
  }
  ngOnDestroy() {
    if (this.propertyChangeSub) {
      this.propertyChangeSub.unsubscribe();
      this.propertyChangeSub = null;
    }
  }
  ngAfterViewInit() {
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      const dropdownButton = this[`${this.location}DropDownButton`];
      if (dropdownButton?.button) {
        this.renderer.addClass(dropdownButton.button.nativeElement, "k-toolbar-menu-button");
      }
    });
  }
  /**
   * @hidden
   */
  onButtonListClick(ev) {
    this.focusedIndex = this.overflowListItems.toArray().findIndex((b) => b.nativeElement.contains(ev.target));
  }
  /**
   * @hidden
   */
  get size() {
    return this.host.size;
  }
  /**
   * @hidden
   */
  canFocus() {
    return !this.disabled;
  }
  /**
   * @hidden
   */
  focus(ev = {}) {
    if (!this.overflows || this.location === "section") {
      if (!ev.type || ev.type === "focus" || ev.type === "keydown") {
        this[`${this.location}DropDownButton`]?.focus();
      }
    } else if (this.overflowButtons.length > 0) {
      this.focusedIndex = getIndexOfFocused(this.getPrevKey(), this.getNextKey(), this.overflowButtons.map((ob) => ob.nativeElement))(ev);
      this.focusButton(this.focusedIndex, ev);
    }
  }
  /**
   * @hidden
   */
  handleKey(ev) {
    const code = normalizeKeys(ev);
    if (!this.overflows && (code === this.getPrevKey(this.overflows) || code === this.getNextKey(this.overflows))) {
      return false;
    }
    if (this.overflows && this.location !== "section") {
      const peekAtIndex = makePeeker(this.overflowButtons);
      const isUnmodified = areEqual(this.focusedIndex);
      this.focusedIndex = seekFocusedIndex(this.getPrevKey(), this.getNextKey(), peekAtIndex)(this.focusedIndex, ev);
      this.focusButton(this.focusedIndex, ev);
      return !isUnmodified(this.focusedIndex);
    }
  }
  /**
   * @hidden
   */
  getText(dataItem) {
    if (dataItem) {
      return this.textField ? dataItem[this.textField] : dataItem.text || dataItem;
    }
  }
  /**
   * @hidden
   */
  handleClick(ev, item, index) {
    this.onButtonListClick(ev);
    const dataItem = this.data[index];
    if (item.click) {
      item.click(dataItem);
    }
    this.itemClick.emit(dataItem);
  }
  focusButton(index, ev) {
    if (!ev.type || ev.type === "focus" || ev.type === "keydown") {
      this.overflowButtons[index].nativeElement.focus();
    }
  }
  setTextDisplayMode() {
    this.toolbarOptions.text = this.showText === "menu" || this.showText === "never" ? void 0 : this.text;
    this.overflowOptions.text = this.showText === "toolbar" || this.showText === "never" ? void 0 : this.text;
  }
  static ɵfac = function ToolBarDropDownButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarDropDownButtonComponent)(ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ToolBarComponent));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarDropDownButtonComponent,
    selectors: [["kendo-toolbar-dropdownbutton"]],
    viewQuery: function ToolBarDropDownButtonComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c20, 7, ElementRef)(_c21, 5)(_c22, 5)(_c19, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dropdownButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toolbarDropDownButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sectionDropDownButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowListItems = _t);
      }
    },
    inputs: {
      arrowIcon: "arrowIcon",
      title: "title",
      showText: "showText",
      showIcon: "showIcon",
      text: "text",
      icon: "icon",
      svgIcon: "svgIcon",
      iconClass: "iconClass",
      imageUrl: "imageUrl",
      popupSettings: "popupSettings",
      look: "look",
      primary: "primary",
      fillMode: "fillMode",
      themeColor: "themeColor",
      buttonClass: "buttonClass",
      textField: "textField",
      disabled: "disabled",
      data: "data"
    },
    outputs: {
      itemClick: "itemClick",
      open: "open",
      close: "close"
    },
    exportAs: ["kendoToolBarDropDownButton"],
    features: [ɵɵProvidersFeature([{
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarDropDownButtonComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 0,
    consts: [["toolbarTemplate", ""], ["popupTemplate", ""], ["sectionTemplate", ""], ["toolbarDropDownButton", ""], ["listItem", ""], ["sectionDropDownButton", ""], [3, "open", "close", "itemClick", "icon", "iconClass", "svgIcon", "imageUrl", "arrowIcon", "buttonClass", "disabled", "size", "tabIndex", "data", "buttonAttributes", "textField", "popupSettings", "fillMode", "themeColor"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", "k-disabled", 3, "ngClass"], [3, "ngClass"], [3, "name", "customFontClass", "svgIcon"], [1, "k-menu-link-text"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "k-disabled"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "click"], [1, "k-link", "k-menu-link", 3, "ngClass"]],
    template: function ToolBarDropDownButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, ToolBarDropDownButtonComponent_ng_template_0_Template, 3, 18, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, ToolBarDropDownButtonComponent_ng_template_2_Template, 6, 5, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, ToolBarDropDownButtonComponent_ng_template_4_Template, 3, 18, "ng-template", null, 2, ɵɵtemplateRefExtractor);
      }
    },
    dependencies: [DropDownButtonComponent, NgClass, IconWrapperComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarDropDownButtonComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarDropDownButton",
      providers: [{
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarDropDownButtonComponent)
      }],
      selector: "kendo-toolbar-dropdownbutton",
      template: `
        <ng-template #toolbarTemplate>
          <kendo-dropdownbutton #toolbarDropDownButton
            [icon]="toolbarOptions.icon"
            [iconClass]="toolbarOptions.iconClass"
            [svgIcon]="toolbarOptions.svgIcon"
            [imageUrl]="toolbarOptions.imageUrl"
            [arrowIcon]="arrowIcon"
            [buttonClass]="buttonClass"
            [disabled]="disabled"
            [size]="size"
            [tabIndex]="-1"
            [data]="data"
            [buttonAttributes]="{'title': title}"
            [textField]="textField"
            [popupSettings]="popupSettings"
            [fillMode]="fillMode"
            [themeColor]="themeColor"
            (open)="open.emit($event)"
            (close)="close.emit($event)"
            (itemClick)="itemClick.emit($event)"
            >
            {{ toolbarOptions.text }}
          </kendo-dropdownbutton>
        </ng-template>

        <ng-template #popupTemplate>
          <div
            tabindex="-1"
            role="menuitem"
            class="k-item k-menu-item k-disabled"
            [ngClass]="buttonClass">
            <span
              [ngClass]="{'k-link': true, 'k-menu-link': true}"
              >
              @if (overflowOptions.icon || overflowOptions.iconClass || overflowOptions.svgIcon) {
                <kendo-icon-wrapper
                  [name]="overflowOptions.icon"
                  [customFontClass]="overflowOptions.iconClass"
                  [svgIcon]="overflowOptions.svgIcon"
                ></kendo-icon-wrapper>
              }
              @if (overflowOptions.text) {
                <span class="k-menu-link-text">{{overflowOptions.text}}</span>
              }
            </span>
          </div>
          @for (item of data; track item; let i = $index) {
            <div #listItem
              tabindex="-1"
              role="menuitem"
              class="k-item k-menu-item"
              [class.k-disabled]="disabled || item.disabled"
              (click)="handleClick($event, item, i)">
              <span
                class="k-link k-menu-link"
                [ngClass]="item.cssClass"
                >
                @if (item.icon || item.iconClass || item.svgIcon) {
                  <kendo-icon-wrapper
                    [name]="item.icon"
                    [customFontClass]="item.iconClass"
                    [svgIcon]="item.svgIcon"
                  ></kendo-icon-wrapper>
                }
                @if (getText(item)) {
                  <span class="k-menu-link-text">{{ getText(item) }}</span>
                }
              </span>
            </div>
          }
        </ng-template>

        <ng-template #sectionTemplate>
          <kendo-dropdownbutton #sectionDropDownButton
            [icon]="toolbarOptions.icon"
            [iconClass]="toolbarOptions.iconClass"
            [svgIcon]="toolbarOptions.svgIcon"
            [imageUrl]="toolbarOptions.imageUrl"
            [arrowIcon]="arrowIcon"
            [buttonClass]="buttonClass"
            [disabled]="disabled"
            [size]="size"
            [tabIndex]="-1"
            [data]="data"
            [buttonAttributes]="{'title': title}"
            [textField]="textField"
            [popupSettings]="popupSettings"
            [fillMode]="fillMode"
            [themeColor]="themeColor"
            (open)="open.emit($event)"
            (close)="close.emit($event)"
            (itemClick)="itemClick.emit($event)"
            >
            {{ toolbarOptions.text }}
          </kendo-dropdownbutton>
        </ng-template>
        `,
      standalone: true,
      imports: [DropDownButtonComponent, NgClass, IconWrapperComponent]
    }]
  }], () => [{
    type: NgZone
  }, {
    type: Renderer2
  }, {
    type: ToolBarComponent
  }], {
    arrowIcon: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    showText: [{
      type: Input
    }],
    showIcon: [{
      type: Input
    }],
    text: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    svgIcon: [{
      type: Input
    }],
    iconClass: [{
      type: Input
    }],
    imageUrl: [{
      type: Input
    }],
    popupSettings: [{
      type: Input
    }],
    look: [{
      type: Input
    }],
    primary: [{
      type: Input
    }],
    fillMode: [{
      type: Input
    }],
    themeColor: [{
      type: Input
    }],
    buttonClass: [{
      type: Input
    }],
    textField: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    data: [{
      type: Input
    }],
    itemClick: [{
      type: Output
    }],
    open: [{
      type: Output
    }],
    close: [{
      type: Output
    }],
    dropdownButton: [{
      type: ViewChild,
      args: ["dropdownButton", {
        read: ElementRef,
        static: true
      }]
    }],
    toolbarDropDownButton: [{
      type: ViewChild,
      args: ["toolbarDropDownButton", {
        static: false
      }]
    }],
    sectionDropDownButton: [{
      type: ViewChild,
      args: ["sectionDropDownButton", {
        static: false
      }]
    }],
    overflowListItems: [{
      type: ViewChildren,
      args: ["listItem"]
    }]
  });
})();
var ToolBarSplitButtonComponent = class _ToolBarSplitButtonComponent extends ToolBarToolComponent {
  host;
  // showText and showIcon showIcon should be declared first
  /**
   * Controls the button text visibility.
   * @default 'always'
   */
  set showText(value) {
    this._showText = value;
    this.setTextDisplayMode();
  }
  get showText() {
    return this._showText;
  }
  /**
   * Controls the button icon visibility.
   * @default 'always'
   */
  set showIcon(value) {
    this._showIcon = value;
    this.setTextDisplayMode();
  }
  get showIcon() {
    return this._showIcon;
  }
  /**
   * Sets the text of the SplitButton ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#split-buttons)).
   */
  set text(text) {
    this._text = text;
    this.setTextDisplayMode();
  }
  get text() {
    return this._text;
  }
  /**
   * Sets the icon rendered next to the button text
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#split-buttons)).
   */
  set icon(icon) {
    this.toolbarOptions.icon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.icon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Sets the `SVGIcon` rendered in the main button.
   * Accepts an [existing Kendo SVG icon](https://www.telerik.com/kendo-angular-ui/components/icons/svgicon/svgicon-list) or a custom one.
   */
  set svgIcon(icon) {
    const isIconSet = this.toolbarOptions.icon || this.overflowOptions.icon;
    const isIconClassSet = this.toolbarOptions.iconClass || this.overflowOptions.iconClass;
    if (isDevMode() && icon && isIconSet && isIconClassSet) {
      throw new Error("Setting both icon/svgIcon and iconClass options at the same time is not supported.");
    }
    this.toolbarOptions.svgIcon = getValueForLocation(icon, this.showIcon, false);
    this.overflowOptions.svgIcon = getValueForLocation(icon, this.showIcon, true);
  }
  /**
   * Sets a custom CSS class icon rendered next to the button text.
   */
  set iconClass(iconClass) {
    this.toolbarOptions.iconClass = getValueForLocation(iconClass, this.showIcon, false);
    this.overflowOptions.iconClass = getValueForLocation(iconClass, this.showIcon, true);
  }
  /**
   * Sets a URL for the image displayed next to the button text.
   */
  set imageUrl(imageUrl) {
    this.toolbarOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, false);
    this.overflowOptions.imageUrl = getValueForLocation(imageUrl, this.showIcon, true);
  }
  /**
   * When `true`, disables a SplitButton item.
   */
  disabled;
  /**
   * Configures the popup of the SplitButton.
   * Accepts a `PopupSettings` object that allows you to customize the popup behavior and appearance.
    */
  set popupSettings(value) {
    this._popupSettings = value;
  }
  get popupSettings() {
    if (!this._popupSettings) {
      this._popupSettings = {
        animate: true,
        popupClass: ""
      };
    }
    return this._popupSettings;
  }
  /**
   * Sets the fill mode for the button.
   * The fill mode represents the background and border styles. The default value is set by the Kendo theme.
   */
  fillMode = void 0;
  /**
   * Sets the predefined theme color for the button.
   * The theme color applies to the background, border, and text. The default value is set by the Kendo theme.
   */
  themeColor = void 0;
  /**
   * @hidden
   */
  set look(look) {
    if (look) {
      this.fillMode = look === "default" ? "solid" : look;
    }
  }
  /**
   * Sets the CSS classes for the main button.
   * Accepts values supported by [`ngClass`](link:site.data.urls.angular['ngclassapi']).
   */
  buttonClass;
  /**
   * Sets the CSS classes for the arrow button that opens the popup.
   * Accepts values supported by [`ngClass`](link:site.data.urls.angular['ngclassapi']).
   */
  arrowButtonClass;
  /**
   * Sets the name of the [font icon](https://www.telerik.com/kendo-angular-ui/components/styling/icons#icons-list) for the arrow button.
   */
  arrowButtonIcon = "chevron-down";
  /**
   * Sets the [`SVGIcon`](https://www.telerik.com/kendo-angular-ui/components/icons/api/svgicon) for the arrow button.
   */
  arrowButtonSvgIcon = chevronDownIcon;
  /**
   * Sets the text field for the button-list popup.
   * @default 'text'
   */
  textField = "text";
  /**
   * Sets the data of the SplitButton ([see example](https://www.telerik.com/kendo-angular-ui/components/toolbar/control-types#split-buttons)).
   *
   * > Provide the data as an array-like list.
   */
  set data(data) {
    this._data = data || [];
  }
  get data() {
    if (!this._data) {
      this.data = [];
    }
    return this._data;
  }
  /**
   * Fires when the user clicks the main button.
   */
  buttonClick = new EventEmitter();
  /**
   * Fires when the user clicks a drop-down list item.
   * The event data contains the clicked item's data.
   */
  itemClick = new EventEmitter();
  /**
   * Fires when the popup is about to open.
   * This event is preventable. If you cancel the event, the popup stays closed.
   */
  open = new EventEmitter();
  /**
   * Fires when the popup is about to close.
   * This event is preventable. If you cancel the event, the popup stays open.
   */
  close = new EventEmitter();
  toolbarOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  overflowOptions = {
    text: "",
    icon: "",
    iconClass: "",
    svgIcon: null,
    imageUrl: ""
  };
  ngOnInit() {
    this.setTextDisplayMode();
  }
  ngOnDestroy() {
    if (this.propertyChangeSub) {
      this.propertyChangeSub.unsubscribe();
      this.propertyChangeSub = null;
    }
  }
  get overflowButtons() {
    return [this.overflowMainButton, ...this.overflowListItems.toArray().filter((el) => !el.nativeElement.classList.contains("k-disabled"))];
  }
  _data;
  _popupSettings = {
    animate: true,
    popupClass: ""
  };
  focusedIndex = -1;
  _showText;
  _showIcon;
  _text;
  propertyChangeSub;
  getNextKey;
  getPrevKey;
  toolbarSplitButton;
  sectionSplitButton;
  overflowMainButton;
  overflowListItems;
  constructor(host) {
    super();
    this.host = host;
    this.getNextKey = getNextKey();
    this.getPrevKey = getPrevKey();
    this.isBuiltInTool = true;
    this.propertyChangeSub = this.host.propertyChange.subscribe((change) => {
      if (change.property === "showText" || change.property === "showIcon") {
        this[change.property] = change.value;
      }
    });
  }
  /**
   * @hidden
   */
  onButtonListClick(ev) {
    this.focusedIndex = this.overflowButtons.findIndex((b) => b.nativeElement.contains(ev.target));
  }
  /**
   * @hidden
   */
  onMainButtonClick(ev) {
    this.buttonClick.emit(ev);
    this.focusedIndex = 0;
  }
  /**
   * @hidden
   */
  canFocus() {
    return !this.disabled;
  }
  /**
   * @hidden
   */
  get size() {
    return this.host.size;
  }
  /**
   * @hidden
   */
  focus(ev = {}) {
    if (!this.overflows || this.location === "section") {
      if (!ev.type || ev.type === "focus" || ev.type === "keydown") {
        this[`${this.location}SplitButton`].focus();
      }
    } else if (this.overflowButtons.length > 0) {
      this.focusedIndex = getIndexOfFocused(this.getPrevKey(), this.getNextKey(), this.overflowButtons.map((ob) => ob.nativeElement))(ev);
      this.focusButton(this.focusedIndex, ev);
    }
  }
  /**
   * @hidden
   */
  handleKey(ev) {
    const code = normalizeKeys(ev);
    if (!this.overflows && (code === this.getPrevKey(this.overflows) || code === this.getNextKey(this.overflows))) {
      return false;
    }
    if (this.overflows) {
      const peekAtIndex = makePeeker(this.overflowButtons);
      const isUnmodified = areEqual(this.focusedIndex);
      this.focusedIndex = seekFocusedIndex(this.getPrevKey(), this.getNextKey(), peekAtIndex)(this.focusedIndex, ev);
      this.focusButton(this.focusedIndex, ev);
      return !isUnmodified(this.focusedIndex);
    }
  }
  /**
   * @hidden
   */
  getText(dataItem) {
    if (dataItem) {
      return this.textField ? dataItem[this.textField] : dataItem.text || dataItem;
    }
  }
  /**
   * @hidden
   */
  handleClick(ev, item, index) {
    this.onButtonListClick(ev);
    const dataItem = this.data[index];
    if (item.click) {
      item.click(dataItem);
    }
    this.itemClick.emit(dataItem);
  }
  focusButton(index, ev) {
    if ((!ev.type || ev.type === "focus" || ev.type === "keydown" || ev.type === "click") && this.location !== "section") {
      this.overflowButtons[index].nativeElement.focus();
    }
  }
  setTextDisplayMode() {
    this.toolbarOptions.text = this.showText === "menu" || this.showText === "never" ? void 0 : this.text;
    this.overflowOptions.text = this.showText === "toolbar" || this.showText === "never" ? void 0 : this.text;
  }
  static ɵfac = function ToolBarSplitButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarSplitButtonComponent)(ɵɵdirectiveInject(ToolBarComponent));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarSplitButtonComponent,
    selectors: [["kendo-toolbar-splitbutton"]],
    viewQuery: function ToolBarSplitButtonComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c25, 5)(_c26, 5)(_c27, 5, ElementRef)(_c19, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toolbarSplitButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sectionSplitButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowMainButton = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.overflowListItems = _t);
      }
    },
    inputs: {
      showText: "showText",
      showIcon: "showIcon",
      text: "text",
      icon: "icon",
      svgIcon: "svgIcon",
      iconClass: "iconClass",
      imageUrl: "imageUrl",
      disabled: "disabled",
      popupSettings: "popupSettings",
      fillMode: "fillMode",
      themeColor: "themeColor",
      look: "look",
      buttonClass: "buttonClass",
      arrowButtonClass: "arrowButtonClass",
      arrowButtonIcon: "arrowButtonIcon",
      arrowButtonSvgIcon: "arrowButtonSvgIcon",
      textField: "textField",
      data: "data"
    },
    outputs: {
      buttonClick: "buttonClick",
      itemClick: "itemClick",
      open: "open",
      close: "close"
    },
    exportAs: ["kendoToolBarSplitButton"],
    features: [ɵɵProvidersFeature([{
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarSplitButtonComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 0,
    consts: [["toolbarTemplate", ""], ["popupTemplate", ""], ["sectionTemplate", ""], ["toolbarSplitButton", ""], ["overflowMainButton", ""], ["listItem", ""], ["sectionSplitButton", ""], [1, "k-toolbar-split-button", 3, "buttonClick", "open", "close", "itemClick", "data", "text", "icon", "iconClass", "svgIcon", "imageUrl", "buttonClass", "arrowButtonClass", "arrowButtonIcon", "arrowButtonSvgIcon", "disabled", "size", "tabIndex", "textField", "popupSettings", "fillMode", "themeColor"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "click", "ngClass"], [3, "ngClass"], [3, "name", "customFontClass", "svgIcon"], [1, "k-menu-link-text"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "k-disabled"], ["tabindex", "-1", "role", "menuitem", 1, "k-item", "k-menu-item", 3, "click"], [1, "k-link", "k-menu-link"]],
    template: function ToolBarSplitButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵtemplate(0, ToolBarSplitButtonComponent_ng_template_0_Template, 2, 17, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, ToolBarSplitButtonComponent_ng_template_2_Template, 7, 7, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, ToolBarSplitButtonComponent_ng_template_4_Template, 2, 17, "ng-template", null, 2, ɵɵtemplateRefExtractor);
      }
    },
    dependencies: [SplitButtonComponent, NgClass, IconWrapperComponent],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarSplitButtonComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarSplitButton",
      providers: [{
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarSplitButtonComponent)
      }],
      selector: "kendo-toolbar-splitbutton",
      template: `
        <ng-template #toolbarTemplate>
          <kendo-splitbutton
            #toolbarSplitButton
            class="k-toolbar-split-button"
            [data]="data"
            [text]="toolbarOptions.text"
            [icon]="toolbarOptions.icon"
            [iconClass]="toolbarOptions.iconClass"
            [svgIcon]="toolbarOptions.svgIcon"
            [imageUrl]="toolbarOptions.imageUrl"
            [buttonClass]="buttonClass"
            [arrowButtonClass]="arrowButtonClass"
            [arrowButtonIcon]="arrowButtonIcon"
            [arrowButtonSvgIcon]="arrowButtonSvgIcon"
            [disabled]="disabled"
            [size]="size"
            [tabIndex]="-1"
            [textField]="textField"
            [popupSettings]="popupSettings"
            [fillMode]="fillMode"
            [themeColor]="themeColor"
            (buttonClick)="buttonClick.emit($event)"
            (open)="open.emit($event)"
            (close)="close.emit($event)"
            (itemClick)="itemClick.emit($event)"
          ></kendo-splitbutton>
        </ng-template>
        <ng-template #popupTemplate>
          <div #overflowMainButton
            tabindex="-1"
            role="menuitem"
            class="k-item k-menu-item"
            [class.k-disabled]="disabled"
            [ngClass]="buttonClass"
            (click)="onMainButtonClick($event)">
            <span
              [ngClass]="{'k-link': true, 'k-menu-link': true}"
              >
              @if (overflowOptions.icon || overflowOptions.iconClass || overflowOptions.svgIcon) {
                <kendo-icon-wrapper
                  [name]="overflowOptions.icon"
                  [customFontClass]="overflowOptions.iconClass"
                  [svgIcon]="overflowOptions.svgIcon"
                  >
                </kendo-icon-wrapper>
              }
              @if (overflowOptions.text) {
                <span class="k-menu-link-text">{{overflowOptions.text}}</span>
              }
            </span>
          </div>
          @for (item of data; track item; let i = $index) {
            <div #listItem
              tabindex="-1"
              role="menuitem"
              class="k-item k-menu-item"
              [class.k-disabled]="disabled || item.disabled"
              (click)="handleClick($event, item, i)">
              <span
                class="k-link k-menu-link"
                >
                @if (item.icon || item.iconClass || item.svgIcon) {
                  <kendo-icon-wrapper
                    [name]="item.icon"
                    [customFontClass]="item.iconClass"
                    [svgIcon]="item.svgIcon"
                    >
                  </kendo-icon-wrapper>
                }
                @if (getText(item)) {
                  <span class="k-menu-link-text">{{ getText(item) }}</span>
                }
              </span>
            </div>
          }
        </ng-template>
        <ng-template #sectionTemplate>
          <kendo-splitbutton
            #sectionSplitButton
            class="k-toolbar-split-button"
            [data]="data"
            [text]="toolbarOptions.text"
            [icon]="toolbarOptions.icon"
            [iconClass]="toolbarOptions.iconClass"
            [svgIcon]="toolbarOptions.svgIcon"
            [imageUrl]="toolbarOptions.imageUrl"
            [buttonClass]="buttonClass"
            [arrowButtonClass]="arrowButtonClass"
            [arrowButtonIcon]="arrowButtonIcon"
            [arrowButtonSvgIcon]="arrowButtonSvgIcon"
            [disabled]="disabled"
            [size]="size"
            [tabIndex]="-1"
            [textField]="textField"
            [popupSettings]="popupSettings"
            [fillMode]="fillMode"
            [themeColor]="themeColor"
            (buttonClick)="buttonClick.emit($event)"
            (open)="open.emit($event)"
            (close)="close.emit($event)"
            (itemClick)="itemClick.emit($event)"
          ></kendo-splitbutton>
        </ng-template>
        `,
      standalone: true,
      imports: [SplitButtonComponent, NgClass, IconWrapperComponent]
    }]
  }], () => [{
    type: ToolBarComponent
  }], {
    showText: [{
      type: Input
    }],
    showIcon: [{
      type: Input
    }],
    text: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    svgIcon: [{
      type: Input
    }],
    iconClass: [{
      type: Input
    }],
    imageUrl: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    popupSettings: [{
      type: Input
    }],
    fillMode: [{
      type: Input
    }],
    themeColor: [{
      type: Input
    }],
    look: [{
      type: Input
    }],
    buttonClass: [{
      type: Input
    }],
    arrowButtonClass: [{
      type: Input
    }],
    arrowButtonIcon: [{
      type: Input
    }],
    arrowButtonSvgIcon: [{
      type: Input
    }],
    textField: [{
      type: Input
    }],
    data: [{
      type: Input
    }],
    buttonClick: [{
      type: Output
    }],
    itemClick: [{
      type: Output
    }],
    open: [{
      type: Output
    }],
    close: [{
      type: Output
    }],
    toolbarSplitButton: [{
      type: ViewChild,
      args: ["toolbarSplitButton", {
        static: false
      }]
    }],
    sectionSplitButton: [{
      type: ViewChild,
      args: ["sectionSplitButton", {
        static: false
      }]
    }],
    overflowMainButton: [{
      type: ViewChild,
      args: ["overflowMainButton", {
        read: ElementRef
      }]
    }],
    overflowListItems: [{
      type: ViewChildren,
      args: ["listItem"]
    }]
  });
})();
var ToolBarSeparatorComponent = class _ToolBarSeparatorComponent extends ToolBarToolComponent {
  separator;
  constructor() {
    super();
    this.isBuiltInTool = true;
  }
  /**
   * @hidden
   */
  canFocus() {
    return false;
  }
  // If this is not here, the docs display info from its parent(ToolBarToolComponent).
  /**
   * @hidden
   */
  focus() {
  }
  // If this is not here, the docs display info from its parent(ToolBarToolComponent).
  /**
   * @hidden
   */
  handleKey() {
    return false;
  }
  ngAfterViewInit() {
    if (!this.popupTemplate) {
      this.popupTemplate = this.toolbarTemplate;
    }
  }
  static ɵfac = function ToolBarSeparatorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarSeparatorComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarSeparatorComponent,
    selectors: [["kendo-toolbar-separator"]],
    viewQuery: function ToolBarSeparatorComponent_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c28, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.separator = _t.first);
      }
    },
    exportAs: ["kendoToolBarSeparator"],
    features: [ɵɵProvidersFeature([{
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarSeparatorComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 6,
    vars: 0,
    consts: [["toolbarTemplate", ""], ["sectionTemplate", ""], ["popupTemplate", ""], [1, "k-separator", "k-toolbar-separator"], [1, "k-item", "k-menu-item"], [1, "k-separator", "k-separator-horizontal"]],
    template: function ToolBarSeparatorComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomTemplate(0, ToolBarSeparatorComponent_ng_template_0_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor)(2, ToolBarSeparatorComponent_ng_template_2_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, ToolBarSeparatorComponent_ng_template_4_Template, 2, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarSeparatorComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarSeparator",
      providers: [{
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarSeparatorComponent)
      }],
      selector: "kendo-toolbar-separator",
      template: `
        <ng-template #toolbarTemplate>
            <div class="k-separator k-toolbar-separator"></div>
        </ng-template>

        <ng-template #sectionTemplate>
            <div class="k-separator k-toolbar-separator"></div>
        </ng-template>

        <ng-template #popupTemplate>
            <div class="k-item k-menu-item">
                <div class="k-separator k-separator-horizontal"></div>
            </div>
        </ng-template>
    `,
      standalone: true
    }]
  }], () => [], {
    separator: [{
      type: ViewChild,
      args: ["separator", {
        static: false
      }]
    }]
  });
})();
var ToolBarSpacerComponent = class _ToolBarSpacerComponent extends ToolBarToolComponent {
  /**
   * @hidden
   */
  __isSpacer = true;
  constructor() {
    super();
    this.isBuiltInTool = true;
  }
  /**
   * @hidden
   */
  canFocus() {
    return false;
  }
  // If this is not here, the docs display info from its parent(ToolBarToolComponent).
  /**
   * @hidden
   */
  focus() {
  }
  // If this is not here, the docs display info from its parent(ToolBarToolComponent).
  /**
   * @hidden
   */
  handleKey() {
    return false;
  }
  ngAfterViewInit() {
    if (!this.popupTemplate) {
      this.popupTemplate = this.toolbarTemplate;
    }
  }
  static ɵfac = function ToolBarSpacerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarSpacerComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolBarSpacerComponent,
    selectors: [["kendo-toolbar-spacer"]],
    exportAs: ["kendoToolBarSpacer"],
    features: [ɵɵProvidersFeature([{
      provide: ToolBarToolComponent,
      useExisting: forwardRef(() => _ToolBarSpacerComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 2,
    vars: 0,
    consts: [["toolbarTemplate", ""], [1, "k-spacer"]],
    template: function ToolBarSpacerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵdomTemplate(0, ToolBarSpacerComponent_ng_template_0_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarSpacerComponent, [{
    type: Component,
    args: [{
      exportAs: "kendoToolBarSpacer",
      providers: [{
        provide: ToolBarToolComponent,
        useExisting: forwardRef(() => ToolBarSpacerComponent)
      }],
      selector: "kendo-toolbar-spacer",
      template: `
        <ng-template #toolbarTemplate>
            <div class="k-spacer"></div>
        </ng-template>
    `,
      standalone: true
    }]
  }], () => [], null);
})();
var ToolbarCustomMessagesComponent = class _ToolbarCustomMessagesComponent extends ToolbarMessages {
  service;
  constructor(service) {
    super();
    this.service = service;
  }
  get override() {
    return true;
  }
  static ɵfac = function ToolbarCustomMessagesComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolbarCustomMessagesComponent)(ɵɵdirectiveInject(LocalizationService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _ToolbarCustomMessagesComponent,
    selectors: [["kendo-toolbar-messages"]],
    features: [ɵɵProvidersFeature([{
      provide: ToolbarMessages,
      useExisting: forwardRef(() => _ToolbarCustomMessagesComponent)
    }]), ɵɵInheritDefinitionFeature],
    decls: 0,
    vars: 0,
    template: function ToolbarCustomMessagesComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarCustomMessagesComponent, [{
    type: Component,
    args: [{
      providers: [{
        provide: ToolbarMessages,
        useExisting: forwardRef(() => ToolbarCustomMessagesComponent)
      }],
      selector: "kendo-toolbar-messages",
      template: ``,
      standalone: true
    }]
  }], () => [{
    type: LocalizationService
  }], null);
})();
var KENDO_TOOLBAR = [ToolBarComponent, ToolbarCustomMessagesComponent, ToolBarButtonComponent, ToolBarButtonGroupComponent, ToolBarDropDownButtonComponent, ToolBarSeparatorComponent, ToolBarSpacerComponent, ToolBarSplitButtonComponent, ToolBarToolComponent];
var ToolBarModule = class _ToolBarModule {
  static ɵfac = function ToolBarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolBarModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ToolBarModule,
    imports: [ToolBarComponent, ToolbarCustomMessagesComponent, ToolBarButtonComponent, ToolBarButtonGroupComponent, ToolBarDropDownButtonComponent, ToolBarSeparatorComponent, ToolBarSpacerComponent, ToolBarSplitButtonComponent, ToolBarToolComponent],
    exports: [ToolBarComponent, ToolbarCustomMessagesComponent, ToolBarButtonComponent, ToolBarButtonGroupComponent, ToolBarDropDownButtonComponent, ToolBarSeparatorComponent, ToolBarSpacerComponent, ToolBarSplitButtonComponent, ToolBarToolComponent]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [IconsService, PopupService, ResizeBatchService],
    imports: [ToolBarComponent, ToolBarButtonComponent, ToolBarButtonGroupComponent, ToolBarDropDownButtonComponent, ToolBarSplitButtonComponent]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolBarModule, [{
    type: NgModule,
    args: [{
      exports: [...KENDO_TOOLBAR],
      imports: [...KENDO_TOOLBAR],
      providers: [IconsService, PopupService, ResizeBatchService]
    }]
  }], null, null);
})();

export {
  RefreshService,
  ToolBarToolComponent,
  LocalizedToolbarMessagesDirective,
  ToolBarComponent,
  ToolBarButtonComponent,
  ToolBarButtonGroupComponent,
  ToolBarDropDownButtonComponent,
  ToolBarSplitButtonComponent,
  ToolBarSeparatorComponent,
  ToolBarSpacerComponent,
  ToolbarCustomMessagesComponent,
  KENDO_TOOLBAR,
  ToolBarModule
};
//# sourceMappingURL=chunk-F4UQNVEZ.js.map
