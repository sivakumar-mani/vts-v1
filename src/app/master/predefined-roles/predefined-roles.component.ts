import {  ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// import { trigger, style, state, animate, transition } from '@angular/animations';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { Observable, from } from 'rxjs';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { MatMenuTrigger } from '@angular/material/menu';


import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';


@Component({
  standalone: false,
  selector: 'app-predefined-roles',
  templateUrl: './predefined-roles.component.html',
  styleUrls: ['./predefined-roles.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class PredefinedRolesComponent implements OnInit {
  checkboxPosition = 'before';

  createUser: any[] = [];

  cols = [{ field: 'uname', header: 'User Name' },
  { field: 'fname', header: 'First Name' },
  { field: 'lname', header: 'Last Name' },
  { field: 'isactive', header: 'Is Active' },
    // { field: 'action', header: 'Action' }
  ];
   @ViewChild('dt', { static: false }) dt!: Table;
  modulecols = [{ field: 'moduleName', header: 'Module Name' },
    // { field: 'addFlag', header: 'Add' },
    // { field: 'viewFlag', header: 'View' },
    // { field: 'editFlag', header: 'Edit' },
    // { field: 'deleteFlag', header: 'Delete' }
  ];

  subModulecols = [
    { field: 'SubModuleName', header: 'SubmModule Name' },
    { field: 'viewFlag', header: 'View' },
    { field: 'addFlag', header: 'Add' },
    { field: 'editFlag', header: 'Edit' },
    { field: 'deleteFlag', header: 'Delete' },
    { field: 'exportFlag', header: 'Export' }];

  screenModulecols = [{ field: 'ScreenName', header: 'Screen Name' },
  { field: 'viewFlag', header: 'View' },
  { field: 'addFlag', header: 'Add' },
  { field: 'editFlag', header: 'Edit' },
  { field: 'deleteFlag', header: 'Delete' },
  { field: 'approveFlag', header: 'Approve' },
  { field: 'exportFlag', header: 'Export' }];

  @ViewChild('roleNameCtrlTrigger', { static: true }) 
roleNameCtrlTrigger!: MatMenuTrigger;
  roleNameFilteredOptions: Observable<string[]>;
  roleNameControl = new UntypedFormControl();

  @ViewChild('applicationNameCtrlTrigger', { static: true }) applicationNameCtrlTrigger: MatMenuTrigger;
  applicationNameFilteredOptions: Observable<string[]>;
  applicationNameControl = new UntypedFormControl();

  rolePermissionFormGroup: UntypedFormGroup;

  rolePermissionList: RolePermission;
  UserTypeDeptList: UserTypeDept;
  userTypeList: LookUpValue[] = [];

  userTypeFilteredOptions: Observable<any>;

  screenModuleList: ScreenModule[] = [];
  saveRolePermissionList: SaveRolePermission[] = [];
  roleList: Role[] = [];
  expandedRows: any[] = [];
  response = new Response();
  screenPermissionDetail: ScreenPermissionDetail[] = [];
  isTableChanged = false;
  headerName = 'Role List';
  // @ViewChild('ngFormIdd', undefined) ngFormIdd: NgForm;
  @ViewChild('ngFormIdd', { static: true })
ngFormIdd!: NgForm;

  rolefilterlist: any[] = [];
  rolekeyUp = false;

  systemfilterlist: any[] = [];
  systemkeyUp = false;

  userTypefilterlist: any[] = [];
  userTypekeyUp = false;

  deptTypefilterlist: any[] = [];
  deptTypekeyUp = false;
  filedname = [
    { field: 'roleName', header: 'Role Name' },
    { field: 'applicationName', header: 'Application Name' },
  ];

  // roleNameFormCtrl = new UntypedFormControl();
  // roleNameFilteredOptions: Observable<string[]>;
  // @ViewChild('roleNameTrigger', { static: true }) roleNameTrigger: MatMenuTrigger;
  // applicationNameFormCtrl = new UntypedFormControl();
  // applicationNameFilteredOptions: Observable<string[]>;
  // @ViewChild('applicationNameTrigger', { static: true }) applicationNameTrigger: MatMenuTrigger;

  isGridPage = false;
  routePath = '';
  isEdit = false;
  roleId = 0;
  systemId = 0;
  currentPath = '';
  screenAuth: any = {};
  roleNameLabel = null;
  breadcrumbFlag = new BreadcrumbFlags();
  constructor(private router: Router, private masterService: MasterService, private fb: UntypedFormBuilder,
    private messageService: MessageService, private common: CommonService, private authservice: AuthService
  ) {

  }

  ngOnInit() {
    this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.getScreenPermissionDetail();
    this.initForm();
    this.currentPath = (this.router.url).split('/')[(this.router.url).split('/').length - 1];
    if (this.currentPath === 'roles') {
      this.screenAuth = this.authservice.getScreenAuth(this.router.url);
      this.routePath = 'Configure / User / Roles';
    } else if (this.currentPath === 'clientroles') {
      this.screenAuth = this.authservice.getScreenAuth(this.router.url);
      this.routePath = 'Client / Role List';
    }
  }
  openForm() {
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.isEdit = false;
    this.breadcrumbFlag.toolTip = 'Save';
    this.headerName = 'Add Roles';
    this.initFormGroup();
    this.isGridPage = !this.isGridPage;
  }

  closeForm() {
    this.rolePermissionFormGroup.reset();
    this.isGridPage = !this.isGridPage;
    this.isEdit = false;
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.roleNameLabel = null;
    this.userTypeFilteredOptions = undefined;
    this.systemId = 0; this.roleId = 0;
    this.screenModuleList = [];
    this.headerName = 'Role List';
    this.deptvalidators('remove');
    this.userTypefilterlist = [];
    this.userTypeList = [];
  }
  resetForm() {
    this.roleNameLabel = null;
    this.userTypeFilteredOptions = undefined;
    this.systemId = 0;
    this.roleId = 0;
    this.screenModuleList = [];
    this.rolePermissionFormGroup.reset();
    this.deptvalidators('remove');
  }
  resetTable() {
    this.dt.reset();
  }
  initForm() {
    this.breadcrumbFlag = this.common.breadcrumbFlags(true);
    this.isTableChanged = false;
    this.initFormGroup();
    this.getUserTypeDeptAndRole();
  }

  initUser() {
    this.userTypeFilteredOptions = this.rolePermissionFormGroup.controls['userTypeControl'].valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.userTypeList.map(x => x.lookUpName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))
      ));
  }

  // private roleTblAutoFilters(): void {
  //   this.roleNameFilteredOptions = this.roleNameFormCtrl.valueChanges.pipe(startWith(''),
  //     map(value =>
  //       (Array.from(new Set(this.screenPermissionDetail.map(x => x.roleName).filter(x => x))).sort())
  //         .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  //   this.applicationNameFilteredOptions = this.applicationNameFormCtrl.valueChanges.pipe(startWith(''),
  //     map(value =>
  //       (Array.from(new Set(this.screenPermissionDetail.map(x => x.applicationName).filter(x => x))).sort())
  //         .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  // }

  getScreenPermission() {
    // this.rolePermissionFormGroup.controls['userTypeControl'].value &&
    if ((this.systemId === 2 &&
      this.rolePermissionFormGroup.controls['applicationTypeControl'].value) ||
      this.rolePermissionFormGroup.controls['userTypeControl'].value &&
      this.rolePermissionFormGroup.controls['applicationTypeControl'].value &&
      this.rolePermissionFormGroup.controls['deptTypeControl'].value) {
      const applicationId = JSON.parse(sessionStorage.getItem('user_data')).applicationId;
      this.masterService.getScreenPermission(applicationId).subscribe(res => {
        this.rolePermissionList = res;
      }, err => { console.error(err); }, () => {
        if (this.rolePermissionList) {
          this.treeConversion();
        }
      });
    }

  }

  getUserTypeDeptAndRole() {
    this.masterService.getUserTypeDept().subscribe(res => {
      this.UserTypeDeptList = res;
      this.systemItems('');
      this.deptItems('');
    }, err => { console.error(err); }, () => {
      this.roleItems('');
      // this.systemItems('');
    });
  }

  initFormGroup() {
    this.rolePermissionFormGroup = this.fb.group({
      applicationTypeControl: [(this.currentPath === 'clientroles') ? 2 : 1],
      userTypeControl: [, Validators.required],
      deptTypeControl: [, Validators.required]
    });
    this.rolePermissionFormGroup.controls['applicationTypeControl'].disable;
    this.getUserTypeByApplicationId((this.currentPath === 'clientroles') ? 2 : 1);
  }

  setRoleAC(ctrl: any) {
    if ((this.rolePermissionFormGroup.controls['userTypeControl'].value && this.systemId === 2) ||
      this.rolePermissionFormGroup.controls['userTypeControl'].value && this.rolePermissionFormGroup.controls['deptTypeControl'].value) {

      const RoleName = this.getRoleName();
      this.masterService.checkValidRole(RoleName).subscribe(res => {
        const data: Response = res;
        if (data.success) {
          // this.rolePermissionFormGroup.controls['roleTypeControl'].setValue(RoleName);
        } else {
          this.rolePermissionFormGroup.controls[ctrl].setValue(undefined);
          this.messageService.add({ severity: 'warn', summary: 'Failure Message', detail: data.message });
          this.roleNameLabel = null;
        }
      });
    }
  }

  treeConversion() {
    this.screenModuleList = [];
    this.rolePermissionList.module.forEach(element => {
      this.screenModuleList.push({
        moduleId: element.moduleId,
        moduleName: element.moduleName,
        addFlag: element.addFlag,
        viewFlag: element.viewFlag,
        editFlag: element.editFlag,
        approveFlag: element.approveFlag,
        deleteFlag: element.deleteFlag,
        exportFlag: element.exportFlag,
        active: (element.addFlag || element.editFlag || element.viewFlag || element.deleteFlag || element.exportFlag) ? true : false,
        subModule: [],
        screen: []
      });
    });

    this.rolePermissionList.subModuleVm.forEach(element => {
      const subModule: SubModule = {
        SubModuleId: element.subModuleId,
        SubModuleName: element.subModuleName,
        addFlag: element.addFlag,
        viewFlag: element.viewFlag,
        editFlag: element.editFlag,
        deleteFlag: element.deleteFlag,
        approveFlag: element.approveFlag,
        exportFlag: element.exportFlag,
        active: (element.addFlag || element.editFlag || element.viewFlag || element.deleteFlag || element.exportFlag) ? true : false,
        Screen: []
      };
      this.screenModuleList.filter(e => e.moduleId === element.moduleId)[0].subModule.push(subModule);
    });

    this.rolePermissionList.screenVm.forEach(element => {
      const screenData: Screen = {
        ScreenId: element.screenId,
        ScreenName: element.screenName,
        addFlag: element.addFlag,
        viewFlag: element.viewFlag,
        editFlag: element.editFlag,
        deleteFlag: element.deleteFlag,
        approveFlag: element.approveFlag,
        exportFlag: element.exportFlag,
        disabledAdd: element.disabledAdd,
        disabledApprove: element.disabledApprove,
        disabledDelete: element.disabledDelete,
        disabledEdit: element.disabledEdit,
        disabledView: element.disabledView,
        disabledExport: element.disabledExport,
        active: (element.addFlag || element.editFlag || element.viewFlag || element.deleteFlag || element.exportFlag) ? true : false,
      };
      const moduleData: ScreenModule = this.screenModuleList.filter(e => e.moduleId === element.moduleId)[0];
      (element.subModuleId === null) ? moduleData.screen.push(screenData)
        : moduleData.subModule.filter(e => e.SubModuleId === element.subModuleId)[0].Screen.push(screenData);
    }, () => {
      this.applyHeaderCheck();
    });
    this.applyHeaderCheck();
  }

  applyHeaderCheck() {
    this.screenModuleList.forEach(module => {
      if (module.screen) {
        ['addFlag', 'deleteFlag', 'editFlag', 'viewFlag', 'approveFlag','exportFlag'].forEach(flag => {
          this.screenHrUncheck(module, module.screen, flag);
        });
      }
      if (module.subModule) {
        module.subModule.forEach(subModule => {
          if (subModule.Screen) {
            ['addFlag', 'deleteFlag', 'editFlag', 'viewFlag', 'approveFlag','exportFlag'].forEach(flag => {
              this.screenHrUncheck(subModule, subModule.Screen, flag);
            });
          }
        });
      }
    });
  }

  saveRolePerm() {
    let isValid = false;
    const SaveRolePermissionData: SaveRolePermission = {
      applicationId: this.rolePermissionFormGroup.controls['applicationTypeControl'].value,
      // this.roleId
      deptId: this.rolePermissionFormGroup.controls['applicationTypeControl'].value
        !== 2 ? this.rolePermissionFormGroup.controls['deptTypeControl'].value : 0,
      loggedIn: +(JSON.parse(sessionStorage.getItem('user_data')).userId),
      userTypeLookupId: this.rolePermissionFormGroup.controls['userTypeControl'].value,
      roleId: this.roleId,
      roleName: this.getRoleName(),
      screenPermission: []
    };
    this.screenModuleList.forEach(sml => {
      if (sml.screen.length > 0) {
        sml.screen.forEach(scr => {
          if (scr.addFlag || scr.editFlag || scr.viewFlag || scr.deleteFlag || scr.approveFlag || scr.exportFlag) {
            isValid = true;
            const screenPermission: ScreenPermission = {
              screenId: scr.ScreenId,
              fullAccessFlag: false,
              addFlag: scr.addFlag,
              editFlag: scr.editFlag,
              viewFlag: scr.viewFlag,
              deleteFlag: scr.deleteFlag,
              approveFlag: scr.approveFlag,
              exportFlag: scr.exportFlag,
              active: true
            };
            SaveRolePermissionData.screenPermission.push(screenPermission);
          } else if (scr.active) {
            const screenPermission: ScreenPermission = {
              screenId: scr.ScreenId,
              fullAccessFlag: false,
              addFlag: false,
              editFlag: false,
              viewFlag: false,
              deleteFlag: false,
              approveFlag: false,
              exportFlag: false,
              active: false
            };
            SaveRolePermissionData.screenPermission.push(screenPermission);
          }
        });
      }
      if (sml.subModule.length > 0) {
        sml.subModule.forEach(sm => {
          sm.Screen.forEach(scr => {
            if (scr.addFlag || scr.editFlag || scr.viewFlag || scr.deleteFlag || scr.approveFlag || scr.exportFlag) {
              isValid = true;
              const screenPermission: ScreenPermission = {
                screenId: scr.ScreenId,
                fullAccessFlag: false,
                addFlag: scr.addFlag,
                editFlag: scr.editFlag,
                viewFlag: scr.viewFlag,
                deleteFlag: scr.deleteFlag,
                exportFlag: scr.exportFlag,
                approveFlag: scr.approveFlag,
                active: true
              };
              SaveRolePermissionData.screenPermission.push(screenPermission);
            } else if (scr.active) {
              const screenPermission: ScreenPermission = {
                screenId: scr.ScreenId,
                fullAccessFlag: false,
                addFlag: false,
                editFlag: false,
                viewFlag: false,
                deleteFlag: false,
                exportFlag: false,
                approveFlag: false,
                active: false
              };
              SaveRolePermissionData.screenPermission.push(screenPermission);
            }
          });
        });
      }
    });
    if (isValid) {
      this.masterService.saveRolePermission(SaveRolePermissionData).subscribe(res => {
        this.response = res;
      }, err => { console.error(err); }, () => {
        this.rolePermissionFormGroup.reset();
        this.screenModuleList = [];
        if (this.response.success) {
          this.rolePermissionFormGroup.reset();
          if (SaveRolePermissionData.roleId > 0) {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Updated Successfully' });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Success Message', detail: 'Saved Successfully' });
          }
          this.roleId = 0;
          this.roleNameLabel = null;
        } else {
          this.rolePermissionFormGroup.reset();
          this.messageService.add({ severity: 'warn', summary: 'Failure Message', detail: 'Failed to add role..' });
        }
        this.breadcrumbFlag = this.common.breadcrumbFlags();
        this.isGridPage = false;
        this.initForm();
        this.getScreenPermissionDetail();
      });
    } else {
      this.rolePermissionFormGroup.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Failure Message', detail: 'Please add atleast one screen..' });
    }
  }

  getRoleName(): string {
    let deptType = '';
    const userType = this.userTypeList.filter(e => e.lookUpId ===
      this.rolePermissionFormGroup.controls['userTypeControl'].value)[0]?.lookUpName;
    if (this.systemId !== 2) {
      deptType = ' For ' +
        this.UserTypeDeptList.department.filter(e => e.departmentId ===
          +this.rolePermissionFormGroup.controls['deptTypeControl'].value)[0]?.departmentName;
    }
    this.roleNameLabel = userType + deptType;
    return this.roleNameLabel;
  }

  roleChange(roleName: any) {
    this.isGridPage = true;
    this.breadcrumbFlag = this.common.breadcrumbFlags();
    this.breadcrumbFlag.toolTip = 'Update';
    this.masterService.GetRolePermissionByRoleId(roleName, JSON.parse(sessionStorage.getItem('user_data')).applicationId).subscribe(
      res => {
        const rolePermissionByRoleData: RolePermissionByRole = res;
        if (res) {
          this.rolePermissionFormGroup.patchValue({
            applicationTypeControl: rolePermissionByRoleData.applicationId,
            deptTypeControl: rolePermissionByRoleData.deptId
          });
          this.roleId = rolePermissionByRoleData.roleId;
          this.systemId = rolePermissionByRoleData.applicationId;
          if (this.systemId === 2) { this.deptvalidators('remove'); }
          this.masterService.getUserTypeByApplicationId(rolePermissionByRoleData.applicationId).subscribe(res => {
            this.userTypeList = res;
          }, err => { console.error(err); }, () => {
            // this.initUser();
            this.rolePermissionFormGroup.controls['userTypeControl'].setValue(rolePermissionByRoleData.userTypeLookupId);
            this.userItems('');
            this.roleItems('');
            this.getRoleName();
          });
          // this.getUserTypeByApplicationId(rolePermissionByRoleData.applicationId);
          // (rolePermissionByRoleData.roleName.split('For')[0].trim())
          this.roleItems('');
          this.rolePermissionList = rolePermissionByRoleData.rolePermission;
          this.screenModuleList = [];
        }
      }, err => { console.error(err); }, () => {
        if (this.rolePermissionList) {
          this.treeConversion();
          this.isTableChanged = false;
          this.headerName = 'Edit Roles';
        }
      });
  }

  getUserTypeByApplicationId(value: any) {
    this.systemId = value;
    if (this.systemId === 2) {
      this.deptvalidators('remove');
    } else {
      this.deptvalidators('add');
    }
    this.masterService.getUserTypeByApplicationId(value).subscribe(res => {
      this.userTypeList = res;
    }, err => { console.error(err); }, () => {
      // this.initUser();
      this.userItems('');
    });
  }

  // Role AC
  roleKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.roleList.filter(e =>
          e.roleName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.rolekeyUp = true;
        } else {
          this.rolekeyUp = true;
        }
      } else {
        this.rolekeyUp = false;
      }
    }
  }

  get displayRoleFn() {
    const roleNew = (role) => {
      if (role == null || role === undefined) {
        return null;
      } else {
        if (role && this.rolefilterlist && this.rolefilterlist.length > 0) {
          role = this.rolefilterlist.find(x => x.roleId === role);
          // this.roleChange(role.roleId);
          return role.roleName;
          // if (system) {
          //   return system.roleName;
          // } else { return null; }
        } else {
          return null;
        }
      }
    };
    return roleNew;
  }

  roleItems(value: any) {
    if (!value) { this.assignRoleCopy(); }
    if (value) {
      this.rolefilterlist = Object.assign([], this.roleList).filter(
        item => ((item.roleName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignRoleCopy() {
    this.rolefilterlist = Object.assign([], this.roleList);
  }
  // Role AC ends

  // System AC
  systemKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const system = this.UserTypeDeptList.application.filter(e =>
          e.applicationName.toLowerCase() === value.toLowerCase());
        if (system.length > 0) {
          this.systemkeyUp = true;
        } else {
          this.systemkeyUp = true;
        }
      } else {
        this.systemkeyUp = false;
      }
    }
  }

  get displaySystemFn() {
    const sysNew = (sys) => {
      if (sys == null || sys === undefined) {
        return null;
      } else {
        if (sys && this.systemfilterlist && this.systemfilterlist.length > 0) {
          sys = this.systemfilterlist.find(x => x.applicationId === sys);
          return sys.applicationName;
        } else {
          return null;
        }
      }
    };
    return sysNew;
  }

  systemItems(value: any) {
    if (!value) { this.assignSystemCopy(); }
    if (value) {
      this.systemfilterlist = Object.assign([], this.UserTypeDeptList.application).filter(
        item => ((item.applicationName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }

  assignSystemCopy() {
    this.systemfilterlist = Object.assign([], this.UserTypeDeptList.application);
  }
  // System AC ends

  // User Type AC
  userKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const system = this.userTypeList.filter(e =>
          e.lookUpName.toLowerCase() === value.toLowerCase());
        if (system.length > 0) {
          this.userTypekeyUp = true;
        } else {
          this.userTypekeyUp = true;
        }
      } else {
        this.userTypekeyUp = false;
      }
    }
  }

  get displayUserFn() {
    const userNew = (sys) => {
      if (sys == null || sys === undefined) {
        return null;
      } else {
        if (sys && this.userTypefilterlist && this.userTypefilterlist.length > 0) {
          sys = this.userTypefilterlist.find(x => x.lookUpId === sys);
          return sys.lookUpName;
        } else {
          return null;
        }
      }
    };
    return userNew;
  }

  userItems(value: any) {
    if (!value) { this.assignUserCopy(); }
    if (value) {
      this.userTypefilterlist = Object.assign([], this.userTypeList).filter(
        res => ((res.lookUpName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignUserCopy() {
    this.userTypefilterlist = Object.assign([], this.userTypeList);
  }
  // User Type AC ends

  // DEPT AC
  deptKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const dept = this.UserTypeDeptList.department.filter(e =>
          e.departmentName.toLowerCase() === value.toLowerCase());
        if (dept.length > 0) {
          this.deptTypekeyUp = true;
        } else {
          this.deptTypekeyUp = true;
        }
      } else {
        this.deptTypekeyUp = false;
      }
    }
  }

  get displayDeptFn() {
    const sysNew = (dept) => {
      if (dept == null || dept === undefined) {
        return null;
      } else {
        if (dept && this.deptTypefilterlist && this.deptTypefilterlist.length > 0) {
          dept = this.deptTypefilterlist.find(x => x.departmentId === dept);
          return dept.departmentName;
        } else {
          return null;
        }
      }
    };
    return sysNew;
  }

  deptItems(value: any) {
    if (!value) { this.assignDeptCopy(); }
    if (value) {
      this.deptTypefilterlist = Object.assign([], this.UserTypeDeptList.department).filter(
        res => ((res.departmentName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }

  assignDeptCopy() {
    this.deptTypefilterlist = Object.assign([], this.UserTypeDeptList.department);
  }
  // DEPT AC ends

  getScreenPermissionDetail() {
    this.masterService.getScreenPermissionDetail().subscribe(res => {
      this.screenPermissionDetail = res;
      if (this.currentPath === 'clientroles') {
        this.screenPermissionDetail = this.screenPermissionDetail.filter(e => e.applicationName === 'Client');
      } else if (this.currentPath === 'roles') {
        this.screenPermissionDetail = this.screenPermissionDetail.filter(e => e.applicationName === 'A Check');
      }
    }, err => { console.error(err); }, () => {
      this.genAutoCompleteFilter();
    });
  }

  deptvalidators(value: 'remove' | 'add') {
    if (value === 'add') {
      this.rolePermissionFormGroup.controls['deptTypeControl'].setValidators(Validators.required);
      this.rolePermissionFormGroup.controls['deptTypeControl'].updateValueAndValidity();
    } else if (value === 'remove') {
      this.rolePermissionFormGroup.controls['deptTypeControl'].clearValidators();
      this.rolePermissionFormGroup.controls['deptTypeControl'].updateValueAndValidity();
    }
  }

  screenHrChg(event, rowData: any, type) {
    rowData.forEach(i => { if (i[this.retDisableColName(type)] === false) { i[type] = event.checked; } });
  }

  screenHrUncheck(headerVal, moduleScreenRowData, type) {
    headerVal[type] = moduleScreenRowData.filter(e => e[type] === false && !e[this.retDisableColName(type)]).length === 0;
  }

  retDisableColName(type): string {
    let disableCon = '';
    if (type === 'addFlag') { disableCon = 'disabledAdd'; }
    if (type === 'deleteFlag') { disableCon = 'disabledDelete'; }
    if (type === 'approveFlag') { disableCon = 'disabledApprove'; }
    if (type === 'viewFlag') { disableCon = 'disabledView'; }
    if (type === 'editFlag') { disableCon = 'disabledEdit'; }
    if (type === 'exportFlag') { disableCon = 'disabledExport'; }
    return disableCon;
  }

  genAutoCompleteFilter() {
    this.roleNameFilteredOptions = this.roleNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.screenPermissionDetail.map(x => x.roleName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.applicationNameFilteredOptions = this.applicationNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.screenPermissionDetail.map(x => x.applicationName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }

}

/* #region Classes */

class ScreenModule {
  moduleId: number;
  moduleName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  approveFlag: boolean;
  exportFlag: boolean;
  active?: boolean;
  screen: Screen[] = [];
  subModule: SubModule[] = [];
}

class SubModule {
  SubModuleId: number;
  SubModuleName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  approveFlag: boolean;
  exportFlag: boolean;
  active?: boolean;
  Screen: Screen[] = [];
}

class Screen {
  ScreenId: number;
  ScreenName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  approveFlag: boolean;
  exportFlag: boolean;
  disabledAdd: boolean;
  disabledEdit: boolean;
  disabledView: boolean;
  disabledDelete: boolean;
  disabledApprove: boolean;
  disabledExport: boolean;
  active?: boolean;
}

class ModuleDB {
  moduleId: number;
  moduleName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  exportFlag: boolean;
  active?: boolean;
  approveFlag: boolean;

}

class SubModuleDB {
  moduleId: number;
  subModuleId: number;
  subModuleName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  approveFlag: boolean;
  exportFlag: boolean;
  active?: boolean;
}

class ScreenDB {
  screenId: number;
  moduleId: number;
  subModuleId?: number;
  screenName: string;
  addFlag: boolean;
  viewFlag: boolean;
  editFlag: boolean;
  deleteFlag: boolean;
  exportFlag: boolean;
  approveFlag: boolean;
  disabledAdd: boolean;
  disabledEdit: boolean;
  disabledView: boolean;
  disabledDelete: boolean;
  disabledApprove: boolean;
  disabledExport: boolean;
  active?: boolean;

}

class RolePermission {
  module: ModuleDB[];
  subModuleVm: SubModuleDB[];
  screenVm: ScreenDB[];
}

class UserTypeDept {
  // userType: LookUpValue[] = [];
  department: Department[] = [];
  application: Application[] = [];
}

class Department {
  departmentId: number;
  departmentName: string;
  active?: boolean;
}

class LookUpValue {
  contactId: number;
  lookUpCatId: number;
  lookUpId?: number;
  lookUpName: string;
  active?: boolean;
  lookUpValue: string;
}

class Application {
  applicationId: number;
  applicationName: string;
}

class SaveRolePermission {
  applicationId: number;
  roleId: number;
  roleName: string;
  deptId: number;
  userTypeLookupId: number;
  loggedIn?: number;
  screenPermission: ScreenPermission[] = [];
}

class ScreenPermission {
  screenId: number;
  fullAccessFlag: boolean;
  addFlag: boolean;
  editFlag: boolean;
  viewFlag: boolean;
  deleteFlag: boolean;
  approveFlag: boolean;
  exportFlag: boolean;
  active?: boolean;
}

class Response {
  success: boolean;
  message: string;
  value: number;
}

class Role {
  roleId: number;
  roleName: string;
  active?: boolean;
}

class RolePermissionByRole {
  roleId: number;
  roleName: string;
  applicationId: number;
  deptId: number;
  userTypeLookupId: number;
  rolePermission: RolePermission;
}

class ScreenPermissionDetail {
  applicationName: string;
  roleName: string;
  roleId: number;
}

/* #endregion */

