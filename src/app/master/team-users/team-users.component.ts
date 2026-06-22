import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { AuthService } from '../../common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { Table, TableModule } from 'primeng/table';
import { AutoCompleteDropDown } from '../../common-methods/models/autoComplete';
import { MasterService } from '../../common-methods/services/master.service';
import { SharedService } from '../../common-methods/services/shared.service';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-team-users',
  templateUrl: './team-users.component.html',
  styleUrls: ['./team-users.component.css']
})
export class TeamUsersComponent implements OnInit {
  breadcrumbFlags = new BreadcrumbFlags();
  showFlag = false;
  routePath = 'Screening / Team Users';
  caseLists = [{ caseReferenceNo: 647644, clientName: 'admin admin', applicantId: 75876, candidateName: 'AC-125-589' }];
  displayedColumns = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'teamName', header: 'Team Name' },
    { field: 'subTeamName', header: 'Sub Team Name' },
    { field: 'subTeamDescription', header: 'Sub Team Description' },
    { field: 'lead1Name', header: 'Owner Name 1' },
    // { field: 'lead2Name', header: 'Owner Name 2' },
    { field: 'subTeamClient', header: 'Client' },
    { field: 'subTeamRole', header: 'Role' },
    { field: 'subTeamMember', header: 'User' },
    { field: 'active', header: 'Active' },
  ];
 teamNameFormCtrl = new UntypedFormControl();
teamNameFilteredOptions!: Observable<string[]>;
@ViewChild('teamNameTrigger') teamNameTrigger!: MatMenuTrigger;

deptNameFormCtrl = new UntypedFormControl();
deptNameFilteredOptions!: Observable<string[]>;
@ViewChild('deptNameTrigger') deptNameTrigger!: MatMenuTrigger;

screeningOwnerFName1FormCtrl = new UntypedFormControl();
screeningOwnerFName1FilteredOptions!: Observable<string[]>;
@ViewChild('screeningOwnerFName1Trigger') screeningOwnerFName1Trigger!: MatMenuTrigger;

screeningOwnerFName2FormCtrl = new UntypedFormControl();
screeningOwnerFName2FilteredOptions!: Observable<string[]>;
@ViewChild('screeningOwnerFName2Trigger') screeningOwnerFName2Trigger!: MatMenuTrigger;

userPersonVmFormCtrl = new UntypedFormControl();
userPersonVmFilteredOptions!: Observable<string[]>;
@ViewChild('userPersonVmTrigger') userPersonVmTrigger!: MatMenuTrigger;

totalpages!: number;

@ViewChild('dt') dt!: Table;
@ViewChild('global') global!: ElementRef;

  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  teamUsersFormGroup: UntypedFormGroup;
  // deptNameControls!: AutoCompleteDropDown;
  ownerNameControls!: AutoCompleteDropDown;
  screeningNameControls!: AutoCompleteDropDown;
  userNameControls!: AutoCompleteDropDown;
  teamControls!: AutoCompleteDropDown;
  userLists: any[] = [];
  deptLists: any;
  ownerLists1: any;
  ownerLists2: any;
  teamOwnerRole: any;
  isEditFlag = false;
  userData: any;
  editLists: any;
  getTeamLists: any[] = [];
  userClone: any;
  owner2Clone: any;
  deletedUser: any[] = [];
  currentUser: any[] = [];
  deletedRole: any[] = [];
  currentOwnerRole: any[] = [];
  deletedOwnerRole: any[] = [];
  currentRole: any[] = [];
  deletedClient: any[] = [];
  currentClient: any[] = [];
  teamRole: any;
  department: any;
  teamClient: any;
  teamOwner: any;
  teamLists: any;
  teamNameLists: any;
  deptName: any;
  teamLead: any;


  constructor(private fb: UntypedFormBuilder, private commonService: CommonService, public dialog: MatDialog,
    // tslint:disable-next-line:align
    private authService: AuthService, private masterService: MasterService, private sharedService: SharedService,
    private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.commonService.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.getSubTeams();
    this.getTeamNameLists();
    this.getTeamDetail();
  }
  getTeamNameLists() {
    this.masterService.GetTeamName().subscribe(resp => {
      this.teamNameLists = resp;
      this.teamControls = new AutoCompleteDropDown('Team', 'teamId', 'teamId', 'teamName', this.teamNameLists,
        '', this.teamUsersFormGroup, false, false, true);
    }, err => { }, () => {
      this.TblAutoFilters();
    });
  }
  getChangeTeam(event: any) {
    const List = this.teamNameLists.find(x => x.teamId === event);
    this.deptName = List.deptName;
    this.teamLead = List.teamOwner;
  }
  getTeamDetail() {
    this.masterService.getTeamDetail().subscribe(resp => {
      if (resp) {
        this.teamRole = resp.teamRole;
        this.teamOwnerRole = resp.teamRole;
        this.department = resp.department;
        this.teamClient = resp.teamClient;
        this.teamOwner = resp.teamOwner;
        this.ownerLists1 = resp.teamOwner;
        this.ownerLists2 = this.commonService.CloneObject(this.ownerLists1);
        this.teamClient.sort((a, b) => a.clientName.localeCompare(b.clientName));
        this.teamClient.splice(0, 0, {
          clientId: 'All Client', clientName: 'All Client',
          active: true,
        });
        // this.deptNameControls = new AutoCompleteDropDown('Department Name', 'deptId', 'departmentId', 'departmentName', this.department,
        //   '', this.teamUsersFormGroup, false, false, true);
        this.ownerNameControls = new AutoCompleteDropDown('Owner Name 1', 'lead1', 'userId', 'name', this.ownerLists1,
          '', this.teamUsersFormGroup, false, false, true);
        this.screeningNameControls = new AutoCompleteDropDown('Owner Name 2', 'lead2', 'userId', 'name', this.ownerLists2,
          '', this.teamUsersFormGroup, false, false, true);
        // this.teamControls = new AutoCompleteDropDown('Team', 'teamId1', 'lead2', 'name', this.ownerLists2,
        //   '', this.teamUsersFormGroup, false, false, true);
      }
    });
  }
  getSubTeams() {
    this.masterService.getSubTeam(0).subscribe(resp => {
      this.getTeamLists = resp;
    }, err => { }, () => {
      this.TblAutoFilters();
    });
  }
  initFormGroup() {
    this.teamUsersFormGroup = this.fb.group({
      subTeamId: [0],
      active: [true],
      teamId: ['', [Validators.required]],
      lead1: ['', [Validators.required]],
      lead2: [''],
      subTeamName: ['', Validators.required],
      subTeamDescription: ['', Validators.required],
      loggedIn: [this.userData.userId],
      subTeamMember: new UntypedFormControl(null),
      subTeamRole: new UntypedFormControl(null),
      subTeamClient: new UntypedFormControl(null),
      subTeamOwnerRole: new UntypedFormControl(null)
    });
    // this.deptNameControls = new AutoCompleteDropDown('Department Name', 'deptId', 'departmentId', 'departmentName', this.department,
    //   '', this.teamUsersFormGroup, false, false, true);
    this.ownerNameControls = new AutoCompleteDropDown('Owner Name 1', 'lead1', 'userId', 'name', this.ownerLists1,
      '', this.teamUsersFormGroup, false, false, true);
    this.screeningNameControls = new AutoCompleteDropDown('Owner Name 2', 'lead2', 'userId', 'name', this.ownerLists2,
      '', this.teamUsersFormGroup, false, false, true);
    this.teamControls = new AutoCompleteDropDown('Team', 'teamId', 'teamId', 'teamName', this.teamNameLists,
      '', this.teamUsersFormGroup, false, false, true);
  }

  getownerName1() {
    const ownerId1 = this.teamUsersFormGroup.get('lead1')?.value;
    if (ownerId1) {
      const eventIdx = this.ownerLists1.findIndex(x => x.userId === ownerId1);
      // const temp = this.ownerLists1.filter(f => f.userId === this.ownerLists1[eventIdx].userId);
      // console.log(temp, 'temp');
      // this.ownerLists2.splice(eventIdx, 1);
      // this.teamOwner = this.ownerLists2;
      this.teamOwner = this.ownerLists1;
      // if (this.teamUsersFormGroup.get('lead1')?.value === this.teamUsersFormGroup.get('lead2')?.value) {
      //   this.teamUsersFormGroup.get('lead2')?.setValue('');
      //   this.teamUsersFormGroup.get('teamMember')?.setValue('');
      //   this.ownerLists2.push(temp);
      // }
    } else {
      this.ownerLists2 = this.ownerLists2;
      this.teamOwner = this.teamOwner;
    }
    this.ownerNameControls = new AutoCompleteDropDown('Owner Name 1', 'lead1', 'userId', 'name', this.ownerLists1,
      '', this.teamUsersFormGroup, false, false, true);
  }
  getownerName2() {
    // this.ownerLists2 = this.ownerLists2;
    this.screeningNameControls = new AutoCompleteDropDown('Owner Name 2', 'lead2', 'userId', 'name', this.ownerLists2,
      '', this.teamUsersFormGroup, false, false, true);
  }

  resetTable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
  }
  resetForm() {
    if (this.teamUsersFormGroup.controls.teamId.value > 0) {
      this.teamUsersFormGroup.patchValue({
        subTeamId: this.commonService.tempResetData.subTeamId,
        subTeamName: this.commonService.tempResetData.subTeamName,
        subTeamDescription: this.commonService.tempResetData.subTeamDescription,
        lead1: this.commonService.tempResetData.lead1,
        lead2: this.commonService.tempResetData.lead2,
        active: this.commonService.tempResetData.active,
        subTeamRole: this.commonService.tempResetData.subTeamRole,
        subTeamClient: this.commonService.tempResetData.subTeamClient,
        subTeamMember: this.commonService.tempResetData.subTeamMember
      });
    } else {
      this.teamUsersFormGroup.reset();
      // this.teamUsersFormGroup.get('teamMember')?.clearValidators();
      this.initFormGroup();
    }
  }
  closeForm() {
    this.teamUsersFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
  }
  saveForm() {
    if (!this.teamUsersFormGroup.get('subTeamRole')?.value) {
      this.teamUsersFormGroup.get('subTeamRole')?.setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamRole')?.updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamRole')?.clearValidators();
      this.teamUsersFormGroup.get('subTeamRole')?.updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamClient')?.value) {
      this.teamUsersFormGroup.get('subTeamClient')?.setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamClient')?.updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamClient')?.clearValidators();
      this.teamUsersFormGroup.get('subTeamClient')?.updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamMember')?.value) {
      this.teamUsersFormGroup.get('subTeamMember')?.setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamMember')?.updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamMember')?.clearValidators();
      this.teamUsersFormGroup.get('subTeamMember')?.updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamOwnerRole')?.value) {
      this.teamUsersFormGroup.get('subTeamOwnerRole')?.setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamOwnerRole')?.updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamOwnerRole')?.clearValidators();
      this.teamUsersFormGroup.get('subTeamOwnerRole')?.updateValueAndValidity();
    }
    if (this.teamUsersFormGroup.valid) {
      if (this.isEditFlag) {
        this.currentUser = this.teamUsersFormGroup.get('subTeamMember')?.value;
        this.deletedUser = this.commonService.tempResetData.subTeamMember
          .filter(f => !this.currentUser.some(s => s.userId === f.userId));
        this.deletedUser.map(m => m.active = false);
        this.currentUser.push(...this.deletedUser);
        this.teamUsersFormGroup.controls.subTeamMember.setValue(this.currentUser);

        this.currentRole = this.teamUsersFormGroup.get('subTeamRole')?.value;
        this.deletedRole = this.commonService.tempResetData.subTeamRole
          .filter(f => !this.currentRole.some(s => s.roleId === f.roleId));
        this.deletedRole.map(m => m.active = false);
        this.currentRole.push(...this.deletedRole);
        this.teamUsersFormGroup.controls.subTeamRole.setValue(this.currentRole);

        this.currentOwnerRole = this.teamUsersFormGroup.get('subTeamOwnerRole')?.value;
        this.deletedOwnerRole = this.commonService.tempResetData.subTeamOwnerRole
          .filter(f => !this.currentOwnerRole.some(s => s.roleId === f.roleId));
        this.deletedOwnerRole.map(m => m.active = false);
        this.currentOwnerRole.push(...this.deletedOwnerRole);
        this.teamUsersFormGroup.controls.subTeamOwnerRole.setValue(this.currentOwnerRole);

        this.currentClient = this.teamUsersFormGroup.get('subTeamClient')?.value;
        this.deletedClient = this.commonService.tempResetData.subTeamClient
          .filter(f => !this.currentClient.some(s => s.clientId === f.clientId));
        this.deletedClient.map(m => m.active = false);
        this.currentClient.push(...this.deletedClient);
        this.teamUsersFormGroup.controls.subTeamClient.setValue(this.currentClient);
      }
      this.masterService.SaveSubTeam(this.teamUsersFormGroup.value).subscribe(resp => {
        if (resp.success) {
          if (this.isEditFlag) {
            this.showNotification('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showNotification('success', 'Success Message', 'Saved Successfully');
          }
          this.isEditFlag = false;
          this.getSubTeams();
          this.closeForm();
        }
      });
    }
  }
  showNotification(level: string, info: string, message: string) {
    this.sharedService.emitChange({
      severity: level,
      summary: info,
      detail: message
    });
  }
  openForm() {
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.initFormGroup();
    this.showFlag = !this.showFlag;
  }
  editForm(data: any) {
    this.isEditFlag = true;
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup();
    this.masterService.getSubTeam(data.subTeamId).subscribe(resp => {
      if (resp) {
        this.teamUsersFormGroup.patchValue({
          active: resp[0].active,
          teamId: resp[0].teamId,
          subTeamId: resp[0].subTeamId,
          subTeamName: resp[0].subTeamName,
          subTeamDescription: resp[0].subTeamDescription,
          subTeamClient: resp[0].subTeamClient,
          lead1: resp[0].lead1,
          lead2: resp[0].lead2,
          subTeamMember: resp[0].subTeamMember,
          subTeamRole: resp[0].subTeamRole,
          subTeamOwnerRole: resp[0].subTeamOwnerRole,
        });
        this.getChangeTeam(this.teamUsersFormGroup.get('teamId')?.value);
        this.commonService.tempResetData = resp[0];
        this.commonService.tempResetData.subTeamRole = this.commonService.CloneObject(resp[0].subTeamRole);
        this.commonService.tempResetData.subTeamClient = this.commonService.CloneObject(resp[0].subTeamClient);
        this.commonService.tempResetData.subTeamMember = this.commonService.CloneObject(resp[0].subTeamMember);
        this.commonService.tempResetData.subTeamOwnerRole = this.commonService.CloneObject(resp[0].subTeamOwnerRole);
      }
    });
    this.showFlag = !this.showFlag;
  }
  deleteForm(data: any) {
    this.masterService.deleteSubTeam(data.subTeamId, this.userData.userId).subscribe(resp => {
      if (resp.success) {
        this.showNotification('warn', 'Success Message', 'Deleted Successfully');
        this.getSubTeams();
      }
    });
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
  public openDialog(data: any) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
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
          if (action === this.commonService.DELETECONFIRMATION) {
            this.deleteForm(data);
          }
        }
      });
    }
  }
  private TblAutoFilters(): void {
    this.teamNameFilteredOptions = this.teamNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getTeamLists.map(x => x.teamName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.deptNameFilteredOptions = this.deptNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getTeamLists.map(x => x.deptName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    // this.userPersonVmFilteredOptions = this.userPersonVmFormCtrl.valueChanges.pipe(startWith(''),
    //   map(value =>
    //     (Array.from(new Set(this.getTeamLists.map(x => x.userPersonVm).filter(x => x))).sort())
    //       .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.screeningOwnerFName1FilteredOptions = this.screeningOwnerFName1FormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getTeamLists.map(x => x.screeningOwnerFName1).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.screeningOwnerFName2FilteredOptions = this.screeningOwnerFName2FormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.getTeamLists.map(x => x.screeningOwnerFName2).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
}
