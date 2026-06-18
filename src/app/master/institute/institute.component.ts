import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { CommonService } from '../../common-methods/services/common.service';
import { BreadcrumbFlags } from '../../common-methods/models/breadcrumb-flags';
import { AuthService } from '../../common-methods/services/auth.service';
import { MasterService } from '../../common-methods/services/master.service';
// import { MessageService, Table } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CommonAlertsComponent } from '../../common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { SharedService } from '../../common-methods/services/shared.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})
export class InstituteComponent implements OnInit {
  itemperpage;
  instituteFormGroup: UntypedFormGroup;
  showFlag = false;
  breadcrumbFlags = new BreadcrumbFlags();
  screenAuth: any = {};
  userData: any;
  isEdit: boolean;
  institutionFilterList: any[] = [];
  institutionkeyUp: boolean;
  InstituteList: any[] = [];
  instituteFilterList: any[] = [];
  instituteApprovedList: any[] = [];
  institutionList: any[] = [];
  //  @ViewChild('dt', { static: false }) dt!: Table;
  // @ViewChild('global', { static: true }) global!: ElementRef;
  //   @ViewChild('institutionNameTrigger', { static: true }) institutionNameTrigger: MatMenuTrigger;
  // @ViewChild('instituteNameTrigger', { static: true }) instituteNameTrigger: MatMenuTrigger;
  // @ViewChild('facultyTrigger', { static: true }) facultyTrigger: MatMenuTrigger;
  // @ViewChild('searchMasterScreen', { static: true }) 
// searchMasterScreen!: TemplateRef<any>;
  //  @ViewChild('districtTrigger', { static: true }) districtTrigger: MatMenuTrigger;
  // @ViewChild('stateTrigger', { static: true }) stateTrigger: MatMenuTrigger;
  // @ViewChild('countryTrigger', { static: true }) countryTrigger: MatMenuTrigger;
  @ViewChild('dt') dt!: Table;

  @ViewChild('global') global!: ElementRef;

  @ViewChild('institutionNameTrigger') institutionNameTrigger!: MatMenuTrigger;
  @ViewChild('instituteNameTrigger') instituteNameTrigger!: MatMenuTrigger;
  @ViewChild('facultyTrigger') facultyTrigger!: MatMenuTrigger;

  @ViewChild('searchMasterScreen') searchMasterScreen!: TemplateRef<any>;

  @ViewChild('districtTrigger') districtTrigger!: MatMenuTrigger;
  @ViewChild('stateTrigger') stateTrigger!: MatMenuTrigger;
  @ViewChild('countryTrigger') countryTrigger!: MatMenuTrigger;

  currentPage = 1;
  tempCurrentPage = 1;
  totalpages: number;

  institutionNameFilteredOptions: Observable<string[]>;
  institutionNameControl = new UntypedFormControl();
  instituteNameFilteredOptions: Observable<string[]>;
  instituteNameControl = new UntypedFormControl();
  facultyFilteredOptions: Observable<string[]>;
  facultyControl = new UntypedFormControl();
  displayedColumns = [
    { field: 'institutionName', header: 'Institution Name' },
    { field: 'instituteName', header: 'Institute Name' },
    { field: 'faculty', header: 'Faculty/Dept' },
    { field: 'address.district', header: 'District' },
    { field: 'address.state', header: 'State' },
    { field: 'address.country', header: 'Country' }
  ];
  searchName: any;
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  uploadFlag = false;
  pathParameters: string[];
  routePath = 'Configure / Institution / Institute Creation';
  instituekeyUp = false;
  checkFlag = false;
  soundexInstituteList: any[];
  address = new BehaviorSubject(null);
  districtFormCtrl = new UntypedFormControl();
  districtFilteredOptions: Observable<string[]>;

  stateFormCtrl = new UntypedFormControl();
  stateFilteredOptions: Observable<string[]>;

  countryFormCtrl = new UntypedFormControl();
  countryFilteredOptions: Observable<string[]>;

  constructor(public common: CommonService, private formBuilder: UntypedFormBuilder, private authservice: AuthService, private masterService:
    // tslint:disable-next-line:align
    MasterService, private message: MessageService, public dialog: MatDialog, private sharedService: SharedService,
    private router: Router,) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.initFormGroup();
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.getInstitution();
    this.getInstitute();
    this.getInstituteApprovedList();
    this.itemperpage = 10;
  }
  getInstitute() {
    this.masterService.getInstitute().subscribe(resp => {
      this.InstituteList = resp;
      this.instituteTblAutoFilters();
    });
  }
  initFormGroup() {
    this.instituteFormGroup = this.formBuilder.group({
      instituteId: [0],
      institutionId: ['', [Validators.required]],
      instituteName: ['', [Validators.required]],
      faculty: [''],
      createdUserId: [this.userData.userId],
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        districtId: new UntypedFormControl(),
        stateId: new UntypedFormControl('', Validators.required),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(),
        state: new UntypedFormControl(),
        place: new UntypedFormControl(),
        district: new UntypedFormControl(),
        city: new UntypedFormControl(),
        createdUserId: new UntypedFormControl(this.userData.userId)
      }),
    });
    this.address = new BehaviorSubject(null);
  }
  getInstitution() {
    this.masterService.getInstitution().subscribe(resp => {
      this.institutionList = resp;
    });
  }
  add() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.initFormGroup();
    this.showFlag = true;
    this.isEdit = false;
  }
  resetForm() {
    if (this.instituteFormGroup.controls.instituteId.value > 0) {
      this.instituteFormGroup.patchValue({
        instituteId: this.common.tempResetData.instituteId,
        instituteName: this.common.tempResetData.instituteName,
        institutionId: this.common.tempResetData.institutionId,
        institutionName: this.common.tempResetData.institutionName,
        faculty: this.common.tempResetData.faculty,
      });
      this.address = new BehaviorSubject(this.common.tempResetData.address);
      this.address.next(this.common.tempResetData.address);
      this.institutionItems('');
    } else {
      this.instituteFormGroup.reset();
      this.instituteFormGroup.markAsPristine();
      this.instituteFormGroup.controls.instituteId.setValue(0);
      this.instituteFormGroup.controls.createdUserId.setValue(this.userData.userId);
    }
  }
  institutionKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const institution = this.institutionFilterList.filter(e => e.institutionName.toLowerCase() === value.toLowerCase() ||
          e.state.toLowerCase() === value.toLowerCase());
        if (institution.length > 0) {
          this.institutionkeyUp = false;
          this.selectInstitution(institution[0].institutionId);
        } else {
          this.institutionkeyUp = true;
        }
      } else {
        this.institutionkeyUp = false;
      }
    }
  }
  getName(option: any) {
    return option.institutionName + '  |  ' + option.state;
  }
  selectInstitution(id: any) {
    if (id) {
      this.institutionkeyUp = false;
    }
  }
  get displayInstitutionFn() {
    const institutionNew = (institution) => {
      if (institution == null || institution === undefined) {
        return null;
      } else {
        if (institution && this.institutionFilterList && this.institutionFilterList.length > 0) {
          institution = this.institutionFilterList.find(x => x.institutionId === institution);
          return institution.institutionName;
        } else {
          return null;
        }
      }
    };
    return institutionNew;
  }
  institutionItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.institutionFilterList = Object.assign([], this.institutionList).filter(item => ((item.institutionName.toLowerCase().
        indexOf(value.toLowerCase()) > -1) || (item.state.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignResourceCopy() {
    this.institutionFilterList = Object.assign([], this.institutionList);
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.instituteFormGroup.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
    this.common.tempResetData  = [];
    this.breadcrumbFlags.btnSave = false;
    this.breadcrumbFlags.btnReset = false;
  }
  addInstitute() {
    if (this.instituteFormGroup.valid) {
      this.masterService.saveInstitute(this.instituteFormGroup.getRawValue()).subscribe(resp => {
        if (resp.success === false) {
          this.showTopCenter('warn', 'Failure Message', 'Failed to save');
        } else {
          if (this.instituteFormGroup.get('instituteId')?.value > 0) {
            this.isEdit = false;
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.getInstitute();
          this.closeForm();
        }
      });
    } else {
      this.instituteFormGroup.markAllAsTouched();
    }
  }
  checkValidValue(): void {
    const value = this.instituteFormGroup.get('institutionId')?.value;
    if (value === '' || value == null) {
      this.instituteFormGroup.get('institutionId')?.setValidators(Validators.required);
    } else if (this.institutionkeyUp) {
      this.instituteFormGroup.get('institutionId')?.setErrors({ incorrect: true });
    } else {
      this.instituteFormGroup.get('institutionId')?.setErrors(null);
    }
  }
  editInstitute(rowData, mode: any) {
    this.initFormGroup();
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.masterService.getInstituteById(rowData.instituteId).subscribe(resp => {
      if (resp) {
        this.common.tempResetData = resp;
        this.instituteFormGroup.patchValue({
          instituteId: rowData.instituteId,
          institutionId: resp.institutionId,
          instituteName: rowData.instituteName,
          institutionName: resp.institutionName,
          faculty: resp.faculty,
          address: resp.address,
        });
        this.address = new BehaviorSubject(resp.address);
        this.address.next(resp.address);
        if (mode === 'view') {
          this.instituteFormGroup.disable();
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
        }
      }
      if (this.instituteFormGroup.get('instituteId')?.value > 0) {
        this.instituteFormGroup.get('instituteName')?.disable();
      } else {
        this.instituteFormGroup.get('instituteName')?.enable();
      }
    });
    this.institutionItems('');
    this.instituteItems('');
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  public openDialog(instituteId: any) {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
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
          if (action === this.common.DELETECONFIRMATION) {
            this.deleteInstitute(instituteId);
          }
        }
      });
    }
  }
  deleteInstitute(instituteId: any) {
    this.masterService.deleteInstitute(instituteId, this.userData.userId).subscribe(res => {
      if (res) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.getInstitute();
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
  showTopCenter(level: string, info: string, message: string) {
    this.message.add({ severity: level, summary: info, detail: message });
  }
  closeMenu(col: any) {
    switch (col) {
      case 'institutionName': this.institutionNameTrigger.closeMenu(); break;
      case 'instituteName': this.instituteNameTrigger.closeMenu(); break;
      case 'faculty': this.facultyTrigger.closeMenu(); break;
      default: break;
    }
  }
  private instituteTblAutoFilters(): void {
    this.institutionNameFilteredOptions = this.institutionNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.institutionName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.instituteNameFilteredOptions = this.instituteNameControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.instituteName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.facultyFilteredOptions = this.facultyControl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.faculty).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.districtFilteredOptions = this.districtFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.address.district).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.stateFilteredOptions = this.stateFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.address.state).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryFilteredOptions = this.countryFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.InstituteList.map(x => x.address.country).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  resettable() {
    this.dt.reset();
    this.institutionNameControl.reset();
    this.instituteNameControl.reset();
    this.facultyControl.reset();
    this.instituteTblAutoFilters();
    this.global.nativeElement.value = '';
  }
  institutekeyUpFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.instituteFilterList.filter(e =>
          e.instituteName.toLowerCase() === value.toLowerCase());
        if (data.length > 0) {
          this.instituekeyUp = true;
        } else {
          this.instituekeyUp = true;
        }
      } else {
        this.instituekeyUp = false;
      }
    }
  }
  get instituteDisplayDataFn() {
    const dataNew = (data) => {
      if (data == null || data === undefined || data === '') {
        return null;
      } else {
        if (this.instituteFilterList && this.instituteFilterList.length > 0) {
          data = this.instituteFilterList.find(x => x.instituteName === data);
          return data.instituteName;
        } else {
          return null;
        }
      }
    };
    return dataNew;
  }
  // Resource ..
  instituteItems(value: any) {
    if (!value) { this.assignInstCopy(); }
    if (value) {
      this.instituteFilterList = Object.assign([], this.instituteApprovedList).filter(
        item => ((item.instituteName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignInstCopy() {
    this.instituteFilterList = Object.assign([], this.instituteApprovedList);
  }
  onDialogOpen(sName: any) {
    this.searchName = sName;
    this.getInstituteListBySoundex(this.searchName);
    this.instituteTblAutoFilters();
    this.dialog.open(this.searchMasterScreen, {
      width: '1000px'
    });
  }
  onSave() {
    this.dialog.closeAll();
  }
  onCancel() {
    this.dialog.closeAll();
    this.instituteFormGroup.controls.instituteName.setValue('');
    this.instituteFormGroup.get('instituteName')?.setErrors({ required: true });
  }
  checkValidInstitute(insName: any) {
    const value = this.instituteFormGroup.get('instituteName')?.value;
    if (value !== '' || !value == null) {
      this.onDialogOpen(value);
    }
  }
  getInstituteApprovedList() {
    this.masterService.getInstitute().subscribe(res => {
      if (res) {
        this.instituteApprovedList = res;
      }
    });
  }
  getInstituteListBySoundex(input: any) {
    this.masterService.getInstituteNameBySoundex(input).subscribe(res => {
      if (res) {
        this.soundexInstituteList = res;
      }
    });
  }
  showall() {
    if (this.InstituteList.length > 0) {
      this.itemperpage = this.InstituteList.length;
    }
  }
}
