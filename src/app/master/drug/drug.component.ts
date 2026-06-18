import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { AuthService } from '../../common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MasterService } from '../../common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  standalone: false,
  selector: 'app-drug',
  templateUrl: './drug.component.html',
  styleUrls: ['./drug.component.css']
})
export class DrugComponent implements OnInit {
  itemperpage;
  showDrugDetails = false;
  drugList: any[] = [];
  screenAuth: any = {};
  userData: any;

  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  routePath = 'Configure / Case / Drug';
  breadcrumbFlag = new BreadcrumbFlags();
  drugFormgroup: UntypedFormGroup;
  drugDisplayColumns = [
    { field: 'drugName', header: 'Drug Name' },
    { field: 'drugShortCode', header: 'Drug Short Code' },
    { field: 'active', header: 'Active' }];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  isEdit = false;
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  @ViewChild('global', { static: true }) global!: ElementRef;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('drugShortCodeTrigger', { static: true }) 
drugShortCodeTrigger!: MatMenuTrigger;
  drugShortFilteredOptions: Observable<string[]>;
  drugShortControl = new UntypedFormControl();

  @ViewChild('drugNameTrigger', { static: true }) drugNameTrigger: MatMenuTrigger;
  drugNameFilteredOptions: Observable<string[]>;
  drugNameControl = new UntypedFormControl();
  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private common: CommonService, private fb: UntypedFormBuilder,
    private masterService: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.itemperpage = 10;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    // console.log(this.screenAuth, 'per');
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.getDrugDetailList();
  }
  // form page open
  openDrugForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.initFormGroup();
    this.showDrugDetails = !this.showDrugDetails;
    this.isEdit = false;
  }

  initFormGroup() {
    this.drugFormgroup = this.fb.group({
      drugId: [0],
      drugShortCode: ['', Validators.required],
      drugName: ['', [Validators.required, Validators.min(3)]],
      active: [true],
      loggedIn: [this.userData.userId]
    });
  }
  // from close
  closeDrugForm() {
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.drugFormgroup.reset();
    this.showDrugDetails = !this.showDrugDetails;
    this.isEdit = false;
  }
  // form reset
  resetForm() {
    if (this.drugFormgroup.controls.drugId.value > 0) {
      this.drugFormgroup.patchValue({
        drugShortCode: this.common.tempResetData.drugShortCode,
        drugName: this.common.tempResetData.drugName,
        active: this.common.tempResetData.active,
        durgId: this.common.tempResetData.durgId
        // displayOrder: this.common.tempResetData.displayOrder,
      });
    } else {
      this.drugFormgroup.controls.drugId.setValue(0);
      this.drugFormgroup.reset();
      this.drugFormgroup.markAsPristine();
      this.initFormGroup();
    }
  }
  // save
  saveDrugDetails() {
    if (this.drugFormgroup.valid) {
      this.masterService.saveDrugDetails(this.drugFormgroup.value).subscribe(res => {
        if (res) {
          if (this.drugFormgroup.controls.drugId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
        } else {
          this.showTopCenter('warn', 'Failure Message', res.message);
        }
        this.getDrugDetailList();
        this.closeDrugForm();
      });
    } else {
      this.drugFormgroup.markAllAsTouched();
    }
  }
  // grid
  getDrugDetailList() {
    this.masterService.getDrugDetailList().subscribe(res => {
      if (res) {
        this.drugList = res;
      }
    }, err => { }, () => {
      this.drugTblAutoFilters();
    });
  }
  // edit
  editDrugDetail(drugId, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.masterService.editDrugDetail(drugId).subscribe(resp => {
      if (resp) {
        this.drugFormgroup.patchValue(resp);
        this.drugFormgroup.controls.loggedIn.setValue(this.userData.userId);
        this.common.tempResetData = resp;
        if (mode === 'view') {
          this.drugFormgroup.disable();
          this.breadcrumbFlag.btnSave = false;
          this.breadcrumbFlag.btnReset = false;
        }
      }
    });
    this.showDrugDetails = !this.showDrugDetails;
    this.isEdit = true;
  }
  // delete
  deleteDrugDetail(drugId: any) {
    this.masterService.deleteDrugDetail(drugId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('success', 'Success Message', 'Deleted Successfully');
        this.getDrugDetailList();
      }
    });
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
            this.deleteDrugDetail(data);
          }
        }
      });
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  // grid column search
  private drugTblAutoFilters(): void {
    this.drugShortFilteredOptions = this.drugShortControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.drugList.map(x => x.drugShortCode).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.drugNameFilteredOptions = this.drugNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.drugList.map(x => x.drugName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  // check valid drug
  checkValidDrugValue() {
    // if (!this.isEdit) {
    // if (this.drugFormgroup.get('drugName')?.value === null || this.drugFormgroup.get('drugName')?.value === '') {
    //   this.drugFormgroup.controls.drugName.setErrors({ required: true });
    // } else {
    if (this.drugFormgroup.get('drugName')?.valid) {
      this.masterService.checkDuplicateDrugName(this.drugFormgroup.get('drugName')?.value,
        this.drugFormgroup.get('drugId')?.value).subscribe(resp => {
          if (resp) {
            this.drugFormgroup.controls.drugName.setErrors({ incorrect: true });
          } else {
            this.drugFormgroup.controls.drugName.setErrors(null);
          }
        });
    }
    // }
  }
  resetTable() {
    this.dt.reset();
    this.drugShortControl.reset();
    this.drugNameControl.reset();
    this.global.nativeElement.value = '';
    this.drugTblAutoFilters();
  }
  getTotalPages(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  showall() {
    if (this.drugList.length > 0) {
      this.itemperpage = this.drugList.length;
    }
  }
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
}
export class DrugDetail {
  drugId: number;
  drugShortCode: string;
  drugName: string;
  active: boolean;
  loggedIn: number;
}
