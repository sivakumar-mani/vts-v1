import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ScreeningService } from '../common-methods/services/screening.service'
import { CommonService } from '../common-methods/services/common.service';
import { Observable } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  standalone: false,
  selector: 'app-paymenthistory',
  templateUrl: './paymenthistory.component.html',
  styleUrls: ['./paymenthistory.component.css']
})
export class PaymenthistoryComponent implements OnInit {

  paymentList: any[] = [];

  itemperpage = 10;

  routePath = 'Direct App / Canidate Payment Details';

  displayedColumns = [
    { field: 'orderId', header: 'Order Id' },
    { field: 'referanceNumber', header: 'Referance No' },
    { field: 'firstName', header: 'Candidate Name' },
    { field: 'packageName', header: 'Package Name' },
    { field: 'initiateDate', header: 'Payment InitiateDate' },
    { field: 'paymentDate', header: 'PaymentDate' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'reason', header: 'Reason' }
  ];

  candidateFirstNameFormCtrl = new UntypedFormControl();

  candidateFirstNameFilteredOptions!: Observable<string[]>;

  @ViewChild('candidateFirstNameTrigger', { static: true })
  candidateFirstNameTrigger!: MatMenuTrigger;

  clientReferenceNoFormCtrl = new UntypedFormControl();

  clientReferenceNoFilteredOptions!: Observable<string[]>;

  @ViewChild('clientReferenceNoTrigger', { static: true })
  clientReferenceNoTrigger!: MatMenuTrigger;

  clientNameFormCtrl = new UntypedFormControl();

  clientNameFilteredOptions!: Observable<string[]>;

  @ViewChild('clientNameTrigger', { static: true })
  clientNameTrigger!: MatMenuTrigger;

  totalpages!: number;

  @ViewChild('dt', { static: false })
  dt!: Table;

  currentPage = 1;

  tempCurrentPage = 1;

  userData: any;

  @ViewChild('global', { static: true })
  global!: ElementRef;

  filterCheckList: any[] = [];

  constructor(
    private screeningService: ScreeningService,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.getpaymentList();
  }

  getpaymentList(): void {

    this.screeningService
      .GetCandidatePaymentList()
      .subscribe({

        next: (repsu: any) => {

          if (repsu) {

            this.paymentList = repsu;

            // console.log(repsu);
          }
        },

        error: (err) => {

          console.error(err);
        }
      });
  }

  getTotalPages(totalRecords: number, rows: number): number {

    this.totalpages = Math.ceil(totalRecords / rows);

    return Math.ceil(totalRecords / rows);
  }

  navigateNxtPrevPage(pageNo: number, rows: number): void {

    this.currentPage = pageNo / rows;

    this.tempCurrentPage = this.currentPage;
  }

  navigatePage(pageNo: number, rowscount: number): void {

    if (+pageNo > this.totalpages || +pageNo <= 0) {

      this.currentPage = this.tempCurrentPage;

    } else {

      this.dt.onPageChange({
        first: ((pageNo - 1) * rowscount),
        rows: rowscount
      });

      this.tempCurrentPage = this.currentPage;
    }
  }

  showall(): void {

    if (this.paymentList.length > 0) {

      this.itemperpage = this.paymentList.length;
    }
  }
}