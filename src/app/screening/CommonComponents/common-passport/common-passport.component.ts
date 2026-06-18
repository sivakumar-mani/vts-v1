import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
import { FSCandidateVm } from 'src/app/common-methods/models/screening-detail';

@Component({
  standalone: false,
  selector: 'app-common-passport',
  templateUrl: './common-passport.component.html',
  styleUrls: ['./common-passport.component.css']
})
export class CommonPassportComponent implements OnInit, OnChanges {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() compAddress: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  nFlag = false;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  showInSuff: boolean;
  userData = new User();
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  naFlag = false;
  candidateInfo: FSCandidateVm;
  constructor(private cd: ChangeDetectorRef, public common: CommonService) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if(this.mainForm!=undefined){
      if(this.screeningComponent.componentDocument.length==0){               
        this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
        }
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    if(this.mainForm.get(this.formgroupName).get('expiryDate')?.value) {
      const val =  new Date(this.mainForm.get(this.formgroupName).get('expiryDate')?.value);
      this.mainForm.get(this.formgroupName).get('expiryDate')?.setValue(new DatePipe('en-Us').transform(val, 'dd/MMM/yyyy'));
      const val1 = this.mainForm.get(this.formgroupName).get('expiryDate')?.value.toUpperCase();
      this.mainForm.get(this.formgroupName).get('expiryDate')?.setValue(val1);
    }
    this.candidateInfo = this.common.getCandidateInfo();
    if (this.userData.applicationId === 3 && this.candidateInfo != undefined && this.candidateInfo.passportNumber != null && this.candidateInfo.passportNumber != "") {
      this.mainForm.get(this.formgroupName + '.passportNumber').setValue(this.candidateInfo.passportNumber ? this.candidateInfo.passportNumber:'' );
    }
  }
}

  ngOnChanges(changes: SimpleChanges) {
    if(this.mainForm!=undefined){
    if (changes.compAddress) {
      this.checkAddress();
    }
  }
  }
  checkAddress() {
    this.address.next(this.compAddress);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
   showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
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
      this.mainForm.get(this.formgroupName).get('dateOfIssue')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('placeOfResidence')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('placeOfIssue')?.clearValidators();
      this.mainForm.get(this.formgroupName).get('dateOfIssue')?.updateValueAndValidity();
      this.mainForm.get(this.formgroupName).get('placeOfResidence')?.updateValueAndValidity();
      this.mainForm.get(this.formgroupName).get('placeOfIssue')?.updateValueAndValidity();
       } else {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get(this.formgroupName).get('dateOfIssue')?.setValidators(Validators.required);
      this.mainForm.get(this.formgroupName).get('placeOfResidence')?.setValidators(Validators.required);
      this.mainForm.get(this.formgroupName).get('placeOfIssue')?.setValidators(Validators.required); 
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
  handleDateChange(dar, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-US').transform(dar.value, 'dd/MMM/yyyy'));
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value,controlName);
}
upperCase(val, controlName) {
  val = val.toUpperCase();
 this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
 if(val.includes('NOT PROVIDED') && controlName ==="dateOfIssue") {
  this.mainForm.get(this.formgroupName).get('dateOfIssue')?.setValue('Not Provided');
 }
 if(val.includes('NOT PROVIDED') && controlName ==="passportNumber"){
  this.mainForm.get(this.formgroupName).get('passportNumber')?.setValue('Not Provided');
}
}
notProvidevalidation(val: any) {
  if((this.userData.applicationId === 3) && (val.includes('NOTPROVIDED') || val.includes('Not Provided'))) {
    this.mainForm.get(this.formgroupName).get('passportNumber')?.setErrors({incorrect : true});
  }
}
notProvide(val: any) {
  if((this.userData.applicationId === 3) && (val === 'Not Provided')) {
    this.mainForm.get(this.formgroupName).get('dateOfIssue')?.setErrors({incorrect : true});
  }
  else if((this.userData.applicationId !== 3) && (val === 'Not Provided')) {
    this.mainForm.get(this.formgroupName).get('dateOfIssue')?.setErrors(null);
  }
}
}
