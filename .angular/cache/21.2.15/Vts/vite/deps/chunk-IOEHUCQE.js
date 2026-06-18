import {
  dateFieldName,
  dateFormatNames,
  firstDay,
  format,
  formatDate,
  formatNumber,
  load,
  localeInfo,
  numberSymbols,
  parseDate,
  parseNumber,
  setData,
  splitDateFormat,
  toString,
  weekendRange
} from "./chunk-CG4SUFHJ.js";
import {
  A
} from "./chunk-T2SKS23Q.js";
import {
  EventEmitter,
  Inject,
  Injectable,
  LOCALE_ID,
  NgModule,
  Pipe,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵinject
} from "./chunk-EAUF2VNQ.js";

// node_modules/@progress/kendo-angular-intl/fesm2022/progress-kendo-angular-intl.mjs
var packageMetadata = {
  name: "@progress/kendo-angular-intl",
  productName: "Kendo UI for Angular",
  productCode: "KENDOUIANGULAR",
  productCodes: ["KENDOUIANGULAR"],
  publishDate: 1780593673,
  version: "24.1.0",
  licensingDocsUrl: "https://www.telerik.com/kendo-angular-ui/my-license/"
};
var DOCS_URL = "https://www.telerik.com/kendo-angular-ui/components/internationalization/troubleshooting";
var errorSolutions = {
  "NoCurrency": `Solution: ${DOCS_URL}#no-currency`,
  "NoCurrencyDisplay": `Solution: ${DOCS_URL}#no-currency-display`,
  "NoCurrencyRegion": `Solution: ${DOCS_URL}#no-currency-region`,
  "NoDateFieldNames": `Solution: ${DOCS_URL}#no-date-filed-names`,
  "NoFirstDay": `Solution: ${DOCS_URL}#no-first-day`,
  "NoGMTInfo": `Solution: ${DOCS_URL}#no-gmt-info`,
  "NoLocale": `Solution: ${DOCS_URL}#no-locale`,
  "NoValidCurrency": `Solution: ${DOCS_URL}#no-valid-currency`,
  "NoWeekData": `Solution: ${DOCS_URL}#no-week-data`
};
function formatMessage(error) {
  const message = error.message;
  const errorSolution = errorSolutions[Object.keys(errorSolutions).filter((key) => message.indexOf(key) === 0)[0]];
  return errorSolution ? `${message} ${errorSolution}` : message;
}
function intlMethod(fn) {
  return function(...values) {
    try {
      return fn(...values);
    } catch (error) {
      error.message = formatMessage(error);
      throw error;
    }
  };
}
var dateFormatNames2 = intlMethod(dateFormatNames);
var dateFieldName2 = intlMethod(dateFieldName);
var firstDay2 = intlMethod(firstDay);
var format2 = intlMethod(format);
var formatDate2 = intlMethod(formatDate);
var formatNumber2 = intlMethod(formatNumber);
var load2 = intlMethod(load);
var numberSymbols2 = intlMethod(numberSymbols);
var parseDate2 = intlMethod(parseDate);
var parseNumber2 = intlMethod(parseNumber);
var splitDateFormat2 = intlMethod(splitDateFormat);
var toString2 = intlMethod(toString);
var weekendRange2 = intlMethod(weekendRange);
var setData2 = (data) => setData(data);
var localeData = (locale) => {
  try {
    return localeInfo(locale);
  } catch (error) {
    error.message = formatMessage(error);
    throw error;
  }
};
var LOCALE_REGEX = /_/g;
function cldrServiceFactory(localeId) {
  return new CldrIntlService(localeId);
}
var IntlService = class _IntlService {
  /**
   * @hidden
   */
  changes = new EventEmitter();
  /**
   * @hidden
   */
  constructor() {
    A(packageMetadata);
  }
  /**
   * Specifies that the service was changed.
   */
  notify() {
    this.changes.emit();
  }
  static ɵfac = function IntlService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IntlService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _IntlService,
    factory: function IntlService_Factory(__ngFactoryType__) {
      let __ngConditionalFactory__ = null;
      if (__ngFactoryType__) {
        __ngConditionalFactory__ = new __ngFactoryType__();
      } else {
        __ngConditionalFactory__ = cldrServiceFactory(ɵɵinject(LOCALE_ID));
      }
      return __ngConditionalFactory__;
    },
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IntlService, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: cldrServiceFactory,
      deps: [LOCALE_ID]
    }]
  }], () => [], null);
})();
var CldrIntlService = class _CldrIntlService extends IntlService {
  locale;
  /**
   * Specifies or gets the current locale ID.
   */
  get localeId() {
    return this.locale;
  }
  set localeId(value) {
    const locale = value.replace(LOCALE_REGEX, "-");
    if (locale !== this.locale) {
      this.locale = locale;
      this.notify();
    }
  }
  /**
   * Creates a new instance of the service with the ID of the specified locale.
   *
   * Note that the parts of the locale ID can be separated by either `_` (underscore)
   * or `-` (dash).
   *
   * @param localeId - The default locale ID.
   */
  constructor(localeId) {
    super();
    this.localeId = localeId;
  }
  /**
   * Formats a string with placeholders such as
   * `Total amount {0:c}`.
   *
   * @param format - The format string.
   * @param values - One or more values to output in the format string placeholders.
   * @returns The formatted string.
   */
  format(format$1, ...values) {
    return format2(format$1, values, this.localeId);
  }
  /**
   * Converts an object into a string based on the specified format.
   *
   * @param value - The value to format.
   * @param format - The format to use.
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The formatted object as a string.
   */
  toString(value, format3, localeId) {
    return toString2(value, format3, localeId || this.localeId);
  }
  /**
   * Converts a `Date` object into a string based on the specified format.
   * If no format is provided, the default short date format is used.
   *
   * @param value - The date to format.
   * @param format - The format string or options (optional).
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The formatted date as a string.
   */
  formatDate(value, format3, localeId) {
    return formatDate2(value, format3, localeId || this.localeId);
  }
  /**
   * Converts a string into a `Date` object based on the specified format.
   *
   * @param value - The string to convert.
   * @param format - The format strings or options (optional).
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The parsed date.
   */
  parseDate(value, format3, localeId) {
    return parseDate2(value, format3, localeId || this.localeId);
  }
  /**
   * Converts a string into a `Number`.
   *
   * @param value - The string to convert.
   * @param format - The format string or options (optional).
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The parsed number.
   */
  parseNumber(value, format3, localeId) {
    return parseNumber2(value, localeId || this.localeId, format3);
  }
  /**
   * Converts a `Number` into a string based on the specified format.
   *
   * @param value - The number to format.
   * @param format - The format string or options.
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The formatted number as a string.
   */
  formatNumber(value, format3, localeId) {
    return formatNumber2(value, format3, localeId || this.localeId);
  }
  /**
   * Returns the date names from the current locale based on the option.
   *
   * The available `type` values are:
   * - `era`
   * - `year`
   * - `quarter`
   * - `month`
   * - `week`
   * - `day`
   * - `dayperiod`
   * - `hour`
   * - `minute`
   * - `second`
   * - `zone`
   *
   * The available `nameType` values are:
   * - `wide`
   * - `narrow`
   * - `short`
   *
   * @param options - Detailed configuration for the desired date field name.
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The day names from the current locale based on the option.
   *
   * @example
   * ```ts
   * dateFieldName({ type: 'day' });                      //returns 'day';
   * dateFieldName({ type: 'day', nameType: 'wide' });    //returns 'day';
   * dateFieldName({ type: 'month', nameType: 'short' }); //returns 'mo.';
   * dateFieldName({ type: 'month', nameType: 'wide' });  //returns 'month';
   * ```
   */
  dateFieldName(options, localeId) {
    return dateFieldName2(options, localeId || this.localeId);
  }
  /**
   * Returns a localized date field name based on specific `dateFieldName` options.
   *
   * The available type values are:
   * - `day`
   * - `dayperiod`
   * - `months`
   * - `quarters`
   * - `eras`
   *
   * @param options - Detailed configuration for the desired date format.
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The day names from the current locale based on the option.
   */
  dateFormatNames(options, localeId) {
    return dateFormatNames2(localeId || this.localeId, options);
  }
  /**
   * Splits the date format into objects containing information about each part of the pattern.
   *
   * @param format - The format string or options.
   * @param localeId - The locale ID to use (optional). If not specified, the `"en"` locale ID is used.
   * @returns The date format parts.
   */
  splitDateFormat(format3, localeId) {
    return splitDateFormat2(format3, localeId || this.localeId);
  }
  /**
   * Returns the number symbols from the current locale based on the option.
   *
   * @param localeId - The locale ID to use in place of the default one (optional).
   * @returns The number symbols from the current locale.
   */
  numberSymbols(localeId) {
    return numberSymbols2(localeId || this.localeId);
  }
  /**
   * Returns the first day index starting from Sunday.
   *
   * @param localeId - The locale ID (optional). Defaults to the current locale ID.
   * @returns The index of the first day of the week (0 == Sunday).
   */
  firstDay(localeId) {
    return firstDay2(localeId || this.localeId);
  }
  /**
   * Returns the start and end index of the locale weekend starting from Sunday.
   *
   * @param localeId - The locale ID (optional). Defaults to the current locale ID.
   * @returns The start and end index of the locale weekend (0 == Sunday).
   */
  weekendRange(localeId) {
    return weekendRange2(localeId || this.localeId);
  }
  static ɵfac = function CldrIntlService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CldrIntlService)(ɵɵinject(LOCALE_ID));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _CldrIntlService,
    factory: _CldrIntlService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CldrIntlService, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [LOCALE_ID]
    }]
  }], null);
})();
var isNumeric = (value) => !isNaN(value - parseFloat(value));
var DatePipe = class _DatePipe {
  intlService;
  /**
   * @hidden
   */
  constructor(intlService) {
    this.intlService = intlService;
  }
  /**
   * Converts a `Date` object into a string based on the specified format.
   * If no format is provided, the default short date format is used.
   *
   * @param value - The date to format.
   * @param format - The format string or options (optional).
   * @param localeId - The ID of the locale which will be used instead of the default one (optional).
   * @returns The formatted date as a string.
   */
  transform(value, format3 = "", localeId) {
    value = this.normalize(value);
    if (value) {
      return this.intlService.formatDate(value, format3, localeId);
    }
    return value;
  }
  normalize(value) {
    if (value && typeof value === "string") {
      value = this.intlService.parseDate(value);
    } else if (value && isNumeric(value)) {
      value = new Date(parseFloat(value));
    }
    return value;
  }
  static ɵfac = function DatePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DatePipe)(ɵɵdirectiveInject(IntlService, 16));
  };
  static ɵpipe = ɵɵdefinePipe({
    name: "kendoDate",
    type: _DatePipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DatePipe, [{
    type: Pipe,
    args: [{
      name: "kendoDate",
      standalone: true
    }]
  }], () => [{
    type: IntlService
  }], null);
})();
var NumberPipe = class _NumberPipe {
  intlService;
  /**
   * @hidden
   */
  constructor(intlService) {
    this.intlService = intlService;
  }
  /**
   * Converts a `Number` object into a string based on the specified format.
   * If no format is provided, the value is formatted as decimal number using the
   * [`"n"`](https://github.com/telerik/kendo-intl/blob/master/docs/num-formatting/index.md#standard) format.
   *
   * @param value - The number that will be formatted.
   * @param format - The format string or options (optional).
   * @param localeId - The locale ID that will be used in place of the default one (optional).
   * @returns The formatted number as a string.
   */
  transform(value, format3, localeId) {
    if (typeof value === "string") {
      value = this.intlService.parseNumber(value);
    }
    if (value !== null && value !== void 0) {
      return this.intlService.formatNumber(value, format3, localeId);
    }
    return value;
  }
  static ɵfac = function NumberPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NumberPipe)(ɵɵdirectiveInject(IntlService, 16));
  };
  static ɵpipe = ɵɵdefinePipe({
    name: "kendoNumber",
    type: _NumberPipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NumberPipe, [{
    type: Pipe,
    args: [{
      name: "kendoNumber",
      standalone: true
    }]
  }], () => [{
    type: IntlService
  }], null);
})();
var KENDO_NUMBER = [NumberPipe];
var KENDO_DATE = [DatePipe];
var KENDO_INTL = [...KENDO_NUMBER, ...KENDO_DATE];
var IntlModule = class _IntlModule {
  static ɵfac = function IntlModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _IntlModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _IntlModule,
    imports: [NumberPipe, DatePipe],
    exports: [NumberPipe, DatePipe]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IntlModule, [{
    type: NgModule,
    args: [{
      imports: [...KENDO_INTL],
      exports: [...KENDO_INTL]
    }]
  }], null, null);
})();

export {
  dateFormatNames2 as dateFormatNames,
  dateFieldName2 as dateFieldName,
  firstDay2 as firstDay,
  format2 as format,
  formatDate2 as formatDate,
  formatNumber2 as formatNumber,
  load2 as load,
  numberSymbols2 as numberSymbols,
  parseDate2 as parseDate,
  parseNumber2 as parseNumber,
  splitDateFormat2 as splitDateFormat,
  toString2 as toString,
  weekendRange2 as weekendRange,
  setData2 as setData,
  localeData,
  cldrServiceFactory,
  IntlService,
  CldrIntlService,
  DatePipe,
  NumberPipe,
  KENDO_NUMBER,
  KENDO_DATE,
  KENDO_INTL,
  IntlModule
};
//# sourceMappingURL=chunk-IOEHUCQE.js.map
