import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';


@Component({
  standalone: false,
  selector: 'app-common-bank',
  templateUrl: './common-bank.component.html',
  styleUrls: ['./common-bank.component.css']
})
export class CommonBankComponent implements OnInit {
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
  userData = new User();
  showInSuff: boolean;
  applicationId: number;
  maxDate: Date;
  //minDate: Date;
  statementminDate:Date;
  naFlag = false;
   constructor(private cd: ChangeDetectorRef, private screeningService: ScreeningService, public common: CommonService,
    private dateP: DatePipe, public fb: UntypedFormBuilder) { }

  ngOnInit() {

    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if(this.screeningComponent.componentDocument.length==0){               
      this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
      }
    this.applicationId = this.userData.applicationId;
    if(this.mainForm!=undefined){
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    this.dateChange();
  }
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
    } else {
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('levelLookupId')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('raisedDate')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {
        validator: this.common.dateCompareFile('fromDate',
          'toDate')
      },
    );
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
  dateChange() {
    if (
      this.mainForm.get(this.formgroupName).get('fromDate')?.value !== 'NOT PROVIDED'  || this.mainForm.get(this.formgroupName).get('toDate')?.value !== 'NOT PROVIDED') {
      this.mainForm.get(this.formgroupName).get('statementFrom')?.enable();
      this.mainForm.get(this.formgroupName).get('statementTo')?.enable();
     // this.minDate = new Date(this.dateP.transform(this.mainForm.get(this.formgroupName).get('fromDate')?.value, 'dd/MM/yyyy'));
      this.maxDate = new Date();
    } else {
      this.mainForm.get(this.formgroupName).get('statementFrom')?.setValue(null);
      this.mainForm.get(this.formgroupName).get('statementFrom')?.disable();
      this.mainForm.get(this.formgroupName).get('statementTo')?.setValue(null);
      this.mainForm.get(this.formgroupName).get('statementTo')?.disable();
    }
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if(val.includes('NOT PROVIDED') && controlName === "fromDate") {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setValue('Not Provided');
    }
    if(val.includes('NOT PROVIDED') && controlName === "toDate") {
      this.mainForm.get(this.formgroupName).get('toDate')?.setValue('Not Provided');
    }
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('fromDate')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('fromDate')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
    else if ((this.mainForm.get(this.formgroupName).get('fromDate')?.valid ||
      this.mainForm.get(this.formgroupName).get('fromDate')?.disabled) &&
      this.mainForm.get(this.formgroupName).get('fromDate')?.value !== 'Not Provided' &&
      (this.mainForm.get(this.formgroupName).get('toDate')?.valid || this.mainForm.get(this.formgroupName).get('toDate')?.disabled) &&
      this.mainForm.get(this.formgroupName).get('toDate')?.value !== 'Not Provided') {
      this.mainForm.get(this.formgroupName).get('statementFrom')?.enable();
      this.mainForm.get(this.formgroupName).get('statementTo')?.enable();
      const ddmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
      const ddmmmyyyyREGEX = /^(0[1-9]|1\d|2\d|3[01])\/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
      const mmmyyyyREGEX = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(19|20)\d{2}$/;
      if(ddmmyyyyREGEX.test(this.mainForm.controls.compRef.get('fromDate')?.value) && ddmmyyyyREGEX.test(this.mainForm.controls.compRef.get('toDate')?.value)) {
     // this.minDate = new Date(this.dateP.transform(this.mainForm.controls.compRef.get('fromDate')?.value,'dd-MM-yyyy'));
      this.maxDate = new Date();
      } else if(ddmmmyyyyREGEX.test(this.mainForm.controls.compRef.get('fromDate')?.value) && 
      ddmmmyyyyREGEX.test(this.mainForm.controls.compRef.get('toDate')?.value)) {
    //  this.minDate = new Date(this.dateP.transform(this.mainForm.controls.compRef.get('fromDate')?.value,'dd-MMM-yyyy'));
      this.maxDate = new Date();
     // this.statementminDate  = new Date(this.dateP.transform(this.mainForm.controls.compRef.get('statementFrom')?.value,'dd/MMM/yyyy'));
      } else if(mmmyyyyREGEX.test(this.mainForm.controls.compRef.get('fromDate')?.value) && 
      mmmyyyyREGEX.test(this.mainForm.controls.compRef.get('toDate')?.value))  {
     //   this.minDate = new Date(this.dateP.transform(this.mainForm.controls.compRef.get('fromDate')?.value,'MM-yyyy'));
        this.maxDate = new Date();
      }
    }
    //  else {
    //   this.mainForm.get(this.formgroupName).get('statementFrom')?.setValue(null);
    //   this.mainForm.get(this.formgroupName).get('statementFrom')?.disable();
    //   this.mainForm.get(this.formgroupName).get('statementTo')?.setValue(null);
    //   this.mainForm.get(this.formgroupName).get('statementTo')?.disable();
    // }
  }
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'));
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value,controlName);
    this.touchValidation(date.value, controlName);
  }
  notProvidevalidation(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors({incorrect : true});
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('fromDate')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors({incorrect : true});
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('toDate')?.setErrors(null);
    }
  }
}
