import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  standalone: false,
  selector: 'app-counter',
  template: `<span #animatedDigit class="count">
                  {{digit}}
                </span>`,
  styles: [`.count{
	font-size: 15px;
    min-width: 50px;
    color: #58595c;
    font-weight: 800;
}
`]
})
export class CounterComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() duration = 1000;
  @Input() digit: number;
  @Input() steps = 500;
  // @ViewChild('animatedDigit', { static: true }) animatedDigit: ElementRef;
  @ViewChild('animatedDigit') animatedDigit!: ElementRef;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.digit) {
      this.animateCount();
    }
  }
  ngAfterViewInit() {
    if (this.digit) {
      this.animateCount();
    }
  }
  animateCount() {
    if (typeof this.digit === 'number') {
      this.counterFunc(this.digit, this.duration, this.animatedDigit);
    }
  }

  counterFunc(endValue, durationMs, element) {
    const stepCount = Math.abs(durationMs / this.steps);
    const valueIncrement = (endValue - 0) / stepCount;
    const sinValueIncrement = Math.PI / stepCount;

    let currentValue = 0;
    let currentSinValue = 0;

    function step() {
      currentSinValue += sinValueIncrement;
      currentValue += valueIncrement * Math.sin(currentSinValue) ** 2 * 2;

      element.nativeElement.textContent = Math.abs(Math.floor(currentValue));

      if (currentSinValue < Math.PI) {
        window.requestAnimationFrame(step);
      }
    }

    step();
  }
}
