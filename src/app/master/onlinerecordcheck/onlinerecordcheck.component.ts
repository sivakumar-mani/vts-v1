import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'


@Component({
  standalone: false,
  selector: 'app-onlinerecordcheck',
  templateUrl: './onlinerecordcheck.component.html',
  styleUrls: ['./onlinerecordcheck.component.css']
})
export class OnlinerecordcheckComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Record Check Category';
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
  recordCheckFormgroup: UntypedFormGroup;
  isEdit: boolean;
  recordCheckCategoryList: any[] = [];
  displayedColumns = [
    { field: 'recordCheckCategoryName', header: 'Record Check CategoryName' },
    { field: 'categoryDesc', header: 'Description' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];
  activeName = 'Is Not Active';
  // tslint:disable-next-line: max-line-length
  constructor(private masterService: MasterService, public common: CommonService, private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog,
    private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getRecordCheckList();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  getRecordCheckList() {
    this.masterService.getRecordCheckList().subscribe(res => {
      if (res != null) {
        this.recordCheckCategoryList = res;
      }
    });
  }
  initFormGroup() {
    this.recordCheckFormgroup = this.fb.group({
      recordCheckCategoryId: new UntypedFormControl(0),
      recordCheckCategoryName: new UntypedFormControl('', Validators.required),
      categoryDesc: new UntypedFormControl('', Validators.required),
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
  addReordCheckCategory() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
    this.activeName = 'Is Not Active';
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.recordCheckFormgroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editrecordCheckCategoryId = this.recordCheckFormgroup.controls.recordCheckCategoryId.value;
    this.recordCheckFormgroup.controls.recordCheckCategoryId.setValue(0);
    this.recordCheckFormgroup.reset();
    this.initFormGroup();
    if (this.isEdit) {
      this.recordCheckFormgroup.controls.recordCheckCategoryId.setValue(editrecordCheckCategoryId);
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
    this.recordCheckFormgroup.patchValue(data);
    this.activeChangeName(data.active);
    this.recordCheckFormgroup.controls.createdUserId.setValue(this.userData.userId);
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.recordCheckFormgroup.disable();
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
  saveRecordCheckCategory() {
    if (this.recordCheckFormgroup.valid) {
      this.masterService.saveRecordCheck(this.recordCheckFormgroup.getRawValue()).subscribe(res => {
        if (res) {
          if (this.isEdit) {
            this.checkValidRecordCheckCategory();
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getRecordCheckList();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.recordCheckFormgroup.markAllAsTouched();
    }

  }
  deleteRecordCheckCategory() {
    this.masterService.deleteRecordCheckCategory(this.data.recordCheckCategoryId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getRecordCheckList();
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
  checkValidRecordCheckCategory() {
    const recCategoryName = this.recordCheckFormgroup.controls.recordCheckCategoryName.value.replace(/\s/g, '');
    if (recCategoryName === '' || recCategoryName === null || recCategoryName === undefined) {
      return;
    }
    const x = this.recordCheckCategoryList.filter(e => e.recordCheckCategoryName.replace(/\s/g, '') === recCategoryName);
    if (x.length !== 0) {
      this.recordCheckFormgroup.controls.recordCheckCategoryName.setErrors({ incorrect: true });
    }
  }
  showall() {
    if (this.recordCheckCategoryList.length > 0) {
      this.itemperpage = this.recordCheckCategoryList.length;
    }
  }
}
