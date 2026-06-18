import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ChangeDetectorRef, DoCheck } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MasterService } from '../../common-methods/services/master.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { CommonService } from '../../common-methods/services/common.service';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { ScreenAuth } from 'src/app/common-methods/models/screen-auth';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table'

@Component({
  standalone: false,
  selector: 'app-fake-employer',
  templateUrl: './fake-employer.component.html',
  styleUrls: ['./fake-employer.component.css']
})
export class FakeEmployerComponent implements OnInit {
  setOption = 1;
  showInst = true;
  showGrid = true;
  isEdit = false;
  clientlist: any[] = [];
  fakeInsForm: UntypedFormGroup;
  showsData = false;
  btnAddUpload = true;
  addList: any;
  routePath = 'Configure / Employer / Fake Employer';
  label = 'Employer';
  employerColumns = [
    { field: 'name', header: 'Employer Name' },
    { field: 'clientName', header: 'Client Name' },
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'city', header: 'City' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  employerList: any[] = [];
  userData: any;
  clientControl = new UntypedFormControl();
  clientListFilterOptions: Observable<string[]>;
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  @ViewChild('dt1') dt1!: Table;
  @ViewChild('global') global!: ElementRef;
  @ViewChild('deleteConfirm') deleteConfirm!: TemplateRef<any>;
  breadcrumbFlags = new BreadcrumbFlags();
  screenAuth = new ScreenAuth();
  displayColumns: any[] = [];
  fakeEmpInsList: any[] = [];
  fakeEmpInsCategory: any[] = [];
  deleteId: number;
  othersData = '';
  clientControls!: AutoCompleteDropDown;
  showBulkUpload = false;
  empIns = true;

  @ViewChild('cityTrigger') cityTrigger!: MatMenuTrigger;
  cityFilteredOptions!: Observable<string[]>;
  cityControl = new UntypedFormControl();

  @ViewChild('stateTrigger') stateTrigger!: MatMenuTrigger;
  stateFilteredOptions!: Observable<string[]>;
  stateControl = new UntypedFormControl();

  @ViewChild('countryTrigger') countryTrigger!: MatMenuTrigger;
  countryFilteredOptions!: Observable<string[]>;
  countryControl = new UntypedFormControl();

  @ViewChild('clientNameTrigger') clientNameTrigger!: MatMenuTrigger;
  clientNameFilteredOptions!: Observable<string[]>;
  clientNameControl = new UntypedFormControl();

  @ViewChild('employerNameTrigger') employerNameTrigger!: MatMenuTrigger;
  employerNameFilteredOptions!: Observable<string[]>;
  employerNameControl = new UntypedFormControl();

  fakeEmpList: any[] = [];
  billingKeyup: boolean;
  fakeEmpFilterList: any[] = [];
  keyUp: boolean;

  searchName: any;
  @ViewChild('searchMasterScreen', { static: true }) 
searchMasterScreen!: TemplateRef<any>;
  checkFlag = false;
  soundexFakeEmpList: any[];

  constructor(private master: MasterService, private fb: UntypedFormBuilder, public dialog: MatDialog, private sharedService: SharedService,
    private authService: AuthService, private messageService: MessageService, public common: CommonService,
    private router: Router,) {
  }
  ngOnInit() {

    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getClient();
    this.getFakeEmpInsCategory();
    this.getFakeEmpInsDetail(this.showInst);
    this.initFormGroup();
    this.getFakeEmpList();
  }
  checkOthers(event: any) {
    this.othersData = event.source.triggerValue;
  }
  getClient() {
    this.master.GetClient().subscribe(res => {
      if (res) {
        this.clientlist = res;
        this.clientlist.sort((a, b) => a.clientName.localeCompare(b.clientName));
        this.clientlist.splice(0, 0, {
          clientId: 0, clientName: 'Default',
          active: true,
        });
        this.clientControls =
          new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
            '', this.fakeInsForm, false, false, true);
      }
    });
  }
  getFakeEmpInsDetail(empflag: any) {
    this.master.getFakeEmpInsDetails(empflag).subscribe(resp => {
      if (resp) {
        this.fakeEmpInsList = resp;
      }
    },
      err => { }, () => {
        this.fakeInsTblAutoFilters();
      });
  }
  getFakeEmpInsCategory() {
    this.master.getFakeEmpInsCatType().subscribe(resp => {
      if (resp) {
        this.fakeEmpInsCategory = resp;
      }
    });
  }
  getFakeEmpList() {
    this.master.GetEmpName(this.userData.deptId ? this.userData.deptId : 0).subscribe(resp => {
      if (resp) {
        this.fakeEmpList = resp;
        this.setItems('');
      }
    });
  }

  keyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.fakeEmpFilterList.filter(e =>
          e.name.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.keyUp = true;
        } else {
          this.keyUp = true;
        }
      } else {
        this.keyUp = false;
      }
    }
  }
  get displayDataFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.fakeEmpFilterList && this.fakeEmpFilterList.length > 0) {
          data = this.fakeEmpFilterList.find(x => x.name === data);
          return data.name;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }

  // Resource ..
  setItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.fakeEmpFilterList = Object.assign([], this.fakeEmpList).filter(
        item => ((item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignResourceCopy() {
    this.fakeEmpFilterList = Object.assign([], this.fakeEmpList);
  }

  initFormGroup() {
    this.fakeInsForm = this.fb.group({
      fakeEmpInsId: [0],
      fakeEmpInsAddressId: [0],
      empFlag: [''],
      name: ['', Validators.required],
      categoryLookupId: [''],
      clientId: [''],
      fakeDeclaredDate: [new Date()],
      source: [''],
      remarks: [''],
      comments: [''],
      logginId: [this.userData.userId],
      removedReason: [''],
      categoryValue: [''],
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        districtId: new UntypedFormControl(''),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        active: new UntypedFormControl(true),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(),
        city: new UntypedFormControl(),
        district: new UntypedFormControl(),
        state: new UntypedFormControl(),
        place: new UntypedFormControl(),
      }),
    });
    this.clientControls =
      new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
        '', this.fakeInsForm, false, false, true);
  }
  saveFakeEmpIns() {
    this.fakeInsForm.controls.categoryValue.setValidators(Validators.required);
    if (this.othersData === 'Others') {
      if (this.fakeInsForm.controls.categoryValue.value === null || this.fakeInsForm.controls.categoryValue.value === '') {
        this.fakeInsForm.controls.categoryValue.setErrors({ incorrect: true });
      }
    }
    if (this.fakeInsForm.valid) {
      if (this.othersData === 'Others') {
        this.fakeInsForm.controls.categoryLookupId.setValue(0);
      }
      this.fakeInsForm.controls.empFlag.setValue(this.showInst);
      this.master.saveFakeEmpIns(this.fakeInsForm.value).subscribe(resp => {
        if (resp) {
          if (this.fakeInsForm.controls.fakeEmpInsId.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Added Successfully');
          }
          this.currentPage = 1;
          this.closeForm();
          this.getFakeEmpInsCategory();
          this.btnAddUpload = true;
        }
      });
    } else {
      this.fakeInsForm.markAllAsTouched();
    }
  }
  editFakeEmpIns(src: any) {
    this.initFormGroup();
    this.getFakeEmpList()
    this.btnAddUpload = false;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.breadcrumbFlag.toolTip = 'Update';
    this.showGrid = !this.showGrid;
    this.getEmployerInstitution(1);
    this.master.GetFakeEmpDetailById(src.empInsId).subscribe(res => {
      if (res) {
        this.common.tempResetData = res[0];
        this.addList = new BehaviorSubject(res[0]);
        this.addList.next(this.common.tempResetData.address);
        this.bindDatawithControl(res[0]);
      }
    });
    this.isEdit = true;
  }

  bindDatawithControl(data: any) {
    if (data) {
      this.fakeInsForm.patchValue({
        fakeEmpInsId: data.fakeEmpInsId,
        clientId: data.clientId,
        fakeEmpInsAddressId: data.fakeEmpInsAddressId,
        categoryLookupId: data.categoryLookupId,
        name: data.name,
        source: data.source,
        remarks: data.remarks, comments: data.comments,
      });
      this.fakeInsForm.get('address')?.patchValue({
        addLine1: data.address.addLine1,
        addLine2: data.address.addLine2,
        addLine3: data.address.addLine3,
        countryId: data.address.countryId,
        stateId: data.address.stateId,
        cityId: data.address.cityId,
        districtId: data.address.districtId,
        locationId: data.address.locationId,
        postalCode: data.address.postalCode,
      });
      this.clientControls =
        new AutoCompleteDropDown('Client Name', 'clientId', 'clientId', 'clientName', this.clientlist,
          '', this.fakeInsForm, false, false, true);

      // if (this.fakeInsForm.controls.fakeEmpInsId.value > 0) {
      //   this.fakeInsForm.get('name')?.disable();
      // } else {
      //   this.fakeInsForm.get('name')?.enable();
      // }
    }
  }
  deleteFakeEmpInsDetail() {
    this.fakeInsForm.controls.removedReason.setValidators(Validators.required);
    if (this.fakeInsForm.controls.removedReason.value === '' || this.fakeInsForm.controls.removedReason.value === null) {
      this.fakeInsForm.controls.removedReason.setErrors({ incorrect: true });
    } else {
      this.master.DeleteFakeEmpById(this.deleteId,
        this.userData.userId, this.fakeInsForm.controls.removedReason.value).subscribe(resp => {
          if (resp) {
            this.dialog.closeAll();
            this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
            this.fakeInsForm.reset();
            this.getFakeEmpInsDetail(this.showInst);
          }
        });
    }

  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  showNotification(severity, summary, message) {
    this.sharedService.emitChange({
      severity,
      summary,
      detail: message
    });
  }
  openForm() {
    this.othersData = '';
    this.btnAddUpload = false;
    this.common.tempResetData = null;
    this.addList = new BehaviorSubject(this.common.tempResetData);
    this.addList.next(this.common.tempResetData);
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.common.breadcrumbFlag.toolTip = 'Save';
    this.isEdit = false;
    this.initFormGroup();
    this.fakeInsForm.controls.fakeDeclaredDate.setValue(new Date());
    this.showGrid = !this.showGrid;
  }
  closeForm() {
    this.getFakeEmpInsDetail(this.showInst);
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.fakeInsForm.reset();
    this.showGrid = !this.showGrid;
    this.btnAddUpload = true;
    this.isEdit = false;
    this.currentPage = 1;
  }
  resetForm() {
    if (this.fakeInsForm.controls.fakeEmpInsId.value > 0) {
      this.bindDatawithControl(this.common.tempResetData);
      this.addList = new BehaviorSubject(this.common.tempResetData.address);
      this.addList.next(this.common.tempResetData.address);
    } else {
      this.fakeInsForm.reset();
      this.fakeInsForm.controls.fakeDeclaredDate.setValue(new Date());
      this.initFormGroup();
    }
  }
  getEmployerInstitution(value: any) {
    if (value === 1) {
      this.showBulkUpload = false;
    } else {
      this.showGrid = !this.showGrid;
      this.showBulkUpload = true;
      this.btnAddUpload = false;
      this.breadcrumbFlags = this.common.breadcrumbFlags();
    }
    // if (this.showGrid) { this.getFakeEmpInsDetail(this.showInst); } else {
    //   this.fakeInsForm.reset();
    //   this.initFormGroup();
    // }
  }
  private fakeInsTblAutoFilters(): void {

    this.clientNameFilteredOptions = this.clientNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.fakeEmpInsList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.cityFilteredOptions = this.cityControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.fakeEmpInsList.map(x => x.city).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.stateFilteredOptions = this.stateControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.fakeEmpInsList.map(x => x.stateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryFilteredOptions = this.countryControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.fakeEmpInsList.map(x => x.countryName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.employerNameFilteredOptions = this.employerNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.fakeEmpInsList.map(x => x.name).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

  }
  closeMenu(col: any) {
    switch (col) {
      case 'clientName': this.clientNameTrigger.closeMenu(); break;
      case 'city': this.cityTrigger.closeMenu(); break;
      case 'countryName': this.countryTrigger.closeMenu(); break;
      case 'stateName': this.stateTrigger.closeMenu(); break;
      case 'name': this.employerNameTrigger.closeMenu(); break;
      default: break;
    }
  }
  resetTable() {
    this.dt.reset();
    this.clientNameControl.reset();
    this.global.nativeElement.value = '';
    this.fakeInsTblAutoFilters();
  }
  public openDialog(value: any) {
    this.deleteId = value;
    this.dialog.open(this.deleteConfirm, {
      width: '400px',
      data: value,
      disableClose: true
    });

  }
  dialogClose() {
    this.dialog.closeAll();
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
  getTotalPages1(totalRecords, rows) {
    this.totalpages = Math.ceil((totalRecords) / rows);
    return Math.ceil((totalRecords) / rows);
  }
  navigateNxtPrevPage1(pageNo, rows) {
    this.currentPage = pageNo / rows;
    this.tempCurrentPage = this.currentPage;
  }
  navigatePage1(pageNo, rowscount) {
    if (+pageNo > this.totalpages || +pageNo <= 0) {
      this.currentPage = this.tempCurrentPage;
    } else {
      this.dt1.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  onDialogOpen(sName: any) {
    this.searchName = sName;
    this.getFakeEmpListSoundex(this.searchName);
    this.fakeInsTblAutoFilters();
    this.dialog.open(this.searchMasterScreen, {
      width: '800px'
    });
  }
  onSave() {
    this.dialog.closeAll();
  }
  onCancel() {
    this.dialog.closeAll();
    this.fakeInsForm.controls.name.setValue('');
    this.fakeInsForm.get('name')?.setErrors({ required: true });
  }
  checkValidfakeEmpValue(fakeEmpName: any) {
    const value = this.fakeInsForm.get('name')?.value;
    if (value === '' || value == null) {
      this.fakeInsForm.get('name')?.setValidators(Validators.required);
    } else if (value.length < 3) {
      this.fakeInsForm.get('name')?.setErrors({ incorrect: true });
      this.checkFlag = false;
    } else {
      this.fakeInsForm.get('name')?.setErrors(null);
    }
    let existIns: any;
    if (value.length > 3) {
      const fakeInsId = this.fakeInsForm.get('fakeEmpInsId')?.value;
      existIns = this.fakeEmpFilterList.find(e =>
        e.name.toLowerCase() === value.toLowerCase());
      if (existIns) {
        this.fakeInsForm.get('name')?.setErrors({ incorrect: true });
        this.checkFlag = true;
      }
    }
    if (value !== '' || !value == null) {
      this.onDialogOpen(value);
    }
  }
  getFakeEmpListSoundex(input: any) {
    this.master.GetFakeInstitutionAndEmployerNameBySoundex(input, this.common.SCRN_FAKE_EMPLOYER).subscribe(res => {
      if (res) {
        this.soundexFakeEmpList = res;
      }
    });
  }
}
