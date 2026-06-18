import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { InvoiceService } from 'src/app/common-methods/services/invoice.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-invoicetax',
  templateUrl: './invoicetax.component.html',
  styleUrls: ['./invoicetax.component.css']
})
export class InvoicetaxComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Master / Invoice Tax';
  screenAuth: any = {};
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  data: any;
  dialogRef: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;
  showFlag = false;
  invoicetaxFormgroup: UntypedFormGroup;
  isEdit: boolean;
  invoiceTaxList: any[] = [];
  displayedColumns = [
    { field: 'type', header: 'Tax' },
    { field: 'description', header: 'Description' },
    { field: 'percentage', header: 'Percentage' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
  activeName = 'Is Not Active';
  // tslint:disable-next-line: max-line-length
  constructor(private masterService: MasterService, public invoiceService: InvoiceService,
    public common: CommonService, private auth: AuthService, private message: MessageService,
    private fb: UntypedFormBuilder, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getTaxList();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  getTaxList() {
    this.invoiceService.getTax().subscribe(res => {
      if (res != null) {
        this.invoiceTaxList = res;
      }
    });
  }
  initFormGroup() {
    this.invoicetaxFormgroup = this.fb.group({
      taxId: new UntypedFormControl(0),
      type: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
      percentage: new UntypedFormControl(),
      active: new UntypedFormControl(false),
      logginId: new UntypedFormControl(this.userData.userId)
    });
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
  addInvoiceTax() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.activeName = 'Is Not Active';
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.invoicetaxFormgroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const edittaxId = this.invoicetaxFormgroup.controls.taxId.value;
    this.invoicetaxFormgroup.controls.taxId.setValue(0);
    this.invoicetaxFormgroup.reset();
    this.initFormGroup();
    if (this.isEdit) {
      this.invoicetaxFormgroup.controls.taxId.setValue(edittaxId);
    }
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  editDetail(data: any, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.invoicetaxFormgroup.patchValue(data);
    this.activeChangeName(data.active);
    this.invoicetaxFormgroup.controls.logginId.setValue(this.userData.userId);
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.invoicetaxFormgroup.disable();
    }
  }
  activeChangeName(event: any) {
    if (event) {
      this.activeName = 'Is Active';
    }
    if (!event) {
      this.activeName = 'Is Not Active';
    }
  }
  saveInvoiceTax() {
    if (this.invoicetaxFormgroup.valid) {
      this.invoiceService.saveTax(this.invoicetaxFormgroup.getRawValue()).subscribe(res => {
        if (res) {
          if (this.isEdit) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getTaxList();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.invoicetaxFormgroup.markAllAsTouched();
    }

  }
  deleteInvoiceTax() {
    this.invoiceService.deleteTaxById(this.data.taxId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getTaxList();
      }
    });
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  showall() {
    if (this.invoiceTaxList.length > 0) {
      this.itemperpage = this.invoiceTaxList.length;
    }
  }
}
