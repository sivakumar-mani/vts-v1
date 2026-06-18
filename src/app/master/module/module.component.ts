import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  itemperpage;
  showFlag = false;
  moduleForm: UntypedFormGroup;
  breadcrumbFlags = new BreadcrumbFlags();
  userData: any;
  screenAuth: any = {};
  moduleList: any;
  displayedColumns = [
    { field: 'moduleName', header: 'Module Name' },
    { field: 'applicationName', header: 'Application Name' },
    { field: 'displayOrder', header: 'Display Order' },
    { field: 'active', header: 'Active' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  applicationList: any;
  applicationControls!: AutoCompleteDropDown;

  constructor(private authservice: AuthService, public common: CommonService, private fb: UntypedFormBuilder,
    private master: MasterService, private message: MessageService, public dialog: MatDialog,
    private router: Router, ) { }

  ngOnInit() {
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.common.getApplicationList();
    this.GetAllModule();
    this.itemperpage = 10;
  }
  addForm() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.backForm();
  }
  initFormGroup() {
    this.moduleForm = this.fb.group({
      moduleId: [0],
      moduleName: ['', Validators.required],
      displayOrder: [],
      applicationId: [],
      active: [true],
      loggedIn: [this.userData.userId],
    });
    this.applicationControls = new AutoCompleteDropDown('Application Name', 'applicationId', 'applicationId', 'applicationName',
      this.common.applicationList, '', this.moduleForm, false, false, true);
  }
  GetAllModule() {
    this.master.GetAllModule().subscribe(resp => {
      if (resp) {
        this.moduleList = resp;
        this.moduleList.forEach(element => {
          element.applicationName = this.common.applicationList.
            find(x => x.applicationId === element.applicationId).applicationName;
        });
        this.currentPage = 1;
      }
    });
  }
  saveForm() {
    if (this.moduleForm.valid) {
      this.master.AddUpdateModule(this.moduleForm.getRawValue()).subscribe(resp => {
        if (resp) {
          this.showTopCenter('success', 'Success Message', this.moduleForm.value.moduleId > 0
            ? 'Updated Successfully' : 'Saved Successfully');
          this.backForm();
          this.GetAllModule();
        }
      });
    } else {
      this.moduleForm.markAllAsTouched();
    }
  }
  getPatchForm(val: any) {
    setTimeout(() => {
      this.common.tempResetData = val;
      this.moduleForm.patchValue({
        moduleId: val.moduleId,
        active: val.active,
        moduleName: val.moduleName,
        applicationId: val.applicationId,
        displayOrder: val.displayOrder
      });
    }, 10);
  }
  resetForm() {
    if (this.breadcrumbFlags.toolTip === 'Update') {
      this.getPatchForm(this.common.tempResetData);
    } else {
      this.initFormGroup();
      this.moduleForm.markAsPristine();
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
  editForm(data: any) {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Update';
    this.backForm();
    this.master.GetModuleById(data.moduleId).subscribe(resp => {
      if (resp) {
        this.getPatchForm(resp);
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
            this.DeleteModuleById(data);
          }
        }
      });
    }
  }
  DeleteModuleById(data: any) {
    this.master.DeleteModuleById(data.moduleId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.GetAllModule();
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
    if (this.moduleList.length > 0) {
      this.itemperpage = this.moduleList.length;
    }
  }
}
