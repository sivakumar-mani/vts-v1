import { Component, OnInit,Input } from '@angular/core';
import{UntypedFormGroup,Validators} from '@angular/forms'
import {ScreeningComponentInfo} from 'src/app/common-methods/models/screening-details';
@Component({
  standalone: false,
  selector: 'app-common-oig',
  templateUrl: './common-oig.component.html',
  styleUrls: ['./common-oig.component.css']
})
export class CommonOigComponent implements OnInit {
  @Input() formArrName: string;
  @Input() hiddenAddRemove = false;
  rowCount = 1;
  nFlag = false;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  userData: any;
  showInSuff: boolean;
  docData: any;
  constructor() { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if(this.mainForm!=undefined){
      if(this.screeningComponent.componentDocument.length==0){               
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
        }
    this.showInsuff()
    }
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
      // this.showInSuff = event.checked;
    } else {
      this.showInSuff = false;
    }
    if(this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValue(null);
    }
    if (this.showInSuff) {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('levelLookupId')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('raisedDate')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
}
