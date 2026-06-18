import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-sub-module',
  templateUrl: './sub-module.component.html',
  styleUrls: ['./sub-module.component.css']
})
export class SubModuleComponent implements OnInit {
  itemperpage;
  showFlag = false;
  subModuleForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  subModuleList: any;
  displayedColumns = [
    { field: 'moduleName', header: 'Module Name' },
    { field: 'subModuleName', header: 'Sub Module Name' },
    { field: 'applicationName', header: 'Application Name' },
    { field: 'displayOrder', header: 'Display Order' },
    { field: 'active', header: 'Active' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  applicationControls!: AutoCompleteDropDown;
  moduleControls!: AutoCompleteDropDown;
  moduleList: any;

  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    private master: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.common.getApplicationList();
    this.GetAllSubmodule(0);
    this.itemperpage = 10;
  }
  GetAllModule() {
    this.master.GetAllModule().subscribe(resp => {
      if (resp) {
        this.moduleList = resp;
        this.moduleControls = new AutoCompleteDropDown('Module Name', 'moduleId', 'moduleId', 'moduleName',
          this.moduleList, '', this.subModuleForm, false, false, true);
      }
    });
  }
  addForm() {
    this.GetAllModule();
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.backForm();
  }
  initFormGroup() {
    this.subModuleForm = this.fb.group({
      moduleId: [, Validators.required],
      moduleName: [''],
      subModuleId: [0],
      subModuleName: ['', Validators.required],
      displayOrder: [, Validators.required],
      applicationId: [, Validators.required],
      active: [true],
      loggedIn: [this.userData.userId],
    });
    this.applicationControls = new AutoCompleteDropDown('Application Name', 'applicationId', 'applicationId', 'applicationName',
      this.common.applicationList, '', this.subModuleForm, false, false, true);
    this.moduleControls = new AutoCompleteDropDown('Module Name', 'moduleId', 'moduleId', 'moduleName',
      this.moduleList, '', this.subModuleForm, false, false, true);
  }
  GetAllSubmodule(subModuleId: any) {
    this.master.GetAllSubmodule(subModuleId).subscribe(resp => {
      if (resp) {
        this.subModuleList = resp;
        this.subModuleList.forEach(element => {
          element.applicationName = this.common.applicationList.
            find(x => x.applicationId === element.applicationId).applicationName;
        });
        this.currentPage = 1;
      }
    });
  }
  saveForm() {
    if (this.subModuleForm.valid) {
      this.master.AddUpdateSubModule(this.subModuleForm.getRawValue()).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', this.subModuleForm.value.subModuleId > 0
            ? 'Updated Successfully' : 'Saved Successfully');
          this.backForm();
          this.GetAllSubmodule(0);
        }
      });
    } else {
      this.subModuleForm.markAllAsTouched();
    }
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.initFormGroup();
      this.getPatchValue(this.common.tempResetData);
    } else {
      this.initFormGroup();
      this.subModuleForm.markAsPristine();
    }
  }
  backForm() {
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  resetTable() {
    this.global.nativeElement.value = '';
    this.dt.reset();
  }
  getPatchValue(val: any) {
    setTimeout(() => {
      this.common.tempResetData = val;
      this.subModuleForm.patchValue({
        moduleId: val.moduleId,
        active: val.active,
        moduleName: val.moduleName,
        applicationId: val.applicationId,
        displayOrder: val.displayOrder,
        subModuleId: val.subModuleId,
        subModuleName: val.subModuleName
      });
    }, 10);
  }
  editForm(data: any) {
    this.GetAllModule();
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Update';
    this.backForm();
    this.master.GetAllSubmodule(data.subModuleId).subscribe(resp => {
      if (resp) {
        this.getPatchValue(resp[0]);
      }
    });
  }
  deleteForm(data: any) {
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
            this.DeleteSubModuleById(data);
          }
        }
      });
    }
  }
  DeleteSubModuleById(data: any) {
    this.master.DeleteSubModuleById(data.subModuleId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetAllSubmodule(0);
        this.dt.reset();
      }
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
  showall() {
    if (this.subModuleList.length > 0) {
      this.itemperpage = this.subModuleList.length;
    }
  }
}
