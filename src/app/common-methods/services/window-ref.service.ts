import { Injectable,Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

function _window() : any {
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {

  get nativeWindow() : any {
    if (isPlatformBrowser(this.platformId)) {
      return _window();
    }
 }
  constructor(@Inject(PLATFORM_ID) 
  private platformId: object) { }
}
