import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { MasterService } from '../../common-methods/services/master.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { BillingRule } from '../../common-methods/models/billingrule';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import {  MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-billing-rule-entry',
  templateUrl: './billing-rule-entry.component.html',
  styleUrls: ['./billing-rule-entry.component.css']
})
export class BillingRuleEntryComponent implements OnInit {
  billingFormGroup: UntypedFormGroup;
  checked = true;
  editFlag = false;
  billingList: any[] = [];
  billingListTemp: any[] = [];
  isRowReOrder = false;
  showBillingRule = false;
  routePath = 'Client / Billing Rule';
  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  tooTip = 'Save';
  cols = [
    { field: 'lookupName', header: 'Rule' },
    { field: 'active', header: 'Active' },
  ];
  isEdit: boolean;
  userData: any;
  lookupByIdList: BillingRule = new BillingRule();
  totalpages: number;
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  @ViewChild('ruleTrigger', { static: true }) ruleTrigger: MatMenuTrigger;
  @ViewChild('updateConfirmation', { static: true }) 
updateConfirmation!: TemplateRef<any>;
  ruleFilteredOptions: Observable<string[]>;
  ruleControl = new UntypedFormControl();
  screenAuth: any = {};
  breadcrumbFlag = new BreadcrumbFlags();

  // tslint:disable-next-line:max-line-length
  constructor(private message: MessageService, public common: CommonService, public dialog: MatDialog, private authService: AuthService,
    private master: MasterService, private fb: UntypedFormBuilder, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getAllBillingRule();
  }

  getAllBillingRule() {
    this.billingList = [];
    const lookupCatId = 6;
    this.master.getBillingRule(lookupCatId).subscribe(resp => {
      if (resp) {
        this.billingList = resp;
        this.billingListTemp = resp;
      }
    }, err => { }, () => {
      this.billRuleTblAutoFilters();
    });
  }
  initFormGroup() {
    this.billingFormGroup = this.fb.group({
      lookupName: ['', Validators.required],
      lookupId: [0],
      langId: [1],
      displayOrder: [''],
      lookupCatId: [6],
      active: [true],
      createdUserId: [this.userData.userId]
    });
  }
  SaveUpdate() {
    if (!this.showBillingRule) {
      this.onClickUpdateDialog();
    } else {
      if (!this.billingFormGroup.get('lookupName')?.value) {
        this.billingFormGroup.get('lookupName')?.setValidators(Validators.required);
        this.billingFormGroup.get('lookupName')?.updateValueAndValidity();
      } else {
        this.billingFormGroup.get('lookupName')?.clearValidators();
        this.billingFormGroup.get('lookupName')?.updateValueAndValidity();
      }
      if (this.billingFormGroup.valid) {
        this.billingFormGroup.controls.lookupName.setValue(this.billingFormGroup.controls.lookupName.value.trim());
        this.master.saveLookUpNames(this.billingFormGroup.value).subscribe((res: any) => {
          if (res.success === false) {
            this.showTopCenter('warn', 'Failure Message', res.message);
          } else {
            if (this.billingFormGroup.controls.lookupId.value > 0) {
              this.isEdit = false;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
            this.getAllBillingRule();
            this.closeBillingRule();
          }
        });
      } else {
        this.billingFormGroup.markAllAsTouched();
      }
    }
  }
  closeBillingRule() {
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.billingFormGroup.reset();
    this.showBillingRule = !this.showBillingRule;
    this.billingListTemp = [];
    this.getAllBillingRule();
    this.isEdit = false;
  }

  editRule(src: any) {
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.initFormGroup();
    this.master.getLookUpMasterById(src.lookupId).subscribe(resp => {
      if (resp) {
        this.lookupByIdList = resp[0];
        this.billingFormGroup.patchValue({
          lookupCatId: this.lookupByIdList.lookupCatId, lookupName: this.lookupByIdList.lookupName,
          active: this.lookupByIdList.active, lookupId: this.lookupByIdList.lookupId, displayOrder: this.lookupByIdList.displayOrder
        });
        this.common.tempResetData = Object.assign({}, this.lookupByIdList);
      }
    });

    this.showBillingRule = !this.showBillingRule;
    this.isEdit = true;
  }
  deleteBillingruleDetail(data: any) {
    this.master.deleteLookUpMaster(data.lookupId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getAllBillingRule();
      }
    });
  }
  addBillingRule() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.initFormGroup();
    this.showBillingRule = !this.showBillingRule;
    this.isEdit = false;
  }
  reset() {
    if (this.billingFormGroup.controls.lookupId.value > 0) {
      this.billingFormGroup.patchValue({
        lookupCatId: this.common.tempResetData.lookupCatId,
        lookupName: this.common.tempResetData.lookupName,
        active: this.common.tempResetData.active,
        lookupId: this.common.tempResetData.lookupId,
        displayOrder: this.lookupByIdList.displayOrder
      });
    } else {
      this.billingFormGroup.controls.lookupId.setValue(0);
      this.billingFormGroup.get('lookupName')?.clearValidators();
      this.billingFormGroup.reset();
      this.billingFormGroup.markAsPristine();
      this.initFormGroup();
    }
  }
  resetTable() {
    this.dt.reset();
    this.ruleControl.reset();
    this.global.nativeElement.value = '';
    this.billRuleTblAutoFilters();
  }
  // breacrumbFlags() {
  //   this.btnAdd = !this.btnAdd;
  //   this.btnResetTbl = !this.btnResetTbl;
  //   this.btnSave = !this.btnSave;
  //   this.btnReset = !this.btnReset;
  //   this.btnBack = !this.btnBack;
  // }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  private billRuleTblAutoFilters(): void {
    this.ruleFilteredOptions = this.ruleControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.billingList.map(x => x.lookupName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }

  onRowReorder(rowData: any) {
    if (rowData) {
      if (rowData.dragIndex < rowData.dropIndex) {
        this.billingListTemp.filter(e => e.displayOrder > rowData.dragIndex && e.displayOrder <= rowData.dropIndex)
          .forEach(r => r.displayOrder = r.displayOrder - 1);
        this.billingListTemp[rowData.dropIndex - 1].displayOrder = rowData.dropIndex;
      } else {
        this.billingListTemp.filter(e => e.displayOrder >= rowData.dropIndex + 1 && e.displayOrder <= rowData.dragIndex + 1)
          .forEach(a => a.displayOrder = a.displayOrder + 1);
        this.billingListTemp[rowData.dropIndex].displayOrder = rowData.dropIndex + 1;
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
    this.master.updateBrTblRows(this.billingListTemp).subscribe(res => {
      if (res.success) {
        this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        this.getAllBillingRule();
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
    this.billingListTemp = [];
    this.getAllBillingRule();
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
            this.deleteBillingruleDetail(data);
          }
        }
      });
    }
  }
}
