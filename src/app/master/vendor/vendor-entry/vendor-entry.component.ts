import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { MasterService } from '../../../common-methods/services/master.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, FormGroupName } from '@angular/forms';
import { Vendor } from '../../../common-methods/models/vendor';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../../common-methods/services/common.service';
import { CommonAddress } from '../../../common-methods/models/common-address';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from '../../../common-methods/services/auth.service';
import { BreadcrumbFlags } from '../../../common-methods/models/breadcrumb-flags';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonAlertsComponent } from '../../../common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-vendor-entry',
  templateUrl: './vendor-entry.component.html',
  styleUrls: ['./vendor-entry.component.css']
})
export class VendorEntryComponent implements OnInit {
  itemperpage;
  vendorForm: UntypedFormGroup;
  vendorDetails: Vendor = new Vendor();
  vendorList: any[] = [];
  vendorContact: any[] = [];
  showFlag = false;
  routePath = 'Configure / Vendor';
  countryList: any[] = [];
  stateList: any[] = [];
  countryFilterlist: any[] = [];
  stateFilterlist: any[] = [];
  breadcrumbFlags = new BreadcrumbFlags();
  displayedColumns = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'countryName', header: 'Country' },
    { field: 'stateName', header: 'State' },
    { field: 'active', header: 'Active' },
    //  { field: 'Actions', header: 'Actions' },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  vendorNameFormCtrl = new UntypedFormControl();
  vendorNameFilteredOptions: Observable<string[]>;
  @ViewChild('vendorNameTrigger', { static: true }) vendorNameTrigger!: MatMenuTrigger;
  countryNameFormCtrl = new UntypedFormControl();
  countryNameFilteredOptions: Observable<string[]>;
 @ViewChild('countryNameTrigger', { static: true }) 
countryNameTrigger!: MatMenuTrigger;
  stateNameFormCtrl = new UntypedFormControl();
  stateNameFilteredOptions: Observable<string[]>;
  @ViewChild('stateNameTrigger', { static: true }) stateNameTrigger: MatMenuTrigger;
  isEdit: boolean;
  userData: any;
  totalpages: number;
   @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('global', { static: true }) global!: ElementRef;
  @ViewChild('searchMasterScreen', { static: true }) 
searchMasterScreen!: TemplateRef<any>;
  currentPage = 1;
  tempCurrentPage = 1;
  screenAuth: any = {};
  updateData: any;
  countryKeyup = false;
  stateKeyup = false;
  data: any;
  dialogRef: any;
  @ViewChild('deleteConfirmation', { static: true }) deleteConfirmation!: TemplateRef<any>;;
  checkFlag = false;
  vendorKeyup: boolean;
  vendorfilterlist: any[] = [];
  VendorOwnerlist: any[] = [];
  vendorlistddl: any[] = [];
  searchName: any;
  soundexvendorList: any;
  compList: Vendor[] = [];
  selectedCompDupList: Vendor[] = [];
  address = new BehaviorSubject(null);

  constructor(public dialog: MatDialog, private messageService: MessageService,
    // tslint:disable-next-line:align
    private master: MasterService, public common: CommonService, private fb: UntypedFormBuilder, private authservice: AuthService,
    private router: Router, ) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getVendorList();
    this.getCountryList();
    this.getVendorContactList();
    this.getApprovedVendorName();
    this.getVendorOwners();
    this.itemperpage = 10;
  }
  private vendorTblAutoFilters(): void {
    this.vendorNameFilteredOptions = this.vendorNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.vendorList.map(x => x.vendorName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.countryNameFilteredOptions = this.countryNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.vendorList.map(x => x.countryName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.stateNameFilteredOptions = this.stateNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.vendorList.map(x => x.stateName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  initFormGroup() {
    this.vendorForm = this.fb.group(
      {
        vendorId: new UntypedFormControl(0),
        vendorName: new UntypedFormControl('', Validators.required),
        userId: new UntypedFormControl(),
        name: new UntypedFormControl(),
        owners: new UntypedFormControl(),
        active: new UntypedFormControl(true),
        sendFlag: new UntypedFormControl(true),
        deleteFlag: new UntypedFormControl(false),
        loggedId: new UntypedFormControl(this.userData.userId),
        contact: new UntypedFormGroup({
          dssiToEmailId: new UntypedFormControl('', Validators.compose(
            [Validators.pattern(this.common.EmailRegX), Validators.required])),
          dssiCcEmailId: new UntypedFormControl('', Validators.compose(
            [Validators.pattern(this.common.EmailRegX), Validators.required])),
          phoneNo: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(10),
          Validators.pattern(/^[- +0-9]+$/)])),
          mobileNo: new UntypedFormControl('', Validators.compose([Validators.required, Validators.minLength(10),
          Validators.pattern(/^[- +0-9]+$/)])),
        }),
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
          city: new UntypedFormControl()
          // addressId: new UntypedFormControl(0),
          // addTypeLookupId: new UntypedFormControl(0),
          // addLine1: new UntypedFormControl('', Validators.required),
          // addLine2: new UntypedFormControl(''),
          // addLine3: new UntypedFormControl(''),
          // city: new UntypedFormControl('', Validators.required),
          // stateId: new UntypedFormControl('', Validators.required),
          // countryId: new UntypedFormControl('', Validators.required),
          // postalCode: new UntypedFormControl('', [Validators.minLength(6), Validators.required]),
          // active: new UntypedFormControl(true),
          // createdUserId: new UntypedFormControl(this.userData.userId),
        }),
      });
  }
  getVendorList() {
    this.master.getVendorsList().subscribe(resp => {
      this.vendorList = resp;
    });
  }
  getVendorContactList() {
    this.master.getVendorsContactTypes().subscribe(resp => {
      this.vendorContact = resp;
      // this.vendorDetails.vendorContactDetails = resp;
      // console.log(this.vendorDetails.vendorContactDetails)
    });
  }
  // validationAddress() {
  //   this.vendorForm.get('address')?.markAllAsTouched();
  // }
  saveVendor() {
    if (this.vendorForm.valid) {
      this.vendorDetails.vendorId = this.vendorForm.controls.vendorId.value;
      this.vendorDetails.vendorName = this.vendorForm.controls.vendorName.value;
      this.vendorDetails.owners = this.vendorForm.controls.owners.value;
      this.vendorDetails.address = this.vendorForm.controls.address.value;
      this.vendorDetails.active = this.vendorForm.controls.active.value;
      this.vendorDetails.sendFlag = this.vendorForm.controls.sendFlag.value;
      this.vendorDetails.loggedId = this.vendorForm.controls.loggedId.value;
      this.vendorDetails.deleteFlag = this.vendorForm.controls.deleteFlag.value;
      this.vendorDetails.address = this.vendorForm.controls.address.value;
      if (this.isEdit === false) {
        this.vendorDetails.contact = [];
        this.vendorDetails.contact.push(
          {
            lookupId: 51, contactData: this.vendorForm.controls.contact.value.mobileNo, contactId: 0,
            createdUserId: this.vendorForm.controls.loggedId.value, active: this.vendorForm.controls.active.value
          },
          {
            lookupId: 50, contactData: this.vendorForm.controls.contact.value.phoneNo, contactId: 0,
            createdUserId: this.vendorForm.controls.loggedId.value, active: this.vendorForm.controls.active.value
          },
          {
            lookupId: 55, contactData: this.vendorForm.controls.contact.value.dssiToEmailId, contactId: 0,
            createdUserId: this.vendorForm.controls.loggedId.value, active: this.vendorForm.controls.active.value
          },
          {
            lookupId: 56, contactData: this.vendorForm.controls.contact.value.dssiCcEmailId, contactId: 0,
            createdUserId: this.vendorForm.controls.loggedId.value, active: this.vendorForm.controls.active.value
          });
      } else {
        this.vendorDetails.contact.forEach(element => {
          if (element.lookupId === 51) {
            element.contactData = this.vendorForm.controls.contact.value.mobileNo;
          } else if (element.lookupId === 50) {
            element.contactData = this.vendorForm.controls.contact.value.phoneNo;
          } else if (element.lookupId === 55) {
            element.contactData = this.vendorForm.controls.contact.value.dssiToEmailId;
          } else if (element.lookupId === 56) {
            element.contactData = this.vendorForm.controls.contact.value.dssiCcEmailId;
          }
        });
      }
      this.master.addVendor(this.vendorDetails).subscribe(resp => {
        if (resp.success) {
          if (this.vendorForm.controls.vendorId.value > 0) {
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
          } else {
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
          }
          this.breadcrumbFlags.toolTip = 'Save';
          this.getVendorList();
          this.closeForm();
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Vendor name is already exist, Please try another one');
        }
      });
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }
  editvendorDetails(src, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup();
    this.master.getVendorDetailsById(src.vendorId).subscribe(res => {
      if (res) {
        this.updateData = res;
        this.vendorDetails.contact = res.contact;
        this.vendorDetails.owners = res.owners;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.updateData.contact.length; i++) {
          if (this.updateData.contact[i].lookupId === 51) {
            this.vendorForm.get('contact.mobileNo')?.setValue(this.updateData.contact[i].contactData);
          }
          if (this.updateData.contact[i].lookupId === 50) {
            this.vendorForm.get('contact.phoneNo')?.setValue(this.updateData.contact[i].contactData);
          }
          if (this.updateData.contact[i].lookupId === 55) {
            this.vendorForm.get('contact.dssiToEmailId')?.setValue(this.updateData.contact[i].contactData);
          }
          if (this.updateData.contact[i].lookupId === 56) {
            this.vendorForm.get('contact.dssiCcEmailId')?.setValue(this.updateData.contact[i].contactData);
          }
        }
        this.vendorForm.patchValue({
          vendorId: this.updateData.vendorId,
          owners: this.updateData.owners,
          name: this.updateData.name,
          userId: this.updateData.userId,
          vendorName: this.updateData.vendorName,
          active: this.updateData.active,
          sendFlag: this.updateData.sendFlag,
          deleteFlag: this.updateData.deleteFlag,
          // loggedId: this.updateData.loggedId,
          address: this.updateData.address,
        });
        if (this.vendorForm.get('vendorId')?.value > 0) {
          this.vendorForm.get('vendorName')?.disable();
        } else {
          this.vendorForm.get('vendorName')?.enable();
        }
        // this.address = new BehaviorSubject(this.updateData.address);
        // this.address.next(this.updateData.address);

        const orgRawValue = this.vendorForm.getRawValue();
        this.address.next(orgRawValue.address);
        const countryId = this.vendorForm.get('address.countryId')?.value;
        // this.vendorItems(this.vendorForm.get('vendorName')?.value);
        this.selectcountry(countryId);
        if (mode === 'view') {
          this.breadcrumbFlags.btnSave = false;
          this.breadcrumbFlags.btnReset = false;
          this.vendorForm.disable();
        }
      }
    });
    this.showFlag = !this.showFlag;
    this.isEdit = true;
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  deleteVendorDetails() {
    this.master.deleteVendorDetails(this.data.vendorId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getVendorList();
      }
    });
  }
  openForm() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.initFormGroup();
    this.address = new BehaviorSubject(null);
    if (this.vendorForm.get('address.countryId')?.value) {
      this.vendorForm.get('address.stateId')?.enable();
    } else {
      this.vendorForm.get('address.stateId')?.disable();
    }
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  closeForm() {
    this.breadcrumbFlags.btnSave = true;
    this.breadcrumbFlags.btnReset = true;
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.vendorForm.reset();
    this.showFlag = !this.showFlag;
    this.isEdit = false;
  }
  resetForm() {
    setTimeout(() => {
      this.getCountryList();
    }, 0);
    if (this.vendorForm.controls.vendorId.value > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.updateData.contact.length; i++) {
        if (this.updateData.contact[i].lookupId === 51) {
          this.vendorForm.get('contact.mobileNo')?.setValue(this.updateData.contact[i].contactData);
        }
        if (this.updateData.contact[i].lookupId === 50) {
          this.vendorForm.get('contact.phoneNo')?.setValue(this.updateData.contact[i].contactData);
        }
        if (this.updateData.contact[i].lookupId === 55) {
          this.vendorForm.get('contact.dssiToEmailId')?.setValue(this.updateData.contact[i].contactData);
        }
        if (this.updateData.contact[i].lookupId === 56) {
          this.vendorForm.get('contact.dssiCcEmailId')?.setValue(this.updateData.contact[i].contactData);
        }
      }
      this.vendorForm.patchValue({
        vendorId: this.updateData.vendorId,
        vendorName: this.updateData.vendorName,
        active: this.updateData.active,
        sendFlag: this.updateData.sendFlag,
        deleteFlag: this.updateData.deleteFlag,
        // loggedId: this.updateData.loggedId,
        address: this.updateData.address,
      });
      const countryId = this.vendorForm.get('address.countryId')?.value;
      this.selectcountry(countryId);
    } else {
      this.vendorForm.reset();
      this.initFormGroup();
      this.vendorForm.controls.vendorId.setValue(0);
      this.vendorForm.controls.sendFlag.setValue(true);
      this.vendorForm.controls.active.setValue(true);
      this.vendorForm.markAsPristine();
    }
  }
  getCountryList() {
    this.master.GetCountryList().subscribe(res => {
      if (res) {
        this.countryList = res;
        this.countryItems('');
        // this.selectcountry();
      }
    });
  }
  checkValidCountry() {
    const value = this.vendorForm.get('address.countryId')?.value;
    if (value === '' || value == null) {
    } else if (this.countryKeyup) {
      this.vendorForm.get('address.countryId')?.setErrors({ incorrect: true });
    } else {
      this.vendorForm.get('address.countryId')?.setErrors(null);
    }
  }
  checkValidState() {
    const value = this.vendorForm.get('address.stateId')?.value;
    if (value === '' || value == null) {
    } else if (this.stateKeyup) {
      this.vendorForm.get('address.stateId')?.setErrors({ incorrect: true });
    } else {
      this.vendorForm.get('address.stateId')?.setErrors(null);
    }
  }
  selectState(id: any) {
    this.stateKeyup = false;
    if (id) {
      this.vendorForm.get('address.stateId')?.setValue(id);
    }
  }
  selectcountry(id: any) {
    this.vendorForm.get('address.countryId')?.setValue(id);
    this.countryKeyup = false;
    const value = this.vendorForm.get('address.countryId')?.value;
    if (value) {
      this.vendorForm.get('address.stateId')?.enable();
      this.master.GetStatesList(value).subscribe(res => {
        if (res) {
          this.stateList = res;
          this.stateItems('');
          if (this.stateList) {
            if (this.stateList[0].countryId === value) {
              const state = this.vendorForm.get('address.stateId')?.value;
              this.vendorForm.get('address.stateId')?.setValue(state);
              this.vendorForm.get('address.stateId')?.updateValueAndValidity();
            } else {
              this.vendorForm.get('address.stateId')?.setValue(null);
            }
          }
        }
      });
    } else {
      this.vendorForm.get('address.stateId')?.disable();
      this.vendorForm.get('address.stateId')?.setValue(null);
    }
  }
  countryKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const resource = this.countryFilterlist.filter(e =>
          e.country.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
          this.countryKeyup = true;
          this.selectcountry(resource[0].countryId);
        } else {
          this.countryKeyup = true;
        }
      } else {
        this.countryKeyup = false;
        this.vendorForm.get('address.stateId')?.disable();
      }
    }
  }
  get displayclientFn() {
    const resourceNew = (country) => {
      if (country == null || country === undefined) {
        return null;
      } else {
        if (country && this.countryFilterlist && this.countryFilterlist.length > 0) {
          country = this.countryFilterlist.find(x => x.countryId === country);
          if (country && country.country) {
            return country.country;
          }
        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }
  countryItems(value: any) {
    if (!value) { this.assignResourceCopy(); }
    if (value) {
      this.countryFilterlist = Object.assign([], this.countryList).filter(
        item => ((item.country.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignResourceCopy() {
    this.countryFilterlist = Object.assign([], this.countryList);
  }
  stateKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const resource = this.stateFilterlist.filter(e =>
          e.stateName.toLowerCase() === value.toLowerCase());
        if (resource.length > 0) {
          this.stateKeyup = true;
          this.selectState(resource[0].stateId);
        } else {
          this.stateKeyup = true;
        }
      } else {
        this.stateKeyup = false;
      }
    }
  }
  get displaystateFn() {
    const resourceNew = (state) => {
      if (state == null || state === undefined) {
        return null;
      } else {
        if (state && this.stateFilterlist && this.stateFilterlist.length > 0) {
          state = this.stateFilterlist.find(x => x.stateId === state);
          if (state && state.stateName) {
            return state.stateName;
          }
        } else {
          return null;
        }
      }
    };
    return resourceNew;
  }
  stateItems(value: any) {
    if (!value) { this.assignstateCopy(); }
    if (value) {
      this.stateFilterlist = Object.assign([], this.stateList).filter(
        item => ((item.stateName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }
  }
  assignstateCopy() {
    this.stateFilterlist = Object.assign([], this.stateList);
  }
  checkValidValue(vName: any) {
    const value = this.vendorForm.get('vendorName')?.value;
    if (value === '' || value == null) {
      this.vendorForm.get('vendorName')?.setValidators(Validators.required);
    } else if (value.length < 3) {
      this.vendorForm.get('vendorName')?.setErrors({ incorrect: true });
      this.checkFlag = false;
    } else {
      this.vendorForm.get('vendorName')?.setErrors(null);
    }
    let existvendor: any;
    if (value.length > 3) {
      const vendorId = this.vendorForm.get('vendorId')?.value;
      existvendor = this.vendorfilterlist.find(e =>
        e.vendorName.toLowerCase() === value.toLowerCase());
      if (existvendor) {
        this.vendorForm.get('vendorName')?.setErrors({ incorrect: true });
        this.checkFlag = true;
      }
      // this.master.CheckVendorName(vName, vendorId).subscribe(resp => {
      //   if (resp) {
      //     this.checkFlag = true;
      //     this.vendorForm.get('vendorName')?.setErrors({ incorrect: true });
      //   } else {
      //     this.vendorForm.get('vendorName')?.setErrors(null);
      //     this.checkFlag = false;
      //   }
      // });
    }
    if (value !== '' || !value == null) {
      this.onDialogOpen(value);
    }
  }
  getVendorSoundex(input: any) {
    this.master.getVendorSoundex(input).subscribe(res => {
      if (res) {
        this.soundexvendorList = res;
      }
    });
  }

  onDialogOpen(vName: any) {
    this.searchName = vName;
    this.getVendorSoundex(this.searchName);
    this.vendorTblAutoFilters();
    this.dialog.open(this.searchMasterScreen, {
      width: '780px'
    });
  }
  onSave() {
    this.dialog.closeAll();
  }
  onCancel() {
    this.dialog.closeAll();
    this.vendorForm.controls.vendorName.setValue('');
    this.vendorForm.get('vendorName')?.setErrors({ required: true });
  }

  getApprovedVendorName() {
    this.master.getApprovedVendorName().subscribe(res => {
      if (res) {
        this.vendorlistddl = res;
        this.vendorfilterlist = res;
      }
    });
  }
  getVendorOwners() {
    this.master.getVendorOwners().subscribe(res => {
      if (res) {
        this.VendorOwnerlist = res;
      }
    });
  }
  vendorItems(value: any) {
    if (!value) { this.assignVendorCopy(); }
    if (value) {
      this.vendorfilterlist = Object.assign([], this.vendorlistddl).filter(
        item => ((item.vendorName.toLowerCase().indexOf(value.toLowerCase()) > -1)));
    }

  }
  assignVendorCopy() {
    this.vendorfilterlist = Object.assign([], this.vendorlistddl);
  }
  vendorKeyupFunction(event, value) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const ven = this.vendorfilterlist.filter(e =>
          e.vendorName.toLowerCase() === value.toLowerCase());
        if (ven.length > 0) {
          this.vendorKeyup = true;
        } else {
          this.vendorKeyup = true;
        }
      } else {
        this.vendorKeyup = false;
      }
    }
  }
  displayVendorFn(id: any): string {
    if (!id) { return ''; }
    const vendorName = this.vendorlistddl.filter(res => res.vendorId === id);
    if (vendorName.length > 0) {
      return vendorName ? vendorName[0].vendorName : '';
    }
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
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
  resettable() {
    this.dt.reset();
    this.global.nativeElement.value = '';
  }
  addVendorOwner(ven: Vendor) {
    this.selectedCompDupList = [];
    this.VendorOwnerlist = this.VendorOwnerlist.filter(e => e.userId !== ven.userId);
    this.selectedCompDupList = Object.assign(ven);
  }
  showall() {
    if (this.vendorList.length > 0) {
      this.itemperpage = this.vendorList.length;
    }
  }
}
