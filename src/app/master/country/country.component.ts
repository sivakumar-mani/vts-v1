import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Country } from 'src/app/common-methods/models/country';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { startWith, map } from 'rxjs/operators';

import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'
@Component({
  standalone: false,
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  itemperpage;
  currency: any;
  dialogRef: any;
  data: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  countryFormGroup: UntypedFormGroup;
  countryListControl = new UntypedFormControl();
  countryListFilteredOptions: Observable<string[]>;
  countryCodeControl = new UntypedFormControl();
  countryCodeFilteredOptions: Observable<string[]>;
  countryForm: UntypedFormGroup;
  showCountry = false;
  isEdit = false;
  country: Country = new Country();
  countryList: any[] = [];
  regionList: any[] = [];
  regionControl!: AutoCompleteDropDown;
  displayedColumns = [
    // { field: '', header: '' },
    { field: 'countryName', header: 'Country' },
    { field: 'currencyName', header: 'Currency Name' },
    { field: 'currencyShortName', header: 'Currency Short Name' },
    { field: 'active', header: 'Active' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  userData: any;
  breadcrumbFlags = new BreadcrumbFlags();

  routePath = 'Configure / Location / Country';
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  constructor(public agentEntryMasterService: AgentEntryMasterService, private master: MasterService, public dialog: MatDialog, private fb: UntypedFormBuilder, private common: CommonService, private auth: AuthService, private message: MessageService, private masterService: MasterService, public formBuilder: UntypedFormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.loadCountry();
    this.getRegion();
    this.itemperpage = 10;
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.auth.getScreenAuth(this.router.url);
    this.initCountryForm();

  }
  
  getRegion(){
    this.master.getRegion().subscribe(res => {
      if (res) {
        this.regionList = res;
      }
    }); 
  }
  loadCountry() {
    this.master.GetCountryLst().subscribe(res => {
      if (res) {
        this.countryList = res;
      }
    },
      err => { }, () => {
        this.countryListFilteredOptions = this.countryListControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.countryList.map(x => x.countryName).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
        this.countryCodeFilteredOptions = this.countryCodeControl.valueChanges.pipe(startWith(''),
          map(value =>
            (Array.from(new Set(this.countryList.map(x => x.code).filter(x => x))).sort())
              .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
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
  initCountryForm() {
    this.countryFormGroup = this.fb.group({
      countryId: new UntypedFormControl(0),
      countryName: new UntypedFormControl('', Validators.required),
      code: new UntypedFormControl('', Validators.required),
      phonecode: new UntypedFormControl('', Validators.required),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
      regionId: new UntypedFormControl(),
      active: new UntypedFormControl(true),
      createdUserId: new UntypedFormControl(this.userData.userId),
      currency: 
        this.fb.group({
           currencyId: new UntypedFormControl(0),
          currencyName: new UntypedFormControl('', Validators.required),
          currencyShortName: new UntypedFormControl('', Validators.required),
          currencySymbol: new UntypedFormControl('', Validators.required),
          }),     
    });
    this.regionControl = new AutoCompleteDropDown('Region', 'regionId', 'regionId', 'regionName', this.regionList,
      '', this.countryFormGroup, false, false, true);
  }
  currencyDt(){
    return ((this.countryFormGroup.get('currency')) as UntypedFormArray).controls;
  }
  addStateList() {
    this.initCountryForm();
    this.breadcrumbFlags.toolTip = 'Save';
    this.dt.reset();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.showCountry = !this.showCountry;
  }
  resetTable(){
    this.dt.reset();
  }
  resetForm() {
    this.countryFormGroup.reset();
    this.dt.reset();
    this.countryFormGroup.markAsPristine();
    this.initCountryForm();
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.countryFormGroup.reset();
    this.showCountry = !this.showCountry;
    this.isEdit = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.currentPage = 1;
  }
  editDetail(data, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initCountryForm();
    this.master.getCountryDtById(data.countryId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res;
        setTimeout(() => {
          this.countryFormGroup.patchValue({
            countryId: this.common.tempResetData.countryId,
      countryName: this.common.tempResetData.countryName,
       code: this.common.tempResetData.code,
      phonecode :this.common.tempResetData.phoneCode,
      latitude: this.common.tempResetData.latitude,
      longitude: this.common.tempResetData.longitude,
      regionId: this.common.tempResetData.regionId,
      active: this.common.tempResetData.active,
      createdUserId: this.userData.userId,
      currency:this.common.tempResetData.currency
          });
        }, 1);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.countryFormGroup.disable();
        } else if (mode === 'editSingle') {
          this.isEdit = true;
          this.countryFormGroup.get('singleEditFlag')?.setValue(true);
        }
        
      }
    });
    this.showCountry = !this.showCountry;
  }
  deleteCountry() {
    this.masterService.deleteCountry(this.data.countryId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.loadCountry();
      }
    });
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  saveCountry() {
    if (this.countryFormGroup.valid) {
      this.masterService.updateCountry(this.countryFormGroup.getRawValue()).subscribe(res => {
        if (res) {
          this.showTopCenter('success', 'Success Message', this.breadcrumbFlags.toolTip + 'd Successfully');
          this.loadCountry();
          this.closeForm();
        }
        if (!res) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        }
      });
    } else {
      this.countryFormGroup.markAllAsTouched();
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  showall() {
    if (this.countryList.length > 0) {
      this.itemperpage = this.countryList.length;
    }
  }
}
