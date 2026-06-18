import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { DataTable, LazyLoadEvent } from 'primeng/primeng';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from 'src/app/common-methods/services/screening.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';
import moment from 'moment';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { UserData } from 'src/app/common-methods/models/user';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
// import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-casehistory',
  templateUrl: './casehistory.component.html',
  styleUrls: ['./casehistory.component.css']
})
export class CasehistoryComponent implements OnInit {
  itemperpage;
  // @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
// @ViewChild('global') global!: ElementRef;
@ViewChild('global', { static: true }) global!: ElementRef;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  btnExcelExport = true;
  routePath = 'Screening / Clients Case Creation / Case History';
  caseHistoryList: any[] = [];
  caseHistoryExcelList: any[] = [];
  ind: any;
  caseDetail: any[] = [];
  userData :UserData;
  loading: boolean;
  event: LazyLoadEvent;
  searchValue: string = '';
  excelData: any;
  shieveTotalCount = 0;
  shievePageNo = 1;
  shievePageSize = 10;
  ExcelFlag: boolean = false;
  isShowAll: boolean = false;
  displayColumns = [
    { field: 'clientRefNo', header: 'Client Reference Number' },
    { field: 'candidateFullName', header: 'Candidate Name' },
    { field: 'applicantId', header: 'Applicant Id' },
    { field: 'caseReceivedDate', header: 'Received Date & Time' },
    { field: 'caseInitiationDate', header: 'Initiation Date' },
    { field: 'screenName', header: 'Screen Name' },
    // { field: 'updatedDate', header: 'Updated Date' },
    { field: 'updatedUserName', header: 'Created By' },
    { field: 'status', header: 'Case Status' },
    { field: 'colorCode', header: 'Color Code' },
    { field: 'closedDate', header: 'Report Sent Date' },
  ];
  breadcrumbFlags = new BreadcrumbFlags();
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  constructor(public screening: ScreeningService, public router: Router, public common: CommonService , private auth: AuthService,) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    let method = 'GetCaseHistoryDetails';
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    if (this.common.commonHistoryflag === true) {
      this.routePath = 'Screening / Clients Case Creation / Case History';
      // method = 'GetCaseHistoryDetails';
      // this.displayColumns.splice(3, 0, { field: 'caseReceivedDate', header: 'Received Date & Time' });
    } else {
      this.routePath = 'Direct App Case History';
      method = 'GetDirectAppCaseHistoryDetails';
      // this.screening.GetDirectAppCaseHistoryDetails().subscribe(resp => {
      //   if (resp) {
      //     this.caseHistoryList = resp;
      //     this.caseHistoryList.forEach(element => {
      //       const CMname = element.middleName ? element.middleName : '';
      //       const CLname = element.lastName ? element.lastName : '';
      //       element.firstName = element.firstName + ' ' + CMname + ' ' + CLname;
      //       element.screenName = element.invitationflag ? 'Direct App' : element.screenName
      //     });
      //   }
      // });
     // this.itemperpage = 10;
    }
    this.itemperpage = 10;
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    
  }
  getTotalChPages(totalRecords, rows) {
    return Math.ceil((totalRecords) / rows);
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
  showall() {
   
      this.isShowAll = true;
      if(this.common.commonHistoryflag == true){
      this.getCaseHistory();
    
  }else{
    this.getdirectpAppHistory();
  }
  }
  exportAsExcelFile() {
    if(this.common.commonHistoryflag === true){
      this.ExcelFlag = true;     
        this.applyPagination();
        this.screening.GetCaseHistoryDetails(this.userData).subscribe(resp => {
          if (resp) {
            this.caseHistoryExcelList = resp.body;    
            this.ExcelFlag = false;      
            this.common.exportToExcel(this.displayColumns, this.caseHistoryExcelList, 'CaseCreationHistory');
          }
        });
      
    }else{
      this.ExcelFlag = true;     
      this.applyPagination();
      this.screening.GetDirectAppCaseHistoryDetails(this.userData).subscribe(resp => {
        if (resp) {
          this.caseHistoryExcelList = resp.body;    
          this.ExcelFlag = false;      
          this.common.exportToExcel(this.displayColumns, this.caseHistoryExcelList, 'CaseCreationHistory');
        }
      });
    
    }
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
        ele.caseInitiationDate = this.common.getTimezoneOffset(ele.caseInitiationDate, false);
        ele.caseInitiationDate = moment(ele.caseInitiationDate).format("YYYY-MM-DD HH:mm:ss");
        // ele.updatedDate = this.common.getTimezoneOffset(ele.updatedDate, false);
        // ele.updatedDate = moment(ele.updatedDate).format("YYYY-MM-DD HH:mm:ss");
        ele.closedDate = this.common.getTimezoneOffset(ele.closedDate, false);
        ele.closedDate = moment(ele.closedDate).format("YYYY-MM-DD HH:mm:ss");
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
    const fileName = this.common.commonHistoryflag === true ? 'Case Creation History.xls' : 'Direct App Case History.xls';
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
  //pagination added by Megala - 1Aug2024
  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.userData.page = (event.first + event.rows) / 10;
    this.userData.pageSize = 10;
    // const sort = event.sortField == 'candidateName' ? 'candidateFirstName' : event.sortField
    // this.userData.sorts = event.sortOrder == -1 ? "-" + sort : sort;
    this.userData.applyPaging = true;
    this.userData.needTotal = true;
    if (Object.keys(event.filters).length > 0 || event.sortField || this.userData.page) {
      if (this.common.commonHistoryflag === true) {
      this.getCaseHistory()
      }else{
        this.getdirectpAppHistory();
      }
        }
  }
  getdirectpAppHistory(){
    this.applyPagination();
    this.screening.GetDirectAppCaseHistoryDetails(this.userData).subscribe(resp => {
      if (resp) {
        this.caseHistoryList = resp.body;
        this.totalpages = resp.headers.get('X-Total-Count');
        this.loading = false;
      }
    });
  }
getCaseHistory(){
  this.applyPagination();
  this.screening.GetCaseHistoryDetails(this.userData).subscribe(resp => {
    if (resp) {
      this.caseHistoryList = resp.body;
      this.totalpages = resp.headers.get('X-Total-Count');
      this.loading = false;
    }
  }); 
}
applyPagination() {

  this.userData.pageSize = this.ExcelFlag === true ? Number(this.shieveTotalCount) : this.shievePageSize;
  this.userData.page = this.userData.page > 0 ? this.userData.page : this.shievePageNo;
  this.userData.needTotal = true;
  if(this.ExcelFlag === true || this.isShowAll === true){
    this.userData.filters =  '';
    this.userData.applyPaging =  false ;
  }else{    
    this.userData.applyPaging =  true;
  }
  

}
globalSearch(searchvalue: any) {
  this.userData.needTotal = true;
  this.userData.filters = searchvalue ? "(clientRefNo|candidateFullName|applicantId|screenName|updatedUserName|status|colorCode)@=" + searchvalue : '';
  this.userData.page = 1;
  if(this.common.commonHistoryflag == true){
    this.getCaseHistory();
  }else{
    this.getdirectpAppHistory();
  }
  
}

  resetTable() {
    this.userData.filters = '';
    this.itemperpage = 10;    
    this.searchValue = '';
    this.ExcelFlag = false;
    this.isShowAll = false;
    this.global.nativeElement.value = '';
    this.userData.page = 1;
    this.userData.pageSize = 10;
    this.userData.needTotal = true;
    if (this.dt) {
    this.dt.reset();
    


      this.global.nativeElement.value = '';
    }
  }
}
