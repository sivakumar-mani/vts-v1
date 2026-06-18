import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MasterService } from '../../../common-methods/services/master.service';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../common-methods/services/auth.service';
import { CommonService } from '../../../common-methods/services/common.service';
import { EmpInsProf, Contact } from '../../models/professional-reference';
import { SharedService } from '../../services/shared.service';
import { BehaviorSubject } from 'rxjs';
import { ScreenAuth } from '../../models/screen-auth';
import { MatDialog } from '@angular/material/dialog';
import { Table, TableModule } from 'primeng/table';
import { VerificationService } from '../../services/verification.service';
import { runInThisContext } from 'vm';
import { VerificationDetails } from '../../models/verification';

@Component({
  standalone: false,
  selector: 'app-emp-ins-prof-detail',
  templateUrl: './emp-ins-prof-detail.component.html',
  styleUrls: ['./emp-ins-prof-detail.component.css']
})
export class EmpInsProfDetailComponent implements OnInit {
  @Input() isVerification: boolean;
  @Input() isEditMode: boolean;
  @Output() public refreshData = new EventEmitter();
  @Output() public isEditModeFlag = new EventEmitter();
  employerInsutionFormGroup: UntypedFormGroup;
  @Input() verificationForm: UntypedFormGroup;
  verificationDetails: VerificationDetails = new VerificationDetails();
  placeHolder: string;
  empFlag = false;
  empIns: any;
  verSt = false;
  pageType = 0;
  modeofInitiation: any[] = [];
  institutionType: any[] = [];
  pathParameters: string[];
  contactFilter = ['Email'];
  contactPhoneFilter = ['Business Phone', 'Mobile Phone', 'Additional Phone'];
  routePath = 'Configure / Employer / Instution Details';
  // tslint:disable-next-line:new-parens
  phoneData = new BehaviorSubject([]);
  emailData = new BehaviorSubject([]);
  userdata: any;
  empInsProf: EmpInsProf = new EmpInsProf();
  setOption = 1;
  showBulkUpload = false;
  label = '';
  tempData: any[] = [];
  emailLookUp = 0;
  genuineEmpInsList: any[] = [];
  genuineInsFilterList: any[];
  genuineInstitutesFilterList: any[];
  profRefFilterList: any[];
  keyUp: boolean;
  name = '';
  address = new BehaviorSubject(null);
  screenAuth: ScreenAuth = new ScreenAuth();
  searchName: any;
  // @ViewChild('searchMasterScreen', { static: true }) 
// searchMasterScreen!: TemplateRef<any>;
  @ViewChild('searchMasterScreen', { static: true })
  searchMasterScreen!: TemplateRef<any>;
  checkFlag = false;
  soundexEmpInsProfList: any[];
  totalpages: number;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  screenColumn: any;
  displayColumns = [{ field: 'addLine1', header: 'Address' },
  { field: 'city', header: 'City' },
  { field: 'stateName', header: 'State' },
  { field: 'countryName', header: 'Country' },
  { field: 'pincode', header: 'Pincode' }];
  constructor(public masterService: MasterService, public authService: AuthService, public router: Router,
    private formBuilder: UntypedFormBuilder, private messageService: MessageService, public common: CommonService,
    private sharedService: SharedService, public dialog: MatDialog, public verify: VerificationService) { }
  ngOnInit() {
    // this.getContactLookup();
    this.getdetail();
    this.userdata = this.authService.userdata;
    this.verificationDetails.loginUserDetVm = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.verify.currentMessage.subscribe(message => this.verificationDetails.screeningCompId = message);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    if (this.authService.empInsProf) {
      this.placeHolder = this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION ? 'Employer Name' :
        this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION ? 'Institution Name' :
          this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE ? 'Professional Name' :
            this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION ? 'Authority Name' : '';
    } else {
      this.router.navigate(['/dashboard/master/employerinstutionentrylist']);
    }
    if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
      this.displayColumns.unshift({ field: 'name', header: 'Employer Name' });
      this.name = 'Employer';
    } else if (this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION) {
      this.displayColumns.unshift({ field: 'name', header: 'Institution Name' });
      this.name = 'Institution';
    } else if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
      this.displayColumns.unshift({ field: 'name', header: 'Authority Name' });
      this.name = 'License';
    } else {
      this.displayColumns.unshift({ field: 'name', header: 'Contact Person Name' });
      this.name = 'Professional Reference';
    }
    // const empInstutioFlag = this.authService.employerFlag;
    this.initFormGroup();
    this.getGenuineInsList();
    if (this.authService.employerInstutionId > 0) {
      this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION ?
        this.employerInsutionFormGroup.get('name')?.enable() : this.employerInsutionFormGroup.get('name')?.disable();
      this.getProfessionalDetailsById();
      if (this.masterService.viewFlag) {
        // this.
        // this.isVerification = true;
      }
    } else {
      this.emailData.next([]);
      this.phoneData.next([]);
    }
  }
  changeView(value: any) {
    if (value === 1) {
      this.showBulkUpload = false;
    } else {
      this.showBulkUpload = true;
    }
  }
  initFormGroup(): void {
    this.employerInsutionFormGroup = this.formBuilder.group({
      pageType: new UntypedFormControl(this.pageType),
      id: new UntypedFormControl(0),
      name: new UntypedFormControl('', Validators.required),
      additionalInformation: new UntypedFormControl(''),
      additionalInformationSub: new UntypedFormControl(''),
      loggedId: new UntypedFormControl(this.userdata.userId),
      contactPerson1: new UntypedFormControl(),
      contactPerson2: new UntypedFormControl(),
      designation1: new UntypedFormControl(),
      designation2: new UntypedFormControl(),
      department1: new UntypedFormControl(),
      department2: new UntypedFormControl(),
      modeId: new UntypedFormControl(0),
      institutionTypeId: new UntypedFormControl(0),
      onlineUrl: new UntypedFormControl(''),
      roc: new UntypedFormControl(''),
      cin: new UntypedFormControl(''),
      dateOfRegistration: new UntypedFormControl(''),
      empFlag: new UntypedFormControl(this.empFlag),
      researchStatusId: new UntypedFormControl(0),
      addressTransId: new UntypedFormControl(0),
      researchMappingId: new UntypedFormControl(0),
      address: new UntypedFormGroup({
        addressId: new UntypedFormControl(0),
        addLine1: new UntypedFormControl('', Validators.required),
        addLine2: new UntypedFormControl(''),
        addLine3: new UntypedFormControl(''),
        cityId: new UntypedFormControl(''),
        city: new UntypedFormControl(),
        districtId: new UntypedFormControl(),
        district: new UntypedFormControl(),
        stateId: new UntypedFormControl('', Validators.required),
        state: new UntypedFormControl(''),
        countryId: new UntypedFormControl('', Validators.required),
        postalCode: new UntypedFormControl('', Validators.required),
        locationId: new UntypedFormControl(),
        place: new UntypedFormControl(),
        country: new UntypedFormControl()
      }),
      commonEmailDet: this.formBuilder.array([]),
      commonPhoneDet: this.formBuilder.array([]),
    });
  }
  GetEmpName() {
    this.masterService.GetEmpName(this.userdata.deptId ? this.userdata.deptId : 0).subscribe(resp => {
      if (resp) {
        this.genuineEmpInsList = resp;
        this.setItems('');
      }
    });
  }
  GetInsName() {
    this.masterService.GetInsName(this.userdata.deptId ? this.userdata.deptId : 0).subscribe(resp => {
      if (resp) {
        this.genuineEmpInsList = resp;
        if (this.authService.employerInstutionId > 0 &&
          this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION) {
          this.getProfessionalDetailsById();
        }
        this.setItems('');
      }
    });
  }
  getGenuineInsList() {
    const empInsFlag = this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION ?
      this.common.GENUINEEMPLOYER : this.common.GENUINEINSTITUTE;
    if (this.authService.empInsProf !== this.common.SCRN_PROFESSIONAL_REFERENCE &&
      this.authService.empInsProf !== this.common.SCRN_LICENSE_CREATION) {
      if (empInsFlag === true) {
        this.GetEmpName();
      } else if (empInsFlag === false) {
        this.GetInsName();
      }
    } else {
      // GetProfessionalReferenceApprovedList
      this.masterService.getProfessionalReferenceApprovedList()
        .subscribe(resp => {
          if (resp) {
            this.genuineEmpInsList = resp;
            this.setItems('');
          }
        });
    }
    if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
      this.masterService.getLicenseAuthorityNameList()
        .subscribe(resp => {
          if (resp) {
            this.genuineEmpInsList = resp;
            this.setItems('');
          }
        });
    }
  }
  assignResourceCopy() {
    this.genuineInsFilterList = Object.assign([], this.genuineEmpInsList);
  }
  setItems(value: any) {
    // if (this.authService.employerInstutionId > 0) {
    //   const index = this.genuineEmpInsList.findIndex(f => f.name.toLowerCase() === this.name.toLowerCase());
    //   if (index > -1) {
    //     // this.genuineEmpInsList.splice(index, 1);
    //   }
    // }
    if (!value) {
      this.assignResourceCopy();
    }
    if (value) {
      this.genuineInsFilterList = Object.assign([], this.genuineEmpInsList).filter(x =>
        ((x.name.toLowerCase().indexOf(value.toLowerCase())) > -1));
    }
  }
  keyUpFunction(event, value) {
    if (event.key === 'enter' || event.key === 'tab') {
      event.preventDefault();
      return false;
    } else {
      if (value) {
        const data = this.genuineInsFilterList.filter(x => x.name.toLowerCase() === value.toLowerCase());
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
        if (this.genuineInsFilterList) {
          if (this.genuineInsFilterList.length && this.genuineInsFilterList.length > 0) {
            data = this.genuineInsFilterList.find(x => x.name === data);
            if (data) {
              return data.name;
            }
          } else {
            return null;
          }
        }

      }
    };
    return dataNew;
  }
  getdetail() {
    if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
      this.routePath = 'Configure / Employer / Employer Creation';
      this.empFlag = true;
      this.label = 'Employer';
      this.empIns = true;
      this.pageType = 2;
      this.getEmployerInstitutionModeOfInitiation();

    } else if (this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION) {
      this.routePath = 'Configure / Institution / Institution Creation';
      this.empFlag = false;
      this.pageType = 2;
      this.label = 'Institution';
      this.empIns = false;
      this.getEmployerInstitutionModeOfInitiation();
      this.getEmployerInstitutionInstitutionType();
    } else if (this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE) {
      this.routePath = 'Configure / Employer / Professional Reference Creation';
      this.empFlag = false;
      this.pageType = 1;
    } else if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
      this.routePath = 'Configure / Employer / License Creation';
      this.empFlag = false;
      this.pageType = 3;
    }
  }
  navigateURL() {
    if (this.isVerification === true) {
      this.router.navigate(['/dashboard/verification/verification']);
    } else {
      if (this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION) {
        this.router.navigate(['/dashboard/master/employerinstutionentrylist']);
      } else if (this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION) {
        this.router.navigate(['/dashboard/master/institution']);
      } else if (this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE) {
        this.router.navigate(['/dashboard/master/professionallist']);
      } else if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
        this.router.navigate(['/dashboard/master/license']);
      }
    }
  }

  addUpdateEmployerInstution(screeningCompId = 0) {
    if (this.employerInsutionFormGroup.valid) {
      this.empInsProf = this.employerInsutionFormGroup.value;
      this.empInsProf.empFlag = this.empFlag;
      this.empInsProf.PageType = this.pageType;
      this.empInsProf.type = this.pageType === 2 ? (this.empFlag ? 'EMPLOYER' : 'INSTITUTION') : null;
      this.empInsProf.loggedId = this.userdata.userId;
      this.empInsProf.screeningCompId = screeningCompId;
      this.empInsProf.name = this.employerInsutionFormGroup.get('name')?.value;
      this.empInsProf.depId = this.userdata.deptId;
      this.masterService.AddUpdateInsEmpProfMasterDet(this.empInsProf).subscribe(resp => {
        if (resp) {
          this.showNotification();
          // this.resetFunction();
          if (!this.isVerification) {
            this.navigateURL();
          } else {
            this.refreshData.emit('true');
            this.isEditMode = false;
            this.getVerificationDetails();
            // this.verify.changeMessage(screeningCompId);
            // this.router.navigate(['dashboard/verification/verification']);
          }
        }
      });
    } else {
      if (this.authService.employerInstutionId === 0) {
        this.employerInsutionFormGroup.markAllAsTouched();
      } else {
        this.employerInsutionFormGroup.markAllAsTouched();
        this.isEditMode = true;
        this.isVerification = false;
        // this.editData.emit('true');
      }
    }
  }
  getVerificationDetails() {
    this.verify.getVerificationDetails(this.verificationDetails).subscribe(res => {
      if (res) {
        if (!res.empInsMasterDet) { res.empInsMasterDet = {}; }
        this.verificationForm.patchValue(res);
        this.verify.tempData = this.common.CloneObject(res);
        this.isEditModeFlag.emit('false');
      }
    });
  }
  navigateEmployerListPage() {
    this.router.navigate(['/dashboard/master/employerinstutionentrylist']);
  }
  resetFunction() {
    if (this.authService.employerInstutionId > 0) {
      this.empInsProf = this.common.tempResetData;
      this.emailData.next(this.empInsProf.commonEmailDet);
      this.phoneData.next(this.empInsProf.commonPhoneDet);
      this.address = new BehaviorSubject(this.empInsProf.address);
      this.address.next(this.empInsProf.address);
      this.employerInsutionFormGroup.patchValue(this.empInsProf);
    } else {
      this.phoneData.next([]);
      this.emailData.next([]);
      this.employerInsutionFormGroup.reset();
      this.employerInsutionFormGroup.markAsUntouched();
    }
  }
  getEmployerInstitutionModeOfInitiation() {
    this.masterService.getEmployerInstitutionModeOfInitiation().subscribe(resp => {
      if (resp) {
        this.modeofInitiation = resp;
      }
    });
  }
  getEmployerInstitutionInstitutionType() {
    this.masterService.getEmployerInstitutionInstitutionType().subscribe(resp => {
      if (resp) {
        this.institutionType = resp;
      }
    });
  }
  showNotification() {
    if (this.authService.employerInstutionId > 0) {
      this.showTopCenter('success', 'Success Message', 'Updated Successfully');
    } else {
      this.showTopCenter('success', 'Success Message', 'Saved Successfully');
    }
    // this.sharedService.emitChange({
    //   severity: 'success',
    //   summary: 'Success Message',
    //   detail: (this.authService.employerInstutionId > 0 ? 'Updated' : 'Added') + ' Successfully'
    // });
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  getProfessionalDetailsById() {
    this.masterService.getProfessionalDetailsById(this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION ? 3 :
      this.pageType, this.authService.employerInstutionId, this.empFlag, this.authService.employerInstutionAddId).subscribe(resp => {
        if (resp) {
          if (resp.commonEmailDet !== null) {
            resp.commonEmailDet.contact = resp.commonEmailDet.contact ? resp.commonEmailDet.contact : [];
          }
          this.empInsProf = resp;
          // this.name = this.empInsProf.name;
          this.common.tempResetData = this.empInsProf;
          this.emailData.next(this.empInsProf.commonEmailDet);
          this.phoneData.next(this.empInsProf.commonPhoneDet);
          this.address.next(this.empInsProf.address);
          this.employerInsutionFormGroup.patchValue(this.empInsProf);
          setTimeout(() => {
            this.employerInsutionFormGroup.get('name')?.setValue(this.empInsProf.name);
          }, 10);
        }
      });
  }
  checkValidEmpInsData(inPutName, screen): void {
    const value = this.employerInsutionFormGroup.get('name')?.value;
    if (value === '' || value == null) {
      this.employerInsutionFormGroup.get('name')?.setValidators(Validators.required);
    } else if (value.length < 3) {
      this.employerInsutionFormGroup.get('name')?.setErrors({ incorrect: true });
      this.checkFlag = false;
    } else {
      this.employerInsutionFormGroup.get('name')?.setErrors(null);
    }
    let existEmpIns: any;
    if (value.length > 3) {
      // const vendorId = this.employerInsutionFormGroup.get('empIns')?.value;
      existEmpIns = this.genuineInsFilterList.find(e =>
        e.name.toLowerCase() === value.toLowerCase());
      if (existEmpIns) {
        this.employerInsutionFormGroup.get('name')?.setErrors({ incorrect: true });
        this.checkFlag = true;
      }
    }
    if (value !== '' || !value == null) {
      this.onDialogOpen(value);
    }
  }
  onDialogOpen(sName: any) {
    this.searchName = sName;
    this.getEmpInsProfListBySoundex(this.searchName);
  }
  onSave() {
    this.dialog.closeAll();
  }
  onCancel() {
    this.dialog.closeAll();
    this.employerInsutionFormGroup.controls.name.setValue('');
    this.employerInsutionFormGroup.get('name')?.setErrors({ required: true });
  }
  getEmpInsProfListBySoundex(input: any) {
    this.soundexEmpInsProfList = [];
    const empInsFlag1 = this.authService.empInsProf === this.common.SCRN_EMPLOYER_CREATION ?
      this.common.GENUINEEMPLOYER : this.authService.empInsProf === this.common.SCRN_INSTITUTION_CREATION ?
        this.common.GENUINEINSTITUTE : this.common.PROESSIONALREF;
    if (this.authService.empInsProf !== this.common.SCRN_PROFESSIONAL_REFERENCE &&
      this.authService.empInsProf !== this.common.SCRN_LICENSE_CREATION) {
      this.masterService.getInstitutionNameAndEmployerBySoundex(input, empInsFlag1, this.userdata.deptId).subscribe(res => {
        if (res) {
          this.soundexEmpInsProfList = res;
          this.dialog.open(this.searchMasterScreen, {
            width: this.soundexEmpInsProfList.length > 0 ? '1000px' : '320px'
          });
        }
      });
    } else if (this.authService.empInsProf === this.common.SCRN_PROFESSIONAL_REFERENCE) {
      this.masterService.getProfessionalRefBySoundex(input, empInsFlag1).subscribe(res => {
        if (res) {
          this.soundexEmpInsProfList = res;
          this.dialog.open(this.searchMasterScreen, {
            width: this.soundexEmpInsProfList.length > 0 ? '1000px' : '320px'
          });
        }
      });
    } else if (this.authService.empInsProf === this.common.SCRN_LICENSE_CREATION) {
      this.masterService.getLicenseAuthorityBySoundex(input).subscribe(res => {
        if (res) {
          this.soundexEmpInsProfList = res;
          this.dialog.open(this.searchMasterScreen, {
            width: this.soundexEmpInsProfList.length > 0 ? '1000px' : '320px'
          });
        }
      });
    }
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
}
