import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ScreeningService } from '../../services/screening.service';
import { AutoCompleteDropDown } from '../../models/autoComplete';

import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { CommonService } from '../../services/common.service';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { base64StringToBlob } from 'blob-util';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { userInfo } from 'os';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-insufficiency',
  templateUrl: './insufficiency.component.html',
  styleUrls: ['./insufficiency.component.css'],
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
export class InsufficiencyComponent implements OnInit {
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
  @ViewChild('pdfDialog', { static: true }) pdfDialog!: TemplateRef<any>;
  @ViewChild('imgprDialog', { static: true }) imgprDialog!: TemplateRef<any>;
  pageno: number;
  SearchCriFilter = false;
  insufficiencyFormGroup: UntypedFormGroup;
  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnBulk = true;
  docFlag: boolean = false;
  toolTip = '';
  statusList: any[] = [];
  levelMultiList: any[] = [];
  statusMultiList: any[] = [];
  statusControls!: AutoCompleteDropDown;
  levelControls!: AutoCompleteDropDown;
  insufficiencyStatusControls!: AutoCompleteDropDown;
  insufficiencyLevelControls!: AutoCompleteDropDown;
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('bulkDocument', { static: true }) bulkDocument!: TemplateRef<any>;
  // @ViewChild('tab', { static: true }) tab!: MatTabGroup;
  @ViewChild('tab') tab!: MatTabGroup;
  @ViewChild('global', { static: true }) global!: ElementRef;
  docTableCol = [
    { field: 'action', header: 'Action' },
    { field: 'docTypeName', header: 'Document Type' },
    { field: 'fileName', header: 'Document Name' }];
  docDetailTableColumnList = [
    { field: 'insuffLevel', header: 'Insuff Level' },
    { field: 'insuffReqType', header: 'Required Type' },
    { field: 'insuffStatus', header: 'Status' },
    { field: 'raisedDate', header: 'Raised Date & Time' },
    { field: 'comments', header: 'Comments' }
  ];
  clearDocList = [
    { field: 'description', header: 'Document Name' },
    { field: 'docName', header: 'File Name' },
    { field: 'docReceivedDate', header: 'Cleared Date & Time' }
  ];
  invitationcols = [
    { field: 'candidateName', header: 'Candidate Name ' },
    { field: 'clientName', header: 'Client Name ' },
    { field: 'clientRefNo', header: 'Client RefNo ' },
    { field: 'componentName', header: 'Component Name' },
    { field: 'screeningCompId', header: 'Verification Id' },
    { field: 'remarks', header: 'Clearance Remarks' },
    { field: 'action', header: 'Upload Documents / View' },
    { field: 'queue', header: 'Verifier Queue' },
    { field: 'status', header: 'Insufficiency Status' },
    { field: 'clientScreeningId', header: 'Screening ID' },
  ];
  selDocName: number;
  bulkDocName: number;
  insuffScreenMode = true;
  // loading: boolean;
  insuffSearchList: SearchStatus[] = [];
  userData = JSON.parse(sessionStorage.getItem('user_data') as string);
  selectedComponentDetails: any; selectedInsufficiencyDetails: any;
  insufficiencyDocShow = false;
  clearInsuffContent = new ClearInsuff();
  documentList: any[] = [];
  searchValueArr: any[] = [];
  isDesc: boolean;
  column: any;
  direction: number;
  tabIndex = 0;
  count = 0;
  itemPerPage;
  page = [1, 1, 1, 1, 1, 1];
  pageSize = 5;
  totalSize = 0;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  clientNameControl!: AutoCompleteDropDown;
  refNoControl!: AutoCompleteDropDown;
  verificationIdControl!: AutoCompleteDropDown;
  screeningControl!: AutoCompleteDropDown;
  candidateNameControl!: AutoCompleteDropDown;
  refNoList: any[] = [];
  verificationList: any[] = [];
  candidateNameList: any[] = [];
  clearedDate = new Date(); insRemarks: any; statusLookupId: any; verifierQueue = false;
  ceaInitiationDate = new Date();
  menubar: any[] = [];


  insuffList: any[] = [];
  insuffStatusList: any;
  insuffStatusListExport: any;
  btnCheck = false;
  insuffSelectList: SearchStatus[] = [];
  dialogRef: any;
  bulkData: any[] = [];
  bulkDocumentList: any[] = [];
  insuffDocData: any;
  bulkForm: UntypedFormGroup;
  docContent: any[] = [];
  clientNameList: any[] = [];
  rejectFlag = false;
  // dataSource: SearchStatus[];
  // totalRecords: number;
  insuffCloseList: any[] = [];
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  CurrentTab = 0;
  insuffClientName: [];
  insuffClientRefNo: [];
  insuffVerificationId: [];
  insuffScreeningId: [];
  insuffCandidateName: [];
  insuffLevel: [];
  applyPaging = true;
  screenAuth: any = {};
  // tabchange = 0;
  constructor(private sanitizer: DomSanitizer, private route: Router, public common: CommonService, private formBuilder: UntypedFormBuilder,
    public screeningService: ScreeningService, private messageService: MessageService, public dialog: MatDialog, private auth: AuthService) {
    this.menubar = [{ menuName: this.common.RAISED },
      { menuName: this.common.PAR_CLE }, { menuName: this.common.HOLD_CLE }, { menuName: this.common.CLO_INS_QUERY }];
  }

  ngOnInit() {
    // this.tabchange = this.common.fullyClearTab === true ? 1 : 0;
    this.screenAuth = this.auth.getScreenAuth(this.route.url);
    let tabIndex = (this.common.fullyClearTab === true ? 1 : this.common.fullyClearTab === null ? 3 : this.common.fullyClearTab === false ? 4 : 0);
    this.initFormGroup();
    this.getInsuffDetails();
    this.searchInsufficiencyList(tabIndex, 1);


    // if (this.screeningService.isVerifiactionMode) {
    //   this.insufficiencyAction({}, 'raiseInsuffieciency');
    this.itemPerPage = [10, 10, 10, 10, 10, 10];
    this.pageno = 5;
    // }
  }
  initFormGroup() {
    this.insufficiencyFormGroup = new UntypedFormGroup({
      clientRefNo: new UntypedFormControl(),
      clientName: new UntypedFormControl(),
      statusId: new UntypedFormControl(),
      candidateName: new UntypedFormControl(),
      levelId: new UntypedFormControl(),
      verificationId: new UntypedFormControl(),
      screeningCompId: new UntypedFormControl(),
      screeningId: new UntypedFormControl()
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.refNoControl = new AutoCompleteDropDown('Client Reference Number', 'clientRefNo', 'name', 'name', this.insuffClientRefNo,
      '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.insuffClientName,
      '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.verificationIdControl = new AutoCompleteDropDown(' Verification Id', 'screeningCompId', 'name',
      'name', this.insuffVerificationId, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.candidateNameControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id', 'name',
      this.insuffCandidateName, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.statusControls = new AutoCompleteDropDown('Status', 'statusId', 'id', 'name',
      this.insuffLevel, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.levelControls = new AutoCompleteDropDown('Level', 'levelId', 'id', 'name',
      this.insuffLevel, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.screeningControl = new AutoCompleteDropDown('Screening Id', 'screeningId', 'name',
      'name', this.insuffScreeningId, '', this.insufficiencyFormGroup, false, false, false, 'standard');

  }
  // searchInsufficiencyList(tabInd, pageNo) {
  //   this.shievePageNo = pageNo;
  //   this.CurrentTab = tabInd;
  //   // let clientRefNo = this.insufficiencyFormGroup.controls.clientRefNo.value;
  //   let statusId = this.insufficiencyFormGroup.controls.statusId.value;
  //   // let candidateName = this.insufficiencyFormGroup.controls.candidateName.value;
  //   let levelId = this.insufficiencyFormGroup.controls.levelId.value;
  //   // let verificationId = this.insufficiencyFormGroup.controls.verificationId.value;
  //   // clientRefNo = clientRefNo === 'null' ? '' : clientRefNo;
  //   statusId = statusId === 'null' ? 0 : statusId;
  //   // candidateName = candidateName === 'null' ? '' : candidateName;
  //   levelId = levelId === 'null' || levelId === '' ? 0 : levelId;
  //   // verificationId = verificationId === 'null' ? '' : verificationId;

  //   let InsuffStatus;
  //   if (tabInd === 0)
  //     InsuffStatus = this.common.RAISED.toLowerCase();
  //   else if (tabInd === 1)
  //     InsuffStatus = this.common.PAR_CLE.toLowerCase();
  //   else if (tabInd === 2)
  //     InsuffStatus = this.common.HOLD_CLE.toLowerCase();
  //   else if (tabInd === 3)
  //     InsuffStatus = this.common.ClearInsuff.toLowerCase();
  //   else if (tabInd === 4)
  //     InsuffStatus = this.common.Submitted.toLowerCase();

  //   this.applyPagination();

  //   this.screeningService.getInsuffSearch(false, statusId, levelId, this.userData.userId,
  //     this.userData.teamName, InsuffStatus, this.userData).subscribe(res => {
  //       if (res) {
  //         this.shieveTotalCount = res.headers.get('X-Total-Count');
  //         const respBody = res.body;
  //         respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
  //         this.insuffList = respBody;
  //         this.insuffSearchList = respBody;
  //         this.statusChange(tabInd);
  //         this.getBulkData();
  //         this.screeningService.GetInsuffDropdownDetails(false, statusId, levelId, this.userData.userId,
  //           this.userData.teamName, InsuffStatus).subscribe(res => {
  //             if (res) {
  //               this.insuffClientName = res.clientName;
  //               this.insuffClientRefNo = res.clientRefID;
  //               this.insuffVerificationId = res.verifcationId;
  //               this.insuffCandidateName = res.candidateName;
  //               //   this.insuffScreeningId = res.clientScreeningId;
  //               this.insuffLevel = res.level;
  //               if (res.clientScreeningId != null && res.clientScreeningId.length > 0) {
  //                 this.insuffScreeningId = res.clientScreeningId.filter(f => f.name != 'N/A')
  //               }
  //               this.initautoCompleteCtrl();
  //             }
  //           });
  //         if (tabInd === 3) {
  //           this.screeningService.GetDetailsForAutomationInsuff(this.userData).subscribe(resp => {
  //             if (resp) {
  //               this.shieveTotalCount = resp.headers.get('X-Total-Count');
  //              this.shieveTotalCount =
  // (this.common.fullyClearTab === null && tabInd === 5 || tabInd === 3)
  //   ? resp.headers.get('X-Total-Count')
  //   : this.shieveTotalCount;
  //               const respBody1 = resp.body;
  //               this.insuffCloseList = respBody1;
  //               this.toolTip = '';
  //               this.rejectFlag = false;
  //             }
  //           });
  //         }
  //       }
  //     });
  //   this.applyPaging = true;
  // }

 searchInsufficiencyList(tabInd, pageNo) {
  this.shievePageNo = pageNo;
  this.CurrentTab = tabInd;

  let statusId = this.insufficiencyFormGroup.controls.statusId.value;
  let levelId = this.insufficiencyFormGroup.controls.levelId.value;
  statusId = statusId === 'null' ? 0 : statusId;
  levelId = levelId === 'null' || levelId === '' ? 0 : levelId;

  let InsuffStatus;
  if (tabInd === 0)
    InsuffStatus = this.common.RAISED.toLowerCase();
  else if (tabInd === 1)
    InsuffStatus = this.common.PAR_CLE.toLowerCase();
  else if (tabInd === 2)
    InsuffStatus = this.common.HOLD_CLE.toLowerCase();
  else if (tabInd === 3)
    InsuffStatus = this.common.ClearInsuff.toLowerCase();
  else if (tabInd === 4)
    InsuffStatus = this.common.Submitted.toLowerCase();

  this.applyPagination();

  this.screeningService.getInsuffSearch(false, statusId, levelId, this.userData.userId,
    this.userData.teamName, InsuffStatus, this.userData).subscribe(res => {
      if (res) {
        this.shieveTotalCount = res.headers.get('X-Total-Count');
        const respBody = res.body;
        respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
        this.insuffList = respBody;
        this.insuffSearchList = respBody;

        // ✅ Only call statusChange here for tabs that DON'T need insuffCloseList
        if (tabInd !== 3) {
          this.statusChange(tabInd);
        }

        this.getBulkData();
        this.screeningService.GetInsuffDropdownDetails(false, statusId, levelId, this.userData.userId,
          this.userData.teamName, InsuffStatus).subscribe(res => {
            if (res) {
              this.insuffClientName = res.clientName;
              this.insuffClientRefNo = res.clientRefID;
              this.insuffVerificationId = res.verifcationId;
              this.insuffCandidateName = res.candidateName;
              this.insuffLevel = res.level;
              if (res.clientScreeningId != null && res.clientScreeningId.length > 0) {
                this.insuffScreeningId = res.clientScreeningId.filter(f => f.name != 'N/A');
              }
              this.initautoCompleteCtrl();
            }
          });

        if (tabInd === 3) {
          this.screeningService.GetDetailsForAutomationInsuff(this.userData).subscribe(resp => {
            if (resp) {
              this.shieveTotalCount = resp.headers.get('X-Total-Count');
              const respBody1 = resp.body;
              this.insuffCloseList = respBody1;
              this.toolTip = '';
              this.rejectFlag = false;

              // ✅ Now call statusChange AFTER insuffCloseList is populated
              this.statusChange(tabInd);
            }
          });
        }
      }
    });
  this.applyPaging = true;
}

  applyPagination() {
    let filter = '';//this.userData.filters;

    if (this.insufficiencyFormGroup.value.clientName && this.insufficiencyFormGroup.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientId==' + this.insufficiencyFormGroup.value.clientName;
    } if (this.insufficiencyFormGroup.value.clientRefNo && this.insufficiencyFormGroup.get('clientRefNo')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientRefNo@=' + this.insufficiencyFormGroup.value.clientRefNo;
    } if (this.insufficiencyFormGroup.value.screeningCompId && this.insufficiencyFormGroup.get('screeningCompId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'verificationId@=' + this.insufficiencyFormGroup.value.screeningCompId;
    } if (this.insufficiencyFormGroup.value.candidateName && this.insufficiencyFormGroup.get('candidateName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'candidateId==' + this.insufficiencyFormGroup.value.candidateName;
    } if (this.insufficiencyFormGroup.value.levelId && this.insufficiencyFormGroup.get('levelId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'LevelLookupId==' + this.insufficiencyFormGroup.value.levelId;
    } if (this.insufficiencyFormGroup.value.screeningId && this.insufficiencyFormGroup.get('screeningId')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientScreeningId==' + this.insufficiencyFormGroup.value.screeningId;
    }

    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter ? filter : '';
    let sort = this.column;
    this.userData.sorts = this.direction ? this.direction == -1 ? '-' + sort : sort : '';
    this.userData.applyPaging = this.applyPaging;
    this.userData.needTotal = true;
  }
  ngOnDestroy() {
    this.common.fullyClearTab = undefined;
  }
  getDate() {
    return new Date();
  }
  shievePagination(event: any) {
    //this.shievePageNo = event;
    this.searchInsufficiencyList(this.CurrentTab, event);
    //this.getCaseHistory();
  }
  preventInfinite(value: any) {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
    this.shievePageSize = value;
    this.searchInsufficiencyList(this.CurrentTab, this.shievePageNo);

  }
  OnPageChange() {
    this.searchInsufficiencyList(this.CurrentTab, this.shievePageNo);
  }
  GetClearedDocList(insufficiencyId: any) {
    this.screeningService.GetClearedDocList(insufficiencyId).subscribe(res => {
      if (res) {
        this.clearInsuffContent.insuffDocument = res;
        this.clearInsuffContent.insuffDocument.forEach(element => {
          if (!element.infoReqFlag) {
            this.clearInsuffContent.insuffDocumentIds.push(element.insuffDocTransId);
          }
        });
      }
    });
  }
  getInsuffDetails() {
    this.screeningService.getInsuffDetails(true).subscribe(res => {
      if (res) {
        if (this.userData.applicationId === 2) {
          this.statusList = res.insuffStatus.filter(x => x.lookUpName !== this.common.FULLY_CLE);
          if (!(this.menubar.some(s => s.menuName === this.common.Submitted))) {
            this.menubar.splice(4, 0, { menuName: this.common.Submitted });
          }
        } else if (this.userData.applicationId === 1) {
          this.statusList = res.insuffStatus.filter(x => x.lookUpName !== this.common.Submitted);
          if (!(this.menubar.some(s => s.menuName === this.common.App_Pend))) {
            this.menubar.splice(4, 0, { menuName: this.common.App_Pend });
          }
        }
      }
    });
  }
  autocompleteData() {
    this.refNoList = Array.from(new Map(this.insuffStatusList.map(x => ({ clientRefNo: x.clientRefNo }))
      .map(e => [e.clientRefNo, e])).values());
    this.clientNameList = Array.from(new Map(this.insuffStatusList.map(x => ({ clientName: x.clientName }))
      .map(e => [e.clientName, e])).values());
    this.verificationList = Array.from(new Map(this.insuffStatusList.map(x => ({ screeningCompId: x.screeningCompId }))
      .map(e => [e.screeningCompId, e])).values());
    this.insuffStatusList.map(x => x.candidateName = x.candidateFName + ' ' + x.candidateMName + ' ' + x.candidateLName);
    this.candidateNameList = Array.from(new Map(this.insuffStatusList.
      map(x => ({ candidateName: x.candidateName })).map(e => [e.candidateName, e])).values());
    this.levelMultiList = Array.from(new Map(this.insuffStatusList.map(x => ({ insuffLevel: x.insuffLevel }))
      .map(e => [e.insuffLevel, e])).values());
    this.initautoCompleteCtrl();
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  insufficiencyAction(rowData: any) {
    if (rowData.insuffStatus.toLowerCase() !== this.common.FULLY_CLE.toLowerCase()) {
      if ((this.userData.applicationId === 2 && rowData.insuffStatus.toLowerCase() !== this.common.Submitted.toLowerCase()) || this.userData.applicationId === 1) {
        this.toolTip = 'Save';
        let screeningId = 0;
        if (!this.screeningService.isVerifiactionMode) {
          this.selectedComponentDetails = rowData;
          screeningId = this.common.getNuumberFromString(this.selectedComponentDetails.screeningCompId);
        }
        this.GetInsuffByScreeningCompId(screeningId);
      }
    }
  }
  GetInsuffByScreeningCompId(compId: number) {
    this.docContent = [];
    this.screeningService.GetInsuffDetailsByScreenCompId(compId).subscribe(res => {
      if (res) {
        const data = res;
        this.docContent = res;
        this.editDelete(data[data.length - 1]);
      }
    });
  }
  getInsuffDocument(insufficiencyId, data = null) {
    this.screeningService.GetClearInsuffDocument(insufficiencyId).subscribe(res => {
      this.documentList = res;
      if (data) {
        data.doc = res;
      }
    });
  }
  editDelete(value: any) {
    this.insuffScreenMode = !this.insuffScreenMode;
    this.selectedInsufficiencyDetails = value;
    this.insufficiencyDocShow = false;
    this.breadCrumbFlags();
    this.getInsuffDocument(this.selectedInsufficiencyDetails.insufficiencyId, {});
    this.getInsuffDetails();
    this.GetClearedDocList(value.insufficiencyId);
    if (this.selectedInsufficiencyDetails.insuffLevel === 'FeesRequest') {
      this.verifierQueue = true;
    }
    this.dialog.closeAll();
  }
  breadCrumbFlags() {
    this.btnBulk = !this.btnBulk;
    this.btnSave = !this.btnSave;
    this.btnReset = false;
    this.btnBack = !this.btnBack;
  }
  addBulkForm() {
    this.GetBulkFormdata();
    this.insuffScreenMode = !this.insuffScreenMode;
    this.btnCheck = true;
    this.toolTip = 'Bulk Save';
    this.breadCrumbFlags();
    this.insuffSelectList = [];
  }
  resetForm() {
    this.insufficiencyDocShow = false;
    this.insufficiencyFormGroup.reset();
    this.insufficiencyFormGroup.markAsPristine();
    this.insufficiencyFormGroup.markAllAsTouched();
  }
  closeForm() {
    if (this.insuffScreenMode) {
      this.route.navigate(['dashboard/home']);
    } else {
      this.insuffScreenMode = !this.insuffScreenMode;
      this.btnCheck = false;
      this.selDocName = undefined;
      this.insufficiencyDocShow = false;
      this.selectedComponentDetails = null;
      this.breadCrumbFlags();
      this.clearInsuffContent = new ClearInsuff();
      this.searchInsufficiencyList(this.CurrentTab, this.shievePageNo);
      this.clearInsuffContent.insuffDocument = [];
      this.selDocName = this.statusLookupId = this.verifierQueue = this.insRemarks = undefined;
      this.clearedDate = new Date();
      this.ceaInitiationDate = new Date();

    }
  }
  getLookUpName(id): string {
    if (id > 0 && this.statusList.length > 0) {
      if (this.insuffScreenMode === true) {
        if (this.statusList.find(x => x.lookUpId === id).lookUpName.toLowerCase() == this.common.FULLY_CLE.toLowerCase() && this.selectedInsufficiencyDetails.holdFlag == true) {
          this.verifierQueue = true;
        }
      }
      return this.statusList.find(x => x.lookUpId === id).lookUpName.toLowerCase();
    }
  }
  insuffReject() {
    if (this.rejectFlag === true) {
      this.openPopup('Are you sure,Do you want to reject the insufficiency?');
    }
  }
  insuffApprove() {
    if (this.rejectFlag === false) {
      if (this.insuffValidation(true)) {
        return;
      }
      this.openPopup('Are you sure,Do you want to approve the insufficiency?');
    }
  }
  openPopup(textBody: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: textBody
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
            if (textBody.includes('approve')) {
              this.saveInsuff(this.btnCheck, true, false);
            } else if (textBody.includes('reject')) {
              this.saveInsuff(this.btnCheck, false, false);
            }
          }
        }
        //  else if (result === undefined) {
        //   if (textBody.includes('reject')) {
        //     this.qcReject.qcRejectComponent = [];
        //   }
        // }
      });
    }
  }
  insuffValidation(statusFlag: any) {
    let flag;
    if (!this.statusLookupId) {
      if (statusFlag == true) {
        this.showTopCenter('warn', 'Warning', 'Please select status'); flag = true;
      }
    } else {
      if (!(this.insRemarks && this.insRemarks.length > 0)) {
        this.showTopCenter('warn', 'Warning', 'Add Insufficiency Remarks'); flag = true;
      }
      // if (this.getLookUpName(this.statusLookupId) === this.common.FULLY_CLE.toLowerCase() || this.getLookUpName(this.statusLookupId) === this.common.Submitted.toLowerCase()) {
      //   if (this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase()) {
      //     if (this.documentList.filter(e => !this.clearInsuffContent.insuffDocumentIds.some(m => m === e.insuffDocTransId))
      //       .length > 0) {
      //       this.showTopCenter('warn', 'Warning', 'Please add all Doc types'); flag = true;
      //     }
      //   }
      //   if (flag !== true) {
      //     if (this.clearInsuffContent.insuffDocument.length === 0
      //       && this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase()) {
      //       this.showTopCenter('warn', 'Warning', 'Add atleast one Document'); flag = true;
      //     }
      //   }
      // }
    }
    return flag;
  }
  saveInsuff(type, statusFlag, saveFlag) {
    if (type === true) {
      this.saveBulkClearance();
    } else {
      if (saveFlag && this.insuffValidation(statusFlag)) {
        return;
      }
      const dataClearInsuff: ClearInsuff[] = [{
        insufficiencyId: this.selectedInsufficiencyDetails.insufficiencyId,
        statusLookupId: this.rejectFlag === true ? (this.statusList.find(x => x.lookUpName.toLowerCase() === this.common.RAISED.toLowerCase()).lookUpId) : this.statusLookupId,
        clearedDate: this.clearedDate,
        ceaInitiationDate: this.ceaInitiationDate,
        insuffDetail: {
          comments: this.insRemarks,
          createdUserId: this.userData.userId,
          insuffDate: new Date(),
          insuffDetailId: this.selectedInsufficiencyDetails.insuffDetail.insuffDetailId,
          insufficiencyId: this.selectedInsufficiencyDetails.insufficiencyId,
        },
        insuffDocument: (this.getLookUpName(this.statusLookupId) === this.common.HOLD_CLE.toLowerCase() || this.getLookUpName(this.statusLookupId) === this.common.RAISED.toLowerCase()) ? [] :
          this.clearInsuffContent.insuffDocument,
        createdUserId: this.userData.userId,
        insuffDocumentIds: (this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase())
          ? this.clearInsuffContent.insuffDocumentIds : [],
        verifierQueue: this.verifierQueue,
        applicationId: this.userData.applicationId
      }];
      const formData = new FormData();
      this.clearInsuffContent.insuffDocument.forEach((r, index) => {
        formData.append('InsuffClearDocument_' + index, r.document1);
      });
      formData.append('ClearInsuff', JSON.stringify(dataClearInsuff));
      this.screeningService.AddClearInsufficiency(formData).subscribe(res => {
        if (res) {
          if (res.success) {
            this.showTopCenter('success', 'success Message', 'Insufficiency ' + ((this.selectedInsufficiencyDetails && this.selectedInsufficiencyDetails.insuffStatus
              === this.common.Submitted) ? (this.rejectFlag === true ? 'Rejected' : 'Approved') : this.getLookUpName(this.statusLookupId)) + ' Successfully');
          } else {
            this.showTopCenter('warn', 'Failed', 'Insufficiency Cleared But Mail Not Sent');
            this.btnCheck = false;
          }
          this.insRemarks = this.statusLookupId = undefined; this.clearedDate = new Date(); this.ceaInitiationDate = new Date();
          this.closeForm();
          //this.searchInsufficiencyList();
        }
      });
    }
  }
  clearInsufficiency() {
    this.searchValueArr = [];
    this.insufficiencyFormGroup.reset();
    this.statusMultiList = [];
    //this.insufficiencyFormGroup.controls['statusId'].setValue(this.common.RAISED);
    this.searchInsufficiencyList(this.CurrentTab, 1);
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  openUploadDoc(event: any) {
    if (!this.selDocName && this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() === this.common.DOCU_REQ.toLowerCase()) {
      this.showTopCenter('warn', 'Add Document', ' please select the Document Type'); return;
    }
    const ext = (event.target.files[0].name.split('.').pop()).toLowerCase();
    if (ext === 'eml' || ext === 'pst' || ext === 'txt' || ext === 'pdf' || ext === 'docx' || ext === 'doc'
      || ext === 'xps' || ext === 'xlsx' || ext === 'xls' || ext === 'xlsb' || ext === 'xlsm'
      || ext === 'png' || ext === 'jpg' || ext === '.JPG' || ext === 'jpeg' || ext === 'gif' || ext === 'psd' || ext === 'tiff'
      || ext === 'eps' || ext === 'raw' || ext === 'msg') {
      const val = this.common.INFO_REQ;
      const SD = new ScreeningDocument();
      SD.fileName = event.target.files[0].name;
      SD.document1 = event.target.files[0];
      SD.screeningDocId = 0;
      SD.filePath = '';
      SD.docTypeId = (this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase())
        ? (this.selDocName ? this.selDocName : 0) : 0;
      SD.docTypeName = (this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase()) ?
        (this.selDocName ? this.documentList.filter(r => r.insuffDocTransId === this.selDocName)[0].description : val) : val;
      SD.docSubTypeId = 0;
      SD.insuffDocTransId = (this.selectedInsufficiencyDetails.insuffReqType.toLowerCase() !==
        this.common.INFO_REQ.toLowerCase()) ? (this.selDocName ? this.selDocName : 0) : 0;
      if (this.clearInsuffContent.insuffDocument.length > 0) {
        this.clearInsuffContent.insuffDocument.forEach(e => {
          if (e.fileName === SD.fileName && e.docTypeId === SD.docTypeId) {
            this.docFlag = true;
          }
        });
        if (this.docFlag === false) {
          this.clearInsuffContent.insuffDocument.push(SD);
          this.docFlag = false;
        } else {
          this.showTopCenter('Warn', 'Failed', 'This File Already Exist');
          this.docFlag = false;
        }
      } else {
        this.clearInsuffContent.insuffDocument = [];
        this.clearInsuffContent.insuffDocument.push(SD);
      }
      if (this.clearInsuffContent.insuffDocumentIds.length > 0) {
        if (this.selDocName) {
          this.clearInsuffContent.insuffDocumentIds.push(this.selDocName);
        }
      } else {
        this.clearInsuffContent.insuffDocumentIds = [];
        if (this.selDocName) {
          this.clearInsuffContent.insuffDocumentIds.push(this.selDocName);
        }
      }
    } else {
      this.showTopCenter('warn', 'Failure Message',
        'Please upload a valid file,' + ' Acceptable file Formats : .eml, .pst, .txt, .pdf, .docx, .doc, .xps' +
        '' + ', .xlsx, .xls, .xlsb, .xlsm , .png, .jpg, .jpeg, .gif, .psd, .tiff, .eps, .raw, .msg');
    }
    this.getRemarkTemplate();
  }
  getRemarkTemplate() {
    let str = '';
    if (this.clearInsuffContent && this.clearInsuffContent.insuffDocument.length > 0) {
      str = 'Please find the attached supporting documents:';
      this.clearInsuffContent.insuffDocument.forEach(e => {
        // if (e.docTypeId > 0) {
        str += '\n' + e.docTypeName + ',';
        // }
      });
      this.insRemarks = str;
    } else {
      this.insRemarks = str;
    }
  }
  openDeleteDialog(index, data) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '330px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.removeDocument(index, data);
          }
        }
      });
    }
  }
  removeDocument(index, data) {
    this.clearInsuffContent.insuffDocument.splice(index, 1);
    if (data.insuffDocTransId > 0) {
      this.clearInsuffContent.insuffDocumentIds.splice(index, 1);
    }
    this.getRemarkTemplate();
    this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
  }
  getDueDate(rowData: any) {
    const raisedDate = this.common.getTimezoneOffset(this.selectedInsufficiencyDetails.raisedDate, false);
    raisedDate.setHours(raisedDate.getHours() + 24);
    const todayDate = new Date();
    return rowData.screeningDocId && (todayDate > raisedDate);
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
      for (const ctrl in this.insufficiencyFormGroup.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
            this.insufficiencyFormGroup.get(ctrl).setValue('');
          }
        }
      }
    }
    this.searchInsufficiencyList(this.CurrentTab, 1);
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.insufficiencyFormGroup.controls) {
      if (ctrl === key) {
        this.insufficiencyFormGroup.get(ctrl).setValue('');
      }
    }
    this.searchInsufficiencyList(this.CurrentTab, 1);
  }
  // resetInsuff() {
  //   this.insufficiencyFormGroup.get('clientRefNo')?.setValue('');
  //   this.insufficiencyFormGroup.get('candidateName')?.setValue('');
  //   this.insufficiencyFormGroup.get('screeningCompId')?.setValue('');
  // }
  getPage(event, ind) {
    this.page[ind] = event;
  }
  getTotalPage(ind): number {
    if (this.insuffStatusList.length) {
      return Math.ceil(this.insuffStatusList.length / this.itemPerPage[ind]);
    }
  }
  showall(ind: any) {
    // if (this.insuffStatusList.length > 0) {
    //   this.itemPerPage[ind] = this.insuffStatusList.length;
    // }
    if (this.shieveTotalCount > 0) {
      //this.shievePageSize = this.shieveTotalCount;
      this.applyPaging = false
      this.searchInsufficiencyList(this.CurrentTab, 1);
    }
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  statusChange(tabInd: any) {
    const data = (this.common.fullyClearTab === null && tabInd === 5 || tabInd === 3) ? this.insuffCloseList : this.insuffList;
    this.tab.selectedIndex = tabInd;
    this.tabIndex = tabInd; this.count = 0;
    this.insuffStatusList = [];
    if (tabInd === 1) {
      data.forEach(e => {
        if (e.insuffStatus.toLowerCase() === this.common.PAR_CLE.toLowerCase() && !e.automationFlag) {
          this.insuffStatusList.push(e);
        }
      });
    } else if (tabInd === 0) {
      data.forEach(e => {
        if (e.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase() && !e.automationFlag) {
          this.insuffStatusList.push(e);
        }
      });
    } else if (tabInd === 3) {
      this.insuffCloseList.forEach(e => {
        if (e.automationFlag) {
          this.insuffStatusList.push(e);
        }
      });
    } else if (tabInd === 2) {
      data.forEach(e => {
        if (e.insuffStatus.toLowerCase() === this.common.HOLD_CLE.toLowerCase() && !e.automationFlag) {
          this.insuffStatusList.push(e);
        }
      });
    } else if (tabInd === 4) {
      data.forEach(e => {
        if (e.insuffStatus.toLowerCase() === this.common.Submitted.toLowerCase()) {
          this.insuffStatusList.push(e);
        }
      });
    }
    this.autocompleteData();
    // this.common.fullyClearTab = false;
  }

  allowSameFileUpload(event: any): void {
    event.srcElement.value = '';
  }
  openBulkDocument(rowData: any) {
    this.bulkDocumentList = [];
    this.insuffDocData = null;
    if (rowData.insuffReqType !== this.common.INFO_REQ) {
      this.getInsuffDocument(rowData.insufficiencyId, rowData);
    } else {
      this.documentList = [];
    }
    this.dialogRef = this.dialog.open(this.bulkDocument, {
      width: '800px',
      disableClose: true
    });
    this.insuffDocData = rowData;
  }
  saveBulkDocument() {
    this.insuffSelectList.forEach(element => {
      if (element.screeningCompId === this.insuffDocData.screeningCompId) {
        if (element.insuffDocument) {
          element.insuffDocument.push(...this.bulkDocumentList);
        } else {
          element.insuffDocument = this.bulkDocumentList;
        }
      }
    });
    this.dialog.closeAll();
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  showallb() {
    if (this.insuffSearchList.length > 0) {
      this.pageno = this.insuffSearchList.length;
      // this.loadCustomers(0, this.dataSource.length);
    }
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getBulkData() {
    this.insuffSearchList = this.insuffSearchList.filter(x => x.insuffStatus.toLowerCase() !== this.common.FULLY_CLE.toLowerCase()
      && x.insuffStatus.toLowerCase() !== this.common.Submitted.toLowerCase() && !x.automationFlag);
    // this.insuffSearchList = this.insuffSearchList.filter(x => x.insuffDetails.length > 0);
    this.insuffSearchList.map(x => x.insuffStatus.toLowerCase() === this.common.RAISED.toLowerCase() ? x.statusLookupId = null
      : x.statusLookupId = x.statusLookupId);
    this.bulkForm = this.formBuilder.group({});
    for (let i = 0; i < this.insuffSearchList.length; i++) {
      this.bulkForm.addControl('bulkRemarks' + this.insuffSearchList[i].screeningCompId, new UntypedFormControl(''));
      this.bulkForm.addControl('bulkStatus' + this.insuffSearchList[i].screeningCompId, new UntypedFormControl(null));
      // , [Validators.compose([Validators.required])]
    }
    // this.loading = true;
    // this.dataSource = this.insuffSearchList;
    // this.totalRecords = this.insuffSearchList.length;
  }
  // loadCustomers(first, rows) {
  //   this.loading = true;
  //   setTimeout(() => {
  //     if (this.dataSource) {
  //       this.insuffSearchList = this.dataSource.slice(first, (first + rows));
  //       this.loading = false;
  //     }
  //   }, 1000);
  // }
  openUploadBulkDoc(event: any) {
    const Doc = new ScreeningDocument();
    Doc.fileName = event.target.files[0].name;
    Doc.document1 = event.target.files[0];
    Doc.screeningDocId = 0;
    Doc.filePath = '';
    Doc.docTypeId = this.bulkDocName ? this.bulkDocName : 0;
    Doc.docTypeName = '';
    Doc.docSubTypeId = 0;
    Doc.insuffDocTransId = this.bulkDocName ? this.bulkDocName : 0;
    this.bulkDocumentList.push(Doc);
  }
  removeBulkDocument(index, data) {
    data.splice(index, 1);
  }
  // downloadFile(data: any) {

  //   this.common.saveByteArray(data.fileName, data.document1);
  // }
  clearValidation(i: any) {
    this.bulkForm.get('bulkRemarks' + i).clearValidators();
    this.bulkForm.get('bulkStatus' + i).clearValidators();
    this.updateValidation(i);
  }
  setValidation(i: any) {
    this.bulkForm.get('bulkRemarks' + i).setValidators(Validators.required);
    this.bulkForm.get('bulkStatus' + i).setValidators(Validators.required);
    this.updateValidation(i);
  }
  updateValidation(i: any) {
    this.bulkForm.get('bulkRemarks' + i).updateValueAndValidity();
    this.bulkForm.get('bulkStatus' + i).updateValueAndValidity();
  }
  saveBulkClearance() {
    let flag = true; this.bulkData = [];
    this.insuffSearchList.forEach((element, i) => {
      if (this.insuffSelectList.length > 0) {
        if (flag === true) {
          this.insuffSelectList.forEach((ele, ind) => {
            if (element.screeningCompId === ele.screeningCompId) {
              this.setValidation(ele.screeningCompId);
              // if (this.getLookUpName(Number(this.bulkForm.get('bulkStatus' + i).value)) === this.common.FULLY_CLE.toLowerCase()) {
              //   if (ele.insuffReqType.toLowerCase() !== this.common.INFO_REQ.toLowerCase()) {
              //     if (!ele.insuffDocument || ele.insuffDocument.length === 0) {
              //       this.showTopCenter('warn', 'Failure message', 'Please upload document for all Doc types'); return flag = false;
              //     } else if (ele.doc.filter(e => (ele.insuffDocument && !ele.insuffDocument.some(m =>
              //       m.insuffDocTransId === e.insuffDocTransId))).length > 0) {
              //       this.showTopCenter('warn', 'Failure message', 'Please upload document for all Doc types'); return flag = false;
              //     }
              //   }
              // }
            }
          });
        }
      } else {
        this.clearValidation(element.screeningCompId);
      }
    });
    if (this.bulkForm.valid && flag === true) {
      if (this.insuffSelectList.length > 0) {
        this.insuffSelectList.forEach(element => {
          if (element.screeningCompId) {
            const dataClearInsuff: ClearInsuff = {
              insufficiencyId: element.insufficiencyId,
              statusLookupId: element.statusLookupId,
              clearedDate: this.clearedDate,
              ceaInitiationDate: this.ceaInitiationDate,
              insuffDetail: {
                comments: element.remarks,
                createdUserId: this.userData.userId,
                insuffDate: new Date(),
                insuffDetailId: 0,
                insufficiencyId: element.insufficiencyId,
              },
              insuffDocument: element.insuffDocument,
              createdUserId: this.userData.userId,
              insuffDocumentIds: [],
              verifierQueue: element.queue,
              applicationId: this.userData.applicationId
            };
            this.bulkData.push(dataClearInsuff);
          }
        });
        const formData = new FormData();
        const docData = this.bulkData.filter(x => x.insuffDocument);
        docData.forEach(r => {
          r.insuffDocument.forEach((d, i) => {
            formData.append('InsuffClearDocument_' + i, d.document1);
          });
        });
        formData.append('ClearInsuff', JSON.stringify(this.bulkData));
        this.screeningService.AddClearInsufficiency(formData).subscribe(res => {
          if (res) {
            this.showTopCenter('success', 'success Message', 'Insufficiency Bulk Cleared Successfully');
            this.closeForm();
          }
        });
      } else {
        this.showTopCenter('warn', 'Failure Message', 'Kindly select any one cases');
      }
    } else {
      this.insuffSearchList.forEach((element, i) => {
        this.insuffSelectList.forEach((ele, ind) => {
          if (element.screeningCompId === ele.screeningCompId) {
            this.bulkForm.get('bulkRemarks' + ele.screeningCompId).markAsTouched();
            this.bulkForm.get('bulkStatus' + ele.screeningCompId).markAsTouched();
          }
        });
      });
    }
  }

  downloadDoc(data: any) {
    if (data.screeningDocId > 0) {
      this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
        this.common.downloadDocument(data.screeningDocId, resp.document, data.fileName);
      });
    } else {
      if (data.document1) {
        this.common.saveByteArray(data.fileName, data.document1);
      }
      if (data.document) {
        this.common.saveByteArray(data.fileName, data.document);
      }
    }
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
  preview(data: any) {
    this.pdftool('reset');
    this.rotateimg('reset');
    this.downldata = data;
    // this.fname = fileName;
    // this.sid = screeningDocId;
    const ext = data.fileName.split('.').pop();
    if (ext === 'png' || ext === 'jpg' || ext === 'JPG' || ext === 'gif' || ext === 'jpeg' || ext === 'psd' || ext === 'bmp') {
      if (data.screeningDocId == 0) {
        const blob = new Blob([data.document1], { type: 'image/jpeg;base64' });
        const reader = new FileReader();
        reader.onloadend = (e) => {
          this.imageChangedEvent = reader.result;
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl(this.imageChangedEvent)
        };
        reader.readAsDataURL(blob);
      }
      else if (data.screeningDocId > 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
          this.imageSource = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.document);
        });
      }
      this.dialog.open(this.imgprDialog, {
        panelClass: 'myClass',
        disableClose: true
      });
    }
    else if (ext == 'pdf' || ext === 'PDF') {
      if (data.screeningDocId == 0) {
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
      else if (data.screeningDocId > 0) {
        this.screeningService.downloadScreeningDocument(data.screeningDocId).subscribe(resp => {
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
      this.downloadDoc(data);
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
        this.downloadDoc(this.downldata);
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
  exportAsExcelFile() {
    this.shievePageNo = 1;
    const tabInd = this.CurrentTab;
    let statusId = this.insufficiencyFormGroup.controls.statusId.value;
    let levelId = this.insufficiencyFormGroup.controls.levelId.value;
    statusId = statusId === 'null' ? 0 : statusId;
    levelId = levelId === 'null' || levelId === '' ? 0 : levelId;

    let InsuffStatus;
    if (tabInd === 0)
      InsuffStatus = this.common.RAISED.toLowerCase();
    else if (tabInd === 1)
      InsuffStatus = this.common.PAR_CLE.toLowerCase();
    else if (tabInd === 2)
      InsuffStatus = this.common.HOLD_CLE.toLowerCase();
    else if (tabInd === 3)
      InsuffStatus = this.common.ClearInsuff.toLowerCase();
    else if (tabInd === 4)
      InsuffStatus = this.common.Submitted.toLowerCase();

    this.applyPagination();
    this.userData.applyPaging = false;

    const needsCloseList = tabInd === 3 || (this.common.fullyClearTab === null && tabInd === 5);

    const insuffColumn = [
      { field: 'sno', header: 'S No' },
      { field: 'candidateName', header: 'Candidate Name' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'siteName', header: 'Site Name' },
      { field: 'clientRefNo', header: 'Client Reference No' },
      { field: 'screeningCompId', header: 'Verification Id' },
      { field: 'componentName', header: 'Component Name' },
      { field: 'screeningStatus', header: 'Screening Status' },
      { field: 'clientScreeningId', header: 'Screening ID' },
      { field: 'insuffStatus', header: 'Insuff Status' },
      { field: 'insuffLevel', header: 'Insuff Level' },
      { field: 'insuffRaisedBy', header: 'Insuff Raised By' },
      { field: 'functionalEntity', header: 'Functional Entity' },
      { field: 'raisedDate', header: 'Raised Date & Time' },
      { field: 'clearedDate', header: 'Cleared Date & Time' },
      { field: 'ceaInitiationDate', header: 'CEA Initiation Date & Time' }];

    const search$ = this.screeningService.getInsuffSearch(false, statusId, levelId, this.userData.userId,
      this.userData.teamName, InsuffStatus, this.userData);

    if (!needsCloseList) {
      search$.subscribe(res => {
        if (res) {
          const respBody = res.body;
          respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
          this.insuffList = respBody;
          this.insuffSearchList = respBody;
          this.insuffStatusListExport = this.insuffList;
          this.insuffStatusListExport.forEach((ele, i) => { ele.sno = i + 1; });
          this.common.exportToExcel(insuffColumn, this.insuffStatusListExport, 'Insufficiency List', true);
        }
      });
    } else {
      forkJoin([search$, this.screeningService.GetDetailsForAutomationInsuff(this.userData)]).subscribe(([res, resp]) => {
        if (res) {
          const respBody = res.body;
          respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
          this.insuffList = respBody;
          this.insuffSearchList = respBody;
        }
        if (resp) {
          this.insuffCloseList = resp.body;
        }
        const data = needsCloseList ? this.insuffCloseList : this.insuffList;
        this.insuffStatusListExport = data;
        this.insuffStatusListExport.forEach((ele, i) => { ele.sno = i + 1; });
        this.common.exportToExcel(insuffColumn, this.insuffStatusListExport, 'Insufficiency List', true);
      });
    }
  }

  GetBulkFormdata() {
    this.shievePageNo = 1;
    let statusId = this.insufficiencyFormGroup.controls.statusId.value;
    let levelId = this.insufficiencyFormGroup.controls.levelId.value;
    statusId = statusId === 'null' ? 0 : statusId;
    levelId = levelId === 'null' || levelId === '' ? 0 : levelId;

    this.userData.applyPaging = false;
    this.userData.filter = '';
    this.screeningService.getInsuffSearch(false, statusId, levelId, this.userData.userId,
      this.userData.teamName, null, this.userData).subscribe(res => {
        if (res) {
          const respBody = res.body;
          respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
          this.insuffSearchList = respBody;
          this.getBulkData();
        }
      });

  }

}

// class InsuffSearch {
//   clientRefNo: string;
//   candidateName: string;
//   screeningCompId: number;
//   componentId: number;
//   componentName: string;
//   functionalEntity: string;
//   candidateFName: string;
//   candidateLName: string;
//   candidateMName: string;
//   insuffDocument: ScreeningDocument[] = [];
//   insuffDetails: searchStatus[] = [];
//   insuffStatus: string;
//   insuffDays: number;
//   insuffLevel: string;
//   insuffRaisedBy: string;
//   remarks: string;
//   queue: boolean;
//   statusLookupId: number;
// }
class SearchStatus {
  statusLookupId: number;
  levelLookupId: number;
  insuffStatus: string;
  automationFlag?: boolean;
  insuffLevel: string;
  insuffDays: number;
  insuffRaisedBy: string;
  insuffReqType: string;
  requiredLookupId: number;
  raisedDate: Date;
  clearedDate: Date;
  ceaInitiationDate: Date;
  candidateName: string;
  candidateFName: string;
  candidateLName: string;
  candidateMName: string;
  clientRefNo: string;
  clientName: string;
  componentName: string;
  subCompName: string;
  screeningCompId: number;
  insufficiencyId: number;
  insuffDocument: ScreeningDocument[] = [];
  doc: any[] = [];
  remarks: string;
  queue: boolean;
}
// class Insufficiency {
//   insufficiencyId: number;
//   screeningStatusId: number;
//   screeningCompId: number;
//   levelLookupId: number;
//   requiredLookupId: number;
//   raisedDate: Date;
//   clearedDate: Date;
//   insuffDetail: InsuffDetail;
//   insuffDocument: InsuffSearch[] = [];
//   createdUserId: number;
// }
class InsuffDetail {
  insuffDetailId: number;
  insufficiencyId: number;
  insuffDate?: Date;
  comments: string;
  createdUserId: number;
}
class ClearInsuff {
  insufficiencyId: number;
  statusLookupId: number;
  clearedDate: Date;
  ceaInitiationDate: Date;
  insuffDetail: InsuffDetail;
  insuffDocument: ScreeningDocument[] = [];
  createdUserId: number;
  insuffDocumentIds: number[] = [];
  verifierQueue: boolean;
  applicationId: number;
}
class ScreeningDocument {
  screeningDocId: number;
  fileName: string;
  filePath: string;
  docTypeId?: number;
  docTypeName: string;
  docSubTypeId: number;
  insuffDocTransId: number;
  infoReqFlag: boolean;
  document1;
}
