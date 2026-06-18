import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import moment from 'moment';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-stop-check',
  templateUrl: './stop-check.component.html',
  styleUrls: ['./stop-check.component.css']
})
export class StopCheckComponent implements OnInit {
  itemperpage:any;
  routePath = 'Screening / Clients Case Creation / Stop Check';
  checkList: any[] = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  btnExcelExport = true;
  breadcrumbFlags = new BreadcrumbFlags();
  displayedColumns = [
    { field: 'candidateFirstName', header: 'Candidate Name' },
    { field: 'clientReferenceNo', header: 'Case Ref no' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'submittedBy', header: 'Submitted By' },
    { field: 'submittedDate', header: 'Submitted Date' },
    { field: 'caseReceivedDate', header: 'Case Received Date And Time', value: true },
    { field: 'caseInititationDate', header: 'Case Initiation Date', value: true }
  ];
  candidateFirstNameFormCtrl = new UntypedFormControl();
  candidateFirstNameFilteredOptions!: Observable<string[]>;
  @ViewChild('candidateFirstNameTrigger', { static: true }) candidateFirstNameTrigger!: MatMenuTrigger;
  clientReferenceNoFormCtrl = new UntypedFormControl();
  clientReferenceNoFilteredOptions!: Observable<string[]>;
  @ViewChild('clientReferenceNoTrigger', { static: true }) clientReferenceNoTrigger!: MatMenuTrigger;
  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions!: Observable<string[]>;
 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;
  siteNameFormCtrl = new UntypedFormControl();
  siteNameFilteredOptions!: Observable<string[]>;
  @ViewChild('siteNameTrigger', { static: true }) siteNameTrigger!: MatMenuTrigger;
  submittedNameFormCtrl = new UntypedFormControl();
  submittedFilteredOptions!: Observable<string[]>;
  @ViewChild('submittedNameTrigger', { static: true }) submittedNameTrigger!: MatMenuTrigger;
  @ViewChild('caseReceivedDateTrigger', { static: true }) caseReceivedDateTrigger!: MatMenuTrigger;
  @ViewChild('caseInititationDateTrigger', { static: true }) caseInititationDateTrigger!: MatMenuTrigger;
  @ViewChild('submittedDateTrigger', { static: true }) submittedDateTrigger!: MatMenuTrigger;
  fromDateTime = '';
  toDateTime = '';
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  userData: any;
  screenAuth: any = {};
  @ViewChild('global', { static: true }) global!: ElementRef;
  filterCheckList: any[] = [];
  constructor(public screening: ScreeningService, public common: CommonService, private dateP: DatePipe, private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.stopCheck();
    this.itemperpage = 10;
  }
  stopCheck() {
    this.screening.GetStopCheckCaseDetails(this.userData).subscribe(res => {
      if (res) {
        this.checkList = res;
        this.checkList.forEach(ele => {
          ele.candidateFirstName = ele.candidateFirstName + ' ' + ele.candidateMiddleName + ' ' +
            ele.candidateLastName;
        });
        this.filterCheckList = this.checkList;
        this.TblAutoFilters();
      }
    });
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
  resetDateTime() {
    this.fromDateTime = '';
    this.toDateTime = '';
    this.checkList = this.filterCheckList;
  }
  getRecordBydateTime(fDateTime, tDateTime, type) {
    this.checkList = this.filterCheckList;
    const FromDateTime = this.dateP.transform(fDateTime, 'yyyy-MM-ddThh:mm');
    const ToDateTime = this.dateP.transform(tDateTime, 'yyyy-MM-ddThh:mm');
    if (type === 'receive') {
      this.checkList.map(d => d.caseReceivedDate = this.dateP.transform(d.caseReceivedDate, 'yyyy-MM-ddThh:mm'));
      this.checkList = this.filterCheckList.filter(x =>
        x.caseReceivedDate >= FromDateTime && x.caseReceivedDate <= ToDateTime);
    } else {
      this.checkList.map(d => d.caseInititationDate = this.dateP.transform(d.caseInititationDate, 'yyyy-MM-ddThh:mm'));
      this.checkList = this.filterCheckList.filter(x =>
        x.caseInititationDate >= FromDateTime && x.caseInititationDate <= ToDateTime);
    }
  }
  private TblAutoFilters(): void {
    this.candidateFirstNameFilteredOptions = this.candidateFirstNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.checkList.map(x => x.candidateFirstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientReferenceNoFilteredOptions = this.clientReferenceNoFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.checkList.map(x => x.clientReferenceNo).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.checkList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.siteNameFilteredOptions = this.siteNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.checkList.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  showall() {
    if (this.checkList.length > 0) {
      this.itemperpage = this.checkList.length;
    }
  }
  exportAsExcelFile() {
    this.common.exportToExcel(this.displayedColumns, this.checkList, 'StopCheck');
  }
  exportAsExcelFile1() {
    // export to excel file
    let tabtext = '<table border="1px">';
    // var textRange;
    let j = 0;
    const header = this.dt.columns;
    const filteredValue = this.dt.filteredValue ? this.dt.filteredValue : this.dt.value; // id of table
    const lines = filteredValue.length;
    let headerColos = '';
    if (filteredValue.length > 0) {
      filteredValue.forEach(ele => {
        ele.caseInititationDate = this.common.getTimezoneOffset(ele.caseInititationDate, false);
        ele.caseInititationDate = moment(ele.caseInititationDate).format("YYYY-MM-DD HH:mm:ss");
        ele.caseReceivedDate = this.common.getTimezoneOffset(ele.caseReceivedDate, false);
        ele.caseReceivedDate = moment(ele.caseReceivedDate).format("YYYY-MM-DD HH:mm:ss");
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
    const fileName = 'StopCheck.xls';
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
  }
  resetTable() {
    if (this.dt) {
      this.dt.reset();
      this.global.nativeElement.value = '';
    }
  }
}
