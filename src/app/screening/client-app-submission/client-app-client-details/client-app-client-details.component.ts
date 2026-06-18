import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray, Form } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { timer } from "rxjs";
import { User } from 'src/app/common-methods/models/user';
@Component({
  standalone: false,
  selector: 'app-client-app-client-details',
  templateUrl: './client-app-client-details.component.html',
  styleUrls: ['./client-app-client-details.component.css']
})
export class ClientAppClientDetailsComponent implements OnInit {

  screeningDetailsGroup: UntypedFormGroup;
  candidateName: string;
  reportSourceName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Input() inputData: UntypedFormGroup;
  @Output() componentChange = new EventEmitter();
  customFiledComponents: any = []
  clientList: any[] = [];
  clientSite: any[] = [];
  clientComponents: any[] = [];
  clientVendors: any[] = [];
  casePriorities: any[] = [];
  caseStatus: any[] = [];
  compList: any[] = [];
  hasHaveSiteforClient = false;
  isDisabled = true;
  isCtsdisable=true;
  enableDOJ = false;
  private emailValidators: any[] = [];
  userData = new User();
  alreadyEx = '';
  subCompObj = {
    subCompId: 0,
    subCompShortName: null,
    subCompName: '',
    subCompDesc: '',
    currencyId: 0,
    deqcFlag: null,
    compId: 0,
    noOfComponent: 1,
    componentCustomFields: [],
  };
  compObj = {
    compDesc: '',
    compId: 0,
    compName: '',
    compType: '',
    currencyId: 0,
    componentCustomFields: [],
    criminalCheckCount: 1,
    cvValidationFields: [],
    deqcFlag: false,
    instruction: '',
    noOfComponent: 1,
    question: [],
    screeningSubComponent: [],
    caseSubComponent: [],
    subCompFlag: false,
  };
  constructor(public common: CommonService, public screeningService: ScreeningService, private message: MessageService,
    private fb: UntypedFormBuilder) {
    }
    ngOnInit() {
      this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.enableDOJ = this.screeningService.EnableClientDOJ;
      this.isCtsdisable= this.screeningService.ClientCategoryId === 3 || this.screeningService.ClientCategoryId === 4 ? false :true;
      this.mainForm.get(this.formgroupName + '.caseStatusId')?.disable();
    }
    getCompSiteDetails() {
      this.alreadyEx = '';
      this.clientSite = [];
      this.compList = [];
      if (this.mainForm.get('candidate')?.get('clientId')?.value > 0) {
        this.screeningService.getScreeningClientDetails(this.mainForm.get('candidate')?.get('clientId')?.value).subscribe(resp => {
          if (resp) {
            this.clientSite = resp.site;
            this.casePriorities = resp.casePriority;
            this.caseStatus = resp.caseStatus;
            if (this.mainForm.get('screening.caseStatusId')?.value === null) {
              const status = this.caseStatus.find(x => x.lookUpName.toLowerCase() === 'open').lookUpId;
              this.mainForm.get('screening.caseStatusId')?.setValue(status);
            }
            if (this.mainForm.get('screening.casePeriorityId')?.value === null) {
              const priority = this.casePriorities.find(x => x.lookUpName.toLowerCase() === 'normal case').lookUpId;
              this.mainForm.get('screening.casePeriorityId')?.setValue(priority);
            }
            if(this.screeningService.screeningdata.clientCustomFields.length>0){
              this.initclientCustomFieldsForm(this.screeningService.screeningdata.clientCustomFields);
            }else{
              this.initclientCustomFieldsForm(resp.clientCustomFields);
            }


            this.compList = resp.component;
            this.alreadyEx = resp.clientReferenceNo;
            this.common.clientRefNoPrefix = resp.clientReferenceNo;
            this.hasHaveSiteforClient = resp.siteFlag;
            if (this.hasHaveSiteforClient === false) {
              setTimeout(() => {
                this.mainForm.get('screening.siteName')?.setValue(null);
                this.mainForm.get('screening.siteName')?.disable();
                this.mainForm.get('screening.siteName')?.clearValidators();
              }, 0);
            } else {
              setTimeout(() => {
                this.mainForm.get('screening.siteName')?.enable();
              }, 0);
            }

          }
        });
      } else {
        this.mainForm.get('screening.clientName')?.setValue('');
      }
    }

    getformgroup(): UntypedFormGroup {
      return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
    }
    showTopCenter(level: string, info: string, message: string) {
      this.message.add({ severity: level, summary: info, detail: message });
    }
    isExist() {
      if (this.mainForm.get(this.formgroupName).get('chargeCode')?.valid) {
        this.screeningService.checkChargeCode(this.mainForm.get(this.formgroupName).get('chargeCode')?.value,
        this.mainForm.get(this.formgroupName).get('clientId')?.value,
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.value).subscribe(e => {
          if (e) {
            this.mainForm.get(this.formgroupName).get('chargeCode')?.setErrors({ exist: true });
          } else {
            this.mainForm.get(this.formgroupName).get('chargeCode')?.setValidators(Validators.required);
          }
        });
      }
    }
    isApplicantidExist() {
      if (this.mainForm.get(this.formgroupName).get('applicantId')?.valid) {
        this.screeningService.checkScreeningApplicantId(this.mainForm.get(this.formgroupName).get('applicantId')?.value,
        this.mainForm.get(this.formgroupName).get('clientId')?.value,
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.value).subscribe(e => {
          if (e) {
            this.mainForm.get(this.formgroupName).get('applicantId')?.setErrors({ exist: true });
          } else {
            this.mainForm.get(this.formgroupName).get('applicantId')?.setValidators(Validators.required);
          }
        });
      }
    }
    checkRefNum(val: any) {
      if (val && this.common.clientRefNoPrefix) {
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.setValidators(Validators.pattern(/(^[1-9]\d{0,8}$)/));
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.updateValueAndValidity();
      } else {
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.setErrors(null);
      }
    }
    initclientCustomFieldsForm(fieadData: any) {
      const cunstomFiedFrom = this.mainForm.get(this.formgroupName) as UntypedFormGroup;
      if (fieadData) {
        const arr = cunstomFiedFrom.get('clientCustomFields') as UntypedFormArray;
        if (arr.length == 0) {
          if (fieadData.length > 0) {
            for (let i = 0; fieadData.length > i; i++) {
              const data = fieadData[i];
              arr.push(this.customFiled(data));
            }
          }
        }
        return arr;
      }
    }
    customFiled(data): UntypedFormGroup {
      return new UntypedFormGroup({
        clientCustomFieldId: new UntypedFormControl(data.clientCustomFieldId),
        fieldName: new UntypedFormControl(data.fieldName),
        fieldType: new UntypedFormControl(data.fieldType),
        fieldValue: new UntypedFormControl(data.fieldValue, data.mandatoryFlag ? Validators.required : null),
        screeningClientCustomFieldId: new UntypedFormControl(data.screeningClientCustomFieldId),
        fieldTypeLookupId: new UntypedFormControl(data.fieldTypeLookupId),
        mandatoryFlag: new UntypedFormControl(data.mandatoryFlag),
        reportFlag: new UntypedFormControl(data.reportFlag),
        screeningCompId: new UntypedFormControl(data.screeningCompId),
        screeningId: new UntypedFormControl(data.screeningId),
      });
    }
  }

