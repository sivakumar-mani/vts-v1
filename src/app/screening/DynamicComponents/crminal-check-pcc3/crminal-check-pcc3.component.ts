import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-crminal-check-pcc3',
  templateUrl: './crminal-check-pcc3.component.html',
  styleUrls: ['./crminal-check-pcc3.component.css']
})
export class CrminalCheckPcc3Component implements OnInit, OnChanges {
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compAddress: any;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() currentAddress: any;
  @Input() invitationFlag: boolean;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  userData = new User();
  showInSuff: boolean;
  sameCurrentadd = false;
  showaddchecktype = true;
  naFlag = false;
  nFlag = false;
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    public fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    if (this.mainForm.value.compRef.addressTypeLookupId !== 56) {
      this.addtypeChange(this.mainForm.get(this.formgroupName + '.addressTypeLookupId').value);
    }
    // if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
    //   this.addCheckChange(this.mainForm.value.compRef.addressTypeCheckLookupId, false);
    // }
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !== true) {
        this.addressBind(this.mainForm.value.compRef.address);
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !== true) {
        this.addressBind(this.mainForm.value.compRef.address);
      }
    }
  }
  checkAddress() {
    this.address.next(this.compAddress.address);
    this.cd.markForCheck();
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
    this.touchValidation(date.value, controlName);
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      {
        validator: this.common.dateCompareFile('periodOfStayFrom',
          'periodOfStayTo')
      },
    );
  }
  addressBind(data: any) {
    if (data != undefined) {
      this.address.next(data)
    }
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
      // this.showInSuff = event.checked;
    } else {
      this.showInSuff = false;
    }
    if (this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.value === 0) {
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
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStayFrom") {
      this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  addCheckChange(data, clearFlag) {
    const addressType = this.screeningService.addressTypeCheck.find(f => f.lookUpId === data);
    if (addressType) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addressType.lookUpName);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        if (this.currentAddress) {
          this.address.next(this.currentAddress.candidate.address);
          // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(this.currentAddress.candidate.periodOfStay)
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
        }
      } else if (addressType.lookUpName === 'Permanent Address') {
        this.sameCurrentadd = true;
        this.mainForm.get(this.formgroupName + '.address').reset();
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.permanentaddressFetch();
      } else {
        this.mainForm.get(this.formgroupName + '.address').reset();
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.sameCurrentadd = false;
        if (clearFlag === true) {
          // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(null);
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(null);
        }
      }
    }
  }
  permanentaddressFetch() {
    let pList: any[] = [];
    const subList = this.screeningService.componentList ?
      this.screeningService.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (pList.length > 0 && this.screeningService.compFormArray.value.length > 0) {
      this.screeningService.compFormArray.value.forEach(ele => {
        if (ele.compId === pList[0].compId) {
          ele.component.forEach(ee => {
            if (ee.screeningComponentInfo.subCompId === pList[0].subCompId) {
              this.address.next(ee.compRef.address);
              // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(ee.compRef.periodOfStay)
              // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(ee.compRef.periodOfStayTo)
            }
          });
        }
      });
    }
  }
  addtypeChange(data: any) {
    const addressType = this.screeningService.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.showaddchecktype = addressType.lookUpName === 'Work Location' ? false : true;
      this.mainForm.get(this.formgroupName + '.addressType').setValue(addressType.lookUpName);
    } else {
      this.showaddchecktype = false
    }
    if (addressType && this.showaddchecktype) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').setValidators(Validators.required);
    } else {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').clearValidators();
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').updateValueAndValidity();
    }

  }
  chengeAddress(daata: any) {
    if (daata.checked === true) {
      this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(daata.checked)
      this.address.next(this.currentAddress.candidate.address);
      // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(this.currentAddress.candidate.periodOfStay)
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
    } else {
      this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(daata.checked)
      this.mainForm.get(this.formgroupName + '.address').reset();
      this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
      // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(null)
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(null)
      this.permanentaddressFetch();
    }
  }
  notProvidevalidation(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setErrors({ incorrect: true });
    }
    else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setErrors(null);
    }
  }
}
