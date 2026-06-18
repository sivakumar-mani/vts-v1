import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';
import { UserData, User } from 'src/app/common-methods/models/user';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { VerificationDetails } from 'src/app/common-methods/models/verification';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { ReviewComponent } from '../review/review.component';
import { VerificationDetFilterVm, FilterVm } from 'src/app/common-methods/models/verification';
import { SelectItem } from 'primeng/api';
import { MasterService } from '../../common-methods/services/master.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
  standalone: false,
  selector: 'app-verification-details',
  templateUrl: './verification-details.component.html',
  styleUrls: ['./verification-details.component.css']
})
export class VerificationDetailsComponent implements OnInit, OnDestroy {
  // count: number = 0;
  // empmatch: any;
  // Message: any;
  // displayCaption: any[] = [];
  // fileSubmissionCom: any;
  // empmat: any;
  // emplen: any;

  // items: SelectItem[] = [];
  // employeenames: any;

  // /* For UI     */
  // isviewddldoctype = false;
  // /* For UI end   */
  // stepper = 0;
  // breadcrumbFlags = new BreadcrumbFlags();
  // verificationFilter: VerificationDetFilterVm = new VerificationDetFilterVm();
  // userData = new User();
  // routePath = 'Verification Transaction / Verification Transaction Details';
  // employeeDetailsEdit = false;
  // screeningCompId: number;
  // verificationDetails: VerificationDetails = new VerificationDetails();
  // verificationForm: UntypedFormGroup;
  // screeningCloseStatusList: any[] = [];
  // empinsFakeList: any[] = [];
  // empinsFakeColumns = [
  //   // { field: 'SNo', header: 'S No' },
  //   { field: 'name', header: 'Employer Name' },
  // ];
  // @ViewChild('dt', { static: false }) dt!: Table;
  // @ViewChild('reject', { static: true }) reject!: any;
  // @ViewChild('DateAlertPopUp', { static: true }) DateAlertPopUp!: any;
  // @ViewChild('empinsMatchingFakeTemplate', { static: true })
  // empinsMatchingFake!: TemplateRef<any>;
  // @ViewChild('review', { static: true })
  // reviewComp!: ReviewComponent;
  // @ViewChild('empmatching', { static: true })
  // empmatching!: TemplateRef<any>;
  // @ViewChild('empsearch', { static: true })
  // empsearch!: TemplateRef<any>;
  // @ViewChild('OverLabPopUp', { static: true })
  // OverLabPopUp!: TemplateRef<any>;
  // rejectComments = new UntypedFormControl();
  // currentPage = 1;
  // tempCurrentPage = 1;
  // index = -1;
  // totalpages: number;

  // showFakeList: boolean;
  // msg: string;
  // paymentDetails: any;
  // paymentModeList: any[] = [];
  // communicationList: any;
  // communicationDetails: any;
  // overrideFeeDetails: any;
  // pdfType = '';
  // generateFlag = false;
  // closedFlag = false;
  // incorporationDate: Date;
  // caseInitiationDate: Date;
  // DomaincreationDate: Date;
  // DateofJoin: Date;
  // headerText: string;
  // messageText: any;
  // alertCommand: string = '';
  // alertFlag: boolean = false;
  // alertFlagMsg: boolean = false;
  // // isRemoveDisabled: boolean = false;
  // // isGenerateDisabled: boolean = false;
  // screenAuth: any = {};
  // messages: string[];
  // //images: string[] = [];
  // constructor(private dateP: DatePipe,
  //   private authService: AuthService, private router: Router, public verificationService: VerificationService,
  //   private fb: UntypedFormBuilder, private screeningService: ScreeningService, public commonService: CommonService,
  //   public dialog: MatDialog, private sharedService: SharedService, private messageService: MessageService,
  //   public master: MasterService) { }
  // ngOnInit() {
  //   this.initDefaultData();
  //   this.getCamApproveName();
  //   console.log(this.commonService.camRejection)
  //   this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);
  //   if (this.commonService.redcaseFlag) {
  //     this.routePath = 'Verification / Red Case Approval';
  //   }
  //   if (this.verificationDetails.screeningCompId > 0) {
  //     this.getVerificationDetails();
  //   } else {
  //     this.router.navigate(['dashboard/verification/verification']);
  //   }
  //   this.pdfType = this.authService.getpdfType('pdfType');
  //   this.closedFlag = this.verificationService.closedCheck;
  // }

  // initDefaultData() {
  //   this.verificationDetails.loginUserDetVm = JSON.parse(sessionStorage.getItem('user_data') as string);
  //   this.stepperChange(0);
  //   this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  //   this.breadcrumbFlags.btnSave = true;
  //   this.breadcrumbFlags.btnReset = true;
  //   this.breadcrumbFlags.btnBack = true;
  //   this.verificationService.currentMessage.subscribe(message => this.verificationDetails.screeningCompId = message);
  //   this.initFormGroup();
  //   this.verificationForm.controls.screeningStatus.get('createdUserId')?.setValue(this.verificationDetails.loginUserDetVm.userId);
  // }
  // showTopCenter(level: string, info: string, message: string) {
  //   this.messageService.add({ severity: level, summary: info, detail: message });
  // }
  // restrictVeAccess() {
  //   return this.userData.applicationId !== 2 && !this.getFrFlag() && (this.userData.subTeamName !== this.commonService.COMMONSUBCAMTEAM
  //     && this.userData.teamName !== this.commonService.COMMONCRTTEAM) || (this.commonService.modifyAdditionalFeeFlag) || (this.commonService.modifyComponentFeeFlag);
  // }
  // employeematch() {
  //   if (this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.CURRENT_EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.PREVIOUS_EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EDUCATION.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_INTERNATIONAL.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EDUCATION_INTERNATIONAL.toLowerCase()) {
  //     // this.verificationService.GetEmployeeMatch({
  //     //   empFlag: this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_INTERNATIONAL.toLowerCase() ? true : false,
  //     //   clientId: this.verificationDetails.loginUserDetVm.clientId, workFlowLookupId: 0,
  //     //   deptId: this.verificationForm.value.empInsMasterDet.id + '|' + this.verificationForm.value.empInsMasterDet.empInsAddressId
  //     // }).subscribe(res => {
  //     const loginUserDetVm = {
  //       empFlag: this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.CURRENT_EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.PREVIOUS_EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument'].componentName.toLowerCase() === this.commonService.EMPLOYMENT_INTERNATIONAL.toLowerCase() ? true : false,
  //       clientId: this.verificationDetails.loginUserDetVm.clientId,
  //       workFlowLookupId: 0,
  //       EmployerInsId: this.verificationForm.value.empInsMasterDet.id,
  //       EmpInsAddressId: this.verificationForm.value.empInsMasterDet.empInsAddressId,
  //     }
  //     this.verificationService.GetEmployeeMatch(loginUserDetVm).subscribe(res => {
  //       if (res) {
  //         let employeename: any[] = [];
  //         if (this.verificationService.tempData.verificationComponentDet.component[0].fresherFlag ? this.verificationService.tempData.verificationComponentDet.component[0].fresherFlag : false == false) {
  //           let employee = this.verificationService.tempData ? this.verificationService.tempData.empInsMasterDet.name : '';
  //           this.empmatch = res;
  //           this.verificationService.frStatusId = this.empmatch[0].researchResultLookupId;
  //           this.empmatch.forEach(function (emp) {
  //             if (emp.empInsName == employee && emp.empInsName != null) {
  //               employeename.push(emp)
  //             }
  //           })
  //         }

  //         //if (employeename.length >= 2 && this.empmatch[0].researchResultLookupId == 170) {
  //         if (employeename.length > 0 && this.empmatch[0].researchResultLookupId == 170) {
  //           this.empmat = employeename;
  //           this.emplen = this.empmat.length;
  //           this.dialog.open(this.empmatching, {
  //             width: '800px',
  //             disableClose: true
  //           });
  //         }
  //       }
  //     });
  //   }
  // }

  count: number = 0;
  empmatch: any;
  Message: any;
  displayCaption: any[] = [];
  fileSubmissionCom: any;
  empmat: any;
  emplen: any;

  items: SelectItem[] = [];
  employeenames: any;

  /* For UI     */
  isviewddldoctype = false;
  /* For UI end   */
  stepper = 0;
  breadcrumbFlags = new BreadcrumbFlags();
  verificationFilter: VerificationDetFilterVm = new VerificationDetFilterVm();
  userData = new User();
  routePath = 'Verification Transaction / Verification Transaction Details';
  employeeDetailsEdit = false;

  screeningCompId: number = 0; // âœ… fix

  verificationDetails: VerificationDetails = new VerificationDetails();
  verificationForm!: UntypedFormGroup; // âœ… fix

  screeningCloseStatusList: any[] = [];
  empinsFakeList: any[] = [];

  empinsFakeColumns = [
    { field: 'name', header: 'Employer Name' },
  ];

  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('reject', { static: true }) reject!: any;
  @ViewChild('DateAlertPopUp', { static: true }) DateAlertPopUp!: any;

  @ViewChild('empinsMatchingFakeTemplate', { static: true })
  empinsMatchingFake!: TemplateRef<any>;

  @ViewChild('review', { static: false })
  reviewComp!: ReviewComponent;

  @ViewChild('empmatching', { static: true })
  empmatching!: TemplateRef<any>;

  @ViewChild('empsearch', { static: true })
  empsearch!: TemplateRef<any>;

  @ViewChild('OverLabPopUp', { static: true })
  OverLabPopUp!: TemplateRef<any>;

  rejectComments = new UntypedFormControl();

  currentPage = 1;
  tempCurrentPage = 1;
  index = -1;
  totalpages: number = 0;

  showFakeList: boolean = false;
  msg: string = '';

  paymentDetails: any;
  paymentModeList: any[] = [];

  communicationList: any;
  communicationDetails: any;
  overrideFeeDetails: any;

  pdfType = '';
  generateFlag = false;
  closedFlag = false;

  incorporationDate!: Date; // âœ… fix
  caseInitiationDate!: Date;
  DomaincreationDate!: Date;
  DateofJoin!: Date;

  headerText: string = '';
  messageText: any;

  alertCommand: string = '';
  alertFlag: boolean = false;
  alertFlagMsg: boolean = false;

  screenAuth: any = {};
  messages: string[] = []; // âœ… fix

  constructor(
    private dateP: DatePipe,
    private authService: AuthService,
    private router: Router,
    public verificationService: VerificationService,
    private fb: UntypedFormBuilder,
    private screeningService: ScreeningService,
    public commonService: CommonService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private messageService: MessageService,
    public master: MasterService
  ) { }

  ngOnInit() {
    this.initDefaultData();
    this.getCamApproveName();

    this.screenAuth = this.authService.getScreenAuth(this.commonService.VERIFICATION_ROUTER);

    if (this.commonService.redcaseFlag) {
      this.routePath = 'Verification / Red Case Approval';
    }

    if (this.verificationDetails.screeningCompId > 0) {
      this.getVerificationDetails();
    } else {
      this.router.navigate(['dashboard/verification/verification']);
    }

    const pdfType = this.authService.getpdfType('pdfType');
    this.pdfType = pdfType ?? ''; // âœ… fix

    this.closedFlag = this.verificationService.closedCheck;
  }

  initDefaultData() {
    const userDataStr = sessionStorage.getItem('user_data');

    this.verificationDetails.loginUserDetVm = userDataStr
      ? JSON.parse(userDataStr)
      : null;

    this.userData = userDataStr ? JSON.parse(userDataStr) : new User();

    this.stepperChange(0);

    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags.btnBack = true;

    this.verificationService.currentMessage.subscribe(
      (message: number) => (this.verificationDetails.screeningCompId = message)
    );

    this.initFormGroup();

    this.verificationForm.controls['screeningStatus']
      ?.get('createdUserId')
      ?.setValue(this.verificationDetails.loginUserDetVm?.userId);
  }

  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }

  restrictVeAccess() {
    return (
      (this.userData.applicationId !== 2 &&
        !this.getFrFlag() &&
        this.userData.subTeamName !== this.commonService.COMMONSUBCAMTEAM &&
        this.userData.teamName !== this.commonService.COMMONCRTTEAM) ||
      this.commonService.modifyAdditionalFeeFlag ||
      this.commonService.modifyComponentFeeFlag
    );
  }

  employeematch() {
    const componentName =
      this.verificationForm?.value?.responseDocument?.componentName?.toLowerCase();

    if (
      componentName === this.commonService.CURRENT_EMPLOYMENT_HR.toLowerCase() ||
      componentName === this.commonService.PREVIOUS_EMPLOYMENT_HR.toLowerCase() ||
      componentName === this.commonService.EMPLOYMENT_HR.toLowerCase() ||
      componentName === this.commonService.EDUCATION.toLowerCase() ||
      componentName === this.commonService.EMPLOYMENT_INTERNATIONAL.toLowerCase() ||
      componentName === this.commonService.EDUCATION_INTERNATIONAL.toLowerCase()
    ) {
      const loginUserDetVm = {
        empFlag:
          componentName === this.commonService.CURRENT_EMPLOYMENT_HR.toLowerCase() ||
          componentName === this.commonService.PREVIOUS_EMPLOYMENT_HR.toLowerCase() ||
          componentName === this.commonService.EMPLOYMENT_HR.toLowerCase() ||
          componentName === this.commonService.EMPLOYMENT_INTERNATIONAL.toLowerCase(),

        clientId: this.verificationDetails.loginUserDetVm?.clientId,
        workFlowLookupId: 0,
        EmployerInsId: this.verificationForm.value?.empInsMasterDet?.id,
        EmpInsAddressId:
          this.verificationForm.value?.empInsMasterDet?.empInsAddressId,
      };

      this.verificationService
        .GetEmployeeMatch(loginUserDetVm)
        .subscribe((res: any) => {
          if (res) {
            let employeename: any[] = [];

            const fresherFlag =
              this.verificationService.tempData?.verificationComponentDet
                ?.component[0]?.fresherFlag ?? false;

            if (!fresherFlag) {
              let employee =
                this.verificationService.tempData?.empInsMasterDet?.name || '';

              this.empmatch = res;

              this.verificationService.frStatusId =
                this.empmatch[0]?.researchResultLookupId;

              this.empmatch.forEach((emp: any) => {
                if (emp.empInsName === employee && emp.empInsName != null) {
                  employeename.push(emp);
                }
              });
            }

            if (
              employeename.length > 0 &&
              this.empmatch[0]?.researchResultLookupId == 170
            ) {
              this.empmat = employeename;
              this.emplen = this.empmat.length;

              this.dialog.open(this.empmatching, {
                width: '800px',
                disableClose: true,
              });
            }
          }
        });
    }
  }

  viewmat() {
    this.dialog.closeAll();
    this.dialog.open(this.empsearch, {
      width: '1000px',
      disableClose: true
    });
  }
  getDateCalc() {
    if (this.verificationForm.value['responseDocument']?.componentName?.toLowerCase() === this.commonService.CURRENT_EMPLOYMENT_HR?.toLowerCase() || this.verificationForm.value['responseDocument']?.componentName?.toLowerCase() === this.commonService.PREVIOUS_EMPLOYMENT_HR.toLowerCase() || this.verificationForm.value['responseDocument']?.componentName?.toLowerCase() === this.commonService.EDUCATION?.toLowerCase() || this.verificationForm?.value['responseDocument']?.componentName?.toLowerCase() === this.commonService.EMPLOYMENT_HR?.toLowerCase()) {
      this.employeematch();
    } else {
      if (this.verificationForm.value['responseDocument']?.componentName?.toLowerCase() === this.commonService.EMPLOYMENT_HR?.toLowerCase()) {
        this.verificationService.GetEmployeeDateMatch(this.verificationService.tempData.screeningId).subscribe(res => {
          if (res) {
            var fromdate = this.verificationForm.value['responseDocument'].component.applicantDetail.fromDate;
            var todate = this.verificationForm.value['responseDocument'].component.applicantDetail.toDate;
            if (fromdate !== 'NOT PROVIDED' || todate !== 'NOT PROVIDED') {
              let compArr: any[] = [];
              compArr = res;
              compArr = compArr.filter(s => s.screeningCompId != this.verificationService.tempData.screeningCompId);
              if (todate.toUpperCase().includes('TILL DATE')) {
                let secondDate = new Date(new Date());
              }
              for (let i = 0; i < compArr.length; i++) {

                const item = compArr[i];

                if (item?.toDate != null) {

                  // âœ… initialize outside
                  let tlDate: Date | null = null;
                  let totlDate: Date | null = null;

                  const itemToDateStr = item.toDate ?? '';
                  const toDateStr = todate ?? '';
                  const fromDateStr = fromdate ?? '';

                  // âœ… TILL DATE check
                  if (itemToDateStr.toUpperCase().includes('TILL DATE')) {
                    tlDate = new Date();
                  }

                  if (toDateStr.toUpperCase().includes('TILL DATE')) {
                    totlDate = new Date();
                  }

                  if (item?.fromDate != null && item?.toDate != null) {

                    const frompDate = new Date(fromDateStr);
                    const topDate = totlDate ?? new Date(toDateStr);

                    const firstDate = new Date(item.fromDate);
                    const secondate = tlDate ?? new Date(item.toDate);

                    // âœ… overlap condition
                    if ((frompDate >= firstDate) && (topDate <= secondate)) {

                      this.Message =
                        "Period of Employement for this Employement (HR) " +
                        fromdate + " and " + todate +
                        " is Overlapping with Previous Employement (HR) " +
                        item.fromDate + " and " + item.toDate;

                      this.openEmpDialog();
                      return false;

                    } else {
                      this.employeematch();
                    }
                  }
                }
              }
            }
          }
        });
      }
    }
  }
  openEmpDialog() {
    const dialogRef = this.dialog.open(this.OverLabPopUp, {
      width: '350px',
      disableClose: true
    });
  }
  getCamApproveName() {

    this.verificationService.GetCamFlag().subscribe((res) => {
      if (res) {
        this.commonService.camFlagStatus = res;
      }
    });

  }
  initFormGroup() {
    this.verificationForm = this.fb.group({
      screeningId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      verificationId: new UntypedFormControl(0),
      camRejectRemarks: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      applicationId: new UntypedFormControl(null),
      insuffRaisedFlag: new UntypedFormControl(false),
      displayCaption: [],
      screeningCandidateDet: this.initCandidateForm(),
      verificationCaseDet: this.initVerificationCaseForm(),
      verificationScreeningDet: this.initVerificationScreeningForm(),
      verificationComponentDet: this.initVerificationComponentForm(),
      empInsMasterDet: this.initEmpInsMasterForm(),
      clientPolicy: [],
      institutionFees: this.initInstitutionFeesForm(),
      verificationTransBindDet: new UntypedFormControl(null),
      screeningStatus: this.initScreeningStatusForm(),
      additionalFee: new UntypedFormControl(),
      commentsFollowUp: new UntypedFormControl(),
      responseDocument: this.initVerificationComponent(),
      verificationResponseDocument: this.initVerifRespDocument(),
      showGenrateResponse: new UntypedFormControl(false),
      disableForm: new UntypedFormControl(false),
      drugVerifResult: new UntypedFormControl(false),
      paymentFlag: new UntypedFormControl(false),
      // componentCustomFields: new UntypedFormArray([]),
    });
  }
  // initCustomFields(): UntypedFormGroup {
  //   return new UntypedFormGroup({
  //     clientCustomFieldId: new UntypedFormControl(0),
  //     fieldName: new UntypedFormControl(),
  //     fieldType: new UntypedFormControl(),
  //     fieldTypeLookupId: new UntypedFormControl(0),
  //     fieldValue: new UntypedFormControl(),
  //     mandatoryFlag: new UntypedFormControl(),
  //     screeningClientCustomFieldId: new UntypedFormControl(0)
  //   })
  // }
  initCandidateForm(): UntypedFormGroup {
    return new UntypedFormGroup({
      candidateId: new UntypedFormControl(0),
      firstName: new UntypedFormControl(''),
      middleName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      fatherName: new UntypedFormControl(),
      dob: new UntypedFormControl(null),
      candidateAliasId: new UntypedFormControl(0),
      aliasFirstName: new UntypedFormControl(null),
      aliasMiddleName: new UntypedFormControl(null),
      aliasLastName: new UntypedFormControl(null),
      active: new UntypedFormControl(),
      alternativeCountryId: new UntypedFormControl(),
      alternativeContactCode: new UntypedFormControl(),
      countryCode: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      email: new UntypedFormControl('', Validators.compose(
        [Validators.email, Validators.pattern(this.commonService.EmailRegX)])),
      phoneNo: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/)])),
      alternativeContactNo: new UntypedFormControl('', Validators.compose(
        [Validators.pattern(/^(0|[1-9][0-9]*)$/)])),
      maritalStatusLookupId: new UntypedFormControl(),
      marital: new UntypedFormControl(),
      uan: new UntypedFormControl(),
      pan: new UntypedFormControl(),
      ssnFlag: new UntypedFormControl(false),
      ssn: new UntypedFormControl(),
      spouseName: new UntypedFormControl(),
      remarks: new UntypedFormControl(''),
      address: this.initAddressFormGroup(),
      createdUserId: new UntypedFormControl(this.userData.userId),
      genderLookupId: new UntypedFormControl(),
      gender: new UntypedFormControl(),
      bestVisitAddress: new UntypedFormControl()
    });
  }
  initAddressFormGroup() {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addTypeLookupId: new UntypedFormControl(''),
      addLine1: new UntypedFormControl(''),
      addLine2: new UntypedFormControl(''),
      addLine3: new UntypedFormControl(''),
      cityId: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      stateId: new UntypedFormControl(''),
      countryId: new UntypedFormControl(''),
      districtId: new UntypedFormControl(''),
      postalCode: new UntypedFormControl(''),
      place: new UntypedFormControl(),
      active: new UntypedFormControl(''),
      createdUserId: new UntypedFormControl(this.userData.userId),
      locationId: new UntypedFormControl(''),
      country: new UntypedFormControl(''),
      periodOfStay: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      district: new UntypedFormControl('')
    });
  }
  initVerificationCaseForm() {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(0),
      caseStatusLookupId: new UntypedFormControl(0),
      caseStatusName: new UntypedFormControl(null),
      casePriorityLookupId: new UntypedFormControl(0),
      casePriorityName: new UntypedFormControl(null),
      statusDate: new UntypedFormControl(),
      rptRecivedDate: new UntypedFormControl(),
    });
  }
  initVerificationScreeningForm() {
    return new UntypedFormGroup({
      // Add IsDisableClosureFlag - For (sprint -22) VTS2-2024-CRT-0195
      isDisableClosureFlag: new UntypedFormControl(false),
      reportCandidateName: new UntypedFormControl(null),
      screeningOwnerName: new UntypedFormControl(null),
      screenStatusId: new UntypedFormControl(0),
      screeningOwnerId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      vendorName: new UntypedFormControl(null),
      vendorId: new UntypedFormControl(0),
      workFlowId: new UntypedFormControl(0),
      workFlowName: new UntypedFormControl(null),
      submissionQcOwnerId: new UntypedFormControl(0),
      submissionQcOwnerName: new UntypedFormControl(null),
      requestDate: new UntypedFormControl(),
      reopenFlag: new UntypedFormControl(false),
      subCheckFlag: new UntypedFormControl(false),
      componentInitDate: new UntypedFormControl(),
      reopenDate: new UntypedFormControl(),
      subCheckDate: new UntypedFormControl(),
      componentDueDate: new UntypedFormControl(),
      caseDueDate: new UntypedFormControl(),
      beyondDate: new UntypedFormControl(),
      withInDate: new UntypedFormControl(),
      nearDate: new UntypedFormControl(),
      currentDate: new UntypedFormControl(),
      clientId: new UntypedFormControl(0),
      orginalScreeningOwnerName: new UntypedFormControl(null),
      reAssignFlag: new UntypedFormControl(false),
      clientName: new UntypedFormControl(null),
      ctsFlag: new UntypedFormControl(),
      referenceNo: new UntypedFormControl(null),
      siteNo: new UntypedFormControl(null),
      siteName: new UntypedFormControl(null),
      siteId: new UntypedFormControl(0),
      tatDays: new UntypedFormControl(0),
      tatStatus: new UntypedFormControl(''),
      inProgressDays: new UntypedFormControl(0),
      frInProgressDays: new UntypedFormControl(0),
      remainingDays: new UntypedFormControl(0),
      applicationId: new UntypedFormControl(null),
      compId: new UntypedFormControl(0),
      screeningOwnerFlag: new UntypedFormControl(false),
      vendorNameFlag: new UntypedFormControl(false),
      createdUserId: new UntypedFormControl(this.userData.userId),
      previousName: new UntypedFormControl(null),
      clientContactRemark: new UntypedFormControl(),
      clientNotificationFlag: new UntypedFormControl(),
      clientUpdateFlag: new UntypedFormControl(),
      auditUserId: new UntypedFormControl('', Validators.required),
      auditStatusLookupId: new UntypedFormControl('', Validators.required),
      urlName: new UntypedFormControl(null),
      componentCustomFields: new UntypedFormControl(),
      clientCategoryId: new UntypedFormControl(0),
      camRejectStatus: new UntypedFormControl()
    });
  }

  initVerificationComponentForm() {
    return new UntypedFormGroup({
      compId: new UntypedFormControl(0),
      component: new UntypedFormControl(),
    });
  }
  initEmpInsMasterForm() {
    return new UntypedFormGroup({
      pageType: new UntypedFormControl(),
      id: new UntypedFormControl(0),
      empInsAddressId: new UntypedFormControl(0),
      type: new UntypedFormControl(null),
      name: new UntypedFormControl(null),
      additionalInformation: new UntypedFormControl(null),
      additionalInformationSub: new UntypedFormControl(null),
      loggedId: new UntypedFormControl(),
      contactPerson1: new UntypedFormControl(),
      contactPerson2: new UntypedFormControl(),
      designation1: new UntypedFormControl(),
      designation2: new UntypedFormControl(),
      department1: new UntypedFormControl(),
      department2: new UntypedFormControl(),
      modeId: new UntypedFormControl(0),
      institutionTypeId: new UntypedFormControl(0),
      businessCategoryLookupId: new UntypedFormControl(0),
      onlineUrl: new UntypedFormControl(null),
      empFlag: new UntypedFormControl(),
      researchStatusId: new UntypedFormControl(0),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl(null),
        addLine2: new UntypedFormControl(null),
        addLine3: new UntypedFormControl(null),
        cityId: new UntypedFormControl(null),
        districtId: new UntypedFormControl(),
        stateId: new UntypedFormControl(null),
        countryId: new UntypedFormControl(null),
        postalCode: new UntypedFormControl(null),
        locationId: new UntypedFormControl(),
      }),
      commonEmailDet: this.fb.array([]),
      commonPhoneDet: this.fb.array([]),
    });
  }
  initInstitutionFeesForm() {
    return new UntypedFormGroup({
      deletedUserId: new UntypedFormControl(),
      updated: new UntypedFormControl(),
      updatedUserId: new UntypedFormControl(),
      created: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(this.userData.userId),
      effectFromDate: new UntypedFormControl(),
      active: new UntypedFormControl(),
      deleted: new UntypedFormControl(),
      remarks: new UntypedFormControl(null),
      additionalCharges: new UntypedFormControl(),
      ddamount: new UntypedFormControl(),
      bankName: new UntypedFormControl(null),
      payableAt: new UntypedFormControl(null),
      infavourof: new UntypedFormControl(null),
      institutionId: new UntypedFormControl(0),
      feesId: new UntypedFormControl(0),
      prevDdamount: new UntypedFormControl(),
      institutionName: new UntypedFormControl(),
      total: new UntypedFormControl(0),
      emailId: new UntypedFormControl(null),
      contactPerson: new UntypedFormControl(null),
      designation: new UntypedFormControl(null),
      contactNumber: new UntypedFormControl(null),
      institutionType: new UntypedFormControl(null),
      country: new UntypedFormControl(null),
      modeOfInitiation: new UntypedFormControl(null),
      abroadFee: new UntypedFormControl(null),
    });
  }
  initClientPolicyForm() {
    return new UntypedFormGroup({
      clientPolicyId: new UntypedFormControl(0),
      clientId: new UntypedFormControl(0),
      componentId: new UntypedFormControl(),
      reportType: new UntypedFormControl(null),
      instructionTypeId: new UntypedFormControl(),
      instruction: new UntypedFormControl(null),
      active: new UntypedFormControl(),
      lookUpName: new UntypedFormControl(null),
      rptType: new UntypedFormControl(null),
    });
  }
  initScreeningStatusForm() {
    return new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(0),
      statusDate: new UntypedFormControl(new Date(), Validators.required),
      screeningStatusId: new UntypedFormControl(0, Validators.required),
      screeningStatusName: new UntypedFormControl(''),
      reportReceivedDate: new UntypedFormControl(new Date()),
      createdUserId: new UntypedFormControl(this.userData.userId),
      applicationId: new UntypedFormControl(this.userData.applicationId),
      compDelayReason: new UntypedFormControl(''),
      cancelledDate: new UntypedFormControl(new Date()),
      //Added by Megala - For VTS2-2024-CRT-0155
      reopenRemarks: new UntypedFormControl(''),
      cancelledRemarks: new UntypedFormControl(''),
      confirmationReceivedDate: new UntypedFormControl()
    });
  }
  initVerifRespDocument() {
    return new UntypedFormGroup({
      responseFileDocument: this.initDocument(),
      receivedInfoDocument: this.initDocument(),
      receivedResponseDocument: this.initDocument(),
      //Added by Megala - For VTS2-2024-CRT-0155
      reOpenResponseDocument: this.initDocument(),
      responseConfirmationId: new UntypedFormControl(0),
    });
  }
  initDocument() {
    return new UntypedFormGroup({
      screeningId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      candidateName: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(0),
      document: new UntypedFormArray([]),
      responseDocumentFlag: new UntypedFormControl(false),
      recivedDocumentFlag: new UntypedFormControl(false),
      modeofVerificationId: new UntypedFormControl(0, Validators.required),
    });
  }
  initScreeningDocForm() {
    return new UntypedFormGroup({
      screeningDocId: new UntypedFormControl(0),
      document: new UntypedFormControl([]),
      fileName: new UntypedFormControl(''),
      filePath: new UntypedFormControl(''),
      docTypeId: new UntypedFormControl(0),
      docSubTypeId: new UntypedFormControl(0),
      insuffDocTransId: new UntypedFormControl(0),
      responseConfirmationId: new UntypedFormControl(0),
      annexDocFlag: new UntypedFormControl(false),
      //isDatabaseAnnexure: new UntypedFormControl(false),
    });
  }
  initVerificationComponent() {
    return new UntypedFormGroup({
      compId: new UntypedFormControl(0),
      componentType: new UntypedFormControl(null),
      componentName: new UntypedFormControl(null),
      component: this.initEmployeeApplicantReportDet(),
    });
  }
  initEmployeeApplicantReportDet() {
    return new UntypedFormGroup({
      employeeApplicantDet: this.initEmployeeApplicantReport(),
      employeeReportDet: this.initEmployeeReport(),
      reportContact: this.initEmployeeReportContact(),
      applicantDetail: new UntypedFormControl({}),
      reportDetail: new UntypedFormControl({}),
      displayCaption: new UntypedFormControl(0),
    });
  }
  i() {
    return new UntypedFormGroup({
      caption: new UntypedFormControl(0),
      dataType: new UntypedFormControl(0),
      key: new UntypedFormControl(0)
    });
  }
  initEmployeeReportContact() {
    return new UntypedFormGroup({
      // Added By Megala - For (sprint -22) VTS2-2024-CRT-0195
      camApproval: new UntypedFormControl(''),
      camApprovalId: new UntypedFormControl('', Validators.required),
      scenarioType: new UntypedFormControl(''),
      scenarioTypeId: new UntypedFormControl('', Validators.required),
      screeningEmployeeRptId: new UntypedFormControl(0),
      screeningEmpContactTransId: new UntypedFormControl(0),
      contactId: new UntypedFormControl(0),
      screeningCompId: new UntypedFormControl(0),
      contactPerson: new UntypedFormControl(''),
      contactPersonDesign: new UntypedFormControl('', Validators.required),
      contactEmail: new UntypedFormControl('', Validators.compose(
        [Validators.email, Validators.pattern(this.commonService.EmailRegX)])),
      location: new UntypedFormControl(''),
      contactPersonPhone: new UntypedFormControl(''),
      contactDate: new UntypedFormControl(''),
      verificationReceivedDate: new UntypedFormControl(''),
      verifiedPersonFirstName: new UntypedFormControl(''),
      verifiedPersonLastName: new UntypedFormControl(''),
      verifiedPersonDesign: new UntypedFormControl(''),
      remarks: new UntypedFormControl(''),
      colorStatus: new UntypedFormControl(''),
      colorStatusLookupId: new UntypedFormControl('', Validators.required),
      contactDetail: new UntypedFormControl(''),
      screeningReportContactId: new UntypedFormControl(0),
      relationWithCandidate: new UntypedFormControl(''),
      remarksLookupId: new UntypedFormControl(''),
      collectionSite: new UntypedFormControl(''),
      specimenId: new UntypedFormControl(''),
      reportSignedFlag: new UntypedFormControl(false),
      reportDateAvailableFlag: new UntypedFormControl(false),
      contactRemarksLookupId: new UntypedFormControl(''),
      onlineVerfDataRemarks: new UntypedFormControl(''),
      onlineVerficDataStatusLookupid: new UntypedFormControl('')
    });
  }
  initEmployeeReport() {
    return new UntypedFormGroup({
      screeningEmployeeRptId: new UntypedFormControl(0),
      screeningEmployeeId: new UntypedFormControl(0),
      firstName: new UntypedFormControl(''),
      middleName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      employeeId: new UntypedFormControl(''),
      designation: new UntypedFormControl(''),
      fromDate: new UntypedFormControl(''),
      toDate: new UntypedFormControl(''),
      ctc: new UntypedFormControl(''),
      employmentType: new UntypedFormControl(''),
      employmentNo: new UntypedFormControl(''),
      cin: new UntypedFormControl(''),
      rocRegistration: new UntypedFormControl(''),
      incorporationDate: new UntypedFormControl(''),
      fontColorStatus: new UntypedFormControl(''),
      loggedIn: new UntypedFormControl(this.userData.userId),
      screeningComponentId: new UntypedFormControl(0),
      genuineDocFlag: new UntypedFormControl(''),
      employeeReportContact: this.initEmployeeReportContact(),
    });
  }
  initEmployeeApplicantReport() {
    return new UntypedFormGroup({
      screeningEmployeeId: new UntypedFormControl(0),
      firstName: new UntypedFormControl(''),
      middleName: new UntypedFormControl(''),
      lastName: new UntypedFormControl(''),
      employerName: new UntypedFormControl(''),
      employeeId: new UntypedFormControl(''),
      designation: new UntypedFormControl(''),
      fromDate: new UntypedFormControl(''),
      toDate: new UntypedFormControl(''),
      ctc: new UntypedFormControl(''),
      employmentType: new UntypedFormControl(''),
      userId: new UntypedFormControl(0),
      screeningComponentId: new UntypedFormControl(0),
    });
  }
  initScreeningMiscellaneousQuestion() {
    return new UntypedFormGroup({
      miscId: new UntypedFormControl(0),
      miscQuestion: new UntypedFormControl(0),
      miscAnswer: new UntypedFormControl(0),
      defaultQuestionFlag: new UntypedFormControl(0)
    });
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
    this.commonService.goToTop();
  }
  getPretStepValue() {
    let stepper;
    if ((this.userData.applicationId === 2) || (this.userData.applicationId === 1 && (this.userData.subTeamName ===
      this.commonService.COMMONSUBCAMTEAM || this.userData.teamName === this.commonService.COMMONCRTTEAM || this.getFrFlag()))) {
      stepper = this.stepper === 4 ? 2 : this.stepper === 3 ? 1 : (this.stepper - 1);
    } else {
      stepper = this.stepper - 1;
    }
    return stepper;
  }

  goToStep(selectedIndex: any) {
    if (selectedIndex === 1) {
      this.employeematch()
    }
    if (this.restrictVeAccess()) {
      // if (selectedIndex > 2) {
      //   if ((this.verificationForm.value.verificationComponentDet.component[0].screeningComponentInfo.compFeeFlag === true) &&
      //     !(this.verificationForm.get('additionalFee')?.value.some(x => x.feeName !== this.commonService.ADDI_FEE))) {
      //     this.showTopCenter('warn', 'Failure Message', 'Atleast add one component fees type');
      //     return;
      //   } else {
      this.stepper = selectedIndex;
      //   }
      // } else {
      //   this.stepper = selectedIndex;
      // }
    } else {
      this.stepper = selectedIndex === 2 ? 3 : selectedIndex === 3 ? 4 : selectedIndex;
    }
    this.stepperChange(selectedIndex);
  }
  // back() {
  //   this.commonService.commonVeFlag = this.verificationService.veType;
  //   if (this.userData.applicationId !== 2)
  //     this.verificationService.globalSearchFlag = false;
  //   if (this.userData.applicationId === 2) {
  //     if (this.verificationService.globalSearchFlag === false) {
  //       this.verificationService.commonCasesFlag;
  //       this.router.navigate(['/dashboard/verification/clientCases']);
  //       this.verificationService.casePriorityLookupId = this.verificationService.searchArray;
  //     }
  //     else {
  //       this.screeningService.getScreeningComponentDet(this.commonService.globalList).subscribe(resp => {
  //         if (resp.length > 0) {
  //           this.master.searchList = resp;
  //           //To bind compname with subCompname and index
  //           this.master.searchList.map(m => m.componentName = (m.componentName != null) ? (this.commonService.getCompNameByIndex((m.componentName +
  //             (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)) : 'N/A');
  //           this.router.navigate(['dashboard/globalSearch']);
  //         }
  //       });
  //     }

  //   } else if (this.getFrFlag()) {
  //     this.commonService.commonFrFlag = this.commonService.commonVeFlag;
  //     this.router.navigate(['dashboard/master/empResearch']);
  //   } else {
  //     if (this.closedFlag === true) {
  //       this.verificationService.closedCheck = false;
  //       //this.router.navigate(['/dashboard/screening/caselist']);
  //       //Redirect to the previous search page
  //       this.screeningService.getScreeningComponentDet(this.commonService.globalList).subscribe(resp => {
  //         if (resp.length > 0) {
  //           this.master.searchList = resp;
  //           //To bind compname with subCompname and index
  //           this.master.searchList.map(m => m.componentName = (m.componentName != null) ? (this.commonService.getCompNameByIndex((m.componentName +
  //             (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)) : 'N/A');
  //           this.router.navigate(['dashboard/globalSearch']);
  //         }
  //       });
  //     }
  //     else {
  //       if (this.commonService.backFlag === true) {
  //         this.screeningService.getScreeningComponentDet(this.commonService.globalList).subscribe(resp => {
  //           if (resp.length > 0) {
  //             this.master.searchList = resp;
  //             this.router.navigate(['dashboard/globalSearch']);

  //           }
  //         });
  //       } else {
  //         if (this.commonService.modifyAdditionalFeeFlag) {
  //           this.router.navigate(['/dashboard/verification/modifyadditionalfee']);
  //         } else if (this.commonService.modifyComponentFeeFlag) {
  //           this.router.navigate(['/dashboard/verification/modifycomponentfee']);
  //         } else {
  //           this.router.navigate(['/dashboard/verification/verification']);
  //         }

  //       }
  //       this.verificationService.caseDetailFlag = false;
  //       this.verificationService.backFlag = true;
  //       this.commonService.VE = false;
  //     }
  //   }
  // }

  back() {
    this.commonService.commonVeFlag = this.verificationService.veType;

    if (this.userData.applicationId !== 2) {
      this.verificationService.globalSearchFlag = false;
    }

    if (this.userData.applicationId === 2) {

      if (this.verificationService.globalSearchFlag === false) {

        this.verificationService.commonCasesFlag;
        this.router.navigate(['/dashboard/verification/clientCases']);
        this.verificationService.casePriorityLookupId = this.verificationService.searchArray;

      } else {

        this.screeningService.getScreeningComponentDet(this.commonService.globalList)
          .subscribe((resp: any[]) => {   // âœ… FIX TYPE

            if (resp && resp.length > 0) {

              this.master.searchList = resp;

              this.master.searchList = this.master.searchList.map((m: any) => { // âœ… FIX TYPE

                const compName = m.componentName ?? 'N/A'; // âœ… NULL FIX

                m.componentName = compName !== 'N/A'
                  ? this.commonService.getCompNameByIndex(
                    compName + (m.subCompName ? (' - ' + m.subCompName) : ''),
                    m.compIndex,
                    m.compMaxNo,
                    m.subCompMaxNo
                  )
                  : 'N/A';

                return m;
              });

              this.router.navigate(['dashboard/globalSearch']);
            }
          });
      }

    } else if (this.getFrFlag()) {

      this.commonService.commonFrFlag = this.commonService.commonVeFlag;
      this.router.navigate(['dashboard/master/empResearch']);

    } else {

      if (this.closedFlag === true) {

        this.verificationService.closedCheck = false;

        this.screeningService.getScreeningComponentDet(this.commonService.globalList)
          .subscribe((resp: any[]) => {

            if (resp && resp.length > 0) {

              this.master.searchList = resp;

              this.master.searchList = this.master.searchList.map((m: any) => {

                const compName = m.componentName ?? 'N/A';

                m.componentName = compName !== 'N/A'
                  ? this.commonService.getCompNameByIndex(
                    compName + (m.subCompName ? (' - ' + m.subCompName) : ''),
                    m.compIndex,
                    m.compMaxNo,
                    m.subCompMaxNo
                  )
                  : 'N/A';

                return m;
              });

              this.router.navigate(['dashboard/globalSearch']);
            }
          });

      } else {

        if (this.commonService.backFlag === true) {

          this.screeningService.getScreeningComponentDet(this.commonService.globalList)
            .subscribe((resp: any[]) => {

              if (resp && resp.length > 0) {

                this.master.searchList = resp;
                this.router.navigate(['dashboard/globalSearch']);
              }
            });

        } else {

          if (this.commonService.modifyAdditionalFeeFlag) {
            this.router.navigate(['/dashboard/verification/modifyadditionalfee']);

          } else if (this.commonService.modifyComponentFeeFlag) {
            this.router.navigate(['/dashboard/verification/modifycomponentfee']);

          } else {
            this.router.navigate(['/dashboard/verification/verification']);
          }
        }

        this.verificationService.caseDetailFlag = false;
        this.verificationService.backFlag = true;
        this.commonService.VE = false;
      }
    }
  }

  getFrFlag() {
    return this.commonService.commonVeFlag === 'Approval Pending' || this.commonService.commonVeFlag === 'For Research' || this.commonService.commonVeFlag === 'Rejected';
  }
  /* For Ui  */
  showControls(data: any) {
    if (data === 'document_SubType') {
      this.isviewddldoctype = true;
    }
  }
  getPaymentMode() {
    this.verificationService.getPaymentModeList().subscribe(resp => {
      this.paymentModeList = resp;
    });
  }
  getCommunicationMode() {
    this.verificationService.getCommunicationModeList().subscribe(resp => {
      this.communicationList = resp;
    });
  }
  /*  For Ui End */
  getVerificationDetails() {
    this.verificationService.getVerificationDetails(this.verificationDetails).subscribe((res: any) => {
      if (res) {

        if (!res.empInsMasterDet) { res.empInsMasterDet = {}; }

        if (res.institutionFees === null) {
          this.verificationForm.removeControl('institutionFees');
        }

        this.verificationForm.patchValue(res);

        if (res.payment) { this.paymentDetails = res.payment; }
        if (res.communication) { this.communicationDetails = res.communication; }
        if (res.overrideFee) { this.overrideFeeDetails = res.overrideFee; }

        if (res.screeningEmpandEduVm != null &&
          this.verificationForm.value?.verificationScreeningDet?.clientCategoryId !== 2) {

          this.alertCommand = res.screeningEmpandEduVm.overlapComment ?? '';
          this.messages = this.alertCommand.split('--').map((m: string) => m.trim());
        }

        // âœ… FIXED (no direct value mutation)
        this.verificationForm.get('verificationScreeningDet?.clientName')
          ?.setValue(res.verificationScreeningDet?.clientName);

        this.verificationService.digiLockerCallUrl = res.digiLockerCallUrl;

        const component = res.responseDocument?.component ?? [];

        const componentType =
          res.responseDocument?.componentType === 'Criminal-Federal Nationwide 5 Years'
            ? 'abroadComp'
            : res.responseDocument?.componentType === 'cRC'
              ? 'crc'
              : res.responseDocument?.componentType;

        if (!componentType) {
          this.openDialog(
            'You Cannot Perform Verification at this time. The Component is Under Construction.',
            'Alert',
            'redirect',
            this.alertCommand,
            this.verificationForm.value?.verificationScreeningDet?.clientCategoryId
          );
          return;
        }

        const reportDetFlag = componentType + 'ReportDet';
        const applicantDetFlag = componentType + 'ApplicantDet';
        const reportContactFlag = componentType + 'ReportContact';

        if (component.length > 0) {
          if (component[0]?.[reportDetFlag]) {
            component[0][reportDetFlag][reportContactFlag] =
              component[0][reportDetFlag][reportContactFlag] ?? [];
          }
        }

        if (component.length > 0 &&
          component[0]?.[reportDetFlag]?.caseDetailFlag === true) {
          this.verificationService.caseDetailFlag = true;
        }

        // âœ… ALL FIXED (no ['controls'])
        this.verificationForm.get('responseDocument.component.displayCaption')
          ?.setValue(component.length > 0 ? component[0].displayCaption : []);

        this.displayCaption =
          this.verificationForm.get('responseDocument.component.displayCaption')?.value;

        this.verificationForm.get('responseDocument.component.applicantDetail')
          ?.patchValue(component.length > 0 ? component[0][applicantDetFlag] : []);

        this.verificationForm.get('responseDocument.component.reportDetail')
          ?.patchValue(component.length > 0 ? component[0][reportDetFlag] : []);

        this.verificationForm.get('responseDocument.component.reportContact')
          ?.patchValue(component.length > 0 ? component[0][reportDetFlag]?.[reportContactFlag] : []);

        // âœ… FORM ARRAY SAFE CAST
        const docFormGroup = this.verificationForm.get(
          'verificationResponseDocument.responseFileDocument.document'
        ) as UntypedFormArray;

        this.createDocForm(docFormGroup,
          res.verificationResponseDocument?.responseFileDocument?.document,
          0);

        const docFormGroup1 = this.verificationForm.get(
          'verificationResponseDocument.receivedInfoDocument.document'
        ) as UntypedFormArray;

        this.createDocForm(docFormGroup1,
          res.verificationResponseDocument?.receivedInfoDocument?.document,
          res.verificationTransBindDet?.receivedInfoDocLookupId);

        const docFormGroup2 = this.verificationForm.get(
          'verificationResponseDocument.receivedResponseDocument.document'
        ) as UntypedFormArray;

        this.createDocForm(docFormGroup2,
          res.verificationResponseDocument?.receivedResponseDocument?.document,
          res.verificationTransBindDet?.receivedConfirmLookupId);

        const docFormGroup3 = this.verificationForm.get(
          'verificationResponseDocument.reOpenResponseDocument.document'
        ) as UntypedFormArray;

        this.createDocForm(docFormGroup3,
          res.verificationResponseDocument?.reOpenResponseDocument?.document,
          res.verificationTransBindDet?.receivedConfirmLookupId);

        this.verificationForm.patchValue(res);

        this.verificationForm.get('verificationScreeningDet?.clientCategoryId')
          ?.setValue(res.verificationScreeningDet?.clientCategoryId);

        this.verificationService.tempData = this.commonService.CloneObject(res);

        this.sharedService.emitNameChange({
          name: this.verificationService.tempData?.commentsFollowUp?.[0]?.enteredBy
        });

        if (this.verificationService.tempData?.empInsMasterDet?.empFlag ||
          this.verificationService.tempData?.responseDocument?.componentType === 'employee') {

          this.incorporationDate =
            this.commonService.getTimezoneOffset(res.screeningCandidateDet?.incorporationDate, false);

          this.caseInitiationDate =
            this.commonService.getTimezoneOffset(res.screeningCandidateDet?.caseInitiationDate, false);

          this.DomaincreationDate =
            this.commonService.getTimezoneOffset(res.screeningCandidateDet?.domainCreatedDate, false);

          this.DateofJoin =
            this.commonService.getTimezoneOffset(res.screeningCandidateDet?.dateofJoin, false);
        }

        // âœ… ALERT LOGIC SAFE
        if (this.verificationService.tempData?.empInsMasterDet?.forResearchFlag &&
          this.verificationService.tempData?.verificationScreeningDet?.manualFileSubmissionFlag !== true) {

          this.msg = this.verificationService.tempData.empInsMasterDet.empFlag
            ? `Please note, Employer name (${this.verificationService.tempData.empInsMasterDet.name}) is in under For Research.`
            : `Please note, Institution name (${this.verificationService.tempData.empInsMasterDet.name}) is in under For Research.`;

          this.openDialog(this.msg, 'Alert', null, this.alertCommand,
            this.verificationForm.value?.verificationScreeningDet?.clientCategoryId);

        } else if (this.verificationService.tempData?.empInsMasterDet?.forFakeFlag) {

          this.msg = this.verificationService.tempData.empInsMasterDet.empFlag
            ? `Please note, Employer name (${this.verificationService.tempData.empInsMasterDet.name}) is in Fake List.`
            : `Please note, Institution name (${this.verificationService.tempData.empInsMasterDet.name}) is in Fake List.`;

          this.openDialog(this.msg, 'Alert', null, this.alertCommand,
            this.verificationForm.value?.verificationScreeningDet?.clientCategoryId);
        }

        // âœ… SET VALUES SAFE
        this.verificationForm.get('screeningStatus.createdUserId')?.setValue(this.userData.userId);
        this.verificationForm.get('verificationResponseDocument.responseFileDocument.createdUserId')?.setValue(this.userData.userId);
        this.verificationForm.get('verificationResponseDocument.receivedInfoDocument.createdUserId')?.setValue(this.userData.userId);
        this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.createdUserId')?.setValue(this.userData.userId);
        this.verificationForm.get('verificationResponseDocument.reOpenResponseDocument.createdUserId')?.setValue(this.userData.userId);

        // âœ… FLAGS
        const receivedDocs = this.verificationForm.get('verificationResponseDocument.receivedResponseDocument.document')?.value || [];

        this.verificationService.recivedDocument = receivedDocs.length > 0;

        this.verificationService.screeningStatusId =
          this.verificationForm.get('screeningStatus.screeningStatusId')?.value;

        this.commonService.checkScreeningStatusIsClose(
          this.verificationForm,
          res.verificationTransBindDet?.status,
          this.verificationForm.get('screeningStatus.screeningStatusId')?.value
        );

        if (this.verificationForm.get('paymentFlag')?.value === true) {
          this.getPaymentMode();
          this.getCommunicationMode();
        }

        this.generateFlag =
          res.verificationResponseDocument?.receivedResponseDocument?.document
            ?.some((x: any) => x.annexDocFlag === true) ?? false;

        // âœ… ALERT POPUP
        if (res.screeningEmpandEduVm &&
          this.verificationForm.value?.verificationScreeningDet?.clientCategoryId !== 2) {

          if (!this.alertFlagMsg && !this.alertFlag && res.screeningEmpandEduVm.overlapComment) {
            this.headerText = 'Alert !';
            this.messageText = res.screeningEmpandEduVm.overlapComment;

            this.dialog.open(this.DateAlertPopUp, {
              width: '500px',
              disableClose: true
            });
          }
        }
      }
    });
  }
  createDocForm(formArray: UntypedFormArray, docData: any, docTypeId: any) {
    for (let e = 0; docData.length > e; e++) {
      formArray.push(this.initScreeningDocForm());
    }
  }
  // public openDialog(msg: string, header: string, action?: any, alertCommand?: any) {
  //   if (msg == undefined || msg == '') {
  //     this.checkDate(action);
  //   } else {
  //     this.alertFlag = true;
  //     const popupData = {
  //       action: header === 'Alert' ? this.commonService.ALERT : this.commonService.DELETECONFIRMATION,
  //       headerText: header,
  //       bodyText: msg
  //     };
  //     const dialogRef = this.dialog.open(CommonAlertsComponent, {
  //       width: '320px',
  //       data: popupData,
  //       disableClose: true
  //     });
  //     if (dialogRef) {
  //       dialogRef.afterClosed().subscribe(result => {
  //         // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation
  //         if (alertCommand) {
  //           this.headerText = 'Alert !',
  //           this.messageText = alertCommand;           
  //           const dialogRef = this.dialog.open(this.DateAlertPopUp, {
  //             width: '500px',
  //             disableClose: true
  //           });
  //         }
  //         // end
  //         if (this.count < 2) {
  //           this.checkDate(action)
  //         }
  //         if (action === 'redirect') {
  //           this.router.navigate(['dashboard/verification/verification']);
  //         }
  //       });
  //     }
  //   }
  // }
  public openDialog(msg: string, header: string, action?: any, alertCommand?: any, clientCategoryId?: any) {
    if (msg == undefined || msg == '') {
      if (clientCategoryId !== 2 && alertCommand != null) {
        this.alertFlagMsg = true;
        this.checkDate(action, alertCommand, clientCategoryId);
      } else {
        this.checkDate(action);
      }
    } else {
      this.alertFlag = true;
      const popupData = {
        action: header === 'Alert' ? this.commonService.ALERT : this.commonService.DELETECONFIRMATION,
        headerText: header,
        bodyText: msg
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe(result => {
          // VTS2-2023-CRT-0123 , VTS2-2023-CRT-0120 - Edu, Emp overlap and Gap Alert Validation
          if (alertCommand !== "" && alertCommand !== undefined && clientCategoryId !== 2) {
            this.headerText = 'Alert !',
              this.messageText = alertCommand;
            this.openDialogAlert(action);
          }
          // end
          else {
            if (this.count < 2) {
              this.checkDate(action)
            }
          }
          if (action === 'redirect') {
            this.router.navigate(['dashboard/verification/verification']);
          }
        });
      }
    }
  }
  public openDialog1(msg: string, header: string, action?: any, alertCommand?: any, clientCategoryId?: any) {
    if (msg == undefined || msg == '') {
      this.checkDate(action);
    } else {
      const popupData = {
        action: header === 'Alert' ? this.commonService.ALERT : this.commonService.DELETECONFIRMATION,
        headerText: header,
        bodyText: msg
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe(result => {
          if (this.count < 2) {
            this.checkDate(action)
          }
          if (alertCommand !== "" && alertCommand !== undefined && clientCategoryId !== 2) {
            this.headerText = 'Alert !',
              this.messageText = alertCommand;
            const dialogRef = this.dialog.open(this.DateAlertPopUp, {
              width: '500px',
              disableClose: true
            });
          }
          if (action === 'redirect') {
            this.router.navigate(['dashboard/verification/verification']);
          }
        });
      }
    }
  }
  public openDialogAlert(action: any) {
    const dialogRef = this.dialog.open(this.DateAlertPopUp, {
      width: '500px',
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (this.count < 2) {
          this.checkDate(action)
        }
      });
    }
  }
  checkDate(action?: any, alertCommand?: any, clientCategoryId?: any) {
    let msg = '', header = 'Alert';
    var yearDiff = moment(this.caseInitiationDate).diff(moment(this.incorporationDate), 'years');
    if (yearDiff < 5 && (action == false || action == undefined) && yearDiff != 0) {
      msg = 'The date of Incorporation is less than 5 Years.' + ' <br> ' + 'Date of Incorporation: ' + this.dateP.transform(this.incorporationDate, 'dd/MMM/yyyy') +
        ' <br> ' + 'case initiation Date:' + this.dateP.transform(this.caseInitiationDate, 'dd/MMM/yyyy');
      this.count = 1;
      this.openDialog1(msg, header, true, alertCommand, clientCategoryId);
    } else if (this.DomaincreationDate > this.DateofJoin && this.DomaincreationDate != null && this.DateofJoin != null && this.userData
      .teamName !== 'CRTAbroad') {
      // msg = 'The Domain creation Date is less than Date of Joining.' + ' <br> ' + 'Domain creation Date : ' + this.dateP.transform(this.DomaincreationDate, 'dd/MMM/yyyy') +
      //   ' <br> ' + 'Date of Joining:' + this.dateP.transform(this.DateofJoin, 'dd/MMM/yyyy');
      msg = "Domain Disconnect found basis Period of Employment, as the domain creation date  " + this.dateP.transform(this.DomaincreationDate, 'dd/MMM/yyyy') + " is greater than employment starting date " + this.dateP.transform(this.DateofJoin, 'dd/MMM/yyyy');
      this.count = 2;
      this.openDialog1(msg, header, false, alertCommand, clientCategoryId);
    } else {
      this.alertFlagMsg = false;
    }

  }
  GetEmpInsNameBySoundex(empinsId: any, screeningId: any) {
    this.verificationService.getEmpInsNameBySoundex(empinsId, screeningId, this.verificationForm.value.
      empInsMasterDet.empFlag).subscribe(res => {
        if (res) {
          this.empinsFakeList = res;
          if (this.empinsFakeList.length > 0) {
            this.verificationForm.disable();
          }
        }
      });
  }
  public openFakeDailog() {
    this.dialog.open(this.empinsMatchingFake,
      { width: '750px', disableClose: true, });
  }
  fakeListVerified() {
    // const screeningId = this.verificationForm.get('screeningId')?.value;
    // const screeningCompId = this.verificationForm.get('screeningCompId')?.value;
    const screeningCompId = this.verificationForm.get('screeningCompId')?.value ?? 0;
    const screeningId = this.verificationForm.get('screeningId')?.value ?? 0;
    const createdUserId = this.userData.userId;
    this.verificationService.UpdateVerified(screeningId, screeningCompId, createdUserId).subscribe(res => {
      if (res) {
        this.verificationForm.enable();
        this.empinsFakeList = [];
      }
    });
    this.dialog.closeAll();
  }
  getTotalPages(totalRecords: any, rows: any) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo: any, rows: any) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo: any, rowscount: any) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  //redcase
  openPopuprej(Flag: any) {
    this.dialog.open(this.reject,
      { width: '700px', disableClose: true, });
    // if (Flag === true || (Flag === false )) {
    //   const popupData = {
    //     action: this.commonService.DELETECONFIRMATION,
    //     headerText: 'Confirmation',
    //     bodyText: 'Are you sure,Do you want to ' + (Flag === true ? 'approve?' : 'reject?')
    //   };
    //   const dialogRef = this.dialog.open(CommonAlertsComponent, {
    //     width: '320px',
    //     data: popupData,
    //     disableClose: true
    //   });
    //   if (dialogRef) {
    //     dialogRef.afterClosed().subscribe(result => {
    //       if (result) {
    //         const action = String(result.type);
    //         if (action === this.commonService.DELETECONFIRMATION) {
    //           this.approveOrRejectTL(false,true);
    //         }
    //       }
    //     });
    //   }
    // }
  }

  openPopup(Flag: any) {

    if (Flag === true || (Flag === false)) {
      const popupData = {
        action: this.commonService.DELETECONFIRMATION,
        headerText: 'Confirmation',
        bodyText: 'Are you sure,Do you want to ' + (Flag === true ? 'approve?' : 'reject?')
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
      if (dialogRef) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const action = String(result.type);
            if (action === this.commonService.DELETECONFIRMATION) {
              this.approveOrRejectTL(true, false);
            }
          }
        });
      }
    }
  }
  // VTS2-2024-IDE-0213 - Point hold
  // generateDatabaseAnnexure(screeningCompId,loggedIn,clientId)
  // {
  //   this.verificationService.GenerateDatabaseAnnexure(screeningCompId,loggedIn,clientId).subscribe(res => {
  //     if (res) {
  //       this.isRemoveDisabled = true;
  //       this.isGenerateDisabled=false;
  //       this.images =res;
  //       //after save
  //       this.showTopCenter('success', 'Success Message', 'Annexure images added Successfully');
  //     }
  //     else{        
  //         this.showTopCenter('warn', 'Failure Message', 'No images found');
  //     }
  //   });
  // } 
  // removeDatabaseAnnexure(screeningCompId,loggedIn)
  // {
  //   this.isRemoveDisabled = false;
  //   this.isGenerateDisabled=true;
  //   this.verificationService.RemoveDatabaseAnnexure(screeningCompId,loggedIn).subscribe(res => {
  //     if (res) {
  //         this.images =res;
  //         //after remove
  //         this.showTopCenter('success', 'Success Message', 'Annexure images removed Successfully');
  //     }
  //     else{
  //         this.showTopCenter('warn', 'Failure Message', 'Generate annexure images');
  //     }
  //   });
  // }
  approveOrRejectTL(apflag: any, reflag: any) {
    const TlApproveData: VerificationMoveToTl = {
      tLApprovedFlag: apflag == true ? true : false,
      teamName: this.userData.teamName,
      candidateName: this.verificationForm.value['verificationScreeningDet']?.reportCandidateName,
      screeningCompId: this.verificationForm.get('screeningCompId')?.value ?? 0,
      screeningId: this.verificationForm.get('screeningId')?.value ?? 0,
      clientRefNo: this.verificationForm.value['verificationScreeningDet']?.referenceNo,
      clientId: this.verificationForm.value['verificationScreeningDet']?.clientId,
      clientName: this.verificationForm.value['verificationScreeningDet']?.clientName,
      verificationId: 0,
      componentName: this.verificationForm.value['responseDocument'].componentName,
      serviceType: '',
      fees: 0,
      remarks: '',
      applicationId: 0,
      loggedIn: this.userData.userId,
      rejectComments: this.rejectComments.value,
    };

    this.verificationService.TeamLeadApprovedOrRejected(TlApproveData).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success', ((apflag === true ? 'Approved' : 'Rejected') + ' Successfully'));

        this.router.navigate(['dashboard/verification/verification']);
        this.dialog.closeAll();
        // this.getRedCaseDetail();
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed');
      }
    });
  }
  ngOnDestroy(): void {
    if (this.userData.applicationId === 2) {
      this.verificationService.searchArray = undefined;
    }
    this.screeningService.isVerifiactionMode = false;
    this.verificationService.paymentId = 0;
    this.verificationService.isFinalReport = false;
    this.commonService.VE = false;
    this.verificationService.smsDetails = '';
    //this.commonService.commonVeFlag = null;
    this.commonService.backFlag = false;
  }
}

export class VerificationMoveToTl {
  tLApprovedFlag: boolean = false;
  teamName: string = '';
  candidateName: string = '';
  screeningCompId: number = 0;
  screeningId: number = 0;
  clientRefNo: string = '';
  clientId: number = 0;
  clientName: string = '';
  verificationId: number = 0;
  componentName: string = '';
  serviceType: string = '';
  fees: number = 0;
  remarks: string = '';
  applicationId: number = 0;
  rejectComments: string = '';
  loggedIn: number = 0;
}
