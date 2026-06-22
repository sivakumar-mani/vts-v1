import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Status } from 'src/app/common-methods/models/status';
import { CommonService } from '../../common-methods/services/common.service';
import { MasterService } from '../../common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Table, TableModule } from 'primeng/table';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css']
})
export class StatusListComponent implements OnInit {
  itemperpage;
  statusList: any[] = [];
  statusForm: UntypedFormGroup;
  status: Status = new Status();
  StatusCategoryList: any[] = [];
  showFlag = false;
  statusId = 0;
  screenAuth: any = {};
  routePath = 'Configure / Case / Status';
  breadcrumbFlags: BreadcrumbFlags = new BreadcrumbFlags();
  displayedColumns = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'statusName', header: 'Screening Status' },
    { field: 'statusDesc', header: 'description' },
    { field: 'clientViewFlag', header: 'Client View Flag' },
    { field: 'ctsFlag', header: 'CTS Flag' },
    // { field: 'Actions', header: 'Actions' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  isEdit: boolean;
  userData: any;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  currentPage = 1;
  tempCurrentPage = 1;
 @ViewChild('statusNameCtrlTrigger', { static: true }) statusNameCtrlTrigger!: MatMenuTrigger;
  statusListFilteredOptions: Observable<string[]>;
  statusListControl = new UntypedFormControl();

  @ViewChild('statusDescCtrlTrigger', { static: true }) statusDescCtrlTrigger: MatMenuTrigger;
  statusDescFilteredOptions: Observable<string[]>;
  statusDescControl = new UntypedFormControl();

  // tslint:disable-next-line: max-line-length
  constructor(private masterService: MasterService, private authService: AuthService, private fb: UntypedFormBuilder, private shared: SharedService, private message: MessageService, public dialog: MatDialog, public common: CommonService,
    private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.GetStatusCategory();
    this.getStatusList();
    this.itemperpage = 10;
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
    this.statusDescControl.reset();
    this.statusListControl.reset();
    this.autoTableFilters();
  }
  initFormGroup(): void {
    this.statusForm = this.fb.group({
      statusLookupId: ['', Validators.required],
      statusName: ['', Validators.required],
      statusDesc: [''],
      clientViewFlag: [false],
      ctsFlag: [false],
      screeningStatusId: [Number],
      createUserId: [this.userData.userId]
    });
  }


  getStatusList() {
    this.masterService.getStatus().subscribe(res => {
      if (res) {
        this.statusList = res;
        this.currentPage = 1;
      }
    },
      err => { }, () => {
        this.autoTableFilters();
      });
  }
  private autoTableFilters() {
    this.statusListFilteredOptions = this.statusListControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.statusList.map(x => x.statusName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.statusDescFilteredOptions = this.statusDescControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.statusList.map(x => x.statusDesc).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  deleteStatus(screeningStatusId: any) {
    this.masterService.DeleteStatus(screeningStatusId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showNotification();
        this.getStatusList();
      }
    });
  }
  showNotification() {
    this.shared.emitChange({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Status is deleted successfully'
    });
  }


  editStatus(src, mode: any) {
    this.breadcrumbFlags.toolTip = 'Update';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.masterService.GetStatusById(src.screeningStatusId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0];
        this.statusForm.patchValue({
          screeningStatusId: this.common.tempResetData.screeningStatusId,
          statusDesc: this.common.tempResetData.statusDesc,
          statusName: this.common.tempResetData.statusName,
          statusLookupId: this.common.tempResetData.statusLookupId,
          clientViewFlag: this.common.tempResetData.clientViewFlag,
          ctsFlag: this.common.tempResetData.ctsFlag,
        });
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
        }
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  GetStatusCategory() {
    this.masterService.GetStatusCategory().subscribe(res => {
      if (res) {
        this.StatusCategoryList = res;
      }
    });
  }
  addStatus() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  saveStatus() {
    if (this.statusForm.valid) {
      this.masterService.saveStatusDetails(this.statusForm.value).subscribe((resp: any) => {
        if (resp) {
          if (resp.success === false) {
            this.showTopCenter('warn', 'Failure Message', resp.message);
          } else {
            if (this.statusForm.controls.screeningStatusId.value > 0) {
              this.isEdit = false;
              this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            } else {
              this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            }
            this.getStatusList();
            this.closeForm();
          }
        }

      });
    } else {
      this.statusForm.markAllAsTouched();
    }
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.statusForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.currentPage = 1;
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  resetForm() {
    if (this.statusForm.controls.screeningStatusId.value > 0) {
      this.statusForm.patchValue({
        screeningStatusId: this.common.tempResetData.screeningStatusId,
        statusDesc: this.common.tempResetData.statusDesc,
        statusName: this.common.tempResetData.statusName,
        statusLookupId: this.common.tempResetData.statusLookupId,
        clientViewFlag: this.common.tempResetData.clientViewFlag,
        ctsFlag: this.common.tempResetData.ctsFlag,
      });
    } else {
      this.statusForm.controls.screeningStatusId.setValue(0);
      this.statusForm.reset();
      this.statusForm.markAsPristine();
      this.initFormGroup();
    }
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
      case 'statusName': this.statusNameCtrlTrigger.closeMenu(); break;
      case 'statusDesc': this.statusDescCtrlTrigger.closeMenu(); break;
      default: break;
    }
  }
  showall() {
    if (this.statusList.length > 0) {
      this.itemperpage = this.statusList.length;
    }
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
            this.deleteStatus(data);
          }
        }
      });
    }
  }

}
