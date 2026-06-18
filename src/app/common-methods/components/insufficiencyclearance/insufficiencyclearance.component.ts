import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ScreeningService } from '../../services/screening.service';
import { AutoCompleteDropDown } from '../../models/autoComplete';

import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-insufficiencyclearance',
  templateUrl: './insufficiencyclearance.component.html',
  styleUrls: ['./insufficiencyclearance.component.css']

})
export class InsufficiencyclearanceComponent implements OnInit {
  state: string = 'default';
  url: any;
  pageno: number;
  SearchCriFilter = false;
  insufficiencyFormGroup: UntypedFormGroup;
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
  @ViewChild('bulkDocument') bulkDocument!: TemplateRef<any>;
  @ViewChild('tab') tab!: MatTabGroup;
  @ViewChild('global') global!: ElementRef;

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
    { field: 'screeningCompId', header: 'Verification Id /Screening ID' },
    { field: 'remarks', header: 'Clearance Remarks' },
    { field: 'action', header: 'Upload Documents / View' },
    { field: 'queue', header: 'Verifier Queue' },
    { field: 'status', header: 'Insufficiency Status' },
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
  page;
  pageSize = 5;
  totalSize = 0;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  clientNameControl!: AutoCompleteDropDown;
  refNoControl!: AutoCompleteDropDown;
  verificationIdControl!: AutoCompleteDropDown;
  candidateNameControl!: AutoCompleteDropDown;
  refNoList: any[] = [];
  verificationList: any[] = [];
  candidateNameList: any[] = [];
  clearedDate = new Date(); insRemarks: any; statusLookupId: any; verifierQueue = false;



  insuffList: any[] = [];
  insuffStatusList: any;
  insuffStatusExList: any;
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
  insuffClientName: [];
  insuffClientRefNo: [];
  insuffVerificationId: [];
  insuffCandidateName: [];
  insuffLevel: [];
  screenAuth: any = {};
  applypaging = true;
  constructor(private sanitizer: DomSanitizer, private route: Router, public common: CommonService, private formBuilder: UntypedFormBuilder,
    public screeningService: ScreeningService, private messageService: MessageService, public dialog: MatDialog, private auth: AuthService) { }

  ngOnInit() {
    this.screenAuth = this.auth.getScreenAuth(this.route.url);
    this.initFormGroup();
    this.itemPerPage = 10;
    this.page = 1;
    this.getInsuffDetails();
    this.searchInsufficiencyList();



  }

  initFormGroup() {
    this.insufficiencyFormGroup = new UntypedFormGroup({
      clientRefNo: new UntypedFormControl(),
      clientName: new UntypedFormControl(),
      statusId: new UntypedFormControl(),
      candidateName: new UntypedFormControl(),
      levelId: new UntypedFormControl(),
      verificationId: new UntypedFormControl(),
      screeningCompId: new UntypedFormControl()
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    this.refNoControl = new AutoCompleteDropDown('Client Reference Number', 'clientRefNo', 'name', 'name', this.insuffClientRefNo,
      '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.clientNameControl = new AutoCompleteDropDown('Client Name', 'clientName', 'id', 'name', this.insuffClientName,
      '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.verificationIdControl = new AutoCompleteDropDown('Screening Id / Verification Id', 'screeningCompId', 'name',
      'name', this.insuffVerificationId, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.candidateNameControl = new AutoCompleteDropDown('Candidate Name', 'candidateName', 'id', 'name',
      this.insuffCandidateName, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.statusControls = new AutoCompleteDropDown('Status', 'statusId', 'id', 'name',
      this.insuffLevel, '', this.insufficiencyFormGroup, false, false, false, 'standard');
    this.levelControls = new AutoCompleteDropDown('Level', 'levelId', 'id', 'name',
      this.insuffLevel, '', this.insufficiencyFormGroup, false, false, false, 'standard');
  }
  searchInsufficiencyList() {
    //let clientRefNo = this.insufficiencyFormGroup.controls.clientRefNo.value;
    let statusId = this.insufficiencyFormGroup.controls.statusId.value;
    //let candidateName = this.insufficiencyFormGroup.controls.candidateName.value;
    let levelId = this.insufficiencyFormGroup.controls.levelId.value;
    //let verificationId = this.insufficiencyFormGroup.controls.verificationId.value;
    //clientRefNo = clientRefNo === 'null' ? '' : clientRefNo;
    statusId = statusId === 'null' ? 0 : statusId;
    //candidateName = candidateName === 'null' ? '' : candidateName;
    levelId = levelId === 'null' || levelId === '' ? 0 : levelId;
    //verificationId = verificationId === 'null' || levelId === '' ? 0 : verificationId;
    this.applyPagination();
    this.screeningService.getInsuffSearch(true, statusId, levelId, this.userData.userId,
      this.userData.teamName, null, this.userData).subscribe(res => {
        if (res) {
          this.shieveTotalCount = res.headers.get('X-Total-Count');
          const respBody = res.body;
          respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
          this.insuffStatusList = respBody;
          this.count = 0;
          this.autocompleteData();
          this.screeningService.GetDetailsForAutomationInsuff(this.userData).subscribe(resp => {
            if (resp) {
              const respBody1 = resp.body;
              this.insuffCloseList = respBody1;
              this.toolTip = '';
              this.rejectFlag = false;
              this.screeningService.GetInsuffDropdownDetails(true, statusId, levelId, this.userData.userId,
                this.userData.teamName, null).subscribe(res => {
                  if (res) {
                    this.insuffClientName = res.clientName;
                    this.insuffClientRefNo = res.clientRefID;
                    this.insuffVerificationId = res.verifcationId;
                    this.insuffCandidateName = res.candidateName;
                    this.insuffLevel = res.level;
                    this.initautoCompleteCtrl();
                  }
                });
            }
          });
        }
      });
    this.applypaging = true;
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
    }
    this.userData.pageSize = this.shievePageSize;
    this.userData.page = this.shievePageNo;
    this.userData.filters = filter ? filter : '';
    let sort = this.column;
    this.userData.sorts = this.direction ? this.direction == -1 ? '-' + sort : sort : '';
    this.userData.applyPaging = this.applypaging;
    this.userData.needTotal = true;
  }
  ngOnDestroy() {
    this.common.fullyClearTab = undefined;
    this.applypaging = true;
  }
  getDate() {
    return new Date();
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.searchInsufficiencyList();
    //this.getCaseHistory();
  }
  preventInfinite(value: any) {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
    this.shievePageSize = value;
    this.searchInsufficiencyList();

  }
  OnPageChange() {
    this.searchInsufficiencyList();
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

        } else if (this.userData.applicationId === 1) {
          this.statusList = res.insuffStatus.filter(x => x.lookUpName !== this.common.Submitted);

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


  getInsuffDocument(insufficiencyId, data = null) {
    this.screeningService.GetClearInsuffDocument(insufficiencyId).subscribe(res => {
      this.documentList = res;
      if (data) {
        data.doc = res;
      }
    });
  }

  resetForm() {
    this.insufficiencyDocShow = false;
    this.insufficiencyFormGroup.reset();
    this.insufficiencyFormGroup.markAsPristine();
    this.insufficiencyFormGroup.markAllAsTouched();
  }

  getLookUpName(id): string {
    if (id > 0 && this.statusList.length > 0) {
      return this.statusList.find(x => x.lookUpId === id).lookUpName.toLowerCase();
    }
  }
  clearInsufficiency() {
    this.searchValueArr = [];
    this.insufficiencyFormGroup.reset();
    this.statusMultiList = [];
    // this.insufficiencyFormGroup.controls['statusId'].setValue(this.common.RAISED);
    this.searchInsufficiencyList();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
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
    this.searchInsufficiencyList();
  }
  removeSearchValue(key, index) {
    this.searchValueArr.splice(index, 1);
    for (const ctrl in this.insufficiencyFormGroup.controls) {
      if (ctrl === key) {
        this.insufficiencyFormGroup.get(ctrl).setValue('');
      }
    }
    this.searchInsufficiencyList();
  }
  getPage(event: any) {
    this.page = event;
  }
  getTotalPage(): number {
    if (this.insuffStatusList.length) {
      return Math.ceil(this.insuffStatusList.length / this.itemPerPage);
    }
  }
  showall() {
    // if (this.insuffStatusList.length > 0) {
    //   this.itemPerPage = this.insuffStatusList.length;
    // }
    if (this.shieveTotalCount > 0) {
      //this.shievePageSize = this.shieveTotalCount;
      this.applypaging = false;
      this.searchInsufficiencyList();
    }
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  back() {
    this.route.navigate(['dashboard/home']);
  }

  allowSameFileUpload(event: any): void {
    event.srcElement.value = '';
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

  exportAsExcelFile() {
    //let clientRefNo = this.insufficiencyFormGroup.controls.clientRefNo.value;
    let statusId = this.insufficiencyFormGroup.controls.statusId.value;
    //let candidateName = this.insufficiencyFormGroup.controls.candidateName.value;
    let levelId = this.insufficiencyFormGroup.controls.levelId.value;
    //let verificationId = this.insufficiencyFormGroup.controls.verificationId.value;
    //clientRefNo = clientRefNo === 'null' ? '' : clientRefNo;
    statusId = statusId === 'null' ? 0 : statusId;
    //candidateName = candidateName === 'null' ? '' : candidateName;
    levelId = levelId === 'null' || levelId === '' ? 0 : levelId;
    //verificationId = verificationId === 'null' || levelId === '' ? 0 : verificationId;
    this.applyPagination();
    this.userData.applyPaging = false;
    this.screeningService.getInsuffSearch(true, statusId, levelId, this.userData.userId,
      this.userData.teamName, null, this.userData).subscribe(res => {
        if (res) {

          const respBody = res.body;
          respBody.forEach(m => { m.screeningCompId = 'ACG' + m.screeningCompId; });
          this.insuffStatusExList = respBody;
          this.insuffStatusExList.forEach((ele, i) => {
            ele.sno = i + 1;
          })
          const insuffColumn = [
            { field: 'sno', header: 'S No' },
            { field: 'candidateName', header: 'Candidate Name' },
            { field: 'clientName', header: 'Client Name' },
            { field: 'siteName', header: 'Site Name' },
            { field: 'clientRefNo', header: 'Client Reference No' },
            { field: 'screeningCompId', header: 'Verification Id' },
            { field: 'componentName', header: 'Component Name' },
            { field: 'screeningStatus', header: 'Screening Status' },
            { field: 'insuffStatus', header: 'Insuff Status' },
            { field: 'insuffLevel', header: 'Insuff Level' },
            { field: 'insuffRaisedBy', header: 'Insuff Raised By' },
            { field: 'functionalEntity', header: 'Functional Entity' },
            { field: 'raisedDate', header: 'Raised Date & Time' },
            { field: 'clearedDate', header: 'Cleared Date & Time' }];
          this.common.exportToExcel(insuffColumn, this.insuffStatusExList, 'Insufficiency Fully Cleared List', true);

        }
      });
  }
}


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

