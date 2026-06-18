import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AutoCompleteDropDown } from '../../common-methods/models/autoComplete';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { MessageService } from 'primeng/api';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-allcases',
  templateUrl: './allcases.component.html',
  styleUrls: ['./allcases.component.css']
})
export class AllcasesComponent implements OnInit {
  isExport: boolean = false;
  isShowAll: boolean = false;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  caseHistoryVm = new AllCaseHistoryVm();
  searchValueArr: any[] = [];
  searchList: any[] = [];
  candidateControl!: AutoCompleteDropDown;
  candidateList: any[] = [];
  clientControl!: AutoCompleteDropDown;
  statusControl!: AutoCompleteDropDown;
  casePriorityControl!: AutoCompleteDropDown;
  clientRefNoCtrl!: AutoCompleteDropDown;
  clientList: any[] = [];
  statusList: any[] = [];
  casePriorityList: any[] = [];
  caseRefList: any[] = [];
  allcaseSearchForm: UntypedFormGroup;
  routePath = 'Reports / Report Tracker / All Cases History';
  allCaseList: any[] = [];
  allCaseListExport: any[] = [];
  itemPerPage = 10;
  page = 1;
  count = 10;
  isDesc: boolean;
  column: any;
  direction: number;
  userData: any;
  screenAuth: any = {};
  constructor(private message: MessageService, public master: MasterService,
    public dialog: MatDialog, public common: CommonService, public invoiceService: InvoiceService , private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initDefaultData();
    this.caseHistoryVm.applicationId = this.userData.applicationId;
    this.caseHistoryVm.teamName = this.userData.teamName;
    this.caseHistoryVm.clientids = this.userData.clientId
    this.initFormGroup();
    this.getCaseHistory();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  searchcase() {
    if (this.allcaseSearchForm.valid) {

      this.caseHistoryVm.clientId = this.allcaseSearchForm.get('clientName')?.value ?
        this.allcaseSearchForm.controls.clientName.value.map(m => m.clientId) : [];
      //this.caseHistoryVm.clientRefNo= this.allcaseSearchForm.get('clientReferenceNo')?.value
      //this.caseHistoryVm.candidateId = this.allcaseSearchForm.get('candidateFirstName')?.value
      this.caseHistoryVm.statusId = this.allcaseSearchForm.get('status')?.value ? this.allcaseSearchForm.get('status')?.value : 0;

      this.caseHistoryVm.priorityId = this.allcaseSearchForm.get('casePriority')?.value ? this.allcaseSearchForm.get('casePriority')?.value : 0;
      this.allCaseList = [];
      this.allCaseListExport = [];
      this.getCaseHistory();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Please Fill Required Fields.');
    }

  }
  search() {
    if (this.allcaseSearchForm.value.clientName || this.allcaseSearchForm.value.status
      || this.allcaseSearchForm.value.casePriority) {
      this.userData.filters = '';
      this.getCaseHistory();
    } else {
      this.showTopCenter('warn', 'Failure Message', 'Choose filter values to search');
    }
  }
  shievePagination(event: any) {
    this.shievePageNo = event;
    this.getCaseHistory();
  }
  navigatePage(event: any) {
    this.shievePageNo = event;
    this.getCaseHistory();
  }
  preventInfinite(value: any) {
    if (!this.itemPerPage) {
      this.itemPerPage = 1;
    }
    this.shievePageSize = value;
    this.getCaseHistory();

  }
  shieveShowall() {
    if (this.shieveTotalCount > 0) {
      this.isShowAll = true;
      this.openDialog();
    }
  }
  openDialog() {
    const popupData = {
      action: this.common.SHOWALL,
      headerText: 'This will take extra time',
      bodyText: 'Are you sure want to show all records?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '330px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.buttonName == 'ok') {
            this.shievePageSize = this.shieveTotalCount;
            this.getCaseHistory();
          }
          // const action = String(result.type);
          // if (action === this.common.DELETECONFIRMATION) {
          //   this.deleteClientMail(this.data);
          // }
        }
      });
    }
  }
  reset() {
    this.searchValueArr = [];
    this.allcaseSearchForm.reset();
    this.userData.filters = "";
    this.shievePageNo = 1;
    this.shievePageSize = 10;
    this.isShowAll = false;
    this.getCaseHistory();
  }
  resetForm() {
    this.allcaseSearchForm.reset();
    this.allcaseSearchForm.markAsPristine();
    this.initFormGroup();
    this.caseHistoryVm.clientId = [];
    this.caseHistoryVm.clientRefNo = '';
    this.caseHistoryVm.candidateId = 0;
    this.caseHistoryVm.statusId = 0;
    this.caseHistoryVm.priorityId = 0;
    this.caseHistoryVm.needTotal = true;
    this.allCaseList = [];
    this.allCaseListExport = [];
    this.getCaseHistory();
  }
  getCaseHistory() {
    if (this.isExport) {
      this.caseHistoryVm.applyPaging = false;
      this.caseHistoryVm.needTotal = false;
    } else {
      this.allCaseList = [];
      this.applyPagination();
    }
    this.master.getAllCaseHistory(this.caseHistoryVm, this.isExport, this.isShowAll).subscribe(response => {
      // if (response) {
      this.shieveTotalCount = response.headers.get('X-Total-Count');
      this.allCaseList = response.body;
      this.allCaseList.forEach(element => {
        element.candidateFirstName = element.candidateFirstName ? (element.candidateFirstName + (element.candidateMiddleName ? (' '
          + element.candidateMiddleName) : '') + (element.candidateLastName ? (' ' + element.candidateLastName) : '')) : 'N/A';
      });
      this.searchList = this.allCaseList;
      if (this.isExport) {
        const column = [{ field: 'candidateFirstName', header: 'Candidate Name' }, { field: 'clientName', header: 'Client Name' },
        { field: 'clientReferenceNo', header: 'Client Reference No' }, { field: 'siteName', header: 'Site Name' },
        { field: 'applicantId', header: 'Applicant Id' }, { field: 'chargeCode', header: 'Charge Code' }, { field: 'userName', header: 'Created By' },
        { field: 'caseReceivedDate', header: 'Case Received Date' }, { field: 'caseInititationDate', header: 'Case Inititation Date' },
        { field: 'status', header: 'Case Status' }, { field: 'casePriority', header: 'Case Priority' },
        { field: 'colorCode', header: 'Color Code' }, { field: 'closedDate', header: 'Report Sent Date & Time' }];
        this.common.exportToExcel(column, this.allCaseList, 'All Cases');
      }
      // }
    })




  }
  showall() {
    this.itemPerPage = this.searchList.length;
  }
  getcount(count: any) {
    this.count = count;
    return '';
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
    this.getCaseHistory();
  }
  getPage(event: any) {
    this.page = event;
    this.getCaseHistory();
  }
  applyPagination() {
    let filter = this.userData.filters;
    if (this.allcaseSearchForm.value.clientName && this.allcaseSearchForm.get('clientName')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'clientId@=' + this.allcaseSearchForm.controls.clientName.value.map(m => m.clientId);
    }
    if (this.allcaseSearchForm.value.status && this.allcaseSearchForm.get('status')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'statusId@=' + this.allcaseSearchForm.value.status;
    }
    if (this.allcaseSearchForm.value.casePriority && this.allcaseSearchForm.get('casePriority')?.valid) {
      filter = ((filter && filter.length > 0) ? (filter + ',') : '') + 'priorityId@=' + this.allcaseSearchForm.value.casePriority
    }
    this.caseHistoryVm.pageSize = this.shievePageSize;
    this.caseHistoryVm.page = this.shievePageNo;
    this.caseHistoryVm.filters = filter ? filter : '';
    let sort = this.column;
    this.caseHistoryVm.sorts = this.direction ? this.direction == -1 ? '-' + sort : sort : '';
    this.caseHistoryVm.applyPaging = true;
    this.caseHistoryVm.needTotal = true;
  }
  initFormGroup() {
    this.allcaseSearchForm = new UntypedFormGroup({
      clientName: new UntypedFormControl([], Validators.required),
      status: new UntypedFormControl(null),
      casePriority: new UntypedFormControl(null),
      clientReferenceNo: new UntypedFormControl(null),
      candidateFirstName: new UntypedFormControl(null),
    });
    this.initautoCompleteCtrl();
  }
  initautoCompleteCtrl() {
    // this.clientRefNoCtrl = new AutoCompleteDropDown('Client Reference No', 'clientReferenceNo', 'clientReferenceNo', 'clientReferenceNo', this.caseRefList,
    //   '', this.allcaseSearchForm, false, false, false, 'standard');
    this.clientControl = new AutoCompleteDropDown('Client Name', 'clientName', 'clientId', 'clientName', this.clientList,
      '', this.allcaseSearchForm, false, false, false, 'standard');
    // this.candidateControl = new AutoCompleteDropDown('Candidate Name', 'candidateFirstName', 'candidateFirstName', 'candidateFirstName', this.candidateList,
    //   '', this.allcaseSearchForm, false, false, false, 'standard');
    this.casePriorityControl = new AutoCompleteDropDown('Case Priority', 'casePriority', 'lookUpId', 'lookUpName', this.casePriorityList,
      '', this.allcaseSearchForm, false, false, false, 'standard');
    this.statusControl = new AutoCompleteDropDown('Case Status', 'status', 'lookUpId', 'lookUpName', this.statusList,
      '', this.allcaseSearchForm, false, false, false, 'standard');
  }

  initDefaultData() {

    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      if (res) {
        this.clientList = res;
        this.initautoCompleteCtrl();
      }
    });
    this.invoiceService.getCaseStatus().subscribe(res => {
      if (res) {
        this.statusList = res;
        this.initautoCompleteCtrl();
      }
    });
    this.invoiceService.getCasePriority().subscribe(res => {
      if (res) {
        this.casePriorityList = res;
        this.initautoCompleteCtrl();
      }
    });


  }

  // autocompleteData() {
  //   this.casePriorityList = Array.from(new Map
  //     (this.allCaseList.filter(y => y.casePriority).map(x => ({ casePriority: x.casePriority }))
  //       .map(e => [e.casePriority, e])).values());
  //   this.statusList = Array.from(new Map
  //     (this.allCaseList.filter(y => y.status).map(x => ({ status: x.status }))
  //       .map(e => [e.status, e])).values());
  //   this.clientList = Array.from(new Map
  //     (this.allCaseList.map(x => ({ clientName: x.clientName }))
  //       .map(e => [e.clientName, e])).values());
  //   this.caseRefList = Array.from(new Map
  //     (this.allCaseList.map(x => ({ clientReferenceNo: x.clientReferenceNo }))
  //       .map(e => [e.clientReferenceNo, e])).values());
  //   this.candidateList = Array.from(new Map
  //     (this.allCaseList.map(x => ({ candidateFirstName: x.candidateFirstName.toString() }))
  //       .map(e => [e.candidateFirstName.toString(), e])).values());
  //   this.initautoCompleteCtrl();
  // }
  getPropertyValue(event: any) {
    if (event.value !== '' && event.value !== null) {
      // console.log(this.searchValueArr)
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
      for (const ctrl in this.allcaseSearchForm.controls) {
        if (ctrl === event.propertyName) {
          const index = this.searchValueArr.findIndex(x => x.propertyName === ctrl);
          if (index > -1) {
            this.searchValueArr.splice(index, 1);
          }
        }
      }
    }
  }
  exportExcel() {
    this.isExport = true;
    this.shievePageNo = 1;
    this.shievePageSize = this.shieveTotalCount;
    this.getCaseHistory();
  }
}

export class AllCaseHistoryVm {
  clientids: any;
  clientId: any[] = [];
  clientRefNo: string;
  candidateId: number;
  priorityId: number;
  statusId: number;
  applicationId: number;
  teamName: string;

  pageSize: number;
  page: number;
  filters: string;
  sorts: string;
  applyPaging: any;
  needTotal: any;
}