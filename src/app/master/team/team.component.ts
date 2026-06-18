import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Observable } from 'rxjs';

import {  MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MasterService } from '../../common-methods/services/master.service';
import { CommonService } from '../../common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  breadcrumbFlags = new BreadcrumbFlags();
  showFlag = false;
  routePath = 'Client / Client Team';
  displayedColumns = [
    { field: 'teamName', header: 'Team Name' },
    { field: 'teamDescription', header: 'Team Description' },
    { field: 'clientTeamRole', header: 'Client Team Role' },
    { field: 'active', header: 'Active' },
  ];
  teamNameFormCtrl = new UntypedFormControl();
  teamNameFilteredOptions: Observable<string[]>;
  @ViewChild('teamNameTrigger', { static: true }) teamNameTrigger!: MatMenuTrigger;
  teamDescriptionFormCtrl = new UntypedFormControl();
  teamDescriptionFilteredOptions: Observable<string[]>;
 @ViewChild('teamDescriptionTrigger', { static: true }) 
teamDescriptionTrigger!: MatMenuTrigger;

  // teamOwnerFormCtrl = new UntypedFormControl();
  // teamOwnerFilteredOptions: Observable<string[]>;
  // @ViewChild('teamOwnerTrigger', { static: true }) teamOwnerTrigger: MatMenuTrigger;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  @ViewChild('global', { static: true }) global!: ElementRef;
  clientTeamFormGroup: UntypedFormGroup;
  isEditFlag = false;
  userData: any;
  deletedClientTeamRole: any[] = [];
  currentClientTeamRole: any[] = [];
  clientTeamRoleList: any[] = [];
  getClientTeamLists: SaveTeam[] = [];
  selectedTeamIndex = 0;
  selectedDisplayTeamValue = new SaveTeam() ;
  UserDetailGrid: any[] = [];
  isDesc: boolean;
  column: any;
  direction: number;
  constructor(private fb: UntypedFormBuilder, private commonService: CommonService, public dialog: MatDialog, private message: MessageService,
    // tslint:disable-next-line:align
    private authService: AuthService, private masterService: MasterService, private router: Router, ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.commonService.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.getClientTeam('Grid');
    this.getClientTeamRole();
  }
  sortBy(type: any) {
    this.isDesc = !this.isDesc;
    this.column = type;
    this.direction = this.isDesc ? 1 : -1;
  }
  getClientTeam(type: 'Grid' | 'DataContent') {
    // this.masterService.getClientTeam().subscribe(resp => {
    //   if (type === 'Grid') {
    //     this.getClientTeamLists = resp;
    //     this.getClientTeamLists.forEach(e => e.badgeValue = this.randomGen(6));
    //   } else {
    //     this.selectedDisplayTeamValue = resp[0];
    //   }
    // }, err => { }, () => {
    //   this.TblAutoFilters();
    // });

    if (type === 'Grid') {
      this.masterService.getClientTeam().subscribe((resp: SaveTeam[]) => {
        if (type === 'Grid') {
          this.getClientTeamLists = resp;
          this.bindClientUser();
          this.getClientTeamLists.forEach(e => e.badgeValue = this.randomGen(6));
        } else {
          this.selectedDisplayTeamValue = resp[0];
        }
      }, err => { }, () => {
        if (type === 'Grid') {
          if (this.getClientTeamLists.length > 0) {
            this.getClientTeam('DataContent');
          }
        }
      });
    } else {
      this.selectedDisplayTeamValue = this.getClientTeamLists[this.selectedTeamIndex];
    }
  }
 bindClientUser() {
    this.masterService.getClientUser(2).subscribe(res => {
      if (res) {
        this.UserDetailGrid = res;
        this.getClientTeamLists.forEach((element) => {
        const userList = this.UserDetailGrid.filter(x => x.teamId === element.teamId);
        if (userList.length > 0) {
        element.teamFlag = true;
        }
        });
      }
    });
  }
  randomGen(randomEndValue: number): number {
    return Math.floor(Math.random() * randomEndValue) + 1;
  }

  getCaps(paramvalue: string): string {
    let capsParam = paramvalue;
    const spaceCount = paramvalue.split(' ');
    capsParam = (spaceCount.length > 1) ? spaceCount[0][0] + spaceCount[1][0] : spaceCount[0][0];
    return capsParam.toUpperCase();
  }
  getTeamData(team, index) {
    if (this.selectedTeamIndex !== index) {
      this.selectedTeamIndex = index;
      this.getClientTeam('DataContent');
    }
  }
  initFormGroup() {
    this.clientTeamFormGroup = this.fb.group({
      teamId: [0],
      active: [true],
      teamDescription: [''],
      teamName: [''],
      loggedIn: [this.userData.userId],
      clientTeamRole: new UntypedFormControl(null, Validators.required),
    });
  }
  getClientTeamRole() {
    this.masterService.getClientTeamRole().subscribe(resp => {
      if (resp) {
        this.clientTeamRoleList = resp;
      }
    });
  }
  resetTable() {
    // this.dt.reset();
    // this.global.nativeElement.value = '';
    // this.TblAutoFilters();
  }
  resetForm() {
    if (this.clientTeamFormGroup.controls.teamId.value > 0) {
      this.clientTeamFormGroup.patchValue({
        active: this.commonService.tempResetData.active,
        teamId: this.commonService.tempResetData.teamId,
        teamName: this.commonService.tempResetData.teamName,
        teamDescription: this.commonService.tempResetData.teamDescription,
        clientTeamRole: this.commonService.tempResetData.clientTeamRole,
      });
    } else {
      this.clientTeamFormGroup.reset();
      this.initFormGroup();
    }
  }
  closeForm() {
    this.clientTeamFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
  }
  saveForm() {
    if (this.clientTeamFormGroup.valid) {
      if (this.isEditFlag) {
        this.currentClientTeamRole = this.clientTeamFormGroup.get('clientTeamRole')?.value;
        this.deletedClientTeamRole = this.commonService.tempResetData.clientTeamRole
          .filter(f => !this.currentClientTeamRole.some(s => s.roleId === f.roleId));
        this.deletedClientTeamRole.map(m => m.active = false);
        this.currentClientTeamRole.push(...this.deletedClientTeamRole);
        this.clientTeamFormGroup.controls.clientTeamRole.setValue(this.currentClientTeamRole);
      }
      this.masterService.saveClientTeam(this.clientTeamFormGroup.value).subscribe(resp => {
        if (resp.success) {
          if (this.isEditFlag) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.isEditFlag = false;
          this.getClientTeam('Grid');
          this.closeForm();
        }
      });
    } else {
      this.clientTeamFormGroup.markAllAsTouched();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
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
    this.commonService.tempResetData = data;
    this.clientTeamFormGroup.patchValue({
      teamId: data.teamId,
      teamName: data.teamName,
      teamDescription: data.teamDescription,
      clientTeamRole: data.clientTeamRole,
      active: data.active,
      loggedIn: this.userData.userId
    });
    this.commonService.tempResetData.clientTeamRole = this.commonService.CloneObject(data.clientTeamRole);
    this.showFlag = !this.showFlag;
  }
  deleteForm(data: any) {
    this.masterService.deleteClientTeam(data.teamId, this.userData.userId).subscribe(resp => {
      if (resp.success) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getClientTeam('Grid');
      }
    });
  }
  // getTotalPages(totalRecords, rows) {
  //   this.totalpages = Math.ceil((totalRecords) / rows);
  //   return Math.ceil((totalRecords) / rows);
  // }
  // navigateNxtPrevPage(pageNo, rows) {
  //   this.currentPage = pageNo / rows;
  //   this.tempCurrentPage = this.currentPage;
  // }
  // navigatePage(pageNo, rowscount) {
  //   if (+pageNo > this.totalpages || +pageNo <= 0) {
  //     this.currentPage = this.tempCurrentPage;
  //   } else {
  //     this.dt.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
  //     this.tempCurrentPage = this.currentPage;
  //   }
  // }
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
  // private TblAutoFilters(): void {
  //   this.teamNameFilteredOptions = this.teamNameFormCtrl.valueChanges.pipe(startWith(''),
  //     map(value =>
  //       (Array.from(new Set(this.getClientTeamLists.map(x => x.teamName).filter(x => x))).sort())
  //         .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  //   this.teamDescriptionFilteredOptions = this.teamDescriptionFormCtrl.valueChanges.pipe(startWith(''),
  //     map(value =>
  //       (Array.from(new Set(this.getClientTeamLists.map(x => x.teamDescription).filter(x => x))).sort())
  //         .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  // }
}
class SaveTeam {
  teamId: number;
  teamName: string;
  teamDescription: string;
  active: boolean;
  loggedIn: number;
  badgeValue: number;
  clientTeamRole: TeamRole[] = [];
  teamFlag: boolean;
}
class TeamRole {
  roleId: number;
  roleName: string;
  active?: boolean;
}
