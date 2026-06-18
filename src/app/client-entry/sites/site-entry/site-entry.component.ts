import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { SearchCriteriaService } from 'src/app/common-methods/services/search-criteria.service';
import { MatStepper } from '@angular/material/stepper';
import { MasterService } from '../../../common-methods/services/master.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { Router } from '@angular/router';
import { SiteDetail, SiteNumber } from '../../../common-methods/models/site';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { SharedService } from 'src/app/common-methods/services/shared.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { BehaviorSubject } from 'rxjs';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { MatDialog } from '@angular/material/dialog';
import { AgentEntryMasterService } from 'src/app/common-methods/services/agent-entry-master.service';
import { MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
import { AutoCompleteDropDown } from 'src/app/common-methods/models/autoComplete';
import { ClientService } from 'src/app/common-methods/services/client.service';

@Component({
  standalone: false,
  selector: 'app-site-entry',
  templateUrl: './site-entry.component.html',
  styleUrls: ['./site-entry.component.css']
})

export class SiteEntryComponent implements OnInit, AfterViewInit {
  // copysite = true;
  sitedeatil: SiteDetail = new SiteDetail();
  siteFormGroup: UntypedFormGroup;
  emailConfig: UntypedFormArray;
  clientList: any[] = [];
  bindAddress = []
  filterAgents: any;
  step1 = 0;
  @ViewChild('stepper1', { static: true }) stepper: MatStepper;
  emailcategory: any;
  emaildest: any;
  sendtype: any;
  reporttype: any;
  emailrowCount = 1;
  checkDuplicateFlag = false;
  filterdata: any;
  editFlag = false;
  index = -1;
  userdata: any;
  screenAuth: any = {};
  btnSave = true;
  btnReset = true;
  btnBack = true;
  clientAddress = false
  emailconfifList: any[] = [];
  clientLogo: any[];
  tooTip = 'Save';
  tooltipName = 'Add';
  routePath = 'Client / Site Creation';
  errormsg = '';
  emailData = new BehaviorSubject([]);
  address = new BehaviorSubject(null);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emailIds: any[] = [];
  columns = [
    { field: 'categoryLookupId', header: 'Email Category' },
    { field: 'sendTypeLookupId', header: 'Send Type' },
    { field: 'reportLookupId', header: 'Report Type' },
    { field: 'sendFlag', header: 'Send Email' },
  ];
  emailColumn = [
    { field: 'destLookupId', header: 'Email Dest.Type' },
    { field: 'contactData', header: 'Email Id' },
  ];
  emailLookUp: 0;
  tempData: any[] = [];
  contactFilter = ['Email'];
  Listreporttype: any;
  tempEmialdata: any[] = [];
  ClientMailDetails: any;
  catId: any;
  categoryName: string;
  indianClientFlag: boolean;
  updateCatValue: boolean;
  editRespData: any;
  totalpages: number;
  // @ViewChild('dt', { static: false }) dt!: Table;
  @ViewChild('dt', { static: false }) dt!: Table;
  currentPage = 1;
  tempCurrentPage = 1;
  commonRepertType: any;
  currentPageNo = new UntypedFormControl();
  addFlag = true;
  codeControls!: AutoCompleteDropDown;
  sFormGroup: UntypedFormGroup;
  clientBindData: any[] = [];
  clientName: string = '';
  entitySelection: any[] = [];
  size = 0;
  siteDocList = new siteSendDocList();
  isDisabled: boolean = true;
  //siteDocVm: SiteDocument[] = [];
  constructor(public searchcriteria: SearchCriteriaService, public master: MasterService, private authService: AuthService,
    public formBuilder: UntypedFormBuilder, public auth: AuthService, public route: Router, private saharedService: SharedService,
    public common: CommonService, public dialog: MatDialog, public agentMasterService: AgentEntryMasterService,
    private messageService: MessageService, private scroll: ScrollToErrorDirective, public clientService: ClientService,) { }
  ngOnInit() {
    // this.screenAuth = this.authService.getScreenAuth(this.common.SCRN_SITE_CREATION, this.common.MOD_CLIENT);
    this.userdata = this.auth.userdata;
    this.initFormGroup();
    this.isDisabled = this.siteFormGroup.get('siteDetails.logoToAppearFlag')?.value !== true;
    this.siteFormGroup.get('siteDetails.logoToAppearFlag')?.valueChanges.subscribe(value => {
      this.isDisabled = value !== true;
    });
    this.getEntitySolution();
    this.sFormGroup = this.formBuilder.group({
      codeId: new UntypedFormControl({ value: 0, disabled: true }),
    });
    this.codeControls = new AutoCompleteDropDown('Code', 'codeId', 'countryId', 'phoneCode', this.common.countryList, '', this.sFormGroup, false, true, false);
    this.getSiteDetails();
    this.categoryType();
    const siteId = this.auth.siteId;
    this.siteFormGroup.get('siteDetails.clientId')?.enable();
    if (this.auth.clientId) {
      this.siteFormGroup.get('siteDetails.clientId')?.setValue(this.auth.clientId);
    }
    if (siteId) {
      this.editFlag = true;
      this.tooTip = 'Update';
      this.getSiteDetailbysiteno(siteId);
    }
    this.emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormArray;
    this.emailrowCount = this.emailConfig.length;
    this.siteFormGroup.get('siteDetails.siteNo')?.disable();
    this.getClientMasterDetails();
  }
  ngAfterViewInit() {
    this.stepperChange(0);
  }
  // listenToDAVCheckboxChange() {
  //   const davControl = this.siteFormGroup.get('siteDetails.isDAVEnabled');
  //   const siteDetailsGroup = this.siteFormGroup.get('siteDetails') as UntypedFormGroup;

  //   davControl.valueChanges.subscribe((isChecked: boolean) => {
  //     if (isChecked) {
  //       this.step1 = 1;
  //       // Enable DAV section fields
  //       siteDetailsGroup.enable({ emitEvent: false });
  //     } else {
  //       this.step1 = 0;
  //       Object.keys(siteDetailsGroup.controls).forEach(controlName => {
  //         if (controlName === 'logoToAppearFlag' || controlName === 'siteFromMailId') {
  //           siteDetailsGroup.get(controlName).disable({ emitEvent: false });
  //         }
  //       });
  //       this.sitedeatil.clientLogo = [];
  //     }
  //   });
  // }
  // get isLogoEnabled(): boolean {
  //   return this.siteFormGroup.get('logoToAppearFlag')?.value === true;
  // }
  public getSiteDropDown(value?: any) {
    let list: any;
    // list = this.clientList.filter(e => (e.clientName == this.clientName) || (e.clientId == value));
    list = this.clientList.filter(e => e.clientId == value);
    if (list[0]?.lookUpDesc == 'Site') {
      this.common.hideandShowFlag = true;
    }
    else {
      this.siteFormGroup.get('siteDetails.invoiceTitleLookupId')?.setValue(null);
      this.siteFormGroup.get('siteDetails.invoiceTitleLookupId')?.clearValidators();
      this.siteFormGroup.get('siteDetails.invoiceTitleLookupId')?.updateValueAndValidity();
      this.common.hideandShowFlag = false;

    }
  }
  getClientMasterDetails() {
    this.clientService.getClientMasterDetails(this.userdata.teamId, this.userdata.subTeamId).subscribe(res => {
      if (res) {
        this.clientBindData = res.invoiceTitle;
      }
    });
  }

  resetForm() {
    if (this.auth.siteId > 0) {
      this.emailconfifList = this.editRespData.emailConfig;
      if (this.editRespData) {
        let list: any[] = [];
        this.emailconfifList.forEach(ele => {
          this.catId = this.emailcategory.find(x => x.lookUpId === ele.categoryLookupId);
          if (this.catId && (this.catId.lookUpName === this.common.INSUF_NOTIFICATION || this.common.FINAL_REPORT)) {
            list.push(this.catId.lookUpName);
          }
        });
        if (list.length > 0) {
          if (list.some(s => s === this.common.INSUF_NOTIFICATION)) {
            this.getReportType(this.common.INSUF_NOTIFICATION);
          }
          if (list.some(s => s === this.common.FINAL_REPORT)) {
            this.getReportType(this.common.FINAL_REPORT);
          }
        }
      }
      this.address = new BehaviorSubject(this.editRespData.address);
      this.address.next(this.editRespData.address);
      this.siteFormGroup.patchValue(this.editRespData);
      this.siteFormGroup.patchValue({
        cityId: this.editRespData.address.cityId,
        place: this.editRespData.address.locationId,
        locationId: this.editRespData.address.locationId,
      });
      if (this.siteFormGroup.get('siteDetails.clientId')?.value) {
        this.getClientMail(this.siteFormGroup.get('siteDetails.clientId')?.value);
      }
    } else {
      this.sitedeatil = new SiteDetail();
      this.siteFormGroup.reset();
      this.siteFormGroup.markAsPristine();
      this.initFormGroup();
      this.getSiteDetails();
      this.categoryType();
      this.emailconfifList = [];
      this.auth.siteId = 0;
      this.editFlag = false;
      this.emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormArray;
      this.emailrowCount = this.emailConfig.length;
      this.goToStep(0);
    }
  }
  getEmailValidation(value: any) {
    if (value && value.length > 0) {
      // const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,5}$/;
      const emailPattern = this.common.EmailRegX;

      let flag = value.split(',').some(x => !(emailPattern.test(x)));
      if (flag === true) {
        this.siteFormGroup.get('siteDetails.centralHREmailId')?.setErrors({ incorrect: true });
      } else {
        this.siteFormGroup.get('siteDetails.centralHREmailId')?.setErrors(null);
      }
    }
  }
  // Added By Megala - For VTS2-2025-CRT-0253
  getEntitySolution() {
    this.clientService.GetEntitySelection().subscribe((res: any) => {
      if (res) {
        this.entitySelection = res;

        if (
          this.siteFormGroup.get('siteDetails.companyId')?.value == null ||
          this.siteFormGroup.get('siteDetails.companyId')?.value == '' ||
          this.siteFormGroup.get('siteDetails.companyId')?.value == 0
        ) {

          const krsrnvl = this.entitySelection.filter(
            (f: any) => f.companyName.toUpperCase() == this.common.KRYA_SCREENING
          );

          if (krsrnvl && krsrnvl.length > 0) {
            this.siteFormGroup
              .get('siteDetails.companyId')
              ?.setValue(krsrnvl[0].companyId);
          }
        }
      }
    });
  }

  initFormGroup() {
    this.siteFormGroup = this.formBuilder.group({
      createdUserId: new UntypedFormControl(this.userdata.userId),
      siteDetails: new UntypedFormGroup({
        logoToAppearFlag: new UntypedFormControl(false),
        isDAVEnabled: new UntypedFormControl(false),
        siteFromMailId: new UntypedFormControl(''),
        companyId: new UntypedFormControl('', Validators.required),
        clientId: new UntypedFormControl('', Validators.required),
        siteNo: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
        billingName: new UntypedFormControl('', Validators.required),
        gstNumber: new UntypedFormControl(),
        siteName: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
        contactEmailId: new UntypedFormControl('', Validators.compose([Validators.required, Validators.
          pattern(this.common.EmailRegX)])),
        mobileNo: new UntypedFormControl('', Validators.compose([Validators.required,
        Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)])),
        phoneNo: new UntypedFormControl('', Validators.compose([Validators.required,
        Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)])),
        // centralHREmailId: new UntypedFormControl('', Validators.required),
        contactPerson: new UntypedFormControl('', Validators.required),
        active: new UntypedFormControl(true),
        addressId: new UntypedFormControl(0),
        siteId: new UntypedFormControl(0),
        siteAddress: new UntypedFormControl(),
        invoiceTitleLookupId: new UntypedFormControl('', Validators.required),
        enableLUT: new UntypedFormControl(null),
        enableGST: new UntypedFormControl(null),
        supportingDocument: new UntypedFormControl([]),
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
        postalCode: new UntypedFormControl(''),
        locationId: new UntypedFormControl(),
        country: new UntypedFormControl(),
        state: new UntypedFormControl(),
        place: new UntypedFormControl(),
        district: new UntypedFormControl(),
        city: new UntypedFormControl()
      }),
      emailConfig: new UntypedFormGroup({
        siteNotifyId: new UntypedFormControl(0),
        categoryLookupId: new UntypedFormControl(''),
        sendTypeLookupId: new UntypedFormControl(),
        reportLookupId: new UntypedFormControl(),
        commonEmailDet: this.formBuilder.array([]),
        sendFlag: new UntypedFormControl(false),
        checkDuplicateFlag: new UntypedFormControl(false),
      }),

    });
  }
  initemailfrm(): UntypedFormGroup {
    return this.formBuilder.group({
      siteNotifyId: new UntypedFormControl(0),
      categoryLookupId: new UntypedFormControl(''),
      sendTypeLookupId: new UntypedFormControl(),
      reportLookupId: new UntypedFormControl(),
      commonEmailDet: new UntypedFormGroup({
        lookupId: new UntypedFormControl(this.emailLookUp),
      }),
      sendFlag: new UntypedFormControl(false),
      checkDuplicateFlag: new UntypedFormControl(false),
    });
  }
  getContactLookup() {
    this.master.GetContactLookup().subscribe(res => {
      if (res) {
        this.tempData = res;
        const emailLookUp = this.tempData.filter(f => this.contactFilter.some(s => s === f.lookUpName));
        this.emailLookUp = emailLookUp[0].lookUpId;
        this.siteFormGroup.get('emailConfig.commonEmailDet.lookupId')?.setValue(this.emailLookUp);

      }
    });
  }
  addressValidation(list = []) {
    if (!this.sFormGroup) return;
    this.sFormGroup.get('codeId')?.setValue(this.siteFormGroup.get('address.countryId')?.value);
    this.codeControls = new AutoCompleteDropDown('Code', 'codeId', 'countryId', 'phoneCode', list, '', this.sFormGroup, false, true, false);
    if (this.common.getNameById(list, 'countryId', 'country', this.siteFormGroup.get('address.countryId')?.value) ?
      this.common.getNameById(list, 'countryId', 'country', this.siteFormGroup.get('address.countryId')?.value).toLowerCase() : ''
        === this.common.indiaCountry ? this.common.indiaCountry.toLowerCase() : '') {
      this.siteFormGroup.get('address.postalCode')?.setValidators(Validators.required);
    } else {
      this.siteFormGroup.get('address.postalCode')?.clearValidators();
    }
    this.siteFormGroup.get('address.postalCode')?.updateValueAndValidity();
  }
  createView(n: any) {
    this.step1 = n.selectedIndex;
    const emailConfigLength = this.emailConfig.length;
    this.stepperChange(n.selectedIndex);
    if (this.step1 === 0) {
      this.step1 = 0;
      this.stepperChange(0);
    }
    if (this.step1 !== 0) {
      if (this.step1 === 1) {
        if (this.siteFormGroup.valid) {
          this.stepperChange(n.selectedIndex);
        } else {
          this.siteFormGroup.markAllAsTouched();
          this.step1 = 0;
          this.stepperChange(0);
        }
      }
    }
  }

  selectionChange(n: any) {
    if (n === 'next') {
      this.stepper.next();
    } else if (n === 'previous') {
      this.stepper.previous();
    }
  }
  addemailfrm(index: number, addcontrol: boolean, duplicate: boolean) {
    this.emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormArray;
    const frmgroup = this.emailConfig.controls[index] as UntypedFormGroup;
    const controlNames = ['categoryLookupId', 'sendTypeLookupId', 'reportLookupId', 'emailAddress'];
    for (const ctrl in frmgroup.controls) {
      if (frmgroup.controls.hasOwnProperty(ctrl)) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (ctrl === 'emailAddress') {
            frmgroup.get(ctrl).setValidators(Validators.compose(
              [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
            frmgroup.get(ctrl).updateValueAndValidity();
          }
          if (frmgroup.get(ctrl).valid) {
            frmgroup.get(ctrl).markAsTouched();
            frmgroup.get(ctrl).setValidators(Validators.required);
            frmgroup.get(ctrl).updateValueAndValidity();
          }
        }
      }
    }
    if (this.emailConfig.controls[index].valid && addcontrol) {
      this.emailConfig.push(this.initemailfrm());
      this.emailrowCount = this.emailConfig.length;
      // this.categoryType(this.emailrowCount - 1);
      if (duplicate) {
        const duplicatevalue = this.emailConfig.controls[index].value;
        duplicatevalue.siteNotifyId = 0;
        this.emailConfig.controls[index + 1].patchValue(duplicatevalue);
        this.emailConfig.controls[index + 1].get('checkDuplicateFlag')?.setValue(false);
        this.categoryType();
      }
    }
  }
  removefrmControl(index: number) {
    if (this.emailConfig.length > 1) {
      // tslint:disable-next-line:no-string-literal
      const control = this.siteFormGroup.controls['emailConfig'] as UntypedFormArray;
      // remove the chosen row
      control.removeAt(index);
      this.emailrowCount = this.emailConfig.length;
    }
  }
  categoryTypeChange(event: any) {
    // const list = this.emailconfifList.filter(x => x.categoryLookupId === event);
    // const control = this.siteFormGroup.controls.emailConfig as UntypedFormGroup;
    // if (list.length > 0) {
    //   if (this.index === -1) {
    //     this.showTopCenter('warn', 'Failure Message', 'Category type already exist');
    //     control.get('categoryLookupId')?.setValue(null);
    //   } else {
    //     if (this.updateCatValue !== event) {
    //       this.showTopCenter('warn', 'Failure Message', 'Category type already exist');
    //       control.get('categoryLookupId')?.setValue(null);
    //     }
    //   }
    // }
    this.categoryType();
  }
  categoryType(): void {
    const control = this.siteFormGroup.controls.emailConfig as UntypedFormGroup;
    if (control.get('categoryLookupId')?.value) {
      const value = this.emailcategory.find(x => x.lookUpId === control.get('categoryLookupId')?.value);
      this.categoryName = value.lookUpName;
    }
    if (control.get('categoryLookupId')?.value === 0 || control.get('categoryLookupId')?.value === '0'
      || control.get('categoryLookupId')?.value === '' || control.get('categoryLookupId')?.value === null) {
      control.get('sendTypeLookupId')?.disable();
      control.get('reportLookupId')?.disable();
      control.get('sendTypeLookupId')?.setValue(null);
      control.get('reportLookupId')?.setValue(null);

    } else {
      control.get('sendTypeLookupId')?.enable();
      control.get('reportLookupId')?.enable();
    }
    if (control.get('categoryLookupId')?.value > 0) {
      const catId = this.emailcategory.find(x => x.lookUpId === control.get('categoryLookupId')?.value);
      this.getReportType(catId.lookUpName);
    }
  }

  getReportType(lookupName: any) {
    this.master.getReportTypeByCatId(lookupName).subscribe(resp => {
      if (resp) {
        this.reporttype = resp;
        if (this.commonRepertType) {
          if (this.commonRepertType.length > 0) {
            if (this.commonRepertType[0].lookUpId !== resp[0].lookUpId) {
              this.commonRepertType = this.common.CloneObject(this.commonRepertType.concat(resp));
            }
          }
        } else {
          this.commonRepertType = this.common.CloneObject(resp);
        }
      }
    });
  }
  getSiteDetails() {

    this.master.GetSiteDetails().subscribe(resp => {
      if (resp) {
        this.clientList = resp.agentList;
        if (this.siteFormGroup.get('siteDetails.clientId')?.value) {
          this.getClientMail(this.siteFormGroup.get('siteDetails.clientId')?.value);
        }
        this.emailcategory = resp.siteLookup.emailCategoryType;
        this.emaildest = resp.siteLookup.typeOfAgreement;
        this.sendtype = resp.siteLookup.sendType;
        this.reporttype = resp.siteLookup.reportType;
      }
    });
  }
  getClientMail(value: any) {
    if (value) {
      this.siteFormGroup.get('siteDetails.siteNo')?.enable();
      if (this.siteFormGroup.get('siteDetails.siteId')?.value === 0) {
        this.siteFormGroup.get('siteDetails.siteNo')?.setValue(null);
      }
      const clientId = value;
      this.getClientAddress(clientId)
      this.indianClientFlag = this.clientList.find(x => x.clientId === clientId)?.indianClientFlag;
      if (this.indianClientFlag === true) {
        if (this.siteFormGroup.get('siteDetails.gstNumber')?.value) {
          this.siteFormGroup.get('siteDetails.gstNumber')?.clearValidators();
          this.siteFormGroup.get('siteDetails.gstNumber')?.updateValueAndValidity();
        } else {
          this.siteFormGroup.get('siteDetails.gstNumber')?.setValidators([Validators.minLength(15), Validators.required]);
          this.siteFormGroup.get('siteDetails.gstNumber')?.updateValueAndValidity();
        }
      } else {
        this.siteFormGroup.get('siteDetails.gstNumber')?.clearValidators();
        this.siteFormGroup.get('siteDetails.gstNumber')?.updateValueAndValidity();
        this.siteFormGroup.get('siteDetails.gstNumber')?.setValue(null);
      }
      if (this.siteFormGroup.get('siteDetails.siteId')?.value === 0) {
        this.agentMasterService.CheckClientSiteFlag(clientId).subscribe(resp => {
          if (resp === false) {
            this.openDialog();
          } else {
            this.siteFormGroup.get('siteDetails.gstNumber')?.setValue(null);
            this.emailconfifList = [];
          }
        });
      }
      this.getSiteDropDown(value);
    }
  }
  public openDialog() {
    const popupData = {
      action: this.common.DELETECONFIRMATION,
      headerText: 'Confirmation',
      bodyText: 'The client already has Site details. Do you want to use existing site?'
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
            this.bindClientMail();
          } else {
            this.siteFormGroup.get('siteDetails.gstNumber')?.setValue(null);
            this.emailconfifList = [];
          }
        }
      });
    }
  }
  bindClientMail() {
    const clientId = this.siteFormGroup.get('siteDetails.clientId')?.value;
    this.agentMasterService.GetClientSiteMailInfo(clientId).subscribe(resp => {
      if (resp) {
        this.ClientMailDetails = resp;
        this.siteFormGroup.get('siteDetails.gstNumber')?.setValue(this.ClientMailDetails.gstNo);
        this.ClientMailDetails.clientEmail.forEach(ele => {
          ele.siteNotifyId = 0;
          ele.sendFlag = ele.mailNotification;
          ele.commonEmailDet.forEach(ele1 => {
            ele1.contactId = 0;
            ele1.transContactId = 0;
            ele1.contactData = ele1.contactData;
            ele1.active = true;
            ele1.lookupId = null;
            ele1.destLookupId = ele1.destLookupId;
            ele1.destName = null;
          });
        });
        this.emailconfifList = this.ClientMailDetails.clientEmail;
      }
    });
  }
  getClientList() {
    this.searchcriteria.getSearchCriteriaList().subscribe(resp => {
      this.clientList = resp.getAllAgents;
      this.filterAgents = resp.getAllAgents;
    });
  }
  getSiteDetailbysiteno(data: number) {
    this.master.GetSiteDetailById(data).subscribe(resp => {
      this.sitedeatil = resp;
      this.clientName = resp.siteDetails.clientName;
      this.editRespData = this.common.CloneObject(resp);
      this.emailconfifList = this.sitedeatil.emailConfig;
      const clientLogo: ClientLogoTransVm[] = resp.clientLogo;
      clientLogo.forEach(logo => {
        this.master.GetDocByFilePath(logo.filePath).subscribe(docByte => {
          logo.document = docByte;
        });
      });
      this.clientLogo = clientLogo;
      if (resp) {
        let list: any[] = [];
        if (this.emailconfifList != null && this.emailcategory != null) {
          this.emailconfifList.forEach(ele => {
            this.catId = this.emailcategory.find(x => x.lookUpId === ele.categoryLookupId);
            if (this.catId && (this.catId.lookUpName === this.common.INSUF_NOTIFICATION || this.common.FINAL_REPORT)) {
              list.push(this.catId.lookUpName);
            }
          });
        }
        if (list.length > 0) {
          if (list.some(s => s === this.common.INSUF_NOTIFICATION)) {
            this.getReportType(this.common.INSUF_NOTIFICATION);
          }
          if (list.some(s => s === this.common.FINAL_REPORT)) {
            this.getReportType(this.common.FINAL_REPORT);
          }
        }
      }
      // this.address = new BehaviorSubject(this.sitedeatil.address);
      this.address.next(this.sitedeatil.address);
      if (this.sitedeatil.address.countryId) {
        this.sFormGroup.get('codeId')?.setValue(this.sitedeatil.address.countryId);
      }
      this.siteFormGroup.patchValue(this.sitedeatil);
      this.siteFormGroup.patchValue({
        cityId: this.sitedeatil.address.cityId,
        place: this.sitedeatil.address.locationId,
        locationId: this.sitedeatil.address.locationId,
      });
      if (this.siteFormGroup.get('siteDetails.clientId')?.value) {
        this.getClientMail(this.siteFormGroup.get('siteDetails.clientId')?.value);
      }
      this.siteFormGroup.get('siteDetails.clientId')?.disable();
    });
  }

  Validatenext() {
    if (this.siteFormGroup.controls.siteDetails.valid && this.siteFormGroup.controls.address.valid) {
      // this.step1 = 1;
      this.selectionChange('next');
    } else {
      this.siteFormGroup.controls.siteDetails.markAllAsTouched();
      this.siteFormGroup.controls.address.markAllAsTouched();
    }
  }
  openSaveDialog() {
    const emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormGroup;
    this.validateControl();
    if (emailConfig.valid) {
      const popupData = {
        action: this.common.DELETECONFIRMATION,
        headerText: 'Confirmation',
        bodyText: 'Are you sure you want to save this site without updating or adding Site Email Id?'
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
              this.savesite();
            }
          }
        });
      }
    } else {
      this.savesite();
    }
  }
  savesite() {
    this.resetEmailConfig();
    this.siteFormGroup.controls.siteDetails.markAllAsTouched();
    this.siteFormGroup.controls.address.markAllAsTouched();
    const emaildet = this.siteFormGroup.controls.emailConfig.get('commonEmailDet') as UntypedFormArray;
    if (emaildet.controls.length > 0) {
      emaildet.controls[0].get('contactData')?.clearValidators();
      emaildet.controls[0].get('contactData')?.updateValueAndValidity();
      emaildet.controls[0].get('destLookupId')?.clearValidators();
      emaildet.controls[0].get('destLookupId')?.updateValueAndValidity();
    }
    const emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormGroup;
    if (this.siteFormGroup.valid) {
      if (this.emailconfifList.length > 0) {
        const site = this.siteFormGroup.value;
        this.sitedeatil.createdUserId = this.userdata.userId;
        this.sitedeatil.siteDetails = site.siteDetails;
        this.sitedeatil.siteDetails.clientId = this.siteFormGroup.get('siteDetails.clientId')?.value;
        this.sitedeatil.emailConfig = this.emailconfifList;
        // this.sitedeatil.emailConfig.contact = this.emailconfifList
        // this.sitedeatil.emailConfig = site.emailConfig;
        this.sitedeatil.address = site.address;
        const formData = new FormData();
        this.sitedeatil.siteDetails.isDAVEnabled;
        if (this.sitedeatil.siteDetails.isDAVEnabled === false) {
          this.sitedeatil.siteDetails.logoToAppearFlag = false;
          this.sitedeatil.clientLogo = [];
        }
        formData.append('SiteEntry', JSON.stringify(this.sitedeatil));
        if (this.sitedeatil.clientLogo.length > 0) {
          for (let i = 0; i < this.sitedeatil.clientLogo.length; i++) {
            formData.append('SiteDocFile', this.sitedeatil.clientLogo[i].document);
          }
        }
        this.master.AddSite(formData).subscribe(res => {
          if (res) {
            if (this.editFlag) {
              this.showTopCenter('success', 'success Message', 'Updated Successfully');
              this.auth.clientId = 0;
            } else {
              this.showTopCenter('success', 'success Message', 'Saved Successfully');
              this.auth.clientId = 0;
            }
            this.siteFormGroup.reset();
            this.getSiteList();
          }
        });
      } else {
        this.errormsg = 'Please add atleast one Site-Email Id';
      }
    } else {
      // this.pathParameters = [this.common.SHOW, this.routePath];
      // this.common.FlagEvent(this.pathParameters);
    }
  }
  showNotification() {
    const message = this.editFlag ? ' Updated' : ' Saved';
    this.saharedService.emitChange({
      severity: 'success',
      summary: 'Success Message',
      detail: '' + message + ' Successfully'
      // detail: 'Site No ' + '"' + this.sitedeatil.siteDetails.siteNo + '"' + message + ' Successfully'
    });
  }
  checkValidValue() {
    if (this.siteFormGroup.get('siteDetails.siteNo')?.valid) {
      const value = new SiteNumber();
      value.clientId = this.siteFormGroup.get('siteDetails.clientId')?.value;
      value.siteId = this.siteFormGroup.get('siteDetails.siteId')?.value;
      value.siteNo = this.siteFormGroup.get('siteDetails.siteNo')?.value;
      this.master.CheckClientSiteNo(value).subscribe(res => {
        if (res) {
          this.siteFormGroup.get('siteDetails.siteNo')?.setErrors({ incorrect: true });
        } else {
          this.siteFormGroup.get('siteDetails.siteNo')?.setErrors(null);
        }
      });
    }
  }
  getSiteList() {
    this.auth.clientId = 0;
    this.route.navigate(['/dashboard/client/sitelist']);
  }
  filterEmailConfigNames(type, id) {
    let emailcategory;
    switch (type) {
      case 'categoryLookupId':
        emailcategory = this.emailcategory.find(f => f.lookUpId === id);
        break;
      case 'destLookupId':
        emailcategory = this.emaildest.find(f => f.lookUpId === id);
        break;
      case 'sendTypeLookupId':
        emailcategory = this.sendtype.find(f => f.lookUpId === id);
        break;
      case 'reportLookupId':
        if (this.reporttype) {
          emailcategory = this.commonRepertType.find(f => f.lookUpId === id);
        }
        break;
      default: return 'N/A';
      // break;
    }
    return emailcategory ? emailcategory.lookUpName : 'N/A';
  }
  editDelete(data, mode: string) {
    this.index = this.emailconfifList.indexOf(data);
    if (mode === 'Delete') {
      if (this.index > -1) {
        this.emailconfifList.splice(this.index, 1);
        this.index = -1;
      }
    } else if (mode === 'Edit') {
      this.tooltipName = 'Update';
      this.siteFormGroup.get('emailConfig')?.patchValue({
        siteNotifyId: data.siteNotifyId,
        categoryLookupId: data.categoryLookupId,
        sendTypeLookupId: data.sendTypeLookupId,
        reportLookupId: data.reportLookupId,
        sendFlag: data.sendFlag,
        checkDuplicateFlag: data.checkDuplicateFlag,
      });
      this.updateCatValue = data.categoryLookupId;
      this.tempEmialdata = this.common.CloneObject(data.commonEmailDet);
      this.emailData.next(this.common.CloneObject(data.commonEmailDet));
      // setTimeout(() => {
      this.categoryType();
      // }, 0);
    }
  }
  adduserApplicationfrm() {
    this.addFlag = true;
    const emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormGroup;
    this.validateControl();
    if (emailConfig.valid) {
      for (let i = 0; i < this.emailconfifList.length; i++) {
        if (this.index > -1) {
          if (i !== this.index) {
            if ((this.emailconfifList[i].categoryLookupId === emailConfig.value.categoryLookupId)
              && (this.emailconfifList[i].sendTypeLookupId === emailConfig.value.sendTypeLookupId)
              && (this.emailconfifList[i].reportLookupId === emailConfig.value.reportLookupId)) {
              this.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
              return this.addFlag = false;
            }
          }
        } else {
          if ((this.emailconfifList[i].categoryLookupId === emailConfig.value.categoryLookupId)
            && (this.emailconfifList[i].sendTypeLookupId === emailConfig.value.sendTypeLookupId)
            && (this.emailconfifList[i].reportLookupId === emailConfig.value.reportLookupId)) {
            this.showTopCenter('warn', 'Failure Message', 'Email List has been already exist');
            return this.addFlag = false;
          }
        }
      }
      if (this.addFlag === true) {
        const list: any[] = [];
        emailConfig.value.commonEmailDet.forEach(ele1 => {
          const value = this.emaildest.find(x => x.lookUpId === ele1.destLookupId);
          list.push(value.lookUpName);
        });
        if (list.includes(this.common.DEST_TYPE_TO)) {
          if (this.index > -1) {
            this.emailconfifList[this.index] = this.common.CloneObject(emailConfig.value);
            this.showTopCenter('success', 'Success Message', 'Updated Successfully');
            setTimeout(() => {
              this.resetEmailConfig();
              // this.siteFormGroup.get('emailConfig.commonEmailDet.lookupId')?.setValue(this.emailLookUp);
            }, 0);
            this.tooltipName = 'Add';
          } else {
            this.emailconfifList.push(emailConfig.value);
            this.showTopCenter('success', 'Success Message', 'Saved Successfully');
            setTimeout(() => {
              this.resetEmailConfig();
              // this.siteFormGroup.get('emailConfig.commonEmailDet.lookupId')?.setValue(this.emailLookUp);
            }, 0);
          }
          this.emailData.next([]);
        } else {
          this.showTopCenter('warn', 'Failure Message', 'Please select atleast one Email Type To');
        }
      }
    } else {
      emailConfig.markAllAsTouched();
    }
    this.dt?.reset();
  }
  showTopCenter(level: string, info: string, message: string) {
    this.messageService.add({ severity: level, summary: info, detail: message });
  }
  validateEmailControl() {
    const controlNames = ['categoryLookupId', 'reportLookupId', 'emailAddress'];
    const frmgroup = this.siteFormGroup.get('emailConfig.commonEmailDet') as UntypedFormArray;

  }
  validateControl() {
    const frmgroup = this.siteFormGroup.get('emailConfig') as UntypedFormGroup;
    let controlNames;
    let controlClear: any[] = [];
    if (this.siteFormGroup.get('emailConfig.categoryLookupId')?.value) {
      if (this.categoryName === this.common.INSUF_NOTIFICATION) {
        controlClear = [];
        controlNames = ['sendTypeLookupId', 'reportLookupId', 'emailAddress'];
      } else if (this.categoryName === this.common.DIR_APP_COMP_NOTIFICATION) {
        controlClear = ['sendTypeLookupId', 'reportLookupId'];
        controlNames = ['emailAddress'];
      } else if (this.categoryName === this.common.FINAL_REPORT) {
        controlClear = ['sendTypeLookupId'];
        controlNames = ['reportLookupId', 'emailAddress'];
      } else {
        controlClear = ['sendTypeLookupId', 'reportLookupId'];
        controlNames = ['emailAddress'];
      }
    } else {
      controlNames = ['categoryLookupId'];
    }
    for (const ctrl in frmgroup.controls) {
      if (frmgroup.controls.hasOwnProperty(ctrl)) {
        if (controlNames.indexOf(ctrl) > -1) {
          if (ctrl === 'emailAddress') {
            frmgroup.get(ctrl).setValidators(Validators.compose(
              [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
            frmgroup.get(ctrl).updateValueAndValidity();
          }
          if (frmgroup.get(ctrl).valid) {
            frmgroup.get(ctrl).markAsTouched();
            frmgroup.get(ctrl).setValidators(Validators.required);
            frmgroup.get(ctrl).updateValueAndValidity();
          }
        }
      }
    }
    for (const ctrl in frmgroup.controls) {
      if (frmgroup.controls.hasOwnProperty(ctrl)) {
        if (controlClear.indexOf(ctrl) > -1) {
          frmgroup.get(ctrl).clearValidators();
          frmgroup.get(ctrl).updateValueAndValidity();
        }
      }
    }
  }
  resetEmailConfig() {
    let control: AbstractControl = null;
    const emailConfig = this.siteFormGroup.get('emailConfig') as UntypedFormGroup;
    emailConfig.reset();
    this.emailData.next([]);
    // emailConfig.clearValidators();
    // emailConfig.markAsPristine();
    // emailConfig.markAsUntouched();
    // emailConfig.updateValueAndValidity();
    Object.keys(emailConfig.controls).forEach((name) => {
      control = emailConfig.controls[name];
      control.setErrors(null);
    });
    this.index = -1;
    emailConfig.patchValue({
      siteNotifyId: 0,
    });
    setTimeout(() => {
      this.categoryType();
    }, 0);
  }
  goToStep(selectedIndex: any) {
    this.step1 = selectedIndex;
    if (this.step1 === 0) {
      this.step1 = 0;
      this.stepperChange(0);
      const add = this.siteFormGroup.value;
      this.address.next(add.address);
    }
    if (this.step1 === 2) {
      this.step1 = 2;
      this.stepperChange(selectedIndex);
    }
    if (this.step1 !== 0 && this.step1 !== 2) {
      if (this.step1 === 1) {
        if (this.siteFormGroup.controls.siteDetails.valid && this.siteFormGroup.controls.address.valid) {
          this.stepperChange(selectedIndex);
        } else {
          this.siteFormGroup.controls.siteDetails.markAllAsTouched();
          this.siteFormGroup.controls.address.markAllAsTouched();
          this.step1 = 0;
          this.scroll.scrollToError();
        }
      }
    }
  }

  stepperChange(index: number) {
    const data = document.getElementsByClassName('list');
    if (data.length > 0) {
      data[index].classList.add('active');
      data[index].classList.add('completed');
      for (let i = 0; i < data.length; i++) {
        if (index === i) {
          data[i].classList.add('active');
        } else {
          data[i].classList.remove('active');

        }
      }
    }
  }


  add(event: MatChipInputEvent): void {
    const control = this.siteFormGroup.get('emailConfig.emailAddress');
    if (control.valid) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.emailIds.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    } else {
      control.setValidators(Validators.compose(
        [Validators.pattern(this.common.EmailRegX), Validators.minLength(1), Validators.required]));
      control.updateValueAndValidity();
      control.setErrors({ incorrect: true });
      control.markAsTouched();
    }
  }

  remove(fruit: any): void {
    const index = this.emailIds?.indexOf(fruit);

    if (index >= 0) {
      this.emailIds.splice(index, 1);
    }
  };
  getEmailAdd(data: any): string {
    const email: any[] = [];
    if (data) {
      data.map(m => email.push(m.contactData));
      return email.join(',');
    } else {
      return '';
    }
  }

  public openDialogForDelete(data: any) {
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
            this.removeSiteMail(data);
          }
        }
      });
    }
  }

  removeSiteMail(data: any) {
    this.index = this.emailconfifList.indexOf(data);
    if (this.index > -1) {
      this.emailconfifList.splice(this.index, 1);
      this.showTopCenter('warn', 'Success Message', 'Deleted Successfully');
      this.index = -1;
      this.dt.reset();
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


  getClientAddress(clientid: any) {
    this.agentMasterService.GetClientAddress(clientid).subscribe(resdata => {
      this.bindAddress = resdata[0]
      if (resdata != null) {
        this.clientAddress = true
      }
    })
  }

  changeAddress(data: any) {
    if (data.checked === true) {
      this.siteFormGroup.get('siteDetails.siteAddress')?.setValue(data.checked)
      this.address.next(this.bindAddress)
    }
    else {
      // this.address.reset()
      this.siteFormGroup.get('siteDetails.siteAddress')?.setValue(data.checked)
      this.siteFormGroup.get('address')?.reset()
      this.siteFormGroup.get('address.addressId')?.setValue(0)
      //     this.mainForm.get(this.formgroupName + '.address' + '.addressId').setValue(0);
    }
  }
  uploadLogoDoc(event: any) {
    // tslint:disable-next-line: prefer-for-of
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    for (let i = 0; i < event.target.files.length; i++) {
      const clientLogo: ClientLogoTransVm = {
        logoTransId: 0,
        logoDocTransId: 0,
        fileName: event.target.files[i].name,
        filePath: '',
        document: event.target.files[i],
        active: true,
        loggedIn: this.userdata.userId
      };
      const file = clientLogo.fileName;
      if (!this.sitedeatil.clientLogo) {
        this.sitedeatil.clientLogo = [];
      }

      if (this.sitedeatil.clientLogo.length >= 1) {
        this.showTopCenter('error', 'Limit Exceeded', 'Only one logo file is allowed.');
        return;
      }
      if (clientLogo.document.size > MAX_FILE_SIZE_BYTES) {
        this.showTopCenter('error', 'File Too Large', 'File size must not exceed 5 MB.');
        return;
      }
      if (file) {
        const fileName = file;
        const fileExtn = fileName.split('.').pop();

        if (fileExtn === 'png' || fileExtn === 'jpeg' || fileExtn === 'jpg') {
          this.sitedeatil.clientLogo.push(clientLogo);
        }
        else {
          this.showTopCenter('error', 'Failure Message', 'Please upload jpeg,jpg or png file');
        }
      }
    }
  }
  deleteSiteLogo(docId: any) {
    if (docId > 0) {
      this.master.DeleteSiteLogo(docId, this.userdata.userId).subscribe(resp => {
        if (resp) {

        }
      });
    }
  }
  downloadLogoDoc(data: any) {
    if (data.logoTransId > 0) {
      this.master.DownloadSiteDocument(data.logoTransId).subscribe(resp => {
        this.common.downloadDocument(data.logoTransId, resp.document, resp.fileName);
      });
    } else {
      this.common.saveByteArray(data.fileName, data.document);
    }
  }
}
export class ClientLogoTransVm {
  logoTransId: number;
  logoDocTransId: number;
  fileName: string;
  filePath: string;
  document;
  active: boolean;
  loggedIn: number;
}
class siteSendDocList {
  siteDocument: SiteDocument[] = [];
}
export class SiteDocument {
  // docId: number;
  // fileName: string;
  // document: string;
  logoTransId: number;
  logoDocTransId: number;
  fileName: string;
  filePath: string;
  document;
  active: boolean;
}
class SiteLogoDocumentTrans {
  docId: number;
  fileName: string;
  document: string;
}
