import { Component, Output, OnInit, Input, ChangeDetectorRef, EventEmitter, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, Validators, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { BehaviorSubject } from 'rxjs';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import {
  ScreeningDetails
} from 'src/app/common-methods/models/screening-details';
import { DatePipe } from '@angular/common';
@Component({
  standalone: false,
  selector: 'app-common-criminal-check-pcc2',
  templateUrl: './common-criminal-check-pcc2.component.html',
  styleUrls: ['./common-criminal-check-pcc2.component.css']
})

export class CommonCriminalCheckPcc2Component implements OnInit, OnChanges {
  @Input() formgroupName: any;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() compAddress: any;
  @Input() formArrName: any;
  @Input() docList: any;
  @Input() formarray: UntypedFormArray;
  @Input() index: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  @Input() currentAddress: any;
  @Input() invitationFlag = false;

  screeningDetails1 = new ScreeningDetails();
  docdata: any[] = [];
  genderDetails: any;
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  address: any[] = [];
  // address = new BehaviorSubject(null);
  showInSuff: boolean;
  docData: any;
  refCheckReport: any[] = [];
  addressTypeList: any[] = [];
  // checkBoxdis=true
  addresschecktypevalue: any[] = [];
  sameCurrentadd = false;
  naFlag = false;
  nFlag = false;
  miscHint = { qHint: '(Govt ID Prof.)', aHint: '(Eg. 50402104504)' };
  constructor(private cd: ChangeDetectorRef, public screeningService: ScreeningService, public common: CommonService,
    public fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    // this.addressTypeList[0].map(m => m.disabled = true);
    if(this.screeningComponent.componentDocument.length==0){               
    this.screeningComponent.componentDocument = this.mainForm.get('screeningComponentInfo')?.get('componentDocument')?.value;
    }
    this.showInsuff();
    //this.getRefReport();
    // if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
    //   this.addCheckChange(this.mainForm.value.compRef.addressTypeCheckLookupId, false);
    // }
    if (this.mainForm.value.compRef.addressTypeCheckLookupId > 0) {
      if(this.mainForm.get('screeningComponentInfo')?.get('notApplicableFlag')?.value !==true){
     this.addressBind(this.mainForm.value.compRef.address.length>0?this.mainForm.value.compRef.address:this.mainForm.value.compRef.address0);
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
     this.addressBind(this.mainForm.value.compRef.address.length>0?this.mainForm.value.compRef.address:this.mainForm.value.compRef.address0);
      }     
     }
    if (changes.compBaseDetails) {
      this.baseDetailChange();
    }
  }
  addressBind(data: any) {
    if(data!=undefined){
     const behaviorAdd = new BehaviorSubject(null);
     this.address.push(behaviorAdd);
     this.address[0].next(data)
    }
  }
  checkAddress() {
    if (this.compAddress) {
      if (this.address.length === 0) {
        for (let o = 0; this.mainForm.get('criminalCheckCount')?.value > o; o++) {
          const behaviorAdd = new BehaviorSubject(null);
          this.address.push(behaviorAdd);
        }
      }
      for (let o = 0; this.mainForm.get('criminalCheckCount')?.value > o; o++) {
        this.address[o].next(this.compAddress['address' + o]);
      }
      this.cd.markForCheck();
    }
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
  baseDetailChange() {
    this.addressTypeList = [];
    const criminalCheckCount = this.mainForm.get('criminalCheckCount')?.value;
    for (let i = 0; i < criminalCheckCount; i++) {
      this.addressTypeList.push(this.screeningService.addressType);
    }
    this.cd.markForCheck();
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
      { validator: this.common.dateCompareFile('periodOfStayFrom', 'periodOfStayTo') },
    );
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
  getcriminaldata(checktypeId: any) {
    const add = this.screeningService.addressType.find(f => f.lookUpName === 'Previous Address');

    const data = this.formarray.getRawValue();
    return data.some(s => (add && s.compRef.addressTypeCheckLookupId !== add.lookUpId) &&
      (s.compRef.addressTypeCheckLookupId === checktypeId));
    // for (let i = 0; data.length > i; i++) {
    //   if (data[i] && data[i].compRef && data[i].compRef.addressTypeCheckLookupId > 0) {
    //     this.addresschecktypevalue.push(data[i].compRef.addressTypeCheckLookupId);
    //   }
    // }
  }
  // getRefReport() {
  //   this.screeningService.getRefCheckReport().subscribe(resp => {
  //     this.refCheckReport = resp;
  //   });
  // }
  getAddressForm(index): UntypedFormGroup {
    const dataArr = this.mainForm.get(this.formgroupName) as UntypedFormGroup;
    return dataArr;
  }
  getCompForm(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  showInsuff() {
    if (!this.hiddenInsuff) {
      this.showInSuff = this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value;
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
  createMisc() {
    if (this.mainForm.contains('miscQuestion')) {
      if (this.mainForm.get('miscQuestion')?.value.length === 0) {
        this.mainForm.removeControl('miscQuestion');
      }
    }
    const question = [{
      miscId: 0,
      miscQuestion: '',
      miscAnswer: '',
      defaultQuestionFlag: false,
    }];
    this.mainForm.addControl('miscQuestion', this.common.initMiscForm(question));
  }
  addCheckChange(data, clearFlag) {
    const typeList = this.screeningService.addressType.length === 3 ? this.screeningService.addressType :
      this.screeningService.addressTypeCheck;
    const addressType = typeList.find(f => f.lookUpId === data);
    if (addressType) {
      this.mainForm.get(this.formgroupName + '.addressTypeCheckLookupName').setValue(addressType.lookUpName);
      if (addressType.lookUpName === 'Current Address') {
        const behaviorAdd = new BehaviorSubject(null);
        this.sameCurrentadd = false;
        this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(false)
        this.address.push(behaviorAdd);
        if (this.currentAddress) {
          if(this.currentAddress.candidate.address!=undefined &&this.mainForm!=undefined){

            const address = this.mainForm.get(this.formgroupName).get('address')?.value;
            const address0 = this.mainForm.get(this.formgroupName).get('address0')?.value
            const addressc =address.length>0?address:address0;
            if(this.currentAddress.candidate.address.addressId>0){
          this.currentAddress.candidate.address.addressId = addressc.addressId;
          if(this.currentAddress.candidate.address.addressPos != null && this.currentAddress.candidate.address.addressPos.length > 0 ){
            this.currentAddress.candidate.address.addressPos[0].addressId = addressc.addressId;
            this.currentAddress.candidate.address.addressPos[0].addressPosId= addressc.addressPos[0].addressPosId;
            this.currentAddress.candidate.address.addressPos[0].screeningCompId = this.mainForm.get('screeningComponentInfo')?.get('screeningCompId')?.value;
          }
            }
          }
          this.address[0].next(this.currentAddress.candidate.address);
         

        }
      } else if (addressType.lookUpName === 'Permanent Address') {
        this.sameCurrentadd = true;

        if (this.mainForm.get(this.formgroupName).get("checkPermanentAddress").value != true) {
           
          if (clearFlag === true) {
         //    this.dropFormRest();
          }
          const behaviorAdd = new BehaviorSubject(null);
          this.address.push(behaviorAdd);
          this.permanentaddressFetch()
         
        }
      } else {
        this.sameCurrentadd = false;
        this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(false)

        if (clearFlag === true) {
          this.dropFormRest();
        }
      }
    }
    for (let i = 0; i < this.mainForm.get('criminalCheckCount')?.value; i++) {
      const frmgroup = this.mainForm.get(this.formgroupName + '.address' + i) as UntypedFormGroup;
      if (i === 0) {
        frmgroup.get('addressTypeLookupId')?.setValue(data);
        frmgroup.get('addressType')?.setValue(addressType.lookUpName);
      } else {
        frmgroup.get('addressTypeLookupId')?.setValue('');
      }
    }
    this.disableAddressType(0);
  }
  permanentaddressFetch() {
    let pList: any[] = [];
    const subList = this.screeningService.componentList ?
      this.screeningService.componentList.filter(x => x.screeningSubComponent.length > 0 && (x.compName === this.common.ADDRESS || x.compName === this.common.ADDRESS_GEO)) : [];
    if (subList.length > 0) {
      pList = subList[0].screeningSubComponent.filter(x => x.subCompName === 'Permanent Address');
    }
    if (this.invitationFlag === true && pList.length > 0 && this.screeningService.compFormArray.value.length > 0) {

         if(this.screeningService.permnAddress!=undefined &&this.mainForm!=undefined){
           
        this.address[0].next(this.screeningService.permnAddress);
           
       }
    }
  }
  // formRest
  dropFormRest() {
    for (let i = 0; i < this.mainForm.get('criminalCheckCount')?.value; i++) {
      this.mainForm.get(this.formgroupName + '.address' + i).reset();
      this.mainForm.get(this.formgroupName + '.address' + i + '.addressId').setValue(0);
     
    }
  }
  //
  addresstypeOption(index): boolean {
    if (index === 0) {
      return true;
    } else {
      const address: any[] = [];
      const criminalCheckCount = this.mainForm.get('criminalCheckCount')?.value;
      for (let i = 0; i < criminalCheckCount; i++) {
        address.push(this.mainForm.get(this.formgroupName + '.address' + i).value);
      }
      return this.screeningService.addressType.some(s => s.addressTypeLookupId === address[0].addressTypeLookupId);
    }
  }
  disableAddressType(ind: any) {
    const address: any[] = [];
    const criminalCheckCount = this.mainForm.get('criminalCheckCount')?.value;
    for (let i = 0; i < criminalCheckCount; i++) {
      const frmgroup = this.mainForm.get(this.formgroupName + '.address' + i) as UntypedFormGroup;
      address.push(frmgroup.get('addressTypeLookupId')?.value);
    }
    this.addressTypeList.map((m, index) => {
      if (ind !== index) {
        m.map((p) => {
          if (p.lookUpId !== 53) {
            address.includes(p.lookUpId) ? p.disabled = true : p.disabled = false;
          } else {
            p.disabled = false;
          }

        });
      }
    });

  }
  //checkbox
  chengeAddress(daata: any) {
    if (daata.checked === true) {
      this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(daata.checked)
      const behaviorAdd = new BehaviorSubject(null);
      this.address.push(behaviorAdd);
      if(this.currentAddress.candidate.address!=undefined &&this.mainForm!=undefined){

            const address = this.mainForm.get(this.formgroupName).get('address')?.value;
            const address0 = this.mainForm.get(this.formgroupName).get('address0')?.value
            const addressc =address.length>0?address:address0;
         if(this.currentAddress.candidate.address.addressId>0){
          this.currentAddress.candidate.address.addressId = addressc.addressId;
          if(this.currentAddress.candidate.address.addressPos != null && this.currentAddress.candidate.address.addressPos.length > 0 ){
            this.currentAddress.candidate.address.addressPos[0].addressId = addressc.addressId;
            this.currentAddress.candidate.address.addressPos[0].screeningCompId = this.mainForm.get('screeningComponentInfo')?.get('screeningCompId')?.value;
          }
            }
          
          this.address[0].next(this.currentAddress.candidate.address);
        }

      
    } else {
      this.mainForm.get(this.formgroupName).get("checkPermanentAddress").setValue(daata.checked)
      this.dropFormRest();
      this.permanentaddressFetch();
      if (this.mainForm.value.compRef.addressTypeCheckLookupName === 'Permanent Address') {
        for (let i = 0; i < this.mainForm.get('criminalCheckCount')?.value; i++) {
          const frmgroup = this.mainForm.get(this.formgroupName + '.address' + i) as UntypedFormGroup;
          if (i === 0) {
            frmgroup.get('addressTypeLookupId')?.setValue(this.mainForm.value.compRef.addressTypeCheckLookupId);
            frmgroup.get('addressType')?.setValue(this.mainForm.value.compRef.addressTypeCheckLookupName);
          } else {
            frmgroup.get('addressTypeLookupId')?.setValue('');
          }
        }
      }
    }
  }
  // if(address[0]===52){
  //   this.checkBoxdis=false
  //   this.addCheckChange(address[0])
  // }
  // else{
  //   this.checkBoxdis=true
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
