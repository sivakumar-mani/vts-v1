import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { MasterService } from '../../common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../common-methods/services/common.service';
import { BillingRule } from '../../common-methods/models/billingrule';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import {  MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';
export class BillingTransaction {
  lookupCatId: number;
  lookupName: string;
  active: boolean;
  createdBy: number;
  lookupId: number;
}

@Component({
  standalone: false,
  selector: 'app-billing-cycle',
  templateUrl: './billing-cycle.component.html',
  styleUrls: ['./billing-cycle.component.css']
})
export class BillingCycleComponent implements OnInit {
  showBillingCycle = false;
  isEdit = false;
  billingCycleList: any[] = [];
  billingCycleListTemp: any[] = [];
  isRowReOrder = false;
  BillingCycleForm: UntypedFormGroup;
  displayedColumns = [
    { field: 'lookupName', header: 'Billing Cycle' },
    { field: 'active', header: 'Active' },
  ];

  totalpages: number;
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  userData: any;
  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  routePath = 'Client / Billing Cycle';
  lookupByIdList: BillingRule = new BillingRule();
  breadcrumbFlag = new BreadcrumbFlags();

  @ViewChild('lookupNameTrigger', { static: true }) lookupNameTrigger: MatMenuTrigger;
  @ViewChild('updateConfirmation', { static: true }) 
updateConfirmation!: TemplateRef<any>;
  lookupNameFilteredOptions: Observable<string[]>;
  lookupNameControl = new UntypedFormControl();

  constructor(private master: MasterService, private fb: UntypedFormBuilder, private common: CommonService,
    public dialog: MatDialog, private authService: AuthService, private message: MessageService,
    private router: Router,) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getAllBillingCycle();
  }
  initFormGroup() {
    this.BillingCycleForm = this.fb.group({
      lookupName: ['', Validators.required],
      displayOrder: [''],
      lookupId: [0],
      langId: [1],
      lookupCatId: [4],
      active: [true],
      createdUserId: [this.userData.userId]
    });
  }
  saveBillingCycleDetail() {
    if (!this.showBillingCycle) {
      this.onClickUpdateDialog();
    } else {
      if (!this.BillingCycleForm.get('lookupName')?.value) {
        this.BillingCycleForm.get('lookupName')?.setValidators(Validators.required);
        this.BillingCycleForm.get('lookupName')?.updateValueAndValidity();
      } else {
        this.BillingCycleForm.get('lookupName')?.clearValidators();
        this.BillingCycleForm.get('lookupName')?.updateValueAndValidity();
      }
      if (this.BillingCycleForm.valid) {
        this.BillingCycleForm.controls.lookupName.setValue(this.BillingCycleForm.controls.lookupName.value.trim());
        this.master.saveLookUpNames(this.BillingCycleForm.value).subscribe((resp: any) => {
          if (resp.success === false) {
            // if (resp.message === '2') {
            this.showTopCenter('warn', 'Failure Message', resp.message);
            // }
            // if (resp.message === '1') {
            //   this.showTopCenter('warn', 'Failure Message', 'Order Number has been already exist');
            // }

          } else {
            if (this.BillingCycleForm.controls.lookupId.value > 0) {
              this.isEdit = false;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
            this.getAllBillingCycle();
            this.closeBillingCycle();
          }
        });
      } else {
        this.BillingCycleForm.markAllAsTouched();
      }
    }
  }
  getAllBillingCycle() {
    const lookupCatId = 4;
    this.master.getBillingCycle(lookupCatId).subscribe(resp => {
      if (resp) {
        this.billingCycleList = resp;
        this.billingCycleListTemp = resp;
      }
    }, err => { }, () => {
      this.billCycleTblAutoFilters();
    });
  }
  openBillingCycle() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.initFormGroup();
    this.showBillingCycle = !this.showBillingCycle;
    this.isEdit = false;
  }
  resetForm() {
    if (this.BillingCycleForm.controls.lookupId.value > 0) {
      this.BillingCycleForm.patchValue({
        lookupCatId: this.common.tempResetData.lookupCatId,
        lookupName: this.common.tempResetData.lookupName,
        active: this.common.tempResetData.active,
        lookupId: this.common.tempResetData.lookupId,
        displayOrder: this.common.tempResetData.displayOrder,
      });
    } else {
      this.BillingCycleForm.controls.lookupId.setValue(0);
      this.BillingCycleForm.get('lookupName')?.clearValidators();
      this.BillingCycleForm.reset();
      this.BillingCycleForm.markAsPristine();
      this.initFormGroup();
    }
  }
  resetTable() {
    this.dt.reset();
    this.lookupNameControl.reset();
    this.global.nativeElement.value = '';
    this.billCycleTblAutoFilters();
  }
  editBillingCycleDetail(src: any) {
    this.initFormGroup();
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.master.getLookUpMasterById(src.lookupId).subscribe(resp => {
      if (resp) {
        this.lookupByIdList = resp[0];
        this.BillingCycleForm.patchValue({
          lookupCatId: this.lookupByIdList.lookupCatId, lookupName: this.lookupByIdList.lookupName,
          active: this.lookupByIdList.active, lookupId: this.lookupByIdList.lookupId,
          displayOrder: this.lookupByIdList.displayOrder,
        });
        this.common.tempResetData = Object.assign({}, this.lookupByIdList);
      }
    });
    this.showBillingCycle = !this.showBillingCycle;
    this.isEdit = true;
  }
  deleteBillingCycleDetail(data: any) {
    this.master.deleteLookUpMaster(data.lookupId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getAllBillingCycle();
      }
    });
  }
  closeBillingCycle() {
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.BillingCycleForm.reset();
    this.showBillingCycle = !this.showBillingCycle;
    this.billingCycleListTemp = [];
    this.getAllBillingCycle();
    this.isEdit = false;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  private billCycleTblAutoFilters(): void {
    this.lookupNameFilteredOptions = this.lookupNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.billingCycleList.map(x => x.lookupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  onRowReorder(rowData: any) {
    if (rowData) {
      if (rowData.dragIndex < rowData.dropIndex) {
        this.billingCycleListTemp.filter(e => e.displayOrder > rowData.dragIndex && e.displayOrder <= rowData.dropIndex)
          .forEach(r => r.displayOrder = r.displayOrder - 1);
        this.billingCycleListTemp[rowData.dropIndex - 1].displayOrder = rowData.dropIndex;
      } else {
        this.billingCycleListTemp.filter(e => e.displayOrder >= rowData.dropIndex + 1 && e.displayOrder <= rowData.dragIndex + 1)
          .forEach(a => a.displayOrder = a.displayOrder + 1);
        this.billingCycleListTemp[rowData.dropIndex].displayOrder = rowData.dropIndex + 1;
      }
      this.isRowReOrder = true;
      this.breadcrumbFlag.toolTip = 'Update';
      this.breadcrumbFlag.btnSave = true;
      this.breadcrumbFlag.btnBack = false;
      this.breadcrumbFlag.btnReset = false;
      this.breadcrumbFlag.btnAdd = true;
      this.breadcrumbFlag.btnResetTbl = true;
      if (!this.screenAuth.editFlag) {
        this.breadcrumbFlag.btnSaveDisabled = true;
      }
    }
  }
  onClickUpdateDialog() {
    this.dialog.open(this.updateConfirmation, {
      width: '320px',
    });

  }
  onClickUpdateOk() {
    this.master.updateReOrderedRows(this.billingCycleListTemp).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.getAllBillingCycle();
        this.dialog.closeAll();
        this.isRowReOrder = false;
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnBack = false;
        this.breadcrumbFlag.btnReset = false;
        this.breadcrumbFlag.btnAdd = true;
        this.breadcrumbFlag.btnResetTbl = true;
      }
    });
  }
  dialogClose() {
    this.dialog.closeAll();
    this.isRowReOrder = false;
    this.billingCycleListTemp = [];
    this.getAllBillingCycle();
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
  }

  public openDialog(data: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'Are you sure you want to delete this record?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteBillingCycleDetail(data);
          }
        }
      });
    }
  }
}
