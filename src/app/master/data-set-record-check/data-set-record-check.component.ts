import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';

import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-data-set-record-check',
  templateUrl: './data-set-record-check.component.html',
  styleUrls: ['./data-set-record-check.component.css']
})
export class DataSetRecordCheckComponent implements OnInit {
  itemperpage;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  routePath = 'Configure / Record Check';
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
  recordCheckForm: UntypedFormGroup;
  isEdit: boolean;
  recordCheckComponentList: any[] = [];
  displayedColumns = [
    { field: 'recordCheckName', header: 'Record Check Name' },
    { field: 'recordCheckDesc', header: 'Description' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' }
  ];

  // tslint:disable-next-line: max-line-length
  constructor(private masterService: MasterService, public common: CommonService, private auth: AuthService, private message: MessageService, private fb: UntypedFormBuilder, public dialog: MatDialog,
    private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getRecCheckCompList();
    this.initFormGroup();
    this.itemperpage = 10;
  }
  getRecCheckCompList() {
    this.masterService.getAllRecordCheck().subscribe(res => {
      if (res != null) {
        this.recordCheckComponentList = res;
      }
    });
  }
  initFormGroup() {
    this.recordCheckForm = this.fb.group({
      recordCheckId: new UntypedFormControl(0),
      recordCheckName: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
      recordCheckDesc: new UntypedFormControl('', Validators.required),
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
  addReordDataSetMas() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.recordCheckForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetForm() {
    const editRecordCheckId = this.recordCheckForm.controls.recordCheckId.value;
    this.recordCheckForm.controls.recordCheckId.setValue(0);
    this.recordCheckForm.reset();
    this.recordCheckForm.markAsPristine();
    this.initFormGroup();
    if (this.isEdit) {
      this.recordCheckForm.controls.recordCheckId.setValue(editRecordCheckId);
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
    this.recordCheckForm.patchValue(data);
    this.recordCheckForm.controls.createdUserId.setValue(this.userData.userId);
    this.showFlag = !this.showFlag;
    this.isEdit = true;
    if (mode === 'view') {
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
      this.recordCheckForm.disable();
    }
  }
  saveRecordSetMaster() {
    if (this.recordCheckForm.valid) {
      this.masterService.saveRecordCheckDetails(this.recordCheckForm.getRawValue()).subscribe(res => {
        if (res) {
          if (this.isEdit) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getRecCheckCompList();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.recordCheckForm.markAllAsTouched();
    }
  }

  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  deleteRecordCheck() {
    this.masterService.deleteRecordCheck(this.data.recordCheckId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getRecCheckCompList();
      }
    });
  }
  checkValidRecordCheck() {
    const recChkName = this.recordCheckForm.controls.recordCheckName.value.replace(/\s/g, '');
    if (recChkName === '' || recChkName === null || recChkName === undefined) {
      return;
    }
    const x = this.recordCheckComponentList.filter(e => e.recordCheckName.toUpperCase().replace(/\s/g, '') === recChkName);
    if (x.length !== 0) {
      this.recordCheckForm.controls.recordCheckName.setErrors({ incorrect: true });
    }
  }
  showall() {
    if (this.recordCheckComponentList.length > 0) {
      this.itemperpage = this.recordCheckComponentList.length;
    }
  }
}

