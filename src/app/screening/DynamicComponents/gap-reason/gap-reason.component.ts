import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from '../../../common-methods/models/screening-details';

@Component({
  standalone: false,
  selector: 'app-gap-reason',
  templateUrl: './gap-reason.component.html',
  styleUrls: ['./gap-reason.component.css']
})
export class GapReasonComponent implements OnInit {

  @Input() mainForm: UntypedFormGroup;
  @Input() arrayName: string;
  docfrm: UntypedFormGroup;
  screeningComponent = new ScreeningComponentInfo();

  constructor() { }


  ngOnInit() {
    this.disableRemark();
  }
  getGapFormGroup() {
    return (this.mainForm.get('gapReason') as UntypedFormArray).controls;
  }
  disableRemark() {
    const frmArray = this.mainForm.get('gapReason') as UntypedFormArray;
    for (let i = 0; frmArray.length > i; i++) {
      const frmGroup = frmArray.controls[i] as UntypedFormGroup;
      if (frmGroup.get('reasonFlag')?.value) {
        frmGroup.get('remarks')?.enable();
      } else {
        frmGroup.get('remarks')?.clearValidators();
        frmGroup.get('remarks')?.disable();
      }
    }
  }
  reasonTypeChange(event, reasonForm: UntypedFormGroup) {
    if (event.value) {
      reasonForm.get('remarks')?.enable();
      reasonForm.get('remarks')?.setValidators(Validators.required);
      reasonForm.get('remarks')?.updateValueAndValidity();
    } else {
      reasonForm.get('remarks')?.clearValidators();
      reasonForm.get('remarks')?.setValue(null);
      //reasonForm.get('reasonDoument')?.setValue(null);
      reasonForm.get('remarks')?.disable();
      reasonForm.get('remarks')?.updateValueAndValidity();
    }
  }

}
