import { Component, OnInit, Input, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Table, TableModule } from 'primeng/table';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-call-charges',
  templateUrl: './call-charges.component.html',
  styleUrls: ['./call-charges.component.css']
})
export class CallChargesComponent implements OnInit {
  itemperpage;
  userData: any;
  isEdit: boolean;
  showFlag = false;
  saveFlag = false;
  screenAuth = new ScreenAuth();
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Call Charges';
  displayedColumns = [
    { field: 'componentName', header: 'Component Name' },
    { field: 'countryFlag', header: 'Country' },
    { field: 'callChargeLimit', header: 'call Charge Limit' },
    // { field: 'Actions', header: 'Actions' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  callChargesForm: UntypedFormGroup;
  callChargeList: any[] = [];
  serviceTypeList: any[] = [];

 @ViewChild('componentNameCtrlTrigger', { static: true }) 
componentNameCtrlTrigger!: MatMenuTrigger;
  compFilteredOptions: Observable<string[]>;
  componentNameControl = new UntypedFormControl();

  @ViewChild('callChargeLimitCtrlTrigger', { static: true }) callChargeLimitCtrlTrigger: MatMenuTrigger;
  @ViewChild('countryFlagCtrlTrigger', { static: true }) countryFlagCtrlTrigger: MatMenuTrigger;
  countryFlagFilteredOptions: Observable<string[]>;
  countryFlagControl = new UntypedFormControl();

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
 @ViewChild('amountCtl', { static: true }) 
amountCtl!: ElementRef<any>;
 @ViewChild('global', { static: true }) global!: ElementRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;

  constructor(private common: CommonService, private master: MasterService, private fb: UntypedFormBuilder,
    private message: MessageService, public dialog: MatDialog,
    private authservice: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    // this.initFormGroup();
    this.getCallChargeList();
    this.getServiceTypeList();
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.callChargesForm = this.fb.group(
      {
        componentId: ['', Validators.required],
        compName: [''],
        callChargeId: [0],
        createdUserId: [this.userData.userId],
        callChargeLimit: ['', Validators.required],
        countryFlag: ['1'],
      });
  }
  getCallChargeList() {
    this.master.getCallCharges().subscribe(res => {
      if (res) {
        this.callChargeList = res;
        this.callChargeList.filter(x => x.countryFlag === true).map(x => x.countryFlag = 'India');
        this.callChargeList.filter(x => x.countryFlag === false).map(x => x.countryFlag = 'Abroad');
      }
    },
      err => { }, () => {
        this.autoTableFilters();
      });
  }
  private autoTableFilters() {
    this.compFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.callChargeList.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryFlagFilteredOptions = this.countryFlagControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.callChargeList.map(x => x.countryFlag).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  getServiceTypeList() {
    this.master.getServiceType().subscribe(res => {
      if (res) {
        this.serviceTypeList = res;
      }
    });
  }
  saveCallCharges() {

    if (this.callChargesForm.valid) {
      if (this.callChargesForm.controls.countryFlag.value === '1') {
        this.callChargesForm.controls.countryFlag.setValue(true);
      } else if (this.callChargesForm.controls.countryFlag.value === '0') {
        this.callChargesForm.controls.countryFlag.setValue(false);
      } else {
        this.callChargesForm.get('countryFlag')?.setValidators(Validators.required);
      }
      this.master.saveCallCharges(this.callChargesForm.value).subscribe(res => {
        if (res) {
          if (this.callChargesForm.controls.callChargeId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getCallChargeList();
          this.closeForm();
        }
      });
    } else {
      this.callChargesForm.markAllAsTouched();
    }
  }
  editCallCharge(src, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup();
    this.master.getCallChargesById(src.callChargeId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        if (this.common.tempResetData.countryFlag === true) {
          this.callChargesForm.controls.countryFlag.setValue('1');
          this.common.tempResetData.countryFlag = '1';
        } else {
          this.callChargesForm.controls.countryFlag.setValue('0');
          this.common.tempResetData.countryFlag = '0';
        }
        this.callChargesForm.patchValue({
          componentId: this.common.tempResetData.componentId,
          callChargeId: this.common.tempResetData.callChargeId,
          callChargeLimit: this.common.tempResetData.callChargeLimit,
          countryFlag: this.common.tempResetData.countryFlag,
        });
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.callChargesForm.disable();
        }
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;

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
            this.deleteCallCharge(data);
          }
        }
      });
    }
  }
  deleteCallCharge(src: any) {
    this.master.deletecallCharge(src.callChargeId, src.createdUserId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getCallChargeList();
      }
    });
  }
  addCallCharges() {
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.initFormGroup();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.callChargesForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.currentPage = 1;
  }

  resetForm() {
    if (this.callChargesForm.controls.callChargeId.value > 0) {
      this.callChargesForm.patchValue({
        componentId: this.common.tempResetData.componentId,
        callChargeId: this.common.tempResetData.callChargeId,
        callChargeLimit: this.common.tempResetData.callChargeLimit,
        countryFlag: this.common.tempResetData.countryFlag,
      });

    } else {
      this.callChargesForm.controls.callChargeId.setValue(0);
      this.callChargesForm.reset();
      this.callChargesForm.markAsPristine();
      this.initFormGroup();
    }

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

  closeMenu(col: any) {
    switch (col) {
      case 'componentName': this.componentNameCtrlTrigger.closeMenu(); break;
      case 'countryFlag': this.countryFlagCtrlTrigger.closeMenu(); break;
      case 'callChargeLimit': this.callChargeLimitCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
  resettable() {
    this.dt.reset();
    this.componentNameControl.reset();
    this.countryFlagControl.reset();
    this.global.nativeElement.value = '';
    this.amountCtl.nativeElement.value = '';
    this.autoTableFilters();
  }
  showall() {
    if (this.callChargeList.length > 0) { this.itemperpage = this.callChargeList.length; }
  }
}
