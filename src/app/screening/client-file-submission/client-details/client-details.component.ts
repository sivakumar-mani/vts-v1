import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { User } from 'src/app/common-methods/models/user';

@Component({
  standalone: false,
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  screeningDetailsGroup: UntypedFormGroup;
  candidateName: string;
  reportSourceName: string;
  @Input() mainForm: UntypedFormGroup;
  @Input() formgroupName: string;
  @Output() componentChange = new EventEmitter();

  // clientControls!: AutoCompleteDropDown;
  // siteControls!: AutoCompleteDropDown;
  // componentControls!: AutoCompleteDropDown;
  clientList: any[] = [];
  clientSite: any[] = [];
  clientComponents: any[] = [];
  clientVendors: any[] = [];
  casePriorities: any[] = [];
  caseStatus: any[] = [];
  compList: any[] = [];
  hasHaveSiteforClient = false;
  isDisabled = true;
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
    this.mainForm.get(this.formgroupName + '.clientRefNo').valueChanges
      .subscribe(value => {
        // if (value) {
        if (this.screeningService.caseFlagType === this.common.NEWCASE) {
          // this.mainForm.get(this.formgroupName + '.clientRefNo').setValidators(
          //   this.emailValidators.concat(Validators.pattern(/^(0|[1-9][0-9]*)$/),
          //     this.emailValidators.concat(Validators.required)));
        }
        // }
      });
    // this.initscreening();
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.clientControls =
    //   new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
    //     '', this.mainForm.get('screening') as UntypedFormGroup, false, false, true);
    // this.siteControls =
    //   new AutoCompleteDropDown('Site Name', 'siteName', 'siteName', 'siteName', this.clientSite,
    //     '', this.mainForm.get('screening') as UntypedFormGroup, false, false,
    //     (this.screeningService.caseFlagType === this.common.NEWCASE && this.hasHaveSiteforClient) ? true : false);
    // this.getClientList();
    this.getCompSiteDetails(this.mainForm.get(this.formgroupName).get('clientId')?.value);
    this.mainForm.get(this.formgroupName + '.caseStatusId')?.disable();
  }
  // getClientList() {
  //   this.screeningService.getClientList().subscribe(resp => {
  //     if (resp) {
  //       this.clientList = resp;
  //       this.clientControls =
  //         new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientList,
  //           '', this.mainForm.get(this.formgroupName) as UntypedFormGroup, false, false, true);
  //     }
  //   });
  // }
  getCompSiteDetails(clientId: any) {
    // this.mainForm.get('screening.component')?.setValue('');
    // this.mainForm.get('screening.siteName')?.setValue('');
    // this.mainForm.get('screening.clientRefNo')?.setValue('');
    // this.mainForm.get('screening.component')?.markAsUntouched();
    // this.mainForm.get('screening.siteName')?.markAsUntouched();
    // this.mainForm.get('screening.clientRefNo')?.markAsUntouched();
    const cunstomFiedFrom = this.mainForm.get('screening') as UntypedFormGroup;
    this.screeningService.clientId = clientId;
    // cunstomFiedFrom.removeControl('clientCustomFields');
    this.alreadyEx = '';
    this.clientSite = [];
    this.compList = [];
    if (clientId > 0) {
      if (this.clientList.length > 0) {
        this.mainForm.get('screening.clientName')?.setValue(this.clientList.find(f => f.clientId === clientId).clientName);
      }
      this.screeningService.getScreeningClientDetails(clientId).subscribe(resp => {
        if (resp) {
          this.clientSite = resp.site;
          this.casePriorities = resp.casePriority;
          this.caseStatus = resp.caseStatus;
          this.compList = resp.component;
          this.alreadyEx = resp.clientReferenceNo;
          this.common.clientRefNoPrefix = resp.clientReferenceNo;
          this.hasHaveSiteforClient = resp.siteFlag;
          // cunstomFiedFrom.addControl('clientCustomFields', this.initclientCustomFieldsForm(
          //   resp.clientCustomFields));
          // this.siteControls =
          //   new AutoCompleteDropDown('Site Name', 'siteName', 'siteName', 'siteName', this.clientSite,
          //     '', this.mainForm.get('screening') as UntypedFormGroup, false, false,
          //     this.hasHaveSiteforClient);
          if (this.hasHaveSiteforClient === false ) {
            setTimeout(() => {
              this.mainForm.get('screening.siteName')?.setValue(null);
              this.mainForm.get('screening.siteName')?.disable();
              this.mainForm.get('screening.siteName')?.clearValidators();
            }, 0);
          } else {
            setTimeout(() => {
              this.mainForm.get('screening.siteName')?.enable();
              // this.mainForm.get('screening.siteNo')?.enable();
              // this.mainForm.get('screening.siteName')?.setValidators(Validators.required);
            }, 0);
          }
          if (this.mainForm.get('screening.caseStatusId')?.value === null) {
            const status = this.caseStatus.find(x => x.lookUpName.toLowerCase() === 'open').lookUpId;
            this.mainForm.get('screening.caseStatusId')?.setValue(status);
          }
          if (this.mainForm.get('screening.casePeriorityId')?.value === null) {
            const priority = this.casePriorities.find(x => x.lookUpName.toLowerCase() === 'normal case').lookUpId;
            this.mainForm.get('screening.casePeriorityId')?.setValue(priority);
          }
        }
      });
    } else {
      this.mainForm.get('screening.clientName')?.setValue('');
      // this.mainForm.get('screening.component')?.setValue('');
      // this.mainForm.get('screening.siteName')?.setValue('');
      // this.mainForm.get('screening.clientRefNo')?.setValue('');
      // this.alreadyEx = '';
    }
  }
  getformgroup(): UntypedFormGroup {
    return this.mainForm.get(this.formgroupName) as UntypedFormGroup;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  // compSelectionChange(event: any) {
  //   console.log('select', event.value);
  //   let selectedCompo: any[] = [];
  //   const fdata: any[] = [];
  //   selectedCompo = Object.assign([], event.value);
  //   if (selectedCompo.length > 0) {
  //     selectedCompo.map(element => {
  //       this.compObj = {
  //         compDesc: '',
  //         compId: element.compId,
  //         compName: element.compName,
  //         compType: '',
  //         componentCustomFields: element.componentCustomFields,
  //         criminalCheckCount: 1,
  //         currencyId: element.currencyId,
  //         cvValidationFields: [],
  //         deqcFlag: element.deqcFlag,
  //         instruction: '',
  //         noOfComponent: 1,
  //         question: [],
  //         screeningSubComponent: [],
  //         caseSubComponent: [],
  //         subCompFlag: element.subCompFlag,
  //       };
  //       if (element.subCompFlag) {
  //         const flag = fdata.some(s => s.compId === element.compId);
  //         this.subCompObj = {
  //           subCompId: element.subCompId,
  //           subCompShortName: element.subCompShortName,
  //           subCompName: element.subCompName,
  //           currencyId: element.currencyId,
  //           subCompDesc: element.subCompDesc,
  //           deqcFlag: element.deqcFlag,
  //           compId: element.compId,
  //           componentCustomFields: element.componentCustomFields,
  //           noOfComponent: 1
  //         };
  //         if (!flag) {
  //           const obj1 = this.compList.find(f => f.compId === element.compId);
  //           this.compObj.compName = obj1.compName;
  //           this.compObj.screeningSubComponent.push(this.subCompObj);
  //           this.compObj.caseSubComponent.push(this.subCompObj);
  //           fdata.push(this.compObj);
  //         } else {
  //           fdata.map(s => {
  //             if (s.compId === element.compId) {
  //               s.screeningSubComponent.push(this.subCompObj);
  //             }
  //           });
  //         }
  //       } else {
  //         fdata.push(this.compObj);
  //       }
  //     });
  //   }
  //   this.screeningService.componentList = fdata;
  //   console.log('this.screeningService.componentList', this.screeningService.componentList);
  //   this.componentChange.emit();
  // }
  isExist() {
    if (this.mainForm.get(this.formgroupName).get('chargeCode')?.valid) {
      this.screeningService.checkChargeCode(this.mainForm.get(this.formgroupName).get('chargeCode')?.value,
        this.mainForm.get(this.formgroupName).get('clientId')?.value,
        this.mainForm.get(this.formgroupName).get('clientRefNo')?.value).subscribe(e => {
          if (e) {
            this.mainForm.get(this.formgroupName).get('chargeCode')?.setErrors({ exist: true });
            // this.showTopCenter('warn', 'Exist', e.message);
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
            // this.showTopCenter('warn', 'Exist', e.message);
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
    if (fieadData) {
      const arr = this.fb.array([]);
      if (fieadData.length > 0) {
        for (let i = 0; fieadData.length > i; i++) {
          const data = fieadData[i];
          arr.push(this.customFiled(data));
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
    });
  }
}

