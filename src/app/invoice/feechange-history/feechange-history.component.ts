import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/common-methods/services/common.service';

@Component({
  standalone: false,
  selector: 'app-feechange-history',
  templateUrl: './feechange-history.component.html',
  styleUrls: ['./feechange-history.component.css']
})
export class FeechangeHistoryComponent implements OnInit {
  @Input() clientRefNum: String;
  @ViewChild('feehistory', { static: true }) feehistory: TemplateRef<any>;
  feeChangeHistory: any[] = [];
  constructor(private invoiceService: InvoiceService, public dialog: MatDialog, public common: CommonService) { }

  ngOnInit() {

  }
  openHistory() {
    this.invoiceService.getCaseFeeChangeHistory(this.clientRefNum).subscribe(res => {
      if (res) {
        this.feeChangeHistory = res;
        this.dialog.open(this.feehistory, {
          width: '800px',
          disableClose: true
        });
      }
    })
  }

}
