import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabPreventionService {
  public readonly localStorageKey = 'tabOpen';

  constructor() {
    this.handleMultipleTabs();
  }

  isFirstTab(): boolean {
    if (typeof localStorage === 'undefined') {
      console.error('LocalStorage is not supported in this browser. The application may not work as expected.');
      return false;
    }
    if (localStorage.getItem(this.localStorageKey)) {
      // alert('This application is already open in another tab. Closing this tab.');
      alert('Security Alerts. You cannot open this site in multiple tabs. This window will now close.');
      //localStorage.removeItem(this.localStorageKey);
      //window.open('about:blank', '_self');
      window.location.href = 'about:blank';
      return false;
    } else {
      localStorage.setItem(this.localStorageKey, 'true');
      //window.addEventListener('beforeunload', () => {
      //  localStorage.removeItem(this.localStorageKey);
      //});
      return true;
    }
    // window.addEventListener('beforeunload', () => {
    //   // Set the 'tabopen' flag to false when the window is closed
    //   localStorage.removeItem(this.localStorageKey);
    // });
    //return false;
  }

  handleMultipleTabs(): void {
    if (typeof sessionStorage === 'undefined') {
      console.error('SessionStorage is not supported in this browser. The application may not work as expected.');
      return;
    }
    if (sessionStorage.getItem(this.localStorageKey)) {
      // alert('This application is already open in another tab. Closing this tab.');
      alert('Security Alerts. You cannot open this site in multiple tabs. This window will now close.');
      //window.close();
      window.location.href = 'about:blank';
    } else {
      sessionStorage.setItem(this.localStorageKey, 'true');

      // window.addEventListener('beforeunload', () => {
      //   sessionStorage.removeItem(this.localStorageKey);
      // });
    }
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem(this.localStorageKey);
      sessionStorage.removeItem(this.localStorageKey);
    });
  }
}
