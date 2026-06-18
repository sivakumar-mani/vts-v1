import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ComponentType, DeptComponent, VerificationModelVm, ComponentTypeVm } from 'src/app/common-methods/models/deptComponent';
import { Table } from 'primeng/table';           // FIX 1: DataTable → Table
import { MessageService } from 'primeng/api';    // FIX 2: primeng/primeng → primeng/api
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-mode-of-verification-components',
  templateUrl: './mode-of-verification-components.component.html',
  styleUrls: ['./mode-of-verification-components.component.css']
})
export class ModeOfVerificationComponentsComponent implements OnInit {
  departmentFormGroup: UntypedFormGroup;
  showFlag = false;
  departmentList: VerificationModelVm[] = [];
  compList = [];
  deptComponentList = [];
  depComponent = new ComponentTypeVm();
  departmentfilterlist = [];
  selectedCompList: VerificationModelVm[] = [];
  selectedCompDupList: VerificationModelVm[] = [];
  filteredOptions: Observable<VerificationModelVm[]>;
  departmentName = new UntypedFormControl();
  displayedColumns = [
    { field: 'compName', header: 'Component Name' },
    { field: 'lookupValue', header: 'Mode of Verification' },
    // { field: 'Actions', header: 'Action' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  routePath = 'Configure / Master / Mode Of Verification Component';
  userData: any;
  itemperpage;
  filterDept: any;
  filterComp: any;
  isEdit: boolean;
  totalpages: number;

  // FIX 3: null → { static: false }  |  DataTable → Table
  @ViewChild('dt', { static: false }) dt: Table;
  @ViewChild('global', { static: false }) global: ElementRef;

  currentPage = 1;
  tempCurrentPage = 1;
  departmentkeyUp: boolean;
  screenAuth: any = {};
  breadcrumbFlags = new BreadcrumbFlags();
  panelClosed = false;

  constructor(public common: CommonService, private masterService: MasterService,
    private message: MessageService, public departmentService: AgentEntryMasterService,
    private fb: UntypedFormBuilder, private auth: AuthService, private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.initFormGroup();
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getComponentDepartmentList();
    this.getComponentList();
    this.getDepartmentList();
    this.itemperpage = 10;
  }

  initFormGroup() {
    this.departmentFormGroup = this.fb.group({
      compId: ['', Validators.required],
      lookupName: [[], Validators.required],
      active: [false],
    });
  }

  // selected list
  getComponentDepartmentList() {
    this.masterService.GetModeOfVerificationComp(0).subscribe(res => {
      this.deptComponentList = res;
    });
  }

  // component list
  getComponentList() {
    this.masterService.getAllClientComponents().subscribe(res => {
      this.compList = res;
      this.departmentItems('');
    });
  }

  // lookup master
  getDepartmentList() {
    this.masterService.getAllModeofVerification().subscribe(res => {
      this.departmentList = res;
      this.departmentList.map(m => { delete m.compId; });
    });
  }

  addComponent(comp: VerificationModelVm) {
    this.selectedCompDupList = [];
    this.departmentList = this.departmentList.filter(e => e.lookupId !== comp.lookupId);
    this.selectedCompDupList = Object.assign(comp);
  }

  removeComponent(comp: VerificationModelVm) {
    this.selectedCompDupList = this.selectedCompDupList.filter(e => e.lookupId !== comp.lookupId);
    // this.compList = this.compList.filter(e => e.componentId !== comp.componentId);
    // this.compList.push(comp);
  }

  saveDeptComponents() {
    this.departmentFormGroup.get('lookupName').markAsTouched();
    if (this.departmentFormGroup.valid && this.selectedCompDupList.length > 0) {
      this.selectedCompList.forEach(ele => {
        if (this.selectedCompDupList.filter(e => e.lookupId === ele.lookupId).length === 0) {
          ele.active = false;
          this.selectedCompDupList.push(ele);
        }
      });
      this.depComponent.compId = this.departmentFormGroup.controls.compId.value;
      this.depComponent.createdUserId = this.userData.userId;
      this.depComponent.lookupValue = this.selectedCompDupList;
      this.masterService.AddModeofVerificationComp(this.depComponent).subscribe(res => {
        if (res.success === false) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        } else {
          if (this.isEdit) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            this.isEdit = false;
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getComponentDepartmentList();
          this.closeForm();
        }
      });
    } else {
      this.departmentFormGroup.markAllAsTouched();
    }
  }

  editDetail(src) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.selectedCompList = [];
    this.selectedCompDupList = [];
    this.masterService.GetModeOfVerificationComp(src.compId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0].lookupValue;
        const matchedObjects = this.departmentList.filter(opt =>
          this.common.tempResetData.some(sel => sel.lookupId === opt.lookupId)
        );
        this.departmentFormGroup.patchValue({
          compId: res[0].compId,
          lookupName: matchedObjects
        });
        this.selectedCompList = this.common.CloneObject(matchedObjects); // res[0].lookupValue);
        this.selectedCompDupList = this.common.CloneObject(matchedObjects); // res[0].lookupValue);
      }
    });
    this.getComponentList();
    this.getDepartmentList();
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }

  resetForm() {
    this.masterService.getDepartment().subscribe(res => {
      this.compList = res;
      this.departmentItems('');
      if (this.common.tempResetData) {
        this.departmentFormGroup.controls.compId.setValue(this.common.tempResetData.compId);
        this.departmentFormGroup.controls.departId.setValue(this.common.tempResetData.departId);
        // this.compList = this.common.tempResetData.component;
        this.selectedCompList = this.common.tempResetData.component;
        this.selectedCompDupList = this.common.tempResetData.component;
        // }
      } else {
        this.selectedCompList = [];
        this.selectedCompDupList = [];
        this.departmentFormGroup.reset();
        this.departmentFormGroup.markAsPristine();
      }
    });
  }

  departmentKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const department = this.departmentfilterlist.filter(e =>
          e.compName.toLowerCase() === value.toLowerCase());
        if (department.length > 0) {
          this.departmentkeyUp = true;
        } else {
          this.departmentkeyUp = true;
        }
      } else {
        this.departmentkeyUp = false;
      }
    }
  }

  get displaydepartmentFn() {
    const departmentNew = (department) => {
      if (department == null || department === undefined) {
        return null;
      } else {
        if (department && this.departmentfilterlist && this.departmentfilterlist.length > 0) {
          department = this.departmentfilterlist.find(x => x.compId === department);
          return department.compName;
        } else {
          return null;
        }
      }
    };
    return departmentNew;
  }

  // Resource ..
  departmentItems(value) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.departmentfilterlist = Object.assign([], this.compList).filter(
        item => ((item.compName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }

  assignResourceCopy() {
    this.departmentfilterlist = Object.assign([], this.compList);
  }

  closeForm() {
    this.departmentFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.tempResetData = [];
    this.common.tempResetData.component = [];
    this.selectedCompDupList = [];
    this.currentPage = 1;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
  }

  addDepartment() {
    this.initFormGroup();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.selectedCompList = [];
    this.selectedCompDupList = [];
    this.showFlag = !this.showFlag;
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
    if (this.deptComponentList.length > 0) {
      this.itemperpage = this.deptComponentList.length;
    }
  }

  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      // FIX 4: onPageChange() removed → use first/rows directly
      this.dt.first = (pageNo - 1) * rowscount;
      this.dt.rows = rowscount;
      this.tempCurrentPage = this.currentPage;
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }

  viewDetail(src) {
    this.breadcrumbFlags.btnBack = true;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnAdd = false;
    this.masterService.GetModeOfVerificationComp(src.compId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0].lookupValue;
        const matchedObjects = this.departmentList.filter(opt =>
          this.common.tempResetData.some(sel => sel.lookupId === opt.lookupId)
        );
        this.departmentFormGroup.patchValue({
          compId: res[0].compId,
          lookupName: matchedObjects
        });
        this.selectedCompList = this.common.CloneObject(res[0].lookupValue);
        this.selectedCompDupList = this.common.CloneObject(res[0].lookupValue);
      }
    });
    this.showFlag = !this.showFlag;
  }
}