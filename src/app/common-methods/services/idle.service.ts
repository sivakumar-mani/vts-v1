import { Injectable, NgZone } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { fromEvent, merge } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IdleService {
  private expired$ = new Subject<boolean>();
  private timerSub?: Subscription;
  private idleSub?: Subscription;
  private timeoutMs = 0;

  constructor(private zone: NgZone) {}

  startWatching(timeoutSeconds: number) {
    this.timeoutMs = timeoutSeconds * 1000;
    const activity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'touchmove'),
      fromEvent(window, 'resize')
    );
    this.idleSub = activity$.subscribe(() => this.resetTimer());
    this.startTimer();
    return this.expired$.asObservable();
  }

  private startTimer() {
    this.zone.runOutsideAngular(() => {
      this.timerSub = timer(this.timeoutMs).subscribe(() => {
        this.zone.run(() => this.expired$.next(true));
      });
    });
  }

  resetTimer() {
    this.timerSub?.unsubscribe();
    this.startTimer();
  }

  stopTimer() {
    this.timerSub?.unsubscribe();
    this.idleSub?.unsubscribe();
  }
}
