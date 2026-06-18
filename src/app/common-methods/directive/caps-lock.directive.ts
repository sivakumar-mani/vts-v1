import { Directive, HostListener, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  standalone: false,
  selector: '[appCapsLock]'
})
export class CapsLockDirective {

  constructor() { }
  // tslint:disable-next-line:ban-types
  @Output('appCapsLock') capsLock = new EventEmitter<Boolean>();

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.capsLock.emit(event.getModifierState && event.getModifierState('CapsLock'));
  }
}
