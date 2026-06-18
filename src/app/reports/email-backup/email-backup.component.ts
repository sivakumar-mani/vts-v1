import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ReportService } from 'src/app/common-methods/services/report.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
// import { LazyLoadEvent,  } from 'primeng/primeng';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { EmailHistorySearchVm } from 'src/app/common-methods/models/verification';
@Component({
  standalone: false,
  selector: 'app-email-backup',
  templateUrl: './email-backup.component.html',
  styleUrls: ['./email-backup.component.css']
})
export class EmailBackupComponent implements OnInit {
  //Apply Pagination by Megala (09/10/2023)
  event: LazyLoadEvent;
  loading: boolean;
  itemperpage;
  isShowAll: boolean = false;
  isExport: boolean = false;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  screenAuth: any = {};
  userData: any;
  routePath = 'Reports / Report Tracker / Email History Report';
  selectRowData: any;
  maxDate = new Date();
  fromdate = new UntypedFormControl();
  todate = new UntypedFormControl();
  emailHistorySearchVm = new EmailHistorySearchVm();
 @ViewChild('dtHistory', { static: true }) dtHistory!: Table;
  @ViewChild('viewMailContent', { static: true }) viewMailContent: any;
  @ViewChild('emailTemplate', { static: true }) emailTemplate: HTMLElement;
  @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  emailHistorycols = [
    // { field: 'S.No', header: 'S.No' },
    // { field: 'View', header: 'VIEW' },
    { field: 'categoryName', header: 'TYPE' },
    // { field: 'fromMail', header: 'FROM MAIL' },
    // { field: 'toMail', header: 'TO MAIL' },
    // { field: 'ccMail', header: 'CC MAIL' },
    // { field: 'bccMail', header: 'BCC MAIL' },
    { field: 'mailSubject', header: 'SUBJECT' },
    { field: 'senderName', header: 'SENDER NAME' }
  ];
  emailHistorylist: any[] = [];
  searchValue: string = '';
  frozenCols = [
    { field: 'View', header: 'VIEW' }];
  constructor(public master: MasterService, public auth: AuthService, private authService: AuthService,
    private common: CommonService, public router: Router, public dialog: MatDialog, private reportService: ReportService) {
  }
  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = this.auth.userdata;
    this.fromdate.setValue(new Date());
    this.todate.setValue(new Date());
    this.getEmailCategory();
    this.getMailHistoryReportList();
    this.itemperpage = 10;
  }
  LoadEmailHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.userData.filters = '';
    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    const sort = event.sortField;
    this.userData.sorts = sort ? (event.sortOrder == -1 ? '-' : '') + sort : '';
    if (event.sortField) {
      this.currentPage = 1;
      this.getMailHistoryReportList();
    }

  }
  resetfrom() {
    this.fromdate.setValue(new Date());
    this.todate.setValue(new Date());
    this.totalpages = 0;
    this.emailHistorylist = [];
    this.userData.filter = "";

  }
  tableReset() {
    this.dtHistory.reset();
    this.global.nativeElement.value = '';
  }
  searchValues() {
    this.getMailHistoryReportList();
  }
  getEmailCategory() {
    this.reportService.getEmailCategory().subscribe(resp => { this.getEmailCategory = resp; });
  }
  getMailHistoryReportList() {
    this.emailHistorySearchVm.fromDate = this.fromdate.value;
    this.emailHistorySearchVm.toDate = this.todate.value;
    let userDetails = this.userData;
    if (this.isExport || this.isShowAll) {
      userDetails.applyPaging = false;
    } else {
      userDetails.applyPaging = true;
      userDetails.pageSize = this.shievePageSize;
      userDetails.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
      userDetails.needTotal = true;
    }
    this.emailHistorySearchVm.loginUserDetVm = this.userData;
    this.reportService.getMailHistoryReport(this.emailHistorySearchVm).subscribe(resp => {
      // resp.forEach(element => {
      //   element.senderName = element.senderFirstName + ' ' + element.senderMiddleName ? element.senderMiddleName : ''
      //     + ' ' + element.senderLastName ? element.senderLastName : '';
      // });
      this.totalpages = resp.headers.get('X-Total-Count');
      this.emailHistorylist = resp.body;
      this.emailHistorylist.map(m => m.senderName = (m.senderFirstName ? m.senderFirstName : '') +
        ' ' + (m.senderMiddleName ? m.senderMiddleName : '')
        + ' ' + (m.senderLastName ? m.senderLastName : ''));
      this.currentPage = 1;
      // console.log(' this.emailHistorylist', this.emailHistorylist);
    });
  }
  globalSearch(searchvalue: any) {
    this.userData.needTotal = true;
    this.userData.filters = searchvalue ? "(senderFirstName|senderMiddleName|senderLastName|mailSubject|categoryName)@=" + searchvalue : '';
    this.userData.page = 1;
    this.getMailHistoryReportList();
  }
  viewEmailContent(rowData: any) {
    const data = this.common.CloneObject(rowData.toMail);

    this.selectRowData = data ? this.common.CloneObject(rowData) : [];
    const tomail = data.split(',');
    this.selectRowData.toMail = tomail;
    this.openDialog();
  }
  openDialog() {
    const dialogRef = this.dialog.open(this.viewMailContent, {
      width: '800px',
      height: '600px',
    });
    if (dialogRef) {
      dialogRef.afterOpened().subscribe(result => {
        this.emailTemplate.innerHTML = this.selectRowData.mailBody;
      });
    }
  }
  dialogClose() {
    this.dialog.closeAll();
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }

  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dtHistory.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  getTotalPages(totalRecords, rows) {
    // this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  showall() {
    if (this.emailHistorylist.length > 0) {
      this.itemperpage = this.emailHistorylist.length;
    }
  }
}
