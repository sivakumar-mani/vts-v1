import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { RaiseInsufficiencyComponent } from 'src/app/screening/DynamicComponents/raise-insufficiency/raise-insufficiency.component';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { DigilockerAuthService } from 'src/app/common-methods/services/digiLocker/digilocker-auth.service';


@Component({
  standalone: false,
  selector: 'app-screening-details',
  templateUrl: './screening-details.component.html',
  styleUrls: ['./screening-details.component.css']
})
export class ScreeningDetailsComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
    toolbarPosition: 'top',

  };
  pstayto: string;
  pstay: string;
  address: any;
  NAflag = false;
  size: any;
  EmailTemplate: any;
  templateName: string = '';
  @Input() verificationScreeningForm: UntypedFormGroup;
  @Input() screeningStatusForm: UntypedFormGroup;
  @Input() insuffRaisedFlag: boolean;
  @Input() verificationComponentDet: UntypedFormGroup;
  @Input() verificationForm: UntypedFormGroup;
  @Input() paymentDetails;
  @Input() paymentList;
  @Input() overrideFeeDetails;
  @Input() communicationDetails;
  @Input() commList;
  @Input() digitalDocument: [];

  ownerControl = new UntypedFormControl('', Validators.required);
  vendorControl = new UntypedFormControl('', Validators.required);
  raiseInsuff = false;
  @Input() verificationTransBindDet;
  @ViewChild('assignOwnerPopUp', { static: true }) assignOwnerPopUp;
  @ViewChild('assignVendorPopUp', { static: true }) assignVendorPopUp;
  @ViewChild('mailDialog', { static: true }) mailDialog: TemplateRef<any>;
  insuffDocument: any[] = [];
  insufficiencyForm: UntypedFormGroup;
  statusControl!: AutoCompleteDropDown;
  userDetails: any;
  dialogRef: any;
  userData: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  SendCaseMailList: sendverification;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // For Drug Result
  compType: string;
  reopenFlag: boolean;
  subcheckFlag: boolean;
  reassignFlag: boolean;
  drugList: any[] = [];
  drugLookupList: any[] = [];
  drugColumns = [
    { field: 'drugShortCode', header: 'Drug Code' },
    { field: 'drugName', header: 'Drug Name' },
    { field: 'result', header: 'Result' }
  ];
  drugReportList: any[] = [];
  selectedvalue: any;
  statusId: any;
  addressFlag = false
  compDueDate: any;
  currentDate = new Date();
  statusFlag: boolean;
  filterOwnerName = new UntypedFormControl();
  paymentModeList: any[] = [];
  communicationList: any[] = [];
  items: SelectItem[] = [];
  @ViewChild('insuff', { static: true }) insuff: RaiseInsufficiencyComponent;
  @ViewChild('smsPopUp', { static: true }) smsPopUp;
  smsFormGroup: UntypedFormGroup;
  htmlTempBody: any;
  smshtmlTempBody: any;
  digitalAddressPVReportList: any;
  closedFlag = false;
  addFlag: boolean;
  addMailCtrl: UntypedFormControl;
  checkFlag = true;
  ccFlag: boolean;
  ccMailCtrl: UntypedFormControl;
  tovalue: any;
  ccvalue: any;
  toList: any[] = [];
  ccList: any[] = [];
  htmlContent: any
  isMailIdSave = false;
  dateMax = new Date();
  screenAuth: any = {};
  generatedUrl: string = '';
  digiLockerCallUrl: any;
  UrlFlag: boolean = false;
  constructor(public verificationService: VerificationService, public dialog: MatDialog,
    public screeningService: ScreeningService, private message: MessageService,
    private router: Router, private sharedService: SharedService, public common: CommonService,
    public authService: AuthService, private digiLockerauthService: DigilockerAuthService) {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.addMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
    this.ccMailCtrl = new UntypedFormControl(null, [Validators.pattern(this.common.EmailRegX)]);
  }
  ngOnInit() {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    this.screenAuth = this.authService.getScreenAuth(this.common.VERIFICATION_ROUTER);
    if (this.common.modifyAdditionalFeeFlag == true || this.common.modifyComponentFeeFlag == true) {
      this.screeningStatusForm.disable();
    }
    this.compDueDate = this.verificationScreeningForm.get('componentDueDate')?.value;
    this.reopenFlag = this.verificationScreeningForm.get('reopenFlag')?.value;
    this.subcheckFlag = this.verificationScreeningForm.get('subCheckFlag')?.value;
    this.reassignFlag = this.verificationScreeningForm.get('reAssignFlag')?.value;
    this.compType = this.verificationForm.value.responseDocument.componentType;
    this.closedFlag = this.verificationService.closedCheck;

    if (this.verificationForm.get('paymentFlag')?.value === true) {
      this.paymentModeList = this.paymentList;
      this.communicationList = this.commList;
    }
    if (this.screeningStatusForm.get('screeningStatusName')?.value === 'Close - Stop Check') {
      const compDate = this.verificationForm.value.screeningStatus.cancelledDate;
      if (compDate) {
        const cancelDate = this.common.getTimezoneOffset(compDate, false);
        this.screeningStatusForm.get('cancelledDate')?.setValue(cancelDate);
      }
    }
    if (this.insuffRaisedFlag === true && this.verificationService.FeeApprovalFlag === true) {
      const screeningStatus = this.verificationTransBindDet.status.find(x => x.statusName === 'Pending (Fee Approval)');
      this.screeningStatusForm.get('screeningStatusId')?.setValue(screeningStatus.screeningStatusId);
      this.screeningStatusForm.disable();
    }
    else {
      this.verificationService.FeeApprovalFlag = false;
    }
    if (this.screeningStatusForm.get('statusDate')?.value === null) {
      this.screeningStatusForm.get('statusDate')?.setValue(new Date());
    }
    // else {
    //   const statusDate = this.common.getTimezoneOffset(this.screeningStatusForm.get('statusDate')?.value,false);
    //   if(statusDate: any) {
    //     this.screeningStatusForm.get('statusDate')?.setValue(statusDate);
    //   }
    // }
    let statusName = this.verificationTransBindDet.status.find(f => f.screeningStatusId ===
      this.verificationForm.getRawValue().screeningStatus.screeningStatusId)?.statusName;

    this.statusControl = new AutoCompleteDropDown('Status Name', 'screeningStatusId', 'screeningStatusId', 'statusName',
      this.verificationTransBindDet.status, '', this.screeningStatusForm, false, false, true);
    this.insufficiencyForm = this.initInsufficiencyForm();
    if (this.insuffRaisedFlag && this.verificationComponentDet.get('component')?.value[0].screeningInsufficiency) {
      if (this.verificationComponentDet.get('component')?.value[0].screeningInsufficiency.insufficiencyId > 0) {
        const insuffDetailValue = this.verificationComponentDet.get('component')?.value[0].screeningInsufficiency.insuffDetail;
        this.initInsufCommentForm(this.insufficiencyForm.get('screeningInsufficiency.insuffDetail') as UntypedFormArray, insuffDetailValue
          ? insuffDetailValue : []);

        this.insufficiencyForm.get('screeningInsufficiency')?.patchValue(
          this.verificationComponentDet.get('component')?.value?.[0]?.screeningInsufficiency
        );
        this.insuffDocument = this.verificationComponentDet.get('component')?.value[0].screeningInsufficiency.insuffDocument;
      }
      //(this.compDueDate && new Date(this.compDueDate) < this.currentDate) ? this.screeningStatusForm.enable() :
      this.screeningStatusForm.disable();
      this.insufficiencyForm.disable();
    }
    this.statusId = this.screeningStatusForm.get('screeningStatusId')?.value;
    const screeningStatus = this.verificationTransBindDet.status.find(x => x.statusName === 'For Research');
    if (this.insuffRaisedFlag !== true && this.verificationService.FeeApprovalFlag !== true) {
      if (this.statusId === screeningStatus.screeningStatusId && this.verificationService.tempData.empInsMasterDet.forResearchFlag) {
        this.screeningStatusForm.get('screeningStatusId')?.setValue(screeningStatus.screeningStatusId);
        this.screeningStatusForm.get('screeningStatusId')?.disable();
      } else {
        // this.screeningStatusForm.get('screeningStatusId')?.enable();
      }
    }
    // this.insuffClearAutomation();
    // tslint:disable-next-line: prefer-for-of
    let statusList: any[] = [];
    if ((this.userData.subTeamName === this.common.COMMONSUBCAMTEAM) &&
      (this.userData.teamName === this.common.COMMONCRTTEAM)) {
      if (this.userData.teamName === this.common.COMMONCRTTEAM) {
        statusList = this.verificationTransBindDet.status.filter(x => x.statusName === 'Open' || x.statusName === 'Re-Open' ||
          x.statusName === 'To Close' || x.statusName === this.common.CANC_INTE || x.statusName === this.common.CANC_BCLI || x.statusName === 'Close - Insufficiency' ||
          x.statusName === 'WIP' || x.statusName === 'Pending – On Hold' || x.statusName === 'Pending (Supp. doc/info)' ||
          (x.statusName === this.verificationService.tempData.verificationScreeningDet.screeningStatus))
      }

      if (statusList.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < statusList.length; i++) {
          this.items.push({
            label: statusList[i].statusName, value: statusList[i].
              screeningStatusId
          });
        }
      }
    }
    else if (this.verificationService.tempData.empInsMasterDet.forResearchFlag && this.verificationService.tempData.empInsMasterDet.underReviewStatus !== null && this.verificationService.tempData.screeningStatus.showHideFlag !== true && this.verificationService.tempData.verificationScreeningDet.workFlowId === this.common.FrWorkFlowId) {
      for (let i = 0; i < this.verificationTransBindDet.status.length; i++) {
        if (this.verificationTransBindDet.status[i].statusName === 'Unable to Verify' || this.verificationTransBindDet.status[i].statusName === 'Close - Stop Check' ||
          this.verificationTransBindDet.status[i].statusName === 'Close - Cancelled Internally' || this.verificationTransBindDet.status[i].statusName === 'Open') {
          this.items.push({
            label: this.verificationTransBindDet.status[i].statusName, value: this.verificationTransBindDet.status[i].
              screeningStatusId
          });
        }
      }
    }
    else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.verificationTransBindDet.status.length; i++) {
        if (this.verificationService.tempData.ctsflag !== true) {
          if (this.verificationTransBindDet.status[i].statusName !== 'Positive' && this.verificationTransBindDet.status[i].statusName !== 'Positive-Review' &&
            this.verificationTransBindDet.status[i].statusName !== 'Negative' && this.verificationTransBindDet.status[i].statusName !== 'Negative-Please Review') {
            this.items.push({
              label: this.verificationTransBindDet.status[i].statusName, value: this.verificationTransBindDet.status[i].
                screeningStatusId
            });
          }
        } else {
          this.items.push({
            label: this.verificationTransBindDet.status[i].statusName, value: this.verificationTransBindDet.status[i].
              screeningStatusId
          });
        }
      }
    }
    if (this.common.reOpenSearchFlag) {
      this.items = this.items.filter(x => x.label === 'Re-Open' || x.label === statusName)
    }
    if (this.userData.teamName === 'AddressTeam' || this.userData.teamName === 'CTS-AddressTeam') {
      this.addressFlag = true
      this.initsmsForm();
      if (this.verificationService.smsDetails) {
        this.smsFormGroup.patchValue(this.verificationService.smsDetails);
      }
      this.getHtmlTempBody();
      //this.digitalPVReport();
    }

    if (this.verificationService.tempData.verificationScreeningDet.manualFileSubmissionFlag === true) {
      this.screeningStatusForm.enable();
    }
    if (this.userData.subTeamName === this.common.COMMONSUBCAMTEAM) {
      this.common.VE = false;
    }
    if (this.verificationTransBindDet.status.length > 0 && this.screeningStatusForm.get('screeningStatusId')?.value > 0) {
      const statusList = this.verificationTransBindDet.status.filter(x => x.screeningStatusId === this.screeningStatusForm.get('screeningStatusId')?.value);
      if (statusList.length > 0) {
        this.screeningStatusForm.get('screeningStatusName')?.setValue(statusList[0].statusName);
      }
    }
    this.screeningStatusForm.get('reportReceivedDate')?.setValue(this.common.getTimezoneOffset(this.dateMax, true));

    if ((statusName || !this.screeningStatusForm.get('confirmationReceivedDate')?.value || this.screeningStatusForm.get('confirmationReceivedDate')?.value === null)) {
      if ((statusName === this.common.CANC_INTE && !this.screeningStatusForm.get('confirmationReceivedDate')?.value) || (statusName === this.common.CANC_BCLI && !this.screeningStatusForm.get('confirmationReceivedDate')?.value)) {
        this.NAflag = true;
        this.screeningStatusForm.get('confirmationReceivedDate')?.setValue('N/A');
      } else {
        this.NAflag = false;

      }
    }

    if (!this.verificationScreeningForm.get('vendorName')?.value) {
      const vName = this.verificationTransBindDet.vendors.filter(x => x.vendorName === 'Krya Screening Private Limited');
      if (vName.length > 0) {
        this.vendorControl.setValue(vName[0].vendorId);
        this.verificationScreeningForm.get('vendorName')?.setValue(vName[0].vendorName);
      }
    }
    //   const add2 = this.verificationForm.value.verificationComponentDet.component[0].compRef.address?.addLine2 ?
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.addLine2 + ',' : '';
    //   const add3 = this.verificationForm.value.verificationComponentDet.component[0].compRef.address?.addLine3 ?
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.addLine3 + ',' : '';
    //   const dist = this.verificationForm.value.verificationComponentDet.component[0].compRef.address?.district ?
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.district + ',' : '';
    //   const loc = this.verificationForm.value.verificationComponentDet.component[0].compRef.address?.locationName ?
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.locationName : '';
    //   if (this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStay &&
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStayTo) {
    //     this.pstay = this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStay ?
    //       'POS : FROM' + ' ' + this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStay + ',' : '';
    //     this.pstayto = this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStayTo ?
    //       'TO' + ' ' + this.verificationForm.value.verificationComponentDet.component[0].compRef.periodOfStayTo : '';
    //   }
    //   this.address = this.verificationForm.value.verificationComponentDet.component[0].compRef.address.addLine1 + ',' +
    //     add2 +
    //     add3 + this.verificationForm.value.verificationComponentDet.component[0].compRef.address.country + ',' +
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.state + ',' +
    //     dist + loc + '-' +
    //     this.verificationForm.value.verificationComponentDet.component[0].compRef.address.postalCode + '. '

    // }


    const compRef = this.verificationForm.value?.verificationComponentDet?.component?.[0]?.compRef;
    const address = compRef?.address;

    const add2 = address?.addLine2 ? address.addLine2 + ',' : '';
    const add3 = address?.addLine3 ? address.addLine3 + ',' : '';
    const dist = address?.district ? address.district + ',' : '';
    const loc = address?.locationName ? address.locationName : '';

    if (compRef?.periodOfStay && compRef?.periodOfStayTo) {
      this.pstay = 'POS : FROM' + ' ' + compRef.periodOfStay + ',';
      this.pstayto = 'TO' + ' ' + compRef.periodOfStayTo;
    }

    if (address) {
      this.address =
        (address.addLine1 ? address.addLine1 + ',' : '') +
        add2 +
        add3 +
        (address.country ? address.country + ',' : '') +
        (address.state ? address.state + ',' : '') +
        dist + loc + '-' +
        (address.postalCode ?? '') + '. ';
    }
  }
  // digitalPVReport() {
  //   this.verificationService.digitalAddressCheckPVReport(this.userData).subscribe(res => {
  //     if (res) {
  //       this.digitalAddressPVReportList = res;
  //       this.digitalDocument =this.digitalAddressPVReportList.filter(x => x.screeningCompId === this.verificationScreeningForm.get('screeningCompId')?.value);
  //     }
  //   });
  // }
  initsmsForm() {
    this.smsFormGroup = new UntypedFormGroup({
      clientId: new UntypedFormControl(0),
      candidateId: new UntypedFormControl(0),
      loggedIn: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      primaryMobileNo: new UntypedFormControl('', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9][0-9]*)$/)])),
      secondaryMobileNo: new UntypedFormControl(''),
      digitalAddressFlag: new UntypedFormControl(),
      // remarks: new UntypedFormControl('', Validators.required),
      mailId: new UntypedFormControl('', Validators.compose(
        [Validators.email,
        Validators.pattern(this.common.EmailRegX)]))
    });
  }
  getHtmlTempBody() {
    this.verificationService.GetAddressSendSmsTemplate(this.verificationForm.value.verificationScreeningDet.clientId,
      this.verificationForm.value.screeningCompId).subscribe(resp => {
        if (resp) {
          this.htmlTempBody = resp.htmlTemplateBody;
        }
      });
    this.verificationService.GetSendSmsTemplate(this.verificationForm.value.verificationScreeningDet.clientId,
      this.verificationForm.value.screeningCompId).subscribe(resp => {
        if (resp) {
          this.smshtmlTempBody = resp.htmlTemplateBody;
        }
      });
  }
  insuffClearAutomation() {
    let dateDueFlag: boolean;
    const statusName = this.verificationTransBindDet.status.find(f => f.screeningStatusId ===
      this.verificationForm.getRawValue().screeningStatus.screeningStatusId).statusName;
    if (this.verificationScreeningForm.get('componentDueDate')?.value &&
      this.getTodayDate() > this.verificationScreeningForm.get('componentDueDate')?.value) {
      this.screeningStatusForm.get('compDelayReason')?.value ? dateDueFlag = true : dateDueFlag = false;
      // alert('true');
    } else {
      dateDueFlag = false;
      // alert('false');
    }
    if (statusName === this.common.CLOSEINSUFFICIENCY) {
      if (this.verificationService.recivedDocument &&
        this.verificationForm.get('verificationScreeningDet')?.get('screeningOwnerId')?.value > 0 &&
        (dateDueFlag === true)) {
        if ((this.verificationForm.get('verificationScreeningDet')?.get('vendorId')?.value > 0 &&
          (this.userData.teamName === 'AddressTeam' || this.userData.teamName === 'CTS-ADDRESSTEAM') && this.userData.teamName === 'EducationTeam' &&
          this.userData.teamName === 'IdentityTeam') ||
          (this.verificationForm.get('verificationScreeningDet')?.get('vendorId')?.value === 0)) {
          this.verificationForm.get('showGenrateResponse')?.setValue(true);
        }
      } else {
        this.verificationForm.get('showGenrateResponse')?.setValue(false);
      }
    }
  }
  getStatusName(event: any) {
    if (+event.value > 0) {
      const statusName = this.verificationTransBindDet.status.find(f => f.screeningStatusId === (+event.value)).statusName;
      if (this.verificationService.tempData.ctsflag === true) {
        if (statusName === this.common.CANC_INTE || statusName === this.common.CANC_BCLI) {
          this.NAflag = true;
          this.screeningStatusForm.get('confirmationReceivedDate')?.setValue('N/A');
          this.screeningStatusForm.get('confirmationReceivedDate')?.clearValidators();
          this.screeningStatusForm.get('confirmationReceivedDate')?.updateValueAndValidity();
        } else {
          this.NAflag = false;
          this.screeningStatusForm.get('confirmationReceivedDate')?.setValue(new Date());
        }
      }
      //Added by Megala - For VTS2-2024-CRT-0155
      //remove validation
      // if (statusName === 'Re-Open') {
      //   this.screeningStatusForm.get('reopenRemarks')?.setValidators(Validators.required);
      //   this.screeningStatusForm.get('reopenRemarks')?.updateValueAndValidity();
      // } else {
      //   this.screeningStatusForm.get('reopenRemarks')?.clearValidators();
      //   this.screeningStatusForm.get('reopenRemarks')?.updateValueAndValidity();
      // }
      this.screeningStatusForm.get('screeningStatusName')?.setValue(statusName);
      this.screeningStatusForm.get('cancelledDate')?.setValue(null);
      this.verificationForm.get('responseDocument')?.get('component')?.get('reportContact')?.get('remarks')?.setValue('');
    } else {
      const status = this.verificationTransBindDet.status.find(f => f.statusName.toLowerCase()
        === event.value.toLowerCase());
      if (status) {
        this.screeningStatusForm.get('screeningStatusName')?.setValue(status.statusName);
      }
    }
  }
  updatechanges(value, type) {
    if (this.ownerControl.value === 0 && type === 'owner') {
      this.ownerControl.setValue('');
    } else if (this.vendorControl.value === 0) {
      this.vendorControl.setValue('');
    }
    if (type === 'owner' && this.ownerControl.valid) {
      this.verificationScreeningForm.get('previousName')?.setValue(this.verificationScreeningForm.get('screeningOwnerName')?.value);
      this.verificationScreeningForm.controls.screeningOwnerFlag.setValue(true);
      this.verificationScreeningForm.get('screeningOwnerId')?.setValue(value.userId);
      this.verificationScreeningForm.get('screeningOwnerName')?.setValue(value.name);
      this.verificationScreeningForm.get('orginalScreeningOwnerName')?.setValue(value.name);
      this.updateOwnerVendor();
    } else if (type === 'vendor' && this.vendorControl.valid) {
      this.verificationScreeningForm.get('previousName')?.setValue(this.verificationScreeningForm.get('vendorName')?.value);
      this.verificationScreeningForm.controls.vendorNameFlag.setValue(true);
      this.verificationScreeningForm.get('vendorId')?.setValue(value.vendorId);
      this.verificationScreeningForm.get('vendorName')?.setValue(value.vendorName);
      this.updateOwnerVendor();
    } else {
      return;
    }
  }
  updateOwnerVendor() {
    this.verificationScreeningForm.get('createdUserId')?.setValue(this.userData.userId);
    this.verificationService.UpdateScreeningOwnerAndVendorName(this.verificationScreeningForm.value).subscribe(res => {
      if (res.success === true) {
        this.sharedService.emitNameChange({ name: res.message });
        this.dialogClose();
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.verificationScreeningForm.controls.screeningOwnerFlag.setValue(false);
        this.verificationScreeningForm.controls.vendorNameFlag.setValue(false);
        this.common.changeLastUpdatedUser(this.verificationForm);
      }
    }, err => { }, () => {
    });
  }
  updateScreeningStatus() {
    this.compDueVal();
    let dueFlag: boolean;

    if (this.screeningStatusForm.get('confirmationReceivedDate')?.value === 'N/A' || !this.screeningStatusForm.get('confirmationReceivedDate')?.value) {
      this.screeningStatusForm.get('confirmationReceivedDate')?.setValue(null);
      this.screeningStatusForm.get('confirmationReceivedDate')?.clearValidators();
      this.screeningStatusForm.get('confirmationReceivedDate')?.updateValueAndValidity();
    }
    if (this.screeningStatusForm.valid) {
      const statusName = this.verificationTransBindDet.status.find(f => f.screeningStatusId ===
        this.verificationForm.value.screeningStatus.screeningStatusId).statusName;
      if (statusName == 'For Research') {
        this.showTopCenter('warn', 'Failed Message', 'Please Update Valid Status');
      }
      //Added by Megala - For VTS2-2024-CRT-0155
      else if (statusName == 'Re-Open') {
        if (statusName) {
          if (statusName === this.common.CLOSEINSUFFICIENCY) {
            dueFlag = true;
            this.screeningStatusForm.get('screeningStatusName')?.setValue(statusName);
          } else {
            dueFlag = false;
          }
        }
        let updateFlag: boolean;

        if (((this.screeningStatusForm.value !== null && this.screeningStatusForm.get('cancelledDate')?.value !== this.verificationService.tempData.screeningStatus.cancelledDate
        )
          || (this.screeningStatusForm.get('cancelledRemarks')?.value !== this.verificationService.tempData.screeningStatus.cancelledRemarks) ||
          (this.screeningStatusForm.get('compDelayReason')?.value !== this.verificationService.tempData.screeningStatus.compDelayReason) ||
          (this.screeningStatusForm.get('confirmationReceivedDate')?.value !== this.verificationService.tempData.screeningStatus.confirmationReceivedDate) ||
          (this.screeningStatusForm.get('statusDate')?.value !== this.verificationService.tempData.screeningStatus.statusDate) ||
          (this.screeningStatusForm.get('screeningStatusId')?.value !== this.verificationService.tempData.screeningStatus.screeningStatusId)) &&
          this.verificationService.tempData.ctsflag === true) {
          updateFlag = true;
        } else {
          updateFlag = false;
        }
        if ((dueFlag === true ? this.verificationForm.value.screeningStatus.screeningStatusId ===
          this.screeningStatusForm.get('screeningStatusId')?.value :
          this.verificationService.screeningStatusId !== this.screeningStatusForm.get('screeningStatusId')?.value || updateFlag === true) || updateFlag === true) {
          //remove document validation
          //if (this.verificationForm.get('verificationResponseDocument.reOpenResponseDocument.document')?.value.length > 0) {
          this.updateStatus();
          this.updateReOpenDocument();
          // } else {
          //   this.showTopCenter('error', 'Alert Message', 'Re-Open document required');
          // }

        } else {
          this.showTopCenter('warn', 'Status Name Already Exist', '');
        }
      }
      else {
        if (statusName) {
          if (statusName === this.common.CLOSEINSUFFICIENCY) {
            dueFlag = true;
            this.screeningStatusForm.get('screeningStatusName')?.setValue(statusName);
          } else {
            dueFlag = false;
          }
        }
        let updateFlag: boolean;

        if (((this.screeningStatusForm.value !== null && this.screeningStatusForm.get('cancelledDate')?.value !== this.verificationService.tempData.screeningStatus.cancelledDate
        )
          || (this.screeningStatusForm.get('cancelledRemarks')?.value !== this.verificationService.tempData.screeningStatus.cancelledRemarks) ||
          (this.screeningStatusForm.get('compDelayReason')?.value !== this.verificationService.tempData.screeningStatus.compDelayReason) ||
          (this.screeningStatusForm.get('confirmationReceivedDate')?.value !== this.verificationService.tempData.screeningStatus.confirmationReceivedDate) ||
          (this.screeningStatusForm.get('statusDate')?.value !== this.verificationService.tempData.screeningStatus.statusDate) ||
          (this.screeningStatusForm.get('screeningStatusId')?.value !== this.verificationService.tempData.screeningStatus.screeningStatusId)) &&
          this.verificationService.tempData.ctsflag === true) {
          updateFlag = true;
        } else {
          updateFlag = false;
        }
        if ((dueFlag === true ? this.verificationForm.value.screeningStatus.screeningStatusId ===
          this.screeningStatusForm.get('screeningStatusId')?.value :
          this.verificationService.screeningStatusId !== this.screeningStatusForm.get('screeningStatusId')?.value || updateFlag === true) || updateFlag === true) {
          this.screeningStatusForm.value.statusDate = this.screeningStatusForm.get('statusDate')?.value;
          const index = this.common.checkStatusIsClose(this.verificationForm, this.verificationTransBindDet.status,
            this.screeningStatusForm.get('screeningStatusId')?.value);
          let flag: boolean;
          flag = (this.verificationForm.value.verificationComponentDet?.component?.[0]?.screeningComponentInfo?.compFeeFlag === true) &&
            !(this.verificationForm.get('additionalFee')?.value.some(x => x.feeName !== this.common.ADDI_FEE));
          if (index > -1 && (this.verificationService.recivedDocument) && !flag) {
            if (this.compType === 'drugTest') {
              if (this.compType === 'drugTest' && ((statusName === this.common.STOPCHECK || statusName === this.common.CLOSE_UNVERIFIED) ||
                this.verificationForm.get('drugVerifResult')?.value)) {
                this.updateStatus();
              } else {
                this.showTopCenter('warn', 'Failed Message', 'Drug result required for all type');
              }
            } else {
              this.updateStatus();
            }
          } else if (index === -1 && ((this.userData.subTeamName === this.common.COMMONSUBCAMTEAM) ||
            (this.userData.teamName === this.common.COMMONCRTTEAM))) {
            this.updateStatus();
          } else if (index === -1 && !flag) {
            if (this.compType === 'drugTest') {
              if (this.common.CANC_INTE === this.screeningStatusForm.value.screeningStatusName || this.common.CANC_BCLI === this.screeningStatusForm.value.screeningStatusName || this.verificationService.recivedDocument) {
                this.updateStatus();
              } else if (this.common.CANC_INTE !== this.screeningStatusForm.value.screeningStatusName && this.common.CANC_BCLI !== this.screeningStatusForm.value.screeningStatusName) {
                if (this.compType === 'drugTest' && ((statusName === "Close - Stop Check" || statusName === this.common.CLOSE_UNVERIFIED)
                  || this.verificationForm.get('drugVerifResult')?.value)) {
                  this.updateStatus();
                } else {
                  this.showTopCenter('warn', 'Failed Message', 'Drug result required for all type');
                }
              }
            } else {
              this.updateStatus();
            }
          } else {
            if (this.verificationService.tempData.ctsflag === true) {
              this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.modeofVerificationId')?.setValidators(Validators.required);
              this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.modeofVerificationId')?.updateValueAndValidity();
              this.showTopCenter('warn', 'Alert Message', 'Kindly Select Mode of Verification');
            }
            this.verificationForm.get('showGenrateResponse')?.setValue(false);
            const str = (!this.verificationService.recivedDocument && flag) ? 'Response Document Required and Add component fees type' :
              !this.verificationService.recivedDocument ? 'Response Document Required' : flag ? 'Add component fees type' : '';
            this.showTopCenter('warn', 'Failed Message', str);
            this.screeningStatusForm.get('compDelayReason')?.setValue('');
          }
        } else {
          this.showTopCenter('warn', 'Status Name Already Exist', '');
        }
      }
    }
  }
  //Added by Megala - For VTS2-2024-CRT-0155
  updateReOpenDocument() {
    const formData = new FormData();
    for (let i = 0; i < this.verificationForm.get('verificationResponseDocument.reOpenResponseDocument.document')?.value.length; i++) {
      if (this.verificationForm.get('verificationResponseDocument.reOpenResponseDocument.document')?.value[i].fileName) {
        formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.verificationForm.
          get('verificationResponseDocument.reOpenResponseDocument.document').value[i].document);
      }
    }
    this.verificationForm.get('verificationResponseDocument.reOpenResponseDocument.recivedDocumentFlag')?.setValue(true);
    formData.append('VerificationDocument', JSON.stringify(this.verificationForm.
      get('verificationResponseDocument.reOpenResponseDocument').value));
    this.verificationService.addVerificationDocument(formData).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
      }
    }, err => { }, () => {
    });
  }
  compDueVal() {
    if ((this.verificationScreeningForm.get('componentDueDate')?.value) &&
      (this.currentDate > new Date(this.verificationScreeningForm.get('componentDueDate')?.value))) {
      let validFlag = false;
      if (!this.screeningStatusForm.get('compDelayReason')?.value) {
        this.screeningStatusForm.get('screeningStatusName')?.value === 'Close - Stop Check' ? validFlag = true : validFlag = false;
        if (validFlag === true && !(this.screeningStatusForm.get('cancelledDate')?.value) && !(this.screeningStatusForm.get('cancelledRemarks')?.value)) {
          this.screeningStatusForm.get('cancelledDate')?.setValidators(Validators.required);
          this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
          this.screeningStatusForm.get('cancelledRemarks')?.setValidators(Validators.required);
          this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
        } else {
          this.screeningStatusForm.get('cancelledDate')?.clearValidators();
          this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
          this.screeningStatusForm.get('cancelledRemarks')?.clearValidators();
          this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
        }
        if (this.screeningStatusForm.get('screeningStatusName')?.value !== 'Re-Open') {
          this.screeningStatusForm.get('compDelayReason')?.setValidators(Validators.required);
          this.screeningStatusForm.get('compDelayReason')?.updateValueAndValidity();
        }
      } else {
        this.screeningStatusForm.get('compDelayReason')?.clearValidators();
        this.screeningStatusForm.get('compDelayReason')?.updateValueAndValidity();
        this.screeningStatusForm.get('cancelledDate')?.clearValidators();
        this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
        this.screeningStatusForm.get('cancelledRemarks')?.clearValidators();
        this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
      }
    } else if (this.screeningStatusForm.get('screeningStatusName')?.value === 'Close - Stop Check') {
      if (!(this.screeningStatusForm.get('cancelledDate')?.value) && !(this.screeningStatusForm.get('cancelledRemarks')?.value)) {
        this.screeningStatusForm.get('cancelledDate')?.setValidators(Validators.required);
        this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
        this.screeningStatusForm.get('cancelledRemarks')?.setValidators(Validators.required);
        this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
      } else {
        this.screeningStatusForm.get('cancelledDate')?.clearValidators();
        this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
        this.screeningStatusForm.get('cancelledRemarks')?.clearValidators();
        this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
      }
    } else {
      this.screeningStatusForm.get('cancelledDate')?.clearValidators();
      this.screeningStatusForm.get('cancelledDate')?.updateValueAndValidity();
      this.screeningStatusForm.get('cancelledRemarks')?.clearValidators();
      this.screeningStatusForm.get('cancelledRemarks')?.updateValueAndValidity();
    }
  }
  restrictVeAccess() {
    return this.userData.applicationId !== 2 && this.userData.subTeamName !== this.common.COMMONSUBCAMTEAM
      && this.userData.teamName !== this.common.COMMONCRTTEAM && !this.getFrFlag() && this.common.modifyAdditionalFeeFlag != true && this.common.modifyComponentFeeFlag != true;
  }
  getFrFlag() {
    return this.common.commonVeFlag === 'Approval Pending' || this.common.commonVeFlag === 'For Research' || this.common.commonVeFlag === 'Rejected';
  }
  updateStatus() {
    if ((this.verificationScreeningForm.get('screeningOwnerName')?.value) ||
      ((this.userData.subTeamName === this.common.COMMONSUBCAMTEAM) ||
        (this.userData.teamName === this.common.COMMONCRTTEAM))) {
      if (this.verificationScreeningForm.get('vendorName')?.value &&
        this.screeningStatusForm.value.screeningStatusName !== this.common.CANC_INTE && this.screeningStatusForm.value.screeningStatusName !== this.common.CANC_BCLI) {
        this.statusFlag = true;
      } else if (this.verificationScreeningForm.get('vendorName')?.value && (
        this.screeningStatusForm.value.screeningStatusName === this.common.CANC_INTE || this.screeningStatusForm.value.screeningStatusName === this.common.CANC_BCLI)) {
        this.statusFlag = true;
      } else if (!this.verificationScreeningForm.get('vendorName')?.value &&
        this.screeningStatusForm.value.screeningStatusName !== this.common.CANC_INTE && this.screeningStatusForm.value.screeningStatusName !== this.common.CANC_BCLI) {
        this.statusFlag = false;
      }
      if (!this.verificationScreeningForm.get('vendorName')?.value &&
        this.screeningStatusForm.value.screeningStatusName === this.common.CANC_INTE ||
        this.screeningStatusForm.value.screeningStatusName === this.common.CANC_BCLI ||
        this.screeningStatusForm.value.screeningStatusName === this.common.CLOSE_UNVERIFIED ||
        this.screeningStatusForm.value.screeningStatusName === this.common.CLOSE_STOPCHECK) {
        this.statusFlag = true;
      }
      if ((this.statusFlag === true || (this.userData.teamName === 'CriminalTeam' || this.verificationService.tempData.verificationScreeningDet.
        manualFileSubmissionFlag === true || this.userData.teamName === 'EmploymentIndia' || this.userData.teamName === 'EmploymentAbroad' ||
        this.userData.teamName === 'EmploymentTechM')) || (((this.userData.subTeamName === this.common.COMMONSUBCAMTEAM) ||
          (this.userData.teamName === this.common.COMMONCRTTEAM)))) {

        let statusFlag: boolean;
        if ((this.screeningStatusForm.controls.screeningStatusName.value === this.common.Negative && this.screeningStatusForm.controls.cancelledRemarks.value) ||
          this.screeningStatusForm.controls.screeningStatusName.value !== this.common.Negative && this.screeningStatusForm.controls.screeningStatusName.value) {
          statusFlag = true;
        } else {
          statusFlag = false;
        }
        if (this.screeningStatusForm.controls.confirmationReceivedDate.value && this.verificationService.tempData.ctsflag === true) {
          const rDate = this.common.getTimezoneOffset(this.screeningStatusForm.value.confirmationReceivedDate.setHours(0, 0, 0, 0), false);
          if (rDate) {
            this.screeningStatusForm.controls.confirmationReceivedDate.setValue(rDate);
          }
        }
        if (statusFlag === true) {
          // console.log(this.screeningStatusForm.value)
          this.screeningStatusForm.get('createdUserId')?.setValue(this.userData.userId);
          this.verificationService.updateScreeningStatus(this.screeningStatusForm.value).subscribe(res => {
            if (res.success === true) {
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
              this.goToTop();
              this.common.changeLastUpdatedUser(this.verificationForm);
              this.common
                .checkScreeningStatusIsClose(this.verificationForm, this.verificationTransBindDet.status,
                  this.screeningStatusForm.get('screeningStatusId')?.value);
              this.verificationService.screeningStatusId = this.screeningStatusForm.get('screeningStatusId')?.value;
              if (!this.screeningStatusForm.get('confirmationReceivedDate')?.value) {
                this.screeningStatusForm.get('confirmationReceivedDate')?.setValue('N/A');
                this.NAflag = true;
              }
              // if (this.verificationScreeningForm.get('componentDueDate')?.value &&
              //   this.getTodayDate() > this.verificationScreeningForm.get('componentDueDate')?.value &&
              //   this.common.CLOSEINSUFFICIENCY === this.screeningStatusForm.get('screeningStatusName')?.value) {
              //   this.insuffClearAutomation();
              // }
            } else {
              this.screeningStatusForm.get('compDelayReason')?.setValue('');
            }
          }, err => { }, () => {
          });
        } else {
          this.showTopCenter('warn', 'Failed Message', 'Discrepancy Remarks if any Required');
        }
      } else if (this.statusFlag === false) {
        this.showTopCenter('warn', 'Failed Message', 'Vendor Name Required');
        this.screeningStatusForm.get('compDelayReason')?.setValue('');
      }
    } else {
      this.showTopCenter('warn', 'Failed Message', 'Owner Name Required');
      this.screeningStatusForm.get('compDelayReason')?.setValue('');
    }

  }
  goToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  openInsufficiencyDialog(templateRef: TemplateRef<any>) {
    // this.insufficiencyComp.insuuficiencyAction({}, 'raiseInsuffieciency');
    this.screeningService.screeningCompIdForVerifiactionMode = this.verificationScreeningForm.get('screeningCompId')?.value;
    this.screeningService.isVerifiactionMode = true;
    this.verificationService.FeeApprovalFlag = false;
    // this.dialog.open(templateRef, { height: '400px', width: '700px' });
  }
  getTodayDate() {
    return this.common.getTimezoneOffset(this.currentDate, false).toJSON();
  }
  SaveInsuff() {
    if (this.insufficiencyForm.valid) {
      const value = this.insuff?.insuffReqType.find(x => x.lookUpId ===
        this.insufficiencyForm.get('screeningInsufficiency.requiredLookupId')?.value).lookUpName;
      if (value?.toLowerCase() !== this.common.INFO_REQ?.toLowerCase()) {
        if (this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.value.length > 0) {
          this.submitRaiseInsuff();
        } else {
          this.showTopCenter('warn', 'Failed to save', 'Please add atleast one insufficiency document');
        }
      } else {
        this.insufficiencyForm.get('screeningInsufficiency.insuffDocument')?.setValue([]);
        this.submitRaiseInsuff();
      }
    } else {
      this.insufficiencyForm.markAllAsTouched();
    }
  }
  submitRaiseInsuff() {
    this.insufficiencyForm.get('screeningInsufficiency.createdUserId')?.setValue(this.userData.userId);
    this.screeningService.AddRaiseInsufficiency(this.insufficiencyForm.getRawValue().screeningInsufficiency).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'success Message', 'Insufficiency raised Successfully');
        this.common.changeLastUpdatedUser(this.verificationForm);
        this.verificationComponentDet.get('component').value[0].screeningInsufficiency =
          this.insufficiencyForm.controls.screeningInsufficiency.value;
        this.verificationForm.get('insuffRaisedFlag')?.setValue(true);
        this.verificationService.tempData.verificationScreeningDet.manualFileSubmissionFlag !== true ?
          this.screeningStatusForm.disable() : this.screeningStatusForm.enable();
        const screeningStatusId = this.insufficiencyForm.controls.screeningInsufficiency.value.screeningStatusId;
        const screeningStatus = this.verificationTransBindDet.status.find(x => x.screeningStatusId === screeningStatusId);
        if (screeningStatus) {
          this.screeningStatusForm.get('screeningStatusId')?.setValue(screeningStatus.screeningStatusId);
        }
        // this.screeningStatusForm.disable();
        this.insufficiencyForm.disable();
        if (this.verificationForm.get('showGenrateResponse')?.value === true) {
          this.verificationForm.get('showGenrateResponse')?.setValue(false);
        }
      } else if (!res.success) {
        this.showTopCenter('warn', 'Failed Message', res.message);
      }
    });
  }
  dialogClose() {
    this.dialogRef.close();
    this.ownerControl.setValue(0);
    this.vendorControl.setValue(0);
  }
  getInsuffDoc(compId: any) {
    this.screeningService.getInsuffDocument(compId).subscribe(resp => {
      this.screeningService.insuffDocList = Object.assign([], resp);
    });
  }
  opendialog(type: any) {
    if (type === 'owner') {
      this.dialogRef = this.dialog.open(this.assignOwnerPopUp, {
        width: '400px',
        disableClose: true
      });
      this.dialogRef.afterOpened().subscribe(res => {
        if (this.verificationScreeningForm.get('screeningOwnerName')?.value) {
          const ind = this.verificationTransBindDet.persons.findIndex(x => x.name ===
            this.verificationScreeningForm.get('screeningOwnerName')?.value);
          const data = this.verificationTransBindDet.persons.find(x => x.name ===
            this.verificationScreeningForm.get('screeningOwnerName')?.value);
          this.assignScrnOwner(data, 'owner', ind);
        }
      });

    } else {
      this.dialogRef = this.dialog.open(this.assignVendorPopUp, {
        width: '400px',
        disableClose: true
      });
    }

  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  initInsufficiencyForm(compId?, subCompId?): UntypedFormGroup {
    return new UntypedFormGroup({
      screeningInsufficiency: new UntypedFormGroup({
        insufficiencyId: new UntypedFormControl(0),
        compId: new UntypedFormControl(0),
        subCompId: new UntypedFormControl(0),
        raisedDate: new UntypedFormControl(null),
        requiredLookupId: new UntypedFormControl(null, Validators.required),
        screeningStatusId: new UntypedFormControl(null),
        levelLookupId: new UntypedFormControl(null),
        loggedIn: new UntypedFormControl(this.userData.userId),
        createdUserId: new UntypedFormControl(this.userData.userId),
        screeningCompId: new UntypedFormControl(this.verificationScreeningForm.get('screeningCompId')?.value),
        insuffDetail: this.createInsuff(),
        insuffDocument: new UntypedFormControl([]),
      })
    });
  }
  createInsuff() {
    const frmArray = new UntypedFormArray([]);
    frmArray.push(new UntypedFormGroup({
      insuffDetailId: new UntypedFormControl(0),
      insufficiencyId: new UntypedFormControl(0),
      insuffDate: new UntypedFormControl(null),
      comments: new UntypedFormControl(null),
      createdUserId: new UntypedFormControl(this.userData.userId),
      infoReqFlag: new UntypedFormControl(false),
      docReqFlag: new UntypedFormControl(true)
    }));
    return frmArray;
  }
  initInsufCommentForm(array: UntypedFormArray, data) {
    if (data.length > 0 && array.length > 0) {
      let ind = array.length;
      while (ind >= 0) {
        array.removeAt(ind);
        ind--;
      }
    }
    const frmArray = new UntypedFormArray([]);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      array.push(new UntypedFormGroup({
        insuffDetailId: new UntypedFormControl(0),
        insufficiencyId: new UntypedFormControl(0),
        insuffDate: new UntypedFormControl(null),
        comments: new UntypedFormControl(null),
        createdUserId: new UntypedFormControl(this.userData.userId),
        infoReqFlag: new UntypedFormControl(false),
        docReqFlag: new UntypedFormControl(false)
      }));
    }
  }
  // pvform
  pvForm() {
    this.router.navigate(['dashboard/verification/addresspvform']);
    // this.verificationService.componentDet = this.verificationForm;
  }
  assignScrnOwner(data, type, index) {
    if (type === 'owner') {
      // const ind = this.verificationTransBindDet.persons.findIndex(x => x.name === data.name && x.lastLoginFlag === true);
      // if (ind > -1) {
      this.ownerControl.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (eleScroll.length > 0) {
        eleScroll[0].scrollTop = 0;
      }
      // [this.verificationTransBindDet.persons[0], this.verificationTransBindDet.persons[ind]] =
      //   [this.verificationTransBindDet.persons[ind], this.verificationTransBindDet.persons[0]];
      const indCls = this.verificationTransBindDet.persons.findIndex(x => x.name === data.name);
      if (ele.length > 0) {
        for (let i = 0; i < this.verificationTransBindDet.persons.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.verificationTransBindDet.persons = Object.assign([], this.verificationTransBindDet.persons);
      // }
      // else {
      //   this.showTopCenter('error', 'Choose Active User', 'Owner name is In-active');
      // }
    }
  }
  // getScreenLetter() {
  //   this.router.navigate(['dashboard/verification/screeningLetter']);
  // }
  onInitiateDigilockerClick() {
    this.verificationService.SendMailtoGenerateDigiLockerURL(this.verificationForm.value.screeningId,
      this.verificationForm.value.screeningCompId, this.userData.userId).subscribe(resp => {
        if (resp) {
          //this.verificationService.smsDetails = this.smsFormGroup.value;
          this.showTopCenter('success', 'Success Message', 'Mail sent successfully');
        }
      });
  }
  getDigiLockerTemplate() {
    this.getDigiLockerMailTemplate();
    this.dialog.open(this.mailDialog, {
      width: '1400px',
      disableClose: true,
    });
  }

  getDigiLockerMailTemplate() {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    this.verificationService.GetDigiLockerMailTemplate(this.verificationForm.value.screeningId,
      this.verificationForm.value.screeningCompId, this.userData.userId).subscribe(resp => {
        if (resp) {
          this.SendCaseMailList.EmailTemplate = resp.htmlTemplateBody;
          this.SendCaseMailList.Subject = resp.templateSubject;
          this.SendCaseMailList.TemplateName = resp.templateName;
          this.SendCaseMailList.discloseClientFlag = resp.discloseClientFlag;
          this.SendCaseMailList.discloseEnableFlag = resp.discloseEnableFlag;
          this.toList = resp.toMail != null ? resp.toMail : [];
          this.ccList = resp.ccMail != null ? resp.ccMail : [];
          this.ccvalue = resp.ccMail != null ? resp.ccMail : [];
          this.SendCaseMailList.attachments = resp.attachments;
          this.isMailIdSave = true
          this.SendCaseMailList.ClientMailId = (resp.mailid != null) ? resp.mailid : [];
        }
      });
  }
  generateDigiLockerURL(): void {
    this.digiLockerCallUrl = this.verificationService.digiLockerCallUrl;
    this.UrlFlag = true;
    // this.digiLockerauthService.getAuthURL();
  }

  // Method to copy URL to clipboard
  copyToClipboard(): void {
    const inputElement = document.createElement('input');
    inputElement.setAttribute('value', this.verificationService.digiLockerCallUrl);
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
    //alert('URL copied to clipboard!');
    this.showTopCenter('success', 'Alert Message', 'URL copied to clipboard!');
  }

  smsPreview() {
    this.dialogRef = this.dialog.open(this.smsPopUp, {
      width: '800px',
    });
  }
  updateSms() {
    if (this.smsFormGroup.valid && this.smsFormGroup.value) {
      this.smsFormGroup.controls.digitalAddressFlag.setValue(true)
      this.smsFormGroup.controls.clientId.setValue(this.verificationForm.value.verificationScreeningDet.clientId);
      this.smsFormGroup.controls.candidateId.setValue(this.verificationForm.value.screeningCandidateDet.candidateId);
      this.smsFormGroup.controls.loggedIn.setValue(this.userData.userId);
      this.smsFormGroup.controls.screeningCompId.setValue(this.verificationForm.value.screeningCompId);
      this.verificationService.AddressSendSMSMail(this.smsFormGroup.value).subscribe(resp => {
        if (resp) {
          this.verificationService.smsDetails = this.smsFormGroup.value;
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        }
      });
    } else {
      this.smsFormGroup.markAsTouched();
    }
  }

  //Send Verfication Mail
  getScreenLetter(ComponentName: any) {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    if (ComponentName === "employee" || ComponentName === "currentemployee" || ComponentName === "previousemployee" || ComponentName === "education" || ComponentName === "referenceCheck" || ComponentName === "employmentSupervisor") {
      this.getMailId();
      this.getVerificationDetails(ComponentName);
      this.dialog.open(this.mailDialog, {
        width: '1400px',
        disableClose: true,
      });
    } else {
      this.router.navigate(['dashboard/verification/screeningLetter']);
    }
  }
  openUploadDoc(event: any) {

    for (let i = 0; i < event.target.files.length; i++) {

      const mailDocumemtnVm: MailDocument = {
        fileName: event.target.files[i].name,
        document: event.target.files[i]
      }
      let size;
      this.size = event.target.files[i].size;
      this.SendCaseMailList.mailDocument.push(mailDocumemtnVm)
    }

  }
  removeDocument(data, index) {
    if (data.documentId === 0) {
      // this.model.clientFeeApproveDoc.splice(index, 1);
    }
  }

  addMail(event: MatChipInputEvent, type) {
    const input = event.input;
    const value = event.value;
    if (type === 'To') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          this.addFlag = false;
          this.tovalue = value;
          this.toList.push(value);
          if (input) {
            input.value = '';
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) {
          input.value = '';
        }
      }
    } else if (type === 'CC') {
      if ((value || '').trim()) {
        if (this.common.EmailRegX.test(value)) {
          this.ccFlag = false;
          this.ccvalue = value;
          this.ccList.push(this.ccvalue);
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please enter valid Email');
        }
        if (input) {
          input.value = '';
        }
      }
    }
  }
  removeControl(ind, type) {
    if (type === 'CC') {
      this.ccList.splice(ind, 1);
    }
    if (type === 'To') {
      this.toList.splice(ind, 1);
    }
  }
  checkIsExist(type: 'ToInc' | 'ToDec' | 'CCInc' | 'CCDec'): boolean {
    let returnVal = true;
    if (type === 'ToInc') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === false).length === 0;
      }
    }
    if (type === 'ToDec') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'To' && e.selected === true).length === 0;
      }
    }
    if (type === 'CCInc') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === false).length === 0;
      }
    }
    if (type === 'CCDec') {
      if (this.SendCaseMailList.ClientMailId.length > 0) {
        return returnVal = this.SendCaseMailList.ClientMailId.filter(e => e.emailType === 'CC' && e.selected === true).length === 0;
      }
    }
    return returnVal;
  }
  mailChange(mail, assign) {
    this.SendCaseMailList.ClientMailId.filter(e => e.emailAddress === mail)[0].selected = assign;
  }
  sendSelectMail() {
    if (this.SendCaseMailList.TemplateName === 'DigiLockerURLMailSend') {
      this.sendDigilockerMail();
    }
    else {
      this.sendMail();
    }
  }
  sendDigilockerMail() {
    this.SendCaseMailList.LoggedIn = this.userData.userId;
    this.SendCaseMailList.TemplateName = "DigiLockerURLMailSend";
    this.SendCaseMailList.TeamName = this.userData.teamName;
    this.SendCaseMailList.ScreeningCompId = this.verificationForm.value.screeningCompId;

    if (this.toList && this.toList.length > 0) {
      this.toList.forEach(ele => {
        const defaultMailList: verficationMail = {

          emailAddress: ele,
          emailType: 'To',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.toList = [];
    }
    if (this.ccList && this.ccList.length > 0) {
      this.ccList.forEach(ele => {
        const defaultMailList: verficationMail = {
          emailAddress: ele,
          emailType: 'CC',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.ccList = [];
    }

    if (this.SendCaseMailList.ClientMailId.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.SendCaseMailList.attachments.length; i++) {
        if (this.SendCaseMailList.attachments[i].fileName) {
          const fileSize = this.fileSizeValidation(this.size);
          if (!fileSize) {
            this.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5 MB');
            return;
          }
          else {
            formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.SendCaseMailList.attachments[i].document);
          }
        }
      }
      formData.append('SendDigiLockerMail', JSON.stringify(this.SendCaseMailList));
      this.verificationService.sendDigilockerFinalMail(formData).subscribe(res => {
        if (res.success == true) {
          this.showTopCenter('success', 'Success', 'Mail sent Successfully');
          this.dialog.closeAll();
          this.isMailIdSave = false;
        }
        else {
          this.showTopCenter('warn', 'Info message', 'Something Went Wrong');
        }
      })
    } else {
      this.showTopCenter('warn', 'Info message', 'Please add MailId');
    }

  }
  sendMail() {

    this.SendCaseMailList.LoggedIn = this.userData.userId;
    this.SendCaseMailList.TemplateName = this.templateName;
    this.SendCaseMailList.TeamName = this.userData.teamName;
    this.SendCaseMailList.ScreeningCompId = this.verificationForm.value.screeningCompId;

    if (this.toList && this.toList.length > 0) {
      this.toList.forEach(ele => {
        const defaultMailList: verficationMail = {

          emailAddress: ele,
          emailType: 'To',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.toList = [];
    }
    if (this.ccList && this.ccList.length > 0) {
      this.ccList.forEach(ele => {
        const defaultMailList: verficationMail = {
          emailAddress: ele,
          emailType: 'CC',
          selected: true
        };
        this.SendCaseMailList.ClientMailId.push(defaultMailList);
      });
      this.ccList = [];
    }

    if (this.SendCaseMailList.ClientMailId.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < this.SendCaseMailList.mailDocument.length; i++) {
        if (this.SendCaseMailList.mailDocument[i].fileName) {
          const fileSize = this.fileSizeValidation(this.size);
          if (!fileSize) {
            this.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5 MB');
            return;
          }
          else {
            formData.append('ScreeningComponentDocument_' + 0 + '_' + i, this.SendCaseMailList.mailDocument[i].document);
          }
        }
      }

      formData.append('sendverification', JSON.stringify(this.SendCaseMailList));

      this.verificationService.sendVerficationMail(formData).subscribe(res => {
        if (res.success == true) {

          this.showTopCenter('success', 'Success', 'Mail sent Successfully');
          this.dialog.closeAll();
          //this.closeForm();
          this.isMailIdSave = false;
        }
        else {
          this.showTopCenter('warn', 'Info message', 'Something Went Wrong');
        }
      })
    } else {
      this.showTopCenter('warn', 'Info message', 'Please add MailId');
    }

  }

  fileSizeValidation(size: any) {
    return this.bytesToSize(size);
  }
  bytesToSize(bytes: any) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    const total = Math.round(bytes / Math.pow(1024, i));
    if (i === 2) {
      return total > 5 ? false : true;
    } else if (i > 2) {
      return false;
    } else {
      return true;
    }
  }
  getVerificationDetails(compName: any) {
    this.verificationService.getMailDetails(this.verificationForm.value.screeningCompId, compName, this.verificationForm.value.verificationScreeningDet.clientId, this.verificationForm.value.verificationScreeningDet.siteId, false).subscribe(dat => {
      if (dat != null) {
        this.SendCaseMailList.EmailTemplate = dat.htmlTemplateBody;
        this.SendCaseMailList.Subject = dat.templateSubject;
        this.templateName = dat.templateName;
        this.SendCaseMailList.TemplateName = dat.templateName;
        this.SendCaseMailList.discloseClientFlag = dat.discloseClientFlag;
        this.SendCaseMailList.discloseEnableFlag = dat.discloseEnableFlag;
        this.toList = dat.toMail != null ? dat.toMail : [];
        this.ccList = dat.ccMail != null ? dat.ccMail : [];
        this.ccvalue = dat.ccMail != null ? dat.ccMail : [];
        this.isMailIdSave = true
        if (this.SendCaseMailList.discloseClientFlag == true) {

          const data = {
            checked: true,
          }
          this.getDisaCloseVerificationDetails(data, compName)
        }

      }
    })
  }
  getDisaCloseVerificationDetails(e, compName) {
    //console.log('Checkbox changed:', e.checked);
    //console.log('Component type:', compName);
    //console.log('SendCaseMailList:', this.SendCaseMailList);
    //console.log('SendCaseMailList:', this.SendCaseMailList.discloseClientFlag);
    this.SendCaseMailList.discloseClientFlag = e.checked;
    //console.log('SendCaseMailList:', this.SendCaseMailList.discloseClientFlag);
    this.verificationService.getMailDetails(this.verificationForm.value.screeningCompId, compName, this.verificationForm.value.verificationScreeningDet.clientId, this.verificationForm.value.verificationScreeningDet.siteId, e.checked).subscribe(dat => {
      if (dat != null) {
        this.SendCaseMailList.EmailTemplate = dat.htmlTemplateBody;
        this.toList = dat.toMail != null ? dat.toMail : [];
        this.ccList = dat.ccMail != null ? dat.ccMail : [];
      }
    })
  }

  getMailId() {
    this.SendCaseMailList = new sendverification();
    this.SendCaseMailList.discloseClientFlag = false;
    this.verificationService.getMail(this.verificationForm.value.screeningCompId).subscribe(tat => {
      if (tat.length != 0) {
        this.SendCaseMailList.ClientMailId = tat.mailid
      }
      else {

      }
    })
  }
  //End Send Verfication Mail
}
class sendverification {
  ClientMailId: verficationMail[] = [];
  EmailTemplate: string;
  Subject: string;
  TemplateName: string;
  TeamName: string
  discloseClientFlag: boolean;
  discloseEnableFlag: boolean;
  LoggedIn: number;
  ScreeningCompId: string;
  mailDocument: MailDocument[] = [];
  attachments: MailDocument[] = [];
}
export class MailDocument {
  fileName: string;
  document;
}
class verficationMail {
  emailType: string;
  emailAddress: string;
  selected = false;
}
