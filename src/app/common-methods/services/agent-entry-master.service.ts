import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, ValidatorFn, AbstractControl, UntypedFormControl } from '@angular/forms';
import {
  Instruct, SaveClientEntry, ClientEntry, ComponentEntry, ClientAgreement,
  AgreementDocument, ClientInstructions, ClientEmailConfig, AccessClient,
  SubComponent, componentNew, ClientFeeDocumentVm, ClientNoFeeApprovalVm, clientFeeApproval,
   ClientFeesApprovalVm, ClientTATDocumentVm, ClientTATApprovalEmail, ClientTATNoApprovalEmail, ClientLogoTransVm
} from '../models/agentEntryMaster';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { min } from 'rxjs/operators';
import { BreadcrumbFlags } from '../models/breadcrumb-flags';
import { ClientAgreeApproval } from 'src/app/client-entry/client-agreement-approval/client-agreement-approval.component';
@Injectable({
  providedIn: 'root'
})
export class AgentEntryMasterService {
  clientCreationLookupValues: any[] = [];
  pathParameters: string[];
  routePath = 'Client / Client Creation';
  validationFlag: boolean;
  componentnew: componentNew[] = [];
  componentDetail: any[] = [];
  clientEmailConfig: ClientEmailConfig[] = [];
  readonly emailPattern = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$';
  agentDetailsData: any[] = [];
  clientEntryForm: UntypedFormGroup;
  agreementDetailsForm: UntypedFormGroup;
  clientMailIdForm: UntypedFormGroup;
  componentEntryForm: UntypedFormGroup;
  clientInstructionList: ClientInstructions[] = [];
  agreementDocumentList: AgreementDocument[] = [];
  // clientEmailConfig: UntypedFormArray;
  componentEntryList: ComponentEntry[] = [];
  clientInstructionFormGroup: UntypedFormGroup;
  clientAddFlag: any;
  clientid = 0;
  notifyid: number;
  contactid = 0;
  ownerid = 0;
  emailid = 0;
  subid = 0;
  clientTATDocumentList: ClientTATDocumentVm[] = [];
  tempClientTATDocumentList: ClientTATDocumentVm[] = [];
  clientTATPreApprovalEmail: ClientTATApprovalEmail[] = [];
  clientTATApprovalEmail: ClientTATNoApprovalEmail[] = [];
  clientTATPreApprovalEmailList: ClientTATApprovalEmail[] = [];

  clientFeeDocumentList: ClientFeeDocumentVm[] = [];
  // docsClientFeeDocumentList: ClientFeesApprovalVm[] = [];
  tempClientFeeDocumentList: ClientFeeDocumentVm[] = [];
  clientFeeApprovalEmail: ClientNoFeeApprovalVm[] = [];
  clientFeePreApprovalEmail: clientFeeApproval[] = [];
  clientFeePreApprovalEmailList: clientFeeApproval[] = [];
  // typeOfAgreement: any;
  // reminder: any;
  stateid: any;
  bcycleid: any;
  bruleid: any;
  btypeid: any;
  accid: any;
  reportid: any;
  tatFlag = false;
  countryid: any;
  clientContact: any;
  ownerContact: any;
  compid: any;
  subcomponentid: any;
  tempData: any;
  agreementnoflag = false;
  address = new BehaviorSubject(null);
  formLength = 1;
  clientAddFlagTAT: boolean;
  documentValidation = true;
  documentTAT = true;
  completeFlag: boolean;
  reviewFlag = false;
  // ** Added for Nodemail **//
  // clientAgreeCheckFlag: boolean;
  // onHoldFlag: boolean;
  // agreementDetails: any;

  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, public authService: AuthService, public router: Router, private message: MessageService, private formBuilder: UntypedFormBuilder, private common: CommonService) {
    this.initclientEntryFormGroup();
    this.initagreementDetailsFormGroup();
    this.initComponentEntryFormGroup();
    //  /*Future Use---20-08-2019*/ this.initClientMailIdFormGroup();
    this.initclientInstructListFormGroup();
    // /*Future Use---20-08-2019*/this.initemailListFormGroup();
    this.initemailListFormGroup();
  }
  // initclientInstructListFormGroup() {
  //   this.clientInstructionFormGroup = this.formBuilder.group({
  //     instructionName: [],
  //     componentName: [],
  //     instructionTypeId: new UntypedFormControl(null, Validators.required),
  //     componentId: new UntypedFormControl(),
  //     instruction: new UntypedFormControl(null, Validators.required),
  //   });
  // }
  initclientInstructListFormGroup() {
    this.clientInstructionFormGroup = this.formBuilder.group({
      instructionName: [],
      componentName: [],
      instructionTypeId: [],
      componentId: [],
      instruction: []
    });
  }
  /*Future Use---20-08-2019*/
  initemailListFormGroup1() {
    this.clientMailIdForm = this.formBuilder.group({
      categoryName: [],
      destName: [],
      reportName: [],
      categoryLookupId: [],
      emailLookupId: [],
      reportLookupId: [],
      emailId: [null, [Validators.pattern(this.common.EmailRegX)]],
      clientEmailId: [0],
      mailNotification: [false],
    });
  } /*Future Use---20-08-2019*/
  initemailListFormGroup() {
    this.clientMailIdForm = this.formBuilder.group({
      sendTypeLookupId: [],
      categoryLookupId: [],
      reportLookupId: [],
      mailNotification: [false],
      commonEmailDet: this.formBuilder.array([])
    });
  }
  initEmailForm(): UntypedFormGroup {
    return this.formBuilder.group({
      contactData: [null, [Validators.pattern(this.common.EmailRegX)]],
      destLookupId: [],
      transContactId: [0],
      contactId: [0],
      active: [true],
      destName: '',
      lookupId: []
    });
  }
  getformgroup() {
    // tslint:disable-next-line:no-string-literal
    // return this.clientMailIdForm.controls.commonEmail['controls'] as UntypedFormArray;
  }
  resetFormGroup() {
    if (this.clientid) {
      this.clientEntryForm.reset();
      this.componentEntryForm.reset();
      this.clientInstructionFormGroup.reset();
      this.agreementDetailsForm.reset();
    }
    if (this.common.ADD) {
      this.componentEntryList = [];
      this.agreementDocumentList = [];
      this.clientInstructionList = [];
      this.clientEmailConfig = []; /*Future Use---20-08-2019*/
    }
  }

  initclientEntryFormGroup() {
    this.clientEntryForm = this.formBuilder.group({
      finalReportTitle: [null],
      newcomp: [],
      countryName: [],
      stateName: [],
      billingCycleName: [],
      billingRuleName: [],
      billingTypeName: [],
      reportTypeName: [],
      ownerName: [],
      managerName: [],
      indianClientFlag: [null, Validators.required],
      clientName: [null, Validators.required],
      ClientCustomLoa: new UntypedFormGroup({
        clientId: new UntypedFormControl(null),
        clientName: new UntypedFormControl(null),
        createdUserId: new UntypedFormControl(null),
        hasCustomLoa: new UntypedFormControl(false),
        docTypeLookupId: new UntypedFormControl(null),
        docTypeLookupName: new UntypedFormControl(null),
        customLoaDocument: new UntypedFormGroup({
          ClientLoaId: new UntypedFormControl(0),
          customLoaDocId: new UntypedFormControl(0),
          documentTypeId: new UntypedFormControl(0),
          fileName: new UntypedFormControl(null),
          fileType: new UntypedFormControl(null),
        })
      }),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        districtId: new UntypedFormControl(),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(),
        state: new UntypedFormControl(),
        place: new UntypedFormControl(),
        district: new UntypedFormControl(),
        city: new UntypedFormControl()
      }),
      // (/^\(?([A-Z]{2})\)?[-. ]?([A-Z]{3})[-. ]?$/)
      contactPerson: [null, Validators.required],
      phoneNumber: [null, [Validators.minLength(10), Validators.required, Validators.pattern(/^[- 0-9]+$/)]],
      emailId: [null, Validators.compose([Validators.required, Validators.pattern(this.common.EmailRegX)])],
      isActive: [false],
      refNoPrefix: [null, Validators.required],
        // Validators.compose([Validators.required, Validators.pattern(/^[A-Za-z]{2}[-]+[A-Za-z]{3}[-]$/), Validators.max(7)])],
      // noOfAddressForCriminalCheck: [null, [Validators.min(1), Validators.max(4)]],
      billingCycle: [null, Validators.required],
      billingRule: [null, Validators.required],
      billingType: [null, Validators.required],
      panNo: [null, Validators.minLength(10)],
      serviceTaxNo: [null, Validators.minLength(15)],
      mobileNo: [null, Validators.compose([Validators.minLength(10), Validators.pattern(/^[- +0-9]+$/)])],
      retentionPolicyDays: [null, Validators.required],
      applicantIdColumnName: [null, [Validators.required, Validators.minLength(3)]],
      annexureLink: [false],
      finalReportType: [null, Validators.required],
      invitationOptionToCRT: [false],
      refNoManuallyFlag: [false],
      displaySiteNameFlag: [false],
      // caseCreationManual: [],
      // owner: [null],
      toEmailId: [null, [Validators.required, Validators.pattern(this.common.EmailRegX)]],
      ccEmailID: [null, [Validators.required, Validators.pattern(this.common.EmailRegX)]],
      accMobile: [null, Validators.compose([Validators.minLength(10), Validators.pattern(/^[- +0-9]+$/)])],
      // tatCount: [null, [Validators.min(1), Validators.max(15), Validators.required]],
      serviceTaxFlag: [false],
      siteCreationFlag: [false],
      gstNumber: [null],
      clientOnHold: [false],
      chargeCodeFlag: [false],
      clientAccountManager: [null, Validators.required],
      paymentFlag: [false],
      contactRemarkFlag: [false],
      clientColorStatus: [[], Validators.required],
      clientLogo: [], // this.formBuilder.array([])
      docType: [],
      signatureLookUpId: [0],
      supportingDocument: [],
      approvalLimitFlag: [false],
      formatFlag: [false],
      caseByPassFlag: [false],
      caseDatesFlag: [false],
      calendarDaysTATFlag: [false],
      caseCountryFlag: [false],
      caseTypeFlag: [false],
      // Validators.required
    });
  }

  // initComponentEntryFormGroup() {
  //   this.componentEntryForm = this.formBuilder.group({
  //     component: [undefined, Validators.required],
  //     componentDesc: [undefined, Validators.required],
  //     fees: [undefined, [Validators.min(0), Validators.required]],
  //     effectiveDate: [undefined, Validators.required],
  //     tat: [undefined, [Validators.min(0), Validators.required]],
  //     requestorComments: ['']
  //   });
  // }
  initComponentEntryFormGroup() {
    this.componentEntryForm = this.formBuilder.group({
      component: [],
      currency: [],
      componentDesc: [],
      fees: [null, Validators.min(1)],
      effectiveDate: [],
      tat: [null, Validators.min(1)],
      requestorComments: [],
      approvalFee: [],
      componentFeeDocument: [],
      approvalTAT: [],
      componentTATDocument: [],
      feeChange: [],
      TATChange: [],
      requestorCommentsTAT: [],
      deleteDisableFlag: [false]
    });
  }

  initagreementDetailsFormGroup4() {
    this.agreementDetailsForm = this.formBuilder.group({
      clientId: [],
      clientName: [],
      agreementAvailabilityFlag: [true, Validators.required],
      approvalDate: [new Date()],
      approvalStatus: '', // null pass
      typeOfAgreement: [],
      remarks: [],
      dateOfAgreement: [],
      validity: [],
      autoRenewal: [],
      dateOfExpiry: [],
      reasonofNonAvailability: [],
      fileName: [],
      createdBy: 1,
      clientStatus: [],
      createdDate: [new Date()],
      reminder: [],
      autoRenewalPeriod: [null, Validators.min(1)]
    });
  }

  initagreementDetailsFormGroup() {
    this.agreementDetailsForm = this.formBuilder.group({
      agreementName: [],
      reminderName: [],
      agreementAvailability: [null, Validators.required],
      reasonForNonAvailability: [],
      typeOfAgreement: [],
      dateOfAgreement: [],
      validity: [],
      autoRenewel: [],
      autoRenewelPeriod: [],
      dateOfExpiry: [],
      reminder: [],
      remarks: [],
      supportingDocument: [],
    });
  }

  initClientMailIdFormGroup() {
    this.clientMailIdForm = this.formBuilder.group({
      clientEmailConfig: this.formBuilder.array([this.initItemRows()])
    });
  }

  // addMailIdContent(index: any) {
  //   this.clientEmailConfig = this.clientMailIdForm.get('clientEmailConfig') as UntypedFormArray;
  //   const frmgroup = this.clientEmailConfig.controls[index] as UntypedFormGroup;
  //   const controlNames = ['categoryLookupId', 'emailLookupId', 'reportLookupId', 'emailId'];
  //   for (const ctrl in frmgroup.controls) {
  //     if (frmgroup.controls.hasOwnProperty(ctrl)) {
  //       if (controlNames.indexOf(ctrl) > -1) {
  //         if (ctrl === 'emailId') {
  //           frmgroup.get(ctrl).setValidators(Validators.compose(
  //             [Validators.pattern(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/), Validators.minLength(1), Validators.required]));
  //           frmgroup.get(ctrl).updateValueAndValidity();
  //         }
  //         if (frmgroup.get(ctrl).valid) {
  //           frmgroup.get(ctrl).markAsTouched();
  //           frmgroup.get(ctrl).setValidators(Validators.required);
  //           frmgroup.get(ctrl).updateValueAndValidity();
  //         }
  //       }
  //     }
  //   }
  //   if (this.clientMailIdForm.valid) {
  //     (this.clientMailIdForm.get('clientEmailConfig') as UntypedFormArray).push(this.initItemRows());
  //   }
  // }

  deleteMailIdContent(index: number) {
    (this.clientMailIdForm.get('clientEmailConfig') as UntypedFormArray).removeAt(index);
  }

  initItemRows() {
    return this.formBuilder.group({
      categoryName: [],
      destName: [],
      reportName: [],
      categoryLookupId: [],
      emailLookupId: [],
      reportLookupId: [],
      emailId: [],
      clientEmailId: [0],
      mailNotification: [false],
    });
  }

  // saveClientEntryData() {

  //   // console.log(this.clientMailIdForm);

  //   const clientEntryData: ClientEntry = {
  //     clientId: this.clientid,
  //     clientName: this.clientEntryForm.get('clientName')?.value,
  //     address1: this.clientEntryForm.get('address1')?.value,
  //     address2: this.clientEntryForm.get('address2')?.value,
  //     address3: this.clientEntryForm.get('address3')?.value,
  //     city: this.clientEntryForm.get('city')?.value,
  //     stateId: this.clientEntryForm.get('state')?.value,  // ?
  //     countryId: this.clientEntryForm.get('country')?.value, // ?
  //     zipCode: this.clientEntryForm.get('zipCode')?.value, // ?
  //     createdDate: new Date(), // ?
  //     createdBy: 1, // ?
  //     modifyBy: 1, // ?
  //     modifiedDate: new Date(), // ?
  //     active: this.clientEntryForm.get('isActive')?.value, // ?
  //     emailId: this.clientEntryForm.get('emailId')?.value,
  //     contactPerson: this.clientEntryForm.get('contactPerson')?.value,
  //     phoneNumber: this.clientEntryForm.get('phoneNumber')?.value,
  //     isEmail: true, // ?
  //     dssiContact: 'null',
  //     dssiToEmailId: this.clientEntryForm.get('toEmailId')?.value,
  //     dssiCcEmailId: this.clientEntryForm.get('ccEmailID')?.value,
  //     dssiOwner: +this.clientEntryForm.get('owner')?.value, // ?
  //     accessType: 'client',
  //     addressOption: +(this.clientEntryForm.get('noOfAddressForCriminalCheck')?.value), // ?
  //     cancel: false,
  //     refNo: this.clientEntryForm.get('refNoPrefix')?.value,
  //     ruleId: this.clientEntryForm.get('billingRule')?.value, // ?
  //     bcId: this.clientEntryForm.get('billingCycle')?.value, // ?
  //     pan: this.clientEntryForm.get('panNo')?.value,
  //     serviceTaxNo: '' + this.clientEntryForm.get('serviceTaxNo')?.value,
  //     mobileNo: '' + (this.clientEntryForm.get('mobileNo')?.value),
  //     tatCount: +this.clientEntryForm.get('tatCount')?.value, // ?
  //     tatRuleId: 2, // ?
  //     billingTypeId: this.clientEntryForm.get('billingType')?.value,
  //     cgstin: '' + this.clientEntryForm.get('gstNumber')?.value,
  //     clientStatus: this.clientEntryForm.get('clientOnHold')?.value, // ?
  //     serviceTaxFlag: this.clientEntryForm.get('serviceTaxFlag')?.value, // ?
  //     dataRetentionPolicyDays: this.clientEntryForm.get('retentionPolicyDays')?.value, // ?
  //     applicantIdColumnName: this.clientEntryForm.get('applicantIdColumnName')?.value,
  //     finalReportTypeId: this.clientEntryForm.get('finalReportType')?.value,
  //     annexureLinkFlag: this.clientEntryForm.get('annexureLink')?.value, // ?
  //     clientAccountManagerId: 0,  // this.clientEntryForm.get('clientAccountManager')?.value,
  //     // caseCreationFlag: this.clientEntryForm.get('caseCreationManual')?.value, // ?
  //     optionToCreateInvitation: this.clientEntryForm.get('invitationOptionToCRT')?.value,
  //     clientContact: [
  //       {
  //         ContactId: this.contactid, lookUpCatId: 0,
  //         lookUpId: 50, lookUpName: '', lookUpValue: this.clientEntryForm.get('phoneNumber')?.value
  //       },
  //       {
  //         ContactId: this.contactid,
  //         lookUpCatId: 0, lookUpId: 51, lookUpName: '', lookUpValue: this.clientEntryForm.get('mobileNo')?.value
  //       },
  //       {
  //         ContactId: this.contactid,
  //         lookUpCatId: 0, lookUpId: 53, lookUpName: '', lookUpValue: this.clientEntryForm.get('emailId')?.value
  //       }
  //     ],
  //     ownerContact: [
  //       {
  //         ContactId: this.ownerid,
  //         lookUpCatId: 0, lookUpId: 81, lookUpName: '', lookUpValue: this.clientEntryForm.get('toEmailId')?.value
  //       },
  //       {
  //         ContactId: this.ownerid,
  //         lookUpCatId: 0, lookUpId: 82, lookUpName: '', lookUpValue: this.clientEntryForm.get('ccEmailID')?.value
  //       }
  //     ],
  //     clientActiveDate: new Date(),
  //     clientDeActiveDate: new Date()
  //   };
  //   // this.componentEntryList.forEach
  //   // if (this.iscomponentDescList) {
  //   //   const subComponentEntry: SubComponent = {
  //   //     subComponentId: this.componentEntry.subCompId,
  //   //     clientComponentId: this.componentEntry.componentId,
  //   //     serviceId: this.componentEntry.componentId,
  //   //     fees: this.componentEntry.fees,
  //   //     tat: this.componentEntry.tat,
  //   //     subReportType: this.componentEntry.componentDesc,
  //   //     subReportDesc: null,
  //   //     cancel: false,
  //   //     msp: 0,
  //   //     nrp: 0,
  //   //   };
  //   //   if (data && this.iscomponentDescList) {
  //   //     data.subComponentEntry.push(subComponentEntry);
  //   //   } else {
  //   //     this.componentEntry.subComponentEntry.push(subComponentEntry);
  //   //     this.agentEntryMasterService.componentEntryList.push(this.commonService.CloneObject(this.componentEntry));
  //   //   }
  //   // console.log('clientInstructionList', clientInstructionList);

  //   const clientAgreementData: ClientAgreement = {
  //     clientId: this.clientid,
  //     clientName: '',
  //     agreementAvailabilityFlag: this.agreementDetailsForm.get('agreementAvailability')?.value,
  //     approvalDate: new Date(),
  //     approvalStatus: '', // null pass
  //     typeOfAgreement: this.agreementDetailsForm.get('typeOfAgreement')?.value,
  //     remarks: '', //
  //     dateOfAgreement: this.agreementDetailsForm.get('dateOfAgreement')?.value,
  //     validity: this.agreementDetailsForm.get('validity')?.value,
  //     autoRenewal: this.agreementDetailsForm.get('autoRenewel')?.value,
  //     dateOfExpiry: this.agreementDetailsForm.get('dateOfExpiry')?.value,
  //     reasonofNonAvailability: this.agreementDetailsForm.get('reasonForNonAvailability')?.value,
  //     fileName: this.agreementDetailsForm.get('supportingDocument')?.value,
  //     createdBy: 1,
  //     clientStatus: false, //
  //     createdDate: new Date(),
  //     reminder: 1, //
  //     autoRenewalPeriod: +(this.agreementDetailsForm.get('autoRenewelPeriod')?.value),
  //   };
  //   // console.log('clientAgreement', clientAgreementData);

  //   const agreementDocumentList: AgreementDocument[] = [];
  //   this.agreementDocumentList.forEach(e => {
  //     const agreementDocument: AgreementDocument = {
  //       agreementDocId: e.agreementDocId,
  //       fileName: e.fileName,
  //       document: e.document,
  //     };
  //     agreementDocumentList.push(agreementDocument);
  //   });

  //   // const clientEmailConfigList: ClientEmailConfig[] = [];
  //   // this.clientMailIdForm.value.mailIdContent.forEach(element => {
  //   //   const clientEmailConfig: ClientEmailConfig = {
  //   //     clientEmailId: 0,
  //   //     clientId: 1,
  //   //     emailCategoryType: element.emailCatType,
  //   //     emailDestType: element.emailDestType,
  //   //     emailId: element.emailId,
  //   //     mailNotification: element.sendEmail,
  //   //     createdBy: 1,
  //   //     createdDate: new Date(),
  //   //     sendType: element.sendType,
  //   //     reportLookupId: element.reportType,
  //   //     modifiedBy: 1,
  //   //     modifiedDate: new Date(),
  //   //   };
  //   //   clientEmailConfigList.push(clientEmailConfig);
  //   // });

  //   // const clientEmailConfigList: ClientEmailConfig[] = [];
  //   // this.clientMailIdForm.value.clientEmailConfig.forEach((element) => {
  //   //   const clientEmailConfig: ClientEmailConfig = {
  //   //     clientEmailId: element.clientEmailId,
  //   //     clientId: this.clientid,
  //   //     categoryName: element.categoryName,
  //   //     categoryLookupId: element.categoryLookupId,
  //   //     emailLookupId: element.emailLookupId,
  //   //     emailId: element.emailId,
  //   //     mailNotification: element.mailNotification,
  //   //     createdBy: 1,
  //   //     createdDate: new Date(),
  //   //     reportLookupId: element.reportLookupId,
  //   //     modifiedBy: 1,
  //   //     modifiedDate: new Date(),
  //   //   };

  //   //   clientEmailConfigList.push(clientEmailConfig);

  //   // });

  //   this.check();
  //   const saveClientEntry: SaveClientEntry = {
  //     loggedIn: this.authService.userdata.userId,
  //     clientEntry: clientEntryData,
  //     componentEntry: this.componentEntryList,
  //     clientAgreement: clientAgreementData,
  //     clientAgreementDocument: agreementDocumentList,
  //     clientInstruction: this.clientInstructionList,
  //     clientEmailConfig: clientEmailConfig,
  //   };
  //   const formData = new FormData();
  //   formData.append('ClientEntry', JSON.stringify(saveClientEntry));
  //   if (saveClientEntry.clientAgreementDocument) {
  //     for (let i = 0; i < saveClientEntry.clientAgreementDocument.length; i++) {
  //       formData.append('AgreementDocument_' + i, saveClientEntry.clientAgreementDocument[i].document);
  //     }
  //   }
  //   this.saveClientEntryDetails(formData).subscribe(res => {
  //     console.log(res);
  //     if (res) {
  //       if (clientEntryData.clientId > 0) {
  //         this.showTopCenter('success', 'Success Message', 'Updated Successfully');
  //       } else {
  //         this.showTopCenter('success', 'Success Message', 'Added Successfully');
  //       }
  //       // this.router.navigate(['/dashboard/client/agententrymaster']);
  //     }
  //   }, err => {
  //     console.log(err);
  //   }, () => {

  //   });
  // }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  onEdit(data): Observable<any> {
    this.clientid = data;
    this.clientEntryForm.get('clientLogo')?.setValue([]);
    this.clientEntryForm.get('clientName')?.disable();
    this.componentEntryList = [];
    this.clientEmailConfig = []; /*Future Use---20-08-2019*/
    this.clientInstructionList = [];
    this.clientFeeApprovalEmail = [];
    this.clientFeePreApprovalEmailList = [];
    this.tempClientFeeDocumentList = [];
    this.clientFeePreApprovalEmail = [];
    this.clientTATApprovalEmail = [];
    this.tempClientTATDocumentList = [];
    this.clientTATPreApprovalEmail = [];
    this.clientTATPreApprovalEmailList = [];
    // this.clientFeeDocument = [];
    // this.clientInstructionList = [];
    // this.clientEntryForm.reset();
    // this.clientEntryForm.reset();
    this.address = new BehaviorSubject(null);
    this.GetClientDetails(data).subscribe(res => {
      if (res) {
        // console.log(res, 'update');
        const clientLogo: ClientLogoTransVm[] = res.clientLogo;
        clientLogo.forEach(logo => {
          this.GetDocByFilePath(logo.filePath).subscribe(docByte => {
            logo.document = docByte;
          });
        });
        this.clientContact = res.clientEntry.clientContact;
        this.ownerContact = res.clientEntry.ownerContact;
        res.clientEntry.clientContact.forEach((element, i) => {
          this.contactid = element.contactId;
        });
        res.clientEntry.ownerContact.forEach((element, i) => {
          this.ownerid = element.contactId;
        });
        // this.tempData = res;
        const clientEntryData: ClientEntry = res.clientEntry;
        this.completeFlag = clientEntryData.completeFlag;
        this.clientid = res.clientEntry.clientId;
        this.stateid = res.clientEntry.stateId;
        this.countryid = res.clientEntry.countryId;
        this.bcycleid = res.clientEntry.bcId;
        this.bruleid = res.clientEntry.ruleId;
        this.btypeid = res.clientEntry.billingTypeId;
        // this.ownerid = res.clientEntry.dssiOwner;
        this.reportid = res.clientEntry.finalReportTypeId;
        this.accid = res.clientEntry.clientAccountManagerId;
        const clientAgreementData: ClientAgreement = res.clientAgreement;
        this.agreementnoflag = res.clientAgreement ? res.clientAgreement.agreementApprovalFlag : false;
        // this.typeOfAgreement = res.clientAgreement.typeOfAgreement;
        // this.reminder = res.clientAgreement.reminder;
        this.agreementDocumentList = res.clientAgreementDocument;
        if (this.agreementDocumentList) {
          this.agreementDocumentList.forEach(element => {
            const agreementDocument = new AgreementDocument();
            agreementDocument.agreementDocId = element.agreementDocId;
            agreementDocument.document = element.document;
            agreementDocument.fileName = element.fileName;
          });
        }
        // const control = this.clientMailIdForm.get('clientEmailConfig') as UntypedFormArray;
        // this.clientEmailConfig = res.clientEmailConfig;
        // res.clientEmailConfig.forEach((element, i) => {
        //   this.notifyid = element.clientEmailId;
        // });
        // console.log(this.notifyid, 'note')
        // const emaillength = this.clientEmailConfig.length - 1;
        // for (let i = 0; emaillength > i; i++) {
        //   control.push(this.initItemRows());
        // }
        // this.bindDetails(clientEntryData);
        // this.indianFlag = clientEntryData.indianClientFlag;
        this.clientEntryForm.patchValue({
          clientName: clientEntryData.clientName,
          indianClientFlag: clientEntryData.indianClientFlag,
          // address1: clientEntryData.address1,
          // address2: clientEntryData.address2,
          // address3: clientEntryData.address3,
          // country: clientEntryData.countryId,
          // state: clientEntryData.stateId,
          // city: clientEntryData.city,
          // zipCode: clientEntryData.zipCode,
          contactPerson: clientEntryData.contactPerson,
          phoneNumber: clientEntryData.clientContact.length !== 0 ? clientEntryData.clientContact[0].lookUpValue : null,
          mobileNo: clientEntryData.clientContact.length !== 0 ? clientEntryData.clientContact[1].lookUpValue : null,
          emailId: clientEntryData.clientContact.length !== 0 ? clientEntryData.clientContact[2].lookUpValue : null,
          isActive: clientEntryData.active,
          refNoPrefix: clientEntryData.refNo,
          // noOfAddressForCriminalCheck: clientEntryData.addressOption,
          billingCycle: clientEntryData.bcId,
          billingRule: clientEntryData.ruleId,
          billingType: clientEntryData.billingTypeId,
          panNo: clientEntryData.pan,
          serviceTaxNo: clientEntryData.serviceTaxNo,
          retentionPolicyDays: clientEntryData.dataRetentionPolicyDays,
          applicantIdColumnName: clientEntryData.applicantIdColumnName,
          finalReportType: clientEntryData.finalReportTypeId,
          annexureLink: clientEntryData.annexureLinkFlag,
          refNoManuallyFlag: clientEntryData.refNoManuallyFlag,
          displaySiteNameFlag: clientEntryData.displaySiteNameFlag,
          invitationOptionToCRT: clientEntryData.optionToCreateInvitation,
          // caseCreationManual: clientEntryData.caseCreationFlag,
          // owner: clientEntryData.dssiOwner,
          toEmailId: clientEntryData.ownerContact.length !== 0 ? clientEntryData.ownerContact[0].lookUpValue : null,
          ccEmailID: clientEntryData.ownerContact.length !== 0 ? clientEntryData.ownerContact[1].lookUpValue : null,
          accMobile: clientEntryData.ownerContact.length !== 0 ? clientEntryData.ownerContact[2].lookUpValue : null,
          // tatCount: clientEntryData.tatCount,
          gstNumber: clientEntryData.cgstin,
          siteCreationFlag: clientEntryData.siteCreationFlag,
          serviceTaxFlag: clientEntryData.serviceTaxFlag,
          clientOnHold: clientEntryData.clientStatus,
          chargeCodeFlag: clientEntryData.chargeCodeFlag,
          clientAccountManager: clientEntryData.clientAccountManagerId,
          paymentFlag: clientEntryData.paymentFlag,
          contactRemarkFlag: clientEntryData.contactRemarkFlag,
          clientColorStatus: res.clientColorStatus,
          // tslint:disable-next-line: object-literal-shorthand
          clientLogo: clientLogo,
          approvalLimitFlag: clientEntryData.approvalLimitFlag,
          formatFlag: clientEntryData.formatFlag,
          caseByPassFlag: clientEntryData.caseByPassFlag,
          caseDatesFlag: clientEntryData.caseDatesFlag,
          calendarDaysTATFlag: clientEntryData.calendarDaysTATFlag,
          caseTypeFlag: clientEntryData.caseTypeFlag,
          caseCountryFlag: clientEntryData.caseCountryFlag,
          finalReportTitle: clientEntryData.finalReportTitle
        });
        setTimeout(() => {
          this.clientEntryForm.patchValue({clientAccountManager: clientEntryData.clientAccountManagerId});
          // tslint:disable-next-line: object-literal-shorthand
          this.clientEntryForm.patchValue({clientLogo: clientLogo});
        }, 10);
        // ** Added for Nodemail **//
        // this.onHoldFlag = clientEntryData.clientStatus;
        const clientEntryData2 = clientEntryData as any;
        (this.clientEntryForm.get('address') as UntypedFormGroup).patchValue(clientEntryData2.address as any
          //   {
          //   addLine1: clientEntryData.address1,
          //   addLine2: clientEntryData.address2,
          //   addLine3: clientEntryData.address3,
          //   city: clientEntryData.city,
          //   // district: new UntypedFormControl(),
          //   // place: new UntypedFormControl(),
          //   stateId: clientEntryData.stateId,
          //   countryId: clientEntryData.countryId,
          //   postalCode: clientEntryData.zipCode,
          // }
        );
        this.address = new BehaviorSubject(clientEntryData2.address);
        this.address.next(clientEntryData2.address);
        if (clientEntryData.ownerContact.length === 0) {
          this.ownerContact = null;
          this.ownerid = 0;
        }
        if (clientEntryData.clientContact.length === 0) {
          this.clientContact = null;
          this.contactid = 0;
        }
        // setTimeout(() => {
        //   // this.clientEntryForm.patchValue({ country: clientEntryData.countryId });
        // }, 200);
        // setTimeout(() => {
        //   // this.clientEntryForm.patchValue({ state: clientEntryData.stateId });
        // }, 300);
        if (clientAgreementData !== null) {
          this.agreementDetailsForm.patchValue({
            agreementAvailability: clientAgreementData.agreementAvailabilityFlag,
            reasonForNonAvailability: clientAgreementData.reasonofNonAvailability,
            typeOfAgreement: clientAgreementData.typeOfAgreement,
            dateOfAgreement: clientAgreementData.dateOfAgreement,
            validity: clientAgreementData.validity,
            autoRenewel: clientAgreementData.autoRenewal,
            autoRenewelPeriod: clientAgreementData.autoRenewalPeriod,
            dateOfExpiry: clientAgreementData.dateOfExpiry,
            reminder: clientAgreementData.reminder,
            remarks: clientAgreementData.remarks,
            agreementName: clientAgreementData.agreementName,
            reminderName: clientAgreementData.reminderName,
          });
          // ** Added for Nodemail **//
          //   this.clientAgreeCheckFlag = clientAgreementData.agreementAvailabilityFlag;
          //   this.agreementDetails = clientAgreementData;
          // } else {
          //   if (clientAgreementData === null) {
          //     this.agreementDetails = '';
          //     }
        }


        res.clientInstruction.forEach(element => {
          const insObj: ClientInstructions = {
            clientPolicyId: element.clientPolicyId,
            clientId: element.clientId,
            componentId: element.componentId,
            reportType: '',
            instructionTypeId: element.instructionTypeId,
            instruction: element.instruction,
            createdBy: 0,
            createdDate: new Date(),
            updatedBy: 0,
            updatedDate: new Date(),
            active: false,
            lookUpName: element.lookUpName,
            rptType: element.rptType,
          };
          this.clientInstructionList.push(insObj);
        });
        setTimeout(() => {
          res.componentEntry.forEach((element, i) => {
            if (element.isSubComponent === true) {
              // tslint:disable-next-line:prefer-for-of
              for (let j = 0; j < element.subComponentEntry.length; j++) {
                const obj: ComponentEntry = {
                  clientComponentId: element.subComponentEntry[j].clientComponentId,
                  componentType: element.subComponentEntry[j].componentName,
                  componentDesc: element.subComponentEntry[j].subReportType,
                  fees: element.subComponentEntry[j].fees,
                  tat: element.subComponentEntry[j].tat,
                  componentId: element.subComponentEntry[j].serviceId,
                  clientId: element.clientid,
                  effectiveDate: element.subComponentEntry[j].effectiveDate,
                  isSubComponent: true,
                  subCompId: element.subComponentEntry[j].subComponentId,
                  clientsubid: element.subComponentEntry[j].clientSubComponentId,
                  active: element.subComponentEntry[j].active,
                  clientFeeApprovalFlag: element.clientFeeApprovalFlag,
                  clientFeesApproval: element.clientFeesApproval,
                  clientTATApproval: element.clientTATApproval,
                  feeDisableFlag: element.subComponentEntry[j].feeDisableFlag,
                  tatDisableFlag: element.subComponentEntry[j].tatDisableFlag,
                  subComponentEntry: [],
                  clientFeeDocument: [],
                  clientTATDocument: [],
                  deleteDisableFlag: element.deleteDisableFlag,
                  compEditFlag: element.compEditFlag,
                  currencyId: element.subComponentEntry[j].currencyId
                };
                obj.subComponentEntry.push(element.subComponentEntry[j]);
                this.componentEntryList.push(obj);
              }

            } else {
              const obj: ComponentEntry = {
                clientComponentId: element.clientComponentId,
                componentType: element.componentType,
                componentDesc: element.componentDesc,
                fees: element.fees,
                tat: element.tat,
                componentId: element.componentId,
                clientId: element.clientId,
                effectiveDate: element.effectiveDate,
                isSubComponent: element.isSubComponent,
                subCompId: 0,
                clientsubid: 0,
                active: element.active,
                clientFeeApprovalFlag: element.clientFeeApprovalFlag,
                clientFeesApproval: element.clientFeesApproval,
                clientTATApproval: element.clientTATApproval,
                subComponentEntry: element.subComponentEntry,
                feeDisableFlag: element.feeDisableFlag,
                tatDisableFlag: element.tatDisableFlag,
                deleteDisableFlag: element.deleteDisableFlag,
                clientFeeDocument: [],
                clientTATDocument: [],
                compEditFlag: element.compEditFlag,
                currencyId: element.currencyId
              };
              this.componentEntryList.push(obj);
            }
          });
        }, 1);

        /*Future Use---20-08-2019*/
        res.clientEmailConfig.forEach(element => {
          const emailobj: ClientEmailConfig = {
            // clientEmailId: element.clientEmailId,
            // clientId: element.clientId,
            // categoryName: element.categoryName,
            // typeName: element.typeName,
            // categoryLookupId: element.categoryLookupId,
            // emailLookupId: element.emailLookupId,
            // emailId: element.emailId,
            // mailNotification: element.mailNotification,
            // createdBy: 0,
            // createdDate: new Date(),
            // reportLookupId: element.reportLookupId,
            // modifiedBy: 0,
            // modifiedDate: new Date(),
            // reportName: element.
            notifyId: element.notifyId,
            clientId: this.clientid,
            categoryLookupId: element.categoryLookupId,
            reportLookupId: element.reportLookupId,
            sendTypeLookupId: element.sendTypeLookupId,
            mailNotification: element.mailNotification,
            active: element.active,
            commonEmailDet: element.commonEmailDet,
            categoryName: element.categoryName,
            reportName: element.reportName,
            sendTypeName: element.sendTypeName
          };
          this.clientEmailConfig.push(emailobj);
        });
        /*Future Use---20-08-2019*/



        // res.componentEntry.forEach((element, i) => {
        //   if (element.isSubComponent === true) {

        //     // tslint:disable-next-line:prefer-for-of
        //     for (let j = 0; j < element.subComponentEntry.length; j++) {
        //       const obj: ComponentEntry = {
        //         clientComponentId: element.subComponentEntry[j].clientComponentId,
        //         componentType: element.subComponentEntry[j].componentName,
        //         componentDesc: element.subComponentEntry[j].subReportType,
        //         fees: element.subComponentEntry[j].fees,
        //         tat: element.subComponentEntry[j].tat,
        //         componentId: element.subComponentEntry[j].serviceId,
        //         clientId: element.clientid,
        //         effectiveDate: element.subComponentEntry[j].effectiveDate,
        //         isSubComponent: true,
        //         subCompId: element.subComponentEntry[j].subComponentId,
        //         clientsubid: element.subComponentEntry[j].clientSubComponentId,
        //         active: element.subComponentEntry[j].active,
        //         clientFeeApprovalFlag: element.clientFeeApprovalFlag,
        //         clientFeesApproval: element.clientFeesApproval,
        //         feeDisableFlag: element.subComponentEntry[j].feeDisableFlag,
        //         subComponentEntry: element.subComponentEntry,
        //         clientFeeDocument: [],
        //         deleteDisableFlag: element.deleteDisableFlag
        //       };
        //       this.componentEntryList.push(obj);
        //     }

        //   } else {
        //     const obj: ComponentEntry = {
        //       clientComponentId: element.clientComponentId,
        //       componentType: element.componentType,
        //       componentDesc: element.componentDesc,
        //       fees: element.fees,
        //       tat: element.tat,
        //       componentId: element.componentId,
        //       clientId: element.clientId,
        //       effectiveDate: element.effectiveDate,
        //       isSubComponent: element.isSubComponent,
        //       subCompId: 0,
        //       clientsubid: 0,
        //       active: element.active,
        //       clientFeeApprovalFlag: element.clientFeeApprovalFlag,
        //       clientFeesApproval: element.clientFeesApproval,
        //       subComponentEntry: element.subComponentEntry,
        //       feeDisableFlag: element.feeDisableFlag,
        //       deleteDisableFlag: element.deleteDisableFlag,
        //       clientFeeDocument: []
        //     };
        //     this.componentEntryList.push(obj);
        //   }
        // });
      }
    });
    this.pathParameters = [this.common.UPDATE, this.routePath];
    this.common.FlagEvent(this.pathParameters);
    return null;
  }

  // Get GetClientDetails
  // public getClientDetails(countryId: number, stateId: number): Observable<any> {
  //   const dataUrl = 'ClientEntries/GetClientDetails?countryId=' + countryId + '&stateId=' + stateId +
  //     '&loggedIn=' + this.authService.userdata.userId;
  //   return this.http.get(dataUrl);
  // }
  public getClientDetails(data: AccessClient): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientDetails';
    return this.http.post(dataUrl, data);
  }

  // Get getAgentDetails
  public getAgentDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetAgentDetails';
    return this.http.get(dataUrl);
  }
  public getCurrencyDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetCurrencyDetail';
    return this.http.get(dataUrl);
  }
  // GetComponentDetails
  public getComponentDetails(indianClientFlag: boolean): Observable<any> {
    const dataUrl = 'ClientEntries/GetComponentDetails?indianClientFlag=' + indianClientFlag;
    return this.http.get(dataUrl);
  }
  public getComponentGridDetails(): Observable<any> {
    const dataUrl = 'Master/GetMasterComponents';
    return this.http.get(dataUrl);
  }
  updateComponentTblRows(reOrderRows): Observable<any> {
    const dataUrl = 'Master/UpdateComponentOrder';
    return this.http.post<any[]>(dataUrl, reOrderRows);
  }
  // GetClientMasterDetails
  public getClientMasterDetails(teamId: number, subTeamId: number): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientMasterDetails?teamId=' + teamId + '&subTeamId=' + subTeamId;
    return this.http.get(dataUrl);
  }
  // GetClientInstructionDetails
  public getClientInstructionDetails(indianClientFlag: boolean): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientInstructionDetails?indianClientFlag=' + indianClientFlag;
    return this.http.get(dataUrl);
  }
  // GetAgreementDetails
  public getAgreementDetails(): Observable<any> {
    const dataUrl = 'ClientEntries/GetAgreementDetails';
    return this.http.get(dataUrl);
  }
  public getDocumentDetail(docId: number): Observable<any> {
    const dataUrl = 'ClientEntries/getDocumentDetails?docId=' + docId;
    return this.http.get(dataUrl);
  }
  // GetClientAndSiteLookup
  public GetClientAndSiteLookup(): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientAndSiteLookup';
    return this.http.get(dataUrl);
  }

  // InsertClientEntryDetails
  public saveClientEntryDetails(saveClientEntry: FormData): Observable<any> {
    const dataUrl = 'ClientEntries/InsertClientEntryDetails';
    return this.http.post(dataUrl, saveClientEntry);
  }
  // GetComponetDetails
  public GetPackageComponent(clientId): Observable<any> {
    const dataUrl = 'Master/GetPackageComponent?clientId=' + clientId;
    return this.http.get(dataUrl);
  }

  public GetClientDetails(clientId): Observable<any> {
    const dataUrl = 'ClientEntries/GetAllEntryDetails?clientId=' + clientId + '&loggedIn=' + this.authService.userdata.userId;
    return this.http.get(dataUrl);
  }
  CheckClientSiteFlag(clientId: number) {
    const dataUrl = 'ClientEntries/CheckClientSiteFlag?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  public GetClientSiteMailInfo(clientId: number): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientSiteMailInfo?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  GetClientAddress(clientId: any) {
    const dataUrl = 'ClientEntries/GetClientAddress?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  public DeleteClientDetails(clientId): Observable<any> {
    const dataUrl = 'ClientEntries/DeleteClientDetails?clientId=' + clientId + '&loggedIn=' + this.authService.userdata.userId;
    return this.http.get(dataUrl);
  }
  GetDocByFilePath(filePath: any) {
    const dataUrl = 'ClientEntries/GetDocByFilePath?filePath=' + filePath;
    return this.http.get<any>(dataUrl);
  }

  check() {
    const dupvalues: number[] = [];
    this.componentEntryList.forEach(e => {
      if (!dupvalues.includes(e.componentId)) {
        if (this.componentEntryList.filter(el => el.componentId === e.componentId).length > 1) {
          const copydata: ComponentEntry[] = this.componentEntryList.filter(r => r.componentId === e.componentId);
          this.componentEntryList = this.componentEntryList.filter(del => del.componentId !== e.componentId);
          let copydata1 = new ComponentEntry();
          copydata.forEach((data, index) => {
            // const subComponent: SubComponent = {
            //   subComponentId: 0, //data.subCompId,
            //   clientComponentId: 0,
            //   serviceId: data.componentId,
            //   fees: data.fees,
            //   tat: data.tat,
            //   subReportType: data.componentType,
            //   subReportDesc: data.componentType,
            //   cancel: false,
            //   msp: 0,
            //   nrp: 0,
            // };
            if (index === 0) {
              copydata1 = data;
            } else {
              copydata1.subComponentEntry.push(data.subComponentEntry[0]);
            }
          });
          copydata1.clientFeesApproval = null;
          this.componentEntryList.push(copydata1);
        }
      }
      dupvalues.push(e.componentId);
    });
    // console.log(dupvalues);
    // console.log(this.componentEntryList);
  }
  GetFOCDetail(): Observable<any> {
    const dataUrl = 'ClientEntries/GetFOCDetail';
    return this.http.get<any>(dataUrl);
  }
  GetSearchClientFeeApprovalFiles(userId: number, teamName: string,status :string): Observable<any> {
    const dataUrl = 'ClientEntries/GetSearchClientFeeApprovalFiles?userId=' + userId + '&teamName=' + teamName+ '&status=' + status;
    return this.http.get<any>(dataUrl);
  }
  GetClientFeeDocument(clientId, compFeeId): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientFeeDocument/?clientId=' + clientId + '&compFeeId=' + compFeeId;
    return this.http.get<any>(dataUrl);
  }
  GetClientTATDocument(compTATId): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientTATDocument/?compTATId=' + compTATId;
    return this.http.get<any>(dataUrl);
  }
  saveClientFeeApproveDocument(data: FormData): Observable<any> {
    const dataUrl = 'ClientEntries/ClientFeeApproveDocument';
    return this.http.post<any>(dataUrl, data);
  }
  ClientApproveDocument(data: FormData): Observable<any> {
    const dataUrl = 'ClientEntries/ClientApproveDocument';
    return this.http.post<any>(dataUrl, data);
  }
  AddComponent(Component: any): Observable<any> {
    const dataUrl = 'Master/AddComponents';
    return this.http.post(dataUrl, Component);
  }

  GetComponentsById(compId: number): Observable<any> {
    const dataUrl = 'Master/GetComponentsById?compId=' + compId;
    return this.http.get<any>(dataUrl);
  }

  // CheckClientName
  public checkClientName(client): Observable<any> {
    const dataUrl = 'ClientEntries/CheckClientName';
    return this.http.post(dataUrl, client);
  }
  public deleteComponent(compId): Observable<any> {
    const dataUrl = 'Master/DeleteComponent?compId=' + compId + '&CreatedUserId=' + this.authService.userdata.userId;
    return this.http.get(dataUrl);
  }
  public deleteSubComponent(subCompId): Observable<any> {
    const dataUrl = 'Master/DeleteSubComponent?subCompId=' + subCompId + '&CreatedUserId=' + this.authService.userdata.userId;
    return this.http.get(dataUrl);
  }
  // CheckClientRefPrefixNo
  public checkClientRefPrefixNo(refPrefix: string, clientid: number): Observable<any> {
    const dataUrl = 'ClientEntries/CheckClientRefPrefixNo?refPrefix=' + refPrefix + '&clientid=' + clientid;
    return this.http.get(dataUrl);
  }
  checkExistingComponent(componentName: string): Observable<any> {
    const dataUrl = 'Master/CheckComponentName?componentName=' + componentName;
    return this.http.get(dataUrl);
  }
  // GetDepartmentNotify
  public GetDepartmentNotify(deptId = 0): Observable<any> {
    const dataUrl = 'Master/GetDepartmentNotify?deptId=' + deptId;
    return this.http.get(dataUrl);
  }

  // AddDepartmentNotify
  AddDepartmentNotify(Component: any): Observable<any> {
    const dataUrl = 'Master/AddDepartmentNotify';
    return this.http.post(dataUrl, Component);
  }

  // DeleteDepartmentNotify
  public DeleteDepartmentNotify(deptId: number, LogginId: number): Observable<any> {
    const dataUrl = 'Master/DeleteDepartmentNotify?deptId=' + deptId + '&LogginId=' + LogginId;
    return this.http.get(dataUrl);
  }

  // Client agreement approval
  getSearchClientAgreementApproval(clientId, agreementId, approveFlag, userId): Observable<any> {
     approveFlag = approveFlag == null ? '' : approveFlag;
    const dataUrl = 'ClientEntries/GetClientAgreementApproval/?clientId=' + clientId + '&agreementId=' + agreementId + '&approveFlag=' + approveFlag + '&userId=' + userId + '&tName=' + this.authService.userdata.teamName;
    return this.http.get<any>(dataUrl);
  }
  getClientAgreementApprovalById(clientId, agreementId, approveFlag): Observable<any> {
     approveFlag = approveFlag == null ? '' : approveFlag;
    const dataUrl = 'ClientEntries/GetClientAgreeApprovalDetails/?clientId=' + clientId + '&agreementId=' + agreementId + '&approveFlag=' + approveFlag ;
    return this.http.get<any>(dataUrl);
  }
  saveClientAgreementApproval(data: ClientAgreeApproval): Observable<any> {
    const dataUrl = 'ClientEntries/ClientAgreementApproval';
    return this.http.post<any>(dataUrl, data);
  }
  getApprovalList(userId, teamName,status): Observable<any> {
    const dataUrl = 'ClientEntries/GetSearchClientCompTATApprovalFiles/?userId=' + userId + '&teamName=' + teamName+ '&status=' + status;
    return this.http.get<any>(dataUrl);
  }
  savePassword(clientId, password, sendCrtFlag): Observable<any> {
    const dataUrl = 'ClientEntries/AddPdfPassword?clientId=' + clientId + '&password=' + password + '&sendCrtFlag=' + sendCrtFlag;
    return this.http.post<any>(dataUrl, null);
  }
  getPassword(clientId: any) {
    const dataUrl = 'ClientEntries/GetClientPassword?clientId=' + clientId;
    return this.http.get<any>(dataUrl);
  }
  // ** Added for Nodemail **//
  // getAgreementDoc(docId: any) {
  //   const dataUrl = 'ClientEntries/GetDocumentDetails?docId=' + docId;
  //   return this.http.get<any>(dataUrl);
  // }

  //added by vignesh
  getContactRemarksCompNameList(): Observable<any> {
    const dataUrl = 'ClientEntries/GetContactRemarkList';
    return this.http.get<any>(dataUrl);
  }
  //end by vignesh

  // PackFeeApprovalDetails
  GetPackageFeeDetails(teamName, status) {
    const dataUrl = 'ClientEntries/GetClientPackFeeApprovalDetails?teamName=' + teamName + '&status=' + status;
    return this.http.get<any>(dataUrl);
  }
  GetPackageFeeDocument(packFeeId: any) {
    const dataUrl = 'ClientEntries/GetClientPackFeeDocument?packFeeId=' + packFeeId;
    return this.http.get<any>(dataUrl);
  }
  SavePackageApproval(data: FormData): Observable<any> {
    const dataUrl = 'ClientEntries/ClientPackFeeApproval';
    return this.http.post<any>(dataUrl, data);
  }
  GetClientInteration(data): Observable<any> {
    const dataUrl = 'ClientEntries/GetClientInteration';
    return this.http.post<any>(dataUrl, data);
  }
  // bindDetails(clientEntryData: any) {
  //   this.clientEntryForm.patchValue({
  //     clientName: clientEntryData.clientName,
  //     address1: clientEntryData.address1,
  //     address2: clientEntryData.address2,
  //     address3: clientEntryData.address3,
  //     country: clientEntryData.countryId,
  //     state: clientEntryData.stateId,
  //     city: clientEntryData.city,
  //     zipCode: clientEntryData.zipCode,
  //     contactPerson: clientEntryData.contactPerson,
  //     phoneNumber: clientEntryData.clientContact[0].lookUpValue,
  //     mobileNo: clientEntryData.clientContact[1].lookUpValue,
  //     emailId: clientEntryData.clientContact[2].lookUpValue,
  //     isActive: clientEntryData.active,
  //     refNoPrefix: clientEntryData.refNo,
  //     noOfAddressForCriminalCheck: clientEntryData.addressOption,
  //     billingCycle: clientEntryData.bcId,
  //     billingRule: clientEntryData.ruleId,
  //     billingType: clientEntryData.billingTypeId,
  //     panNo: clientEntryData.pan,
  //     serviceTaxNo: clientEntryData.serviceTaxNo,
  //     retentionPolicyDays: clientEntryData.dataRetentionPolicyDays,
  //     applicantIdColumnName: clientEntryData.applicantIdColumnName,
  //     finalReportType: clientEntryData.finalReportTypeId,
  //     annexureLink: clientEntryData.annexureLinkFlag,
  //     refNoManuallyFlag: clientEntryData.refNoManuallyFlag,
  //     displaySiteNameFlag: clientEntryData.displaySiteNameFlag,
  //     invitationOptionToCRT: clientEntryData.optionToCreateInvitation,
  //     // caseCreationManual: clientEntryData.caseCreationFlag,
  //     owner: clientEntryData.dssiOwner,
  //     toEmailId: clientEntryData.ownerContact[0].lookUpValue,
  //     ccEmailID: clientEntryData.ownerContact[1].lookUpValue,
  //     tatCount: clientEntryData.tatCount,
  //     gstNumber: clientEntryData.cgstin,
  //     serviceTaxFlag: clientEntryData.serviceTaxFlag,
  //     clientOnHold: clientEntryData.clientStatus,
  //     clientAccountManager: clientEntryData.clientAccountManagerId
  //   });
  // }

}
