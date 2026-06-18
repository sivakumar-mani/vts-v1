import { Component, OnInit, TemplateRef, SimpleChanges, OnChanges } from '@angular/core';
import { MasterService } from 'src/app/common-methods/services/master.service';
// import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
// import { element } from 'angular';

@Component({
  standalone: false,
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  screenAuth: any = {};
  math = Math;
  selectedTeamIndex = 0;
  teamList: SaveTeam[] = []; subTeamList: SaveSubTeam[] = [];
  getsubteamlist: any;
  selectedDisplayTeamValue = new SaveTeam();
  selectedDisplaySubTeamValue: SaveSubTeam[] = [];
  isHomePage = true;
  userData: any;
  selDeptName = undefined;

  teamRole = [];
  department = [];
  teamClient = [];
  teamOwner = [];


  subOwnerLists1: any;
  subOwnerLists2: any;

  subteamRole: any;
  subDepartment: any;
  subTeamClient: any;
  subTeamOwner: any;
  subTeamOwnerRole: any;

  teamLists: any;
  teamNameLists: any;
  deptName: any;
  teamLead: any;

  teamFormGroup: UntypedFormGroup;
  teamUsersFormGroup: UntypedFormGroup;
  teamTempUsersFormGroup: UntypedFormGroup;
  teamUsersFormGroupContent: any[] = [];

  deptNameControls: AutoCompleteDropDown;
  ownerNameControls: AutoCompleteDropDown;
  screeningNameControls: AutoCompleteDropDown;
  // teamControls: AutoCompleteDropDown;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  fruits = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];

  //  Team

  //  Team End

  //  SubTeam

  subTeamEditIndex = -1;
  systemTeamNames: any;
  systemSubTeamNames: any;
  teamId: any;
  currentsubTeamClient = [];
  currentsubTeamRole = [];
  currentsubTeamOwnerRole = [];
  currentsubTeamMember = [];
  currentteamClient = [];
  currentteamRole = [];
  currentteamOwner = [];
  currentteamOwnerRole = [];
  currentteamMember = [];
  isDesc: boolean;
  column: any;
  direction: number;
  currentsubTeamOwner = [];
  subteamname: string = '';

  //  SubTeam End
  teamNames = new UntypedFormControl('');
  SubsystemTeamNames: any;
  sysSubTeamLookId: any;
  constructor(private fb: UntypedFormBuilder, private masterService: MasterService, public dialog: MatDialog, private authService: AuthService,
    public commonService: CommonService, private message: MessageService, private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data'));
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.getTeams('Grid', 0);
  }

  getTeamData(team: SaveTeam, index) {
    if (this.selectedTeamIndex !== index) {
      this.selectedTeamIndex = index;
      this.getTeams('DataContent', team.teamId);
    }
  }
  getClient(list) {
    if (list && list.length > 0) {
      list = list.filter(x => x.active = true);
      return list;
    } else {
      return list;
    }
  }
  getTeams(type: 'Grid' | 'DataContent', teamID: number) {
    if (type === 'Grid') {
      this.masterService.getTeam(type === 'Grid' ? 0 : teamID).subscribe((resp: SaveTeam[]) => {
        if (type === 'Grid') {
          this.teamList = resp;
          this.teamList.forEach(e => e.badgeValue = this.randomGen(6));
        } else {
          this.selectedDisplayTeamValue = resp[0];
          // this.getSubTeams();
        }
      }, err => { }, () => {
        if (type === 'Grid') {
          if (this.teamList.length > 0) {
            this.getTeams('DataContent', this.teamList[0].teamId);
          }
        } else {
        }
      });
    } else {
      this.selectedDisplayTeamValue = this.teamList.filter(e => e.teamId === teamID)[0];
    }

  }

  addTeam() {
    this.isHomePage = false;
    this.initTeamFormGroup();
    this.getTeamDetail();
  }

  saveTeam() {
    // this.isHomePage = true;
    this.saveForm();
  }

  initTeamFormGroup() {
    this.teamFormGroup = this.fb.group({
      teamId: [0],
      active: [true],
      autoAssignFlag: [false],
      teamDescription: ['', Validators.required],
      // systemTeamName: [''],
      teamName: ['', Validators.required],
      deptId: ['', [Validators.required]],
      loggedIn: [this.userData.userId],
      teamRole: new UntypedFormControl(null),
      teamClient: new UntypedFormControl(null),
      teamOwner: new UntypedFormControl(null),
      teamOwnerRole: new UntypedFormControl(null),
      teamMember: new UntypedFormControl(null),
      subTeam: [] = []
    });
    this.deptNameControls = new AutoCompleteDropDown('Department Name', 'deptId', 'departmentId', 'departmentName', this.department,
      '', this.teamFormGroup, false, false, true);

  }

  getTeamDetail() {
    this.masterService.getTeamDetail().subscribe(resp => {
      if (resp) {
        this.systemTeamNames = resp.teamSystemValue;
        this.systemSubTeamNames = resp.subTeamSystemValue;
        // this.teamRole = resp.teamRole;
        this.department = resp.department;
        this.teamClient = resp.teamClient;
        // this.teamOwner = resp.teamOwner;
        this.teamClient.sort((a, b) => a.clientName.localeCompare(b.clientName));
        // this.teamClient.splice(0, 0, {
        //   clientId: 'All Client', clientName: 'All Client',
        //   active: true,
        // });
        this.deptNameControls = new AutoCompleteDropDown('Department Name', 'deptId', 'departmentId', 'departmentName', this.department,
          '', this.teamFormGroup, false, false, true);
      }
    });
  }

  async editTeam(data) {
    this.teamId = data.teamId;
    await this.addTeam();
    const teamValue: SaveTeam = this.teamList.filter(e => e.teamId === data.teamId)[0];
    this.masterService.getUsersByDeptID(teamValue.deptId).subscribe(resp => {
      if (resp) {
        this.teamRole = resp.teamRole;
        this.teamOwner = resp.teamOwner;
        teamValue.subTeam.forEach(element => {
          element.loggedIn = this.userData.userId;
        });
        this.teamFormGroup.patchValue({
          teamId: teamValue.teamId,
          teamName: teamValue.teamName,
          teamDescription: teamValue.teamDescription,
          deptId: teamValue.deptId,
          active: teamValue.active,
          autoAssignFlag: teamValue.autoAssignFlag,
          teamRole: teamValue.teamRole,
          teamClient: teamValue.teamClient,
          teamOwner: teamValue.teamOwner,
          teamMember: teamValue.teamMember,
          teamOwnerRole: teamValue.teamOwnerRole,
          subTeam: teamValue.subTeam
        });

        setTimeout(() => {
          this.teamFormGroup.get('deptId').patchValue(teamValue.deptId);
        }, 50);

        this.commonService.tempResetData = this.commonService.CloneObject(teamValue);
        this.commonService.tempResetData.teamRole = this.commonService.CloneObject(teamValue.teamRole);
        this.commonService.tempResetData.teamClient = this.commonService.CloneObject(teamValue.teamClient);
        this.commonService.tempResetData.teamOwner = this.commonService.CloneObject(teamValue.teamOwner);
        this.commonService.tempResetData.teamMember = this.commonService.CloneObject(teamValue.teamMember);
        this.commonService.tempResetData.teamOwnerRole = this.commonService.CloneObject(teamValue.teamOwnerRole);
        this.commonService.tempResetData.subTeam = this.commonService.CloneObject(teamValue.subTeam);
      }
    });
  }

  saveForm() {
    if (!this.teamFormGroup.get('teamOwner').value) {
      this.teamFormGroup.get('teamOwner').setValidators(Validators.required);
      this.teamFormGroup.get('teamOwner').updateValueAndValidity();
    } else {
      this.teamFormGroup.get('teamOwner').clearValidators();
      this.teamFormGroup.get('teamOwner').updateValueAndValidity();
    }
    if (!this.teamFormGroup.get('teamOwnerRole').value) {
      this.teamFormGroup.get('teamOwnerRole').setValidators(Validators.required);
      this.teamFormGroup.get('teamOwnerRole').updateValueAndValidity();
    } else {
      this.teamFormGroup.get('teamOwnerRole').clearValidators();
      this.teamFormGroup.get('teamOwnerRole').updateValueAndValidity();
    }
    if (!this.teamFormGroup.get('teamClient').value) {
      this.teamFormGroup.get('teamClient').setValidators(Validators.required);
      this.teamFormGroup.get('teamClient').updateValueAndValidity();
    } else {
      this.teamFormGroup.get('teamClient').clearValidators();
      this.teamFormGroup.get('teamClient').updateValueAndValidity();
    }
    const value = this.teamFormGroup.get('teamMember').value;
    if (value) {
      this.teamFormGroup.get('teamRole').setValidators(Validators.required);
      this.teamFormGroup.get('teamRole').updateValueAndValidity();
    } else if (value !== null && value.length && value.length > 0) {
      this.teamFormGroup.get('teamRole').setValidators(Validators.required);
      this.teamFormGroup.get('teamRole').updateValueAndValidity();
    } else {
      this.teamFormGroup.get('teamRole').clearValidators();
      this.teamFormGroup.get('teamRole').updateValueAndValidity();
    }
    if (this.teamFormGroup.valid) {
      if (this.teamFormGroup.controls.teamId.value > 0) {
        // Team
        this.currentteamClient = this.teamFormGroup.get('teamClient').value;
        const deletedteamClient = this.commonService.tempResetData.teamClient.filter(f => !this.currentteamClient
          .some(s => s.clientId === f.clientId));
        deletedteamClient.map(m => m.active = false);
        this.currentteamClient.push(...deletedteamClient);
        this.teamFormGroup.controls.teamClient.setValue(this.currentteamClient);

        this.currentteamRole = this.teamFormGroup.get('teamRole').value;
        const deletedteamRole = this.commonService.tempResetData.teamRole.filter(f => !this.currentteamRole
          .some(s => s.roleId === f.roleId));
        deletedteamRole.map(m => m.active = false);
        this.currentteamRole.push(...deletedteamRole);
        this.teamFormGroup.controls.teamRole.setValue(this.currentteamRole);

        this.currentteamOwner = this.teamFormGroup.get('teamOwner').value;
        const deletedteamOwner = this.commonService.tempResetData.teamOwner.filter(f => !this.currentteamOwner
          .some(s => s.userId === f.userId));
        deletedteamOwner.map(m => m.active = false);
        this.currentteamOwner.push(...deletedteamOwner);
        this.teamFormGroup.controls.teamOwner.setValue(this.currentteamOwner);

        this.currentteamOwnerRole = this.teamFormGroup.get('teamOwnerRole').value;
        const deletedteamOwnerRole = this.commonService.tempResetData.teamOwnerRole.filter(f => !this.currentteamOwnerRole
          .some(s => s.roleId === f.roleId));
        deletedteamOwnerRole.map(m => m.active = false);
        this.currentteamOwnerRole.push(...deletedteamOwnerRole);
        this.teamFormGroup.controls.teamOwnerRole.setValue(this.currentteamOwnerRole);

        this.currentteamMember = this.teamFormGroup.get('teamMember').value;
        const deletedteamMember = this.commonService.tempResetData.teamMember.filter(f => !this.currentteamMember
          .some(s => s.userId === f.userId));
        deletedteamMember.map(m => m.active = false);
        this.currentteamMember.push(...deletedteamMember);
        this.teamFormGroup.controls.teamMember.setValue(this.currentteamMember);
        // set active false for sub team multicontrol // start
        const list = this.commonService.CloneObject(this.teamFormGroup.getRawValue());
        list.subTeam.forEach((e, i) => {
          if (e.subTeamId > 0) {
            const ctrls = [{ ctl: 'subTeamClient', id: 'clientId' }, { ctl: 'subTeamRole', id: 'roleId' }, {
              ctl: 'subTeamOwnerRole',
              id: 'roleId'
            }, { ctl: 'subTeamMember', id: 'userId' }, { ctl: 'subTeamOwner', id: 'roleId' }];
            for (const ctrl of ctrls) {
              const checked = e[ctrl.ctl];
              const unChecked = this.commonService.tempResetData.subTeam[i][ctrl.ctl].filter(f => !checked.some(s => s[ctrl.id] === f[ctrl.id]));
              unChecked.map(m => m.active = false);
              checked.push(...unChecked);
              e[ctrl.ctl] = checked;
            }
          }
        });
        this.teamFormGroup.get('subTeam').setValue(list.subTeam);
        // end
      }
      this.masterService.SaveTeam(this.teamFormGroup.value).subscribe(resp => {
        if (resp.success) {
          this.showTopCenter('success', 'Success Message',
            this.teamFormGroup.controls['teamId'].value === 0 ? 'Saved Successfully' : 'Updated Successfully');
          this.isHomePage = false;
          this.teamNames.setValue('');
          this.getTeams('Grid', 0);
          this.closeTeamForm();
        }
      });
    } else {
      this.teamFormGroup.markAllAsTouched();
    }
  }

  getDeptName(departmentId) {
    this.selDeptName = this.department.filter(e => e.departmentId === departmentId)[0].departmentName;
    this.masterService.getUsersByDeptID(departmentId).subscribe(resp => {
      if (resp) {
        this.teamRole = resp.teamRole;
        this.teamOwner = resp.teamOwner;
        if (resp.teamOwner && resp.teamOwner.length === 0) {
          this.teamFormGroup.get('deptId').setValue(null);
          this.showTopCenter('warn', 'Failure Message', ('Please Select Department which have users...  ' + this.selDeptName + ' do not have user'));
        }
      }
    });
  }
  getSystemTeamName(departmentId) {
    this.selDeptName = this.department.filter(e => e.departmentId === departmentId)[0].departmentName;
  }
  deleteTeam(data) {
    this.masterService.DeleteTeam(data.teamId, this.userData.userId).subscribe(resp => {
      if (resp.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getTeams('Grid', 0);
      }
    });
  }

  closeTeamForm() {
    this.teamFormGroup.reset();
    this.isHomePage = true;
    this.teamNames.setValue('');
    this.selDeptName = undefined;
  }

  /// SubTeam
  openSubTeamBar(subteamDialog: TemplateRef<any>, type: 'edit' | 'add', data?: any, index: number = -1) {
    this.subTeamEditIndex = index;
    this.sysSubTeamLookId = (data === undefined || data === null ) ? 617 : data.systemValueLookupId ;
    // this.subteamname = data.subTeamName
    this.initSubTeamFormGroup();
    this.getSubTeamDetail();
    if (type === 'edit') {
      this.subteamname = data.subTeamName
      this.editSubTeam(data);
    }
    // if (this.teamFormGroup.valid) {
    this.dialog.open(subteamDialog, {
      width: '850px',
      // disableClose: true
    });
    // }
  }

  initSubTeamFormGroup() {
    this.teamUsersFormGroup = this.fb.group({
      subTeamId: [0],
      active: [true],
      autoAssignFlag: [false],
      teamId: [0, [Validators.required]],
      lead1: [''],
      lead2: [''],
      systemValueLookupId :new UntypedFormControl(null),
      subTeamName: ['', Validators.required],
      subTeamDescription: ['', Validators.required],
      loggedIn: [this.userData.userId],
      subTeamOwner: new UntypedFormControl(null, Validators.required),
      subTeamMember: new UntypedFormControl(null),
      subTeamRole: new UntypedFormControl(null),
      subTeamClient: new UntypedFormControl(null),
      subTeamOwnerRole: new UntypedFormControl(null),
      lead1Name: new UntypedFormControl('')
    });

    this.ownerNameControls = new AutoCompleteDropDown('Sub Team Owner', 'lead1', 'userId', 'name', this.subOwnerLists1,
      '', this.teamUsersFormGroup, false, false, true);
    this.screeningNameControls = new AutoCompleteDropDown('Owner Name 2', 'lead2', 'userId', 'name', this.subOwnerLists2,
      '', this.teamUsersFormGroup, false, false, true);
  }

  getSubTeams() {
    this.masterService.getSubTeam(0).subscribe((resp: SaveSubTeam[]) => {
      this.subTeamList = resp;
    }, err => { }, () => {
      this.selectedDisplaySubTeamValue = this.subTeamList.filter(e => e.teamId === this.selectedDisplayTeamValue.teamId);
    });
  }

  getSubTeamDetail() {
    this.masterService.getTeamDetail().subscribe(resp => {
      if (resp) {
        const teamvalues = resp.teamSystemValue;
        this.SubsystemTeamNames = teamvalues.filter( x => x.lookUpName ==='Training Opeartion Team')
        // this.subteamRole = resp.teamRole;
        this.subTeamOwnerRole = this.teamRole;
        this.subteamRole = this.teamRole;
        this.subTeamOwner = this.teamOwner;

        // this.subDepartment = resp.department;
        this.subTeamClient = resp.teamClient;
        // this.subTeamOwner = resp.teamOwner;
        this.subOwnerLists1 = this.teamOwner;




        // this.subOwnerLists2 = this.commonService.CloneObject(this.subOwnerLists1);
        this.subTeamClient.sort((a, b) => a.clientName.localeCompare(b.clientName));
        // this.subTeamClient.splice(0, 0, {
        //   clientId: 'All Client', clientName: 'All Client',
        //   active: true,
        // });
        this.ownerNameControls = new AutoCompleteDropDown('Sub Team Owner', 'lead1', 'userId', 'name', this.subOwnerLists1,
          '', this.teamUsersFormGroup, false, false, true);
        this.screeningNameControls = new AutoCompleteDropDown('Owner Name 2', 'lead2', 'userId', 'name', this.subOwnerLists2,
          '', this.teamUsersFormGroup, false, false, true);
      }
    });
  }

  getChangeTeam(event) {
    const List = this.teamNameLists.find(x => x.teamId === event);
    this.deptName = List.deptName;
    this.teamLead = List.teamOwner;
  }

  getownerName1() {
    const ownerId1 = this.teamUsersFormGroup.get('lead1').value;
    if (ownerId1) {
      const eventIdx = this.subOwnerLists1.findIndex(x => x.userId === ownerId1);
      this.teamOwner = this.subOwnerLists1;
    } else {
      this.subOwnerLists2 = this.subOwnerLists2;
      this.teamOwner = this.teamOwner;
    }
    this.ownerNameControls = new AutoCompleteDropDown('Owner Name 1', 'lead1', 'userId', 'name', this.subOwnerLists1,
      '', this.teamUsersFormGroup, false, false, true);
  }

  saveSubTeamForm() {
    if (!this.teamUsersFormGroup.get('subTeamRole').value) {
      this.teamUsersFormGroup.get('subTeamRole').setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamRole').updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamRole').clearValidators();
      this.teamUsersFormGroup.get('subTeamRole').updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamClient').value) {
      this.teamUsersFormGroup.get('subTeamClient').setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamClient').updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamClient').clearValidators();
      this.teamUsersFormGroup.get('subTeamClient').updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamMember').value) {
      this.teamUsersFormGroup.get('subTeamMember').setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamMember').updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamMember').clearValidators();
      this.teamUsersFormGroup.get('subTeamMember').updateValueAndValidity();
    }
    if (!this.teamUsersFormGroup.get('subTeamOwnerRole').value) {
      this.teamUsersFormGroup.get('subTeamOwnerRole').setValidators(Validators.required);
      this.teamUsersFormGroup.get('subTeamOwnerRole').updateValueAndValidity();
    } else {
      this.teamUsersFormGroup.get('subTeamOwnerRole').clearValidators();
      this.teamUsersFormGroup.get('subTeamOwnerRole').updateValueAndValidity();
    }
    if (this.teamUsersFormGroup.valid) {
      if (!this.teamFormGroup.controls["subTeam"].value) {
        this.teamFormGroup.controls["subTeam"].setValue([]);
      }

      // if (this.subTeamEditIndex === -1 && this.teamUsersFormGroup.controls['subTeamId'].value === 0) {
      //   this.teamFormGroup.controls["subTeam"].value.push(this.teamUsersFormGroup.value);
      // } else if (this.subTeamEditIndex !== -1) {

      //   // Sub Team
      //   // this.currentsubTeamClient = this.teamUsersFormGroup.get('subTeamClient').value;
      //   // const deletedsubTeamClient = this.commonService.tempResetData.subTeam.subTeamClient.filter(f => !this.currentsubTeamClient
      //   //   .some(s => s.clientId === f.clientId));
      //   // deletedsubTeamClient.map(m => m.active = false);
      //   // this.currentsubTeamClient.push(...deletedsubTeamClient);
      //   // this.teamUsersFormGroup.controls.subTeamClient.setValue(this.currentsubTeamClient);

      //   // this.currentsubTeamRole = this.teamUsersFormGroup.get('subTeamRole').value;
      //   // const deletedsubTeamRole = this.commonService.tempResetData.subTeam.subTeamRole.filter(f => !this.currentsubTeamRole
      //   //   .some(s => s.roleId === f.roleId));
      //   // deletedsubTeamRole.map(m => m.active = false);
      //   // this.currentsubTeamRole.push(...deletedsubTeamRole);
      //   // this.teamUsersFormGroup.controls.subTeamRole.setValue(this.currentsubTeamRole);

      //   // this.currentsubTeamOwnerRole = this.teamUsersFormGroup.get('subTeamOwnerRole').value;
      //   // const deletedsubTeamOwnerRole = this.commonService.tempResetData.subTeam.subTeamOwnerRole.filter(f => !this.currentsubTeamOwnerRole
      //   //   .some(s => s.roleId === f.roleId));
      //   // deletedsubTeamOwnerRole.map(m => m.active = false);
      //   // this.currentsubTeamOwnerRole.push(...deletedsubTeamOwnerRole);
      //   // this.teamUsersFormGroup.controls.subTeamOwnerRole.setValue(this.currentsubTeamOwnerRole);

      //   // this.currentsubTeamMember = this.teamUsersFormGroup.get('subTeamMember').value;
      //   // const deletedsubTeamMember = this.commonService.tempResetData.subTeam.subTeamMember.filter(f => !this.currentsubTeamMember
      //   //   .some(s => s.userId === f.userId));
      //   // deletedsubTeamMember.map(m => m.active = false);
      //   // this.currentsubTeamMember.push(...deletedsubTeamMember);
      //   // this.teamUsersFormGroup.controls.subTeamMember.setValue(this.currentsubTeamMember);

      //   // this.currentsubTeamOwner = this.teamUsersFormGroup.get('subTeamOwner').value;
      //   // const deletedsubTeamOwner = this.commonService.tempResetData.subTeam.subTeamOwner.filter(f => !this.currentsubTeamOwner
      //   //   .some(s => s.roleId === f.roleId));
      //   // deletedsubTeamOwner.map(m => m.active = false);
      //   // this.currentsubTeamOwner.push(...deletedsubTeamOwner);
      //   // this.teamUsersFormGroup.controls.subTeamOwner.setValue(this.currentsubTeamOwner);

      //   // const val = this.subOwnerLists1.find(x => x.userId === this.teamUsersFormGroup.value.lead1).name;
      //   // this.teamUsersFormGroup.get('lead1Name').setValue(val);

      //   this.teamFormGroup.controls["subTeam"].value[+this.subTeamEditIndex] = this.teamUsersFormGroup.value;
      // }

      // if (this.teamUsersFormGroup.controls['subTeamId'].value === 0) {
      // } else {
      //   // const subTeamIndex = this.teamFormGroup.controls["subTeam"].value.indexOf(
      //   //   this.teamFormGroup.controls["subTeam"].value.filter(e => e.subTeamId
      //   //     === this.teamUsersFormGroup.controls['subTeamId'].value)[0]);
      //   this.teamFormGroup.controls["subTeam"].value[+this.subTeamEditIndex] = this.teamUsersFormGroup.value;
      // }

      // this.showTopCenter('success', 'Success Message',
      // this.teamUsersFormGroup.controls['subTeamId'].value === 0 ? 'Saved Successfully' : 'Updated Successfully');
      // this.teamUsersFormGroup.reset();
      // this.dialog.closeAll();
      if (this.subTeamEditIndex === -1)
        this.teamUsersFormGroup.controls.teamId.setValue(this.teamId);
      this.teamTempUsersFormGroup = this.teamUsersFormGroup;
      let subTeamId = this.teamUsersFormGroup.controls['subTeamId'].value;
      let subTeamIndex = this.subTeamEditIndex;
      this.masterService.SaveSubTeamDetails(this.teamUsersFormGroup.value).subscribe(resp => {
        if (resp.success) {
          subTeamId = resp.value;
          if (subTeamIndex === -1 && this.teamTempUsersFormGroup.controls['subTeamId'].value === 0) {
            this.teamTempUsersFormGroup.controls.subTeamId.setValue(subTeamId);
            this.teamFormGroup.controls["subTeam"].value.push(this.teamTempUsersFormGroup.value);
          } else if (subTeamIndex !== -1) {
            this.teamTempUsersFormGroup.controls.subTeamId.setValue(subTeamId);
            this.teamFormGroup.controls["subTeam"].value[+subTeamIndex] = this.teamTempUsersFormGroup.value;
          }
          this.showTopCenter('success', 'Success Message',
            this.teamUsersFormGroup.controls['subTeamId'].value === 0 ? 'Saved Successfully' : 'Updated Successfully');
          this.teamUsersFormGroup.reset();
          this.dialog.closeAll();
        }
      });

      // if (this.subTeamEditIndex === -1 && this.teamTempUsersFormGroup.controls['subTeamId'].value === 0) {
      //   this.teamTempUsersFormGroup.controls.subTeamId.setValue(subTeamId);
      //   this.teamFormGroup.controls["subTeam"].value.push(this.teamTempUsersFormGroup.value);
      // } else if (this.subTeamEditIndex !== -1) {
      //   this.teamTempUsersFormGroup.controls.subTeamId.setValue(subTeamId);
      //   this.teamFormGroup.controls["subTeam"].value[+this.subTeamEditIndex] = this.teamTempUsersFormGroup.value;
      // }

    } else {
      this.teamUsersFormGroup.markAllAsTouched();
    }
  }

  deleteSubTeam(data) {
    this.masterService.deleteSubTeam(data.subTeamId, this.userData.userId).subscribe(resp => {
      if (resp.success) {
        this.teamFormGroup.controls['subTeam'].value.splice(this.subTeamEditIndex, 1);
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      }
    }, err => { }, () => {
    });
  }

  async editSubTeam(data) {
    const subTeamValue: SaveSubTeam = this.teamFormGroup.controls['subTeam'].value.filter(e => e.subTeamId === data.subTeamId)[0];

    await this.teamUsersFormGroup.patchValue({
      active: subTeamValue.active,
      autoAssignFlag: subTeamValue.autoAssignFlag,
      teamId: subTeamValue.teamId,
      subTeamId: subTeamValue.subTeamId,
      subTeamName: subTeamValue.subTeamName,
      subTeamDescription: subTeamValue.subTeamDescription,
      subTeamClient: subTeamValue.subTeamClient,
      // lead1: subTeamValue.lead1,
      // lead2: subTeamValue.lead2,
      subTeamOwner: subTeamValue.subTeamOwner,
      subTeamMember: subTeamValue.subTeamMember,
      subTeamRole: subTeamValue.subTeamRole,
      subTeamOwnerRole: subTeamValue.subTeamOwnerRole,
      loggedIn: this.userData.userId,
      systemValueLookupId: subTeamValue.systemValueLookupId
    });

    // this.commonService.tempResetData.subTeam = this.commonService.CloneObject(subTeamValue);
    // this.commonService.tempResetData.teamRole = this.commonService.CloneObject(subTeamValue.teamRole);
    // this.commonService.tempResetData.teamClient = this.commonService.CloneObject(subTeamValue.teamClient);
    // this.commonService.tempResetData.teamOwner = this.commonService.CloneObject(subTeamValue.teamOwner);
    // this.commonService.tempResetData.teamMember = this.commonService.CloneObject(subTeamValue.teamMember);
    // this.commonService.tempResetData.teamOwnerRole = this.commonService.CloneObject(subTeamValue.teamOwnerRole);
    // this.commonService.tempResetData.subTeam = this.commonService.CloneObject(subTeamValue.subTeam);
  }

  //  common
  public openDialog(data, from: 'team' | 'subTeam', index: number = -1) {
    this.subTeamEditIndex = index;
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
            if (from === 'team') {
              this.deleteTeam(data);
            } else {
              this.deleteSubTeam(data);
            }
          }
        }
        this.subTeamEditIndex = -1;
      });
    }
  }

  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }

  getCaps(paramvalue: string): string {
    if (paramvalue) {
      // let capsParam = paramvalue;
      // const spaceCount = paramvalue.split(' ');
      // capsParam = (spaceCount.length > 1) ? spaceCount[0][0] + spaceCount[1][0] : spaceCount[0][0];
      // return capsParam.toUpperCase();
      const name = (paramvalue.split(' ').length - 1) > 0 ? (paramvalue.split(' ')[0].charAt(0).toUpperCase() +
        paramvalue.split(' ')[1].charAt(0).toUpperCase()) : paramvalue.charAt(0).toUpperCase();
      return name;
    }
  }

  randomGen(randomEndValue: number): number {
    return Math.floor(Math.random() * randomEndValue) + 1;
  }
  sortBy(type) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
}


class SaveTeam {
  teamId: number;
  teamName: string;
  teamDescription: string;
  deptId: number;
  active: boolean;
  loggedIn: number;
  badgeValue: number;
  teamRole: UserRole[] = [];
  teamClient: TeamClient[] = [];
  teamOwner: UserPerson[] = [];
  teamOwnerRole: UserRole[] = [];
  teamMember: UserPerson[] = [];
  deptName: string;
  subTeam: SaveSubTeam[] = [];
  autoAssignFlag: boolean;
}

class SaveSubTeam {
  subTeamId: number;
  subTeamName: string;
  teamId: number;
  subTeamDescription: string;
  lead1: number;
  lead2?: number;
  active: boolean;
  loggedIn: number;
  subTeamOwner: UserPerson[] = [];
  subTeamRole: UserRole[] = [];
  subTeamClient: TeamClient[] = [];
  subTeamMember: UserPerson[] = [];
  subTeamOwnerRole: UserRole[] = [];
  teamName: string;
  lead1Name: string;
  lead2Name: string;
  autoAssignFlag: boolean;
  systemValueLookupId: number;
}

class UserRole {
  roleId: number;
  roleName: string;
  active: boolean;
}

class UserPerson {
  userId: number;
  name: string;
  active?: boolean;
}

class TeamClient {
  clientId: string;
  clientName: string;
  active?: boolean;
}

