import { Component, OnInit, ViewChild, OnDestroy, ElementRef, TemplateRef } from '@angular/core';
import { MasterService } from '../.././common-methods/services/master.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { CommonService } from '../.././common-methods/services/common.service';
import { CommonAddress } from '../.././common-methods/models/common-address';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from '../.././common-methods/services/auth.service';
import { BreadcrumbFlags } from '../.././common-methods/models/breadcrumb-flags';
import { Observable, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CommonAlertsComponent } from '../.././common-methods/common-alerts/common-alerts.component';
import { Router } from '@angular/router';


@Component({
  standalone: false,
  selector: 'app-vendor-user',
  templateUrl: './vendor-user.component.html',
  styleUrls: ['./vendor-user.component.css']
})
export class VendorUserComponent implements OnInit {
  itemperpage;
  vendorForm: UntypedFormGroup;
  newvendorDetails: NewVendor = new NewVendor();
  numberflag = false;
  charflag = false;
  uniqueflag = false;
  minflag = false;
  isShow = false;
  isEditFlag = false;
  hide = true;
  hide1 = true;
  vendorList: any[] = [];
  vendorContact: any[] = [];
  showFlag = false;
  routePath = 'Configure / Vendor User';
  countryList: any[] = [];
  stateList: any[] = [];
  countryFilterlist: any[] = [];
  stateFilterlist: any[] = [];
  breadcrumbFlags = new BreadcrumbFlags();
  displayedColumns = [
    { field: 'userName', header: 'User Name' },
    { field: 'firstName', header: 'First Name' },
    { field: 'lastName', header: 'Last Name' },
    { field: 'emailId', header: 'Email Id' },
    { field: 'mobileno', header: 'Mobile Number' },
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'active', header: 'Active' },

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


  address = new BehaviorSubject(null);

  constructor(public dialog: MatDialog, private messageService: MessageService,
    private master: MasterService, public common: CommonService, private fb: UntypedFormBuilder, private authservice: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.breadcrumbFlags = this.common.breadcrumbFlags(true);
    this.screenAuth = this.authservice.getScreenAuth(this.router.url);
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.getNewVendorList();
    this.getVendorContactList();
    this.getApprovedVendorName();
    this.itemperpage = 10;
  }
  private vendorTblAutoFilters(): void {
    this.vendorNameFilteredOptions = this.vendorNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.vendorList.map(x => x.vendorName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  passwordChange(val: any) {
    const txt = val;
    const numb = txt.match(/\d/g);
    const specialchar = txt.match(/[!@#$%^&*(),.?":{}|<>]/g);
    const stringonly = txt.match(/[a-zA-z]/g);
    if (specialchar) {
      this.uniqueflag = true;
    } else if (!specialchar) {
      this.uniqueflag = false;
    }
    if (stringonly) {
      this.charflag = true;
    } else if (!stringonly) {
      this.charflag = false;
    }
    if (numb) {
      this.numberflag = true;
    } else if (!numb) {
      this.numberflag = false;
    }
    if ((val.length) >= 8) {
      this.minflag = true;
    } else {
      this.minflag = false;
    }
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      this.isShow = false;
      this.vendorForm.get('retypePassword')?.enable();
      this.vendorForm.get('retypePassword')?.clearValidators();
      this.vendorForm.get('retypePassword')?.updateValueAndValidity();
    } else {
      this.isShow = true;
      this.vendorForm.get('retypePassword')?.disable();
      this.vendorForm.get('retypePassword')?.reset();
    }
  }

  initFormGroup() {
    this.vendorForm = this.fb.group(
      {
        userName: new UntypedFormControl('', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]),
        vendorId: new UntypedFormControl('', Validators.required),
        vendorName: new UntypedFormControl('', Validators.required),
        retypePassword: new UntypedFormControl('', Validators.required),
        userId: new UntypedFormControl(),
        firstName: new UntypedFormControl(),
        lastName: new UntypedFormControl(),
        active: new UntypedFormControl(true),
        password: new UntypedFormControl('', Validators.required),
        deleteFlag: new UntypedFormControl(false),
        loggedId: new UntypedFormControl(this.userData.userId),
        vendorCredentialId: new UntypedFormControl(0),
        mobileNo: new UntypedFormControl('', Validators.required),
        emailId: new UntypedFormControl('', Validators.compose(
          [Validators.pattern(this.common.EmailRegX), Validators.required])),

      }, { validator: this.checkMatchingPasswords('password', 'retypePassword') });
  }

  getNewVendorList() {
    this.master.getNewVendorsList().subscribe(resp => {
      this.vendorList = resp;
    });
  }
  checkMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
      // tslint:disable-next-line:one-variable-per-declaration
      const passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        if (passwordConfirmationInput.value) {
          this.vendorForm.get('retypePassword')?.setErrors({ notEquivalent: true, });
        } else {
          this.vendorForm.get('retypePassword')?.setValidators(Validators.required);
        }
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }
  vendorformreset() {

  }
  getVendorContactList() {
    this.master.getVendorsContactTypes().subscribe(resp => {
      this.vendorContact = resp;
      // this.vendorDetails.vendorContactDetails = resp;
      // console.log(this.vendorDetails.vendorContactDetails)
    });
  }
  editNewvendorDetails(src, mode: any) {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Update';
    this.initFormGroup();
    this.master.getNewVendorsListById(src.vendorCredentialId).subscribe(res => {
      if (res) {
        this.updateData = res;
        this.hide = true;
        this.hide1 = true;
        this.vendorForm.patchValue({
          vendorCredentialId: this.updateData.vendorCredentialId,
          userName: this.updateData.userName,
          password: this.updateData.password,
          retypePassword: this.updateData.password,
          firstName: this.updateData.firstName,
          lastName: this.updateData.lastName,
          emailId: this.updateData.emailId,
          active: this.updateData.active,
          vendorName: this.updateData.vendorName,
          vendorId: this.updateData.vendorId,
          deleteFlag: this.updateData.deleteFlag,
          mobileNo: this.updateData.mobileno

        });
        if (this.vendorForm.get('vendorId')?.value > 0) {
          this.vendorForm.get('userName')?.disable();
          this.vendorForm.get('emailId')?.disable();
        } else {
          this.vendorForm.get('userName')?.enable();
          this.vendorForm.get('emailId')?.enable();
        }
        const orgRawValue = this.vendorForm.getRawValue();
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

  // validationAddress() {
  //   this.vendorForm.get('address')?.markAllAsTouched();
  // }
  getVendor(e: any) {
    if (e > 0) {
      const vendorName = this.vendorlistddl.find(x => x.vendorId === e).vendorName;
      this.vendorForm.controls.vendorName.setValue(vendorName);
    } else {
      this.vendorForm.controls.vendorName.setValue('');
    }
    // console.log(e);
  }
  saveVendor() {
    if (this.vendorForm.valid) {
      this.newvendorDetails.vendorId = this.vendorForm.controls.vendorId.value;
      this.newvendorDetails.vendorName = this.vendorForm.controls.vendorName.value;
      this.newvendorDetails.userName = this.vendorForm.controls.userName.value;
      this.newvendorDetails.password = this.vendorForm.controls.retypePassword.value;
      this.newvendorDetails.firstName = this.vendorForm.controls.firstName.value;
      this.newvendorDetails.lastName = this.vendorForm.controls.lastName.value;
      this.newvendorDetails.emailId = this.vendorForm.controls.emailId.value;
      this.newvendorDetails.deleteFlag = this.vendorForm.controls.deleteFlag.value;
      this.newvendorDetails.active = this.vendorForm.controls.active.value;
      this.newvendorDetails.loggedId = this.userData.userId;
      this.newvendorDetails.vendorCredentialId = this.vendorForm.controls.vendorCredentialId.value;
      this.newvendorDetails.applicationId = this.master.vendorapid;
      this.newvendorDetails.createdUserId = this.userData.userId; 
      this.newvendorDetails.fieldExecutiveFlag = false;
      this.newvendorDetails.mobileNo = this.vendorForm.controls.mobileNo.value;
      this.master.addNewVendor(this.newvendorDetails).subscribe(resp => {

        if (this.vendorForm.controls.vendorCredentialId.value > 0) {
          this.showTopCenter('success', 'Success Message', 'Updated Successfully');
        } else {
        }

        this.breadcrumbFlags.toolTip = 'Save';
        this.getNewVendorList();
        this.closeForm();

      });
    } else {
      this.vendorForm.markAllAsTouched();
    }
  }
  openConfirmDialog(data): void {
    this.data = data;
    this.dialogRef = this.dialog.open(this.deleteConfirmation, {
      width: '320px',
      disableClose: true
    });
  }
  deleteNewVendorDetails() {
    this.master.deleteNewVendorDetails(this.data.vendorCredentialId, this.userData.userId).subscribe(resp => {
      if (resp) {
        this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
        this.dialogRef.close();
        this.getNewVendorList();
      }
    });
  }
  openForm() {
    this.breadcrumbFlags = this.common.breadcrumbFlags();
    this.breadcrumbFlags.toolTip = 'Save';
    this.initFormGroup();
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
    this.vendorForm.reset();
    this.initFormGroup();

  }

  checkfocus() {
    if (this.uniqueflag === true && this.numberflag === true && this.charflag === true && this.minflag === true) {
      if (this.hide === true || this.hide === false) {
        this.isShow = false;
        this.vendorForm.get('retypePassword')?.clearValidators();
        this.vendorForm.get('retypePassword')?.updateValueAndValidity();
      }
    } else if (this.uniqueflag === false || this.numberflag === false || this.charflag === false || this.minflag === false) {
      if (this.hide === true || this.hide === false) {
        this.isShow = true;
      }
    }
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
        // console.log(this.vendorfilterlist);
      }
    });
  }
  checkUserName() {
    this.authservice.CheckUserName(this.vendorForm.get('userName')?.value).subscribe(res => {
      if (res) {
        this.vendorForm.get('userName')?.setErrors({ incorrect: true });
      } else {
        this.vendorForm.get('userName')?.setErrors(null);
      }
    });
  }
  checkEmailId() {
    this.authservice.CheckMailid(this.vendorForm.get('emailId')?.value).subscribe(res => {
      if (res) {
        this.vendorForm.get('emailId')?.setErrors({ incorrect: true });
      } else {
        this.vendorForm.get('emailId')?.setErrors(null);
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

  get displayvendorFn() {
    const vendorNew = (comp) => {
      if (comp == null || comp === undefined) {
        return null;
      } else {
        if (comp && this.vendorlistddl && this.vendorlistddl.length > 0) {
          comp = this.vendorlistddl.filter(x => x.vendorId === comp);
          if (comp.length > 0) {
            return comp[0].vendorName;
          }
        } else {
          return null;
        }
      }
    };
    return vendorNew;
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

  showall() {
    if (this.vendorList.length > 0) {
      this.itemperpage = this.vendorList.length;
    }
  }
}

export class NewVendor {
  vendorCredentialId: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  emailId: string;
  loggedId: number;
  mobileNo: string;
  //Vendor Details
  vendorId: number;
  vendorName: string;
  active: boolean;
  createdUserId: number;
  created: number;
  updatedUserId: number;
  updated: number;
  deleteFlag: boolean;
  applicationId: number;
  fieldExecutiveFlag: boolean;
}