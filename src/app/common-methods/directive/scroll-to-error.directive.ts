import { Directive,HostListener } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appScrollToError]',
  // host: { '(submit)': 'scrollToError($event)', '(reset)': 'onReset()' },
})
export class ScrollToErrorDirective {
  constructor() { }
   @HostListener('submit', ['$event'])
  scrollToError(event?: Event): any {
    let errorEle: any;
    let errorFormEle: any;
    let i = 0;
    errorEle = document.querySelector('.mat-error');
    if (errorEle && errorEle.className.includes('mat-error')) {
      const el = document.querySelector('[aria-describedby=' + errorEle.id + ']') as HTMLElement;
      if (el && el !== null) {
        setTimeout(() => {
          el.focus();
        }, 600);
        return el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      errorFormEle = (document.children[0].querySelector('form')).querySelector('.ng-invalid');
      if (errorFormEle && errorFormEle.length) {
        for (i; i < errorFormEle.length; i++) {
          if (errorFormEle[i].className.includes('ng-invalid')) {
            const el = errorFormEle[i] as HTMLElement;
            setTimeout(() => {
              el.focus();
            }, 600);
            return el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

      } else {
        if (errorFormEle && errorFormEle.className.includes('ng-invalid')) {
          const el = errorFormEle as HTMLElement;
          setTimeout(() => {
            el.focus();
          }, 600);
          return el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          return true;
        }
      }
    }
  }
}
