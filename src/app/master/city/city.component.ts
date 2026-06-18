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
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  itemperpage;
  showClientGrid;
  cityKeyup = false;
  showFlag = false;
  isEdit: boolean;
  dialogRef: any;
  data: any;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Location / City';
  displayedColumns = [
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'districtName', header: 'District' },
    { field: 'cityName', header: 'City' },
    { field: 'active', header: 'Active' },
  ];

  frozenCols = [
    { field: 'action', header: 'Action' },
  ];

  cityList: any[] = [];
  districtList: any[] = [];
  stateList: any[] = [];
  countryList: any[] = [];
  selectedCityList: any[] = [];
  cityFormGroup: UntypedFormGroup;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  currentPage = 1;
  tempCurrentPage = 1;
  countryControl!: AutoCompleteDropDown;
  stateControl!: AutoCompleteDropDown;
  districtControl!: AutoCompleteDropDown;
  showcityDetail: boolean;
  screenAuth: any = {};
  userData: any;
  constructor(public common: CommonService, public master: MasterService, public dialog: MatDialog,
    private fb: UntypedFormBuilder, private auth: AuthService, private message: MessageService,
    private masterService: MasterService, public formBuilder: UntypedFormBuilder, private router: Router, ) { }

  ngOnInit() {
    this.itemperpage = 10
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initLocationForm();
    this.getCountryList();
    this.getCity();
    this.getDistrict();
    this.cityFormGroup.get('countryId')?.setValue(92);
  }
  initLocationForm() {
    this.cityFormGroup = this.fb.group({
      cityId: new UntypedFormControl(0),
      countryId: new UntypedFormControl(),
      stateId: new UntypedFormControl(),
      districtId: new UntypedFormControl(),
      cityName: new UntypedFormControl(),
      districtName: new UntypedFormControl(),
      stateName: new UntypedFormControl(),
      country: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      createdUserId: new UntypedFormControl(this.userData.userId)

    });
    this.countryControl = new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
      '', this.cityFormGroup, false, false, true);
    this.stateControl = new AutoCompleteDropDown('State', 'stateId', 'stateId', 'stateName', this.stateList,
      '', this.cityFormGroup, false, false, true);
    this.districtControl = new AutoCompleteDropDown('District', 'districtId', 'districtId', 'districtName', this.districtList,
      '', this.cityFormGroup, false, false, true);
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        setTimeout(() => {
          const countryId = 92;
          this.selectcontry(countryId);
        }, 0);
        // console.log('this.countryList', this.countryList);
        this.countryControl = new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
          '', this.cityFormGroup, false, false, true);
      }
    });
  }
  getDistrict() {
    this.master.getDistrict().subscribe(res => {
      if (res) {
        this.districtList = res;
      }
    })
  }
  selectcontry(result: any): void {
    let countryId = 0;
    if (typeof result === 'number') {
      countryId = result;
    } else {
      countryId = result.countryId;
    }
    if (countryId) {
      this.cityKeyup = false;
      const value = this.cityFormGroup.get('countryId')?.setValue(result);
      this.master.GetStatesList(countryId).subscribe(res => {
        if (res) {
          this.stateList = res;
          // console.log('this.sateList', this.stateList);
          this.stateControl = new AutoCompleteDropDown('State', 'stateId', 'stateId', 'stateName', this.stateList,
            '', this.cityFormGroup, false, false, true);
        }
      });
    }
  }

  selectstate(result: any): void {
    let stateId = 0;
    if (typeof result === 'number') {
      stateId = result;
    } else {
      stateId = result.stateId;
    }
    if (stateId) {
      this.cityKeyup = false;
      const value = this.cityFormGroup.get('stateId')?.setValue(result);
      this.master.GetDistrictList(stateId).subscribe(res => {
        if (res) {
          this.districtList = res;
          // console.log('this.districtList', this.districtList);
          this.cityKeyup = false;
          this.districtControl = new AutoCompleteDropDown('District', 'districtId', 'districtId', 'districtName', this.districtList,
            '', this.cityFormGroup, false, false, true);
        }
      });
    }
  }

  selectdistrict(result: any) {
    let districtId = 0;
    if (typeof result === 'number') {
      districtId = result;
    } else {
      districtId = result.districtId;
    }
    if (districtId) {
      this.cityKeyup = false;
      const value = this.cityFormGroup.get('districtId')?.setValue(result);
      this.master.GetCityListMaster(districtId).subscribe(res => {
        if (res) {
          this.currentPage = 1;
          //this.cityList = res;
          this.cityKeyup = false;
          // console.log('this.cityList', this.cityList);
        }
      });
    }
  }

  checkState(event: any) {
    if (event.value.trim() === '') {
      this.cityList = [];
      this.cityFormGroup.get('districtId')?.setValue(null);

    }
  }

  checkDistrict(event: any) {
    if (event.value.trim() === '') {
      this.cityList = [];
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
  resetTable() {
    this.cityFormGroup.reset();
    this.cityList = [];
    this.dt.reset();
    this.currentPage = 1;
    this.cityFormGroup.get('countryId')?.setValue(92);
  }
  editDetail(data, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initLocationForm();
    this.master.getCityById(data.cityId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.cityFormGroup.patchValue({
            cityName: this.common.tempResetData.cityName,
            cityId: this.common.tempResetData.cityId,
            active: this.common.tempResetData.active,
            stateId: this.common.tempResetData.stateId,
            countryId: this.common.tempResetData.countryId,
            districtId: this.common.tempResetData.districtId,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.cityFormGroup.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.cityFormGroup.get('singleEditFlag')?.setValue(true);
        }
        this.cityFormGroup.get('cityId')?.disable();
      }
    });
    this.showFlag = !this.showFlag;
  }
  saveCity() {
    if (this.cityFormGroup.valid) {
      this.masterService.updateCity(this.cityFormGroup.getRawValue()).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.getCity();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.cityFormGroup.markAllAsTouched();
    }
  }
  cityactiveinactive(event, rowdata) {
    this.cityList.map(m => {
      if (m.cityId === rowdata.cityId) {
        m.active = event.checked
      }
    });
  }
  addCityList() {
    this.initLocationForm();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  resetForm() {
    const editcityId = this.cityFormGroup.controls.cityId.value;
    this.cityFormGroup.controls.cityId.setValue(0);
    this.cityFormGroup.reset();
    this.cityFormGroup.markAsPristine();
    this.initLocationForm();
    if (this.isEdit) {
      this.cityFormGroup.controls.cityId.setValue(editcityId);
    }
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.cityFormGroup.reset();
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
  getCity() {
    this.masterService.getCity().subscribe(res => {
      if (res != null) {
        this.cityList = res;
      }
    });
  }
  deleteCity() {
    this.masterService.deleteCity(this.data.cityId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getCity();
      }
    });
  }
  showall() {
    if (this.cityList.length > 0) {
      this.itemperpage = this.cityList.length;
    }
  }
}
