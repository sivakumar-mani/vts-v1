import { Component, OnInit, Input, AfterViewInit, 
         OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() verificationForm: UntypedFormGroup;
  name = '';

  // FIX: track subscription for cleanup
  private nameSub: Subscription;

  constructor(
    public verification: VerificationService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // FIX: subscribe here, not in constructor — component is initialized
    // FIX: store subscription reference for cleanup
    this.nameSub = this.sharedService.changesName.subscribe(res => {
      if (res?.name) {
        this.name = res.name;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // FIX: react when verificationForm @Input arrives from parent
    if (changes['verificationForm']?.currentValue) {
      this.loadName();
    }
  }

  ngAfterViewInit() {
    // FIX: loadName() instead of inline unsafe chain
    this.loadName();
  }

  loadName() {
    // FIX: only proceed if name not already set by subscription
    if (this.name) {
      return;
    }

    // FIX: full null guard chain — tempData, commentsFollowUp, [0], enteredBy
    const enteredBy = this.verification?.tempData
      ?.commentsFollowUp?.[0]
      ?.enteredBy;

    if (enteredBy) {
      this.sharedService.emitNameChange({ name: enteredBy });
    }
  }

  ngOnDestroy() {
    // FIX: unsubscribe to prevent memory leak
    this.nameSub?.unsubscribe();
  }
}