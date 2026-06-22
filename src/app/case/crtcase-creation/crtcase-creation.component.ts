import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, OnDestroy, TemplateRef } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CaseCreation, CaseEntry } from '../../common-methods/models/case-creation';
import { CommonService } from '../../common-methods/services/common.service';
import { AuthService } from '../../common-methods/services/auth.service';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import {
  AssignScreeningOwnerVm,
  CaseCreationView, SaveScopeCreationVm, CaseComponentVm, CaseDocumentVm, CaseSubComponentVm,
  AssignCaseVm,
  ApprovedDocVm,
  CommonComponentVm
} from '../../common-methods/models/caseCreationView';
import { AgentEntryMasterService } from '../../common-methods/services/agent-entry-master.service';
// import { MatMenuTrigger, MatDialog, MatTabGroup, MatTableDataSource } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';

import { map, startWith } from 'rxjs/operators';
import { ScreenAuth } from '../../common-methods/models/screen-auth';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MailTemplate, MailData, MailAttachment } from 'src/app/common-methods/mail-templates/mail-template';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AdditionalComponentComponent } from '../additional-component/additional-component.component';
import { threadId } from 'worker_threads';
import moment from 'moment';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollToErrorDirective } from '../../common-methods/directive/scroll-to-error.directive';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
@Component({
  standalone: false,
  selector: 'app-crtcase-creation',
  templateUrl: './crtcase-creation.component.html',
  styleUrls: ['./crtcase-creation.component.css'],
  animations: [
    trigger('rotatedState', [
      state('reset', style({ transform: 'rotate(0deg)' })),
      state('right', style({ transform: 'rotate(90deg)' })),
      state('down', style({ transform: 'rotate(180deg)' })),
      state('left', style({ transform: 'rotate(270deg)' })),
      state('up', style({ transform: 'rotate(360deg)' })),
      transition('rotated => default', animate('1500ms ease-out')),
      transition('default => rotated', animate('400ms ease-in'))
    ])
  ]
})
export class CRTCaseCreationComponent implements OnInit, OnDestroy {
  infoceptDocList: any;
  candidatename: string;
  allScopeComp: any;
  ScopeComp: any;
  ScopeCompDet: any;
  susComp: any;
  event: LazyLoadEvent;
  loading: boolean;
  packComp: any;
  componentVM = new ComponentVM();
  removeScopeComp = new RemoveScopeVM();
  ComponentId: any[] = [];
  compVal: any;
  packComponentList: any;
  packComponent: any[] = [];
  packPrice: any;
  packName: any;
  caseComponentList: any;
  caseComponentVm = new CaseComponentVm();
  bulkFlag = true;
  caseNewList: any[] = [];
  state: string = 'default';
  url: any;
  dir: string;
  imageSource: any;
  downldata: any;
  fname: any
  sid: any;
  downid: any;
  imageChangedEvent: any = '';
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  @ViewChild('ScopeCompopup', { static: true }) ScopeCompopup: TemplateRef<any>;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
 @ViewChild('uploadConfirm', { static: true }) uploadConfirm!: TemplateRef<any>;
  compEditValues: any;
  assignflag = false;
  tooltip = false;
  searchText: string;
  fromDate = '';
  toDate = '';
  fromDateTime = '';
  toDateTime = '';
  caseSearchFlag = false;
  filterCaseLists: any[] = [];
  allcheck = new UntypedFormControl();
  crtCase = new CaseCreationView();
  savecrtCase = new SaveScopeCreationVm();
  caseDocument: CaseDocumentVm[];
  caseComponent: CaseComponentVm[];
  assignScreeningOwner = new AssignScreeningOwnerVm();
  caseSubComponent: CaseSubComponentVm[];
  showFlag = false;
  caseCreation = new CaseCreation();
  caseLists: any[] = [];
  routePath = 'Screening / Clients Case Creation / Scope Creation';
  screenAuth: ScreenAuth = new ScreenAuth();
  userData: any;
  packagelist: any[] = [];
  checkflag = false;
  checkbgvflag = false;
  packageflag = true;
  viewflag = true;
  componentList: any[] = [];
  componentListpackid: any[] = [];
  screeningOwnerList: any[] = [];
  btnSearch = true;
  btnExcelExport = false;
  caseCreationFormGroup: UntypedFormGroup;
  scopeFormGroup: UntypedFormGroup;
  ownerGroup: UntypedFormGroup;
  ownerflag = false;
  assignCase: AssignCaseVm[] = [];
  screeningLists: any[] = [];
  dupComponentList: any[] = [];
  approvedDocList: ApprovedDocVm[];
  searchUser = new UntypedFormControl();
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
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
  caseReceivedDateFormCtrl = new UntypedFormControl();
  caseReceivedDateFilteredOptions: Observable<string[]>;
  @ViewChild('caseReceivedDateTrigger', { static: true }) caseReceivedDateTrigger: MatMenuTrigger;
  @ViewChild('componentNameTrigger', { static: true }) componentNameTrigger: MatMenuTrigger;
  componentNameControl = new UntypedFormControl();
  componentNameFilteredOptions: Observable<string[]>;
  @ViewChild('crtNameTrigger', { static: true }) crtNameTrigger: MatMenuTrigger;
  crtNameControl = new UntypedFormControl();
  crtNameFilteredOptions: Observable<string[]>;
  @ViewChild('packNameTrigger', { static: true }) packNameTrigger: MatMenuTrigger;
  packNameControl = new UntypedFormControl();
  packNameFilteredOptions: Observable<string[]>;
  // @ViewChild('assignPopUp', { static: true }) assignPopUp!: any;;
  @ViewChild('assignPopUp', { static: true }) assignPopUp!: TemplateRef<any>;
  @ViewChild('editPopup', { static: true }) editPopup;
  errormsg: string;
  isEdit: boolean;
  @ViewChild(AdditionalComponentComponent) addComp: AdditionalComponentComponent;
  changeControl = new UntypedFormControl(0);
  displayedColumns = [
    { field: 'viewFlag', header: '', value: true, disabled: true },
    { field: 'candidateName', header: 'Candidate Name', value: true, disabled: true },
    { field: 'userName', header: 'Submitted By', value: true, disabled: true },
    { field: 'screeningOwnerName', header: 'Assigned Owner', value: true, disabled: true },
    { field: 'clientReferenceNo', header: 'Case Ref no', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'type', header: 'Type', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true },
    { field: 'applicantId', header: 'Applicant Id', value: true },
    { field: 'caseReceivedDate', header: 'Case Received Date & Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date & Time ', value: true }
  ];
  displayedColumns1 = [
    { field: 'candidateName', header: 'Candidate Name', value: true, disabled: true },
    { field: 'userName', header: 'Submitted By', value: true, disabled: true },
    { field: 'crtAssignedBy', header: 'Assigned By', value: true, disabled: true },
    { field: 'clientReferenceNo', header: 'Case Ref no', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'type', header: 'Type', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true },
    { field: 'applicantId', header: 'Applicant Id', value: true },
    { field: 'caseReceivedDate', header: 'Case Received Date & Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date & Time', value: true },
  ];
  clientColumns = [
    { field: 'candidateName', header: 'Candidate Name', value: true, disabled: true },
    { field: 'userName', header: 'Submitted By', value: true, disabled: true },
    { field: 'clientReferenceNo', header: 'Case Ref no', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true, disabled: true },
    { field: 'applicantId', header: 'Applicant Id', value: true },
    { field: 'caseReceivedDate', header: 'Case Received Date & Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date & Time', value: true },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  historycolumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientRefNo', header: 'Case Ref no' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'componentName', header: ' Individual Component Name' },
    { field: 'packageComponentName', header: 'Package Component Name' },
    { field: 'crtName', header: 'Submitted By' },
    { field: 'ownerName', header: 'Assigned Owner' },
    { field: 'caseCreatedDate', header: 'Case Created Date' },
    { field: 'scopeSubmittedDate', header: 'Scope Submitted Date' },

  ];
  breadcrumbFlags = new BreadcrumbFlags();
  @ViewChild('global', { static: true }) global!: ElementRef;
  totalpages: number;
  totalpages1: number;
  currentPage = 1;
  currentPage1 = 1;
  tempCurrentPage = 1;
  tempCurrentPage1 = 1;
  index: any;
  scope: AssignCaseVm;
  dialogRef: any;
  loaapproveflag: boolean;
  loaRemarks: any;
  loaUploadDocVm: any;
  screeningOwnerId = new UntypedFormControl('', Validators.required);
  menubar = [{ menuName: 'Not Assigned', id: 0 }, { menuName: 'Assigned', id: 1 },
  { menuName: 'LOA Approved / BGV Approved', id: 2 }, { menuName: 'LOA Pending / BGV Pending', id: 3 }];
  menubarUser = [{ menuName: 'Not Assigned', id: 0 }, { menuName: 'Assigned', id: 1 },
  { menuName: 'LOA Approved / BGV Approved', id: 2 }, { menuName: 'LOA Pending / BGV Pending', id: 3 }];
  caseDetails: any;
  searchFlag: boolean;
  scopelist: any[] = [];
  action: any;
  edit: any;
  filterOwnerName = new UntypedFormControl();
  screeningName: any;

  @ViewChild('actionTrigger', { static: true }) actionTrigger: MatMenuTrigger;
  filednames: any[];
  historyFlag = false;
  historyList: any[] = [];
  type: string;
  currencyList: any[] = [];
  currencyControls!: AutoCompleteDropDown;
  commonControls: CommonComponentVm;
  dashboardFlag = true;
  clientIds: any[] = [];
  packlist: any[] = [];
  clientIdAssign: any[] = [];
  instructionList: any[] = [];
  stopcheckFlag: boolean;
  editDetail: any;
  currentDate: Date = new Date();
  firstName = new UntypedFormControl('', Validators.required);
  caseReceivedDate = new UntypedFormControl('', Validators.required);
  caseInitiationDate = new UntypedFormControl('', Validators.required);
  folderPath = new UntypedFormControl('', Validators.required);
  dataValue: any;
  // **Added for Nodemail** //
  // mailDocList: any[] = [];
  // teamOwner: any;
  // filterTeamOwner: any;
  // agentDetailsData: any;
  itemperpage;
  itemperpageh;
  compbar = [{ menuName: 'Select Components' }, { menuName: 'Component Review' }];
  // @ViewChild('tab') tab: MatTabGroup;
  // @ViewChild('tab', {static: false}) tab! :MatTabGroup;
  @ViewChild('tab') tab!: MatTabGroup;
  step1 = 0;
  mattableSource = new MatTableDataSource([]);
  packtableSource = new MatTableDataSource([]);
  tableColumnsheaders: string[] = ['compName', 'noOfComponent', 'price'];
  packColumnsheaders: string[] = ['compName', 'noOfComponent'];
  constructor(private sanitizer: DomSanitizer, private fb: UntypedFormBuilder, public common: CommonService, private agentEntryService: AgentEntryMasterService,
    private message: MessageService, public dialog: MatDialog, private router: Router, private scroll: ScrollToErrorDirective,
    private auth: AuthService, public screeningService: ScreeningService, public master: MasterService, private dateP: DatePipe,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    if (this.userData.applicationId === 2) {
      this.displayedColumns = this.clientColumns;
      this.filednames = [{ field: 'action', header: 'Action', value: true, disabled: true }, ...this.displayedColumns.filter(e => e.disabled)];
    } else {
      this.filednames = [{ field: 'action', header: 'Action', value: true, disabled: true }, ...this.displayedColumns.filter(e => e.disabled)];
    }
    if (this.common.screenName === 'Sub Checks') {
      this.routePath = 'Screening / Clients Case Creation / Sub Checks';
      this.searchUsers();
    } else {
      if (this.userData.applicationId === 1) {
        if (this.screeningService.historyFlag === true) {
          this.showHistory(true);
        } else {
          // if (this.screeningService.searchObj) {
          //   this.showFlag = true;
          //   this.initFormGroup();
          //   this.screeningService.getScopeCreationDetails(this.screeningService.searchObj.caseNo).subscribe(resp => {
          //     if (resp) {
          //       this.edit = resp;
          //       this.scopelist = this.edit.caseComponent;
          //       this.action = this.edit.action;
          //       this.showFlag = false;
          //       this.addCaseCreation(this.screeningService.searchObj);
          //       this.caseCreationFormGroup.get('remarks')?.setValue(this.edit.remarks);
          //     }
          //     this.caseSearchFlag = true;
          //   });
          //   this.getCaseDetailsByClientId(this.screeningService.searchObj.clientId);
          // } else {
          //   this.caseSearchFlag = false;
          // }
          if (this.searchFlag !== true && this.btnSearch === true) {
            if (this.screeningService.countflag && this.screeningService.countflag === true) {
              this.dashboardFlag = true;
              if (this.screeningService.assignedflag === true) {
                this.bindScopeCreation('Assigned');
              }
              if (this.screeningService.loaapprovedflag === true) {
                this.bindScopeCreation('LOAApproved');
              }
              if (this.screeningService.notassignedflag === true) {
                this.bindScopeCreation('NotAssigned');
              }
              if (this.screeningService.loapendingflag === true) {
                this.bindScopeCreation('LOAPending');
              }
              this.screeningService.countflag = false;
              this.dashboardFlag = false;
            } else {
              this.bindScopeCreation('NotAssigned');
            }
          } else {
            this.bindScopeCreation('');
          }
        }
      } else {
        // if (this.screeningService.searchObj) {
        //   this.showFlag = true;
        //   this.initFormGroup();
        //   this.screeningService.getScopeCreationDetails(this.screeningService.searchObj.caseNo).subscribe(resp => {
        //     if (resp) {
        //       this.edit = resp;
        //       this.scopelist = this.edit.caseComponent;
        //       this.action = this.edit.action;
        //       this.showFlag = false;
        //       this.addCaseCreation(this.screeningService.searchObj);
        //       this.caseCreationFormGroup.get('remarks')?.setValue(this.edit.remarks);
        //       this.caseSearchFlag = true;
        //     }
        //   });
        //   this.getCaseDetailsByClientId(this.screeningService.searchObj.clientId);
        // } else {
        //   this.caseSearchFlag = false;
        // }
        this.bindScopeCreation('');
      }
      if (!this.screeningService.historyFlag && this.userData.applicationId !== 2) {
        this.GetScreeningOwner();
      }
    }
    this.itemperpage = 10;
    this.itemperpageh = 10;
    if (this.showFlag !== true) {
      this.breadcrumbFlags.btnSave = false;
    }
  }

  initFormGroup() {
    this.caseCreationFormGroup = this.fb.group({
      caseNo: [''],
      lOANotAvailable: [false],
      PreApproval: [''],
      supportingDocument: [''],
      packageId: [''],
      autoAssign: [true],
      remarks: [''],
      compReceivedDate: [new Date()],
      compInitiationDate: [new Date()],
      loggedIn: [''],
      compId: [''],
      subCompId: [''],
      bGVNotAvailable: [false],
      noOfComponent: [''],
      currencyId: [''],
      StopCheckFlag: [false],
      companySiteVisitFlag: [false]
    });
  }
  // Get OwnerList
  GetScreeningOwner() {
    const deptId = this.userData.deptId;
    if (deptId) {
      this.screeningService.getScreeningOwner(deptId, this.userData.teamId, 'CRTScopeCreation')
        .subscribe(resp => {
          if (resp) {
            this.screeningOwnerList = resp.screeningOwner;
            this.clientIds = resp.clientId;
            const ind = this.screeningOwnerList.findIndex(x => x.screeningOwnerId === this.userData.userId);
            ind > -1 ? this.screeningOwnerList.splice(ind, 1) : this.screeningOwnerList = resp.screeningOwner;
            if (this.screeningOwnerList.length > 0) {
              this.screeningOwnerList.map(m =>
                m.screeningName = m.screeningOwnerFName + ' ' + m.screeningOwnerMName + '' + m.screeningOwnerLName);
            }
          }
        });
    }
  }
  // Get scope view for all
  bindScopeCreation(caseStatus: any) {
    this.caseLists = [];
    if (caseStatus === 'LOAApproved' || caseStatus === 'LOAPending') {
      this.crtCase.LOANotAvailable = true;
      this.crtCase.BGVNotAvailable = true;
      this.loaapproveflag = true;
    } else {
      this.crtCase.LOANotAvailable = false;
      this.crtCase.BGVNotAvailable = false;
      this.loaapproveflag = false;
    }
    this.crtCase.workFlow = 'CRT',
      this.crtCase.userId = this.userData.userId;
    this.crtCase.caseStatus = caseStatus;
    this.crtCase.deptId = this.userData.deptId;
    this.crtCase.teamId = this.userData.teamId;
    this.crtCase.subTeamId = this.userData.subTeamId;
    this.crtCase.teamName = this.userData.teamName;
    this.crtCase.subTeamName = this.userData.subTeamName;
    if (this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true || this.userData.subTeamName === 'CRTCAMTeam') {
      this.ownerflag = false;
    } else {
      this.crtCase.screeningOwnerId = this.userData.userId;
      this.ownerflag = true;
      if (this.userData.applicationId === 2) {
        this.displayedColumns = this.clientColumns;
      } else {
        this.displayedColumns = this.displayedColumns1;
      }
      this.menubar = this.menubarUser;
    }
    this.crtCase.applicationId = this.userData.applicationId;
    this.crtCase.clientId = this.userData.clientId;
    this.screeningService.getCrtCaseCreationDetails(this.crtCase).subscribe(resp => {
      if (resp) {
        this.caseLists = resp;
        this.filterCaseLists = resp;
        this.dashboardFlag = true;
        if (caseStatus === 'Assigned') {
          if (this.ownerflag !== true) {
            this.changeControl.setValue(1);
          } else {
            this.changeControl.setValue(0);
          }
        }
        if (caseStatus === 'LOAApproved') {
          if (this.ownerflag !== true) {
            this.changeControl.setValue(2);
          } else {
            this.changeControl.setValue(1);
          }
        }
        if (caseStatus === 'LOAPending') {
          if (this.ownerflag !== true) {
            this.changeControl.setValue(3);
          } else {
            this.changeControl.setValue(2);
          }
        }
        if (caseStatus === 'NotAssigned') {
          if (this.ownerflag !== true && !this.screeningService.searchObj) {
            this.changeControl.setValue(0);
          }
          this.breadcrumbFlags.btnResetTbl = true;
        }

        // tslint:disable-next-line:no-shadowed-variable
        resp.forEach((element) => {
          const CMname = element.candidateMiddleName ? element.candidateMiddleName : '';
          const CLname = element.candidateLastName ? element.candidateLastName : '';
          element.candidateName = element.candidateFirstName + ' ' +
            CMname + ' ' + CLname;

          const Mname = element.screeningOwnerMName ? element.screeningOwnerMName : '';
          const Lname = element.screeningOwnerLName ? element.screeningOwnerLName : '';
          if (element.screeningOwnerFName) {
            element.screeningOwnerName = element.screeningOwnerFName + ' ' + Mname + ' ' + Lname;
          }
        });
        this.caseCreation = resp;
        this.TblAutoFilters();
      }
    });
  }

  // Get scope view for LoaStatus true
  loastatus(caseStatus: any) {
    if (this.dashboardFlag === true) {
      if (this.ownerflag !== true) {
        if (caseStatus === 2) {
          this.index = caseStatus;
          this.assignflag = true;
          this.crtCase.caseStatus = 'LOAApproved';
          this.crtCase.LOANotAvailable = true;
          this.crtCase.BGVNotAvailable = true;
          this.crtCase.workFlow = 'CRT',
            this.crtCase.deptId = this.userData.deptId;
          this.crtCase.screeningOwnerId = null;
          this.crtCase.clientId = this.userData.clientId;
          this.screeningService.getCrtCaseCreationDetails(this.crtCase).subscribe(resp => {
            if (resp) {
              this.caseLists = resp;
              // tslint:disable-next-line:no-shadowed-variable
              resp.forEach((element) => {
                element.candidateName = element.candidateFirstName + ' ' +
                  element.candidateMiddleName + ' ' + element.candidateLastName;
                const Mname = element.screeningOwnerMName !== null ? element.screeningOwnerMName : '';
                const Lname = element.screeningOwnerLName !== null ? element.screeningOwnerLName : '';
                if (element.screeningOwnerFName) {
                  element.screeningOwnerName = element.screeningOwnerFName + ' ' + Mname + ' ' + Lname;
                  this.caseCreation.loaStatus = element.loaStatus;
                }
              });
            }
          });
          this.assignCase = [];
          if (this.caseCreation.loaStatus === 'Approved') {
            this.loaapproveflag = true;
          } else {
            this.loaapproveflag = false;
          }
          this.allcheck.setValue(false);
        }
        if (caseStatus === 3) {
          this.index = caseStatus;
          this.assignflag = true;
          this.crtCase.caseStatus = 'LOAPending';
          this.crtCase.LOANotAvailable = true;
          this.crtCase.BGVNotAvailable = true;
          this.crtCase.workFlow = 'CRT',
            this.crtCase.deptId = this.userData.deptId;
          this.crtCase.screeningOwnerId = null;
          this.crtCase.clientId = this.userData.clientId;
          this.screeningService.getCrtCaseCreationDetails(this.crtCase).subscribe(resp => {
            if (resp) {
              this.caseLists = resp;
              // tslint:disable-next-line:no-shadowed-variable
              resp.forEach((element) => {
                element.candidateName = element.candidateFirstName + ' ' +
                  element.candidateMiddleName + ' ' + element.candidateLastName;
                const Mname = element.screeningOwnerMName !== null ? element.screeningOwnerMName : '';
                const Lname = element.screeningOwnerLName !== null ? element.screeningOwnerLName : '';
                if (element.screeningOwnerFName) {
                  element.screeningOwnerName = element.screeningOwnerFName + ' ' + Mname + ' ' + Lname;
                  this.caseCreation.loaStatus = element.loaStatus;
                }
              });
            }
          });
          this.assignCase = [];
          this.allcheck.setValue(false);
          if (this.caseCreation.loaStatus === 'Approved') {
            this.loaapproveflag = true;
          }
        }
        if (caseStatus === 1) {
          this.index = caseStatus;
          this.assignflag = true;
          this.crtCase.LOANotAvailable = false;
          this.crtCase.BGVNotAvailable = false;
          this.crtCase.caseStatus = 'Assigned';
          this.bindScopeCreation(this.crtCase.caseStatus);
          this.assignCase = [];
          this.allcheck.setValue(false);
          this.loaapproveflag = false;
        } else if (caseStatus === 0) {
          this.index = caseStatus;
          this.loaapproveflag = false;
          this.assignflag = false;
          this.crtCase.LOANotAvailable = false;
          this.crtCase.BGVNotAvailable = false;
          this.crtCase.caseStatus = 'NotAssigned';
          this.crtCase.screeningOwnerId = null;
          this.bindScopeCreation(this.crtCase.caseStatus);
          this.loaapproveflag = false;
          this.assignCase = [];
          this.allcheck.setValue(false);
        }
      } else {
        if (caseStatus === 0) {
          this.assignflag = true;
          this.crtCase.LOANotAvailable = false;
          this.crtCase.BGVNotAvailable = false;
          this.crtCase.caseStatus = 'Assigned';
          this.crtCase.screeningOwnerId = null;
          this.bindScopeCreation(this.crtCase.caseStatus);
          this.loaapproveflag = false;
          this.allcheck.setValue(false);
        } else if (caseStatus === 1) {
          this.crtCase.caseStatus = 'LOAApproved';
          this.assignflag = true;
          this.crtCase.LOANotAvailable = true;
          this.crtCase.BGVNotAvailable = true;
          this.crtCase.workFlow = 'CRT',
            this.crtCase.deptId = this.userData.deptId;
          this.crtCase.screeningOwnerId = null;
          this.crtCase.clientId = this.userData.clientId;
          this.screeningService.getCrtCaseCreationDetails(this.crtCase).subscribe(resp => {
            if (resp) {
              this.caseLists = resp;
              this.loaapproveflag = true;
              // tslint:disable-next-line:no-shadowed-variable
              resp.forEach((element) => {
                element.candidateName = element.candidateFirstName + ' ' +
                  element.candidateMiddleName + ' ' + element.candidateLastName;
                this.caseCreation.loaStatus = element.loaStatus;
              });
            }
          });
          this.allcheck.setValue(false);
        }
        if (caseStatus === 2) {
          this.index = caseStatus;
          this.assignflag = false;
          this.crtCase.caseStatus = 'LOAPending';
          this.crtCase.LOANotAvailable = true;
          this.crtCase.BGVNotAvailable = true;
          this.crtCase.workFlow = 'CRT',
            this.crtCase.deptId = this.userData.deptId;
          this.crtCase.screeningOwnerId = null;
          this.crtCase.clientId = this.userData.clientId;
          this.screeningService.getCrtCaseCreationDetails(this.crtCase).subscribe(resp => {
            if (resp) {
              this.caseLists = resp;
              // tslint:disable-next-line:no-shadowed-variable
              resp.forEach((element, i) => {
                element.candidateName = element.candidateFirstName + ' ' +
                  element.candidateMiddleName + ' ' + element.candidateLastName;
                this.caseCreation.loaStatus = element.loaStatus;
              });
            }
          });
          this.assignCase = [];
          if (this.caseCreation.loaStatus === 'Approved') {
            this.loaapproveflag = true;
          }
          this.allcheck.setValue(false);
        }
      }
    }
    this.dashboardFlag = true;

  }
  // Loa Check Change
  checkLoaevent(e: any) {
    if (e.checked === true) {
      this.checkflag = true;
      this.packageflag = false;
      this.errormsg = '';
      this.savecrtCase.caseComponent = [];
      this.breadcrumbFlags.btnSave = true;
    } else {
      //this.breadcrumbFlags.btnSave = false;
      this.checkflag = false;
      this.packageflag = true;
      this.componentListpackid = [];
      this.caseComponent = [];
      this.savecrtCase.caseDocument = [];
      this.caseCreationFormGroup.get('packageId')?.setValue('');
      this.caseCreationFormGroup.get('PreApproval')?.setValue('');
      this.caseCreationFormGroup.get('supportingDocument')?.setValue('');
      this.caseCreationFormGroup.get('remarks')?.setValue('');
      this.caseCreationFormGroup.get('PreApproval')?.clearValidators();
      this.caseCreationFormGroup.get('PreApproval')?.updateValueAndValidity();
      this.savecrtCase.caseComponent = this.savecrtCase.caseComponent;
      if (this.checkbgvflag || this.checkflag) {
        this.breadcrumbFlags.btnSave = true;
      }
      else if (!this.checkbgvflag && !this.checkflag) {
        this.breadcrumbFlags.btnSave = false;
      }
      else {
        this.breadcrumbFlags.btnSave = false;
      }
    }
    this.getRemarksLOAandBGV();
  }
//Get text for remarks
getRemarksLOAandBGV()
{
  let remarks="";
if(this.checkflag && !this.checkbgvflag)
{
remarks ="Letter of Authorization is not available for this applicant.  Kindly submit the same to initiate the verification process.";
}
else if(!this.checkflag && this.checkbgvflag){

  remarks ="Background screening form is not available for this applicant.  Kindly submit the same to initiate the verification process.";

}
else if(this.checkflag && this.checkbgvflag)
{
  remarks ="Background screening form and Letter of Authorization is not available for this applicant.  Kindly submit the same to initiate the verification process.";
}
else{
  remarks=null;
}
this.caseCreationFormGroup.get('remarks')?.setValue(remarks);
//this.caseCreationFormGroup?.get('remarks')?.setValue(remarks);
}
  // Pre-approval change
  approvalChange(e: any) {
    if (e.value === false) {
      this.savecrtCase.caseDocument = [];
      this.caseCreationFormGroup.get('supportingDocument')?.setValue('');
      this.caseCreationFormGroup.get('remarks')?.setValue('');
    } else {
      this.caseCreationFormGroup.get('remarks')?.setValue('');
      this.caseCreationFormGroup.get('supportingDocument')?.setValue('');
    }
    this.getRemarksLOAandBGV();
  }
  // Getting case details List for bind
  getCaseDetailsByClientId(data: any) {
    this.breadcrumbFlags.btnResetTbl = false;
    this.screeningService.getDetailsByClientId(data).subscribe(resp => {
      if (resp) {
        this.caseDetails = resp;
      }
    });
  }
  // get scope details
  addCaseCreation(data, type) {
    this.bulkFlag = type;
    this.packagelist = [];
    this.btnSearch = false;
    // this.breadcrumbFlags.btnResetTbl = false;
    this.checkflag = false;
    this.checkbgvflag = false;
    this.packageflag = true;
    this.errormsg = '';
    this.historyFlag = false;
    this.dialogClose();
    this.initFormGroup();
    this.savecrtCase.caseDocument = [];

    if (type === true ? data.loaStatus === 'Approved' : data[0].loaStatus === 'Approved') {
      this.loaapproveflag = true;
    } else {
      this.loaapproveflag = false;
    }
    this.screeningService.getCasePackageComponent(type === true ? data.clientId : data[0].clientId, false,0).subscribe(resp => {
      if (resp) {
        this.packagelist = resp.package;
        this.componentList = resp.component;
        this.instructionList = resp.instruction;
        this.componentList = resp.component.map((m) => {
          m.subCompFlag = m.subCompFlag === null ? false : m.subCompFlag;
          m.ischecked = false;
          m.disable = false;
          m.remarks = '';
          return m;
        });
        this.componentList.forEach((el) => {
          if (el.subCompFlag) {
            el.packageSubComponent.forEach(m1 => {
              m1.ischecked = false;
              m1.disable = false;
              m1.active = true;
              m1.remarks = '';
            });
          }
        });

        this.commonControls = new CommonComponentVm(this.caseCreationFormGroup, this.caseComponent, this.savecrtCase,
          this.packagelist, this.componentList, this.caseCreation.clientId, this.edit, 'scope');
      }
    });
    if (this.searchFlag === true) {
      this.screeningService.getScopeCreationDetails(data.caseNo).subscribe(resp => {
        if (resp) {
          this.edit = resp;
          this.scopelist = this.edit.caseComponent;
          this.packlist = this.edit.packageCaseComponent;
          this.action = this.edit.action;
          this.showFlag = !this.showFlag;
          this.caseCreationFormGroup.get('remarks')?.setValue(this.edit.remarks);
          this.commonControls = new CommonComponentVm(this.caseCreationFormGroup, this.caseComponent, this.savecrtCase,
            this.packagelist, this.componentList, this.caseCreation.clientId, this.edit, 'scope');
        }
        // this.caseSearchFlag = true;
      });
      this.breadcrumbFlags.btnBack = false;
      this.getCaseDetailsByClientId(data.clientId);
    }
    this.savecrtCase.caseComponent = [];
    if (type === true) {
      this.caseCreation.caseNo = data.caseNo;
      this.caseCreation.clientName = data.clientName;
      this.caseCreation.candidateName = data.candidateName;
      this.caseCreation.siteNo = data.siteNo;
      this.caseCreation.siteName = data.siteName;
      this.caseCreation.caseReceivedDate = data.caseReceivedDate;
      this.caseCreation.caseInitiationDate = data.caseInititationDate;
      this.caseCreation.clientReferenceNo = data.clientReferenceNo;
      this.caseCreation.applicantId = data.applicantId ? data.applicantId : 'N/A';
      this.caseCreation.urlName = data.urlName;
      this.caseCreation.clientId = data.clientId;
      this.screeningService.getApprovedLOADoc(data.caseNo).subscribe(resp => {
        if (resp) {
          this.loaRemarks = resp.loaRemarks;
          this.approvedDocList = resp.loaUploadDocVm;
          this.infoceptDocList = resp.infoceptCaseDocuments;
        }
      });
    } else {
      let caselist: any[] = [];
      this.caseNewList = [];
      data.forEach(el => {
        const val = this.caseLists.filter(x => x.caseNo === el.caseNo);
        if (val.length > 0) {
          caselist.push(val[0]);
        }
      })
      if (caselist.length > 0) {
        caselist.forEach(ele => {
          this.caseCreation = new CaseCreation();
          this.caseCreation.caseNo = ele.caseNo;
          this.caseCreation.clientName = ele.clientName;
          this.caseCreation.candidateName = ele.candidateName;
          this.caseCreation.siteNo = ele.siteNo;
          this.caseCreation.siteName = ele.siteName;
          this.caseCreation.caseReceivedDate = ele.caseReceivedDate;
          this.caseCreation.caseInitiationDate = ele.caseInititationDate;
          this.caseCreation.clientReferenceNo = ele.clientReferenceNo;
          this.caseCreation.applicantId = ele.applicantId ? ele.applicantId : 'N/A';
          this.caseCreation.urlName = ele.urlName;
          this.caseCreation.clientId = ele.clientId;
          this.caseNewList.push(this.caseCreation);
          this.screeningService.getApprovedLOADoc(ele.caseNo).subscribe(resp => {
            if (resp) {
              this.loaRemarks = resp.loaRemarks;
              this.approvedDocList = resp.loaUploadDocVm;
              this.infoceptDocList = resp.infoceptCaseDocuments;
            }
          });
        });
      }
    }

    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    if (this.searchFlag !== true) {
      this.showFlag = !this.showFlag;
    }
    if (this.step1 === 0) {
      this.breadcrumbFlags.btnSave = false;
    }
  }

  // validation scope save
  validationScope() {
    if (this.caseCreationFormGroup.get('lOANotAvailable')?.value === true ||
      this.caseCreationFormGroup.get('bGVNotAvailable')?.value === true) {
      this.caseCreationFormGroup.get('PreApproval')?.setValidators(Validators.required);
      this.caseCreationFormGroup.get('PreApproval')?.updateValueAndValidity();
      this.caseCreationFormGroup.get('packageId')?.clearValidators();
      this.caseCreationFormGroup.get('packageId')?.updateValueAndValidity();
      if (this.caseCreationFormGroup.get('PreApproval')?.value === true) {
        if (this.savecrtCase.caseDocument.length === 0 && this.caseCreation.loaStatus !== 'Pending') {
          this.caseCreationFormGroup.get('supportingDocument')?.setValidators(Validators.required);
          this.caseCreationFormGroup.get('supportingDocument')?.updateValueAndValidity();
        } else {
          this.caseCreationFormGroup.get('supportingDocument')?.clearValidators();
          this.caseCreationFormGroup.get('supportingDocument')?.updateValueAndValidity();
        }
      }
    }
  }
  // Merged case sub-component into single component
  check() {
    const dupvalues: number[] = [];
    this.caseComponent = this.caseComponent.filter(x => x.type === 'Individual');
    this.caseComponent.forEach(e => {
      if (!dupvalues.includes(e.compId)) {
        if (this.caseComponent.filter(el => el.compId === e.compId).length > 1) {
          const copydata: CaseComponentVm[] = this.caseComponent.filter(r => r.compId === e.compId);
          this.caseComponent = this.caseComponent.filter(del => del.compId !== e.compId);
          let copydata1 = new CaseComponentVm();
          copydata.forEach((data, index) => {
            if (index === 0) {
              copydata1 = data;
            } else {
              // data.caseSubComponent.forEach((ele) => {
              //   this.arrSub = ele;
              // });
              // copydata1.caseSubComponent.push(this.arrSub);
              copydata1.caseSubComponent.push(data.caseSubComponent[0]);
            }
          });
          if (copydata1.type === 'Individual') {
            this.caseComponent.push(copydata1);
            this.savecrtCase.caseComponent.push(copydata1);
          }
        }
      }
      dupvalues.push(e.compId);
    });
  }
  // Checking duplicate component when it's package or individual
  checkFilterComponents() {
    if (this.savecrtCase.packageId > 0) {
      let complen: any[] = [];
      const compList: any[] = [];
      const compsublen: any[] = [];
      let compListsub: any[] = [];
      const submaxlist: any[] = [];
      const compInd: any[] = [];
      if (this.componentListpackid && this.componentListpackid.length > 0) {
        // main component filters while package select save
        const maxsavelist = this.componentList.filter(x => x.maxNoOfComp === 1 && x.subCompFlag !== true);
        if (maxsavelist && maxsavelist.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < maxsavelist.length; i++) {
            const indList = this.savecrtCase.caseComponent.filter(x => x.type === 'Individual'
              && x.compId === maxsavelist[i].componentId);
            if (indList && indList.length > 0) {
              compInd.push(indList[0]);
            }
          }
          if (compInd && compInd.length > 0) {
            this.componentListpackid.forEach((ee) => {
              complen = compInd.filter(x => x.compId === ee.componentId && x.componentType === ee.compName);
              if (complen && complen.length > 0) {
                compList.push(complen[0]);
              }
            });
          }
        }
        if (compList) {
          compList.forEach((ele) => {
            if (!ele.packageSubComponent) {
              this.dupComponentList = compList;
            }
          });
        }
        // end
        // sub component filters
        const subFilterList = this.savecrtCase.caseComponent.filter(x => x.caseSubComponent.length > 0);
        subFilterList.forEach(ex => {
          const packmaxlist = ex.caseSubComponent.filter(x => x.maxNoOfComp === 1 && ex.type === 'Individual');
          if (packmaxlist.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            submaxlist.push(packmaxlist[0]);
          }
        });
        let sublen: any[] = [];
        if (submaxlist.length > 0) {
          submaxlist.forEach((el) => {
            this.componentListpackid.forEach((comp) => {
              if (comp.packageSubComponent && comp.packageSubComponent.length > 0 && comp.packageSubComponent !== null) {
                sublen = comp.packageSubComponent.filter(x => x.subCompId === el.subCompId);
                if (sublen.length > 0) {
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < sublen.length; i++) {
                    compsublen.push(sublen[i]);
                  }
                }
              }
            });
          });
        }
        if (compsublen && compsublen.length > 0) {
          compListsub = compsublen;
        }
        if (compListsub && compListsub.length > 0) {
          this.dupComponentList = compListsub;
        }
      }
      if (this.dupComponentList && this.dupComponentList.length > 0) {
        let comp: any[] = [];
        this.dupComponentList.forEach((ele) => {
          this.caseComponent = this.savecrtCase.caseComponent;
          if (!ele.caseSubComponent) {
            comp = this.caseComponent.filter(x => x.compId === ele.compId);
          } else {
            comp = this.caseComponent.filter(x => x.subCompName === ele.subCompName);
          }
        });
      } else {
        this.caseComponent = this.savecrtCase.caseComponent;
      }
    } else {
      this.caseComponent = this.savecrtCase.caseComponent;
    }
  }
  // save scope function
  saveCaseCreation() {
    if (this.caseCreationFormGroup.get('remarks')) {
      this.savecrtCase.lOANotAvailable = this.caseCreationFormGroup.get('lOANotAvailable')?.value;
      this.savecrtCase.bGVNotAvailable = this.caseCreationFormGroup.get('bGVNotAvailable')?.value;
      this.validationScope();
      let compList: any[] = [];
      if ((this.caseCreationFormGroup.controls.packageId.value > 0 || this.savecrtCase.caseComponent.length > 0) || this.caseCreationFormGroup.controls.StopCheckFlag.value === true ||
        (this.savecrtCase.lOANotAvailable || this.savecrtCase.bGVNotAvailable)) {
        // if (this.addComp && this.addComp.dt.value) {
        //   const comprawList = this.addComp.dt.value;
        //   this.savecrtCase.caseComponent = compList = comprawList.filter(f => {
        //     if (f.subCompFlag) {
        //       f.caseSubComponent = f.packageSubComponent.filter(f1 => f1.ischecked === true);
        //       if (f.caseSubComponent.length > 0) {
        //         return true;
        //       }
        //     } else {
        //       return f.ischecked;
        //     }
        //   });
        // }
        if (this.compEditValues) {
          this.savecrtCase.packageId = this.compEditValues.compCommonLists.packageId;
          if (this.savecrtCase.packageId) {
            this.componentListpackid = this.compEditValues.packComponent;
            this.caseCreationFormGroup.get('packageId')?.setValue(this.savecrtCase.packageId);
          }
        }
        // if (this.compEditValues.compCommonLists.caseComponent && this.compEditValues.compCommonLists.caseComponent.length > 0) {
        //   compList = this.compEditValues.compCommonLists.caseComponent.filter(x => x.type === 'Individual');
        //   this.savecrtCase.caseComponent = this.compEditValues ?
        //     this.compEditValues.compCommonLists.caseComponent : '';
        // }
        if ((compList.length > 0) || this.savecrtCase.caseComponent.length > 0 || this.caseCreationFormGroup.get('packageId')?.value) {
          if (!this.caseCreationFormGroup.get('lOANotAvailable')?.value || !this.caseCreationFormGroup.get('bGVNotAvailable')?.value) {
            let allowPack: boolean;
            let allowSingle: boolean;

            if (this.componentListpackid.length > 0) {
              allowPack = this.componentListpackid.some(x => x.abroadCompFlag === false);
            }
            if (this.savecrtCase.caseComponent.length > 0) {
              allowSingle = this.savecrtCase.caseComponent.some(x => x.abroadCompFlag === false);
            }
            // if ((this.componentListpackid.length > 0 && allowPack) || (((this.savecrtCase.caseComponent.length > 0 && allowSingle)
            //   || this.caseCreationFormGroup.controls.packageId.value > 0))) {
            this.caseCreationFormGroup.get('lOANotAvailable')?.setValue(false);
            this.caseCreationFormGroup.get('bGVNotAvailable')?.setValue(false);
            this.caseCreationFormGroup.get('PreApproval')?.setValue(false);
            this.savecrtCase.packageId = this.caseCreationFormGroup.controls.packageId.value > 0 ?
              this.caseCreationFormGroup.controls.packageId.value : 0;
            this.caseComponent = this.savecrtCase.caseComponent;
            // this.checkFilterComponents();
            // tslint:disable-next-line:prefer-for-of
            // for (let i = 0; i < this.caseComponent.length; i++) {
            //   if (this.caseComponent[i].subCompFlag === true) {
            //     // this.caseComponent[i].noOfComponent = 0;
            //   } else {
            //     this.savecrtCase.caseComponent[i].noOfComponent = this.caseComponent[i].noOfComponent;
            //   }
            // }
            // if (!this.dupComponentList || this.dupComponentList.length === 0) {
            //   this.check();
            // }
            if (this.savecrtCase.caseComponent.length > 0) {
              this.savecrtCase.caseComponent = this.caseComponent;
            } else {
              this.savecrtCase.caseComponent = [];
            }
            this.savecrtCase.lOANotAvailable = false;
            this.savecrtCase.bGVNotAvailable = false;
            this.savecrtCase.PreApproval = false;
            this.savecrtCase.caseNo = this.caseCreation.caseNo;
            this.savecrtCase.loggedIn = this.userData.userId;
            // tslint:disable-next-line:max-line-length
            this.savecrtCase.remarks = this.caseCreationFormGroup.get('remarks')?.value;
            this.savecrtCase.autoAssign = this.caseCreationFormGroup.get('autoAssign')?.value ?
              this.caseCreationFormGroup.get('autoAssign')?.value : false;
            // }
            //  else {
            //   return this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Indian Component');
            // }
          }
        } else {
          if (this.savecrtCase.lOANotAvailable !== true && this.savecrtCase.bGVNotAvailable !== true &&
            this.caseCreationFormGroup.get('StopCheckFlag')?.value !== true) {
            this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
            this.errormsg = 'Please add atleast One Component';
            return false;
          }
        }
        // }
        if (this.savecrtCase.caseComponent.length === 0 && !this.caseCreationFormGroup.get('packageId')?.value &&
          (this.savecrtCase.lOANotAvailable !== true && this.savecrtCase.bGVNotAvailable !== true && this.caseCreationFormGroup.get('StopCheckFlag')?.value !== true)) {
          this.showTopCenter('warn', 'Failure Message', 'Please add atleast One Component');
          this.errormsg = 'Please add atleast One Component';
          return false;
        }
        if ((this.caseCreationFormGroup.valid && (this.savecrtCase.caseComponent.length === 0
          || this.savecrtCase.caseComponent === null)) ||
          this.caseCreationFormGroup.get('StopCheckFlag')?.value === true) {
          if (this.caseCreationFormGroup.get('lOANotAvailable')?.value === true ||
            this.caseCreationFormGroup.get('bGVNotAvailable')?.value === true || this.caseCreationFormGroup.get('StopCheckFlag')?.value === true) {
            this.savecrtCase.caseNo = this.caseCreation.caseNo;
            this.savecrtCase.loggedIn = this.userData.userId;
            this.savecrtCase.lOANotAvailable = this.caseCreationFormGroup.get('lOANotAvailable')?.value;
            this.savecrtCase.bGVNotAvailable = this.caseCreationFormGroup.get('bGVNotAvailable')?.value;
            this.savecrtCase.PreApproval = this.caseCreationFormGroup.get('PreApproval')?.value;
            this.savecrtCase.remarks = this.caseCreationFormGroup.get('remarks')?.value;
            this.savecrtCase.stopCheckFlag = this.caseCreationFormGroup.get('StopCheckFlag')?.value;
            this.errormsg = '';
          }
        }
        if (this.edit && this.edit.action === 'Edit' || this.scopelist.length > 0) {
          this.savecrtCase.action = this.action;
        }

        if ((this.dupComponentList && this.dupComponentList.length === 0)) {
          if ((this.savecrtCase.packageId > 0 && (this.savecrtCase.caseComponent.length === 0))
            || this.savecrtCase.caseComponent.length >= 1
            || (this.caseCreationFormGroup.get('lOANotAvailable')?.value === true ||
              this.caseCreationFormGroup.get('bGVNotAvailable')?.value === true
              && (this.caseCreationFormGroup.get('PreApproval')?.value === false ||
                this.caseCreationFormGroup.get('PreApproval')?.value === true)) ||
            this.caseCreationFormGroup.get('StopCheckFlag')?.value === true) {
            if ((this.caseCreationFormGroup.valid) ||
              (this.caseCreationFormGroup.get('StopCheckFlag')?.value === true)) {
              this.validationScope();
              if (this.searchFlag === true && this.savecrtCase.caseComponent) {
                this.savecrtCase.compReceivedDate = this.caseCreationFormGroup.get('compReceivedDate')?.value;
                this.savecrtCase.compInitiationDate = this.caseCreationFormGroup.get('compInitiationDate')?.value;
                this.savecrtCase.caseComponent.forEach(element => {
                  element.compReceivedDate = this.caseCreationFormGroup.get('compReceivedDate')?.value;
                  element.compInitiationDate = this.caseCreationFormGroup.get('compInitiationDate')?.value;
                });
              }
              const formData = new FormData();
              formData.append('ScopeCreation', JSON.stringify(this.savecrtCase));
              if (this.savecrtCase.caseDocument.length > 0) {
                for (let i = 0; i < this.savecrtCase.caseDocument.length; i++) {
                  formData.append('ScopeCreation_' + i, this.savecrtCase.caseDocument[i].document);
                }
              }
              // **Added for Nodemail** //
              // if (this.savecrtCase.PreApproval === true) {
              //   this.getApprovalOwner();
              //   this.convertFileasBase64(this.savecrtCase.caseDocument);
              // } else if (!this.savecrtCase.PreApproval) {
              //   this.getClientDetails();
              // }
              this.screeningService.addScopeCreation(formData).subscribe(resp => {
                if (resp) {
                  if (this.savecrtCase.action && this.savecrtCase.action !== null) {
                    this.showTopCenter('success', 'Success Message', 'Updated Successfully');
                  } else {
                    this.showTopCenter('success', 'Success Message', 'Saved Successfully');
                  }
                  this.bindScopeCreation('NotAssigned');
                  this.closeForm();
                  this.savecrtCase.action = null;
                  if (this.savecrtCase.lOANotAvailable !== true && this.savecrtCase.bGVNotAvailable !== true) {
                    if (this.compEditValues) {
                      this.compEditValues.compCommonLists = new SaveScopeCreationVm();
                    }
                  }
                  this.savecrtCase = new SaveScopeCreationVm();
                }
                // **Added for Nodemail** //
                // if (this.savecrtCase.lOANotAvailable === true) {
                //   setTimeout(() => {
                //     this.getEmailTemplate(this.savecrtCase.lOANotAvailable, this.savecrtCase.PreApproval, this.caseCreation);
                //   });
                // }
              });
            }
          }
        } else {
          this.showTopCenter('error', 'Failure Message', 'Please Remove the Additional Component, It is Already in Package Components');
          this.dupComponentList = [];
        }
      } else {
        if (this.addComp) {
          Object.keys(this.addComp.compfrm.controls).forEach(key => {
            this.addComp.compfrm.controls[key].markAsTouched();
          });
        }
      }
    } else {
      this.caseCreationFormGroup.get('remarks')?.setValidators(Validators.required);
      this.caseCreationFormGroup.get('remarks')?.markAsTouched();
      this.caseCreationFormGroup.get('remarks')?.updateValueAndValidity();
    }
  }
  stopName(e: any) {
    if (e === true) {
      this.breadcrumbFlags.btnSave = true;
      this.caseCreationFormGroup.get('lOANotAvailable')?.disable();
      this.caseCreationFormGroup.get('bGVNotAvailable')?.disable();
    } else {
      this.breadcrumbFlags.btnSave = false;
      this.caseCreationFormGroup.get('lOANotAvailable')?.enable();
      this.caseCreationFormGroup.get('bGVNotAvailable')?.enable();
    }
  }
  // **Added for Nodemail** //
  // getClientDetails() {
  //   this.agentEntryService.getClientDetails(0, 0).subscribe(res => {
  //     if (res) {
  //       this.agentDetailsData = res;
  //     }
  //   });
  // }
  // getApprovalOwner() {
  //   this.master.getTeam(0).subscribe(resp => {
  //     if (resp) {
  //       this.teamOwner = resp;
  //       this.filterTeamOwner = this.teamOwner.filter(x => x.teamName === 'Approval Manager Team');
  //       console.log(this.filterTeamOwner, '  this.filterTeamOwner');
  //     }
  //   });
  // }
  // convertFileasBase64(file: any) {
  //   if (file.length > 0) {
  //     this.mailDocList = [];
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < file.length; i++) {
  //       if (file[i].document) {
  //         const fileReader = new FileReader();
  //         fileReader.onloadend = (e) => {
  //           const mailAttachment = new MailAttachment();
  //           mailAttachment.fileName = file[i].document.name;
  //           mailAttachment.bufferDoc = fileReader.result;
  //           this.mailDocList.push(mailAttachment);
  //         };
  //         fileReader.readAsDataURL(file[i].document);
  //       }
  //     }
  //   }
  // }
  // getEmailTemplate(loaDetails, preApproval, caseDetails) {
  //   console.log(loaDetails, 'load');
  //   const emailTemplate = this.common.mailTemplates.find(x => x.templateName.toLowerCase() ===
  //     this.common.SCOPE_LOA_APPROVAL).htmlTemplateBody;
  //   const mailTemp = new MailTemplate();
  //   mailTemp.mailbodyheader = 'Dear';
  //   if (preApproval === true) {
  //     this.getApprovalOwner();
  //     if (this.filterTeamOwner && this.filterTeamOwner.length > 0) {
  //       const teamOwnerList = this.filterTeamOwner.map(x => x.teamOwner);
  //       if (this.filterTeamOwner.length > 0) {
  //         teamOwnerList.forEach((ele, index) => {
  //           mailTemp.name = ele[index].name;
  //         });
  //       }
  //     }
  //   } else {
  //     if (this.agentDetailsData && this.agentDetailsData.length > 0) {
  //       const clientOwnerList = this.agentDetailsData.filter(x => x.clientId === this.caseCreation.clientId);
  //       if (clientOwnerList.length > 0) {
  //         // tslint:disable-next-line:prefer-for-of
  //         for (let i = 0; i < clientOwnerList.length; i++) {
  //           mailTemp.name = clientOwnerList[i].firstName;
  //         }
  //       }
  //     }
  //   }
  //   mailTemp.clientName = caseDetails.clientName;
  //   mailTemp.sno = 1;
  //   mailTemp.clientRefID = caseDetails.clientReferenceNo;
  //   mailTemp.candidateName = caseDetails.candidateName;
  //   mailTemp.preApprovalWithoutLOA = preApproval;
  //   mailTemp.requestedBy = this.userData.userName;
  //   const mailData = new MailData();
  //   mailData.htmlTemplate = this.common.mailTemp(emailTemplate, mailTemp);
  //   if (mailTemp.preApprovalWithoutLOA === true) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let index = 0; index < this.mailDocList.length; index++) {
  //       mailData.fileAttachments.push({
  //         filename: this.mailDocList[index].fileName,
  //         path: this.mailDocList[index].bufferDoc
  //       });
  //     }
  //   }
  //   this.master.sendEmail(mailData).subscribe(resp => {
  //     this.showTopCenter('success', 'Success', resp['message']);
  //   });
  // }

  // Checkbox header function
  checkheader(e: any) {
    const distinct = this.caseLists.filter((x, i, arr) => arr.findIndex(t => t.clientId === x.clientId) === i);
    if (e.checked === true) {
      if (distinct.length === 1) {
        this.caseLists.forEach((el) => {
          el.assignFlag = true;
        });
        this.assignCase = [];
        // tslint:disable-next-line:no-shadowed-variable
        this.caseLists.forEach((element) => {
          this.scope = new AssignCaseVm();
          this.scope.caseNo = element.caseNo;
          this.scope.clientReferenceNo = element.clientReferenceNo;
          this.scope.clientId = element.clientId;
          this.assignCase.push(this.scope);
        });
      } else {
        this.showTopCenter('warn', 'Alert Message', 'Please Select the Candidate with Same Client');
        e.source.checked = false;
      }
    } else {
      this.caseLists.forEach((ex) => {
        ex.assignFlag = false;
      });
      this.assignCase = [];
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.updateValueAndValidity();
    }
    Promise.resolve().then(() => this.cdr.detectChanges());
  }
  // Owner check select method
  assignScope(e, i, data) {
    this.scope = new AssignCaseVm();
    if (e.checked === true) {
      if (this.assignCase.length > 0 && this.assignCase.find(x => x.clientId !== data.clientId)) {
        this.showTopCenter('warn', 'Alert Message', 'Please Select the Candidate with Same Client');
        e.source.checked = false;
        data.assignFlag = false;
      } else {
        data.assignFlag = true;
        const caselist = this.caseLists.filter(x => x.caseNo === data.caseNo && x.assignFlag === true);
        if (caselist) {
          this.scope.caseNo = data.caseNo;
          this.scope.clientReferenceNo = data.clientReferenceNo;
          this.scope.clientId = data.clientId;
          this.assignCase.push(this.scope);
          // if (this.assignCase.length > 1) {
          //   this.openBulkScope();
          // }
        } else {
          data.assignFlag = false;
        }
      }
    } else {
      data.assignFlag = false;
      if (this.allcheck.value) {
        this.allcheck.setValue(false);
      }
      const ind = this.assignCase.findIndex(x => x.caseNo === data.caseNo);
      if (ind > -1) {
        this.assignCase.splice(ind, 1);
      }
    }
    Promise.resolve().then(() => this.cdr.detectChanges());
  }
  openBulkScope() {
    this.dialog.open(this.uploadConfirm, {
      width: '320px',
      disableClose: true
    });
  }
  // upload document
  openUploadDoc(event: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const caseDocumentlist = new CaseDocumentVm();
      caseDocumentlist.fileName = event.target.files[i].name;
      if (caseDocumentlist.fileName.length > 100) {
        this.showTopCenter('warn', 'Failure Message', 'File name should be less then 100  character.');
      } else {
        caseDocumentlist.docType = 'RequestDocument';
        caseDocumentlist.document = event.target.files[i];
        caseDocumentlist.caseDocumentId = 0;
        const fname = this.savecrtCase.caseDocument.filter(x => x.fileName === caseDocumentlist.fileName);
        if (fname.length > 0) {
          this.showTopCenter('warn', 'Failure Message', 'Document has been already exist');
        } else {
          this.savecrtCase.caseDocument.push(caseDocumentlist);
        }
      }
    }
  }
  // remove document
  removeDocument(index: any) {
    this.savecrtCase.caseDocument.splice(index, 1);
    if (this.savecrtCase.caseDocument.length === 0) {
      this.caseCreationFormGroup.get('supportingDocument')?.setValue('');
    }
  }

  // downloadFile(data, filename) {
  //   const blob = new Blob([data.document], { type: 'application/octet-stream' });
  //   if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
  //     (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  //   } else { // for Non-IE (chrome, firefox etc.)
  //     const a = document.createElement('a');
  //     document.body.appendChild(a);
  //     a.setAttribute('style', 'display:none;');
  //     const csvUrl = URL.createObjectURL(blob);
  //     a.href = csvUrl;
  //     a.download = filename;
  //     a.click();
  //     a.remove();
  //   }
  // }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  dialogClose() {
    this.dialog.closeAll();
    this.screeningOwnerId.setValue('');
    this.screeningOwnerId.clearValidators();
    this.assignCase = [];
    this.caseLists.forEach((e) => {
      e.assignFlag = false;
    });
    this.allcheck.setValue(false);
  }
  opendialog() {
    this.clientIdAssign = [];
    if (this.assignCase.length >= 1) {
      this.assignCase.forEach(element => {
        const value = element.clientId;
        this.clientIdAssign.push(value.toString());
      });
      const val = this.clientIds.includes(this.clientIdAssign[0]);
      if (val || this.clientIds.includes('All Client')) {
        this.dialogRef = this.dialog.open(this.assignPopUp, {
          width: '400px',
          disableClose: true
        });
        this.screeningOwnerId.setValue('');
      } else {
        this.showTopCenter('warn', 'Alert Message', 'This Candidate Client does not have any users');
      }
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
        this.assignScreeningOwner.loginName = this.userData.firstName + (this.userData.lastName == null ? '' : ' ' +
          this.userData.lastName);
        this.assignScreeningOwner.screeningOwnerName = this.screeningOwnerId.value.screeningOwnerFName
          + (this.screeningOwnerId.value.screeningOwnerMName == null ? '' : ' ' + this.screeningOwnerId.value.screeningOwnerMName)
          + (this.screeningOwnerId.value.screeningOwnerLName == null ? '' : ' ' + this.screeningOwnerId.value.screeningOwnerLName);
        this.screeningService.assignScreeningOwner(this.assignScreeningOwner).subscribe(resp => {
          if (resp) {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            this.assignCase = [];
            this.dialogRef.close();
            this.screeningOwnerId.setValue('');
            this.screeningOwnerId.clearValidators();
            this.screeningOwnerId.updateValueAndValidity();
            this.assignflag = false;
            if (this.index === 2 || this.index === 1) {
              const cout = this.index;
              this.loastatus(cout);
            } else {
              this.bindScopeCreation('NotAssigned');
            }
            this.dialogRef.close();
          }
        });
      }
    } else {
      this.screeningOwnerId.clearValidators();
      this.screeningOwnerId.markAsTouched();
      this.screeningOwnerId.updateValueAndValidity();
    }
  }
  resetTable() {
    if (this.dt) {
      this.dt.reset();
    }
    if (this.dtHistory) {
      this.dtHistory.reset();
    }
    if (this.btnSearch !== true) {
      this.searchUser.setValue('');
      if (this.caseLists.length > 0) {
        this.caseLists = [];
      }
    } else {
      this.global.nativeElement.value = '';
      this.screeningOwnerId.setValue('');
      this.caseLists.forEach((e) => {
        e.assignFlag = false;
      });
    }
  }

  // backevent
  closeForm() {
    // if (this.searchFlag !== true) {
    this.searchFlag = false;
    this.showFlag = false;
    this.loaapproveflag = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.caseDocument = [];
    this.allcheck.setValue('');
    this.btnSearch = true;
    if (this.scopelist.length > 0 || this.edit) {
      this.screeningService.searchObj = '';
      this.edit = '';
      this.scopelist = [];
    }
    this.breadcrumbFlags.btnSave = false;
    this.componentListpackid = [];
    // this.caseCreationFormGroup.get('packageId')?.enable();
    // }
    if (this.historyFlag === true || this.common.screenName === 'Sub Checks') {
      this.router.navigate(['dashboard/home']);
    } else {
      this.bindScopeCreation('NotAssigned');
    }
    this.bulkFlag = true;
  }
  searchUsers() {
    this.searchUser.setValue('');
    this.btnSearch = false;
    this.breadcrumbFlags.btnBack = true;
    this.btnExcelExport = false;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = true;
    // this.breadcrumbFlags.btnReset = true;
    // this.router.navigate(['dashboard/case/search-case']);
  }
  searchCase() {
    if (this.searchUser.value) {
      this.screeningService.searchScope(this.searchUser.value, this.userData.teamName).subscribe(resp => {
        if (resp) {
          if (resp.workFlowLookupId == this.common.CRT_WORKFLOW_ID) {
            const msg = 'Please Submit Scope for this Client Reference No (' + this.searchUser.value + ')';
            this.showTopCenter('info', msg, '');
          } else {
            this.caseLists = [];
            this.searchFlag = true;
            this.btnExcelExport = false;
            const cases = resp;
            this.caseLists.push(cases);
            // this.searchUser.setValue('');
            this.caseLists.forEach((element, i) => {
              element.candidateFirstName = element.candidateFirstName ? element.candidateFirstName : 'N/A';
              element.candidateLastName = element.candidateLastName ? element.candidateLastName : '';
              element.candidateMiddleName = element.candidateMiddleName ? element.candidateMiddleName : '';
              const Mname = element.screeningOwnerMName !== null ? element.screeningOwnerMName : '';
              const Lname = element.screeningOwnerLName !== null ? element.screeningOwnerLName : '';
              if (element.screeningOwnerFName) {
                element.screeningOwnerName = element.screeningOwnerFName + ' ' + Mname + ' ' + Lname;
                this.caseLists[i].screeningOwnerName = element.screeningOwnerFName + ' ' + Mname + ' ' + Lname;
              }
              // tslint:disable-next-line:max-line-length
              this.caseLists[i].candidateName = element.candidateFirstName + ' ' + element.candidateMiddleName + ' ' + element.candidateLastName;
            });
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', 'No Record Found');
        }
      });
      const ind = this.caseLists.findIndex(x => x.clientReferenceNo === this.searchUser.value);
      this.caseLists.splice(ind, 1);
    }
  }
  searchCaseClear(val: any) {
    if (!val) {
      this.searchFlag = false;
      this.caseLists = [];
    }
  }
  resetForm() {
    this.caseCreationFormGroup.reset();
    this.caseCreationFormGroup.markAsPristine();
    this.componentListpackid = [];
    this.compEditValues.packComponent = [];
    this.compEditValues.compCommonLists.caseComponent = [];
    this.compEditValues.compCommonLists.packageId = 0;
    this.savecrtCase.caseDocument = [];
    this.savecrtCase = new SaveScopeCreationVm();
    this.errormsg = '';
    this.checkbgvflag = false;
    this.packageflag = true;
    this.checkflag = false;
    this.searchUser.setValue('');
    this.initFormGroup();
    //this.breadcrumbFlags.btnResetTbl = false;
  }
  getTotalPages(totalRecords, rows) {
    if (this.historyFlag !== true) {
      this.totalpages = Math.ceil((totalRecords) / rows);
      return Math.ceil((totalRecords) / rows);
    } else {
      this.totalpages1 = Math.ceil((totalRecords) / rows);
      return Math.ceil((totalRecords) / rows);
    }
  }
  navigateNxtPrevPage(pageNo, rows) {
    if (this.historyFlag !== true) {
      this.currentPage = pageNo / rows;
      this.tempCurrentPage = this.currentPage;
      this.allcheck.setValue('');
    } else {
      this.currentPage1 = pageNo / rows;
      this.tempCurrentPage1 = this.currentPage1;
    }
  }
  navigatePage(pageNo, rowscount) {
    if (this.historyFlag !== true) {
      if (+pageNo > this.totalpages || +pageNo <= 0) {
        this.currentPage = this.tempCurrentPage;
      } else {
        this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
        this.tempCurrentPage = this.currentPage;
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
  getRecordBydate(fDate, tDate) {
    this.caseLists = this.filterCaseLists;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.caseLists.map(d => d.caseInititationDate = this.dateP.transform(d.caseInititationDate, 'yyyy-MM-ddThh:mm'));
    this.caseLists = this.filterCaseLists.filter(x =>
      x.caseInititationDate >= FromDate && x.caseInititationDate <= ToDate);
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.caseLists = this.filterCaseLists;
  }
  resetDateTime() {
    this.fromDateTime = '';
    this.toDateTime = '';
    this.caseLists = this.filterCaseLists;
  }
  getRecordBydateTime(fDateTime, tDateTime) {
    this.caseLists = this.filterCaseLists;
    const FromDateTime = this.dateP.transform(fDateTime, 'yyyy-MM-ddThh:mm');
    const ToDateTime = this.dateP.transform(tDateTime, 'yyyy-MM-ddThh:mm');
    this.caseLists.map(d => d.caseReceivedDate = this.dateP.transform(d.caseReceivedDate, 'yyyy-MM-ddThh:mm'));
    this.caseLists = this.filterCaseLists.filter(x =>
      x.caseReceivedDate >= FromDateTime && x.caseReceivedDate <= ToDateTime);
  }
  private TblAutoFilters(): void {
    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.clientReferenceNo).
          filter(x => x))).sort()).filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.applicantIdFilteredOptions = this.applicantIdFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.applicantId).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.candidateNameFilteredOptions = this.candidateNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.candidateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.siteFormCtrlFilteredOptions = this.siteFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.submittedbyFilteredOptions = this.submittedbyFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.userName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.assignedownerFilteredOptions = this.assignedownerFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.caseLists.map(x => x.screeningOwnerName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  private TblhistoryFilters(): void {
    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.clientRefNo).
          filter(x => x))).sort()).filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.siteFormCtrlFilteredOptions = this.siteFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.candidateNameFilteredOptions = this.candidateNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.candidateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.componentNameFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.crtNameFilteredOptions = this.crtNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.crtName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.packNameFilteredOptions = this.packNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.historyList.map(x => x.packageComponentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  ngOnDestroy(): void {
    this.screeningService.searchObj = '';
    this.screeningService.countflag = false;
    this.screeningService.historyFlag = false;
    this.searchFlag = false;
  }

  assignScrnOwner(data, type, index) {
    this.screeningOwnerId.setValue('');
    if (type === 'owner') {
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
  }
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.userData.filters = event.globalFilter ? "ClientRefNo@=" + event.globalFilter : '';
    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    const sort = event.sortField == 'candidateName' ? 'candidateFirstName' : event.sortField
    this.userData.sorts = event.sortOrder == -1 ? "-" + sort : sort;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    this.showHistory(true);
  }
  showHistory(flag: boolean) {
    const dummyData: any[] = [];
    this.historyFlag = true;
    this.showFlag = false;
    this.breadcrumbFlags.btnBack = true;
    this.btnExcelExport = true;
    this.userData.applyPaging = flag;
    this.screeningService.scopeHistory(this.userData).subscribe(res => {
      if (res) {
        const resp = res.body;
        this.totalpages = res.headers.get('X-Total-Count');
        this.loading = false;
        resp.forEach((element) => {
          //   c
          // });
          // resp.forEach((element, i) => {
          //   if (i === 0) {
          //     element.candidateName = element.candidateFirstName + ' ' + element.candidateMiddleName + ' '
          //       + element.candidateLastName;
          //     dummyData.push(element);
          //   } else {
          //     const isExist = dummyData.filter(e => e.caseNo === element.caseNo);
          //     if (isExist.length > 0) {
          //       isExist[0].componentName += ',' + element.componentName;
          //     } else {
          element.componentName = element.componentName + ' ' + element.subCompName;
          element.candidateName = element.candidateFirstName + ' ' + element.candidateMiddleName + ' '
            + element.candidateLastName;
          dummyData.push(element);
          //     }
          //   }
        });
        this.historyList = dummyData;
        this.TblhistoryFilters();
      }
    });
  }
  exportAsExcelFile() {
    // export to excel file
    let tabtext = '<table border="1px">';
    // var textRange;
    let j = 0;
    const header = this.dtHistory.columns;
    const filteredValue = this.dtHistory.filteredValue ? this.dtHistory.filteredValue : this.dtHistory.value; // id of table
    const lines = filteredValue.length;
    let headerColos = '';
    if (filteredValue.length > 0) {
      filteredValue.forEach(ele => {
        ele.caseCreatedDate = this.common.getTimezoneOffset(ele.caseCreatedDate, false);
        ele.caseCreatedDate = moment(ele.caseCreatedDate).format("YYYY-MM-DD HH:mm:ss");
        ele.scopeSubmittedDate = this.common.getTimezoneOffset(ele.scopeSubmittedDate, false);
        ele.scopeSubmittedDate = moment(ele.scopeSubmittedDate).format("YYYY-MM-DD HH:mm:ss");
      });
    }
    // the first headline of the table
    if (lines > 0) {
      header.forEach(h => {
        headerColos = headerColos + '<th bgcolor="#0E4872" style="font-size:15px;color:white">' + h.header + '</th>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';

    }

    for (j = 0; j < lines; j++) {
      headerColos = '';
      header.forEach(h => {
        headerColos = headerColos + '<td style="font-size:12px">' + filteredValue[j][h.field] + '</td>';
      });
      tabtext = tabtext + '<tr>' + headerColos + '</tr>';
    }
    tabtext = tabtext + '</table>';
    tabtext = tabtext.replace(/<A[^>]*>|<\/A>/g, '');          // remove if u want links in your table
    tabtext = tabtext.replace(/<img[^>]*>/gi, '');             // remove if u want images in your table
    tabtext = tabtext.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params
    const fileName = 'scopeCreation.xls';
    const exceldata = new Blob([tabtext], { type: this.EXCEL_TYPE });

    if ((window.navigator as any).msSaveBlob) { // IE 10+
      (window.navigator as any).msSaveOrOpenBlob(exceldata, fileName);
    } else {
      const link = document.createElement('a'); // create link download file
      link.href = window.URL.createObjectURL(exceldata); // set url for link download
      link.setAttribute('download', fileName); // set attribute for link created
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // this.exportAsExcelFile1(filteredValue, 'testreport', header);
  }

  checkbgv(e: any) {
    if (e.checked === true) {
      this.checkbgvflag = true;
      this.packageflag = false;
      this.errormsg = '';
      this.savecrtCase.caseComponent = [];
      this.breadcrumbFlags.btnSave = true;
    } else {
      this.checkbgvflag = false;
      this.packageflag = true;
      this.componentListpackid = [];
      this.caseComponent = [];
      this.savecrtCase.caseDocument = [];
      this.caseCreationFormGroup.get('packageId')?.setValue('');
      this.caseCreationFormGroup.get('PreApproval')?.setValue('');
      this.caseCreationFormGroup.get('supportingDocument')?.setValue('');
      this.caseCreationFormGroup.get('remarks')?.setValue('');
      this.caseCreationFormGroup.get('PreApproval')?.clearValidators();
      this.caseCreationFormGroup.get('PreApproval')?.updateValueAndValidity();
      this.savecrtCase.caseComponent = this.savecrtCase.caseComponent;
      //this.breadcrumbFlags.btnSave = false;
      if (this.checkbgvflag || this.checkflag) {
        this.breadcrumbFlags.btnSave = true;
      }
      else if (!this.checkbgvflag && !this.checkflag) {
        this.breadcrumbFlags.btnSave = false;
      }
      else {
        this.breadcrumbFlags.btnSave = false;
      }
    }    
    this.getRemarksLOAandBGV();
  }
  getCommonValues(e: CommonComponentVm) {
    this.compEditValues = e;
    this.errormsg = '';
  }
  updatePending(src, type) {
    this.breadcrumbFlags.toolTip = 'Update';
    this.btnSearch = false;
    this.initFormGroup();
    this.checkflag = false;
    this.packageflag = false;
    this.checkbgvflag = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.caseCreationFormGroup.controls.lOANotAvailable.disable();
    this.caseCreationFormGroup.controls.bGVNotAvailable.disable();
    this.caseCreationFormGroup.controls.PreApproval.disable();
    this.caseCreation.loaStatus = src.loaStatus;
    this.loaapproveflag = false;
    if (type === 'view') {
      this.breadcrumbFlags.btnSave = false;
    }
    if (src.stopCheckFlag === true) {
      this.stopcheckFlag = src.stopCheckFlag;
      this.breadcrumbFlags.btnSave = false;
      this.caseCreationFormGroup.controls.remarks.disable();
      this.caseCreationFormGroup.controls.StopCheckFlag.disable();
      this.caseCreationFormGroup.controls.StopCheckFlag.setValue(src.stopCheckFlag);
    }
    this.screeningService.lOABGVView(src.caseNo).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0];
        this.caseCreationFormGroup.patchValue({
          remarks: this.common.tempResetData.remarks,
          lOANotAvailable: this.common.tempResetData.loaNotAvailable,
          bGVNotAvailable: this.common.tempResetData.bgvNotAvailable,
          PreApproval: this.common.tempResetData.preApproval,
        });
      }
    });
    this.caseCreation.caseNo = src.caseNo;
    this.caseCreation.clientName = src.clientName;
    this.caseCreation.candidateName = src.candidateName;
    this.caseCreation.siteNo = src.siteNo;
    this.caseCreation.siteName = src.siteName;
    this.caseCreation.caseReceivedDate = src.caseReceivedDate;
    this.caseCreation.caseInitiationDate = src.caseInititationDate;
    this.caseCreation.clientReferenceNo = src.clientReferenceNo;
    this.caseCreation.applicantId = src.applicantId;
    this.caseCreation.urlName = src.urlName;
    this.caseCreation.clientId = src.clientId;
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  editdetail(data: any) {
    this.dataValue = data;
    this.screeningService.GetScopeCaseEditDetails(data.caseNo).subscribe(resp => {
      if (resp) {
        this.editDetail = resp;
        this.editDetail.caseInitiationDate = this.common.getTimezoneOffsetV2(data.caseInititationDate, false);
        this.editDetail.caseReceivedDate = this.common.getTimezoneOffsetV2(data.caseReceivedDate, false);
        this.editCase();
      }
    });
  }
  public editCase() {
    const dialogRef = this.dialog.open(this.editPopup, {
      width: '800px',
      disableClose: true
    });
  }
  submitCaseDetail() {
    if (this.firstName.value && this.caseReceivedDate.value && this.caseInitiationDate.value &&
      this.folderPath.value) {
      this.editDetail.loggedIn = this.userData.userId;
      this.editDetail.screenName = 'ScopeCreation';
      this.screeningService.UpdateScopeCaseDetails(this.editDetail).subscribe(resp => {
        if (resp) {
          this.caseCreation.caseInitiationDate = this.common.getTimezoneOffsetV2(this.editDetail.caseInitiationDate, true);
          this.caseCreation.caseReceivedDate = this.common.getTimezoneOffsetV2(this.editDetail.caseReceivedDate, true);
          this.caseCreation.urlName = this.editDetail.folderPath;
          this.caseCreation.applicantId = this.editDetail.applicantId;
          const CMname = this.editDetail.middleName ? this.editDetail.middleName : '';
          const CLname = this.editDetail.lastName ? this.editDetail.lastName : '';
          this.caseCreation.candidateName = this.editDetail.firstName + ' ' + CMname + ' ' +
            CLname;
          let caseStatus = '';
          this.showTopCenter('success', 'Success Message', 'Case Details Updated Successfully');
          this.dialog.closeAll();
          if (this.dataValue.screeningOwnerId === 0 && this.dataValue.loaNotAvailable !== true && this.dataValue.bgvNotAvailable !== true) {
            caseStatus = 'NotAssigned';
          } else if (this.dataValue.screeningOwnerId > 0 && this.dataValue.loaNotAvailable !== true
            && this.dataValue.bgvNotAvailable !== true) {
            caseStatus = 'Assigned';
            this.breadcrumbFlags.btnResetTbl = false;
          } else if ((this.dataValue.loaNotAvailable === true && this.dataValue.loaStatus === 'Approved') ||
            (this.dataValue.bgvNotAvailable === true && this.dataValue.loaStatus === 'Approved')) {
            caseStatus = 'LOAApproved';
          } else if ((this.dataValue.loaNotAvailable === true && this.dataValue.loaStatus === 'Pending') ||
            (this.dataValue.bgvNotAvailable === true && this.dataValue.loaStatus === 'Pending')) {
            caseStatus = 'LOAPending';
          }
          if (this.searchFlag === true) {
            this.searchCase();
          } else {
            if (this.userData.applicationId === 2) {
              this.bindScopeCreation('');
              this.displayedColumns = this.clientColumns;
              this.filednames = this.displayedColumns.filter(e => e.disabled);
            } else {
              this.bindScopeCreation(caseStatus);
            }
          }
        }
      });
    }
  }
  showall() {
    if (this.caseLists.length > 0) {
      this.itemperpage = this.caseLists.length;
    }
  }
  showallh() {
    if (this.historyList.length > 0) {
      this.itemperpageh = this.historyList.length;
    }
  }
  downloadApprovedDoc(data: any) {
    if (data.documentId) {
      this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
        if (resp.document) {
          this.common.downloadDocument(data.documentId, resp.document, data.fileName);
        } else {
          alert('file does not exists');
        }
      });
    }
    else {
      this.common.saveByteArray(data.fileName, data.document);
    }
  }
  downloadInfoceptDoc(data: any) {
    if (data.screeningDocId) {
      this.screeningService.downloadInfoceptCaseDocument(data.screeningDocId).subscribe(resp => {
        if (resp.document) {
          this.common.downloadDocument(data.screeningDocId, resp.document, data.fileName);
        } else {
          alert('file does not exists');
        }
      });
    }
    else {
      this.common.saveByteArray(data.fileName, data.document);
    }
  }
  preview(data: any) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.documentId == 0 || data.caseDocumentId == 0) {
        const blob = new Blob([data.document], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.documentId == 0 || data.caseDocumentId == 0) {
        const blob = new Blob([data.document], { type: 'application/octet-stream' });
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
          (window.navigator as any).msSaveOrOpenBlob(blob, data.fileName);
        } else {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display:none;');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        };
      }
      else if (data.documentId > 0) {
        this.screeningService.getDocumentDetail(data.documentId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        });
      }
      this.dialog.open(this.pdfDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else {
      this.downloadApprovedDoc(data);
    }
  }
  pdftool(type: any) {
    switch (type) {
      case 'right':
        this.rvalue += 90;
        break;
      case 'left':
        this.rvalue -= 90;
        break;
      case 'zoomin':
        this.zoomval += 0.1;
        break;
      case 'zoomout':
        this.zoomval -= 0.1;
        break;
      case 'reset':
        this.zoomval = 1;
        this.rvalue = 0;
        break;
      case 'download':
        this.downloadApprovedDoc(this.downldata);
        break;
      default:
        break;

    }
  }
  zoomin() {

    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;
    if (currWidth == 1500) return false;
    else {
      myImg.style.width = (currWidth + 100) + "px";
    }
  }

  zoomout() {
    var myImg = document.getElementById("imgpre");
    var currWidth = myImg.clientWidth;

    if (currWidth == 100) return false;
    else {
      myImg.style.width = (currWidth - 100) + "px";
    }
  }
  rotateimg(route: any) {
    this.dir = route
    this.state = (this.state === 'default' ? 'rotated' : this.dir);
  }
  goToStep(selectedIndex: any) {
    this.step1 = selectedIndex;
    if (this.step1 === 0) {
      this.step1 = 0;
      this.tab.selectedIndex = 0;
      this.stepperChange(0);
      const add = this.caseCreationFormGroup.value;
      this.breadcrumbFlags.btnSave = false;
    } if (this.step1 !== 0) {
      if (this.step1 === 1) {
        if (this.caseCreationFormGroup.valid) {
          this.compVal = this.addComp;
          if (this.addComp && this.addComp.compfrm.valid) {
            if (this.addComp && this.addComp.dt.value) {
              let compList: any[] = [];
              const comprawList = this.addComp.dt.value;
              this.savecrtCase.caseComponent = compList = comprawList.filter(f => {
                if (f.subCompFlag) {
                  f.caseSubComponent = f.packageSubComponent.filter(f1 => f1.ischecked === true);
                  if (f.caseSubComponent.length > 0) {
                    return true;
                  }
                } else {
                  return f.ischecked;
                }
              });
            }
          }
          if (this.savecrtCase.caseComponent.length > 0 || this.caseCreationFormGroup.controls.packageId.value > 0) {
            this.caseComponentList = [];
            const caseComponent = this.savecrtCase.caseComponent;

            caseComponent.forEach(ele => {
              if (ele.subCompFlag === true && ele.caseSubComponent.length > 0) {
                ele.caseSubComponent.forEach(el => {
                  this.caseComponentVm = new CaseComponentVm();
                  if (el.ischecked === true) {
                    this.caseComponentVm.compName = ele.compName + ' - ' + el.subCompName;
                    this.caseComponentVm.noOfComponent = el.noOfComponent;
                    this.caseComponentVm.price = el.price;
                    let tblList: any;
                    this.caseComponentList.push(this.caseComponentVm);
                    tblList = this.caseComponentList;

                  }
                });
              } else {
                this.caseComponentList.push(ele);
              }
            });
            this.step1 = 1;
            this.tab.selectedIndex = 1;
            this.mattableSource = this.caseComponentList;
            if (this.caseCreationFormGroup.controls.packageId.value > 0) {
              this.screeningService.getComponentByPackageId(this.caseCreationFormGroup.controls.packageId.value).subscribe(res => {
                if (res) {
                  this.packComponent = res;
                  if (this.packComponent.length > 0) {
                    const pcomp: any[] = [];
                    const packComp = this.packComponent;
                    packComp.forEach(ele => {
                      if (ele.packageSubComponent && ele.packageSubComponent.length > 0) {
                        ele.packageSubComponent.forEach(el => {
                          this.caseComponentVm = new CaseComponentVm();
                          this.caseComponentVm.compName = ele.compName + ' - ' + el.subCompName;
                          this.caseComponentVm.noOfComponent = el.noOfComponent;
                          this.caseComponentVm.price = this.packPrice;
                          pcomp.push(this.caseComponentVm);
                        });
                        this.packComponentList = pcomp;
                      } else {
                        ele.price = this.packPrice;
                        pcomp.push(ele);
                        this.packComponentList = pcomp;
                      }
                    });
                  }
                  this.packtableSource = this.packComponentList;
                  this.step1 = 1;
                  this.tab.selectedIndex = 1;
                }
              });
              if (this.packagelist.length > 0) {
                const packName = this.packagelist.find(x => x.packageId === this.caseCreationFormGroup.controls.packageId.value);
                this.packName = packName.packageName;
                this.packPrice = packName.price;
              }
              if (this.savecrtCase.caseComponent.length > 0 && this.caseCreationFormGroup.controls.packageId.value === 0) {
                this.packtableSource = this.packComponentList;
                this.step1 = 1;
                this.tab.selectedIndex = 1;
              }
            } this.stepperChange(selectedIndex);
            this.breadcrumbFlags.btnSave = true;
          } else {
            this.caseCreationFormGroup.markAllAsTouched();
            if(this.tab){
            this.tab.selectedIndex = 0;
            }
            this.step1 = 0;
            this.scroll.scrollToError();
            this.showTopCenter('warn', 'Alert', 'Please select atleast one component or package');
          }
        }

      }
    }
  }
  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
  }
  openConfirmDialog(data: any) {
    this.removeScopeComp.CaseNo = data.caseNo;
    this.removeScopeComp.ClientRefNo = data.clientRefNo;
    this.removeScopeComp.UserId = this.userData.userId;
    this.candidatename = data.candidateName;
    let employeeId: any[] = [];
    this.screeningService.getScopeDetail(data.caseNo).subscribe(res => {
      this.ScopeComp = res.scopeCompdet;
      this.ScopeCompDet = res.scopeSCompdet;
      if (this.ScopeCompDet.length > 0) {
        return this.showTopCenter('warn', 'Failure Message', 'This Scope is Already Submitted');
      }
      else {
        this.packComp = res.packageCompdet
        this.susComp = employeeId;
        if (this.packComp) {
          this.allScopeComp = this.ScopeComp.concat(this.packComp);
        }
        else {
          this.allScopeComp = this.ScopeComp
        }
        const dialogRef = this.dialog.open(this.ScopeCompopup, {
          width: '800px',
          disableClose: true

        });
      }
    })
  }

  getPageEnd(totalRecords: number, first: number, rows: number): number {
  if (totalRecords === 0) return 0;
  const end = first + rows;
  return end <= totalRecords ? end : totalRecords;
}

  selectComp() {
    if (this.ComponentId.length > 0) {
      this.removeScopeComp.ScopeCompdet = this.ComponentId;
      this.screeningService.removeScopeComponents(this.removeScopeComp).subscribe(res => {
        if (res) {
          this.showHistory(true);
          this.dialog.closeAll();
          this.ComponentId = [];
          return this.showTopCenter('success', 'Success Message', 'Deleted Successfully');

        }
      });
    }
    else {
      this.showTopCenter('info', 'Failure Message', 'Select atleast one Component / Package to Delete');
    }
  }

  
}


class RemoveScopeVM {
  ScopeCompdet: ComponentVM[] = [];
  UserId: number;
  Type: string;
  ScreeningCompId: number;
  CaseNo: number;
  ClientRefNo: string;
}
class ComponentVM {
  Status: string;
  ComponentId: number;
  CompName: string
  CompShotName: string;
  SubFlag: boolean;
  SubCompName: string;
  SubCompFlag: boolean;
  SubCompId: number
}
