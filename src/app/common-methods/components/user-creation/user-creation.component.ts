import { Component, OnInit, ViewChild, Input, TemplateRef, ElementRef } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Registration, ClientUser } from '../../models/registration';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { VerificationService } from 'src/app/common-methods/services/verification.service';
import { MatStepper } from '@angular/material/stepper';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
// import { MatStepper, MatMenuTrigger, MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material/dialog';

import { SharedService } from 'src/app/common-methods/services/shared.service';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/common-methods/models/user';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbFlags } from '../../models/breadcrumb-flags';
import { ScreenAuth } from '../../models/screen-auth';
import { CommonAlertsComponent } from '../../common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { event } from 'jquery';
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.css']
})
export class UserCreationComponent implements OnInit {
  eActiveFlag: boolean = true;
  //  Added By megala -04-04-2024 -VTS2-2024-CRT-0150
  filterOwnerName = new UntypedFormControl();
  screeningOwner = new UntypedFormControl('', Validators.required);
  selectall = new UntypedFormControl();
  reAssigncaseLst: any;
@ViewChild('reassignDialog') reassignDialog!: TemplateRef<any>;

@ViewChild('stepper1') stepper!: MatStepper;

@ViewChild('assignPopUp') assignPopUp!: any;
  deactiveUserInputVm: DeactiveUserInputVm = new DeactiveUserInputVm();
  reassignedChecksVm: ReassignedChecksVm = new ReassignedChecksVm();
  teamData: any;
  depData: any;
  dialogRef: any;
  owner: any;
  userData: UserData;
  //Ended By Megala
  itemperpage: any;
  hide = true;
  hide1 = true;
  step1 = 0;
  isShow = false;
  UserDetailGrid: any[] = [];
  screenAuth: ScreenAuth = new ScreenAuth();
  registration: Registration = new Registration();
  clientUser: ClientUser = new ClientUser();
  client: any[] = [];
  role: any[] = [];
  component: any[] = [];
  isEditFlag = false;
  activeFlag = false;
  showClientGrid = false;
  registerForm: UntypedFormGroup;
  local: any;
  localUser: any;
  panelClosed = false;
  clientpanelClosed = false;
  compNamepanelClosed = false;
  routePath = 'Configure / User / Create User';
  siteList: any[] = [];
  rolelist: any[] = [];
  clientrolelist: any[] = [];
  createUserprev: any;
  clientDetailrprev: any;
  clientflterlist: any[] = [];
  billingKeyup = false;
  totalpages: number;
  departmentList: any[] = [];
  designationList: any[] = [];
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  index = -1;
  clientList: any[] = [];
  userAppTransId = 0;
  @Input() isclient: boolean;
  displayColumns: any[] = [];
  disPlayUserColumns: any[] = [];
  filterClientId = 0;
  allComponents: any[] = [];
  applicationId = 0;
  breadcrumbFlags = new BreadcrumbFlags();
  departmentLst: any;
  deActiveUserId: number = 0;
  temp: boolean = this.registration.active;
  frozenCols: any[] = [];
  userDisplayColumns = [
    { field: 'userName', header: 'User Name', value: true, disabled: true },
    { field: 'firstName', header: 'First Name', value: true, disabled: true },
    { field: 'middleName', header: 'Middle Name', value: true },
    { field: 'lastName', header: 'Last Name', value: true, disabled: true },
    { field: 'designation', header: 'Designation', value: true, disabled: true },
    { field: 'emailId', header: 'Email', value: true, disabled: true },
    { field: 'active', header: 'Active', value: true, disabled: true },
    { field: 'departmentName', header: 'Department', value: true, disabled: true },
  ];
  clientDisplayColumns = [
    { field: 'userName', header: 'User Name', value: true, disabled: true },
    { field: 'firstName', header: 'First Name', value: true, disabled: true },
    { field: 'middleName', header: 'Middle Name', value: true, disabled: true },
    { field: 'lastName', header: 'Last Name', value: true, disabled: true },
    { field: 'emailId', header: 'Email', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true },
    { field: 'invoiceNotificationFlag', header: 'Invoice Notification', value: true },
    { field: 'active', header: 'Active' },
  ];
  //  Added By megala -04-04-2024 -VTS2-2024-CRT-0150
  userReassign = [
    { field: 'userName', header: 'User Name', value: true, disabled: true },
    { field: 'firstName', header: 'First Name', value: true, disabled: true },
    { field: 'middleName', header: 'Middle Name', value: true, disabled: true },
    { field: 'lastName', header: 'Last Name', value: true, disabled: true },
    { field: 'emailId', header: 'Email', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'siteName', header: 'Site Name', value: true },
    { field: 'invoiceNotificationFlag', header: 'Invoice Notification', value: true },
    { field: 'active', header: 'Active' },
  ];
  depColumns = [{ field: 'departmentName', header: 'Department Name' }
  ];
  teamColumns = [{ field: 'name', header: 'Team Name' }
  ];


  veCloumns = [
    { field: 'assignedOwner', header: 'Select All' },
    { field: 'clientRefNo', header: 'ClientRefNo' },
    { field: 'verificationId', header: 'Verification Id' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'compName', header: 'Component Name' },
    { field: 'compStatus', header: 'Component Status' },
    { field: 'workFlow', header: 'WorkFlow' },
    { field: 'qcStatus', header: 'QC Status' },
    { field: 'reassignOwner', header: 'Re-assign Owner' },

  ];
  //Ended By Megala
  userdetailColumns = [
    { field: 'clientId', header: 'Client Name' }
  ];
  userrolesColumns = [
    { field: 'roleName', header: 'Role Name' },
  ];
  usersiteColumns = [
    { field: 'siteNo', header: 'Site No' },
    { field: 'siteName', header: 'Site Name' },
  ];
  @ViewChild('global') global!: ElementRef;

  @ViewChild('actionTrigger') actionTrigger!: MatMenuTrigger;

  @ViewChild('userNameTrigger') userNameTrigger!: MatMenuTrigger;
  userNameFilteredOptions!: Observable<string[]>;
  userNameControl = new UntypedFormControl();

  @ViewChild('firstNameTrigger') firstNameTrigger!: MatMenuTrigger;
  firstNameFilteredOptions!: Observable<string[]>;
  firstNameControl = new UntypedFormControl();

  @ViewChild('middleNameTrigger') middleNameTrigger!: MatMenuTrigger;
  middleNameFilteredOptions!: Observable<string[]>;
  middleNameControl = new UntypedFormControl();

  @ViewChild('lastNameTrigger') lastNameTrigger!: MatMenuTrigger;
  lastNameFilteredOptions!: Observable<string[]>;
  lastNameControl = new UntypedFormControl();

  @ViewChild('designationTrigger') designationTrigger!: MatMenuTrigger;
  designationFilteredOptions!: Observable<string[]>;
  designationControl = new UntypedFormControl();

  @ViewChild('clientNameTrigger') clientNameTrigger!: MatMenuTrigger;
  clientNameFilteredOptions!: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('emailTrigger') emailTrigger!: MatMenuTrigger;
  emailFilteredOptions!: Observable<string[]>;
  emailControl = new UntypedFormControl();

  @ViewChild('departmentNameTrigger') departmentNameTrigger!: MatMenuTrigger;
  departmentNameFilteredOptions!: Observable<string[]>;
  departmentNameControl = new UntypedFormControl();

  @ViewChild('componentNameTrigger') componentNameTrigger!: MatMenuTrigger;
  componentNameFilteredOptions!: Observable<string[]>;
  componentNameControl = new UntypedFormControl();

  @ViewChild('siteNameTrigger') siteNameTrigger!: MatMenuTrigger;
  siteNameFilteredOptions!: Observable<string[]>;
  siteNameControl = new UntypedFormControl();

  selectedColumns: any[] = [];

  @ViewChild('secondDialog') secondDialog!: TemplateRef<any>;
  tooltipName = 'Add';
  snackBarConfig = new MatSnackBarConfig();
  numberflag = false;
  charflag = false;
  uniqueflag = false;
  minflag = false;
  teamList: any[] = [];
  userList: any[] = [];
  selTeamName: any;
  screenDepList: any;
  teamLst: any;
  teamcaselst: any;
  constructor(public masterService: MasterService, private formBuilder: UntypedFormBuilder, public dialog: MatDialog,
    public common: CommonService, private saharedService: SharedService, private router: Router, private verificationService: VerificationService,
    public _snackBar: MatSnackBar, private authService: AuthService, private messageService: MessageService) { }
  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.applicationId = this.isclient ? 2 : 1;
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.displayColumns = this.isclient ? this.clientDisplayColumns : this.userDisplayColumns;
    this.disPlayUserColumns = this.userReassign;
    this.selectedColumns = [
      { field: 'action', header: 'Action', disabled: true },
      ...this.displayColumns.filter(e => e.disabled)
    ];
    this.routePath = this.isclient ? 'Client / Create Client User' : 'Configure / User / Create User';
    this.local = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.localUser = this.local.userId;
    this.teamData = [];
    this.depData = null;
    this.getContactDetails();
    this.bindClientUser();
    this.snackBarConfig.horizontalPosition = 'start' as MatSnackBarHorizontalPosition;
    this.itemperpage = 10;
  }
  initFormGroup() {
    this.registerForm = this.formBuilder.group({
      userName: new UntypedFormControl('', [Validators.required, this.cannotContainSpace]),
      password: [''],
      reTypePassword: [''],
      firstName: ['', [Validators.required]],
      middleName: new UntypedFormControl(),
      lastName: new UntypedFormControl('', [Validators.required]),
      email: [null, Validators.compose([Validators.required, Validators.pattern(this.common.EmailRegX),
      Validators.minLength(1)])],
      active: new UntypedFormControl(true),
      invoiceNotificationFlag: new UntypedFormControl(false),
      userId: new UntypedFormControl(0),
      personId: new UntypedFormControl(0),
      loggedIn: new UntypedFormControl(this.localUser),
      applicationId: new UntypedFormControl(this.applicationId),
      designationLookupId: new UntypedFormControl(null, this.isclient === false ? Validators.required : null),
      userDepartmentVm: new UntypedFormControl('', this.isclient === false ? Validators.required : null),
      component: new UntypedFormControl(null),
      teamId: new UntypedFormControl(null, this.isclient === true ? Validators.required : null),
      site: new UntypedFormControl(null),
      role: new UntypedFormControl(null),
      clientId: new UntypedFormControl(null, this.isclient === true ? Validators.required : null),
    }, { validator: this.checkMatchingPasswords('password', 'reTypePassword') },
    );
  }
  cannotContainSpace(control: AbstractControl) {
    if ((control.value as string)?.indexOf(' ') >= 0) {
      return { cannotContainSpace: true };
    }
    return null;
  }
  resetclientdetail() {
    const clientDetail = this.registerForm.get('clientUser') as UntypedFormGroup;
    this.tooltipName = 'Add';
    clientDetail.reset();
    this.panelClosed = false;
    clientDetail.markAsPristine();
    this.index = -1;
    this.filterClientId = 0;
  }
  checkMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
      // tslint:disable-next-line:one-variable-per-declaration
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        if (passwordConfirmationInput.value) {
          this.registerForm.get('reTypePassword')?.setErrors({ notEquivalent: true, });
        } else {
          this.registerForm.get('reTypePassword')?.setValidators(Validators.required);
        }
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
  checkfocus() {
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      if (this.hide === true || this.hide === false) {
        this.isShow = false;
        // this.registerForm.get('reTypePassword')?.clearValidators();
        // this.registerForm.get('reTypePassword')?.updateValueAndValidity();
      }
    } else if (this.uniqueflag === false || this.numberflag === false || this.charflag === false || this.minflag === false) {
      if (this.hide === true || this.hide === false) {
        this.isShow = true;
      }
    }
  }
  checkPassword() {
    // if (!this.isEditFlag) {
    if (this.registerForm.get('password')?.value) {
      if (this.uniqueflag === false || this.numberflag === false || this.charflag === false || this.minflag === false) {
        this.registerForm.get('password')?.setErrors({ incorrect: true });
      }
      if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
        this.registerForm.get('password')?.setErrors(null);
        this.registerForm.get('password')?.clearValidators();
        this.registerForm.get('password')?.updateValueAndValidity();
      }
    }
    // }
  }
  passwordChange(val: any) {
    const txt = val;
    const numb = txt.match(/\d/g);
    const specialchar = txt.match(/[!@#$%^&*(),.?":{}|<>]/g);
    const stringonly = txt.match(/[a-zA-z]/g);
    if (specialchar) {
      this.uniqueflag = true;
    } else if (!specialchar) {
      this.uniqueflag = false;
    }
    if (stringonly) {
      this.charflag = true;
    } else if (!stringonly) {
      this.charflag = false;
    }
    if (numb) {
      this.numberflag = true;
    } else if (!numb) {
      this.numberflag = false;
    }
    if ((val.length) >= 8) {
      this.minflag = true;
    } else {
      this.minflag = false;
    }
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      this.isShow = false;
      this.registerForm.get('reTypePassword')?.enable();
      this.registerForm.get('reTypePassword')?.clearValidators();
      this.registerForm.get('reTypePassword')?.updateValueAndValidity();
      this.registerForm.get('reTypePassword')?.setErrors({ incorrect: true });
      // this.registerForm.get('password')?.setErrors({ incorrect: false })
    } else {
      this.isShow = true;
      this.registerForm.get('reTypePassword')?.disable();
      this.registerForm.get('reTypePassword')?.reset();
      this.registerForm.get('password')?.setErrors({ incorrect: true });
    }
  }
  getContactDetails() {
    this.masterService.getContactDetails().subscribe(resp => {
      const clientlst = resp.client.filter(f => f.clientName !== null);
      this.client = clientlst;
      this.clientList = clientlst;
      this.clientList.sort((a, b) => a.clientName.localeCompare(b.clientName));
      // this.clientList.splice(0, 0, {
      //   clientId: 0, clientName: 'All Client',
      //   active: true,
      // });
      this.role = resp.role;
      this.allComponents = resp.component;
      this.teamList = resp.clientTeam;
      this.departmentList = resp.department;
      this.designationList = resp.designation;
      this.currentPage = 1;
    });
  }
  getComponentByDeptId(event: any) {
    this.registerForm.get('component')?.setValue(null);
    if (event && this.registerForm.value.userId > 0 && event !== this.common.tempResetData.deptId) {
      const dept = this.common.getNameById(this.departmentList, 'departmentId', 'departmentName', this.common.tempResetData.deptId);
      const popupData = {
        action: this.common.ALERT,
        headerText: 'Alert',
        bodyText: 'This user is already assigned for ' + (dept) + ', once you update it will override'
      };
      const dialogRef = this.dialog.open(CommonAlertsComponent, {
        width: '320px',
        data: popupData,
        disableClose: true
      });
    }
  }
  getTeams(teamId: any) {
    this.selTeamName = this.teamList.filter(e => e.teamId === teamId)[0].teamName;
  }

  onSubmit() {
    if (this.isclient) {
      this.panelClosed = true;
    }
    if (this.registerForm.valid) {
      this.registration = this.registerForm.value;
      if (this.isEditFlag) {
        if (!this.isclient) {
        } else {
          this.registration.role = this.common.setfalsedeleted(this.clientDetailrprev.role, this.registration.role, 'roleId');
          this.registration.site = this.common.setfalsedeleted(this.clientDetailrprev.site, this.registration.site, 'siteId');
        }
      }

      //enable active pop up
      //this pop up only for User active process
      this.activeFlag = this.registerForm.get('active')?.value;
      //Megala Inactive user -VTS2-2024-CRT-0150
      if (this.isEditFlag && this.registerForm.get('active')?.value == false && this.eActiveFlag == false) {
        this.eActiveFlag == false;
      }
      if ((this.isEditFlag == true && this.activeFlag == false && !this.isclient && this.eActiveFlag == true)) {
        const deptIdDet = this.registerForm.get('userDepartmentVm')?.value;
        var depId: any[] = [];
        if (deptIdDet != null && deptIdDet.length > 0) {
          deptIdDet.forEach(element => {
            depId.push(element.departmentId);
          });
        }
        this.deactiveUserInputVm.userId = this.localUser;
        this.deactiveUserInputVm.deptId = depId;
        this.deactiveUserInputVm.departmentID = 0;
        this.deactiveUserInputVm.deptName = '';
        this.masterService.CheckUserHaveMultipleDept(this.deactiveUserInputVm).subscribe(res => {
          if (res) {
            if (res.isTlAssigned == true) {
              const popupData = {
                action: this.common.DELETECONFIRMATION,
                headerText: 'Alert',
                bodyText: 'This user is assigned to the following department (s) ' + res.deptName + ' would you like to continue'
              };
              const dialogRef = this.dialog.open(CommonAlertsComponent, {
                width: '320px',
                data: popupData,
                disableClose: true
              });
              if (dialogRef) {
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.dialog.open(this.reassignDialog, {
                      width: '1400px',
                      disableClose: true,
                    });
                    this.screenDepList = this.registerForm.get('userDepartmentVm')?.value
                  }
                });
              }
            } else {

              const popupData = {
                action: this.common.ALERT,
                headerText: 'Alert',
                bodyText: 'You do not have access to the following department(s) ' + ' ' + res.deptName + ' ( ' + this.local.firstName + ' ' + this.local.lastName + ' )'

              };
              const dialogRef = this.dialog.open(CommonAlertsComponent, {
                width: '320px',
                data: popupData,
                disableClose: true
              });
            }
          }
        })
      }
      else {
        this.saveupdateUser();
      }

      // if(this.isEditFlag == true && this.activeFlag == false &&!this.isclient) {
      //   const popupData = {
      //     action: this.common.ALERT,
      //     headerText: 'Alert',
      //     bodyText: 'All of the components listed under this user will be forwarded to "Assigned" page in TL dashboard'
      //   };
      //   const dialogRef = this.dialog.open(CommonAlertsComponent, {
      //     width: '320px',
      //     data: popupData,
      //     disableClose: true
      //   });
      //   if (dialogRef) {
      //     dialogRef.afterClosed().subscribe(result => {
      //       this.saveupdateUser();
      //     })
      //   }
      // }else{
      //   this.saveupdateUser();
      // }

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  //  Added By megala -04-04-2024 -VTS2-2024-CRT-0150
  dialogClose() {
    this.dialogRef.close();
    // this.screeningOwnerId.setValue('');
    this.selectall.setValue(false);
  }
  selectAll(e: any) {
    if (e.checked === true) {
      this.teamcaselst.forEach(vd => {
        vd.assignedOwner = true;
      });
    } else {
      this.teamcaselst.forEach(vd => {
        vd.assignedOwner = false;
      });
    }
  }
  assignOwner(e, data) {
    if (e.checked === true) {
      data.assignedOwner = true;
    } else {
      data.assignedOwner = false;
      this.selectall.setValue(false);
    }
    //For Default SelectAll Checkbox
    const index = this.teamcaselst.findIndex(x => x.assignedOwner === false);
    if (index > -1) {
      this.selectall.setValue(false);
    } else {
      this.selectall.setValue(true);
    }

  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  opendialog() {
    const index = this.teamcaselst.findIndex(x => x.assignedOwner === true);
    //Reset Assigin search filter by megala -VTS2-2024-CRT-0150
    this.filterOwnerName.setValue('');
    if (index > -1) {
      this.masterService.GetDepartmentUser((this.teamData.teamId != undefined) ? this.teamData.teamId : 0, (this.teamData.subTeamId != undefined) ? this.teamData.subTeamId : 0, this.deActiveUserId).subscribe((res) => {
        if (res) {
          this.owner = res;
        }
      });
      this.dialogRef = this.dialog.open(this.assignPopUp, {
        width: '400px',

        disableClose: true
      });
    } else {
      this.showTopCenter('error', 'Failure Message', 'Choose atleast One Candidate');
    }
  }
  assignScrnOwner(data, index) {
    this.screeningOwner.setValue('');
    const ownerList = this.owner.filter(x => x.name === data.name);
    if (ownerList.length > 0) {
      this.screeningOwner.setValue(data);
      const ele = document.getElementsByClassName('ownven-list');
      const eleScroll = document.getElementsByClassName('scrollCls');
      //  const indCls = this.owner.findIndex(x => x.name === data.name);
      if (ele.length > 0) {
        for (let i = 0; i < this.owner.length; i++) {
          if (index === i) {
            ele[i].classList.add('active');
          } else {
            if (ele[i]) {
              ele[i].classList.remove('active');
            }
          }
        }
      }
      this.owner = Object.assign([], this.owner);
    }
  }
  submitOwner() {

    if (this.screeningOwner.value != null) {
      this.teamcaselst.forEach((e) => {
        if (e.assignedOwner == true) {
          e.reassignOwner = this.screeningOwner.value.name;
          e.reAssignOwnerId = this.screeningOwner.value.userId;
        }
      });
      this.reAssigncaseLst = this.teamcaselst.filter((f) => f.assignedOwner === true);
      this.saveReassignUser();
      this.dialogClose();
      // this.showTopCenter('success', 'Success Message', 'Updated Successfully');
      this.screeningOwner.setValue('');
    }


  }
  getTmLst(value: any) {
    if ((this.teamData.length == 0) || this.reAssigncaseLst == null || this.reAssigncaseLst.length == 0 || (this.teamData != null
      && this.teamData.teamId == value.teamId && this.teamData.subTeamId == value.subTeamId)) {
      this.teamData = value;
      //this.teamcaselst = [];    
      this.masterService.GetAssignedChecksByUser((value.teamId != undefined) ? value.teamId : 0, (value.subTeamId != undefined) ? value.subTeamId : 0, this.deActiveUserId, this.deactiveUserInputVm.deptId).subscribe(res => {
        if (res) {
          this.teamcaselst = res;
        } else {
          this.teamcaselst = [];
        }
      });
    } else {

      this.showTopCenter('error', 'Failure Message', 'Please save last assign cases');
    }
  }
  getTeamLst(value, event: MouseEvent) {
    // if((this.teamData.length == 0 )|| this.reAssigncaseLst ==null || this.reAssigncaseLst.length==0||(this.teamData != null
    //   && this.teamData.teamId == value.teamId && this.teamData.subTeamId == value.subTeamId )){
    this.teamData = value;
    // this.teamcaselst = [];    
    this.masterService.GetAssignedChecksByUser((value.teamId != undefined) ? value.teamId : 0, (value.subTeamId != undefined) ? value.subTeamId : 0, this.deActiveUserId, this.deactiveUserInputVm.deptId).subscribe(res => {
      if (res) {
        this.teamcaselst = res;
      }
      else {
        this.teamcaselst = [];
      }
    });
    //}
    // else{
    //   console.log(event)
    //   event.preventDefault();
    //    this.showTopCenter('error', 'Failure Message', 'Please save last assign cases');

    // }
  }
  closedialog() {
    this.dialog.closeAll();
    this.reAssigncaseLst = [];
    this.teamData = [];
    this.depData = null;
  }
  saveReassignUser() {
    const caseData = this.teamcaselst.filter(x => x.reAssignOwnerId === 0);
    //  if(caseData.length == 0 && this.reAssigncaseLst !=null && this.reAssigncaseLst.length>0){

    this.reassignedChecksVm.AssignedChecks = this.reAssigncaseLst;
    //Megala 09/04/2024
    //Add DE case Reassign inactive user (VTS2-2024-CRT-0150)
    this.reassignedChecksVm.userId = this.deActiveUserId;
    this.reassignedChecksVm.teamLeadId = this.localUser;
    this.reassignedChecksVm.teamId = (this.teamData.teamId != undefined) ? this.teamData.teamId : 0
    this.reassignedChecksVm.subTeamId = (this.teamData.subTeamId != undefined) ? this.teamData.subTeamId : 0
    this.masterService.ReassignChecks(this.reassignedChecksVm).subscribe((res => {
      if (res) {
        this.reAssigncaseLst = [];
        this.showTopCenter('success', 'Success Message', 'Update Successfully');
        this.getTmLst(this.teamData);
      } else {
        this.showTopCenter('error', 'Failure Message', 'Case not assign');
      }

    }
    ))



    //       }
    // else{
    //   this.showTopCenter('error', 'Failure Message', 'Please assign all case to active user');
    // }

  }
  getDepData(value, event: Event) {
    // if((this.depData == null )|| this.reAssigncaseLst ==null || this.reAssigncaseLst.length==0||(this.depData != null
    //   && this.depData.departmentId == value.departmentId )){
    this.deactiveUserInputVm.deptId = value.departmentId;
    this.deactiveUserInputVm.deptName = value.departmentName;
    this.depData = value;
    this.masterService.GetUserDeptTeamDetails(this.deactiveUserInputVm.deptId, this.deActiveUserId).subscribe(res => {
      if (res) {
        this.teamLst = [];
        if (res.teamDetails != null && res.teamDetails.length > 0) {
          res.teamDetails.forEach((e) => {
            this.teamLst.push(e)
          })
        }
        if (res.subTeamDetails != null && res.subTeamDetails.length > 0) {
          res.subTeamDetails.forEach((e) => {
            this.teamLst.push(e)
          })
        }
      }
    });
    // }
    // else{
    //   console.log(event)
    //   event.preventDefault();
    //   this.showTopCenter('error', 'Failure Message', 'Please save last assign cases');

    //   }
  }

  savedeactiveUser() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Alert',
      bodyText: 'This user will be deactivated, would you like to continue?'
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '320px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveupdateUser();
        }
      });
    }
  }
  saveupdateUser() {
    this.masterService.InsertUserCredential(this.registration).subscribe(res => {
      if (res.success) {
        this.bindClientUser();
        if (this.registration.userId > 0) {
          this.showNotification('success', 'Success Message', 'Updated Successfully');
          this.dialog.closeAll();
        } else {
          this.showNotification('success', 'Success Message', 'Saved Successfully');
        }
        this.closeUserCreate();
      }
      else {

        this.showTopCenter('error', 'Failure Message', 'Please Reassign all case to active user before Deactive ' + ' ( ' + this.registration.firstName + ' ' + this.registration.lastName + ' )');
      }
    });
  }
  //ended By megala -VTS2-2024-CRT-0150
  clientKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const client = this.clientflterlist.filter(e =>
          e.clientName.toLowerCase() === value.toLowerCase());
        if (client.length > 0) {
          this.billingKeyup = true;
        } else {
          this.billingKeyup = true;
        }
      } else {
        this.billingKeyup = false;
      }
    }
  }
  get displayclientFn() {
    const clientNew = (client) => {
      if (client == null || client === undefined) {
        return null;
      } else {
        if (client && this.clientflterlist && this.clientflterlist.length > 0) {
          client = this.clientflterlist.find(x => x.clientId === client);
          return client.clientName;
        } else {
          return null;
        }
      }
    };
    return clientNew;
  }
  clientItems(value: any) {
    const clientIds: any[] = [];
    if (!value) { this.assignclientCopy(clientIds); }
    if (value) {
      this.clientflterlist = Object.assign([], this.client.filter(f =>
        clientIds.indexOf(f.clientId) === -1)).filter(
          item => ((item.clientName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignclientCopy(clientIds: any) {
    this.clientflterlist = Object.assign([], this.client.filter(f =>
      clientIds.indexOf(f.clientId) === -1));
  }
  displayClientFn(id: any): string {
    if (!id) { return ''; }
    const clientName = this.client.filter(res => res.clientId === id);
    return clientName ? clientName[0].clientName : '';
  }
  editUser(rowData, mode: any) {
    this.deActiveUserId = rowData.userId
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.userAppTransId = rowData.userAppTransId;
    this.isEditFlag = true;
    this.hide = true;
    this.hide1 = true;
    this.initFormGroup();
    // if (this.isEditFlag === true) {
    //   this.registerForm.get('password')?.disable();
    //   this.registerForm.get('reTypePassword')?.disable();
    // }
    this.charflag = true; this.numberflag = true; this.uniqueflag = true; this.minflag = true;
    this.showClientGrid = !this.showClientGrid;
    this.masterService.editUserDetails(rowData.userId).subscribe(resp => {
      if (resp) {
        this.eActiveFlag = resp.active;
        if (resp.createUser) {
          resp.createUser.department = resp.department === 0 ? null : resp.department;
          resp.createUser.designationLookupId = resp.designationLookupId === 0 ? null : resp.designationLookupId;
        }
        this.clientItems('');
        this.clientDetailrprev = this.common.CloneObject(resp);
        this.GetRole('acheck');
        this.GetRole('client');
        this.registration = resp;
        this.common.tempResetData = this.common.CloneObject(resp);
        setTimeout(() => {
          this.registerForm.patchValue({
            userName: resp.userName,
            password: resp.password,
            reTypePassword: resp.password,
            firstName: resp.firstName,
            middleName: resp.middleName,
            lastName: resp.lastName,
            email: resp.email,
            active: resp.active,
            userId: resp.userId,
            personId: resp.personId,
            applicationId: resp.applicationId,
          });
        }, 0);
        if (this.isclient) {
          const obj = resp;
          this.filterClientId = obj.clientId;
          this.getSiteNoByClientId(obj.clientId);
          this.registerForm.patchValue({
            site: obj.site,
            role: obj.role,
            clientId: obj.clientId,
            teamId: obj.teamId,
            invoiceNotificationFlag: obj.invoiceNotificationFlag
          });
        } else {
          this.registerForm.patchValue({
            userDepartmentVm: resp.department,
            designationLookupId: resp.designationLookupId,
          });
        }
        if (mode === 'view') {
          this.registerForm.disable();
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
        }
      }
    });
  }

  showNotification(severity1, summary1, message) {
    this.messageService.add({ severity: severity1, summary: summary1, detail: message });
  }
  bindClientUser() {
    this.masterService.getClientUser(this.applicationId).subscribe(res => {
      if (res) {
        res.forEach(element => {
          element.departmentName = element.departmentName.join(',');
        });
        if (this.local.teamName === 'EmploymentAbroad') {
          this.UserDetailGrid = res.filter(x => x.departmentName === 'Employment Abroad Department');
        } else {
          this.UserDetailGrid = res;
        }
        this.userTblAutoFilters();
      }
    });
  }
  resetPassword(data: any) {
    this.authService.resetpassword(data.userId).subscribe(res => {
      if (res.success) {
        this.showNotification('success', 'Success Message', 'Password has been reseted successfully');
        this.bindClientUser();
      }
    });
  }
  unlockUser(data: any) {
    this.authService.passwordUnlock(data.userId).subscribe(res => {
      if (res) {
        this.showNotification('success', 'Success Message', 'Account is unlocked successfully');
        this.bindClientUser();
      }
    });
  }
  reset() {
    if (this.registerForm.controls.userId.value > 0 && this.isEditFlag) {
      this.clientItems('');
      this.registerForm.patchValue({
        loggedIn: this.localUser,
        userName: this.common.tempResetData.userName,
        password: this.common.tempResetData.password,
        reTypePassword: this.common.tempResetData.password,
        firstName: this.common.tempResetData.firstName,
        lastName: this.common.tempResetData.lastName,
        email: this.common.tempResetData.emailId,
        active: this.common.tempResetData.active,
        clientId: this.common.tempResetData.clientId,
        userId: this.common.tempResetData.userId,
        personId: this.common.tempResetData.personId,
        userDepartmentVm: this.common.tempResetData.userDepartmentVm,
        component: this.common.tempResetData.component,
        createUser: this.common.tempResetData.createUser ? this.common.tempResetData.createUser : '',
      });
      if (this.isclient) {
        this.registerForm.patchValue({
          site: this.common.tempResetData.site,
          role: this.common.tempResetData.role,
          clientId: this.common.tempResetData.clientId,
        });
      } else {
        this.registerForm.patchValue({
          designationLookupId: this.common.tempResetData.createUser.designationLookupId,
          userDepartmentVm: this.common.tempResetData.createUser.userDepartmentVm,
        });
        this.clientUser = this.common.tempResetData.clientUser;
      }
    } else {
      this.isShow = false;
      this.numberflag = false;
      this.charflag = false;
      this.uniqueflag = false;
      this.minflag = false;
      this.registerForm.reset();
      this.registerForm.get('active')?.setValue(true);
      this.registerForm.get('applicationId')?.setValue(this.applicationId);
      this.registerForm.markAsPristine();
      this.registerForm.controls.userId.setValue(0);
      this.registerForm.controls.personId.setValue(0);
      this.registerForm.controls.loggedIn.setValue(this.localUser);
    }
  }
  resettable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    setTimeout(() => {
      this.userNameControl.setValue('');
      this.firstNameControl.setValue('');
      this.middleNameControl.setValue('');
      this.lastNameControl.setValue('');
      this.designationControl.setValue('');
      this.clientNameControl.setValue('');
      this.emailControl.setValue('');
      this.departmentNameControl.setValue('');
      this.componentNameControl.setValue('');
      this.siteNameControl.setValue('');
    }, 5);
  }
  closeUserCreate() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.showClientGrid = !this.showClientGrid;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.isEditFlag = false;
    this.registerForm.reset();
    this.common.tempResetData  = [];
  }
  addUser() {
    this.hide = true;
    this.hide1 = true;
    this.isShow = false;
    this.numberflag = false;
    this.charflag = false;
    this.uniqueflag = false;
    this.minflag = false;
    this.isEditFlag = false;
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.initFormGroup();
    if (!this.registerForm.get('password')?.value) {
      this.registerForm.get('reTypePassword')?.disable();
    }
    this.GetRole('acheck');
    this.GetRole('client');
    this.showClientGrid = !this.showClientGrid;
  }
  checkvalidUserName(userName: any) {
    if (userName) {
      this.masterService.checkvalidUserName(userName).subscribe(resp => {
        if (!resp.success && !this.isEditFlag) {
          this.registerForm.get('userName')?.setErrors({ incorrect: true });
        }
      });
    }
  }
  checkvalidEmail(emailId: any) {
    if (emailId) {
      if (!this.isEditFlag) {
        this.registerForm.controls.userId.setValue(0);
      }
      this.masterService.checkValidEmailId(this.registerForm.controls.userId.value, emailId).subscribe(resp => {
        if (!resp.success) {
          this.registerForm.get('email')?.setErrors({ incorrect: true });
        }
      });
    } else {
      this.registerForm.get('email')?.setValidators(Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
    }
  }
  getSiteNoByClientId(clients: any) {
    if (clients) {
      this.billingKeyup = false;
      this.registerForm.get('site')?.setValue(null);
      this.masterService.GetSiteNoByClientId(clients).subscribe(res => {
        if (res) {
          this.siteList = res;
        }
      });
    }
  }
  GetRole(type: string) {
    this.masterService.GetRole(this.applicationId).subscribe(res => {
      if (res) {
        if (type === 'client') {
          this.clientrolelist = res;
        } else {
          this.rolelist = res;
        }
      }
    });
  }
  checkValidValue(): void {
    const value = this.registerForm.get('clientId')?.value;
    if (value === '' || value == null) {
      this.registerForm.get('clientId')?.setValidators(Validators.required);
    } else if (this.billingKeyup) {
      this.registerForm.get('clientId')?.setErrors({ incorrect: true });
    } else {
      this.registerForm.get('clientId')?.setErrors(null);
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
  private userTblAutoFilters(): void {
    this.userNameFilteredOptions = this.userNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.userName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.firstNameFilteredOptions = this.firstNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.firstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.middleNameFilteredOptions = this.middleNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.middleName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.lastNameFilteredOptions = this.lastNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.lastName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.designationFilteredOptions = this.designationControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.designation).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.emailFilteredOptions = this.emailControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.email).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.departmentNameFilteredOptions = this.departmentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.departmentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.componentNameFilteredOptions = this.componentNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.componentName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.siteNameFilteredOptions = this.siteNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.UserDetailGrid.map(x => x.siteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  closeMenu(col: any) {
    switch (col) {
      case 'userName': this.userNameTrigger.closeMenu(); break;
      case 'firstName': this.firstNameTrigger.closeMenu(); break;
      case 'designation': this.designationTrigger.closeMenu(); break;
      case 'clientName': this.clientNameTrigger.closeMenu(); break;
      case 'emailId': this.emailTrigger.closeMenu(); break;
      case 'departmentName': this.departmentNameTrigger.closeMenu(); break;
      case 'componentName': this.componentNameTrigger.closeMenu(); break;
      case 'siteName': this.siteNameTrigger.closeMenu(); break;
      case 'all': this.siteNameTrigger.closeMenu(); break;
      default: break;
    }
  }
  displayColumnsChange() {
    this.selectedColumns = [
      { field: 'action', header: 'Action', disabled: true },
      ...this.displayColumns.filter(e => e.value === true)
    ];
  }
  showall() {
    if (this.UserDetailGrid.length > 0) {
      this.itemperpage = this.UserDetailGrid.length;
    }
  }
  fliterClientName(client): string {
    return this.client.find(f => f.clientId === client).clientName;
  }
}
//  Added By megala -04-04-2024 -VTS2-2024-CRT-0150
export class DeactiveUserInputVm {
  userId: number;
  deptId: number[];
  departmentID: number;
  deptName: string;
}
export class ReassignedChecksVm {
  teamId: number;
  subTeamId: number;
  userId: number
  teamLeadId: number
  AssignedChecks: [];
}
