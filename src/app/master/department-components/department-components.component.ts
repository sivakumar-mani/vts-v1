import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { ComponentType, DeptComponent } from 'src/app/common-methods/models/deptComponent';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-department-components',
  templateUrl: './department-components.component.html',
  styleUrls: ['./department-components.component.css']
})
export class DepartmentComponentsComponent implements OnInit {
  departmentFormGroup: UntypedFormGroup;
  showFlag = false;
  compList: ComponentType[] = [];
  departmentList: any[] = [];
  deptComponentList: any[] = [];
  depComponent = new DeptComponent();
  departmentfilterlist: any[] = [];
  selectedCompList: ComponentType[] = [];
  selectedCompDupList: ComponentType[] = [];
  filteredOptions: Observable<ComponentType[]>;
  departmentName = new UntypedFormControl();
  displayedColumns = [
    { field: 'departmentName', header: 'Department Name' },
    { field: 'component', header: 'Component Names' },
    // { field: 'Actions', header: 'Action' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  routePath = 'Configure / User / Department Components';
  userData: any;
  itemperpage;
  filterDept: any;
  filterComp: any;
  isEdit: boolean;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
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
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.getComponentDepartmentList();
    this.getComponentList();
    this.getDepartmentList();
    this.itemperpage= 10;
  }
  initFormGroup() {
    this.departmentFormGroup = this.fb.group({
      departCompId: [0],
      departId: ['', Validators.required],
      compName: [],
      active: [false],
      createdUserId: [this.userData.userId]
    });
  }
  getComponentDepartmentList() {
    this.masterService.getComponentDepartment(0).subscribe(res => {
      this.deptComponentList = res;
    });
  }
  getComponentList() {
    this.masterService.getAllComponents().subscribe(res => {
      this.compList = res;
      this.compList.map(m => { delete m.compShotName; delete m.departCompId; });
    });
  }
  getDepartmentList() {
    this.masterService.getDepartment().subscribe(res => {
      this.departmentList = res;
      this.departmentItems('');
    });
  }

  addComponent(comp: ComponentType) {
    this.selectedCompDupList = [];
    this.compList = this.compList.filter(e => e.componentId !== comp.componentId);
    this.selectedCompDupList = Object.assign(comp);
  }
  removeComponent(comp: ComponentType) {
    this.selectedCompDupList = this.selectedCompDupList.filter(e => e.componentId !== comp.componentId);
    // this.compList = this.compList.filter(e => e.componentId !== comp.componentId);
    // this.compList.push(comp);
  }
  saveDeptComponents() {
    this.departmentFormGroup.get('compName')?.markAsTouched();
    if (this.departmentFormGroup.valid && this.selectedCompDupList.length > 0) {
      this.selectedCompList.forEach(ele => {
        if (this.selectedCompDupList.filter(e => e.componentId === ele.componentId).length === 0) {
          ele.active = false;
          // this.selectedCompDupList=[...ele];
          this.selectedCompDupList.push(ele);
        }
      });

      this.depComponent.departId = this.departmentFormGroup.controls.departId.value;
      this.depComponent.createdUserId = this.userData.userId;
      this.depComponent.component = this.selectedCompDupList;
      this.masterService.saveDeptComponent(this.depComponent).subscribe(res => {
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
  editDetail(src: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.selectedCompList = [];
    this.selectedCompDupList = [];
    this.masterService.getComponentDepartment(src.departId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0];
        this.common.tempResetData.component.map(m => { delete m.compShotName; delete m.departCompId; });
        this.departmentFormGroup.patchValue({
          departId: this.common.tempResetData.departId,
          // departCompId: this.common.tempResetData.component[0].departCompId,
          compName: this.common.tempResetData.component
        });
        this.selectedCompList = this.common.CloneObject(this.common.tempResetData.component);
        this.selectedCompDupList = this.common.CloneObject(this.common.tempResetData.component);
      }
    });
    this.getComponentList();
    this.getDepartmentList();
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  resetForm() {
    this.masterService.getDepartment().subscribe(res => {
      this.departmentList = res;
      this.departmentItems('');
      if (this.common.tempResetData) {
        // if (this.common.tempResetData.component[0].departCompId > 0) {
          // this.departmentFormGroup.patchValue({
          //   departCompId: this.common.tempResetData.component[0].departCompId,
          // });
          this.departmentFormGroup.controls.departCompId.setValue(this.common.tempResetData.departCompId);
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
          e.departmentName.toLowerCase() === value.toLowerCase());
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
          department = this.departmentfilterlist.find(x => x.departmentId === department);
          return department.departmentName;
        } else {
          return null;
        }
      }
    };
    return departmentNew;
  }

  // Resource ..
  departmentItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.departmentfilterlist = Object.assign([], this.departmentList).filter(
        item => ((item.departmentName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignResourceCopy() {
    this.departmentfilterlist = Object.assign([], this.departmentList);
  }

  closeForm() {
    this.departmentFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.tempResetData  = [];
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
  showall(){
    if(this.deptComponentList.length>0){
      this.itemperpage=this.deptComponentList.length;
    }
  }
  
  navigatePage(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
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
  
  viewDetail(src: any) {
    this.breadcrumbFlags.btnBack = true;
    this.breadcrumbFlags.btnReset = false;
    this.breadcrumbFlags.btnResetTbl = false;
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnAdd = false;
    this.masterService.getComponentDepartment(src.departId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0];
        this.common.tempResetData.component.map(m => { delete m.compShotName; delete m.departCompId; });
        this.departmentFormGroup.patchValue({
          departId: this.common.tempResetData.departId,
          compName: this.common.tempResetData.component
        });
        this.selectedCompList = this.common.CloneObject(this.common.tempResetData.component);
        this.selectedCompDupList = this.common.CloneObject(this.common.tempResetData.component);
      }
    });
    this.showFlag = !this.showFlag;
  }
}
