import {
  drawDOM,
  exportPDF
} from "./chunk-2MHMQMIE.js";
import {
  saveAs
} from "./chunk-IMQRU5YV.js";
import {
  A
} from "./chunk-T2SKS23Q.js";
import {
  Component,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  NgModule,
  Optional,
  TemplateRef,
  setClassMetadata,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵqueryRefresh
} from "./chunk-EAUF2VNQ.js";

// node_modules/@progress/kendo-angular-pdf-export/fesm2022/progress-kendo-angular-pdf-export.mjs
var _c0 = ["*"];
var packageMetadata = {
  name: "@progress/kendo-angular-pdf-export",
  productName: "Kendo UI for Angular",
  productCode: "KENDOUIANGULAR",
  productCodes: ["KENDOUIANGULAR"],
  publishDate: 1780593769,
  version: "24.1.0",
  licensingDocsUrl: "https://www.telerik.com/kendo-angular-ui/my-license/"
};
var PDFExportTemplateDirective = class _PDFExportTemplateDirective {
  templateRef;
  constructor(templateRef) {
    this.templateRef = templateRef;
  }
  static ɵfac = function PDFExportTemplateDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PDFExportTemplateDirective)(ɵɵdirectiveInject(TemplateRef, 8));
  };
  static ɵdir = ɵɵdefineDirective({
    type: _PDFExportTemplateDirective,
    selectors: [["", "kendoPDFTemplate", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PDFExportTemplateDirective, [{
    type: Directive,
    args: [{
      selector: "[kendoPDFTemplate]",
      standalone: true
    }]
  }], () => [{
    type: TemplateRef,
    decorators: [{
      type: Optional
    }]
  }], null);
})();
var FIELDS = ["bottom", "left", "right", "top"];
var PDFExportMarginComponent = class _PDFExportMarginComponent {
  /**
   * Sets the left margin of the PDF page. Accepts a `number` or `string` value.
   *
   * The supported units are `"mm"`, `"cm"`, `"in"`, and `"pt"`. Numbers use points (`"pt"`).
   * @default "pt"
   */
  left;
  /**
   * Sets the top margin of the PDF page. Accepts a `number` or `string` value.
   *
   * The supported units are `"mm"`, `"cm"`, `"in"`, and `"pt"`. Numbers use points (`"pt"`).
   * @default "pt"
   */
  top;
  /**
   * Sets the right margin of the PDF page. Accepts a `number` or `string` value.
   *
   * The supported units are `"mm"`, `"cm"`, `"in"`, and `"pt"`. Numbers use points (`"pt"`).
   * @default "pt"
   */
  right;
  /**
   * Sets the bottom margin of the PDF page. Accepts a `number` or `string` value.
   *
   * The supported units are `"mm"`, `"cm"`, `"in"`, and `"pt"`. Numbers use points (`"pt"`).
   * @default "pt"
   */
  bottom;
  /**
   * @hidden
   */
  get options() {
    const options = {};
    for (let idx = 0; idx < FIELDS.length; idx++) {
      const field = FIELDS[idx];
      const value = this[field];
      if (typeof value !== "undefined") {
        options[field] = value;
      }
    }
    return options;
  }
  static ɵfac = function PDFExportMarginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PDFExportMarginComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _PDFExportMarginComponent,
    selectors: [["kendo-pdf-export-margin"]],
    inputs: {
      left: "left",
      top: "top",
      right: "right",
      bottom: "bottom"
    },
    decls: 0,
    vars: 0,
    template: function PDFExportMarginComponent_Template(rf, ctx) {
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PDFExportMarginComponent, [{
    type: Component,
    args: [{
      selector: "kendo-pdf-export-margin",
      template: ``,
      standalone: true
    }]
  }], null, {
    left: [{
      type: Input
    }],
    top: [{
      type: Input
    }],
    right: [{
      type: Input
    }],
    bottom: [{
      type: Input
    }]
  });
})();
var compileTemplate = (templateRef) => {
  const context = {};
  let embeddedView = templateRef.createEmbeddedView(context);
  const result = (data) => {
    Object.assign(context, data);
    embeddedView.detectChanges();
    const templateWrap = document.createElement("span");
    embeddedView.rootNodes.forEach((rootNode) => {
      templateWrap.appendChild(rootNode.cloneNode(true));
    });
    return templateWrap;
  };
  result.destroy = () => {
    embeddedView.destroy();
    embeddedView = null;
  };
  return result;
};
var PDFExportComponent = class _PDFExportComponent {
  element;
  /**
   * If `true`, opens the Print dialog immediately after the PDF loads ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/auto-print)).
   * Requires `@progress/kendo-drawing` v1.9.0 or later.
   * @default false
   */
  autoPrint;
  /**
   * Sets the author metadata for the PDF document.
   */
  author;
  /**
   * Specifies whether actual hyperlinks will be produced in the exported PDF file ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/disabling-hyperlinks)). You can also set a CSS selector to ignore matching links.
   */
  avoidLinks;
  /**
   * Sets a CSS selector for elements that cause page breaks
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/multi-page-content#manual-page-breaking)).
   */
  forcePageBreak;
  /**
   * Sets a CSS selector for elements that should not split across pages
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/multi-page-content#preventing-page-breaking-in-elements)).
   */
  keepTogether;
  /**
   * Sets the creator metadata for the PDF document.
   * @default "Kendo UI PDF Generator"
   */
  creator = "Kendo UI PDF Generator";
  /**
   * Sets the creation date for the PDF document. Defaults to `new Date()`.
   * @default new Date()
   */
  date;
  /**
   * Sets the image resolution in the exported PDF ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/embedded-images)). By default, images use full resolution.
   */
  imageResolution;
  /**
   * Sets the name of the exported PDF file.
   * @default "export.pdf"
   */
  fileName = "export.pdf";
  /**
   * If `true`, forwards content to `proxyURL` even if the browser supports local file saving.
   */
  forceProxy;
  /**
   * Sets the keywords metadata for the PDF document.
   */
  keywords;
  /**
   * If `true`, sets the page orientation to landscape. The default page orientation is portrait.
   * @default false
   */
  landscape;
  /**
   * Sets the page margins. Numbers use points (`"pt"`).
   */
  margin;
  /**
   * Sets the paper size for the PDF document. Defaults to `"auto"`, which means the content determines the size of the document.
   * The size of the content in pixels matches the size of the output in points (1 pixel = 1/72 inch).
   *
   * If set, the content splits across pages, and allows you to use `repeatHeaders`, `scale`, and a template.
   *
   * The value can be a `PaperSize`, an array of two numbers (width and height in points), or an array of two strings (width and height in units: `"mm"`, `"cm"`, `"in"`, or `"pt"`).
   * @default "auto"
   */
  paperSize;
  /**
   * If `true`, repeats the `<thead>` elements of tables on each page. This helps keep table headers visible on every page
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/repeated-table-headers)).
   */
  repeatHeaders;
  /**
   * Sets a scale factor for the PDF output. Use this to make the PDF content smaller or larger
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/pdf-export/scaling-of-content)).
   *
   * @default 1
   */
  scale;
  /**
   * Sets a key/value dictionary of form values sent to the proxy. Use this to send extra data, like Anti-Forgery tokens.
   */
  proxyData;
  /**
   * Sets the server-side proxy URL for streaming the file to the user. You need to implement a proxy if
   * the browser is not capable of saving files locally.
   * The proxy returns the decoded file with the `"Content-Disposition"` header set to `attachment; filename="<fileName.pdf>"`.
   *
   * In the request body, the proxy receives a POST request with the specific parameters
   * ([see example](https://www.telerik.com/kendo-angular-ui/components/file-saver/server-proxy#implementations)).
   */
  proxyURL;
  /**
   * Sets where to display the document returned from the proxy. Use `"_self"` to display in the same window.
   * To display the document in a new window or iframe,
   * the proxy must have the `"Content-Disposition"` header set to `inline; filename="<fileName.pdf>"`.
   * @default "_self"
   */
  proxyTarget;
  /**
   * Sets the producer metadata for the PDF document.
   */
  producer;
  /**
   * Sets the subject metadata for the PDF document.
   */
  subject;
  /**
   * Sets the title metadata for the PDF document.
   */
  title;
  /**
   * @hidden
   */
  pageTemplateDirective;
  /**
   * @hidden
   */
  marginComponent;
  get drawMargin() {
    const marginComponent = this.marginComponent;
    let margin = this.margin;
    if (marginComponent) {
      margin = Object.assign(margin || {}, marginComponent.options);
    }
    return margin;
  }
  pageTemplate;
  constructor(element) {
    this.element = element;
    A(packageMetadata);
  }
  /**
   * Saves the content as a PDF file with the specified name.
   * @param fileName - The name of the exported file.
   */
  saveAs(fileName = this.fileName) {
    this.save(this.element.nativeElement, fileName);
  }
  /**
   * Exports the content as a `Group` for further processing.
   *
   * @return The root group of the exported scene.
   */
  export() {
    return this.exportElement(this.element.nativeElement);
  }
  save(element, fileName) {
    this.exportElement(element).then((group) => this.exportGroup(group, this.pdfOptions())).then((dataUri) => this.saveDataUri(dataUri, fileName, this.saveOptions()));
  }
  exportElement(element) {
    const promise = this.drawElement(element, this.drawOptions());
    const cleanup = this.cleanup.bind(this);
    promise.then(cleanup, cleanup);
    return promise;
  }
  cleanup() {
    if (this.pageTemplate) {
      this.pageTemplate.destroy();
      delete this.pageTemplate;
    }
  }
  drawOptions() {
    if (this.pageTemplateDirective) {
      this.pageTemplate = compileTemplate(this.pageTemplateDirective.templateRef);
    }
    return {
      avoidLinks: this.avoidLinks,
      forcePageBreak: this.forcePageBreak,
      keepTogether: this.keepTogether,
      margin: this.drawMargin,
      paperSize: this.paperSize,
      landscape: this.landscape,
      repeatHeaders: this.repeatHeaders,
      scale: this.scale,
      template: this.pageTemplate
    };
  }
  pdfOptions() {
    return {
      autoPrint: this.autoPrint,
      author: this.author,
      creator: this.creator,
      date: this.date,
      imgDPI: this.imageResolution,
      keywords: this.keywords,
      landscape: this.landscape,
      margin: this.drawMargin,
      multiPage: true,
      paperSize: this.paperSize,
      producer: this.producer,
      subject: this.subject,
      title: this.title
    };
  }
  saveOptions() {
    return {
      forceProxy: this.forceProxy,
      proxyData: this.proxyData,
      proxyTarget: this.proxyTarget,
      proxyURL: this.proxyURL
    };
  }
  drawElement(element, options) {
    return drawDOM(element, options);
  }
  exportGroup(group, options) {
    return exportPDF(group, options);
  }
  saveDataUri(dataUri, fileName, options) {
    saveAs(dataUri, fileName, options);
  }
  static ɵfac = function PDFExportComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PDFExportComponent)(ɵɵdirectiveInject(ElementRef));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _PDFExportComponent,
    selectors: [["kendo-pdf-export"]],
    contentQueries: function PDFExportComponent_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, PDFExportTemplateDirective, 5)(dirIndex, PDFExportMarginComponent, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.pageTemplateDirective = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.marginComponent = _t.first);
      }
    },
    inputs: {
      autoPrint: "autoPrint",
      author: "author",
      avoidLinks: "avoidLinks",
      forcePageBreak: "forcePageBreak",
      keepTogether: "keepTogether",
      creator: "creator",
      date: "date",
      imageResolution: "imageResolution",
      fileName: "fileName",
      forceProxy: "forceProxy",
      keywords: "keywords",
      landscape: "landscape",
      margin: "margin",
      paperSize: "paperSize",
      repeatHeaders: "repeatHeaders",
      scale: "scale",
      proxyData: "proxyData",
      proxyURL: "proxyURL",
      proxyTarget: "proxyTarget",
      producer: "producer",
      subject: "subject",
      title: "title"
    },
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    template: function PDFExportComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomElementStart(0, "div");
        ɵɵprojection(1);
        ɵɵdomElementEnd();
      }
    },
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PDFExportComponent, [{
    type: Component,
    args: [{
      selector: "kendo-pdf-export",
      template: `<div><ng-content></ng-content></div>`,
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }], {
    autoPrint: [{
      type: Input
    }],
    author: [{
      type: Input
    }],
    avoidLinks: [{
      type: Input
    }],
    forcePageBreak: [{
      type: Input
    }],
    keepTogether: [{
      type: Input
    }],
    creator: [{
      type: Input
    }],
    date: [{
      type: Input
    }],
    imageResolution: [{
      type: Input
    }],
    fileName: [{
      type: Input
    }],
    forceProxy: [{
      type: Input
    }],
    keywords: [{
      type: Input
    }],
    landscape: [{
      type: Input
    }],
    margin: [{
      type: Input
    }],
    paperSize: [{
      type: Input
    }],
    repeatHeaders: [{
      type: Input
    }],
    scale: [{
      type: Input
    }],
    proxyData: [{
      type: Input
    }],
    proxyURL: [{
      type: Input
    }],
    proxyTarget: [{
      type: Input
    }],
    producer: [{
      type: Input
    }],
    subject: [{
      type: Input
    }],
    title: [{
      type: Input
    }],
    pageTemplateDirective: [{
      type: ContentChild,
      args: [PDFExportTemplateDirective, {
        static: false
      }]
    }],
    marginComponent: [{
      type: ContentChild,
      args: [PDFExportMarginComponent, {
        static: false
      }]
    }]
  });
})();
var KENDO_PDFEXPORT = [PDFExportComponent, PDFExportMarginComponent, PDFExportTemplateDirective];
var PDFExportModule = class _PDFExportModule {
  static ɵfac = function PDFExportModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PDFExportModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PDFExportModule,
    imports: [PDFExportComponent, PDFExportMarginComponent, PDFExportTemplateDirective],
    exports: [PDFExportComponent, PDFExportMarginComponent, PDFExportTemplateDirective]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PDFExportModule, [{
    type: NgModule,
    args: [{
      imports: [...KENDO_PDFEXPORT],
      exports: [...KENDO_PDFEXPORT]
    }]
  }], null, null);
})();

export {
  PDFExportTemplateDirective,
  PDFExportMarginComponent,
  compileTemplate,
  PDFExportComponent,
  KENDO_PDFEXPORT,
  PDFExportModule
};
//# sourceMappingURL=chunk-WBQAAZD6.js.map
