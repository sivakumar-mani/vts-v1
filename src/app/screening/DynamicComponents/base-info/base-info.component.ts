import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { User } from 'src/app/common-methods/models/user';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.css']
})
export class BaseInfoComponent implements OnInit, OnChanges {
  header: string;
  stflag:boolean;
  componentFormGroup: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() compBaseDetails: any;
  @Input() showNotApplicable = false;
  @Input() inputText: string;
  @Output() emitNotappChange = new EventEmitter<any>();
  @ViewChild('remarks1') remarks1: ElementRef;
  // @ViewChild('remarks1', { static: true }) remarks1: ElementRef;

  clientVendorsControl!: AutoCompleteDropDown;
  clientCurrencyControl!: AutoCompleteDropDown;
  ownerControl!: AutoCompleteDropDown;
  screeningPriority: any[] = [];
  screeningStatus: any[] = [];
  baseInfo: any;
  insuffDocArr: any;
  userData = new User();
  screeningStatusList: any[] = [];
  currencylist: any[] = [];
  caseType: any[] = [];
  caseCountry: any[] = [];
  ownerList: any[] = [];
  constructor(public screeningService: ScreeningService, public fb: UntypedFormBuilder, public common: CommonService,
    private message: MessageService, private cdRef: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
     if (changes) {
      this.baseInfo = this.compBaseDetails;

     const screeningForm = this.mainForm.get('screeningComponentInfo');
     if (screeningForm.get('reportSource')?.value === null||  (this.common.candidateName && this.common.NEWCASE)) {
      this.candidate();
    }
    
     if (this.baseInfo && this.userData.applicationId !=3 ) {
        this.screeningService.vendorList = this.baseInfo.vendor;
        this.currencylist = this.baseInfo.currency;
        const formValue = this.mainForm.getRawValue();
        if (formValue.screeningComponentInfo && formValue.screeningComponentInfo.screeningCompId === 0) {
          this.screeningStatusList = this.baseInfo.screeningStatus;
          if (this.mainForm.get('screeningComponentInfo.screenStatusId')?.value === 0) {
            const statusId = this.baseInfo.screeningStatus.find(x => x.screeningStatus.toLowerCase() === 'open').statusId;
            this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
          }

        } else {
          this.screeningStatusList = this.baseInfo.screeningStatus;
          if (this.mainForm.get('screeningComponentInfo.screenStatusId')?.value === 0) {
            const statusId = this.baseInfo.screeningStatus.find(x => x.screeningStatus.toLowerCase() === 'open').statusId;
            this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
          }
        }
        if (this.mainForm.get('screeningComponentInfo.priorityId')?.value === 0) {
          const priorityId = this.baseInfo.screeningPriority.find(x => x.lookUpName.toLowerCase() === 'normal').lookUpId;
          this.mainForm.get('screeningComponentInfo.priorityId')?.setValue(priorityId);
        }

        const screeningForm = this.mainForm.get('screeningComponentInfo');
        if (screeningForm.get('reportSource')?.value === null) {
          this.candidate();
        }

        this.clientVendorsControl =
          new AutoCompleteDropDown('Vendor Name', 'vendorId', 'vendorId', 'vendorName', this.screeningService.vendorList,
            '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, false, 'outline');

        this.clientCurrencyControl =
          new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencylist,
            '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, false, 'outline');
            if(this.baseInfo && (this.baseInfo.veOwner && this.baseInfo.veOwner.length > 0) && (this.screeningService.caseFlagType === this.common.NEWCASE ||
              (this.mainForm.value.screeningComponentInfo &&this.mainForm.value.screeningComponentInfo.ownerId > 0))) {
            this.ownerList = this.baseInfo.veOwner;
            this.ownerList.map(m => m.screeningOwnerFName = m.screeningOwnerFName + ' ' + (m.screeningOwnerMName ? m.screeningOwnerMName : '') + ' ' + 
            (m.screeningOwnerLName ? m.screeningOwnerLName : ''));
          this.ownerControl =
            new AutoCompleteDropDown('Owner Name', 'ownerId', 'screeningOwnerId', 'screeningOwnerFName', this.ownerList,
              '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, true, 'outline');
        }
        if((formValue.screeningComponentInfo.screeningCompId === 0 && this.screeningService.compData.compName === this.common.EDUCATION) ||(formValue.screeningComponentInfo.screeningCompId === 0 && this.screeningService.compData.compName === this.common.EMPLOYMENT_HR)) {
          this.screeningStatusList = this.baseInfo.screeningStatus;
        } else {
          if(formValue.screeningComponentInfo && formValue.screeningComponentInfo.screeningCompId === 0) {
          this.screeningStatusList = this.baseInfo.screeningStatus.filter(m => m.screeningStatus !== 'For Research' && m.screeningStatus !== 'CE HOLD');
        } else {
          this.screeningStatusList = this.baseInfo.screeningStatus;
        }
      }
        const form = this.mainForm.get('screeningComponentInfo');
        if (form?.get('insuffRaisedFlag')?.value === true) {
        this.screeningStatusList = this.baseInfo.screeningStatus;
      }
        if (form.get('insuffRaisedFlag')?.value === false && (this.screeningService.caseFlagType === this.common.PREQCREJECT)) {        
        const statusId = this.baseInfo.screeningStatus.find(x => x.screeningStatus.toLowerCase() === 'open').statusId;
        this.mainForm.get('screeningComponentInfo.screenStatusId')?.setValue(statusId);
      }
      }
    }
  }
  ngOnInit() {
    this.stflag = true;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.mainForm.get(this.formgroupName + '.screenStatusId')?.disable();
    this.componentFormGroup = this.mainForm.get('component') as UntypedFormGroup;
    this.clientVendorsControl =
      new AutoCompleteDropDown('Vendor Name', 'vendorId', 'vendorId', 'vendorName', this.screeningService.vendorList,
        '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, false, 'outline');
    this.clientCurrencyControl =
      new AutoCompleteDropDown('Currency', 'currencyId', 'currencyId', 'currencyShortName', this.currencylist,
        '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, false, 'outline');
    if (this.baseInfo && (this.baseInfo.veOwner && this.baseInfo.veOwner.length > 0) && (this.screeningService.caseFlagType === this.common.NEWCASE ||
      (this.mainForm.value.screeningComponentInfo && this.mainForm.value.screeningComponentInfo.ownerId > 0))) {
      this.ownerControl =
        new AutoCompleteDropDown('Owner Name', 'ownerId', 'screeningOwnerId', 'screeningOwnerFName', this.ownerList,
          '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, true, 'outline');
    }
    // if (this.screeningService.clientId > 0) {
    //   this.getClientDetails(this.screeningService.clientId);
    // }
    if (this.userData.applicationId === 3 && this.inputText) {
      this.header = this.inputText;
    }
    if (this.userData.applicationId === 3 && !this.inputText) {
      this.header = 'Not Applicable';
    } if (this.userData.applicationId !== 3) {
      this.header = 'Cancel';
    }
    const screeningForm = this.mainForm.get('screeningComponentInfo');
    if (screeningForm.get('reportSource')?.value === null||  (this.common.candidateName && this.common.NEWCASE)) {
     this.candidate();
   }

    if (!screeningForm.get('vendorId')?.value ) {
      
      const vName =this.screeningService.screeningDetail.vendor.filter(x => x.vendorName === 'Krya Screening Private Limited');
      if (vName.length > 0) {
        this.mainForm.get(this.formgroupName + '.vendorId').setValue(vName[0].vendorId);
      }
    }
    if (this.screeningService.compData.compName.toUpperCase() === this.common.EMPLOYMENT_HR && this.mainForm.value && this.mainForm.value.screeningComponentInfo) {
      this.notApplicable({ checked: this.mainForm.value.screeningComponentInfo.notApplicableFlag });
    }
  }
  cancelDisable() {
    let flag = false;
    if (this.screeningService.compData.compName.toLowerCase() === this.common.EMPLOYMENT_HR.toLowerCase()) {
      const list = this.screeningService.compFormArray.value.find(w => w.compId == this.screeningService.compData.compId);
      if (list && list.component && (list.component.some(s => s.compRef && s.compRef.fresherFlag && s.compRef.fresherFlag === true))) {
        flag = true;
      }
    }
    return flag;
  }
  candidate() {
    const screeningForm = this.mainForm.get('screeningComponentInfo');
    if (this.screeningService.caseFlagType === this.common.NEWCASE) {
      screeningForm.get('reportSource')?.setValue(this.common.candidateName);
    } else {
      if (this.screeningService.caseSubmissionList) {
        const firstName = this.screeningService.caseSubmissionList.candidate.aliasFirstName
        const middleName = this.screeningService.caseSubmissionList.candidate.aliasMiddleName
        const lastName = this.screeningService.caseSubmissionList.candidate.aliasLastName
        screeningForm.get('reportSource')?.setValue(firstName + " " + middleName + " " + lastName);
      }
    }
  }
  // getClientDetails(clientId: any) {
  //   this.screeningService.getScreeningClientDetails(clientId).subscribe(resp => {
  //     if (resp) {
  //       this.caseCountry = resp.caseCountry;
  //       this.caseType = resp.caseType;
  //     }
  //   });
  // }
  notApplicable(event: any) {
    this.emitNotappChange.emit(event);

    if (event.checked) {
      this.mainForm.get(this.formgroupName + '.remark').setValidators(Validators.required);
      this.mainForm.get(this.formgroupName + '.remark').enable();

      setTimeout(() => {
        this.remarks1.nativeElement.focus();
      }, 50);
      this.mainForm.get('active')?.setValue(true);

      // if (!this.mainForm.disabled) {
      setTimeout(() => {
        const screeningForm = this.mainForm.get('screeningComponentInfo');
        // setTimeout(() => {
        const compRefDetailForm = this.mainForm.get('compRefDetail');
        const miscForm = this.mainForm.get('miscQuestion');
        const customFields = this.mainForm.get('componentCustomFields');
        const gapDetails = this.mainForm.get('gapDetails');
        this.mainForm.get('compRef')?.disable();
        this.mainForm.get('screeningInsufficiency')?.disable();
        screeningForm.get('priorityId')?.disable();
        screeningForm.get('compInitiationDate')?.disable();
        screeningForm.get('componentDocument')?.disable();
        screeningForm.get('requestedDate')?.disable();
        screeningForm.get('reportSource')?.disable();
        screeningForm.get('insuffRaisedFlag')?.disable();
        screeningForm.get('screenStatusId')?.disable();
        screeningForm.get('screeningId')?.disable();
        screeningForm.get('vendorId')?.disable();
        // screeningForm.get('remark')?.disable();
        screeningForm.get('currencyId')?.disable();
        screeningForm.get('countryTypeLookUpId')?.disable();
        screeningForm.get('caseTypeLookUpId')?.disable();
        if (compRefDetailForm) {
          this.mainForm.get('screeningComponentInfo')?.get('screeningStatusId')?.disable();
          this.mainForm.get('compRefDetail')?.disable();
        }
        if (gapDetails) {
          this.mainForm.get('gapDetails')?.disable();
        }
        if (miscForm) {
          this.mainForm.get('miscQuestion')?.disable();
        }
        if (customFields) {
          this.mainForm.get('componentCustomFields')?.disable();
        }
        this.cdRef.detectChanges();
      }, 0);
      if(this.mainForm.value.screeningComponentInfo){
      if(this.mainForm.value.screeningComponentInfo.notApplicableFlag === true) {
        this.mainForm.controls['screeningComponentInfo']['controls']['componentDocument'].clearValidators();
        this.mainForm.controls['screeningComponentInfo']['controls']['componentDocument'].updateValueAndValidity();
      }}
    } else {
      this.mainForm.get('active')?.setValue(false);
      this.mainForm.get(this.formgroupName + '.remark').clearValidators();
      this.mainForm.get(this.formgroupName + '.remark').disable();
      // if (!this.mainForm.enabled) {
      setTimeout(() => {
        this.mainForm.enable();
        if (this.mainForm.controls.compRef.value.statementFrom === null && this.mainForm.controls.compRef.value.fromDate === null || this.mainForm.controls.compRef.value.statementFrom === null && this.mainForm.controls.compRef.value.fromDate === 'NOT PROVIDED') {
          this.mainForm.controls.compRef.get('statementFrom')?.disable();
          this.mainForm.controls.compRef.get('statementTo')?.disable();
        }
        else {
          this.mainForm.enable();
        }
        this.mainForm.get(this.formgroupName + '.screenStatusId')?.disable();
        this.cdRef.detectChanges();
      }, 0);
      // }
    }
  }
  checkScreeningId(value: any) {
    if (this.screeningService.compFormArray.length > 0) {
      const nullList: any[] = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.screeningService.compFormArray.value.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.screeningService.compFormArray.value[i].component.length; j++) {
          const Id = this.screeningService.compFormArray.value[i].
            component[j].screeningComponentInfo.clientScreeningId;
          nullList.push(Id);
        }
      }
      const idList = nullList.filter(x => x !== null);
      if (idList.length > 1) {
        const checkFlag = idList.filter(f => f === value).length > 1;
        if (checkFlag) {
          this.mainForm.get(this.formgroupName + '.clientScreeningId').setErrors({ incorrect: true });
        }
      }
    }
    this.screeningService.checkClientScreeningId(value, this.screeningService.clientId).subscribe(resp => {
      if (resp === true) {
        this.mainForm.get(this.formgroupName + '.clientScreeningId').setErrors({ incorrect: true });
      }
    });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
}

