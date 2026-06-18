import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-crc',
  templateUrl: './crc.component.html',
  styleUrls: ['./crc.component.css']
})
export class CrcComponent implements OnInit, OnChanges {
  compName: any;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() docList: any;
  @Input() formarray: UntypedFormArray;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() currentAddress: any;
  @Output() permentAddress = new EventEmitter<any>();
  screeningComponent = new ScreeningComponentInfo();
  docdata: any[] = [];
  userData = new User();
  addressData = new BehaviorSubject(null);
  sameCurrentadd = false;
  // permanentAddressData = new BehaviorSubject(null);
  showInSuff: boolean;
  showAddress: boolean;
  empSupKeyup: boolean;
  applicationId: number;
  naFlag = false;
  nFlag = false;
  //frmArray: UntypedFormArray;
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    public fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.showInsuff();
    // if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
    //   this.addCheckChange(this.mainForm.value.compRef.addressTypeCheckLookupId, false);
    // }
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if(this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !==true){
     this.addressBind(this.mainForm.value.compRef.address);
      }     
     }
    let compNameList = this.screeningService.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
     }
    // setTimeout(() => {
    //   if (this.screeningService.baseDetail && this.screeningService.baseDetail.addressType.length > 0) {
    //     this.screeningService.addressType = this.screeningService.addressType.length > 0 ? this.screeningService.addressType:
    //     this.screeningService.baseDetail.addressType;
    //   }
    // }, 100);
    // this.validationAddress();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if(this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !==true){
     this.addressBind(this.mainForm.value.compRef.address);
      }     
     }
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      { validator: this.common.dateCompareFile('periodOfStayFrom', 'periodOfStayTo')},
    );
  }
  addressBind(data: any) {
    if(data!=undefined){
     this.addressData.next(data)
    }
  }

  getcriminaldata(checktypeId: any) {
    const add = this.screeningService.addressType.find(f => f.lookUpName === 'Previous Address');
    const data = this.formarray.getRawValue();
    return data.some(s => (add && s.compRef.addressTypeCheckLookupId !== add.lookUpId) &&
      (s.compRef.addressTypeCheckLookupId === checktypeId));
  }
  addCheckChange(data, clearFlag) {
    const addressType = this.screeningService.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addressType.lookUpName);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        if(this.currentAddress){
        if (this.currentAddress.candidate && this.currentAddress.candidate.address) {
          this.addressData.next(this.currentAddress.candidate.address);
          // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(this.currentAddress.candidate.periodOfStay)
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
        }
      }
      }
      else if (addressType.lookUpName === 'Permanent Address') {
        this.sameCurrentadd = true
        if (clearFlag === true) {
          // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.reset()
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.reset()
        }
        if (this.mainForm.get(this.formgroupName).get("checkPermanentAddress").value != true) {
          this.mainForm.get(this.formgroupName + '.address').reset()
          this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
          this.permanentaddress();
        }
        // this.addressData.next(this.currentAddress.screeningComponent[0].component[0].compRef.address)
        // this.permentAddress.emit()
      }
      else {
        this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(false)
        this.mainForm.get(this.formgroupName + '.address').reset()
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.sameCurrentadd = false
        if (clearFlag === true) {
          // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.reset()
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.reset()
        }
      }
    }
  }
  checkAddress() {
    this.addressData.next(this.compAddress.address);
    // this.permanentAddressData.next(this.compAddress.permanentAddress);
    this.cd.markForCheck();
  }
  changeAddress(daata: any) {
    if (daata.checked === true) {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.addressData.next(this.currentAddress.candidate.address);
      // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(this.currentAddress.candidate.periodOfStay)
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
    }
    else {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.mainForm.get(this.formgroupName + '.address').reset()
      this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);

      // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.reset()
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.reset()
      this.permanentaddress()

    }
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
    this.touchValidation(date.value, controlName);
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
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if(val.includes('NOT PROVIDED') && controlName === "periodOfStayFrom") {
      this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue('Not Provided');
    }
    if(val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  permanentaddress() {
    let pList: any[] = [];
    const subList = this.screeningService.componentList ? this.screeningService.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (pList.length > 0 && this.screeningService.compFormArray.value.length > 0) {
      this.screeningService.compFormArray.value.forEach(ele => {
        if (ele.compId === pList[0].compId) {
          ele.component.forEach(ee => {
            if (ee.screeningComponentInfo.subCompId === pList[0].subCompId) {
              this.addressData.next(ee.compRef.address);
              // this.mainForm.get(this.formgroupName).get('periodOfStayFrom')?.setValue(ee.compRef.periodOfStay)
              // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(ee.compRef.periodOfStayTo)
            }
          });
        }
      });
    }
  }
  // bindAddress(e: any) {
  //   const currentaddress = this.mainForm.get('compRef')?.get('currentAddress') as UntypedFormGroup;
  //   // const permanentaddress = this.mainForm.get('compRef')?.get('permanentAddress') as UntypedFormGroup;
  //   // if (e === true) {
  //   //   permanentaddress.enable();
  //   //   setTimeout(() => {
  //   //     permanentaddress.setValue(currentaddress.value);
  //   //     this.permanentAddressData.next(currentaddress.value);
  //   //   }, 0);
  //   // } else {
  //   //   permanentaddress.get('stateId')?.disable();
  //   //   permanentaddress.get('districtId')?.disable();
  //   //   permanentaddress.get('cityId')?.disable();
  //   //   permanentaddress.get('locationId')?.disable();
  //   //   permanentaddress.get('stateId')?.setValue('');
  //   //   permanentaddress.get('districtId')?.setValue('');
  //   //   permanentaddress.get('cityId')?.setValue('');
  //   //   permanentaddress.get('locationId')?.setValue('');
  //   //   permanentaddress.get('countryId')?.setValue('');
  //   //   permanentaddress.get('addLine1')?.setValue('');
  //   //   permanentaddress.get('addLine2')?.setValue('');
  //   //   permanentaddress.get('postalCode')?.setValue('');
  //   //   permanentaddress.get('addLine3')?.setValue('');
  //   // }
  // }
  // validationAddress() {
  //   const permanentaddress = this.mainForm.get('compRef')?.get('permanentAddress') as UntypedFormGroup;
  //   if (permanentaddress) {
  //     permanentaddress.get('postalCode')?.clearValidators();
  //     permanentaddress.get('postalCode')?.updateValueAndValidity();
  //     permanentaddress.get('addLine1')?.clearValidators();
  //     permanentaddress.get('addLine1')?.updateValueAndValidity();
  //     permanentaddress.get('countryId')?.clearValidators();
  //     permanentaddress.get('countryId')?.updateValueAndValidity();
  //   }
  // }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
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
