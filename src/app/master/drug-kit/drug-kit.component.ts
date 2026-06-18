import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Validators, UntypedFormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';

import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreeningService } from '../../common-methods/services/screening.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { AuthService } from '../../common-methods/services/auth.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-drug-kit',
  templateUrl: './drug-kit.component.html',
  styleUrls: ['./drug-kit.component.css']
})
export class DrugKitComponent implements OnInit {

  showDrugKit = false;
  routePath = 'Configure / Case / Drug Kit';
  btnSave = false;
  btnReset = false;
  btnBack = false;
  btnAdd = true;
  btnResetTbl = true;
  btnAddDisabled = false;
  btnSaveDisabled = false;
  tooTip = 'Save';
  cols = [
    { field: 'kitName', header: 'Drug Kit Name' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  drugkitNameFormCtrl = new UntypedFormControl();
  kitNameFilteredOptions: Observable<string[]>;
  @ViewChild('drugKitNameTrigger', { static: true }) drugKitNameTrigger: MatMenuTrigger;
  breadcrumbFlag = new BreadcrumbFlags();
  isEdit: boolean;
  screenAuth: ScreenAuth = new ScreenAuth();
  userData: any;
  drugKitFormGroup: UntypedFormGroup;
  drugList: any[] = [];
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;
  respData: any;
  // checkFlag = false;
  constructor(private fb: UntypedFormBuilder,public screeningService: ScreeningService, public masterService: MasterService, public commonService: CommonService,
    private sharedService: SharedService, public dialog: MatDialog, private authService: AuthService,
    private messageService: MessageService, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getDrugKitList();
  }
  initFormGroup() {
    this.drugKitFormGroup = this.fb.group({
      kitId: [0],
      kitName: ['', [Validators.minLength(3), Validators.required]],
      active: [true],
      loggedIn: [this.userData.userId],
      // deleteFlag: [false],
    });
  }
  // open form
  addDrugKit() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSaveDisabled = false;
    this.showDrugKit = !this.showDrugKit;
    this.initFormGroup();
    this.isEdit = false;
  }
  // close form
  closeDrugKit() {
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnBack = false;
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnAdd = true;
    this.breadcrumbFlag.btnResetTbl = true;
    this.drugKitFormGroup.reset();
    this.showDrugKit = !this.showDrugKit;
    this.getDrugKitList();
    this.isEdit = false;
  }
  // grid list
  getDrugKitList() {
    // this.masterService.GetDrugKitList().subscribe(resp => {
    //   this.drugList = resp;
    // }, err => { }, () => {
      this.drugList= this.screeningService.drugKitList
      this.drugTblAutoFilters();
    // });
  }
  // form rest
  resetForm() {
    if (this.drugKitFormGroup.controls.kitId.value > 0) {
      this.drugKitFormGroup.patchValue({
        kitName: this.respData.kitName,
        KitId: this.respData.kitId,
        active: this.respData.active
      });
      this.drugKitFormGroup.get('kitId')?.setValue(this.respData.kitId);
    } else {
      this.drugKitFormGroup.controls.kitId.setValue(0);
      this.drugKitFormGroup.reset();
      this.drugKitFormGroup.markAsPristine();
      this.initFormGroup();
    }
  }
  private drugTblAutoFilters(): void {
    this.kitNameFilteredOptions = this.drugkitNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.drugList.map(x => x.kitName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.drugTblAutoFilters();
  }
  // check valid kitname
  checkKitName() {
    // const value1 = this.drugKitFormGroup.get('kitName')?.value;
    // if (value1 === '' || value1 == null) {
    // } else if (value1.length < 3) {
    //   this.drugKitFormGroup.get('kitName')?.setErrors({ incorrect: true });
    // } else {
    //   this.drugKitFormGroup.get('kitName')?.setErrors(null);
    // }
    if (this.drugKitFormGroup.valid) {
      const value = this.drugKitFormGroup.get('kitName')?.value;
      const id = this.drugKitFormGroup.get('kitId')?.value;
      this.masterService.CheckDuplicateKitName(value, id).subscribe(resp => {
        if (resp) {
          // this.checkFlag = true;
          this.drugKitFormGroup.get('kitName')?.setErrors({ incorrect: true });
        } else {
          // this.checkFlag = false;
          this.drugKitFormGroup.get('kitName')?.setErrors(null);
        }
      });
    }
  }
  // edit
  editOpen(data, mode: any) {
    this.breadcrumbFlag.toolTip = 'Update';
    this.breadcrumbFlag.btnSave = true;
    this.breadcrumbFlag.btnBack = true;
    this.breadcrumbFlag.btnReset = true;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.initFormGroup();
    this.masterService.GetDrugKitDetails(data.kitId).subscribe(res => {
      this.respData = res;
      this.drugKitFormGroup.patchValue({
        kitName: this.respData.kitName,
        KitId: this.respData.kitId,
        active: this.respData.active,
      });
      this.drugKitFormGroup.get('kitId')?.setValue(res.kitId);
      if (mode === 'view') {
        this.drugKitFormGroup.disable();
        this.breadcrumbFlag.btnSave = false;
        this.breadcrumbFlag.btnReset = false;
      }
    });
    this.showDrugKit = !this.showDrugKit;
  }
  public openDialog(data: any) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
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
          if (action === this.commonService.DELETECONFIRMATION) {
            this.deletedrugKit(data);
          }
        }
      });
    }
  }
  // delete
  deletedrugKit(data: any) {
    this.masterService.DeleteDrugKit(data.kitId, this.userData.userId).subscribe(resp => {
      if (resp.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getDrugKitList();
      }
    });
  }
  // save
  SaveUpdate() {
    if (this.drugKitFormGroup.valid) {
      this.masterService.AddUpdateDrugKitName(this.drugKitFormGroup.value).subscribe(resp => {
        if (resp) {
          if (this.drugKitFormGroup.controls.kitId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showNotification('success', 'Success Message', 'Saved Successfully');
          }
          this.getDrugKitList();
          this.closeDrugKit();
        }
      });
    } else {
      this.drugKitFormGroup.markAllAsTouched();
    }
  }
  // popup alert
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  showNotification(level: string, info: string, message: string) {
    this.sharedService.emitChange({
      severity: level,
      summary: info,
      detail: message
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
}
