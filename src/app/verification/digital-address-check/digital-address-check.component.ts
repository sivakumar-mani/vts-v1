import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { VerificationDetails } from 'src/app/common-methods/models/verification';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { VerificationService } from 'src/app/common-methods/services/verification.service';

@Component({
  standalone: false,
  selector: 'app-digital-address-check',
  templateUrl: './digital-address-check.component.html',
  styleUrls: ['./digital-address-check.component.css']
})
export class DigitalAddressCheckComponent implements OnInit {
  itemperpage;
  routePath = 'Verification / Digital Address Check Geo';
  digitaladdresscheckList: any[] = [];

  displayedColumns = [
    { field: 'clientName', header: 'Client Name' },
    { field: 'siteName', header: 'Site Name' },
    { field: 'clientRefNo', header: 'Client Reference No' },
    { field: 'verificationId', header: 'Verification ID' },
    { field: 'candidateName', header: 'Candidate Name' },
    { field: 'screeningOwnerName', header: 'Screening Owner Name' },
    { field: 'primaryMobileNumber', header: 'Primary Mobile Number' },
    { field: 'latitude', header: 'Latitude' },
    { field: 'longitude', header: 'Longitude' },
    // { field: 'distance', header: 'Distance' },
    { field: 'respondentName', header: 'Respondent Name' },
    { field: 'relationshipWithTheCandidate', header: 'Relationship With The Candidate' },
    { field: 'alternativeContactNumber', header: 'Alternative Contact Number' },
    { field: 'address', header: 'Address' },
    { field: 'landMark', header: 'Landmark' },
    { field: 'owershipDetails', header: 'Ownership Details' },
    { field: 'stayFromDate', header: 'Stay From Date' },
    { field: 'stayToDate', header: 'Stay To Date' },
    { field: 'verificationDate', header: 'GPS Created Date' },
    { field: 'verifiedRemarks', header: 'Verified Remarks' },
    //{ field: 'document', header: 'File Name' },
    { field: 'fieldExecutiveName', header: 'Field Executive Name' },
    { field: 'vendorName', header: 'Vendor Name' },
    
    
    
  ];
  candidateFirstNameFormCtrl = new UntypedFormControl();
  candidateFirstNameFilteredOptions: Observable<string[]>;
  @ViewChild('candidateFirstNameTrigger', { static: true }) candidateFirstNameTrigger: MatMenuTrigger;
  clientReferenceNoFormCtrl = new UntypedFormControl();
  clientReferenceNoFilteredOptions: Observable<string[]>;
  @ViewChild('clientReferenceNoTrigger', { static: true }) clientReferenceNoTrigger: MatMenuTrigger;
  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions: Observable<string[]>;
 @ViewChild('clientNameTrigger', { static: true }) 
clientNameTrigger!: MatMenuTrigger;

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  userData: any;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  btnExcelExport = true;
  @ViewChild('global', { static: true }) global!: ElementRef;
  screenAuth: any = {};
  filterCheckList: any[] = [];
  verificationDetails: VerificationDetails = new VerificationDetails();
  constructor(private router: Router, private auth: AuthService ,private verificationService: VerificationService, public common: CommonService, private dateP: DatePipe) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.digitaladdressCheck();
    this.itemperpage = 10;
  }
  digitaladdressCheck() {
    this.verificationService.digitalAddressCheckPVReport(this.userData).subscribe(res => {
      if (res) {
        this.digitaladdresscheckList = res;
      }
    });
  }
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
  downloadFile(data, filename, docId) {
    if (docId > 0) {
      this.verificationService.getDigitalDocument(docId).subscribe(resp => {
        if (resp.document) {
          const sampleArr = this.base64ToArrayBuffer(resp.document);
          this.saveByteArray(filename, sampleArr);
        } else {
          alert('file does not exists');
        }
      });
    } else {
      const blob = new Blob([data.document], { type: 'application/octet-stream' });
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
  }
  moveToVerificationCheck(data: any) {
    this.verificationDetails.screeningCompId = data;
    this.verificationDetails.loginUserDetVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.verificationService.getVerificationDetails(this.verificationDetails).subscribe(resp => {
      if (resp) {
        this.verificationService.changeMessage(data);
        this.router.navigate(['dashboard/verification/verificationDetail']);
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
  
  exportAsExcelFile() {
    this.common.exportToExcel(this.displayedColumns, this.digitaladdresscheckList, 'DigitalAddressCheckGeo');
  }
  exportAsExcelFile1() {
    let tabtext = '<table border="1px">';
    let j = 0;
    const header = this.dt.columns;
    const filteredValue = this.dt.filteredValue ? this.dt.filteredValue : this.dt.value; // id of table
    const lines = filteredValue.length;
    let headerColos = '';
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
    const fileName = 'DigitalAddressCheckGeo.xls';
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
  
  showall() {
    if (this.digitaladdresscheckList.length > 0) {
      this.itemperpage = this.digitaladdresscheckList.length;
    }
  }
}
