import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  standalone: false,
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  itemperpage;
  showClientGrid;
  districtKeyup = false;
  showFlag = false;
  isEdit: boolean;
  dialogRef: any;
  data: any;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Location / State';
  displayedColumns = [
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  stateList: any[] = [];
  countryList: any[] = [];
  stateFormGroup: UntypedFormGroup;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  currentPage = 1;
  tempCurrentPage = 1;
  countryControl!: AutoCompleteDropDown;
  stateControl!: AutoCompleteDropDown;
  showstateDetail: boolean;
  screenAuth: any = {};
  userData: any;
  constructor(public common: CommonService, public master: MasterService, public dialog: MatDialog, private fb: UntypedFormBuilder, private auth: AuthService, private message: MessageService, private masterService: MasterService, public formBuilder: UntypedFormBuilder,
    private router: Router, ) { }

  ngOnInit() {
    this.itemperpage = 10;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initLocationForm();
    this.getCountryList();
    this.getState();
  }
  initLocationForm() {
    this.stateFormGroup = this.fb.group({
      countryId: new UntypedFormControl(),
      stateId: new UntypedFormControl(0),
      stateName: new UntypedFormControl(),
      country: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      createdUserId: new UntypedFormControl(this.userData.userId)

    });
    this.countryControl = new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
      '', this.stateFormGroup, false, false, true);
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        setTimeout(() => {
          const countryId = 92;
          this.selectContry(countryId);
        }, 0);
        // console.log('this.countryList', this.countryList);
        this.countryControl = new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.stateFormGroup, false, false, true);
      }
    });
  }
  selectContry(result: any): void {
    let countryId = 0;
    if (typeof result === 'number') {
      countryId = result;
    } else {
      countryId = result.countryId;
    }
    if (countryId) {
      this.districtKeyup = false;
      const value = this.stateFormGroup.get('countryId')?.setValue(result);
      this.master.GetStatesList(countryId).subscribe(res => {
        if (res) {
          // this.stateList = res;
          // console.log('this.sateList', this.stateList);
          this.stateControl = new AutoCompleteDropDown('State', 'stateId', 'stateId', 'stateName', this.stateList,
            '', this.stateFormGroup, false, false, true);
        }
      });
    }
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
  editDetail(data, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initLocationForm();
    this.master.getStateById(data.stateId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.stateFormGroup.patchValue({
            active: this.common.tempResetData.active,
            stateId: this.common.tempResetData.stateId,
            stateName: this.common.tempResetData.stateName,
            countryId: this.common.tempResetData.countryId,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.stateFormGroup.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.stateFormGroup.get('singleEditFlag')?.setValue(true);
        }
        this.stateFormGroup.get('stateId')?.disable();
      }
    });
    this.showFlag = !this.showFlag;
  }
  saveState() {
    if (this.stateFormGroup.valid) {
      this.masterService.updateState(this.stateFormGroup.getRawValue()).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.getState();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.stateFormGroup.markAllAsTouched();
    }
  }
  addStateList() {
    this.initLocationForm();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  resetForm() {
    this.stateFormGroup.reset();
    this.stateFormGroup.markAsPristine();
    this.initLocationForm();
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.stateFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  getState() {
    this.masterService.getState().subscribe(res => {
      if (res != null) {
        this.stateList = res;
      }
    });
  }
  deleteState() {
    this.masterService.deleteState(this.data.stateId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getState();
      }
    });
  }
  showall() {
    if (this.stateList.length > 0) {
      this.itemperpage = this.stateList.length;
    }
  }
}
