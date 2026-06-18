import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
// import { DataTable, MessageService } from 'primeng/primeng';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  standalone: false,
  selector: 'app-hoilday',
  templateUrl: './hoilday.component.html',
  styleUrls: ['./hoilday.component.css']
})
export class HoildayComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Master / Hoilday';
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
  isEdit: boolean;
  hoildayFormgroup: UntypedFormGroup;
  hoildayList: any[] = [];
  displayedColumns = [
    { field: 'holidayDate', header: 'Holiday Date' },
    { field: 'description', header: 'Description' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
  activeName = 'Is Not Active';
  constructor(private masterService: MasterService, public common: CommonService,
    private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder,
    public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getHolidays();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  getHolidays() {
    this.masterService.getHolidays().subscribe(res => {
      if (res != null) {
        this.hoildayList = res;
      }
    });
  }
  initFormGroup() {
    this.hoildayFormgroup = this.fb.group({
      holidayId: new UntypedFormControl(0),
      holidayDate: new UntypedFormControl('', Validators.required),
      description: new UntypedFormControl('', Validators.required),
      active: new UntypedFormControl(false),
      createdUserId: new UntypedFormControl(this.userData.userId)
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
  addHoilday() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.activeName = 'Is Not Active';
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.hoildayFormgroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editrecordCheckCategoryId = this.hoildayFormgroup.controls.recordCheckCategoryId.value;
    this.hoildayFormgroup.controls.recordCheckCategoryId.setValue(0);
    this.hoildayFormgroup.reset();
    this.initFormGroup();
    if (this.isEdit) {
      this.hoildayFormgroup.controls.recordCheckCategoryId.setValue(editrecordCheckCategoryId);
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
    this.hoildayFormgroup.patchValue(data);
    this.activeChangeName(data.active);
    this.hoildayFormgroup.controls.createdUserId.setValue(this.userData.userId);
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.hoildayFormgroup.disable();
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
  saveHoilday() {
    if (this.hoildayFormgroup.valid) {
      this.masterService.savehoilday(this.hoildayFormgroup.getRawValue()).subscribe(res => {
        if (res) {
          if (this.isEdit) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getHolidays();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.hoildayFormgroup.markAllAsTouched();
    }

  }
  deleteHoilday() {
    this.masterService.deleteHoliday(this.data.holidayId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getHolidays();
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
    if (this.hoildayList.length > 0) {
      this.itemperpage = this.hoildayList.length;
    }
  }
}
