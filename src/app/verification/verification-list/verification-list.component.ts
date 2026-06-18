import { Component, OnInit, ViewChild, ViewChildren, AfterViewInit, Input, OnDestroy, Injectable, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UserData } from 'src/app/common-methods/models/user';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { Subscription } from 'rxjs';

export class AssignOwner {
  assignScreeningCompId: any[] = [];
  screeningOwnerId: number;
  loginUserDetVm: UserData;
}
export class SearchVm {
  screenCompId: number;
  loggedIn: number;
  teamLeadFlag: boolean;
  refNo: string;
  deptId: number;
  additionalfeesearchflag: boolean = false;
  componentfeesearchflag: boolean = false;
  pageSize: number;
  page: number;
  filters: string;
  sorts: string;
  applyPaging: boolean;
  needTotal: boolean;
}

@Component({
  standalone: false,
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.css'],
  providers: [DatePipe],
})
export class VerificationListComponent implements OnInit, OnDestroy {
  subcription!: Subscription;
  fileDetails: any = null;
  screenType: string;
  showallFlag = false;
  SearchCriFilter = false;
  VerificationSearchForm: UntypedFormGroup;
  currentFlag = false;
  selectall = new UntypedFormControl();
  screeningOwner = new UntypedFormControl('', Validators.required);
  userData: UserData;
  applicationId: any;
  screenAuth: any = {};
  verificationDetails: any;
  dialogRef: any;
  screeningOwnerName: string;
  showBulkUpload = false;
  btnAddUpload = true;
  btnReAssign = false;
  viewAssign = false;
  verSt: any;
  @ViewChild('assignPopUp', { static: false }) assignPopUp!: any;
@ViewChild('assignOrgPopUp', { static: false }) assignOrgPopUp!: TemplateRef<any>;
@ViewChild('verificationIdTrigger', { static: false }) verificationIdTrigger!: MatMenuTrigger;
@ViewChild('compNameCtrlTrigger', { static: false }) compNameCtrlTrigger: MatMenuTrigger;
  // @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  // @ViewChild('assignOrgPopUp', { static: true }) assignOrgPopUp!: TemplateRef<any>;
  // @ViewChild('verificationIdTrigger', { static: true }) verificationIdTrigger!: MatMenuTrigger;
  ownerAssigned;
  menubar = [{ menuName: 'Not Assigned' }, { menuName: 'Assigned' }];
  screeningOwnerList = [{ screeningOwnerName: 'Dhenral', screeningOwnerId: 1 }, { screeningOwnerName: 'Barath', screeningOwnerId: 2 }];
  screeningOwnerId: any;
  clientList: any;
  vendorList: any;
  componentList: any;
  statusList: any;
  priorityList: any;
  verificationId: any;
  screeningIdList: [];
  SownerList: any;
  Reowner: any;
  clientReList: any;
  candidateList: any;
  componentControl!: AutoCompleteDropDown;
  vendorControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  priorityControl!: AutoCompleteDropDown;
  screeningControl!: AutoCompleteDropDown;
  clientControl!: AutoCompleteDropDown;
  verificationControl!: AutoCompleteDropDown;
  candidateControl!: AutoCompleteDropDown;
  ownerControl!: AutoCompleteDropDown;
  ownerOrginalControl!: AutoCompleteDropDown;
  ReassignownerControl!: AutoCompleteDropDown;
  clientRefControl!: AutoCompleteDropDown;
  veCols = [{ header: 'Candidate Name', field: 'candidateFullName' }, { header: 'Client Ref No', field: 'clientRefNo' },
  { header: 'Transaction Id', field: 'transactionId' },
  { header: 'Client Name', field: 'clientName' }, { header: 'Site Name', field: 'siteName' }, { header: 'Verification Id', field: 'verificationId' }, { header: 'Screening Id', field: 'clientScreeningId' },
  { header: 'Vendor Name', field: 'vendorName' }, { header: 'Component Name', field: 'componentName' },
  { header: 'Screening Owner', field: 'screeningOwnerName' },
  { header: 'Component Status', field: 'componentStatus' }, { header: 'Functional Entity', field: 'functionalEntity' }, { header: 'Report Source Name', field: 'reportSourceName' }, { header: 'Date Of Birth', field: 'dateOfBirth' },
  { header: 'Father Name', field: 'fatherName' }, { header: 'Component DueDate', field: 'componentDueDate' }, { header: 'WorkFlow Status', field: 'workFlowStatus' },
  { header: 'Case Status', field: 'caseStatus' }, { header: 'Case Initiation Date', field: 'requestDate' }, { header: 'DE Submitted By', field: 'createdName' }, { header: 'Call Back Date', field: 'callbackDate' },
  { header: 'Country', field: 'country' }, { header: 'InprogressDays', field: 'inProgressDays' }, { header: 'TatDays', field: 'tatDays' }
    , { header: 'Rejection Comments', field: 'rejectRemarks' }];

  identityDeptVeCols = [{ header: 'Verification Id', field: 'verificationId' }, { header: 'Client Ref No', field: 'clientRefNo' },
  { header: 'Client Name', field: 'clientName' }, { header: 'Site Name', field: 'siteName' }, { header: 'Client Account Manager', field: 'clientAccountManager' },
  { header: 'Candidate Name', field: 'candidateFullName' }, { header: 'Report Source Name', field: 'candidateFullName' },
  { header: 'Father Name', field: 'fatherName' }, { header: 'Date Of Birth', field: 'dateOfBirth' },
  { header: 'Gender', field: 'gender' }, { header: 'Address', field: 'address' },
  { header: 'Case Priority', field: 'casePriority' }, { header: 'Component Name', field: 'componentName' },
  { header: 'Functional Entity', field: 'functionalEntity' }, { header: 'Submitted Date', field: 'submittedDate' },
  { header: 'Comp Initiation Date', field: 'compInitiationDate' }, { header: 'Due Date', field: 'dueDate' },
  { header: 'Reopen Date', field: 'reopenDate' }, { header: 'Insuff Raised Date', field: 'insuffRaisedDate' },
  { header: 'Insuff Cleared Date', field: 'insuffClearedDate' }, { header: 'Vendor Name', field: 'vendorName' },
  { header: 'Status', field: 'status' }, { header: 'QC Status', field: 'qcStatus' },
  { header: 'WorkFlow Status', field: 'workFlowStatus' },
  {
    header: 'Rejection Comments', field: 'rejectRemarks'
  }
  ];

  addressDeptVeCols = [{ header: 'Verification Id', field: 'verificationId' }, { header: 'Ref No', field: 'clientRefNo' },
  { header: 'Client Name', field: 'clientName' }, { header: 'Site Name', field: 'siteName' }, { header: 'Candidate Name', field: 'candidateFullName' },
  { header: 'Father Name', field: 'fatherName' },
  { header: 'Component Name', field: 'componentName' },
  { header: 'Address Type', field: 'addressType' },
  { header: 'Address', field: 'address' },
  { header: 'Landmark', field: 'landmark' },
  { header: 'Contact No', field: 'contactNo' },
  { header: 'Alternate Contact No', field: 'alterContactNo' },
  { header: 'Location', field: 'location' },
  { header: 'State', field: 'state' },
  { header: 'District', field: 'district' },
  { header: 'Pincode', field: 'pincode' },
  { header: 'Status', field: 'status' },
  { header: 'Vendor Name', field: 'vendorName' },
  { header: 'Submitted Date', field: 'submittedDate' },
  { header: 'Client Account Manager', field: 'clientAccountManager' },
  { header: 'WorkFlow Status', field: 'workFlowStatus' },
  { header: 'Component Tat Status', field: 'tatStatus' },
  { header: 'Case Created Date', field: 'caseCreatedDate' },
  { header: 'Case Initiation Date', field: 'requestDate' },
  { header: 'Scope Submitted Date', field: 'scopeSubmittedDate' },
  { header: 'Due Date', field: 'dueDate' }, { header: 'Insuff Raised Remarks', field: 'insuffRaisedRemarks' },
  { header: 'Insuff Cleared Remarks', field: 'insuffClearedRemarks' }];

  assignedList: any[] = [];
  unAssignedList: any[] = [];
  verificationList: any[] = [];
  assiginownerList: AssignOwner = new AssignOwner();
  ownerList: any;
  empInsList: any;
  countryList: any;
  messages: number;
  showdSearch = false;
  showSearchResult = false;
  hideToggle;

  // FIX: null instead of 'Not Assigned' — shows ALL records by default.
  // 'Not Assigned' was filtering out Assigned records → empty list when all screeningOwnerId > 0
  assignControl = new UntypedFormControl(null);

  expandedSC = false;
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  verificationBindList: any[] = [];
  isDesc: boolean;
  column: any;
  direction: number;
  searchValueArr: any[] = [];
  itemPerPage;
  page = 1;
  owner: any;
  routePath = 'Verification / Verification Transaction List';
  btnSearch = true;
  @Input() filterLength: number;
  @Input() reOpenSearchFlag: boolean = false;
  @Input() modifyAdditionalFeeFlag: boolean = false;
  @Input() modifyComponentFeeFlag: boolean = false;
  searchPage = false;
  verifyId = new UntypedFormControl('', Validators.required);
  searchVm: SearchVm = new SearchVm();
  isSearch = true;
  filterOwnerName = new UntypedFormControl();
  filterFlag = false;
  initDatectrl = new UntypedFormControl('');
  fromDate = '';
  toDate = '';
  // @ViewChild('compNameCtrlTrigger', { static: true }) compNameCtrlTrigger: MatMenuTrigger;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 20;
  menuData: any;
  domNewExportFlag: boolean = false;
  multipleClientFlag: boolean = false;

  constructor(private authService: AuthService, public commonService: CommonService, private verificationService: VerificationService,
    public dialog: MatDialog, private message: MessageService, private dateP: DatePipe, public router: Router, public screeningService: ScreeningService) {
  }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.commonService.VERIFICATION_ROUTER = this.router.url;
    this.menuData = JSON.parse(sessionStorage.getItem('curMenu_data'));
    this.commonService.reOpenSearchFlag = this.reOpenSearchFlag;
    this.commonService.modifyAdditionalFeeFlag = this.modifyAdditionalFeeFlag;
    this.commonService.modifyComponentFeeFlag = this.modifyComponentFeeFlag;

    if (this.commonService.screenName === 'Address Tagging & Status Upload' || this.commonService.screenName === 'Candidate document upload') {
      this.routePath = 'Verification / ' + this.commonService.screenName;
      this.screenType = (this.commonService.screenName === 'Address Tagging & Status Upload') ? "addressTagging" : "candidateDocumentUpload";
      this.showBulk();
    } else {
      this.initDefaultData();
      this.initFormGroup();
      this.btnAddUpload = true;
      if (this.verificationService.verificationSearchData && this.verificationService.verificationSearchData.length > 0) {
        this.verificationList = this.verificationService.verificationSearchData;
        this.assignControl.setValue(null);
        this.gridDataShowbyUserId(this.verificationList);
        this.getVerificationList();
      } else {
        if (this.reOpenSearchFlag !== true && this.modifyAdditionalFeeFlag !== true && this.modifyComponentFeeFlag !== true) {
          this.getVerificationSearchDetails();
        }
      }
      if (this.reOpenSearchFlag !== true && this.modifyAdditionalFeeFlag !== true && this.modifyComponentFeeFlag !== true) {
        this.GetUserList();
      }
      this.assignControl.setValue(this.verificationService.assignedOrNotAssigned === 'Not Assigned' ? 'Not Assigned' : 'Assigned');
      if (this.verificationService.backFlag === true) {
        this.searchValueArr = this.verificationService.searchArray;
        this.assignControl.setValue(this.verificationService.assControl);
        this.VerificationSearchForm.setValue(this.verificationService.searchValue);
      }
    }

    if (this.reOpenSearchFlag === true) {
      this.searchVerifiction();
      this.commonService.VE = false;
      this.routePath = 'Verification / Re-Open Search';
    }
    if (this.modifyAdditionalFeeFlag === true) {
      this.searchVerifiction();
      this.commonService.VE = false;
      this.routePath = 'Verification / Modify Additional Fee';
    }
    if (this.modifyComponentFeeFlag === true) {
      this.searchVerifiction();
      this.commonService.VE = false;
      this.routePath = 'Verification / Modify Component Fee';
    }
    if (this.commonService.camRejection === true) {
      this.commonService.VE = false;
      this.routePath = 'Verification /  CAM Rejection List';
    }

    if (this.commonService.reassigned == true) {
      if ((this.userData.teamLeadFlag == true || this.userData.subTeamLeadFlag == true) && (this.userData.teamName ===
        'EmploymentIndia' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'EmploymentAbroad' || this.userData.teamName === 'EducationTeam' || this.userData.
          teamName === 'AddressTeam' || this.userData.teamName === 'CriminalTeam' || this.userData.teamName === 'IdentityTeam' ||
        this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-CriminalTeam' || this.userData.teamName === 'CTS-AddressTeam'
        || this.userData.teamName === 'EducationOverseas' || this.userData.teamName === 'EmploymentTechM')) {
        this.btnReAssign = true;
        this.btnSearch = false;
        this.btnAddUpload = false;
      } else {
        this.viewAssign = true;
      }
      this.veCols.push({ header: 'Reassign Owner', field: 'reAssignScreeningOwnerName' });
      this.routePath = 'Configure / Verification / Reassigned Checks';
    }
    if (this.commonService.redcaseFlag === true) {
      this.routePath = 'Configure / Verification / Red Case Approval';
    }
    this.itemPerPage = 10;
    this.verificationService.closedCheck = false;
    this.verificationService.globalSearchFlag = false;
  }

  GetOwnerUserList() {
    this.verificationService.GetUserList(this.userData).subscribe(res => {
      if (res) {
        this.Reowner = res;
      }
    });
  }

  GetUserList() {
    this.verificationService.GetUserList(this.userData).subscribe(res => {
      if (res) {
        this.owner = res;
      }
    });
  }

  getFlag() {
    return (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) && (this.userData.teamName ===
      'EmploymentIndia' || this.userData.teamName === 'CTS-EmploymentTeam' || this.userData.teamName === 'EmploymentAbroad' || this.userData.teamName === 'EducationTeam' || this.userData.
        teamName === 'AddressTeam' || this.userData.teamName === 'CriminalTeam' || this.userData.teamName === 'IdentityTeam' ||
      this.userData.teamName === 'CTS-IdentityTeam' || this.userData.teamName === 'CTS-EducationTeam' || this.userData.teamName === 'CTS-CriminalTeam' || this.userData.teamName === 'CTS-AddressTeam'
      || this.userData.teamName === 'EducationOverseas' || this.userData.teamName === 'EmploymentTechM') &&
      this.commonService.commonVeFlag !== 'toClose' && this.commonService.commonVeFlag !== 'notSentToQc' && !this.reOpenSearchFlag && !this.modifyAdditionalFeeFlag && !this.modifyComponentFeeFlag &&
      this.commonService.commonVeFlag !== 'singlePendingChecks' && this.commonService.commonVeFlag !== 'normalChecks' && this.commonService.commonVeFlag !== 'subChecks' && this.commonService.commonVeFlag !== 'CamRejection' && this.commonService.commonVeFlag !== 'normalChecks';
  }

  getFilterLen(c): string {
    this.filterFlag = true;
    this.filterLength = c;
    return 'listrow';
  }

  searchVerifiction() {
    this.btnAddUpload = false;
    this.searchPage = true;
    this.verifyId.reset();
  }

  closeSearch() {
    if (this.searchPage) {
      this.btnAddUpload = true;
      this.searchPage = false;
      this.isSearch = true;
      this.getVerificationSearchDetails();
      this.router.navigate(['dashboard/verification/verification']);
      this.routePath = 'Verification / Verification Transaction List';
    } else {
      this.router.navigate(['dashboard/home']);
    }
    this.verificationService.closedCheck = false;
    this.verificationService.globalSearchFlag = false;
  }

  searchFunc() {
    this.verifyId.markAsTouched();
    if (this.verifyId.valid) {
      this.getVerificationSearchDetails();
    }
  }

  toggle(data: any) {
    this.showSearchResult = !this.showSearchResult;
    if (this.showSearchResult) {
      this.showdSearch = true;
    } else {
      this.showdSearch = false;
    }
  }

  initFormGroup() {
    this.VerificationSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl(null),
      verificationId: new UntypedFormControl(null),
      screeningId: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      candidateFullName: new UntypedFormControl(null),
      empInsName: new UntypedFormControl(null),
      country: new UntypedFormControl(null),
      componentName: new UntypedFormControl(null),
      vendorName: new UntypedFormControl(null),
      componentStatus: new UntypedFormControl(null),
      prioritylookupId: new UntypedFormControl(null),
      ownerName: new UntypedFormControl(null),
      closedBy: new UntypedFormControl(null),
      LastCommunicationDate: new UntypedFormControl(null),
      callbackDate: new UntypedFormControl(null),
      clientUpdateDate: new UntypedFormControl(null),
      reqFromDate: new UntypedFormControl(null),
      reqToDate: new UntypedFormControl(null),
      closureFromDate: new UntypedFormControl(null),
      closureToDate: new UntypedFormControl(null),
      screeningOwnerName: new UntypedFormControl(null),
      screeningorgOwnerName: new UntypedFormControl(null),
      screeningRegOwnerName: new UntypedFormControl(null),
      assignStatus: new UntypedFormControl(null),
    });
  }

  initDefaultData() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.userData.filters = '';

    if (this.commonService.verifyOrQcRejected !== true) {
      if (this.verificationService.veType === 'Assigned' || this.verificationService.veType === 'Not Assigned') {
        this.userData.veOpenCheck = true;
        this.commonService.commonVeFlag = null;
        this.verificationService.assignedOrNotAssigned = this.verificationService.veType;
      }
      if (this.verificationService.assignedOrNotAssigned === '') {
        this.commonService.commonVeFlag = this.verificationService.veType ? this.verificationService.veType : null;
      }
    }

    if (this.commonService.redcaseFlag === true) {
      this.userData.filters = 'componentStatusId!=2,componentStatusId!=3,componentStatusId!=7';
    } else if (this.commonService.reassigned === true) {
      this.userData.filters = 'reAssignFlag == true';
    } else if (this.commonService.camRejection === true) {
    } else if (this.commonService.commonVeFlag === 'pendingChecks') {
      this.userData.filters = 'componentStatusId!=2,componentStatusId!=3,componentStatusId!=7';
    } else if (this.commonService.commonVeFlag === 'normalChecks') {
      this.userData.normalCheckFlag = true;
    } else if (this.commonService.commonVeFlag === 'subChecks') {
      this.assignControl.setValue(null);
      this.userData.veOpenCheck = true;
      this.userData.filters = 'subCheckFlag==true';
    } else if (this.commonService.commonVeFlag === 'reOpenChecks') {
      this.userData.filters = this.verificationService.filters;
    } else {
      if (this.commonService.commonVeFlag !== 'notSentToQc' && this.commonService.commonVeFlag !== 'reOpenChecks' && this.commonService.commonVeFlag !== 'toClose' &&
        this.commonService.commonVeFlag !== 'singlePendingChecks' && this.commonService.commonVeFlag !== 'normalChecks' && this.commonService.verifyOrQcRejected != true) {
        if (this.verificationService.assignedOrNotAssigned && this.verificationService.assignedOrNotAssigned.length > 0) {
          this.userData.filters = 'componentStatusId==2|3';
          if (this.verificationService.assignedOrNotAssigned === 'Not Assigned') {
            this.userData.filters = this.userData.filters + ',' + 'screeningOwnerId==0';
          } else if (this.verificationService.assignedOrNotAssigned === 'Assigned') {
            this.userData.filters = this.userData.filters + ',' + 'screeningOwnerId>0';
          }
        }
      }
    }

    if (this.commonService.redcaseFlag === true) {
      this.userData.redCaseFlag = true;
    }
    if (this.commonService.commonVeFlag === 'singlePendingChecks') {
      this.userData.singleCheck = true;
    } else if (this.commonService.verifyOrQcRejected === true) {
      this.userData.qcRejectFlag = true;
    }

    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData.needTotal = false;
    this.userData.applyPaging = true;
  }

  getSearchValues() {
    this.searchValueArr = [];
    for (const ctrl in this.VerificationSearchForm.controls) {
      if (this.VerificationSearchForm.get(ctrl).value !== null
        && this.VerificationSearchForm.get(ctrl).value !== ''
        && this.VerificationSearchForm.get(ctrl).value !== 0) {
        if (ctrl !== 'LoginUserDetVm') {
          this.searchValueArr.push(this.VerificationSearchForm.get(ctrl).value);
        }
      }
    }
  }

  getPropertyValue(event: any) {
    this.filterFlag = false;
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
      for (const ctrl in this.VerificationSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }

  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.VerificationSearchForm.controls) {
      if (ctrl === key) {
        this.VerificationSearchForm.get(ctrl).setValue('');
      }
      if ((ctrl === 'reqFromDate' && ctrl === key) || (ctrl === 'reqToDate' && ctrl === key)) {
        this.verificationList = this.commonService.CloneObject(this.verificationDetails);
      }
    }
  }

  downloadExcel1() {
    if (this.searchValueArr.length > 0) {
      let xlList = this.commonService.CloneArray(this.verificationList);
      this.searchValueArr.forEach(element => {
        xlList = xlList.filter(x => x[element.propertyName] === element.value);
      });
      if (this.userData.deptId == 8) {
        this.commonService.exportToExcel(this.identityDeptVeCols, xlList, 'Verification');
      } else {
        this.commonService.exportToExcel(this.veCols, xlList, 'Verification');
      }
    } else {
      if (this.userData.deptId == 8) {
        this.commonService.exportToExcel(this.identityDeptVeCols, this.verificationList, 'Verification');
      } else {
        this.commonService.exportToExcel(this.veCols, this.verificationList, 'Verification');
      }
    }
  }

  downloadExcel() {
    this.userData.sorts = '';
    if (this.verificationList.length > 0) {
      this.applyPagination(true);
      if (this.commonService.verifyOrQcRejected === true && this.commonService.redcaseFlag != true && this.commonService.reassigned != true) {
        this.verificationService.GetVerificationQcRejectDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.shieveExcel(this.verificationDetails);
            this.userData.pageSize = this.shievePageSize;
          }
        });
      } else if (this.commonService.camRejection === true && this.commonService.redcaseFlag != true && this.commonService.reassigned != true) {
        this.verificationService.GetVerificationCAMRejectDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.shieveExcel(this.verificationDetails);
            this.userData.pageSize = this.shievePageSize;
          }
        });
      } else if (this.commonService.redcaseFlag === true) {
        this.verificationService.GetVerificationRedEduDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.shieveExcel(this.verificationDetails);
            if (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CRTIndia'
              || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') {
              this.assignControl.setValue(null);
            }
          }
        });
      } else if (this.commonService.modifyAdditionalFeeFlag === true || this.commonService.modifyComponentFeeFlag == true) {
        this.applyFeePagination(true);
        this.verificationService.GetComponentDetailsSearch(this.searchVm).subscribe(resp => {
          if (resp.body.verificationDetailsVm.length > 0) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res.verificationDetailsVm;
            this.shieveExcel(this.verificationDetails);
          }
        });
      } else if (this.commonService.reassigned === true) {
        this.verificationService.GetReAssignVerificationDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.shieveExcel(this.verificationDetails);
            if (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CRTIndia'
              || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') {
              this.assignControl.setValue(null);
            }
          }
        });
      } else if (this.commonService.currentEmp === true) {
        this.userData.filters = '';
        this.verificationService.GetVerificationCurrentEmpDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.shieveExcel(this.verificationDetails);
          }
        });
      } else {
        this.GetVerificationCompDetails(true);
      }
    }
  }

  getVerificationSearchDetails() {
    if (this.searchPage === true) {
      this.searchVm.loggedIn = this.userData.userId;
      this.searchVm.teamLeadFlag = this.userData.teamLeadFlag;
      const cId = this.commonService.getNuumberFromString(this.verifyId.value);
      this.searchVm.screenCompId = Number(cId);
      this.searchVm.refNo = this.verifyId.value;
      this.searchVm.deptId = this.userData.deptId;
      this.searchVm.additionalfeesearchflag = this.commonService.modifyAdditionalFeeFlag;
      this.searchVm.componentfeesearchflag = this.commonService.modifyComponentFeeFlag;

      if (this.searchVm.screenCompId > 0) {
        this.applyFeePagination();
        this.verificationService.GetComponentDetailsSearch(this.searchVm).subscribe(resp => {
          if (resp.body.verificationDetailsVm.length > 0) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationList = res.verificationDetailsVm;
            this.getVerificationList();
            this.searchPage = false;
            this.isSearch = false;
            this.verificationService.backFlag = false;
          } else {
            this.showTopCenter('warn', 'Failure Message', 'No records for this Client Ref No/Verification Id' + ' ' + this.verifyId.value);
          }
        });
      }
    } else {
      if (this.commonService.verifyOrQcRejected === true && this.commonService.redcaseFlag != true && this.commonService.reassigned != true) {
        this.applyPagination();
        this.verificationService.GetVerificationQcRejectDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            if (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CRTIndia'
              || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') {
              this.assignControl.setValue(null);
            }
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.gridDataShowbyUserId(this.verificationDetails);
            this.getVerificationList();
          }
        });
      } else if (this.commonService.verifyOrQcRejected === false && this.commonService.currentEmp === true && this.commonService.redcaseFlag != true) {
        this.currentFlag = true;
        this.userData.filters = '';
        this.applyPagination();
        this.verificationService.GetVerificationCurrentEmpDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.componentList = (this.componentList ?? []).filter(s => s.name == "Employment (HR)");
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            if (this.userData.applicationId === 2) {
              this.verificationDetails = res?.clientVerificationDet ?? [];
            } else {
              this.verificationDetails = res?.verificationDet ?? [];
            }
            this.currentFlag = false;
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.gridDataShowbyUserId(this.verificationDetails);
            this.getVerificationList();
          }
        });
      } else if (this.commonService.redcaseFlag === true) {
        this.applyPagination();
        this.verificationService.GetVerificationRedEduDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            if (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CRTIndia'
              || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') {
              this.assignControl.setValue(null);
            }
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.gridDataShowbyUserId(this.verificationDetails);
            this.getVerificationList();
          }
        });
      } else if (this.commonService.reassigned === true) {
        this.applyPagination();
        this.verificationService.GetReAssignVerificationDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.shieveTotalCount = resp.headers.get('X-Total-Count');
            const res = resp.body;
            this.verificationDetails = res?.verificationDet ?? [];
            if (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.teamName === 'CRTIndia'
              || this.userData.teamName === 'CRTTechMahindra' || this.userData.teamName === 'CRTAbroad') {
              this.assignControl.setValue(null);
            }
            this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
              (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
            this.gridDataShowbyUserId(this.verificationDetails);
            this.getVerificationList();
          }
        });
      } else {
        this.GetVerificationCompDetails();
      }
    }
  }

  GetVerificationCompDetails(excelFlag = false) {
    if (this.commonService.verifyOrQcRejected !== true) {
      if (this.verificationService.veType === 'Assigned' || this.verificationService.veType === 'Not Assigned') {
        this.commonService.commonVeFlag = null;
        this.verificationService.assignedOrNotAssigned = this.verificationService.veType;
      }
      if (this.verificationService.assignedOrNotAssigned === '') {
        this.commonService.commonVeFlag = this.verificationService.veType ? this.verificationService.veType : null;
      }
    }

    if (this.commonService.redcaseFlag === true) {
      this.userData.filters = 'componentStatusId!=2,componentStatusId!=3,componentStatusId!=7';
    }

    if (this.commonService.camRejection === true) {
      this.userData.camRejectFlag = true;
    } else {
      this.userData.camRejectFlag = false;
    }

    if (this.commonService.reassigned === true) {
      this.userData.filters = 'reAssignFlag == true';
    } else if (this.commonService.commonVeFlag === 'pendingChecks') {
      this.userData.filters = 'componentStatusId!=2,componentStatusId!=3,componentStatusId!=7';
    } else if (this.commonService.commonVeFlag === 'subChecks') {
      this.assignControl.setValue(null);
      this.userData.filters = 'subCheckFlag==true';
    } else if (this.commonService.commonVeFlag === 'reOpenChecks') {
      this.userData.filters = this.verificationService.filters;
    } else if (this.commonService.currentEmp == true) {
      this.userData.filters = '';
    } else {
      if (this.commonService.commonVeFlag !== 'notSentToQc' && this.commonService.commonVeFlag !== 'reOpenChecks' && this.commonService.commonVeFlag !== 'toClose' &&
        this.commonService.commonVeFlag !== 'singlePendingChecks' && this.commonService.commonVeFlag !== 'normalChecks' && this.commonService.verifyOrQcRejected != true) {
        if (this.verificationService.assignedOrNotAssigned && this.verificationService.assignedOrNotAssigned.length > 0) {
          this.userData.filters = 'componentStatusId==2|3';
          if (this.verificationService.assignedOrNotAssigned === 'Not Assigned') {
            this.userData.filters = this.userData.filters + ',' + 'screeningOwnerId==0';
          } else if (this.verificationService.assignedOrNotAssigned === 'Assigned') {
            this.userData.filters = this.userData.filters + ',' + 'screeningOwnerId>0';
          }
        }
      }
    }

    this.applyPagination(excelFlag);

    if (this.commonService.commonVeFlag === 'singlePendingChecks') {
      this.userData.singleCheck = true;
    }

    this.verificationService.GetVerificationCompDetails(this.userData).subscribe(resp => {
      this.shieveTotalCount = resp.headers.get('X-Total-Count');
      const res = resp.body;
      if (res) {
        this.verificationDetails = res?.verificationDet ?? [];
        this.verificationDetails.map(m => m.componentName = (this.commonService.getCompNameByIndex((m.componentName +
          (m.subCompName ? (' - ' + m.subCompName) : '')), m.compIndex, m.compMaxNo, m.subCompMaxNo)));
        if (excelFlag === true) {
          this.shieveExcel(this.verificationDetails);
          this.userData.pageSize = this.shievePageSize;
        } else {
          this.gridDataShowbyUserId(this.verificationDetails);
          this.getVerificationList();
        }
      }
    });
  }

  shieveExcel(verificationDetails: any) {
    this.domNewExportFlag = false;
    const verificationList = verificationDetails;
    const ClientCategoryIds = verificationList.filter((e) => e.clientCategoryId === this.commonService.domesticCategoryId);
    if ((verificationList.length == ClientCategoryIds.length) || this.multipleClientFlag == false) {
      this.domNewExportFlag = true;
    }
    verificationList.map(m => m.fqcByFN = m.fqcByName ? (m.fqcByName.firstName ? (m.fqcByName.firstName + (m.fqcByName.middleName ? (' ' + m.fqcByName.middleName) : '')
      + (m.fqcByName.lastName ? (' ' + m.fqcByName.lastName) : '')) : null) : null);
    verificationList.map(m => m.frOwnerFN = m.frOwnerFN ? (m.frOwnerFN + (m.frOwnerMN ? (' ' + m.frOwnerMN) : '')
      + (m.frOwnerLN ? (' ' + m.frOwnerLN) : '')) : null);
    verificationList.map(m =>
      m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' ' + m.candidateLastName);
    verificationList.map(m => {
      if (m.componentName) {
        if (m.componentName.startsWith("Digital Address Verification")) {
          m.componentName = "Digital Address Verification";
        } else if (m.componentName.startsWith("Address")) {
          m.componentName = "Address";
        }
      }
    });
    verificationList.map(m =>
      m.address = m.address ? (m.address.addressId === this.screeningService.defaultAddressId) ?
        "Not Provided"
        : (m.address.addLine1 ? (m.address.addLine1) : '') +
        (m.address.addLine2 ? (', ' + m.address.addLine2) : '') + (m.address.addLine3 ? (', ' +
          m.address.addLine3) : '') + (m.address.place ? (', ' + m.address.place) : '') +
        (m.address.city ? (', ' + m.address.city) : '') + (m.address.district ? (',' + m.address.district) : '') +
        (m.address.state ? (',' + m.address.state) : '') +
        (m.address.country ? (', ' + m.address.country) : '') +
        (m.address.postalCode ? (' - ' + m.address.postalCode) : '') : ''
    );
    if (this.userData.deptId == 8 && this.domNewExportFlag == true) {
      this.commonService.exportToExcel(this.identityDeptVeCols, verificationList, 'Verification');
    } else if ((this.userData.deptId == 2 || this.userData.deptId == 22) && (this.verificationService.veType === 'Assigned' || this.verificationService.veType === 'Not Assigned' ||
      this.verificationService.veType === 'pendingChecks' || this.verificationService.veType === 'ReassignChecks')) {
      this.commonService.exportToExcel(this.addressDeptVeCols, verificationList, 'Verification');
    } else {
      this.commonService.exportToExcel(this.veCols, verificationList, 'Verification');
    }
  }

  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getVerificationSearchDetails();
  }

  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.shievePageSize = this.shieveTotalCount;
      this.showallFlag = true;
      this.getVerificationSearchDetails();
    }
  }

  applyFeePagination(excelFlag = false) {
    const baseFilter = this.searchVm.filters ?? '';
    let filter = baseFilter;
    if (this.VerificationSearchForm.value.clientName && this.VerificationSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName==' + this.VerificationSearchForm.value.clientName;
    }
    if (this.VerificationSearchForm.value.screeningId) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientScreeningId@=*' + this.VerificationSearchForm.value.screeningId;
    }
    if (this.VerificationSearchForm.value.clientRefNo) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=*' + this.VerificationSearchForm.value.clientRefNo;
    }
    if (this.VerificationSearchForm.value.componentName && this.VerificationSearchForm.get('componentName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'componentName==' + this.VerificationSearchForm.value.componentName;
    }
    if (this.VerificationSearchForm.value.candidateFullName) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateFirstName@=*' + this.VerificationSearchForm.value.candidateFullName;
    }
    if (this.VerificationSearchForm.value.componentStatus && this.VerificationSearchForm.get('componentStatus')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'componentStatus==' + this.VerificationSearchForm.value.componentStatus;
    }
    if (this.VerificationSearchForm.value.vendorName && this.VerificationSearchForm.get('vendorName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'vendorName==' + this.VerificationSearchForm.value.vendorName;
    }
    if (this.VerificationSearchForm.value.verificationId) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=*' + this.VerificationSearchForm.value.verificationId;
    }
    if (this.VerificationSearchForm.value.screeningOwnerName && this.VerificationSearchForm.get('screeningOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'ScreeningOwnerName==' + this.VerificationSearchForm.value.screeningOwnerName;
    }
    if (this.VerificationSearchForm.value.prioritylookupId && this.VerificationSearchForm.get('prioritylookupId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'priorityLookUp==' + this.VerificationSearchForm.value.prioritylookupId;
    }
    if (this.VerificationSearchForm.value.screeningorgOwnerName && this.VerificationSearchForm.get('screeningorgOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'orginalScreeningOwner==' + this.VerificationSearchForm.value.screeningorgOwnerName;
    }
    if (this.VerificationSearchForm.value.screeningRegOwnerName && this.VerificationSearchForm.get('screeningRegOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'reAssignScreeningOwner==' + this.VerificationSearchForm.value.screeningRegOwnerName;
    }
    this.searchVm.pageSize = excelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.searchVm.page = this.shievePageNo;
    this.searchVm.filters = filter;
    if (this.searchVm.sorts && this.searchVm.sorts.length > 0 && !excelFlag) {
      if (this.column == 'callbackDate') { this.searchVm.sorts = this.isDesc ? "-callbackDate" : "callbackDate"; }
      else if (this.column == 'candidateFullName') { this.searchVm.sorts = this.isDesc ? "-candidateFirstName" : "candidateFirstName"; }
      else if (this.column == 'verificationId') { this.searchVm.sorts = this.isDesc ? "-screeningCompId" : "screeningCompId"; }
      else if (this.column == 'tatStatus') { this.searchVm.sorts = this.isDesc ? "-tatStatus" : "tatStatus"; }
    } else {
      this.searchVm.sorts = this.commonService.currentEmp != true ? '-screeningCompId' : '';
    }
    this.searchVm.applyPaging = (excelFlag === true || this.showallFlag === true) ? false : true;
    this.searchVm.needTotal = true;
  }

  applyPagination(excelFlag = false) {
    const baseFilter = this.userData.filters ?? '';
    let filter = baseFilter;
    if (this.VerificationSearchForm.value.clientName && this.VerificationSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientName@=' + this.VerificationSearchForm.value.clientName;
    }
    if (this.VerificationSearchForm.value.screeningId) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientScreeningId@=*' + this.VerificationSearchForm.value.screeningId;
    }
    if (this.VerificationSearchForm.value.clientRefNo) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=*' + this.VerificationSearchForm.value.clientRefNo;
    }
    if (this.VerificationSearchForm.value.componentName && this.VerificationSearchForm.get('componentName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'componentName@=' + this.VerificationSearchForm.value.componentName;
    }
    if (this.VerificationSearchForm.value.candidateFullName) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateFirstName@=*' + this.VerificationSearchForm.value.candidateFullName;
    }
    if (this.VerificationSearchForm.value.componentStatus && this.VerificationSearchForm.get('componentStatus')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'componentStatus@=' + this.VerificationSearchForm.value.componentStatus;
    }
    if (this.VerificationSearchForm.value.vendorName && this.VerificationSearchForm.get('vendorName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'vendorName@=' + this.VerificationSearchForm.value.vendorName;
    }
    if (this.VerificationSearchForm.value.verificationId) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=*' + this.VerificationSearchForm.value.verificationId;
    }
    if (this.VerificationSearchForm.value.screeningOwnerName && this.VerificationSearchForm.get('screeningOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'ScreeningOwnerName@=' + this.VerificationSearchForm.value.screeningOwnerName;
    }
    if (this.VerificationSearchForm.value.prioritylookupId && this.VerificationSearchForm.get('prioritylookupId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'priorityLookUpId==' + this.VerificationSearchForm.value.prioritylookupId;
    }
    if (this.VerificationSearchForm.value.screeningorgOwnerName && this.VerificationSearchForm.get('screeningorgOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'orginalScreeningOwnerId==' + this.VerificationSearchForm.value.screeningorgOwnerName;
    }
    if (this.VerificationSearchForm.value.screeningRegOwnerName && this.VerificationSearchForm.get('screeningRegOwnerName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'reAssignScreeningOwnerId==' + this.VerificationSearchForm.value.screeningRegOwnerName;
    }
    this.userData.pageSize = excelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter;
    if (this.userData.sorts && this.userData.sorts.length > 0 && !excelFlag) {
      if (this.column == 'callbackDate') { this.userData.sorts = this.isDesc ? "-callbackDate" : "callbackDate"; }
      else if (this.column == 'candidateFullName') { this.userData.sorts = this.isDesc ? "-candidateFirstName" : "candidateFirstName"; }
      else if (this.column == 'verificationId') { this.userData.sorts = this.isDesc ? "-screeningCompId" : "screeningCompId"; }
      else if (this.column == 'tatStatus') { this.userData.sorts = this.isDesc ? "-tatStatus" : "tatStatus"; }
    } else {
      this.userData.sorts = this.commonService.currentEmp != true ? '-screeningCompId' : '';
    }
    this.userData.applyPaging = (excelFlag === true || this.showallFlag === true) ? false : true;
    this.userData.needTotal = true;
  }

  getVerificationList() {
    this.verificationList.map(m => m.fqcByFN = m.fqcByFN ? (m.fqcByFN + (m.fqcByMN ? (' ' + m.fqcByMN) : '')
      + (m.fqcByLN ? (' ' + m.fqcByLN) : '')) : null);
    this.verificationList.map(m => m.frOwnerFN = m.frOwnerFN ? (m.frOwnerFN + (m.frOwnerMN ? (' ' + m.frOwnerMN) : '')
      + (m.frOwnerLN ? (' ' + m.frOwnerLN) : '')) : null);
    this.verificationList.map(m =>
      m.candidateFullName = m.candidateFirstName + ' ' + m.candidateMiddleName + ' ' + m.candidateLastName);
  }

  initautoCompleteCtrl() { }

  gridDataShowbyUserId(verificationDetails: any) {
    const details = verificationDetails ?? [];
    if (this.screeningService.caseFlagType != this.commonService.REOPEN && this.commonService.currentEmp != true &&
      (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true ||
        this.userData.teamName === 'CTS-CRTTeam' || this.userData.teamName === 'CRTIndia')) {
      if (this.screeningService.caseFlagType === this.commonService.REOPEN) {
        this.verificationList = details;
      } else {
        this.assignedList = details.filter(x => x.screeningOwnerId > 0);
        this.unAssignedList = details.filter(x => x.screeningOwnerId === 0);

        // FIX: assignControl is now null by default → shows ALL records.
        // Previously 'Not Assigned' caused empty list when all records were Assigned.
        if (this.assignControl.value === 'Not Assigned') {
          this.verificationList = this.unAssignedList;
        } else if (this.assignControl.value === 'Assigned') {
          this.verificationList = this.assignedList;
        } else {
          // null or any other value → show everything
          this.verificationList = this.commonService.CloneObject(details);
        }
      }
    } else {
      this.verificationList = details;
    }
    this.page = 1;
  }

  selectTab(name: any) {
    this.filterFlag = false;
    if (name === 'Assigned') {
      this.verificationList = this.assignedList;
    } else {
      this.verificationList = this.unAssignedList;
    }
    this.getVerificationList();
    this.resetFilterSort('tab');
  }

  resetFilterSort(type: any) {
    this.multipleClientFlag = false;
    this.VerificationSearchForm.reset();
    this.userData.filters = '';
    this.searchValueArr = [];
    this.initDatectrl.setValue('');
    this.fromDate = '';
    this.toDate = '';
    this.column = '';
    switch (type) {
      case 'tab':
        this.verificationList = this.commonService.CloneObject(this.verificationList);
        break;
      case 'reset':
        if (this.reOpenSearchFlag !== true || this.modifyAdditionalFeeFlag !== true || this.modifyComponentFeeFlag !== true) {
          this.shievePageNo = 1;
          this.userData.sorts = '';
          this.getVerificationSearchDetails();
        } else {
          this.verificationList = [];
        }
        break;
      default:
        break;
    }
  }

  search() {
    this.multipleClientFlag = true;
    if (this.VerificationSearchForm.value.clientName || this.VerificationSearchForm.value.screeningId ||
      this.VerificationSearchForm.value.screeningorgOwnerName || this.VerificationSearchForm.value.screeningRegOwnerName ||
      this.VerificationSearchForm.value.clientRefNo || this.VerificationSearchForm.value.componentName ||
      this.VerificationSearchForm.value.candidateFullName || this.VerificationSearchForm.value.componentStatus ||
      this.VerificationSearchForm.value.vendorName || this.VerificationSearchForm.value.verificationId ||
      this.VerificationSearchForm.value.screeningOwnerName || this.VerificationSearchForm.value.prioritylookupId) {
      this.shievePageNo = 1;
      this.userData.filters = '';
      this.getVerificationSearchDetails();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }

  selectAll(e: any) {
    if (e.checked === true) {
      this.verificationList.forEach(vd => { vd.assignedOwner = true; });
    } else {
      this.verificationList.forEach(vd => { vd.assignedOwner = false; });
    }
  }

  assignOwner(e, data, i) {
    if (e.checked === true) {
      data.assignedOwner = true;
    } else {
      data.assignedOwner = false;
      this.selectall.setValue(false);
    }
    const index = this.verificationList.findIndex(x => x.assignedOwner === false);
    if (index > -1) {
      this.selectall.setValue(false);
    } else {
      this.selectall.setValue(true);
    }
  }

  openOrginalOwerdialog() {
    const index = this.verificationList.findIndex(x => x.assignedOwner === true);
    if (index > -1) {
      this.dialogRef = this.dialog.open(this.assignOrgPopUp, { width: '400px', disableClose: true });
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast One Candidate');
    }
  }

  opendialog() {
    const index = this.verificationList.findIndex(x => x.assignedOwner === true);
    if (index > -1) {
      this.dialogRef = this.dialog.open(this.assignPopUp, { width: '400px', disableClose: true });
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast One Candidate');
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  dialogClose() {
    this.dialogRef.close();
    this.selectall.setValue(false);
  }

  submitOwner(owner: any) {
    this.assiginownerList = new AssignOwner();
    if (this.screeningOwner.valid) {
      const ownerList = this.verificationList.filter(x => x.assignedOwner === true);
      ownerList.forEach(item => { this.assiginownerList.assignScreeningCompId.push(item.screeningCompId); });
      this.assiginownerList.screeningOwnerId = this.screeningOwner.value.userId;
      this.assiginownerList.loginUserDetVm = this.userData;
      this.verificationService.addVerificationOwner(this.assiginownerList).subscribe(res => {
        if (res.success === true) {
          this.dialogClose();
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          this.screeningOwner.setValue('');
          this.getVerificationSearchDetails();
        }
      });
    }
  }

  submitOrgOwner(owner: any) {
    this.assiginownerList = new AssignOwner();
    const ownerList = this.verificationList.filter(x => x.assignedOwner === true);
    ownerList.forEach(item => { this.assiginownerList.assignScreeningCompId.push(item.screeningCompId); });
    this.assiginownerList.screeningOwnerId = 0;
    this.assiginownerList.loginUserDetVm = this.userData;
    this.verificationService.addVerificationOrgOwner(this.assiginownerList).subscribe(res => {
      if (res.success === true) {
        this.dialogClose();
        this.showTopCenter('success', 'Success Message', 'Assign Orginal Successfully');
        this.screeningOwner.setValue('');
        this.getVerificationSearchDetails();
      }
    });
  }

  selectVerification(screeningCompId: any) {
    this.verificationService.changeMessage(screeningCompId);
    this.verificationService.searchValue = this.VerificationSearchForm.value;
    this.verificationService.assControl = this.assignControl.value;
    this.verificationService.searchArray = this.searchValueArr;
  }

  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.getVerificationSearchDetails();
  }

  getPage(event: any) { this.page = event; }

  preventInfinite() {
    if (!this.itemPerPage) { this.itemPerPage = 1; }
  }

  getTotalPage(): number {
    if (this.verificationList.length) {
      return Math.ceil(this.verificationList.length / this.itemPerPage);
    }
  }

  getRecordBydate(type: any) {
    if (this.VerificationSearchForm.get('reqFromDate')?.value && this.VerificationSearchForm.get('reqToDate')?.value) {
      const data = [];
      const FromDate = this.dateP.transform(this.VerificationSearchForm.get('reqFromDate')?.value, 'yyyy-MM-dd');
      const ToDate = this.dateP.transform(this.VerificationSearchForm.get('reqToDate')?.value, 'yyyy-MM-dd');
      this.verificationList.map(d => d.requestDate = this.dateP.transform(d.requestDate, 'yyyy-MM-dd'));
      this.verificationList = this.verificationList.filter(x => x.requestDate >= FromDate && x.requestDate <= ToDate);
      const ftDate = new DatePipe('en-GB');
      data.push(
        { propertyName: 'reqFromDate', value: ftDate.transform(this.VerificationSearchForm.get('reqFromDate')?.value, 'dd/MM/yyyy') },
        { propertyName: 'reqToDate', value: ftDate.transform(this.VerificationSearchForm.get('reqToDate')?.value, 'dd/MM/yyyy') }
      );
      for (let i = 0; i < data.length; i++) { this.getPropertyValue(data[i]); }
    } else {
      for (const ctrl in this.VerificationSearchForm.controls) {
        if (ctrl === type) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          this.searchValueArr.splice(index, 1);
          this.verificationList = this.commonService.CloneObject(this.verificationDetails);
        }
      }
    }
  }

  assignScrnOwner(data, index) {
    this.screeningOwner.setValue('');
    const ownerList = this.owner.filter(x => x.name === data.name);
    if (ownerList.length > 0) {
      this.screeningOwner.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      if (ele.length > 0) {
        for (let i = 0; i < this.owner.length; i++) {
          if (index === i) { ele[i].classList.add('active'); }
          else { if (ele[i]) { ele[i].classList.remove('active'); } }
        }
      }
      this.owner = Object.assign([], this.owner);
    }
  }

  getDataBydate(fDate, tDate) {
    const tabList = this.verificationList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.verificationList.map(d => d.requestDate = this.dateP.transform(d.requestDate, 'yyyy-MM-dd'));
    this.verificationList = tabList.filter(x => x.requestDate >= FromDate && x.requestDate <= ToDate);
    const iDate = this.dateP.transform(this.fromDate, 'dd/MM/yyyy') + ' - ' + this.dateP.transform(this.toDate, 'dd/MM/yyyy');
    this.initDatectrl.setValue(iDate);
    if (this.verificationList.length === 0) { this.showTopCenter('warn', 'Info Message', 'No Record Found'); }
  }

  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.initDatectrl.setValue('');
    if (this.assignControl.value === 'Assigned') {
      this.verificationList = this.assignedList;
    } else {
      this.verificationList = this.unAssignedList;
    }
  }

  ngOnDestroy(): void {
    this.verificationService.assignedOrNotAssigned = null;
    if (!this.router.url.includes('verification')) {
      this.verificationService.verificationSearchData = [];
      this.verificationService.filters = '';
    }
    this.verificationService.backFlag = false;
    this.showallFlag = false;
    this.btnReAssign = false;
    this.commonService.backFlag = false;
    this.commonService.camRejection = false;
  }

  showBulk() { this.showBulkUpload = true; }
  showall() { if (this.verificationList.length > 0) { this.itemPerPage = this.verificationList.length; } }
  showpg() { this.itemPerPage = 10; }

  navigateURL() {
    if (this.commonService.screenName === 'Address Tagging & Status Upload' || this.commonService.screenName === 'Candidate document upload') {
      this.router.navigate(['dashboard/home']);
    } else {
      this.showBulkUpload = !this.showBulkUpload;
    }
  }

  Velimit() {
    if (this.shievePageSize > 200) { this.shievePageSize = 200; }
    this.getVerificationSearchDetails();
  }
}