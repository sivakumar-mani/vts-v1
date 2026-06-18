import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { AuthService } from '../common-methods/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { UntypedFormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
@Component({
  standalone: false,
  selector: 'app-icertiscandidates',
  templateUrl: './icertiscandidates.component.html',
  styleUrls: ['./icertiscandidates.component.css']
})
export class IcertiscandidatesComponent implements OnInit {
  canidatedetails=[]
  prselectedColumns: any[];
  itemperpage = 10;
  routePath = 'Direct App / Icertis Candidate'
  displayedColumns = [
    { field: 'clientReferenceNo', header: 'Referance No' },
    { field: 'candidateFirstName', header: 'Candidate Name' },
    { field: 'caseCreatedDate', header: 'Created Date' },
    { field: 'bgvStatus', header: 'Candidate BGV Status'},
    { field: 'finalReportStatus', header: 'Final Report Status' },
    
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
  @ViewChild('global', { static: true }) global!: ElementRef;
  filterCheckList: any[] = [];
  //verificationDetails: VerificationDetails = new VerificationDetails();

  constructor(

  private authService:AuthService,
  private common:CommonService
  
  ) { }

  ngOnInit() {
    this.getCaseDetailsByClientId()
   
  }



getCaseDetailsByClientId() {
  // const Id = data.clientId;
  this.authService.getLeaverCanidateDetails(11).subscribe(resp => {
    // console.log(resp)
    if (resp) {
      this.canidatedetails = resp;
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

showall() {
  if (this.canidatedetails.length > 0) {
    this.itemperpage = this.canidatedetails.length;
  }
}
}