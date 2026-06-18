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
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  itemperpage;
  showClientGrid;
  placeKeyup = false;
  showFlag = false;
  isEdit: boolean;
  dialogRef: any;
  data: any;
  breadcrumbFlags = new BreadcrumbFlags();
  routePath = 'Configure / Location / Place';
  displayedColumns = [
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'districtName', header: 'District' },
    { field: 'cityName', header: 'City' },
    { field: 'locationName', header: 'Place' },
    { field: 'postalCode', header: 'Zip Code' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];

  placeList: any[] = [];
  cityList: any[] = [];
  districtList: any[] = [];
  stateList: any[] = [];
  countryList: any[] = [];
  placeFormGroup: UntypedFormGroup;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  currentPage = 1;
  tempCurrentPage = 1;
  countryControl!: AutoCompleteDropDown;
  stateControl!: AutoCompleteDropDown;
  districtControl!: AutoCompleteDropDown;
  cityControl!: AutoCompleteDropDown;
  showcityDetail: boolean;
  screenAuth: any = {};
  userData: any;
  constructor(public common: CommonService, public master: MasterService, public dialog: MatDialog, private fb: UntypedFormBuilder, private auth: AuthService, private message: MessageService, private masterService: MasterService, public formBuilder: UntypedFormBuilder, private router: Router, ) { }
  ngOnInit() {
    this.itemperpage = 10;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initLocationForm();
    this.getCountryList();
    this.getDistrict();
    this.getCity();
    this.getPlace();
    this.placeFormGroup.get('countryId')?.setValue(92);
  }
  initLocationForm() {
    this.placeFormGroup = this.fb.group({
      locationId: new UntypedFormControl(0),
      cityId: new UntypedFormControl(),
      countryId: new UntypedFormControl(),
      stateId: new UntypedFormControl(),
      districtId: new UntypedFormControl(),
      locationName: new UntypedFormControl(),
      cityName: new UntypedFormControl(),
      districtName: new UntypedFormControl(),
      stateName: new UntypedFormControl(),
      country: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      postalCode: new UntypedFormControl(),
      createdUserId: new UntypedFormControl(this.userData.userId)
    });
    this.countryControl = new AutoCompleteDropDown('Country', 'countryId', 'countryId', 'country', this.countryList,
      '', this.placeFormGroup, false, false, true);
    this.stateControl = new AutoCompleteDropDown('State', 'stateId', 'stateId', 'stateName', this.stateList,
      '', this.placeFormGroup, false, false, true);
    this.districtControl = new AutoCompleteDropDown('District', 'districtId', 'districtId', 'districtName', this.districtList,
      '', this.placeFormGroup, false, false, true);
    this.cityControl = new AutoCompleteDropDown('City', 'cityId', 'cityId', 'cityName', this.cityList,
      '', this.placeFormGroup, false, false, true);
  }
  getDistrict() {
    this.master.getDistrict().subscribe(res => {
      if (res) {
        this.districtList = res;;
      }
    })
  }
  getCity() {
    this.master.getCity().subscribe(res => {
      if (res) {
        this.cityList = res;
      }
    })
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
          '', this.placeFormGroup, false, false, true);
      }
    });
  }
  selectcontry(result: any): void {
    let countryId = 0;
    if (typeof result === 'number') {
      countryId = result;
    } else {
      countryId = result.countryId;
    }
    if (countryId) {
      this.placeKeyup = false;
      const value = this.placeFormGroup.get('countryId')?.setValue(result);
      this.master.GetStatesList(countryId).subscribe(res => {
        if (res) {
          this.stateList = res;
          // console.log('this.sateList', this.stateList);
          this.stateControl = new AutoCompleteDropDown('State', 'stateId', 'stateId', 'stateName', this.stateList,
            '', this.placeFormGroup, false, false, true);
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
      this.placeKeyup = false;
      const value = this.placeFormGroup.get('stateId')?.setValue(result);
      this.master.GetDistrictList(stateId).subscribe(res => {
        if (res) {
          this.districtList = res;
          // console.log('this.districtList', this.districtList);
          this.districtControl = new AutoCompleteDropDown('District', 'districtId', 'districtId', 'districtName', this.districtList,
            '', this.placeFormGroup, false, false, true);
        }
      });
    }
  }

  selectdistrict(result: any): void {
    let districtId = 0;
    if (typeof result === 'number') {
      districtId = result;
    } else {
      districtId = result.districtId;
    }
    if (districtId) {
      this.placeKeyup = false;
      const value = this.placeFormGroup.get('districtId')?.setValue(result);
      this.master.GetCityList(districtId).subscribe(res => {
        if (res) {
          this.cityList = res;
          // console.log('this.cityList', this.cityList);
          this.cityControl = new AutoCompleteDropDown('City', 'cityId', 'cityId', 'cityName', this.cityList,
            '', this.placeFormGroup, false, false, true);
        }
      });
    }
  }

  selectcity(result: any): void {
    let cityId = 0;
    if (typeof result === 'number') {
      cityId = result;
    } else {
      cityId = result.cityId;
    }
    if (cityId) {
      this.placeKeyup = false;
      const value = this.placeFormGroup.get('cityId')?.setValue(result);
      this.master.getPlaceListMaster(cityId).subscribe(res => {
        if (res) {
          this.currentPage = 1;
          //this.placeList = res;
          // console.log('this.placeList', this.placeList);

        }
      });
    }
  }

  // checkState(event: any) {
  //   if (event.value.trim() === '') {
  //     this.placeList = [];
  //     this.placeFormGroup.get('cityId')?.setValue(null);
  //     this.placeFormGroup.get('districtId')?.setValue(null);

  //   }
  // }

  // checkDistrict(event: any) {
  //   if (event.value.trim() === '') {
  //     this.placeList = [];
  //     this.placeFormGroup.get('cityId')?.setValue(null);
  //   }
  // }

  // checkCity(event: any) {
  //   if (event.value.trim() === '') {
  //     this.placeList = [];
  //   }
  // }

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
  activeinactive(event, rowdata) {
    this.placeList.map(m => {
      if (m.locationId === rowdata.locationId) {
        m.active = event.checked
      }
    });
  }
  resetTable() {
    this.placeFormGroup.reset();
    this.placeList = [];
    this.dt.reset();
    this.currentPage = 1;
    this.placeFormGroup.get('countryId')?.setValue(92);
  }
  editDetail(data, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initLocationForm();
    this.master.getPlaceById(data.locationId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.placeFormGroup.patchValue({
            locationId: this.common.tempResetData.locationId,
            locationName: this.common.tempResetData.locationName,
            cityName: this.common.tempResetData.cityName,
            cityId: this.common.tempResetData.cityId,
            active: this.common.tempResetData.active,
            stateId: this.common.tempResetData.stateId,
            countryId: this.common.tempResetData.countryId,
            districtId: this.common.tempResetData.districtId,
            districtName: this.common.tempResetData.districtName,
            postalCode: this.common.tempResetData.postalCode,
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.placeFormGroup.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.placeFormGroup.get('singleEditFlag')?.setValue(true);
        }
        this.placeFormGroup.get('locationId')?.disable();
      }
    });
    this.showFlag = !this.showFlag;
  }
  savePlace() {
    if (this.placeFormGroup.valid) {
      this.masterService.UpdateLocation(this.placeFormGroup.getRawValue()).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.getPlace();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.placeFormGroup.markAllAsTouched();
    }
  }
  addPlaceList() {
    this.initLocationForm();
    this.breadcrumbFlags.toolTip = 'Save';
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showFlag = !this.showFlag;
  }
  resetForm() {
    const editcityId = this.placeFormGroup.controls.locationId.value;
    this.placeFormGroup.controls.locationId.setValue(0);
    this.placeFormGroup.reset();
    this.placeFormGroup.markAsPristine();
    this.initLocationForm();
    if (this.isEdit) {
      this.placeFormGroup.controls.locationId.setValue(editcityId);
    }
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.placeFormGroup.reset();
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
  getPlace() {
    this.masterService.getPlace().subscribe(res => {
      if (res) {
        this.placeList = res;
      }
    });
  }
  deletePlace() {
    this.masterService.deletePlace(this.data.locationId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getPlace();
      }
    });
  }
  showall() {
    if (this.placeList.length > 0) {
      this.itemperpage = this.placeList.length;
    }
  }
}
