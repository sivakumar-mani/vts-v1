import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';

@Component({
  standalone: false,
  selector: 'app-skip-invoice',
  templateUrl: './skip-invoice.component.html',
  styleUrls: ['./skip-invoice.component.css']
})
export class SkipInvoiceComponent implements OnInit {
  reason = new UntypedFormControl('');
  userData: any;
  skipInvoice: any;
  screenAuth: any = {};
  displayColumns = [{ field: 'invoiceNo', header: 'Invoice No' }, { field: 'skipedBy', header: 'Skipped By' },
  { field: 'reason', header: 'Skipped Reason' }, { field: 'skipedDate', header: 'Skipped Date & Time' }];
  constructor(private invoiceService: InvoiceService, public commonService: CommonService, private messageService: MessageService , public router: Router, private auth: AuthService) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.GetSkipInvoice();
  }
  GetSkipInvoice() {
    this.invoiceService.GetSkipInvoice().subscribe(resp => {
      if (resp) {
        this.skipInvoice = resp;
      }
    });
  }
  AddSkipInvoice() {
    if (this.reason.value) {
      const skipInvoiceVm = {
        invoiceNo: this.skipInvoice ? this.skipInvoice.skipInvoiceNos.nextInvoiceNo : 0,
        reason: this.reason.value,
        createdUserId: this.userData.userId,
        skipInvoiceNo: 0
      };
      this.invoiceService.AddSkipInvoice(skipInvoiceVm).subscribe(resp => {
        if (resp && resp.success === true) {
          this.showTopCenter('success', 'Success Message', 'Invoice Skipped Successfully');
          this.GetSkipInvoice();
          this.reason.reset();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Invoice Skipping Failed');
        }
      });
    } else { this.reason.markAsTouched(); this.reason.setValidators(Validators.required); this.reason.updateValueAndValidity(); }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  exportExcel() {
    this.commonService.exportToExcel(this.displayColumns, this.skipInvoice.skipInvoiceList, this.commonService.screenName);
  }
}
