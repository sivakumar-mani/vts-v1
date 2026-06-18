import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { CommonService } from 'src/app/common-methods/services/common.service';
import { ScreenAuth } from '../../common-methods/models/screen-auth';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css']
})
export class DepartmentDetailsComponent implements OnInit {

  displayedColumns = [
    { field: 'departmentName', header: 'Department Name' },
    { field: 'departDescription', header: 'Department Description' },
    { field: 'active', header: 'Active' },
  ];

  frozenCols = [
    { field: 'action', header: 'Action' },
  ];

  deptList: DepartComp[] = [];

  @ViewChild('departmentNameCtrlTrigger', { static: true }) departmentNameCtrlTrigger: MatMenuTrigger;
  departmentNameFilteredOptions: Observable<string[]>;
  departmentNameControl = new UntypedFormControl();

  @ViewChild('departDescCtrlTrigger', { static: true }) departDescCtrlTrigger: MatMenuTrigger;
  departDescFilteredOptions: Observable<string[]>;
  departDescControl = new UntypedFormControl();

  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  routePath = 'Configure / User / Department';
  DepartmentForm: UntypedFormGroup;
  MailForm: UntypedFormGroup;
  dispalyTable = true;
  breadcrumbFlag = new BreadcrumbFlags();
  screenAuth: ScreenAuth = new ScreenAuth();
  currDeptNotifyDet: DepartmentNotify[] = [];
  createdUserId: number;
  mailTypeList: LookUpValue[] = [];

  constructor(public masterService: MasterService, private common: CommonService,
    private fb: UntypedFormBuilder, private message: MessageService, private authService: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.dispalyTable = true;
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.createdUserId = +JSON.parse(sessionStorage.getItem('user_data')).userId;
    this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.loadDepartments();
    this.getMailType();
  }

  openForm() {
    this.breadcrumbFlag.toolTip = 'Save';
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.dispalyTable = false;
    this.initFormGroup();
    // this.initEmailFormGroup();
  }

  closeForm() {
    this.DepartmentForm.reset();
    this.dispalyTable = !this.dispalyTable;
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.currDeptNotifyDet = [];
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnReset = false;
  }

  initFormGroup() {
    this.DepartmentForm = this.fb.group({
      deptName: ['', Validators.required],
      deptDesc: ['', Validators.required],
      isActive: [true],
      deptId: [0]
    });
  }

  initEmailFormGroup() {
    this.MailForm = this.fb.group({
      deptNotifyId: [0],
      emailAddress: new UntypedFormControl('', [Validators.required, Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1)])]),
      active: [true],
      emailTypeLookupId: [, Validators.required],
    });
  }

  loadDepartments() {
    this.masterService.GetDepartmentNotify().subscribe(res => {
      if (res) {
        this.deptList = res;
      }
    }, err => { }, () => {
      this.genAutoCompleteFilter();
    });
  }

  isDeptExist() {
    const deptName = this.DepartmentForm.controls['deptName'].value.toString().trim();
    if (deptName.length > 0) {
      const isEdit = this.DepartmentForm.controls['deptId'].value !== 0;
      if (!isEdit) {
        this.masterService.CheckDepartmentName(deptName).subscribe(res => {
          if (res) {
            this.showTopCenter('error', 'Success Message', 'Department Name already exist');
            this.DepartmentForm.controls['deptName'].setValue(undefined);
          }
        });
      } else {
        if (this.common.tempResetData.departmentName !== deptName) {
          this.masterService.CheckDepartmentName(deptName).subscribe(res => {
            if (res) {
              this.showTopCenter('error', 'Success Message', 'Department Name already exist');
              this.DepartmentForm.controls['deptName'].setValue(this.common.tempResetData.compName);
            }
          });
        }
      }
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

  addDepartment() {
    // if (this.currDeptNotifyDet.filter(e => e.active === true).length === 0) {
    //   this.showTopCenter('warn', 'Failure Message', 'Add Department details');
    //   return;
    // }
    if (this.DepartmentForm.valid) {
      const departData: DepartComp = {
        departId: this.DepartmentForm.controls['deptId'].value,
        createdUserId: this.createdUserId,
        departmentName: this.DepartmentForm.controls['deptName'].value,
        departDescription: this.DepartmentForm.controls['deptDesc'].value,
        active: this.DepartmentForm.controls['isActive'].value,
        logginId: this.createdUserId,
        deptNotifyDet: this.currDeptNotifyDet,
        component: []
      };
      this.masterService.AddDepartmentNotify(departData).subscribe(res => {
        if (res.success) {
          if (departData.departId > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.currDeptNotifyDet = [];
          this.loadDepartments();
          this.closeForm();
        } else {
          this.showTopCenter('error', 'Success Message', 'Failed to add');
        }
      }, (err) => {
        console.error(err);
      }, () => {
      });
    } else {
      this.DepartmentForm.markAllAsTouched();
    }
  }

  getDepartmentsById(id: number) {
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.breadcrumbFlag.toolTip = 'Update';
    this.initFormGroup();
    // this.initEmailFormGroup();
    this.masterService.GetDepartmentNotify(id).subscribe(res => {

      const data: DepartComp = res[0];
      this.DepartmentForm.patchValue({
        deptName: data.departmentName,
        deptDesc: data.departDescription,
        isActive: data.active,
        deptId: data.departId
      });

      // data.deptNotifyDet.forEach(e => {
      //   const departmentNotify: DepartmentNotify = {
      //     deptNotifyId: e.deptNotifyId,
      //     emailAddress: e.emailAddress,
      //     emailTypeLookupId: e.emailTypeLookupId,
      //     active: e.active
      //   };
      //   this.currDeptNotifyDet.push(departmentNotify);
      // });

      this.common.tempResetData = {
        departmentName: data.departmentName,
        departDescription: data.departDescription,
        active: data.active,
        departId: data.departId,
        // currDeptNotifyDet: this.currDeptNotifyDet
      };

    });
    this.dispalyTable = false;
  }

  removeEmail(data: any) {
    this.currDeptNotifyDet.filter(e => e === data)[0].active = false;
  }

  addEmail() {

    if (this.currDeptNotifyDet.filter(e => e.emailAddress === this.MailForm.controls['emailAddress'].value).length > 0) {
      alert('Email already exist'); return;
    }
    if (!this.MailForm.controls['emailAddress'].value) {
      this.MailForm.controls['emailAddress'].setValidators(Validators.required);
    } else if (!this.MailForm.controls['emailTypeLookupId'].value) {
      this.MailForm.controls['emailTypeLookupId'].setValidators(Validators.required);
    } else if (this.MailForm.valid) {
      this.currDeptNotifyDet.push(this.MailForm.value);
      this.MailForm.controls['emailAddress'].setValue('');
      this.MailForm.controls['emailTypeLookupId'].setValue('');
      this.MailForm.controls['active'].setValue(false);

      this.MailForm.controls['emailAddress'].clearValidators();
      this.MailForm.controls['emailTypeLookupId'].clearValidators();
    }
    this.MailForm.controls['emailAddress'].updateValueAndValidity();
    this.MailForm.controls['emailTypeLookupId'].updateValueAndValidity();
  }

  resetForm() {
    if (this.DepartmentForm.controls.deptId.value > 0) {
      this.DepartmentForm.patchValue({
        deptName: this.common.tempResetData.departmentName,
        deptDesc: this.common.tempResetData.departDescription,
        isActive: this.common.tempResetData.active,
        deptId: this.common.tempResetData.departId,
      });
      // this.currDeptNotifyDet = this.common.tempResetData.currDeptNotifyDet;
    } else {
      this.DepartmentForm.controls['deptId'].setValue(0);
      this.DepartmentForm.reset();
      this.DepartmentForm.markAsPristine();
    }
  }

  deleteDept() {

  }

  getMailType() {
    this.masterService.GetDepartmentEmailTypes().subscribe(res => {
      this.mailTypeList = res;
    });
  }

  resetTable() { this.dt.reset(); }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  genAutoCompleteFilter() {
    this.departmentNameFilteredOptions = this.departmentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.deptList.map(x => x.departmentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.departDescFilteredOptions = this.departDescControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.deptList.map(x => x.departDescription).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  checkvalidEmail() {
    this.MailForm.get('emailAddress')?.setValidators(Validators.compose(
      [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
  }
  viewDetail(id: number) {
    this.initFormGroup();
    this.breadcrumbFlag.btnReset = false;
    this.breadcrumbFlag.btnResetTbl = false;
    this.breadcrumbFlag.btnSave = false;
    this.breadcrumbFlag.btnAdd = false;
    this.breadcrumbFlag.btnBack = true;
    this.masterService.GetDepartmentNotify(id).subscribe(res => {
      const data: DepartComp = res[0];
      this.DepartmentForm.patchValue({
        deptName: data.departmentName,
        deptDesc: data.departDescription,
        isActive: data.active,
        deptId: data.departId
      });
      this.common.tempResetData = {
        departmentName: data.departmentName,
        departDescription: data.departDescription,
        active: data.active,
        departId: data.departId,
      };

    });
    this.dispalyTable = false;
  }
}


class DepartComp {
  departId: number;
  createdUserId: number;
  departmentName: string;
  departDescription: string;
  active?: boolean;
  logginId?: number;
  deptNotifyDet: DepartmentNotify[] = [];
  component: ComponentVm[] = [];

}

class DepartmentNotify {
  deptNotifyId: number;
  emailAddress: string;
  emailTypeLookupId: number;
  active?: boolean;
}

class ComponentVm {
  componentId: number;
  compName: string;
  compShotName: string;
  active?: boolean;
  departCompId: number;
}

class LookUpValue {
  contactId: number;
  lookUpCatId: number;
  lookUpId?: number;
  lookUpName: string;
  active?: boolean;
  lookUpValue: string;
}


