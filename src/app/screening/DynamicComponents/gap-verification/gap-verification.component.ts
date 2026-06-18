import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { ScreeningComponentInfo } from 'src/app/common-methods/models/screening-details';
import { User } from 'src/app/common-methods/models/user';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';


@Component({
  standalone: false,
  selector: 'app-gap-verification',
  templateUrl: './gap-verification.component.html',
  styleUrls: ['./gap-verification.component.css']
})
export class GapVerificationComponent implements OnInit, OnChanges {
  compName: any;
  naFlag = false;
  nFlag = false;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() fileBtn: boolean;
  @Input() docList: any;
  @Input() showNotApplicable: boolean;
  @Input() hiddenInsuff: boolean;
  docdata: any[] = [];
  items: SelectItem[] = [];
  screeningComponent = new ScreeningComponentInfo();
  userData = new User();
  showInSuff: boolean;
  screeningMatError: boolean;
  docData: any;
  applicationId: number;
  gapList: any[] = [];
  gapStatusList: any[] = [];
  gapVerList: any[] = [];
  constructor(public screeningService: ScreeningService, public common: CommonService, public fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.showInsuff();
    if (this.mainForm.get('screeningComponentInfo')?.get('insuffRaisedFlag')?.value === true) {
      this.docdata = this.mainForm.get('screeningInsufficiency')?.get('insuffDocument')?.value;
    }
    let compNameList = this.screeningService.componentList.filter(x => x.compId === this.mainForm.value.screeningComponentInfo.compId);
    if (compNameList.length > 0) {
      this.compName = compNameList[0].compName;
    }
    let statusList: any[] = [];
    statusList = this.screeningService.screeningDetail.screeningStatus.filter(x => x.screeningStatus === 'Close - Fake (Verbal Conf Rcvd.)' || x.screeningStatus === 'Close - Gen (Verbal Conf Rcvd.)')
    if (statusList.length > 0) {
      for (let i = 0; i < statusList.length; i++) {
        this.items.push({
          label: statusList[i].screeningStatus, value: statusList[i].statusId
        });
      }
    }
    this.gapverificationDetails();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.compBaseDetails) {
      this.gapList = this.screeningService.gapVerificationTypeList;
    }
    else if( this.screeningService.ClientCategoryId ===4){
      this.gapVerList = this.gapStatusList;
    }
    if(this.screeningService.ClientCategoryId ==4){
      this.mainForm.get('compRef')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
    }
    if (changes.formgroupName) {
      this.screeningMatError = true;
      if (this.screeningService.caseFlagType === this.common.INSUFFCLEARANCE) {
        this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValue(null);
        this.mainForm.get('compRef')?.get('screeningStatusId')?.setValue(null);
      }
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValidators(Validators.required);
      
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      if(this.screeningService.ClientCategoryId !=4){
        this.mainForm.get('compRef')?.get('screeningStatusId')?.setValidators(Validators.required);
        this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
      }
      
    }
  }
  onSelectionChange(event: any) {
    if (event > 0) {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValue(null);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
    }
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
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValue(null);
      this.mainForm.get('compRef')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.setValue(null);
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    } else {
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('compRef')?.get('screeningStatusId')?.setValidators(Validators.required);
      this.mainForm.get('compRef')?.get('screeningStatusId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('requiredLookupId')?.updateValueAndValidity();
      this.mainForm.get('screeningInsufficiency')?.get('levelLookupId')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('raisedDate')?.setValue(null);
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.clearValidators();
      this.mainForm.get('screeningInsufficiency')?.get('screeningStatusId')?.updateValueAndValidity();
    }
  }
  touchValidation(val, controlName) {
    if ((this.mainForm.get(this.formgroupName).get('gapFrom')?.value && val) &&
      this.mainForm.get(this.formgroupName).get(controlName).value < this.mainForm.get(this.formgroupName).get('gapFrom')?.value) {
      this.mainForm.get(this.formgroupName).get(controlName).markAsTouched();
    }
  }
  dateCalc() {
    return this.fb.group({
      UntypedFormGroup: this.mainForm.get(this.formgroupName)
    },
    { validator: this.common.dateCompareFile('gapFrom', 
    'gapTo')  },
  );
  }
  gapverificationDetails() {
    
    this.screeningService.screeningStatusDetails(this.userData.applicationId).subscribe(resp => {
      if (resp) {
        this.gapStatusList = resp.gapVerificationType;
      }
    });
    //gapType Auto Bind
    if(this.screeningService.ClientCategoryId == this.common.techmcatId && this.gapStatusList.length>0){

      for (let i = 0;i<3;i++){
        (this.mainForm.get("gapDetails") as UntypedFormArray).at(i).get('gapType')?.setValue(this.gapStatusList[i].lookUpName);
         (this.mainForm.get("gapDetails") as UntypedFormArray).at(i).get('gapTypeLookupId')?.setValue(this.gapStatusList[i].lookUpId);
      }
    }
  }
  get formArray() {  
    //return  this.mainForm.get('compRef') as UntypedFormArray; 
    return this.mainForm.get('gapDetails') as UntypedFormArray;
  }
   //for Not Provider
   setNotProvideGap( formControl,index) {
    (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get(formControl).setValue('Not Provided');
  }

  

  gapvarificationChange(gapId,index) {
    const gap = this.gapStatusList.find(f => f.lookUpId === gapId);
    if (gap) {
      const gapType = (this.mainForm.get("gapDetails") as UntypedFormArray).value;
      let gapValue = null; 
        for(let i = 0;i<3;i++){          
          gapValue = (this.mainForm.get("gapDetails") as UntypedFormArray).at(i).get('gapTypeLookupId')?.value;
        if(i!=index){           
         if( gapValue != null && gapValue == gapId )
         {
           (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get('gapTypeLookupId')?.setErrors({ incorrect: true });
           return true;
          }else{
            (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get('gapType')?.setValue(gap.lookUpName);
            (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get('gapTypeLookupId')?.setValue(gap.lookUpId);
            (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get('gapTypeLookupId')?.setErrors(null);
          }
        }
      }
    }
  }
  
  handleDateChange(date, controlName) {
    this.mainForm.get(this.formgroupName).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.upperCase(this.mainForm.get(this.formgroupName).get(controlName).value,controlName);
    this.touchValidation(date.value, controlName);
  }
  handleDateChangeChild(date, controlName,index) {
    (this.mainForm.get("gapDetails") as UntypedFormArray).at(index).get(controlName).setValue(new DatePipe('en-Us').transform(date.value, 'dd/MMM/yyyy'))
    this.touchValidationChild(date.value, controlName,index);
  }
  touchValidationChild(val, controlName, index) {
    let gapF = (this.mainForm.get('gapDetails') as UntypedFormArray).at(index).get('gapFrom');
    let gapTo = (this.mainForm.get('gapDetails') as UntypedFormArray).at(index).get('gapTo');
    if (gapTo.value && gapF.value) {
       let Fdate = new Date(gapF.value);
       let Tdate = new Date(gapTo.value);
      if (controlName == 'gapFrom' && Fdate > Tdate) {
        gapF.setErrors({ comparison: true })
        gapF.markAsTouched();
      } else if (controlName == 'gapTo' && Tdate < Fdate) {
        gapTo.setErrors({ comparison: true })
        gapTo.markAsTouched();
      } else {
        gapTo.markAsUntouched();
        gapTo.setErrors({ comparison: false })
        gapF.markAsUntouched();
        gapF.setErrors({ comparison: false });
        gapF.clearValidators();
        gapTo.clearValidators();
        gapF.setErrors(null);
        gapTo.setErrors(null);
      }
    }
  }
  notApplicable(event: any) {
    this.fileBtn = event.checked;
    this.nFlag = true;
  }
  upperCase(val, controlName) {
    val = val.toUpperCase();
    this.mainForm.get(this.formgroupName).get(controlName).setValue(val);
    if(val.includes('NOT PROVIDED') && controlName === "gapFrom") {
      this.mainForm.get(this.formgroupName).get('gapFrom')?.setValue('Not Provided');
    }
    if(val.includes('NOT PROVIDED') && controlName === "gapTo") {
      this.mainForm.get(this.formgroupName).get('gapTo')?.setValue('Not Provided');
    }
  }
  gapChange(gapId: any) {
    const gap = this.screeningService.gapVerificationTypeList.find(f => f.lookUpId === gapId);
    if (gap) {
      this.mainForm.get(this.formgroupName + '.gapType').setValue(gap.lookUpName);
    }
  }
  notProvidevalidation(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('gapFrom')?.setErrors({incorrect : true});
    }
    else if((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('gapFrom')?.setErrors(null);
    }
  }
  notProvide(val: any) {
    if((this.userData.applicationId === 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('gapTo')?.setErrors({incorrect : true});
    }
    else if((this.userData.applicationId !== 3) && (val === 'NOT PROVIDED')) {
      this.mainForm.get(this.formgroupName).get('gapTo')?.setErrors(null);
    }
  }
}
