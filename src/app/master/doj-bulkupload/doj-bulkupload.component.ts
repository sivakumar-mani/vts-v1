import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
@Component({
  standalone: false,
  selector: 'app-doj-bulkupload',
  templateUrl: './doj-bulkupload.component.html',
  styleUrls: ['./doj-bulkupload.component.css']
})
export class DojBulkuploadComponent implements OnInit {
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  displayedColumns = [
    { field: 'candidtateName', header: 'Candidate Name' },
    { field: 'applicantId', header: 'Applicant ID' },
    { field: 'referenceNo', header: 'Client Ref No' },
    { field: 'recruiterName', header: 'Recruiter Name' },
    { field: 'spocName', header: 'BV SPOC Name' },
    { field: 'dateOfJoin', header: 'TechM Date of Joining' },
    { field: 'currentEmployment', header: 'Current Employment' },
    { field: 'status', header: 'Status' }
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  pendingList: any[] = [];
  constructor(public common: CommonService, private master: MasterService, private message: MessageService,
    // tslint:disable-next-line: align
    public dialog: MatDialog, private authservice: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.GetDOJLapsedCandidatePendingList();
  }
  GetDOJLapsedCandidatePendingList() {
    this.master.GetDOJLapsedCandidatePendingList().subscribe(res => {
      if (res) {
        this.pendingList = res;
        this.pendingList.forEach(element => {
          element.candidtateName = (element.candidtateName.firstName + (element.candidtateName.middleName ? (' ' + element.
          candidtateName.middleName) : '') + (element.candidtateName.lastName ? (' ' + element.candidtateName.lastName) : ''));
        });
      }
    });
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }
  close() {
    this.breadcrumbFlags.btnAddUpload = !this.breadcrumbFlags.btnAddUpload;
    this.GetDOJLapsedCandidatePendingList();
  }
  exportExcelFile() {
    this.common.exportToExcel(this.displayedColumns, this.pendingList, 'Pending');
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
}
