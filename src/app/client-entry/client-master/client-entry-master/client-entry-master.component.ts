import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AccessClient, AccessClientlist, ClientFeeApprovalEmail, ClientTatApprovalEmail, Password } from 'src/app/common-methods/models/clientEntryMaster';
import { CommonService } from 'src/app/common-methods/services/common.service';
import { AuthService } from 'src/app/common-methods/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, Form, AbstractControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { BreadcrumbFlags } from 'src/app/common-methods/models/breadcrumb-flags';
import { Table, TableModule } from 'primeng/table';
import { ScrollToErrorDirective } from 'src/app/common-methods/directive/scroll-to-error.directive';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/common-methods/services/client.service';
import { CommonAlertsComponent } from 'src/app/common-methods/common-alerts/common-alerts.component';
import { ClientCreationComponent } from '../client-creation/client-creation.component';
import { ClientMailsComponent } from '../client-mails/client-mails.component';
import { ClientInstructionsComponent } from '../client-instructions/client-instructions.component';
import { ClientComponentsComponent } from '../client-components/client-components.component';
import { map, startWith } from 'rxjs/operators';
import { LazyLoadEvent } from 'primeng/api';
import { MasterService } from 'src/app/common-methods/services/master.service';
import { DatePipe } from '@angular/common';
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { CONTROL } from '@angular/cdk/keycodes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  standalone: false,
  selector: 'app-client-entry-master',
  templateUrl: './client-entry-master.component.html',
  styleUrls: ['./client-entry-master.component.css']
})
export class ClientEntryMasterComponent implements OnInit {
  clientSettingsResponse: any;
  isAdd: boolean;
  itemperpage: any;
  userData: any;
  screenAuth: any = {};
  dialogRef: any;
  breadcrumbFlags = new BreadcrumbFlags();
  clientGridList: any[] = [];
  stepper = 0;
  stepList = [
    { name: 'Client Entry', value: 0, cls: 'icon-note' },
    { name: 'Component Entry', value: 1, cls: 'icon-disc' },
    { name: 'Agreement Details', value: 2, cls: 'icon-news-paper' },
    { name: 'Client Instructions', value: 3, cls: 'icon-support' },
    { name: 'Review', value: 5, cls: 'icon-book-open' },
  ];
  fieldName = [
    { field: 'action', header: 'Action', value: true, disabled: true },
    { field: 'clientName', header: 'Client Name', value: true, disabled: true },
    { field: 'status', header: 'Status', value: true, disabled: true },
    { field: 'country', header: 'Country', value: true, disabled: true },
    { field: 'state', header: 'State', value: true, disabled: true },
    { field: 'city', header: 'City', value: true },
    { field: 'firstName', header: 'Account Manager', value: true, disabled: true },
    { field: 'active', header: 'Active', value: true },
  ];
  frozenCols = [
    { field: 'action', header: 'Action' },
  ];
  totalpages: number;
  currentPage = 1;
  tempCurrentPage = 1;
  event: LazyLoadEvent;
  loading: boolean;
  accessClientlist = new AccessClientlist();
  private skipFirstLazyLoad = false;
  @ViewChild('global')
  global!: ElementRef;

  @ViewChild('tableData')
  tableData!: Table;

  @ViewChild('actionTrigger')
  actionTrigger!: MatMenuTrigger;

  @ViewChild('passwordHistoryDetails')
  passwordHistoryDetails!: TemplateRef<any>;
  clientRptPasswordDetails: any;
  agentNameListControl = new UntypedFormControl();
  agentNameListFilteredOptions: Observable<string[]>;
  countryListControl = new UntypedFormControl();
  countryListFilteredOptions: Observable<string[]>;
  stateListListControl = new UntypedFormControl();
  stateListListFilteredOptions: Observable<string[]>;
  cityListListControl = new UntypedFormControl();
  cityListListFilteredOptions: Observable<string[]>;
  dssiOwnerListControl = new UntypedFormControl();
  dssiOwnerListFilteredOptions: Observable<string[]>;
  displayedColumns: any[];
  clientEntryForm: UntypedFormGroup;
  clientBindData: any;
  componentBindData: any;
  address = new BehaviorSubject(null);
  clientSettings: any;
  agreementBindData: any;
  instructionBindData: any;
  mailBindData: any;
  // @ViewChild('global') global!: ElementRef;

  // @ViewChild('tableData') tableData!: Table;

  // @ViewChild('actionTrigger') actionTrigger!: MatMenuTrigger;

  // @ViewChild('passwordHistoryDetails') passwordHistoryDetails!: TemplateRef<any>;
  @ViewChild('clientScreen', { static: true }) clientScreen!: ClientCreationComponent;
  @ViewChild('componentScreen', { static: true }) componentScreen!: ClientComponentsComponent;
  @ViewChild('instructionScreen', { static: true }) instructionScreen!: ClientInstructionsComponent;
  @ViewChild('mailScreen', { static: true }) mailScreen!: ClientMailsComponent;

  componentForm: UntypedFormGroup;
  subComponentForm: UntypedFormGroup;
  clientTATDocumentForm: UntypedFormGroup;
  clientTATApprovalForm: UntypedFormGroup;
  clientFeeDocumentForm: UntypedFormGroup;
  clientFeesApprovalForm: UntypedFormGroup;
  currencyList: any;
  paswordFormGrp: UntypedFormGroup
  sendCrtFlag = new UntypedFormControl();
  @ViewChild('PDFPasswordDialog', { static: true })
  PDFPasswordDialog!: TemplateRef<any>;

  passwordData: any;
  passwords = new Password();

  hide = false;
  hide1 = false;
  hide2 = false;
  hide3 = false;
  pwdFlag = false;

  clientNameFormCtrl = new UntypedFormControl();
  clientNameFilteredOptions!: Observable<string[]>;
  @ViewChild('clientNameTrigger')
  clientNameTrigger!: MatMenuTrigger;

  statusFormCtrl = new UntypedFormControl();
  statusFilteredOptions!: Observable<string[]>;
  @ViewChild('statusTrigger')
  statusTrigger!: MatMenuTrigger;

  countryFormCtrl = new UntypedFormControl();
  countryFilteredOptions!: Observable<string[]>;
  @ViewChild('countryTrigger')
  countryTrigger!: MatMenuTrigger;

  stateFormCtrl = new UntypedFormControl();
  stateFilteredOptions!: Observable<string[]>;
  @ViewChild('stateTrigger')
  stateTrigger!: MatMenuTrigger;

  cityFormCtrl = new UntypedFormControl();
  cityFilteredOptions!: Observable<string[]>;
  @ViewChild('cityTrigger')
  cityTrigger!: MatMenuTrigger;

  firstNameFormCtrl = new UntypedFormControl();
  firstNameFilteredOptions!: Observable<string[]>;
  @ViewChild('firstNameTrigger')
  firstNameTrigger!: MatMenuTrigger;
  type = '';
  insuffClient: any;
  clientId: number = 0;
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  isChecked3: boolean = false;
  isChecked4: boolean = false;
  toggleLabel: string = 'OFF';
  toggleLabe2: string = 'OFF';
  toggleLabe3: string = 'OFF';
  toggleLabe4: string = 'OFF';
  myFormControl = new UntypedFormControl({ value: '', disabled: true })
  dialogref: MatDialogRef<unknown, any>;
  firstPart: any;
  secondPart: string;
  safeHtml: SafeHtml;
  finalToggFlag: boolean = false;
  intermToggFlag: boolean = false;
  induvidualToggFlag: boolean = false;
  supplementToggFlag: boolean = false;
  splitParts: string[] = [];
  index1: boolean = false;
  index2: boolean = false;
  index3: boolean = false;
  index4: boolean = false;

  constructor(private commonService: CommonService, public dialog: MatDialog, public datepipe: DatePipe, public clientService: ClientService, public masterSerice: MasterService,
    // tslint:disable-next-line: align
    private router: Router, private authService: AuthService, public scrollToError: ScrollToErrorDirective, private fb: UntypedFormBuilder, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.getItem('user_data') as string);
    this.breadcrumbFlags = this.commonService.breadcrumbFlags(true);
    this.screenAuth = this.authService.getScreenAuth(this.router.url);
    this.initFormGroup();
    this.getLookUp()
    this.displayedColumns = this.fieldName.filter(e => e.disabled);
    this.itemperpage = 10;
    // this.clienttSettings();
    this.accessClientlist.loggedIn = this.userData.userId;
    this.accessClientlist.clientId = this.userData.clientId;
    this.accessClientlist.page = 1;
    this.accessClientlist.pageSize = 10;
    this.accessClientlist.applyPaging = true;
    this.accessClientlist.needTotal = true;
    this.skipFirstLazyLoad = true;
    this.getClientDetails();
  }
  initFormGroup() {
    this.paswordFormGrp = this.fb.group({
      passwordCtrl: new UntypedFormControl('', Validators.required),
      finalPassword: new UntypedFormControl('', Validators.required),
      interimPassword: new UntypedFormControl('', Validators.required),
      individualPassword: new UntypedFormControl('', Validators.required),
      supplementaryPassword: new UntypedFormControl('', Validators.required),
    });
  }
  private TblAutoFilters(): void {
    this.clientNameFilteredOptions = this.clientNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.clientName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.statusFilteredOptions = this.statusFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.status).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.countryFilteredOptions = this.countryFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.country).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.stateFilteredOptions = this.stateFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.state).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));

    this.cityFilteredOptions = this.cityFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.city).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
    this.firstNameFilteredOptions = this.firstNameFormCtrl.valueChanges.pipe(startWith(''),
      map(value =>
        (Array.from(new Set(this.clientGridList.map(x => x.firstName).filter(x => x))).sort())
          .filter(x => x).sort().filter(option => option.toLowerCase().includes(value))));
  }
  toggleColumn(field: any): void {
    field.value = !field.value;
    this.displayedColumns = this.fieldName.filter(f => f.value || f.disabled);
  }

  LoadHistory(event: LazyLoadEvent) {
    this.loading = true;
    this.event = event;
    this.accessClientlist.filters = event.globalFilter ? 'ClientName@=' + event.globalFilter : '';
    this.accessClientlist.page = (event.first + event.rows) / 10;
    this.accessClientlist.pageSize = 10;
    this.accessClientlist.applyPaging = true;
    this.accessClientlist.needTotal = true;
    this.accessClientlist.loggedIn = this.userData.userId;
    this.accessClientlist.clientId = this.userData.clientId;
    if (this.skipFirstLazyLoad && this.accessClientlist.page === 1 && !event.sortField && Object.keys(event.filters || {}).length === 0) {
      this.skipFirstLazyLoad = false;
      return;
    }
    this.getClientDetails();
  }
  getClientDetails() {
    // const accessClient: AccessClient = {
    //   loggedIn: this.userData.userId,
    //   clientId: this.userData.clientId
    // };
    this.clientService.getClientDetails(this.accessClientlist).subscribe(res => {
      if (res) {
        this.clientGridList = res.body;
        this.totalpages = res.headers.get('X-Total-Count');
        this.loading = false;
        this.clientGridList.forEach(element => {
          element.firstName = element.firstName ? (element.firstName + (element.middleName ? (' ' + element.middleName) : '') +
            (element.lastName ? (' ' + element.lastName) : '')) : 'N/A';
        });
        this.currentPage = 1;
        this.TblAutoFilters();
      }
    });
    this.getClientMasterDetails();
  }
  getClientMasterDetails() {
    this.clientService.getClientMasterDetails(this.userData.teamId, this.userData.subTeamId).subscribe(res => {
      if (res) {
        this.clientBindData = res;
        this.clientBindData.accountManager.forEach(element => {
          element.firstName = element.lastName ? (element.firstName + ' ' + element.lastName) : element.firstName;
        });
      }
    });
  }
  goToStepAndSave(selectedIndex, method) {
    this.scrollToError.scrollToError();
    if (selectedIndex === 0) {
      this.address.next(this.clientEntryForm.get('clientEntry')?.value.address);
      this[method](selectedIndex);
    } else if (selectedIndex === 1 && this.clientEntryForm.get('clientEntry')?.valid) {
      this[method](selectedIndex);
    } else if (selectedIndex === 2 && this.clientEntryForm.get('clientEntry')?.valid &&
      this.clientEntryForm.get('componentEntry')?.value.length > 0) {
      this[method](selectedIndex);
    } else if (selectedIndex === 3 && this.clientEntryForm.get('clientEntry')?.valid &&
      this.clientEntryForm.get('componentEntry')?.value.length > 0 && this.clientEntryForm.get('clientAgreement')?.valid) {
      this[method](selectedIndex);
    } else if (selectedIndex === 4 && this.clientEntryForm.get('clientEntry')?.valid &&
      this.clientEntryForm.get('componentEntry')?.value.length > 0 && this.clientEntryForm.get('clientAgreement')?.valid) {
      this[method](selectedIndex);
    } else if (selectedIndex === 5 && ((this.clientEntryForm.get('clientEntry.siteCreationFlag')?.value !== true &&
      this.clientEntryForm.get('clientEntry')?.valid && this.clientEntryForm.get('componentEntry')?.value.length > 0 &&
      this.clientEntryForm.get('clientAgreement')?.valid && this.clientEntryForm.get('clientEmailConfig')?.value.length > 0)
      || (this.clientEntryForm.get('clientEntry.siteCreationFlag')?.value === true && this.clientEntryForm.get('clientEntry')?.valid
        && this.clientEntryForm.get('componentEntry')?.value.length > 0 && this.clientEntryForm.get('clientAgreement')?.valid))) {
      this[method](selectedIndex);
    } else {
      if (this.stepper === 0) {
        this.clientEntryForm.get('clientEntry')?.markAllAsTouched();
      } else if (this.stepper === 1) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Add atleast one record');
      } else if (this.stepper === 2) {
        this.clientEntryForm.get('clientAgreement')?.markAllAsTouched();
      } else if (this.stepper === 4) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Add atleast one record');
      } else if (this.stepper === 5) {
        this[method](selectedIndex);
      }
    }
  }
  stepperChange(index: number) {
    this.stepper = index;
    const data = document.getElementsByClassName('list');
    const ind = data.length === index ? (index - 1) : index;
    if (data.length > 0) {
      data[ind].classList.add('active');
      data[ind].classList.add('completed');
      for (let i = 0; i < data.length; i++) {
        if (ind === i) {
          data[i].classList.add('active');
        } else {
          data[i].classList.remove('active');
        }
      }
    }
  }
  addClientForm(completeFlag, id) {
    this.clientId = id;
    this.isAdd = completeFlag;
    this.initClientEntryFormGroup();
    this.type = '';
    this.stepper = 0;
    this.breadcrumbFlags.btnSaveDisabled = false;
    this.breadcrumbFlags.toolTip = completeFlag === true ? 'Update' : 'Save';
    this.address = new BehaviorSubject(null);
    this.breadcrumbFlags = this.commonService.breadcrumbFlags();
    this.getComponentDetails();
    this.getAgreementDetails();
    this.getClientInstructionDetails();
    this.GetClientAndSiteLookup();
    setTimeout(() => {
      this.stepperChange(0);
    }, 10);
    this.initClientEntryFormGroup();
    // this.clientEntryForm.controls.clientEntry.get('clientName')?.enable();
  }
  getComponentDetails() {
    this.clientService.getComponentDetails().subscribe(res => {
      this.componentBindData = res;
    });
    this.clientService.getCurrencyDetails().subscribe(res => {
      if (res) {
        this.currencyList = res;
        this.currencyList.forEach(element => {
          element.currencyShortName = element.countryName + ' - ' + element.currencyShortName;
        });
      }
    });
  }
  getAgreementDetails() {
    this.clientService.getAgreementDetails().subscribe(res => {
      this.agreementBindData = res;
    });
  }
  getClientInstructionDetails() {
    this.clientService.getClientInstructionDetails().subscribe(res => {
      this.instructionBindData = res;
    });
  }
  GetClientAndSiteLookup() {
    this.clientService.GetClientAndSiteLookup().subscribe(res => {
      this.mailBindData = res;
    });
  }
  initClientEntryFormGroup() {
    this.clientEntryForm = this.fb.group({
      loggedIn: new UntypedFormControl(this.userData.userId),
      clientEntry: this.initClientForm(),
      componentEntry: [[]],
      clientAgreement: this.initAgreementForm(),
      clientAgreementDocument: [[]],
      clientInstruction: [[]],
      clientEmailConfig: [[]],
      clientFeeDocument: [[]],
      clientFeeApprovalEmail: [[]],
      clientFeePreApprovalEmail: [[]],
      clientTATDocument: [[]],
      clientTATApprovalEmail: [[]],
      clientTATPreApprovalEmail: [[]],
      reviewFlag: new UntypedFormControl(),
      insufficiencyWorkFlowMappingVm: [[]]
    });
  }
  validatePanInput(c: UntypedFormControl) {
    const panREGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const value = c.value ? c.value.toUpperCase() : c.value;
    if (value) {
      return (panREGEX.test(value)) ? null : {
        validateInput: {
          valid: false
        }
      };
    }
  }
  ClientCustomLoaForm() {
    return new UntypedFormGroup({
      clientId: new UntypedFormControl(0),
      clientName: new UntypedFormControl(null),
      hasCustomLoa: new UntypedFormControl(false),
      docTypeLookupId: new UntypedFormControl(null),
      docTypeLookupName: new UntypedFormControl(null),
      fileName: new UntypedFormControl(null),
      createdUserId: new UntypedFormControl(this.userData.userId),
      customLoaDocument: this.CustomLoaDocumentForm()
    })
  }
  CustomLoaDocumentForm() {
    type NullableInteger = number | null;
    return new UntypedFormGroup({
      ClientLoaId: new UntypedFormControl(0),
      customLoaDocId: new UntypedFormControl(0),
      // documentTypeId: new UntypedFormControl(null as NullableInteger, [this.nullOrIntegerValidator()]),
      documentTypeId: new UntypedFormControl(null as NullableInteger),
      document: new UntypedFormControl(null),
      fileName: new UntypedFormControl(null),
      filePath: new UntypedFormControl(null),
      fileType: new UntypedFormControl(null),
    })

  }


  initClientForm() {
    return this.fb.group({
      finalReportTitle: new UntypedFormControl(null),
      ClientCustomLoa: this.ClientCustomLoaForm(),
      clientId: new UntypedFormControl(0),
      clientName: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
      address: this.initAddressForm(),
      active: new UntypedFormControl(true),
      contactPerson: new UntypedFormControl(null, Validators.required),
      companyId: new UntypedFormControl(null, Validators.required),
      salesPerson: new UntypedFormControl(null, Validators.required),
      refNo: new UntypedFormControl(null, Validators.required),
      previousRefNo: new UntypedFormControl(null, Validators.minLength(5)),
      previousDirectRefNo: new UntypedFormControl(null, Validators.minLength(5)),
      ruleId: new UntypedFormControl(null, Validators.required),
      invoiceTitleLookupId: new UntypedFormControl(0),
      enableLutFlag: new UntypedFormControl(null),
      bcId: new UntypedFormControl(null, Validators.required),
      pan: new UntypedFormControl(null, this.validatePanInput),
      serviceTaxNo: new UntypedFormControl(null, Validators.minLength(15)),
      clientScreeningIdFlag: new UntypedFormControl(),
      billingTypeId: new UntypedFormControl(null, Validators.required),
      billingTypeLookupDesc: new UntypedFormControl(null),
      cgstin: new UntypedFormControl(''),
      clientStatus: new UntypedFormControl(),
      tatCount: new UntypedFormControl(null, [Validators.required, Validators.max(30)]),
      ceHoldTAT: new UntypedFormControl(null, Validators.max(20)),
      serviceTaxFlag: new UntypedFormControl(),
      cancelDetails: new UntypedFormControl(),
      dataRetentionPolicyDays: new UntypedFormControl(null, [Validators.required, Validators.min(90)]),
      applicantIdColumnName: new UntypedFormControl(null, [Validators.required, Validators.minLength(3)]),
      finalReportTypeId: new UntypedFormControl(null, Validators.required),
      annexureLinkFlag: new UntypedFormControl(),
      clientAccountManagerId: new UntypedFormControl(null, Validators.required),
      caseCreationFlag: new UntypedFormControl(),
      clientContact: this.initContactForm(0, 5),
      ownerContact: this.initContactForm(5, 8),
      clientColorStatus: new UntypedFormControl([], Validators.required),
      insufficiencyTypeId: new UntypedFormControl(),
      compId: new UntypedFormControl(),
      insuffComponent: [[]],
      subcompId: new UntypedFormControl(),
      WorkFlowLookUpId: new UntypedFormControl(),
      //insufficiency : this.initInsuffForm(0, 5),
      clientLogo: [[]],
      clientSettings: this.initClientSettingsForm(),
      optionToCreateInvitation: new UntypedFormControl(),
      refNoManuallyFlag: new UntypedFormControl(false),
      displaySiteNameFlag: new UntypedFormControl(),
      indianClientFlag: new UntypedFormControl(true),
      siteCreationFlag: new UntypedFormControl(true),
      chargeCodeFlag: new UntypedFormControl(),
      completeFlag: new UntypedFormControl(),
      paymentFlag: new UntypedFormControl(),
      approvalLimitFlag: new UntypedFormControl(),
      formatFlag: new UntypedFormControl(),
      caseByPassFlag: new UntypedFormControl(),
      scopeByPassFlag: new UntypedFormControl(),
      iqcByPassFlag: new UntypedFormControl(),
      reOpenTATFlag: new UntypedFormControl(),
      forResearchByPassFlag: new UntypedFormControl(),
      caseDatesFlag: new UntypedFormControl(),
      calendarDaysTATFlag: new UntypedFormControl(),
      contactRemarkFlag: new UntypedFormControl(),
      caseCountryFlag: new UntypedFormControl(false),
      caseTypeFlag: new UntypedFormControl(false),
      codeId: new UntypedFormControl({ value: 0, disabled: true }),
      client: new UntypedFormControl(),
      clientNotificationFlag: new UntypedFormControl(),
      clientUpdateFlag: new UntypedFormControl(),
      downloadBGVFlag: new UntypedFormControl(),
      downloadDocumentFlag: new UntypedFormControl(),
      defaultFlag: new UntypedFormControl(),
      manualGenerationFlag: new UntypedFormControl(),
      daValidationFlag: new UntypedFormControl(),
      // Added By Megala - For VTS2-2024-CRT-0217
      pdfHyperLinkFlag: new UntypedFormControl(),
      interimReportFlag: new UntypedFormControl(),
      // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen 
      enableAutoIqc: new UntypedFormControl(),
      enableAutoFqc: new UntypedFormControl(),
      ctsFlag: new UntypedFormControl(),
      directAppAddressFlag: new UntypedFormControl(),
      pdfReportNameChangeFlag: new UntypedFormControl(),
      deReopenFlag: new UntypedFormControl(),
      tATCrossInsuffAutomationFlag: new UntypedFormControl(),
      removeEducationCategoryFlag: new UntypedFormControl(),
      removeInstitutionTypeFlag: new UntypedFormControl(),
      cinFlag: new UntypedFormControl(),
      rocCodeFlag: new UntypedFormControl(),
      incoporateDateFlag: new UntypedFormControl(),
      ssnFlag: new UntypedFormControl(),
      removeContactDetailsFlag: new UntypedFormControl(),
      onlineVerificationJcrflag: new UntypedFormControl(),
      enbMultiJcrFlag: new UntypedFormControl(),
      showClientSuspectFlag: new UntypedFormControl(),
      iQCApprovedDateInFLTFlag: new UntypedFormControl(),
      // duplicates
      docType: new UntypedFormControl(),
      signatureLookUpId: new UntypedFormControl(0),
      supportingDocument: []
    });
  }
  initClientSettingsForm(): UntypedFormArray {
    let array = this.fb.array([]);
    this.commonService.historyClientId = this.clientId;
    this.clientService.getClientSetting(this.clientId).subscribe(resp => {
      this.clientSettingsResponse = resp;
      if (resp) {
        resp.forEach((client, index) => {
          array.push(new UntypedFormGroup({
            clientId: new UntypedFormControl(client.clientId),
            clientSettingId: new UntypedFormControl(client.clientSettingId),
            configLookupId: new UntypedFormControl(client.configLookupId),
            isActive: new UntypedFormControl(client.isActive),
            isVisible: new UntypedFormControl(client.configLookupId == 607 ||
              client.configLookupId == 614 || client.configLookupId == 615 ||
              client.configLookupId == 616 || client.configLookupId == 617 ? false : true),
            lookUpName: new UntypedFormControl(client.lookUpName),
          }))
        })
        array = this.createFlagBasedArray(array);

      }
    })
    return array
  }
  // createFlagBasedArray(array): UntypedFormArray {
  //   let cSettings = array;
  //   if (cSettings.at(this.findIndex(613)).get('isActive')?.value == true) { // direct app invitation if checked or unchecked
  //     cSettings.at(this.findIndex(614)).get('isVisible')?.setValue(true); // DA
  //     cSettings.at(this.findIndex(615)).get('isVisible')?.setValue(true); // invitation
  //     cSettings.at(this.findIndex(616)).get('isVisible')?.setValue(true); //bgv
  //     cSettings.at(this.findIndex(617)).get('isVisible')?.setValue(true); // doc
  //   }
  //   if (cSettings.at(this.findIndex(606)).get('isActive')?.value == true) { //case
  //     cSettings.at(this.findIndex(607)).get('isVisible')?.setValue(true); //screening
  //     // if (cSettings.at(this.findIndex(608)).get('isActive')?.value == true) { //scope
  //     cSettings.at(this.findIndex(608)).get('isActive')?.setValue(false) // scope
  //     // }
  //   }
  //   if (cSettings.at(this.findIndex(608)).get('isActive')?.value == true) { // scope
  //     // if (cSettings.at(this.findIndex(606)).get('isActive')?.value == true) { // case
  //     cSettings.at(this.findIndex(606)).get('isActive')?.setValue(false) //case
  //     cSettings.at(this.findIndex(607)).get('isVisible')?.setValue(false)//screening
  //     // }
  //   }
  //   return array
  // }

  // Safe helper: returns the AbstractControl or null
  private getSetting(array: UntypedFormArray, id: number): AbstractControl | null {
    const index = this.findIndex(id);
    if (index === -1 || index >= array.length) {
      console.warn(`Setting with id ${id} not found in UntypedFormArray`);
      return null;
    }
    return array.at(index) ?? null;
  }

  createFlagBasedArray(array: UntypedFormArray): UntypedFormArray {
    const cSettings = array;

    // Direct app invitation (613)
    if (this.getSetting(cSettings, 613)?.get('isActive')?.value === true) {
      this.getSetting(cSettings, 614)?.get('isVisible')?.setValue(true); // DA
      this.getSetting(cSettings, 615)?.get('isVisible')?.setValue(true); // invitation
      this.getSetting(cSettings, 616)?.get('isVisible')?.setValue(true); // bgv
      this.getSetting(cSettings, 617)?.get('isVisible')?.setValue(true); // doc
    }

    // Case (606)
    if (this.getSetting(cSettings, 606)?.get('isActive')?.value === true) {
      this.getSetting(cSettings, 607)?.get('isVisible')?.setValue(true); // screening
      this.getSetting(cSettings, 608)?.get('isActive')?.setValue(false); // scope
    }

    // Scope (608)
    if (this.getSetting(cSettings, 608)?.get('isActive')?.value === true) {
      this.getSetting(cSettings, 606)?.get('isActive')?.setValue(false); // case
      this.getSetting(cSettings, 607)?.get('isVisible')?.setValue(false); // screening
    }

    return array;
  }


  findIndex(lookupid): number {
    let array = this.clientEntryForm.get('clientEntry.clientSettings') as UntypedFormArray;
    let index = array.value.findIndex(val => val.configLookupId == lookupid)
    return index;
  }

  initAddressForm() {
    return new UntypedFormGroup({
      addressId: new UntypedFormControl(0),
      addLine1: new UntypedFormControl('', Validators.required),
      addLine2: new UntypedFormControl(''),
      addLine3: new UntypedFormControl(''),
      cityId: new UntypedFormControl(''),
      districtId: new UntypedFormControl(),
      stateId: new UntypedFormControl('', Validators.required),
      countryId: new UntypedFormControl('', Validators.required),
      postalCode: new UntypedFormControl('', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])),
      locationId: new UntypedFormControl(),
      country: new UntypedFormControl(),
      state: new UntypedFormControl(),
      place: new UntypedFormControl(),
      district: new UntypedFormControl(),
      city: new UntypedFormControl()
    });
  }
  // initInsuffForm() {
  //   return new UntypedFormGroup({
  //     insufficiencyTypeId: new UntypedFormControl(),
  //     compId: new UntypedFormControl()
  //   });
  // }

  // initInsuffForm(init, length): UntypedFormArray {
  //   const array = this.fb.array([]);
  //   for (let i = init; i < length; i++) {
  //     array.push(new UntypedFormGroup({
  //       insufficiencyTypeId: new UntypedFormControl(0),
  //       compId: new UntypedFormControl(),
  //      }));
  //    }
  //   return array;
  // }
  //Cancelruleinit
  getLookUp() {
    this.masterSerice.getCancelRuleLookup().subscribe(resp => {
      if (resp) {
        this.commonService.fromConditionList = resp.fromCondition.filter(s => s.lookUpName != "!=" && s.lookUpName != ">=");
        this.commonService.toConditionList = resp.toCondition.filter(s => s.lookUpName != "!=" && s.lookUpName != "==");;
      }
    });
  }

  initContactForm(init, length): UntypedFormArray {
    const array = this.fb.array([]);
    for (let i = init; i < length; i++) {
      array.push(new UntypedFormGroup({
        lookUpCatId: new UntypedFormControl(0),
        lookUpId: new UntypedFormControl(this.getLookUpId(i)),
        lookUpName: new UntypedFormControl(''),
        lookUpValue: new UntypedFormControl('', i === 1 ? (Validators.compose([Validators.minLength(10),
        Validators.pattern(/^[- 0-9]+$/)])) : (i === 0 || i === 7) ? (Validators.compose([Validators.required,
        // Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)])) : (i === 3 || i === 4) ? null
        //       : (Validators.compose([Validators.required, Validators.
        //         pattern(this.commonService.EmailRegX)]))),
        Validators.minLength(10), Validators.pattern(/^[- 0-9]+$/)])) : (i === 3 || i === 4) ? null
          : (Validators.compose([Validators.required, Validators.
            pattern(this.commonService.EmailRegX)]))),
        contactId: new UntypedFormControl(0),
      }));
      // clientContact
      // i = 0  --> Mobile Number
      // i = 1  --> Phone Number
      // i = 2  --> Email Id
      // i = 3  --> Website
      // i = 4  --> Fax
      // ownerContact
      // i = 5  --> TO Email ID
      // i = 6  --> CC Email ID
      // i = 7  --> CAM Mobile Number
    }
    return array;
  }
  getLookUpId(i: any) {
    const name = (i === 0 || i === 7) ? 'mobile' : i === 1 ? 'business phone' : i === 2 ? 'email' : i === 3 ? 'website'
      : i === 4 ? 'fax' : i === 5 ? 'to' : i === 6 ? 'cc' : 'N/A';
    const id = this.clientBindData.clientCreationLookupValues.find(x => x.lookUpName.toLowerCase().includes(name)).lookUpId;
    return id;
    // return i === 0 ? 50 : i === 1 ? 51 : i === 2 ? 53 : i === 3 ? 59
    // : i === 4 ? 446 : i === 5 ? 81 : i === 6 ? 82 : 0;
  }
  initAgreementForm() {
    return this.fb.group({
      agreementAvailabilityFlag: new UntypedFormControl(null, Validators.required),
      approvalStatus: new UntypedFormControl(''),
      typeOfAgreement: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      dateOfAgreement: new UntypedFormControl(),
      validity: new UntypedFormControl(),
      autoRenewal: new UntypedFormControl(),
      dateOfExpiry: new UntypedFormControl(),
      reasonofNonAvailability: new UntypedFormControl(),
      reminder: new UntypedFormControl(),
      autoRenewalPeriod: new UntypedFormControl(),
      agreementApprovalFlag: new UntypedFormControl(false),
      supportingDocument: []
    });
  }
  validationTAT() {
    let flag = true;
    if (this.clientEntryForm.get('componentEntry')?.value.some(x => (Number(x.tat)) > (Number(this.clientEntryForm.get('clientEntry.tatCount')?.value)))) {
      flag = false;
    }
    return flag;
  }
  saveClientForm() {
    if (this.validationTAT()) {
      this.clientEntryForm.value.componentEntry.forEach((element, ix) => {
        const valList = this.commonService.CloneArray(this.clientEntryForm.value.componentEntry);
        let val = valList[ix];
        if (element.isSubComponent === true) {
          val = element.subComponentEntry[0];
        }
        if (val.clientFeesApproval) {
          const fee = new ClientFeeApprovalEmail();
          fee.comments = val.clientFeesApproval.requestorComments;
          fee.componentId = val.clientFeesApproval.componentId;
          fee.subCompId = val.clientFeesApproval.subComponentId;
          fee.msp = val.clientFeesApproval.msp;
          fee.nrp = val.clientFeesApproval.nrp;
          fee.requestedAmount = val.clientFeesApproval.requestedAmount;
          fee.validationType = (val.clientFeesApproval.requestedAmount < val.clientFeesApproval.nrp) ? 'less than MSP and NRP'
            : 'less than MSP';
          if (val.clientFeesApproval.clientFeeDocument.length > 0) {
            this.clientEntryForm.controls.clientFeeDocument.value.push(...val.clientFeesApproval.clientFeeDocument);
            this.clientEntryForm.controls.clientFeePreApprovalEmail.value.push(fee);
          } else {
            this.clientEntryForm.controls.clientFeeApprovalEmail.value.push(fee);
          }
        }
        if (val.clientTATApproval) {
          const tat = new ClientTatApprovalEmail();
          tat.originalTAT = val.clientTATApproval.originalTAT;
          tat.requestedTAT = val.clientTATApproval.requestedTAT;
          tat.comments = val.clientTATApproval.requestorComments;
          tat.componentId = val.clientTATApproval.componentId;
          tat.subCompId = val.clientTATApproval.subComponentId;
          if (val.clientTATApproval.clientTATDocument.length > 0) {
            this.clientEntryForm.controls.clientTATDocument.value.push(...val.clientTATApproval.clientTATDocument);
            this.clientEntryForm.controls.clientTATPreApprovalEmail.value.push(tat);
          } else {
            this.clientEntryForm.controls.clientTATApprovalEmail.value.push(tat);
          }
        }
      });
      this.componentsCheck(true, []);
      const saveClientEntry = this.clientEntryForm.getRawValue();
      saveClientEntry.clientAgreement = saveClientEntry.clientAgreement.agreementAvailabilityFlag === null ?
        null : saveClientEntry.clientAgreement;
      saveClientEntry.componentEntry.forEach(element => {
        if (element.effectiveDate !== null || element.effectiveDate !== undefined) {
          element.effectiveDate = this.datepipe.transform(element.effectiveDate, 'dd/MMM/yyyy HH:mm:ss');
        }
        if (element.subComponentEntry.length > 0) {
          element.subComponentEntry.forEach(ele => {
            if (ele.effectiveDate !== null || ele.effectiveDate !== undefined) {
              ele.effectiveDate = this.datepipe.transform(ele.effectiveDate, 'dd/MMM/yyyy HH:mm:ss');
            }
          });
        }
      });
      if (saveClientEntry.clientEntry.ClientCustomLoa) {
        saveClientEntry.clientEntry.ClientCustomLoa.clientId = saveClientEntry.clientEntry.clientId;
        saveClientEntry.clientEntry.ClientCustomLoa.clientName = saveClientEntry.clientEntry.clientName;
      }
      const formData = new FormData();
      formData.append('ClientEntry', JSON.stringify(saveClientEntry));
      if (saveClientEntry.clientEntry.clientLogo.length > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientEntry.clientLogo.length; i++) {
          formData.append(('ClientLogo_' + saveClientEntry.clientEntry.clientLogo[i].logoLookupId + '_' +
            saveClientEntry.clientEntry.clientLogo[i].signatureLookupId), saveClientEntry.clientEntry.clientLogo[i].document);
        }
      }
      if (saveClientEntry.clientAgreementDocument) {
        for (let i = 0; i < saveClientEntry.clientAgreementDocument.length; i++) {
          formData.append('AgreementDocument_' + i, saveClientEntry.clientAgreementDocument[i].document);
        }
      }
      if (saveClientEntry.clientEntry.ClientCustomLoa.customLoaDocument) {
        formData.append('CustomLoaDocument_', saveClientEntry.clientEntry.ClientCustomLoa.customLoaDocument.document);
      }
      if (saveClientEntry.clientFeeDocument) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientFeeDocument.length; i++) {
          if (saveClientEntry.clientFeeDocument[i].subComponentId) {
            formData.append('ApprovalFeeDocument' + '_Sub_' + saveClientEntry.clientFeeDocument[i].subComponentId,
              saveClientEntry.clientFeeDocument[i].document);
          } else {
            formData.append('ApprovalFeeDocument' + '_Comp_' + saveClientEntry.clientFeeDocument[i].componentId,
              saveClientEntry.clientFeeDocument[i].document);
          }
        }
      }
      if (saveClientEntry.clientTATDocument) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < saveClientEntry.clientTATDocument.length; i++) {
          if (saveClientEntry.clientTATDocument[i].subComponentId) {
            formData.append('ApprovalTATDocument' + '_Sub_' + saveClientEntry.clientTATDocument[i].subComponentId,
              saveClientEntry.clientTATDocument[i].document);
          } else {
            formData.append('ApprovalTATDocument' + '_Comp_' + saveClientEntry.clientTATDocument[i].componentId,
              saveClientEntry.clientTATDocument[i].document);
          }
        }
      }
      this.splitParts = [];
      //this.index1 = false; this.index2 = false; this.index3 = false; this.index4 = false;
      if (saveClientEntry.clientEntry.finalReportTitle) {
        this.splitParts = saveClientEntry.clientEntry.finalReportTitle.split('-');
        // if (this.splitParts.length > 0) {
        //  let index1 = this.splitParts.includes('[@@Case Reference number]');
        //  let index2 = this.splitParts.includes('[@@Candidate Name]');
        //   this.index3 = this.splitParts.includes('[@@Report Type]');
        //   this.index4 = this.splitParts.includes('[@@Colour Code]');
        //   this.index5 = this.splitParts.includes('[@@AppId]');
        // }
      }
      if (this.splitParts.length > 0 && (this.splitParts.includes('[@@Case Reference number]') || this.splitParts.includes('[@@Candidate Name]') || this.splitParts.includes('[@@Report Type]') || this.splitParts.includes('[@@Colour Code]') || this.splitParts.includes('[@@AppId]'))) {
        this.clientService.saveClientEntryDetails(formData).subscribe(res => {
          if (res) {
            this.clientService.showTopCenter('success', 'Success Message', (saveClientEntry.clientEntry.completeFlag === true ?
              'Updated Successfully' : 'Saved Successfully'));
            this.authService.cancelRuleClientId = res.value;
            if (res.message === 'Completed') {
              this.commonService.invoiceDtFlag = true;
              if (saveClientEntry.clientEntry.siteCreationFlag) {
                this.deleteDialog(res.value, 'Site', 'Client detail saved sucessfully. Do you want to create New Site?',
                  null, 'getSite', 'openCancellation');
              } else {
                this.openCancellation(0);
              }
            }
            this.breadcrumbFlags = this.commonService.breadcrumbFlags();
            this.getClientDetails();
          } else {
            // this.breadcrumbFlags.btnSaveDisabled = true;
            this.clientService.showTopCenter('warn', 'Failure Message', (saveClientEntry.clientEntry.completeFlag === true ?
              'Client is not updated' : 'Client is not saved'));
            this.breadcrumbFlags = this.commonService.breadcrumbFlags();
            this.getClientDetails();
          }
        }, err => {
          // this.breadcrumbFlags.btnSaveDisabled = true;
          this.clientService.showTopCenter('warn', 'Failure Message', (saveClientEntry.clientEntry.completeFlag === true ?
            'Client is not updated' : 'Client is not saved'));
          this.breadcrumbFlags = this.commonService.breadcrumbFlags();
          this.getClientDetails();
        }, () => {
        });
      } else {
        this.clientService.showTopCenter('warn', 'Alert Message', 'Please Update Correct Pdf Report Title Template');
      }
    } else {
      this.clientService.showTopCenter('warn', 'Failure Message', 'Client Component Tat Days should be less than or equal to Client TAT');
    }
  }
  openCancellation(ind: any) {
    this.deleteDialog(ind, 'Client Cancellation Rule', 'Client detail saved successfully. Do you want to add a client cancellation rule?',
      null, 'getCancellationRule', null);
  }
  getCancellationRule(ind: any) {
    this.router.navigate(['dashboard/client/cancellation-rule']);
  }
  getSite(clientId: any) {
    this.authService.clientId = clientId;
    this.authService.siteId = 0;
    this.router.navigate(['dashboard/client/siteentry']);
  }
  closeClientForm() {
    this.breadcrumbFlags = this.commonService.breadcrumbFlags(true);
    this.getClientDetails();
  }
  resetClientForm() {
    if (this.clientEntryForm.value.clientEntry.clientId > 0) {
      this.initClientEntryFormGroup();
      this.editClientEntry(this.commonService.tempResetData);
    } else {
      this.stepper === 0 ? this.clientEntryForm.controls.clientEntry = this.initClientForm() :
        this.stepper === 1 ? this.clientEntryForm.get('componentEntry')?.setValue([]) :
          this.stepper === 2 ? this.clientEntryForm.controls.clientAgreement = this.initAgreementForm() :
            this.stepper === 3 ? this.clientEntryForm.get('clientInstruction')?.setValue([]) :
              this.stepper === 4 ? this.clientEntryForm.get('clientEmailConfig')?.setValue([]) :
                this.stepper === 2 ? this.clientEntryForm.get('clientAgreement')?.setValue([]) : this.stepper = this.stepper;
    }
  }
  resetClientTable() {
    this.tableData.reset();
    this.global.nativeElement.value = '';
    this.TblAutoFilters();
  }
  deleteForm(data: any) {
    this.clientService.DeleteClientDetails(data, this.userData.userId).subscribe(res => {
      if (res.success) {
        this.clientService.showTopCenter('warn', 'Failure Message', 'Deleted Successfully');
        this.getClientDetails();
      }
    });
  }
  componentsCheck(type, list) {
    if (type === false) {
      const val = this.commonService.CloneObject(list);
      list.forEach((element, i) => {
        if (element.isSubComponent === true) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < element.subComponentEntry.length; j++) {
            const obj = this.commonService.CloneObject(val[i]);
            obj.effectiveDate = element.subComponentEntry[j].effectiveDate;
            obj.currencyId = element.subComponentEntry[j].currencyId;
            obj.fees = element.subComponentEntry[j].fees;
            obj.tat = element.subComponentEntry[j].tat;
            obj.interimReportFlag = element.subComponentEntry[j].interimReportFlag;
            // VTS2 - 2023 - INT - 0135 - WorkFlow changes based on check box - added by Naveen
            obj.enableAutoIqc = element.subComponentEntry[j].enableAutoIqc;
            obj.enableAutoFqc = element.subComponentEntry[j].enableAutoFqc;
            obj.daCompValidationFlag = element.subComponentEntry[j].daCompValidationFlag;
            obj.isAdditionalPos = element.subComponentEntry[j].isAdditionalPos;
            obj.subComponentEntry = [];
            obj.subComponentEntry.push(element.subComponentEntry[j]);

            this.clientEntryForm.value.componentEntry.push(obj);
          }
        } else {
          const obj = val[i];
          obj.subComponentEntry = [];
          this.clientEntryForm.value.componentEntry.push(obj);
        }
      });
    }
    if (type === true) {
      const dupvalues: number[] = [];
      this.clientEntryForm.value.componentEntry.forEach(e => {
        if (!dupvalues.includes(e.componentId)) {
          if (this.clientEntryForm.value.componentEntry.filter(el => el.componentId === e.componentId).length > 1) {
            const copydata = this.clientEntryForm.value.componentEntry.filter(r => r.componentId === e.componentId);
            this.clientEntryForm.value.componentEntry = this.clientEntryForm.value.componentEntry.
              filter(del => del.componentId !== e.componentId);
            let copydata1;
            copydata.forEach((data, index) => {
              if (index === 0) {
                copydata1 = data;
              } else {
                copydata1.subComponentEntry.push(data.subComponentEntry[0]);
              }
            });
            copydata1.clientFeesApproval = null;
            this.clientEntryForm.value.componentEntry.push(copydata1);
          }
        }
        dupvalues.push(e.componentId);
      });
    }
    this.clientEntryForm.get('componentEntry')?.setValue(this.clientEntryForm.value.componentEntry);
  }
  editForm(completeFlag, clientId, type) {
    this.addClientForm(completeFlag, clientId);
    this.commonService.tempResetData = null;
    this.insuffClient = clientId;

    // this.clientEntryForm.controls.clientEntry.get('clientName')?.disable();
    this.clientService.GetClientDetails(clientId, this.userData.userId).subscribe(res => {
      if (res) {

        this.editClientEntry(res);
        this.clientScreen?.checkSite(res.clientEntry.siteCreationFlag);
        this.clientScreen?.onTypeChange(res.clientEntry.indianClientFlag);
        this.clientScreen?.formatChange(res.clientEntry.formatFlag);
      }
    });
    if (type === 'view') {
      this.type = type;
      this.breadcrumbFlags.btnSave = false;
      this.breadcrumbFlags.btnReset = false;
    }
  }
  initcancelDVm(cancelDt: any): UntypedFormArray {

    const arr = this.fb.array([]);
    for (let i = 0; i < cancelDt.length; i++) {
      arr.push(new UntypedFormGroup({
        cancelRuleId: new UntypedFormControl(cancelDt[i].cancelRuleId),
        clientId: new UntypedFormControl(cancelDt[i].clientId, Validators.required),
        fromLookupId: new UntypedFormControl(cancelDt[i].fromLookupId, Validators.required),
        toLookupId: new UntypedFormControl(cancelDt[i].toLookupId, Validators.required),
        fromHours: new UntypedFormControl(cancelDt[i].fromHours, [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        toHours: new UntypedFormControl(cancelDt[i].toHours, [Validators.required, Validators.pattern(/^[1-9]\d{0,2}(?:\,\d{1,3})?$/)]),
        percentage: new UntypedFormControl(cancelDt[i].percentage, [Validators.required, Validators.pattern(/^[0-9]$|^[1-9][0-9]$|^(100)$/)]),
        active: new UntypedFormControl(true),
        description: new UntypedFormControl(''),
        loggedId: new UntypedFormControl(this.userData.userId)
      }));
    }
    return arr;

  }
  editClientEntry(res: any) {
    this.commonService.tempResetData = this.commonService.CloneObject(res);
    res.clientLogo.forEach(logo => {
      this.clientService.GetDocByFilePath(logo.filePath).subscribe(docByte => {
        logo.document = docByte;
      });
    });
    if (res.clientEntry.billingTypeLookupDesc == 'Site') {
      this.commonService.invoiceDtFlag = false;
    } else {
      this.commonService.invoiceDtFlag = true;
    }
    const cliDetails = this.clientEntryForm.get('clientEntry') as UntypedFormGroup;
    const cancelDetails = cliDetails.get('cancelDetails') as UntypedFormGroup;
    if (res.clientEntry.cancelDetails != null && res.clientEntry.cancelDetails.length > 0) {
      cliDetails.removeControl("cancelDetails")
      cliDetails.addControl("cancelDetails", this.initcancelDVm(res.clientEntry.cancelDetails))

    }
    this.clientEntryForm.patchValue({
      clientAgreementDocument: res.clientAgreementDocument,
      clientInstruction: res.clientInstruction,
      clientEmailConfig: res.clientEmailConfig,
      insufficiencyWorkFlowMappingVm: res.insufficiencyWorkFlowMappingVm,
    });
    this.componentsCheck(false, res.componentEntry);
    this.clientEntryForm.get('clientEntry')?.patchValue({
      active: res.clientEntry.active,
      address: res.clientEntry.address,
      // clientSettings:res.clientEntry.clientSettings,
      // annexureLinkFlag: res.clientEntry.annexureLinkFlag,
      applicantIdColumnName: res.clientEntry.applicantIdColumnName,
      // approvalLimitFlag: res.clientEntry.approvalLimitFlag,
      bcId: res.clientEntry.bcId,
      billingTypeId: res.clientEntry.billingTypeId,
      billingTypeLookupDesc: res.clientEntry.billingTypeLookupDesc,
      enableLutFlag: res.clientEntry.enableLutFlag,
      invoiceTitleLookupId: res.clientEntry.invoiceTitleLookupId > 0 ? res.clientEntry.invoiceTitleLookupId : 0,
      // calendarDaysTATFlag: res.clientEntry.calendarDaysTATFlag,
      // caseCountryFlag: res.clientEntry.caseCountryFlag,
      // caseTypeFlag: res.clientEntry.caseTypeFlag,
      // caseByPassFlag: res.clientEntry.caseByPassFlag,
      // scopeByPassFlag: res.clientEntry.scopeByPassFlag,
      // iqcByPassFlag: res.clientEntry.iqcByPassFlag,
      // reOpenTATFlag: res.clientEntry.reOpenTATFlag,
      // forResearchByPassFlag: res.clientEntry.forResearchByPassFlag,
      caseCreationFlag: res.clientEntry.caseCreationFlag,
      // caseDatesFlag: res.clientEntry.caseDatesFlag,
      cgstin: res.clientEntry.cgstin,
      // chargeCodeFlag: res.clientEntry.chargeCodeFlag,
      clientAccountManagerId: res.clientEntry.clientAccountManagerId,
      clientColorStatus: res.clientColorStatus,
      insufficiencyTypeId: res.insufficiencyTypeId,
      // 6666 :res.compName,
      //insufficiency : res.clientEntry.insufficiency,
      clientContact: res.clientEntry.clientContact,
      clientId: res.clientEntry.clientId,
      clientLogo: res.clientLogo,
      clientStatus: res.clientEntry.clientStatus,
      clientName: res.clientEntry.clientName,
      completeFlag: res.clientEntry.completeFlag,
      contactPerson: res.clientEntry.contactPerson,
      companyId: res.clientEntry.companyId,
      salesPerson: res.clientEntry.salesPerson,
      // contactRemarkFlag: res.clientEntry.contactRemarkFlag,
      dataRetentionPolicyDays: res.clientEntry.dataRetentionPolicyDays,
      // displaySiteNameFlag: res.clientEntry.displaySiteNameFlag,
      finalReportTypeId: res.clientEntry.finalReportTypeId,
      formatFlag: res.clientEntry.formatFlag,
      finalReportTitle: res.clientEntry.finalReportTitle,
      indianClientFlag: res.clientEntry.indianClientFlag,
      // optionToCreateInvitation: res.clientEntry.optionToCreateInvitation,
      ownerContact: res.clientEntry.ownerContact,
      pan: res.clientEntry.pan,
      // paymentFlag: res.clientEntry.paymentFlag,
      refNo: res.clientEntry.refNo,
      previousRefNo: res.clientEntry.previousRefNo,
      previousDirectRefNo: res.clientEntry.previousDirectRefNo,
      // refNoManuallyFlag: res.clientEntry.refNoManuallyFlag,
      // Added By Megala - For VTS2-2024-CRT-0217
      pdfHyperLinkFlag: res.clientEntry.pdfHyperLinkFlag,
      ruleId: res.clientEntry.ruleId,
      tatCount: res.clientEntry.tatCount,
      ceHoldTAT: res.clientEntry.ceHoldTAT,
      serviceTaxFlag: res.clientEntry.serviceTaxFlag,
      serviceTaxNo: res.clientEntry.serviceTaxNo,
      siteCreationFlag: res.clientEntry.siteCreationFlag,
      // clientUpdateFlag: res.clientEntry.clientUpdateFlag,
      // clientNotificationFlag: res.clientEntry.clientNotificationFlag,
      // downloadBGVFlag: res.clientEntry.downloadBgvflag,
      // downloadDocumentFlag: res.clientEntry.downloadDocumentFlag,
      // defaultFlag: res.clientEntry.defaultFlag,
      // clientScreeningIdFlag: res.clientEntry.clientScreeningIdFlag,
      // daValidationFlag: res.clientEntry.daValidationFlag,
      // manualGenerationFlag: res.clientEntry.manualGenerationFlag,
      // interimReportFlag: res.clientEntry.interimReportFlag,
      // directAppAddressFlag: res.clientEntry.directAppAddressFlag,
      // ctsFlag:res.clientEntry.ctsFlag,
      pdfReportNameChangeFlag: res.clientEntry.pdfReportNameChangeFlag,
      deReopenFlag: res.clientEntry.deReopenFlag,
      // tATCrossInsuffAutomationFlag: res.clientEntry.tatCrossInsuffAutomationFlag,
      // removeEducationCategoryFlag: res.clientEntry.removeEducationCategoryFlag,
      // removeInstitutionTypeFlag: res.clientEntry.removeInstitutionTypeFlag,
      // cinFlag: res.clientEntry.cinFlag,
      // rocCodeFlag: res.clientEntry.rocCodeFlag,
      // incoporateDateFlag: res.clientEntry.incoporateDateFlag,
      // ssnFlag: res.clientEntry.ssnFlag,
      // removeContactDetailsFlag: res.clientEntry.removeContactDetailsFlag,
      // onlineVerificationJcrflag: res.clientEntry.onlineVerificationJcrflag,
      // enbMultiJcrFlag: res.clientEntry.enbMultiJcrFlag,
      // showClientSuspectFlag: res.clientEntry.showClientSuspectFlag,
      // iQCApprovedDateInFLTFlag: res.clientEntry.iqcApprovedDateInFLTFlag,
    });

    if (res.clientEntry.clientCustomLoa) {
      const clientCustomLoaGroup = this.clientEntryForm.get('clientEntry.ClientCustomLoa') as UntypedFormGroup;

      if (clientCustomLoaGroup) {
        clientCustomLoaGroup.patchValue({
          clientId: res.clientEntry.clientCustomLoa.clientId,
          clientName: res.clientEntry.clientCustomLoa.clientName,
          hasCustomLoa: res.clientEntry.clientCustomLoa.hasCustomLoa,
          createdUserId: res.clientEntry.clientCustomLoa.createdUserId,
          docTypeLookupId: res.clientEntry.clientCustomLoa.docTypeLookupId,
          docTypeLookupName: res.clientEntry.clientCustomLoa.docTypeLookupName,
          fileName: res.clientEntry.clientCustomLoa.fileName,
        });
      }
      if (res.clientEntry.clientCustomLoa.customLoaDocument) {
        const customLoaDocumentGroup = clientCustomLoaGroup.get('customLoaDocument') as UntypedFormGroup;

        if (customLoaDocumentGroup) {
          customLoaDocumentGroup.patchValue({
            clientLoaId: res.clientEntry.clientCustomLoa.customLoaDocument.clientLoaId,
            customLoaDocId: res.clientEntry.clientCustomLoa.customLoaDocument.customLoaDocId,
            documentTypeId: res.clientEntry.clientCustomLoa.customLoaDocument.documentTypeId,
            document: res.clientEntry.clientCustomLoa.customLoaDocument.document,
            fileName: res.clientEntry.clientCustomLoa.customLoaDocument.fileName,
            filePath: res.clientEntry.clientCustomLoa.customLoaDocument.filePath,
            fileType: res.clientEntry.clientCustomLoa.customLoaDocument.fileType,
          });
        }
      }
    }
    if (res.clientAgreement) {
      this.clientEntryForm.get('clientAgreement')?.patchValue({
        agreementApprovalFlag: res.clientAgreement.agreementApprovalFlag,
        agreementAvailabilityFlag: res.clientAgreement.agreementAvailabilityFlag,
        approvalStatus: res.clientAgreement.agreementApprovalFlag === true ? 'Approved' : 'Pending',
        autoRenewal: res.clientAgreement.autoRenewal,
        autoRenewalPeriod: res.clientAgreement.autoRenewalPeriod,
        dateOfAgreement: res.clientAgreement.dateOfAgreement,
        dateOfExpiry: res.clientAgreement.dateOfExpiry,
        reasonofNonAvailability: res.clientAgreement.reasonofNonAvailability,
        remarks: res.clientAgreement.remarks,
        reminder: res.clientAgreement.reminder,
        typeOfAgreement: res.clientAgreement.typeOfAgreement,
        validity: res.clientAgreement.validity,
      });
    }
    this.address = new BehaviorSubject(res.clientEntry.address);
    if (res.clientEntry.address.countryId) {
      this.clientEntryForm.controls.clientEntry.get('codeId')?.setValue(res.clientEntry.address.countryId);
    }
    this.address.next(res.clientEntry.address);
    this.clientColor();
  }
  createClientSettings(res: any) {
    let array = this.clientEntryForm.get('clientEntry.clientSettings') as UntypedFormArray;
    res.forEach(resp => {
      array.push(new UntypedFormGroup({
        clientId: new UntypedFormControl(resp.clientId),
        clientSettingId: new UntypedFormControl(resp.clientSettingId),
        configLookupId: new UntypedFormControl(resp.configLookupId),
        // createdDate: new UntypedFormControl(resp.createdDate),
        // createdUserId: new UntypedFormControl(resp.createdUserId),
        // displayOrder: new UntypedFormControl(resp.displayOrder),
        isActive: new UntypedFormControl(resp.isActive),
        // isDelete: new UntypedFormControl(resp.isDelete),
        lookUpName: new UntypedFormControl(resp.lookUpName),
      }))
    })

    return array
  }
  clientColor() {
    const val = this.clientEntryForm.controls.clientEntry.value.clientColorStatus;
    if (val && val.length > 0) {
      // tslint:disable-next-line: prefer-const
      let compList: any[] = [];
      val.forEach(ele => {
        const dataList = this.clientBindData.colorStatus.find(x => x.lookUpId === ele.lookUpId);
        if (dataList) {
          dataList.contactId = ele.contactId;
          compList.push(dataList);
        }
      });
      this.clientEntryForm.controls.clientEntry.get('clientColorStatus')?.setValue(compList);
    }
  }
  // common dialog
  public deleteDialog(data, hText, bText, method1, method2, methodNo) {
    const popupData = {
      action: this.commonService.DELETECONFIRMATION,
      headerText: hText,
      bodyText: bText
    };
    const dialogRef = this.dialog.open(CommonAlertsComponent, {
      width: '400px',
      data: popupData,
      disableClose: true
    });
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const action = String(result.type);
          if (action === this.commonService.DELETECONFIRMATION) {
            if (method1 === null) {
              this[method2](data);
            } else {
              this[method1][method2](data);
            }
          }
        } else if (result === undefined && methodNo !== null) {
          this[methodNo](data);
        }
      });
    }
  }
  // paginator
  getTotalPages(totalRecords, rows) {
    //this.totalpages = Math.ceil((totalRecords) / rows);
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
      this.tableData.onPageChange({ first: ((pageNo - 1) * rowscount), rows: rowscount });
      this.tempCurrentPage = this.currentPage;
    }
  }
  // pdf pwd
  openPWDialog(data: any) {
    this.sendCrtFlag.setValue(true);
    //this.pwdFlag = true;
    this.passwordData = data;
    this.dialog.open(this.PDFPasswordDialog,
      {
        width: '400px',
        disableClose: true
      });
    this.hide = true;
    this.hide1 = true;
    this.hide2 = true;
    this.hide3 = true;

    this.paswordFormGrp.get('passwordCtrl')?.clearValidators();
    this.paswordFormGrp.get('passwordCtrl')?.updateValueAndValidity();
    this.finalToggFlag = false;
    this.induvidualToggFlag = false;
    this.intermToggFlag = false;
    this.supplementToggFlag = false;
  }
  getPassword(data: any) {
    this.clientId = data;
    this.paswordFormGrp.get('finalPassword')?.setValue('')
    this.paswordFormGrp.get('individualPassword')?.setValue('')
    this.paswordFormGrp.get('interimPassword')?.setValue('')
    this.paswordFormGrp.get('supplementaryPassword')?.setValue('')
    this.clientService.getPassword(data).subscribe(resp => {
      if (resp) {
        setTimeout(() => {
          this.hide = true;
          this.hide1 = true;
          this.hide2 = true;
          this.hide3 = true;
          this.tableData.reset();
          this.global.nativeElement.value = '';
          this.global.nativeElement.type = '';
          // const clientPassword = resp;
          this.sendCrtFlag.setValue(resp.sendCrtFlag);
          this.passwords.IsFinalRptPwEnable = resp.isFinalRptPwEnable;
          this.paswordFormGrp.get('finalPassword')?.setValue(resp.finalReportPassword);
          this.paswordFormGrp.get('individualPassword')?.setValue(resp.individualReportPassword);
          this.passwords.IsIndividualRptPwEnable = resp.isIndividualRptPwEnable;
          this.paswordFormGrp.get('interimPassword')?.setValue(resp.interimReportPassword);
          this.passwords.IsInterimRptPwEnable = resp.isInterimRptPwEnable;
          this.paswordFormGrp.get('supplementaryPassword')?.setValue(resp.supplementaryReportPassword);
          this.passwords.IsSuplementaryRptPwEnable = resp.isSuplementaryRptPwEnable;

          if (this.passwords.IsFinalRptPwEnable) {
            this.paswordFormGrp.get('finalPassword')?.enable();
            this.isChecked1 = true;
            this.toggleLabel = 'ON'
          } else {
            this.paswordFormGrp.get('finalPassword')?.disable();
            this.isChecked1 = false;
            this.toggleLabel = 'OFF'
          }
          if (this.passwords.IsIndividualRptPwEnable) {
            this.paswordFormGrp.get('individualPassword')?.enable();
            this.isChecked3 = true;
            this.toggleLabe3 = 'ON'
          } else {
            this.paswordFormGrp.get('individualPassword')?.disable();
            this.isChecked3 = false;
            this.toggleLabe3 = 'OFF'
          }
          if (this.passwords.IsSuplementaryRptPwEnable) {
            this.paswordFormGrp.get('supplementaryPassword')?.enable();
            this.isChecked4 = true;
            this.toggleLabe4 = 'ON'
          } else {
            this.paswordFormGrp.get('supplementaryPassword')?.disable();
            this.isChecked4 = false;
            this.toggleLabe4 = 'OFF'
          }
          if (this.passwords.IsInterimRptPwEnable) {
            this.paswordFormGrp.get('interimPassword')?.enable();
            this.isChecked2 = true;
            this.toggleLabe2 = 'ON'
          } else {
            this.paswordFormGrp.get('interimPassword')?.disable();
            this.isChecked2 = false;
            this.toggleLabe2 = 'OFF'
          }

          if (resp.finalReportPassword == "") {
            this.hide = false;
          }

          // this.sendCrtFlag.setValue(resp.sendCrtFlag);
          // if (clientPassword !== '' || clientPassword !== null) {
          //   this.passwordCtrl.setValue(clientPassword);
          //   this.sendCrtFlag.enable();
          //   this.sendCrtFlag.setValue(true);
          // } else {
          //   this.passwordCtrl.setValue('');
          //   this.sendCrtFlag.disable();
          //   this.sendCrtFlag.setValue(false);
          // }
        });
      }
      // else {
      //   this.passwordCtrl.setValue('');
      //   this.sendCrtFlag.disable();
      //   this.sendCrtFlag.setValue(false);
      // }
    });
  }
  savePassword() {
    if (this.paswordFormGrp.valid) {
      this.passwords.finalReportPassword = this.paswordFormGrp.get('finalPassword')?.value;
      this.passwords.IsFinalRptPwEnable = this.isChecked1;
      this.passwords.FinalFlag = this.finalToggFlag;
      this.passwords.interimReportPassword = this.paswordFormGrp.get('interimPassword')?.value;
      this.passwords.IsInterimRptPwEnable = this.isChecked2;
      this.passwords.InterimFlag = this.intermToggFlag;
      this.passwords.individualReportPassword = this.paswordFormGrp.get('individualPassword')?.value;
      this.passwords.IsIndividualRptPwEnable = this.isChecked3;
      this.passwords.IndiduvalFalg = this.induvidualToggFlag;
      this.passwords.supplementaryReportPassword = this.paswordFormGrp.get('supplementaryPassword')?.value;
      this.passwords.IsSuplementaryRptPwEnable = this.isChecked4;
      this.passwords.SuppFlag = this.supplementToggFlag;
      this.passwords.clientId = this.passwordData.clientId;
      this.passwords.sendCrtFlag = this.sendCrtFlag.value
      this.passwords.loggedIn = this.userData.userId;
      this.clientService.savePassword(this.passwords).subscribe(resp => {
        if (resp) {
          if (this.sendCrtFlag.value !== true) {
            this.clientService.showTopCenter('success', 'Success Message', 'Saved Successfully');
          } else {
            this.clientService.showTopCenter('success', 'Success Message', 'Updated Successfully');
          }
        }
        // if (resp.Success) {
        //   this.clientService.showTopCenter('success', 'Success Message', 'Saved Successfully');
        // } else {
        //   this.clientService.showTopCenter('failure', 'Success Message', 'Not Updated');
        // }



      });
      // this.passwords.clearValidators();
      // this.passwords.updateValueAndValidity();
      this.dialog.closeAll();
      // } else {
      // this.passwords.setValidators(Validators.required);
      // this.passwords.updateValueAndValidity();
      // }
    } else {
      this.paswordFormGrp.markAllAsTouched();
    }
  }
  showall() {
    this.accessClientlist.applyPaging = false;
    this.clientService.getClientDetails(this.accessClientlist).subscribe(res => {
      if (res) {
        this.clientGridList = res.body;
        this.totalpages = res.headers.get('X-Total-Count');
        this.clientGridList.forEach(element => {
          element.firstName = element.firstName ? (element.firstName + (element.middleName ? (' ' + element.middleName) : '') +
            (element.lastName ? (' ' + element.lastName) : '')) : 'N/A';
        });
        this.currentPage = 1;
        this.TblAutoFilters();
      }
    });
  }

  toggleSlideToggle1(): void {

    this.finalToggFlag = true
    this.isChecked1 = !this.isChecked1;
    this.toggleLabel = this.isChecked1 ? 'ON' : 'OFF';
    if (!this.isChecked1) {
      this.paswordFormGrp.get('finalPassword')?.clearValidators();
      this.paswordFormGrp.get('finalPassword')?.updateValueAndValidity();
      this.paswordFormGrp.get('finalPassword')?.disable();
    } else {
      this.paswordFormGrp.get('finalPassword')?.enable();
      this.paswordFormGrp.get('finalPassword')?.setValidators(Validators.required);
      this.paswordFormGrp.get('finalPassword')?.updateValueAndValidity();
    }

  }
  toggleSlideToggle2(): void {
    this.intermToggFlag = true
    this.isChecked2 = !this.isChecked2;
    this.toggleLabe2 = this.isChecked2 ? 'ON' : 'OFF';
    if (!this.isChecked2) {
      this.paswordFormGrp.get('interimPassword')?.clearValidators();
      this.paswordFormGrp.get('interimPassword')?.updateValueAndValidity();
      this.paswordFormGrp.get('interimPassword')?.disable();

    } else {
      this.paswordFormGrp.get('interimPassword')?.enable();
      this.paswordFormGrp.get('interimPassword')?.setValidators(Validators.required);
      this.paswordFormGrp.get('interimPassword')?.updateValueAndValidity();
    }
  }

  toggleSlideToggle3(): void {
    this.induvidualToggFlag = true
    this.isChecked3 = !this.isChecked3;
    this.toggleLabe3 = this.isChecked3 ? 'ON' : 'OFF';
    if (!this.isChecked3) {
      this.paswordFormGrp.get('individualPassword')?.clearValidators();
      this.paswordFormGrp.get('individualPassword')?.updateValueAndValidity();
      this.paswordFormGrp.get('individualPassword')?.disable();

    } else {
      this.paswordFormGrp.get('individualPassword')?.enable();
      this.paswordFormGrp.get('individualPassword')?.setValidators(Validators.required);
      this.paswordFormGrp.get('individualPassword')?.updateValueAndValidity();
    }
  }
  toggleSlideToggle4(): void {
    this.supplementToggFlag = true
    this.isChecked4 = !this.isChecked4;
    this.toggleLabe4 = this.isChecked4 ? 'ON' : 'OFF';
    if (!this.isChecked4) {
      this.paswordFormGrp.get('supplementaryPassword')?.clearValidators();
      this.paswordFormGrp.get('supplementaryPassword')?.updateValueAndValidity();
      this.paswordFormGrp.get('supplementaryPassword')?.disable();

    } else {
      this.paswordFormGrp.get('supplementaryPassword')?.enable();
      this.paswordFormGrp.get('supplementaryPassword')?.setValidators(Validators.required);
      this.paswordFormGrp.get('supplementaryPassword')?.updateValueAndValidity();
    }
  }

  OpenPasswordHistoryDetails(clientId, reportTypeId) {

    this.clientService.GetClientPassWordHistoryDetails(clientId, reportTypeId).subscribe(resp => {
      if (resp) {
        this.clientRptPasswordDetails = resp;
      }
    });
    this.dialogref = this.dialog.open(this.passwordHistoryDetails,
      { width: '800px', disableClose: true, });
  }
  ClosePwHistoryDetails() {
    this.dialog.closeAll();
    this.passwordHistoryDetails;
  }
  closeDialog(): void {
    this.dialogref.close();
  }


  getHeader(text: string): SafeHtml {
    const parts = text.split(/\s+Created|\s+Changed/);
    this.firstPart = parts[0].trim();
    this.secondPart = (parts[1] || '').trim();

    let removedWord = text.match(/\s+(Created|Changed)/);
    let removedText = removedWord ? removedWord[0].trim() : '';

    let htmlContent = `${this.firstPart} ${removedText} <b>${this.secondPart}</b>`;

    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    return this.safeHtml;
  }

}

