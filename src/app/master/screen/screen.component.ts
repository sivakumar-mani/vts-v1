import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {
  itemperpage;
  showFlag = false;
  screenForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  subModuleList: any;
  displayedColumns = [
    { field: 'screenName', header: 'Screen Name' },
    { field: 'moduleName', header: 'Module Name' },
    { field: 'subModuleName', header: 'Sub Module Name' },
    { field: 'applicationName', header: 'Application Name' },
    { field: 'routingUrl', header: 'Routing Url' },
    { field: 'displayOrder', header: 'Display Order' },
    { field: 'active', header: 'Active' },
    { field: 'disabledView', header: 'Disabled View' },
    { field: 'disabledAdd', header: 'Disabled Add' },
    { field: 'disabledEdit', header: 'Disabled Edit' },
    { field: 'disabledDelete', header: 'Disabled Delete' },
    { field: 'disabledApprove', header: 'Disabled Approve' },
    { field: 'disabledExport', header: 'Disabled Export' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  applicationControls!: AutoCompleteDropDown;
  moduleControls!: AutoCompleteDropDown;
  moduleList: any;
  subModuleControls!: AutoCompleteDropDown;
  screenList: any;
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    private master: MasterService, private message: MessageService, public dialog: MatDialog, private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.common.getApplicationList();
    this.GetAllScreen();
    this.itemperpage = 10;
  }
  GetAllModule() {
    this.master.GetAllModule().subscribe(resp => {
      if (resp) {
        this.moduleList = resp;
        this.moduleControls = new AutoCompleteDropDown('Module Name', 'moduleId', 'moduleId', 'moduleName',
          this.moduleList, '', this.screenForm, false, false, true);
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
    this.screenForm = this.fb.group({
      screenId: [0],
      applicationId: [, Validators.required],
      moduleId: [, Validators.required],
      subModuleId: [],
      screenName: ['', Validators.required],
      displayOrder: [, Validators.required],
      disabledView: [true],
      disabledAdd: [true],
      disabledEdit: [true],
      disabledDelete: [true],
      disabledApprove: [true],
      disabledExport:[true],
      routingUrl: ['', Validators.required],
      active: [true],
      loggedIn: [this.userData.userId],
    });
    this.applicationControls = new AutoCompleteDropDown('Application Name', 'applicationId', 'applicationId', 'applicationName',
      this.common.applicationList, '', this.screenForm, false, false, true);
    this.moduleControls = new AutoCompleteDropDown('Module Name', 'moduleId', 'moduleId', 'moduleName',
      this.moduleList, '', this.screenForm, false, false, true);
    this.subModuleControls = new AutoCompleteDropDown('Sub Module Name', 'subModuleId', 'subModuleId', 'subModuleName',
      this.subModuleList, '', this.screenForm, false, false, false);
    this.screenForm.get('subModuleId')?.disable();
  }
  GetAllSubmodule(moduleId: any) {
    this.master.GetAllSubmodule(0).subscribe(resp => {
      if (resp) {
        this.subModuleList = resp.filter(x => x.moduleId === moduleId);
        this.subModuleControls = new AutoCompleteDropDown('Sub Module Name', 'subModuleId', 'subModuleId', 'subModuleName',
          this.subModuleList, '', this.screenForm, false, false, false);
        if (this.subModuleList.length > 0) {
          this.screenForm.get('subModuleId')?.enable();
        } else {
          this.screenForm.get('subModuleId')?.disable();
        }
      }
    });
  }
  GetAllScreen() {
    this.master.GetAllScreen().subscribe(resp => {
      if (resp) {
        this.screenList = resp;
        this.screenList.map(x => x.applicationName = (this.common.getNameById(this.common.applicationList,
          'applicationId', 'applicationName', x.applicationId)));
        this.currentPage = 1;
      }
    });
  }
  saveForm() {
    if (this.screenForm.valid) {
      this.master.AddUpdateScreen(this.screenForm.value).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', this.screenForm.value.subModuleId > 0
            ? 'Updated Successfully' : 'Saved Successfully');
          this.backForm();
          this.GetAllScreen();
        }
      });
    } else {
      this.screenForm.markAllAsTouched();
    }
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.initFormGroup();
      this.getPatchValue(this.common.tempResetData);
    } else {
      this.initFormGroup();
      this.screenForm.markAsPristine();
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
    this.GetAllSubmodule(val.moduleId);
    // setTimeout(() => {
      this.common.tempResetData = val;
      this.screenForm.patchValue({
        screenId: val.screenId,
        applicationId: val.applicationId,
        moduleId: val.moduleId,
        subModuleId: val.subModuleId,
        screenName: val.screenName,
        displayOrder: val.displayOrder,
        routingUrl: val.routingUrl,
        active: val.active,
        disabledView: val.disabledView,
        disabledAdd: val.disabledAdd,
        disabledEdit: val.disabledEdit,
        disabledDelete: val.disabledDelete,
        disabledApprove: val.disabledApprove,
        disabledExport: val.disabledExport,
      });
    // }, 10);
  }
  editForm(data: any) {
    this.GetAllModule();
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Update';
    this.backForm();
    this.master.GetScreenById(data.screenId).subscribe(resp => {
      if (resp) {
        this.getPatchValue(resp);
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
            this.DeleteScreen(data);
          }
        }
      });
    }
  }
  DeleteScreen(data: any) {
    this.master.DeleteScreenById(data.screenId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetAllScreen();
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
    if (this.screenList.length > 0) {
      this.itemperpage = this.screenList.length;
    }
  }
}
