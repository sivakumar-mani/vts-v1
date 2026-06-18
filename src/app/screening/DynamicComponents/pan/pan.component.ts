import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ScreeningComponent, ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css']
})
export class PanComponent implements OnInit {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  address = new BehaviorSubject(null);
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  showInSuff: boolean;
  docData: any;
  nFlag = false;
  constructor(public common: CommonService, public screen: ScreeningService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if(this.mainForm.get('screeningComponentInfo.compId')?.value != this.common.PAN_CARDID){
    if(this.mainForm.get(this.formgroupName).get('address')?.value){
      this.address = new BehaviorSubject(this.mainForm.get(this.formgroupName).get('address')?.value);
    }
    }
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
     
    }
    this.showInsuff();
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
  // setNotProvide() {
  //   this.mainForm.get(this.formgroupName).get('pan')?.setValue('NOT PROVIDED');
  // }
  downloadFile() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/documents/CIBIL_Consent_Form.pdf';
    link.download = 'CIBIL_Consent_Form';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  notProvidevalidation(val: any) {
    if((this.userData.applicationId === 3) && (val.includes('NOTPROVIDED') || val.includes('NOT PROVIDED'))) {
      this.mainForm.get(this.formgroupName).get('pan')?.setErrors({incorrect : true});
    }
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
   this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
   if(val.includes('NOT PROVIDED')) {
    this.mainForm.get(this.formgroupName).get('pan')?.setValue('Not Provided');
  }
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
}
