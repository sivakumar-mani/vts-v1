import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, TemplateRef } from '@angular/core';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from '../../common-methods/services/auth.service';
// tslint:disable-next-line:import-spacing
import {
  SaveClientEntry, AgreementDocument, ClientAgreement, ClientEntry,
  ClientFeeDocumentVm, ClientNoFeeApprovalVm, AccessClient
} from 'src/app/common-methods/models/agentEntryMaster';
import { clientFeeApproval, ComponentEntryComponent } from './component-entry/component-entry.component';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
// **Added for Nodemail** //
// import { MailTemplate, MailData, MailAttachment } from 'src/app/common-methods/mail-templates/mail-template';
// import { MasterService } from 'src/app/common-methods/services/master.service';
@Component({
  standalone: false,
  selector: 'app-agent-entry-master',
  templateUrl: './agent-entry-master.component.html',
  styleUrls: ['./agent-entry-master.component.css'],
})
export class AgentEntryMasterComponent implements OnInit, AfterViewInit {
  step1 = 0;
  notifyid: number;
  contactid = 0;
  ownerid = 0;
  emailid = 0;
  clientEntry: any;
  agreementEntry: any;
  clientMailId: any;
  instruction: any;
  phone: any;
  hide: boolean;
  @ViewChild('stepper1', { static: true }) stepper: MatStepper;
  // @ViewChild('clientEntryComp', { static: true }) clientEntryComponent: ClientEntryComponent;

  countryList: any[] = [];
  clientEntryForm: UntypedFormGroup;
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;

  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  filedname = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'status', header: 'Status', value: true, disabled: true },
    { field: 'country', header: 'Country', value: true, disabled: true },
    { field: 'state', header: 'State', value: true, disabled: true },
    { field: 'city', header: 'City', value: true },
    { field: 'dssiOwner', header: 'Account Manager', value: true, disabled: true },
    { field: 'active', header: 'Active', value: true },
  ];
  // { field: 'pdfpassword', header: 'Pdf Password', value: true, disabled: true }
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  @ViewChild('userNameTrigger', { static: true }) userNameTrigger: MatMenuTrigger;
  @ViewChild('firstNameTrigger', { static: true }) firstNameTrigger: MatMenuTrigger;
  @ViewChild('lastNameTrigger', { static: true }) lastNameTrigger: MatMenuTrigger;
  @ViewChild('designationTrigger', { static: true }) designationTrigger: MatMenuTrigger;
  @ViewChild('componentNameTrigger', { static: true }) componentNameTrigger: MatMenuTrigger;
  @ViewChild('actionTrigger', { static: true }) actionTrigger: MatMenuTrigger;
  @ViewChild('PDFPasswordDialog', { static: true }) PDFPasswordDialog: TemplateRef<any>;

  statusFormCtrl = new UntypedFormControl();
  statusFilteredOptions: Observable<string[]>;
  @ViewChild('statusTrigger', { static: true }) statusTrigger: MatMenuTrigger;

  agentNameListControl = new UntypedFormControl();
  agentNameListFilteredOptions: Observable<string[]>;
  countryListControl = new UntypedFormControl();
  countryListFilteredOptions: Observable<string[]>;
  stateListListControl = new UntypedFormControl();
  stateListListFilteredOptions: Observable<string[]>;
  cityListListControl = new UntypedFormControl();
  cityListListFilteredOptions: Observable<string[]>;
  dssiOwnerListControl = new UntypedFormControl();
  dssiOwnerListFilteredOptions: Observable<string[]>;
  passwordCtrl = new UntypedFormControl();
  sendCrtFlag = new UntypedFormControl();
  crtSendFlag = false;
  clientid = 0;
  mode = 'AddClient'; // SearchClient AddClient
  // pathParameters: string[];
  routePath = 'Client / Client Creation';
  breadcrumbFlags = new BreadcrumbFlags();
  // pathParameters: string[];
  message: any;
  name: string;
  errormsg: string;
  prevIndex: number;
  updateValue: any;
  screenAuth: any = {};
  snackBarConfig = new MatSnackBarConfig();
  filednames: any[];
  dialogRef: any;
  @ViewChild('componentEntryPage', { static: true }) componentEntryPage: ComponentEntryComponent;
  stepperFlag: number;
  clientAgreementData = new ClientAgreement();
  agreementDocumentList: AgreementDocument[] = [];
  passwordData: any;
  userData: any;
  currencyList: any;
  pwdFlag = false;
  // ** Added for Nodemail** //
  // mailDocList: any[] = [];
  // mailAgreementDocList: any[] = [];
  // mailTATDocList: any[] = [];
  // completeFlag: boolean;
  // clientPassword: any;
  //////
  // tslint:disable-next-line:max-line-length
  constructor(public agentEntryMasterService: AgentEntryMasterService, public commonService: CommonService,
    // tslint:disable-next-line:align
    private sharedService: SharedService, private common: CommonService,
    // tslint:disable-next-line: align
    public scrollToError: ScrollToErrorDirective,
    // tslint:disable-next-line:align
    public dialog: MatDialog, private router: Router, private auth: AuthService, ) {
    this.commonService.screenTitle = 'AddClient';
  }

  ngOnInit() {
    this.common.breadcrumbFlag.btnSave = false;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getAgentDetails();
    this.getCurrencyList();
    this.filednames = this.filedname.filter(e => e.disabled);
  }

  getCurrencyList() {
    this.agentEntryMasterService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currencyList = res;
        this.currencyList.forEach(element => {
          element.currencyShortName = element.countryName + ' - ' + element.currencyShortName;
        });
      }
    });
  }
  ngAfterViewInit() {
    this.stepperChange(0);
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
    if (data.length > 0) {
      data[index].classList.add('active');
      data[index].classList.add('completed');
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
          data[i].classList.add('active');
        } else {
          data[i].classList.remove('active');

        }
      }
    }
  }
  closeClient() {
    this.mode = 'AddClient';
    this.currentPage = 1;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.genAutoCompleteFilter();
  }
  editOpen(data: any) {
    this.mode = 'SearchClient';
    this.agreementDocumentList = [];
    this.agentEntryMasterService.documentValidation = true;
    this.agentEntryMasterService.documentTAT = true;
    this.agentEntryMasterService.agreementDocumentList = [];
    this.agentEntryMasterService.tempClientFeeDocumentList = [];
    this.agentEntryMasterService.tempClientTATDocumentList = [];
    this.agentEntryMasterService.resetFormGroup();
    this.agentEntryMasterService.clientEntryForm.reset();
    this.agentEntryMasterService.componentEntryForm.reset();
    this.agentEntryMasterService.clientInstructionFormGroup.reset();
    this.agentEntryMasterService.agreementDetailsForm.reset();
    this.agentEntryMasterService.clientMailIdForm.reset();
    // ** Added for Nodemail**//
    // this.completeFlag = data.completeFlag;
    setTimeout(() => {
      this.breadcrumbFlags.btnSaveDisabled = false;
      // this.breadcrumbFlags.toolTip = 'Update';
      if (data.completeFlag === true) {
        this.breadcrumbFlags.toolTip = 'Update';
      } else {
        this.breadcrumbFlags.toolTip = 'Save';
      }
      this.breadcrumbFlags = this.common.breadcrumbFlags();
      this.step1 = 0;
      this.stepperChange(0);
    }, 5);
  }

  openAgentEntryForm() {
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.mode = 'SearchClient';
    this.breadcrumbFlags.btnSaveDisabled = false;
    this.agentEntryMasterService.resetFormGroup();
    this.agentEntryMasterService.clientEntryForm.reset();
    this.agentEntryMasterService.componentEntryForm.reset();
    this.agentEntryMasterService.clientInstructionFormGroup.reset();
    this.agreementDocumentList = [];
    this.agentEntryMasterService.agreementDocumentList = [];
    this.agentEntryMasterService.clientFeeApprovalEmail = [];
    this.agentEntryMasterService.clientTATApprovalEmail = [];
    this.agentEntryMasterService.tempClientFeeDocumentList = [];
    this.agentEntryMasterService.tempClientTATDocumentList = [];
    this.agentEntryMasterService.clientFeePreApprovalEmail = [];
    this.agentEntryMasterService.clientFeePreApprovalEmailList = [];
    this.agentEntryMasterService.clientTATPreApprovalEmail = [];
    this.agentEntryMasterService.clientTATPreApprovalEmailList = [];
    this.agentEntryMasterService.agreementDetailsForm.reset();
    this.agentEntryMasterService.clientMailIdForm.reset(); /*Future Use---20-08-2019*/
    this.agentEntryMasterService.clientid = 0;
    this.agentEntryMasterService.documentValidation = true;
    this.agentEntryMasterService.documentTAT = true;
    this.agentEntryMasterService.clientEntryForm.get('clientName')?.enable();
    if (this.agentEntryMasterService.clientid === 0) {
      this.agentEntryMasterService.reviewFlag = false;
      this.agentEntryMasterService.contactid = 0;
      this.agentEntryMasterService.ownerid = 0;
      this.agentEntryMasterService.address = new BehaviorSubject(null);
      this.agentEntryMasterService.clientContact = null;
      this.agentEntryMasterService.ownerContact = null;
      this.agentEntryMasterService.agreementnoflag = false;
      this.agentEntryMasterService.completeFlag = Boolean();
      this.agentEntryMasterService.clientEntryForm.get('isActive')?.setValue(true);
      this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.setValue(true);
      this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.setValue(true);
      this.agentEntryMasterService.clientEntryForm.get('clientLogo')?.setValue([]);
    }
    setTimeout(() => {
      this.step1 = 0;
      this.stepperChange(0);
    }, 0);
  }

  onEdit(value: any) {
    this.agentEntryMasterService.onEdit(value);
    // .subscribe(res => { }, err => { }, () => {
    // this.clientEntryComponent.addressComponent.countryItems('');
    // this.clientEntryComponent.addressComponent.stateItems('');
    // this.clientEntryComponent.addressComponent.districtItems('');
    // this.clientEntryComponent.addressComponent.countryItems('');
    // });
  }

  resetForm() {
    if (this.agentEntryMasterService.clientid === 0) {
      if (this.step1 === 0) {
        // const controlNames = ['clientName', 'address1', 'country', 'state', 'city', 'zipCode', 'contactPerson', 'phoneNumber',
        // 'emailId', 'refNoPrefix', 'billingCycle', 'billingRule', 'billingType', 'retentionPolicyDays', 'applicantIdColumnName',
        // 'finalReportType', 'toEmailId', 'ccEmailID', 'tatCount', 'gstNumber', 'clientAccountManager'];
        // for (const ctrl in this.agentEntryMasterService.clientEntryForm.controls) {
        //   if (controlNames.indexOf(ctrl) > -1) {
        //     this.agentEntryMasterService.clientEntryForm.get(ctrl).clearValidators();
        //     this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        //   }
        // }
        this.agentEntryMasterService.clientEntryForm.reset();
        this.agentEntryMasterService.clientEntryForm.get('isActive')?.setValue(true);
        this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.setValue(true);
        this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.setValue(true);
      } else if (this.step1 === 1) {
        this.agentEntryMasterService.componentEntryForm.reset();
        this.agentEntryMasterService.componentEntryForm.get('effectiveDate')?.setValue(new Date());
        this.componentEntryPage.msp = 0;
        this.componentEntryPage.nrp = 0;
      } else if (this.step1 === 2) {
        this.agentEntryMasterService.agreementDetailsForm.reset();
      } else if (this.step1 === 3) {
        this.agentEntryMasterService.clientInstructionFormGroup.reset();
      } else if (this.step1 === 4) {
        this.agentEntryMasterService.clientMailIdForm.reset();
      }/*Future Use---20-08-2019*/
    }
    if (this.agentEntryMasterService.clientid > 0) {
      // if (this.step1 === 0) {
      this.agentEntryMasterService.onEdit(this.agentEntryMasterService.clientid);
      // .subscribe(res => { }, err => { }, () => {
      // this.clientEntryComponent.addressComponent.countryItems('');
      // this.clientEntryComponent.addressComponent.stateItems('');
      // this.clientEntryComponent.addressComponent.districtItems('');
      // this.clientEntryComponent.addressComponent.countryItems('');
      // });

      // this.agentEntryMasterService.bindDetails(this.agentEntryMasterService.tempData.clientEntry);
      // }
    }
  }
  clientValid() {
    const controlNames = ['clientName', 'address1', 'country', 'state', 'city', 'zipCode', 'contactPerson', 'phoneNumber',
      'emailId', 'refNoPrefix', 'billingCycle', 'billingRule', 'billingType', 'retentionPolicyDays', 'applicantIdColumnName',
      'finalReportType', 'toEmailId', 'ccEmailID', 'clientAccountManager'];
    for (const ctrl in this.agentEntryMasterService.clientEntryForm.controls) {
      if (controlNames.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.clientEntryForm.get(ctrl).value) {
          this.agentEntryMasterService.clientEntryForm.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        } else {
          this.agentEntryMasterService.clientEntryForm.get(ctrl).clearValidators();
          this.agentEntryMasterService.clientEntryForm.get(ctrl).updateValueAndValidity();
        }
      }
    }
  }
  saveClientDetails() {
    // this.clientValid();
    this.stepperFlag = this.step1;
    // if (this.step1 === 1) {
    //   this.componentEntryPage.validationClienFee();
    //   if (this.agentEntryMasterService.documentValidation === true) {
    //     this.componentEntryPage.validationClienTAT();
    //   }
    // }
    if (this.step1 === 0) {
      this.step1 = 0;
      this.DraftSaveOne();
    }
    // this.step1 = this.step1 + 1;
    if (this.step1 === 1) {
      this.DraftSaveTwo();
    } else if (this.step1 === 2) {
      this.DraftSaveThree();
    } else if (this.step1 === 3) {
      this.DraftSaveThree();
    }
    if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === true) {
      if (this.step1 === 4) {
        this.DraftSaveFourForSite();
      }
    }
    if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
      if (this.step1 === 4) {
        this.DraftSaveFour();
      } else if (this.step1 === 5) {
        this.DraftSaveFourForSite();
      }
    }

    // if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
    //   if (this.agentEntryMasterService.clientEntryForm.valid && this.agentEntryMasterService.agreementDetailsForm.valid &&
    //     this.agentEntryMasterService.componentEntryList.length > 0 && this.agentEntryMasterService.clientEmailConfig.length > 0
    //     && this.agentEntryMasterService.documentValidation === true && this.agentEntryMasterService.documentTAT === true) {
    //     this.saveClientEntryData();
    //   }
    // }
    // if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === true) {
    //   if (this.agentEntryMasterService.clientEntryForm.valid && this.agentEntryMasterService.agreementDetailsForm.valid
    //     && this.agentEntryMasterService.documentValidation === true && this.agentEntryMasterService.documentTAT === true &&
    //     this.agentEntryMasterService.componentEntryList.length > 0) {
    //     this.saveClientEntryData();
    //   }
    // }
  }

  saveClientEntryData() {
    // this.clientValid();
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      // if (this.agentEntryMasterService.completeFlag) {
      //   this.breadcrumbFlags.btnSaveDisabled = false;
      // } else {
      //   this.breadcrumbFlags.btnSaveDisabled = true;
      // }
      if (typeof (this.agentEntryMasterService.clientEntryForm.get('address') as UntypedFormGroup).controls['addressId'].value !== typeof 3) {
        (this.agentEntryMasterService.clientEntryForm.get('address') as UntypedFormGroup).controls['addressId'].setValue(0);
      }
      const clientEntryData: ClientEntry = {
        finalReportTitle: this.agentEntryMasterService.clientEntryForm.get('finalReportTitle')?.value,
        paymentFlag: this.agentEntryMasterService.clientEntryForm.get('paymentFlag')?.value,
        contactRemarkFlag: this.agentEntryMasterService.clientEntryForm.get('contactRemarkFlag')?.value,
        clientColorStatus: this.agentEntryMasterService.clientEntryForm.get('clientColorStatus')?.value,
        clientLogo: this.agentEntryMasterService.clientEntryForm.get('clientLogo')?.value,
        approvalLimitFlag: this.agentEntryMasterService.clientEntryForm.get('approvalLimitFlag')?.value,
        completeFlag: null,
        clientId: this.agentEntryMasterService.clientid,
        indianClientFlag: this.agentEntryMasterService.clientEntryForm.get('indianClientFlag')?.value,
        clientName: this.agentEntryMasterService.clientEntryForm.get('clientName')?.value,
        address: (this.agentEntryMasterService.clientEntryForm.get('address') as UntypedFormGroup).value,
        // address1: this.agentEntryMasterService.clientEntryForm.get('address1')?.value,
        // address2: this.agentEntryMasterService.clientEntryForm.get('address2')?.value,
        // address3: this.agentEntryMasterService.clientEntryForm.get('address3')?.value,
        // city: this.agentEntryMasterService.clientEntryForm.get('city')?.value,
        // stateId: this.agentEntryMasterService.clientEntryForm.get('state')?.value,  // ?
        // countryId: this.agentEntryMasterService.clientEntryForm.get('country')?.value, // ?
        // zipCode: this.agentEntryMasterService.clientEntryForm.get('zipCode')?.value, // ?
        createdDate: new Date(), // ?
        createdBy: 1, // ?
        modifyBy: 1, // ?
        modifiedDate: new Date(), // ?
        active: this.agentEntryMasterService.clientEntryForm.get('isActive')?.value, // ?
        emailId: this.agentEntryMasterService.clientEntryForm.get('emailId')?.value,
        contactPerson: this.agentEntryMasterService.clientEntryForm.get('contactPerson')?.value,
        phoneNumber: this.agentEntryMasterService.clientEntryForm.get('phoneNumber')?.value,
        isEmail: true, // ?
        dssiContact: 'null',
        dssiToEmailId: this.agentEntryMasterService.clientEntryForm.get('toEmailId')?.value,
        dssiCcEmailId: this.agentEntryMasterService.clientEntryForm.get('ccEmailID')?.value,
        chargeCodeFlag: this.agentEntryMasterService.clientEntryForm.get('chargeCodeFlag')?.value,
        // dssiOwner: +this.agentEntryMasterService.clientEntryForm.get('owner')?.value, // ?
        accessType: 'client',
        // addressOption: this.agentEntryMasterService.clientEntryForm.get('noOfAddressForCriminalCheck')?.value,
        cancel: false,
        refNo: this.agentEntryMasterService.clientEntryForm.get('refNoPrefix')?.value,
        ruleId: this.agentEntryMasterService.clientEntryForm.get('billingRule')?.value, // ?
        bcId: this.agentEntryMasterService.clientEntryForm.get('billingCycle')?.value, // ?
        pan: this.agentEntryMasterService.clientEntryForm.get('panNo')?.value,
        serviceTaxNo: this.agentEntryMasterService.clientEntryForm.get('serviceTaxNo')?.value,
        mobileNo: '' + (this.agentEntryMasterService.clientEntryForm.get('mobileNo')?.value),
        // tatCount: +this.agentEntryMasterService.clientEntryForm.get('tatCount')?.value, // ?
        tatRuleId: 2, // ?
        billingTypeId: +this.agentEntryMasterService.clientEntryForm.get('billingType')?.value,
        siteCreationFlag: this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value,
        cgstin: '' + this.agentEntryMasterService.clientEntryForm.get('gstNumber')?.value,
        clientStatus: this.agentEntryMasterService.clientEntryForm.get('clientOnHold')?.value, // ?
        serviceTaxFlag: this.agentEntryMasterService.clientEntryForm.get('serviceTaxFlag')?.value, // ?
        dataRetentionPolicyDays: this.agentEntryMasterService.clientEntryForm.get('retentionPolicyDays')?.value, // ?
        applicantIdColumnName: this.agentEntryMasterService.clientEntryForm.get('applicantIdColumnName')?.value,
        finalReportTypeId: this.agentEntryMasterService.clientEntryForm.get('finalReportType')?.value,
        annexureLinkFlag: this.agentEntryMasterService.clientEntryForm.get('annexureLink')?.value, // ?
        displaySiteNameFlag: this.agentEntryMasterService.clientEntryForm.get('displaySiteNameFlag')?.value,
        refNoManuallyFlag: this.agentEntryMasterService.clientEntryForm.get('refNoManuallyFlag')?.value,
        clientAccountManagerId: this.agentEntryMasterService.clientEntryForm.get('clientAccountManager')?.value,
        // caseCreationFlag: this.clientEntryForm.get('caseCreationManual')?.value, // ?
        optionToCreateInvitation: this.agentEntryMasterService.clientEntryForm.get('invitationOptionToCRT')?.value,
        formatFlag: this.agentEntryMasterService.clientEntryForm.get('formatFlag')?.value,
        caseByPassFlag: this.agentEntryMasterService.clientEntryForm.get('caseByPassFlag')?.value,
        caseDatesFlag: this.agentEntryMasterService.clientEntryForm.get('caseDatesFlag')?.value,
        calendarDaysTATFlag: this.agentEntryMasterService.clientEntryForm.get('calendarDaysTATFlag')?.value,
        caseCountryFlag: this.agentEntryMasterService.clientEntryForm.get('caseCountryFlag')?.value,
        caseTypeFlag: this.agentEntryMasterService.clientEntryForm.get('caseTypeFlag')?.value,
        clientContact: [
          {
            lookUpCatId: 0, lookUpId: 50, lookUpName: '', contactId: this.agentEntryMasterService.clientContact ?
              this.agentEntryMasterService.clientContact[0].contactId ? this.agentEntryMasterService.clientContact[0].contactId :
                this.agentEntryMasterService.contactid : this.agentEntryMasterService.contactid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('phoneNumber')?.value
          },
          {
            lookUpCatId: 0, lookUpId: 51, lookUpName: '', contactId: this.agentEntryMasterService.clientContact ?
              this.agentEntryMasterService.clientContact[1].contactId ?
                this.agentEntryMasterService.clientContact[1].contactId : this.agentEntryMasterService.contactid :
              this.agentEntryMasterService.contactid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('mobileNo')?.value
          },
          {
            lookUpCatId: 0, lookUpId: 53, lookUpName: '', contactId: this.agentEntryMasterService.clientContact ?
              this.agentEntryMasterService.clientContact[2].contactId ?
                this.agentEntryMasterService.clientContact[2].contactId : this.agentEntryMasterService.contactid :
              this.agentEntryMasterService.contactid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('emailId')?.value
          }
        ],
        ownerContact: [
          {
            lookUpCatId: 0, lookUpId: 81, lookUpName: '', contactId: this.agentEntryMasterService.ownerContact ?
              this.agentEntryMasterService.ownerContact[0].contactId ?
                this.agentEntryMasterService.ownerContact[0].contactId : this.agentEntryMasterService.ownerid :
              this.agentEntryMasterService.ownerid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('toEmailId')?.value
          },
          {
            lookUpCatId: 0, lookUpId: 82, lookUpName: '', contactId: this.agentEntryMasterService.ownerContact ?
              this.agentEntryMasterService.ownerContact[1].contactId ?
                this.agentEntryMasterService.ownerContact[1].contactId : this.agentEntryMasterService.ownerid :
              this.agentEntryMasterService.ownerid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('ccEmailID')?.value
          },
          {
            lookUpCatId: 0, lookUpId: 51, lookUpName: '', contactId: this.agentEntryMasterService.ownerContact ?
              this.agentEntryMasterService.ownerContact[2].contactId ?
                this.agentEntryMasterService.ownerContact[2].contactId : this.agentEntryMasterService.ownerid :
              this.agentEntryMasterService.ownerid,
            lookUpValue: this.agentEntryMasterService.clientEntryForm.get('accMobile')?.value
          }
        ],
        clientActiveDate: new Date(),
        clientDeActiveDate: new Date()
      };
      if (this.agentEntryMasterService.agreementDetailsForm.valid) {
        this.clientAgreementData = {
          clientId: this.agentEntryMasterService.clientid,
          clientName: '',
          agreementAvailabilityFlag: this.agentEntryMasterService.agreementDetailsForm.get('agreementAvailability')?.value,
          approvalDate: new Date(),
          approvalStatus: '', // null pass
          typeOfAgreement: this.agentEntryMasterService.agreementDetailsForm.get('typeOfAgreement')?.value,
          remarks: this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.value, //
          dateOfAgreement: this.agentEntryMasterService.agreementDetailsForm.get('dateOfAgreement')?.value,
          validity: this.agentEntryMasterService.agreementDetailsForm.get('validity')?.value,
          autoRenewal: this.agentEntryMasterService.agreementDetailsForm.get('autoRenewel')?.value,
          dateOfExpiry: this.agentEntryMasterService.agreementDetailsForm.get('dateOfExpiry')?.value,
          reasonofNonAvailability: this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.value,
          fileName: '', // this.agentEntryMasterService.agreementDetailsForm.get('supportingDocument')?.value,
          createdBy: 1,
          clientStatus: false, //
          createdDate: new Date(),
          reminder: this.agentEntryMasterService.agreementDetailsForm.get('reminder')?.value, //
          autoRenewalPeriod: this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.value,
          agreementName: '',
          reminderName: '',
          agreementApprovalFlag: this.agentEntryMasterService.agreementnoflag
        };
        this.agentEntryMasterService.agreementDocumentList.forEach(e => {
          const agreementDocument: AgreementDocument = {
            agreementDocId: e.agreementDocId,
            fileName: e.fileName,
            document: e.document,
            type: e.type
          };
          this.agreementDocumentList.push(agreementDocument);
        });
        if (this.agentEntryMasterService.clientid > 0) {
          if (this.clientAgreementData.agreementApprovalFlag === true) {
            this.clientAgreementData.approvalStatus = 'Approved';
          } else {
            this.clientAgreementData.approvalStatus = 'Pending';
          }
        }
      } else {
        this.clientAgreementData = null;
        this.agreementDocumentList = [];
      }

      const tempClientFeeDocumentList: ClientFeeDocumentVm[] = [];
      this.agentEntryMasterService.tempClientFeeDocumentList.forEach(e => {
        const clientFeeDocument: ClientFeeDocumentVm = {
          type: e.type,
          compFeeDocId: e.compFeeDocId,
          fileName: e.fileName,
          componentId: e.componentId,
          subComponentId: e.subComponentId,
          approvalFeeId: e.approvalFeeId,
          document: e.document
        };
        tempClientFeeDocumentList.push(clientFeeDocument);
      });
      const clientFeeApprovalEmail: ClientNoFeeApprovalVm[] = [];
      this.agentEntryMasterService.clientFeeApprovalEmail.forEach(e => {
        const clientFeeApprovalEmailList: ClientNoFeeApprovalVm = {
          loggedIn: e.loggedIn,
          clientComponentId: e.clientComponentId,
          componentId: e.componentId,
          currentAmount: e.currentAmount,
          requestedAmount: e.requestedAmount,
          clientApprovalFlag: e.clientApprovalFlag,
          msp: e.msp,
          nrp: e.nrp,
          componentType: e.componentType,
          componentDesc: e.componentDesc,
          subCompId: e.subCompId,
          validationType: e.validationType,
          comments: e.comments
        };
        clientFeeApprovalEmail.push(clientFeeApprovalEmailList);
      });
      const clientFeePreApprovalEmail: clientFeeApproval[] = [];
      this.agentEntryMasterService.clientFeePreApprovalEmail.forEach(e => {
        const clientFeePreApproval: clientFeeApproval = {
          clientComponentId: e.clientComponentId,
          componentId: e.componentId,
          currentAmount: e.currentAmount,
          requestedAmount: e.requestedAmount,
          clientApprovalFlag: e.clientApprovalFlag,
          msp: e.msp,
          nrp: e.nrp,
          componentType: e.componentType,
          componentDesc: e.componentDesc,
          subCompId: e.subCompId,
          requestedEffectiveDate: e.requestedEffectiveDate,
          componentFeeId: e.componentFeeId,
          fileName: e.fileName,
          comments: e.comments,
          validationType: e.validationType
        };
        clientFeePreApprovalEmail.push(clientFeePreApproval);
      });

      this.agentEntryMasterService.check();
      const saveClientEntry: SaveClientEntry = {
        loggedIn: this.agentEntryMasterService.authService.userdata.userId,
        clientEntry: clientEntryData,
        componentEntry: this.agentEntryMasterService.componentEntryList,
        clientAgreement: this.clientAgreementData,
        clientAgreementDocument: this.agreementDocumentList,
        clientInstruction: this.agentEntryMasterService.clientInstructionList,
        clientEmailConfig: this.agentEntryMasterService.clientEmailConfig, /*Future Use---20-08-2019*/
        clientFeeDocument: this.agentEntryMasterService.tempClientFeeDocumentList,
        clientFeeApprovalEmail: this.agentEntryMasterService.clientFeeApprovalEmail,
        clientFeePreApprovalEmail: this.agentEntryMasterService.clientFeePreApprovalEmail,
        clientTATDocument: this.agentEntryMasterService.tempClientTATDocumentList,
        clientTATApprovalEmail: this.agentEntryMasterService.clientTATApprovalEmail,
        clientTATPreApprovalEmail: this.agentEntryMasterService.clientTATPreApprovalEmail,
        reviewFlag: this.agentEntryMasterService.reviewFlag
      };
      // console.log(this.agentEntryMasterService.clientFeePreApprovalEmail, 'this.agentEntryMasterService.clientFeePreApprovalEmail');
      // console.log(saveClientEntry, 'saveClientEntry');
      const formData = new FormData();
      formData.append('ClientEntry', JSON.stringify(saveClientEntry));
      if (saveClientEntry.clientEntry.clientLogo.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientEntry.clientLogo.length; i++) {
          formData.append(('ClientLogo_' + saveClientEntry.clientEntry.clientLogo[i].logoLookupId + '_' +
           saveClientEntry.clientEntry.clientLogo[i].signatureLookupId), saveClientEntry.clientEntry.clientLogo[i].document);
        }
      }
      if (saveClientEntry.clientAgreementDocument) {
        for (let i = 0; i < saveClientEntry.clientAgreementDocument.length; i++) {
          formData.append('AgreementDocument_' + i, saveClientEntry.clientAgreementDocument[i].document);
        }
      }
      if (saveClientEntry.clientFeeDocument) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientFeeDocument.length; i++) {
          if (saveClientEntry.clientFeeDocument[i].subComponentId) {
            // tslint:disable-next-line: max-line-length
            formData.append('ApprovalFeeDocument' + '_Sub_' + saveClientEntry.clientFeeDocument[i].subComponentId, saveClientEntry.clientFeeDocument[i].document);
          } else {
            // tslint:disable-next-line: max-line-length
            formData.append('ApprovalFeeDocument' + '_Comp_' + saveClientEntry.clientFeeDocument[i].componentId, saveClientEntry.clientFeeDocument[i].document);
          }
        }
      }
      if (saveClientEntry.clientTATDocument) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientTATDocument.length; i++) {
          if (saveClientEntry.clientTATDocument[i].subComponentId) {
            // tslint:disable-next-line: max-line-length
            formData.append('ApprovalTATDocument' + '_Sub_' + saveClientEntry.clientTATDocument[i].subComponentId, saveClientEntry.clientTATDocument[i].document);
          } else {
            // tslint:disable-next-line: max-line-length
            formData.append('ApprovalTATDocument' + '_Comp_' + saveClientEntry.clientTATDocument[i].componentId, saveClientEntry.clientTATDocument[i].document);
          }
        }
      }
      // ** Added for Nodemail **
      // if (saveClientEntry.clientFeeDocument && saveClientEntry.clientFeeDocument.length > 0) {
      //   this.convertFileasBase64(saveClientEntry.clientFeeDocument);
      // }
      // if (saveClientEntry.clientTATDocument && saveClientEntry.clientTATDocument.length > 0) {
      //   this.convertFileasBase64(saveClientEntry.clientTATDocument);
      // }
      // if (this.agreementDocumentList.length > 0) {
      //   this.agreementDocumentList.forEach((ele) => {
      //     if (ele.agreementDocId > 0) {
      //       this.getAgreementDetails(ele.agreementDocId);
      //     } else if (ele.agreementDocId === 0) {
      //       this.convertFileasBase64(saveClientEntry.clientAgreementDocument);
      //     }
      //   });
      // }
      this.agentEntryMasterService.saveClientEntryDetails(formData).subscribe(res => {
        // console.log(res);
        if (res) {
          if (this.agentEntryMasterService.completeFlag) {
            this.agentEntryMasterService.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.agentEntryMasterService.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          // **Added for Nodemail ** //
          // this.getEmailType(saveClientEntry);
          this.auth.cancelRuleClientId = res.value;
          if (res.message === 'Completed') {
            if (clientEntryData.siteCreationFlag) {
              this.openDialogafterSite(res.value);
              // this.openDialogafter();
            } else {
              this.openDialogafter();
            }
          }
          this.mode = 'AddClient';
          this.getAgentDetails();
          // this.setBreadcrumbs();
          this.breadcrumbFlags = this.common.breadcrumbFlags();
          this.agentEntryMasterService.resetFormGroup();
        }
      }, err => {
        this.breadcrumbFlags.btnSaveDisabled = true;
        console.log(err);
      }, () => {
      });
    }
  }
  // ** Added for Nodemail **//
  // convertFileasBase64(file: any) {
  //   if (file.length > 0) {
  //     this.mailDocList = [];
  //     this.mailTATDocList = [];
  //     this.mailAgreementDocList = [];
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < file.length; i++) {
  //       if (file[i].document) {
  //         const fileReader = new FileReader();
  //         fileReader.onloadend = (e) => {
  //           const mailAttachment = new MailAttachment();
  //           mailAttachment.fileName = file[i].document.name;
  //           mailAttachment.bufferDoc = fileReader.result;
  //           mailAttachment.componentId = file[i].componentId;
  //           mailAttachment.mailType = file[i].type;
  //           mailAttachment.subComponentId = file[i].subComponentId;
  //           if (file[i].type === 'clientFee') {
  //             this.mailDocList.push(mailAttachment);
  //           }
  //           if (file[i].type === 'clientTAT') {
  //             this.mailTATDocList.push(mailAttachment);
  //           }
  //           if (file[i].type === 'clientAgreement') {
  //             this.mailAgreementDocList.push(mailAttachment);
  //           }
  //         };
  //         fileReader.readAsDataURL(file[i].document);
  //       }
  //     }
  //   }
  // }
  // getAgreementDetails(documentId: any) {
  //   this.agentEntryMasterService.getAgreementDoc(documentId).subscribe(resp => {
  //     if (resp) {
  //       const doc = resp;
  //       console.log(doc, 'adoc');
  //       this.mailAgreementDocList = [];
  //       const mailAttachment = new MailAttachment();
  //       mailAttachment.fileName = resp.fileName;
  //       mailAttachment.bufferDoc = resp.document;
  //       this.mailAgreementDocList.push(mailAttachment);
  //     }
  //   });
  // }
  //  getEmailType(saveClientEntry: any) {
  //   let emailTemplate;
  //   if (saveClientEntry.clientFeeApprovalEmail.length > 0 || saveClientEntry.clientFeePreApprovalEmail.length > 0) {
  //     if (saveClientEntry.clientFeeDocument && saveClientEntry.clientFeeDocument.length > 0) {
  //       emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_FEE_PRE_APPROVAL).
  //         htmlTemplateBody;
  //       this.getEmailTemplate(emailTemplate, saveClientEntry.clientFeePreApprovalEmail,
  //         saveClientEntry.clientEntry.clientName);
  //     }
  //     if (saveClientEntry.clientFeeApprovalEmail && saveClientEntry.clientFeeApprovalEmail.length > 0) {
  //       this.mailDocList = [];
  //       emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_FEE_APPROVAL).
  //         htmlTemplateBody;
  //       this.getEmailTemplate(emailTemplate, saveClientEntry.clientFeeApprovalEmail,
  //         saveClientEntry.clientEntry.clientName);
  //     }
  //   }
  //   if (saveClientEntry.clientTATApprovalEmail.length > 0 || saveClientEntry.clientTATPreApprovalEmail.length > 0) {
  //     if (saveClientEntry.clientTATDocument && saveClientEntry.clientTATDocument.length > 0) {
  //       emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_TAT_PRE_APPROVAL).
  //         htmlTemplateBody;
  //       this.getTATEmailTemplate(emailTemplate, saveClientEntry.clientTATPreApprovalEmail,
  //         saveClientEntry.clientEntry.clientName);
  //     }
  //     if (saveClientEntry.clientTATApprovalEmail.length > 0) {
  //       this.mailTATDocList = [];
  //       emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_TAT_APPROVAL).
  //         htmlTemplateBody;
  //       this.getTATEmailTemplate(emailTemplate, saveClientEntry.clientTATApprovalEmail,
  //         saveClientEntry.clientEntry.clientName);
  //     }
  //   }
  //   if (saveClientEntry.clientAgreement && saveClientEntry.clientAgreement.agreementAvailabilityFlag !== true) {
  //     emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_AGREEMENT_APPROVAL).
  //       htmlTemplateBody;
  //     if (saveClientEntry.clientEntry.clientId === 0 && saveClientEntry.clientAgreement.agreementAvailabilityFlag !== true) {
  //       this.getAgreementEmailTemplate(emailTemplate, saveClientEntry.clientAgreement, saveClientEntry.clientEntry.clientName);
  //     } else if (saveClientEntry.clientEntry.clientId > 0 && (this.agentEntryMasterService.clientAgreeCheckFlag === true &&
  //       saveClientEntry.clientAgreement.agreementAvailabilityFlag !== true)) {
  //       this.getAgreementEmailTemplate(emailTemplate, saveClientEntry.clientAgreement, saveClientEntry.clientEntry.clientName);
  //     }
  //     if (saveClientEntry.clientEntry.clientId > 0 && this.agentEntryMasterService.agreementDetails === '' &&
  //       saveClientEntry.clientAgreement.agreementAvailabilityFlag !== true) {
  //       this.getAgreementEmailTemplate(emailTemplate, saveClientEntry.clientAgreement, saveClientEntry.clientEntry.clientName);
  //     }
  //   }
  //   if (saveClientEntry.clientEntry.clientId === 0 && saveClientEntry.clientEntry.clientStatus === true) {
  //     emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() ===
  //       this.common.CLIENT_ONHOLD_BYCRT).htmlTemplateBody;
  //     this.getOnHoldTemplate(emailTemplate, saveClientEntry.clientEntry.clientName);
  //   }
  //   if (saveClientEntry.clientEntry.clientId > 0 && this.agentEntryMasterService.onHoldFlag === true &&
  //     saveClientEntry.clientEntry.clientStatus === false) {
  //     emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() ===
  //       this.common.CLIENT_ONHOLD_RENEWEDCRT).htmlTemplateBody;
  //     this.getOnHoldTemplate(emailTemplate, saveClientEntry.clientEntry.clientName);
  //   }
  // }
  // getOnHoldTemplate(emailTemplate, clientName) {
  //   const mailTemp = new MailTemplate();
  //   mailTemp.clientName = clientName;
  //   mailTemp.mailbodyheader = 'Dear Sir,';
  //   mailTemp.userName = this.userData.userName;
  //   mailTemp.Date = new Date();
  //   const mailData = new MailData();
  //   mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //   this.master.sendEmail(mailData).subscribe(resp => {
  //     this.agentEntryMasterService.showTopCenter('success', 'Success', resp['message']);
  //   });
  // }
  // getAgreementEmailTemplate(emailTemplate, compDetails, clientName: string) {
  //   const mailTemp = new MailTemplate();
  //   mailTemp.clientName = clientName;
  //   mailTemp.mailbodyheader = 'Dear Sir';
  //   mailTemp.agreementAvailability = compDetails.agreementAvailabilityFlag;
  //   mailTemp.approvalStatus = compDetails.approvalStatus;
  //   mailTemp.comments = compDetails.reasonofNonAvailability;
  //   mailTemp.requestedBy = this.userData.userName;
  //   const mailData = new MailData();
  //   mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //   // tslint:disable-next-line:prefer-for-of
  //   if (this.mailAgreementDocList.length > 0) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let index = 0; index < this.mailAgreementDocList.length; index++) {
  //       mailData.fileAttachments.push({
  //         filename: this.mailAgreementDocList[index].fileName,
  //         path: this.mailAgreementDocList[index].bufferDoc,
  //       });
  //     }
  //   }
  //   this.master.sendEmail(mailData).subscribe(resp => {
  //     this.agentEntryMasterService.showTopCenter('success', 'Success', resp['message']);
  //   });
  // }
  // getEmailTemplate(emailTemplate, compDetails, clientName: string) {
  //   let successCount = 0;
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < compDetails.length; i++) {
  //     if (compDetails.length > 0) {
  //       const mailTemp = new MailTemplate();
  //       mailTemp.clientName = clientName;
  //       mailTemp.mailbodyheader = 'Dear Sir,';
  //       mailTemp.requestedRate = compDetails[i].requestedAmount;
  //       mailTemp.agreementAvailability = compDetails.agreementAvailabilityFlag;
  //       mailTemp.approvalStatus = compDetails.approvalStatus;
  //       mailTemp.validationCondition = compDetails[i].validationType;
  //       mailTemp.component = compDetails[i].componentType;
  //       mailTemp.mSPRate = compDetails[i].msp;
  //       mailTemp.nSPRate = compDetails[i].nrp;
  //       mailTemp.requestedBy = this.userData.userName;
  //       mailTemp.comments = compDetails[i].comments;
  //       mailTemp.remarks = compDetails[i].comments;
  //       mailTemp.subComponent = compDetails[i].componentDesc;
  //       mailTemp.requestPerson = this.userData.userName;
  //       let mailCheckList: any[] = [];
  //       if (compDetails[i].subCompId > 0) {
  //         mailCheckList = this.mailDocList.filter(x => x.componentId === compDetails[i].componentId && x.subComponentId ===
  //           compDetails[i].subCompId && x.mailType === 'clientFee');
  //       } else if (compDetails[i].subCompId === 0) {
  //         mailCheckList = this.mailDocList.filter(x => x.componentId === compDetails[i].componentId && x.mailType === 'clientFee');
  //       }
  //       const mailData = new MailData();
  //       mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //       if (mailCheckList.length > 0) {
  //         // tslint:disable-next-line:prefer-for-of
  //         for (let index = 0; index < mailCheckList.length; index++) {
  //           mailData.fileAttachments.push({
  //             filename: mailCheckList[index].fileName,
  //             // content: mailCheckList[index].bufferDoc.split('base64,')[1],
  //             path: mailCheckList[index].bufferDoc
  //           });
  //         }
  //         successCount++;
  //         this.master.sendEmail(mailData).subscribe(resp => {
  //           if (successCount === compDetails.length) {
  //             this.agentEntryMasterService.showTopCenter('success', 'Success', resp['message']);
  //           }
  //         });
  //       }
  //     }
  //   }

  // }
  // getTATEmailTemplate(emailTemplate, compDetails, clientName: string) {
  //   let tatcount = 0;
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < compDetails.length; i++) {
  //     if (compDetails.length > 0) {
  //       const mailTemp = new MailTemplate();
  //       mailTemp.clientName = clientName;
  //       mailTemp.mailbodyheader = 'Dear Sir,';
  //       mailTemp.requestedRate = compDetails[i].requestedAmount;
  //       mailTemp.agreementAvailability = compDetails.agreementAvailabilityFlag;
  //       mailTemp.approvalStatus = compDetails.approvalStatus;
  //       mailTemp.validationCondition = compDetails[i].validationType;
  //       mailTemp.component = compDetails[i].componentType;
  //       mailTemp.requestedBy = this.userData.userName;
  //       mailTemp.comments = compDetails[i].comments;
  //       mailTemp.originalTat = compDetails[i].originalTAT;
  //       mailTemp.requestedTat = compDetails[i].requestedTAT;
  //       mailTemp.remarks = compDetails[i].comments;
  //       mailTemp.requestPerson = this.userData.userName;
  //       mailTemp.subComponent = compDetails[i].componentDesc;
  //       let mailtatCheckList: any[] = [];
  //       if (compDetails[i].subCompId > 0) {
  //         mailtatCheckList = this.mailTATDocList.filter(x => x.componentId === compDetails[i].componentId && x.subComponentId ===
  //           compDetails[i].subCompId && x.mailType === 'clientTAT');
  //       } else if (compDetails[i].subCompId === 0) {
  //         mailtatCheckList = this.mailTATDocList.filter(x => x.componentId === compDetails[i].componentId && x.mailType === 'clientTAT');
  //       }
  //       const mailTATData = new MailData();
  //       mailTATData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //       // tslint:disable-next-line:prefer-for-of
  //       for (let index = 0; index < mailtatCheckList.length; index++) {
  //         mailTATData.fileAttachments.push({
  //           filename: mailtatCheckList[index].fileName,
  //           path : mailtatCheckList[index].bufferDoc,
  //         });
  //       }
  //       tatcount++;
  //       this.master.sendEmail(mailTATData).subscribe(resp => {
  //         if (tatcount === compDetails.length) {
  //           this.agentEntryMasterService.showTopCenter('success', 'Success', resp['message']);
  //         }
  //       });
  //     }
  //   }
  // }

  toggleColumn(field: any): void {
    field.value = !field.value;
    this.filednames = this.filedname.filter(f => f.value || f.disabled);
  }

  getAgentDetails() {
    const accessClient: AccessClient = {
      loggedIn: this.userData.userId,
      clientId: this.userData.clientId
    };
    this.agentEntryMasterService.getClientDetails(accessClient).subscribe(res => {
      this.agentEntryMasterService.agentDetailsData = res,
        res.forEach((element, i) => {
          element.firstName = element.firstName ? element.firstName : 'N/A';
          element.lastName = element.lastName ? element.lastName : '';
          this.agentEntryMasterService.agentDetailsData[i].dssiOwner = element.firstName + ' ' + element.lastName;
        });
      this.currentPage = 1;
      // console.log(this.agentEntryMasterService.agentDetailsData);
    },
      err => { }, () => {
        this.genAutoCompleteFilter();
      });
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      id: data,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        // if (result) {
        //   if (result.id.action) {
        //     const action = String(result.id.action);
        //     if (action === this.common.DELETECONFIRMATION) {
        //       this.oneDelete(data);
        //     }
        //   }
        // }
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.oneDelete(data);
          }
        }
      });
    }
  }

  oneDelete(data: any) {
    this.agentEntryMasterService.DeleteClientDetails(data).subscribe(res => {
      if (res.success) {
        this.agentEntryMasterService.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getAgentDetails();
      }
    });
  }

  genAutoCompleteFilter() {
    this.agentNameListFilteredOptions = this.agentNameListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.statusFilteredOptions = this.statusFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.status).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.countryListFilteredOptions = this.countryListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.country).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.stateListListFilteredOptions = this.stateListListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.state).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.cityListListFilteredOptions = this.cityListListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.city).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.dssiOwnerListFilteredOptions = this.dssiOwnerListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.agentEntryMasterService.agentDetailsData.map(x => x.dssiOwner).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toString().toLowerCase().includes(value))));
  }
  stepOne(selectedIndex: any) {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      this.stepperChange(selectedIndex);
    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.step1 = 0;
      this.stepperChange(0);
    }
  }
  stepTwo(selectedIndex: any) {
    if (this.stepperFlag === 1) {
      this.componentEntryPage.validationClienFee();
      if (this.agentEntryMasterService.documentValidation === true) {
        this.componentEntryPage.validationClienTAT();
      }
    }
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if ((this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null)
        && this.agentEntryMasterService.documentTAT === true && this.agentEntryMasterService.documentValidation === true) {
        this.stepperChange(selectedIndex);
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.step1 = 1;
        this.stepperChange(1);
      }
    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.step1 = 0;
      this.stepperChange(0);
    }
  }
  stepThree(selectedIndex: any) {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null) {
        // if (this.agentEntryMasterService.clientInstructionList.length > 0 ||
        //   this.agentEntryMasterService.clientInstructionList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          this.validateAgreement();
          if (this.agentEntryMasterService.agreementDetailsForm.valid) {
            this.stepperChange(selectedIndex);
          } else {
            this.validateAgreement();
            this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
            this.step1 = 2;
            this.stepperChange(2);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          // this.validateClientInstructForm();
          // this.agentEntryMasterService.clientInstructionFormGroup.markAllAsTouched();
          this.step1 = 2;
          this.stepperChange(2);
        }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.step1 = 1;
        this.stepperChange(1);
      }

    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.step1 = 0;
      this.stepperChange(0);
    }
    /*Start/Future Use---20-08-2019*/
    // } else if (this.step1 === 4) {
    //   if (this.agentEntryMasterService.clientEntryForm.valid) {
    //     if (this.agentEntryMasterService.componentEntryList.length > 0 ||
    //       this.agentEntryMasterService.componentEntryList === null) {
    //       if (this.agentEntryMasterService.clientInstructionList.length > 0 ||
    //         this.agentEntryMasterService.clientInstructionList === null) {
    //         if (this.agentEntryMasterService.agreementDetailsForm.valid) {
    //           this.validateAgreement();
    //           if (this.agentEntryMasterService.agreementDetailsForm.valid) {
    //             this.stepperChange(selectedIndex);
    //           } else {
    //             this.validateAgreement();
    //             this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
    //             this.step1 = 3;
    //             this.stepperChange(3);
    //           }
    //         } else {
    //           this.validateAgreement();
    //           this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
    //           this.step1 = 3;
    //           this.stepperChange(3);
    //         }
    //       } else {
    //         this.validateClientInstructForm();
    //         this.agentEntryMasterService.clientInstructionFormGroup.markAllAsTouched();
    //         this.step1 = 2;
    //         this.stepperChange(2);
    //       }
    //     } else {
    //       this.validateComponentForm();
    //       this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
    //       this.step1 = 1;
    //       this.stepperChange(1);
    //     }

    //   } else {
    //     // this.clientValid();
    ////     this.scrollToTop();
    //     this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
    //     this.step1 = 0;
    //     this.stepperChange(0);
    //   }
    // }/*End/Future Use---20-08-2019*/
  }
  stepFour(selectedIndex: any) {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 || this.agentEntryMasterService.componentEntryList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
            if (this.agentEntryMasterService.clientEmailConfig.length > 0 ||
              this.agentEntryMasterService.clientEmailConfig === null) {
              this.stepperChange(selectedIndex);
            } else {
              this.validateclientmail();
              this.agentEntryMasterService.clientMailIdForm.markAllAsTouched();
              this.step1 = 4;
              this.stepperChange(4);
            }
          }
          if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === true) {
            this.stepperChange(selectedIndex);
            this.step1 = 4;
            this.stepperChange(4);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          this.step1 = 2;
          this.stepperChange(2);
        }
        //  else {
        //   this.step1 = 3;
        //   this.stepperChange(3);
        // }

        // if (this.agentEntryMasterService.agreementDetailsForm.valid) {
        //   this.validateAgreement();
        //   if (this.agentEntryMasterService.agreementDetailsForm.valid) {
        //     this.stepperChange(selectedIndex);
        //   } else {
        //     this.validateAgreement();
        //     this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
        //     this.step1 = 3;
        //     this.stepperChange(3);
        //   }
        // }
        /*Future Use---20-08-2019*/
        // if (this.agentEntryMasterService.clientEmailConfig.length > 0 ||
        //   this.agentEntryMasterService.clientEmailConfig === null) {
        //   this.stepperChange(selectedIndex);
        // } else {
        //   this.validateclientmail();
        //   this.agentEntryMasterService.clientMailIdForm.markAllAsTouched();
        //   this.step1 = 4;
        //   this.stepperChange(4);
        // }/*Future Use---20-08-2019*/
        //  else {
        //   this.validateAgreement();
        //   this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
        //   this.step1 = 3;
        //   this.stepperChange(3);
        // }
        // else {
        //   this.validateClientInstructForm();
        //   this.agentEntryMasterService.clientInstructionFormGroup.markAllAsTouched();
        //   this.step1 = 2;
        //   this.stepperChange(2);
        // }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.step1 = 1;
        this.stepperChange(1);
      }
    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.step1 = 0;
      this.stepperChange(0);
    }
  }
  stepFourForSite(selectedIndex: any) {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null) {
        // if (this.agentEntryMasterService.clientInstructionList.length > 0 ||
        //   this.agentEntryMasterService.clientInstructionList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          this.validateAgreement();
          if (this.agentEntryMasterService.agreementDetailsForm.valid) {
            this.stepperChange(selectedIndex);
          } else {
            this.validateAgreement();
            this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
            this.step1 = 3;
            this.stepperChange(3);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          this.step1 = 3;
          this.stepperChange(3);
        }
        // } else {
        //   this.validateClientInstructForm();
        //   this.agentEntryMasterService.clientInstructionFormGroup.markAllAsTouched();
        //   this.step1 = 2;
        //   this.stepperChange(2);
        // }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.step1 = 1;
        this.stepperChange(1);
      }

    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.step1 = 0;
      this.stepperChange(0);
    }
  }
  DraftSaveOne() {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      this.saveClientEntryData();
    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.stepperChange(0);
    }
  }
  DraftSaveTwo() {
    if (this.stepperFlag === 1) {
      this.componentEntryPage.validationClienFee();
      if (this.agentEntryMasterService.documentValidation === true) {
        this.componentEntryPage.validationClienTAT();
      }
    }
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if ((this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null)
        && this.agentEntryMasterService.documentTAT === true && this.agentEntryMasterService.documentValidation === true) {
        this.saveClientEntryData();
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.stepperChange(1);
      }
    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.stepperChange(0);
    }
  }
  DraftSaveThree() {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null) {
        // if (this.agentEntryMasterService.clientInstructionList.length > 0 ||
        //   this.agentEntryMasterService.clientInstructionList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          this.validateAgreement();
          if (this.agentEntryMasterService.agreementDetailsForm.valid) {
            this.saveClientEntryData();
          } else {
            this.validateAgreement();
            this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
            this.stepperChange(2);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          // this.validateClientInstructForm();
          // this.agentEntryMasterService.clientInstructionFormGroup.markAllAsTouched();
          this.stepperChange(2);
        }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.stepperChange(1);
      }

    } else {
      // this.clientValid();

      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.stepperChange(0);
    }
  }
  DraftSaveFour() {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 || this.agentEntryMasterService.componentEntryList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
            if (this.agentEntryMasterService.clientEmailConfig.length > 0 ||
              this.agentEntryMasterService.clientEmailConfig === null) {
              this.saveClientEntryData();
            } else {
              this.validateclientmail();
              this.agentEntryMasterService.clientMailIdForm.markAllAsTouched();
              this.stepperChange(4);
            }
          }
          if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === true) {
            this.saveClientEntryData();
            this.stepperChange(4);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          this.stepperChange(2);
        }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.stepperChange(1);
      }
    } else {
      // this.clientValid();
      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.stepperChange(0);
    }
  }
  DraftSaveFourForSite() {
    if (this.agentEntryMasterService.clientEntryForm.valid) {
      if (this.agentEntryMasterService.componentEntryList.length > 0 ||
        this.agentEntryMasterService.componentEntryList === null) {
        // if (this.agentEntryMasterService.clientInstructionList.length > 0 ||
        //   this.agentEntryMasterService.clientInstructionList === null) {
        if (this.agentEntryMasterService.agreementDetailsForm.valid) {
          this.validateAgreement();
          if (this.agentEntryMasterService.agreementDetailsForm.valid) {
            this.saveClientEntryData();
          } else {
            this.validateAgreement();
            this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
            this.stepperChange(3);
          }
        } else {
          this.validateAgreement();
          this.agentEntryMasterService.agreementDetailsForm.markAllAsTouched();
          this.stepperChange(3);
        }
      } else {
        this.validateComponentForm();
        this.agentEntryMasterService.componentEntryForm.markAllAsTouched();
        this.stepperChange(1);
      }
    } else {
      // this.clientValid();
      this.agentEntryMasterService.clientEntryForm.markAllAsTouched();
      this.stepperChange(0);
    }
  }
  goToStep(selectedIndex: any) {
    this.scrollToError.scrollToError();
    this.stepperFlag = this.step1;
    this.step1 = selectedIndex;
    // this.stepperChange(selectedIndex);
    if (this.step1 === 0) {
      this.step1 = 0;
      this.stepperChange(0);
      const add = this.agentEntryMasterService.clientEntryForm.value;
      this.agentEntryMasterService.address.next(add.address);
    }
    if (this.step1 !== 0) {
      if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === true) {
        if (this.step1 === 1) {
          this.stepOne(selectedIndex);
        } else if (this.step1 === 2) {
          this.stepTwo(selectedIndex);
        } else if (this.step1 === 3) {
          this.stepThree(selectedIndex);
        } else if (this.step1 === 4) {
          this.stepFour(selectedIndex);
        }
      }
      if (this.agentEntryMasterService.clientEntryForm.get('siteCreationFlag')?.value === false) {
        if (this.step1 === 1) {
          this.stepOne(selectedIndex);
        } else if (this.step1 === 2) {
          this.stepTwo(selectedIndex);
        } else if (this.step1 === 3) {
          this.stepThree(selectedIndex);
        } else if (this.step1 === 4) {
          this.stepFourForSite(selectedIndex);
        } else if (this.step1 === 5) {
          this.stepFour(selectedIndex);
        }
      }
    }
  }

  validateComponentForm() {
    const component = this.agentEntryMasterService.componentEntryForm.get('component')?.value;
    if (component) {
      const controlNames = ['component', 'componentDesc', 'fees', 'effectiveDate', 'tat', 'currency'];
      for (const ctrl in this.agentEntryMasterService.componentEntryForm.controls) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.value) {
            if (!this.agentEntryMasterService.componentEntryForm.get(ctrl).value) {
              this.agentEntryMasterService.componentEntryForm.get(ctrl).setValidators(Validators.required);
              this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
            }
          } else {
            this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.setValidators(Validators.required);
            this.agentEntryMasterService.componentEntryForm.get('componentDesc')?.updateValueAndValidity();
          }
          if (this.agentEntryMasterService.componentEntryForm.get(ctrl).valid) {
            this.agentEntryMasterService.componentEntryForm.get(ctrl).clearValidators();
            this.agentEntryMasterService.componentEntryForm.get(ctrl).updateValueAndValidity();
          }
        }
      }
    } else {
      this.agentEntryMasterService.componentEntryForm.get('component')?.setValidators(Validators.required);
      this.agentEntryMasterService.componentEntryForm.get('component')?.updateValueAndValidity();
    }
    this.errormsg = 'Please add atleast one Component';
  }
  validateClientInstructForm() {
    const controlNames1 = ['instructionTypeId', 'componentId', 'instruction'];
    for (const ctrl in this.agentEntryMasterService.clientInstructionFormGroup.controls) {
      if (controlNames1.indexOf(ctrl) > -1) {
        if (!this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).value) {
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).setValidators(Validators.required);
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
          if (ctrl === 'componentId') {
            if (40 === this.agentEntryMasterService.clientInstructionFormGroup.get('instructionTypeId')?.value) {
              this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).clearValidators();
              this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
            }
          }
        } else {
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).clearValidators();
          this.agentEntryMasterService.clientInstructionFormGroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
    this.errormsg = 'Please add atleast one Instruction';
  }
  validateAgreement() {
    if (this.agentEntryMasterService.agreementDetailsForm.get('agreementAvailability')?.value === true) {
      const ctrls = ['typeOfAgreement', 'dateOfAgreement', 'validity', 'reminder', 'autoRenewel', 'dateOfExpiry', 'reminderForRenewel'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.clearValidators();
          this.agentEntryMasterService.agreementDetailsForm.get('reasonForNonAvailability')?.updateValueAndValidity();
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
          }
          if (ctrl === 'typeOfAgreement') {
            if (this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value === 44) {
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.setValidators(Validators.required);
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.updateValueAndValidity();
            } else {
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.clearValidators();
              this.agentEntryMasterService.agreementDetailsForm.get('remarks')?.updateValueAndValidity();
            }
          }
          if (ctrl === 'autoRenewel') {
            if (this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value === true) {
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.setValidators(Validators.required);
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.updateValueAndValidity();
            } else {
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.clearValidators();
              this.agentEntryMasterService.agreementDetailsForm.get('autoRenewelPeriod')?.updateValueAndValidity();
            }
          }
        }
      }
    }
    if (this.agentEntryMasterService.agreementDetailsForm.get('agreementAvailability')?.value === false) {
      const ctrlname = ['reasonForNonAvailability'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrlname.indexOf(ctrl) > -1) {
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).value) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).setValidators(Validators.required);
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
            // return;
          }
        }
      }
      const ctrls = ['typeOfAgreement', 'remarks', 'dateOfAgreement', 'validity', 'reminder',
        'autoRenewel', 'dateOfExpiry', 'autoRenewelPeriod', 'reminderForRenewel'];
      for (const ctrl in this.agentEntryMasterService.agreementDetailsForm.controls) {
        if (ctrls.indexOf(ctrl) > -1) {
          if (!this.agentEntryMasterService.agreementDetailsForm.get(ctrl).valid) {
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).clearValidators();
            this.agentEntryMasterService.agreementDetailsForm.get(ctrl).updateValueAndValidity();
            // return;
          }
        }
      }
    }
  }
  validateclientmail() {
    if (this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.value) {
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.clearValidators();
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.updateValueAndValidity();
      if (this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.value === this.common.INSUF_NOTIFICATION) {
        const controlNames = ['sendTypeLookupId', 'reportLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            if (this.agentEntryMasterService.clientMailIdForm.get(ctrl).value) {
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).clearValidators();
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
            } else {
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).setValidators(Validators.required);
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
            }
          }
        }
      } else if (this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.value === this.common.DIR_APP_COMP_NOTIFICATION) {
        const controlNames = ['reportLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            if (this.agentEntryMasterService.clientMailIdForm.get(ctrl).value) {
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).clearValidators();
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
            } else {
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).setValidators(Validators.required);
              this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
            }
          }
        }
      } else {
        const controlNames = ['sendTypeLookupId', 'reportLookupId'];
        for (const ctrl in this.agentEntryMasterService.clientMailIdForm.controls) {
          if (controlNames.indexOf(ctrl) > -1) {
            this.agentEntryMasterService.clientMailIdForm.get(ctrl).clearValidators();
            this.agentEntryMasterService.clientMailIdForm.get(ctrl).updateValueAndValidity();
          }
        }
      }
    } else {
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.setValidators(Validators.required);
      this.agentEntryMasterService.clientMailIdForm.get('categoryLookupId')?.updateValueAndValidity();
    }
    if (this.agentEntryMasterService.clientEmailConfig.length > 0) {
      const formArray = this.agentEntryMasterService.clientMailIdForm.get('commonEmailDet') as UntypedFormArray;
      const formGroup = formArray.controls[0] as UntypedFormGroup;
      if (formGroup.get('destLookupId')?.value) {
        formGroup.get('destLookupId')?.clearValidators();
        formGroup.get('destLookupId')?.updateValueAndValidity();
      } else {
        formGroup.get('destLookupId')?.setValidators(Validators.required);
        formGroup.get('destLookupId')?.updateValueAndValidity();
      }
      if (formGroup.get('contactData')?.value) {
        formGroup.get('contactData')?.clearValidators();
        formGroup.get('contactData')?.updateValueAndValidity();
      } else {
        formGroup.get('contactData')?.setValidators(Validators.required);
        formGroup.get('contactData')?.updateValueAndValidity();
      }
    }
    this.errormsg = 'Please add atleast one Client-Mail';
  }
  selectionChange(n: any) {
    if (n === 'next') {
      this.stepper.next();
    } else if (n === 'previous') {
      this.stepper.previous();
    }
  }
  openDialogafter() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Client Cancellation Rule',
      bodyText: 'Client detail saved successfully. Do you want to add a client cancellation rule?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.getCancellationRule();
          }
        }
      });
    }
  }
  openDialogafterSite(clientId: any) {
    const popupData = {
      action: this.common.OPEN_NAVIGATE,
      headerText: 'Site',
      bodyText: 'Client detail saved sucessfully. Do you want to create New Site?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.OPEN_NAVIGATE) {
            this.getSite(clientId);
          }
          if (action === this.common.OPEN_ANOTHER) {
            this.openDialogafter();
          }
        }
      });
    }
  }
  getCancellationRule() {
    this.router.navigate(['dashboard/client/cancellation-rule']);
  }

  getSite(clientId: any) {
    this.auth.clientId = clientId;
    this.auth.siteId = 0;
    this.router.navigate(['dashboard/client/siteentry']);
  }

  openPWDialog(data: any) {
    this.pwdFlag = true;
    this.passwordData = data;
    this.dialog.open(this.PDFPasswordDialog,
      {
        width: '400px',
        disableClose: true
      });
    this.hide = true;
    this.passwordCtrl.clearValidators();
    this.passwordCtrl.updateValueAndValidity();
  }
  savePassword() {
    if (this.passwordCtrl.value) {
      this.agentEntryMasterService.savePassword(this.passwordData.clientId, this.passwordCtrl.value, this.sendCrtFlag.value).
        subscribe(resp => {
          if (resp) {
            const savePassword = resp;
            if (this.sendCrtFlag.value !== true) {
              this.agentEntryMasterService.showTopCenter('success', 'Success Message', 'Saved Successfully');
            } else {
              this.agentEntryMasterService.showTopCenter('success', 'Success Message', 'Updated Successfully');
            }
            // ** Added for Nodemail **//
            // this.getPasswordEmail(this.passwordData.clientName, this.passwordCtrl.value);
            // this.clientPassword = [];
          }
        });
      this.passwordCtrl.clearValidators();
      this.passwordCtrl.updateValueAndValidity();
      this.dialog.closeAll();
    } else {
      this.passwordCtrl.setValidators(Validators.required);
      this.passwordCtrl.updateValueAndValidity();
    }
  }
  // ** Added for Nodemail **//
  // getPasswordEmail(clientName, password) {
  //   let emailTemplate;
  //   if (!this.clientPassword) {
  //   emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_PDF_OPENPW).
  //     htmlTemplateBody;
  //   } else {
  //     emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() === this.common.CLIENT_PDF_CRTPW).
  //     htmlTemplateBody;
  //   }
  //   const mailTemp = new MailTemplate();
  //   mailTemp.clientName = clientName;
  //   mailTemp.PDFPwd  = password;
  //   mailTemp.mailbodyheader = 'Hello Team';
  //   const mailData = new MailData();
  //   mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //   this.master.sendEmail(mailData).subscribe(resp => {
  //     this.agentEntryMasterService.showTopCenter('success', 'Success', resp['message']);
  //   });
  // }
  getPassword(data: any) {
    this.agentEntryMasterService.getPassword(data).subscribe(resp => {
      if (resp) {
        // ** Added for Nodemail **//
        // this.clientPassword = resp;
        // if (this.clientPassword !== '' || this.clientPassword !== null) {
        //   this.passwordCtrl.setValue(this.clientPassword);
        //   this.sendCrtFlag.enable();
        //   this.sendCrtFlag.setValue(true);
        // }
        setTimeout(() => {
          this.hide = true;
          this.dt.reset();
          this.global.nativeElement.value = '';
          this.global.nativeElement.type = '';
          const clientPassword = resp;
          if (clientPassword !== '' || clientPassword !== null) {
            this.passwordCtrl.setValue(clientPassword);
            this.sendCrtFlag.enable();
            this.sendCrtFlag.setValue(true);
          } else {
            this.passwordCtrl.setValue('');
            this.sendCrtFlag.disable();
            this.sendCrtFlag.setValue(false);
          }
        });

      } else {
        this.passwordCtrl.setValue('');
        this.sendCrtFlag.disable();
        this.sendCrtFlag.setValue(false);
      }
    });
  }
}
