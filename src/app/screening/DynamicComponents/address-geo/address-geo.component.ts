import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
// import * as EventEmitter from 'events';

@Component({
  standalone: false,
  selector: 'app-address-geo',
  templateUrl: './address-geo.component.html',
  styleUrls: ['./address-geo.component.css']
})
export class AddressGeoComponent implements OnInit, OnChanges {
  compName: any;
  jcrOrgdtl:any;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compAddress: any;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() periodOfStay = true;
  @Input() addresstypecheck = false;
  @Input() isCriminalDB = false;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() periodOfStayTo = false;
  @Input() formarray: UntypedFormArray;
  @Input() currentAddress: any;
  @Output() emitNotapplicable = new EventEmitter<any>();
  @Input() formIndex: number;
  hideSameaddress = false
  sameCurrentadd = false;
  naFlag = false;
  docdata: any[] = [];
  screeningComponent = new ScreeningComponentInfo();
  address = new BehaviorSubject(null);
  baseInfo: any;
  userData = new User();
  showInSuff: boolean;
  showAddType: boolean;
  showSamePermeant: boolean;
  nFlag = false;
  index: number;
  controlDisable :any;
  miscHint = { qHint: '(Eg. Company ID.)', aHint: '(Eg. A3455DR)' };

  constructor(private cd: ChangeDetectorRef, public screening: ScreeningService, public common: CommonService, public fb: UntypedFormBuilder,
  ) { }
  ngOnChanges(changes: SimpleChanges) {
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !== true) {
        this.addressBind(this.mainForm.value.compRef.address);
      }
    }
  }
  checkAddress() {
    if (this.mainForm.value.compRef.address != null) {
      this.address.next(this.mainForm.value.compRef.address);
    }
    this.cd.markForCheck();
  }

  ngOnInit() {

    // this.mainForm.get('screeningComponentInfo')? id
    //componets compid screeing
    //sub flag
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.preaddressfetch()
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    this.getAddressType();
    this.showInsuff();
    // if (this.mainForm.get(this.formgroupName + '.addressTypeLookupId') && this.mainForm.get(this.formgroupName + '.addressTypeLookupId').value > 0) {
    //   this.addressTypeChange(false);
    // }
    if (this.mainForm.get(this.formgroupName + '.addressTypeLookupId') && this.mainForm.get(this.formgroupName + '.addressTypeLookupId').value > 0) {
      // this.addressTypeChange(false);
      if (this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !== true) {
        this.addressBind(this.mainForm.value.compRef.address);
      }

    }
    // if (this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId') && this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').value > 0) {
    //   this.addressCheckTypeChange();
    // }
    if (this.isCriminalDB === true) {
      this.showAddType = false;
      if (!(this.mainForm.get(this.formgroupName + '.sourceName').value && this.mainForm.get(this.formgroupName + '.sourceName').value.length > 0)) {
        // this.mainForm.get(this.formgroupName + '.sourceName').setValue(this.mainForm.
        //   get(this.formgroupName + '.periodOfStay').value);
      }
      // this.mainForm.get(this.formgroupName + '.periodOfStay').setValue('');
      // this.mainForm.get(this.formgroupName + '.periodOfStay').clearValidators();
      // this.mainForm.get(this.formgroupName + '.periodOfStay').updateValueAndValidity();
      // this.removeValidationForCB();
      if (this.addresstypecheck === true && this.screening.caseFlagType !== this.common.REOPEN && this.screening.addressTypeCheck && this.screening.addressTypeCheck
        .length > 0 && this.formIndex > -1) {
        const index = this.formIndex > 4 ? (this.formIndex - 5) : this.formIndex;
        const id = this.screening.DatabaseType[index].lookUpId
        if (!(this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').value > 0)) {
          this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').setValue(id);
          //this.addressCheckTypeChange();
        }
      }
      if (this.addresstypecheck === true && this.screening.caseFlagType === this.common.REOPEN) {
        const compIndex = this.mainForm.get('screeningComponentInfo')?.get('compIndex')?.value;
        const id = this.screening.addressTypeCheck[compIndex - 1].lookUpId;
        if (!(this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').value > 0)) {
          this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').setValue(id);
          //this.addressCheckTypeChange();
        }
      }
    }
    let compNameList = this.screening.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
    }
  }

  removeValidationForCB() {
    this.mainForm.get(this.formgroupName + '.periodOfStayTo').clearValidators();
    this.mainForm.get(this.formgroupName + '.periodOfStayTo').updateValueAndValidity();
    this.mainForm.get(this.formgroupName + '.addressTypeLookupId').clearValidators();
    this.mainForm.get(this.formgroupName + '.addressTypeLookupId').updateValueAndValidity();
    this.mainForm.controls[this.formgroupName].get('address.addLine1')?.clearValidators();
    this.mainForm.controls[this.formgroupName].get('address.addLine1')?.updateValueAndValidity();
    this.mainForm.controls[this.formgroupName].get('address.stateId')?.clearValidators();
    this.mainForm.controls[this.formgroupName].get('address.stateId')?.updateValueAndValidity();
    this.mainForm.controls[this.formgroupName].get('address.countryId')?.clearValidators();
    this.mainForm.controls[this.formgroupName].get('address.countryId')?.updateValueAndValidity();
    this.mainForm.controls[this.formgroupName].get('address.postalCode')?.clearValidators();
    this.mainForm.controls[this.formgroupName].get('address.postalCode')?.updateValueAndValidity();
  }
  optionsDisabled(index: any) {
    return !(index === this.formIndex)
  }
  getAddressForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  addressBind(data: any) {
    if (data != undefined) {
      this.address.next(data)
    }
  }
  handleDateChange(date, controlName) {

    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'));
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value, controlName);
    this.touchValidation(date.value, controlName);
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
      { validator: this.common.dateCompareFile('periodOfStay', 'periodOfStayTo') },
    );
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStay") {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue('Not Provided');
    }
    if (val.includes('NOT PROVIDED') && controlName === "periodOfStayTo") {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue('Not Provided');
    }
  }
  addCheckChange(data: any) {
    const addressType = this.screening.addressType.find(f => f.lookUpId === data);
    if (addressType) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addressType.lookUpName);
      this.mainForm.get(this.formgroupName + '.addressTypeCheck').setValue(addressType.lookUpName);
      if (addressType.lookUpName === 'Current Address') {
        this.sameCurrentadd = false;
        this.address.next(this.currentAddress.candidate.address);
      }
      else if (addressType.lookUpName === 'Permanent Address') {
        this.mainForm.get(this.formgroupName + '.address').reset()
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.sameCurrentadd = true

      }
      else {
        this.mainForm.get(this.formgroupName + '.address').reset()
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        this.sameCurrentadd = false
      }
    }
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('periodOfStay')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value <
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
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
  getAddressType() {
    const value = this.mainForm.getRawValue();
    if (value.compRef.hasOwnProperty('addressTypeLookupId')) {
      this.showAddType = true;
    } else {
      this.showAddType = false;
      if (value.compRef.hasOwnProperty('screeningAddressId')) {
        this.showSamePermeant = true

      }
      else {
        this.showSamePermeant = false
      }
    }
  }
  validateAddressType(checktypeId: any) {
    const add = this.screening.addressType.find(f => f.lookUpName === 'Previous Address');

    const data = this.formarray.getRawValue();
    return data.some(s => (add && s.compRef.addressTypeLookupId !== add.lookUpId) &&
      (s.compRef.addressTypeLookupId === checktypeId));
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    const obj = { index: this.formIndex, checked: event.checked, formdata: this.mainForm.getRawValue() }
    this.screening.notApplicableSub.next(obj);
    this.emitNotapplicable.emit(event);
    this.nFlag = true;
  }
  addressTypeChange(clearFlag: any) {
    const addresstypeLookup = this.mainForm.get(this.formgroupName + '.addressTypeLookupId').value;
    const addresstypeobj = this.screening.addressType.find(f => f.lookUpId === addresstypeLookup);
    if (addresstypeobj) {
      this.mainForm.get(this.formgroupName + '.addressType').setValue(addresstypeobj.lookUpName);
      if (addresstypeobj.lookUpName === 'Current Address') {
        this.sameCurrentadd = false
        if (this.currentAddress && this.currentAddress.candidate) {
          this.address.next(this.currentAddress.candidate.address);
          // this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)
        }
      } else if (addresstypeobj.lookUpName === 'Permanent Address') {
        this.sameCurrentadd = true;
        if (clearFlag === true) {
          // this.mainForm.get(this.formgroupName).get('periodOfStay')?.reset()
          // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.reset()
        }
        if (this.mainForm.get(this.formgroupName).get("checkPermanentAddress").value != true) {
          this.mainForm.get(this.formgroupName + '.address').reset()
          this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
          this.permanentaddressFetch();
        }

        // this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').reset()
        // this.mainForm.get(this.formgroupName + '.addressType').reset()

      }
      else {
        this.sameCurrentadd = false;
        this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(false)
        this.mainForm.get(this.formgroupName + '.address').reset()
        this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
        if (clearFlag === true) {
          this.mainForm.get(this.formgroupName).get('periodOfStay')?.reset()
          this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.reset()
        }
      }
    }
  }
  // preaddressfetch(){
  //   let pList: any[] = [];
  //   const subList = this.screening.componentList ? this.screening.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === 'ADDRESS' || x.compName === 'ADDRESS - GEO') : [];
  //   if (subList.length > 0) {
  //     pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
  //   }
  // }
  permanentaddressFetch() {
    let pList: any[] = [];
    const subList = this.screening.componentList ? this.screening.componentList.filter(x => x.screeningSubComponent.length > 0 && x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (pList.length > 0 && this.screening.compFormArray.value.length > 0) {
      this.screening.compFormArray.value.forEach(ele => {
        if (ele.compId === pList[0].compId) {
          ele.component.forEach(ee => {
            if (ee.screeningComponentInfo.subCompId === pList[0].subCompId && ele.subcompname != 'Previous Address') {
              this.address.next(ee.compRef.address);
              // this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue(ee.compRef.periodOfStay)
              // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(ee.compRef.periodOfStayTo)
            }
          });
        }
      });
    }
  }
  // CrminalDatabase Address Type Changed - By Defalut select only one addresstype //
  // addressCheckTypeChange() {
  //   const addresschecktypeLookup = this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupId').value;
  //   const addresschecktypeobj = this.screening.addressTypeCheck.find(f => f.lookUpId === addresschecktypeLookup);
  //   if (addresschecktypeobj) {
  //     this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addresschecktypeobj.lookUpName);
  //     this.mainForm.get(this.formgroupName + '.addressTypeCheck').setValue(addresschecktypeobj.lookUpName);
  //   }
  // }

  changeAddress(daata: any) {
    if (daata.checked === true) {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.address.next(this.currentAddress.candidate.address);

      // this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue(this.currentAddress.candidate.periodOfStay)
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(this.currentAddress.candidate.periodOfStayTo)

    } else {
      this.mainForm.get(this.formgroupName).get('checkPermanentAddress')?.setValue(daata.checked)
      this.mainForm.get(this.formgroupName + '.address').reset()
      this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
      // this.mainForm.get(this.formgroupName).get('periodOfStay')?.setValue(null)
      // this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setValue(null)
      this.permanentaddressFetch();
    }
  }
  notProvidevalidation(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStay')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if ((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setErrors({ incorrect: true });
    } else if ((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('periodOfStayTo')?.setErrors(null);
    }
  }
  preaddressfetch() {
    const componentValue = this.mainForm.get('screeningComponentInfo')?.value;
    const comid = componentValue.compId;
    const subid = componentValue.subCompId;
    const getData = this.screening.componentList.find(x => x.compId === comid);
    if (componentValue.notApplicableFlag == false && getData.subCompFlag === true) {
      const subcomponentid = getData.screeningSubComponent.find(x => x.subCompId === subid)
      if (subcomponentid != null) {
        if (subcomponentid.subCompName === 'Previous Address') {
          this.hideSameaddress = false;
        } else {
          this.hideSameaddress = true;
        }

      }
    }

  }
//JCR
getCourtFormGroup() {
  const dFlag = this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm') as UntypedFormControl;

  if (dFlag != null) {
    if (dFlag.status === 'DISABLED') {
      (this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm') as UntypedFormArray).controls.forEach(control => {
        control.disable();
      })
      this.controlDisable = dFlag.status;

    }
  }
  const jcrfrmgrp = ((this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm')) as UntypedFormArray).value;


  if(jcrfrmgrp.length>0){
    var jcrOrgdt = jcrfrmgrp.filter(f=>f.active == true);
    var jcrOrgdtAn = jcrfrmgrp.filter(f=>f.active == false);
    this.jcrOrgdtl = jcrOrgdt.length - 1;
    if(jcrOrgdtAn.length ==0){
      this.jcrOrgdtl =   jcrfrmgrp.length- 1;
    }
  }
  if(jcrfrmgrp.length<=0){
    this.addCourt(0);
  }

  return ((this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm')) as UntypedFormArray).controls;

}

addCourt(i: any) {
  let array = (this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm')) as UntypedFormArray;
  const frmgroup =(this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm')) as UntypedFormArray;
   if(frmgroup.controls[i] !=undefined &&frmgroup.controls[i].get('screeningJcrdetailsId')?.value>0){
    frmgroup.controls[i].get('deleteFlag')?.setValue(false);
    frmgroup.controls[i].get('active')?.setValue(true);
  }else{
  if (this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm').valid) {
    array.push(this.fb.group({
      screeningJcrdetailsId:new UntypedFormControl(0),
      ScreeningJcrid: new UntypedFormControl(0),
      courtName: new UntypedFormControl(''),
      jurisdiction: new UntypedFormControl(''),
        location: new UntypedFormControl(''),
          remarks: new UntypedFormControl(''),
          active : new UntypedFormControl(true),
          deleteFlag : new UntypedFormControl(false),
          createdUserId : new UntypedFormControl(0),
    }))

  } else {
    this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm').markAllAsTouched();
  }
}

}

delete(i: any) {
const frmgroup =(this.mainForm.get(this.formgroupName + '.jCRCourctDetailsVm')) as UntypedFormArray;
if(frmgroup.controls[i].get('screeningJcrdetailsId')?.value>0){
frmgroup.controls[i].get('deleteFlag')?.setValue(true);
frmgroup.controls[i].get('active')?.setValue(false);


}else{
  frmgroup.removeAt(i);
}
}


}
