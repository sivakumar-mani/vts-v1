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
  selector: 'app-common-crc',
  templateUrl: './common-crc.component.html',
  styleUrls: ['./common-crc.component.css']
})
export class CommonCrcComponent implements OnInit, OnChanges {
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
  showInSuff: boolean;
  showAddress: boolean;
  empSupKeyup: boolean;
  applicationId: number;
  naFlag = false;
  nFlag = false;
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    public fb: UntypedFormBuilder) { }

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
    }
    if (this.userData.applicationId === 3) {
      if (this.common.candidateCountryId !== 92) {
        const ssflag = this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.value;
        if (ssflag == null || ssflag == true) {
          this.nFlag = false;
          // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
          // this.mainForm.controls[this.formgroupName].get('address.stateId')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
          // this.mainForm.controls[this.formgroupName].get('address.countryId')?.clearValidators();
          // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
        }
        else {
          this.nFlag = true;
        }
      }
      else {
      this.mainForm.controls[this.formgroupName].get('isDirectAppDocReq')?.setValue(false);
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      this.nFlag = true;
    }
    }
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
  CheckDoc(event: any) {
    if (event.value) {
      this.nFlag = false;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(true);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.clearValidators();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
    }
    else {
      this.nFlag = true;
      this.mainForm.get('screeningComponentInfo')?.get('isDirectAppDocReq')?.setValue(false);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.setValidators(Validators.required);
      // this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      this.mainForm['controls']['screeningComponentInfo']['controls']['componentDocument'].disable();
    }
  }
  addCheckChange(data, clearFlag) {
    const addressType = this.screeningService.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addressType.lookUpName);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        if(this.currentAddress){
        if (this.currentAddress.candidate && this.currentAddress.candidate.address) {
          if(this.currentAddress.candidate.address!=undefined &&this.mainForm!=undefined){

            const address = this.mainForm.get(this.formgroupName).get('address')?.value;
             const addressc =address;
            if(this.currentAddress.candidate.address.addressId>0){
          this.currentAddress.candidate.address.addressId = addressc.addressId;
          if(this.currentAddress.candidate.address.addressPos != null && this.currentAddress.candidate.address.addressPos.length > 0 ){
          this.currentAddress.candidate.address.addressPos[0].addressPosId= addressc.addressPos[0].addressPosId ;
            this.currentAddress.candidate.address.addressPos[0].addressId = addressc.addressId;
            this.currentAddress.candidate.address.addressPos[0].screeningCompId = this.mainForm.get('screeningComponentInfo')?.get('screeningCompId')?.value;
          }
            }
          }
          this.addressData.next(this.currentAddress.candidate.address);
        }
      }
      }
      else if (addressType.lookUpName === 'Permanent Address') {
        this.sameCurrentadd = true
        if (this.mainForm.get(this.formgroupName).get("checkPermanentAddress").value != true) {
          this.mainForm.get(this.formgroupName + '.address').reset()
          this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
          this.permanentaddress();
        }
      }
      else {
        this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(false)
        this.mainForm.get(this.formgroupName + '.address').reset()
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.sameCurrentadd = false
      }
    }
  }
  checkAddress() {
    if(this.compAddress!=null){
    this.addressData.next(this.compAddress.address);
     
    }else{
      this.addressData.next(this.mainForm.value.compRef.address);
    }
    this.cd.markForCheck();
  }
  changeAddress(daata: any) {
    if (daata.checked === true) {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.addressData.next(this.currentAddress.candidate.address);
    }
    else {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.mainForm.get(this.formgroupName + '.address').reset()
      this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
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
      this.addressData.next(this.screeningService.permnAddress);
      // this.screeningService.compFormArray.value.forEach(ele => {
      //   if (ele.compId === pList[0].compId) {
      //     ele.component.forEach(ee => {
      //       if (ee.screeningComponentInfo.subCompId === pList[0].subCompId) {
      //         this.addressData.next(this.screeningService.permnAddress);
      //       }
      //     });
      //   }
      // });
    }
  }
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
