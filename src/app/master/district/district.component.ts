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
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {
  itemperpage;
  showClientGrid;
  districtKeyup = false;
  showFlag = false;
  isEdit: boolean;
  dialogRef: any;
  data: any;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Location / District';
  displayedColumns = [
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'districtName', header: 'District' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  districtList: any[] = [];
  stateList: any[] = [];
  countryList: any[] = [];
  districtFormGroup: UntypedFormGroup;
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  countryControl!: AutoCompleteDropDown;
  stateControl!: AutoCompleteDropDown;
  showdistrictDetail: boolean;
  screenAuth: any = {};
  userData: any;

  constructor(
    public common: CommonService,
    public master: MasterService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private auth: AuthService,
    private message: MessageService,
    private masterService: MasterService,
    public formBuilder: UntypedFormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initLocationForm();
    this.getCountryList();
    this.getDistrict();
    this.getState();
    this.districtFormGroup.get('countryId').setValue(92);
    this.itemperpage = 10;
  }

  initLocationForm() {
    this.districtFormGroup = this.fb.group({
      districtId: new UntypedFormControl(0),
      countryId: new UntypedFormControl(),
      stateId: new UntypedFormControl(),
      districtName: new UntypedFormControl(),
      stateName: new UntypedFormControl(),
      country: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      createdUserId: new UntypedFormControl(this.userData.userId)
    });
    this.countryControl = new AutoCompleteDropDown(
      'Country', 'countryId', 'countryId', 'country', this.countryList,
      '', this.districtFormGroup, false, false, true
    );
    this.stateControl = new AutoCompleteDropDown(
      'State', 'stateId', 'stateId', 'stateName', this.stateList,
      '', this.districtFormGroup, false, false, true
    );
  }

  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        // FIX: Recreate control FIRST so it's stable, then set default value.
        this.countryControl = new AutoCompleteDropDown(
          'Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.districtFormGroup, false, false, true
        );
        setTimeout(() => {
          this.selectContry(92);
        }, 0);
      }
    });
  }

  getState() {
    this.master.getState().subscribe(res => {
      if (res) {
        this.stateList = res;
      }
    });
  }

  selectContry(result: any): void {
    let countryId = 0;

    if (typeof result === 'number') {
      // Programmatic call e.g. selectContry(92)
      countryId = result;
    } else if (result && typeof result === 'object') {
      // Autocomplete emits full object on re-selection
      countryId = result.countryId;
    } else if (typeof result === 'string' && result.trim()) {
      // FIX: Angular 12 â€” first-time selection emits display string, not object.
      // Look up countryId by matching display name.
      const match = this.countryList.find(
        c => c.country && c.country.toLowerCase() === result.trim().toLowerCase()
      );
      if (match) {
        countryId = match.countryId;
      }
    } else {
      // Ignore boolean / spurious Ivy emissions
      return;
    }

    // Validate countryId exists in loaded list
    const validCountry = this.countryList.find(c => c.countryId === countryId);
    if (!countryId || !validCountry) {
      return;
    }

    this.districtKeyup = false;

    // FIX: emitEvent: false â€” prevents valueChanges from firing on the form group,
    // which stops AutoCompleteDropDown subscriptions from clearing sibling controls.
    this.districtFormGroup.get('countryId').setValue(countryId, { emitEvent: false });

    this.master.GetStatesList(countryId).subscribe(res => {
      if (res) {
        this.stateList = res;

        // Clear stateId silently when country changes
        this.districtFormGroup.get('stateId').setValue(null, { emitEvent: false });

        this.stateControl = new AutoCompleteDropDown(
          'State', 'stateId', 'stateId', 'stateName', this.stateList,
          '', this.districtFormGroup, false, false, true
        );
      }
    });
  }

  selectState(result: any): void {
    let stateId = 0;

    // FIX: Save countryId BEFORE any setValue calls.
    // AutoCompleteDropDown's internal valueChanges can wipe sibling controls.
    const savedCountryId = this.districtFormGroup.get('countryId').value;

    if (typeof result === 'number') {
      stateId = result;
    } else if (result && typeof result === 'object') {
      stateId = result.stateId;
    } else if (typeof result === 'string' && result.trim()) {
      // FIX: Angular 12 â€” first-time selection emits display string, not object.
      // Look up stateId by matching display name.
      const match = this.stateList.find(
        s => s.stateName && s.stateName.toLowerCase() === result.trim().toLowerCase()
      );
      if (match) {
        stateId = match.stateId;
      }
    } else {
      // Ignore unexpected Ivy emissions
      return;
    }

    // Validate stateId exists in loaded list
    const validState = this.stateList.find(s => s.stateId === stateId);
    if (!stateId || !validState) {
      return;
    }

    this.districtKeyup = false;

    // FIX: emitEvent: false â€” prevents valueChanges cascade that clears countryId
    this.districtFormGroup.get('stateId').setValue(stateId, { emitEvent: false });

    // FIX: After setValue, AutoCompleteDropDown may still clear countryId via
    // its own internal logic. Restore it in the next tick if it got wiped.
    setTimeout(() => {
      const currentCountryId = this.districtFormGroup.get('countryId').value;
      if (!currentCountryId && savedCountryId) {
        this.districtFormGroup.get('countryId').setValue(savedCountryId, { emitEvent: false });
      }
    }, 0);

    this.master.GetDistrictListMaster(stateId).subscribe(res => {
      if (res) {
        this.currentPage = 1;
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

  editDetail(data, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initLocationForm();
    this.master.getDistrictById(data.districtId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.districtFormGroup.patchValue({
            districtId: this.common.tempResetData.districtId,
            active: this.common.tempResetData.active,
            stateId: this.common.tempResetData.stateId,
            countryId: this.common.tempResetData.countryId,
            districtName: this.common.tempResetData.districtName,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.districtFormGroup.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.districtFormGroup.get('singleEditFlag').setValue(true);
        }
        this.districtFormGroup.get('districtId').disable();
      }
    });
    this.showFlag = !this.showFlag;
  }

  saveDistrict() {
    if (this.districtFormGroup.valid) {
      this.masterService.updateDistrict(this.districtFormGroup.getRawValue()).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.getDistrict();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.districtFormGroup.markAllAsTouched();
    }
  }

  districtactiveinactive(event, rowData) {
    this.districtList.map(m => {
      if (m.districtId === rowData.districtId) {
        m.active = event.checked;
      }
    });
  }

  addDistrictList() {
    this.initLocationForm();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }

  resetForm() {
    const editdistrictId = this.districtFormGroup.controls.districtId.value;
    this.districtFormGroup.controls.districtId.setValue(0);
    this.districtFormGroup.reset();
    this.districtFormGroup.markAsPristine();
    this.initLocationForm();
    if (this.isEdit) {
      this.districtFormGroup.controls.districtId.setValue(editdistrictId);
    }
  }

  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.districtFormGroup.reset();
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

  getDistrict() {
    this.masterService.getDistrict().subscribe(res => {
      if (res != null) {
        this.districtList = res;
      }
    });
  }

  deleteDistrict() {
    this.masterService.deleteDistrict(this.data.districtId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getDistrict();
      }
    });
  }

  showall() {
    if (this.districtList.length) {
      this.itemperpage = this.districtList.length;
    }
  }
}