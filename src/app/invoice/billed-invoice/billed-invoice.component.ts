import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { PageChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-methods/services/auth.service';
@Component({
  standalone: false,
  selector: 'app-billed-invoice',
  templateUrl: './billed-invoice.component.html',
  styleUrls: ['./billed-invoice.component.css']
})
export class BilledInvoiceComponent implements OnInit {
  public gridView: GridDataResult;
  public buttonCount = 7;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes = true;
  public previousNext = true;
  public skip = 0;
  itemperpage;
  agentvalue: any[] = [];
  billedInvoiceList: any[] = [];
  clientId = new UntypedFormControl(null);
  fromDate = new UntypedFormControl('');
  toDate = new UntypedFormControl('');
  userData: any;
  screenAuth: any = {};
  monthly = new UntypedFormControl('');
  displayColumns = [{ field: 'clientName', header: 'Client Name' }, { field: 'siteName', header: 'Site Name' },
  { field: 'clientRefNo', header: 'Client Ref No' }, { field: 'candidateName', header: 'Candidate Name' },
  { field: 'listOfComponent', header: 'Components' }, { field: 'frSentOn', header: 'FR Sent Date & Time' },
  { field: 'invoiceNo', header: 'InvoiceNo' }];
  constructor(private invoiceService: InvoiceService, public commonService: CommonService, private message: MessageService , public router: Router, private auth: AuthService) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getInvoiceClient();
    this.itemperpage=10;

  }
  getInvoiceClient() {
    this.invoiceService.getInvoiceClient(this.userData.clientId).subscribe(res => {
      this.agentvalue = res;
    });
  }
  resetList() {
    this.clientId.reset('');
    this.fromDate.reset('');
    this.toDate.reset('');
    this.billedInvoiceList = [];
    this.monthly.reset('');
    this.gridView = {
      data:[],
      total:0
    };
  }
  monthlyChange(event: any) {
    if (event === true) {
      const date = new Date();
      this.fromDate.setValue(new Date(date.getFullYear(), date.getMonth(), 1));
      this.toDate.setValue(new Date());
    } else {
      this.fromDate.setValue('');
      this.toDate.setValue('');
    }
  }
  GetBilledList() {
    if (this.clientId.value && this.fromDate.value && this.toDate.value) {
      const fromDate = new Date(this.fromDate.value).toJSON();
      const toDate = new Date(this.toDate.value).toJSON();
      this.invoiceService.getBilledInvoiceList(this.clientId.value, fromDate, toDate).subscribe(resp => {
        if (resp.length > 0) {
          this.billedInvoiceList = this.commonService.CloneObject(resp);
          this.billedInvoiceList.forEach((element, i) => {
            element.listOfComponent = [];
            element.listOfComponent.push(resp[i].listOfComponent.map(x => x = x.subCompId > 0 ?
              x.componentName + ' - ' + x.subComponentName : x.componentName));
          });
          this.loadbilledInvoiceList();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'No Record Found');
        }
      });
    } else {
      this.validation('clientId'); this.validation('fromDate'); this.validation('toDate');
    }
    this.loadbilledInvoiceList();
  }
  validation(ctrl: any) {
    this[ctrl].markAsTouched(); this[ctrl].setValidators(Validators.required); this[ctrl].updateValueAndValidity();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  exportExcel() {
    this.commonService.exportToExcel(this.displayColumns, this.billedInvoiceList, this.commonService.screenName);
  }
    showall() {
    if (this.billedInvoiceList.length > 0) {
      this.itemperpage = this.billedInvoiceList.length;
      this.loadbilledInvoiceList();
    }
  }
  pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.itemperpage = take;
    this.loadbilledInvoiceList();
  }

  private loadbilledInvoiceList(): void {
    this.gridView = {
      data: this.billedInvoiceList.slice(this.skip, this.skip + this.itemperpage),
      total: this.billedInvoiceList.length
    };
      }
  
}
