import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  constructor() { }
  regexStr = '^[0-9]*$';
  pattern = /[- +()0-9]+/;
  ssnpattern = /[0-9]+/;
  patterns = /[+()0-9]+/;
  patternSpecial = /[-/ .a-zA-Z0-9]+/;
  patternSpe = /[-_a-zA-Z]+/;
  @Input() patternCheck: boolean;
  @Input() patternText: boolean;
  @Input() NumberOnlyWithDot: boolean;
  @Input() NumberOnly: boolean;
  @Input() NumericValue: boolean;
  @Input() SsnValue: boolean;
  @Input() PhoneNumber: boolean;
  @Input() NumberOnlyWithslash: boolean;
  @Input() NumberOnlyWithDotandComma: boolean;
  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    if (this.NumberOnlyWithDot === false) {
      const e = event as KeyboardEvent;
      if ([110, 190].indexOf(e.keyCode) > -1) {
        if (event.srcElement.value.indexOf('.') > -1) {
          e.preventDefault();
        }
      }

      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }

    if (this.NumberOnlyWithDotandComma === false) {
      const e = event as KeyboardEvent;
      if ([110, 190, 188].indexOf(e.keyCode) > -1) {
        if (event.srcElement.value.indexOf('.') > -1) {
          e.preventDefault();
        }
      }

      if ([46, 8, 9, 27, 13, 110, 190, 188].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }

    if (this.NumberOnly === false) {
      const e = event as KeyboardEvent;
      if ([110].indexOf(e.keyCode) > -1) {
        if (event.srcElement.value.indexOf('.') > -1) {
          e.preventDefault();
        }
      }

      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }

    if (this.NumberOnlyWithslash === false) {
      const e = event as KeyboardEvent;
      if ([110, 191].indexOf(e.keyCode) > -1) {
        if (event.srcElement.value.indexOf('.') > -1) {
          e.preventDefault();
        }
      }

      if ([46, 8, 9, 27, 13, 110, 191].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }
  @HostListener('keypress', ['$event']) onkeypress(event: any) {
    if (this.NumericValue === false) {
      const inputChar = String.fromCharCode(event.charCode);
      if (!this.pattern.test(inputChar)) {
        event.preventDefault();
      }
    } if (this.SsnValue === false) {
      const inputChar = String.fromCharCode(event.charCode);
      if (!this.ssnpattern.test(inputChar)) {
        event.preventDefault();
      }
    }
    if (this.PhoneNumber === false) {
      const inputChar = String.fromCharCode(event.charCode);
      if (!this.patterns.test(inputChar)) {
        event.preventDefault();
      }
    }
    if (this.patternText === false) {
      const inputChar = String.fromCharCode(event.charCode);
      if (!this.patternSpe.test(inputChar)) {
        event.preventDefault();
      }
    }
    if (this.patternCheck === false) {
      const inputChar = String.fromCharCode(event.charCode);
      if (!this.patternSpecial.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
}

@Directive({
  standalone: false,
  // tslint:disable-next-line:directive-selector
  selector: '[preventCutCopyPaste]'
})
export class CopyDirective {
  constructor() { }

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
}

@Directive({
  standalone: false,
  // tslint:disable-next-line:directive-selector
  selector: '[preventDragdrop]'
})

export class DragdropDirective {
  constructor() { }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
  }
}

