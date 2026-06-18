import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { MasterService } from 'src/app/common-methods/services/master.service';
// import { DataTable, LazyLoadEvent, MessageService } from 'primeng/primeng';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Table, TableHeaderCheckbox } from 'primeng/table';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { ReportContactRemarkVm } from '../contact-remarks/contact-remarks.component';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { debug } from 'console';
import { forEach } from 'jszip';
// import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

export interface PeriodicElement {
  position: number;
  empname: string;
  address: string;
  created: string;
  cdate: string;
  empstatus: string;
}
@Component({
  standalone: false,
  selector: 'app-ins-for-research',
  templateUrl: './ins-for-research.component.html',
  styleUrls: ['./ins-for-research.component.css'],
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
export class InsForResearchComponent implements OnInit {

  frDocumemtnVm: FrDocument[] = [];
  alertFlag: boolean = false;
  Message: any;
  disableMovetoFrVeFlag: boolean = false;
  headerText: string;
  messageAlert: string;
  movetoVEFlag: boolean;
  movetoFRFlag: boolean;
  empID: any = 0;
  FRandVEData: any[] = [];
  dialogRef: any;
  tempname: any;
  frFlowList: any[] = [];
  moveoVeTrfication: any;
  ratainInFR: any;
  searchValue: string = '';
  researchEmpInsValueExport: any[] = [];
  ConcludeFlag = false;
  isExport: boolean = false;
  isShowAll: boolean = false;
  isAssigned: boolean = false;
  isReset: boolean = false;
  rejectComments = new UntypedFormControl();
  EmpInsName: string;
  ForResearchRejectVm = new ForResearchRejectVm();
  forResearchVm: ForResearchMailVM;
  Smdocument: any[] = [];
  RejectedRemarks: string;
  state: string = 'default';
  url: any;
  MailFlag: any;
  dir: string;
  imageSource: any;
  downldata: any;
  downid: any;
  imageChangedEvent: any = '';
  downname: any;
  downmethod: any;
  zoomval: number;
  rvalue: number;
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('empDomaindatepopup', { static: true }) empDomaindatepopup!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog: TemplateRef<any>;
  bgColor = 'grey';
  BusinesscatName: any;
  color: string
  SelectedOptionname: any;
  SelectedStatusOption: any;
  quesremarks: string;
  colorvalue: string;
  quesrm; any;
  questions: any;
  questions1: any;
  quesdes: string;
  quesdes1: any[];
  itemperpage: number;
  countq = 0;
  counta = 0;
  provalue = 0;
  proAnsvalue = 0;
  showcountq = false;
  @ViewChild('global') global!: ElementRef;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number = 0;
  pageIndexs: number;
  isGridPage = true;
  btnApprove = false;
  empFlag = false;
  researchStatusValue: LookUpValue[] = [];
  researchStatusLookUpValue: any;
  researchunableStatusLookUpValue: any;
  researchEmpInsValue: ResearchEmpIns[] = [];
  selectedResearch: ResearchEmpIns[] = [];
  assignControl = new UntypedFormControl('Not Assigned');
  private table: Table;
  private headerCheckBox: TableHeaderCheckbox;
  private headerCheckBoxVE: TableHeaderCheckbox;
  private headerCheckBoxFR: TableHeaderCheckbox;
  private headerCheckBoxMovetoVE: TableHeaderCheckbox;
  private headerCheckBoxMovetoFR: TableHeaderCheckbox;
  @ViewChild('verifiedList') verifiedList!: any;
  @ViewChild('assignPopUp') assignPopUp!: any;
  @ViewChild('rem') Textarea!: ElementRef;
  screeningOwner = new UntypedFormControl('', Validators.required);
  filterOwnerName = new UntypedFormControl();
  selectedQAIndex = 0;
  column: any[] = [];
  employerVerifiedForm: UntypedFormGroup;
  employerFilter: VerifiedEmployer = new VerifiedEmployer();

  gridColumnsAll = [
    // { field: 'check', header: '' },
    // { field: 'name', header: 'Employer Name' },
    // { field: 'referenceNo', header: 'Reference No' },
    // { field: 'countryName', header: 'Address' },
    // { field: 'createdDate', header: 'Created Date' },
    // { field: 'researchStatus', header: 'Status' },
    // { field: 'assignToFirstName', header: 'Assigned Owner' },
    // { field: 'assignByFirstName', header: 'Assigned By' },
    // { field: 'submittedByFirstName', header: 'Submitted By' },
    // { field: 'assignedDate', header: 'Assigned Date' },
  ];
  gridFrozenCols = [
    // { field: 'action', header: 'Action' },
  ];
  iconremoveflag: boolean;
  screenAuth: any = {}; currentPath = ''; routePath = '';
  ResearchQuestAnsValue: ResearchQuestAns[] = [];
  frDocList = new frsendDocList();
  size = 0;
  header: ResearchEmpIns = null;
  userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  fromDate = '';
  toDate = '';
  assignedFromDate = '';
  assignedToDate = '';
  statusId = new UntypedFormControl(null);
  researchEmpInsCloneValue: any[] = [];
  @ViewChild('siteVisit') siteVisit!: TemplateRef<any>;
  @ViewChild('businessType') businessType!: TemplateRef<any>;
  @ViewChild('moveToFileSub') moveToFileSub!: TemplateRef<any>;
  @ViewChild('confirmation') confirmation!: TemplateRef<any>;
  @ViewChild('MovetoFRVEPopUp') MovetoFRVEPopUp!: TemplateRef<any>;
  //dialogRef: any;
  businessCategory: any[] = [];
  businessCategoryId = new UntypedFormControl();
  arrangedFlag: any;
  owner: any[] = [];
  updatedByFirstNameFormCtrl = new UntypedFormControl();
  updatedByFirstNameFilteredOptions!: Observable<string[]>;
  @ViewChild('updatedByFirstNameTrigger') updatedByFirstNameTrigger!: MatMenuTrigger;

  nameFormCtrl = new UntypedFormControl();
  nameFilteredOptions!: Observable<string[]>;
  @ViewChild('nameTrigger') nameTrigger!: MatMenuTrigger;

  referenceNoFormCtrl = new UntypedFormControl();
  referenceNoFilteredOptions!: Observable<string[]>;
  @ViewChild('referenceNoTrigger') referenceNoTrigger!: MatMenuTrigger;

  countryNameFormCtrl = new UntypedFormControl();
  countryNameFilteredOptions!: Observable<string[]>;
  @ViewChild('countryNameTrigger') countryNameTrigger!: MatMenuTrigger;

  researchStatusFormCtrl = new UntypedFormControl();
  researchStatusFilteredOptions!: Observable<string[]>;
  @ViewChild('researchStatusTrigger') researchStatusTrigger!: MatMenuTrigger;

  assignToFirstNameFormCtrl = new UntypedFormControl();
  assignToFirstNameFilteredOptions!: Observable<string[]>;
  @ViewChild('assignToFirstNameTrigger') assignToFirstNameTrigger!: MatMenuTrigger;

  researchResultFormCtrl = new UntypedFormControl();
  researchResultFilteredOptions!: Observable<string[]>;
  @ViewChild('researchResultTrigger') researchResultTrigger!: MatMenuTrigger;

  @ViewChild('createdDateTrigger') createdDateTrigger!: MatMenuTrigger;
  @ViewChild('assignedDateTrigger') assignedDateTrigger!: MatMenuTrigger;
  dupList: any[] = [];
  assignedDupList: any[] = [];
  rejectedRemarks = new UntypedFormControl();
  verificationIdList: any;
  activeParams: any;
  isMoveVEAll: boolean = false;
  isMoveFRAll: boolean = false;
  MoveVEAll: boolean = false;
  MoveFRAll: boolean = false;
  alertFlags: boolean;
  columnName = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'clientReferenceNo', header: 'Reference No' },
    { field: 'isMoveVE', header: 'Move To Verification' },
    { field: 'isMoveFR', header: 'Retain In FR' }
  ];
  // paymentModeList: any[] = [];
  constructor(private sanitizer: DomSanitizer, public screeningService: ScreeningService, public masterService: MasterService, public common: CommonService, private router: Router,
    // tslint:disable-next-line: align
    public verificationService: VerificationService, private message: MessageService, private activeRoute: ActivatedRoute, private dateP: DatePipe, public dialog: MatDialog, public verification: VerificationService) { }
  ngOnInit() {
    this.initCloseFormGroup();
    this.quesremarks = '';
    this.itemperpage = 10;
    this.currentPath = (this.router.url).split('/')[(this.router.url).split('/').length - 2];
    this.activeParams = (this.router.url).split('/')[(this.router.url).split('/').length - 1];
    if (this.currentPath === 'insResearch') {
      this.routePath = 'Configure / Institution / Institution Research';
      // this.gridColumnsAll.filter(e => e.field === 'name')[0].header = 'Institution Name';
    } else if (this.currentPath === 'empResearch') {
      this.empFlag = true;
      this.routePath = 'Configure / Employer / Employer Research';
    }
    // this.getPaymentMode();
  }
  // getPaymentMode() {
  //   this.verificationService.getPaymentModeList().subscribe(resp => {

  //     this.paymentModeList = resp;

  //   });
  // }
  public loadFrFlowList(): void {
    const frSatusName = this.researchEmpInsValue[0].researchStatus;
    this.masterService.loadFrFlowList(this.empFlag, this.header.empInsId, this.header.empInsAddressId, this.userData.teamName, this.header.clientId, this.userData.userId, frSatusName).subscribe((res) => {
      if (res) {
        this.frFlowList = res;
        this.frFlowList.forEach(element => {
          element.issaved = element.isMoveVE || element.isMoveFR
          //  || element.disableMovetoFrVeFlag;
          // this.disableMovetoFrVeFlag = element.disableMovetoFrVeFlag;
          element.notselected = false;
        });
        this.isMoveVEAll = this.frFlowList.filter(s => s.isMoveVE === true).length === this.frFlowList.length;
        this.isMoveFRAll = this.frFlowList.filter(s => s.isMoveFR === true).length === this.frFlowList.length;
      }
    })
  }

  public changeWorkFlow(i, e, data: string): void {
    if (this.frFlowList.length > 0) {
      if (data === "VE") {
        this.frFlowList[i].isMoveVE = e;
        this.frFlowList[i].isMoveFR = false;
        this.frFlowList[i].notselected = false;
      } else {
        this.frFlowList[i].isMoveVE = false;
        this.frFlowList[i].isMoveFR = e;
        this.frFlowList[i].notselected = false;
      }
      this.isMoveVEAll = this.frFlowList.filter(s => s.isMoveVE === true).length === this.frFlowList.length;
      this.isMoveFRAll = this.frFlowList.filter(s => s.isMoveFR === true).length === this.frFlowList.length;
    }
  }
  public SelectAll(e, data: string): void {
    if (e === true) {
      if (data === "VE") {
        this.isMoveVEAll = e;
        this.isMoveFRAll = !e;
        this.frFlowList.forEach(x => {
          x.isMoveVE = (x.issaved == false && (x.disableMovetoFrVeFlag != false || x.showHideApprovedFlag != false)) ? true : x.isMoveVE;
          x.isMoveFR = x.issaved == false ? false : x.isMoveFR;
          x.notselected = false;
        });
      }
      else {
        this.isMoveVEAll = !e;
        this.isMoveFRAll = e;
        this.frFlowList.forEach(x => {
          x.isMoveVE = x.issaved == false ? false : x.isMoveVE;
          x.isMoveFR = (x.issaved == false && (x.disableMovetoFrVeFlag != false || x.showHideApprovedFlag != false)) ? true : x.isMoveFR;
          x.notselected = false;
        });
      }
    } else {
      this.isMoveFRAll = false;
      this.isMoveVEAll = false;
      this.frFlowList.forEach(x => {
        x.isMoveVE = x.issaved == false ? false : x.isMoveVE;
        x.isMoveFR = x.issaved == false ? false : x.isMoveFR;
      });

      // if (data === "VE") {      //   this.frFlowList.forEach(x => {
      //     x.isMoveVE = false;
      //     x.isMoveFR = false;
      //   });
      // }
      // else {
      //   this.frFlowList.forEach(x => {
      //     x.isMoveVE = false;
      //     x.isMoveFR = false;
      //   });
      // }
    }
  }

  movetoVEWorKFlow(emp, event, data: string, empIDList: any): void {
    if (this.researchEmpInsValue.length > 0) {
      if (data === "VE") {
        empIDList.forEach((element, index) => {
          if (element.empInsId == emp.empInsId && element.empInsAddressId == emp.empInsAddressId) {
            element.movetoFR = false;
            element.movetoVE = event;
          }
          if (element.movetoVE == true) {
            this.headerText = 'Alert',
              this.messageAlert = 'Would you like to move this employer  (' + emp.name + ')to the Verification queue';
            this.movetoVEFlag = element.movetoVE;
            this.openDialog(this.messageAlert)
          }
        })
      }
      else {
        empIDList.forEach((element, index) => {
          if (element.empInsId == emp.empInsId && element.empInsAddressId == emp.empInsAddressId) {
            element.movetoVE = false;
            element.movetoFR = event;
          }
          if (element.movetoFR == true) {
            this.headerText = 'Alert',
              this.messageAlert = 'Would you like to move this employer  (' + emp.name + ')back to unverified lists';
            this.movetoFRFlag = element.movetoFR;

            this.openDialog(this.messageAlert)
          }
        })
      }
    }
    this.empID = emp.empInsId;
  }
  public openDialog(msg: string) {
    this.dialogRef = this.dialog.open(this.MovetoFRVEPopUp, {
      width: '320px',
      disableClose: true
    });

  }

  movetoFRandVEFlow(data: string, researchEmpInsValue: any, empID?: number) {
    this.FRandVEData = [];
    researchEmpInsValue.forEach(element => {
      const movetoFRFlow: string = element.movetoFR === true ? 'MovetoFR' : 'MovetoVE';
      if (element.movetoFR == true || element.movetoVE == true) {
        this.FRandVEData.push({
          screeningCompID: element.screeningCompId,
          // empInsId: empID,
          empInsId: element.empInsId,
          empInsAddressId: element.empInsAddressId,
          loggedIn: this.userData.userId,
          movetoFRandVEFlow: movetoFRFlow,
        });
      }
    })
    if (data === "FR") {
      this.masterService.AddMoveToFRandVE(this.FRandVEData).subscribe(resp => {
        if (resp.success) {
          this.movetoFRFlag = false;
          this.showTopCenter('success', 'saved Successfully', 'For-Research Successfully saved');
          this.getResearchStatus();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Failed');
        }
      });
    }
    else {
      this.masterService.AddMoveToFRandVE(this.FRandVEData).subscribe(resp => {
        if (resp.success) {
          this.movetoVEFlag = false;
          this.showTopCenter('success', 'saved Successfully', 'Verification Queue Successfully saved');
          this.getResearchStatus();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Failed');
        }
      });
    }

  }
  dialogCancel() {
    this.researchEmpInsValue.forEach((e) => {
      e.movetoFR = false;
      e.movetoVE = false;
    });
    this.movetoVEFlag = false;
    this.movetoFRFlag = false;
  }

  getFilterValue(value: any) {
    if (value == 'Assigned') {
      this.isAssigned = true;
    } else {
      this.isAssigned = false;
    }
    this.getResearchStatus();
  }
  assignDialog() {
    this.screeningOwner.setValue('');
    if (this.selectedResearch.length > 0) {
      this.masterService.ForResearchTeamAssignOwnerList(this.empFlag, this.userData.teamName, this.userData.subTeam, this.userData.deptId).subscribe(res => {
        this.owner = res;
        this.owner.forEach(element => {
          element.screeningOwnerFName = element.screeningOwnerFName ? (element.screeningOwnerFName + (element.screeningOwnerMName ?
            (' ' + element.screeningOwnerMName) : '') + (element.screeningOwnerLName ? (' ' + element.screeningOwnerLName) : '')) : '';
        });
      });
      this.dialogRef = this.dialog.open(this.assignPopUp, {
        width: '400px',
        disableClose: true
      });
    } else {
      this.showTopCenter('error', 'Failure Message', ('Choose atleast one ' + (this.empFlag === true ? 'Employer' : 'Institution')));
    }
  }
  assignScrnOwner(data, index) {
    this.screeningOwner.setValue('');
    const ind = this.owner.findIndex(x => x.screeningOwnerFName === data.screeningOwnerFName);
    if (ind > -1) {
      this.screeningOwner.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      if (ele.length > 0) {
        for (let i = 0; i < this.owner.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.owner = Object.assign([], this.owner);
    } else {
      this.showTopCenter('error', 'Choose Active User', 'Owner name is In-active');
    }
  }
  submitOwner(owner: any) {
    if (this.screeningOwner.valid) {
      const list: any[] = [];
      const listScreeCompId: any[] = [];
      this.selectedResearch.forEach(element => {
        list.push({ empInsId: element.empInsId, empinsAddressId: element.empInsAddressId, clientCategoryId: element.clientCategoryId });
        listScreeCompId.push(element.screeningCompId)
      });
      const assiginownerList = {
        AssignCase: list, listScreeCompId, deptId: 0, screeningOwnerId: owner.screeningOwnerId, LoggedIn: this.userData.userId,
        empFlag: this.empFlag
      };
      this.masterService.AssignResearchScreeningOwner(assiginownerList).subscribe(res => {
        if (res.success === true) {
          this.dialogRef.close();
          this.showTopCenter('success', 'Success Message', 'Assigned Successfully');
          this.statusId.setValue(null);
          this.researchEmpInsValue = [];
          this.getResearchStatus();
        }
      });
    }
  }
  isRowDisabled(data: any): boolean {
    return data.researchStatus.toLowerCase() === this.common.VERIFIED.toLowerCase();
  }
  onSelectionChange(selection: any[]) {
    for (let i = selection.length - 1; i >= 0; i--) {
      const data = selection[i];
      if (this.isRowDisabled(data)) {
        selection.splice(i, 1);
      }
    }
    this.selectedResearch = selection;
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    const feeApp = this;
    // tslint:disable-next-line:only-arrow-functions
    if (this.headerCheckBox) {
      this.headerCheckBox.updateCheckedState = function () {
        const fees: any[] = feeApp.table.filteredValue || feeApp.table.value;
        const selection: any[] = feeApp.table.selection;
        for (const fee of fees) {
          if (!feeApp.isRowDisabled(fee)) {
            const selected = selection && selection.indexOf(fee) >= 0;
            if (!selected) { return false; }
          }
        }
        return true;
      };
    }

  }
  statusChange(value: any) {
    const val = this.gridColumnsAll.some(x => x.field === 'researchResult');
    if (value !== this.common.underReviewStatus) {
      this.researchEmpInsValue = this.researchEmpInsCloneValue.filter(x => x.researchStatusId === value.
        lookUpId && ((this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) ?
          (this.assignControl.value === 'Assigned' ? x.assignToUserId > 0 : !(x.assignToUserId > 0)) : true));
      if (this.researchEmpInsValue.some(x => x.researchStatus.toLowerCase() === this.common.VERIFIED.toLowerCase())) {
        if (!val) { this.gridColumnsAll.splice(7, 0, { field: 'researchResult', header: 'Research Result' }); }
      } else {
        if (val) { this.gridColumnsAll.splice(7, 1, { field: 'researchResult', header: 'Research Result' }); }
      }
    } else if (value === this.common.underReviewStatus) {
      this.researchEmpInsValue = this.researchEmpInsCloneValue.filter(x => x.researchResult === value && ((this.userData.teamLeadFlag === true || this.userData.subTeamLeadFlag === true) ?
        (this.assignControl.value === 'Assigned' ? x.assignToUserId > 0 : !(x.assignToUserId > 0)) : true));
      if (this.researchEmpInsValue.some(x => x.researchStatus.toLowerCase() === this.common.VERIFIED.toLowerCase())) {
        if (!val) { this.gridColumnsAll.splice(7, 0, { field: 'researchResult', header: 'Research Result' }); }
      } else {
        if (val) { this.gridColumnsAll.splice(7, 1, { field: 'researchResult', header: 'Research Result' }); }
      }
    }
    else {
      this.researchEmpInsValue = this.researchEmpInsCloneValue.filter(x => ((this.userData.teamLeadFlag === true || this.userData.
        subTeamLeadFlag === true) ? (this.assignControl.value === 'Assigned' ? x.assignToUserId > 0 : !(x.assignToUserId > 0)) : true));
      if (val) { this.gridColumnsAll.splice(7, 1, { field: 'researchResult', header: 'Research Result' }); }
    }
  }

  loadInsEmp(event: LazyLoadEvent) {
    let modulo = ((event.first + event.rows) % event.rows)
    // this.userData.page = modulo + (event.first == 0 ? 1 : 0);
    this.userData.page = modulo + (event.first == 0 ? 1 : (event.first + event.rows) / event.rows);
    this.userData.pageSize = 10;
    let filters = event.filters;
    const sort = event.sortField;
    this.userData.sorts = sort ? (event.sortOrder == -1 ? '-' : '') + sort : '';
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    if (Object.keys(event.filters).length > 0 || event.sortField || this.userData.page) {
      this.getResearchStatus();
    }
  }
  globalSearch(searchvalue: any) {
    this.userData.needTotal = true;
    this.userData.filters = searchvalue ? "(name|referenceNo|assignByFirstName|assignToFirstName|researchStatus)@=" + searchvalue : '';
    this.getResearchStatus();
  }
  initCloseFormGroup() {
    this.employerVerifiedForm = new UntypedFormGroup({
      submittedFromDate: new UntypedFormControl(null),
      submittedToDate: new UntypedFormControl(null),
      clientRefNo: new UntypedFormControl(null),
      employerVerifiedName: new UntypedFormControl(null),
    });
  }
  searchCloseChk() {
    if (this.employerVerifiedForm.value.submittedFromDate || this.employerVerifiedForm.value.submittedToDate || this.employerVerifiedForm.value.clientRefNo || this.employerVerifiedForm.value.employerVerifiedName) {
      this.userData.filters = '';
      if (this.employerVerifiedForm.value.clientRefNo && this.employerVerifiedForm.get('clientRefNo')?.valid) {
        this.employerFilter.clientRefNo = this.employerVerifiedForm.value.clientRefNo;
      }
      if (this.employerVerifiedForm.value.employerVerifiedName && this.employerVerifiedForm.get('employerVerifiedName')?.valid) {
        this.userData.filters = this.employerVerifiedForm.value.employerVerifiedName ? "(name)@=" + this.employerVerifiedForm.value.employerVerifiedName : '';
      }
      if (this.employerVerifiedForm.value.submittedFromDate && this.employerVerifiedForm.get('submittedFromDate')?.valid) {
        this.employerFilter.submittedFromDate = new DatePipe('en-Us').transform(this.employerVerifiedForm.value.submittedFromDate, 'yyyy-MM-dd');
      }
      if (this.employerVerifiedForm.value.submittedToDate && this.employerVerifiedForm.get('submittedToDate')?.valid) {
        this.employerFilter.submittedToDate = new DatePipe('en-Us').transform(this.employerVerifiedForm.value.submittedToDate, 'yyyy-MM-dd');
      }
      this.getResearchStatus();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  getResearchStatus(flag = true) {
    let userDetails = this.userData;
    if (this.isExport || this.isShowAll) {
      userDetails.applyPaging = false;
      userDetails.needTotal = false;
    }
    this.masterService.getResearchEmpInsDet(this.currentPath === 'empResearch', this.isAssigned, 0, userDetails, this.activeParams, this.employerFilter).subscribe(getResearchEmpInsDetData => {
      if (getResearchEmpInsDetData) {
        if (this.isExport) {
          //For reload process and shows as N/A for some fields
          this.resetExcel();
          getResearchEmpInsDetData.body.forEach(ele =>
            Object.assign(ele, ele.commonInsEmpResearchVm)
          );
          this.researchEmpInsValueExport = getResearchEmpInsDetData.body;
          this.researchEmpInsValueExport.forEach(element => {
            element.countryName = (element.districtName ? (element.districtName + ' , ') : '') + (element.stateName ? (element.stateName + ' , ') : '') + (element.countryName ? (element.countryName) : '');
            element.address = ((element.address ? (element.address + ',') : null)) + (element.countryName ? element.countryName : null);
          });
          this.column = [{ field: 'name', header: 'Employer Name' }, { field: 'referenceNo', header: 'Reference No' },
          { field: 'address', header: 'Address' }, { field: 'postalCode', header: 'Zip Code' }, { field: 'createdDate', header: 'Created Date' },
          { field: 'researchStatus', header: 'Status' },
          { field: 'researchResult', header: 'Result Status' },
          { field: 'assignToFirstName', header: 'Assigned Owner' }, { field: 'researchResult', header: 'Research Result' },
          { field: 'assignByFirstName', header: 'Assigned By' },
          { field: 'submittedByFirstName', header: 'Submitted/Rejected' },
          { field: 'assignedDate', header: 'Assigned Date' },
          { field: 'approvedBy', header: 'Approved By' },
          { field: 'approvedDate', header: 'Approved Date' },
          { field: 'verificationID', header: 'Verification ID' },];

          //VTS2-2023-FR-0125 :- Ajith :-add new columns in the report which contains the verified employer list and remove the column called “Remarks”
          if (this.currentPath === 'empResearch' && this.researchEmpInsValue[0].researchStatus.toLowerCase() === "verified") {
            this.column.push(
              { field: 'remarks', header: 'Case comments' },
              { field: 'researchConclusion', header: 'Conclusion' }
            )
          }
          else if (this.currentPath === 'empResearch' && this.researchEmpInsValue[0].researchStatus.toLowerCase() !== "reverify") {
            this.column.push(
              { field: 'remarks', header: 'Remarks' }
            )
          }

          if (this.researchEmpInsValue[0].researchStatus.toLowerCase() === "reverify") {
            this.column.push(
              { field: 'verificationID', header: 'Verification ID' },
              { field: 'lastVerifiedStatus', header: 'Last Verified Status' },
              { field: 'casecomments', header: 'Case comments' },
              { field: 'conclusion', header: 'Conclusion' },
              { field: 'lastVerifiedDate', header: 'Last Verified Date' })
          }
          if (this.currentPath === 'insResearch') {
            this.routePath = 'Configure / Institution / Institution Research';
            this.column.filter(e => e.field === 'name')[0].header = 'Institution Name';
            this.column.push(
              { field: 'remarks', header: 'Remarks' }
            )
          }
          if (this.researchEmpInsValue[0].researchStatus.toLowerCase() === "reverify") {
            let removeHeader = ['Remarks', 'Zip Code', 'Created Date', 'Status', 'Result Status', 'Assigned Owner', 'Assigned By', 'Assigned Date'
              , 'Submitted/Rejected', 'Approved Date',];
            this.column = this.column.filter(e => !removeHeader.includes(e.header));
          }

          this.common.exportToExcel(this.column, this.researchEmpInsValueExport, 'ForResearch');
        } else {
          this.researchEmpInsValue = [];
          // this.researchEmpInsValue = getResearchEmpInsDetData.body;

          getResearchEmpInsDetData.body.forEach(ele => {
            const filter = ele.commonInsEmpResearchVm;
            ele.researchConclusion = filter.researchConclusion,
              ele.businessCategoryLookupId = filter.businessCategoryLookupId,
              ele.researchStatusId = filter.researchStatusId,
              ele.researchResultId = filter.researchResultId,
              ele.underReviewLookupId = filter.underReviewLookupId,
              ele.assignByFirstName = filter.assignByFirstName,
              ele.assignByMiddleName = filter.assignByMiddleName,
              ele.assignByLastName = filter.assignByLastName,
              ele.assignToFirstName = filter.assignToFirstName,
              ele.assignToLastName = filter.assignToLastName,
              ele.assignToMiddleName = filter.assignToMiddleName,
              ele.assignToUserId = filter.assignToUserId,
              ele.assignedDate = filter.assignedDate,
              ele.ctsFlag = filter.ctsFlag,
              ele.researchStatus = filter.researchStatus,
              ele.researchResult = filter.researchResult,
              ele.approvedBy = filter.approvedBy,
              ele.approvedDate = filter.approvedDate != null ? this.dateP.transform(filter.approvedDate, 'dd/MM/yyyy') : null,
              ele.createdDate = filter.createdDate,
              ele.updatedBy = filter.updatedBy,
              ele.updatedByFirstName = filter.updatedByFirstName,
              ele.updatedByMiddleName = filter.updatedByMiddleName,
              ele.updatedByLastName = filter.updatedByLastName,
              ele.clientCategoryId = filter.clientCategoryId,
              ele.clientId = filter.clientId,
              ele.remarks = filter.remarks,
              ele.verificationId = filter.verificationID,
              ele.categoryLookupId = filter.categoryLookupId
          })
          //getResearchEmpInsDetData.body.map(m => m.approvedDate = m.approvedDate != null ? this.dateP.transform(m.approvedDate, 'dd/MM/yyyy') : null);
          this.researchEmpInsValue = getResearchEmpInsDetData.body;
          // getResearchEmpInsDetData.body.map(m => {
          //   m.researchConclusion = m.commonInsEmpResearchVm.researchConclusion,
          //     m.businessCategoryLookupId = m.commonInsEmpResearchVm.businessCategoryLookupId,
          //     m.researchStatusId = m.commonInsEmpResearchVm.researchStatusId,
          //     m.researchResultId = m.commonInsEmpResearchVm.researchResultId,
          //     m.underReviewLookupId = m.commonInsEmpResearchVm.underReviewLookupId,
          //     m.assignByFirstName = m.commonInsEmpResearchVm.assignByFirstName,
          //     m.assignByMiddleName = m.commonInsEmpResearchVm.assignByMiddleName,
          //     m.assignByLastName = m.commonInsEmpResearchVm.assignByLastName,
          //     m.assignToFirstName = m.commonInsEmpResearchVm.assignToFirstName,
          //     m.assignToLastName = m.commonInsEmpResearchVm.assignToLastName,
          //     m.assignToMiddleName = m.commonInsEmpResearchVm.assignToMiddleName,
          //     m.assignToUserId = m.commonInsEmpResearchVm.assignToUserId,
          //     m.assignedDate = m.commonInsEmpResearchVm.assignedDate,
          //     m.ctsFlag = m.commonInsEmpResearchVm.ctsFlag,
          //     m.researchStatus = m.commonInsEmpResearchVm.researchStatus,
          //     m.researchResult = m.commonInsEmpResearchVm.researchResult,
          //     m.approvedBy = m.commonInsEmpResearchVm.approvedBy,
          //     m.approvedDate = m.approvedDate != null ? this.dateP.transform(m.approvedDate, 'dd/MM/yyyy') : null
          // })
          this.researchEmpInsValue = getResearchEmpInsDetData.body;
          if (this.researchEmpInsValue.length > 0) {
            this.gridColumnsAll = [
              { field: 'check', header: '' },
              { field: 'name', header: 'Employer Name' },
              { field: 'referenceNo', header: 'Reference No' },
              { field: 'address', header: 'Address' },
              { field: 'postalCode', header: 'Zip Code' },
              { field: 'createdDate', header: 'Created Date' },
              { field: 'researchStatus', header: 'Status' },
              { field: 'researchResult', header: 'Result Status' },
              { field: 'assignToFirstName', header: 'Assigned Owner' },
              { field: 'assignByFirstName', header: 'Assigned By' },
              { field: 'assignedDate', header: 'Assigned Date' },

            ];

            if (this.researchEmpInsValue[0].researchStatus.toLowerCase() === this.common.VERIFIED.toLowerCase()) {
              this.gridColumnsAll.push({ field: 'approvedBy', header: 'Approved By' }, { field: 'approvedDate', header: 'Approved Date' })
            }
            else if (this.researchEmpInsValue[0].researchStatus.toLowerCase() === "reverify") {
              this.gridColumnsAll.push(
                { field: 'verificationID', header: 'Verification ID' },
                { field: 'lastVerifiedStatus', header: 'Last Verified Status' },
                { field: 'casecomments', header: 'Case comments' },
                { field: 'conclusion', header: 'Conclusion' },
                { field: 'lastVerifiedDate', header: 'Last Verified Date' },
                { field: 'movetoFR', header: 'Move to FR' },
                { field: 'movetoVE', header: 'Move to VE' })

            }
            else {
              this.gridColumnsAll.push({ field: 'submittedByFirstName', header: 'Submitted By' })
            }
            this.gridColumnsAll.push({ field: 'remarks', header: 'Remarks' })

            this.iconremoveflag = this.researchEmpInsValue[0].researchStatus.toLowerCase() !== "reverify" ? true : false;
            this.gridFrozenCols = [
              { field: 'action', header: 'Action' },
            ];

            if (this.researchEmpInsValue[0].researchStatus.toLowerCase() === "reverify") {
              let removeHeader = ['Remarks', 'Zip Code', 'Created Date', 'Status', 'Result Status', 'Assigned Owner', 'Assigned By', 'Assigned Date'];
              this.gridColumnsAll = this.gridColumnsAll.filter(e => !removeHeader.includes(e.header));

            }
            if (this.currentPath === 'insResearch') {
              this.gridColumnsAll.filter(e => e.field === 'name')[0].header = 'Institution Name';
            }
          }

          this.totalpages = this.userData.needTotal
            ? getResearchEmpInsDetData.headers.get('X-Total-Count') ?? this.totalpages
            : this.totalpages;
          this.itemperpage = this.isShowAll ? this.researchEmpInsValue.length : 10;
          this.researchEmpInsValue.forEach(element => {
            element.countryName = (element.districtName ? (element.districtName + ' , ') : null) + (element.stateName ? (element.stateName + ' , ') : null) + element.countryName;
            element.countryName = element.countryName ? element.countryName : 'N/A';
            element.assignByFirstName = element.assignByFirstName ? (element.assignByFirstName + (element.assignByMiddleName
              ? (' ' + element.assignByMiddleName) : '') + (element.assignByLastName ? (' ' + element.assignByLastName) : '')) : null;
            element.updatedByFirstName = element.updatedByFirstName ? (element.updatedByFirstName + (element.updatedByMiddleName
              ? (' ' + element.updatedByMiddleName) : '') + (element.updatedByLastName ? (' ' + element.updatedByLastName) : '')) : null;
            element.assignToFirstName = element.assignToFirstName ? (element.assignToFirstName + (element.assignToMiddleName
              ? (' ' + element.assignToMiddleName) : '') + (element.assignToLastName ? (' ' + element.assignToLastName) : '')) : null;
            element.submittedByFirstName = element.submittedByFirstName ? (element.submittedByFirstName + (element.submittedByMiddleName
              ? (' ' + element.submittedByMiddleName) : '') + (element.submittedByLastName ? (' ' + element.submittedByLastName) : '')) : null;

          });

          if (flag === true) {
            this.businessCategoryId.reset();
          }
        }
      }
    });
  }
  resetExcel() {
    this.isReset = true;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.sorts = '';
    this.userData.filters = '';
    this.currentPage = 1;
    this.itemperpage = 10;
    this.isShowAll = false;
    this.isExport = false;
  }
  reset() {
    if (this.dt.first === 0) {
      this.dt.lazy = false;
    }
    this.employerVerifiedForm.reset();
    this.employerFilter.clientRefNo = null;
    this.employerFilter.submittedFromDate = null;
    this.employerFilter.submittedToDate = null;
    this.isReset = true;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.sorts = '';
    this.userData.filters = '';
    this.currentPage = 1;
    this.itemperpage = 10;
    this.isShowAll = false;
    this.isExport = false;
    this.dt.reset();
    if (this.global.nativeElement.value)
      this.global.nativeElement.value = '';
    this.resetDate();
    this.dt.lazy = true;
    this.getResearchStatus();

  }

  downloadDoc(data, type) {

    if (data.isFRDocument) {
      if (data.researchDocTransId > 0) {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.common.downloadDocument(data.docId, resp.document, resp.fileName);
        });
      } else if (data.researchDocTransId > 0) {
        if (this.currentPath === 'empResearch') {
          this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        }
        else if (this.currentPath === 'insResearch') {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        }
      } else {
        this.common.saveByteArray(data.fileName, data.document1);
      }
    }
    else {
      if (data.docId > 0 && data.researchDocTransId == 0) {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          this.common.downloadDocument(data.docId, resp.document, resp.fileName);
        });
      } else if (data.researchDocTransId > 0) {
        if (this.currentPath === 'empResearch') {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        }
        else if (this.currentPath === 'insResearch') {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.common.downloadDocument(data.docId, resp.document, resp.fileName);
          });
        }
      } else {
        this.common.saveByteArray(data.fileName, data.document1);
      }
    }
  }
  moveToDataentry() {
    this.dialogRef = this.dialog.open(this.moveToFileSub, {
      width: '700px',
      disableClose: true
    });
    this.EmpInsName = this.header.name;
  }
  getResearchQuestAnswer(emp, flag) {
    this.common.screeingCompidBy = emp.screeningCompId
    if (emp.researchResult == 'Suspicious') {
      this.forResearchVm = {
        companyName: emp.name,
        referenceNo: emp.referenceNo,
        loggedIn: this.userData.userId,
        empId: emp.empInsId
      };
      this.MailFlag = emp.researchResult;
    }
    if (flag === true) {
      if (this.empFlag) {
        this.dialogRef = this.dialog.open(this.businessType, {
          width: '700px',
          disableClose: true
        });
        this.masterService.GetBusinessCategoryLookUp().subscribe(res => {
          this.businessCategory = res;
        });
        this.loadFrFlowList();
      } else {
        this.getResearchQuestAnswerEdit(this.header.empInsId, this.header.empInsAddressId)
        this.openForResearch();
      }
    } else {
      if ((emp.businessCategoryLookupId && this.empFlag) || !this.empFlag) {
        this.arrangedFlag = null;
        this.btnApprove = true;
        this.isGridPage = false;
        if (this.empFlag) {
          this.businessCategoryId.setValue(emp.businessCategoryLookupId);
          this.masterService.GetBusinessCategoryLookUp().subscribe(res => {
            this.businessCategory = res;
          });
          this.loadFrFlowList();
        } else {
          this.businessCategoryId.setValue(0);
        }
        this.getResearchQuestAnswerEdit(this.header.empInsId, this.header.empInsAddressId);
        this.getResearchLookUp();
      }
    }
  }
  onDateChange() {
    const domainCreatedDate: any = this.dateP.transform(this.ResearchQuestAnsValue[3].domainCreatedDate, 'yyyy-MM-dd');
    let empFromDate: any;
    empFromDate = this.dateP.transform(this.ResearchQuestAnsValue[3].employeetrans.empFromDate, 'yyyy-MM-dd');
    if (empFromDate !== null && domainCreatedDate !== null && domainCreatedDate > empFromDate && this.userData
      .teamName !== 'CRTAbroad') {
      this.Message = "Domain Disconnect found basis Period of Employment, as the domain creation date  " + this.dateP.transform(domainCreatedDate, 'dd/MMM/yyyy') + " is greater than employment starting date " + this.dateP.transform(empFromDate, 'dd/MMM/yyyy');
      this.openEmpDialog();
      return false;
    }
  }
  openEmpDialog() {
    const dialogRef = this.dialog.open(this.empDomaindatepopup, {
      width: '350px',
      disableClose: true
    });
  }
  private isValidDate(dateString: string): boolean {

    return true;
  }
  addRemarks() {
    this.dialogRef = this.dialog.open(this.confirmation, {
      width: '700px',
      disableClose: true
    });
  }
  openPopup(flag: any) {
    if (flag === true || (flag === false && this.rejectedRemarks.value)) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: 'Confirmation',
        bodyText: 'Are you sure,Do you want to ' + (flag === true ? 'approve?' : 'reject?')
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
            if (action === this.common.DELETECONFIRMATION) {
              this.approveOrRejectFR(flag);
            }
          }
        });
      }
    } else {
      this.rejectedRemarks.markAsTouched();
    }
  }
  approveOrRejectFR(flag: any) {
    if (flag === false) {
      this.dialogRef.close();
    }
    const val = {
      loggedIn: this.userData.userId, approveFlag: flag, empFlag: this.currentPath === 'empResearch',
      empInsId: this.header.empInsId, empInsAddressId: this.header.empInsAddressId, rejectedRemarks: (flag === false ? this.rejectedRemarks.value : '')
    };

    //approval pending reject case workflow remove select option
    if (flag === false) {
      this.frFlowList.forEach(element => {
        element.isMoveFR = false;
        element.isMoveVE = false;
        element.notselected = false;
        element.issaved = false;
        element.isMoveVEAll = false;
        element.isMoveFRAll = false;
      });
    }
    if (this.empFlag && (this.activeParams === 'forresearch' || this.activeParams === 'underreview' || this.activeParams === 'approvalpending' || this.activeParams === 'clientsuspect') && this.frFlowList.filter(s => s.isMoveVE === false && s.isMoveFR === false).length > 0) {
      this.alertFlags = false;
      this.frFlowList.forEach(element => {
        if (flag !== false && !element.isMoveVE && !element.isMoveFR) {
          element.notselected = true;
          this.alertFlags = true;
        }
        else {
          element.notselected = false;
        }
      });
      //this.showTopCenter('warn', 'Failure Message', 'Any one of the workflows must be chosen.'); return;
    }

    if (this.alertFlags == true) {
      this.showTopCenter('warn', 'Failure Message', 'Any one of the workflows must be chosen.');
      this.alertFlags = false;
      return;
    }
    const formData = new FormData();

    formData.append('EmpInsApproveReject', JSON.stringify(val));
    formData.append('ScreaningCases', JSON.stringify(this.frFlowList));
    //this.masterService.ApproveRejectEmployerInstitutionMas(val).subscribe(res => {
    this.masterService.ApproveRejectEmployerInstitutionMas(formData).subscribe(res => {
      if (res) {
        if (this.MailFlag === this.common.suspicious && this.empFlag && flag) {
          this.screeningService.SendForResearchMail(this.forResearchVm).subscribe(resp => {
            if (resp) {
              this.showTopCenter('success', 'Success', 'Approved and Mail Send Successfully');
              this.MailFlag = '';
            }
            else {
              this.showTopCenter('success', 'Success', 'Approved and  Mail not Send');
              this.MailFlag = '';
            }
            this.isGridPage = true;
            this.btnApprove = false;
          })
        }
        else {
          this.showTopCenter('success', 'Success', ((flag === true ? 'Approved' : 'Rejected') + ' Successfully'));
          this.isGridPage = true;
          this.btnApprove = false;
        }
        this.getResearchStatus();
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed');
      }
    });
  }
  colseEdit() {
    this.dialogRef.close();
    this.businessCategoryId.reset();
  }
  getResearchQuestAnswerEdit(empInsId: number, empInsAddressId: number) {
    if ((this.businessCategoryId.value && this.empFlag) || !this.empFlag) {
      this.masterService.getResearchQuestAnswer(this.empFlag, this.common.screeingCompidBy, empInsId, this.businessCategoryId.value ? this.businessCategoryId.value : 0, empInsAddressId).subscribe(res => {
        if (res.length > 0) {
          this.ResearchQuestAnsValue = res;
          this.Smdocument = this.ResearchQuestAnsValue[0].document;
          this.frDocumemtnVm = this.ResearchQuestAnsValue[0].document.filter(f => f.isFRDocument === true);
          this.RejectedRemarks = this.ResearchQuestAnsValue[0].rejectedRemarks;
          this.selectedQAIndex = 0;
          this.getResearchLookUp();
          if (this.ResearchQuestAnsValue[0].lastAGMDate) {
            this.ResearchQuestAnsValue[0].lastAGMDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[0].lastAGMDate, false)
          }
          if (this.ResearchQuestAnsValue[0].incorporationDate) {
            this.ResearchQuestAnsValue[0].incorporationDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[0].incorporationDate, false)
          }
          if (this.ResearchQuestAnsValue[3].domainCreatedDate) {
            this.ResearchQuestAnsValue[3].domainCreatedDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[3].domainCreatedDate, false)
          }
          if (this.ResearchQuestAnsValue[4].domainCreatedDate) {
            this.ResearchQuestAnsValue[4].domainCreatedDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[4].domainCreatedDate, false)
          }
          if (this.ResearchQuestAnsValue[3].domainExpireDate) {
            this.ResearchQuestAnsValue[3].domainExpireDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[3].domainExpireDate, false)
          }
          if (this.ResearchQuestAnsValue[4].domainExpireDate) {
            this.ResearchQuestAnsValue[4].domainExpireDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[4].domainExpireDate, false)
          }
          if (this.ResearchQuestAnsValue[0].annualMeetingDate) {
            this.ResearchQuestAnsValue[0].annualMeetingDate = this.common.getTimezoneOffset(this.ResearchQuestAnsValue[0].annualMeetingDate, false)
          }
          this.progresscalc();
          const isSelected = this.ResearchQuestAnsValue.filter(e => e.selectedOption === 0).length === this.ResearchQuestAnsValue.length;
          if (!this.btnApprove && this.header.researchStatus !== this.common.Rejected) {
            this.ResearchQuestAnsValue.forEach(element => {
              element.categoryFlag = undefined;
              if (element.researchDocument === null) {
                element.researchDocument = new ResearchDocument();
              }
            });
            this.getCategoryValue();
          }
          if (!this.btnApprove && this.header.researchStatus === this.common.Rejected) {
            this.ResearchQuestAnsValue.forEach(element => {
              if (element.selectedOption > 0 && this.empFlag === true) {
                element.categoryFlag = this.setcategory(element);
                if (element.researchDocument === null) {
                  element.researchDocument = new ResearchDocument();
                }
                this.getCategoryValue();
              }
            });
          }
        }
      });
    }
  }
  updateCategoryFlag(data: any) {
    if (data.selectedOption > 0 && this.empFlag === true && !this.btnApprove) {
      data.categoryFlag = this.setcategory(data);
      this.getCategoryValue();
    }
  }
  setcategory(data: any) {
    // set category formula start
    let flag;
    if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() === 'available') {
      if (data.questionName.includes('MCA') || data.questionName.includes('EPFO') || data.questionName.includes('Bloomberg') ||
        data.questionName.includes('STPI') || data.questionName.includes('NASSCOM') || data.questionName.includes('news articles')) {
        flag = true;
      } else if (data.questionName.includes('MSME') || data.questionName.includes('Existence')) {
        flag = false;
      } else if (data.questionName.includes('suspicious') || data.questionName.includes('address web-searches')) {
        flag = null;
      } else {
        flag = undefined;
      }
    } else if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() === 'Closed but earlier existence proved'.toLowerCase()) {
      if (data.questionName.includes('Existence')) {
        flag = false;
      } else {
        flag = undefined;
      }
    } else if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() === 'Available but located in business centre'.toLowerCase()) {
      if (data.questionName.includes('Existence')) {
        flag = null;
      } else {
        flag = undefined;
      }
    } else if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() === 'Yes'.toLowerCase()) {
      if (data.questionName.includes('suspicious') || data.questionName.includes('directoris associated with')) {
        flag = null;
      } else {
        flag = undefined;
      }
    } else if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() === 'Not Applicable'.toLowerCase()) {
      if (data.questionName.includes('bank')) {
        flag = null;
      } else {
        flag = undefined;
      }
    } else if (data.options.find(f => f.optionId === data.selectedOption).optionName.toLowerCase() !== 'Not Applicable'.toLowerCase()) {
      if (data.questionName.includes('pretext call')) {
        flag = null;
      } else {
        flag = undefined;
      }
    } else {
      flag = undefined;
    }
    // set category formula end
    return flag;
  }
  getCategoryValue() {
    if (this.ResearchQuestAnsValue.length > 0 && this.empFlag === true && !this.btnApprove) {
      const a = this.ResearchQuestAnsValue.filter(x => x.categoryFlag === true).length;
      const b = this.ResearchQuestAnsValue.filter(x => x.categoryFlag === false).length;
      const c = this.ResearchQuestAnsValue.filter(x => x.categoryFlag === null).length;
      const d = [a, b, c].findIndex(s => s === Math.max(...[a, b, c]))
      let name;
      if (a > b && a > c) {
        name = this.common.categoryA;
      } else if (b > c && b > a) {
        name = this.common.categoryB;
      } else if (c > a && c > b) {
        name = this.common.categoryC;
      } else if (d > -1) {
        name = d === 0 ? this.common.categoryA : d === 1 ? this.common.categoryB : this.common.categoryC;
      } else {
        name = this.common.categoryA;
      }
      const isSelected = this.ResearchQuestAnsValue.filter(e => e.selectedOption === 0).length === this.ResearchQuestAnsValue.length;
      const id = !isSelected && this.researchStatusLookUpValue && name ?
        this.researchStatusLookUpValue.researchCategoryType.find(y => y.lookUpName === name).lookUpId : 0;
      this.ResearchQuestAnsValue[0].categoryLookupId = id;
    }
  }
  openForResearch() {
    if ((this.businessCategoryId.value && this.empFlag) || !this.empFlag) {
      this.arrangedFlag = null;
      this.getResearchLookUp();
      this.isGridPage = false;
      if (this.empFlag) {
        this.dialogRef.close();
        this.loadFrFlowList();
      }
    } else {
      this.businessCategoryId.setValidators(Validators.required);
      this.businessCategoryId.updateValueAndValidity();
      this.businessCategoryId.markAllAsTouched();
    }
  }
  arrangeSiteVisit() {
    this.arrangedFlag = false;
  }
  getResearchLookUp() {
    this.masterService.getResearchLookUp().subscribe(researchStatusLookUpValue => {
      if (researchStatusLookUpValue) {
        this.researchStatusLookUpValue = researchStatusLookUpValue;
        const researchResult =
          this.ResearchQuestAnsValue &&
            this.ResearchQuestAnsValue.length > 0
            ? this.ResearchQuestAnsValue[0]?.researchResult
            : null;
        if (researchResult != null) {
          if (
            researchResult.toLowerCase() === 'unable to conclude' &&
            this.empFlag !== true
          ) {
            this.ConcludeFlag = true;
            this.researchunableStatusLookUpValue =
              this.researchStatusLookUpValue.researchResult.filter(
                s =>
                  s.lookUpName.toLowerCase() !== 'genuine' &&
                  s.lookUpName.toLowerCase() !== 'suspicious'
              );

          } else {

            this.ConcludeFlag = false;

            this.researchunableStatusLookUpValue =
              this.researchStatusLookUpValue.researchResult.filter(
                s => s.lookUpName.toLowerCase() !== 'unable to conclude'
              );
          }
        } else {
          this.ConcludeFlag = false;
          this.researchunableStatusLookUpValue =
            this.researchStatusLookUpValue.researchResult.filter(
              s => s.lookUpName.toLowerCase() !== 'unable to conclude'
            );
        }
      }
    });

    if (this.empFlag === true) {

      this.masterService
        .GetEmployerScreeningCompId(
          this.header.empInsId,
          this.userData.teamName,
          this.header.clientId
        )
        .subscribe(resp => {

          if (resp) {
            this.verificationIdList = resp;
          }

        });
    }
  }

  resultChange(value: any) {
    if (this.getValue(value) === false) {
      this.ResearchQuestAnsValue[0].underReviewLookupId = 0;
    }
  }
  getValue(value: any) {
    let val = false;
    if (value && value > 0 && this.researchStatusLookUpValue) {
      val = this.researchStatusLookUpValue.underReview[0]?.lookupCatName.toLowerCase().
        includes(this.common.getNameById(this.researchStatusLookUpValue.researchResult,
          'lookUpId', 'lookUpName', value).toLowerCase());
    }
    //FR Under review  FR Approval pending FR Approval pending reject Case goes to Under review again 
    if (this.ResearchQuestAnsValue[0]?.researchStatusId === this.common.FrApprovedReject && (this.ResearchQuestAnsValue[0]?.researchResultId === this.common.Suspicious || this.ResearchQuestAnsValue[0]?.researchResultId === this.common.Genuine)) {
      this.ResearchQuestAnsValue[0].underReviewLookupId = 0;
    }
    return val;
  }
  openSiteVisit() {
    this.dialogRef = this.dialog.open(this.siteVisit, {
      width: '700px',
      disableClose: true
    });
  }
  addFile(event, index) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < event.target.files.length; i++) {
      const researchDocument: ResearchDocumentTrans = {
        researchDocumentId: 0,
        researchDocTransId: 0,
        docId: 0,
        fileName: event.target.files[i].name,
        document: null,
        active: true,
        document1: event.target.files[i],
        DelFlag: false,
        isFRDocument: false,

      };
      if (this.ResearchQuestAnsValue[index].researchDocument === null) {
        this.ResearchQuestAnsValue[index].researchDocument = new ResearchDocument();
        this.ResearchQuestAnsValue[index].researchDocument.researchDocumentTrans.push(researchDocument);
      } else if (this.ResearchQuestAnsValue[index].researchDocument.researchDocumentTrans.some(x => x.fileName === researchDocument.fileName)) {
        this.showTopCenter('warn', 'Failure Message', 'File already exists'); return;
      } else {
        this.ResearchQuestAnsValue[index].researchDocument.researchDocumentTrans.push(researchDocument);
      }
    }
  }
  ngOnDestroy() {
    this.common.commonFrFlag = undefined;
  }
  onFileSelected(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      const frDocumemtnVm: ResearchDocumentTrans = {
        researchDocumentId: 0,
        researchDocTransId: 0,
        docId: 0,
        fileName: event.target.files[i].name,
        document: null,
        active: true,
        document1: event.target.files[i],
        DelFlag: false,
        isFRDocument: true,
      }
      this.size = this.size + event.target.files[0].size;

      const fileSize = this.fileSizeValidation(this.size);
      if (!fileSize) {
        this.size = 0;
        this.showTopCenter('warn', 'Failure Message', 'the overall file size should be less than 5 MB');
        return;
      }
      const ext = frDocumemtnVm.fileName.split('.').pop();
      if (this.frDocList.frDocument.some(x => x.fileName === frDocumemtnVm.fileName)) {
        this.size = 0;
        this.showTopCenter('warn', 'Failure Message', 'File already exists'); return;
      }
      else if (ext === 'pdf' || ext === 'docx' || ext === 'doc') {
        this.size = 0;
        this.frDocList.frDocument.push(frDocumemtnVm);
      }
      else {
        this.size = 0;
        this.showTopCenter('warn', 'Failure Message', 'Please upload a valid file as word or PDF formats'); return;
      }
      this.frDocumemtnVm.push(frDocumemtnVm);
    }

  }
  getHintFlag(col: any) {
    return col.selectedOption ? col.options.find(x => x.optionId === col.selectedOption)?.optionName?.toLowerCase() === 'available' : false;
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
  remarks(qid, opname, flag, index) {
    let remark: any[] = [];
    let remark1: any[] = [];
    if (flag != true && qid == 24 && opname.toLowerCase() == 'yes' && index == 20) {
      this.ConcludeFlag = true;
      this.researchunableStatusLookUpValue = this.researchStatusLookUpValue.researchResult.filter(s => s.lookUpName.toLowerCase() != 'genuine' && s.lookUpName.toLowerCase() != 'suspicious')
    }
    else {
      this.ConcludeFlag = false;
      this.researchunableStatusLookUpValue = this.researchStatusLookUpValue.researchResult.filter(s => s.lookUpName.toLowerCase() != 'unable to conclude')
    }
    if (flag === true) {
      this.masterService.GetResearchEmpIns(0).subscribe(res => {
        this.questions = res;
        this.questions.forEach(function (ques) {
          if (ques.questionId == qid) {
            remark.push(ques);
          }
        })
        this.questions = remark;
        this.questions.forEach(function (ques) {
          if (ques.questionId == qid) {
            remark1.push(ques.description);
          }
        })
        this.quesremarks = remark1 + ' is ' + opname;
        this.ResearchQuestAnsValue[index].remarks = this.quesremarks;
      });
    } else {
      this.masterService.GetInstitutionResearchQuestion(0).subscribe(res => {
        this.questions1 = res;
        this.questions1.forEach(function (ques) {
          if (ques.questionId == qid) {
            remark.push(ques);
          }
        })
        remark.forEach(function (ques) {
          if (ques.questionId == qid) {
            remark1.push(ques.description);
          }
        })
        this.quesremarks = remark1 + ' is ' + opname;
        this.ResearchQuestAnsValue[index].remarks = this.quesremarks;
      });
    }
    this.getResearchStatus(false);
  }
  addUpdateResearch() {
    const list = (this.ResearchQuestAnsValue.filter(e => e.selectedOption > 0 && (e.options.find(f => f.optionId ===
      e.selectedOption).optionName.toLowerCase() === 'available') && !(e.researchDocument && e.researchDocument.
        researchDocumentTrans && e.researchDocument.researchDocumentTrans.length > 0)));
    const list1 = (this.ResearchQuestAnsValue.filter(e => e.selectedOption > 0 && (e.options.find(f => f.optionId ===
      e.selectedOption).optionName.toLowerCase() === 'live') && !(e.researchDocument && e.researchDocument.
        researchDocumentTrans && e.researchDocument.researchDocumentTrans.length > 0)));
    const list2 = (this.ResearchQuestAnsValue.filter(e => e.selectedOption > 0 && (e.options.find(f => f.optionId ===
      e.selectedOption).optionName.toLowerCase() === 'valid') && !(e.researchDocument && e.researchDocument.
        researchDocumentTrans && e.researchDocument.researchDocumentTrans.length > 0)));
    if (this.ResearchQuestAnsValue.filter(e => e.selectedOption === 0).length === this.ResearchQuestAnsValue.length) {
      this.showTopCenter('warn', 'Failure Message', 'Please answer at least one parameter'); return;
    }
    if (list.length > 0) {
      let str = '';
      list.forEach((e, i) => {
        const ind = this.ResearchQuestAnsValue.findIndex(x => x.questionId === e.questionId);
        str = str + (ind + 1) + ((list.length === (i + 1)) ? '' : ',');
      });
      this.showTopCenter('warn', 'Failure Message', ('Please upload document for all the available parameters( no ' + str + ' )')); return;
    }
    if (list1.length > 0) {
      let str = '';
      list1.forEach((e, i) => {
        const ind = this.ResearchQuestAnsValue.findIndex(x => x.questionId === e.questionId);
        str = str + (ind + 1) + ((list1.length === (i + 1)) ? '' : ',');
      });
      this.showTopCenter('warn', 'Failure Message', ('Please upload document for all the live parameters( no ' + str + ' )')); return;
    }
    if (list2.length > 0) {
      let str = '';
      list2.forEach((e, i) => {
        const ind = this.ResearchQuestAnsValue.findIndex(x => x.questionId === e.questionId);
        str = str + (ind + 1) + ((list2.length === (i + 1)) ? '' : ',');
      });
      this.showTopCenter('warn', 'Failure Message', ('Please upload document for all the valid parameters( no ' + str + ' )')); return;
    }
    if (!this.ResearchQuestAnsValue[0].researchResultId) {
      this.showTopCenter('warn', 'Failure Message', 'Please select result type'); return;
    }
    if (this.ConcludeFlag == false && this.ResearchQuestAnsValue[0].researchResultId != 0 && !this.empFlag) {
      const UpName = this.researchunableStatusLookUpValue.find(s => s.lookUpId == this.ResearchQuestAnsValue[0].researchResultId);
      if (UpName == undefined) {
        this.showTopCenter('warn', 'Failure Message', 'Please select result type'); return;
      }
    }
    if (this.ConcludeFlag == true && this.ResearchQuestAnsValue[0].researchResultId != 0 && !this.empFlag) {
      const UpName = this.researchunableStatusLookUpValue.find(s => s.lookUpId == this.ResearchQuestAnsValue[0].researchResultId);
      if (UpName == undefined) {
        this.showTopCenter('warn', 'Failure Message', 'Please select result type'); return;
      }
    }
    if (this.ResearchQuestAnsValue[0].researchResultId != 0 && this.empFlag) {
      const UpName = this.researchunableStatusLookUpValue.find(s => s.lookUpId == this.ResearchQuestAnsValue[0].researchResultId);
      if (UpName.lookUpDesc == 'Under Review' && this.ResearchQuestAnsValue[0].underReviewLookupId === 0) {
        this.showTopCenter('warn', 'Failure Message', 'Please select Under Review result type'); return;
      }
    }

    // if (this.empFlag && this.frFlowList.filter(s => s.isMoveVE === true).length == 0 && this.frFlowList.filter(s => s.isMoveFR === true).length == 0) {
    //   this.showTopCenter('warn', 'Failure Message', 'Any one of the workflows must be chosen.'); return;
    // }
    // if (this.empFlag && (this.activeParams === 'forresearch' || this.activeParams === 'underreview' || this.activeParams === 'approvalpending' || this.activeParams === 'clientsuspect') && this.frFlowList.filter(s => s.isMoveVE === false && s.isMoveFR === false).length > 0) {
    //   this.frFlowList.forEach(element => {
    //     if (!element.isMoveVE && !element.isMoveFR)
    //       element.notselected = true;
    //     else element.notselected = false;

    //   });
    //   this.showTopCenter('warn', 'Failure Message', 'Any one of the workflows must be chosen.'); return;
    // }
    if (this.empFlag && (this.activeParams === 'forresearch' || this.activeParams === 'underreview' || this.activeParams === 'approvalpending' || this.activeParams === 'clientsuspect') && this.frFlowList.filter(s => s.isMoveVE === false && s.isMoveFR === false).length > 0) {
      this.alertFlag = false;
      this.frFlowList.forEach(element => {
        if (element.disableMovetoFrVeFlag) {
          if (!element.isMoveVE && !element.isMoveFR) {
            element.notselected = true;
            this.alertFlag = true;
          }
          else {
            element.notselected = false;
          }
        }
        else {
          element.notselected = false;
        }
      });
    }

    if (this.alertFlag == true) {
      this.showTopCenter('warn', 'Failure Message', 'Any one of the workflows must be chosen.');
      this.alertFlag = false;
      return;
    }

    this.ResearchQuestAnsValue.map(e => {
      e.researchResultId = this.ResearchQuestAnsValue[0].researchResultId;
      e.empInsId = this.header.empInsId;
      e.loggedId = this.userData.userId;
      e.empInsAddressId = this.header.empInsAddressId;
    });
    const formData = new FormData();
    this.frDocumemtnVm.forEach(e => {
      if (e.docId == 0)
        formData.append('FRDocList', e.document1)
    });
    this.ResearchQuestAnsValue.forEach(e => {
      e.businessCategoryLookupId = this.businessCategoryId.value ? this.businessCategoryId.value : 0;
      if (e.researchDocument) {
        e.researchDocument.researchDocumentTrans.forEach((r, index) => {
          formData.append('ResearchDoc_' + e.questionId + '_' + index, r.document1);
        });
        e.researchDocument.questionId = e.questionId;
        e.researchDocument.researchDocumentId = 0;
        e.researchDocument.empInsVerificationId = e.empInsVerificationId;
      }

      else { e.researchDocument = null; }
    });
    // this.ResearchQuestAnsValue.forEach(e=>
    //   {
    //     e.businessCategoryLookupId= this.bid
    //   })
    formData.append('EmpInsResearch', JSON.stringify(this.ResearchQuestAnsValue));
    formData.append('FRDocList', JSON.stringify(this.frDocumemtnVm));
    formData.append('ScreaningCases', JSON.stringify(this.frFlowList));
    formData.append('EmpFlag', JSON.stringify(this.currentPath === 'empResearch'));
    this.masterService.AddUpdateResearch(formData).subscribe((res) => {
      if (res.success) {
        this.showTopCenter('success', 'Successfully saved', 'Successfully saved');
        this.isGridPage = true;
        this.getResearchStatus();
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Failed');
      }
    });
  }
  getTotalPages(totalRecords, rows) {
    // this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage(pageNo, rowscount) {
    let pageCount = Math.ceil(this.totalpages / rowscount);
    if (+pageNo > pageCount || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.tempCurrentPage = this.currentPage;
      this.currentPage = pageNo;
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetDate() {
    this.fromDate = '';
    this.toDate = '';
    this.researchEmpInsValue = this.dupList;
  }
  showall() {
    this.isShowAll = true;
    // this.userData.applyPaging = false;
    // this.userData.needTotal = false;
    this.getResearchStatus();
  }
  getRecordBydate(fDate, tDate) {
    this.researchEmpInsValue = this.dupList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.researchEmpInsValue.map(d => d.createdDate = this.dateP.transform(d.createdDate, 'yyyy-MM-dd'));
    this.researchEmpInsValue = this.dupList.filter(x => x.createdDate >= FromDate && x.createdDate <= ToDate);
  }
  resetDateAssigned() {
    this.assignedFromDate = '';
    this.assignedToDate = '';
    this.researchEmpInsValue = this.assignedDupList;
  }
  getRecordBydateAssigned(fDate, tDate) {
    this.researchEmpInsValue = this.assignedDupList;
    const FromDate = this.dateP.transform(fDate, 'yyyy-MM-dd');
    const ToDate = this.dateP.transform(tDate, 'yyyy-MM-dd');
    this.researchEmpInsValue.map(d => d.assignedDate = this.dateP.transform(d.assignedDate, 'yyyy-MM-dd'));
    this.researchEmpInsValue = this.assignedDupList.filter(x => x.assignedDate >= FromDate && x.assignedDate <= ToDate);
  }
  progresscalc() {
    let ques: any[] = [];
    var rem = 0;
    rem = this.ResearchQuestAnsValue.length;
    this.ResearchQuestAnsValue.forEach(function (cn) {
      if (cn.remarks !== null) {
        ques.push(cn)
      }
    });
    this.countq = (ques.length / rem) * 100;
    this.provalue = Math.ceil(this.countq);
    this.colorvalue = "red";
    this.progresscalcav();
  }
  progresscalcav() {
    let ques: any[] = [];
    let quesAv: any[] = [];
    var rem = 0;
    rem = this.ResearchQuestAnsValue.length;
    this.ResearchQuestAnsValue.forEach(function (cn) {
      ques.push(cn)
    });
    quesAv = ques.filter(e => e.selectedOption > 0 && (e.researchDocument && e.researchDocument.
      researchDocumentTrans && e.researchDocument.researchDocumentTrans.length > 0));
    this.counta = (quesAv.length / rem) * 100;
    this.proAnsvalue = Math.ceil(this.counta)
  }
  redirectToVE(screeningCompId: any) {
    this.dialogRef.close();
    screeningCompId = Number(screeningCompId.split('ACG')[1]);
    this.verification.changeMessage(screeningCompId);
    this.common.funcEntity = '';
    this.common.commonVeFlag = this.common.commonFrFlag;
    this.router.navigate(['/dashboard/verification/verificationDetail']);
  }
  exportAsExcelFile() {
    this.isExport = true;

    this.getResearchStatus();

  }
  viewVerifiedList(data: any) {
    this.dialogRef = this.dialog.open(this.verifiedList, {
      width: '1000px',
      height: 'auto',
      disableClose: true
    });
    this.getBusinesscat(data.businessCategoryLookupId);
    this.getVerifiedData(data);
    this.loadFrFlowList();
  }
  getBusinesscat(id: any) {
    this.masterService.GetBusinessCategoryLookUp().subscribe(res => {
      this.businessCategory = res.filter(x => x.lookUpId === id);
      if (this.businessCategory.length > 0) {
        this.BusinesscatName = this.businessCategory[0].lookUpName;
      }
    });
  }
  getVerifiedData(data: any) {
    this.businessCategoryId.setValue(data.businessCategoryLookupId);
    this.masterService.getResearchQuestAnswer(this.empFlag, data.screeningCompId, this.header.empInsId, this.businessCategoryId.value, this.header.empInsAddressId).subscribe(res => {
      if (res) {
        this.ResearchQuestAnsValue = res;
        this.Smdocument = this.ResearchQuestAnsValue[0].document;
        this.RejectedRemarks = this.ResearchQuestAnsValue[0].rejectedRemarks;
        this.progresscalc();
        this.getResearchLookUp();
      }
    });

  }
  getOpame(data, option) {
    this.SelectedOptionname = data.filter(x => x.optionId === option);
    return this.SelectedOptionname;
  }
  getStatus(data, option) {
    if (option > 0) {
      this.SelectedStatusOption = data.filter(x => x.lookUpId === option);
    }
    return this.SelectedStatusOption;
  }
  // preview
  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  saveByteArray(filename, byte) {
    const blob = new Blob([byte], { type: 'application/octet-stream' });
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // for IE
      (window.navigator as any).msSaveOrOpenBlob(blob, filename);
    } else { // for Non-IE (chrome, firefox etc.)
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none;');
      const csvUrl = URL.createObjectURL(blob);
      a.href = csvUrl;
      a.download = filename;
      a.click();
      a.remove();
    }
  }
  preview(data, type) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.researchDocTransId == 0 && (type != 'Screening' || type != 'FrScreening')) {
        const blob = new Blob([data.document1], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (type == 'Screening') {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        })
      } else if (type == 'FrScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        })
      }
      else if (data.researchDocTransId > 0 && (type != 'Screening' || type != 'FrScreening')) {

        if (this.currentPath === 'empResearch') {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          });
        }
        else if (this.currentPath === 'insResearch') {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
          });
        }

      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.researchDocTransId == 0 && type != 'Screening') {
        const blob = new Blob([data.document1], { type: 'application/octet-stream' });
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
      else if (type == 'Screening') {
        this.screeningService.downloadScreeningDocument(data.docId).subscribe(resp => {
          const blob = base64StringToBlob(resp.document, 'application/octet-stream');
          const csvUrl = window.URL.createObjectURL(blob);
          this.url = csvUrl;
        })
      }
      else if (type == 'FrScreening') {
        this.screeningService.downloadFrConDocument(data.researchDocTransId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        })
      }
      else if (data.researchDocTransId > 0 && type != 'Screening' && type != 'FrScreening') {
        if (this.currentPath === 'empResearch') {
          this.screeningService.downloadEmpResearchDocument(data.researchDocTransId).subscribe(resp => {
            const blob = base64StringToBlob(resp.document, 'application/octet-stream');
            const csvUrl = window.URL.createObjectURL(blob);
            this.url = csvUrl;
          });
        }
        else if (this.currentPath === 'insResearch') {
          this.screeningService.downloadInstResearchDocument(data.researchDocTransId).subscribe(resp => {
            const blob = base64StringToBlob(resp.document, 'application/octet-stream');
            const csvUrl = window.URL.createObjectURL(blob);
            this.url = csvUrl;
          });
        }
      }
      this.dialog.open(this.pdfDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else {
      this.downloadDoc(this.downldata, type);
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
        this.downloadDoc(this.downldata, type);
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

  deleteConsolidateDocument(docId: any) {
    if (docId > 0) {
      this.screeningService.deleteResearchConsolidateDocument(docId, this.userData.userId).subscribe(resp => {
        if (resp) {

        }
      });
    }
  }
  deleteempinsDocument(docId: any) {
    if (docId > 0) {
      this.screeningService.deleteResearchDocumentById(docId, this.empFlag, this.userData.userId).subscribe(resp => {
        if (resp) {

        }
      });
    }
  }
  isCam() {
    return (((this.userData.teamName === 'CRTIndia' || this.userData.teamName === 'CRTTechMahindra' || this.userData
      .teamName === 'CRTAbroad') && (this.userData.subTeamName === 'CRTCAMTeam' || this.userData.subTeamName === null)) || this.userData.teamName === 'CTS-CRTTeam');
  }
  back() {
    if (this.isGridPage == true) {
      this.router.navigate(['dashboard/home']);
    } else {
      this.isGridPage = true;
      this.btnApprove = false;
      this.header = null;
      this.businessCategoryId.reset();
      this.getResearchStatus()
    }
  }
  //MVF
  moveDE(data: any) {
    this.ForResearchRejectVm.screeningCompId = this.header.screeningCompId;
    this.ForResearchRejectVm.loggedIn = this.userData.userId;
    this.ForResearchRejectVm.comment = this.rejectComments.value;
    this.ForResearchRejectVm.screeningId = this.header.screeningId;
    if (this.rejectComments.value) {
      this.verification.FRReject(this.ForResearchRejectVm).subscribe(res => {
        if (res.success === true) {
          this.showTopCenter('success', 'Success Message', 'Moved to DE Successfully');
          // this.router.navigate(['/dashboard/verification/verification']);
          this.verification.caseDetailFlag = false;
          this.dialog.closeAll();
          this.getResearchStatus();
        }
      });
    } else {
      this.rejectComments.markAsTouched();
    }
  }
  dialogClose() {
    this.dialog.closeAll();
  }
}
class frsendDocList {
  frDocument: FrDocument[] = [];
}
export class FrDocument {
  researchDocumentId: number;
  researchDocTransId: number;
  docId: number;
  fileName: string;
  document: string;
  active: boolean;
  DelFlag: boolean;
  document1;
  isFRDocument: boolean;
}
class LookUpValue {
  contactId: number;
  lookUpCatId: number;
  lookUpId?: number;
  lookUpName: string;
  active?: boolean;
  lookUpValue: string;
  LookUpDesc?: string;
  lookupCatName?: string;
  searchData?: ResearchEmpIns[] = [];
}
class ResearchEmpIns {
  referenceNo: string;
  empInsId: number;
  empInsAddressId: number;
  screeningCompId: number;
  screeningId: number;
  name: string;
  cityName: string;
  districtName: string;
  stateName: string;
  countryName: string;
  createdDate?: any;
  assignedDate?: any;
  reviewedPerson: string;
  reviewDate?: Date;
  researchStatusId: number;
  researchResultId: number;
  researchStatus: string;
  researchResult: string;
  businessCategoryLookupId: number;
  underReviewLookupId: number;
  assignByFirstName: string;
  updatedByFirstName: string;
  updatedByMiddleName: string;
  updatedByLastName: string;
  assignByMiddleName: string;
  assignByLastName: string;
  assignToFirstName: string;
  assignToMiddleName: string;
  assignToLastName: string;
  submittedByFirstName: string;
  submittedByMiddleName: string;
  submittedByLastName: string;
  categoryLookupId: number;
  clientId: number;
  clientCategoryId: number;
  movetoFR;
  movetoVE;
}
class VerifiedEmployer {
  clientRefNo: string;
  employerVerifiedName: string;
  submittedFromDate: any;
  submittedToDate: any;
}
class ResearchQuestAns {
  empInsVerificationId: number;
  empInsVerifyId: number;
  empInsId: number;
  empInsAddressId: number;
  questionId: number;
  questionName: string;
  displayOrder: number;
  verifyStep: number;
  loggedId: number;
  researchResultId: number;
  researchResult: string;
  selectedOption: number;
  options: ResearchOptionVm[];
  businessCategoryId: number;
  researchDocument: ResearchDocument;
  document: ResearchDocumentTrans[];
  frConDocument: ResearchDocumentTrans[];
  remarks: string;
  rejectedRemarks: string;
  mcaCompanyStatus: number;
  paidUpCaptial: string;
  lastAGMDate: Date;
  paymentDetails: string;
  incorporationDate: Date;
  noOfEmployee: number;
  paymentDetailsId: number;
  employeeRecordId: number;
  domainCreatedDate: Date;
  domainExpireDate: Date;
  annualMeetingDate: Date;
  universityTypeLookUpId: number;
  disciplinaryRemarks: string;
  businessCategoryLookupId: number;
  underReviewLookupId: number;
  researchStatusId: number
  researchConclusion: string;
  caseComments: string;
  cancelReason: string;
  categoryLookupId: number;
  categoryFlag: any;
  employeetrans: any;
}
class ResearchOptionVm {
  optionId: number;
  optionName: string;
  progressBarValue: number;
  detAvailable: boolean;
  subDetail: LookUpValueRQA[];
}
class LookUpValueRQA {
  contactId: number;
  lookUpCatId: number;
  lookupCatName: string;
  lookUpId?: number;
  lookUpName: string;
  active: boolean;
  lookUpValue: string;
  lookUpDesc: string;
  displayOrder: number;
  disabled: boolean;
}
class ResearchDocument {
  researchDocumentId: number;
  empInsVerificationId: number;
  questionId: number;
  researchDocumentTrans: ResearchDocumentTrans[] = [];
}
class ResearchDocumentTrans {
  researchDocumentId: number;
  researchDocTransId: number;
  docId: number;
  fileName: string;
  document: string;
  active: boolean;
  DelFlag: boolean;
  isFRDocument: boolean;
  document1;
}
class ForResearchMailVM {
  companyName: string;
  referenceNo: string;
  loggedIn: number;
  empId: number;
}
class ForResearchRejectVm {
  empFlag: boolean;
  loggedIn: number;
  comment: string;
  screeningId: number;
  screeningCompId: number;
}
