import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { AssignScreeningOwnerVm, AssignCaseVm, AssignDEView } from '../../common-methods/models/caseCreationView';
import { CommonService } from 'src/app/common-methods/services/common.service';
// import { Paginator, Table } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ClosedCheckDto, DashboardCountVm } from 'src/app/common-methods/models/login';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Observable, from } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { VerificationDetails } from 'src/app/common-methods/models/verification';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { LazyLoadEvent } from 'primeng/api';
@Component({
  standalone: false,
  selector: 'app-case-created-list',
  templateUrl: './case-created-list.component.html',
  styleUrls: ['./case-created-list.component.css']
})
export class CaseCreatedListComponent implements OnInit {
  first: number = 0;
  Hitemperpage;
  reOpenForm: UntypedFormGroup = new UntypedFormGroup({
    screeningCompId: new UntypedFormControl(null),
    screeningStatusId: new UntypedFormControl(null),
    screeningStatusName: new UntypedFormControl(null),
    createdUserId: new UntypedFormControl(null),
    applicationId: new UntypedFormControl(null),
    statusFromDate: new UntypedFormControl(null),
    statusToDate: new UntypedFormControl(null),
  });
  caseSubmissionList: any[] = [];
  caseExcelSubmissionList: any[] = [];
  caseAssignSubmissionList: any[] = [];
  assignDE = new AssignDEView();
  AssignedDEList: any[] = [];
  userData: any;
  closedCheckData: ClosedCheckDto = new ClosedCheckDto();
  screeningOwnerList: any[] = [];
  dialogRef: any;
  ownerGroup: UntypedFormGroup = new UntypedFormGroup({});
  assignScreeningOwner = new AssignScreeningOwnerVm();
  assignCase: AssignCaseVm[] = [];
  scope: AssignCaseVm;
  dashboardCountVm = new DashboardCountVm();
  viewflag: boolean;
  checkflag: boolean;
  selected: string;
  ownerflag = false;
  assignflag = false;
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  @ViewChild('paginators', { static: true }) paginators;
  reflist: any[] = [];
  clientReferenceNo;
  dashboardsearch;
  subTeamName: string;
  index: number;
  status = 'Not Assigned';
  screeningOwnerId = new UntypedFormControl();
  selectall = new UntypedFormControl();
  menubar = [{ menuName: 'Not Assigned' }, { menuName: 'Assigned' }];
  menubarUser = [{ menuName: 'Assigned' }];
  dataSource: any;
  pageSize = 5;
  currentPage = 1;
  totalSize = 0;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  applypaging = true;
  excelCancallList: any;
  excelCloseList: any;
  excelFRRejectlList: any;
  excelVRRejectlList: any;
  excelReopenList: any;
  excelQCRejectList: any;
  componentControl!: AutoCompleteDropDown;
  caseRefNoControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  clientNameControl!: AutoCompleteDropDown;
  delayHoursControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  empInsControl!: AutoCompleteDropDown;
  ownerControl!: AutoCompleteDropDown;
  priorityControl!: AutoCompleteDropDown;
  screeningControl!: AutoCompleteDropDown;
  filterOwnerName = new UntypedFormControl();
  qcUserId: any;
  clientList: any;
  veOwnerList: any;
  vendorList: any;
  componentList: any;
  statusList: any;
  userList: any;
  qualityCheckBindList: any;
  isDesc: boolean;
  column: any;
  direction: number;
  searchValueArr: any[] = [];
  itemPerPage: any[] = [];
  page = [1, 1];
  showdSearch = true;
  clientRefNoList: any[] = [];
  searchcandidateList: any[] = [];
  ownerNameList: any;
  priorityList: any;
  screeningIdList: any;
  tabIndex = 0;
  count = 0;
  // tslint:disable-next-line:variable-name
  show_Search = true;
  hideToggle;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  array: any;
  qcSearchForm: UntypedFormGroup = new UntypedFormGroup({
    clientName: new UntypedFormControl(null),
    clientRefNo: new UntypedFormControl(null),
    candidateName: new UntypedFormControl(null),
    empInsName: new UntypedFormControl(null),
    compName: new UntypedFormControl(null),
    vendorName: new UntypedFormControl(null),
    statusName: new UntypedFormControl(null),
    ownerName: new UntypedFormControl(null),
    receivedFromDate: new UntypedFormControl(null),
    receivedToDate: new UntypedFormControl(null),
    assignStatus: new UntypedFormControl(null),
    appScreeningID: new UntypedFormControl(null),
    priorityLookupName: new UntypedFormControl(null)
  });
  caseSearchForm: UntypedFormGroup = new UntypedFormGroup({
    caseRefNo: new UntypedFormControl(null),
    clientName: new UntypedFormControl(null),
    compName: new UntypedFormControl(null),
    statusName: new UntypedFormControl(null),
    screeningId: new UntypedFormControl(null)
  });
  candidateList: { candidateFullName: any; }[];
  verificationIdList: { verificationId: any; }[];
  clientReferenceIdList: { clientRefNo: any; }[];
  routePath = 'Screening / Clients File Submission / File Submission';
  @Input() filterLength: number;
  showFlag: boolean;
  breadcrumbFlags: any;
  historyFlag: boolean;
  @ViewChild('global', { static: true }) global!: ElementRef;
  totalpages: number;
  totalpages1: number;
  currentPage1 = 1;
  tempCurrentPage = 1;
  tempCurrentPage1 = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('dtHistory', { static: true }) dtHistory!: Table;
  clientReferenceNoFormCtrl = new UntypedFormControl();
  clientReferenceNoFilteredOptions: Observable<string[]>;
  @ViewChild('clientReferenceNoTrigger', { static: true }) clientReferenceNoTrigger: MatMenuTrigger;
  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions: Observable<string[]>;
  @ViewChild('submittedbyTrigger', { static: true }) submittedbyTrigger: MatMenuTrigger;
  submittedbyFormCtrl = new UntypedFormControl();
  submittedbyFilteredOptions: Observable<string[]>;
  @ViewChild('assignedownerTrigger', { static: true }) assignedownerTrigger: MatMenuTrigger;
  assignedownerFormCtrl = new UntypedFormControl();
  assignedownerFilteredOptions: Observable<string[]>;
 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  applicantIdFormCtrl = new UntypedFormControl();
  applicantIdFilteredOptions: Observable<string[]>;
  @ViewChild('applicantIdTrigger', { static: true }) applicantIdTrigger: MatMenuTrigger;
  candidateNameFormCtrl = new UntypedFormControl();
  candidateNameFilteredOptions: Observable<string[]>;
  @ViewChild('candidateNameTrigger', { static: true }) candidateNameTrigger: MatMenuTrigger;
  remarksFormCtrl = new UntypedFormControl();
  remarksFilteredOptions: Observable<string[]>;
  @ViewChild('siteNameTrigger', { static: true }) siteNameTrigger: MatMenuTrigger;
  siteFormCtrl = new UntypedFormControl();
  siteFormCtrlFilteredOptions: Observable<string[]>;
  @ViewChild('caseInitiationTrigger', { static: true }) caseInitiationTrigger: MatMenuTrigger;
  caseInitiationCtrl = new UntypedFormControl();
  caseInitiationFilteredOptions: Observable<string[]>;
  @ViewChild('componentNameTrigger', { static: true }) componentNameTrigger: MatMenuTrigger;
  componentNameControl = new UntypedFormControl();
  componentNameFilteredOptions: Observable<string[]>;
  @ViewChild('crtNameTrigger', { static: true }) crtNameTrigger: MatMenuTrigger;
  crtNameControl = new UntypedFormControl();
  crtNameFilteredOptions: Observable<string[]>;
  componentStatusFormCtrl = new UntypedFormControl();
  componentStatusFilteredOptions: Observable<string[]>;
  @ViewChild('componentStatusTrigger', { static: true }) componentStatusTrigger: MatMenuTrigger;
  reasonForDelayFormCtrl = new UntypedFormControl();
  reasonForDelayFilteredOptions: Observable<string[]>;
  @ViewChild('reasonForDelayTrigger', { static: true }) reasonForDelayTrigger: MatMenuTrigger;
  historyList: any[] = [];
  fromDate = '';
  toDate = '';
  fromDateSub = '';
  toDateSub = '';
  event: LazyLoadEvent;
  virtualDatabase: any;
  loading: boolean;
  historycolumns = [
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientRefNo', header: 'Client Ref No' },
    { field: 'applicantId', header: 'Applicant Id' },
    { field: 'cam', header: 'Client Account Manager' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'colorCode', header: 'Color Code' },
    { field: 'requestDate', header: 'Case Initiation Date' },
    { field: 'componentDueDate', header: 'Component DueDate' },
    { field: 'tatDays', header: 'TAT Days' },
    { field: 'closedStatus', header: 'TAT Status' },
    { field: 'inProgressDays', header: 'In Progress Days' },
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'screeningOwnerName', header: 'Screening Owner Name' },
    { field: 'submissionOwnerName', header: 'Submission Name' },
    { field: 'caseStatus', header: 'Status' },
    { field: 'ClientScreeningId', header: 'Screening Id' }
  ];
  caseColumn = [
    { field: 'candidateFirstName', header: 'Candidate First Name' },
    { field: 'candidateMiddleName', header: 'Candidate Middle Name' },
    { field: 'candidateLastName', header: 'Candidate Last Name' },
    { field: 'clientReferenceNo', header: 'Client Reference No' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'applicantId', header: 'Applicant Id' },
    { field: 'appScreeningID', header: 'Screening Id' },
    { field: 'chargeCode', header: 'Charge Code' },
    { field: 'screeningOwnerFName', header: 'Owner Name' },
    { field: 'preQCScreenOwnerName', header: 'PreQC Owner' },
    { field: 'deAssignedBy', header: 'Assigned By' },
    { field: 'caseCreatedDate', header: 'Case Created Date' },
    { field: 'scopeSubmittedDate', header: 'Scope Submitted Date' },
    { field: 'caseReceivedDate', header: 'Received Date & Time' },
    { field: 'caseInititationDate', header: 'Case Initiation Date' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'urlName', header: 'Doc Path' }];
  //Added By Megala For -VTS2-2024-EMP-0189 sprint 16
  caseRejectColumn = [
    { field: 'candidateFirstName', header: 'Candidate First Name' },
    { field: 'candidateMiddleName', header: 'Candidate Middle Name' },
    { field: 'candidateLastName', header: 'Candidate Last Name' },
    { field: 'clientReferenceNo', header: 'Client Reference No' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'applicantId', header: 'Applicant Id' },
    { field: 'appScreeningID', header: 'Screening Id' },
    { field: 'chargeCode', header: 'Charge Code' },
    { field: 'screeningOwnerFName', header: 'Owner Name' },
    { field: 'preQCScreenOwnerName', header: 'PreQC Owner' },
    { field: 'deAssignedBy', header: 'Assigned By' },
    { field: 'caseCreatedDate', header: 'Case Created Date' },
    { field: 'scopeSubmittedDate', header: 'Scope Submitted Date' },
    { field: 'caseReceivedDate', header: 'Received Date & Time' },
    { field: 'caseInititationDate', header: 'Case Initiation Date' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'urlName', header: 'Doc Path' },
    { field: 'rejectRemark', header: 'Rejection Comments' },
  ];
  rejectColumn = [
    { field: 'firstName', header: 'Candidate First Name' },
    { field: 'middleName', header: 'Candidate Middle Name' },
    { field: 'lastName', header: 'Candidate Last Name' },
    { field: 'clientReferenceNo', header: 'Client Reference No' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'compName', header: 'Component Name' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'caseReceivedDate', header: 'Received Date & Time' },
    { field: 'preQCScreenOwnerName', header: 'PreQC Owner Name' },
    { field: 'deOwnerName', header: 'De Owner Name' },
    { field: 'ownerName', header: 'Screening Owner' },
    { field: 'rejectDate', header: 'Reject Date & Time' },
    { field: 'caseStatus', header: 'Case Status' },
    { field: 'clientScreeningId', header: 'Screening Id' },
  ];

  qcRejectColumn = [
    { field: 'firstName', header: 'Candidate First Name' },
    { field: 'middleName', header: 'Candidate Middle Name' },
    { field: 'lastName', header: 'Candidate Last Name' },
    { field: 'clientReferenceNo', header: 'Client Reference No' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'compName', header: 'Component Name' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'caseReceivedDate', header: 'Received Date & Time' },
    { field: 'preQCScreenOwnerName', header: 'PreQC Owner Name' },
    { field: 'deOwnerName', header: 'De Owner Name' },
    { field: 'ownerName', header: 'Screening Owner' },
    { field: 'rejectDate', header: 'Reject Date & Time' },
    { field: 'caseStatus', header: 'Case Status' },
    { field: 'clientScreeningId', header: 'Screening Id' },
    { field: 'rejectRemark', header: 'Rejection Comments' },];

  caseStatusFormCtrl = new UntypedFormControl();
  caseStatusFilteredOptions: Observable<string[]>;
  @ViewChild('caseStatusTrigger', { static: true }) caseStatusTrigger: MatMenuTrigger;
  qcOwnerFormCtrl = new UntypedFormControl();
  qcOwnerFilteredOptions: Observable<string[]>;
  @ViewChild('qcOwnerTrigger', { static: true }) qcOwnerTrigger: MatMenuTrigger;
  screeningOwnerNameFormCtrl = new UntypedFormControl();
  screeningOwnerNameFilteredOptions: Observable<string[]>;
  @ViewChild('screeningOwnerNameTrigger', { static: true }) screeningOwnerNameTrigger: MatMenuTrigger;
  @ViewChild('requestDateTrigger', { static: true }) requestDateTrigger: MatMenuTrigger;
  @ViewChild('submittedDateTrigger', { static: true }) submittedDateTrigger: MatMenuTrigger;
  verificationDetails: VerificationDetails = new VerificationDetails();
  closedCase = false;
  duplist: any[] = [];

  //Added for VTS2-2024-ADD-0229 by Madasamy - START
  clientChkControl!: AutoCompleteDropDown;
  ownerChkControl!: AutoCompleteDropDown;
  closeCheckForm: UntypedFormGroup = new UntypedFormGroup({
    clientName: new UntypedFormControl(null),
    submittedFromDate: new UntypedFormControl(null),
    submittedToDate: new UntypedFormControl(null),
    clientRefNo: new UntypedFormControl(null),
    verificationId: new UntypedFormControl(null),
    screeningOwnerName: new UntypedFormControl(null)
  });
  //Added for VTS2-2024-ADD-0229 by Madasamy - END
  maxDate = new Date();
  constructor(public screeningService: ScreeningService, private message: MessageService,
    private route: Router, private verificationService: VerificationService, public dialog: MatDialog, public common: CommonService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.GetScreeningOwner();
    this.initFormGroup();
    this.initCaseFormGroup();
    this.initreOpenFormGroup();
    this.mapUserDataToClosedData();
    this.initCloseFormGroup();//Added for VTS2-2024-ADD-0229 by Madasamy - START
    this.initDefCloseCheck();
    if (this.screeningService.caseFlagType === this.common.SUBMISSION_HISTORY || this.screeningService.caseFlagType === 'preQcSubHistory') {
      this.userData.SubmissionFlag = this.screeningService.flagType;
      this.showHistory(this.screeningService.flagType);
    }
    // else if (this.screeningService.caseFlagType === this.common.BT_POPUP) {
    //   this.tatdaysdelaylist();
    // } else if (this.screeningService.caseFlagType === this.common.WT_POPUP) {
    //   this.wTtatdayslist();
    // } else if (this.screeningService.caseFlagType === this.common.NT_POPUP) {
    //   this.ntatdayslist();
    // } else if (this.screeningService.caseFlagType === this.common.CT_POPUP) {
    //   this.ctatdayslist();
    // }
    if ((this.userData.teamName === 'DEPre-QC' || (this.userData.subTeamLeadFlag === true &&
      this.userData.teamName === 'CTS-SubmissionTeam')) && this.screeningService.caseFlagType === this.common.PREQCCASE) {
      this.screeningService.caseFlag = false;
      this.screeningService.caseFlagType = this.common.PREQCCASE;
    }
    if (this.screeningService.caseFlag === true) {
      this.assignDE.needTotal = true;
      this.getAssignedCaseDetails('NotAssigned');
      this.caseSubmissionList = this.AssignedDEList.slice(0, this.pageSize);
    } else {
      if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
        // this.menubar = this.menubarUser;

        this.getPreQcCaseDetails('NotAssigned');
      } else if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
        // this.menubar = this.menubarUser;
        this.getPreQCRejectScreeningDetails('NotAssigned');
      } else if (this.screeningService.caseFlagType === this.common.QCREJECT) {
        this.getScreeningQCRejectComponentDetails();
      } else if (this.screeningService.caseFlagType === this.common.NOTAPPLICABLE) {
        this.getNotApplicapleComponentDetails();
      } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
        this.getScreeningVERejectComponentDetails();
      } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
        this.GetReopenComponentDetails();
      } else if (this.screeningService.caseFlagType === this.common.CLOSED) {
        this.getClosedComponentDetails();
      } else if (this.screeningService.caseFlagType === this.common.SUBCHECK) {
        this.getSubcheckDetails('NotAssigned');
      } else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
        this.getDASubcheckDetails('NotAssigned');
      } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
        this.getScreeningFRRejectComponentDetails();
      }
    }
    this.itemPerPage = [10, 10];
    this.Hitemperpage = 10;
    this.screeningService.StatusDeFlag = true;
    //Add Extra column for closed check  Megala 21/10/23
    if (this.screeningService.caseFlagType === this.common.VE_HISTORY) {
      this.historycolumns.pop();
      this.historycolumns.splice(8, 0, { field: 'componentStatus', header: 'Component Status' });
      this.historycolumns.splice(14, 0, { field: 'reasonForDelay', header: 'Reason For Delay' });
      this.historycolumns.splice(11, 0, { field: 'submittedDate', header: 'Closed Date & Time' });
      this.historycolumns.splice(20, 0, { field: 'qcOwner', header: 'QC Owner' });
      this.historycolumns.splice(12, 0, { field: 'componentDueDate', header: 'Actual Due Date' });

    }
  }
  toggle(data: any) {
    this.show_Search = !this.show_Search;
    if (this.show_Search) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }
  ngOnDestroy() {
    this.screeningService.flagType = true;
    this.applypaging = true;
  }
  
  // public handlePage(e: any) {
  //   this.currentPage = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.iterator();
  // }
  initCaseFormGroup() {
    this.caseSearchForm = new UntypedFormGroup({
      caseRefNo: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      statusName: new UntypedFormControl(null),
      screeningId: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  //Added for VTS2-2024-ADD-0229 by Madasamy - START
  initCloseFormGroup() {
    this.closeCheckForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      submittedFromDate: new UntypedFormControl(null),
      submittedToDate: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      screeningOwnerName: new UntypedFormControl(null)
    });
    this.initAutoCompleteCheck();
  }

  initAutoCompleteCheck() {
    this.clientChkControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', [], '', this.closeCheckForm, false, false, false, 'standard');
    this.ownerChkControl = new AutoCompleteDropDown('Screening Owner Name', 'screeningOwnerName', 'id', 'name', [], '', this.closeCheckForm, false, false, false, 'standard');
  }

  initDefCloseCheck() {
    this.mapUserDataToClosedData();
    this.screeningService.GetCaseClosedByVEOwner(this.closedCheckData).subscribe(res => {
      if (res) {
        this.veOwnerList = res;
        //this.clientChkControl.items = this.veOwnerList;
        this.ownerChkControl = new AutoCompleteDropDown('Screening Owner Name', 'screeningOwnerName', 'id', 'name', this.veOwnerList, '', this.closeCheckForm, false, false, false, 'standard');
      }
    });

    this.screeningService.getClients(this.userData).subscribe(res => {
      if (res) {
        this.clientList = res;
     //   this.clientChkControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.clientList, '', this.closeCheckForm, false, false, false, 'standard');
        //this.clientChkControl.items = this.clientList;
      }
    });

  }

  initreOpenFormGroup() {
    this.reOpenForm = new UntypedFormGroup({
      screeningCompId: new UntypedFormControl(null),
      screeningStatusId: new UntypedFormControl(null),
      screeningStatusName: new UntypedFormControl(null),
      createdUserId: new UntypedFormControl(null),
      applicationId: new UntypedFormControl(null),
      statusFromDate: new UntypedFormControl(null),
      statusToDate: new UntypedFormControl(null),
    });
  }
  //Added for VTS2-2024-ADD-0229 by Madasamy - END
  initFormGroup() {
    this.qcSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateName: new UntypedFormControl(null),
      empInsName: new UntypedFormControl(null),
      compName: new UntypedFormControl(null),
      vendorName: new UntypedFormControl(null),
      statusName: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      receivedFromDate: new UntypedFormControl(null),
      receivedToDate: new UntypedFormControl(null),
      assignStatus: new UntypedFormControl(null),
      appScreeningID: new UntypedFormControl(null),
      priorityLookupName: new UntypedFormControl(null)
    });
    this.initautoCompleteCtrl();
  }
  // Added By Megala - For Filter api call 06/05/2024
  searchCase() {
    if (this.qcSearchForm.valid) {
      if (this.qcSearchForm.value.clientName || this.qcSearchForm.value.clientRefNo
        || this.qcSearchForm.value.candidateName || this.qcSearchForm.value.appScreeningID
        || this.qcSearchForm.value.statusName || this.qcSearchForm.value.priorityLookupName || this.qcSearchForm.value.ownerName) {
        this.shievePageNo = 1;
        this.userData.filters = '';
        if (this.ownerflag !== true) {
          if (this.index === 1) {
            if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
              this.getPreQcCaseDetails('Assigned');
            }
            else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
              this.getDASubcheckDetails('Assigned');
            } else {
              this.getAssignedCaseDetails('Assigned');
            }
          }
          else {
            if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
              this.getPreQcCaseDetails('Not Assigned');
            }
            else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
              this.getDASubcheckDetails('Not Assigned');
            } else {
              this.getAssignedCaseDetails('Not Assigned');
            }
          }
        } else {
          if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
            this.getPreQcCaseDetails('Assigned');
          }
          else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
            this.getDASubcheckDetails('Assigned');
          } else {
            this.getAssignedCaseDetails('Assigned');
          }
        }

      } else {
        this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
      }
    }


  }
  initautoCompleteCtrl() {
    this.componentControl = new AutoCompleteDropDown('Component Name', 'compName', 'compName', 'compName', this.componentList,
      '', this.qcSearchForm, false, false, false, 'standard');
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientName', 'clientName', this.clientList,
      '', this.qcSearchForm, false, false, false, 'standard');
    this.statusControl = new AutoCompleteDropDown('Status Name', 'statusName', 'caseStatus', 'caseStatus', this.statusList,
      '', this.qcSearchForm, false, false, false, 'standard');
    this.caseRefNoControl = new AutoCompleteDropDown('Case Ref No.', 'clientRefNo', 'clientReferenceNo', 'clientReferenceNo',
      this.clientRefNoList, '', this.qcSearchForm, false, false, false, 'standard');
    this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'candidateFullName',
      'candidateFullName', this.searchcandidateList, '', this.qcSearchForm, false, false, false, 'standard');
    this.ownerControl = new AutoCompleteDropDown('Screening Owner Name', 'ownerName', 'ownerName',
      'ownerName', this.ownerNameList, '', this.qcSearchForm, false, false, false, 'standard');

    this.screeningControl = new AutoCompleteDropDown('Screening Id', 'appScreeningID', 'appScreeningID',
      'appScreeningID', this.screeningIdList, '', this.qcSearchForm, false, false, false, 'standard');

    this.priorityControl = new AutoCompleteDropDown('Screening Priority', 'priorityLookupName', 'priorityLookupName',
      'priorityLookupName', this.priorityList, '', this.qcSearchForm, false, false, false, 'standard');

  }
  getFilterLen(c): string {
    this.filterLength = c;
    return 'listrow';
  }
  getAssignedCaseDetails(caseStatus: any) {
    const screenid1: any[] = [];
    if (this.screeningService.caseFlag === true) {
      this.assignDE.userId = this.userData.userId;
      this.assignDE.deptId = this.userData.deptId;
      this.assignDE.teamId = this.userData.teamId;
      this.assignDE.subTeamId = this.userData.subTeamId;
      this.assignDE.teamName = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team') ? this.userData.team : this.userData.teamName;
      this.assignDE.subTeamName = this.userData.subTeamName;
      this.assignDE.caseNo = 0;
      this.assignDE.caseStatus = caseStatus;
      this.assignDE.applicationId = this.userData.applicationId;
      this.assignDE.pageSize = this.shievePageSize;
      this.assignDE.page = this.shievePageNo;
      this.assignDE.sorts = '';
      this.assignDE.applyPaging = this.applypaging;
      this.assignDE.needTotal = true;
      if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
        this.ownerflag = false;
      } else {
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
        this.assignDE.screeningOwnerId = this.userData.userId;
        this.ownerflag = true;
      }
      this.applyPagination();
      this.screeningService.getAssignedCaseDetails(this.assignDE)
        .subscribe(resp => {
          if (resp) {
            this.AssignedDEList = resp.body;
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            this.caseSubmissionList = resp.body;
            this.caseSubmissionList.forEach(ele =>
              ele.screeningOwnerFName = ele.screeningOwnerFName ? (ele.screeningOwnerFName + (ele.screeningOwnerMName ? (' ' + ele.screeningOwnerMName) : '') +
                (ele.screeningOwnerLName ? (' ' + ele.screeningOwnerLName) : '')) : 'N/A');
            this.array = resp;
            this.autocompleteData();
          }
        });
    }
  }
  autocompleteData() {

    this.clientList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ clientName: x.clientName }))
        .map(e => [e.clientName, e])).values());
    this.clientRefNoList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ clientReferenceNo: x.clientReferenceNo })).filter(f => f.clientReferenceNo !== null)
        .map(e => [e.clientReferenceNo, e])).values());
    this.searchcandidateList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ candidateFullName: x.candidateFullName }))
        .map(e => [e.candidateFullName, e])).values());
    this.componentList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ compName: x.compName }))
        .map(e => [e.compName, e])).values());
    this.statusList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ caseStatus: x.caseStatus }))
        .map(e => [e.caseStatus, e])).values());
    this.priorityList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ priorityLookupName: x.priorityLookupName }))
        .map(e => [e.priorityLookupName, e])).values());
    if (this.priorityList.length > 0) {
      this.priorityList = this.priorityList.filter(w => w.priorityLookupName != null)
    }
    this.screeningIdList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ appScreeningID: x.appScreeningID }))
        .map(e => [e.appScreeningID, e])).values());
    if (this.screeningIdList.length > 0) {
      this.screeningIdList = this.screeningIdList.filter(w => w.appScreeningID != 'N/A')
    }
    this.ownerNameList = Array.from(new Map
      (this.caseSubmissionList.map(x => ({ ownerName: x.ownerName }))
        .map(e => [e.ownerName, e])).values());

    this.initautoCompleteCtrl();

  }
  // private iterator() {
  //   const end = (this.currentPage + 1) * this.pageSize;
  //   const start = this.currentPage * this.pageSize;
  //   const part = this.array.slice(start, end);
  //   this.caseSubmissionList = part;
  // }
  filterAssignedCase(caseStatus: any) {
    this.tabIndex = caseStatus;
    this.applypaging = true;
    this.shievePageSize = 10;
    this.shievePageNo = 1;
    this.qcSearchForm.reset();
    // if (this.screeningService.caseFlag === true){
    if (this.ownerflag !== true) {
      if (caseStatus === 1) {
        this.index = caseStatus;
        this.assignflag = true;
        this.assignDE.userId = this.userData.userId;
        this.assignDE.deptId = this.userData.deptId;
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
        if (this.screeningService.caseFlag === true) {
          this.getAssignedCaseDetails(this.assignDE.caseStatus);
        } else {
          if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
            this.getPreQcCaseDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
            this.getPreQCRejectScreeningDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.SUBCHECK) {
            this.getSubcheckDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
            this.getDASubcheckDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.NOTAPPLICABLE) {
            this.getNotApplicapleComponentDetails();
          }
        }
        this.selectall.setValue(false);
        this.assignCase = [];
        this.caseSubmissionList = this.AssignedDEList;
        this.currentPage = 0;
      } else if (caseStatus === 0) {
        this.index = caseStatus;
        this.assignflag = false;
        this.assignDE.caseStatus = 'NotAssigned';
        this.status = 'Not Assigned';
        this.assignDE.screeningOwnerId = null;
        if (this.screeningService.caseFlag === true) {
          this.getAssignedCaseDetails(this.assignDE.caseStatus);
        } else {
          if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
            this.getPreQcCaseDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
            this.getPreQCRejectScreeningDetails(this.assignDE.caseStatus);
          } else if (this.screeningService.caseFlagType === this.common.SUBCHECK) {
            this.getSubcheckDetails(this.assignDE.caseStatus);
          } if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
            this.getDASubcheckDetails(this.assignDE.caseStatus);
          }
        }
        this.selectall.setValue(false);
        this.assignCase = [];
        this.caseSubmissionList = this.AssignedDEList;
      }
    } else {
      if (caseStatus === 0) {
        this.index = caseStatus;
        this.assignflag = true;
        this.assignDE.userId = this.userData.userId;
        this.assignDE.deptId = this.userData.deptId;
        this.assignDE.caseStatus = 'Assigned';
        this.status = 'Assigned';
        this.getAssignedCaseDetails(this.assignDE.caseStatus);
      }
    }
    // }
  }
  // Get OwnerList
  GetScreeningOwner() {
    const deptId = this.userData.deptId;
    if (this.userData.teamName === 'CTS-SubmissionTeam') {
      this.subTeamName = '';
      if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
        this.subTeamName = 'CTSDEPreQC';
      }
    }
    else if (this.userData.teamName === 'DEPre-QC' || this.userData.teamName === 'InternationalDataEntry' || this.userData.teamName === 'TechMDataEntry') {
      this.subTeamName = '';
    }
    else if (this.userData.teamName == 'DataEntry' && this.userData.subTeamName == "TechM Submission Team" && this.userData.subTeamId != 0 && this.screeningService.caseFlagType !== this.common.PREQCCASE) {
      this.subTeamName = "TechM Submission Team"
    }
    else {
      this.subTeamName = 'DESubmission';
      if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
        this.subTeamName = 'DEPreQC';
      }
    }
    this.screeningService.getScreeningOwner(deptId, this.userData.teamId, this.subTeamName).subscribe(resp => {
      if (resp) {
        this.screeningOwnerList = resp.screeningOwner;
        const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
        ind > -1 ? this.screeningOwnerList.splice(ind, 1) : this.screeningOwnerList;
        this.getAssignedCaseDetails('NotAssigned');
      }
    });
  }
  openFileSubmission(data: any) {
    if (data) {
      if (this.screeningService.caseFlag === true) {
        const caseId = data.caseNo;
        this.screeningService.screenCaseId = caseId;
        this.screeningService.ClientCategoryId = data.clientCategoryId;
      } else {
        const screeningId = data.caseNo;
        this.screeningService.screenCaseId = screeningId;
        this.screeningService.ClientCategoryId = data.clientCategoryId;
      }
      this.screeningService.basicInfo = true;
      this.route.navigate(['dashboard/screening/clientapp']);
      this.screeningService.StatusDeFlag = true;
    }
  }
  dialogClose() {
    this.dialogRef.close();
    this.screeningOwnerId.setValue('');
    this.screeningOwnerId.clearValidators();
    this.selectall.setValue(false);
    this.AssignedDEList.forEach((e) => {
      e.assignFlag = false;
    });
    this.assignCase = [];
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  opendialog() {
    if (this.assignCase.length >= 1) {
      this.dialogRef = this.dialog.open(this.assignPopUp, {
        width: '400px',
        disableClose: true
      });
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast one Candidate');
    }
  }
  assignOwner() {
    if (this.assignCase.length > 0) {
      this.screeningOwnerId.setValidators(Validators.required);
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
      if (this.screeningOwnerId.valid) {
        this.assignScreeningOwner.screeningOwnerId = this.screeningOwnerId.value.screeningOwnerId;
        this.assignScreeningOwner.assignCase = this.assignCase;
        this.assignScreeningOwner.deptId = this.userData.deptId;
        this.assignScreeningOwner.teamName = this.userData.teamName;
        this.assignScreeningOwner.subTeamName = this.userData.subTeamName;
        this.assignScreeningOwner.loggedIn = this.userData.userId;
        this.assignScreeningOwner.loginName = this.userData.lastName ?
          this.userData.firstName + ' ' + this.userData.lastName : this.userData.firstName;
        if (this.screeningService.caseFlagType === this.common.PREQCCASE || this.screeningService.caseFlagType === this.common.DASUBCHECK || (this.screeningService.caseFlagType === this.common.REOPEN && this.userData.deptName === 'DE Pre-QC department') ||
          (this.screeningService.caseFlagType === this.common.REOPEN && this.userData.subTeamName === 'CTS DE Pre-Qc Team')) {
          this.screeningService.assignDEPreQCScreeningOwner(this.assignScreeningOwner).subscribe(resp => {
            if (resp) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              this.caseSubmissionList = [];
              this.caseAssignSubmissionList = [];
              this.dialogRef.close();
              this.assignCase = [];
              this.assignflag = false;
              this.AssignedDEList.forEach((e) => {
                e.assignFlag = false;
              });
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
              if (this.index === 1) {
                const cout = this.index;
                this.filterAssignedCase(cout);
              } else {
                if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
                  this.getPreQcCaseDetails('NotAssigned');
                } else if ((this.screeningService.caseFlagType === this.common.REOPEN && this.userData.deptName === 'DE Pre-QC department') ||
                  (this.screeningService.caseFlagType === this.common.REOPEN && this.userData.subTeamName === 'CTS DE Pre-Qc Team')) {
                  this.GetReopenComponentDetails();
                } else {
                  this.getAssignedCaseDetails('NotAssigned');
                }
              }
            }
          });
        } else {
          this.screeningService.assignScreeningOwner(this.assignScreeningOwner).subscribe(resp => {
            if (resp) {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
              this.assignCase = [];
              this.assignflag = false;
              this.screeningOwnerId.setValue('');
              this.screeningOwnerId.clearValidators();
              this.screeningOwnerId.updateValueAndValidity();
              if (this.index === 1) {
                const cout = this.index;
                this.filterAssignedCase(cout);
              } else {
                if (this.screeningService.caseFlagType === this.common.VEREJECT) {
                  this.getScreeningVERejectComponentDetails();
                } else if (this.screeningService.caseFlagType === this.common.QCREJECT) {
                  this.getScreeningQCRejectComponentDetails();
                }
                else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
                  this.getScreeningFRRejectComponentDetails();
                } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
                  this.GetReopenComponentDetails();
                } else {
                  this.getAssignedCaseDetails('NotAssigned');
                }
              }
              this.dialogRef.close();
            }
          });
        }
      }
    } else {
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
    }
  }
  assignScope(e, i, data) {
    // this.viewflag = true;
    this.scope = new AssignCaseVm();
    if (e === true) {
      // this.viewflag = e;
      data.assignFlag = true;
      const caselist = this.caseSubmissionList.filter(x => x.caseNo === data.caseNo && x.assignFlag === true);
      if (caselist) {
        this.scope.caseNo = data.caseNo;
        this.scope.clientReferenceNo = data.clientReferenceNo;
        this.assignCase.push(this.scope);
      } else {
        data.assignFlag = false;
      }
    } else {
      data.assignFlag = false;
      if (this.selectall.value) {
        this.selectall.setValue(false);
      }
      const ind = this.assignCase.findIndex(x => x.caseNo === data.caseNo);
      this.assignCase.splice(ind, 1);
    }
  }
  //Added by Megala 12/01/2024
  selectAll(e: any) {
    if (e.checked === true) {
      var clientName = this.qcSearchForm.get('clientName')?.value;
      var clientRefNo = this.qcSearchForm.get('clientRefNo')?.value;
      var candidateName = this.qcSearchForm.get('candidateName')?.value;
      var ownerName = this.qcSearchForm.get('ownerName')?.value;
      var appScreeningID = this.qcSearchForm.get('appScreeningID')?.value;
      var priorityLookupName = this.qcSearchForm.get('priorityLookupName')?.value;
      if (this.caseSubmissionList.length > 0 && clientName != null && clientName != undefined && clientName != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.clientName == clientName);
      }
      if (this.caseSubmissionList.length > 0 && clientRefNo != null && clientRefNo != undefined && clientRefNo != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.clientRefNo == clientRefNo);
      }
      if (this.caseSubmissionList.length > 0 && candidateName != null && candidateName != undefined && candidateName != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.candidateName == candidateName);
      }
      if (this.caseSubmissionList.length > 0 && ownerName != null && ownerName != undefined && ownerName != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.ownerName == ownerName);
      }
      if (this.caseSubmissionList.length > 0 && appScreeningID != null && appScreeningID != undefined && appScreeningID != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.appScreeningID == appScreeningID);
      }
      if (this.caseSubmissionList.length > 0 && priorityLookupName != null && priorityLookupName != undefined && priorityLookupName != "") {
        this.caseAssignSubmissionList = this.caseSubmissionList.filter(f => f.priorityLookupName == priorityLookupName);
      }
      var fromindex = (this.itemPerPage[this.tabIndex] * this.page[this.tabIndex]) - (this.itemPerPage[this.tabIndex]);
      var toindex = this.itemPerPage[this.tabIndex] * this.page[this.tabIndex];
      if (toindex >= this.caseSubmissionList.length) {
        toindex = this.caseSubmissionList.length;
      } else {
        toindex = this.itemPerPage[this.tabIndex] * this.page[this.tabIndex];
      }
      if (this.caseAssignSubmissionList.length == 0) {
        this.caseSubmissionList.forEach((vd, index) => {
          if (index != null && index >= fromindex && index < toindex) {
            vd.assignFlag = true;
          }
        });
      }
      if (this.caseAssignSubmissionList.length > 0) {
        this.caseSubmissionList.filter(x => this.caseAssignSubmissionList.some(y => y.caseNo === x.caseNo)).forEach((vd, index) => {
          vd.assignFlag = true;
        });
      }
      //assignvm
      this.assignCase = [];
      // tslint:disable-next-line:no-shadowed-variable
      this.caseSubmissionList.forEach((element, i) => {
        if (element.assignFlag == true) {
          this.scope = new AssignCaseVm();
          this.scope.caseNo = element.caseNo;
          this.scope.clientReferenceNo = element.clientReferenceNo;
          this.assignCase.push(this.scope);
        }
      });
    } else {
      this.caseSubmissionList.forEach(vd => {
        vd.assignFlag = false;
      });
    }
  }

  assignallScope(e: any) {
    if (e === true) {
      // this.checkGroup.get('checkcase')?.setValue(true);
      this.caseSubmissionList.forEach((e) => {
        e.assignFlag = true;
      });
      this.assignCase = [];
      // tslint:disable-next-line:no-shadowed-variable
      this.AssignedDEList.forEach((element, i) => {
        this.scope = new AssignCaseVm();
        this.scope.caseNo = element.caseNo;
        this.scope.clientReferenceNo = element.clientReferenceNo;
        this.assignCase.push(this.scope);
      });
    } else {
      this.AssignedDEList.forEach((e) => {
        e.assignFlag = false;
      });
      this.assignCase = [];
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.updateValueAndValidity();
    }
  }

  refnokeyup(e, value) {
    if (e) {
      if (value) {
        this.caseSubmissionList = Object.assign([], this.AssignedDEList).filter(
          item => ((item.clientReferenceNo.toLowerCase().indexOf(value.toLowerCase()) > -1)));
      } else {
        if (this.ownerflag !== true) {
          if (this.index === 0) {
            this.getAssignedCaseDetails('NotAssigned');
          } else if (this.index === 1) {
            this.getAssignedCaseDetails('Assigned');
          }
        } else {
          this.getAssignedCaseDetails('Assigned');
        }
      }
    }
  }
  candidatekeyup(e, value) {
    if (e) {
      this.caseSubmissionList = Object.assign([], this.AssignedDEList).filter(
        item => ((item.candidateFirstName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    } else {
      if (this.ownerflag !== true) {
        if (this.index === 0) {
          this.getAssignedCaseDetails('NotAssigned');
        } else if (this.index === 1) {
          this.getAssignedCaseDetails('Assigned');
        }
      } else {
        this.getAssignedCaseDetails('Assigned');
      }
    }
  }
  clientkeyup(e, value) {
    if (e) {
      if (value) {
        this.caseSubmissionList = Object.assign([], this.AssignedDEList).filter(
          item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
      } else {
        if (this.ownerflag !== true) {
          if (this.index === 0) {
            this.getAssignedCaseDetails('NotAssigned');
          } else if (this.index === 1) {
            this.getAssignedCaseDetails('Assigned');
          }
        } else {
          this.getAssignedCaseDetails('Assigned');
        }
      }
    }
  }

  getPreQcCaseDetails(caseStatus: any) {
    this.assignDE.userId = this.userData.userId;
    this.assignDE.deptId = this.userData.deptId;
    this.assignDE.teamId = this.userData.teamId;
    this.assignDE.subTeamId = this.userData.subTeamId;
    this.assignDE.teamName = this.userData.teamName;
    this.assignDE.subTeamName = this.userData.subTeamName;
    this.assignDE.caseNo = 0;
    this.assignDE.caseStatus = caseStatus;
    this.assignDE.applicationId = this.userData.applicationId;
    this.assignDE.type = 'PreQCScreening';
    this.assignDE.pageSize = this.shievePageSize;
    this.assignDE.page = this.shievePageNo;
    this.assignDE.sorts = '';
    this.assignDE.applyPaging = this.applypaging;
    this.assignDE.needTotal = true;
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    } else {
      this.assignDE.caseStatus = 'Assigned';
      this.status = 'Assigned';
      this.assignDE.screeningOwnerId = this.userData.userId;
      this.ownerflag = true;
      this.menubar = this.menubarUser;
    }
    this.applyPagination();
    this.screeningService.getPreQCScreeningDetails(this.assignDE)
      .subscribe(resp => {
        if (resp) {
          this.AssignedDEList = resp.body;
          this.shieveTotalCount = resp.headers.get('X-Total-Count');
          this.caseSubmissionList = resp.body;
          this.caseSubmissionList.map(m =>
            m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + '' + m.candidateLastName);
          this.caseSubmissionList.forEach(m =>
            m.screeningOwnerFName = m.invitationFlag ? 'N/A' : m.screeningOwnerFName);
          this.autocompleteData();
        }
      });
  }
  getPreQCRejectScreeningDetails(caseStatus: any) {
    this.assignDE.userId = this.userData.userId;
    this.assignDE.deptId = this.userData.deptId;
    this.assignDE.teamId = this.userData.teamId;
    this.assignDE.subTeamId = this.userData.subTeamId;
    this.assignDE.teamName = this.userData.teamName;
    this.assignDE.subTeamName = this.userData.subTeamName;
    this.assignDE.caseNo = 0;
    this.assignDE.caseStatus = caseStatus;
    this.assignDE.applicationId = this.userData.applicationId;
    this.assignDE.type = 'PreQCReject';
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    } else {
      this.assignDE.caseStatus = 'Assigned';
      this.status = 'Assigned';
      this.assignDE.screeningOwnerId = this.userData.userId;
      this.ownerflag = true;
      this.menubar = this.menubarUser;
    }
    this.screeningService.getPreQCRejectScreeningDetails(this.assignDE)
      .subscribe(resp => {
        if (resp) {
          this.AssignedDEList = resp;
          this.caseSubmissionList = resp;
          this.caseSubmissionList.map(m =>
            m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' ' + m.candidateLastName);
          this.autocompleteData();
        }
      });
  }
  getScreeningQCRejectComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {

      this.ownerflag = false;
    } else {
      this.ownerflag = true;
    } this.screeningService.getScreeningQCRejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        this.AssignedDEList = respBody;
        this.caseSubmissionList = respBody;
        this.caseSubmissionList.forEach(m =>
          m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
        // this.clientList = Array.from(new Map
        //   (this.caseSubmissionList.map(x => ({ clientName: x.clientName }))
        //     .map(e => [e.clientName, e])).values());
        // this.componentList = Array.from(new Map
        //   (this.caseSubmissionList.map(x => ({ compName: x.compName })).filter(f => f.compName !== null)
        //     .map(e => [e.compName, e])).values());
        // this.statusList = Array.from(new Map
        //   (this.caseSubmissionList.map(x => ({ caseStatus: x.caseStatus }))
        //     .map(e => [e.caseStatus, e])).values());
        // this.initautoCompleteCtrl();
        //this.autocompleteData();
        // this.gridDataShowbyUserId(this.caseSubmissionList);
      }
    });
  }
  getScreeningFRRejectComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {

      this.ownerflag = false;
    } else {
      this.ownerflag = true;
    }
    this.screeningService.getScreeningFRRejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        this.AssignedDEList = respBody;
        this.caseSubmissionList = respBody;
        this.caseSubmissionList.forEach(m =>
          m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
        //this.autocompleteData();
      }
    });
  }
  getScreeningVERejectComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    }
    else {
      this.ownerflag = true;
    }
    this.screeningService.getScreeningVERejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        this.AssignedDEList = respBody;
        this.caseSubmissionList = respBody;
        this.caseSubmissionList.forEach(m =>
          m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
        // this.autocompleteData();
      }
    });
  }
  GetReopenComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    //VTS2-2023-DE-0129 Added by Megala
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    }
    else {
      this.ownerflag = true;
    }
    this.screeningService.GetReopenComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        this.AssignedDEList = respBody;
        this.caseSubmissionList = respBody;
        //VTS2-2023-DE-0129 Added by Megala
        this.AssignedDEList.forEach(m1 => {
          m1.deOwnerName = m1.deOwnerFirstName + ' ' + (m1.deOwnerMiddleName == null ? '' : ' ' +
            m1.deOwnerMiddleName) + (m1.deOwnerLastName == null ? '' : ' ' +
              m1.deOwnerLastName)
          if ((this.userData.deptName === 'DE Pre-QC department') || (this.userData.subTeamName === 'CTS DE Pre-Qc Team')) {
            m1.preQCScreenOwnerName = (m1.dePreQcOwnerFirstName != null) ? m1.dePreQcOwnerFirstName + ' ' + (m1.dePreQcOwnerMiddleName == null ? '' : ' ' +
              m1.dePreQcOwnerMiddleName) + (m1.dePreQcOwnerLastName == null ? '' : ' ' + m1.dePreQcOwnerLastName) : 'N/A'
          }
        })
        this.caseSubmissionList.forEach(m1 => {
          m1.deOwnerName = m1.deOwnerFirstName + ' ' + (m1.deOwnerMiddleName == null ? '' : ' ' +
            m1.deOwnerMiddleName) + (m1.deOwnerLastName == null ? '' : ' ' +
              m1.deOwnerLastName)
          if ((this.userData.deptName === 'DE Pre-QC department') || (this.userData.subTeamName === 'CTS DE Pre-Qc Team')) {
            m1.preQCScreenOwnerName = (m1.dePreQcOwnerFirstName != null) ? m1.dePreQcOwnerFirstName + ' ' + (m1.dePreQcOwnerMiddleName == null ? '' : ' ' +
              m1.dePreQcOwnerMiddleName) + (m1.dePreQcOwnerLastName == null ? '' : ' ' + m1.dePreQcOwnerLastName) : 'N/A'
          }
        })
        this.caseSubmissionList.forEach(m =>
          m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
        // this.autocompleteData();
      }
    });
  }
  getNotApplicapleComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    this.screeningService.getNotApplicapleComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        this.AssignedDEList = respBody;
        this.caseSubmissionList = respBody;
        //this.autocompleteData();
      }
    });
  }
  getClosedComponentDetails() {
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applyPagination();
    this.screeningService.getClosedComponentDetails(this.dashboardCountVm).subscribe(resp => {
      if (resp) {
        this.shieveTotalCount = resp.headers.get('X-Total-Count');
        const respBody = resp.body;
        if (this.userData.applicationId === 2) {
          this.AssignedDEList = respBody.clientScreeningComponentDetails === null ? [] : respBody.clientScreeningComponentDetails;
          this.caseSubmissionList = respBody.clientScreeningComponentDetails === null ? [] : respBody.clientScreeningComponentDetails;
        } else {
          this.AssignedDEList = respBody.screeningComponent === null ? [] : respBody.screeningComponent;
          this.caseSubmissionList = respBody.screeningComponent === null ? [] : respBody.screeningComponent;
        }
        //this.autocompleteData();
      }
    });
  }
  applyPagination() {
    let filter = "";
    // Added By Megala - For Filter api call 06/05/2024
    if (this.screeningService.caseFlagType !== this.common.QCREJECT &&
      this.screeningService.caseFlagType !== this.common.FRREJECT && this.screeningService.caseFlagType !== this.common.VEREJECT && this.screeningService.caseFlagType !== this.common.REOPEN
      && this.screeningService.caseFlagType !== this.common.NOTAPPLICABLE && this.screeningService.caseFlagType !== this.common.CLOSED &&
      (this.screeningService.caseFlagType !== this.common.SUBMISSION_HISTORY) && (this.screeningService.caseFlagType !== this.common.VE_HISTORY) && (this.screeningService.caseFlagType !== this.common.BT_POPUP)
      && this.screeningService.caseFlagType !== this.common.NT_POPUP && this.screeningService.caseFlagType !== this.common.WT_POPUP && this.screeningService.caseFlagType !== this.common.CT_POPUP) {
      if (this.qcSearchForm.value.clientName && this.qcSearchForm.get('clientName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName @=' + this.qcSearchForm.value.clientName;
      }
      if (this.qcSearchForm.value.clientRefNo && this.qcSearchForm.get('clientRefNo')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientReferenceNo @=' + this.qcSearchForm.value.clientRefNo;
      }
      if (this.qcSearchForm.value.candidateName && this.qcSearchForm.get('candidateName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateFullName @=' + this.qcSearchForm.value.candidateName;
      }
      // if (this.qcSearchForm.value.statusName && this.qcSearchForm.get('statusName')?.valid) {
      //   filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'statusName @=' + this.qcSearchForm.value.statusName;
      // }
      if (this.qcSearchForm.value.ownerName && this.qcSearchForm.get('ownerName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'ownerName @=' + this.qcSearchForm.value.ownerName;
      }
      if (this.qcSearchForm.value.appScreeningID && this.qcSearchForm.get('appScreeningID')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'appScreeningID @=' + this.qcSearchForm.value.appScreeningID;
      }
      if (this.qcSearchForm.value.priorityLookupName && this.qcSearchForm.get('priorityLookupName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'priorityLookupName @=' + this.qcSearchForm.value.priorityLookupName;
      }
      this.assignDE.filters = filter ? filter : '';

    } else {
      if (this.caseSearchForm.value.clientName && this.caseSearchForm.get('clientName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName @=' + this.caseSearchForm.value.clientName;
      }
      if (this.caseSearchForm.value.screeningId && this.caseSearchForm.get('screeningId')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientScreeningId @=' + this.caseSearchForm.value.screeningId;
      }
      if (this.caseSearchForm.value.caseRefNo && this.caseSearchForm.get('caseRefNo')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientReferenceNo @=' + this.caseSearchForm.value.caseRefNo;
      }
      if (this.caseSearchForm.value.compName && this.caseSearchForm.get('compName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'compName @=' + this.caseSearchForm.value.compName;
      }
      if (this.caseSearchForm.value.statusName && this.caseSearchForm.get('statusName')?.valid) {
        filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'statusName @=' + this.caseSearchForm.value.statusName;
      }
    }
    this.dashboardCountVm.pageSize = this.shievePageSize;
    this.dashboardCountVm.page = this.shievePageNo;
    this.dashboardCountVm.filters = filter ? filter : '';
    this.dashboardCountVm.sorts = '';
    this.dashboardCountVm.applyPaging = this.applypaging;
    this.dashboardCountVm.needTotal = true;
  }
  //Changed By Megala -16/05/2024 
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.applypaging = true;
      this.shievePageSize = this.shieveTotalCount;
      if (this.ownerflag !== true) {
        if (this.index === 1) {
          if (this.screeningService.caseFlag === true) {
            this.getAssignedCaseDetails('Assigned');
          }
          else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
            this.getPreQcCaseDetails('Assigned');
          }
          else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
            this.getDASubcheckDetails('Assigned');
          } else {
            this.applyCommonmethod();
          }
        }
        else {
          if (this.screeningService.caseFlag === true) {
            this.getAssignedCaseDetails('NotAssigned');
          }
          else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
            this.getPreQcCaseDetails('NotAssigned');
          }
          else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
            this.getDASubcheckDetails('NotAssigned');
          } else {
            this.applyCommonmethod();
          }
        }
      } else if (this.ownerflag == true) {
        if (this.screeningService.caseFlag === true) {
          this.getAssignedCaseDetails('Assigned');
        }
        else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
          this.getPreQcCaseDetails('Assigned');
        }
        else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
          this.getDASubcheckDetails('Assigned');
        } else {
          this.applyCommonmethod();
        }
      }
    }
  }

  shievePagination(event: any) {
    this.shievePageNo = event;
    if (this.screeningService.caseFlag === true) {
      this.getAssignedCaseDetails('Assigned');
    }
    else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
      this.getDASubcheckDetails('Assigned');
    }
    else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
      this.getPreQcCaseDetails('Assigned');
    }


  }
  preventInfinite(value: any) {
    //this.shievePageSize = value;
    this.applyCommonmethod();

  }
  OnPageChange() {
    this.applyCommonmethod();

  }
  search() {
    if (this.caseSearchForm.value.clientName || this.caseSearchForm.value.screeningId || this.caseSearchForm.value.caseRefNo || this.caseSearchForm.value.compName
      || this.caseSearchForm.value.statusName) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.applyCommonmethod();

    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }

  reset() {
    this.searchValueArr = [];
    this.caseSearchForm.reset();
    this.userData.filters = "";
    this.shievePageNo = 1;
    this.shievePageSize = 10;
    this.applyCommonmethod();
    this.resetClosedCheckFilter();
  }

  resetClosedCheckFilter() {
    this.closedCheckData.filters = ''
    this.closedCheckData.closedCheckClientId = null;
    this.closedCheckData.clientRefNo = null;
    this.closedCheckData.verificationId = null;
    this.closedCheckData.caseClosedFromDate = null;
    this.closedCheckData.caseClosedToDate = null;
    this.closedCheckData.closedUserId = null;
  }
  //Added for VTS2-2024-ADD-0229 by Madasamy - START
  searchCloseChk() {
    if (this.closeCheckForm.value.clientName || this.closeCheckForm.value.submittedFromDate || this.closeCheckForm.value.submittedToDate || this.closeCheckForm.value.clientRefNo || this.closeCheckForm.value.verificationId
      || this.closeCheckForm.value.screeningOwnerName) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.resetClosedCheckFilter();
      let filter = "";
      if (this.closeCheckForm.value.clientName && this.closeCheckForm.get('clientName')?.valid) {
        // this.closedCheckData.closedCheckClientId = this.closeCheckForm.value.clientName.id;
         this.closedCheckData.closedCheckClientId = this.closeCheckForm.get('clientName')?.value ?
      this.closeCheckForm.controls.clientName.value.map(m => m.id) : [];
      }
      if (this.closeCheckForm.value.clientRefNo && this.closeCheckForm.get('clientRefNo')?.valid) {
        this.closedCheckData.clientRefNo = this.closeCheckForm.value.clientRefNo;
      }
      if (this.closeCheckForm.value.verificationId && this.closeCheckForm.get('verificationId')?.valid) {
        this.closedCheckData.verificationId = this.closeCheckForm.value.verificationId;
      }
      if (this.closeCheckForm.value.screeningOwnerName && this.closeCheckForm.get('screeningOwnerName')?.valid) {
        this.closedCheckData.closedUserId = this.closeCheckForm.value.screeningOwnerName;
      }

      if (this.closeCheckForm.value.submittedFromDate && this.closeCheckForm.get('submittedFromDate')?.valid) {
        this.closedCheckData.caseClosedFromDate = new DatePipe('en-Us').transform(this.closeCheckForm.value.submittedFromDate, 'yyyy-MM-dd');
      }

      if (this.closeCheckForm.value.submittedToDate && this.closeCheckForm.get('submittedToDate')?.valid) {
        this.closedCheckData.caseClosedToDate = new DatePipe('en-Us').transform(this.closeCheckForm.value.submittedToDate, 'yyyy-MM-dd');
      }

      this.userData.pageSize = this.shievePageSize;
      this.userData.page = this.shievePageNo;
      this.userData.filters = filter
      this.userData.applyPaging = true;
      this.userData.needTotal = true;
      this.userData.filters = '';

      this.mapUserDataToClosedData();


      // this.ClosedCheckData.userId = this.userData.userId;
      // this.ClosedCheckData.deptId = this.userData.deptId;
      // this.ClosedCheckData.applicationId = this.userData.applicationId;
      // this.ClosedCheckData.pageSize = this.shievePageSize;
      // this.ClosedCheckData.page = this.shievePageNo;
      // this.ClosedCheckData.sorts = '';
      // this.ClosedCheckData.applyPaging = this.applypaging;
      // this.ClosedCheckData.needTotal = true;



      this.screeningService.getVerificationCompletedHistory(this.closedCheckData).subscribe(resp => {
        if (resp) {
          this.totalpages = resp.headers.get('X-Total-Count');
          this.loading = false;
          if (this.closedCheckData.applicationId === 2) {
            this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
          } else {
            this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
          }
          this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          this.historyList.map(element => element.submissionOwnerName = (element.submissionOwnerFName ? (element.submissionOwnerFName + (element.submissionOwnerMName ? (' ' + element.submissionOwnerMName) : '') +
            (element.submissionOwnerLName ? (' ' + element.submissionOwnerLName) : '')) : 'N/A'));

          this.historyList.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          this.duplist = this.common.CloneObject(this.historyList);
        }
      });



    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }

  resetClsChkForm() {
    this.searchValueArr = [];
    this.closeCheckForm.reset();
    this.userData.filters = "";
    this.resetClosedCheckFilter();
    this.shievePageNo = 1;
    this.shievePageSize = 10;
    this.closedCheckData.page = 1;
    this.closedCheckData.pageSize = 10;
    this.applyCommonmethod();
  }
  //Added for VTS2-2024-ADD-0229 by Madasamy - END
  applyCommonmethod() {
    if (this.screeningService.caseFlagType === this.common.NOTAPPLICABLE) {
      this.getNotApplicapleComponentDetails();
    }
    else if (this.screeningService.caseFlagType === this.common.QCREJECT) {
      this.getScreeningQCRejectComponentDetails();
    }
    else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
      this.getScreeningVERejectComponentDetails();
    }
    else if (this.screeningService.caseFlagType === this.common.REOPEN) {
      this.GetReopenComponentDetails();
    }
    else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
      this.getScreeningFRRejectComponentDetails();
    }
    else if (this.screeningService.caseFlagType === this.common.VE_HISTORY) {
      this.showVerificationHistory(true); //VTS2-2024-ADD-0229
    }
    else {
      this.getClosedComponentDetails();
    }
  }
  removeSearchValue(key, index) {
    // tslint:disable-next-line: forin
    this.searchValueArr.splice(index, 1);
    // tslint:disable-next-line: forin
    for (const ctrl in this.qcSearchForm.controls) {
      if (ctrl === key) {
        this.qcSearchForm.get(ctrl).setValue('');
      }
      if (ctrl === 'receivedFromDate' || ctrl === 'receivedToDate') {
        this.clientList = this.clientList;
      }
    }
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      if (this.searchValueArr.length > 0) {
        if (this.searchValueArr.filter(x => x.propertyName === event.propertyName && x.value === event.value).length === 0) {
          if (this.searchValueArr.filter(x => x.propertyName === event.propertyName).length > 0) {
            const index = this.searchValueArr.findIndex(f => f.propertyName === event.propertyName);
            this.searchValueArr.splice(index, 1, { propertyName: event.propertyName, value: event.value });
          } else {
            this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
          }
        }
      } else {
        this.searchValueArr.push({ propertyName: event.propertyName, value: event.value });
      }
    } else {
      for (const ctrl in this.qcSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }

        }
      }
    }
  }
  selectQc(comp: any) {

    const caseId = comp.caseNo;
    this.screeningService.screenCaseNo = caseId;

    if (this.screeningService.caseFlagType !== this.common.NOTAPPLICABLE &&
      this.screeningService.caseFlagType !== this.common.CLOSED) {
      this.screeningService.screeningCompId = comp.screeningCompId;
      this.route.navigate(['/dashboard/screening/india']);
    }

  }
  getPage(event, ind) {
    this.page[ind] = event;
  }
  getTotalPage(ind): number {
    if (this.caseSubmissionList.length) {
      return Math.ceil(this.caseSubmissionList.length / this.itemPerPage[ind]);
    }
  }
  showall(ind: any) {
    if (ind >= 0) {
      if (this.caseSubmissionList.length > 0) {
        this.itemPerPage[ind] = this.caseSubmissionList.length;
      }
    } else {
      if (this.caseSubmissionList.length > 0) {
        this.itemPerPage[0] = this.caseSubmissionList.length;
      }
    }
  }
  showallH() {
    if (this.screeningService.caseFlagType === this.common.SUBMISSION_HISTORY) {
      this.getLazyLoadingData(false);
    } else if (this.screeningService.caseFlagType === this.common.VE_HISTORY) {
      this.showVerificationHistory(false);
    }
    else if (this.screeningService.caseFlagType === this.common.BT_POPUP) {
      this.tatdaysdelaylist();
    } else if (this.screeningService.caseFlagType === this.common.WT_POPUP) {
      this.wTtatdayslist();
    } else if (this.screeningService.caseFlagType === this.common.NT_POPUP) {
      this.ntatdayslist();
    } else if (this.screeningService.caseFlagType === this.common.CT_POPUP) {
      this.ctatdayslist();
    }
    this.historyList = this.historyList
    if (this.historyList.length > 0) {
      this.Hitemperpage = this.historyList.length;
    }
  }
  resetFilterSort(type: any) {
    this.qcSearchForm.reset();
    this.searchValueArr = [];
    this.column = '';
    this.filterAssignedCase(this.tabIndex);
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  assignScrnOwner(data, index) {
    this.screeningOwnerId.setValue('');
    const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerFName === data.screeningOwnerFName);
    if (ind > -1) {
      this.screeningOwnerId.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (eleScroll.length > 0) {
        eleScroll[0].scrollTop = 0;
      }
      [this.screeningOwnerList[0], this.screeningOwnerList[ind]] =
        [this.screeningOwnerList[ind], this.screeningOwnerList[0]];
      const indCls = this.screeningOwnerList.findIndex(x => x.screeningOwnerFName === data.screeningOwnerFName);
      if (ele.length > 0) {
        for (let i = 0; i < this.screeningOwnerList.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.screeningOwnerList = Object.assign([], this.screeningOwnerList);
    } else {
      this.showTopCenter('error', 'Choose Active User', 'Owner name is In-active');
    }
  }
  addNewCase() {
    this.screeningService.caseFlag = false;
    this.screeningService.caseFlagType = this.common.NEWCASE;
    this.route.navigate(['dashboard/screening/clientapp']);
  }
  showHistory(flag: any) {
    this.historyFlag = true;
    this.routePath = this.screeningService.flagType === true ? 'Screening / Case Submission History' : 'Screening / Pre-QC Submission History';
    //this.breadcrumbFlags.btnBack = true;
    this.historycolumns.splice(10, 0, { field: 'submittedDate', header: 'Submitted Date' });
    //const userId = (!flag && (this.userData.subTeamLeadFlag === true || this.userData.teamLeadFlag === true)) ? 0 : this.userData.userId;
    const userId = this.userData.userId;
    this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.dashboardCountVm.SubmissionFlag = flag;
    //this.ClosedCheckData =JSON.parse(sessionStorage.getItem('user_data') as string);
  }
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.userData.filters = event.globalFilter ? "(verificationId|clientRefNo)@=" + event.globalFilter : '';

    // this filter is hided for global filter concept
    // let filters = '';
    // if (Object.keys(event.filters).length > 0) {
    //   Object.keys(event.filters).forEach((key) => {
    //     if (key === 'candidateName') {
    //       filters += ',' + 'candidateFirstName' + '@=' + event.filters[key].value.toLowerCase();
    //     } else {
    //       filters += ',' + key + '@=' + event.filters[key].value.toLowerCase();
    //     }
    //   })
    //   this.userData.filters = filters;
    // } else {
    //   this.userData.filters = filters;
    // }
    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    // const sort = event.sortField == 'candidateName' ? 'candidateFirstName' : event.sortField
    const sort = this.mapSortField(event);
    this.userData.sorts = event.sortOrder == -1 ? "-" + sort : sort;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    if (Object.keys(event.filters).length > 0 || event.sortField || this.userData.page) {
      if (this.screeningService.caseFlagType === this.common.SUBMISSION_HISTORY) {
        this.getLazyLoadingData(true);
      } else if (this.screeningService.caseFlagType === this.common.VE_HISTORY) {
        /*

        this.ClosedCheckData.userId = this.userData.userId;
        this.ClosedCheckData.deptId = this.userData.deptId;
        this.ClosedCheckData.applicationId = this.userData.applicationId;
        this.ClosedCheckData.pageSize = this.shievePageSize;
        this.ClosedCheckData.page = this.shievePageNo;
        this.ClosedCheckData.sorts = this.userData.sorts;
        this.ClosedCheckData.applyPaging = this.applypaging;
        this.ClosedCheckData.needTotal = true;
        this.ClosedCheckData.filters = this.userData.filters;
        */
        this.showVerificationHistory(true);
      }
      else if (this.screeningService.caseFlagType === this.common.BT_POPUP) {
        this.tatdaysdelaylist();
      } else if (this.screeningService.caseFlagType === this.common.WT_POPUP) {
        this.wTtatdayslist();
      } else if (this.screeningService.caseFlagType === this.common.NT_POPUP) {
        this.ntatdayslist();
      } else if (this.screeningService.caseFlagType === this.common.CT_POPUP) {
        this.ctatdayslist();
      }
    }
  }
  mapSortField(event: any): string {
    switch (event.sortField) {
      case 'candidateName':
        return 'candidateFirstName';
      case 'qcOwner':
        return 'OwnerFirstName';
      case 'submissionOwnerName':
        return 'SubmissionOwnerFName';
      default:
        return event.sortField;
    }
  }

  getLazyLoadingData(flag: boolean) {
    this.userData.applyPaging = flag;
    this.screeningService.getSubmissionHistory(this.userData).subscribe(resp => {
      if (resp) {
        this.historyList = resp.body;
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }
  moveToVerificationCheck(data: any) {
    this.verificationService.closedCheck = true;
    this.verificationDetails.screeningCompId = data;
    this.verificationDetails.loginUserDetVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.verificationService.getVerificationDetails(this.verificationDetails).subscribe(resp => {
      if (resp) {
        this.verificationService.changeMessage(data);
        this.route.navigate(['dashboard/verification/verificationDetail']);
      }
    });
  }
  mapUserDataToClosedData() {
    this.closedCheckData.deptId = this.userData.deptId;
    this.closedCheckData.applicationId = this.userData.applicationId;
    this.closedCheckData.pageSize = this.userData.pageSize;
    this.closedCheckData.page = this.userData.page;
    this.closedCheckData.sorts = this.userData.sorts;
    this.closedCheckData.applyPaging = this.userData.applyPaging;
    this.closedCheckData.needTotal = this.userData.needTotal;
    this.closedCheckData.filters = this.userData.filters;
    this.closedCheckData.clientIds = this.userData.clientId;
    this.closedCheckData.loginUserDetVm = this.userData;
  }

  showVerificationHistory(flag: any) {
    this.userData.applyPaging = flag == true ? true : false;
    this.routePath = 'Verification / Closed Checks';
    //Remove Dynamic column and placed in to ngoninit
    // this.historycolumns.splice(8, 0, { field: 'componentStatus', header: 'Component Status' });
    // this.historycolumns.splice(14, 0, { field: 'reasonForDelay', header: 'Reason For Delay' });
    // this.historycolumns.splice(11, 0, { field: 'submittedDate', header: 'Closed Date & Time' });
    // this.historycolumns.splice(20, 0, { field: 'qcOwner', header: 'Qc Owner' });
    // this.historycolumns.splice(12, 0, { field: 'componentDueDate', header: 'Actual Due Date' });

    this.mapUserDataToClosedData();

    this.screeningService.getVerificationCompletedHistory(this.closedCheckData).subscribe(resp => {
      if (resp) {
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        if (this.userData.applicationId === 2) {
          this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
        } else {
          this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
          //Added for VTS2-2024-ADD-0229 by Madasamy - START
          // this.clientList = Array.from(new Map(resp.body.clients.map(name => [name, { clientName: name }])).values());
          // this.ownerNameList = Array.from(new Map(resp.body.screeningOwners.map(name => [name, { screeningOwnerName: name }])).values());
          //this.initAutoCompleteCheck();
          //Added for VTS2-2024-ADD-0229 by Madasamy - END
        }
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.historyList.map(element => element.submissionOwnerName = (element.submissionOwnerFName ? (element.submissionOwnerFName + (element.submissionOwnerMName ? (' ' + element.submissionOwnerMName) : '') +
          (element.submissionOwnerLName ? (' ' + element.submissionOwnerLName) : '')) : 'N/A'));

        this.historyList.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
          (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }

  tatdaysdelaylist() {
    this.userData.applyPaging = true;
    this.routePath = 'Verification / BT Details';
    this.screeningService.getTatDelaylist(this.userData).subscribe(resp => {
      if (resp) {
        // this.virtualDatabase = resp;
        // this.totalpages = resp.verificationDet.length;
        // this.historyList = this.virtualDatabase.verificationDet.slice(this.event.first, (this.event.first + this.event.rows));
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        if (this.userData.applicationId === 2) {
          this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
        } else {
          this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
        }
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.historyList.map(element => element.createdName = (element.createdName ? (element.createdName + (element.createdFName ? (' ' + element.createdFName) : '') +
          (element.createdLName ? (' ' + element.createdLName) : '')) : 'N/A'));
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }

  ctatdayslist() {
    this.userData.applyPaging = true;
    this.routePath = 'Verification / CT Details';
    this.screeningService.getCTatlist(this.userData).subscribe(resp => {
      if (resp) {
        // this.virtualDatabase = resp;
        // this.totalpages = resp.verificationDet.length;
        // this.historyList = this.virtualDatabase.verificationDet.slice(this.event.first, (this.event.first + this.event.rows));
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        if (this.userData.applicationId === 2) {
          this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
        } else {
          this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
        }
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.historyList.map(element => element.createdName = (element.createdName ? (element.createdName + (element.createdFName ? (' ' + element.createdFName) : '') +
          (element.createdLName ? (' ' + element.createdLName) : '')) : 'N/A'));
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }
  ntatdayslist() {
    this.userData.applyPaging = true;
    this.routePath = 'Verification / NT Details';
    this.screeningService.getNTatlist(this.userData).subscribe(resp => {
      if (resp) {
        // this.virtualDatabase = resp;
        //this.totalpages = resp.verificationDet.length;
        // this.historyList = this.virtualDatabase.verificationDet.slice(this.event.first, (this.event.first + this.event.rows));
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        if (this.userData.applicationId === 2) {
          this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
        } else {
          this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
        }
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.historyList.map(element => element.createdName = (element.createdName ? (element.createdName + (element.createdFName ? (' ' + element.createdFName) : '') +
          (element.createdLName ? (' ' + element.createdLName) : '')) : 'N/A'));
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }
  wTtatdayslist() {
    this.userData.applyPaging = true;
    //this.userData.applyPaging = false;
    this.routePath = 'Verification / WT Details';
    this.screeningService.getWTatlist(this.userData).subscribe(resp => {
      if (resp) {
        // this.virtualDatabase = resp;
        //this.totalpages = resp.verificationDet.length;
        // this.historyList = this.virtualDatabase.verificationDet.slice(this.event.first, (this.event.first + this.event.rows));
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
        if (this.userData.applicationId === 2) {
          this.historyList = resp.body.clientVerificationDet === null ? [] : resp.body.clientVerificationDet;
        } else {
          this.historyList = resp.body.verificationDet === null ? [] : resp.body.verificationDet;
        }
        this.historyList.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
          + m.candidateLastName);
        this.historyList.map(element => element.createdName = (element.createdName ? (element.createdName + (element.createdFName ? (' ' + element.createdFName) : '') +
          (element.createdLName ? (' ' + element.createdLName) : '')) : 'N/A'));
        this.duplist = this.common.CloneObject(this.historyList);
        this.historyFilter();
      }
    });
  }
  resetDate(from, to) {
    this[from] = '';
    this[to] = '';
    this.historyList = this.duplist;
  }
  getRecordBydate(fDate, tDate, prty) {
    this.historyList = this.duplist;
    const FromDate = this.datePipe.transform(fDate, 'yyyy-MM-ddThh:mm');
    const ToDate = this.datePipe.transform(tDate, 'yyyy-MM-ddThh:mm');
    this.historyList.map(d => d[prty] = this.datePipe.transform(d[prty], 'yyyy-MM-ddThh:mm'));
    this.historyList = this.duplist.filter(x => x[prty] >= FromDate && x[prty] <= ToDate);
  }
  historyFilter() {
    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.clientName).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.siteFormCtrlFilteredOptions = this.siteFormCtrl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.siteName).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.candidateNameFilteredOptions = this.candidateNameFormCtrl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.candidateName).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.componentNameFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.componentName).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.crtNameFilteredOptions = this.crtNameControl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.createdName).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''), map(value =>
      (Array.from(new Set(this.historyList.map(x => x.clientRefNo).filter(x => x))).sort())
        .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.caseStatusFilteredOptions = this.caseStatusFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.caseStatus).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.qcOwnerFilteredOptions = this.qcOwnerFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.qcOwner).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.screeningOwnerNameFilteredOptions = this.screeningOwnerNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.screeningOwnerName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.componentStatusFilteredOptions = this.componentStatusFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.componentStatus).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.reasonForDelayFilteredOptions = this.reasonForDelayFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.reasonForDelay).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  getTotalPages(totalRecords, rows) {
    if (this.historyFlag !== true) {
      // this.totalpages = Math.ceil((totalRecords) / rows);
      return Math.ceil((totalRecords) / rows);
    } else {
      // this.totalpages1 = Math.ceil((totalRecords) / rows);
      return Math.ceil((totalRecords) / rows);
    }
  }
  navigateNxtPrevPage(pageNo, rows) {
    if (this.historyFlag !== true) {
      this.currentPage1 = pageNo / rows;
      this.tempCurrentPage1 = this.currentPage1;
      // this.allcheck.setValue('');
    } else {
      this.currentPage1 = pageNo / rows;
      this.tempCurrentPage1 = this.currentPage1;
    }
  }
  navigatePage(pageNo, rowscount) {
    if (this.historyFlag !== true) {
      if (+pageNo > this.totalpages || +pageNo <= 0) {
        this.currentPage1 = this.tempCurrentPage1;
      } else {
        this.dtHistory.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
        this.tempCurrentPage1 = this.currentPage1;
      }
    } else {
      if (+pageNo > this.totalpages1 || +pageNo <= 0) {
        this.currentPage1 = this.tempCurrentPage1;
      } else {
        this.dtHistory.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
        this.tempCurrentPage1 = this.currentPage1;
      }
    }
  }
  back() {
    this.route.navigate(['dashboard/home']);
  }
  isCam() {
    return (this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null) || this.userData.teamName === 'CTS-CRTTeam';
  }
  openReOpen(screeningCompId: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to reopen this case?'
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
          if (action === this.common.DELETECONFIRMATION && this.screeningService.caseFlagType !== this.common.CLOSED) {
            this.cancelledReOpen(screeningCompId);
          }
          else {
            this.reOpenForm.get('screeningCompId')?.setValue(screeningCompId);
            this.reOpenForm.get('screeningStatusId')?.setValue(4);
            this.reOpenForm.get('screeningStatusName')?.setValue("Re-Open");
            this.reOpenForm.get('applicationId')?.setValue(this.userData.applicantId);
            this.reOpenForm.get('createdUserId')?.setValue(this.userData.userId);
            //this.reOpenForm.get('statusDate')?.setValue(new Date());

            this.verificationService.updateScreeningStatus(this.reOpenForm.value).subscribe(res => {
              if (res.success === true) {
                this.showTopCenter('success', 'Success Message', 'Re-Opened Successfully');
                this.getClosedComponentDetails();
              } else {
                this.showTopCenter('warn', 'Failure', 'Re-Opened Failed');
              }
            });

          }
        }
      });
    }
  }
  cancelledReOpen(screeningCompId: any) {
    this.screeningService.ReopenCancelledComponent(screeningCompId, this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('success', 'Success Message', 'Re-Opened Successfully');
        this.getNotApplicapleComponentDetails();
      } else {
        this.showTopCenter('warn', 'Failure', 'Re-Opened Failed');
      }
    });
  }
  exportAsExcelFile() {
    this.userData.applyPaging = false;
    const historyExcelList = this.historyList;
    if (this.screeningService.caseFlagType === this.common.SUBMISSION_HISTORY) {
      this.screeningService.getSubmissionHistory(this.userData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          this.exceldata(excelOutput);
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.QCREJECT) {
      //this.common.exportToExcel(this.qcRejectColumn, this.caseSubmissionList, 'Qc Reject');
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;
      this.screeningService.getScreeningQCRejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          this.excelQCRejectList = respBody;
          this.excelQCRejectList.forEach(m =>
            m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
          this.common.exportToExcel(this.qcRejectColumn, this.excelQCRejectList, 'QC Reject');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.NOTAPPLICABLE) {
      //this.common.exportToExcel(this.qcRejectColumn, this.caseSubmissionList, 'Cancelled');
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;
      this.screeningService.getNotApplicapleComponentDetails(this.dashboardCountVm).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          this.excelCancallList = respBody;
          this.common.exportToExcel(this.rejectColumn, this.excelCancallList, 'Cancelled');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.VEREJECT) {
      // this.common.exportToExcel(this.qcRejectColumn, this.caseSubmissionList, 'VE Reject');
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;
      this.screeningService.getScreeningVERejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          this.excelVRRejectlList = respBody;
          this.excelVRRejectlList.forEach(m =>
            m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
          this.common.exportToExcel(this.qcRejectColumn, this.excelVRRejectlList, 'VE Reject');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.REOPEN) {
      //this.common.exportToExcel(this.qcRejectColumn, this.caseSubmissionList, 'Re-Open Checks');
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;
      this.screeningService.GetReopenComponentDetails(this.dashboardCountVm).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          this.excelReopenList = respBody;
          //Added By Megala For -VTS2-2024-EMP-0129 sprint 16
          this.excelReopenList.forEach(m1 => {
            m1.deOwnerName = m1.deOwnerFirstName + ' ' + (m1.deOwnerMiddleName == null ? '' : ' ' +
              m1.deOwnerMiddleName) + (m1.deOwnerLastName == null ? '' : ' ' +
                m1.deOwnerLastName)
            m1.preQCScreenOwnerName = (m1.dePreQcOwnerFirstName != null) ? m1.dePreQcOwnerFirstName + ' ' + (m1.dePreQcOwnerMiddleName == null ? '' : ' ' +
              m1.dePreQcOwnerMiddleName) + (m1.dePreQcOwnerLastName == null ? '' : ' ' + m1.dePreQcOwnerLastName) : 'N/A'
          })
          this.excelReopenList.forEach(m =>
            m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
          this.common.exportToExcel(this.rejectColumn, this.excelReopenList, 'Re-Open Checks');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.BT_POPUP) {
      //this.common.exportToExcel(this.historycolumns, historyExcelList, 'BT Details');
      this.screeningService.getTatDelaylist(this.userData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body.verificationDet;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          excelOutput.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          this.common.exportToExcel(this.historycolumns, excelOutput, 'BT Details');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.WT_POPUP) {
      //this.common.exportToExcel(this.historycolumns, historyExcelList, 'WT Details');
      this.screeningService.getWTatlist(this.userData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body.verificationDet;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          excelOutput.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          this.common.exportToExcel(this.historycolumns, excelOutput, 'WT Details');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.NT_POPUP) {
      // this.common.exportToExcel(this.historycolumns, historyExcelList, 'NT Details');
      this.screeningService.getNTatlist(this.userData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body.verificationDet;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          excelOutput.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          this.common.exportToExcel(this.historycolumns, excelOutput, 'NT Details');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.CT_POPUP) {
      //this.common.exportToExcel(this.historycolumns, historyExcelList, 'CT Details');
      this.screeningService.getCTatlist(this.userData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body.verificationDet;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          excelOutput.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          this.common.exportToExcel(this.historycolumns, excelOutput, 'CT Details');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.VE_HISTORY) {
      this.mapUserDataToClosedData();
      this.screeningService.getVerificationCompletedHistory(this.closedCheckData).subscribe(resp => {
        if (resp) {
          const excelOutput = resp.body.verificationDet;
          excelOutput.map(m => m.candidateName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' '
            + m.candidateLastName);
          excelOutput.map(element => element.qcOwner = (element.ownerFirstName ? (element.ownerFirstName + (element.ownerMiddleName ? (' ' + element.ownerMiddleName) : '') +
            (element.ownerLastName ? (' ' + element.ownerLastName) : '')) : 'N/A'));
          excelOutput.map(element => this.datePipe.transform(element.submittedDate, 'yyyy-MM-dd'));
          this.exceldata(excelOutput);
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.FRREJECT) {
      //this.common.exportToExcel(this.qcRejectColumn, this.caseSubmissionList, 'FR Reject');
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;
      this.screeningService.getScreeningFRRejectComponentDetails(this.dashboardCountVm).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          this.excelFRRejectlList = respBody;
          this.excelFRRejectlList.forEach(m =>
            m.deOwnerName = m.invitationFlag ? 'N/A' : m.deOwnerName)
          this.common.exportToExcel(this.qcRejectColumn, this.excelFRRejectlList, 'FR Reject');
        }
      });
    } else if (this.screeningService.caseFlagType === this.common.CLOSED) {
      this.dashboardCountVm = JSON.parse(sessionStorage.getItem('user_data') as string);
      this.applypaging = false;

      this.screeningService.getClosedComponentDetails(this.userData).subscribe(resp => {
        if (resp) {
          const respBody = resp.body;
          if (this.userData.applicationId === 2) {
            this.excelCloseList = respBody.clientScreeningComponentDetails === null ? [] : respBody.clientScreeningComponentDetails;
          } else {
            this.excelCloseList = respBody.screeningComponent === null ? [] : respBody.screeningComponent;
          }
          this.common.exportToExcel(this.rejectColumn, this.excelCloseList, 'Closed Checks');
        }
      });
    }
    else if (this.screeningService.caseFlag === true) {
      this.assignDE.applyPaging = false;
      this.screeningService.getAssignedCaseDetails(this.assignDE).subscribe(res => {
        if (res) {
          //this.AssignedDEList = res.body;  
          this.caseExcelSubmissionList = res.body;
          this.caseExcelSubmissionList.forEach(ele =>
            ele.screeningOwnerFName = ele.screeningOwnerFName ? (ele.screeningOwnerFName + (ele.screeningOwnerMName ? (' ' + ele.screeningOwnerMName) : '') +
              (ele.screeningOwnerLName ? (' ' + ele.screeningOwnerLName) : '')) : 'N/A');
          this.common.exportToExcel(this.caseColumn, this.caseExcelSubmissionList, 'Submission List', true);
        }
      })
    }
    else if (this.screeningService.caseFlagType === this.common.PREQCCASE) {
      this.assignDE.applyPaging = false;
      this.screeningService.getPreQCScreeningDetails(this.assignDE).subscribe(res => {
        if (res) {
          // this.AssignedDEList = res.body;  
          this.caseExcelSubmissionList = res.body;
          this.caseExcelSubmissionList.map(m =>
            m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + '' + m.candidateLastName);
          this.caseExcelSubmissionList.forEach(m =>
            m.screeningOwnerFName = m.invitationFlag ? 'N/A' : m.screeningOwnerFName);
          this.common.exportToExcel(this.caseColumn, this.caseExcelSubmissionList, 'PreQc Submission', true);
        }
      })
    }
    else if (this.screeningService.caseFlagType === this.common.DASUBCHECK) {
      this.assignDE.applyPaging = false;
      this.screeningService.GetAssignedDASubCheckCaseDetails(this.assignDE).subscribe(res => {
        if (res) {
          //this.AssignedDEList = res.body;  
          this.caseExcelSubmissionList = res.body;
          // this.array = res.body;
          this.common.exportToExcel(this.caseColumn, this.caseExcelSubmissionList, 'DASubCheck Submission', true);
        }
      })
    }
    //Added By Megala For -VTS2-2024-EMP-0189 sprint 16

    else {
      if (this.screeningService.caseFlagType === this.common.PREQCREJECT) {
        this.common.exportToExcel(this.caseRejectColumn, this.caseSubmissionList, 'Case Submission');
      } else {
        this.common.exportToExcel(this.caseColumn, this.caseSubmissionList, 'Case Submission');
      }
    }
  }
  exceldata(excelOutput: any) {
    const historyExcelList = excelOutput;
    if (this.screeningService.caseFlagType === this.common.SUBMISSION_HISTORY) {
      this.common.exportToExcel(this.historycolumns, historyExcelList,
        this.screeningService.flagType === true ? 'Case Submission History' : 'Pre-QC Submission History');
    }
    else {
      this.common.exportToExcel(this.historycolumns, historyExcelList, 'Closed Checks');
    }
  }
  getSubcheckDetails(caseStatus: any) {
    const screenid1: any[] = [];
    // if (this.screeningService.caseFlag === true) {
    this.assignDE.userId = this.userData.userId;
    this.assignDE.deptId = this.userData.deptId;
    this.assignDE.teamId = this.userData.teamId;
    this.assignDE.subTeamId = this.userData.subTeamId;
    this.assignDE.teamName = this.userData.teamName;
    this.assignDE.subTeamName = this.userData.subTeamName;
    this.assignDE.caseNo = 0;
    this.assignDE.caseStatus = caseStatus;
    this.assignDE.applicationId = this.userData.applicationId;
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    } else {
      this.assignDE.caseStatus = 'Assigned';
      this.status = 'Assigned';
      this.assignDE.screeningOwnerId = this.userData.userId;
      this.ownerflag = true;
    }
    this.screeningService.GetAssignedSubCheckCaseDetails(this.assignDE)
      .subscribe(resp => {
        if (resp) {
          this.AssignedDEList = resp;
          this.caseSubmissionList = resp;
          this.array = resp;
          this.autocompleteData();
        }
      });
    // }
  }
  getDASubcheckDetails(caseStatus: any) {
    const screenid1: any[] = [];
    // if (this.screeningService.caseFlag === true) {
    this.assignDE.userId = this.userData.userId;
    this.assignDE.deptId = this.userData.deptId;
    this.assignDE.teamId = this.userData.teamId;
    this.assignDE.subTeamId = this.userData.subTeamId;
    this.assignDE.teamName = (this.userData.team === 'Admin Team' || this.userData.team === 'Super Admin Team') ? this.userData.team : this.userData.teamName;
    this.assignDE.subTeamName = this.userData.subTeamName;
    this.assignDE.caseNo = 0;
    this.assignDE.caseStatus = caseStatus;
    this.assignDE.pageSize = this.shievePageSize;
    this.assignDE.page = this.shievePageNo;
    this.assignDE.sorts = '';
    this.assignDE.applyPaging = this.applypaging;
    this.assignDE.needTotal = true;
    this.assignDE.applicationId = this.userData.applicationId;
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) {
      this.ownerflag = false;
    } else {
      this.assignDE.caseStatus = 'Assigned';
      this.status = 'Assigned';
      this.assignDE.screeningOwnerId = this.userData.userId;
      this.ownerflag = true;
    }
    this.applyPagination();
    this.screeningService.GetAssignedDASubCheckCaseDetails(this.assignDE)
      .subscribe(resp => {
        if (resp) {
          this.AssignedDEList = resp.body;
          this.shieveTotalCount = resp.headers.get('X-Total-Count');
          this.caseSubmissionList = resp.body;
          this.array = resp.body;
          this.autocompleteData();
        }
      });
    // }
  }
  searchGlobal(value: any) {

  }

  checkPeriod(): void {
    const fromDate = this.closeCheckForm.get('submittedFromDate')?.value;
    const toDate = this.closeCheckForm.get('submittedToDate')?.value;
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      this.closeCheckForm.get('submittedToDate')?.setValue(null);
      this.showTopCenter('warn', 'Failure Message', 'To Date should be greater than or equal to From Date');
    }
  }

}
