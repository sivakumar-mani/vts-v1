import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  standalone: false,
  selector: 'app-direct-app-invitation',
  templateUrl: './direct-app-invitation.component.html',
  styleUrls: ['./direct-app-invitation.component.css']
})
export class DirectAppInvitationComponent implements OnInit {
  step1 = 0;

  isLinear = false;
firstFormGroup: UntypedFormGroup = new UntypedFormGroup({});
secondFormGroup: UntypedFormGroup = new UntypedFormGroup({});
thirdFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  constructor() { }

  // @ViewChild('stepper1', { static: true }) stepper: MatStepper;
  @ViewChild('stepper1') stepper!: MatStepper;
  ngOnInit() {
  }

 ngAfterViewInit() {
    this.stepperChange(0);
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('stpMenu');
    if (data) {
      data[index].classList.add('sm-a');
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
        } else { data[i].classList.remove('sm-a'); }
      }
    }
  }
  createView(n: any) {
    this.step1 = n.selectedIndex;
    this.stepperChange(n.selectedIndex);
  }
  selectionChange(n: any) {
    if (n === 'next') {
      this.stepper.next();
    } else if (n === 'previous') {
      this.stepper.previous();
    }
  }

}
